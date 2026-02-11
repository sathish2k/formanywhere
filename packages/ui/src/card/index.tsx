/**
 * Material 3 Card Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant card variants:
 * - elevated: Elevated surface with shadow
 * - filled: Filled surface
 * - outlined: Surface with outline border
 * - glass: Standard liquid glass effect (20px blur)
 * - glass-strong: Strong liquid glass effect (40px blur)
 * - glass-subtle: Subtle liquid glass effect (12px blur)
 */
import { JSX, splitProps, Component, ParentComponent } from 'solid-js';
import { Ripple } from '../ripple';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

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

// ─── Card Component ─────────────────────────────────────────────────────────────

export const Card: ParentComponent<CardProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'clickable', 'onClick', 'class', 'style', 'children',
        'direction', 'padding', 'gap', 'align', 'justify', 'wrap'
    ]);

    const isClickable = () => local.clickable ?? !!local.onClick;

    const rootClass = () => {
        const classes = ['md-card'];
        classes.push(local.variant || 'elevated');
        if (isClickable()) classes.push('clickable');
        if (local.direction) classes.push(local.direction === 'row' ? 'flex-row' : 'flex-col');
        if (local.padding) classes.push(`pad-${local.padding}`);
        if (local.gap) classes.push(`gap-${local.gap}`);
        if (local.align) classes.push(`align-${local.align}`);
        if (local.justify) classes.push(`justify-${local.justify}`);
        if (local.wrap) classes.push('flex-wrap');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isClickable()) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            local.onClick?.(e as unknown as MouseEvent);
        }
    };

    return (
        <div
            class={rootClass()}
            style={local.style}
            onClick={isClickable() ? local.onClick : undefined}
            onKeyDown={isClickable() ? handleKeyDown : undefined}
            data-component="card"
            data-variant={local.variant ?? 'elevated'}
            tabIndex={isClickable() ? 0 : undefined}
            role={isClickable() ? 'button' : undefined}
            aria-label={isClickable() ? 'Interactive card' : undefined}
        >
            {isClickable() && <Ripple />}
            {local.children}
        </div>
    );
};

// ─── Subcomponents ──────────────────────────────────────────────────────────────

export const CardMedia: Component<{
    src: string;
    alt?: string;
    height?: string;
    style?: JSX.CSSProperties;
    class?: string;
}> = (props) => {
    return (
        <img
            src={props.src}
            alt={props.alt || ''}
            class={`md-card-media ${props.class || ''}`}
            style={{ height: props.height || '194px', ...props.style }}
        />
    );
};

export const CardContent: ParentComponent<{ style?: JSX.CSSProperties; class?: string }> = (props) => {
    return (
        <div class={`md-card-content ${props.class || ''}`} style={props.style}>
            {props.children}
        </div>
    );
};

export const CardHeader: Component<{
    title: string;
    subtitle?: string;
    avatar?: JSX.Element;
    action?: JSX.Element;
    style?: JSX.CSSProperties;
    class?: string;
}> = (props) => {
    return (
        <div class={`md-card-header ${props.class || ''}`} style={props.style}>
            {props.avatar && <div>{props.avatar}</div>}
            <div class="md-card-header__text">
                <div class="md-card-header__title">{props.title}</div>
                {props.subtitle && (
                    <div class="md-card-header__subtitle">{props.subtitle}</div>
                )}
            </div>
            {props.action && <div>{props.action}</div>}
        </div>
    );
};

export const CardActions: ParentComponent<{
    align?: 'start' | 'end' | 'center';
    style?: JSX.CSSProperties;
    class?: string;
}> = (props) => {
    return (
        <div
            class={`md-card-actions ${props.align ? `align-${props.align}` : ''} ${props.class || ''}`}
            style={props.style}
        >
            {props.children}
        </div>
    );
};

export default Card;
