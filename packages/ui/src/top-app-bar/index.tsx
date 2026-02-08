/**
 * Material 3 Top App Bar Component for SolidJS
 */
import { JSX, Component, splitProps } from 'solid-js';

export interface TopAppBarProps {
    /** Title element or text */
    title?: JSX.Element | string;
    /** Navigation icon (start) */
    navigationIcon?: JSX.Element;
    /** Action icons (end) */
    actions?: JSX.Element;
    /** Variant */
    variant?: 'center-aligned' | 'small' | 'medium' | 'large';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Whether to show scroll elevation (simple mode) */
    elevated?: boolean;
    /** Children (rendered between title and actions) */
    children?: JSX.Element;
}

export const TopAppBar: Component<TopAppBarProps> = (props) => {
    // Basic styles for the app bar container
    const barStyles = (variant: string, elevated: boolean): JSX.CSSProperties => ({
        display: 'flex',
        'align-items': 'center',
        // If center-aligned, justify center. Otherwise start.
        'justify-content': variant === 'center-aligned' ? 'center' : 'flex-start',
        position: 'relative',
        width: '100%',
        height: variant === 'medium' ? '112px' : variant === 'large' ? '152px' : '64px',
        // If elevated, use surface-container. If custom class is provided (e.g. glass), it might override this.
        background: elevated ? 'var(--m3-color-surface-container, #f3edf7)' : undefined,
        padding: '0 16px',
        color: 'var(--m3-color-on-surface, #1d1b20)',
        'box-sizing': 'border-box',
        transition: 'background 200ms ease, box-shadow 200ms ease',
        ...props.style
    });

    const titleStyles = (variant: string): JSX.CSSProperties => {
        let size = '22px';
        let paddingBottom = '0';
        let marginLeft = '0';

        if (variant === 'medium' || variant === 'large') {
            size = variant === 'medium' ? '24px' : '32px';
            paddingBottom = '24px';
        } else {
            // Add margin if nav icon exists
            marginLeft = props.navigationIcon ? '16px' : '0';
        }

        return {
            'font-family': 'var(--m3-font-body, Roboto, sans-serif)',
            'font-size': size,
            'line-height': '28px',
            'font-weight': '400',
            // Flex grow only if no children (to push actions to right)
            'flex-grow': props.children ? 0 : 1,
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
        // Identify actions container to push to right
        'margin-left': 'auto',
        'align-items': 'center',
    };

    const navContainerStyles: JSX.CSSProperties = {
        display: 'flex',
        'align-items': 'center'
    };

    const childrenContainerStyles: JSX.CSSProperties = {
        display: 'flex',
        'flex-grow': 1,
        'justify-content': 'center',
        'align-items': 'center',
        'padding': '0 16px',
    };

    return (
        <header
            class={props.class}
            style={barStyles(props.variant || 'small', !!props.elevated)}
        >
            {/* Start: Navigation Icon */}
            {props.navigationIcon && (
                <div style={navContainerStyles}>
                    {props.navigationIcon}
                </div>
            )}

            {/* Title (Logo) */}
            <div style={titleStyles(props.variant || 'small')}>
                {props.title}
            </div>

            {/* Center: Children (Navigation Links) */}
            {props.children && (
                <div style={childrenContainerStyles}>
                    {props.children}
                </div>
            )}

            {/* End: Actions (Auth, Theme Toggle) */}
            {props.actions && (
                <div style={actionContainerStyles}>
                    {props.actions}
                </div>
            )}
        </header>
    );
};
