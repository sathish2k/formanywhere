/**
 * Material 3 Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant button variants:
 * - filled: High emphasis — primary bg, on-primary text
 * - tonal: Medium emphasis — secondary-container bg
 * - elevated: Medium emphasis — surface-container-low bg, level1 shadow
 * - outlined: Medium emphasis — transparent bg, outline border
 * - text: Low emphasis — transparent bg, reduced padding
 * - secondary: Secondary color filled (custom extension)
 * - ghost: Minimal styling (custom extension)
 * - danger: Destructive actions (custom extension)
 * - glass: Liquid glass effect (custom extension)
 */
import { JSX, splitProps, Component, children, createMemo, For, Show } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    /** Button variant following M3 button types */
    variant?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text' | 'secondary' | 'ghost' | 'danger' | 'glass';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Color - overrides default variant colors */
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'inherit';
    /** Loading state */
    loading?: boolean;
    /** Disable ripple effect */
    disableRipple?: boolean;
    /** For link-style buttons */
    href?: string;
    /** Leading icon (rendered before label) */
    icon?: JSX.Element;
    /** Trailing icon (rendered after label) */
    trailingIcon?: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Button: Component<ButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'size', 'color', 'loading', 'disabled',
        'disableRipple', 'children', 'style', 'href', 'class',
        'icon', 'trailingIcon',
    ]);

    const resolvedChildren = children(() => local.children);

    // Build CSS class list
    const rootClass = () => {
        const classes = ['md-button'];
        classes.push(local.variant || 'filled');
        classes.push(`size-${local.size || 'md'}`);
        if (local.icon) classes.push('has-leading-icon');
        if (local.trailingIcon) classes.push('has-trailing-icon');
        if (local.disabled) classes.push('disabled');
        if (local.loading) classes.push('loading');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const content = () => (
        <>
            {!local.disableRipple && !local.disabled && <Ripple />}
            {local.loading ? (
                <span class="md-btn-spinner">
                    <svg viewBox="0 0 24 24">
                        <circle
                            cx="12" cy="12" r="10"
                            fill="none" stroke="currentColor"
                            stroke-width="3"
                            stroke-dasharray="31.4"
                            stroke-linecap="round"
                        />
                    </svg>
                </span>
            ) : (
                <>
                    {local.icon && <span class="md-button__icon">{local.icon}</span>}
                    {resolvedChildren()}
                    {local.trailingIcon && <span class="md-button__icon">{local.trailingIcon}</span>}
                </>
            )}
        </>
    );

    // Render as anchor if href is provided
    if (local.href) {
        return (
            <a
                href={local.href}
                class={rootClass()}
                style={local.style}
                data-component="button"
                data-variant={local.variant ?? 'filled'}
                data-color={local.color}
                role="button"
                aria-disabled={local.disabled || local.loading}
                {...(others as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {content()}
            </a>
        );
    }

    return (
        <button
            {...others}
            disabled={local.disabled || local.loading}
            class={rootClass()}
            style={local.style}
            data-component="button"
            data-variant={local.variant ?? 'filled'}
            data-color={local.color}
            aria-busy={local.loading}
            aria-disabled={local.disabled}
        >
            {content()}
        </button>
    );
};

export default Button;
