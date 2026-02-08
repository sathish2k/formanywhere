/**
 * Material 3 TextField Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant text field variants:
 * - filled: Default text field with filled background
 * - outlined: Text field with outline border
 */
import { JSX, splitProps, Component, createSignal, createEffect } from 'solid-js';
import { Ripple } from '../ripple';

export interface TextFieldProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'style'> {
    /** Text field variant */
    variant?: 'filled' | 'outlined';
    /** Label text */
    label?: string;
    /** Supporting/helper text */
    supportingText?: string;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorText?: string;
    /** Leading icon element */
    leadingIcon?: JSX.Element;
    /** Trailing icon element */
    trailingIcon?: JSX.Element;
    /** Prefix text */
    prefix?: string;
    /** Suffix text */
    suffix?: string;
    /** Default value */
    defaultValue?: string;
    /** Custom styles */
    style?: JSX.CSSProperties;
}

const baseStyles: JSX.CSSProperties = {
    position: 'relative',
    display: 'flex',
    'flex-direction': 'column',
    'min-width': '200px',
    'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
};

const inputContainerStyles = (variant: string, error: boolean, focused: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    'align-items': 'center',
    'min-height': '56px',
    padding: variant === 'filled' ? '8px 16px 8px 16px' : '0 16px',
    background: variant === 'filled'
        ? 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))'
        : 'transparent',
    border: variant === 'outlined'
        ? `${focused ? '2px' : '1px'} solid ${error ? 'var(--m3-color-error, #FF5630)' : focused ? 'var(--m3-color-primary, #5B5FED)' : 'var(--m3-color-outline, rgba(120, 117, 121, 0.4))'}`
        : 'none',
    'border-radius': variant === 'filled' ? '4px 4px 0 0' : '4px',
    'border-bottom': variant === 'filled'
        ? `${focused ? '2px' : '1px'} solid ${error ? 'var(--m3-color-error, #FF5630)' : focused ? 'var(--m3-color-primary, #5B5FED)' : 'var(--m3-color-on-surface-variant, #49454E)'}`
        : undefined,
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    cursor: 'text',
    overflow: 'hidden',
});

const labelStyles = (floating: boolean, error: boolean, focused: boolean): JSX.CSSProperties => ({
    position: 'absolute',
    left: '16px',
    top: floating ? '8px' : '50%',
    transform: floating ? 'none' : 'translateY(-50%)',
    'font-size': floating ? '12px' : '16px',
    color: error
        ? 'var(--m3-color-error, #FF5630)'
        : focused
            ? 'var(--m3-color-primary, #5B5FED)'
            : 'var(--m3-color-on-surface-variant, #49454E)',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    'pointer-events': 'none',
    'background-color': 'transparent',
});

const inputStyles: JSX.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    'font-size': '16px',
    color: 'var(--m3-color-on-surface, #1D1B20)',
    'padding-top': '16px',
    'min-width': 0,
};

const supportingStyles = (error: boolean): JSX.CSSProperties => ({
    'font-size': '12px',
    color: error ? 'var(--m3-color-error, #FF5630)' : 'var(--m3-color-on-surface-variant, #49454E)',
    'margin-top': '4px',
    'padding-left': '16px',
});

export const TextField: Component<TextFieldProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'label', 'supportingText', 'error', 'errorText',
        'leadingIcon', 'trailingIcon', 'prefix', 'suffix', 'style', 'value', 'onFocus', 'onBlur'
    ]);

    const [focused, setFocused] = createSignal(false);
    const [hasValue, setHasValue] = createSignal(!!local.value || !!props.defaultValue);
    const variant = local.variant ?? 'filled';
    const isError = local.error || !!local.errorText;

    let inputRef: HTMLInputElement | undefined;

    createEffect(() => {
        setHasValue(!!local.value || (inputRef?.value ?? '').length > 0);
    });

    const handleFocus = (e: FocusEvent) => {
        setFocused(true);
        if (typeof local.onFocus === 'function') {
            (local.onFocus as (e: FocusEvent) => void)(e);
        }
    };

    const handleBlur = (e: FocusEvent) => {
        setFocused(false);
        setHasValue((inputRef?.value ?? '').length > 0);
        if (typeof local.onBlur === 'function') {
            (local.onBlur as (e: FocusEvent) => void)(e);
        }
    };

    // Generate unique ID for accessibility associations
    const inputId = () => props.id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = () => `${inputId()}-error`;

    return (
        <div style={{ ...baseStyles, ...local.style }} data-component="textfield" data-variant={variant}>
            <div
                style={inputContainerStyles(variant, isError, focused())}
                onClick={() => inputRef?.focus()}
            >
                <Ripple />
                {local.leadingIcon && (
                    <span style={{ 'margin-right': '12px', color: 'var(--m3-color-on-surface-variant)' }} aria-hidden="true">
                        {local.leadingIcon}
                    </span>
                )}
                {local.label && (
                    <label
                        for={inputId()}
                        style={labelStyles(focused() || hasValue(), isError, focused())}
                    >
                        {local.label}
                    </label>
                )}
                {local.prefix && focused() && (
                    <span style={{ color: 'var(--m3-color-on-surface-variant)', 'margin-right': '4px' }} aria-hidden="true">
                        {local.prefix}
                    </span>
                )}
                <input
                    ref={inputRef}
                    {...others}
                    id={inputId()}
                    value={local.value}
                    style={inputStyles}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-invalid={isError}
                    aria-describedby={isError ? errorId() : undefined}
                />
                {local.suffix && (
                    <span style={{ color: 'var(--m3-color-on-surface-variant)', 'margin-left': '4px' }} aria-hidden="true">
                        {local.suffix}
                    </span>
                )}
                {local.trailingIcon && (
                    <span style={{ 'margin-left': '12px', color: 'var(--m3-color-on-surface-variant)' }} aria-hidden="true">
                        {local.trailingIcon}
                    </span>
                )}
            </div>
            {(local.supportingText || local.errorText) && (
                <span
                    id={isError ? errorId() : undefined}
                    style={supportingStyles(isError)}
                    role={isError ? 'alert' : undefined}
                    aria-live={isError ? 'polite' : undefined}
                >
                    {local.errorText || local.supportingText}
                </span>
            )}
        </div>
    );
};

// Keep backward compatibility with old Input component
export const Input = TextField;

export default TextField;
