/**
 * Material 3 Slider Component for SolidJS
 * Based on https://github.com/material-components/material-web/tree/main/slider
 *
 * Implements the M3 spec with:
 * - Native input[type="range"] for accessibility
 * - Visual track with active/inactive fill
 * - Custom thumb with hover halo
 * - Error, disabled states
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, splitProps, Component, createSignal, mergeProps } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SliderProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    /** Current value (controlled) */
    value?: number;
    /** Default value (uncontrolled) */
    defaultValue?: number;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Label */
    label?: string;
    /** Show value tooltip on hover/active */
    showValue?: boolean;
    /** Change handler */
    onChange?: (value: number) => void;
    /** Error state */
    error?: boolean;
    /** Color override */
    color?: 'primary' | 'secondary' | 'inherit';
    /** Visual variant */
    variant?: 'standard' | 'glass';
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Slider: Component<SliderProps> = (inputProps) => {
    const defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        color: 'primary' as const,
        defaultValue: 0
    };

    const props = mergeProps(defaultProps, inputProps);

    const [local, others] = splitProps(props, [
        'value', 'defaultValue', 'min', 'max', 'step',
        'disabled', 'label', 'showValue', 'onChange',
        'error', 'color', 'variant', 'style', 'class'
    ]);

    const [internalValue, setInternalValue] = createSignal(local.defaultValue);

    const value = () => local.value ?? internalValue();

    // Calculate percentage for track fill
    const percentage = () => {
        const min = local.min;
        const max = local.max;
        const val = value();
        return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    };

    const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
        const val = Number(e.currentTarget.value);
        if (local.value === undefined) {
            setInternalValue(val);
        }
        local.onChange?.(val);
    };

    const rootClass = () => {
        const classes = ['md-slider'];
        if (local.disabled) classes.push('disabled');
        if (local.error) classes.push('error');
        if (local.color === 'secondary') classes.push('secondary');
        if (local.variant === 'glass') classes.push('glass');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    // Calculate thumb position with offset correction
    const thumbLeft = () => `calc(${percentage()}% + (${8 - percentage() * 0.16}px))`;

    return (
        <div class={rootClass()} style={local.style as JSX.CSSProperties}>
            {local.label && (
                <span class="md-slider__label">{local.label}</span>
            )}

            <div class="md-slider__track-container">
                {/* Visual Track */}
                <div class="md-slider__track">
                    <div
                        class="md-slider__track-fill"
                        style={{ width: `${percentage()}%` }}
                    />
                </div>

                {/* Native Range Input (invisible but interactive) */}
                <input
                    type="range"
                    class="md-slider__input"
                    min={local.min}
                    max={local.max}
                    step={local.step}
                    value={value()}
                    onInput={handleInput}
                    disabled={local.disabled}
                    {...others}
                    aria-label={local.label}
                    aria-valuenow={value()}
                    aria-valuemin={local.min}
                    aria-valuemax={local.max}
                />

                {/* Visual Thumb */}
                <div class="md-slider__thumb" style={{ left: thumbLeft() }}>
                    {local.showValue && (
                        <span class="md-slider__value">{value()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slider;
