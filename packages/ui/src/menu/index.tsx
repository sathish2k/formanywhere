/**
 * Material 3 Menu Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show, createEffect, onCleanup, ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Ripple } from '../ripple';

export interface MenuProps {
    /** Open state */
    open: boolean;
    /** Close handler */
    onClose: () => void;
    /** Anchor element ref */
    anchorEl?: HTMLElement;
    /** Menu position */
    position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;
}

const menuStyles = (open: boolean): JSX.CSSProperties => ({
    position: 'absolute',
    'min-width': '112px',
    'max-width': '280px',
    'max-height': '256px',
    'overflow-y': 'auto',
    background: 'var(--m3-color-surface-container, rgba(255, 255, 255, 0.95))',
    'border-radius': '4px',
    'box-shadow': 'var(--m3-elevation-2)',
    padding: '8px 0',
    opacity: open ? '1' : '0',
    transform: open ? 'scale(1)' : 'scale(0.9)',
    'transform-origin': 'top left',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
    'z-index': '1000',
});

export const Menu: ParentComponent<MenuProps> = (props) => {
    let menuRef: HTMLDivElement | undefined;

    createEffect(() => {
        if (!props.open) return;

        const handleClick = (e: MouseEvent) => {
            if (!menuRef?.contains(e.target as Node)) {
                props.onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.onClose();
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleEscape);

        onCleanup(() => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleEscape);
        });
    });

    const getPosition = () => {
        if (!props.anchorEl) return {};
        const rect = props.anchorEl.getBoundingClientRect();
        const pos = props.position ?? 'bottom-start';

        switch (pos) {
            case 'bottom-start':
                return { top: `${rect.bottom + 4}px`, left: `${rect.left}px` };
            case 'bottom-end':
                return { top: `${rect.bottom + 4}px`, right: `${window.innerWidth - rect.right}px` };
            case 'top-start':
                return { bottom: `${window.innerHeight - rect.top + 4}px`, left: `${rect.left}px` };
            case 'top-end':
                return { bottom: `${window.innerHeight - rect.top + 4}px`, right: `${window.innerWidth - rect.right}px` };
        }
    };

    return (
        <Show when={props.open}>
            <Portal>
                <div
                    ref={menuRef}
                    role="menu"
                    style={{ ...menuStyles(props.open), ...getPosition(), position: 'fixed', ...props.style }}
                >
                    {props.children}
                </div>
            </Portal>
        </Show>
    );
};

export interface MenuItemProps {
    /** Item label */
    label: string;
    /** Leading icon */
    leadingIcon?: JSX.Element;
    /** Trailing icon or text */
    trailingIcon?: JSX.Element;
    /** Trailing text (shortcut, etc) */
    trailingText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Custom style */
    style?: JSX.CSSProperties;
}

const menuItemStyles = (disabled: boolean): JSX.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    'align-items': 'center',
    gap: '12px',
    padding: '12px 12px 12px 16px',
    'min-height': '48px',
    background: 'transparent',
    border: 'none',
    width: '100%',
    'text-align': 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.38' : '1',
    'font-size': '14px',
    'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
    color: 'var(--m3-color-on-surface, #1D1B20)',
    overflow: 'hidden',
});

export const MenuItem: Component<MenuItemProps> = (props) => {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={props.disabled}
            onClick={props.disabled ? undefined : props.onClick}
            style={{ ...menuItemStyles(!!props.disabled), ...props.style }}
        >
            <Ripple disabled={props.disabled} />
            <Show when={props.leadingIcon}>
                <span style={{ display: 'flex', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.leadingIcon}
                </span>
            </Show>
            <span style={{ flex: 1 }}>{props.label}</span>
            <Show when={props.trailingText}>
                <span style={{ 'font-size': '12px', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.trailingText}
                </span>
            </Show>
            <Show when={props.trailingIcon}>
                <span style={{ display: 'flex', color: 'var(--m3-color-on-surface-variant)' }}>
                    {props.trailingIcon}
                </span>
            </Show>
        </button>
    );
};

// Menu Divider
export const MenuDivider: Component = () => (
    <div
        role="separator"
        style={{
            height: '1px',
            background: 'var(--m3-color-outline-variant)',
            margin: '8px 0',
        }}
    />
);

export default Menu;
