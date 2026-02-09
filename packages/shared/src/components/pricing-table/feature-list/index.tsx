/**
 * Feature List Component
 * Displays a list of features with check/cross icons
 */
import { Component, For } from 'solid-js';
import { VStack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { getIconPath } from '../../../utils/assets';

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
        <VStack gap="sm" class={props.class || ''}>
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
                                        : 'var(--m3-color-primary-container, rgba(0, 167, 111, 0.1))'
                                    : 'transparent',
                            }}
                        >
                            <img
                                src={getIconPath(feature.included ? 'check' : 'cross')}
                                alt=""
                                style={{
                                    width: feature.included ? '14px' : '12px',
                                    height: feature.included ? '14px' : '12px',
                                    filter: feature.included
                                        ? props.gradient
                                            ? 'brightness(0) invert(1)'
                                            : 'none'
                                        : props.gradient
                                            ? 'brightness(0) invert(1) opacity(0.4)'
                                            : 'opacity(0.5)',
                                }}
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
        </VStack>
    );
};

export default FeatureList;
