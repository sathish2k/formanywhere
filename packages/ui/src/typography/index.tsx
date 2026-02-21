/**
 * Material 3 Typography Component for SolidJS
 * Based on https://m3.material.io/styles/typography/overview
 *
 * Provides M3-compliant typography variants:
 * - display: Large, hero headlines
 * - headline: Section headers
 * - title: Card headers, list titles
 * - body: Main content text
 * - label: Buttons, form labels, chips
 */
import { JSX, splitProps, ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type TypographyVariant =
    | 'display-large' | 'display-medium' | 'display-small'
    | 'headline-large' | 'headline-medium' | 'headline-small'
    | 'title-large' | 'title-medium' | 'title-small'
    | 'body-large' | 'body-medium' | 'body-small'
    | 'label-large' | 'label-medium' | 'label-small';

export interface TypographyProps {
    /** Typography variant */
    variant?: TypographyVariant;
    /** HTML element to render as */
    as?: keyof JSX.IntrinsicElements;
    /** Text color */
    color?: 'primary' | 'secondary' | 'tertiary' | 'on-surface' | 'on-surface-variant' | 'error' | 'inherit';
    /** Align text */
    align?: 'left' | 'center' | 'right';
    /** Truncate with ellipsis */
    noWrap?: boolean;
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Children */
    children: JSX.Element;
}

// Typography scale styles based on M3 specifications
const typographyStyles: Record<TypographyVariant, JSX.CSSProperties> = {
    'display-large': {
        'font-size': 'var(--m3-display-large-size, 57px)',
        'line-height': '1.12',
        'font-weight': '400',
        'letter-spacing': '-0.25px',
    },
    'display-medium': {
        'font-size': 'var(--m3-display-medium-size, 45px)',
        'line-height': '1.15',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'display-small': {
        'font-size': 'var(--m3-display-small-size, 36px)',
        'line-height': '1.22',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'headline-large': {
        'font-size': 'var(--m3-headline-large-size, 32px)',
        'line-height': '1.25',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'headline-medium': {
        'font-size': 'var(--m3-headline-medium-size, 28px)',
        'line-height': '1.28',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'headline-small': {
        'font-size': 'var(--m3-headline-small-size, 24px)',
        'line-height': '1.33',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'title-large': {
        'font-size': 'var(--m3-title-large-size, 22px)',
        'line-height': '1.27',
        'font-weight': '400',
        'letter-spacing': '0',
    },
    'title-medium': {
        'font-size': 'var(--m3-title-medium-size, 16px)',
        'line-height': '1.5',
        'font-weight': '500',
        'letter-spacing': '0.15px',
    },
    'title-small': {
        'font-size': '14px',
        'line-height': '1.43',
        'font-weight': '500',
        'letter-spacing': '0.1px',
    },
    'body-large': {
        'font-size': 'var(--m3-body-large-size, 16px)',
        'line-height': '1.5',
        'font-weight': '400',
        'letter-spacing': '0.5px',
    },
    'body-medium': {
        'font-size': 'var(--m3-body-medium-size, 14px)',
        'line-height': '1.43',
        'font-weight': '400',
        'letter-spacing': '0.25px',
    },
    'body-small': {
        'font-size': '12px',
        'line-height': '1.33',
        'font-weight': '400',
        'letter-spacing': '0.4px',
    },
    'label-large': {
        'font-size': 'var(--m3-label-large-size, 14px)',
        'line-height': '1.43',
        'font-weight': '500',
        'letter-spacing': '0.1px',
    },
    'label-medium': {
        'font-size': 'var(--m3-label-medium-size, 12px)',
        'line-height': '1.33',
        'font-weight': '500',
        'letter-spacing': '0.5px',
    },
    'label-small': {
        'font-size': '11px',
        'line-height': '1.45',
        'font-weight': '500',
        'letter-spacing': '0.5px',
    },
};

// Color mappings
const colorStyles: Record<string, string> = {
    'primary': 'var(--m3-color-primary, #6366f1)',
    'secondary': 'var(--m3-color-secondary, #14b8a6)',
    'tertiary': 'var(--m3-color-tertiary, #00B8D9)',
    'on-surface': 'var(--m3-color-on-surface, #1f1f1f)',
    'on-surface-variant': 'var(--m3-color-on-surface-variant, #49454E)',
    'error': 'var(--m3-color-error, #FF5630)',
    'inherit': 'inherit',
};

// Default element for each variant
const defaultElements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    'display-large': 'h1',
    'display-medium': 'h1',
    'display-small': 'h2',
    'headline-large': 'h2',
    'headline-medium': 'h3',
    'headline-small': 'h4',
    'title-large': 'h5',
    'title-medium': 'h6',
    'title-small': 'h6',
    'body-large': 'p',
    'body-medium': 'p',
    'body-small': 'p',
    'label-large': 'span',
    'label-medium': 'span',
    'label-small': 'span',
};

/**
 * Material 3 Typography Component
 * 
 * Usage:
 * ```tsx
 * <Typography variant="display-large">Hero Title</Typography>
 * <Typography variant="headline-medium" color="primary">Section Header</Typography>
 * <Typography variant="body-large">Body text content</Typography>
 * <Typography variant="label-large" as="label">Form Label</Typography>
 * ```
 */
export const Typography: ParentComponent<TypographyProps> = (props) => {
    const [local, others] = splitProps(props, [
        'variant', 'as', 'color', 'align', 'noWrap', 'class', 'style', 'children'
    ]);

    const variant = () => local.variant ?? 'body-medium';
    const element = () => local.as ?? defaultElements[variant()];
    const textColor = () => local.color ?? 'on-surface';

    const computedStyle = (): JSX.CSSProperties => ({
        'font-family': 'var(--m3-font-body, Inter, system-ui, sans-serif)',
        color: colorStyles[textColor()],
        'text-align': local.align,
        'white-space': local.noWrap ? 'nowrap' : undefined,
        overflow: local.noWrap ? 'hidden' : undefined,
        'text-overflow': local.noWrap ? 'ellipsis' : undefined,
        ...typographyStyles[variant()],
        ...local.style,
    });

    // Use Dynamic from solid-js/web for dynamic element rendering
    return (
        <Dynamic
            component={element()}
            class={local.class || ''}
            style={computedStyle()}
            data-component="typography"
            data-variant={variant()}
            {...others}
        >
            {local.children}
        </Dynamic>
    );
};

// Convenience components for common use cases
export const DisplayLarge: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="display-large" />
);

export const DisplayMedium: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="display-medium" />
);

export const HeadlineLarge: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="headline-large" />
);

export const HeadlineMedium: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="headline-medium" />
);

export const TitleLarge: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="title-large" />
);

export const TitleMedium: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="title-medium" />
);

export const BodyLarge: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="body-large" />
);

export const BodyMedium: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="body-medium" />
);

export const LabelLarge: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="label-large" />
);

export const LabelMedium: ParentComponent<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography {...props} variant="label-medium" />
);

export default Typography;
