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
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface IconButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined' | 'text';
    icon: JSX.Element;
    size?: 'sm' | 'md' | 'lg';
    selected?: boolean;
    toggle?: boolean;
    style?: JSX.CSSProperties;
    href?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const IconButton: Component<IconButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'icon', 'size', 'selected', 'toggle', 'disabled', 'style', 'href'
    ]);

    const rootClass = () => {
        const classes = ['md-icon-button'];
        classes.push(local.variant || 'standard');
        classes.push(`size-${local.size || 'md'}`);
        if (local.selected) classes.push('selected');
        return classes.join(' ');
    };

    const iconEl = () => (
        <>
            <Ripple disabled={local.disabled} />
            <span class="md-icon-button__icon">{local.icon}</span>
        </>
    );

    if (local.href) {
        return (
            <a
                href={local.href}
                class={rootClass()}
                style={local.style}
                {...(others as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {iconEl()}
            </a>
        );
    }

    return (
        <button
            type="button"
            {...others}
            disabled={local.disabled}
            class={rootClass()}
            style={local.style}
            data-component="icon-button"
        >
            {iconEl()}
        </button>
    );
};

export default IconButton;
