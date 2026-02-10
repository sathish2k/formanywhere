/**
 * Material 3 Progress Components for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides:
 * - CircularProgress: Spinning circular indicator
 * - LinearProgress: Horizontal progress bar
 */
import { JSX, Component, Show } from 'solid-js';

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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 PROGRESS - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ─── CIRCULAR ─────────────────────────────────────────────────────────────── */

@keyframes md-circular-rotate {
    to { transform: rotate(360deg); }
}

@keyframes md-circular-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}

.md-circular-progress {
    display: inline-flex;
}

.md-circular-progress svg {
    transform: rotate(-90deg);
}

.md-circular-progress.indeterminate svg {
    animation: md-circular-rotate 1.4s linear infinite;
    transform: none;
}

.md-circular-progress__track {
    fill: none;
    stroke: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
}

.md-circular-progress__indicator {
    fill: none;
    stroke: var(--m3-color-primary, #6750A4);
    stroke-linecap: round;
    transition: stroke-dashoffset var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-circular-progress.indeterminate .md-circular-progress__indicator {
    animation: md-circular-dash 1.4s ease-in-out infinite;
    transition: none;
}

/* ─── LINEAR ───────────────────────────────────────────────────────────────── */

@keyframes md-linear-indeterminate {
    0% { transform: translateX(-100%) scaleX(0.3); }
    50% { transform: translateX(0%) scaleX(0.5); }
    100% { transform: translateX(100%) scaleX(0.3); }
}

.md-linear-progress {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: var(--m3-shape-full, 2px);
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
    overflow: hidden;
}

.md-linear-progress__indicator {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--m3-color-primary, #6750A4);
    border-radius: var(--m3-shape-full, 2px);
    transition: width var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-linear-progress__buffer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--m3-color-surface-container-highest);
    opacity: 0.4;
    border-radius: var(--m3-shape-full, 2px);
}

.md-linear-progress__indeterminate {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: var(--m3-color-primary, #6750A4);
    animation: md-linear-indeterminate 2s ease-in-out infinite;
    transform-origin: left;
}

/* ─── LIQUID GLASS VARIANT ─────────────────────────────────────────────────── */

.md-linear-progress.glass {
    background: var(--glass-tint, rgba(255, 255, 255, 0.3));
    backdrop-filter: blur(var(--glass-blur, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
    height: 6px;
    border-radius: var(--m3-shape-full, 3px);
}

.md-linear-progress.glass .md-linear-progress__indicator {
    background: var(--m3-color-primary, rgba(103, 80, 164, 0.85));
    border-radius: var(--m3-shape-full, 3px);
}

.md-circular-progress.glass .md-circular-progress__track {
    stroke: var(--glass-tint, rgba(255, 255, 255, 0.25));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-progress', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── CircularProgress ───────────────────────────────────────────────────────────

export const CircularProgress: Component<CircularProgressProps> = (props) => {
    injectStyles();

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
    injectStyles();

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
