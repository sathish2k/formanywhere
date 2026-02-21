/**
 * SelectField — dropdown / select input.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { Select } from '@formanywhere/ui/select';
import type { FieldProps } from '../field-types';

export const SelectField: Component<FieldProps> = (props) => (
    <Select
        label={props.element.label}
        options={
            props.element.options?.map((opt) =>
                typeof opt === 'string'
                    ? { label: opt, value: opt }
                    : { label: (opt as any).label ?? String(opt), value: (opt as any).value ?? String(opt) },
            ) ?? []
        }
        placeholder={props.element.placeholder}
        value={props.value()}
        onChange={(val) => props.onValue(val)}
        error={props.mode === 'runtime' && !!props.error}
        errorText={props.mode === 'runtime' ? props.error : undefined}
    />
);
