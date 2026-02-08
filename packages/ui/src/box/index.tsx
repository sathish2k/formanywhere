/**
 * Box Component for SolidJS
 * A generic container with spacing and styling props
 */
import { JSX, splitProps, ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export interface BoxProps {
    /** Padding preset or custom value */
    padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    /** Padding X (horizontal) */
    paddingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    /** Padding Y (vertical) */
    paddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    /** Margin preset or custom value */
    margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto' | number;
    /** Margin X (horizontal) */
    marginX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto' | number;
    /** Margin Y (vertical) */
    marginY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto' | number;
    /** Border radius */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Background color */
    bg?: 'surface' | 'surface-variant' | 'surface-dim' | 'primary' | 'secondary' | 'tertiary' | 'transparent';
    /** Text color */
    color?: 'on-surface' | 'on-surface-variant' | 'primary' | 'secondary' | 'tertiary' | 'on-primary' | 'on-secondary' | 'on-tertiary';
    /** Display */
    display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';
    /** Max width */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full' | 'none';
    /** Text align */
    textAlign?: 'left' | 'center' | 'right';
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Element to render as */
    as?: 'div' | 'span' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer';
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

// Border radius presets
const ROUNDED: Record<string, string> = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
};

// Background color presets (M3 tokens)
const BG_COLORS: Record<string, string> = {
    surface: 'var(--m3-color-surface, #fff)',
    'surface-variant': 'var(--m3-color-surface-variant, #e0e0e0)',
    'surface-dim': 'var(--m3-color-surface-dim, #f5f5f5)',
    primary: 'var(--m3-color-primary, #6200EE)',
    secondary: 'var(--m3-color-secondary, #8E33FF)',
    tertiary: 'var(--m3-color-tertiary, #00B8D9)',
    transparent: 'transparent',
};

// Max width presets
const MAX_WIDTH: Record<string, string> = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '7xl': '1280px',
    full: '100%',
    none: 'none',
};

// Text color presets (M3 tokens)
const TEXT_COLORS: Record<string, string> = {
    'on-surface': 'var(--m3-color-on-surface, #1a1a1a)',
    'on-surface-variant': 'var(--m3-color-on-surface-variant, #666)',
    primary: 'var(--m3-color-primary, #6200EE)',
    secondary: 'var(--m3-color-secondary, #8E33FF)',
    tertiary: 'var(--m3-color-tertiary, #00B8D9)',
    'on-primary': 'var(--m3-color-on-primary, #fff)',
    'on-secondary': 'var(--m3-color-on-secondary, #fff)',
    'on-tertiary': 'var(--m3-color-on-tertiary, #fff)',
};

const getSpacing = (value: string | number | undefined): string | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : SPACING[value] || value;
};

const boxStyles = (props: BoxProps): JSX.CSSProperties => {
    const styles: JSX.CSSProperties = {};

    // Padding
    if (props.padding !== undefined) {
        styles.padding = getSpacing(props.padding);
    }
    if (props.paddingX !== undefined) {
        const px = getSpacing(props.paddingX);
        styles['padding-left'] = px;
        styles['padding-right'] = px;
    }
    if (props.paddingY !== undefined) {
        const py = getSpacing(props.paddingY);
        styles['padding-top'] = py;
        styles['padding-bottom'] = py;
    }

    // Margin
    if (props.margin !== undefined) {
        styles.margin = getSpacing(props.margin);
    }
    if (props.marginX !== undefined) {
        const mx = getSpacing(props.marginX);
        styles['margin-left'] = mx;
        styles['margin-right'] = mx;
    }
    if (props.marginY !== undefined) {
        const my = getSpacing(props.marginY);
        styles['margin-top'] = my;
        styles['margin-bottom'] = my;
    }

    // Border radius
    if (props.rounded) {
        styles['border-radius'] = ROUNDED[props.rounded] || props.rounded;
    }

    // Background
    if (props.bg) {
        styles['background-color'] = BG_COLORS[props.bg] || props.bg;
    }

    // Text color
    if (props.color) {
        styles.color = TEXT_COLORS[props.color] || props.color;
    }

    // Display
    if (props.display) {
        styles.display = props.display;
    }

    // Max width
    if (props.maxWidth) {
        styles['max-width'] = MAX_WIDTH[props.maxWidth] || props.maxWidth;
    }

    // Text align
    if (props.textAlign) {
        styles['text-align'] = props.textAlign;
    }

    return styles;
};

export const Box: ParentComponent<BoxProps> = (props) => {
    const [local, others] = splitProps(props, [
        'padding', 'paddingX', 'paddingY',
        'margin', 'marginX', 'marginY',
        'rounded', 'bg', 'color', 'display', 'maxWidth', 'textAlign',
        'class', 'style', 'children', 'as'
    ]);

    // Use SolidJS Dynamic component for proper client-side rendering
    return (
        <Dynamic
            component={local.as || 'div'}
            class={local.class || ''}
            style={{
                ...boxStyles(local),
                ...local.style,
            }}
            data-component="box"
        >
            {local.children}
        </Dynamic>
    );
};

export default Box;
