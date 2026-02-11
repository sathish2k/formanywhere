/**
 * Material 3 Divider Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DividerProps {
    /** Whether divider is inset (has left margin) */
    inset?: boolean;
    /** Whether divider is inset on both sides */
    insetBoth?: boolean;
    /** Vertical orientation */
    vertical?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Divider: Component<DividerProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-divider'];
        if (props.vertical) classes.push('vertical');
        if (props.insetBoth) classes.push('inset-both');
        else if (props.inset) classes.push('inset');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <hr class={rootClass()} style={props.style} />
    );
};

export default Divider;
