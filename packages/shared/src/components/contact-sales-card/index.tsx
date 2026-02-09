/**
 * Contact Sales Card Component
 * Enterprise contact/sales section with features list
 */
import { Component, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Chip } from '@formanywhere/ui/chip';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { getIconPath } from '../../utils/assets';

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
                                    <img
                                        src={getIconPath('check')}
                                        alt=""
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            'flex-shrink': '0',
                                        }}
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
                    <a
                        href={props.ctaHref || 'mailto:enterprise@formanywhere.com'}
                        style={{
                            display: 'inline-flex',
                            'align-items': 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'var(--m3-color-tertiary, #8b5cf6)',
                            color: 'white',
                            'font-weight': '600',
                            'border-radius': '12px',
                            'text-decoration': 'none',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {props.ctaLabel || 'Contact Sales'}
                        <img
                            src={getIconPath('arrow-right')}
                            alt=""
                            style={{
                                width: '16px',
                                height: '16px',
                                filter: 'brightness(0) invert(1)',
                            }}
                        />
                    </a>
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
                    <img
                        src={getIconPath(props.iconName || 'building')}
                        alt=""
                        style={{
                            width: '64px',
                            height: '64px',
                            opacity: '0.9',
                        }}
                    />
                </Box>
            </div>
        </div>
    );
};

export default ContactSalesCard;
