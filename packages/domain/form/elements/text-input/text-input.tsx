/**
 * TextInputField — handles text, email, number, phone, url, date, time.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { TextField } from '@formanywhere/ui/textfield';
import type { FieldProps } from '../field-types';

const INPUT_TYPE_MAP: Record<string, string> = {
    text: 'text',
    email: 'email',
    number: 'number',
    phone: 'tel',
    url: 'url',
    date: 'date',
    time: 'time',
};

const PLACEHOLDER_MAP: Record<string, string> = {
    phone: '+1 (555) 000-0000',
    url: 'https://',
    number: '0',
};

export const TextInputField: Component<FieldProps> = (props) => (
    <TextField
        ref={props.ref as any}
        name={props.name}
        onInput={
            props.mode === 'runtime'
                ? (props.onInput as any)
                : (e: InputEvent) => props.onValue((e.target as HTMLInputElement).value)
        }
        onChange={props.onChange as any}
        onBlur={props.onBlur as any}
        variant="outlined"
        type={(INPUT_TYPE_MAP[props.element.type] ?? props.element.type) as any}
        label={props.element.label}
        placeholder={props.element.placeholder || PLACEHOLDER_MAP[props.element.type] || ''}
        value={props.value()}
        error={props.mode === 'runtime' && !!props.error}
        errorText={props.mode === 'runtime' ? props.error : undefined}
        required={props.mode === 'runtime' ? props.element.required : false}
    />
);
