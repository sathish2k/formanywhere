/**
 * Contact Sales Card Component
 * Enterprise contact/sales section with features list
 * Uses Icon component for theme-aware coloring
 */
import { Component, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { HStack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Icon } from '@formanywhere/ui/icon';

export interface ContactSalesCardProps {
    /** Badge text (e.g., "Enterprise") */
    badge?: string;
    /** Main title/description */
    title: string;
    /** Feature list */
    features: string[];
    /** CTA button label */
    ctaLabel?: string;
    /** CTA href (mailto: or link) */
    ctaHref?: string;
    /** Icon name for the card */
    iconName?: string;
    class?: string;
}

export const ContactSalesCard: Component<ContactSalesCardProps> = (props) => {
    return (
        <div
            class={props.class || ''}
            style={{
                background: 'linear-gradient(135deg, var(--m3-color-tertiary-container, rgba(139, 92, 246, 0.05)), var(--m3-color-secondary-container, rgba(0, 167, 111, 0.05)))',
                'border-radius': '24px',
                padding: '32px 48px',
                border: '1px solid var(--m3-color-outline-variant)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    'flex-direction': 'row',
                    'align-items': 'center',
                    gap: '32px',
                    'flex-wrap': 'wrap',
                }}
            >
                {/* Content */}
                <div style={{ flex: '1', 'min-width': '280px' }}>
                    {/* Badge */}
                    <Show when={props.badge}>
                        <span
                            style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: 'var(--m3-color-tertiary-container, rgba(139, 92, 246, 0.1))',
                                color: 'var(--m3-color-tertiary, #8b5cf6)',
                                'font-size': '14px',
                                'font-weight': '700',
                                'border-radius': '9999px',
                                'margin-bottom': '16px',
                            }}
                        >
                            {props.badge}
                        </span>
                    </Show>

                    {/* Title */}
                    <Typography
                        variant="headline-medium"
                        style={{
                            'font-weight': '800',
                            color: 'var(--m3-color-on-surface)',
                            'margin-bottom': '24px',
                        }}
                    >
                        {props.title}
                    </Typography>

                    {/* Features Grid */}
                    <div
                        style={{
                            display: 'grid',
                            'grid-template-columns': 'repeat(2, 1fr)',
                            gap: '12px',
                            'margin-bottom': '24px',
                        }}
                    >
                        <For each={props.features}>
                            {(feature) => (
                                <HStack gap="sm" align="center">
                                    <Icon
                                        name="check"
                                        size={16}
                                        color="var(--m3-color-primary)"
                                        style={{ 'flex-shrink': '0' }}
                                    />
                                    <Typography
                                        variant="body-small"
                                        color="on-surface-variant"
                                    >
                                        {feature}
                                    </Typography>
                                </HStack>
                            )}
                        </For>
                    </div>

                    {/* CTA Button */}
                    <Button
                        href={props.ctaHref || 'mailto:enterprise@formanywhere.com'}
                        variant="filled"
                        size="md"
                        style={{
                            background: 'var(--m3-color-tertiary, #8b5cf6)',
                            color: 'white',
                        }}
                    >
                        {props.ctaLabel || 'Contact Sales'}
                        <Icon
                            name="arrow-right"
                            size={16}
                            color="white"
                        />
                    </Button>
                </div>

                {/* Icon */}
                <Box
                    rounded="lg"
                    display="flex"
                    style={{
                        width: '128px',
                        height: '128px',
                        background: 'var(--m3-color-tertiary-container, rgba(139, 92, 246, 0.1))',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'flex-shrink': '0',
                    }}
                >
                    <Icon
                        name={props.iconName || 'building'}
                        size={64}
                        color="var(--m3-color-tertiary, #8b5cf6)"
                        style={{ opacity: '0.9' }}
                    />
                </Box>
            </div>
        </div>
    );
};

export default ContactSalesCard;
