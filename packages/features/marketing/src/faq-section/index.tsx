/**
 * FAQ Section Component
 * Complete FAQ section with accordion items
 */
import { Component, For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';

// Import and re-export sub-components
import { FAQItem } from './faq-item';

export { FAQItem } from './faq-item';
export type { FAQItemProps } from './faq-item';

export interface FAQ {
    q: string;
    a: string;
}

export interface FAQSectionProps {
    /** Section title */
    title?: string;
    /** Array of FAQ items */
    faqs: FAQ[];
    /** Maximum number of FAQs to show (for collapsible lists) */
    maxItems?: number;
    class?: string;
}

export const FAQSection: Component<FAQSectionProps> = (props) => {
    const displayFaqs = () => {
        if (props.maxItems && props.maxItems > 0) {
            return props.faqs.slice(0, props.maxItems);
        }
        return props.faqs;
    };

    return (
        <section class={props.class || ''}>
            {/* Title */}
            <Show when={props.title}>
                <Typography
                    variant="headline-large"
                    as="h2"
                    align="center"
                    color="on-surface"
                    style={{
                        'font-weight': '800',
                        'margin-bottom': '48px',
                    }}
                >
                    {props.title}
                </Typography>
            </Show>

            {/* FAQ Items */}
            <Stack
                direction="column"
                gap="md"
                style={{
                    'max-width': '800px',
                    margin: '0 auto',
                }}
            >
                <For each={displayFaqs()}>
                    {(faq) => <FAQItem question={faq.q} answer={faq.a} />}
                </For>
            </Stack>
        </section>
    );
};

export default FAQSection;
