/**
 * Material 3 Badge Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';

export interface BadgeProps {
    /** Badge content (number or text) */
    content?: number | string;
    /** Maximum value to display */
    max?: number;
    /** Show dot only */
    dot?: boolean;
    /** Badge color */
    color?: 'error' | 'primary' | 'secondary';
    /** Whether badge is visible */
    visible?: boolean;
    /** Badge position */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Anchor element */
    children: JSX.Element;
}

const colorMap = {
    error: {
        bg: 'var(--m3-color-error, #FF5630)',
        color: 'var(--m3-color-on-error, #fff)',
    },
    primary: {
        bg: 'var(--m3-color-primary, #6366f1)',
        color: 'var(--m3-color-on-primary, #fff)',
    },
    secondary: {
        bg: 'var(--m3-color-secondary, #14b8a6)',
        color: 'var(--m3-color-on-secondary, #fff)',
    },
};

const positionMap = {
    'top-right': { top: '0', right: '0', transform: 'translate(50%, -50%)' },
    'top-left': { top: '0', left: '0', transform: 'translate(-50%, -50%)' },
    'bottom-right': { bottom: '0', right: '0', transform: 'translate(50%, 50%)' },
    'bottom-left': { bottom: '0', left: '0', transform: 'translate(-50%, 50%)' },
};

const badgeStyles = (
    color: keyof typeof colorMap,
    position: keyof typeof positionMap,
    dot: boolean,
    hasContent: boolean
): JSX.CSSProperties => {
    const colors = colorMap[color];
    const pos = positionMap[position];

    return {
        position: 'absolute',
        ...pos,
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'min-width': dot ? '8px' : hasContent ? '16px' : '8px',
        height: dot ? '8px' : '16px',
        padding: dot ? '0' : '0 4px',
        'border-radius': '8px',
        'font-size': '11px',
        'font-weight': '500',
        background: colors.bg,
        color: colors.color,
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        'box-sizing': 'border-box',
    };
};

export const Badge: ParentComponent<BadgeProps> = (props) => {
    const color = props.color ?? 'error';
    const position = props.position ?? 'top-right';
    const visible = props.visible ?? true;
    const dot = props.dot ?? false;

    const displayContent = () => {
        if (dot) return null;
        if (props.content === undefined) return null;
        if (typeof props.content === 'number' && props.max && props.content > props.max) {
            return `${props.max}+`;
        }
        return String(props.content);
    };

    const hasContent = () => displayContent() !== null && displayContent() !== '';

    return (
        <div style={{ position: 'relative', display: 'inline-flex', ...props.style }}>
            {props.children}
            <Show when={visible}>
                <span style={badgeStyles(color, position, dot, hasContent())}>
                    {displayContent()}
                </span>
            </Show>
        </div>
    );
};

export default Badge;
