/**
 * Material 3 Divider Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component } from 'solid-js';

export interface DividerProps {
    /** Whether divider is inset (has left margin) */
    inset?: boolean;
    /** Whether divider is inset on both sides */
    insetBoth?: boolean;
    /** Vertical orientation */
    vertical?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const Divider: Component<DividerProps> = (props) => {
    const isVertical = props.vertical ?? false;

    return (
        <hr
            style={{
                margin: 0,
                border: 'none',
                background: 'var(--m3-color-outline-variant, rgba(200, 195, 200, 0.3))',
                ...(isVertical ? {
                    width: '1px',
                    height: '100%',
                    'align-self': 'stretch',
                    'margin-left': props.inset || props.insetBoth ? '16px' : 0,
                    'margin-right': props.insetBoth ? '16px' : 0,
                } : {
                    width: '100%',
                    height: '1px',
                    'margin-left': props.inset || props.insetBoth ? '16px' : 0,
                    'margin-right': props.insetBoth ? '16px' : 0,
                }),
                ...props.style,
            }}
        />
    );
};

export default Divider;
