/**
 * SwitchField — toggle / yes-no switch.
 * Works in both 'editor' and 'runtime' modes.
 */
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Switch } from '@formanywhere/ui/switch';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import type { FieldProps } from '../field-types';

export const SwitchField: Component<FieldProps> = (props) => (
    <Stack gap="xs">
        <Stack direction="row" align="center" gap="sm">
            <Switch
                checked={props.value() === 'true'}
                onChange={(checked) => props.onValue(checked ? 'true' : 'false')}
            />
            <Typography variant="body-medium">{props.element.label}</Typography>
        </Stack>
        <Show when={props.mode === 'runtime' && props.error}>
            <Typography variant="body-small" color="error">{props.error}</Typography>
        </Show>
    </Stack>
);
