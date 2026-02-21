/**
 * Material 3 FAB (Floating Action Button) Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant FAB variants:
 * - surface: Default surface color
 * - primary: Primary color
 * - secondary: Secondary color
 * - tertiary: Tertiary color
 */
import { JSX, splitProps, Component, Show } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface FABProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    icon: JSX.Element;
    label?: string;
    lowered?: boolean;
    style?: JSX.CSSProperties;
    href?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const FAB: Component<FABProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'size', 'icon', 'label', 'lowered', 'disabled', 'style', 'href'
    ]);

    const isExtended = () => !!local.label;

    const rootClass = () => {
        const classes = ['md-fab'];
        classes.push(`md-fab--${local.variant || 'surface'}`);
        if (local.size === 'sm') classes.push('md-fab--small');
        else if (local.size === 'lg') classes.push('md-fab--large');
        if (isExtended()) classes.push('md-fab--extended');
        if (local.lowered) classes.push('md-fab--lowered');
        return classes.join(' ');
    };

    const content = () => (
        <>
            <Ripple disabled={local.disabled} />
            <span class="md-fab__icon">{local.icon}</span>
            <Show when={local.label}>
                <span>{local.label}</span>
            </Show>
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
                {content()}
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
            data-component="fab"
        >
            {content()}
        </button>
    );
};

export default FAB;
