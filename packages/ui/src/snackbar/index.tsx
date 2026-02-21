/**
 * Material 3 Snackbar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

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
    /** Position */
    position?: 'bottom' | 'top';
    /** Glass morphism style */
    glass?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Snackbar: Component<SnackbarProps> = (props) => {
    const duration = () => props.duration ?? 4000;
    const position = () => props.position ?? 'bottom';

    createEffect(() => {
        if (!props.open || duration() === 0) return;

        const timer = setTimeout(() => {
            props.onClose();
        }, duration());

        onCleanup(() => clearTimeout(timer));
    });

    const rootClass = () => {
        const classes = ['md-snackbar'];
        classes.push(position());
        if (props.glass) classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <Show when={props.open}>
            <Portal>
                <div
                    role="alert"
                    aria-live="polite"
                    class={rootClass()}
                    style={props.style}
                    data-component="snackbar"
                >
                    <span class="md-snackbar__message">{props.message}</span>
                    <Show when={props.action && props.onAction}>
                        <button
                            class="md-snackbar__action"
                            onClick={() => {
                                props.onAction?.();
                                props.onClose();
                            }}
                        >
                            {props.action}
                        </button>
                    </Show>
                    <button
                        class="md-snackbar__close"
                        onClick={props.onClose}
                        aria-label="Close"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </Portal>
        </Show>
    );
};

export default Snackbar;
