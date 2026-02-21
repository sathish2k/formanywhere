/**
 * RatingField — star rating input.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import type { FieldProps } from '../field-types';

export const RatingField: Component<FieldProps> = (props) => {
    const maxRating = () => (props.element as any).maxRating ?? 5;
    const currentRating = () => Number(props.value() || 0);

    return (
        <div class="ff-rating-field">
            <Typography variant="body-medium" class="ff-field__label">
                {props.element.label}
                <Show when={props.mode === 'runtime' && props.element.required}>
                    <span class="ff-field__required-mark">*</span>
                </Show>
            </Typography>
            <div class="ff-rating-field__stars">
                {Array.from({ length: maxRating() }, (_, i) => (
                    <button
                        type="button"
                        class="ff-rating-field__star"
                        classList={{ 'ff-rating-field__star--filled': i < currentRating() }}
                        onClick={() => props.onValue(String(i + 1))}
                    >
                        <Icon name="star" size={28} />
                    </button>
                ))}
            </div>
            <Show when={props.mode === 'runtime' && props.error}>
                <Typography variant="body-small" color="error">{props.error}</Typography>
            </Show>
        </div>
    );
};
