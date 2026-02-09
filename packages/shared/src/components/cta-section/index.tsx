/**
 * CTA Section Component
 * Reusable call-to-action banner with gradient background
 */
import { Component, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { getIconPath } from '../../utils/assets';

export interface CTAButton {
    label: string;
    href: string;
    /** Icon name to show after label */
    icon?: string;
}

export interface CTASectionProps {
    /** Main headline */
    title: string;
    /** Supporting text */
    description?: string;
    /** Primary CTA button */
    primaryCta?: CTAButton;
    /** Secondary CTA button */
    secondaryCta?: CTAButton;
    class?: string;
}

export const CTASection: Component<CTASectionProps> = (props) => {
    return (
        <section
            class={props.class || ''}
            style={{
                position: 'relative',
                padding: '80px 16px',
                overflow: 'hidden',
            }}
        >
            {/* Gradient background */}
            <div
                style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-primary-dark, #007867))',
                }}
            />

            {/* Glass overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    opacity: '0.3',
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'relative',
                    'max-width': '800px',
                    margin: '0 auto',
                    'text-align': 'center',
                }}
            >
                <Typography
                    variant="headline-large"
                    as="h2"
                    align="center"
                    style={{
                        color: 'var(--m3-color-on-primary, white)',
                        'font-weight': '800',
                        'margin-bottom': '16px',
                    }}
                >
                    {props.title}
                </Typography>

                <Show when={props.description}>
                    <Typography
                        variant="body-large"
                        align="center"
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            'margin-bottom': '40px',
                            'max-width': '600px',
                            margin: '0 auto 40px',
                        }}
                    >
                        {props.description}
                    </Typography>
                </Show>

                {/* CTA Buttons */}
                <div
                    style={{
                        display: 'flex',
                        'flex-direction': 'row',
                        gap: '16px',
                        'justify-content': 'center',
                        'flex-wrap': 'wrap',
                    }}
                >
                    {/* Primary CTA */}
                    <Show when={props.primaryCta}>
                        <a
                            href={props.primaryCta!.href}
                            style={{
                                display: 'inline-flex',
                                'align-items': 'center',
                                gap: '8px',
                                padding: '12px 32px',
                                background: 'var(--m3-color-surface)',
                                color: 'var(--m3-color-primary)',
                                'font-weight': '600',
                                'border-radius': '12px',
                                'text-decoration': 'none',
                                'box-shadow': '0 8px 24px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            {props.primaryCta!.label}
                            <Show when={props.primaryCta!.icon}>
                                <img
                                    src={getIconPath(props.primaryCta!.icon!)}
                                    alt=""
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                    }}
                                />
                            </Show>
                        </a>
                    </Show>

                    {/* Secondary CTA */}
                    <Show when={props.secondaryCta}>
                        <a
                            href={props.secondaryCta!.href}
                            style={{
                                display: 'inline-flex',
                                'align-items': 'center',
                                gap: '8px',
                                padding: '12px 32px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                'font-weight': '600',
                                'border-radius': '12px',
                                'text-decoration': 'none',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <Show when={props.secondaryCta!.icon}>
                                <img
                                    src={getIconPath(props.secondaryCta!.icon!)}
                                    alt=""
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        filter: 'brightness(0) invert(1)',
                                    }}
                                />
                            </Show>
                            {props.secondaryCta!.label}
                        </a>
                    </Show>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
