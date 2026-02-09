/**
 * Pricing Card Component
 * Individual pricing plan card with price, features, and CTA
 */
import { Component, Show, createMemo } from 'solid-js';
import { Card } from '@formanywhere/ui/card';
import { Button } from '@formanywhere/ui/button';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';
import { VStack } from '@formanywhere/ui/stack';
import { FeatureList, Feature } from '../feature-list';
import { getIconPath } from '../../../utils/assets';

export interface PricingPlan {
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: Feature[];
    cta: string;
    ctaHref?: string;
    popular?: boolean;
    gradient?: boolean;
    isLifetime?: boolean;
}

export interface PricingCardProps {
    plan: PricingPlan;
    isAnnual?: boolean;
    class?: string;
}

const PLAN_ICONS: Record<string, string> = {
    Free: 'sparkle',
    Pro: 'lightning',
    Lifetime: 'heart',
};

export const PricingCard: Component<PricingCardProps> = (props) => {
    const displayPrice = createMemo(() => {
        if (props.plan.isLifetime) {
            return props.plan.monthlyPrice;
        }
        return props.isAnnual ? props.plan.annualPrice : props.plan.monthlyPrice;
    });

    const priceLabel = createMemo(() => {
        if (props.plan.monthlyPrice === 0) return 'Forever free';
        if (props.plan.isLifetime) return 'one time';
        return props.isAnnual ? '/year' : '/month';
    });

    const iconName = PLAN_ICONS[props.plan.name] || 'sparkle';

    return (
        <div
            class={`relative ${props.plan.popular ? 'pt-4' : ''} ${props.class || ''}`}
            style={{ height: '100%' }}
        >
            {/* Popular badge */}
            <Show when={props.plan.popular}>
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        'z-index': '10',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '6px 16px',
                            background: 'white',
                            color: 'var(--m3-color-primary)',
                            'font-size': '14px',
                            'font-weight': '700',
                            'border-radius': '9999px',
                            'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        Most Popular
                    </span>
                </div>
            </Show>

            {/* Card */}
            <div
                style={{
                    height: '100%',
                    'border-radius': '16px',
                    padding: '32px',
                    transition: 'all 0.3s ease',
                    background: props.plan.gradient
                        ? 'linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-primary-dark, #007867))'
                        : 'var(--m3-color-surface)',
                    color: props.plan.gradient ? 'white' : 'inherit',
                    border: props.plan.popular
                        ? '2px solid var(--m3-color-primary)'
                        : '1px solid var(--m3-color-outline-variant)',
                    'box-shadow': props.plan.popular
                        ? '0 8px 32px rgba(0, 0, 0, 0.15)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = props.plan.popular
                        ? '0 8px 32px rgba(0, 0, 0, 0.15)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
            >
                <VStack gap="md">
                    {/* Plan icon */}
                    <Box
                        rounded="md"
                        display="flex"
                        style={{
                            width: '48px',
                            height: '48px',
                            background: props.plan.gradient
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'var(--m3-color-primary-container, rgba(0, 167, 111, 0.1))',
                            'align-items': 'center',
                            'justify-content': 'center',
                        }}
                    >
                        <img
                            src={getIconPath(iconName)}
                            alt=""
                            style={{
                                width: '24px',
                                height: '24px',
                                filter: props.plan.gradient ? 'brightness(0) invert(1)' : 'none',
                            }}
                        />
                    </Box>

                    {/* Plan name & description */}
                    <div>
                        <Typography
                            variant="title-large"
                            style={{
                                'font-weight': '700',
                                'margin-bottom': '4px',
                                color: props.plan.gradient ? 'white' : 'var(--m3-color-on-surface)',
                            }}
                        >
                            {props.plan.name}
                        </Typography>
                        <Typography
                            variant="body-small"
                            style={{
                                color: props.plan.gradient
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'var(--m3-color-on-surface-variant)',
                            }}
                        >
                            {props.plan.description}
                        </Typography>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', 'align-items': 'baseline', gap: '8px' }}>
                        <Typography
                            variant="display-small"
                            style={{
                                'font-weight': '800',
                                color: props.plan.gradient ? 'white' : 'var(--m3-color-on-surface)',
                            }}
                        >
                            {props.plan.monthlyPrice === 0 ? 'Free' : `$${displayPrice()}`}
                        </Typography>
                        <Typography
                            variant="body-small"
                            style={{
                                color: props.plan.gradient
                                    ? 'rgba(255, 255, 255, 0.8)'
                                    : 'var(--m3-color-on-surface-variant)',
                            }}
                        >
                            {priceLabel()}
                        </Typography>
                    </div>

                    {/* CTA Button */}
                    <a
                        href={props.plan.ctaHref || '/signup'}
                        style={{
                            display: 'flex',
                            width: '100%',
                            padding: '12px 24px',
                            'justify-content': 'center',
                            'align-items': 'center',
                            gap: '8px',
                            'text-decoration': 'none',
                            'font-weight': '600',
                            'border-radius': '12px',
                            transition: 'all 0.2s ease',
                            background: props.plan.gradient
                                ? 'transparent'
                                : 'linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-primary-dark, #007867))',
                            color: props.plan.gradient ? 'white' : 'white',
                            border: props.plan.gradient ? '2px solid white' : 'none',
                            'box-shadow': props.plan.gradient ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }}
                        onMouseEnter={(e) => {
                            if (props.plan.gradient) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            } else {
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (props.plan.gradient) {
                                e.currentTarget.style.background = 'transparent';
                            } else {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                    >
                        {props.plan.cta}
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

                    {/* Features */}
                    <FeatureList
                        features={props.plan.features}
                        gradient={props.plan.gradient}
                    />
                </VStack>
            </div>
        </div>
    );
};

export default PricingCard;
