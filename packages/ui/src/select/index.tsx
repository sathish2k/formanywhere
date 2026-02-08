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
}

const containerStyles = (
    variant: string,
    error: boolean,
    focused: boolean,
    disabled: boolean
): JSX.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    'align-items': 'center',
    'min-height': '56px',
    padding: variant === 'filled' ? '8px 16px' : '0 16px',
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
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
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
});

const menuStyles = (open: boolean): JSX.CSSProperties => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    'max-height': open ? '256px' : '0',
    'overflow-y': 'auto',
    background: 'var(--m3-color-surface-container, rgba(255, 255, 255, 0.95))',
    'border-radius': '0 0 4px 4px',
    'box-shadow': open ? 'var(--m3-elevation-2)' : 'none',
    opacity: open ? '1' : '0',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    'z-index': '100',
});

const optionStyles = (selected: boolean, disabled: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    'align-items': 'center',
    padding: '12px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    background: selected ? 'var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12))' : 'transparent',
    color: selected ? 'var(--m3-color-on-secondary-container)' : 'var(--m3-color-on-surface)',
    'font-size': '16px',
    overflow: 'hidden',
});

export const Select: Component<SelectProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'label', 'options', 'value', 'defaultValue', 'placeholder',
        'supportingText', 'error', 'errorText', 'disabled', 'name', 'onChange', 'style'
    ]);

    const [open, setOpen] = createSignal(false);
    const [focused, setFocused] = createSignal(false);
    const [internalValue, setInternalValue] = createSignal(local.defaultValue ?? '');

    const selectedValue = () => local.value ?? internalValue();
    const selectedOption = () => local.options.find(o => o.value === selectedValue());
    const variant = local.variant ?? 'filled';
    const isError = local.error || !!local.errorText;

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

    return (
        <div style={{ position: 'relative', 'min-width': '200px', ...local.style }} ref={containerRef}>
            <div
                style={containerStyles(variant, isError, focused(), !!local.disabled)}
                onClick={() => {
                    if (local.disabled) return;
                    setOpen(!open());
                    setFocused(true);
                }}
            >
                <Ripple disabled={local.disabled} />
                {local.label && (
                    <span style={labelStyles(focused() || !!selectedValue(), isError, focused())}>
                        {local.label}
                    </span>
                )}
                <span style={{
                    flex: 1,
                    'padding-top': local.label ? '16px' : '0',
                    color: selectedValue() ? 'var(--m3-color-on-surface)' : 'var(--m3-color-on-surface-variant)',
                    'font-size': '16px',
                }}>
                    {selectedOption()?.label || local.placeholder || ''}
                </span>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                        color: 'var(--m3-color-on-surface-variant)',
                        transform: open() ? 'rotate(180deg)' : 'none',
                        transition: 'transform 150ms',
                    }}
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>
            <div style={menuStyles(open())}>
                <For each={local.options}>
                    {(option) => (
                        <div
                            style={optionStyles(option.value === selectedValue(), !!option.disabled)}
                            onClick={() => handleSelect(option)}
                        >
                            <Ripple disabled={option.disabled} />
                            {option.label}
                        </div>
                    )}
                </For>
            </div>
            <Show when={local.supportingText || local.errorText}>
                <span style={{
                    'font-size': '12px',
                    color: isError ? 'var(--m3-color-error)' : 'var(--m3-color-on-surface-variant)',
                    'margin-top': '4px',
                    'padding-left': '16px',
                    display: 'block',
                }}>
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
