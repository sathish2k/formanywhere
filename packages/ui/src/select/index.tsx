/**
 * Material 3 Select Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant select variants:
 * - filled: Default select with filled background
 * - outlined: Select with outline border
 */
import { JSX, splitProps, Component, createSignal, For, Show, createEffect, onCleanup, createMemo, createUniqueId, children as resolveChildren } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    supportingText?: string;
    leadingIcon?: JSX.Element;
    trailingIcon?: JSX.Element;
}

export interface SelectOptionItemProps extends SelectOption {}

export const SelectOptionItem: Component<SelectOptionItemProps> = (props) => {
    return {
        __selectOption: true,
        ...props,
    } as unknown as JSX.Element;
};

export interface SelectProps {
    /** Select variant */
    variant?: 'filled' | 'outlined';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Label text */
    label?: string;
    /** Options */
    options?: SelectOption[];
    /** Composable options via <SelectOptionItem /> children */
    children?: JSX.Element;
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
    /** Required for form validation */
    required?: boolean;
    /** Element ID */
    id?: string;
    /** Accessibility label */
    ariaLabel?: string;
    /** Name for form */
    name?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Open state handler */
    onOpenChange?: (open: boolean) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Select: Component<SelectProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'size', 'label', 'options', 'children', 'value', 'defaultValue', 'placeholder',
        'supportingText', 'error', 'errorText', 'disabled', 'required', 'id', 'ariaLabel', 'name', 'onChange', 'onOpenChange', 'style', 'class'
    ]);

    const [open, setOpen] = createSignal(false);
    const [focused, setFocused] = createSignal(false);
    const [internalValue, setInternalValue] = createSignal(local.defaultValue ?? '');
    const [highlightedIndex, setHighlightedIndex] = createSignal(-1);
    const generatedId = createUniqueId();
    const selectId = () => local.id ?? `md-select-${generatedId}`;
    const listboxId = () => `${selectId()}-listbox`;

    const childNodes = resolveChildren(() => local.children);
    const resolvedOptions = createMemo<SelectOption[]>(() => {
        if (local.options && local.options.length > 0) return local.options;

        const nodes = childNodes.toArray();
        return nodes
            .map((node) => node as unknown as { __selectOption?: boolean } & SelectOption)
            .filter((node) => node && node.__selectOption)
            .map(({ __selectOption: _, ...rest }) => rest);
    });

    const selectedValue = () => local.value ?? internalValue();
    const selectedOption = () => resolvedOptions().find(o => o.value === selectedValue());
    const isError = () => local.error || !!local.errorText;
    const selectedIndex = createMemo(() => resolvedOptions().findIndex((o) => o.value === selectedValue()));

    let containerRef: HTMLDivElement | undefined;

    const setMenuOpen = (next: boolean) => {
        setOpen(next);
        local.onOpenChange?.(next);
        if (next) {
            setHighlightedIndex(selectedIndex() >= 0 ? selectedIndex() : 0);
        }
    };

    // Close on outside click
    createEffect(() => {
        if (!open()) return;

        const handleClick = (e: MouseEvent) => {
            if (!containerRef?.contains(e.target as Node)) {
                setMenuOpen(false);
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
        setMenuOpen(false);
        setFocused(false);
    };

    const selectHighlightedOption = () => {
        const option = resolvedOptions()[highlightedIndex()];
        if (option) {
            handleSelect(option);
        }
    };

    const handleFieldKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (e) => {
        if (local.disabled) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!open()) {
                setMenuOpen(true);
            } else {
                selectHighlightedOption();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open()) {
                setMenuOpen(true);
                return;
            }
            setHighlightedIndex((current) => Math.min(resolvedOptions().length - 1, Math.max(0, current + 1)));
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!open()) {
                setMenuOpen(true);
                return;
            }
            setHighlightedIndex((current) => Math.max(0, current <= 0 ? 0 : current - 1));
            return;
        }

        if (e.key === 'Escape' && open()) {
            e.preventDefault();
            setMenuOpen(false);
            setFocused(false);
        }
    };

    const rootClass = () => {
        const classes = ['md-select'];
        classes.push(local.variant || 'filled');
        classes.push(`size-${local.size || 'md'}`);
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
        if (!selectedValue()) {
            classes.push('placeholder');
            // When label is not floating (not focused and no value), hide placeholder to prevent overlap
            if (!focused() && !selectedValue()) classes.push('label-resting');
        }
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={local.style} ref={containerRef} data-component="select">
            <div
                id={selectId()}
                class="md-select__field"
                role="combobox"
                tabIndex={local.disabled ? -1 : 0}
                aria-expanded={open()}
                aria-controls={listboxId()}
                aria-haspopup="listbox"
                aria-label={local.ariaLabel || local.label}
                aria-invalid={isError()}
                aria-required={local.required}
                onKeyDown={handleFieldKeyDown}
                onClick={() => {
                    if (local.disabled) return;
                    setMenuOpen(!open());
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
            <div class="md-select__menu" id={listboxId()} role="listbox" aria-labelledby={selectId()}>
                <For each={resolvedOptions()}>
                    {(option, index) => (
                        <div
                            class={`md-select__option${option.value === selectedValue() ? ' selected' : ''}${option.disabled ? ' option-disabled' : ''}${index() === highlightedIndex() ? ' highlighted' : ''}`}
                            role="option"
                            aria-selected={option.value === selectedValue()}
                            onClick={() => handleSelect(option)}
                        >
                            <Ripple disabled={option.disabled} />
                            <Show when={option.leadingIcon}>
                                <span class="md-select__option-icon leading">{option.leadingIcon}</span>
                            </Show>
                            <span class="md-select__option-content">
                                <span>{option.label}</span>
                                <Show when={option.supportingText}>
                                    <span class="md-select__option-supporting">{option.supportingText}</span>
                                </Show>
                            </span>
                            <Show when={option.trailingIcon}>
                                <span class="md-select__option-icon trailing">{option.trailingIcon}</span>
                            </Show>
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
                <input type="hidden" name={local.name} value={selectedValue()} required={local.required} />
            )}
        </div>
    );
};

export default Select;
