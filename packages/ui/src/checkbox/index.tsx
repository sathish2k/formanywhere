/**
 * Material 3 Checkbox Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
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
        if (local.size === 'sm') classes.push('size-sm');
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
