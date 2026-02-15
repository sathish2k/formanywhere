import { For, createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { createForm, zodForm, setValue, getValues } from '@modular-forms/solid';
import type { FieldStore, FieldElementProps } from '@modular-forms/solid';
import { TextField } from '@formanywhere/ui/textfield';
import type { TextFieldProps } from '@formanywhere/ui/textfield';
import { Select } from '@formanywhere/ui/select';
import { Checkbox } from '@formanywhere/ui/checkbox';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { evaluateCondition } from '../conditional';
import { buildZodSchema, buildInitialValues } from '../zodSchema';
import '../styles.scss';

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
    const zodSchema = buildZodSchema(props.schema);
    const [formStore, { Form, Field }] = createForm<DynamicFormValues>({
        validate: zodForm(zodSchema),
        validateOn: 'blur',
        revalidateOn: 'input',
        initialValues: buildInitialValues(props.schema),
    });

    const [submitted, setSubmitted] = createSignal(false);

    const handleSubmit = (values: DynamicFormValues) => {
        setSubmitted(true);
        props.onSubmit(values);
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
    ) => (
        <div class="form-renderer__signature-field">
            <Typography variant="body-medium" class="form-renderer__file-label">
                {element.label}
                <Show when={element.required}><span class="form-renderer__required-mark">*</span></Show>
            </Typography>
            <div class="form-renderer__signature-pad">
                <Icon name="pen-tool" size={24} />
                <Typography variant="body-small" color="on-surface-variant">
                    Signature pad (coming soon)
                </Typography>
            </div>
            <Show when={field.error}>
                <Typography variant="body-small" color="error">{field.error}</Typography>
            </Show>
        </div>
    );

    // ── Main Render ───────────────────────────────────────────────────────────

    const renderField = (element: FormElement) => (
        <Field name={element.id}>
            {(field, fieldProps) => {
                switch (element.type) {
                    case 'text':
                    case 'email':
                    case 'number':
                        return renderTextField(element, field, fieldProps);
                    case 'textarea':
                        return renderTextarea(element, field, fieldProps);
                    case 'select':
                        return renderSelect(element, field);
                    case 'checkbox':
                        return renderCheckbox(element, field);
                    case 'date':
                        return renderDateField(element, field, fieldProps);
                    case 'file':
                        return renderFileField(element, field);
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
                        {props.schema.settings.successMessage}
                    </Typography>
                </div>
            }
        >
            <Form onSubmit={handleSubmit} class="form-renderer">
                <For each={props.schema.elements}>
                    {(element) => (
                        <Show when={isVisible(element)}>
                            <div class="form-renderer__field">
                                {renderField(element)}
                            </div>
                        </Show>
                    )}
                </For>
                <div class="form-renderer__submit-area">
                    <Button variant="filled" type="submit" disabled={formStore.submitting}>
                        <Icon name="check" size={18} />
                        {props.schema.settings.submitButtonText}
                    </Button>
                </div>
            </Form>
        </Show>
    );
};
