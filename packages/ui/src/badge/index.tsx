/**
 * Material 3 Badge Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

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
    /** Custom class */
    class?: string;
    /** Anchor element */
    children: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Badge: ParentComponent<BadgeProps> = (props) => {

    const color = () => props.color ?? 'error';
    const position = () => props.position ?? 'top-right';
    const visible = () => props.visible ?? true;
    const dot = () => props.dot ?? false;

    const displayContent = () => {
        if (dot()) return null;
        if (props.content === undefined) return null;
        if (typeof props.content === 'number' && props.max && props.content > props.max) {
            return `${props.max}+`;
        }
        return String(props.content);
    };

    const badgeClass = () => {
        const classes = ['md-badge'];
        classes.push(color());
        classes.push(position());
        if (dot()) classes.push('dot');
        return classes.join(' ');
    };

    const anchorClass = () => {
        const classes = ['md-badge-anchor'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={anchorClass()} style={props.style}>
            {props.children}
            <Show when={visible()}>
                <span class={badgeClass()}>
                    {displayContent()}
                </span>
            </Show>
        </div>
    );
};

export default Badge;
