/**
 * Material 3 Chip Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * Provides M3-compliant chip variants:
 * - assist: For smart suggestions
 * - filter: For filtering content
 * - input: For user input
 * - suggestion: For suggested actions
 * - label: Badge-style pill chip with color
 */
import { JSX, splitProps, Component } from 'solid-js';
import { Ripple } from '../ripple';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ChipProps {
    /** Chip variant */
    variant?: 'assist' | 'filter' | 'input' | 'suggestion' | 'label';
    /** Chip label */
    label: string;
    /** Selected state (for filter chips) */
    selected?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Leading icon */
    icon?: JSX.Element;
    /** Whether chip is elevated */
    elevated?: boolean;
    /** Color (for label variant) */
    color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
    /** Remove handler (for input chips) */
    onRemove?: () => void;
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
}

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 CHIP - Based on material-components/material-web
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 16px;
    border-radius: var(--m3-shape-small, 8px);
    font-size: 14px;
    font-weight: 500;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    cursor: pointer;
    border: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
    background: transparent;
    color: var(--m3-color-on-surface, #1D1B20);
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                box-shadow var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-chip.disabled {
    cursor: not-allowed;
    opacity: 0.38;
    pointer-events: none;
}

/* Hover state layer */
.md-chip:hover:not(.disabled) {
    background: var(--m3-color-on-surface-variant, rgba(73, 69, 78, 0.08));
}

.md-chip:focus-visible {
    outline: 2px solid var(--m3-color-primary, #6750A4);
    outline-offset: 1px;
}

/* ─── SELECTED STATE ───────────────────────────────────────────────────────── */

.md-chip.selected {
    border: none;
    background: var(--m3-color-secondary-container, rgba(139, 92, 246, 0.12));
    color: var(--m3-color-on-secondary-container, #1d192b);
}

.md-chip.selected:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-1);
}

/* ─── ELEVATED ─────────────────────────────────────────────────────────────── */

.md-chip.elevated {
    border: none;
    background: var(--m3-color-surface-container-low, rgba(255, 255, 255, 0.55));
    box-shadow: var(--m3-elevation-1);
}

.md-chip.elevated:hover:not(.disabled) {
    box-shadow: var(--m3-elevation-2);
}

/* ─── LABEL VARIANT (pill badge) ───────────────────────────────────────────── */

.md-chip.label {
    height: auto;
    padding: 4px 12px;
    border-radius: var(--m3-shape-full, 9999px);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: default;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    gap: 4px;
}

/* Label color variants */
.md-chip.label,
.md-chip.label[data-color="default"],
.md-chip.label[data-color="primary"] {
    background: var(--m3-color-primary-container, rgba(91, 95, 237, 0.12));
    color: var(--m3-color-on-primary-container, #1a1a4a);
    border: 1px solid color-mix(in srgb, var(--m3-color-primary) 20%, transparent);
}

.md-chip.label[data-color="secondary"] {
    background: var(--m3-color-secondary-container, rgba(142, 51, 255, 0.12));
    color: var(--m3-color-on-secondary-container, #1d192b);
    border: 1px solid color-mix(in srgb, var(--m3-color-secondary) 20%, transparent);
}

.md-chip.label[data-color="info"] {
    background: var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12));
    color: var(--m3-color-on-tertiary-container, #006C9C);
    border: 1px solid color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent);
}

.md-chip.label[data-color="success"] {
    background: var(--m3-color-success-container, rgba(34, 197, 94, 0.12));
    color: var(--m3-color-success, #22C55E);
    border: 1px solid color-mix(in srgb, #22C55E 20%, transparent);
}

.md-chip.label[data-color="warning"] {
    background: var(--m3-color-warning-container, rgba(255, 171, 0, 0.12));
    color: var(--m3-color-warning, #FFAB00);
    border: 1px solid color-mix(in srgb, #FFAB00 20%, transparent);
}

.md-chip.label[data-color="error"] {
    background: var(--m3-color-error-container, rgba(255, 86, 48, 0.12));
    color: var(--m3-color-error, #FF5630);
    border: 1px solid color-mix(in srgb, #FF5630 20%, transparent);
}

/* ─── GLASS CHIP ───────────────────────────────────────────────────────────── */

.md-chip.glass {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    border: 1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    box-shadow: var(--glass-shadow, 0 4px 16px rgba(0,0,0,0.06));
}

/* ─── REMOVE BUTTON (input chips) ──────────────────────────────────────────── */

.md-chip__remove {
    display: flex;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    margin-left: 4px;
    margin-right: -8px;
    border-radius: 50%;
    transition: opacity var(--m3-motion-duration-short, 100ms);
}

.md-chip__remove:hover {
    opacity: 0.7;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-chip', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Chip: Component<ChipProps> = (props) => {
    const [local] = splitProps(props, [
        'variant', 'label', 'selected', 'disabled', 'icon',
        'elevated', 'color', 'onClick', 'onRemove', 'class', 'style'
    ]);

    injectStyles();

    const variant = () => local.variant ?? 'assist';

    const rootClass = () => {
        const classes = ['md-chip'];
        classes.push(variant());
        if (local.selected) classes.push('selected');
        if (local.elevated) classes.push('elevated');
        if (local.disabled) classes.push('disabled');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    const handleClick = (e: MouseEvent) => {
        if (local.disabled) return;
        local.onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (local.disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            local.onClick?.(e as unknown as MouseEvent);
        }
    };

    return (
        <button
            type="button"
            disabled={local.disabled}
            class={rootClass()}
            style={local.style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            data-component="chip"
            data-variant={variant()}
            data-color={local.color}
            data-selected={local.selected}
            role={variant() === 'filter' ? 'checkbox' : 'button'}
            aria-pressed={variant() === 'filter' ? local.selected : undefined}
            aria-checked={variant() === 'filter' ? local.selected : undefined}
            aria-label={local.label}
        >
            <Ripple disabled={local.disabled} />
            {local.selected && variant() === 'filter' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            )}
            {local.icon && !local.selected && <span style={{ display: 'flex' }} aria-hidden="true">{local.icon}</span>}
            <span>{local.label}</span>
            {variant() === 'input' && local.onRemove && (
                <button
                    type="button"
                    class="md-chip__remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        local.onRemove?.();
                    }}
                    aria-label={`Remove ${local.label}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            )}
        </button>
    );
};

export default Chip;
