/**
 * RadioField — radio button group.
 * Works in both 'editor' and 'runtime' modes.
 * Uses @formanywhere/ui Radio & RadioGroup for M3 styling.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Radio, RadioGroup } from '@formanywhere/ui/radio';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import type { FieldProps } from '../field-types';

export const RadioField: Component<FieldProps> = (props) => {
    const options = () => props.element.options ?? [];

    return (
        <Stack gap="xs">
            <Typography variant="body-medium" style={{ 'font-weight': '500' }}>
                {props.element.label}
                <Show when={props.mode === 'runtime' && props.element.required}>
                    <span style={{ color: 'var(--m3-color-error, #B3261E)', 'margin-left': '4px' }}>*</span>
                </Show>
            </Typography>
            <RadioGroup
                name={props.element.id}
                value={props.value() ?? ''}
                onChange={(val) => props.onValue(val)}
                style={{ display: 'flex', 'flex-direction': 'column', gap: '4px' }}
            >
                {options().map((opt) => {
                    const optVal = typeof opt === 'string' ? opt : opt.value;
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    return <Radio value={optVal} label={optLabel} />;
                })}
            </RadioGroup>
            <Show when={props.mode === 'runtime' && props.error}>
                <Typography variant="body-small" color="error">{props.error}</Typography>
            </Show>
        </Stack>
    );
};
