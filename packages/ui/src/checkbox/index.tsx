/**
 * Material 3 Checkbox Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal, createEffect, on } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

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
    /** Size variant */
    size?: 'sm' | 'md';
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

// ─── Component ──────────────────────────────────────────────────────────────────

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'indeterminate', 'disabled', 'size',
        'name', 'value', 'onChange', 'error', 'label', 'ariaLabel', 'style', 'class'
    ]);

    const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false);
    const isChecked = () => local.checked ?? internalChecked();
    const [prevChecked, setPrevChecked] = createSignal(isChecked());
    const [animateCheck, setAnimateCheck] = createSignal(false);

    // Track transitions for checkmark draw animation
    createEffect(on(isChecked, (current) => {
        const prev = prevChecked();
        if (!prev && current && !local.indeterminate) {
            setAnimateCheck(true);
            // Remove animation class after it completes
            setTimeout(() => setAnimateCheck(false), 350);
        }
        setPrevChecked(current);
    }));

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
        if (isChecked() || local.indeterminate) classes.push('selected');
        else classes.push('unselected');
        if (local.indeterminate) classes.push('indeterminate');
        if (local.size === 'sm') classes.push('size-sm');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const containerClass = () => {
        const classes = ['md-checkbox-container'];
        if (isChecked() || local.indeterminate) classes.push('selected');
        else classes.push('unselected');
        if (local.indeterminate) classes.push('indeterminate');
        if (local.disabled) classes.push('disabled');
        return classes.join(' ');
    };

    const boxClass = () => {
        const classes = ['md-checkbox-box'];
        if (isChecked() || local.indeterminate) classes.push('checked', 'selected');
        else classes.push('unselected');
        if (local.indeterminate) classes.push('indeterminate');
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
                class={containerClass()}
            >
                <Ripple
                    disabled={local.disabled}
                    class={isChecked() || local.indeterminate ? 'selected' : 'unselected'}
                />
                <div class={boxClass()}>
                    <div class="md-checkbox-bg" />
                    <svg
                        class={`md-checkbox-icon${animateCheck() ? ' animate-check' : ''}`}
                        viewBox="0 0 18 18"
                        aria-hidden="true"
                    >
                        {local.indeterminate ? (
                            <rect x="4" y="8" width="10" height="2" rx="0" />
                        ) : (
                            <path d="M6.75 12.127 3.623 9l-.873.87L6.75 13.87l9-9-.87-.87z" />
                        )}
                    </svg>
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
