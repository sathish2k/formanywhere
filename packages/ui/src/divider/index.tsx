/**
 * Material 3 Divider Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 DIVIDER
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-divider {
    margin: 0;
    border: none;
    background: var(--m3-color-outline-variant, rgba(200, 195, 200, 0.3));
}

/* ─── HORIZONTAL (default) ────────────────────────────────────────────────── */

.md-divider:not(.vertical) {
    width: 100%;
    height: 1px;
}

/* ─── VERTICAL ────────────────────────────────────────────────────────────── */

.md-divider.vertical {
    width: 1px;
    height: 100%;
    align-self: stretch;
}

/* ─── INSET MODIFIERS ─────────────────────────────────────────────────────── */

.md-divider.inset {
    margin-left: 16px;
}

.md-divider.inset-both {
    margin-left: 16px;
    margin-right: 16px;
}

.md-divider.vertical.inset {
    margin-left: 16px;
    margin-right: 0;
}

.md-divider.vertical.inset-both {
    margin-left: 16px;
    margin-right: 16px;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-divider', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DividerProps {
    /** Whether divider is inset (has left margin) */
    inset?: boolean;
    /** Whether divider is inset on both sides */
    insetBoth?: boolean;
    /** Vertical orientation */
    vertical?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Divider: Component<DividerProps> = (props) => {
    injectStyles();

    const rootClass = () => {
        const classes = ['md-divider'];
        if (props.vertical) classes.push('vertical');
        if (props.insetBoth) classes.push('inset-both');
        else if (props.inset) classes.push('inset');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <hr class={rootClass()} style={props.style} />
    );
};

export default Divider;
