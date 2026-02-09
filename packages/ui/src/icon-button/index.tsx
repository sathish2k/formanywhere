/**
 * Material 3 Icon Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant icon button variants:
 * - standard: Default icon button
 * - filled: Filled background
 * - filled-tonal: Tonal filled background  
 * - outlined: Outlined border
 */
import { JSX, splitProps, Component } from 'solid-js';
import { Ripple } from '../ripple';

export interface IconButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    /** Icon button variant */
    variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined' | 'text';
    /** Icon element */
    icon: JSX.Element;
    /** Size */
    size?: 'sm' | 'md' | 'lg';
    /** Toggle state (for toggleable icon buttons) */
    selected?: boolean;
    /** Whether button is toggleable */
    toggle?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Link href (renders as anchor) */
    href?: string;
}

const sizeMap = {
    sm: { button: '32px', icon: '20px' },
    md: { button: '40px', icon: '24px' },
    lg: { button: '48px', icon: '28px' },
};

const iconButtonStyles = (
    variant: string,
    size: 'sm' | 'md' | 'lg',
    selected: boolean,
    disabled: boolean
): JSX.CSSProperties => {
    const sizes = sizeMap[size];

    const baseStyle: JSX.CSSProperties = {
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        width: sizes.button,
        height: sizes.button,
        padding: 0,
        border: 'none',
        'border-radius': '50%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? '0.38' : '1',
        transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
        'text-decoration': 'none',
    };

    switch (variant) {
        case 'filled':
            return {
                ...baseStyle,
                background: selected
                    ? 'var(--m3-color-primary, #5B5FED)'
                    : 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))',
                color: selected
                    ? 'var(--m3-color-on-primary, #fff)'
                    : 'var(--m3-color-primary, #5B5FED)',
            };
        case 'filled-tonal':
            return {
                ...baseStyle,
                background: selected
                    ? 'var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12))'
                    : 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))',
                color: selected
                    ? 'var(--m3-color-on-secondary-container, #5B5FED)'
                    : 'var(--m3-color-on-surface-variant, #49454E)',
            };
        case 'outlined':
            return {
                ...baseStyle,
                background: selected
                    ? 'var(--m3-color-inverse-surface, #313033)'
                    : 'transparent',
                color: selected
                    ? 'var(--m3-color-inverse-on-surface, #F4EFF4)'
                    : 'var(--m3-color-on-surface-variant, #49454E)',
                border: selected
                    ? 'none'
                    : '1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4))',
            };
        case 'text':
        default: // standard
            return {
                ...baseStyle,
                background: 'transparent',
                color: selected
                    ? 'var(--m3-color-primary, #5B5FED)'
                    : 'var(--m3-color-on-surface-variant, #49454E)',
            };
    }
};

export const IconButton: Component<IconButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'icon', 'size', 'selected', 'toggle', 'disabled', 'style', 'href'
    ]);

    const variant = local.variant ?? 'standard';
    const size = local.size ?? 'md';
    const isSelected = local.selected ?? false;

    if (local.href) {
        return (
            <a
                href={local.href}
                style={{
                    ...iconButtonStyles(variant, size, isSelected, !!local.disabled),
                    ...local.style,
                }}
                {...(others as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                <Ripple disabled={local.disabled} />
                <span style={{
                    display: 'flex',
                    width: sizeMap[size].icon,
                    height: sizeMap[size].icon,
                }}>
                    {local.icon}
                </span>
            </a>
        );
    }

    return (
        <button
            type="button"
            {...others}
            disabled={local.disabled}
            style={{
                ...iconButtonStyles(variant, size, isSelected, !!local.disabled),
                ...local.style,
            }}
        >
            <Ripple disabled={local.disabled} />
            <span style={{
                display: 'flex',
                width: sizeMap[size].icon,
                height: sizeMap[size].icon,
            }}>
                {local.icon}
            </span>
        </button>
    );
};

export default IconButton;
