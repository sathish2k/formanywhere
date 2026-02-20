/**
 * Pricing Table Component
 * Complete pricing section with cards and billing toggle
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { Stack } from '@formanywhere/ui/stack';

// Import and re-export sub-components
import { PricingCard, PricingPlan } from './pricing-card';
import { BillingToggle } from './billing-toggle';
import { FeatureList, Feature } from './feature-list';

export { PricingCard } from './pricing-card';
export type { PricingPlan } from './pricing-card';
export { BillingToggle } from './billing-toggle';
export { FeatureList } from './feature-list';
export type { Feature } from './feature-list';

export interface PricingTableProps {
    /** Section title */
    title?: string;
    /** Section subtitle */
    subtitle?: string;
    /** Badge label shown above title */
    badge?: string;
    /** Array of pricing plans */
    plans: PricingPlan[];
    /** Whether to show billing toggle */
    showBillingToggle?: boolean;
    /** Savings percentage for annual billing */
    savingsPercent?: number;
    class?: string;
}

export const PricingTable: Component<PricingTableProps> = (props) => {
    const [isAnnual, setIsAnnual] = createSignal(false);

    return (
        <section class={props.class || ''}>
            {/* Header */}
            <div style={{ 'text-align': 'center', 'margin-bottom': '48px' }}>
                {/* Badge */}
                <Show when={props.badge}>
                    <Chip
                        variant="label"
                        label={props.badge!}
                        style={{
                            background: 'var(--m3-color-secondary-container)',
                            color: 'var(--m3-color-on-secondary-container)',
                            border: 'none',
                            'margin-bottom': '24px',
                        }}
                    />
                </Show>

                {/* Title */}
                <Show when={props.title}>
                    <Typography
                        variant="display-medium"
                        as="h2"
                        align="center"
                        color="on-surface"
                        style={{ 'margin-bottom': '16px' }}
                    >
                        {props.title}
                    </Typography>
                </Show>

                {/* Subtitle */}
                <Show when={props.subtitle}>
                    <Typography
                        variant="body-large"
                        color="on-surface-variant"
                        align="center"
                        style={{
                            'max-width': '600px',
                            margin: '0 auto 32px',
                        }}
                    >
                        {props.subtitle}
                    </Typography>
                </Show>

                {/* Billing Toggle */}
                <Show when={props.showBillingToggle}>
                    <BillingToggle
                        isAnnual={isAnnual()}
                        onChange={setIsAnnual}
                        savingsPercent={props.savingsPercent}
                    />
                </Show>
            </div>

            {/* Pricing Cards Grid */}
            <div
                style={{
                    display: 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    'max-width': '1200px',
                    margin: '0 auto',
                }}
            >
                <For each={props.plans}>
                    {(plan) => (
                        <PricingCard plan={plan} isAnnual={isAnnual()} />
                    )}
                </For>
            </div>
        </section>
    );
};

export default PricingTable;
