/**
 * Material 3 Tooltip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, createSignal, Show, ParentComponent } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 TOOLTIP
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-tooltip-anchor {
    position: relative;
    display: inline-flex;
}

.md-tooltip {
    position: absolute;
    z-index: 1200;
    padding: 4px 8px;
    border-radius: var(--m3-shape-extra-small, 4px);
    background: var(--m3-color-inverse-surface, #313033);
    color: var(--m3-color-inverse-on-surface, #F4EFF4);
    font-size: var(--m3-label-medium-size, 12px);
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-tooltip.visible {
    opacity: 1;
    transform: scale(1);
}

/* ─── POSITION MODIFIERS ──────────────────────────────────────────────────── */

.md-tooltip.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    margin-bottom: 8px;
}
.md-tooltip.top.visible {
    transform: translateX(-50%) scale(1);
}

.md-tooltip.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    margin-top: 8px;
}
.md-tooltip.bottom.visible {
    transform: translateX(-50%) scale(1);
}

.md-tooltip.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) scale(0.9);
    margin-right: 8px;
}
.md-tooltip.left.visible {
    transform: translateY(-50%) scale(1);
}

.md-tooltip.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) scale(0.9);
    margin-left: 8px;
}
.md-tooltip.right.visible {
    transform: translateY(-50%) scale(1);
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-tooltip.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    color: var(--m3-color-on-surface, #1D1B20);
    box-shadow: var(--glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.08));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-tooltip', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TooltipProps {
    /** Tooltip text content */
    text: string;
    /** Tooltip position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Whether tooltip is rich (supports more content) */
    rich?: boolean;
    /** Delay before showing (ms) */
    showDelay?: number;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Anchor element */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Tooltip: ParentComponent<TooltipProps> = (props) => {
    injectStyles();

    const [visible, setVisible] = createSignal(false);
    const position = () => props.position ?? 'top';
    const showDelay = () => props.showDelay ?? 500;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseEnter = () => {
        timeoutId = setTimeout(() => setVisible(true), showDelay());
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setVisible(false);
    };

    const tooltipClass = () => {
        const classes = ['md-tooltip', position()];
        if (visible()) classes.push('visible');
        if (props.variant === 'glass') classes.push('glass');
        return classes.join(' ');
    };

    const anchorClass = () => {
        const classes = ['md-tooltip-anchor'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div
            class={anchorClass()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            {props.children}
            <Show when={visible() || props.rich}>
                <div
                    role="tooltip"
                    class={tooltipClass()}
                    style={props.style}
                >
                    {props.text}
                </div>
            </Show>
        </div>
    );
};

export default Tooltip;
