/**
 * Material 3 Progress Components for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides:
 * - CircularProgress: Spinning circular indicator
 * - LinearProgress: Horizontal progress bar
 */
import { JSX, Component, Show } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CircularProgressProps {
    /** Value for determinate progress (0-100) */
    value?: number;
    /** Whether progress is indeterminate */
    indeterminate?: boolean;
    /** Size in pixels */
    size?: number;
    /** Stroke width */
    strokeWidth?: number;
    /** Custom color */
    color?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

export interface LinearProgressProps {
    /** Value for determinate progress (0-100) */
    value?: number;
    /** Buffer value (0-100) */
    buffer?: number;
    /** Whether progress is indeterminate */
    indeterminate?: boolean;
    /** Custom color */
    color?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── CircularProgress ───────────────────────────────────────────────────────────

export const CircularProgress: Component<CircularProgressProps> = (props) => {

    const size = () => props.size ?? 48;
    const strokeWidth = () => props.strokeWidth ?? 4;
    const radius = () => (size() - strokeWidth()) / 2;
    const circumference = () => 2 * Math.PI * radius();
    const isIndeterminate = () => props.indeterminate ?? props.value === undefined;

    const progressOffset = () => {
        if (isIndeterminate()) return circumference() * 0.75;
        const value = Math.min(100, Math.max(0, props.value || 0));
        return circumference() - (value / 100) * circumference();
    };

    const rootClass = () => {
        const classes = ['md-circular-progress'];
        if (isIndeterminate()) classes.push('indeterminate');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style} data-component="circular-progress">
            <svg
                width={size()}
                height={size()}
                viewBox={`0 0 ${size()} ${size()}`}
                role="progressbar"
                aria-valuenow={isIndeterminate() ? undefined : props.value}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <circle
                    class="md-circular-progress__track"
                    cx={size() / 2}
                    cy={size() / 2}
                    r={radius()}
                    stroke-width={strokeWidth()}
                />
                <circle
                    class="md-circular-progress__indicator"
                    cx={size() / 2}
                    cy={size() / 2}
                    r={radius()}
                    stroke-width={strokeWidth()}
                    stroke-dasharray={`${circumference()}`}
                    stroke-dashoffset={progressOffset()}
                    style={props.color ? { stroke: props.color } : undefined}
                />
            </svg>
        </div>
    );
};

// ─── LinearProgress ─────────────────────────────────────────────────────────────

export const LinearProgress: Component<LinearProgressProps> = (props) => {

    const isIndeterminate = () => props.indeterminate ?? props.value === undefined;
    const value = () => Math.min(100, Math.max(0, props.value || 0));

    const rootClass = () => {
        const classes = ['md-linear-progress'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div
            role="progressbar"
            aria-valuenow={isIndeterminate() ? undefined : value()}
            aria-valuemin={0}
            aria-valuemax={100}
            class={rootClass()}
            style={props.style}
            data-component="linear-progress"
        >
            <Show when={!isIndeterminate()} fallback={
                <div
                    class="md-linear-progress__indeterminate"
                    style={props.color ? { background: props.color } : undefined}
                />
            }>
                {props.buffer !== undefined && (
                    <div class="md-linear-progress__buffer" style={{ width: `${props.buffer}%` }} />
                )}
                <div
                    class="md-linear-progress__indicator"
                    style={{
                        width: `${value()}%`,
                        ...(props.color ? { background: props.color } : {})
                    }}
                />
            </Show>
        </div>
    );
};

export default { CircularProgress, LinearProgress };
