/**
 * Material 3 Snackbar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

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
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 SNACKBAR - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-snackbar-slide-up {
    from { transform: translateX(-50%) translateY(100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

@keyframes md-snackbar-slide-down {
    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

.md-snackbar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    min-width: 288px;
    max-width: 568px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px;
    background: var(--m3-color-inverse-surface, #313033);
    color: var(--m3-color-inverse-on-surface, #F4EFF4);
    border-radius: var(--m3-shape-extra-small, 4px);
    box-shadow: var(--m3-elevation-3, 0 4px 8px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.15));
    font-size: 14px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    z-index: 1100;
}

.md-snackbar.bottom {
    bottom: 24px;
    animation: md-snackbar-slide-up var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.md-snackbar.top {
    top: 24px;
    animation: md-snackbar-slide-down var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

/* Glass snackbar */
.md-snackbar.glass {
    background: var(--glass-tint-dark, rgba(0, 0, 0, 0.6));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--m3-shape-medium, 12px);
}

.md-snackbar__message {
    flex: 1;
}

.md-snackbar__action {
    margin-left: auto;
    padding: 0 8px;
    background: none;
    border: none;
    color: var(--m3-color-inverse-primary, #D0BCFF);
    font-size: 14px;
    font-weight: 500;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1px;
    transition: opacity var(--m3-motion-duration-short, 100ms);
}

.md-snackbar__action:hover {
    opacity: 0.8;
}

.md-snackbar__close {
    display: flex;
    padding: 8px;
    background: none;
    border: none;
    color: var(--m3-color-inverse-on-surface, #F4EFF4);
    cursor: pointer;
    margin-right: -8px;
    border-radius: 50%;
    transition: opacity var(--m3-motion-duration-short, 100ms);
}

.md-snackbar__close:hover {
    opacity: 0.7;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-snackbar', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Snackbar: Component<SnackbarProps> = (props) => {
    const duration = () => props.duration ?? 4000;
    const position = () => props.position ?? 'bottom';

    injectStyles();

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
