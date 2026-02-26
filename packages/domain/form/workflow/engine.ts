/**
 * Workflow Engine — @formanywhere/domain
 *
 * Pure runtime executor for visual workflows.
 * Traverses the node graph, executing actions at each step.
 * Has NO side effects — API calls are delegated via an injected `apiCaller`.
 */
import type {
    FormWorkflow,
    WorkflowNode,
    WorkflowEdge,
    WorkflowNodeConfig,
    WorkflowApiConfig,
    NodeExecutionResult,
    WorkflowExecutionResult,
    DataMappingEntry,
    EdgeSourcePort,
    TriggerType,
    WorkflowValidationIssue,
    WorkflowValidationResult,
} from './types';

// ─── Template Interpolation ──────────────────────────────────────────────────

/**
 * Replace `{{fieldId}}` placeholders in a template string with actual values.
 *
 * @example
 * interpolate('Hello {{name}}, you are {{age}}', { name: 'John', age: '30' })
 * // → 'Hello John, you are 30'
 */
export function interpolate(
    template: string,
    values: Record<string, unknown>,
): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
        const val = values[key];
        return val !== undefined && val !== null ? String(val) : '';
    });
}

// ─── Graph Helpers ───────────────────────────────────────────────────────────

/** Find the starting nodes (nodes with no incoming edges). */
export function findStartNodes(workflow: FormWorkflow): WorkflowNode[] {
    const targetIds = new Set(workflow.edges.map((e) => e.targetNodeId));
    return workflow.nodes.filter((n) => !targetIds.has(n.id));
}

/** Get next nodes following a given node via its edges. */
export function resolveNextNodes(
    nodeId: string,
    edges: WorkflowEdge[],
    nodes: WorkflowNode[],
    port?: EdgeSourcePort,
): WorkflowNode[] {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return edges
        .filter((e) => e.sourceNodeId === nodeId && (port === undefined || e.sourcePort === port))
        .map((e) => nodeMap.get(e.targetNodeId))
        .filter((n): n is WorkflowNode => !!n);
}

// ─── API Caller Interface ────────────────────────────────────────────────────

/**
 * Injected API caller — allows the runtime to control how API calls are made.
 * In the browser, this goes through the backend proxy.
 * In tests, this can be mocked.
 */
export type ApiCaller = (
    api: WorkflowApiConfig,
    values: Record<string, unknown>,
) => Promise<unknown>;

// ─── Data Extraction ─────────────────────────────────────────────────────────

/**
 * Extract a value from a nested object using dot-notation path.
 *
 * @example
 * extractPath({ data: { users: [{ name: 'John' }] } }, 'data.users')
 * // → [{ name: 'John' }]
 */
export function extractPath(obj: unknown, path: string): unknown {
    if (!path || path === '$') return obj;

    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;

        // Handle array index notation like "users[0]"
        const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
            const [, key, index] = arrayMatch;
            current = (current as Record<string, unknown>)[key];
            if (Array.isArray(current)) {
                current = current[Number(index)];
            } else {
                return undefined;
            }
        } else {
            current = (current as Record<string, unknown>)[part];
        }
    }

    return current;
}

/**
 * Apply data mappings: extract values from API response → target field values.
 */
export function applyDataMapping(
    response: unknown,
    mappings: DataMappingEntry[],
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const mapping of mappings) {
        result[mapping.to] = extractPath(response, mapping.from);
    }
    return result;
}

/**
 * Extract options from an API response for fetchOptions nodes.
 */
export function extractOptions(
    response: unknown,
    config: WorkflowNodeConfig,
): Array<{ label: string; value: string }> {
    const { responsePath, labelKey = 'label', valueKey = 'value' } = config;

    let items = responsePath ? extractPath(response, responsePath) : response;

    if (!Array.isArray(items)) {
        // Try wrapping in array if it's a single object
        if (items && typeof items === 'object') items = [items];
        else return [];
    }

    return (items as Record<string, unknown>[]).map((item) => ({
        label: String(item[labelKey] ?? ''),
        value: String(item[valueKey] ?? ''),
    }));
}

// ─── Condition Evaluator ─────────────────────────────────────────────────────

/** Evaluate a condition node and return 'true' or 'false' branch. */
export function evaluateConditionNode(
    config: WorkflowNodeConfig,
    values: Record<string, unknown>,
): 'true' | 'false' {
    const { conditionField, conditionOperator, conditionValue } = config;
    if (!conditionField || !conditionOperator) return 'true';

    const actual = values[conditionField];
    const expected = conditionValue ?? '';

    switch (conditionOperator) {
        case 'equals':
            return String(actual) === String(expected) ? 'true' : 'false';
        case 'notEquals':
            return String(actual) !== String(expected) ? 'true' : 'false';
        case 'contains':
            return String(actual ?? '').toLowerCase().includes(String(expected).toLowerCase()) ? 'true' : 'false';
        case 'greaterThan':
            return Number(actual) > Number(expected) ? 'true' : 'false';
        case 'lessThan':
            return Number(actual) < Number(expected) ? 'true' : 'false';
        case 'isEmpty':
            return (actual === undefined || actual === null || actual === '') ? 'true' : 'false';
        case 'isNotEmpty':
            return (actual !== undefined && actual !== null && actual !== '') ? 'true' : 'false';
        default:
            return 'true';
    }
}

// ─── Main Executor ───────────────────────────────────────────────────────────

/**
 * Execute a workflow by traversing its node graph.
 *
 * Starts from root nodes (no incoming edges) and follows edges.
 * API calls are delegated to the injected `apiCaller`.
 * Returns aggregated results: field updates, option updates, redirects, dialogs.
 */
export async function executeWorkflow(
    workflow: FormWorkflow,
    values: Record<string, unknown>,
    apiCaller: ApiCaller,
): Promise<WorkflowExecutionResult> {
    if (!workflow.enabled) {
        return {
            workflowId: workflow.id,
            results: [],
            fieldUpdates: {},
            optionUpdates: {},
        };
    }

    const results: NodeExecutionResult[] = [];
    const fieldUpdates: Record<string, unknown> = {};
    const optionUpdates: Record<string, Array<{ label: string; value: string }>> = {};
    let redirectUrl: string | undefined;
    let redirectNewTab: boolean | undefined;
    let dialog: { title: string; message: string } | undefined;

    // Track visited nodes to prevent cycles
    const visited = new Set<string>();

    // Last API response for chaining (e.g. callApi → setData)
    let lastApiResponse: unknown = undefined;

    /** Process a single node and recursively process its successors. */
    async function processNode(node: WorkflowNode): Promise<void> {
        if (visited.has(node.id)) return;
        visited.add(node.id);

        const result: NodeExecutionResult = {
            nodeId: node.id,
            type: node.type,
            status: 'success',
        };

        try {
            switch (node.type) {
                case 'trigger': {
                    // Trigger nodes are informational — pass through to downstream
                    break;
                }

                case 'page': {
                    // Page nodes are informational — pass through
                    break;
                }

                case 'callApi': {
                    if (node.config.api) {
                        lastApiResponse = await apiCaller(node.config.api, values);
                        result.data = lastApiResponse;
                    }
                    break;
                }

                case 'fetchOptions': {
                    if (node.config.api) {
                        const response = await apiCaller(node.config.api, values);
                        const options = extractOptions(response, node.config);
                        if (node.config.targetFieldId) {
                            optionUpdates[node.config.targetFieldId] = options;
                        }
                        result.data = options;
                        lastApiResponse = response;
                    }
                    break;
                }

                case 'setData': {
                    if (node.config.dataMapping && lastApiResponse !== undefined) {
                        const mapped = applyDataMapping(lastApiResponse, node.config.dataMapping);
                        Object.assign(fieldUpdates, mapped);
                        result.data = mapped;
                    }
                    break;
                }

                case 'showDialog': {
                    dialog = {
                        title: node.config.dialogTitle
                            ? interpolate(node.config.dialogTitle, values)
                            : 'Info',
                        message: node.config.dialogMessage
                            ? interpolate(node.config.dialogMessage, values)
                            : '',
                    };
                    break;
                }

                case 'redirect': {
                    if (node.config.redirectUrl) {
                        redirectUrl = interpolate(node.config.redirectUrl, values);
                        redirectNewTab = node.config.redirectNewTab;
                    }
                    break;
                }

                case 'condition': {
                    const branch = evaluateConditionNode(node.config, values);
                    result.branch = branch;
                    // Follow the correct branch
                    const nextNodes = resolveNextNodes(node.id, workflow.edges, workflow.nodes, branch);
                    for (const next of nextNodes) {
                        await processNode(next);
                    }
                    results.push(result);
                    return; // Don't follow default edges
                }
            }
        } catch (err) {
            result.status = 'error';
            result.error = err instanceof Error ? err.message : String(err);
        }

        results.push(result);

        // Follow default output edges
        const nextNodes = resolveNextNodes(node.id, workflow.edges, workflow.nodes, 'out');
        for (const next of nextNodes) {
            await processNode(next);
        }
    }

    // Start from root nodes
    const startNodes = findStartNodes(workflow);
    for (const start of startNodes) {
        await processNode(start);
    }

    return {
        workflowId: workflow.id,
        results,
        fieldUpdates,
        optionUpdates,
        redirectUrl,
        redirectNewTab,
        dialog,
    };
}

// ─── Trigger-based Workflow Finders ──────────────────────────────────────────

/** Get the trigger type of a workflow (from its trigger node, or inferred). */
function getWorkflowTriggerType(wf: FormWorkflow): TriggerType | null {
    const triggerNode = wf.nodes.find((n) => n.type === 'trigger');
    if (triggerNode?.config.triggerType) return triggerNode.config.triggerType;

    // Backward compat: infer from node types if no explicit trigger
    if (wf.nodes.some((n) => n.type === 'fetchOptions')) return 'pageLoad';
    return null;
}

/** Get the trigger field ID(s) from a workflow's trigger nodes. */
function getWorkflowTriggerFieldIds(wf: FormWorkflow): string[] {
    const triggerNodes = wf.nodes.filter((n) => n.type === 'trigger' && n.config.triggerType === 'fieldChange');
    const ids = triggerNodes.map((n) => n.config.triggerFieldId).filter((id): id is string => !!id);
    if (ids.length > 0) return ids;

    // Backward compat: scan node configs for field references
    const implicitIds: string[] = [];
    for (const node of wf.nodes) {
        if (node.config.conditionField) implicitIds.push(node.config.conditionField);
        if (node.config.targetFieldId) implicitIds.push(node.config.targetFieldId);
        const url = node.config.api?.url;
        if (url) {
            const matches = url.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) implicitIds.push(m[1]);
        }
        const body = node.config.api?.bodyTemplate;
        if (body) {
            const matches = body.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) implicitIds.push(m[1]);
        }
    }
    return [...new Set(implicitIds)];
}

/**
 * Find workflows that should trigger on a specific field change.
 */
export function findWorkflowsForField(
    workflows: FormWorkflow[],
    fieldId: string,
): FormWorkflow[] {
    return workflows.filter((wf) => {
        if (!wf.enabled) return false;
        const triggerType = getWorkflowTriggerType(wf);
        const triggerFieldIds = getWorkflowTriggerFieldIds(wf);

        // Explicit trigger: must match trigger type and field
        if (triggerType === 'fieldChange' && triggerFieldIds.includes(fieldId)) return true;

        // Backward compat: check if any node references the field
        if (triggerType === null) {
            return triggerFieldIds.includes(fieldId);
        }

        return false;
    });
}

/**
 * Find workflows that should trigger on page load.
 * These have a trigger node with `pageLoad` type or contain fetchOptions nodes.
 */
export function findPageLoadWorkflows(
    workflows: FormWorkflow[],
): FormWorkflow[] {
    return workflows.filter((wf) =>
        wf.enabled && getWorkflowTriggerType(wf) === 'pageLoad',
    );
}

/**
 * Find workflows that should trigger on form submit.
 */
export function findSubmitWorkflows(
    workflows: FormWorkflow[],
): FormWorkflow[] {
    return workflows.filter((wf) =>
        wf.enabled && getWorkflowTriggerType(wf) === 'formSubmit',
    );
}

// ─── Workflow Validation ─────────────────────────────────────────────────────

/**
 * Validate a workflow for common issues.
 * Returns errors/warnings that should be shown to the user before saving.
 */
export function validateWorkflow(workflow: FormWorkflow): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];

    // 1. Check for empty workflow
    if (workflow.nodes.length === 0) {
        issues.push({ severity: 'warning', message: 'Workflow has no nodes' });
        return { valid: true, issues };
    }

    // 2. Check for trigger node
    const triggerNodes = workflow.nodes.filter((n) => n.type === 'trigger');
    if (triggerNodes.length === 0) {
        issues.push({ severity: 'warning', message: 'No trigger node — workflow won\u2019t fire automatically. Add a Trigger node to specify when it should run.' });
    }
    if (triggerNodes.length > 1) {
        issues.push({ severity: 'warning', message: 'Multiple trigger nodes — only the first will be used' });
    }

    // 3. Check trigger configuration
    for (const trigger of triggerNodes) {
        if (!trigger.config.triggerType) {
            issues.push({ nodeId: trigger.id, severity: 'error', message: `Trigger "${trigger.label}" has no event type set` });
        }
        if (trigger.config.triggerType === 'fieldChange' && !trigger.config.triggerFieldId) {
            issues.push({ nodeId: trigger.id, severity: 'error', message: `Field-change trigger "${trigger.label}" needs a field to watch` });
        }
    }

    // 4. Check for orphan nodes (no edges at all)
    const connectedNodeIds = new Set<string>();
    for (const edge of workflow.edges) {
        connectedNodeIds.add(edge.sourceNodeId);
        connectedNodeIds.add(edge.targetNodeId);
    }
    for (const node of workflow.nodes) {
        if (!connectedNodeIds.has(node.id) && workflow.nodes.length > 1) {
            issues.push({ nodeId: node.id, severity: 'warning', message: `"${node.label}" is not connected to any other node` });
        }
    }

    // 5. Check API node configs
    for (const node of workflow.nodes) {
        if ((node.type === 'callApi' || node.type === 'fetchOptions') && !node.config.api?.url) {
            issues.push({ nodeId: node.id, severity: 'error', message: `"${node.label}" is missing an API URL` });
        }
    }

    // 6. Check fetchOptions has a target field
    for (const node of workflow.nodes) {
        if (node.type === 'fetchOptions' && !node.config.targetFieldId) {
            issues.push({ nodeId: node.id, severity: 'error', message: `"${node.label}" is missing a target select field` });
        }
    }

    // 7. Check condition node config
    for (const node of workflow.nodes) {
        if (node.type === 'condition') {
            if (!node.config.conditionField) {
                issues.push({ nodeId: node.id, severity: 'error', message: `"${node.label}" is missing a condition field` });
            }
            // Check both branches are connected
            const trueBranch = workflow.edges.some((e) => e.sourceNodeId === node.id && e.sourcePort === 'true');
            const falseBranch = workflow.edges.some((e) => e.sourceNodeId === node.id && e.sourcePort === 'false');
            if (!trueBranch && !falseBranch) {
                issues.push({ nodeId: node.id, severity: 'warning', message: `"${node.label}" has no outgoing branches` });
            }
        }
    }

    // 8. Check redirect has URL
    for (const node of workflow.nodes) {
        if (node.type === 'redirect' && !node.config.redirectUrl) {
            issues.push({ nodeId: node.id, severity: 'error', message: `"${node.label}" is missing a redirect URL` });
        }
    }

    // 9. Check for cycles (simple DFS)
    const hasCycle = detectCycle(workflow);
    if (hasCycle) {
        issues.push({ severity: 'error', message: 'Workflow contains a cycle — this may cause infinite loops' });
    }

    const hasErrors = issues.some((i) => i.severity === 'error');
    return { valid: !hasErrors, issues };
}

/** Simple cycle detection via DFS. */
function detectCycle(workflow: FormWorkflow): boolean {
    const adj = new Map<string, string[]>();
    for (const edge of workflow.edges) {
        const list = adj.get(edge.sourceNodeId) ?? [];
        list.push(edge.targetNodeId);
        adj.set(edge.sourceNodeId, list);
    }

    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>();
    for (const node of workflow.nodes) color.set(node.id, WHITE);

    function dfs(nodeId: string): boolean {
        color.set(nodeId, GRAY);
        for (const neighbor of adj.get(nodeId) ?? []) {
            if (color.get(neighbor) === GRAY) return true;
            if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
        }
        color.set(nodeId, BLACK);
        return false;
    }

    for (const node of workflow.nodes) {
        if (color.get(node.id) === WHITE && dfs(node.id)) return true;
    }
    return false;
}
