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
import './styles.scss';

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
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
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
        'variant', 'size', 'label', 'supportingText', 'error', 'errorText',
        'leadingIcon', 'trailingIcon', 'prefixText', 'suffixText',
        'type', 'value', 'defaultValue', 'placeholder', 'disabled',
        'required', 'readOnly', 'noAsterisk', 'maxLength', 'minLength',
        'pattern', 'rows', 'cols', 'name', 'autocomplete', 'inputMode',
        'min', 'max', 'step', 'multiple', 'noSpinner', 'textDirection',
        'class', 'style', 'id', 'onFocus', 'onBlur', 'onInput', 'onChange',
        'ref',
    ]);

    // Inject styles once

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
        classes.push(`size-${local.size || 'md'}`);
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
