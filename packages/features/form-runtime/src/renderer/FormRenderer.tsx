/**
 * FormRenderer — End-user form renderer.
 *
 * Composes:
 *   - useWorkflows (workflow execution, field loading, error/dialog state)
 *   - usePagination (multi-page navigation)
 *   - Shared field components from @formanywhere/domain/form
 *
 * Renders a form schema as an interactive, validatable form with
 * conditional visibility, multi-page support, and workflow integration.
 */
import { splitProps, For, createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { createForm, zodForm, setValue, getValues } from '@modular-forms/solid';
import type { FieldElementProps } from '@modular-forms/solid';
import type { TextFieldProps } from '@formanywhere/ui/textfield';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Snackbar } from '@formanywhere/ui/snackbar';
import { CircularProgress } from '@formanywhere/ui/progress';
import { LinearProgress } from '@formanywhere/ui/progress';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Dialog } from '@formanywhere/ui/dialog';
import { evaluateCondition, buildZodSchema, buildInitialValues, isLayoutElement } from '@formanywhere/domain/form';
import {
    TextInputField, TextareaField, SelectField, CheckboxField,
    RadioField, SwitchField, FileField, RatingField, SignatureField,
    LayoutField,
} from '@formanywhere/domain/form';
import { useWorkflows } from './use-workflows';
import { usePagination } from './use-pagination';

// ── Types (inlined from former fields/types.ts) ──────────────────────────────

/** All form values stored as strings — matches native HTML input behaviour. */
export type DynamicFormValues = Record<string, string>;

/**
 * Adapts modular-forms FieldElementProps to the plain event handler types
 * expected by @formanywhere/ui TextField / domain Field components.
 */
function adaptFieldProps(
    fp: FieldElementProps<DynamicFormValues, string>,
): Pick<TextFieldProps, 'ref' | 'name' | 'onInput' | 'onChange' | 'onBlur'> {
    return {
        ref: fp.ref as TextFieldProps['ref'],
        name: fp.name,
        onInput: (e: InputEvent) => (fp.onInput as (e: InputEvent) => void)(e),
        onChange: (e: Event) => (fp.onChange as (e: Event) => void)(e),
        onBlur: (e: FocusEvent) => (fp.onBlur as (e: FocusEvent) => void)(e),
    };
}

// ── Component ────────────────────────────────────────────────────────────────

export interface FormRendererProps {
    schema: FormSchema;
    formId?: string;
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

    // ── Hooks ─────────────────────────────────────────────────────────────────

    const wf = useWorkflows({
        schema: () => local.schema,
        formId: () => local.formId,
        formStore,
    });

    const pg = usePagination({
        schema: () => local.schema,
    });

    // ── Submit Handler ────────────────────────────────────────────────────────

    const handleSubmit = async (values: DynamicFormValues) => {
        wf.setIsSubmitting(true);
        try {
            const ok = await wf.runSubmitWorkflows(values);
            if (!ok) {
                wf.setIsSubmitting(false);
                return;
            }
            setSubmitted(true);
            local.onSubmit(values);
        } finally {
            wf.setIsSubmitting(false);
        }
    };

    // ── Conditional Visibility ────────────────────────────────────────────────

    const isVisible = (element: FormElement): boolean => {
        if (!element.conditionalLogic?.length) return true;
        const values = getValues(formStore) as Record<string, unknown>;
        return element.conditionalLogic.every((rule) => evaluateCondition(rule, values));
    };

    // ── Element Renderers ─────────────────────────────────────────────────────

    const renderLayoutElement = (element: FormElement) => (
        <LayoutField element={element} renderChild={(child) => renderElement(child)} />
    );

    const renderElement = (element: FormElement) => {
        if (!isVisible(element)) return null;
        if (isLayoutElement(element.type)) return renderLayoutElement(element);
        return <Stack gap="xs">{renderField(element)}</Stack>;
    };

    const renderField = (element: FormElement) => {
        const onValue = (v: string) => {
            setValue(formStore, element.id, v);
            wf.runFieldWorkflows(element.id);
        };

        const elementWithDynOpts = () => {
            const dynOpts = wf.dynamicOptions()[element.id];
            if (dynOpts && (element.type === 'select' || element.type === 'radio' || element.type === 'checkbox')) {
                return { ...element, options: dynOpts };
            }
            return element;
        };

        const isLoading = () => wf.loadingFields().has(element.id);

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

    // ── JSX ───────────────────────────────────────────────────────────────────

    return (
        <Show
            when={!submitted()}
            fallback={
                <Box padding="xl" style={{ 'text-align': 'center', color: 'var(--m3-color-on-surface, #1C1B1F)' }}>
                    <Stack align="center" gap="md">
                        <Box style={{
                            width: '72px', height: '72px', 'border-radius': '50%',
                            background: 'color-mix(in srgb, var(--m3-color-primary, #6750A4) 10%, transparent)',
                            color: 'var(--m3-color-primary, #6750A4)',
                            display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'margin-bottom': '8px',
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
                <Show when={pg.isMultiPage()}>
                    <Stack gap="sm" style={{
                        'margin-bottom': '20px', 'padding-bottom': '16px',
                        'border-bottom': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                    }}>
                        <Stack direction="row" align="center" gap="xs">
                            <For each={pg.pages()}>
                                {(page, i) => {
                                    const isActive = () => i() === pg.currentPageIndex();
                                    const isCompleted = () => i() < pg.currentPageIndex();
                                    return (
                                        <button
                                            type="button"
                                            style={{
                                                display: 'flex', 'align-items': 'center', gap: '6px',
                                                padding: '4px 10px', border: 'none', 'border-radius': '9999px',
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
                                            onClick={() => { if (isCompleted()) pg.setCurrentPageIndex(i()); }}
                                        >
                                            <span style={{
                                                display: 'flex', 'align-items': 'center', 'justify-content': 'center',
                                                width: '22px', height: '22px', 'border-radius': '50%',
                                                'font-size': '0.7rem', 'font-weight': '600',
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
                            height: '4px', 'border-radius': '2px',
                            background: 'var(--m3-color-surface-container-high, #E6E6E6)', overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%', 'border-radius': '2px',
                                background: 'var(--m3-color-primary, #6750A4)',
                                transition: 'width 0.3s ease',
                                width: `${((pg.currentPageIndex() + 1) / pg.totalPages()) * 100}%`,
                            }} />
                        </div>
                        <Typography variant="body-small" color="on-surface-variant">
                            Step {pg.currentPageIndex() + 1} of {pg.totalPages()}
                        </Typography>
                    </Stack>
                </Show>

                <For each={pg.visibleElements()}>
                    {(element) => renderElement(element)}
                </For>

                <Stack direction="row" justify="end" gap="sm" style={{
                    'padding-top': '8px',
                    'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                    'margin-top': '8px',
                }}>
                    <Show when={pg.isMultiPage()}>
                        <Button variant="outlined" type="button" onClick={pg.goPrev} disabled={pg.isFirstPage()}>
                            <Icon name="chevron-left" size={18} /> Previous
                        </Button>
                    </Show>

                    <Show
                        when={!pg.isMultiPage() || pg.isLastPage()}
                        fallback={
                            <Button variant="filled" type="button" onClick={pg.goNext}>
                                Next <Icon name="chevron-right" size={18} />
                            </Button>
                        }
                    >
                        <Button variant="filled" type="submit" disabled={formStore.submitting || wf.isSubmitting()}>
                            <Show when={wf.isSubmitting()} fallback={<Icon name="check" size={18} />}>
                                <CircularProgress indeterminate size={18} strokeWidth={2} />
                            </Show>
                            {wf.isSubmitting() ? 'Processing...' : local.schema.settings.submitButtonText}
                        </Button>
                    </Show>
                </Stack>

                {/* Workflow Error Toast */}
                <Snackbar
                    open={!!wf.workflowError()}
                    onClose={wf.clearError}
                    message={wf.workflowError() ?? ''}
                    duration={5000}
                    position="bottom"
                    glass
                />

                {/* Workflow Dialog */}
                <Dialog
                    open={!!wf.workflowDialog()}
                    onClose={wf.closeDialog}
                    title={wf.workflowDialog()?.title ?? ''}
                    glass
                    actions={
                        <Button variant="filled" onClick={wf.closeDialog}>OK</Button>
                    }
                >
                    <Typography variant="body-medium">
                        {wf.workflowDialog()?.message ?? ''}
                    </Typography>
                </Dialog>
            </Form>
        </Show>
    );
};
