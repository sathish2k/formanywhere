/**
 * Material 3 Navigation Bar Component for SolidJS
 * Based on https://github.com/nicolo-ribaudo/material-web-navigation/tree/main (M3 navigation spec)
 *
 * Implements the M3 spec with:
 * - Bottom navigation with active indicator pill
 * - Icon + label layout
 * - Active/inactive states with transitions
 * - Ripple on items
 * - Liquid Glass enhanced styling
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 NAVIGATION BAR - Bottom navigation
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-nav-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80px;
    background: var(--m3-color-surface-container, #F3EDF7);
    color: var(--m3-color-on-surface-variant, #49454F);
    padding: 0 8px;
    box-sizing: border-box;
    border-top: 1px solid var(--m3-color-outline-variant, #CAC4D0);
}

/* Liquid Glass variant */
.md-nav-bar.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border-top: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.04);
}

/* ─── ITEM ─────────────────────────────────────────────────────────────────── */

.md-nav-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    cursor: pointer;
    position: relative;
    color: var(--m3-color-on-surface-variant, #49454F);
    gap: 4px;
    background: none;
    border: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-nav-bar-item:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: -2px;
    border-radius: var(--m3-shape-small, 8px);
}

.md-nav-bar-item.selected {
    color: var(--m3-color-on-surface, #1D1B20);
}

/* ─── INDICATOR ────────────────────────────────────────────────────────────── */

.md-nav-bar-item__indicator {
    width: 64px;
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

.md-nav-bar-item.selected .md-nav-bar-item__indicator {
    background: var(--m3-color-secondary-container, #E8DEF8);
}

/* ─── LABEL ────────────────────────────────────────────────────────────────── */

.md-nav-bar-item__label {
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: var(--m3-label-medium-size, 12px);
    line-height: var(--m3-label-medium-line-height, 16px);
    font-weight: 500;
    text-align: center;
    transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-nav-bar-item.selected .md-nav-bar-item__label {
    font-weight: 700;
}

.md-nav-bar-item:not(.selected):not(.always-show-label) .md-nav-bar-item__label {
    opacity: 0;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-nav-bar', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NavigationBarProps {
    /** Currently selected value */
    value?: string | number;
    /** Change handler */
    onChange?: (value: string | number) => void;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Use liquid glass variant */
    glass?: boolean;
}

export interface NavigationBarItemProps {
    /** Value of this item */
    value: string | number;
    /** Icon element */
    icon: JSX.Element;
    /** Active Icon element (optional) */
    activeIcon?: JSX.Element;
    /** Label text */
    label?: string;
    /** Whether item is active (controlled by parent usually) */
    selected?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Label visibility always */
    alwaysShowLabel?: boolean;
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const NavigationBar: Component<NavigationBarProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-nav-bar'];
        if (props.glass) classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style} role="navigation">
            {props.children}
        </div>
    );
};

export const NavigationBarItem: Component<NavigationBarItemProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-nav-bar-item'];
        if (props.selected) classes.push('selected');
        if (props.alwaysShowLabel) classes.push('always-show-label');
        return classes.join(' ');
    };

    return (
        <div
            class={rootClass()}
            onClick={props.onClick}
            role="button"
            tabindex="0"
        >
            <div class="md-nav-bar-item__indicator">
                {props.selected && props.activeIcon ? props.activeIcon : props.icon}
                <Ripple />
            </div>
            <span class="md-nav-bar-item__label">
                {props.label}
            </span>
        </div>
    );
};
