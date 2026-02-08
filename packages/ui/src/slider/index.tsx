/**
 * Material 3 Slider Component for SolidJS
 * Accessibility: Uses native input[type="range"] for maximum compatibility
 */
import { JSX, splitProps, Component, createSignal, mergeProps, createEffect } from 'solid-js';

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
}

export const Slider: Component<SliderProps> = (inputProps) => {
    const defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        color: 'primary',
        defaultValue: 0
    };

    const props = mergeProps(defaultProps, inputProps);

    const [local, others] = splitProps(props, [
        'value', 'defaultValue', 'min', 'max', 'step',
        'disabled', 'label', 'showValue', 'onChange',
        'error', 'color', 'style', 'class'
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

    const getColorVar = () => {
        if (local.error) return 'var(--m3-color-error, #FF5630)';
        if (local.color === 'secondary') return 'var(--m3-color-secondary, #625B71)';
        return 'var(--m3-color-primary, #6750A4)';
    };

    return (
        <div class="slider-container" style={{
            display: 'flex',
            'flex-direction': 'column',
            gap: '8px',
            width: '100%',
            opacity: local.disabled ? '0.38' : '1',
            'pointer-events': local.disabled ? 'none' : 'auto',
            ...(local.style as JSX.CSSProperties),
        }}>
            {local.label && (
                <span style={{
                    'font-size': '14px',
                    color: 'var(--m3-color-on-surface-variant)',
                    'font-weight': '500'
                }}>
                    {local.label}
                </span>
            )}

            <div style={{
                position: 'relative',
                height: '40px',
                display: 'flex',
                'align-items': 'center',
            }}>
                {/* Visual Track */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    height: '4px',
                    'margin-top': '-2px',
                    'background-color': 'var(--m3-color-surface-variant, #E7E0EC)',
                    'border-radius': '2px',
                    overflow: 'hidden'
                }}>
                    {/* Active Track Fill */}
                    <div style={{
                        width: `${percentage()}%`,
                        height: '100%',
                        'background-color': getColorVar(),
                    }} />
                </div>

                {/* Native Range Input (Opacity 0 but clickable) */}
                <input
                    type="range"
                    min={local.min}
                    max={local.max}
                    step={local.step}
                    value={value()}
                    onInput={handleInput}
                    disabled={local.disabled}
                    {...others}
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        opacity: '0',
                        cursor: local.disabled ? 'not-allowed' : 'pointer',
                        'z-index': '2',
                        margin: '0'
                    }}
                    aria-label={local.label}
                    aria-valuenow={value()}
                    aria-valuemin={local.min}
                    aria-valuemax={local.max}
                />

                {/* Visual Thumb - Positioned via calc */}
                {/* Note: This simplistic positioning matches the native input thumb center roughly. 
                    For pixel perfection, we would need to account for thumb width offset. */}
                <div style={{
                    position: 'absolute',
                    left: `calc(${percentage()}% + (${8 - percentage() * 0.15}px))`, // Approximate native thumb offset
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%',
                    'background-color': getColorVar(),
                    'box-shadow': '0 1px 3px rgba(0,0,0,0.3)',
                    'pointer-events': 'none',
                    'z-index': '1',
                    'transition': 'transform 0.1s ease',
                }}>
                    {/* Hover Halo (pseudo-element simulation) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40px',
                        height: '40px',
                        'border-radius': '50%',
                        'background-color': getColorVar(),
                        opacity: '0.1',
                        display: 'none', // Shown by CSS on parent hover potentially, but tricky with inline styles.
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Slider;
