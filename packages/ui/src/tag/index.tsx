/**
 * Tag Component for SolidJS
 * Non-interactive label for section eyebrows and metadata
 */
import { JSX, splitProps, Component } from 'solid-js';

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

const toneMap: Record<string, { bg: string; text: string; border: string }> = {
    neutral: {
        bg: 'var(--m3-color-surface-container-high, rgba(230, 225, 229, 0.38))',
        text: 'var(--m3-color-on-surface, #1f1f1f)',
        border: '1px solid var(--m3-color-outline-variant, rgba(200, 195, 200, 0.5))',
    },
    primary: {
        bg: 'var(--m3-color-primary-container, rgba(91, 95, 237, 0.12))',
        text: 'var(--m3-color-on-primary-container, #1a1a4a)',
        border: '1px solid color-mix(in srgb, var(--m3-color-primary) 20%, transparent)',
    },
    secondary: {
        bg: 'var(--m3-color-secondary-container, rgba(142, 51, 255, 0.12))',
        text: 'var(--m3-color-on-secondary-container, #1d192b)',
        border: '1px solid color-mix(in srgb, var(--m3-color-secondary) 20%, transparent)',
    },
    tertiary: {
        bg: 'var(--m3-color-tertiary-container, rgba(0, 184, 217, 0.12))',
        text: 'var(--m3-color-on-tertiary-container, #006C9C)',
        border: '1px solid color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent)',
    },
    success: {
        bg: 'var(--m3-color-success-container, rgba(34, 197, 94, 0.12))',
        text: 'var(--m3-color-success, #22C55E)',
        border: '1px solid color-mix(in srgb, var(--m3-color-success) 20%, transparent)',
    },
    warning: {
        bg: 'var(--m3-color-warning-container, rgba(255, 171, 0, 0.12))',
        text: 'var(--m3-color-warning, #FFAB00)',
        border: '1px solid color-mix(in srgb, var(--m3-color-warning) 20%, transparent)',
    },
    error: {
        bg: 'var(--m3-color-error-container, rgba(255, 86, 48, 0.12))',
        text: 'var(--m3-color-error, #FF5630)',
        border: '1px solid color-mix(in srgb, var(--m3-color-error) 20%, transparent)',
    },
};

const sizeMap: Record<string, { padding: string; fontSize: string }> = {
    sm: { padding: '4px 10px', fontSize: '11px' },
    md: { padding: '6px 12px', fontSize: '12px' },
};

const tagStyles = (tone: string, size: string): JSX.CSSProperties => {
    const colors = toneMap[tone] || toneMap.neutral;
    const sizing = sizeMap[size] || sizeMap.md;

    return {
        display: 'inline-flex',
        'align-items': 'center',
        gap: '6px',
        padding: sizing.padding,
        'border-radius': '9999px',
        'font-size': sizing.fontSize,
        'font-weight': '600',
        'letter-spacing': '0.08em',
        'text-transform': 'uppercase',
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        background: colors.bg,
        color: colors.text,
        border: colors.border,
        'user-select': 'none',
        'white-space': 'nowrap',
    };
};

export const Tag: Component<TagProps> = (props) => {
    const [local, others] = splitProps(props, ['label', 'icon', 'children', 'tone', 'size', 'class', 'style']);

    const tone = local.tone ?? 'secondary';
    const size = local.size ?? 'md';
    const iconContent = local.icon ?? local.children;

    return (
        <span
            class={local.class || ''}
            style={{
                ...tagStyles(tone, size),
                ...local.style,
            }}
            data-component="tag"
            {...others}
        >
            {iconContent && <span style={{ display: 'inline-flex' }} aria-hidden="true">{iconContent}</span>}
            {local.label}
        </span>
    );
};

export default Tag;
