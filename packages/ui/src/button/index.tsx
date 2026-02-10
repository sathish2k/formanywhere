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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 BUTTON - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-btn-spin {
    to { transform: rotate(360deg); }
}

.md-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border: none;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                box-shadow var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

/* ─── SIZES ────────────────────────────────────────────────────────────────── */

.md-button.size-sm {
    padding: 6px 16px;
    font-size: 14px;
    border-radius: var(--m3-shape-small, 8px);
    min-height: 32px;
}

.md-button.size-md {
    padding: 10px 24px;
    font-size: 14px;
    border-radius: var(--m3-shape-full, 9999px);
    min-height: 40px;
}

.md-button.size-lg {
    padding: 14px 32px;
    font-size: 16px;
    border-radius: var(--m3-shape-full, 9999px);
    min-height: 48px;
}

/* ─── DISABLED ─────────────────────────────────────────────────────────────── */

.md-button.disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* ─── LOADING ──────────────────────────────────────────────────────────────── */

.md-button.loading {
    cursor: wait;
    pointer-events: none;
}

.md-btn-spinner {
    display: flex;
    animation: md-btn-spin 1s linear infinite;
}

.md-btn-spinner svg {
    width: 18px;
    height: 18px;
}

/* ─── FOCUS RING ───────────────────────────────────────────────────────────── */

.md-button:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 2px;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   VARIANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ─── FILLED ───────────────────────────────────────────────────────────────── */

.md-button.filled {
    background: var(--m3-color-primary, #6750A4);
    color: var(--m3-color-on-primary, #fff);
    box-shadow: var(--m3-elevation-1, 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1));
}

.md-button.filled:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-2, 0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1));
    filter: brightness(1.08);
}

.md-button.filled:active:not(.disabled) {
    box-shadow: var(--m3-elevation-1);
    transform: scale(0.98);
}

/* ─── SECONDARY ────────────────────────────────────────────────────────────── */

.md-button.secondary {
    background: var(--m3-color-secondary, #14b8a6);
    color: var(--m3-color-on-secondary, #fff);
    box-shadow: var(--m3-elevation-1, 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1));
}

.md-button.secondary:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-2);
    filter: brightness(1.08);
}

.md-button.secondary:active:not(.disabled) {
    transform: scale(0.98);
}

/* ─── TONAL ────────────────────────────────────────────────────────────────── */

.md-button.tonal {
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12));
    color: var(--m3-color-on-secondary-container, #6750A4);
}

.md-button.tonal:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-1);
    filter: brightness(0.96);
}

.md-button.tonal:active:not(.disabled) {
    transform: scale(0.98);
}

/* ─── OUTLINED ─────────────────────────────────────────────────────────────── */

.md-button.outlined {
    background: transparent;
    color: var(--m3-color-primary, #6750A4);
    border: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
}

.md-button.outlined:hover:not(.disabled) {
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.08));
}

.md-button.outlined:active:not(.disabled) {
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.12));
    transform: scale(0.98);
}

/* ─── TEXT ──────────────────────────────────────────────────────────────────── */

.md-button.text {
    background: transparent;
    color: var(--m3-color-primary, #6750A4);
    padding-left: 12px;
    padding-right: 12px;
}

.md-button.text:hover:not(.disabled) {
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.08));
}

.md-button.text:active:not(.disabled) {
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.12));
}

/* ─── GHOST ────────────────────────────────────────────────────────────────── */

.md-button.ghost {
    background: transparent;
    color: var(--m3-color-on-surface, #1f1f1f);
}

.md-button.ghost:hover:not(.disabled) {
    background: var(--m3-color-surface-container, rgba(255, 255, 255, 0.7));
}

/* ─── DANGER ───────────────────────────────────────────────────────────────── */

.md-button.danger {
    background: var(--m3-color-error, #B3261E);
    color: var(--m3-color-on-error, #fff);
    box-shadow: var(--m3-elevation-1);
}

.md-button.danger:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-2);
    filter: brightness(1.08);
}

.md-button.danger:active:not(.disabled) {
    transform: scale(0.98);
}

/* ─── GLASS (Liquid Glass) ─────────────────────────────────────────────────── */

.md-button.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    color: var(--m3-color-on-surface, #1f1f1f);
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    box-shadow: var(--glass-shadow, 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04));
}

.md-button.glass:hover:not(.disabled) {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
    box-shadow: var(--glass-shadow-elevated, 0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06));
    transform: translateY(-1px);
}

.md-button.glass:active:not(.disabled) {
    transform: translateY(0) scale(0.98);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COLOR OVERRIDES - apply via data-color attribute
   ═══════════════════════════════════════════════════════════════════════════════ */

/* Filled/Secondary/Tonal/Danger color overrides */
.md-button.filled[data-color="secondary"],
.md-button.secondary[data-color="secondary"],
.md-button.danger[data-color="secondary"],
.md-button.tonal[data-color="secondary"] {
    background: var(--m3-color-secondary, #8E33FF);
    color: var(--m3-color-on-secondary, #fff);
}

.md-button.filled[data-color="info"],
.md-button.tonal[data-color="info"] {
    background: var(--m3-color-tertiary, #00B8D9);
    color: var(--m3-color-on-tertiary, #fff);
}

.md-button.filled[data-color="success"],
.md-button.tonal[data-color="success"] {
    background: var(--m3-color-success, #22C55E);
    color: #fff;
}

.md-button.filled[data-color="warning"],
.md-button.tonal[data-color="warning"] {
    background: var(--m3-color-warning, #FFAB00);
    color: #1f1f1f;
}

.md-button.filled[data-color="error"],
.md-button.tonal[data-color="error"] {
    background: var(--m3-color-error, #FF5630);
    color: #fff;
}

/* Outlined/Text color overrides */
.md-button.outlined[data-color="secondary"],
.md-button.text[data-color="secondary"] {
    color: var(--m3-color-secondary, #8E33FF);
    border-color: var(--m3-color-secondary, #8E33FF);
}

.md-button.outlined[data-color="error"],
.md-button.text[data-color="error"] {
    color: var(--m3-color-error, #FF5630);
    border-color: var(--m3-color-error, #FF5630);
}

.md-button.outlined[data-color="success"],
.md-button.text[data-color="success"] {
    color: var(--m3-color-success, #22C55E);
    border-color: var(--m3-color-success, #22C55E);
}

.md-button.outlined[data-color="info"],
.md-button.text[data-color="info"] {
    color: var(--m3-color-tertiary, #00B8D9);
    border-color: var(--m3-color-tertiary, #00B8D9);
}

.md-button.outlined[data-color="warning"],
.md-button.text[data-color="warning"] {
    color: var(--m3-color-warning, #FFAB00);
    border-color: var(--m3-color-warning, #FFAB00);
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-button', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Button: Component<ButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'size', 'color', 'loading', 'disabled',
        'disableRipple', 'children', 'style', 'href', 'class',
    ]);

    injectStyles();

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
