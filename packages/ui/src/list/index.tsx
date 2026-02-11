/**
 * Material 3 List Component for SolidJS
 * Based on https://github.com/material-components/material-web/tree/main/list
 *
 * Implements the M3 spec with:
 * - One-line, two-line, three-line items
 * - Leading/trailing elements (icons, avatars, checkboxes)
 * - Interactive items with ripple
 * - Selected, disabled states
 * - Liquid Glass enhanced styling
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 LIST - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-list {
    list-style: none;
    margin: 0;
    padding: 8px 0;
    width: 100%;
}

/* ─── LIST ITEM ────────────────────────────────────────────────────────────── */

.md-list-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 24px 8px 16px;
    min-height: 56px;
    background: transparent;
    text-decoration: none;
    color: inherit;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    overflow: hidden;
    box-sizing: border-box;
}

/* Interactive */
.md-list-item.interactive {
    cursor: pointer;
}

.md-list-item.interactive:hover {
    background: rgba(var(--m3-color-on-surface-rgb, 29, 27, 32), 0.08);
}

.md-list-item.interactive:active {
    background: rgba(var(--m3-color-on-surface-rgb, 29, 27, 32), 0.12);
}

/* Selected */
.md-list-item.selected {
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12));
}

.md-list-item.selected:hover {
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.16));
}

/* Disabled */
.md-list-item.disabled {
    opacity: 0.38;
    pointer-events: none;
    cursor: default;
}

/* ─── CONTENT ──────────────────────────────────────────────────────────────── */

.md-list-item__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.md-list-item__headline {
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: var(--m3-body-large-size, 16px);
    font-weight: 400;
    color: var(--m3-color-on-surface, #1D1B20);
    line-height: var(--m3-body-large-line-height, 24px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.md-list-item__supporting {
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: var(--m3-body-medium-size, 14px);
    color: var(--m3-color-on-surface-variant, #49454E);
    line-height: var(--m3-body-medium-line-height, 20px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ─── SLOTS ────────────────────────────────────────────────────────────────── */

.md-list-item__start {
    display: flex;
    align-items: center;
    color: var(--m3-color-on-surface-variant, #49454E);
    flex-shrink: 0;
}

.md-list-item__end {
    display: flex;
    align-items: center;
    color: var(--m3-color-on-surface-variant, #49454E);
    flex-shrink: 0;
}

.md-list-item__trailing-text {
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    font-size: var(--m3-body-medium-size, 14px);
    color: var(--m3-color-on-surface-variant, #49454E);
    flex-shrink: 0;
}

/* ─── LIST DIVIDER ─────────────────────────────────────────────────────────── */

.md-list-divider {
    height: 1px;
    background: var(--m3-color-outline-variant, #CAC4D0);
    margin: 0 16px;
    list-style: none;
}

.md-list-divider.inset {
    margin-left: 56px;
}

/* ─── LINK ITEM ────────────────────────────────────────────────────────────── */

.md-list-item a {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-list.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    border-radius: var(--m3-shape-large, 16px);
    overflow: hidden;
}

.md-list.glass .md-list-item.interactive:hover {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
}

.md-list.glass .md-list-item.selected {
    background: color-mix(in srgb, var(--m3-color-primary, #6750A4) 12%, transparent);
}

.md-list.glass .md-list-divider {
    background: var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-list', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ListProps {
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Children */
    children: JSX.Element;
}

export interface ListItemProps {
    /** Headline text */
    headline: string;
    /** Supporting text (second line) */
    supportingText?: string;
    /** Trailing supporting text */
    trailingSupportingText?: string;
    /** Leading element (icon, avatar, image) */
    start?: JSX.Element;
    /** Trailing element (icon, checkbox, etc) */
    end?: JSX.Element;
    /** Whether item is clickable */
    interactive?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Selected state */
    selected?: boolean;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Link href */
    href?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const List: ParentComponent<ListProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-list'];
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <ul role="list" class={rootClass()} style={props.style}>
            {props.children}
        </ul>
    );
};

export const ListItem: Component<ListItemProps> = (props) => {
    injectStyles();

    const isInteractive = () => props.interactive ?? (!!props.onClick || !!props.href);

    const rootClass = () => {
        const classes = ['md-list-item'];
        if (isInteractive()) classes.push('interactive');
        if (props.disabled) classes.push('disabled');
        if (props.selected) classes.push('selected');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    const content = () => (
        <>
            {isInteractive() && !props.disabled && <Ripple />}
            <Show when={props.start}>
                <span class="md-list-item__start">
                    {props.start}
                </span>
            </Show>
            <div class="md-list-item__content">
                <span class="md-list-item__headline">{props.headline}</span>
                <Show when={props.supportingText}>
                    <span class="md-list-item__supporting">{props.supportingText}</span>
                </Show>
            </div>
            <Show when={props.trailingSupportingText}>
                <span class="md-list-item__trailing-text">
                    {props.trailingSupportingText}
                </span>
            </Show>
            <Show when={props.end}>
                <span class="md-list-item__end">
                    {props.end}
                </span>
            </Show>
        </>
    );

    if (props.href) {
        return (
            <li class={rootClass()} style={props.style}>
                <a href={props.href}>
                    {content()}
                </a>
            </li>
        );
    }

    return (
        <li
            class={rootClass()}
            style={props.style}
            onClick={props.disabled ? undefined : props.onClick}
        >
            {content()}
        </li>
    );
};

// List Divider
export const ListDivider: Component<{ inset?: boolean; class?: string }> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-list-divider'];
        if (props.inset) classes.push('inset');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return <li role="separator" class={rootClass()} />;
};

export default List;
