/**
 * Material 3 Drawer Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show, createEffect, onCleanup } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 DRAWER
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-drawer-backdrop {
    position: fixed;
    inset: 0;
    background: var(--m3-color-scrim, rgba(0, 0, 0, 0.32));
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-drawer-backdrop.open {
    opacity: 1;
    pointer-events: auto;
}

.md-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 360px;
    max-width: 80vw;
    z-index: 101;
    background: var(--m3-color-surface-container-low, rgba(247, 242, 250, 0.95));
    box-shadow: var(--m3-elevation-3, 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.1));
    transform: translateX(-100%);
    transition: transform var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.md-drawer.open {
    transform: translateX(0);
}

/* ─── RIGHT ANCHOR ────────────────────────────────────────────────────────── */

.md-drawer.right {
    left: auto;
    right: 0;
    transform: translateX(100%);
}

.md-drawer.right.open {
    transform: translateX(0);
}

/* ─── CONTENT ─────────────────────────────────────────────────────────────── */

.md-drawer__content {
    padding: 16px;
    flex: 1;
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-drawer.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur-strong, 40px));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong, 40px));
    border-right: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
}

.md-drawer.glass.right {
    border-right: none;
    border-left: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-drawer', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DrawerProps {
    /** Whether the drawer is open */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Which side the drawer opens from */
    anchor?: 'left' | 'right';
    /** Whether clicking the backdrop closes the drawer */
    dismissible?: boolean;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom width (e.g. '300px') */
    width?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Drawer content */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Drawer: ParentComponent<DrawerProps> = (props) => {
    injectStyles();

    const dismissible = () => props.dismissible ?? true;
    const anchor = () => props.anchor ?? 'left';

    // Lock body scroll when open
    createEffect(() => {
        if (typeof document === 'undefined') return;
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    onCleanup(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    });

    const handleBackdropClick = () => {
        if (dismissible()) props.onClose();
    };

    const backdropClass = () => {
        const classes = ['md-drawer-backdrop'];
        if (props.open) classes.push('open');
        return classes.join(' ');
    };

    const drawerClass = () => {
        const classes = ['md-drawer'];
        if (props.open) classes.push('open');
        if (anchor() === 'right') classes.push('right');
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    const drawerStyle = (): JSX.CSSProperties => ({
        ...(props.width ? { width: props.width } : {}),
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: anchor() === 'left' ? 0 : 'auto',
        right: anchor() === 'right' ? 0 : 'auto',
        transform: props.open ? 'translateX(0)' : (anchor() === 'left' ? 'translateX(-100%)' : 'translateX(100%)'),
        visibility: props.open ? 'visible' : 'hidden', // Prevent interaction when closed
        transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1), visibility 300ms cubic-bezier(0.2, 0, 0, 1)', // Ensure transition works with inline transform
        'z-index': 101,
        ...props.style,
    });

    return (
        <>
            <div
                class={backdropClass()}
                onClick={handleBackdropClick}
                style={{
                    position: 'fixed',
                    inset: 0,
                    'z-index': 100,
                    opacity: props.open ? 1 : 0,
                    'pointer-events': props.open ? 'auto' : 'none',
                    transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1)',
                    background: 'var(--m3-color-scrim, rgba(0, 0, 0, 0.32))'
                }}
            />
            <aside class={drawerClass()} style={drawerStyle()} role="dialog" aria-modal="true">
                <div class="md-drawer__content">
                    {props.children}
                </div>
            </aside>
        </>
    );
};

export default Drawer;
