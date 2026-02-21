/**
 * FileField — file upload input.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import type { FieldProps } from '../field-types';

export const FileField: Component<FieldProps> = (props) => (
    <div class="ff-file-field">
        <Typography variant="body-medium" class="ff-field__label">
            {props.element.label}
            <Show when={props.mode === 'runtime' && props.element.required}>
                <span class="ff-field__required-mark">*</span>
            </Show>
        </Typography>
        <label class="ff-file-field__drop">
            <input
                type="file"
                class="ff-file-field__input"
                onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) props.onValue(file.name);
                }}
            />
            <Icon name="upload" size={24} />
            <Typography variant="body-small" color="on-surface-variant">
                {props.value() || 'Click to upload or drag and drop'}
            </Typography>
        </label>
        <Show when={props.mode === 'runtime' && props.error}>
            <Typography variant="body-small" color="error">{props.error}</Typography>
        </Show>
    </div>
);
