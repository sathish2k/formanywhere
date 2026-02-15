/**
 * Material 3 Chip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant chip variants:
 * - assist: For smart suggestions
 * - filter: For filtering content
 * - input: For user input
 * - suggestion: For suggested actions
 * - label: Badge-style pill chip with color
 */
import { JSX, splitProps, Component } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ChipProps {
    /** Chip variant */
    variant?: 'assist' | 'filter' | 'input' | 'suggestion' | 'label';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
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
    /** Color (for label variant) */
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

// ─── Component ──────────────────────────────────────────────────────────────────

export const Chip: Component<ChipProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'size', 'label', 'selected', 'disabled', 'icon',
        'elevated', 'color', 'onClick', 'onRemove', 'class', 'style'
    ]);

    const variant = () => local.variant ?? 'assist';

    const rootClass = () => {
        const classes = ['md-chip'];
        classes.push(variant());
        classes.push(`size-${local.size || 'md'}`);
        if (local.selected) classes.push('selected');
        if (local.elevated) classes.push('elevated');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

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
            class={rootClass()}
            style={local.style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            data-component="chip"
            data-variant={variant()}
            data-color={local.color}
            data-selected={local.selected}
            role={variant() === 'filter' ? 'checkbox' : 'button'}
            aria-pressed={variant() === 'filter' ? local.selected : undefined}
            aria-checked={variant() === 'filter' ? local.selected : undefined}
            aria-label={local.label}
        >
            <Ripple disabled={local.disabled} />
            {local.selected && variant() === 'filter' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            )}
            {local.icon && !local.selected && <span style={{ display: 'flex' }} aria-hidden="true">{local.icon}</span>}
            <span>{local.label}</span>
            {variant() === 'input' && local.onRemove && (
                <button
                    type="button"
                    class="md-chip__remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        local.onRemove?.();
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
