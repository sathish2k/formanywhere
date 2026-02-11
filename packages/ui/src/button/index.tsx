/**
 * Material 3 Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant button variants:
 * - filled: Primary actions
 * - secondary: Secondary color actions
 * - tonal: Filled tonal buttons
 * - outlined: Secondary actions with outline
 * - text: Low-emphasis actions
 * - ghost: Minimal styling
 * - danger: Destructive actions
 * - glass: Liquid glass effect button
 */
import { JSX, splitProps, Component, children, createMemo } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    /** Button variant following M3 button types */
    variant?: 'filled' | 'secondary' | 'tonal' | 'outlined' | 'text' | 'ghost' | 'danger' | 'glass';
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
    ]);

    const resolvedChildren = children(() => local.children);

    // Build CSS class list
    const rootClass = () => {
        const classes = ['md-button'];
        classes.push(local.variant || 'filled');
        classes.push(`size-${local.size || 'md'}`);
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
                resolvedChildren()
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
