/**
 * Workflow Types — @formanywhere/domain
 *
 * Type definitions for the visual workflow builder.
 * Workflows are modeled as directed graphs: nodes (pages, actions) + edges (connections).
 */

// ─── Node Types ──────────────────────────────────────────────────────────────

/** All possible workflow node types */
export type WorkflowNodeType =
    | 'trigger'       // When a workflow should fire (page load, field change, submit)
    | 'page'          // Represents a form page
    | 'callApi'       // Call an external API
    | 'setData'       // Map response data → form fields
    | 'fetchOptions'  // Populate select options from API
    | 'showDialog'    // Display a message/confirmation dialog
    | 'redirect'      // Navigate to a URL
    | 'condition';    // Branch based on field value

/** Trigger types */
export type TriggerType = 'pageLoad' | 'fieldChange' | 'formSubmit';

/** Position on the canvas */
export interface NodePosition {
    x: number;
    y: number;
}

/** API configuration for callApi / fetchOptions nodes */
export interface WorkflowApiConfig {
    /** URL template — supports {{fieldId}} interpolation */
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    /** Custom headers */
    headers?: Record<string, string>;
    /** JSON body template with {{fieldId}} placeholders */
    bodyTemplate?: string;
}

/** Data mapping entry: JSONPath from response → target form field */
export interface DataMappingEntry {
    /** JSONPath or dot-notation path in the API response */
    from: string;
    /** Target form field ID */
    to: string;
}

/** Type-specific configuration for a workflow node */
export interface WorkflowNodeConfig {
    // ── Trigger node ──
    /** What event triggers this workflow */
    triggerType?: TriggerType;
    /** For fieldChange triggers: which field to watch */
    triggerFieldId?: string;

    // ── Page node ──
    /** Reference to a form page ID */
    pageId?: string;

    // ── callApi / fetchOptions ──
    api?: WorkflowApiConfig;

    // ── setData ──
    /** Maps response fields → form field IDs */
    dataMapping?: DataMappingEntry[];

    // ── fetchOptions ──
    /** The select element to populate */
    targetFieldId?: string;
    /** JSON key for option labels in the response */
    labelKey?: string;
    /** JSON key for option values in the response */
    valueKey?: string;
    /** JSONPath to the array in the response */
    responsePath?: string;

    // ── showDialog ──
    dialogTitle?: string;
    dialogMessage?: string;

    // ── redirect ──
    /** URL template — supports {{fieldId}} interpolation */
    redirectUrl?: string;
    redirectNewTab?: boolean;

    // ── condition ──
    conditionField?: string;
    conditionOperator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    conditionValue?: string;
}

/** A single node on the workflow canvas */
export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    label: string;
    position: NodePosition;
    config: WorkflowNodeConfig;
}

// ─── Edge Types ──────────────────────────────────────────────────────────────

/** Which port the edge connects from */
export type EdgeSourcePort = 'out' | 'true' | 'false';

/** A directed edge connecting two nodes */
export interface WorkflowEdge {
    id: string;
    sourceNodeId: string;
    sourcePort: EdgeSourcePort;
    targetNodeId: string;
}

// ─── Workflow (top-level) ────────────────────────────────────────────────────

/** A complete workflow definition stored in the form schema */
export interface FormWorkflow {
    id: string;
    name: string;
    enabled: boolean;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

// ─── Execution Result Types ──────────────────────────────────────────────────

/** Result from executing a single workflow node */
export interface NodeExecutionResult {
    nodeId: string;
    type: WorkflowNodeType;
    status: 'success' | 'error' | 'skipped';
    /** Data returned from API calls */
    data?: unknown;
    /** Error message if status === 'error' */
    error?: string;
    /** For condition nodes: which branch was taken */
    branch?: 'true' | 'false';
}

/** Result from executing an entire workflow */
export interface WorkflowExecutionResult {
    workflowId: string;
    results: NodeExecutionResult[];
    /** Values to set on form fields (from setData nodes) */
    fieldUpdates: Record<string, unknown>;
    /** Options to set on select fields (from fetchOptions nodes) */
    optionUpdates: Record<string, Array<{ label: string; value: string }>>;
    /** Redirect URL if a redirect node was reached */
    redirectUrl?: string;
    redirectNewTab?: boolean;
    /** Dialog to show if a showDialog node was reached */
    dialog?: { title: string; message: string };
}

// ─── Validation Types ────────────────────────────────────────────────────────

/** A single validation issue with a workflow */
export interface WorkflowValidationIssue {
    nodeId?: string;
    severity: 'error' | 'warning';
    message: string;
}

/** Result of validating a workflow */
export interface WorkflowValidationResult {
    valid: boolean;
    issues: WorkflowValidationIssue[];
}
