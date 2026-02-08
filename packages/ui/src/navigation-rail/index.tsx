/**
 * Material 3 Navigation Rail Component for SolidJS
 */
import { JSX, Component } from 'solid-js';
import { Ripple } from '../ripple';

export interface NavigationRailProps {
    /** Header slot (e.g. FAB) */
    header?: JSX.Element;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Alignment of items */
    align?: 'start' | 'center' | 'end';
}

export const NavigationRail: Component<NavigationRailProps> = (props) => {
    const railStyles: JSX.CSSProperties = {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        width: '80px',
        height: '100%',
        background: 'var(--m3-color-surface, #fdf8fd)', // Rail is usually surface
        padding: '12px 0',
        'box-sizing': 'border-box',
        gap: '12px',
        'border-right': '1px solid var(--m3-color-outline-variant, #cac4d0)', // Optional divider
        ...props.style
    };

    const itemsContainerStyles: JSX.CSSProperties = {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        gap: '12px',
        width: '100%',
        'margin-top': props.align === 'center' || props.align === 'end' ? 'auto' : undefined,
        'margin-bottom': props.align === 'center' ? 'auto' : undefined,
    };

    return (
        <div style={railStyles} role="navigation">
            {props.header && <div style={{ 'margin-bottom': '20px' }}>{props.header}</div>}
            <div style={itemsContainerStyles}>
                {props.children}
            </div>
        </div>
    );
};

export interface NavigationRailItemProps {
    /** Value of this item */
    value: string | number;
    /** Icon element */
    icon: JSX.Element;
    /** Active Icon element */
    activeIcon?: JSX.Element;
    /** Label text */
    label?: string;
    /** Whether item is active */
    selected?: boolean;
    /** Click handler */
    onClick?: () => void;
}

export const NavigationRailItem: Component<NavigationRailItemProps> = (props) => {
    const itemStyles = (selected: boolean): JSX.CSSProperties => ({
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        cursor: 'pointer',
        position: 'relative',
        color: selected ? 'var(--m3-color-on-surface, #1d1b20)' : 'var(--m3-color-on-surface-variant, #49454f)',
        gap: '4px',
        width: '100%',
        padding: '4px 0',
    });

    const indicatorStyles = (selected: boolean): JSX.CSSProperties => ({
        width: '56px',
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
        height: '16px', // fixed height to prevent jump
        'line-height': '16px',
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
            {props.label && (
                <span style={labelStyles(!!props.selected)}>
                    {props.label}
                </span>
            )}
        </div>
    );
};
