/**
 * Material 3 Progress Components for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides:
 * - CircularProgress: Spinning circular indicator
 * - LinearProgress: Horizontal progress bar
 */
import { JSX, Component, Show } from 'solid-js';

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
}

export const CircularProgress: Component<CircularProgressProps> = (props) => {
    const size = props.size ?? 48;
    const strokeWidth = props.strokeWidth ?? 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const isIndeterminate = props.indeterminate ?? props.value === undefined;

    const progressOffset = () => {
        if (isIndeterminate) return circumference * 0.75;
        const value = Math.min(100, Math.max(0, props.value || 0));
        return circumference - (value / 100) * circumference;
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
                transform: 'rotate(-90deg)',
                ...(isIndeterminate ? { animation: 'm3-circular-rotate 1.4s linear infinite' } : {}),
                ...props.style,
            }}
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : props.value}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))"
                stroke-width={strokeWidth}
            />
            {/* Progress circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={props.color || 'var(--m3-color-primary, #5B5FED)'}
                stroke-width={strokeWidth}
                stroke-linecap="round"
                stroke-dasharray={`${circumference}`}
                stroke-dashoffset={progressOffset()}
                style={{
                    transition: isIndeterminate ? 'none' : 'stroke-dashoffset 150ms cubic-bezier(0.2, 0, 0, 1)',
                    ...(isIndeterminate ? { animation: 'm3-circular-dash 1.4s ease-in-out infinite' } : {}),
                }}
            />
        </svg>
    );
};

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
}

const trackStyles: JSX.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '4px',
    'border-radius': '2px',
    background: 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))',
    overflow: 'hidden',
};

const indicatorStyles = (value: number, color?: string): JSX.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    background: color || 'var(--m3-color-primary, #5B5FED)',
    'border-radius': '2px',
    transition: 'width 150ms cubic-bezier(0.2, 0, 0, 1)',
});

const indeterminateStyles = (color?: string): JSX.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: color || 'var(--m3-color-primary, #5B5FED)',
    animation: 'm3-linear-indeterminate 2s ease-in-out infinite',
    'transform-origin': 'left',
});

export const LinearProgress: Component<LinearProgressProps> = (props) => {
    const isIndeterminate = props.indeterminate ?? props.value === undefined;
    const value = () => Math.min(100, Math.max(0, props.value || 0));

    return (
        <div
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : value()}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ ...trackStyles, ...props.style }}
        >
            <Show when={!isIndeterminate} fallback={
                <div style={indeterminateStyles(props.color)} />
            }>
                {props.buffer !== undefined && (
                    <div style={{
                        ...indicatorStyles(props.buffer, undefined),
                        background: 'var(--m3-color-surface-container-highest)',
                        opacity: 0.4,
                    }} />
                )}
                <div style={indicatorStyles(value(), props.color)} />
            </Show>
        </div>
    );
};

export default { CircularProgress, LinearProgress };
