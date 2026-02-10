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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 SELECT - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-select {
    position: relative;
    min-width: 200px;
}

/* ─── FIELD ────────────────────────────────────────────────────────────────── */

.md-select__field {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 56px;
    cursor: pointer;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: border-color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-select.disabled .md-select__field {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* Filled variant */
.md-select.filled .md-select__field {
    padding: 8px 16px;
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
    border: none;
    border-bottom: 1px solid var(--m3-color-on-surface-variant, #49454E);
    border-radius: var(--m3-shape-extra-small, 4px) var(--m3-shape-extra-small, 4px) 0 0;
}

.md-select.filled.focused .md-select__field {
    border-bottom: 2px solid var(--m3-color-primary, #6750A4);
}

.md-select.filled.error .md-select__field {
    border-bottom-color: var(--m3-color-error, #B3261E);
}

.md-select.filled .md-select__field:hover:not(.disabled) {
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.5));
}

/* Outlined variant */
.md-select.outlined .md-select__field {
    padding: 0 16px;
    background: transparent;
    border: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
    border-radius: var(--m3-shape-extra-small, 4px);
}

.md-select.outlined.focused .md-select__field {
    border: 2px solid var(--m3-color-primary, #6750A4);
    padding: 0 15px; /* compensate for 2px border */
}

.md-select.outlined.error .md-select__field {
    border-color: var(--m3-color-error, #B3261E);
}

.md-select.outlined .md-select__field:hover:not(.disabled) {
    border-color: var(--m3-color-on-surface, #1C1B1F);
}

/* ─── LABEL ────────────────────────────────────────────────────────────────── */

.md-select__label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface-variant, #49454E);
    pointer-events: none;
    transition: all var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-select__label.floating {
    top: 8px;
    transform: none;
    font-size: 12px;
}

.md-select.focused .md-select__label {
    color: var(--m3-color-primary, #6750A4);
}

.md-select.error .md-select__label {
    color: var(--m3-color-error, #B3261E);
}

/* ─── VALUE ────────────────────────────────────────────────────────────────── */

.md-select__value {
    flex: 1;
    font-size: 16px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1C1B1F);
    min-height: 24px;
    display: flex;
    align-items: center;
}

.md-select__value.has-label {
    padding-top: 16px;
}

.md-select__value.placeholder {
    color: var(--m3-color-on-surface-variant, #49454E);
}

/* ─── ARROW ICON ───────────────────────────────────────────────────────────── */

.md-select__arrow {
    width: 24px;
    height: 24px;
    fill: var(--m3-color-on-surface-variant, #49454E);
    transition: transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    flex-shrink: 0;
}

.md-select.open .md-select__arrow {
    transform: rotate(180deg);
}

/* ─── DROPDOWN MENU ────────────────────────────────────────────────────────── */

.md-select__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 0;
    overflow-y: auto;
    background: var(--m3-color-surface-container, rgba(255, 255, 255, 0.95));
    border-radius: 0 0 var(--m3-shape-extra-small, 4px) var(--m3-shape-extra-small, 4px);
    box-shadow: none;
    opacity: 0;
    z-index: 100;
    transition: max-height var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-select.open .md-select__menu {
    max-height: 256px;
    opacity: 1;
    box-shadow: var(--m3-elevation-2, 0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.15));
}

/* ─── OPTION ───────────────────────────────────────────────────────────────── */

.md-select__option {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    font-size: 16px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1C1B1F);
    overflow: hidden;
    transition: background var(--m3-motion-duration-short, 100ms);
}

.md-select__option:hover {
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
}

.md-select__option.selected {
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12));
    color: var(--m3-color-on-secondary-container, #6750A4);
}

.md-select__option.option-disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* ─── SUPPORTING TEXT ──────────────────────────────────────────────────────── */

.md-select__supporting {
    font-size: 12px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface-variant, #49454E);
    margin-top: 4px;
    padding-left: 16px;
    display: block;
}

.md-select.error .md-select__supporting {
    color: var(--m3-color-error, #B3261E);
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-select.glass .md-select__field {
    background: var(--glass-tint, rgba(255, 255, 255, 0.45));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    border-radius: var(--m3-shape-medium, 12px);
}

.md-select.glass.focused .md-select__field {
    border-color: var(--m3-color-primary, #6750A4);
    border-width: 2px;
}

.md-select.glass .md-select__menu {
    background: var(--glass-tint, rgba(255, 255, 255, 0.75));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    border-radius: 0 0 var(--m3-shape-medium, 12px) var(--m3-shape-medium, 12px);
}

.md-select.glass .md-select__option:hover {
    background: var(--glass-hover, rgba(255, 255, 255, 0.2));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-select', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Select: Component<SelectProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'label', 'options', 'value', 'defaultValue', 'placeholder',
        'supportingText', 'error', 'errorText', 'disabled', 'name', 'onChange', 'style', 'class'
    ]);

    injectStyles();

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
