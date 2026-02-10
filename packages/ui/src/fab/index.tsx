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

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface FABProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
    icon: JSX.Element;
    label?: string;
    lowered?: boolean;
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
   M3 FAB - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-fab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    box-shadow: var(--m3-elevation-3, 0 4px 8px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.1));
    transition: box-shadow var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-fab:disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* Hover */
.md-fab:hover:not(:disabled) {
    box-shadow: var(--m3-elevation-4, 0 6px 12px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.12));
    transform: translateY(-1px);
}

/* Active */
.md-fab:active:not(:disabled) {
    transform: translateY(0);
}

/* Focus ring */
.md-fab:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 2px;
}

/* Lowered elevation */
.md-fab.lowered {
    box-shadow: var(--m3-elevation-1, 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1));
}

.md-fab.lowered:hover:not(:disabled) {
    box-shadow: var(--m3-elevation-2, 0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.15));
}

/* ─── SIZES ────────────────────────────────────────────────────────────────── */

.md-fab.size-small {
    height: 40px;
    width: 40px;
    padding: 8px;
    border-radius: var(--m3-shape-medium, 12px);
}

.md-fab.size-medium {
    height: 56px;
    width: 56px;
    padding: 16px;
    border-radius: var(--m3-shape-large, 16px);
}

.md-fab.size-large {
    height: 96px;
    width: 96px;
    padding: 30px;
    border-radius: var(--m3-shape-extra-large, 28px);
}

/* Extended overrides */
.md-fab.extended {
    width: auto;
    min-width: 80px;
    gap: 12px;
    padding: 0 20px 0 16px;
    border-radius: var(--m3-shape-large, 16px);
}

/* ─── ICON SIZES ───────────────────────────────────────────────────────────── */

.md-fab.size-small .md-fab__icon { width: 24px; height: 24px; }
.md-fab.size-medium .md-fab__icon { width: 24px; height: 24px; }
.md-fab.size-large .md-fab__icon { width: 36px; height: 36px; }

.md-fab__icon {
    display: flex;
}

/* ─── COLOR VARIANTS ───────────────────────────────────────────────────────── */

.md-fab.surface {
    background: var(--m3-color-surface-container-high, rgba(236, 230, 240, 0.95));
    color: var(--m3-color-primary, #6750A4);
}

.md-fab.primary {
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.12));
    color: var(--m3-color-on-primary-container, #3730a3);
}

.md-fab.secondary {
    background: var(--m3-color-secondary-container, rgba(20, 184, 166, 0.12));
    color: var(--m3-color-on-secondary-container, #0d9488);
}

.md-fab.tertiary {
    background: var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12));
    color: var(--m3-color-on-tertiary-container, #006C9C);
}

/* ─── GLASS FAB ────────────────────────────────────────────────────────────── */

.md-fab.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    color: var(--m3-color-on-surface, #1f1f1f);
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-fab', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const FAB: Component<FABProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'size', 'icon', 'label', 'lowered', 'disabled', 'style', 'href'
    ]);

    injectStyles();

    const isExtended = () => !!local.label;

    const rootClass = () => {
        const classes = ['md-fab'];
        classes.push(local.variant || 'primary');
        classes.push(`size-${local.size || 'medium'}`);
        if (isExtended()) classes.push('extended');
        if (local.lowered) classes.push('lowered');
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
