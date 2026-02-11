/**
 * Material 3 Dialog Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import './styles.scss';

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

// ─── Component ──────────────────────────────────────────────────────────────────

export const Dialog: Component<DialogProps> = (props) => {
    const closeOnBackdrop = () => props.closeOnBackdropClick ?? true;
    const closeOnEsc = () => props.closeOnEscape ?? true;

    let dialogRef: HTMLDivElement | undefined;
    const dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
    const titleId = `${dialogId}-title`;

    createEffect(() => {
        if (!props.open) return;

        // Focus trap: focus the dialog when opened
        setTimeout(() => dialogRef?.focus(), 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEsc()) {
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
        if (e.target === e.currentTarget && closeOnBackdrop()) {
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
