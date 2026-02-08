/**
 * Material 3 Top App Bar Component for SolidJS
 */
import { JSX, Component, splitProps } from 'solid-js';

export interface TopAppBarProps {
    /** Title text */
    title: string;
    /** Navigation icon (start) */
    navigationIcon?: JSX.Element;
    /** Action icons (end) */
    actions?: JSX.Element;
    /** Variant */
    variant?: 'center-aligned' | 'small' | 'medium' | 'large';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Whether to show scroll elevation (simple mode) */
    elevated?: boolean;
}

export const TopAppBar: Component<TopAppBarProps> = (props) => {
    const barStyles = (variant: string, elevated: boolean): JSX.CSSProperties => ({
        display: 'flex',
        'align-items': 'center',
        'justify-content': variant === 'center-aligned' ? 'center' : 'flex-start',
        position: 'relative',
        width: '100%',
        height: variant === 'medium' ? '112px' : variant === 'large' ? '152px' : '64px',
        background: elevated ? 'var(--m3-color-surface-container, #f3edf7)' : 'var(--m3-color-surface, #fdf8fd)',
        padding: '0 16px', // Standard padding
        color: 'var(--m3-color-on-surface, #1d1b20)',
        'box-sizing': 'border-box',
        transition: 'background 200ms ease',
        ...props.style
    });

    const titleStyles = (variant: string): JSX.CSSProperties => {
        let size = '22px';
        let lineHeight = '28px';
        let weight = '400';
        let paddingBottom = '0';
        let marginLeft = '0';

        if (variant === 'medium' || variant === 'large') {
            size = variant === 'medium' ? '24px' : '32px'; // Headline Small/Medium
            paddingBottom = '24px'; // Title moves to bottom
        } else {
            marginLeft = props.navigationIcon ? '16px' : '0';
        }

        return {
            'font-family': 'var(--m3-font-body, Roboto, sans-serif)',
            'font-size': size,
            'line-height': lineHeight,
            'font-weight': weight,
            'flex-grow': 1,
            'text-align': variant === 'center-aligned' ? 'center' : 'left',
            'align-self': (variant === 'medium' || variant === 'large') ? 'flex-end' : 'center',
            'padding-bottom': paddingBottom,
            'margin-left': marginLeft,
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        };
    };

    const actionContainerStyles: JSX.CSSProperties = {
        display: 'flex',
        gap: '8px',
        'margin-left': props.variant === 'center-aligned' ? '0' : 'auto', // Push to end
        'position': props.variant === 'center-aligned' ? 'absolute' : 'relative',
        'right': props.variant === 'center-aligned' ? '16px' : undefined,
    };

    const navContainerStyles: JSX.CSSProperties = {
        'position': props.variant === 'center-aligned' ? 'absolute' : 'relative',
        'left': props.variant === 'center-aligned' ? '16px' : undefined,
        'display': 'flex',
        'align-items': 'center'
    };

    return (
        <header style={barStyles(props.variant || 'small', !!props.elevated)}>
            {props.navigationIcon && (
                <div style={navContainerStyles}>
                    {props.navigationIcon}
                </div>
            )}

            <h1 style={titleStyles(props.variant || 'small')}>
                {props.title}
            </h1>

            {props.actions && (
                <div style={actionContainerStyles}>
                    {props.actions}
                </div>
            )}
        </header>
    );
};
