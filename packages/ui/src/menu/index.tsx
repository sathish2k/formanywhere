/**
 * Material 3 Menu Component for SolidJS
 * Based on https://github.com/material-components/material-web
 * Uses Floating UI for robust positioning
 */
import { JSX, Component, Show, createEffect, onCleanup, ParentComponent, createContext, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';
import { computePosition, flip, shift, offset, autoUpdate, Placement } from '@floating-ui/dom';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MenuProps {
    open: boolean;
    onClose: () => void;
    closeOnSelect?: boolean;
    anchorEl?: HTMLElement;
    position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    /** Glass morphism style */
    glass?: boolean;
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
    selected?: boolean;
    type?: 'item' | 'checkbox' | 'radio';
    closeOnSelect?: boolean;
    onClick?: (e: MouseEvent) => void;
    style?: JSX.CSSProperties;
    class?: string;
}

interface MenuContextValue {
    onClose: () => void;
    closeOnSelect: boolean;
}

const MenuContext = createContext<MenuContextValue>();

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

    const closeOnSelect = () => props.closeOnSelect ?? true;

    const focusItems = () => {
        if (!menuRef) return [] as HTMLElement[];
        return Array.from(menuRef.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((el) => !el.hasAttribute('disabled'));
    };

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

        const handleNavigation = (e: KeyboardEvent) => {
            if (!props.open || !menuRef) return;
            const items = focusItems();
            if (!items.length) return;

            const activeIndex = items.findIndex((item) => item === document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = activeIndex < 0 ? 0 : (activeIndex + 1) % items.length;
                items[next]?.focus();
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const next = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
                items[next]?.focus();
            }

            if (e.key === 'Home') {
                e.preventDefault();
                items[0]?.focus();
            }

            if (e.key === 'End') {
                e.preventDefault();
                items[items.length - 1]?.focus();
            }
        };

        const clickTimeoutId = setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 100);

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleNavigation);

        requestAnimationFrame(() => {
            focusItems()[0]?.focus();
        });

        onCleanup(() => {
            clearTimeout(clickTimeoutId);
            cleanup();
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleNavigation);
        });
    });

    const rootClass = () => {
        const classes = ['md-menu'];
        if (props.glass) classes.push('glass');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <Show when={props.open}>
            <Portal>
                <MenuContext.Provider value={{ onClose: props.onClose, closeOnSelect: closeOnSelect() }}>
                    <div ref={menuRef} role="menu" class={rootClass()} style={props.style} data-component="menu">
                        {props.children}
                    </div>
                </MenuContext.Provider>
            </Portal>
        </Show>
    );
};

export const MenuItem: Component<MenuItemProps> = (props) => {
    const menu = useContext(MenuContext);

    const role = () => {
        if (props.type === 'checkbox') return 'menuitemcheckbox';
        if (props.type === 'radio') return 'menuitemradio';
        return 'menuitem';
    };

    const shouldCloseOnSelect = () => props.closeOnSelect ?? menu?.closeOnSelect ?? true;

    const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
        if (props.disabled) return;
        props.onClick?.(e);
        if (shouldCloseOnSelect()) {
            menu?.onClose();
        }
    };

    return (
        <button
            type="button"
            role={role()}
            aria-checked={props.type === 'checkbox' || props.type === 'radio' ? !!props.selected : undefined}
            disabled={props.disabled}
            onClick={handleClick}
            class={`md-menu-item ${props.selected ? 'selected' : ''} ${props.class || ''}`}
            style={props.style}
            data-component="menu-item"
            tabIndex={0}
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
