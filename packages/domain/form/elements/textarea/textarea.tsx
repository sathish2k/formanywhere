/**
 * TextareaField — multi-line text input.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { TextField } from '@formanywhere/ui/textfield';
import type { FieldProps } from '../field-types';

export const TextareaField: Component<FieldProps> = (props) => (
    <TextField
        ref={props.ref as any}
        name={props.name}
        onInput={
            props.mode === 'runtime'
                ? (props.onInput as any)
                : (e: InputEvent) => props.onValue((e.target as HTMLTextAreaElement).value)
        }
        onChange={props.onChange as any}
        onBlur={props.onBlur as any}
        variant="outlined"
        type="textarea"
        label={props.element.label}
        placeholder={props.element.placeholder}
        value={props.value()}
        error={props.mode === 'runtime' && !!props.error}
        errorText={props.mode === 'runtime' ? props.error : undefined}
        required={props.mode === 'runtime' ? props.element.required : false}
        rows={4}
    />
);
