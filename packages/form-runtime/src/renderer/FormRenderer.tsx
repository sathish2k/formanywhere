import { splitProps, For, createSignal, Show, createMemo, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement, FormPage } from '@formanywhere/shared/types';
import { createForm, zodForm, setValue, getValues } from '@modular-forms/solid';
import type { FieldStore, FieldElementProps } from '@modular-forms/solid';
import { TextField } from '@formanywhere/ui/textfield';
import type { TextFieldProps } from '@formanywhere/ui/textfield';
import { Select } from '@formanywhere/ui/select';
import { Checkbox } from '@formanywhere/ui/checkbox';
import { Switch } from '@formanywhere/ui/switch';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { evaluateCondition } from '../conditional';
import { buildZodSchema, buildInitialValues } from '../zodSchema';
import './styles.scss';

/** All form values stored as strings — matches native HTML input behaviour. */
type DynamicFormValues = Record<string, string>;

/**
 * Adapt modular-forms' `FieldElementProps` (which use `JSX.EventHandler`
 * with strict `currentTarget` typing) to the plain event handler types
 * expected by our `@formanywhere/ui` TextField component.
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

    // ── Field Renderers ───────────────────────────────────────────────────────

    const renderTextField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type={element.type as any}
                label={element.label}
                placeholder={element.placeholder}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
            />
        );
    };

    const renderTextarea = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type="textarea"
                label={element.label}
                placeholder={element.placeholder}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
                rows={4}
            />
        );
    };

    const renderSelect = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => (
        <Select
            label={element.label}
            options={
                element.options?.map((opt) =>
                    typeof opt === 'string'
                        ? { label: opt, value: opt }
                        : { label: (opt as any).label ?? String(opt), value: (opt as any).value ?? String(opt) },
                ) ?? []
            }
            placeholder={element.placeholder}
            value={field.value ?? ''}
            onChange={(val) => setValue(formStore, element.id, val)}
            error={!!field.error}
            errorText={field.error}
        />
    );

    const renderCheckbox = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => (
        <div class="form-renderer__checkbox-row">
            <Checkbox
                checked={field.value === 'true'}
                onChange={(checked) => setValue(formStore, element.id, checked ? 'true' : 'false')}
                label={element.label}
            />
            <Show when={field.error}>
                <Typography variant="body-small" color="error">{field.error}</Typography>
            </Show>
        </div>
    );

    const renderDateField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type="date"
                label={element.label}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
            />
        );
    };

    const renderFileField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => (
        <div class="form-renderer__file-field">
            <Typography variant="body-medium" class="form-renderer__file-label">
                {element.label}
                <Show when={element.required}><span class="form-renderer__required-mark">*</span></Show>
            </Typography>
            <label class="form-renderer__file-drop">
                <input
                    type="file"
                    class="form-renderer__file-input"
                    onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) setValue(formStore, element.id, file.name);
                    }}
                />
                <Icon name="upload" size={24} />
                <Typography variant="body-small" color="on-surface-variant">
                    {field.value || 'Click to upload or drag and drop'}
                </Typography>
            </label>
            <Show when={field.error}>
                <Typography variant="body-small" color="error">{field.error}</Typography>
            </Show>
        </div>
    );

    const renderSignatureField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => {
        let canvasRef: HTMLCanvasElement | undefined;
        let isDrawing = false;

        const setupCanvas = (canvas: HTMLCanvasElement) => {
            canvasRef = canvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas resolution to match display
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--m3-color-on-surface').trim() || '#1C1B1F';

            // Restore existing signature if field has data
            if (field.value) {
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
                img.src = field.value;
            }

            const getPos = (e: MouseEvent | TouchEvent) => {
                const r = canvas.getBoundingClientRect();
                if ('touches' in e) {
                    return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
                }
                return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
            };

            const startDraw = (e: MouseEvent | TouchEvent) => {
                isDrawing = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            };
            const draw = (e: MouseEvent | TouchEvent) => {
                if (!isDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            };
            const endDraw = () => {
                if (!isDrawing) return;
                isDrawing = false;
                // Save as data URL
                setValue(formStore, element.id, canvas.toDataURL('image/png'));
            };

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', endDraw);
            canvas.addEventListener('mouseleave', endDraw);
            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', draw, { passive: false });
            canvas.addEventListener('touchend', endDraw);

            onCleanup(() => {
                canvas.removeEventListener('mousedown', startDraw);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', endDraw);
                canvas.removeEventListener('mouseleave', endDraw);
                canvas.removeEventListener('touchstart', startDraw);
                canvas.removeEventListener('touchmove', draw);
                canvas.removeEventListener('touchend', endDraw);
            });
        };

        const clearSignature = () => {
            if (!canvasRef) return;
            const ctx = canvasRef.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
            setValue(formStore, element.id, '');
        };

        return (
            <div class="form-renderer__signature-field">
                <Typography variant="body-medium" class="form-renderer__file-label">
                    {element.label}
                    <Show when={element.required}><span class="form-renderer__required-mark">*</span></Show>
                </Typography>
                <div class="form-renderer__signature-pad">
                    <canvas
                        ref={(el) => onMount(() => setupCanvas(el))}
                        class="form-renderer__signature-canvas"
                    />
                    <button type="button" class="form-renderer__signature-clear" onClick={clearSignature}>
                        <Icon name="cross" size={14} />
                        Clear
                    </button>
                </div>
                <Show when={field.error}>
                    <Typography variant="body-small" color="error">{field.error}</Typography>
                </Show>
            </div>
        );
    };

    // ── Additional field renderers ──────────────────────────────────────────

    const renderPhoneField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type="tel"
                label={element.label}
                placeholder={element.placeholder || '+1 (555) 000-0000'}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
            />
        );
    };

    const renderUrlField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type="url"
                label={element.label}
                placeholder={element.placeholder || 'https://'}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
            />
        );
    };

    const renderTimeField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
        fieldProps: FieldElementProps<DynamicFormValues, string>,
    ) => {
        const adapted = adaptFieldProps(fieldProps);
        return (
            <TextField
                {...adapted}
                variant="outlined"
                type="time"
                label={element.label}
                value={field.value ?? ''}
                error={!!field.error}
                errorText={field.error}
                required={element.required}
            />
        );
    };

    const renderRadioField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => (
        <div class="form-renderer__radio-group">
            <Typography variant="body-medium" class="form-renderer__radio-label">
                {element.label}
                <Show when={element.required}><span class="form-renderer__required-mark">*</span></Show>
            </Typography>
            <div class="form-renderer__radio-options">
                <For each={element.options ?? []}>
                    {(opt) => {
                        const optVal = typeof opt === 'string' ? opt : opt.value;
                        const optLabel = typeof opt === 'string' ? opt : opt.label;
                        return (
                            <label class="form-renderer__radio-option">
                                <input
                                    type="radio"
                                    name={element.id}
                                    value={optVal}
                                    checked={field.value === optVal}
                                    onChange={() => setValue(formStore, element.id, optVal)}
                                />
                                <span class="form-renderer__radio-circle" />
                                <Typography variant="body-medium">{optLabel}</Typography>
                            </label>
                        );
                    }}
                </For>
            </div>
            <Show when={field.error}>
                <Typography variant="body-small" color="error">{field.error}</Typography>
            </Show>
        </div>
    );

    const renderSwitchField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => (
        <div class="form-renderer__switch-row">
            <Switch
                checked={field.value === 'true'}
                onChange={(checked) => setValue(formStore, element.id, checked ? 'true' : 'false')}
            />
            <Typography variant="body-medium">{element.label}</Typography>
            <Show when={field.error}>
                <Typography variant="body-small" color="error">{field.error}</Typography>
            </Show>
        </div>
    );

    const renderRatingField = (
        element: FormElement,
        field: FieldStore<DynamicFormValues, string>,
    ) => {
        const maxRating = (element as any).maxRating ?? 5;
        const currentRating = () => Number(field.value || 0);
        return (
            <div class="form-renderer__rating-field">
                <Typography variant="body-medium" class="form-renderer__file-label">
                    {element.label}
                    <Show when={element.required}><span class="form-renderer__required-mark">*</span></Show>
                </Typography>
                <div class="form-renderer__rating-stars">
                    {Array.from({ length: maxRating }, (_, i) => (
                        <button
                            type="button"
                            class="form-renderer__star"
                            classList={{ 'form-renderer__star--filled': i < currentRating() }}
                            onClick={() => setValue(formStore, element.id, String(i + 1))}
                        >
                            <Icon name={i < currentRating() ? 'star' : 'star'} size={28} />
                        </button>
                    ))}
                </div>
                <Show when={field.error}>
                    <Typography variant="body-small" color="error">{field.error}</Typography>
                </Show>
            </div>
        );
    };

    // ── Layout element renderers (non-form-field, just structural) ──────────

    const renderLayoutElement = (element: FormElement) => {
        const children = element.elements ?? [];
        switch (element.type) {
            case 'heading':
                return (
                    <Typography variant="headline-small" class="form-renderer__heading">
                        {element.label}
                    </Typography>
                );
            case 'text-block':
                return (
                    <Typography variant="body-medium" color="on-surface-variant" class="form-renderer__text-block">
                        {element.label}
                    </Typography>
                );
            case 'divider':
                return <hr class="form-renderer__divider" />;
            case 'spacer':
                return <div class="form-renderer__spacer" style={{ height: `${(element as any).height ?? 24}px` }} />;
            case 'logo':
                return (
                    <Show when={(element as any).src}>
                        <img class="form-renderer__logo" src={(element as any).src} alt={element.label || 'Logo'} />
                    </Show>
                );
            case 'grid':
                return (
                    <div class="form-renderer__grid" style={{ 'grid-template-columns': `repeat(${(element as any).columns ?? 12}, 1fr)` }}>
                        <For each={children}>
                            {(child) => renderElement(child)}
                        </For>
                    </div>
                );
            case 'grid-column':
                return (
                    <div class="form-renderer__grid-column" style={{ 'grid-column': `span ${(element as any).span ?? 6}` }}>
                        <For each={children}>
                            {(child) => renderElement(child)}
                        </For>
                    </div>
                );
            case 'container':
            case 'section':
            case 'card':
                return (
                    <div class={`form-renderer__${element.type}`}>
                        <Show when={element.label && element.type !== 'container'}>
                            <Typography variant="title-small" class="form-renderer__section-title">
                                {element.label}
                            </Typography>
                        </Show>
                        <For each={children}>
                            {(child) => renderElement(child)}
                        </For>
                    </div>
                );
            default:
                return null;
        }
    };

    /** Whether an element type is a layout (non-form-field) type. */
    const isLayoutType = (type: string) =>
        ['container', 'grid', 'grid-column', 'section', 'card', 'heading', 'text-block', 'divider', 'spacer', 'logo'].includes(type);

    /** Top-level render dispatcher that handles both layout and form-field elements. */
    const renderElement = (element: FormElement) => {
        if (!isVisible(element)) return null;
        if (isLayoutType(element.type)) {
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

    const renderField = (element: FormElement) => (
        <Field name={element.id}>
            {(field, fieldProps) => {
                switch (element.type) {
                    case 'text':
                        return renderTextField(element, field, fieldProps);
                    case 'email':
                        return renderTextField(element, field, fieldProps);
                    case 'number':
                        return renderTextField(element, field, fieldProps);
                    case 'phone':
                        return renderPhoneField(element, field, fieldProps);
                    case 'url':
                        return renderUrlField(element, field, fieldProps);
                    case 'textarea':
                        return renderTextarea(element, field, fieldProps);
                    case 'select':
                        return renderSelect(element, field);
                    case 'radio':
                        return renderRadioField(element, field);
                    case 'checkbox':
                        return renderCheckbox(element, field);
                    case 'switch':
                        return renderSwitchField(element, field);
                    case 'date':
                        return renderDateField(element, field, fieldProps);
                    case 'time':
                        return renderTimeField(element, field, fieldProps);
                    case 'file':
                        return renderFileField(element, field);
                    case 'rating':
                        return renderRatingField(element, field);
                    case 'signature':
                        return renderSignatureField(element, field);
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
                                        <span class="form-renderer__step-label">{page.title}</span>
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
