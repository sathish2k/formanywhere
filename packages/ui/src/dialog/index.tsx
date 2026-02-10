/**
 * Material 3 Dialog Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DialogProps {
    /** Open state */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Dialog title */
    title?: string;
    /** Dialog icon */
    icon?: JSX.Element;
    /** Actions (buttons) */
    actions?: JSX.Element;
    /** Whether to close on backdrop click */
    closeOnBackdropClick?: boolean;
    /** Whether to close on escape */
    closeOnEscape?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Children */
    children: JSX.Element;
}

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 DIALOG - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-dialog-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes md-dialog-scale-in {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
}

.md-dialog-backdrop {
    position: fixed;
    inset: 0;
    background: var(--m3-color-scrim, rgba(0, 0, 0, 0.32));
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: md-dialog-fade-in var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-dialog {
    position: relative;
    min-width: 280px;
    max-width: 560px;
    max-height: calc(100vh - 48px);
    background: var(--m3-color-surface-container-high, rgba(236, 230, 240, 0.95));
    border-radius: var(--m3-shape-extra-large, 28px);
    box-shadow: var(--m3-elevation-3, 0 4px 8px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.15));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    outline: none;
    animation: md-dialog-scale-in var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

/* Glass dialog */
.md-dialog.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.75));
    backdrop-filter: blur(var(--glass-blur-strong, 40px));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong, 40px));
    border: 1px solid var(--glass-border-light, rgba(255, 255, 255, 0.5));
    box-shadow: var(--glass-shadow-elevated, 0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06));
}

/* ─── HEADER ───────────────────────────────────────────────────────────────── */

.md-dialog__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 24px 0;
}

.md-dialog__icon {
    color: var(--m3-color-secondary, #625B71);
}

.md-dialog__title {
    font-size: 24px;
    font-weight: 400;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1D1B20);
    text-align: center;
    margin: 0;
}

/* ─── CONTENT ──────────────────────────────────────────────────────────────── */

.md-dialog__content {
    padding: 16px 24px 24px;
    font-size: 14px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface-variant, #49454E);
    overflow-y: auto;
}

/* ─── ACTIONS ──────────────────────────────────────────────────────────────── */

.md-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 24px 24px;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-dialog', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Dialog: Component<DialogProps> = (props) => {
    const closeOnBackdrop = props.closeOnBackdropClick ?? true;
    const closeOnEsc = props.closeOnEscape ?? true;

    injectStyles();

    let dialogRef: HTMLDivElement | undefined;
    const dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
    const titleId = `${dialogId}-title`;

    createEffect(() => {
        if (!props.open) return;

        // Focus trap: focus the dialog when opened
        setTimeout(() => dialogRef?.focus(), 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEsc) {
                props.onClose();
            }

            // Simple focus trap (Tab key)
            if (e.key === 'Tab' && dialogRef) {
                const focusable = dialogRef.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        onCleanup(() => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        });
    });

    const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            props.onClose();
        }
    };

    const dialogClass = () => {
        const classes = ['md-dialog'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <Show when={props.open}>
            <Portal>
                <div
                    class="md-dialog-backdrop"
                    onClick={handleBackdropClick}
                    data-component="dialog-backdrop"
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={props.title ? titleId : undefined}
                        tabIndex={-1}
                        class={dialogClass()}
                        style={props.style}
                        onClick={(e) => e.stopPropagation()}
                        data-component="dialog"
                    >
                        <Show when={props.icon || props.title}>
                            <div class="md-dialog__header">
                                {props.icon && (
                                    <span class="md-dialog__icon" aria-hidden="true">
                                        {props.icon}
                                    </span>
                                )}
                                {props.title && <h2 id={titleId} class="md-dialog__title">{props.title}</h2>}
                            </div>
                        </Show>
                        <div class="md-dialog__content">
                            {props.children}
                        </div>
                        <Show when={props.actions}>
                            <div class="md-dialog__actions">
                                {props.actions}
                            </div>
                        </Show>
                    </div>
                </div>
            </Portal>
        </Show>
    );
};

// Keep backward compatibility
export const Modal = Dialog;

export default Dialog;
