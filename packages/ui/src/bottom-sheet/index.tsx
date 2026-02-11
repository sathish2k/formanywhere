/**
 * Material 3 Bottom Sheet Component for SolidJS
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
   M3 BOTTOM SHEET
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-bottom-sheet-backdrop {
    position: fixed;
    inset: 0;
    background: var(--m3-color-scrim, rgba(0, 0, 0, 0.32));
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-bottom-sheet-backdrop.open {
    opacity: 1;
    pointer-events: auto;
}

.md-bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    z-index: 101;
    background: var(--m3-color-surface-container-low, rgba(247, 242, 250, 0.95));
    border-radius: var(--m3-shape-extra-large, 28px) var(--m3-shape-extra-large, 28px) 0 0;
    box-shadow: var(--m3-elevation-3, 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.1));
    transform: translateY(100%);
    transition: transform var(--m3-motion-duration-medium, 300ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
    overflow: auto;
}

.md-bottom-sheet.open {
    transform: translateY(0);
}

/* ─── DRAG HANDLE ─────────────────────────────────────────────────────────── */

.md-bottom-sheet__drag-handle {
    display: flex;
    justify-content: center;
    padding: 22px 0 0;
}

.md-bottom-sheet__drag-handle::after {
    content: '';
    width: 32px;
    height: 4px;
    border-radius: var(--m3-shape-full, 9999px);
    background: var(--m3-color-on-surface-variant, #49454F);
    opacity: 0.4;
}

/* ─── CONTENT ─────────────────────────────────────────────────────────────── */

.md-bottom-sheet__content {
    padding: 24px;
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-bottom-sheet.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur-strong, 40px));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong, 40px));
    border-top: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    box-shadow: var(--glass-shadow-elevated, 0 16px 48px rgba(0, 0, 0, 0.12));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-bottom-sheet', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BottomSheetProps {
    /** Whether the bottom sheet is open */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Show a drag handle */
    dragHandle?: boolean;
    /** Whether clicking the backdrop closes the sheet */
    dismissible?: boolean;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Sheet content */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const BottomSheet: ParentComponent<BottomSheetProps> = (props) => {
    injectStyles();

    const dismissible = () => props.dismissible ?? true;

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
        const classes = ['md-bottom-sheet-backdrop'];
        if (props.open) classes.push('open');
        return classes.join(' ');
    };

    const sheetClass = () => {
        const classes = ['md-bottom-sheet'];
        if (props.open) classes.push('open');
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <>
            <div class={backdropClass()} onClick={handleBackdropClick} />
            <div class={sheetClass()} style={props.style} role="dialog" aria-modal="true">
                <Show when={props.dragHandle !== false}>
                    <div class="md-bottom-sheet__drag-handle" />
                </Show>
                <div class="md-bottom-sheet__content">
                    {props.children}
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
