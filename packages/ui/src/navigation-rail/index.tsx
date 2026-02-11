/**
 * Material 3 Navigation Rail Component for SolidJS
 * Based on M3 navigation rail spec
 *
 * Implements the M3 spec with:
 * - Vertical navigation with active indicator pill
 * - Icon + label layout
 * - Header slot (e.g. FAB)
 * - Active/inactive states with transitions
 * - Ripple on items
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface NavigationRailProps {
    /** Header slot (e.g. FAB) */
    header?: JSX.Element;
    /** Navigation items */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Alignment of items */
    align?: 'start' | 'center' | 'end';
    /** Visual variant */
    variant?: 'standard' | 'glass';
}

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

// ─── Components ─────────────────────────────────────────────────────────────────

export const NavigationRail: Component<NavigationRailProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-nav-rail'];
        if (props.align === 'center') classes.push('align-center');
        if (props.align === 'end') classes.push('align-end');
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style} role="navigation">
            <Show when={props.header}>
                <div class="md-nav-rail__header">{props.header}</div>
            </Show>
            <div class="md-nav-rail__items">
                {props.children}
            </div>
        </div>
    );
};

export const NavigationRailItem: Component<NavigationRailItemProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-nav-rail-item'];
        if (props.selected) classes.push('selected');
        return classes.join(' ');
    };

    return (
        <div
            class={rootClass()}
            onClick={props.onClick}
            role="button"
            tabindex="0"
        >
            <div class="md-nav-rail-item__indicator">
                {props.selected && props.activeIcon ? props.activeIcon : props.icon}
                <Ripple />
            </div>
            {props.label && (
                <span class="md-nav-rail-item__label">
                    {props.label}
                </span>
            )}
        </div>
    );
};
