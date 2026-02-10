/**
 * Material 3 Radio Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createContext, useContext, createSignal, ParentComponent, Accessor } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
    name: string;
    value: Accessor<string>;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

export interface RadioGroupProps {
    /** Group name */
    name: string;
    /** Selected value */
    value?: string;
    /** Default selected value */
    defaultValue?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Children */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

export interface RadioProps {
    /** Radio value */
    value: string;
    /** Disabled state */
    disabled?: boolean;
    /** Label text */
    label?: string;
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
   M3 RADIO - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Label wrapper */
.md-radio-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.md-radio-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.38;
}

/* Touch target / state layer container */
.md-radio-container {
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

/* State layer on hover */
.md-radio-container:hover:not(:disabled)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--m3-color-on-surface, #1C1B1F);
    opacity: 0.08;
}

.md-radio-wrapper.checked .md-radio-container:hover:not(:disabled)::before {
    background: var(--m3-color-primary, #6750A4);
    opacity: 0.08;
}

/* Focus ring */
.md-radio-container:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: -2px;
}

/* Outer circle */
.md-radio__outer {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--m3-color-on-surface-variant, #49454E);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transition: border-color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-radio-wrapper.checked .md-radio__outer {
    border-color: var(--m3-color-primary, #6750A4);
}

/* Inner circle (fill) */
.md-radio__inner {
    width: 0;
    height: 0;
    border-radius: 50%;
    background: var(--m3-color-primary, #6750A4);
    transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.md-radio-wrapper.checked .md-radio__inner {
    width: 10px;
    height: 10px;
}

/* Label text */
.md-radio__label {
    font-size: 14px;
    line-height: 20px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1C1B1F);
    user-select: none;
}

.md-radio-wrapper.disabled .md-radio__label {
    color: var(--m3-color-on-surface-variant, #49454E);
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-radio-wrapper.glass .md-radio__outer {
    background: var(--glass-tint, rgba(255, 255, 255, 0.3));
    backdrop-filter: blur(var(--glass-blur, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.4));
}

.md-radio-wrapper.glass.checked .md-radio__outer {
    border-color: var(--m3-color-primary, rgba(103, 80, 164, 0.85));
}

.md-radio-wrapper.glass .md-radio-container:hover:not(:disabled)::before {
    background: var(--glass-hover, rgba(255, 255, 255, 0.15));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-radio', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── RadioGroup Component ───────────────────────────────────────────────────────

export const RadioGroup: ParentComponent<RadioGroupProps> = (props) => {
    const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? '');
    const value = () => props.value ?? internalValue();

    const onChange = (newValue: string) => {
        if (props.value === undefined) {
            setInternalValue(newValue);
        }
        props.onChange?.(newValue);
    };

    const rootClass = () => {
        const classes = ['md-radio-group'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <RadioGroupContext.Provider value={{
            name: props.name,
            value,
            onChange,
            disabled: props.disabled
        }}>
            <div role="radiogroup" class={rootClass()} style={props.style}>
                {props.children}
            </div>
        </RadioGroupContext.Provider>
    );
};

// ─── Radio Component ────────────────────────────────────────────────────────────

export const Radio: Component<RadioProps> = (props) => {
    const [local] = splitProps(props, ['value', 'disabled', 'label', 'style', 'class']);
    const group = useContext(RadioGroupContext);

    injectStyles();

    const isChecked = () => group?.value() === local.value;
    const isDisabled = () => local.disabled || group?.disabled;

    const handleClick = () => {
        if (isDisabled()) return;
        group?.onChange(local.value);
    };

    const wrapperClass = () => {
        const classes = ['md-radio-wrapper'];
        if (isChecked()) classes.push('checked');
        if (isDisabled()) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <label class={wrapperClass()} style={local.style} data-component="radio">
            <button
                type="button"
                role="radio"
                aria-checked={isChecked()}
                aria-label={local.label}
                disabled={isDisabled()}
                onClick={handleClick}
                class="md-radio-container"
            >
                <Ripple disabled={isDisabled()} />
                <div class="md-radio__outer">
                    <div class="md-radio__inner" />
                </div>
            </button>
            {local.label && (
                <span class="md-radio__label">{local.label}</span>
            )}
            {group?.name && (
                <input type="hidden" name={group.name} value={isChecked() ? local.value : ''} />
            )}
        </label>
    );
};

export default Radio;
