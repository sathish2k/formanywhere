/**
 * Material 3 Select Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant select variants:
 * - filled: Default select with filled background
 * - outlined: Select with outline border
 */
import { JSX, splitProps, Component, createSignal, For, Show, createEffect, onCleanup } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    /** Select variant */
    variant?: 'filled' | 'outlined';
    /** Label text */
    label?: string;
    /** Options */
    options: SelectOption[];
    /** Selected value */
    value?: string;
    /** Default value */
    defaultValue?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Supporting/helper text */
    supportingText?: string;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Name for form */
    name?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Select: Component<SelectProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'label', 'options', 'value', 'defaultValue', 'placeholder',
        'supportingText', 'error', 'errorText', 'disabled', 'name', 'onChange', 'style', 'class'
    ]);

    const [open, setOpen] = createSignal(false);
    const [focused, setFocused] = createSignal(false);
    const [internalValue, setInternalValue] = createSignal(local.defaultValue ?? '');

    const selectedValue = () => local.value ?? internalValue();
    const selectedOption = () => local.options.find(o => o.value === selectedValue());
    const isError = () => local.error || !!local.errorText;

    let containerRef: HTMLDivElement | undefined;

    // Close on outside click
    createEffect(() => {
        if (!open()) return;

        const handleClick = (e: MouseEvent) => {
            if (!containerRef?.contains(e.target as Node)) {
                setOpen(false);
                setFocused(false);
            }
        };

        document.addEventListener('click', handleClick);
        onCleanup(() => document.removeEventListener('click', handleClick));
    });

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        if (local.value === undefined) {
            setInternalValue(option.value);
        }
        local.onChange?.(option.value);
        setOpen(false);
        setFocused(false);
    };

    const rootClass = () => {
        const classes = ['md-select'];
        classes.push(local.variant || 'filled');
        if (open()) classes.push('open');
        if (focused()) classes.push('focused');
        if (isError()) classes.push('error');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const labelClass = () => {
        const classes = ['md-select__label'];
        if (focused() || !!selectedValue()) classes.push('floating');
        return classes.join(' ');
    };

    const valueClass = () => {
        const classes = ['md-select__value'];
        if (local.label) classes.push('has-label');
        if (!selectedValue()) classes.push('placeholder');
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={local.style} ref={containerRef} data-component="select">
            <div
                class="md-select__field"
                onClick={() => {
                    if (local.disabled) return;
                    setOpen(!open());
                    setFocused(true);
                }}
            >
                <Ripple disabled={local.disabled} />
                {local.label && (
                    <span class={labelClass()}>{local.label}</span>
                )}
                <span class={valueClass()}>
                    {selectedOption()?.label || local.placeholder || ''}
                </span>
                <svg class="md-select__arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>
            <div class="md-select__menu">
                <For each={local.options}>
                    {(option) => (
                        <div
                            class={`md-select__option${option.value === selectedValue() ? ' selected' : ''}${option.disabled ? ' option-disabled' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            <Ripple disabled={option.disabled} />
                            {option.label}
                        </div>
                    )}
                </For>
            </div>
            <Show when={local.supportingText || local.errorText}>
                <span class="md-select__supporting">
                    {local.errorText || local.supportingText}
                </span>
            </Show>
            {local.name && (
                <input type="hidden" name={local.name} value={selectedValue()} />
            )}
        </div>
    );
};

export default Select;
