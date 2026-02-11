/**
 * Material 3 Top App Bar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show, createSignal, onMount, onCleanup } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 TOP APP BAR
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-top-app-bar {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 4px 8px 4px;
    min-height: 64px;
    box-sizing: border-box;
    background: var(--m3-color-surface, #FEF7FF);
    color: var(--m3-color-on-surface, #1D1B20);
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    transition: background var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                box-shadow var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

/* ─── LAYOUT SLOTS ────────────────────────────────────────────────────────── */

.md-top-app-bar__navigation {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 4px;
}

.md-top-app-bar__title {
    flex: 1;
    padding: 0 16px;
    font-size: var(--m3-title-large-size, 22px);
    font-weight: 400;
    line-height: var(--m3-title-large-line-height, 30px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.md-top-app-bar__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-right: 4px;
}

/* ─── TYPE MODIFIERS ──────────────────────────────────────────────────────── */

.md-top-app-bar.center-aligned .md-top-app-bar__title {
    text-align: center;
}

.md-top-app-bar.medium {
    flex-wrap: wrap;
    min-height: 112px;
    align-content: flex-end;
}

.md-top-app-bar.medium .md-top-app-bar__title {
    order: 3;
    width: 100%;
    padding: 0 16px 20px;
    font-size: 24px;
}

.md-top-app-bar.large {
    flex-wrap: wrap;
    min-height: 152px;
    align-content: flex-end;
}

.md-top-app-bar.large .md-top-app-bar__title {
    order: 3;
    width: 100%;
    padding: 0 16px 24px;
    font-size: var(--m3-headline-small-size, 24px);
    line-height: var(--m3-headline-small-line-height, 32px);
}

/* ─── ELEVATED (scrolled) ─────────────────────────────────────────────────── */

.md-top-app-bar.elevated {
    background: var(--m3-color-surface-container, rgba(255, 255, 255, 0.7));
    box-shadow: var(--m3-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1));
}

/* ─── FIXED ───────────────────────────────────────────────────────────────── */

.md-top-app-bar.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-top-app-bar.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border-bottom: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
    box-shadow: var(--glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.08));
}

.md-top-app-bar.glass.elevated {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
    backdrop-filter: blur(var(--glass-blur-strong, 40px));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong, 40px));
    box-shadow: var(--glass-shadow-elevated, 0 16px 48px rgba(0, 0, 0, 0.12));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-top-app-bar', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TopAppBarProps {
    /** Title text */
    title?: string;
    /** Navigation icon slot (e.g. back, menu) */
    navigationIcon?: JSX.Element;
    /** Action icon(s) slot */
    actions?: JSX.Element;
    /** Layout variant or visual style */
    variant?: 'small' | 'center-aligned' | 'medium' | 'large' | 'glass';
    /** Whether the bar is elevated (e.g. on scroll) */
    elevated?: boolean;
    /** Whether bar is fixed to top of viewport */
    fixed?: boolean;
    /** Auto-elevate on scroll */
    scrollElevate?: boolean;
    /** Scroll threshold for auto-elevate */
    scrollThreshold?: number;
    /** Enable glass styling (can be used alongside variant) */
    glass?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Children (overrides title slot) */
    children?: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const TopAppBar: Component<TopAppBarProps> = (props) => {
    injectStyles();

    const [scrollElevated, setScrollElevated] = createSignal(false);

    onMount(() => {
        if (props.scrollElevate && typeof window !== 'undefined') {
            const threshold = props.scrollThreshold ?? 0;
            const handler = () => setScrollElevated(window.scrollY > threshold);
            window.addEventListener('scroll', handler, { passive: true });
            onCleanup(() => window.removeEventListener('scroll', handler));
        }
    });

    const rootClass = () => {
        const classes = ['md-top-app-bar'];
        const v = props.variant ?? 'small';
        // Layout variants
        if (v === 'center-aligned' || v === 'medium' || v === 'large') classes.push(v);
        // Glass can be set via variant='glass' or glass prop
        if (v === 'glass' || props.glass) classes.push('glass');
        if (props.elevated || scrollElevated()) classes.push('elevated');
        if (props.fixed) classes.push('fixed');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <header class={rootClass()} style={props.style}>
            <Show when={props.navigationIcon}>
                <div class="md-top-app-bar__navigation">
                    {props.navigationIcon}
                </div>
            </Show>
            <div class="md-top-app-bar__title">
                {props.children ?? props.title}
            </div>
            <Show when={props.actions}>
                <div class="md-top-app-bar__actions">
                    {props.actions}
                </div>
            </Show>
        </header>
    );
};

export default TopAppBar;
