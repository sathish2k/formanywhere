/**
 * Material 3 Checkbox Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CheckboxProps {
    /** Checked state */
    checked?: boolean;
    /** Default checked state */
    defaultChecked?: boolean;
    /** Indeterminate state */
    indeterminate?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Name for form */
    name?: string;
    /** Value for form */
    value?: string;
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Error state */
    error?: boolean;
    /** Label content (string or JSX) */
    label?: string | JSX.Element;
    /** Accessibility label (required if label is JSX) */
    ariaLabel?: string;
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
   M3 CHECKBOX - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-checkbox-check {
    0% { stroke-dashoffset: 30; }
    100% { stroke-dashoffset: 0; }
}

.md-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.md-checkbox-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.38;
}

/* Touch target / state layer container */
.md-checkbox-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: inherit;
    overflow: hidden;
    border: none;
    background: transparent;
    padding: 0;
}

.md-checkbox-container:hover:not(:disabled)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--m3-color-on-surface, #1C1B1F);
    opacity: 0.08;
}

.md-checkbox-container:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: -2px;
}

/* Checkbox box */
.md-checkbox-box {
    width: 18px;
    height: 18px;
    border-radius: 2px;
    border: 2px solid var(--m3-color-on-surface-variant, #49454E);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                border-color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    position: relative;
    z-index: 1;
}

/* Checked state */
.md-checkbox-box.checked {
    background: var(--m3-color-primary, #6750A4);
    border-color: var(--m3-color-primary, #6750A4);
}

.md-checkbox-container:hover:not(:disabled) .md-checkbox-box.checked::before {
    background: var(--m3-color-primary, #6750A4);
    opacity: 0.08;
}

/* Error state */
.md-checkbox-box.error {
    border-color: var(--m3-color-error, #B3261E);
}

.md-checkbox-box.checked.error {
    background: var(--m3-color-error, #B3261E);
    border-color: var(--m3-color-error, #B3261E);
}

/* Check mark icon */
.md-checkbox-icon {
    width: 14px;
    height: 14px;
    fill: var(--m3-color-on-primary, #fff);
}

/* Label */
.md-checkbox-label {
    font-size: 14px;
    line-height: 20px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1C1B1F);
    user-select: none;
}

.md-checkbox-wrapper.disabled .md-checkbox-label {
    color: var(--m3-color-on-surface-variant, #49454E);
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-checkbox-wrapper.glass .md-checkbox-box {
    background: var(--glass-tint, rgba(255, 255, 255, 0.35));
    backdrop-filter: blur(var(--glass-blur, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.4));
    border-radius: var(--m3-shape-extra-small, 4px);
}

.md-checkbox-wrapper.glass .md-checkbox-box.checked {
    background: var(--m3-color-primary, rgba(103, 80, 164, 0.85));
    border-color: transparent;
}

.md-checkbox-wrapper.glass .md-checkbox-container:hover:not(:disabled)::before {
    background: var(--glass-hover, rgba(255, 255, 255, 0.15));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-checkbox', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'indeterminate', 'disabled',
        'name', 'value', 'onChange', 'error', 'label', 'ariaLabel', 'style', 'class'
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

    const wrapperClass = () => {
        const classes = ['md-checkbox-wrapper'];
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const boxClass = () => {
        const classes = ['md-checkbox-box'];
        if (isChecked() || local.indeterminate) classes.push('checked');
        if (local.error) classes.push('error');
        return classes.join(' ');
    };

    return (
        <label class={wrapperClass()} style={local.style} data-component="checkbox">
            <button
                type="button"
                role="checkbox"
                aria-checked={local.indeterminate ? 'mixed' : isChecked()}
                aria-label={local.ariaLabel || (typeof local.label === 'string' ? local.label : undefined)}
                disabled={local.disabled}
                onClick={toggle}
                class="md-checkbox-container"
            >
                <Ripple disabled={local.disabled} />
                <div class={boxClass()}>
                    {(isChecked() || local.indeterminate) && (
                        <svg class="md-checkbox-icon" viewBox="0 0 24 24" aria-hidden="true">
                            {local.indeterminate ? (
                                <path d="M19 13H5v-2h14v2z" />
                            ) : (
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            )}
                        </svg>
                    )}
                </div>
            </button>
            {local.label && (
                <span class="md-checkbox-label">{local.label}</span>
            )}
            {local.name && (
                <input type="hidden" name={local.name} value={isChecked() ? local.value || 'on' : ''} />
            )}
        </label>
    );
};

export default Checkbox;
