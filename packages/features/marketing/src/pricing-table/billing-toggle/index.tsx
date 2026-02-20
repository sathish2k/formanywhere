/**
 * Billing Toggle Component
 * Monthly/Annual toggle switch with "Save X%" badge
 */
import { Component, createSignal, createEffect, JSX } from 'solid-js';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';

export interface BillingToggleProps {
    /** Current billing period */
    isAnnual?: boolean;
    /** Callback when billing period changes */
    onChange?: (isAnnual: boolean) => void;
    /** Savings percentage to display */
    savingsPercent?: number;
    class?: string;
}

export const BillingToggle: Component<BillingToggleProps> = (props) => {
    const [isAnnual, setIsAnnual] = createSignal(props.isAnnual ?? false);

    // Sync with external state
    createEffect(() => {
        if (props.isAnnual !== undefined) {
            setIsAnnual(props.isAnnual);
        }
    });

    const handleToggle = () => {
        const newValue = !isAnnual();
        setIsAnnual(newValue);
        props.onChange?.(newValue);
    };

    return (
        <Stack direction="row" gap="md" align="center" justify="center" class={props.class || ''}>
            {/* Monthly label */}
            <Typography
                variant="body-medium"
                style={{
                    color: !isAnnual()
                        ? 'var(--m3-color-primary)'
                        : 'var(--m3-color-on-surface-variant)',
                    'font-weight': !isAnnual() ? '600' : '500',
                    transition: 'all 0.2s ease',
                }}
            >
                Monthly
            </Typography>

            {/* Toggle switch */}
            <button
                type="button"
                role="switch"
                aria-checked={isAnnual()}
                aria-label="Toggle billing period"
                onClick={handleToggle}
                style={{
                    position: 'relative',
                    width: '56px',
                    height: '28px',
                    background: isAnnual()
                        ? 'var(--m3-color-primary)'
                        : 'var(--m3-color-surface-container-high)',
                    'border-radius': '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    padding: '0',
                }}
                onFocus={(e: FocusEvent) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.outline = '2px solid var(--m3-color-primary)';
                    target.style.outlineOffset = '2px';
                }}
                onBlur={(e: FocusEvent) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.outline = 'none';
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        left: isAnnual() ? '30px' : '4px',
                        top: '4px',
                        width: '20px',
                        height: '20px',
                        'background-color': 'var(--m3-color-surface, #fff)',
                        'border-radius': '50%',
                        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.15)',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            </button>

            {/* Annual label with savings badge */}
            <Stack direction="row" gap="xs" align="center">
                <Typography
                    variant="body-medium"
                    style={{
                        color: isAnnual()
                            ? 'var(--m3-color-primary)'
                            : 'var(--m3-color-on-surface-variant)',
                        'font-weight': isAnnual() ? '600' : '500',
                        transition: 'all 0.2s ease',
                    }}
                >
                    Annual
                </Typography>
                {props.savingsPercent && (
                    <Chip
                        variant="label"
                        label={`Save ${props.savingsPercent}%`}
                        style={{
                            background: 'var(--m3-color-secondary-container)',
                            color: 'var(--m3-color-on-secondary-container)',
                            'font-size': '12px',
                            border: 'none',
                        }}
                    />
                )}
            </Stack>
        </Stack>
    );
};

export default BillingToggle;
