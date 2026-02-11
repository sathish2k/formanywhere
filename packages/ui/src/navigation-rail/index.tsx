/**
 * Material 3 Navigation Rail Component for SolidJS
 * Based on M3 navigation rail spec
 *
 * Implements the M3 spec with:
 * - Vertical navigation with active indicator pill
 * - Icon + label layout
 * - Header slot (e.g. FAB)
 * - Active/inactive states with transitions
 * - Ripple on items
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 NAVIGATION RAIL - Vertical navigation
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-nav-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 100%;
    background: var(--m3-color-surface, #FDF8FD);
    padding: 12px 0;
    box-sizing: border-box;
    gap: 12px;
    border-right: 1px solid var(--m3-color-outline-variant, #CAC4D0);
}

/* Alignment modifiers */
.md-nav-rail.align-center .md-nav-rail__items {
    margin-top: auto;
    margin-bottom: auto;
}

.md-nav-rail.align-end .md-nav-rail__items {
    margin-top: auto;
}

/* ─── HEADER ───────────────────────────────────────────────────────────────── */

.md-nav-rail__header {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ─── ITEMS CONTAINER ──────────────────────────────────────────────────────── */

.md-nav-rail__items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
}

/* ─── ITEM ─────────────────────────────────────────────────────────────────── */

.md-nav-rail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
    color: var(--m3-color-on-surface-variant, #49454F);
    gap: 4px;
    width: 100%;
    padding: 4px 0;
    background: none;
    border: none;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-nav-rail-item:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: -2px;
    border-radius: var(--m3-shape-small, 8px);
}

.md-nav-rail-item.selected {
    color: var(--m3-color-on-surface, #1D1B20);
}

/* ─── INDICATOR ────────────────────────────────────────────────────────────── */

.md-nav-rail-item__indicator {
    width: 56px;
    height: 32px;
    border-radius: var(--m3-shape-full, 9999px);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: background var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.md-nav-rail-item.selected .md-nav-rail-item__indicator {
    background: var(--m3-color-secondary-container, #E8DEF8);
}

/* ─── LABEL ────────────────────────────────────────────────────────────────── */

.md-nav-rail-item__label {
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: var(--m3-label-medium-size, 12px);
    line-height: var(--m3-label-medium-line-height, 16px);
    font-weight: 500;
    text-align: center;
    height: 16px;
    transition: font-weight var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-nav-rail-item.selected .md-nav-rail-item__label {
    font-weight: 700;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-nav-rail.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border-right: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
}

.md-nav-rail.glass .md-nav-rail-item.selected .md-nav-rail-item__indicator {
    background: color-mix(in srgb, var(--m3-color-primary, #6750A4) 16%, var(--glass-tint-medium, rgba(255, 255, 255, 0.5)));
    backdrop-filter: blur(8px);
}

.md-nav-rail.glass .md-nav-rail-item:hover:not(.selected) .md-nav-rail-item__indicator {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-nav-rail', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NavigationRailProps {
    /** Header slot (e.g. FAB) */
    header?: JSX.Element;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Alignment of items */
    align?: 'start' | 'center' | 'end';
    /** Visual variant */
    variant?: 'standard' | 'glass';
}

export interface NavigationRailItemProps {
    /** Value of this item */
    value: string | number;
    /** Icon element */
    icon: JSX.Element;
    /** Active Icon element */
    activeIcon?: JSX.Element;
    /** Label text */
    label?: string;
    /** Whether item is active */
    selected?: boolean;
    /** Click handler */
    onClick?: () => void;
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const NavigationRail: Component<NavigationRailProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-nav-rail'];
        if (props.align === 'center') classes.push('align-center');
        if (props.align === 'end') classes.push('align-end');
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style} role="navigation">
            <Show when={props.header}>
                <div class="md-nav-rail__header">{props.header}</div>
            </Show>
            <div class="md-nav-rail__items">
                {props.children}
            </div>
        </div>
    );
};

export const NavigationRailItem: Component<NavigationRailItemProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-nav-rail-item'];
        if (props.selected) classes.push('selected');
        return classes.join(' ');
    };

    return (
        <div
            class={rootClass()}
            onClick={props.onClick}
            role="button"
            tabindex="0"
        >
            <div class="md-nav-rail-item__indicator">
                {props.selected && props.activeIcon ? props.activeIcon : props.icon}
                <Ripple />
            </div>
            {props.label && (
                <span class="md-nav-rail-item__label">
                    {props.label}
                </span>
            )}
        </div>
    );
};
