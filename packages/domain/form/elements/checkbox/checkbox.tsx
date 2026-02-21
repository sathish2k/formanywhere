/**
 * CheckboxField — single boolean toggle.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Checkbox } from '@formanywhere/ui/checkbox';
import { Typography } from '@formanywhere/ui/typography';
import type { FieldProps } from '../field-types';

export const CheckboxField: Component<FieldProps> = (props) => (
    <div class="ff-checkbox-field">
        <Checkbox
            checked={props.value() === 'true'}
            onChange={(checked) => props.onValue(checked ? 'true' : 'false')}
            label={props.element.label}
        />
        <Show when={props.mode === 'runtime' && props.error}>
            <Typography variant="body-small" color="error">{props.error}</Typography>
        </Show>
    </div>
);
