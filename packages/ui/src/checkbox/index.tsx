/**
 * Material 3 Checkbox Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
import { Ripple } from '../ripple';

export interface CheckboxProps {
    /** Checked state */
    checked?: boolean;
    /** Default checked state */
    defaultChecked?: boolean;
    /** Indeterminate state */
    indeterminate?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Name for form */
    name?: string;
    /** Value for form */
    value?: string;
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Error state */
    error?: boolean;
    /** Label text */
    label?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
}

const containerStyles = (checked: boolean, disabled: boolean, error: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    width: '40px',
    height: '40px',
    'border-radius': '50%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    overflow: 'hidden',
});

const boxStyles = (checked: boolean, error: boolean): JSX.CSSProperties => ({
    width: '18px',
    height: '18px',
    'border-radius': '2px',
    border: checked
        ? 'none'
        : `2px solid ${error ? 'var(--m3-color-error, #FF5630)' : 'var(--m3-color-on-surface-variant, #49454E)'}`,
    background: checked
        ? error
            ? 'var(--m3-color-error, #FF5630)'
            : 'var(--m3-color-primary, #5B5FED)'
        : 'transparent',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
});

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'indeterminate', 'disabled',
        'name', 'value', 'onChange', 'error', 'label', 'style'
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

    return (
        <label style={{
            display: 'inline-flex',
            'align-items': 'center',
            gap: '4px',
            cursor: local.disabled ? 'not-allowed' : 'pointer',
            ...local.style,
        }} data-component="checkbox">
            <button
                type="button"
                role="checkbox"
                aria-checked={local.indeterminate ? 'mixed' : isChecked()}
                aria-label={local.label}
                disabled={local.disabled}
                onClick={toggle}
                style={{
                    ...containerStyles(isChecked(), !!local.disabled, !!local.error),
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                }}
            >
                <Ripple disabled={local.disabled} />
                <div style={boxStyles(isChecked() || !!local.indeterminate, !!local.error)}>
                    {(isChecked() || local.indeterminate) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
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
                <span style={{
                    'font-size': '14px',
                    color: local.disabled ? 'var(--m3-color-on-surface-variant)' : 'var(--m3-color-on-surface)',
                }}>
                    {local.label}
                </span>
            )}
            {local.name && (
                <input type="hidden" name={local.name} value={isChecked() ? local.value || 'on' : ''} />
            )}
        </label>
    );
};

export default Checkbox;
