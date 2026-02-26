import { splitProps, For, createSignal, Show, createMemo, onMount, createEffect, on } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import type { FormSchema, FormElement, FormWorkflow } from '@formanywhere/shared/types';
import { createForm, zodForm, setValue, getValues } from '@modular-forms/solid';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Snackbar } from '@formanywhere/ui/snackbar';
import { CircularProgress } from '@formanywhere/ui/progress';
import { LinearProgress } from '@formanywhere/ui/progress';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Dialog } from '@formanywhere/ui/dialog';
import { evaluateCondition } from '@formanywhere/domain/form';
import { buildZodSchema, buildInitialValues } from '@formanywhere/domain/form';
import { isLayoutElement } from '@formanywhere/domain/form';
import {
    executeWorkflow,
    findPageLoadWorkflows,
    findWorkflowsForField,
    findSubmitWorkflows,
    interpolate,
} from '@formanywhere/domain/form';
import type { ApiCaller, WorkflowApiConfig } from '@formanywhere/domain/form';
import type { DynamicFormValues } from '../fields/types';
import { adaptFieldProps } from '../fields/types';
import {
    TextInputField, TextareaField, SelectField, CheckboxField,
    RadioField, SwitchField, FileField, RatingField, SignatureField,
    LayoutField,
} from '@formanywhere/domain/form';
/* styles.scss removed — inline styles + @formanywhere/ui only */

export interface FormRendererProps {
    schema: FormSchema;
    formId?: string; // Optional since it might be rendered in preview without an ID
    onSubmit: (data: Record<string, unknown>) => void;
}

export const FormRenderer: Component<FormRendererProps> = (props) => {
    const [local] = splitProps(props, ['schema', 'formId', 'onSubmit']);
    const zodSchema = buildZodSchema(local.schema);
    const [formStore, { Form, Field }] = createForm<DynamicFormValues>({
        validate: zodForm(zodSchema),
        validateOn: 'blur',
        revalidateOn: 'input',
        initialValues: buildInitialValues(local.schema),
    });

    const [submitted, setSubmitted] = createSignal(false);
    const [dynamicOptions, setDynamicOptions] = createSignal<Record<string, Array<{ label: string; value: string }>>>({});
    const [workflowDialog, setWorkflowDialog] = createSignal<{ title: string; message: string } | null>(null);

    // ── Error / Loading State ────────────────────────────────────────────────

    const [workflowError, setWorkflowError] = createSignal<string | null>(null);
    const [loadingFields, setLoadingFields] = createSignal<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    /** Show error toast — auto-dismisses after 5s */
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

    // ── Workflow Engine Integration ───────────────────────────────────────

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
            body: JSON.stringify({
                url,
                method: api.method,
                headers: api.headers,
                body,
            }),
        });

        const result = await res.json();
        if (!result.success) throw new Error(result.error || 'Workflow API call failed');
        return result.data;
    };

    /** Send execution logs to the backend analytics endpoint */
    const sendExecutionLog = async (result: Awaited<ReturnType<typeof executeWorkflow>>, duration: number) => {
        if (!local.formId) return; // Only log for saved, running forms, not generic previews

        try {
            const API_URL = typeof import.meta !== 'undefined'
                ? (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
                : 'http://localhost:3001';

            const hasError = result.results.some(r => r.status === 'error');

            await fetch(`${API_URL}/api/forms/${local.formId}/workflow-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    trace: result,
                    duration,
                    success: !hasError
                })
            });
        } catch (err) {
            console.error('[workflow] Failed to record execution log:', err);
        }
    };

    /** Apply workflow execution result to form state. */
    const applyWorkflowResult = (result: Awaited<ReturnType<typeof executeWorkflow>>) => {
        // Apply option updates
        if (Object.keys(result.optionUpdates).length > 0) {
            setDynamicOptions((prev) => ({ ...prev, ...result.optionUpdates }));
        }

        // Apply field updates
        for (const [fieldId, value] of Object.entries(result.fieldUpdates)) {
            setValue(formStore, fieldId, value as string);
        }

        // Handle dialog
        if (result.dialog) setWorkflowDialog(result.dialog);

        // Handle redirect
        if (result.redirectUrl) {
            if (result.redirectNewTab) {
                window.open(result.redirectUrl, '_blank');
            } else {
                window.location.href = result.redirectUrl;
            }
        }

        // Report errors
        const errors = result.results.filter((r) => r.status === 'error');
        if (errors.length > 0) {
            showError(`Workflow error: ${errors[0].error ?? 'Unknown'}`);
        }
    };

    /** Execute page-load workflows with loading states for fetchOptions fields. */
    const runPageLoadWorkflows = async () => {
        const workflows = local.schema.workflows ?? [];
        const pageLoadWfs = findPageLoadWorkflows(workflows);

        for (const wf of pageLoadWfs) {
            // Mark target fields as loading
            const fetchNodes = wf.nodes.filter((n) => n.type === 'fetchOptions' && n.config.targetFieldId);
            for (const fn of fetchNodes) addLoadingField(fn.config.targetFieldId!);

            try {
                const values = (getValues(formStore) as Record<string, unknown>) ?? {};
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

    /** Execute workflows triggered by a field change. */
    const runFieldWorkflows = async (fieldId: string) => {
        const workflows = local.schema.workflows ?? [];
        const triggered = findWorkflowsForField(workflows, fieldId);

        for (const wf of triggered) {
            try {
                const values = (getValues(formStore) as Record<string, unknown>) ?? {};
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

    /** Execute submit workflows before/after form submission. */
    const runSubmitWorkflows = async (values: Record<string, unknown>): Promise<boolean> => {
        const workflows = local.schema.workflows ?? [];
        const submitWfs = findSubmitWorkflows(workflows);

        for (const wf of submitWfs) {
            try {
                const start = performance.now();
                const result = await executeWorkflow(wf, values, apiCaller);
                const duration = Math.round(performance.now() - start);

                applyWorkflowResult(result);
                sendExecutionLog(result, duration);

                // If any node errored, don't proceed with submission
                if (result.results.some((r) => r.status === 'error')) {
                    return false;
                }
            } catch (err) {
                console.error(`[workflow] Submit workflow error ${wf.name}:`, err);
                showError(`Submit workflow failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                return false;
            }
        }
        return true;
    };

    onMount(() => {
        runPageLoadWorkflows();
    });

    // Multi-page state
    const isMultiPage = () => !!local.schema.settings.multiPage && !!local.schema.settings.pages?.length;
    const pages = () => local.schema.settings.pages ?? [];
    const [currentPageIndex, setCurrentPageIndex] = createSignal(0);
    const currentPage = () => pages()[currentPageIndex()];
    const totalPages = () => pages().length;
    const isFirstPage = () => currentPageIndex() === 0;
    const isLastPage = () => currentPageIndex() === totalPages() - 1;

    /** Elements for the current page (multi-page) or all elements (single-page). */
    const visibleElements = createMemo(() => {
        if (!isMultiPage()) return local.schema.elements;
        const page = currentPage();
        if (!page) return [];
        const idSet = new Set(page.elements);
        return local.schema.elements.filter((el) => idSet.has(el.id));
    });

    const goNext = () => {
        if (!isLastPage()) setCurrentPageIndex((i) => i + 1);
    };
    const goPrev = () => {
        if (!isFirstPage()) setCurrentPageIndex((i) => i - 1);
    };

    const handleSubmit = async (values: DynamicFormValues) => {
        setIsSubmitting(true);
        try {
            // Run submit workflows first
            const ok = await runSubmitWorkflows(values);
            if (!ok) {
                setIsSubmitting(false);
                return; // Submit workflow blocked submission
            }
            setSubmitted(true);
            local.onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    /** Check conditional visibility using current form values. */
    const isVisible = (element: FormElement): boolean => {
        if (!element.conditionalLogic?.length) return true;
        const values = getValues(formStore) as Record<string, unknown>;
        return element.conditionalLogic.every((rule) =>
            evaluateCondition(rule, values),
        );
    };

    // ── Layout element renderers (non-form-field, just structural) ──────────

    const renderLayoutElement = (element: FormElement) => (
        <LayoutField element={element} renderChild={(child) => renderElement(child)} />
    );

    /** Top-level render dispatcher that handles both layout and form-field elements. */
    const renderElement = (element: FormElement) => {
        if (!isVisible(element)) return null;
        if (isLayoutElement(element.type)) {
            // Layout elements manage their own display/gap — no extra Stack
            // wrapper so CSS Grid children (grid-column) remain direct children
            // of their grid parent.
            return renderLayoutElement(element);
        }
        return (
            <Stack gap="xs">
                {renderField(element)}
            </Stack>
        );
    };

    // ── Main Render ───────────────────────────────────────────────────────────

    const renderField = (element: FormElement) => {
        const onValue = (v: string) => {
            setValue(formStore, element.id, v);
            runFieldWorkflows(element.id);
        };

        // Merge dynamic options for select fields
        const elementWithDynOpts = () => {
            const dynOpts = dynamicOptions()[element.id];
            if (dynOpts && (element.type === 'select' || element.type === 'radio' || element.type === 'checkbox')) {
                return { ...element, options: dynOpts };
            }
            return element;
        };

        const isLoading = () => loadingFields().has(element.id);

        return (
            <Show when={!isLoading()} fallback={
                <Stack gap="sm" style={{ padding: '12px 0' }}>
                    <LinearProgress indeterminate glass />
                    <Typography variant="body-small" color="on-surface-variant">
                        Loading {element.label}...
                    </Typography>
                </Stack>
            }>
                <Field name={element.id}>
                    {(field, fieldProps) => {
                        const adapted = adaptFieldProps(fieldProps);
                        const el = elementWithDynOpts();
                        const p = {
                            mode: 'runtime' as const,
                            element: el,
                            value: () => field.value ?? '',
                            onValue,
                            error: field.error,
                            ...adapted,
                        };
                        switch (element.type) {
                            case 'text': case 'email': case 'number':
                            case 'phone': case 'url': case 'date': case 'time':
                                return <TextInputField {...p} />;
                            case 'textarea':
                                return <TextareaField {...p} />;
                            case 'select':
                                return <SelectField {...p} />;
                            case 'radio':
                                return <RadioField {...p} />;
                            case 'checkbox':
                                return <CheckboxField {...p} />;
                            case 'switch':
                                return <SwitchField {...p} />;
                            case 'file':
                                return <FileField {...p} />;
                            case 'rating':
                                return <RatingField {...p} />;
                            case 'signature':
                                return <SignatureField {...p} />;
                            default:
                                return (
                                    <Stack direction="row" align="center" gap="xs" style={{
                                        padding: '12px 16px',
                                        background: 'color-mix(in srgb, var(--m3-color-error, #B3261E) 8%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--m3-color-error, #B3261E) 20%, transparent)',
                                        'border-radius': 'var(--m3-shape-small, 8px)',
                                        color: 'var(--m3-color-error, #B3261E)',
                                        'font-size': '0.8125rem',
                                    }}>
                                        <Icon name="help-circle" size={16} />
                                        Unsupported field type: {element.type}
                                    </Stack>
                                );
                        }
                    }}
                </Field>
            </Show>
        );
    };

    return (
        <Show
            when={!submitted()}
            fallback={
                <Box padding="xl" style={{ 'text-align': 'center', color: 'var(--m3-color-on-surface, #1C1B1F)' }}>
                    <Stack align="center" gap="md">
                        <Box style={{
                            width: '72px',
                            height: '72px',
                            'border-radius': '50%',
                            background: 'color-mix(in srgb, var(--m3-color-primary, #6750A4) 10%, transparent)',
                            color: 'var(--m3-color-primary, #6750A4)',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            'margin-bottom': '8px',
                        }}>
                            <Icon name="check-circle" size={48} />
                        </Box>
                        <Typography variant="headline-small">
                            {local.schema.settings.successHeading || local.schema.settings.successMessage}
                        </Typography>
                    </Stack>
                </Box>
            }
        >
            <Form onSubmit={handleSubmit} style={{ display: 'flex', 'flex-direction': 'column', gap: '24px' }}>
                {/* Multi-page progress bar */}
                <Show when={isMultiPage()}>
                    <Stack gap="sm" style={{
                        'margin-bottom': '20px',
                        'padding-bottom': '16px',
                        'border-bottom': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                    }}>
                        <Stack direction="row" align="center" gap="xs">
                            <For each={pages()}>
                                {(page, i) => {
                                    const isActive = () => i() === currentPageIndex();
                                    const isCompleted = () => i() < currentPageIndex();
                                    return (
                                        <button
                                            type="button"
                                            style={{
                                                display: 'flex',
                                                'align-items': 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                border: 'none',
                                                'border-radius': '9999px',
                                                background: isActive()
                                                    ? 'color-mix(in srgb, var(--m3-color-primary, #6750A4) 12%, transparent)'
                                                    : 'transparent',
                                                color: isActive() || isCompleted()
                                                    ? 'var(--m3-color-primary, #6750A4)'
                                                    : 'var(--m3-color-on-surface-variant, #49454F)',
                                                'font-size': '0.75rem',
                                                'font-weight': isActive() ? '600' : '400',
                                                cursor: isCompleted() ? 'pointer' : 'default',
                                            }}
                                            onClick={() => {
                                                if (isCompleted()) setCurrentPageIndex(i());
                                            }}
                                        >
                                            <span style={{
                                                display: 'flex',
                                                'align-items': 'center',
                                                'justify-content': 'center',
                                                width: '22px',
                                                height: '22px',
                                                'border-radius': '50%',
                                                'font-size': '0.7rem',
                                                'font-weight': '600',
                                                background: isActive() || isCompleted()
                                                    ? 'var(--m3-color-primary, #6750A4)'
                                                    : 'var(--m3-color-surface-container-high, #E6E6E6)',
                                                color: isActive() || isCompleted()
                                                    ? 'var(--m3-color-on-primary, #FFFFFF)'
                                                    : 'var(--m3-color-on-surface-variant, #49454F)',
                                            }}>
                                                <Show when={isCompleted()} fallback={i() + 1}>
                                                    <Icon name="check" size={12} />
                                                </Show>
                                            </span>
                                        </button>
                                    );
                                }}
                            </For>
                        </Stack>
                        <div style={{
                            height: '4px',
                            'border-radius': '2px',
                            background: 'var(--m3-color-surface-container-high, #E6E6E6)',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                'border-radius': '2px',
                                background: 'var(--m3-color-primary, #6750A4)',
                                transition: 'width 0.3s ease',
                                width: `${((currentPageIndex() + 1) / totalPages()) * 100}%`,
                            }} />
                        </div>
                        <Typography variant="body-small" color="on-surface-variant">
                            Step {currentPageIndex() + 1} of {totalPages()}
                        </Typography>
                    </Stack>
                </Show>

                <For each={visibleElements()}>
                    {(element) => renderElement(element)}
                </For>

                <Stack direction="row" justify="end" gap="sm" style={{
                    'padding-top': '8px',
                    'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                    'margin-top': '8px',
                }}>
                    {/* Multi-page navigation */}
                    <Show when={isMultiPage()}>
                        <Button
                            variant="outlined"
                            type="button"
                            onClick={goPrev}
                            disabled={isFirstPage()}
                        >
                            <Icon name="chevron-left" size={18} />
                            Previous
                        </Button>
                    </Show>

                    <Show
                        when={!isMultiPage() || isLastPage()}
                        fallback={
                            <Button variant="filled" type="button" onClick={goNext}>
                                Next
                                <Icon name="chevron-right" size={18} />
                            </Button>
                        }
                    >
                        <Button variant="filled" type="submit" disabled={formStore.submitting || isSubmitting()}>
                            <Show when={isSubmitting()} fallback={<Icon name="check" size={18} />}>
                                <CircularProgress indeterminate size={18} strokeWidth={2} />
                            </Show>
                            {isSubmitting() ? 'Processing...' : local.schema.settings.submitButtonText}
                        </Button>
                    </Show>
                </Stack>

                {/* ── Workflow Error Toast ── */}
                <Snackbar
                    open={!!workflowError()}
                    onClose={() => setWorkflowError(null)}
                    message={workflowError() ?? ''}
                    duration={5000}
                    position="bottom"
                    glass
                />

                {/* ── Workflow Dialog (info modal) ── */}
                <Dialog
                    open={!!workflowDialog()}
                    onClose={() => setWorkflowDialog(null)}
                    title={workflowDialog()?.title ?? ''}
                    glass
                    actions={
                        <Button variant="filled" onClick={() => setWorkflowDialog(null)}>
                            OK
                        </Button>
                    }
                >
                    <Typography variant="body-medium">
                        {workflowDialog()?.message ?? ''}
                    </Typography>
                </Dialog>
            </Form>
        </Show>
    );
};
