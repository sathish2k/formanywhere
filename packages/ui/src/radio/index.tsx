/**
 * Material 3 Radio Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, splitProps, Component, createContext, useContext, createSignal, ParentComponent, Accessor } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

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
    /** Custom class */
    class?: string;
}

export interface RadioProps {
    /** Radio value */
    value: string;
    /** Disabled state */
    disabled?: boolean;
    /** Standalone checked state */
    checked?: boolean;
    /** Standalone default checked state */
    defaultChecked?: boolean;
    /** Name for standalone form usage */
    name?: string;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Label text */
    label?: string;
    /** Accessibility label */
    ariaLabel?: string;
    /** Standalone change callback */
    onChange?: (checked: boolean, value: string) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── RadioGroup Component ───────────────────────────────────────────────────────

export const RadioGroup: ParentComponent<RadioGroupProps> = (props) => {
    const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? '');
    const value = () => props.value ?? internalValue();

    const onChange = (newValue: string) => {
        if (props.value === undefined) {
            setInternalValue(newValue);
        }
        props.onChange?.(newValue);
    };

    const rootClass = () => {
        const classes = ['md-radio-group'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <RadioGroupContext.Provider value={{
            name: props.name,
            value,
            onChange,
            disabled: props.disabled
        }}>
            <div role="radiogroup" class={rootClass()} style={props.style}>
                {props.children}
            </div>
        </RadioGroupContext.Provider>
    );
};

// ─── Radio Component ────────────────────────────────────────────────────────────

export const Radio: Component<RadioProps> = (props) => {
    const [local] = splitProps(props, ['value', 'disabled', 'checked', 'defaultChecked', 'name', 'size', 'label', 'ariaLabel', 'onChange', 'style', 'class']);
    const group = useContext(RadioGroupContext);

    const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false);

    const isChecked = () => {
        if (group) return group.value() === local.value;
        return local.checked ?? internalChecked();
    };
    const isDisabled = () => local.disabled || group?.disabled;
    const radioName = () => group?.name ?? local.name;

    const handleClick = () => {
        if (isDisabled()) return;
        if (group) {
            group.onChange(local.value);
            return;
        }

        if (local.checked === undefined) {
            setInternalChecked(true);
        }
        local.onChange?.(true, local.value);
    };

    const wrapperClass = () => {
        const classes = ['md-radio-wrapper'];
        if (local.size === 'sm') classes.push('size-sm');
        if (isChecked()) classes.push('checked');
        if (isDisabled()) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <label class={wrapperClass()} style={local.style} data-component="radio">
            <button
                type="button"
                role="radio"
                aria-checked={isChecked()}
                aria-label={local.ariaLabel || local.label}
                disabled={isDisabled()}
                onClick={handleClick}
                class="md-radio-container"
            >
                <Ripple disabled={isDisabled()} />
                <div class="md-radio__outer">
                    <div class="md-radio__inner" />
                </div>
            </button>
            {local.label && (
                <span class="md-radio__label">{local.label}</span>
            )}
            {radioName() && (
                <input type="hidden" name={radioName()} value={isChecked() ? local.value : ''} />
            )}
        </label>
    );
};

export default Radio;
