/**
 * Material 3 Menu Component for SolidJS
 * Based on https://github.com/material-components/material-web
 * Uses Floating UI for robust positioning
 */
import { JSX, Component, Show, createEffect, onCleanup, ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { computePosition, flip, shift, offset, autoUpdate, Placement } from '@floating-ui/dom';
import { Ripple } from '../ripple';

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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 MENU - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

@keyframes md-menu-open {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.md-menu {
    position: fixed;
    min-width: 112px;
    max-width: 280px;
    max-height: 256px;
    overflow-y: auto;
    background: var(--m3-color-surface-container, rgba(255, 255, 255, 0.95));
    border-radius: var(--m3-shape-extra-small, 4px);
    box-shadow: var(--m3-elevation-2, 0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.15));
    padding: 8px 0;
    z-index: 1000;
    transform-origin: top left;
    animation: md-menu-open var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

/* Glass menu */
.md-menu.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.75));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    border-radius: var(--m3-shape-medium, 12px);
}

/* ─── MENU ITEM ────────────────────────────────────────────────────────────── */

.md-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 12px 12px 16px;
    min-height: 48px;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1D1B20);
    overflow: hidden;
    transition: background var(--m3-motion-duration-short, 100ms);
}

.md-menu-item:hover:not(:disabled) {
    background: var(--m3-color-on-surface, rgba(28, 27, 31, 0.08));
}

.md-menu-item:focus-visible {
    background: var(--m3-color-on-surface, rgba(28, 27, 31, 0.12));
    outline: none;
}

.md-menu-item:disabled {
    cursor: not-allowed;
    opacity: 0.38;
}

.md-menu-item__icon {
    display: flex;
    color: var(--m3-color-on-surface-variant, #49454E);
}

.md-menu-item__label {
    flex: 1;
}

.md-menu-item__trailing {
    font-size: 12px;
    color: var(--m3-color-on-surface-variant, #49454E);
}

/* ─── DIVIDER ──────────────────────────────────────────────────────────────── */

.md-menu-divider {
    height: 1px;
    background: var(--m3-color-outline-variant, rgba(200, 195, 200, 0.5));
    margin: 8px 0;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-menu', '');
    style.textContent = css;
    document.head.appendChild(style);
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

    injectStyles();

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
    injectStyles();
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
    injectStyles();
    return <div role="separator" class="md-menu-divider" />;
};

export default Menu;
