/**
 * Material 3 Icon Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant icon button variants:
 * - standard: Default icon button
 * - filled: Filled background
 * - filled-tonal: Tonal filled background
 * - outlined: Outlined border
 */
import { JSX, splitProps, Component, createSignal } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface IconButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'glass';
    icon: JSX.Element;
    selectedIcon?: JSX.Element;
    size?: 'sm' | 'md' | 'lg';
    selected?: boolean;
    defaultSelected?: boolean;
    toggle?: boolean;
    onSelectedChange?: (selected: boolean) => void;
    style?: JSX.CSSProperties;
    href?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const IconButton: Component<IconButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'icon', 'selectedIcon', 'size', 'selected', 'defaultSelected', 'toggle', 'onSelectedChange', 'disabled', 'style', 'href', 'class', 'onClick'
    ]);

    const [internalSelected, setInternalSelected] = createSignal(local.defaultSelected ?? false);
    const isSelected = () => local.selected ?? internalSelected();

    const rootClass = () => {
        const classes = ['md-icon-button'];
        classes.push(local.variant || 'standard');
        classes.push(`size-${local.size || 'md'}`);
        if (isSelected()) classes.push('selected');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const handleToggle = () => {
        if (!local.toggle || local.disabled) return;
        const next = !isSelected();
        if (local.selected === undefined) {
            setInternalSelected(next);
        }
        local.onSelectedChange?.(next);
    };

    const handleClick: JSX.EventHandlerUnion<HTMLButtonElement | HTMLAnchorElement, MouseEvent> = (e) => {
        handleToggle();
        (local.onClick as ((event: MouseEvent) => void) | undefined)?.(e);
    };

    const iconEl = () => (
        <>
            <Ripple disabled={local.disabled} />
            <span class="md-icon-button__icon">{local.toggle && local.selectedIcon && isSelected() ? local.selectedIcon : local.icon}</span>
        </>
    );

    if (local.href) {
        return (
            <a
                href={local.href}
                class={rootClass()}
                style={local.style}
                onClick={handleClick}
                aria-pressed={local.toggle ? isSelected() : undefined}
                {...(others as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {iconEl()}
            </a>
        );
    }

    return (
        <button
            type="button"
            {...others}
            disabled={local.disabled}
            class={rootClass()}
            style={local.style}
            onClick={handleClick}
            data-component="icon-button"
            aria-pressed={local.toggle ? isSelected() : undefined}
        >
            {iconEl()}
        </button>
    );
};

export default IconButton;
