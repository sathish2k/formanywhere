/**
 * Material 3 Menu Component for SolidJS
 * Based on https://github.com/material-components/material-web
 * Uses Floating UI for robust positioning
 */
import { JSX, Component, Show, createEffect, onCleanup, ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { computePosition, flip, shift, offset, autoUpdate, Placement } from '@floating-ui/dom';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MenuProps {
    open: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement;
    position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    style?: JSX.CSSProperties;
    class?: string;
    children: JSX.Element;
}

export interface MenuItemProps {
    label: string;
    leadingIcon?: JSX.Element;
    trailingIcon?: JSX.Element;
    trailingText?: string;
    disabled?: boolean;
    onClick?: (e: MouseEvent) => void;
    style?: JSX.CSSProperties;
    class?: string;
}

// ─── Convert position to Floating UI placement ─────────────────────────────────

const getPlacement = (position?: string): Placement => {
    switch (position) {
        case 'bottom-start': return 'bottom-start';
        case 'bottom-end': return 'bottom-end';
        case 'top-start': return 'top-start';
        case 'top-end': return 'top-end';
        default: return 'bottom-end';
    }
};

// ─── Components ─────────────────────────────────────────────────────────────────

export const Menu: ParentComponent<MenuProps> = (props) => {
    let menuRef: HTMLDivElement | undefined;

    createEffect(() => {
        if (!props.open || !props.anchorEl || !menuRef) return;

        const cleanup = autoUpdate(
            props.anchorEl,
            menuRef,
            () => {
                computePosition(props.anchorEl!, menuRef!, {
                    strategy: 'fixed',
                    placement: getPlacement(props.position),
                    middleware: [
                        offset(4),
                        flip(),
                        shift({ padding: 8 }),
                    ],
                }).then(({ x, y }) => {
                    if (menuRef) {
                        Object.assign(menuRef.style, {
                            left: `${x}px`,
                            top: `${y}px`,
                        });
                    }
                });
            }
        );

        const handleClick = (e: MouseEvent) => {
            if (!menuRef?.contains(e.target as Node) && !props.anchorEl?.contains(e.target as Node)) {
                props.onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.onClose();
            }
        };

        const clickTimeoutId = setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 100);

        document.addEventListener('keydown', handleEscape);

        onCleanup(() => {
            clearTimeout(clickTimeoutId);
            cleanup();
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleEscape);
        });
    });

    const rootClass = () => {
        const classes = ['md-menu'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <Show when={props.open}>
            <Portal>
                <div ref={menuRef} role="menu" class={rootClass()} style={props.style} data-component="menu">
                    {props.children}
                </div>
            </Portal>
        </Show>
    );
};

export const MenuItem: Component<MenuItemProps> = (props) => {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={props.disabled}
            onClick={props.disabled ? undefined : props.onClick}
            class={`md-menu-item ${props.class || ''}`}
            style={props.style}
            data-component="menu-item"
        >
            <Ripple disabled={props.disabled} />
            <Show when={props.leadingIcon}>
                <span class="md-menu-item__icon">{props.leadingIcon}</span>
            </Show>
            <span class="md-menu-item__label">{props.label}</span>
            <Show when={props.trailingText}>
                <span class="md-menu-item__trailing">{props.trailingText}</span>
            </Show>
            <Show when={props.trailingIcon}>
                <span class="md-menu-item__icon">{props.trailingIcon}</span>
            </Show>
        </button>
    );
};

export const MenuDivider: Component = () => {
    return <div role="separator" class="md-menu-divider" />;
};

export default Menu;
