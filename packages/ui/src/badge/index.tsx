/**
 * Material 3 Badge Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 BADGE
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-badge-anchor {
    position: relative;
    display: inline-flex;
}

.md-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: var(--m3-shape-full, 9999px);
    font-size: 11px;
    font-weight: 500;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    box-sizing: border-box;
    z-index: 1;
}

/* ─── DOT VARIANT ─────────────────────────────────────────────────────────── */

.md-badge.dot {
    min-width: 8px;
    height: 8px;
    padding: 0;
}

/* ─── COLOR MODIFIERS ─────────────────────────────────────────────────────── */

.md-badge.error {
    background: var(--m3-color-error, #FF5630);
    color: var(--m3-color-on-error, #fff);
}

.md-badge.primary {
    background: var(--m3-color-primary, #6366f1);
    color: var(--m3-color-on-primary, #fff);
}

.md-badge.secondary {
    background: var(--m3-color-secondary, #14b8a6);
    color: var(--m3-color-on-secondary, #fff);
}

/* ─── POSITION MODIFIERS ──────────────────────────────────────────────────── */

.md-badge.top-right  { top: 0; right: 0; transform: translate(50%, -50%); }
.md-badge.top-left   { top: 0; left: 0; transform: translate(-50%, -50%); }
.md-badge.bottom-right { bottom: 0; right: 0; transform: translate(50%, 50%); }
.md-badge.bottom-left  { bottom: 0; left: 0; transform: translate(-50%, 50%); }
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-badge', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BadgeProps {
    /** Badge content (number or text) */
    content?: number | string;
    /** Maximum value to display */
    max?: number;
    /** Show dot only */
    dot?: boolean;
    /** Badge color */
    color?: 'error' | 'primary' | 'secondary';
    /** Whether badge is visible */
    visible?: boolean;
    /** Badge position */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Anchor element */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Badge: ParentComponent<BadgeProps> = (props) => {
    injectStyles();

    const color = () => props.color ?? 'error';
    const position = () => props.position ?? 'top-right';
    const visible = () => props.visible ?? true;
    const dot = () => props.dot ?? false;

    const displayContent = () => {
        if (dot()) return null;
        if (props.content === undefined) return null;
        if (typeof props.content === 'number' && props.max && props.content > props.max) {
            return `${props.max}+`;
        }
        return String(props.content);
    };

    const badgeClass = () => {
        const classes = ['md-badge'];
        classes.push(color());
        classes.push(position());
        if (dot()) classes.push('dot');
        return classes.join(' ');
    };

    const anchorClass = () => {
        const classes = ['md-badge-anchor'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={anchorClass()} style={props.style}>
            {props.children}
            <Show when={visible()}>
                <span class={badgeClass()}>
                    {displayContent()}
                </span>
            </Show>
        </div>
    );
};

export default Badge;
