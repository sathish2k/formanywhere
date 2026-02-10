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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 CARD - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-card {
    position: relative;
    border-radius: var(--m3-shape-medium, 12px);
    overflow: hidden;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    transition: box-shadow var(--m3-motion-duration-medium, 250ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                transform var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-card.clickable {
    cursor: pointer;
}

/* ─── M3 VARIANTS ──────────────────────────────────────────────────────────── */

.md-card.elevated {
    background: var(--m3-color-surface, #fff);
    box-shadow: var(--m3-elevation-1, 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1));
}

.md-card.elevated.clickable:hover {
    box-shadow: var(--m3-elevation-2, 0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.15));
}

.md-card.filled {
    background: var(--m3-color-surface-container-highest, rgba(230, 225, 229, 0.38));
}

.md-card.filled.clickable:hover {
    box-shadow: var(--m3-elevation-1);
}

.md-card.outlined {
    background: var(--m3-color-surface, #fff);
    border: 1px solid var(--m3-color-outline-variant, rgba(200, 195, 200, 0.5));
}

.md-card.outlined.clickable:hover {
    box-shadow: var(--m3-elevation-1);
}

/* ─── GLASS VARIANTS ───────────────────────────────────────────────────────── */

.md-card.glass {
    border-radius: var(--m3-shape-large, 16px);
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    box-shadow: var(--glass-shadow, 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04));
}

.md-card.glass.clickable:hover {
    box-shadow: var(--glass-shadow-elevated, 0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06));
    transform: translateY(-2px);
}

.md-card.glass-strong {
    border-radius: var(--m3-shape-extra-large, 24px);
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    backdrop-filter: blur(var(--glass-blur-strong, 40px));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong, 40px));
    border: 1px solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
}

.md-card.glass-subtle {
    border-radius: var(--m3-shape-medium, 12px);
    background: var(--glass-tint-subtle, rgba(255, 255, 255, 0.3));
    backdrop-filter: blur(var(--glass-blur-subtle, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur-subtle, 12px));
    border: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* ─── LAYOUT MODIFIERS ─────────────────────────────────────────────────────── */

.md-card.flex-row { display: flex; flex-direction: row; }
.md-card.flex-col { display: flex; flex-direction: column; }
.md-card.flex-wrap { flex-wrap: wrap; }
.md-card.align-start { align-items: flex-start; }
.md-card.align-center { align-items: center; }
.md-card.align-end { align-items: flex-end; }
.md-card.align-stretch { align-items: stretch; }
.md-card.justify-start { justify-content: flex-start; }
.md-card.justify-center { justify-content: center; }
.md-card.justify-end { justify-content: flex-end; }
.md-card.justify-between { justify-content: space-between; }
.md-card.justify-around { justify-content: space-around; }
.md-card.justify-evenly { justify-content: space-evenly; }
.md-card.pad-none { padding: 0; }
.md-card.pad-xs { padding: 4px; }
.md-card.pad-sm { padding: 8px; }
.md-card.pad-md { padding: 16px; }
.md-card.pad-lg { padding: 24px; }
.md-card.pad-xl { padding: 32px; }
.md-card.gap-none { gap: 0; }
.md-card.gap-xs { gap: 4px; }
.md-card.gap-sm { gap: 8px; }
.md-card.gap-md { gap: 16px; }
.md-card.gap-lg { gap: 24px; }
.md-card.gap-xl { gap: 32px; }

/* ─── ACTIVE STATE ─────────────────────────────────────────────────────────── */

.md-card.clickable:active {
    transform: scale(0.99);
}

/* Focus ring */
.md-card.clickable:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 2px;
}

/* ─── SUBCOMPONENTS ────────────────────────────────────────────────────────── */

.md-card-media {
    width: 100%;
    object-fit: cover;
}

.md-card-content {
    padding: 16px;
}

.md-card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 16px;
}

.md-card-header__text {
    flex: 1;
}

.md-card-header__title {
    font-size: 16px;
    font-weight: 500;
    color: var(--m3-color-on-surface, #1D1B20);
}

.md-card-header__subtitle {
    font-size: 14px;
    color: var(--m3-color-on-surface-variant, #49454E);
}

.md-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 16px;
}

.md-card-actions.align-end { justify-content: flex-end; }
.md-card-actions.align-center { justify-content: center; }
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-card', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Card Component ─────────────────────────────────────────────────────────────

export const Card: ParentComponent<CardProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'clickable', 'onClick', 'class', 'style', 'children',
        'direction', 'padding', 'gap', 'align', 'justify', 'wrap'
    ]);

    injectStyles();

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
    injectStyles();
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
    injectStyles();
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
    injectStyles();
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
    injectStyles();
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
