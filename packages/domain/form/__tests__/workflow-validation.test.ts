/**
 * Workflow Validation Tests — @formanywhere/domain
 *
 * Verifies that all 5 forms' workflows pass validateWorkflow(),
 * and that intentionally broken workflows fail with correct errors.
 */
import { describe, it, expect } from 'vitest';
import { validateWorkflow } from '../workflow/engine';
import {
    ALL_FORM_FIXTURES,
    createEmployeeOnboardingForm,
} from './complex-forms.fixtures';
import type { FormWorkflow, WorkflowNode, WorkflowEdge } from '../workflow/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNode(id: string, type: WorkflowNode['type'], config: Partial<WorkflowNode['config']> = {}): WorkflowNode {
    return { id, type, label: id, position: { x: 0, y: 0 }, config: config as any };
}

function makeEdge(src: string, tgt: string, port: 'out' | 'true' | 'false' = 'out'): WorkflowEdge {
    return { id: `${src}-${tgt}`, sourceNodeId: src, sourcePort: port, targetNodeId: tgt };
}

function makeWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[] = [], overrides: Partial<FormWorkflow> = {}): FormWorkflow {
    return { id: 'test-wf', name: 'Test', enabled: true, nodes, edges, ...overrides };
}

// ─── All Form Workflows Pass Validation ──────────────────────────────────────

describe('Workflow Validation — All Complex Forms', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: all workflows pass validateWorkflow()`, () => {
            const form = create();
            if (!form.workflows) return;
            for (const wf of form.workflows) {
                const result = validateWorkflow(wf);
                expect(result.valid, `Workflow "${wf.name}" failed: ${result.issues.map((i) => i.message).join(', ')}`).toBe(true);
                expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
            }
        });

        it(`${name}: workflows have trigger nodes`, () => {
            const form = create();
            if (!form.workflows) return;
            for (const wf of form.workflows) {
                const triggerNodes = wf.nodes.filter((n) => n.type === 'trigger');
                expect(triggerNodes.length, `Workflow "${wf.name}" has no trigger`).toBeGreaterThan(0);
            }
        });

        it(`${name}: workflow edges reference valid nodes`, () => {
            const form = create();
            if (!form.workflows) return;
            for (const wf of form.workflows) {
                const nodeIds = new Set(wf.nodes.map((n) => n.id));
                for (const edge of wf.edges) {
                    expect(nodeIds.has(edge.sourceNodeId), `Edge ${edge.id}: unknown source ${edge.sourceNodeId}`).toBe(true);
                    expect(nodeIds.has(edge.targetNodeId), `Edge ${edge.id}: unknown target ${edge.targetNodeId}`).toBe(true);
                }
            }
        });

        it(`${name}: no duplicate node IDs within a workflow`, () => {
            const form = create();
            if (!form.workflows) return;
            for (const wf of form.workflows) {
                const ids = wf.nodes.map((n) => n.id);
                expect(new Set(ids).size).toBe(ids.length);
            }
        });
    }
});

// ─── Intentional Failures ────────────────────────────────────────────────────

describe('Workflow Validation — Failure Cases', () => {
    it('fails: API node without URL', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
            makeNode('a', 'callApi', {}),
        ], [makeEdge('t', 'a')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('API URL'))).toBe(true);
    });

    it('fails: fieldChange trigger without field', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'fieldChange' }),
        ]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('field to watch'))).toBe(true);
    });

    it('fails: cycle detection', () => {
        const wf = makeWorkflow([
            makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } }),
            makeNode('b', 'setData', {}),
        ], [makeEdge('a', 'b'), makeEdge('b', 'a')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('cycle'))).toBe(true);
    });

    it('fails: fetchOptions without target field', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
            makeNode('f', 'fetchOptions', { api: { url: 'https://api.test/list', method: 'GET' } }),
        ], [makeEdge('t', 'f')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('target select field'))).toBe(true);
    });

    it('fails: redirect without URL', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'formSubmit' }),
            makeNode('r', 'redirect', {}),
        ], [makeEdge('t', 'r')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('redirect URL'))).toBe(true);
    });

    it('fails: condition without field', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'formSubmit' }),
            makeNode('c', 'condition', { conditionOperator: 'equals', conditionValue: 'x' }),
        ], [makeEdge('t', 'c')]);
        const result = validateWorkflow(wf);
        expect(result.valid).toBe(false);
        expect(result.issues.some((i) => i.message.includes('condition field'))).toBe(true);
    });

    it('warns: orphan node', () => {
        const wf = makeWorkflow([
            makeNode('t', 'trigger', { triggerType: 'pageLoad' }),
            makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } }),
            makeNode('orphan', 'showDialog', { dialogTitle: 'Hi', dialogMessage: 'Test' }),
        ], [makeEdge('t', 'a')]);
        const result = validateWorkflow(wf);
        expect(result.issues.some((i) => i.message.includes('not connected'))).toBe(true);
    });

    it('warns: no trigger node', () => {
        const wf = makeWorkflow([
            makeNode('a', 'callApi', { api: { url: 'x', method: 'GET' } }),
        ]);
        const result = validateWorkflow(wf);
        expect(result.issues.some((i) => i.message.includes('trigger'))).toBe(true);
    });
});
