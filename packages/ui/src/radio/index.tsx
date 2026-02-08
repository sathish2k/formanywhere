/**
 * Material 3 Radio Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createContext, useContext, createSignal, ParentComponent, Accessor } from 'solid-js';
import { Ripple } from '../ripple';

// Radio Group Context
interface RadioGroupContextValue {
    name: string;
    value: Accessor<string>;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

export interface RadioGroupProps {
    /** Group name */
    name: string;
    /** Selected value */
    value?: string;
    /** Default selected value */
    defaultValue?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Children */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const RadioGroup: ParentComponent<RadioGroupProps> = (props) => {
    const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? '');
    const value = () => props.value ?? internalValue();

    const onChange = (newValue: string) => {
        if (props.value === undefined) {
            setInternalValue(newValue);
        }
        props.onChange?.(newValue);
    };

    return (
        <RadioGroupContext.Provider value={{
            name: props.name,
            value,
            onChange,
            disabled: props.disabled
        }}>
            <div role="radiogroup" style={{ display: 'flex', 'flex-direction': 'column', gap: '8px', ...props.style }}>
                {props.children}
            </div>
        </RadioGroupContext.Provider>
    );
};

export interface RadioProps {
    /** Radio value */
    value: string;
    /** Disabled state */
    disabled?: boolean;
    /** Label text */
    label?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
}

const containerStyles = (disabled: boolean): JSX.CSSProperties => ({
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

const outerCircleStyles = (checked: boolean): JSX.CSSProperties => ({
    width: '20px',
    height: '20px',
    'border-radius': '50%',
    border: `2px solid ${checked ? 'var(--m3-color-primary, #5B5FED)' : 'var(--m3-color-on-surface-variant, #49454E)'}`,
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
});

const innerCircleStyles = (checked: boolean): JSX.CSSProperties => ({
    width: checked ? '10px' : '0',
    height: checked ? '10px' : '0',
    'border-radius': '50%',
    background: 'var(--m3-color-primary, #5B5FED)',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
});

export const Radio: Component<RadioProps> = (props) => {
    const [local] = splitProps(props, ['value', 'disabled', 'label', 'style']);
    const group = useContext(RadioGroupContext);

    const isChecked = () => group?.value() === local.value;
    const isDisabled = () => local.disabled || group?.disabled;

    const handleClick = () => {
        if (isDisabled()) return;
        group?.onChange(local.value);
    };

    return (
        <label style={{
            display: 'inline-flex',
            'align-items': 'center',
            gap: '4px',
            cursor: isDisabled() ? 'not-allowed' : 'pointer',
            ...local.style,
        }} data-component="radio">
            <button
                type="button"
                role="radio"
                aria-checked={isChecked()}
                aria-label={local.label}
                disabled={isDisabled()}
                onClick={handleClick}
                style={{
                    ...containerStyles(!!isDisabled()),
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                }}
            >
                <Ripple disabled={isDisabled()} />
                <div style={outerCircleStyles(isChecked())}>
                    <div style={innerCircleStyles(isChecked())} />
                </div>
            </button>
            {local.label && (
                <span style={{
                    'font-size': '14px',
                    color: isDisabled() ? 'var(--m3-color-on-surface-variant)' : 'var(--m3-color-on-surface)',
                }}>
                    {local.label}
                </span>
            )}
            {group?.name && (
                <input type="hidden" name={group.name} value={isChecked() ? local.value : ''} />
            )}
        </label>
    );
};

export default Radio;
