/**
 * Workflow Engine Tests
 * Tests: interpolation, graph helpers, data extraction, condition evaluation,
 *        workflow execution, trigger-based finders, validation, cycle detection.
 */
import { describe, it, expect, vi } from 'vitest';
import {
    interpolate,
    findStartNodes,
    resolveNextNodes,
    extractPath,
    applyDataMapping,
    extractOptions,
    evaluateConditionNode,
    executeWorkflow,
    findWorkflowsForField,
    findPageLoadWorkflows,
    findSubmitWorkflows,
    validateWorkflow,
} from './engine';
import type { FormWorkflow, WorkflowNode, WorkflowEdge } from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[] = [], overrides: Partial<FormWorkflow> = {}): FormWorkflow {
    return { id: 'wf-1', name: 'Test', enabled: true, nodes, edges, ...overrides };
}

function makeNode(id: string, type: WorkflowNode['type'], config: Partial<WorkflowNode['config']> = {}): WorkflowNode {
    return { id, type, label: id, position: { x: 0, y: 0 }, config: config as any };
}

function makeEdge(src: string, tgt: string, port: 'out' | 'true' | 'false' = 'out'): WorkflowEdge {
    return { id: `${src}-${tgt}`, sourceNodeId: src, sourcePort: port, targetNodeId: tgt };
}

// ─── Interpolate ─────────────────────────────────────────────────────────────

describe('interpolate', () => {
    it('replaces simple placeholders', () => {
        expect(interpolate('Hello {{name}}!', { name: 'World' })).toBe('Hello World!');
    });

    it('handles missing values as empty string', () => {
        expect(interpolate('Hi {{missing}}', {})).toBe('Hi ');
    });

    it('replaces multiple placeholders', () => {
        expect(interpolate('{{a}} + {{b}} = {{c}}', { a: '1', b: '2', c: '3' })).toBe('1 + 2 = 3');
    });
});

// ─── Graph Helpers ───────────────────────────────────────────────────────────

describe('findStartNodes', () => {
    it('returns nodes with no incoming edges', () => {
        const wf = makeWorkflow(
            [makeNode('a', 'trigger'), makeNode('b', 'callApi'), makeNode('c', 'setData')],
            [makeEdge('a', 'b'), makeEdge('b', 'c')],
        );
        const starts = findStartNodes(wf);
        expect(starts.map((n) => n.id)).toEqual(['a']);
    });
});

describe('resolveNextNodes', () => {
    it('returns successor nodes', () => {
        const nodes = [makeNode('a', 'trigger'), makeNode('b', 'callApi'), makeNode('c', 'setData')];
        const edges = [makeEdge('a', 'b'), makeEdge('a', 'c')];
        const next = resolveNextNodes('a', edges, nodes);
        expect(next.map((n) => n.id).sort()).toEqual(['b', 'c']);
    });

    it('filters by port', () => {
        const nodes = [makeNode('a', 'condition'), makeNode('b', 'callApi'), makeNode('c', 'redirect')];
        const edges = [makeEdge('a', 'b', 'true'), makeEdge('a', 'c', 'false')];
        expect(resolveNextNodes('a', edges, nodes, 'true').map((n) => n.id)).toEqual(['b']);
        expect(resolveNextNodes('a', edges, nodes, 'false').map((n) => n.id)).toEqual(['c']);
    });
});

// ─── Data Extraction ─────────────────────────────────────────────────────────

describe('extractPath', () => {
    it('extracts nested values', () => {
        expect(extractPath({ data: { users: [{ name: 'John' }] } }, 'data.users')).toEqual([{ name: 'John' }]);
    });

    it('handles array index syntax', () => {
        expect(extractPath({ items: ['a', 'b'] }, 'items[1]')).toBe('b');
    });

    it('returns undefined for bad path', () => {
        expect(extractPath({}, 'no.such.path')).toBeUndefined();
    });
});

describe('extractOptions', () => {
    it('extracts options from response', () => {
        const response = { data: [{ name: 'Red', id: '1' }, { name: 'Blue', id: '2' }] };
        const result = extractOptions(response, { responsePath: 'data', labelKey: 'name', valueKey: 'id' });
        expect(result).toEqual([{ label: 'Red', value: '1' }, { label: 'Blue', value: '2' }]);
    });
});

// ─── Condition Evaluator ─────────────────────────────────────────────────────

describe('evaluateConditionNode', () => {
    it('equals', () => {
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'equals', conditionValue: '5' }, { x: '5' })).toBe('true');
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'equals', conditionValue: '5' }, { x: '3' })).toBe('false');
    });

    it('isEmpty / isNotEmpty', () => {
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'isEmpty' }, { x: '' })).toBe('true');
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'isEmpty' }, { x: 'val' })).toBe('false');
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'isNotEmpty' }, { x: 'val' })).toBe('true');
    });

    it('contains', () => {
        expect(evaluateConditionNode({ conditionField: 'x', conditionOperator: 'contains', conditionValue: 'ell' }, { x: 'Hello' })).toBe('true');
    });
});

// ─── Workflow Execution ──────────────────────────────────────────────────────

describe('executeWorkflow', () => {
    it('executes a linear workflow', async () => {
        const mockApi = vi.fn().mockResolvedValue({ name: 'John' });
        const wf = makeWorkflow(
            [
                makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
                makeNode('a', 'callApi', { api: { url: 'https://api.test/user', method: 'GET' } }),
                makeNode('s', 'setData', { dataMapping: [{ from: 'name', to: 'userName' }] }),
            ],
            [makeEdge('t', 'a'), makeEdge('a', 's')],
        );

        const result = await executeWorkflow(wf, {}, mockApi);
        expect(result.fieldUpdates).toEqual({ userName: 'John' });
        expect(mockApi).toHaveBeenCalledOnce();
    });

    it('follows condition branches', async () => {
        const mockApi = vi.fn().mockResolvedValue({});
        const wf = makeWorkflow(
            [
                makeNode('c', 'condition', { conditionField: 'role', conditionOperator: 'equals', conditionValue: 'admin' }),
                makeNode('yes', 'showDialog', { dialogTitle: 'Welcome Admin', dialogMessage: 'Hi' }),
                makeNode('no', 'redirect', { redirectUrl: '/login' }),
            ],
            [makeEdge('c', 'yes', 'true'), makeEdge('c', 'no', 'false')],
        );

        const result = await executeWorkflow(wf, { role: 'admin' }, mockApi);
        expect(result.dialog?.title).toBe('Welcome Admin');
        expect(result.redirectUrl).toBeUndefined();
    });

    it('skips disabled workflows', async () => {
        const wf = makeWorkflow([makeNode('a', 'callApi', { api: { url: 'test', method: 'GET' } })], [], { enabled: false });
        const result = await executeWorkflow(wf, {}, vi.fn());
        expect(result.results).toHaveLength(0);
    });
});

// ─── Trigger-based Finders ───────────────────────────────────────────────────

describe('findPageLoadWorkflows', () => {
    it('finds workflows with pageLoad trigger', () => {
        const wfs = [
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'pageLoad' })]),
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'fieldChange', triggerFieldId: 'city' })], [], { id: 'wf-2' }),
        ];
        expect(findPageLoadWorkflows(wfs).map((w) => w.id)).toEqual(['wf-1']);
    });

    it('backward compat: finds workflows with fetchOptions', () => {
        const wfs = [
            makeWorkflow([makeNode('f', 'fetchOptions', { api: { url: '/api/list', method: 'GET' }, targetFieldId: 'sel1' })]),
        ];
        expect(findPageLoadWorkflows(wfs)).toHaveLength(1);
    });
});

describe('findWorkflowsForField', () => {
    it('finds workflows with fieldChange trigger matching field', () => {
        const wfs = [
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'fieldChange', triggerFieldId: 'country' })]),
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'fieldChange', triggerFieldId: 'city' })], [], { id: 'wf-2' }),
        ];
        expect(findWorkflowsForField(wfs, 'country').map((w) => w.id)).toEqual(['wf-1']);
    });
});

describe('findSubmitWorkflows', () => {
    it('finds workflows with formSubmit trigger', () => {
        const wfs = [
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'formSubmit' })]),
            makeWorkflow([makeNode('t', 'trigger', { triggerType: 'pageLoad' })], [], { id: 'wf-2' }),
        ];
        expect(findSubmitWorkflows(wfs).map((w) => w.id)).toEqual(['wf-1']);
    });
});

// ─── Workflow Validation ─────────────────────────────────────────────────────

describe('validateWorkflow', () => {
    it('passes valid workflow', () => {
        const wf = makeWorkflow(
            [
                makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
                makeNode('a', 'callApi', { api: { url: 'https://api.test/data', method: 'GET' } }),
            ],
            [makeEdge('t', 'a')],
        );
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(true);
        expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    });

    it('warns on missing trigger node', () => {
        const wf = makeWorkflow([makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } })]);
        const result = validateWorkflow(wf);
        expect(result.issues.some((i) => i.message.includes('trigger'))).toBe(true);
    });

    it('errors on API node without URL', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
            makeNode('a', 'callApi', {}),
        ], [makeEdge('t', 'a')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('API URL'))).toBe(true);
    });

    it('errors on fieldChange trigger without field', () => {
        const wf = makeWorkflow([makeNode('t', 'trigger', { triggerType: 'fieldChange' })]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('field to watch'))).toBe(true);
    });

    it('detects cycles', () => {
        const wf = makeWorkflow(
            [makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } }), makeNode('b', 'setData', {})],
            [makeEdge('a', 'b'), makeEdge('b', 'a')],
        );
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('cycle'))).toBe(true);
    });

    it('warns on orphan nodes', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
            makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } }),
            makeNode('orphan', 'redirect', { redirectUrl: '/x' }),
        ], [makeEdge('t', 'a')]);
        const result = validateWorkflow(wf);
        expect(result.issues.some((i) => i.message.includes('not connected'))).toBe(true);
    });
});
