/**
 * useWorkflows — Extracted workflow execution logic for FormRenderer.
 *
 * Handles page-load, field-change, and submit workflows, including
 * API calling, execution logging, and result application (field updates,
 * option updates, dialogs, redirects, error toasts).
 */
import { createSignal, onMount } from 'solid-js';
import type { FormSchema } from '@formanywhere/shared/types';
import { getValues, setValue } from '@modular-forms/solid';
import {
    executeWorkflow,
    findPageLoadWorkflows,
    findWorkflowsForField,
    findSubmitWorkflows,
    interpolate,
} from '@formanywhere/domain/form';
import type { ApiCaller, WorkflowApiConfig } from '@formanywhere/domain/form';

export interface UseWorkflowsOptions {
    schema: () => FormSchema;
    formId: () => string | undefined;
    formStore: any; // modular-forms FormStore
}

export interface WorkflowState {
    /** Reactive error message (auto-dismisses) */
    workflowError: () => string | null;
    /** Set of field IDs currently loading via fetchOptions workflows */
    loadingFields: () => Set<string>;
    /** Whether a submit workflow is in progress */
    isSubmitting: () => boolean;
    /** Dialog info triggered by a workflow */
    workflowDialog: () => { title: string; message: string } | null;
    /** Dynamic options injected by workflows (fieldId → options[]) */
    dynamicOptions: () => Record<string, Array<{ label: string; value: string }>>;
    /** Dismiss the workflow dialog */
    closeDialog: () => void;
    /** Dismiss the error toast */
    clearError: () => void;
    /** Execute workflows triggered by a field value change */
    runFieldWorkflows: (fieldId: string) => Promise<void>;
    /** Execute submit-phase workflows. Returns false if submission should be blocked. */
    runSubmitWorkflows: (values: Record<string, unknown>) => Promise<boolean>;
    /** Mark submitting state */
    setIsSubmitting: (v: boolean) => void;
}

export function useWorkflows(opts: UseWorkflowsOptions): WorkflowState {
    const [workflowError, setWorkflowError] = createSignal<string | null>(null);
    const [loadingFields, setLoadingFields] = createSignal<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [dynamicOptions, setDynamicOptions] = createSignal<Record<string, Array<{ label: string; value: string }>>>({});
    const [workflowDialog, setWorkflowDialog] = createSignal<{ title: string; message: string } | null>(null);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const showError = (msg: string) => {
        setWorkflowError(msg);
        setTimeout(() => setWorkflowError(null), 5000);
    };

    const addLoadingField = (id: string) => {
        setLoadingFields((s) => { const ns = new Set(s); ns.add(id); return ns; });
    };
    const removeLoadingField = (id: string) => {
        setLoadingFields((s) => { const ns = new Set(s); ns.delete(id); return ns; });
    };

    // ── API caller ────────────────────────────────────────────────────────────

    const apiCaller: ApiCaller = async (api: WorkflowApiConfig, values: Record<string, unknown>) => {
        const url = interpolate(api.url, values);
        const body = api.bodyTemplate ? interpolate(api.bodyTemplate, values) : undefined;
        const API_URL = typeof import.meta !== 'undefined'
            ? (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
            : 'http://localhost:3001';

        const res = await fetch(`${API_URL}/api/workflow-proxy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ url, method: api.method, headers: api.headers, body }),
        });

        const result = await res.json();
        if (!result.success) throw new Error(result.error || 'Workflow API call failed');
        return result.data;
    };

    // ── Execution log ─────────────────────────────────────────────────────────

    const sendExecutionLog = async (result: Awaited<ReturnType<typeof executeWorkflow>>, duration: number) => {
        const formId = opts.formId();
        if (!formId) return;

        try {
            const API_URL = typeof import.meta !== 'undefined'
                ? (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
                : 'http://localhost:3001';
            const hasError = result.results.some(r => r.status === 'error');
            await fetch(`${API_URL}/api/forms/${formId}/workflow-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ trace: result, duration, success: !hasError }),
            });
        } catch (err) {
            console.error('[workflow] Failed to record execution log:', err);
        }
    };

    // ── Result application ────────────────────────────────────────────────────

    const applyWorkflowResult = (result: Awaited<ReturnType<typeof executeWorkflow>>) => {
        if (Object.keys(result.optionUpdates).length > 0) {
            setDynamicOptions((prev) => ({ ...prev, ...result.optionUpdates }));
        }
        for (const [fieldId, value] of Object.entries(result.fieldUpdates)) {
            setValue(opts.formStore, fieldId, value as string);
        }
        if (result.dialog) setWorkflowDialog(result.dialog);
        if (result.redirectUrl) {
            if (result.redirectNewTab) {
                window.open(result.redirectUrl, '_blank');
            } else {
                window.location.href = result.redirectUrl;
            }
        }
        const errors = result.results.filter((r) => r.status === 'error');
        if (errors.length > 0) {
            showError(`Workflow error: ${errors[0].error ?? 'Unknown'}`);
        }
    };

    // ── Public workflow runners ───────────────────────────────────────────────

    const runPageLoadWorkflows = async () => {
        const workflows = opts.schema().workflows ?? [];
        const pageLoadWfs = findPageLoadWorkflows(workflows);

        for (const wf of pageLoadWfs) {
            const fetchNodes = wf.nodes.filter((n) => n.type === 'fetchOptions' && n.config.targetFieldId);
            for (const fn of fetchNodes) addLoadingField(fn.config.targetFieldId!);

            try {
                const values = (getValues(opts.formStore) as Record<string, unknown>) ?? {};
                const start = performance.now();
                const result = await executeWorkflow(wf, values, apiCaller);
                const duration = Math.round(performance.now() - start);
                applyWorkflowResult(result);
                sendExecutionLog(result, duration);
            } catch (err) {
                console.error(`[workflow] Error executing ${wf.name}:`, err);
                showError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                for (const fn of fetchNodes) removeLoadingField(fn.config.targetFieldId!);
            }
        }
    };

    const runFieldWorkflows = async (fieldId: string) => {
        const workflows = opts.schema().workflows ?? [];
        const triggered = findWorkflowsForField(workflows, fieldId);

        for (const wf of triggered) {
            try {
                const values = (getValues(opts.formStore) as Record<string, unknown>) ?? {};
                const start = performance.now();
                const result = await executeWorkflow(wf, values, apiCaller);
                const duration = Math.round(performance.now() - start);
                applyWorkflowResult(result);
                sendExecutionLog(result, duration);
            } catch (err) {
                console.error(`[workflow] Error executing ${wf.name}:`, err);
                showError(`Workflow failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const runSubmitWorkflows = async (values: Record<string, unknown>): Promise<boolean> => {
        const workflows = opts.schema().workflows ?? [];
        const submitWfs = findSubmitWorkflows(workflows);

        for (const wf of submitWfs) {
            try {
                const start = performance.now();
                const result = await executeWorkflow(wf, values, apiCaller);
                const duration = Math.round(performance.now() - start);
                applyWorkflowResult(result);
                sendExecutionLog(result, duration);
                if (result.results.some((r) => r.status === 'error')) return false;
            } catch (err) {
                console.error(`[workflow] Submit workflow error ${wf.name}:`, err);
                showError(`Submit workflow failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                return false;
            }
        }
        return true;
    };

    // Run page-load workflows on mount
    onMount(() => { runPageLoadWorkflows(); });

    return {
        workflowError,
        loadingFields,
        isSubmitting,
        workflowDialog,
        dynamicOptions,
        closeDialog: () => setWorkflowDialog(null),
        clearError: () => setWorkflowError(null),
        runFieldWorkflows,
        runSubmitWorkflows,
        setIsSubmitting,
    };
}
