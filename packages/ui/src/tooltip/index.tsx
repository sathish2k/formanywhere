/**
 * Material 3 Tooltip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, createSignal, Show, ParentComponent } from 'solid-js';

export interface TooltipProps {
    /** Tooltip text content */
    text: string;
    /** Tooltip position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Whether tooltip is rich (supports more content) */
    rich?: boolean;
    /** Delay before showing (ms) */
    showDelay?: number;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Anchor element */
    children: JSX.Element;
}

const tooltipStyles = (position: string, visible: boolean): JSX.CSSProperties => {
    const base: JSX.CSSProperties = {
        position: 'absolute',
        'z-index': '1200',
        padding: '4px 8px',
        'border-radius': '4px',
        background: 'var(--m3-color-inverse-surface, #313033)',
        color: 'var(--m3-color-inverse-on-surface, #F4EFF4)',
        'font-size': '12px',
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        'white-space': 'nowrap',
        'pointer-events': 'none',
        opacity: visible ? '1' : '0',
        transform: visible ? 'scale(1)' : 'scale(0.9)',
        transition: 'opacity 150ms, transform 150ms cubic-bezier(0.2, 0, 0, 1)',
    };

    switch (position) {
        case 'top':
            return { ...base, bottom: '100%', left: '50%', transform: visible ? 'translateX(-50%)' : 'translateX(-50%) scale(0.9)', 'margin-bottom': '8px' };
        case 'bottom':
            return { ...base, top: '100%', left: '50%', transform: visible ? 'translateX(-50%)' : 'translateX(-50%) scale(0.9)', 'margin-top': '8px' };
        case 'left':
            return { ...base, right: '100%', top: '50%', transform: visible ? 'translateY(-50%)' : 'translateY(-50%) scale(0.9)', 'margin-right': '8px' };
        case 'right':
            return { ...base, left: '100%', top: '50%', transform: visible ? 'translateY(-50%)' : 'translateY(-50%) scale(0.9)', 'margin-left': '8px' };
        default:
            return base;
    }
};

export const Tooltip: ParentComponent<TooltipProps> = (props) => {
    const [visible, setVisible] = createSignal(false);
    const position = props.position ?? 'top';
    const showDelay = props.showDelay ?? 500;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseEnter = () => {
        timeoutId = setTimeout(() => setVisible(true), showDelay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setVisible(false);
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
        >
            {props.children}
            <Show when={visible() || props.rich}>
                <div
                    role="tooltip"
                    style={{ ...tooltipStyles(position, visible()), ...props.style }}
                >
                    {props.text}
                </div>
            </Show>
        </div>
    );
};

export default Tooltip;
