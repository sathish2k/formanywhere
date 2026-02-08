/**
 * Material 3 List Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, ParentComponent, Show } from 'solid-js';
import { Ripple } from '../ripple';

export interface ListProps {
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;
}

export const List: ParentComponent<ListProps> = (props) => {
    return (
        <ul
            role="list"
            style={{
                'list-style': 'none',
                margin: 0,
                padding: '8px 0',
                ...props.style,
            }}
        >
            {props.children}
        </ul>
    );
};

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
}

const listItemStyles = (interactive: boolean, disabled: boolean, selected: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    'align-items': 'center',
    gap: '16px',
    padding: '8px 24px 8px 16px',
    'min-height': '56px',
    background: selected
        ? 'var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12))'
        : 'transparent',
    cursor: interactive && !disabled ? 'pointer' : 'default',
    opacity: disabled ? '0.38' : '1',
    'text-decoration': 'none',
    color: 'inherit',
    transition: 'background 150ms cubic-bezier(0.2, 0, 0, 1)',
    overflow: 'hidden',
});

const contentStyles: JSX.CSSProperties = {
    flex: 1,
    'min-width': 0,
    display: 'flex',
    'flex-direction': 'column',
    gap: '4px',
};

const headlineStyles: JSX.CSSProperties = {
    'font-size': '16px',
    'font-weight': '400',
    color: 'var(--m3-color-on-surface, #1D1B20)',
    'line-height': '1.5',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
};

const supportingStyles: JSX.CSSProperties = {
    'font-size': '14px',
    color: 'var(--m3-color-on-surface-variant, #49454E)',
    'line-height': '1.4',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
};

export const ListItem: Component<ListItemProps> = (props) => {
    const isInteractive = props.interactive ?? (!!props.onClick || !!props.href);

    const content = () => (
        <>
            {isInteractive && !props.disabled && <Ripple />}
            <Show when={props.start}>
                <span style={{ display: 'flex', 'align-items': 'center', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.start}
                </span>
            </Show>
            <div style={contentStyles}>
                <span style={headlineStyles}>{props.headline}</span>
                <Show when={props.supportingText}>
                    <span style={supportingStyles}>{props.supportingText}</span>
                </Show>
            </div>
            <Show when={props.trailingSupportingText}>
                <span style={{ 'font-size': '14px', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.trailingSupportingText}
                </span>
            </Show>
            <Show when={props.end}>
                <span style={{ display: 'flex', 'align-items': 'center', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.end}
                </span>
            </Show>
        </>
    );

    if (props.href) {
        return (
            <li>
                <a
                    href={props.href}
                    style={{ ...listItemStyles(isInteractive, !!props.disabled, !!props.selected), ...props.style }}
                >
                    {content()}
                </a>
            </li>
        );
    }

    return (
        <li
            style={{ ...listItemStyles(isInteractive, !!props.disabled, !!props.selected), ...props.style }}
            onClick={props.disabled ? undefined : props.onClick}
        >
            {content()}
        </li>
    );
};

// List Divider
export const ListDivider: Component<{ inset?: boolean }> = (props) => (
    <li
        role="separator"
        style={{
            height: '1px',
            background: 'var(--m3-color-outline-variant)',
            margin: props.inset ? '0 0 0 56px' : '0 16px',
        }}
    />
);

export default List;
