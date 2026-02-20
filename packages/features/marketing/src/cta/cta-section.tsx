/**
 * CTA Section Component
 * Reusable call-to-action banner with gradient background
 * Uses Icon component for theme-aware coloring
 */
import { Component, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';

export interface CTAButton {
    label: string;
    href: string;
    /** Icon name to show */
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
                    background: 'linear-gradient(135deg, var(--m3-color-secondary), color-mix(in srgb, var(--m3-color-secondary-dark) 90%, black))',
                }}
            />

            {/* Glass overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(135deg, var(--glass-tint-subtle, rgba(255,255,255,0.1)) 0%, transparent 50%)',
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
                        color: 'var(--m3-color-on-secondary, white)',
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
                            color: 'var(--m3-color-on-secondary)',
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
                        <Button
                            href={props.primaryCta!.href}
                            variant="tonal"
                            size="lg"
                            style={{
                                background: 'var(--m3-color-surface-container-highest, #e6e0e9)',
                                color: 'var(--m3-color-tertiary)',
                                'font-weight': '600',
                                'box-shadow': '0 8px 24px rgba(0, 0, 0, 0.25)',
                            }}
                        >
                            {props.primaryCta!.label}
                            <Show when={props.primaryCta!.icon}>
                                <Icon
                                    name={props.primaryCta!.icon!}
                                    size={20}
                                    color="var(--m3-color-tertiary)"
                                />
                            </Show>
                        </Button>
                    </Show>

                    {/* Secondary CTA */}
                    <Show when={props.secondaryCta}>
                        <Button
                            href={props.secondaryCta!.href}
                            variant="outlined"
                            size="lg"
                            style={{
                                background: 'color-mix(in srgb, var(--m3-color-on-secondary) 10%, transparent)',
                                color: 'var(--m3-color-on-secondary)',
                                'border-color': 'color-mix(in srgb, var(--m3-color-on-secondary) 50%, transparent)',
                            }}
                        >
                            <Show when={props.secondaryCta!.icon}>
                                <Icon
                                    name={props.secondaryCta!.icon!}
                                    size={20}
                                    color="var(--m3-color-on-secondary)"
                                />
                            </Show>
                            {props.secondaryCta!.label}
                        </Button>
                    </Show>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
