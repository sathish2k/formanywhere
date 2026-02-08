/**
 * Material 3 Switch Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';

export interface SwitchProps {
    /** Checked state */
    checked?: boolean;
    /** Default checked state */
    defaultChecked?: boolean;
    /** Disabled state */
    disabled?: boolean;
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
}

const trackStyles = (checked: boolean, disabled: boolean): JSX.CSSProperties => ({
    position: 'relative',
    width: '52px',
    height: '32px',
    'border-radius': '16px',
    background: checked
        ? 'var(--m3-color-primary, #5B5FED)'
        : 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))',
    border: checked
        ? 'none'
        : '2px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4))',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
});

const handleStyles = (checked: boolean): JSX.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: checked ? 'calc(100% - 28px)' : '4px',
    transform: 'translateY(-50%)',
    width: checked ? '24px' : '16px',
    height: checked ? '24px' : '16px',
    'border-radius': '50%',
    background: checked
        ? 'var(--m3-color-on-primary, #fff)'
        : 'var(--m3-color-outline, rgba(120, 117, 121, 0.8))',
    'box-shadow': 'var(--m3-elevation-1)',
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
});

export const Switch: Component<SwitchProps> = (props) => {
    const [local] = splitProps(props, [
        'checked', 'defaultChecked', 'disabled', 'name', 'value', 'onChange', 'icons', 'style'
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
        <button
            type="button"
            role="switch"
            aria-checked={isChecked()}
            disabled={local.disabled}
            onClick={toggle}
            style={{
                ...trackStyles(isChecked(), !!local.disabled),
                ...local.style,
                border: 'none',
                background: 'none',
                padding: 0,
            }}
        >
            <div style={trackStyles(isChecked(), !!local.disabled)}>
                <div style={handleStyles(isChecked())}>
                    {local.icons && (
                        isChecked() ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
