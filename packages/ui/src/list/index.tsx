/**
 * Material 3 List Component for SolidJS
 * Based on https://github.com/material-components/material-web/tree/main/list
 *
 * Implements the M3 spec with:
 * - One-line, two-line, three-line items
 * - Leading/trailing elements (icons, avatars, checkboxes)
 * - Interactive items with ripple
 * - Selected, disabled states
 * - Liquid Glass enhanced styling
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ListProps {
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Children */
    children: JSX.Element;
}

export interface ListItemProps {
    /** Headline text */
    headline: string;
    /** Supporting text (second line) */
    supportingText?: string;
    /** Trailing supporting text */
    trailingSupportingText?: string;
    /** Leading element (icon, avatar, image) */
    start?: JSX.Element;
    /** Trailing element (icon, checkbox, etc) */
    end?: JSX.Element;
    /** Whether item is clickable */
    interactive?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Selected state */
    selected?: boolean;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Link href */
    href?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Components ─────────────────────────────────────────────────────────────────

export const List: ParentComponent<ListProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-list'];
        if (props.variant === 'glass') classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <ul role="list" class={rootClass()} style={props.style}>
            {props.children}
        </ul>
    );
};

export const ListItem: Component<ListItemProps> = (props) => {

    const isInteractive = () => props.interactive ?? (!!props.onClick || !!props.href);

    const rootClass = () => {
        const classes = ['md-list-item'];
        if (isInteractive()) classes.push('interactive');
        if (props.disabled) classes.push('disabled');
        if (props.selected) classes.push('selected');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    const content = () => (
        <>
            {isInteractive() && !props.disabled && <Ripple />}
            <Show when={props.start}>
                <span class="md-list-item__start">
                    {props.start}
                </span>
            </Show>
            <div class="md-list-item__content">
                <span class="md-list-item__headline">{props.headline}</span>
                <Show when={props.supportingText}>
                    <span class="md-list-item__supporting">{props.supportingText}</span>
                </Show>
            </div>
            <Show when={props.trailingSupportingText}>
                <span class="md-list-item__trailing-text">
                    {props.trailingSupportingText}
                </span>
            </Show>
            <Show when={props.end}>
                <span class="md-list-item__end">
                    {props.end}
                </span>
            </Show>
        </>
    );

    if (props.href) {
        return (
            <li class={rootClass()} style={props.style}>
                <a href={props.href}>
                    {content()}
                </a>
            </li>
        );
    }

    return (
        <li
            class={rootClass()}
            style={props.style}
            onClick={props.disabled ? undefined : props.onClick}
        >
            {content()}
        </li>
    );
};

// List Divider
export const ListDivider: Component<{ inset?: boolean; class?: string }> = (props) => {

    const rootClass = () => {
        const classes = ['md-list-divider'];
        if (props.inset) classes.push('inset');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return <li role="separator" class={rootClass()} />;
};

export default List;
