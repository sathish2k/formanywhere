/**
 * FileField — file upload input.
 * Works in both 'editor' and 'runtime' modes.
 * Uses @formanywhere/ui components + inline styles for M3 styling.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import type { FieldProps } from '../field-types';

export const FileField: Component<FieldProps> = (props) => (
    <Stack gap="xs">
        <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
            {props.element.label}
            <Show when={props.mode === 'runtime' && props.element.required}>
                <span style={{ color: 'var(--m3-color-error, #B3261E)', 'margin-left': '4px' }}>*</span>
            </Show>
        </Typography>
        <label
            style={{
                display: 'flex',
                'flex-direction': 'column',
                'align-items': 'center',
                'justify-content': 'center',
                gap: '8px',
                padding: '24px 16px',
                border: '2px dashed var(--m3-color-outline-variant, #C4C7C5)',
                'border-radius': 'var(--m3-shape-medium, 12px)',
                background: 'var(--m3-color-surface-container-low, #F7F2FA)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--m3-color-primary, #6750A4)';
                e.currentTarget.style.background = 'var(--m3-color-surface-container, #EADDFF)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--m3-color-outline-variant, #C4C7C5)';
                e.currentTarget.style.background = 'var(--m3-color-surface-container-low, #F7F2FA)';
            }}
        >
            <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) props.onValue(file.name);
                }}
            />
            <Icon name="upload" size={28} color="on-surface-variant" />
            <Show
                when={props.value()}
                fallback={
                    <Stack align="center" gap="none">
                        <Typography variant="body-medium" color="on-surface-variant">
                            Click to upload or drag and drop
                        </Typography>
                        <Typography variant="body-small" color="on-surface-variant">
                            {(props.element as any).acceptedTypes || 'Any file type'}
                        </Typography>
                    </Stack>
                }
            >
                <Stack direction="row" align="center" gap="xs">
                    <Icon name="check-circle" size={18} color="primary" />
                    <Typography variant="body-medium">{props.value()}</Typography>
                </Stack>
            </Show>
        </label>
        <Show when={props.mode === 'runtime' && props.error}>
            <Typography variant="body-small" color="error">{props.error}</Typography>
        </Show>
    </Stack>
);
