/**
 * Tag Component for SolidJS
 * Non-interactive label for section eyebrows and metadata
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, splitProps, Component } from 'solid-js';
import './styles.scss';

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
