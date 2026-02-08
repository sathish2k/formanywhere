/**
 * Material 3 Card Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant card variants:
 * - elevated: Elevated surface with shadow
 * - filled: Filled surface
 * - outlined: Surface with outline border
 * - glass: Standard liquid glass effect (20px blur)
 * - glass-strong: Strong liquid glass effect (40px blur) for modals/dialogs
 * - glass-subtle: Subtle liquid glass effect (12px blur) for backgrounds
 */
import { JSX, splitProps, Component, ParentComponent } from 'solid-js';
import { Ripple } from '../ripple';

export interface CardProps {
    /** Card variant */
    variant?: 'elevated' | 'filled' | 'outlined' | 'glass' | 'glass-strong' | 'glass-subtle';
    /** Whether card is clickable/interactive */
    clickable?: boolean;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;

    // === Layout Props ===
    /** Flex direction */
    direction?: 'row' | 'column';
    /** Padding preset */
    padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Gap between children */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Align items (cross axis) */
    align?: 'start' | 'center' | 'end' | 'stretch';
    /** Justify content (main axis) */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /** Flex wrap */
    wrap?: boolean;
}

// Spacing presets
const SPACING: Record<string, string> = {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
};

// Align items mapping
const ALIGN_MAP: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
};

// Justify content mapping
const JUSTIFY_MAP: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
};

const cardStyles = (
    variant: string,
    clickable: boolean,
    direction?: string,
    padding?: string,
    gap?: string,
    align?: string,
    justify?: string,
    wrap?: boolean
): JSX.CSSProperties => {
    const baseStyles: JSX.CSSProperties = {
        position: 'relative',
        'border-radius': '12px',
        overflow: 'hidden',
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    };

    // Add layout styles if any layout prop is specified
    if (direction || padding || gap || align || justify || wrap) {
        baseStyles.display = 'flex';
        if (direction) baseStyles['flex-direction'] = direction as JSX.CSSProperties['flex-direction'];
        if (padding) baseStyles.padding = SPACING[padding] || padding;
        if (gap) baseStyles.gap = SPACING[gap] || gap;
        if (align) baseStyles['align-items'] = ALIGN_MAP[align] || align;
        if (justify) baseStyles['justify-content'] = JUSTIFY_MAP[justify] || justify;
        if (wrap) baseStyles['flex-wrap'] = 'wrap';
    }

    // Glass effect variants
    if (variant === 'glass') {
        return {
            ...baseStyles,
            'border-radius': '16px',
            background: 'var(--glass-tint-light, rgba(255, 255, 255, 0.7))',
            'backdrop-filter': 'blur(var(--glass-blur, 20px))',
            '-webkit-backdrop-filter': 'blur(var(--glass-blur, 20px))',
            border: '1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4))',
            'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        };
    }

    if (variant === 'glass-strong') {
        return {
            ...baseStyles,
            'border-radius': '24px',
            background: 'var(--glass-tint-light, rgba(255, 255, 255, 0.7))',
            'backdrop-filter': 'blur(var(--glass-blur-strong, 40px))',
            '-webkit-backdrop-filter': 'blur(var(--glass-blur-strong, 40px))',
            border: '1px solid var(--glass-border-light, rgba(255, 255, 255, 0.6))',
            'box-shadow': '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
        };
    }

    if (variant === 'glass-subtle') {
        return {
            ...baseStyles,
            'border-radius': '12px',
            background: 'var(--glass-tint-subtle, rgba(255, 255, 255, 0.3))',
            'backdrop-filter': 'blur(var(--glass-blur-subtle, 12px))',
            '-webkit-backdrop-filter': 'blur(var(--glass-blur-subtle, 12px))',
            border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2))',
            'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.06)',
        };
    }

    // Original M3 variants
    return {
        ...baseStyles,
        background: variant === 'filled'
            ? 'var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38))'
            : 'var(--m3-color-surface, #fff)',
        border: variant === 'outlined'
            ? '1px solid var(--m3-color-outline-variant, rgba(200, 195, 200, 0.5))'
            : 'none',
        'box-shadow': variant === 'elevated'
            ? 'var(--m3-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1))'
            : 'none',
    };
};

export const Card: ParentComponent<CardProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'clickable', 'onClick', 'class', 'style', 'children',
        'direction', 'padding', 'gap', 'align', 'justify', 'wrap'
    ]);

    const variant = local.variant ?? 'elevated';
    const isClickable = local.clickable ?? !!local.onClick;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            local.onClick?.(e as unknown as MouseEvent);
        }
    };

    return (
        <div
            class={local.class || ''}
            style={{
                ...cardStyles(
                    variant,
                    isClickable,
                    local.direction,
                    local.padding,
                    local.gap,
                    local.align,
                    local.justify,
                    local.wrap
                ),
                ...local.style,
            }}
            onClick={isClickable ? local.onClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            data-component="card"
            data-variant={variant}
            tabIndex={isClickable ? 0 : undefined}
            role={isClickable ? 'button' : undefined}
            aria-label={isClickable ? 'Interactive card' : undefined}
        >
            {isClickable && <Ripple />}
            {local.children}
        </div>
    );
};

// Card subcomponents
export const CardMedia: Component<{
    src: string;
    alt?: string;
    height?: string;
    style?: JSX.CSSProperties;
}> = (props) => (
    <img
        src={props.src}
        alt={props.alt || ''}
        style={{
            width: '100%',
            height: props.height || '194px',
            'object-fit': 'cover',
            ...props.style,
        }}
    />
);

export const CardContent: ParentComponent<{ style?: JSX.CSSProperties }> = (props) => (
    <div style={{ padding: '16px', ...props.style }}>
        {props.children}
    </div>
);

export const CardHeader: Component<{
    title: string;
    subtitle?: string;
    avatar?: JSX.Element;
    action?: JSX.Element;
    style?: JSX.CSSProperties;
}> = (props) => (
    <div style={{
        display: 'flex',
        'align-items': 'center',
        padding: '16px',
        gap: '16px',
        ...props.style
    }}>
        {props.avatar && <div>{props.avatar}</div>}
        <div style={{ flex: 1 }}>
            <div style={{
                'font-size': '16px',
                'font-weight': '500',
                color: 'var(--m3-color-on-surface, #1D1B20)'
            }}>
                {props.title}
            </div>
            {props.subtitle && (
                <div style={{
                    'font-size': '14px',
                    color: 'var(--m3-color-on-surface-variant, #49454E)'
                }}>
                    {props.subtitle}
                </div>
            )}
        </div>
        {props.action && <div>{props.action}</div>}
    </div>
);

export const CardActions: ParentComponent<{
    align?: 'start' | 'end' | 'center';
    style?: JSX.CSSProperties;
}> = (props) => (
    <div style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': props.align === 'end' ? 'flex-end' : props.align === 'center' ? 'center' : 'flex-start',
        gap: '8px',
        padding: '8px 16px 16px',
        ...props.style
    }}>
        {props.children}
    </div>
);

export default Card;
