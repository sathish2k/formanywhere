import { splitProps, For, createSignal, Show, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { createForm, zodForm, setValue, getValues } from '@modular-forms/solid';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { evaluateCondition } from '../conditional';
import { buildZodSchema, buildInitialValues } from '../zodSchema';
import { isLayoutElement } from '@formanywhere/domain/form';
import type { DynamicFormValues } from '../fields/types';
import { adaptFieldProps } from '../fields/types';
import {
    TextInputField, TextareaField, SelectField, CheckboxField,
    RadioField, SwitchField, FileField, RatingField, SignatureField,
    LayoutField,
} from '@formanywhere/domain/form';
import './styles.scss';

export interface FormRendererProps {
    schema: FormSchema;
    onSubmit: (data: Record<string, unknown>) => void;
}

export const FormRenderer: Component<FormRendererProps> = (props) => {
    const [local] = splitProps(props, ['schema', 'onSubmit']);
    const zodSchema = buildZodSchema(local.schema);
    const [formStore, { Form, Field }] = createForm<DynamicFormValues>({
        validate: zodForm(zodSchema),
        validateOn: 'blur',
        revalidateOn: 'input',
        initialValues: buildInitialValues(local.schema),
    });

    const [submitted, setSubmitted] = createSignal(false);

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

    const handleSubmit = (values: DynamicFormValues) => {
        setSubmitted(true);
        local.onSubmit(values);
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
            return (
                <div class="form-renderer__field">
                    {renderLayoutElement(element)}
                </div>
            );
        }
        return (
            <div class="form-renderer__field">
                {renderField(element)}
            </div>
        );
    };

    // ── Main Render ───────────────────────────────────────────────────────────

    const renderField = (element: FormElement) => {
        const onValue = (v: string) => setValue(formStore, element.id, v);
        return (
            <Field name={element.id}>
                {(field, fieldProps) => {
                    const adapted = adaptFieldProps(fieldProps);
                    const p = {
                        mode: 'runtime' as const,
                        element,
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
                                <div class="form-renderer__unsupported">
                                    <Icon name="help-circle" size={16} />
                                    Unsupported field type: {element.type}
                                </div>
                            );
                    }
                }}
            </Field>
        );
    };

    return (
        <Show
            when={!submitted()}
            fallback={
                <div class="form-renderer__success">
                    <div class="form-renderer__success-icon">
                        <Icon name="check-circle" size={48} />
                    </div>
                    <Typography variant="headline-small">
                        {local.schema.settings.successHeading || local.schema.settings.successMessage}
                    </Typography>
                </div>
            }
        >
            <Form onSubmit={handleSubmit} class="form-renderer">
                {/* Multi-page progress bar */}
                <Show when={isMultiPage()}>
                    <div class="form-renderer__progress">
                        <div class="form-renderer__progress-steps">
                            <For each={pages()}>
                                {(page, i) => (
                                    <button
                                        type="button"
                                        class="form-renderer__step"
                                        classList={{
                                            'form-renderer__step--active': i() === currentPageIndex(),
                                            'form-renderer__step--completed': i() < currentPageIndex(),
                                        }}
                                        onClick={() => {
                                            if (i() < currentPageIndex()) setCurrentPageIndex(i());
                                        }}
                                    >
                                        <span class="form-renderer__step-dot">
                                            <Show when={i() < currentPageIndex()} fallback={i() + 1}>
                                                <Icon name="check" size={12} />
                                            </Show>
                                        </span>
                                    </button>
                                )}
                            </For>
                        </div>
                        <div class="form-renderer__progress-bar">
                            <div
                                class="form-renderer__progress-fill"
                                style={{ width: `${((currentPageIndex() + 1) / totalPages()) * 100}%` }}
                            />
                        </div>
                        <Typography variant="body-small" color="on-surface-variant">
                            Step {currentPageIndex() + 1} of {totalPages()}
                        </Typography>
                    </div>
                </Show>

                <For each={visibleElements()}>
                    {(element) => renderElement(element)}
                </For>

                <div class="form-renderer__submit-area">
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
                        <Button variant="filled" type="submit" disabled={formStore.submitting}>
                            <Icon name="check" size={18} />
                            {local.schema.settings.submitButtonText}
                        </Button>
                    </Show>
                </div>
            </Form>
        </Show>
    );
};
