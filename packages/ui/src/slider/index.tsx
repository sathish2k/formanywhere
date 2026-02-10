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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 SLIDER - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-slider {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
}

.md-slider.disabled {
    opacity: 0.38;
    pointer-events: none;
}

/* ─── LABEL ────────────────────────────────────────────────────────────────── */

.md-slider__label {
    font-size: var(--m3-body-medium-size, 14px);
    line-height: var(--m3-body-medium-line-height, 20px);
    color: var(--m3-color-on-surface-variant, #49454E);
    font-weight: 500;
}

/* ─── TRACK CONTAINER ──────────────────────────────────────────────────────── */

.md-slider__track-container {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
}

/* ─── TRACK ────────────────────────────────────────────────────────────────── */

.md-slider__track {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    margin-top: -2px;
    background-color: var(--m3-color-surface-container-highest, #E7E0EC);
    border-radius: 2px;
    overflow: hidden;
}

.md-slider.error .md-slider__track {
    background-color: var(--m3-color-error-container, #F9DEDC);
}

/* Active fill */
.md-slider__track-fill {
    height: 100%;
    background-color: var(--m3-color-primary, #6750A4);
    border-radius: inherit;
    transition: width 50ms linear;
}

.md-slider.secondary .md-slider__track-fill {
    background-color: var(--m3-color-secondary, #625B71);
}

.md-slider.error .md-slider__track-fill {
    background-color: var(--m3-color-error, #B3261E);
}

/* ─── NATIVE INPUT ─────────────────────────────────────────────────────────── */

.md-slider__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
    margin: 0;
}

.md-slider.disabled .md-slider__input {
    cursor: not-allowed;
}

/* ─── THUMB ────────────────────────────────────────────────────────────────── */

.md-slider__thumb {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--m3-color-primary, #6750A4);
    box-shadow: var(--m3-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1));
    pointer-events: none;
    z-index: 1;
    transition: transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-slider.secondary .md-slider__thumb {
    background-color: var(--m3-color-secondary, #625B71);
}

.md-slider.error .md-slider__thumb {
    background-color: var(--m3-color-error, #B3261E);
}

/* Hover halo */
.md-slider__thumb::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--m3-color-primary, #6750A4);
    opacity: 0;
    transition: opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-slider__track-container:hover .md-slider__thumb::before {
    opacity: 0.08;
}

.md-slider__track-container:active .md-slider__thumb::before {
    opacity: 0.12;
}

.md-slider__track-container:active .md-slider__thumb {
    transform: translate(-50%, -50%) scale(1.1);
}

/* ─── VALUE TOOLTIP ────────────────────────────────────────────────────────── */

.md-slider__value {
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--m3-color-inverse-surface, #313033);
    color: var(--m3-color-inverse-on-surface, #F4EFF4);
    font-size: var(--m3-label-medium-size, 12px);
    padding: 4px 8px;
    border-radius: var(--m3-shape-extra-small, 4px);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-slider__track-container:hover .md-slider__value,
.md-slider__track-container:active .md-slider__value {
    opacity: 1;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-slider', '');
    style.textContent = css;
    document.head.appendChild(style);
}

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
        'error', 'color', 'style', 'class'
    ]);

    injectStyles();

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
