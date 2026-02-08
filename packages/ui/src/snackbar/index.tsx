/**
 * Material 3 Snackbar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface SnackbarProps {
    /** Open state */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Message text */
    message: string;
    /** Action button text */
    action?: string;
    /** Action click handler */
    onAction?: () => void;
    /** Auto-hide duration in ms (0 to disable) */
    duration?: number;
    /** Whether snackbar is at top */
    position?: 'bottom' | 'top';
    /** Custom style */
    style?: JSX.CSSProperties;
}

const snackbarStyles = (open: boolean, position: string): JSX.CSSProperties => ({
    position: 'fixed',
    left: '50%',
    [position]: '24px',
    transform: `translateX(-50%) translateY(${open ? '0' : position === 'bottom' ? '100%' : '-100%'})`,
    'min-width': '288px',
    'max-width': '568px',
    display: 'flex',
    'align-items': 'center',
    gap: '8px',
    padding: '14px 16px',
    background: 'var(--m3-color-inverse-surface, #313033)',
    color: 'var(--m3-color-inverse-on-surface, #F4EFF4)',
    'border-radius': '4px',
    'box-shadow': 'var(--m3-elevation-3)',
    'font-size': '14px',
    'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
    opacity: open ? '1' : '0',
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    'z-index': '1100',
});

const actionStyles: JSX.CSSProperties = {
    'margin-left': 'auto',
    padding: '0 8px',
    background: 'none',
    border: 'none',
    color: 'var(--m3-color-inverse-primary, #D0BCFF)',
    'font-size': '14px',
    'font-weight': '500',
    cursor: 'pointer',
    'text-transform': 'uppercase',
    'letter-spacing': '0.1px',
};

const closeStyles: JSX.CSSProperties = {
    display: 'flex',
    padding: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--m3-color-inverse-on-surface, #F4EFF4)',
    cursor: 'pointer',
    'margin-right': '-8px',
};

export const Snackbar: Component<SnackbarProps> = (props) => {
    const duration = props.duration ?? 4000;
    const position = props.position ?? 'bottom';

    createEffect(() => {
        if (!props.open || duration === 0) return;

        const timer = setTimeout(() => {
            props.onClose();
        }, duration);

        onCleanup(() => clearTimeout(timer));
    });

    return (
        <Show when={props.open}>
            <Portal>
                <div
                    role="alert"
                    aria-live="polite"
                    style={{ ...snackbarStyles(props.open, position), ...props.style }}
                >
                    <span style={{ flex: 1 }}>{props.message}</span>
                    <Show when={props.action && props.onAction}>
                        <button
                            style={actionStyles}
                            onClick={() => {
                                props.onAction?.();
                                props.onClose();
                            }}
                        >
                            {props.action}
                        </button>
                    </Show>
                    <button
                        style={closeStyles}
                        onClick={props.onClose}
                        aria-label="Close"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </Portal>
        </Show>
    );
};

export default Snackbar;
