/**
 * Runtime-only types and utilities for FormRenderer.
 * Field component props (FieldProps, LayoutFieldProps) live in @formanywhere/domain/form.
 */
import type { FieldElementProps } from '@modular-forms/solid';
import type { TextFieldProps } from '@formanywhere/ui/textfield';

/** All form values stored as strings — matches native HTML input behaviour. */
export type DynamicFormValues = Record<string, string>;

/**
 * Adapts modular-forms FieldElementProps to the plain event handler types
 * expected by @formanywhere/ui TextField / domain Field components.
 */
export function adaptFieldProps(
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
