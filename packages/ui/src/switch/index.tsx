/**
 * Material 3 Switch Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SwitchProps {
    /** Checked state */
    checked?: boolean;
    /** Default checked state */
    defaultChecked?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Name for form */
    name?: string;
    /** Value for form */
    value?: string;
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Icons in handle */
    icons?: boolean;
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
   M3 SWITCH - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-switch {
    display: inline-flex;
    align-items: center;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.md-switch.disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* Track */
.md-switch__track {
    position: relative;
    width: 52px;
    height: 32px;
    border-radius: var(--m3-shape-full, 16px);
    background: var(--m3-color-surface-container-highest, #E6E0E9);
    border: 2px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
    transition: background var(--m3-motion-duration-short, 200ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                border-color var(--m3-motion-duration-short, 200ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-switch.checked .md-switch__track {
    background: var(--m3-color-primary, #6750A4);
    border-color: var(--m3-color-primary, #6750A4);
}

/* Hover state layer on track */
.md-switch:hover:not(.disabled) .md-switch__track::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: inherit;
}

/* Handle */
.md-switch__handle {
    position: absolute;
    top: 50%;
    left: 6px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: var(--m3-shape-full, 50%);
    background: var(--m3-color-outline, rgba(120, 117, 121, 0.8));
    box-shadow: var(--m3-elevation-1, 0 1px 3px rgba(0,0,0,0.12));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--m3-motion-duration-short, 200ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.md-switch.checked .md-switch__handle {
    left: calc(100% - 28px);
    width: 24px;
    height: 24px;
    background: var(--m3-color-on-primary, #fff);
}

/* Handle grows on hover */
.md-switch:hover:not(.disabled):not(.checked) .md-switch__handle {
    width: 20px;
    height: 20px;
    left: 4px;
}

/* Handle state layer */
.md-switch__handle::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: transparent;
    transition: background var(--m3-motion-duration-short, 150ms);
}

.md-switch:hover:not(.disabled) .md-switch__handle::before {
    background: var(--m3-color-on-surface, rgba(28, 27, 31, 0.08));
}

.md-switch:focus-visible .md-switch__handle::before {
    background: var(--m3-color-on-surface, rgba(28, 27, 31, 0.12));
}

/* Icon inside handle */
.md-switch__icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
    transition: opacity var(--m3-motion-duration-short, 150ms);
}

.md-switch:not(.checked) .md-switch__icon {
    color: var(--m3-color-surface-container-highest, #E6E0E9);
}

.md-switch.checked .md-switch__icon {
    color: var(--m3-color-on-primary-container, #21005D);
}

/* Focus ring */
.md-switch:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 2px;
    border-radius: var(--m3-shape-full, 16px);
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-switch.glass .md-switch__track {
    background: var(--glass-tint, rgba(255, 255, 255, 0.35));
    backdrop-filter: blur(var(--glass-blur, 16px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.3));
}

.md-switch.glass.checked .md-switch__track {
    background: var(--m3-color-primary, rgba(103, 80, 164, 0.8));
    border-color: transparent;
}

.md-switch.glass .md-switch__handle {
    background: var(--glass-on-surface, rgba(255, 255, 255, 0.85));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.md-switch.glass.checked .md-switch__handle {
    background: var(--m3-color-on-primary, rgba(255, 255, 255, 0.95));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-switch', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Switch: Component<SwitchProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'disabled', 'name', 'value', 'onChange', 'icons', 'style', 'class'
    ]);

    injectStyles();

    const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false);
    const isChecked = () => local.checked ?? internalChecked();

    const toggle = () => {
        if (local.disabled) return;
        const newValue = !isChecked();
        if (local.checked === undefined) {
            setInternalChecked(newValue);
        }
        local.onChange?.(newValue);
    };

    const rootClass = () => {
        const classes = ['md-switch'];
        if (isChecked()) classes.push('checked');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked()}
            disabled={local.disabled}
            onClick={toggle}
            class={rootClass()}
            style={local.style}
            data-component="switch"
        >
            <div class="md-switch__track">
                <div class="md-switch__handle">
                    {local.icons && (
                        isChecked() ? (
                            <svg class="md-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        ) : (
                            <svg class="md-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        )
                    )}
                </div>
            </div>
            {local.name && (
                <input type="hidden" name={local.name} value={isChecked() ? local.value || 'on' : ''} />
            )}
        </button>
    );
};

export default Switch;
