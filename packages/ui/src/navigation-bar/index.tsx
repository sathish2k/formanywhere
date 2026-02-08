/**
 * Material 3 Navigation Bar Component for SolidJS
 */
import { JSX, Component, splitProps, children, createMemo } from 'solid-js';
import { Ripple } from '../ripple';

export interface NavigationBarProps {
    /** Currently selected value */
    value?: string | number;
    /** Change handler */
    onChange?: (value: string | number) => void;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const NavigationBar: Component<NavigationBarProps> = (props) => {
    const navStyles: JSX.CSSProperties = {
        display: 'flex',
        'justify-content': 'space-between',
        width: '100%',
        height: '80px',
        background: 'var(--m3-color-surface-container, #f3edf7)',
        color: 'var(--m3-color-on-surface-variant, #49454f)',
        padding: '0 8px', // Optional padding
        'box-sizing': 'border-box',
    };

    return (
        <div style={{ ...navStyles, ...props.style }} role="navigation">
            {props.children}
        </div>
    );
};

export interface NavigationBarItemProps {
    /** Value of this item */
    value: string | number;
    /** Icon element */
    icon: JSX.Element;
    /** Active Icon element (optional) */
    activeIcon?: JSX.Element;
    /** Label text */
    label?: string;
    /** Whether item is active (controlled by parent usually) */
    selected?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Label visibility always */
    alwaysShowLabel?: boolean;
}

export const NavigationBarItem: Component<NavigationBarItemProps> = (props) => {
    const itemStyles = (selected: boolean): JSX.CSSProperties => ({
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        flex: 1,
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        color: selected ? 'var(--m3-color-on-surface, #1d1b20)' : 'var(--m3-color-on-surface-variant, #49454f)',
        gap: '4px',
    });

    const indicatorStyles = (selected: boolean): JSX.CSSProperties => ({
        width: '64px',
        height: '32px',
        'border-radius': '16px',
        background: selected ? 'var(--m3-color-secondary-container, #e8def8)' : 'transparent',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        transition: 'background 200ms cubic-bezier(0.2, 0, 0, 1)',
    });

    const labelStyles = (selected: boolean): JSX.CSSProperties => ({
        'font-family': 'var(--m3-font-body, Roboto, sans-serif)',
        'font-size': '12px',
        'font-weight': selected ? '700' : '500',
        'text-align': 'center',
        opacity: selected || props.alwaysShowLabel ? 1 : 0, // Simplified behavior
        transition: 'all 200ms ease',
    });

    return (
        <div
            style={itemStyles(!!props.selected)}
            onClick={props.onClick}
            role="button"
            tabindex="0"
        >
            <div style={indicatorStyles(!!props.selected)}>
                {props.selected && props.activeIcon ? props.activeIcon : props.icon}
                <Ripple />
            </div>
            <span style={labelStyles(!!props.selected)}>
                {props.label}
            </span>
        </div>
    );
};
