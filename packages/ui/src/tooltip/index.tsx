/**
 * Material 3 Tooltip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, createSignal, Show, ParentComponent } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TooltipProps {
    /** Tooltip text content */
    text: string;
    /** Tooltip position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Whether tooltip is rich (supports more content) */
    rich?: boolean;
    /** Delay before showing (ms) */
    showDelay?: number;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Anchor element */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Tooltip: ParentComponent<TooltipProps> = (props) => {

    const [visible, setVisible] = createSignal(false);
    const position = () => props.position ?? 'top';
    const showDelay = () => props.showDelay ?? 500;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseEnter = () => {
        timeoutId = setTimeout(() => setVisible(true), showDelay());
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setVisible(false);
    };

    const tooltipClass = () => {
        const classes = ['md-tooltip', position()];
        if (visible()) classes.push('visible');
        if (props.variant === 'glass') classes.push('glass');
        return classes.join(' ');
    };

    const anchorClass = () => {
        const classes = ['md-tooltip-anchor'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div
            class={anchorClass()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            {props.children}
            <Show when={visible() || props.rich}>
                <div
                    role="tooltip"
                    class={tooltipClass()}
                    style={props.style}
                >
                    {props.text}
                </div>
            </Show>
        </div>
    );
};

export default Tooltip;
