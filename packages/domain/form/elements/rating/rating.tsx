/**
 * RatingField — star rating input.
 * Works in both 'editor' and 'runtime' modes.
 * Uses @formanywhere/ui Icon for M3 star icons with inline styles.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import type { FieldProps } from '../field-types';

export const RatingField: Component<FieldProps> = (props) => {
    const maxRating = () => (props.element as any).maxRating ?? 5;
    const currentRating = () => Number(props.value() || 0);

    return (
        <Stack gap="xs">
            <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
                {props.element.label}
                <Show when={props.mode === 'runtime' && props.element.required}>
                    <span style={{ color: 'var(--m3-color-error, #B3261E)', 'margin-left': '4px' }}>*</span>
                </Show>
            </Typography>
            <div style={{
                display: 'flex',
                gap: '4px',
                'align-items': 'center',
            }}>
                {Array.from({ length: maxRating() }, (_, i) => {
                    const filled = () => i < currentRating();
                    return (
                        <button
                            type="button"
                            onClick={() => props.onValue(String(i + 1))}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px',
                                cursor: 'pointer',
                                'border-radius': '50%',
                                display: 'inline-flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                transition: 'transform 0.15s ease, color 0.15s ease',
                                color: filled()
                                    ? 'var(--m3-color-primary, #6750A4)'
                                    : 'var(--m3-color-outline, #79747E)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <Icon name={filled() ? 'star' : 'star'} size={28} />
                        </button>
                    );
                })}
            </div>
            <Show when={props.mode === 'runtime' && props.error}>
                <Typography variant="body-small" color="error">{props.error}</Typography>
            </Show>
        </Stack>
    );
};
