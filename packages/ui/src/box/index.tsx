/**
 * Box Component for SolidJS
 * A generic container with spacing and styling props
 *
 * CSS class-based styling with M3 design tokens
 * Uses utility CSS classes for common presets with injectStyles pattern
 */
import { JSX, splitProps, ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import './styles.scss';

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

// ─── Component ──────────────────────────────────────────────────────────────────

export const Box: ParentComponent<BoxProps> = (props) => {
    const [local, others] = splitProps(props, [
        'padding', 'paddingX', 'paddingY',
        'margin', 'marginX', 'marginY',
        'rounded', 'bg', 'color', 'display', 'maxWidth', 'textAlign',
        'class', 'style', 'children', 'as'
    ]);

    const rootClass = () => {
        const classes = ['md-box'];

        // Padding
        if (typeof local.padding === 'string') classes.push(`p-${local.padding}`);
        if (typeof local.paddingX === 'string') classes.push(`px-${local.paddingX}`);
        if (typeof local.paddingY === 'string') classes.push(`py-${local.paddingY}`);

        // Margin
        if (typeof local.margin === 'string') classes.push(`m-${local.margin}`);
        if (typeof local.marginX === 'string') classes.push(`mx-${local.marginX}`);
        if (typeof local.marginY === 'string') classes.push(`my-${local.marginY}`);

        // Border radius
        if (local.rounded) classes.push(`rounded-${local.rounded}`);

        // Background
        if (local.bg) classes.push(`bg-${local.bg}`);

        // Text color
        if (local.color) classes.push(`text-${local.color}`);

        // Display
        if (local.display) classes.push(`d-${local.display}`);

        // Max width
        if (local.maxWidth) classes.push(`max-w-${local.maxWidth}`);

        // Text alignment
        if (local.textAlign) classes.push(`text-${local.textAlign}`);

        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    // For numeric values, we still need inline styles
    const customStyles = (): JSX.CSSProperties | undefined => {
        const styles: JSX.CSSProperties = {};
        let hasCustom = false;

        if (typeof local.padding === 'number') { styles.padding = `${local.padding}px`; hasCustom = true; }
        if (typeof local.paddingX === 'number') { styles['padding-left'] = `${local.paddingX}px`; styles['padding-right'] = `${local.paddingX}px`; hasCustom = true; }
        if (typeof local.paddingY === 'number') { styles['padding-top'] = `${local.paddingY}px`; styles['padding-bottom'] = `${local.paddingY}px`; hasCustom = true; }
        if (typeof local.margin === 'number') { styles.margin = `${local.margin}px`; hasCustom = true; }
        if (typeof local.marginX === 'number') { styles['margin-left'] = `${local.marginX}px`; styles['margin-right'] = `${local.marginX}px`; hasCustom = true; }
        if (typeof local.marginY === 'number') { styles['margin-top'] = `${local.marginY}px`; styles['margin-bottom'] = `${local.marginY}px`; hasCustom = true; }

        if (hasCustom || local.style) {
            return { ...styles, ...local.style };
        }
        return local.style;
    };

    return (
        <Dynamic
            component={local.as || 'div'}
            {...others}
            class={rootClass()}
            style={customStyles()}
            data-component="box"
        >
            {local.children}
        </Dynamic>
    );
};

export default Box;
