import { For, createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { TextField } from '@formanywhere/ui/textfield';
import { Select } from '@formanywhere/ui/select';
import { Checkbox } from '@formanywhere/ui/checkbox';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { validateForm, validateField } from '../validators';
import { evaluateCondition } from '../conditional';
import '../styles.scss';

export interface FormRendererProps {
    schema: FormSchema;
    onSubmit: (data: Record<string, unknown>) => void;
}

export const FormRenderer: Component<FormRendererProps> = (props) => {
    const [values, setValues] = createSignal<Record<string, unknown>>({});
    const [errors, setErrors] = createSignal<Record<string, string>>({});
    const [submitted, setSubmitted] = createSignal(false);

    const handleChange = (fieldId: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [fieldId]: value }));
        setErrors((prev) => {
            const { [fieldId]: _, ...rest } = prev;
            return rest;
        });
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        const validation = validateForm(props.schema, values());
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setSubmitted(true);
        props.onSubmit(values());
    };

    const isVisible = (element: FormElement): boolean => {
        if (!element.conditionalLogic?.length) return true;
        return element.conditionalLogic.every((rule) =>
            evaluateCondition(rule, values())
        );
    };

    const renderField = (element: FormElement) => {
        const value = () => (values()[element.id] as string) ?? '';
        const error = () => errors()[element.id];

        switch (element.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <TextField
                        variant="outlined"
                        type={element.type}
                        label={element.label}
                        placeholder={element.placeholder}
                        value={value()}
                        error={!!error()}
                        errorText={error()}
                        required={element.required}
                        onInput={(e) => handleChange(element.id, (e.target as HTMLInputElement).value)}
                    />
                );
            case 'select':
                return (
                    <Select
                        label={element.label}
                        options={[]}
                        placeholder={element.placeholder}
                        error={!!error()}
                        value={value()}
                        onChange={(val) => handleChange(element.id, val)}
                    />
                );
            case 'textarea':
                return (
                    <TextField
                        variant="outlined"
                        type="textarea"
                        label={element.label}
                        placeholder={element.placeholder}
                        value={value()}
                        error={!!error()}
                        errorText={error()}
                        required={element.required}
                        rows={4}
                        onInput={(e) => handleChange(element.id, (e.target as HTMLTextAreaElement).value)}
                    />
                );
            case 'checkbox':
                return (
                    <div class="form-renderer__checkbox-row">
                        <Checkbox
                            checked={!!values()[element.id]}
                            onChange={(checked) => handleChange(element.id, checked)}
                            label={element.label}
                        />
                        <Show when={error()}>
                            <Typography variant="body-small" color="error">{error()}</Typography>
                        </Show>
                    </div>
                );
            case 'date':
                return (
                    <TextField
                        variant="outlined"
                        type="date"
                        label={element.label}
                        value={value()}
                        error={!!error()}
                        errorText={error()}
                        required={element.required}
                        onInput={(e) => handleChange(element.id, (e.target as HTMLInputElement).value)}
                    />
                );
            case 'file':
                return (
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
                                    if (file) handleChange(element.id, file.name);
                                }}
                            />
                            <Icon name="upload" size={24} />
                            <Typography variant="body-small" color="on-surface-variant">
                                {value() || 'Click to upload or drag and drop'}
                            </Typography>
                        </label>
                        <Show when={error()}>
                            <Typography variant="body-small" color="error">{error()}</Typography>
                        </Show>
                    </div>
                );
            case 'signature':
                return (
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
                    </div>
                );
            default:
                return (
                    <div class="form-renderer__unsupported">
                        <Icon name="help-circle" size={16} />
                        Unsupported field type: {element.type}
                    </div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} class="form-renderer">
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
                    <Button variant="filled" type="submit">
                        <Icon name="check" size={18} />
                        {props.schema.settings.submitButtonText}
                    </Button>
                </div>
            </Show>
        </form>
    );
};
