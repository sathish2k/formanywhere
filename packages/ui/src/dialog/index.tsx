/**
 * Material 3 Dialog Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup, ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';

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
    /** Children */
    children: JSX.Element;
}

const backdropStyles = (open: boolean): JSX.CSSProperties => ({
    position: 'fixed',
    inset: 0,
    background: 'var(--m3-color-scrim, rgba(0, 0, 0, 0.32))',
    'backdrop-filter': 'blur(4px)',
    opacity: open ? '1' : '0',
    'pointer-events': open ? 'auto' : 'none',
    transition: 'opacity 200ms cubic-bezier(0.2, 0, 0, 1)',
    'z-index': '1000',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
});

const dialogStyles = (open: boolean): JSX.CSSProperties => ({
    position: 'relative',
    'min-width': '280px',
    'max-width': '560px',
    'max-height': 'calc(100vh - 48px)',
    background: 'var(--m3-color-surface-container-high, rgba(236, 230, 240, 0.95))',
    'border-radius': '28px',
    'box-shadow': 'var(--m3-elevation-3)',
    transform: open ? 'scale(1)' : 'scale(0.9)',
    opacity: open ? '1' : '0',
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    overflow: 'hidden',
    display: 'flex',
    'flex-direction': 'column',
});

const headerStyles: JSX.CSSProperties = {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    gap: '16px',
    padding: '24px 24px 0',
};

const titleStyles: JSX.CSSProperties = {
    'font-size': '24px',
    'font-weight': '400',
    color: 'var(--m3-color-on-surface, #1D1B20)',
    'text-align': 'center',
    margin: 0,
};

const contentStyles: JSX.CSSProperties = {
    padding: '16px 24px 24px',
    'font-size': '14px',
    color: 'var(--m3-color-on-surface-variant, #49454E)',
    'overflow-y': 'auto',
};

const actionsStyles: JSX.CSSProperties = {
    display: 'flex',
    'justify-content': 'flex-end',
    gap: '8px',
    padding: '24px',
    'padding-top': '0',
};

export const Dialog: Component<DialogProps> = (props) => {
    const closeOnBackdrop = props.closeOnBackdropClick ?? true;
    const closeOnEsc = props.closeOnEscape ?? true;

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

    return (
        <Show when={props.open}>
            <Portal>
                <div
                    style={backdropStyles(props.open)}
                    onClick={handleBackdropClick}
                    data-component="dialog-backdrop"
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={props.title ? titleId : undefined}
                        tabIndex={-1}
                        style={{ ...dialogStyles(props.open), ...props.style }}
                        onClick={(e) => e.stopPropagation()}
                        data-component="dialog"
                    >
                        <Show when={props.icon || props.title}>
                            <div style={headerStyles}>
                                {props.icon && (
                                    <span style={{ color: 'var(--m3-color-secondary, #14b8a6)' }} aria-hidden="true">
                                        {props.icon}
                                    </span>
                                )}
                                {props.title && <h2 id={titleId} style={titleStyles}>{props.title}</h2>}
                            </div>
                        </Show>
                        <div style={contentStyles}>
                            {props.children}
                        </div>
                        <Show when={props.actions}>
                            <div style={actionsStyles}>
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
