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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 ICON BUTTON - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-icon-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-icon-button:disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* Sizes */
.md-icon-button.size-sm { width: 32px; height: 32px; }
.md-icon-button.size-md { width: 40px; height: 40px; }
.md-icon-button.size-lg { width: 48px; height: 48px; }

.md-icon-button.size-sm .md-icon-button__icon { width: 20px; height: 20px; }
.md-icon-button.size-md .md-icon-button__icon { width: 24px; height: 24px; }
.md-icon-button.size-lg .md-icon-button__icon { width: 28px; height: 28px; }

/* ─── STANDARD VARIANT ─────────────────────────────────────────────────────── */

.md-icon-button.standard,
.md-icon-button.text {
    background: transparent;
    color: var(--m3-color-on-surface-variant, #49454E);
}

.md-icon-button.standard.selected,
.md-icon-button.text.selected {
    color: var(--m3-color-primary, #6750A4);
}

.md-icon-button.standard:hover:not(:disabled),
.md-icon-button.text:hover:not(:disabled) {
    background: color-mix(in srgb, var(--m3-color-on-surface-variant, #49454E) 8%, transparent);
}

/* ─── FILLED VARIANT ───────────────────────────────────────────────────────── */

.md-icon-button.filled {
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
    color: var(--m3-color-primary, #6750A4);
}

.md-icon-button.filled.selected {
    background: var(--m3-color-primary, #6750A4);
    color: var(--m3-color-on-primary, #fff);
}

.md-icon-button.filled:hover:not(:disabled) {
    background: color-mix(in srgb, var(--m3-color-primary, #6750A4) 8%, var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38)));
    box-shadow: var(--m3-elevation-1);
}

/* ─── FILLED-TONAL VARIANT ─────────────────────────────────────────────────── */

.md-icon-button.filled-tonal {
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
    color: var(--m3-color-on-surface-variant, #49454E);
}

.md-icon-button.filled-tonal.selected {
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12));
    color: var(--m3-color-on-secondary-container, #6750A4);
}

.md-icon-button.filled-tonal:hover:not(:disabled) {
    background: color-mix(in srgb, var(--m3-color-on-surface-variant, #49454E) 8%, var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38)));
    box-shadow: var(--m3-elevation-1);
}

/* ─── OUTLINED VARIANT ─────────────────────────────────────────────────────── */

.md-icon-button.outlined {
    background: transparent;
    color: var(--m3-color-on-surface-variant, #49454E);
    border: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
}

.md-icon-button.outlined.selected {
    background: var(--m3-color-inverse-surface, #313033);
    color: var(--m3-color-inverse-on-surface, #F4EFF4);
    border: none;
}

.md-icon-button.outlined:hover:not(:disabled) {
    background: color-mix(in srgb, var(--m3-color-on-surface-variant, #49454E) 8%, transparent);
}

/* ─── FOCUS ────────────────────────────────────────────────────────────────── */

.md-icon-button:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 2px;
}

/* Icon container */
.md-icon-button__icon {
    display: flex;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-icon-button.glass {
    background: var(--glass-tint, rgba(255, 255, 255, 0.35));
    backdrop-filter: blur(var(--glass-blur, 16px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    color: var(--glass-on-surface, var(--m3-color-on-surface, #1C1B1F));
}

.md-icon-button.glass:hover:not(:disabled) {
    background: var(--glass-hover, rgba(255, 255, 255, 0.5));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.md-icon-button.glass.selected {
    background: var(--m3-color-primary, rgba(103, 80, 164, 0.8));
    color: var(--m3-color-on-primary, #fff);
    border-color: transparent;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-icon-button', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const IconButton: Component<IconButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'icon', 'size', 'selected', 'toggle', 'disabled', 'style', 'href'
    ]);

    injectStyles();

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
