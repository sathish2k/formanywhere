/**
 * Material 3 Navigation Bar Component for SolidJS
 * Based on https://github.com/nicolo-ribaudo/material-web-navigation/tree/main (M3 navigation spec)
 *
 * Implements the M3 spec with:
 * - Bottom navigation with active indicator pill
 * - Icon + label layout
 * - Active/inactive states with transitions
 * - Ripple on items
 * - Liquid Glass enhanced styling
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NavigationBarProps {
    /** Currently selected value */
    value?: string | number;
    /** Change handler */
    onChange?: (value: string | number) => void;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Use liquid glass variant */
    glass?: boolean;
}

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

// ─── Components ─────────────────────────────────────────────────────────────────

export const NavigationBar: Component<NavigationBarProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-nav-bar'];
        if (props.glass) classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style} role="navigation">
            {props.children}
        </div>
    );
};

export const NavigationBarItem: Component<NavigationBarItemProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-nav-bar-item'];
        if (props.selected) classes.push('selected');
        if (props.alwaysShowLabel) classes.push('always-show-label');
        return classes.join(' ');
    };

    return (
        <div
            class={rootClass()}
            onClick={props.onClick}
            role="button"
            tabindex="0"
        >
            <div class="md-nav-bar-item__indicator">
                {props.selected && props.activeIcon ? props.activeIcon : props.icon}
                <Ripple />
            </div>
            <span class="md-nav-bar-item__label">
                {props.label}
            </span>
        </div>
    );
};
