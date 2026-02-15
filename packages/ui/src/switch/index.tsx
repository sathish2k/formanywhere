/**
 * Material 3 Switch Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SwitchProps {
    /** Checked state */
    checked?: boolean;
    /** Default checked state */
    defaultChecked?: boolean;
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
    /** Icons in handle */
    icons?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Switch: Component<SwitchProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'disabled', 'size', 'name', 'value', 'onChange', 'icons', 'style', 'class'
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

    const rootClass = () => {
        const classes = ['md-switch'];
        if (local.size === 'sm') classes.push('md-switch--sm');
        if (isChecked()) classes.push('checked');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked()}
            disabled={local.disabled}
            onClick={toggle}
            class={rootClass()}
            style={local.style}
            data-component="switch"
        >
            <div class="md-switch__track">
                <div class="md-switch__handle">
                    {local.icons && (
                        isChecked() ? (
                            <svg class="md-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        ) : (
                            <svg class="md-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        )
                    )}
                </div>
            </div>
            {local.name && (
                <input type="hidden" name={local.name} value={isChecked() ? local.value || 'on' : ''} />
            )}
        </button>
    );
};

export default Switch;
