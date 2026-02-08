/**
 * Material 3 Chip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant chip variants:
 * - assist: For smart suggestions
 * - filter: For filtering content
 * - input: For user input
 * - suggestion: For suggested actions
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
import { Ripple } from '../ripple';

export interface ChipProps {
    /** Chip variant */
    variant?: 'assist' | 'filter' | 'input' | 'suggestion' | 'label';
    /** Chip label */
    label: string;
    /** Selected state (for filter chips) */
    selected?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Leading icon */
    icon?: JSX.Element;
    /** Whether chip is elevated */
    elevated?: boolean;
    /** Color - overrides default label variant colors */
    color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Remove handler (for input chips) */
    onRemove?: () => void;
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
}

// Color mappings for the label variant
const chipColors: Record<string, { bg: string; text: string; border: string }> = {
    default: {
        bg: 'var(--m3-color-primary-container, rgba(91, 95, 237, 0.12))',
        text: 'var(--m3-color-on-primary-container, #1a1a4a)',
        border: '1px solid color-mix(in srgb, var(--m3-color-primary) 20%, transparent)',
    },
    primary: {
        bg: 'var(--m3-color-primary-container, rgba(91, 95, 237, 0.12))',
        text: 'var(--m3-color-on-primary-container, #1a1a4a)',
        border: '1px solid color-mix(in srgb, var(--m3-color-primary) 20%, transparent)',
    },
    secondary: {
        bg: 'var(--m3-color-secondary-container, rgba(142, 51, 255, 0.12))',
        text: 'var(--m3-color-on-secondary-container, #1d192b)',
        border: '1px solid color-mix(in srgb, var(--m3-color-secondary) 20%, transparent)',
    },
    info: {
        bg: 'var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12))',
        text: 'var(--m3-color-on-tertiary-container, #006C9C)',
        border: '1px solid color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent)',
    },
    success: {
        bg: 'var(--m3-color-success-container, rgba(34, 197, 94, 0.12))',
        text: 'var(--m3-color-success, #22C55E)',
        border: '1px solid color-mix(in srgb, #22C55E 20%, transparent)',
    },
    warning: {
        bg: 'var(--m3-color-warning-container, rgba(255, 171, 0, 0.12))',
        text: 'var(--m3-color-warning, #FFAB00)',
        border: '1px solid color-mix(in srgb, #FFAB00 20%, transparent)',
    },
    error: {
        bg: 'var(--m3-color-error-container, rgba(255, 86, 48, 0.12))',
        text: 'var(--m3-color-error, #FF5630)',
        border: '1px solid color-mix(in srgb, #FF5630 20%, transparent)',
    },
};

const chipStyles = (
    variant: string,
    selected: boolean,
    elevated: boolean,
    disabled: boolean,
    color?: string
): JSX.CSSProperties => {
    // Special 'label' variant - matches original .chip CSS styling
    if (variant === 'label') {
        const colorScheme = chipColors[color || 'default'] || chipColors.default;
        return {
            position: 'relative',
            display: 'inline-flex',
            'align-items': 'center',
            gap: '4px',
            height: 'auto',
            padding: '4px 12px',
            'border-radius': '9999px', // pill shape
            'font-size': '12px',
            'font-weight': '600',
            'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
            cursor: disabled ? 'not-allowed' : 'default',
            opacity: disabled ? '0.38' : '1',
            border: colorScheme.border,
            background: colorScheme.bg,
            color: colorScheme.text,
            'backdrop-filter': 'blur(12px)',
            '-webkit-backdrop-filter': 'blur(12px)',
            transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
            overflow: 'hidden',
            'user-select': 'none',
        };
    }

    // Standard M3 chip styles
    return {
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        gap: '8px',
        height: '32px',
        padding: '0 16px',
        'border-radius': '8px',
        'font-size': '14px',
        'font-weight': '500',
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? '0.38' : '1',
        border: selected
            ? 'none'
            : '1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4))',
        background: selected
            ? 'var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12))'
            : elevated
                ? 'var(--m3-color-surface-container-low, rgba(255, 255, 255, 0.55))'
                : 'transparent',
        color: selected
            ? 'var(--m3-color-on-secondary-container, #1d192b)'
            : 'var(--m3-color-on-surface, #1D1B20)',
        'box-shadow': elevated ? 'var(--m3-elevation-1)' : 'none',
        transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
        'user-select': 'none',
    };
};

export const Chip: Component<ChipProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'label', 'selected', 'disabled', 'icon',
        'elevated', 'color', 'onClick', 'onRemove', 'class', 'style'
    ]);

    const variant = local.variant ?? 'assist';
    const isSelected = local.selected ?? false;
    const isElevated = local.elevated ?? false;

    const handleClick = (e: MouseEvent) => {
        if (local.disabled) return;
        local.onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (local.disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            local.onClick?.(e as unknown as MouseEvent);
        }
    };

    return (
        <button
            type="button"
            disabled={local.disabled}
            class={local.class || ''}
            style={{
                ...chipStyles(variant, isSelected, isElevated, !!local.disabled, local.color),
                ...local.style,
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            data-component="chip"
            data-variant={variant}
            data-selected={isSelected}
            role={variant === 'filter' ? 'checkbox' : 'button'}
            aria-pressed={variant === 'filter' ? isSelected : undefined}
            aria-checked={variant === 'filter' ? isSelected : undefined}
            aria-label={local.label}
        >
            <Ripple disabled={local.disabled} />
            {isSelected && variant === 'filter' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            )}
            {local.icon && !isSelected && <span style={{ display: 'flex' }} aria-hidden="true">{local.icon}</span>}
            <span>{local.label}</span>
            {variant === 'input' && local.onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        local.onRemove?.();
                    }}
                    style={{
                        display: 'flex',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: 'inherit',
                        'margin-left': '4px',
                        'margin-right': '-8px',
                    }}
                    aria-label={`Remove ${local.label}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            )}
        </button>
    );
};

export default Chip;
