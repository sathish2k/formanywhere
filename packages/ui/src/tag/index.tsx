/**
 * Tag Component for SolidJS
 * Non-interactive label for section eyebrows and metadata
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, splitProps, Component } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 TAG
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: var(--m3-shape-full, 9999px);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    user-select: none;
    white-space: nowrap;
}

/* ─── SIZE MODIFIERS ──────────────────────────────────────────────────────── */

.md-tag.sm { padding: 4px 10px; font-size: 11px; }
.md-tag.md { padding: 6px 12px; font-size: 12px; }

/* ─── TONE MODIFIERS ──────────────────────────────────────────────────────── */

.md-tag.neutral {
    background: var(--m3-color-surface-container-high, rgba(230, 225, 229, 0.38));
    color: var(--m3-color-on-surface, #1f1f1f);
    border: 1px solid var(--m3-color-outline-variant, rgba(200, 195, 200, 0.5));
}

.md-tag.primary {
    background: var(--m3-color-primary-container, rgba(91, 95, 237, 0.12));
    color: var(--m3-color-on-primary-container, #1a1a4a);
    border: 1px solid color-mix(in srgb, var(--m3-color-primary) 20%, transparent);
}

.md-tag.secondary {
    background: var(--m3-color-secondary-container, rgba(142, 51, 255, 0.12));
    color: var(--m3-color-on-secondary-container, #1d192b);
    border: 1px solid color-mix(in srgb, var(--m3-color-secondary) 20%, transparent);
}

.md-tag.tertiary {
    background: var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12));
    color: var(--m3-color-on-tertiary-container, #006C9C);
    border: 1px solid color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent);
}

.md-tag.success {
    background: var(--m3-color-success-container, rgba(34, 197, 94, 0.12));
    color: var(--m3-color-success, #22C55E);
    border: 1px solid color-mix(in srgb, var(--m3-color-success) 20%, transparent);
}

.md-tag.warning {
    background: var(--m3-color-warning-container, rgba(255, 171, 0, 0.12));
    color: var(--m3-color-warning, #FFAB00);
    border: 1px solid color-mix(in srgb, var(--m3-color-warning) 20%, transparent);
}

.md-tag.error {
    background: var(--m3-color-error-container, rgba(255, 86, 48, 0.12));
    color: var(--m3-color-error, #FF5630);
    border: 1px solid color-mix(in srgb, var(--m3-color-error) 20%, transparent);
}

/* ─── ICON SLOT ───────────────────────────────────────────────────────────── */

.md-tag__icon {
    display: inline-flex;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-tag', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TagProps {
    /** Tag label */
    label: string;
    /** Leading icon (optional). Use children in Astro for icon slot. */
    icon?: JSX.Element;
    /** Optional icon slot (e.g., in Astro markup) */
    children?: JSX.Element;
    /** Color tone */
    tone?: 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
    /** Size */
    size?: 'sm' | 'md';
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Tag: Component<TagProps> = (props) => {
    const [local, others] = splitProps(props, ['label', 'icon', 'children', 'tone', 'size', 'class', 'style']);

    injectStyles();

    const iconContent = () => local.icon ?? local.children;

    const rootClass = () => {
        const classes = ['md-tag'];
        classes.push(local.size ?? 'md');
        classes.push(local.tone ?? 'secondary');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <span
            class={rootClass()}
            style={local.style}
            data-component="tag"
            {...others}
        >
            {iconContent() && <span class="md-tag__icon" aria-hidden="true">{iconContent()}</span>}
            {local.label}
        </span>
    );
};

export default Tag;
