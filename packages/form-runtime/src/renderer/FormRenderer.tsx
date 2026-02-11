import { Component, For, createSignal } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { Input } from '@formanywhere/ui/input';
import { Select } from '@formanywhere/ui/select';
import { validateForm, validateField } from '../validators';
import { evaluateCondition } from '../conditional';

interface FormRendererProps {
    schema: FormSchema;
    onSubmit: (data: Record<string, unknown>) => void;
}

export const FormRenderer: Component<FormRendererProps> = (props) => {
    const [values, setValues] = createSignal<Record<string, unknown>>({});
    const [errors, setErrors] = createSignal<Record<string, string>>({});
    const [submitted, setSubmitted] = createSignal(false);

    const handleChange = (fieldId: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [fieldId]: value }));
        // Clear error on change
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
        const value = () => values()[element.id] as string ?? '';
        const error = () => errors()[element.id];

        switch (element.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <Input
                        type={element.type}
                        label={element.label}
                        placeholder={element.placeholder}
                        value={value()}
                        error={!!error()}
                        required={element.required}
                        onInput={(e) => handleChange(element.id, (e.target as HTMLInputElement).value)}
                    />
                );
            case 'select':
                return (
                    <Select
                        label={element.label}
                        options={[]} // Options would come from element config
                        placeholder={element.placeholder}
                        error={!!error()}
                        value={value()}
                        onChange={(value) => handleChange(element.id, value)}
                    />
                );
            case 'textarea':
                return (
                    <div>
                        <label>{element.label}</label>
                        <textarea
                            placeholder={element.placeholder}
                            value={value()}
                            onInput={(e) => handleChange(element.id, (e.target as HTMLTextAreaElement).value)}
                        />
                        {error() && <span data-error>{error()}</span>}
                    </div>
                );
            case 'checkbox':
                return (
                    <label>
                        <input
                            type="checkbox"
                            checked={!!values()[element.id]}
                            onChange={(e) => handleChange(element.id, e.currentTarget.checked)}
                        />
                        {element.label}
                    </label>
                );
            default:
                return <div>Unsupported field type: {element.type}</div>;
        }
    };

    return (
        <form onSubmit={handleSubmit} data-form-renderer>
            {submitted() ? (
                <div data-success>
                    {props.schema.settings.successMessage}
                </div>
            ) : (
                <>
                    <For each={props.schema.elements}>
                        {(element) => (
                            isVisible(element) && (
                                <div data-field>
                                    {renderField(element)}
                                </div>
                            )
                        )}
                    </For>
                    <button type="submit">
                        {props.schema.settings.submitButtonText}
                    </button>
                </>
            )}
        </form>
    );
};
