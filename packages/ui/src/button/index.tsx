/**
 * Material 3 Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant button variants:
 * - filled: Primary actions with gradient background
 * - secondary: Secondary actions with secondary color
 * - tonal: Filled tonal buttons
 * - outlined: Secondary actions with outline
 * - text: Low-emphasis actions
 * - ghost: Minimal styling
 * - glass: Liquid glass effect button
 */
import { JSX, splitProps, Component, children, createMemo } from 'solid-js';
import { Ripple } from '../ripple';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
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
}

// M3 Button CSS custom properties
const buttonStyles: Record<string, JSX.CSSProperties> = {
    filled: {
        background: 'var(--m3-color-primary, #5B5FED)',
        color: 'var(--m3-color-on-primary, #fff)',
        border: 'none',
        'box-shadow': 'var(--m3-elevation-1, 0 1px 3px rgba(0,0,0,0.12))',
    },
    secondary: {
        background: 'var(--m3-color-secondary, #14b8a6)',
        color: 'var(--m3-color-on-secondary, #fff)',
        border: 'none',
        'box-shadow': 'var(--m3-elevation-1, 0 1px 3px rgba(0,0,0,0.12))',
    },
    tonal: {
        background: 'var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12))',
        color: 'var(--m3-color-on-secondary-container, #5B5FED)',
        border: 'none',
    },
    outlined: {
        background: 'transparent',
        color: 'var(--m3-color-primary, #5B5FED)',
        border: '1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4))',
    },
    text: {
        background: 'transparent',
        color: 'var(--m3-color-primary, #5B5FED)',
        border: 'none',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--m3-color-on-surface, #1f1f1f)',
        border: 'none',
    },
    danger: {
        background: 'var(--m3-color-error, #FF5630)',
        color: 'var(--m3-color-on-error, #fff)',
        border: 'none',
        'box-shadow': 'var(--m3-elevation-1, 0 1px 3px rgba(0,0,0,0.12))',
    },
    glass: {
        background: 'var(--glass-tint-light, rgba(255, 255, 255, 0.7))',
        color: 'var(--m3-color-on-surface, #1f1f1f)',
        border: '1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4))',
        'backdrop-filter': 'blur(var(--glass-blur, 20px))',
        '-webkit-backdrop-filter': 'blur(var(--glass-blur, 20px))',
        'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.08)',
    },
};

// Color overrides - maps semantic colors to CSS variable values
const colorOverrides: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: 'var(--m3-color-primary, #5B5FED)', text: 'var(--m3-color-on-primary, #fff)' },
    secondary: { bg: 'var(--m3-color-secondary, #8E33FF)', text: 'var(--m3-color-on-secondary, #fff)' },
    info: { bg: 'var(--m3-color-tertiary, #00B8D9)', text: 'var(--m3-color-on-tertiary, #fff)' },
    success: { bg: 'var(--m3-color-success, #22C55E)', text: '#fff' },
    warning: { bg: 'var(--m3-color-warning, #FFAB00)', text: '#1f1f1f' },
    error: { bg: 'var(--m3-color-error, #FF5630)', text: '#fff' },
};


const sizeStyles: Record<string, JSX.CSSProperties> = {
    sm: {
        padding: '6px 16px',
        'font-size': '14px',
        'border-radius': 'var(--m3-shape-small, 8px)',
    },
    md: {
        padding: '10px 24px',
        'font-size': '14px',
        'border-radius': 'var(--m3-shape-medium, 12px)',
    },
    lg: {
        padding: '14px 32px',
        'font-size': '16px',
        'border-radius': 'var(--m3-shape-large, 16px)',
    },
};

/**
 * Material 3 Button Component
 * 
 * Usage:
 * ```tsx
 * <Button variant="filled">Primary Action</Button>
 * <Button variant="secondary">Secondary Action</Button>
 * <Button variant="outlined">Outline</Button>
 * <Button variant="text">Text Button</Button>
 * ```
 */
export const Button: Component<ButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant',
        'size',
        'color',
        'loading',
        'disabled',
        'disableRipple',
        'children',
        'style',
        'href',
    ]);

    const resolvedChildren = children(() => local.children);

    const computedStyle = createMemo((): JSX.CSSProperties => {
        const variant = local.variant ?? 'filled';
        const size = local.size ?? 'md';
        const color = local.color;

        // Base variant styles
        let variantStyles = { ...buttonStyles[variant] };

        // Apply color override if specified (except for inherit)
        if (color && color !== 'inherit' && colorOverrides[color]) {
            const colorStyle = colorOverrides[color];
            if (variant === 'filled' || variant === 'secondary' || variant === 'tonal' || variant === 'danger') {
                // Filled variants - change background and text
                variantStyles.background = colorStyle.bg;
                variantStyles.color = colorStyle.text;
            } else if (variant === 'outlined' || variant === 'text') {
                // Outlined/text variants - change text and border color
                variantStyles.color = colorStyle.bg;
                if (variant === 'outlined') {
                    variantStyles.border = `1px solid ${colorStyle.bg}`;
                }
            }
        }

        return {
            // Base styles
            position: 'relative',
            display: 'inline-flex',
            'align-items': 'center',
            'justify-content': 'center',
            gap: '8px',
            'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
            'font-weight': '500',
            cursor: local.disabled || local.loading ? 'not-allowed' : 'pointer',
            opacity: local.disabled ? '0.5' : '1',
            'text-decoration': 'none',
            transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
            overflow: 'hidden',
            'white-space': 'nowrap',
            // Accessibility: Focus ring (using outline for :focus-visible)
            outline: 'none',
            // Variant styles (with color override applied)
            ...variantStyles,
            // Size styles
            ...sizeStyles[size],
            // User styles
            ...(typeof local.style === 'object' ? local.style : {}),
        };
    });

    const content = () => (
        <>
            {!local.disableRipple && !local.disabled && <Ripple />}
            {local.loading ? (
                <span class="m3-button-loader">
                    <svg class="m3-spinner" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
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
                style={computedStyle()}
                data-component="button"
                data-variant={local.variant ?? 'filled'}
                data-size={local.size ?? 'md'}
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
            style={computedStyle()}
            data-component="button"
            data-variant={local.variant ?? 'filled'}
            data-size={local.size ?? 'md'}
            aria-busy={local.loading}
            aria-disabled={local.disabled}
        >
            {content()}
        </button>
    );
};

export default Button;
