/**
 * Material 3 Time Picker Component for SolidJS
 * Uses native input type="time" styled to look like M3
 */
import { JSX, Component, splitProps } from 'solid-js';
import { TextField } from '../input';

export interface TimePickerProps {
    /** Value (HH:mm format) */
    value?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Label */
    label?: string;
    /** Disabled */
    disabled?: boolean;
    /** Error */
    error?: boolean;
    /** Helper text */
    supportingText?: string; // Renamed from helperText to match TextField
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const TimePicker: Component<TimePickerProps> = (props) => {
    const [local, others] = splitProps(props, ['value', 'onChange', 'label', 'style']);

    const handleChange = (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        local.onChange?.(val);
    };

    return (
        <TextField
            type="time"
            label={local.label || "Select Time"}
            value={local.value}
            onInput={handleChange}  // Use onInput for real-time updates or onChange for commit
            {...others}
            style={{
                width: '100%',
                ...local.style
            }}
            trailingIcon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
            }
        />
    );
};
