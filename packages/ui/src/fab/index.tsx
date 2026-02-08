/**
 * Material 3 FAB (Floating Action Button) Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant FAB variants:
 * - surface: Default surface color
 * - primary: Primary color
 * - secondary: Secondary color
 * - tertiary: Tertiary color
 */
import { JSX, splitProps, Component, Show } from 'solid-js';
import { Ripple } from '../ripple';

export interface FABProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    /** FAB color variant */
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
    /** FAB size */
    size?: 'small' | 'medium' | 'large';
    /** Icon element */
    icon: JSX.Element;
    /** Label text (for extended FAB) */
    label?: string;
    /** Whether FAB is lowered (less elevation) */
    lowered?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Link href */
    href?: string;
}

const fabSizes = {
    small: { size: '40px', iconSize: '24px', padding: '8px', borderRadius: '12px' },
    medium: { size: '56px', iconSize: '24px', padding: '16px', borderRadius: '16px' },
    large: { size: '96px', iconSize: '36px', padding: '30px', borderRadius: '28px' },
};

const fabColors = {
    surface: {
        background: 'var(--m3-color-surface-container-high, rgba(236, 230, 240, 0.95))',
        color: 'var(--m3-color-primary, #6366f1)',
    },
    primary: {
        background: 'var(--m3-color-primary-container, rgba(99, 102, 241, 0.12))',
        color: 'var(--m3-color-on-primary-container, #3730a3)',
    },
    secondary: {
        background: 'var(--m3-color-secondary-container, rgba(20, 184, 166, 0.12))',
        color: 'var(--m3-color-on-secondary-container, #0d9488)',
    },
    tertiary: {
        background: 'var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12))',
        color: 'var(--m3-color-on-tertiary-container, #006C9C)',
    },
};

const fabStyles = (
    variant: keyof typeof fabColors,
    size: keyof typeof fabSizes,
    isExtended: boolean,
    lowered: boolean,
    disabled: boolean
): JSX.CSSProperties => {
    const sizeConfig = fabSizes[size];
    const colorConfig = fabColors[variant];

    return {
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        gap: isExtended ? '12px' : '0',
        height: sizeConfig.size,
        width: isExtended ? 'auto' : sizeConfig.size,
        'min-width': isExtended ? '80px' : sizeConfig.size,
        padding: isExtended ? `0 20px 0 16px` : sizeConfig.padding,
        border: 'none',
        'border-radius': isExtended ? '16px' : sizeConfig.borderRadius,
        background: colorConfig.background,
        color: colorConfig.color,
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        'font-size': '14px',
        'font-weight': '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? '0.38' : '1',
        'box-shadow': lowered
            ? 'var(--m3-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1))'
            : 'var(--m3-elevation-3, 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.1))',
        transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
        'text-decoration': 'none',
    };
};

export const FAB: Component<FABProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'size', 'icon', 'label', 'lowered', 'disabled', 'style', 'href'
    ]);

    const variant = local.variant ?? 'primary';
    const size = local.size ?? 'medium';
    const isExtended = !!local.label;
    const sizeConfig = fabSizes[size];

    const content = () => (
        <>
            <Ripple disabled={local.disabled} />
            <span style={{
                display: 'flex',
                width: sizeConfig.iconSize,
                height: sizeConfig.iconSize,
            }}>
                {local.icon}
            </span>
            <Show when={local.label}>
                <span>{local.label}</span>
            </Show>
        </>
    );

    if (local.href) {
        return (
            <a
                href={local.href}
                style={{
                    ...fabStyles(variant, size, isExtended, !!local.lowered, !!local.disabled),
                    ...local.style,
                }}
                {...(others as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {content()}
            </a>
        );
    }

    return (
        <button
            type="button"
            {...others}
            disabled={local.disabled}
            style={{
                ...fabStyles(variant, size, isExtended, !!local.lowered, !!local.disabled),
                ...local.style,
            }}
        >
            {content()}
        </button>
    );
};

export default FAB;
