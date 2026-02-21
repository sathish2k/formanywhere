/**
 * RadioField — radio button group.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import type { FieldProps } from '../field-types';

export const RadioField: Component<FieldProps> = (props) => (
    <div class="ff-radio-group">
        <Typography variant="body-medium" class="ff-field__label">
            {props.element.label}
            <Show when={props.mode === 'runtime' && props.element.required}>
                <span class="ff-field__required-mark">*</span>
            </Show>
        </Typography>
        <div class="ff-radio-group__options">
            <For each={props.element.options ?? []}>
                {(opt) => {
                    const optVal = typeof opt === 'string' ? opt : opt.value;
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    return (
                        <label class="ff-radio-group__option">
                            <input
                                type="radio"
                                name={props.element.id}
                                value={optVal}
                                checked={props.value() === optVal}
                                onChange={() => props.onValue(optVal)}
                            />
                            <span class="ff-radio-group__circle" />
                            <Typography variant="body-medium">{optLabel}</Typography>
                        </label>
                    );
                }}
            </For>
        </div>
        <Show when={props.mode === 'runtime' && props.error}>
            <Typography variant="body-small" color="error">{props.error}</Typography>
        </Show>
    </div>
);
