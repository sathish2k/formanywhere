/**
 * WorkflowDebuggerDialog — Visual step-through debugger for workflows
 *
 * Simulates a run of the workflow to test logic gates and API calls
 * without submitting the real form.
 */
import { splitProps, createSignal, createMemo, For, Show, batch } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Tooltip } from '@formanywhere/ui/tooltip';
import type { FormWorkflow, FormElement, WorkflowNodeConfig } from '@formanywhere/shared/types';
import { executeWorkflow, interpolate } from '@formanywhere/domain/form';
import type { ApiCaller, WorkflowApiConfig } from '@formanywhere/domain/form';
import './dialogs.scss';

// ─── Props ──────────────────────────────────────────────────────────────────────

export interface WorkflowDebuggerDialogProps {
    open: boolean;
    onClose: () => void;
    workflow: FormWorkflow;
    /** All form elements for resolving labels and testing variables */
    elements: FormElement[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Collect all unique field IDs referenced in the workflow configuration */
function collectReferencedFields(workflow: FormWorkflow): string[] {
    const ids = new Set<string>();

    for (const node of workflow.nodes) {
        // Trigger nodes
        if (node.config.triggerFieldId) ids.add(node.config.triggerFieldId);

        // Condition nodes
        if (node.config.conditionField) ids.add(node.config.conditionField);

        // API endpoints
        if (node.config.api?.url) {
            const matches = node.config.api.url.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) ids.add(m[1]);
        }

        if (node.config.api?.bodyTemplate) {
            const matches = node.config.api.bodyTemplate.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) ids.add(m[1]);
        }

        // Set Data
        if (node.config.dataMapping) {
            for (const map of node.config.dataMapping) {
                ids.add(map.to);
            }
        }

        // Fetch Options target
        if (node.config.targetFieldId) ids.add(node.config.targetFieldId);

        // Dialog templates
        if (node.config.dialogTitle) {
            const matches = node.config.dialogTitle.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) ids.add(m[1]);
        }
        if (node.config.dialogMessage) {
            const matches = node.config.dialogMessage.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) ids.add(m[1]);
        }

        // Redirects
        if (node.config.redirectUrl) {
            const matches = node.config.redirectUrl.matchAll(/\{\{(\w+)\}\}/g);
            for (const m of matches) ids.add(m[1]);
        }
    }

    return [...ids].filter(Boolean).sort();
}

/** Find a human-readable label for a field ID */
function fieldLabel(elements: FormElement[], fieldId: string): string {
    for (const el of elements) {
        if (el.id === fieldId) return el.label || fieldId;
        if (el.elements) {
            const nested = fieldLabel(el.elements, fieldId);
            if (nested !== fieldId) return nested;
        }
    }
    return fieldId;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const WorkflowDebuggerDialog: Component<WorkflowDebuggerDialogProps> = (props) => {
    const [local] = splitProps(props, ['open', 'onClose', 'workflow', 'elements']);

    const [testValues, setTestValues] = createSignal<Record<string, string>>({});
    const [isRunning, setIsRunning] = createSignal(false);
    const [result, setResult] = createSignal<Awaited<ReturnType<typeof executeWorkflow>> | null>(null);
    const [error, setError] = createSignal<string | null>(null);

    // Track proxy API payloads for the trace view
    const [apiTrace, setApiTrace] = createSignal<Record<string, unknown>>({});

    const [activeTab, setActiveTab] = createSignal<'trace' | 'final' | 'api'>('trace');

    const referencedFields = createMemo(() => collectReferencedFields(local.workflow));

    // Reset state on open
    createMemo(() => {
        if (local.open) {
            setResult(null);
            setError(null);
            setApiTrace({});
            setActiveTab('trace');
        }
    });

    const updateTestValue = (fieldId: string, value: string) => {
        setTestValues((prev) => ({ ...prev, [fieldId]: value }));
    };

    const runDebugger = async () => {
        setIsRunning(true);
        setError(null);
        setResult(null);
        setApiTrace({});

        const values = { ...testValues() };
        let currentTrace: Record<string, unknown> = {};

        // Fake API caller that actually calls the proxy backend
        const apiCaller: ApiCaller = async (api: WorkflowApiConfig, ctxValues: Record<string, unknown>) => {
            const url = interpolate(api.url, ctxValues);
            const body = api.bodyTemplate ? interpolate(api.bodyTemplate, ctxValues) : undefined;
            const API_URL = typeof import.meta !== 'undefined'
                ? (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
                : 'http://localhost:3001';

            currentTrace[api.url] = { url, method: api.method, requestBody: body, status: 'pending' };
            setApiTrace({ ...currentTrace });

            try {
                const res = await fetch(`${API_URL}/api/workflow-proxy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        url,
                        method: api.method,
                        headers: api.headers,
                        body,
                    }),
                });

                const json = await res.json();
                if (!json.success) throw new Error(json.error || 'API call failed');

                currentTrace[api.url] = { ...currentTrace[api.url] as any, status: 'success', response: json.data };
                setApiTrace({ ...currentTrace });
                return json.data;
            } catch (err) {
                currentTrace[api.url] = { ...currentTrace[api.url] as any, status: 'error', error: err instanceof Error ? err.message : String(err) };
                setApiTrace({ ...currentTrace });
                throw err;
            }
        };

        try {
            const res = await executeWorkflow(local.workflow, values, apiCaller);
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Dialog
            open={local.open}
            onClose={local.onClose}
            title="Workflow Debugger"
            icon={<Icon name="bug" size={20} />}
            class="debugger-dialog"
            actions={
                <div class="debugger__dialog-actions">
                    <Button variant="text" size="sm" onClick={local.onClose}>Close</Button>
                </div>
            }
        >
            <div class="debugger__layout">
                {/* ── Left: Test Data Panel ──────────────────────────────────────── */}
                <div class="debugger__data-panel" style={{ 'border-left': 'none', 'border-right': '1px solid var(--m3-color-outline-variant, #C4C7C5)', 'background': 'var(--m3-color-surface-container-low, #F7F2FA)' }}>
                    <div class="debugger__panel-header">
                        <span class="debugger__panel-title">Variables</span>
                    </div>

                    <div class="debugger__field-inputs">
                        <Show when={referencedFields().length > 0} fallback={
                            <div class="debugger__empty-fields">
                                <p>No form fields (&#123;&#123;variables&#125;&#125;) referenced in this workflow.</p>
                            </div>
                        }>
                            <For each={referencedFields()}>
                                {(fieldId) => (
                                    <div class="debugger__field-row">
                                        <label class="debugger__field-label" title={fieldId}>
                                            {fieldLabel(local.elements, fieldId)}
                                        </label>
                                        <input
                                            type="text"
                                            class="debugger__field-input"
                                            value={testValues()[fieldId] ?? ''}
                                            onInput={(e) => updateTestValue(fieldId, e.currentTarget.value)}
                                            placeholder="test value…"
                                            disabled={isRunning()}
                                        />
                                    </div>
                                )}
                            </For>
                        </Show>
                    </div>

                    <div class="debugger__data-actions">
                        <Button
                            variant="filled"
                            style={{ width: '100%' }}
                            onClick={runDebugger}
                            disabled={isRunning() || local.workflow.nodes.length === 0}
                        >
                            <Show when={isRunning()} fallback={<Icon name="play" size={16} />}>
                                <Icon name="loader" size={16} /> {/* Replace with proper spinner if desired */}
                            </Show>
                            {isRunning() ? 'Running...' : 'Run Simulation'}
                        </Button>
                        <Button
                            variant="outlined"
                            style={{ width: '100%', 'margin-top': '8px' }}
                            onClick={() => setTestValues({})}
                            disabled={isRunning()}
                        >
                            Clear Test Data
                        </Button>
                    </div>
                </div>

                {/* ── Center: Inspection panels ────────────────────────────── */}
                <div class="debugger__inspect-panel">
                    {/* Tabs */}
                    <div class="debugger__tabs">
                        <button
                            class={`debugger__tab ${activeTab() === 'trace' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('trace')}
                        >
                            <Icon name="activity" size={14} />
                            Execution Trace
                        </button>
                        <button
                            class={`debugger__tab ${activeTab() === 'final' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('final')}
                        >
                            <Icon name="check-circle" size={14} />
                            Final Output
                        </button>
                        <button
                            class={`debugger__tab ${activeTab() === 'api' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('api')}
                        >
                            <Icon name="cloud" size={14} />
                            Network Log
                        </button>
                    </div>

                    {/* Tab content */}
                    <div class="debugger__tab-content" style={{ padding: '16px', 'overflow-y': 'auto' }}>

                        {/* ── Error Banner ── */}
                        <Show when={error()}>
                            <div style={{ padding: '12px', background: 'var(--m3-color-error-container, #F9DEDC)', color: 'var(--m3-color-on-error-container, #410E0B)', 'border-radius': '8px', 'margin-bottom': '16px', display: 'flex', 'align-items': 'center', gap: '8px' }}>
                                <Icon name="alert-triangle" size={16} />
                                <span style={{ 'font-size': '0.875rem' }}>{error()}</span>
                            </div>
                        </Show>

                        <Show when={result()} fallback={
                            <Show when={!error()}>
                                <div class="debugger__empty-tab">
                                    <p>Click <strong>Run Simulation</strong> to execute the workflow.</p>
                                </div>
                            </Show>
                        }>
                            {(res) => (
                                <>
                                    {/* ── Trace Panel ───────────────────────────── */}
                                    <Show when={activeTab() === 'trace'}>
                                        <div class="debugger__trace">
                                            <Show when={res().results.length === 0}>
                                                <div style={{ color: 'var(--m3-color-on-surface-variant)', 'font-size': '0.875rem' }}>No nodes were executed.</div>
                                            </Show>
                                            <div class="debugger__trace-list" style={{ gap: '12px' }}>
                                                <For each={res().results}>
                                                    {(ev, i) => {
                                                        const node = local.workflow.nodes.find(n => n.id === ev.nodeId);
                                                        return (
                                                            <div class="debugger__trace-item" style={{ 'flex-direction': 'column', 'align-items': 'flex-start', padding: '12px', 'background': 'var(--m3-color-surface-container-lowest, #FFF)', border: '1px solid var(--m3-color-outline-variant, #C4C7C5)', 'border-radius': '8px' }}>
                                                                <Stack direction="row" align="center" gap="sm" style={{ width: '100%' }}>
                                                                    <span class="debugger__trace-idx" style={{ background: ev.status === 'success' ? '#4CAF50' : '#F44336', color: 'white' }}>{i() + 1}</span>
                                                                    <Typography variant="label-medium" style={{ flex: 1 }}>{node?.label ?? ev.type}</Typography>
                                                                    <Show when={ev.branch}>
                                                                        <span style={{ padding: '2px 6px', background: '#FF9800', color: '#fff', 'border-radius': '4px', 'font-size': '0.625rem', 'font-weight': 'bold' }}>{ev.branch?.toUpperCase()}</span>
                                                                    </Show>
                                                                    <span style={{ color: ev.status === 'success' ? '#4CAF50' : '#F44336', 'font-weight': 'bold' }}>{ev.status === 'success' ? '✓ OK' : '✕ ERROR'}</span>
                                                                </Stack>

                                                                <Show when={ev.error}>
                                                                    <div style={{ 'margin-top': '8px', padding: '8px', background: '#ffebee', color: '#c62828', 'border-radius': '4px', 'font-size': '0.75rem', width: '100%' }}>
                                                                        {ev.error}
                                                                    </div>
                                                                </Show>

                                                                <Show when={ev.data}>
                                                                    <div style={{ 'margin-top': '8px', padding: '8px', background: '#f5f5f5', 'border-radius': '4px', 'font-size': '0.75rem', 'font-family': 'monospace', width: '100%', 'overflow-x': 'auto', 'white-space': 'pre' }}>
                                                                        {JSON.stringify(ev.data, null, 2)}
                                                                    </div>
                                                                </Show>
                                                            </div>
                                                        );
                                                    }}
                                                </For>
                                            </div>
                                        </div>
                                    </Show>

                                    {/* ── Final Output Panel ────────────────────── */}
                                    <Show when={activeTab() === 'final'}>
                                        <div class="debugger__watch">
                                            {/* Field Values Set */}
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Fields Updated</div>
                                                <Show when={Object.keys(res().fieldUpdates).length > 0} fallback={<div style={{ padding: '8px', color: '#888', 'font-size': '0.8rem' }}>None</div>}>
                                                    <For each={Object.entries(res().fieldUpdates)}>
                                                        {([fieldId, value]) => (
                                                            <div class="debugger__watch-row">
                                                                <span class="debugger__watch-key">{fieldLabel(local.elements, fieldId)}</span>
                                                                <span class="debugger__watch-value">{String(value)}</span>
                                                            </div>
                                                        )}
                                                    </For>
                                                </Show>
                                            </div>

                                            {/* Options Fetched */}
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Options Updated</div>
                                                <Show when={Object.keys(res().optionUpdates).length > 0} fallback={<div style={{ padding: '8px', color: '#888', 'font-size': '0.8rem' }}>None</div>}>
                                                    <For each={Object.entries(res().optionUpdates)}>
                                                        {([fieldId, options]) => (
                                                            <div class="debugger__watch-row" style={{ 'flex-direction': 'column', 'align-items': 'flex-start' }}>
                                                                <span class="debugger__watch-key" style={{ 'margin-bottom': '4px' }}>{fieldLabel(local.elements, fieldId)}</span>
                                                                <div style={{ padding: '4px', background: '#f5f5f5', 'border-radius': '4px', width: '100%', 'font-size': '0.75rem', 'font-family': 'monospace' }}>
                                                                    {options.length} options loaded
                                                                </div>
                                                            </div>
                                                        )}
                                                    </For>
                                                </Show>
                                            </div>

                                            {/* Redirect / Dialog */}
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Side Effects</div>
                                                <Stack gap="sm" style={{ padding: '8px' }}>
                                                    <Show when={res().redirectUrl} fallback={<div style={{ color: '#888', 'font-size': '0.8rem' }}>No redirects</div>}>
                                                        <div style={{ 'font-size': '0.8rem' }}><strong>Redirect to:</strong> {res().redirectUrl} {res().redirectNewTab ? '(New Tab)' : ''}</div>
                                                    </Show>
                                                    <Show when={res().dialog}>
                                                        <div style={{ 'font-size': '0.8rem' }}><strong>Show Dialog:</strong> "{res().dialog!.title}" - {res().dialog!.message}</div>
                                                    </Show>
                                                </Stack>
                                            </div>
                                        </div>
                                    </Show>

                                    {/* ── Network Trace ─────────────────────────── */}
                                    <Show when={activeTab() === 'api'}>
                                        <div class="debugger__trace">
                                            <Show when={Object.keys(apiTrace()).length === 0}>
                                                <div style={{ color: 'var(--m3-color-on-surface-variant)', 'font-size': '0.875rem' }}>No network calls were made.</div>
                                            </Show>
                                            <div class="debugger__trace-list" style={{ gap: '12px' }}>
                                                <For each={Object.entries(apiTrace())}>
                                                    {([origUrl, traceInfo]: [string, any]) => (
                                                        <div class="debugger__trace-item" style={{ 'flex-direction': 'column', 'align-items': 'flex-start', padding: '12px', 'background': 'var(--m3-color-surface-container-lowest, #FFF)', border: '1px solid var(--m3-color-outline-variant, #C4C7C5)', 'border-radius': '8px' }}>
                                                            <Stack direction="row" align="center" justify="between" style={{ width: '100%', 'margin-bottom': '8px' }}>
                                                                <Stack direction="row" gap="sm" align="center">
                                                                    <span style={{ padding: '2px 6px', background: '#E3F2FD', color: '#1565C0', 'border-radius': '4px', 'font-size': '0.625rem', 'font-weight': 'bold', 'text-transform': 'uppercase' }}>{traceInfo.method}</span>
                                                                    <Typography variant="body-small" style={{ 'font-weight': '600' }}>{traceInfo.url}</Typography>
                                                                </Stack>
                                                                <span style={{ color: traceInfo.status === 'success' ? '#4CAF50' : traceInfo.status === 'error' ? '#F44336' : '#FF9800', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                                                                    {traceInfo.status.toUpperCase()}
                                                                </span>
                                                            </Stack>

                                                            <Show when={traceInfo.requestBody}>
                                                                <Typography variant="label-small" style={{ 'margin-bottom': '4px' }}>Request Body payload:</Typography>
                                                                <div style={{ 'margin-bottom': '8px', padding: '8px', background: '#f5f5f5', 'border-radius': '4px', 'font-size': '0.75rem', 'font-family': 'monospace', width: '100%', 'overflow-x': 'auto', 'white-space': 'pre' }}>
                                                                    {traceInfo.requestBody}
                                                                </div>
                                                            </Show>

                                                            <Typography variant="label-small" style={{ 'margin-bottom': '4px' }}>Proxy Response:</Typography>
                                                            <div style={{ padding: '8px', background: '#2d2d2d', color: '#a0f3d6', 'border-radius': '4px', 'font-size': '0.75rem', 'font-family': 'monospace', width: '100%', 'overflow-x': 'auto', 'white-space': 'pre' }}>
                                                                {traceInfo.response ? JSON.stringify(traceInfo.response, null, 2) : traceInfo.error ? String(traceInfo.error) : 'Pending...'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                    </Show>
                                </>
                            )}
                        </Show>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
