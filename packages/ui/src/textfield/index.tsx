/**
 * Material 3 TextField Component for SolidJS
 * Based on https://github.com/material-components/material-web/tree/main/textfield
 *
 * Implements the M3 spec with:
 * - Filled and Outlined variants
 * - Floating label with notch (outlined) / resting label (filled)
 * - Leading/trailing icons, prefix/suffix text
 * - Textarea support with rows/cols
 * - Error, disabled, required, readonly states
 * - Character counter (maxLength)
 * - Autofill detection
 * - CSS class-based styling with M3 design tokens
 */
import {
    JSX,
    splitProps,
    Component,
    createSignal,
    createEffect,
    Show,
    createUniqueId,
    onMount,
    mergeProps,
} from 'solid-js';
import { Ripple } from '../ripple';

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TextFieldType =
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'date'
    | 'url'
    | 'textarea';

export interface TextFieldProps {
    /** Text field variant */
    variant?: 'filled' | 'outlined';
    /** Label text */
    label?: string;
    /** Supporting/helper text */
    supportingText?: string;
    /** Error state */
    error?: boolean;
    /** Error message (replaces supporting text when error is true) */
    errorText?: string;
    /** Leading icon element */
    leadingIcon?: JSX.Element;
    /** Trailing icon element */
    trailingIcon?: JSX.Element;
    /** Prefix text */
    prefixText?: string;
    /** Suffix text */
    suffixText?: string;
    /** Input type */
    type?: TextFieldType;
    /** Input value (controlled) */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Required state */
    required?: boolean;
    /** Readonly state */
    readOnly?: boolean;
    /** Hide required asterisk */
    noAsterisk?: boolean;
    /** Maximum character count (-1 for none) */
    maxLength?: number;
    /** Minimum character count (-1 for none) */
    minLength?: number;
    /** Pattern for validation */
    pattern?: string;
    /** Number of rows for textarea */
    rows?: number;
    /** Number of cols for textarea */
    cols?: number;
    /** Input name */
    name?: string;
    /** Autocomplete attribute */
    autocomplete?: string;
    /** Input mode */
    inputMode?: string;
    /** Min value for number/date */
    min?: string;
    /** Max value for number/date */
    max?: string;
    /** Step for number */
    step?: string;
    /** Multiple emails */
    multiple?: boolean;
    /** Hide number spinner */
    noSpinner?: boolean;
    /** Text direction override */
    textDirection?: string;
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** ID attribute */
    id?: string;
    /** Focus handler */
    onFocus?: (e: FocusEvent) => void;
    /** Blur handler */
    onBlur?: (e: FocusEvent) => void;
    /** Input handler */
    onInput?: (e: InputEvent) => void;
    /** Change handler */
    onChange?: (e: Event) => void;
    /** Ref callback */
    ref?: (el: HTMLInputElement | HTMLTextAreaElement) => void;
}

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 TEXTFIELD - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-tf-autofill-start { from {} to {} }
@keyframes md-tf-autofill-cancel { from {} to {} }

.md-textfield {
    display: inline-flex;
    flex-direction: column;
    min-width: 210px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    position: relative;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
}

.md-textfield.disabled {
    pointer-events: none;
}

/* ─── FIELD CONTAINER ──────────────────────────────────────────────────────── */

.md-tf-field {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 56px;
    cursor: text;
    width: 100%;
    box-sizing: border-box;
}

.md-textfield.disabled .md-tf-field {
    cursor: default;
}

/* ─── OUTLINED VARIANT ─────────────────────────────────────────────────────── */

.md-textfield.outlined .md-tf-field {
    border-radius: var(--m3-shape-extra-small, 4px);
}

/* Outline border segments */
.md-tf-outline {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    border-radius: inherit;
    box-sizing: border-box;
}

.md-tf-outline-start,
.md-tf-outline-notch,
.md-tf-outline-end {
    box-sizing: border-box;
    transition: border-color 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                border-width 100ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-tf-outline-start {
    width: 12px;
    border-radius: var(--m3-shape-extra-small, 4px) 0 0 var(--m3-shape-extra-small, 4px);
    border-left: 1px solid var(--m3-color-outline, #79747E);
    border-top: 1px solid var(--m3-color-outline, #79747E);
    border-bottom: 1px solid var(--m3-color-outline, #79747E);
    margin-right: -1px;
}

.md-tf-outline-notch {
    position: relative;
    display: flex;
    align-items: center;
    max-width: calc(100% - 24px);
    border-top: 1px solid var(--m3-color-outline, #79747E);
    border-bottom: 1px solid var(--m3-color-outline, #79747E);
    padding: 0;
}

.md-tf-outline-end {
    flex: 1;
    border-radius: 0 var(--m3-shape-extra-small, 4px) var(--m3-shape-extra-small, 4px) 0;
    border-right: 1px solid var(--m3-color-outline, #79747E);
    border-top: 1px solid var(--m3-color-outline, #79747E);
    border-bottom: 1px solid var(--m3-color-outline, #79747E);
    margin-left: -1px;
}

/* Outlined: hover */
.md-textfield.outlined:not(.disabled):not(.error):not(.focused) .md-tf-field:hover .md-tf-outline-start,
.md-textfield.outlined:not(.disabled):not(.error):not(.focused) .md-tf-field:hover .md-tf-outline-notch,
.md-textfield.outlined:not(.disabled):not(.error):not(.focused) .md-tf-field:hover .md-tf-outline-end {
    border-color: var(--m3-color-on-surface, #1D1B20);
}

/* Outlined: focused */
.md-textfield.outlined.focused .md-tf-outline-start {
    border-left-width: 2px;
    border-top-width: 2px;
    border-bottom-width: 2px;
    border-color: var(--m3-color-primary, #6750A4);
}

.md-textfield.outlined.focused .md-tf-outline-notch {
    border-top: none;
    border-bottom-width: 2px;
    border-bottom-color: var(--m3-color-primary, #6750A4);
}

.md-textfield.outlined.populated .md-tf-outline-notch {
    border-top: none;
}

.md-textfield.outlined.focused .md-tf-outline-end {
    border-right-width: 2px;
    border-top-width: 2px;
    border-bottom-width: 2px;
    border-color: var(--m3-color-primary, #6750A4);
}

/* Outlined: error */
.md-textfield.outlined.error .md-tf-outline-start,
.md-textfield.outlined.error .md-tf-outline-notch,
.md-textfield.outlined.error .md-tf-outline-end {
    border-color: var(--m3-color-error, #B3261E);
}

.md-textfield.outlined.error.focused .md-tf-outline-start {
    border-color: var(--m3-color-error, #B3261E);
}

.md-textfield.outlined.error.focused .md-tf-outline-notch {
    border-bottom-color: var(--m3-color-error, #B3261E);
}

.md-textfield.outlined.error.focused .md-tf-outline-end {
    border-color: var(--m3-color-error, #B3261E);
}

/* Outlined: disabled */
.md-textfield.outlined.disabled .md-tf-outline-start,
.md-textfield.outlined.disabled .md-tf-outline-notch,
.md-textfield.outlined.disabled .md-tf-outline-end {
    border-color: var(--m3-color-on-surface, #1D1B20);
    opacity: 0.12;
}

/* ─── FILLED VARIANT ───────────────────────────────────────────────────────── */

.md-textfield.filled .md-tf-field {
    border-radius: var(--m3-shape-extra-small, 4px) var(--m3-shape-extra-small, 4px) 0 0;
    background: var(--m3-color-surface-container-highest, #E6E0E9);
    overflow: hidden;
}

.md-textfield.filled.disabled .md-tf-field {
    background: rgba(var(--m3-color-on-surface-rgb, 29, 27, 32), 0.04);
}

/* Active indicator (bottom line) */
.md-tf-active-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--m3-color-on-surface-variant, #49454E);
    transition: height 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                background 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    pointer-events: none;
}

/* Filled: hover */
.md-textfield.filled:not(.disabled):not(.focused) .md-tf-field:hover .md-tf-active-indicator {
    background: var(--m3-color-on-surface, #1D1B20);
}

/* Filled: focused */
.md-textfield.filled.focused .md-tf-active-indicator {
    height: 2px;
    background: var(--m3-color-primary, #6750A4);
}

/* Filled: error */
.md-textfield.filled.error .md-tf-active-indicator {
    background: var(--m3-color-error, #B3261E);
}

.md-textfield.filled.error.focused .md-tf-active-indicator {
    height: 2px;
    background: var(--m3-color-error, #B3261E);
}

/* Filled: disabled */
.md-textfield.filled.disabled .md-tf-active-indicator {
    background: var(--m3-color-on-surface, #1D1B20);
    opacity: 0.38;
}

/* Filled: hover state layer */
.md-tf-state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    background: var(--m3-color-on-surface, #1D1B20);
    transition: opacity 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-textfield.filled:not(.disabled) .md-tf-field:hover .md-tf-state-layer {
    opacity: 0.08;
}

/* ─── CONTENT WRAPPER ──────────────────────────────────────────────────────── */

.md-tf-content {
    display: flex;
    flex: 1;
    align-items: center;
    padding: 0 16px;
    position: relative;
    z-index: 1;
    min-height: 56px;
}

.md-textfield.filled.has-label .md-tf-content {
    padding-top: 8px;
}

/* ─── LABEL ────────────────────────────────────────────────────────────────── */

/* Outlined label */
.md-tf-label-outlined {
    display: block;
    font-size: 16px;
    line-height: 24px;
    color: var(--m3-color-on-surface-variant, #49454E);
    white-space: nowrap;
    pointer-events: none;
    padding: 0 4px;
    transform-origin: left top;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: font-size 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                line-height 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                transform 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                color 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

/* Outlined: floating state */
.md-textfield.outlined.populated .md-tf-label-outlined,
.md-textfield.outlined.focused .md-tf-label-outlined {
    font-size: 12px;
    line-height: 16px;
    transform: translateY(-28px);
}

/* Outlined: focused label color */
.md-textfield.outlined.focused .md-tf-label-outlined {
    color: var(--m3-color-primary, #6750A4);
}

/* Outlined: error label color */
.md-textfield.outlined.error .md-tf-label-outlined {
    color: var(--m3-color-error, #B3261E);
}

/* Outlined: disabled label */
.md-textfield.outlined.disabled .md-tf-label-outlined {
    color: var(--m3-color-on-surface, #1D1B20);
    opacity: 0.38;
}

/* Filled label */
.md-tf-label-filled {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 24px;
    color: var(--m3-color-on-surface-variant, #49454E);
    pointer-events: none;
    max-width: calc(100% - 32px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 150ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-textfield .md-tf-label-filled.has-leading {
    left: 52px;
    max-width: calc(100% - 68px);
}

/* Filled: floating state */
.md-textfield.filled.populated .md-tf-label-filled,
.md-textfield.filled.focused .md-tf-label-filled {
    top: 8px;
    transform: none;
    font-size: 12px;
    line-height: 16px;
}

/* Filled: focused label color */
.md-textfield.filled.focused .md-tf-label-filled {
    color: var(--m3-color-primary, #6750A4);
}

/* Filled: error label color */
.md-textfield.filled.error .md-tf-label-filled {
    color: var(--m3-color-error, #B3261E);
}

/* Filled: disabled label */
.md-textfield.filled.disabled .md-tf-label-filled {
    color: var(--m3-color-on-surface, #1D1B20);
    opacity: 0.38;
}

/* ─── INPUT ────────────────────────────────────────────────────────────────── */

.md-tf-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: 16px;
    line-height: 24px;
    color: var(--m3-color-on-surface, #1D1B20);
    min-width: 0;
    width: 100%;
    padding: 0;
    caret-color: var(--m3-color-primary, #6750A4);
    -webkit-tap-highlight-color: transparent;
}

.md-tf-input:-webkit-autofill {
    animation-name: md-tf-autofill-start;
}

.md-tf-input:not(:-webkit-autofill) {
    animation-name: md-tf-autofill-cancel;
}

.md-textfield.filled.has-label .md-tf-input {
    padding-top: 16px;
}

.md-tf-input::placeholder {
    color: var(--m3-color-on-surface-variant, #49454E);
    opacity: 1;
}

.md-textfield:not(.focused) .md-tf-input::placeholder {
    color: transparent;
}

.md-textfield.populated:not(.focused) .md-tf-input::placeholder {
    color: transparent;
}

.md-tf-input:disabled {
    color: var(--m3-color-on-surface, #1D1B20);
    opacity: 0.38;
    -webkit-text-fill-color: currentColor;
}

.md-textfield.error .md-tf-input {
    caret-color: var(--m3-color-error, #B3261E);
}

/* Textarea */
.md-tf-input.textarea {
    resize: vertical;
    min-height: 48px;
}

/* No spinner */
.md-textfield.no-spinner .md-tf-input::-webkit-inner-spin-button,
.md-textfield.no-spinner .md-tf-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.md-textfield.no-spinner .md-tf-input[type="number"] {
    -moz-appearance: textfield;
}

/* ─── INPUT WRAPPER ────────────────────────────────────────────────────────── */

.md-tf-input-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
}

/* ─── ICONS ────────────────────────────────────────────────────────────────── */

.md-tf-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--m3-color-on-surface-variant, #49454E);
    flex-shrink: 0;
}

.md-tf-icon.leading {
    margin-right: 16px;
}

.md-tf-icon.trailing {
    margin-left: 16px;
}

.md-textfield.error .md-tf-icon.trailing {
    color: var(--m3-color-error, #B3261E);
}

.md-textfield.disabled .md-tf-icon {
    opacity: 0.38;
}

/* ─── PREFIX / SUFFIX ──────────────────────────────────────────────────────── */

.md-tf-prefix,
.md-tf-suffix {
    font-size: 16px;
    line-height: 24px;
    color: var(--m3-color-on-surface-variant, #49454E);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 100ms var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-textfield.focused .md-tf-prefix,
.md-textfield.focused .md-tf-suffix,
.md-textfield.populated .md-tf-prefix,
.md-textfield.populated .md-tf-suffix {
    opacity: 1;
}

.md-tf-prefix {
    margin-right: 2px;
}

.md-tf-suffix {
    margin-left: 2px;
}

/* ─── SUPPORTING TEXT ──────────────────────────────────────────────────────── */

.md-tf-supporting {
    display: flex;
    justify-content: space-between;
    padding: 4px 16px 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--m3-color-on-surface-variant, #49454E);
    gap: 16px;
}

.md-textfield.error .md-tf-supporting .md-tf-supporting-text {
    color: var(--m3-color-error, #B3261E);
}

.md-textfield.disabled .md-tf-supporting {
    opacity: 0.38;
}

.md-tf-supporting-text {
    flex: 1;
}

.md-tf-counter {
    flex-shrink: 0;
    white-space: nowrap;
}

/* ─── RIPPLE WRAPPER (Filled only) ─────────────────────────────────────────── */

.md-tf-ripple-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-textfield.glass.outlined .md-tf-field {
    background: var(--glass-tint, rgba(255, 255, 255, 0.45));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border-radius: var(--m3-shape-medium, 12px);
}

.md-textfield.glass.outlined .md-tf-outline-start,
.md-textfield.glass.outlined .md-tf-outline-notch,
.md-textfield.glass.outlined .md-tf-outline-end {
    border-color: var(--glass-border, rgba(255, 255, 255, 0.3));
}

.md-textfield.glass.outlined.focused .md-tf-outline-start,
.md-textfield.glass.outlined.focused .md-tf-outline-end {
    border-color: var(--m3-color-primary, #6750A4);
}

.md-textfield.glass.filled .md-tf-field {
    background: var(--glass-tint, rgba(255, 255, 255, 0.35));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border-radius: var(--m3-shape-medium, 12px) var(--m3-shape-medium, 12px) 0 0;
}

.md-textfield.glass .md-tf-input {
    color: var(--glass-on-surface, var(--m3-color-on-surface, #1D1B20));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-textfield', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const TextField: Component<TextFieldProps> = (rawProps) => {
    const props = mergeProps(
        {
            variant: 'outlined' as const,
            type: 'text' as TextFieldType,
            rows: 2,
            cols: 20,
            maxLength: -1,
            minLength: -1,
            noSpinner: false,
            noAsterisk: false,
        },
        rawProps,
    );

    const [local, others] = splitProps(props, [
        'variant', 'label', 'supportingText', 'error', 'errorText',
        'leadingIcon', 'trailingIcon', 'prefixText', 'suffixText',
        'type', 'value', 'defaultValue', 'placeholder', 'disabled',
        'required', 'readOnly', 'noAsterisk', 'maxLength', 'minLength',
        'pattern', 'rows', 'cols', 'name', 'autocomplete', 'inputMode',
        'min', 'max', 'step', 'multiple', 'noSpinner', 'textDirection',
        'class', 'style', 'id', 'onFocus', 'onBlur', 'onInput', 'onChange',
        'ref',
    ]);

    // Inject styles once
    injectStyles();

    // ─── State ─────────────────────────────────────────────────────────────────

    const [focused, setFocused] = createSignal(false);
    const [hasValue, setHasValue] = createSignal(
        !!local.value || !!local.defaultValue,
    );

    let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

    const defaultId = `md-tf-${createUniqueId()}`;
    const inputId = () => local.id || defaultId;
    const supportingId = () => `${inputId()}-supporting`;

    const isError = () => local.error || !!local.errorText;
    const isTextarea = () => local.type === 'textarea';

    // Sync hasValue with controlled value prop
    createEffect(() => {
        setHasValue(
            !!local.value || (inputRef?.value ?? '').length > 0,
        );
    });

    // ─── Handlers ──────────────────────────────────────────────────────────────

    const handleFocus = (e: FocusEvent) => {
        if (local.disabled) return;
        setFocused(true);
        local.onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent) => {
        setFocused(false);
        setHasValue((inputRef?.value ?? '').length > 0);
        local.onBlur?.(e);
    };

    const handleInput = (e: InputEvent) => {
        setHasValue((e.target as HTMLInputElement).value.length > 0);
        local.onInput?.(e);
    };

    const handleChange = (e: Event) => {
        local.onChange?.(e);
    };

    const handleAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'md-tf-autofill-start') {
            setHasValue(true);
        }
    };

    const setRef = (el: HTMLInputElement | HTMLTextAreaElement) => {
        inputRef = el;
        if (typeof local.ref === 'function') {
            local.ref(el);
        }
        // Check initial value
        if (el.value) setHasValue(true);
    };

    // Click on field focuses input
    const handleFieldClick = () => {
        if (!local.disabled) {
            inputRef?.focus();
        }
    };

    // Sync on mount (browser autofill)
    onMount(() => {
        if (inputRef?.value) {
            setHasValue(inputRef.value.length > 0);
        }
    });

    // ─── Computed classes ──────────────────────────────────────────────────────

    const rootClass = () => {
        const classes = ['md-textfield', local.variant || 'outlined'];
        if (focused()) classes.push('focused');
        if (hasValue()) classes.push('populated');
        if (isError() && !local.disabled) classes.push('error');
        if (local.disabled) classes.push('disabled');
        if (local.label) classes.push('has-label');
        if (isTextarea()) classes.push('textarea');
        if (local.noSpinner) classes.push('no-spinner');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    // ─── Supporting text ───────────────────────────────────────────────────────

    const displaySupportingText = () => {
        if (isError() && local.errorText) return local.errorText;
        return local.supportingText || '';
    };

    const showCounter = () => (local.maxLength ?? -1) > -1;

    const showSupporting = () =>
        !!displaySupportingText() || showCounter();

    // Label with asterisk
    const labelText = () => {
        if (!local.label) return '';
        if (local.required && !local.noAsterisk) return `${local.label}*`;
        return local.label;
    };

    // ─── Render ────────────────────────────────────────────────────────────────

    const renderInput = () => {
        const inputStyle: JSX.CSSProperties = {};
        if (local.textDirection) inputStyle.direction = local.textDirection as any;

        const hasMaxLength = (local.maxLength ?? -1) > -1;
        const hasMinLength = (local.minLength ?? -1) > -1;

        if (isTextarea()) {
            return (
                <textarea
                    ref={setRef as any}
                    class={`md-tf-input textarea`}
                    id={inputId()}
                    name={local.name}
                    value={local.value ?? local.defaultValue ?? ''}
                    placeholder={local.placeholder}
                    disabled={local.disabled}
                    readonly={local.readOnly}
                    required={local.required}
                    rows={local.rows}
                    cols={local.cols}
                    autocomplete={local.autocomplete}
                    maxLength={hasMaxLength ? local.maxLength : undefined}
                    minLength={hasMinLength ? local.minLength : undefined}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    onChange={handleChange}
                    onAnimationStart={handleAnimationStart}
                    aria-invalid={isError()}
                    aria-describedby={showSupporting() ? supportingId() : undefined}
                    aria-label={local.label || undefined}
                />
            );
        }

        return (
            <div class="md-tf-input-wrapper">
                <Show when={local.prefixText}>
                    <span class="md-tf-prefix">{local.prefixText}</span>
                </Show>
                <input
                    ref={setRef as any}
                    class="md-tf-input"
                    id={inputId()}
                    type={local.type}
                    name={local.name}
                    value={local.value ?? local.defaultValue ?? ''}
                    placeholder={local.placeholder}
                    disabled={local.disabled}
                    readonly={local.readOnly}
                    required={local.required}
                    autocomplete={local.autocomplete}
                    inputMode={local.inputMode as any}
                    max={local.max}
                    min={local.min}
                    step={local.step}
                    pattern={local.pattern}
                    multiple={local.multiple}
                    maxLength={hasMaxLength ? local.maxLength : undefined}
                    minLength={hasMinLength ? local.minLength : undefined}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    onChange={handleChange}
                    onAnimationStart={handleAnimationStart}
                    aria-invalid={isError()}
                    aria-describedby={showSupporting() ? supportingId() : undefined}
                    aria-label={local.label || undefined}
                />
                <Show when={local.suffixText}>
                    <span class="md-tf-suffix">{local.suffixText}</span>
                </Show>
            </div>
        );
    };

    return (
        <div
            class={rootClass()}
            style={local.style}
            data-component="textfield"
            data-variant={local.variant}
        >
            {/* ─── Field Container ─────────────────────────────────────────── */}
            <div class="md-tf-field" onClick={handleFieldClick}>

                {/* Outlined: border segments */}
                <Show when={local.variant === 'outlined'}>
                    <div class="md-tf-outline">
                        <div class="md-tf-outline-start" />
                        <div class="md-tf-outline-notch">
                            <Show when={local.label}>
                                <label
                                    class="md-tf-label-outlined"
                                    for={inputId()}
                                >
                                    {labelText()}
                                </label>
                            </Show>
                        </div>
                        <div class="md-tf-outline-end" />
                    </div>
                </Show>

                {/* Filled: state layer + active indicator */}
                <Show when={local.variant === 'filled'}>
                    <div class="md-tf-state-layer" />
                    <div class="md-tf-ripple-wrapper">
                        <Ripple disabled={local.disabled} />
                    </div>
                    <Show when={local.label}>
                        <label
                            class={`md-tf-label-filled${local.leadingIcon ? ' has-leading' : ''}`}
                            for={inputId()}
                        >
                            {labelText()}
                        </label>
                    </Show>
                    <div class="md-tf-active-indicator" />
                </Show>

                {/* Content: icons + input */}
                <div class="md-tf-content">
                    <Show when={local.leadingIcon}>
                        <span class="md-tf-icon leading">{local.leadingIcon}</span>
                    </Show>

                    {renderInput()}

                    <Show when={local.trailingIcon}>
                        <span class="md-tf-icon trailing">{local.trailingIcon}</span>
                    </Show>
                </div>
            </div>

            {/* ─── Supporting Text / Counter ────────────────────────────────── */}
            <Show when={showSupporting()}>
                <div class="md-tf-supporting" id={supportingId()} role={isError() ? 'alert' : undefined}>
                    <span class="md-tf-supporting-text">
                        {displaySupportingText()}
                    </span>
                    <Show when={showCounter()}>
                        <span class="md-tf-counter">
                            {(local.value ?? inputRef?.value ?? '').length}/{local.maxLength}
                        </span>
                    </Show>
                </div>
            </Show>
        </div>
    );
};

// Keep backward compatibility
export const Input = TextField;
export default TextField;
