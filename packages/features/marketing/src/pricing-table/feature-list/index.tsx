/**
 * Feature List Component
 * Displays a list of features with check/cross icons
 * Uses Icon component for theme-aware coloring
 */
import { Component, For } from 'solid-js';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';

export interface Feature {
    name: string;
    included: boolean;
}

export interface FeatureListProps {
    features: Feature[];
    /** Whether to use gradient styling (for highlighted cards) */
    gradient?: boolean;
    class?: string;
}

export const FeatureList: Component<FeatureListProps> = (props) => {
    return (
        <Stack direction="column" gap="sm" class={props.class || ''}>
            <For each={props.features}>
                {(feature) => (
                    <div
                        style={{
                            display: 'flex',
                            'align-items': 'flex-start',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                'border-radius': '50%',
                                'flex-shrink': '0',
                                display: 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                'margin-top': '2px',
                                background: feature.included
                                    ? props.gradient
                                        ? 'rgba(255, 255, 255, 0.2)'
                                        : 'var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.1))'
                                    : 'transparent',
                            }}
                        >
                            <Icon
                                name={feature.included ? 'check' : 'cross'}
                                size={feature.included ? 14 : 12}
                                color={
                                    feature.included
                                        ? props.gradient
                                            ? 'white'
                                            : 'var(--m3-color-tertiary)'
                                        : props.gradient
                                            ? 'rgba(255, 255, 255, 0.4)'
                                            : 'var(--m3-color-on-surface-variant)'
                                }
                            />
                        </div>
                        <Typography
                            variant="body-small"
                            style={{
                                color: feature.included
                                    ? props.gradient
                                        ? 'white'
                                        : 'var(--m3-color-on-surface)'
                                    : props.gradient
                                        ? 'rgba(255, 255, 255, 0.5)'
                                        : 'var(--m3-color-on-surface-variant)',
                                'text-decoration': feature.included ? 'none' : 'line-through',
                                'line-height': '1.4',
                            }}
                        >
                            {feature.name}
                        </Typography>
                    </div>
                )}
            </For>
        </Stack>
    );
};

export default FeatureList;
