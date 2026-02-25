/**
 * Stack Component for SolidJS
 * A flex container with layout props for direction, gap, alignment
 *
 * CSS class-based styling with M3 design tokens
 * Uses utility CSS classes for common presets with injectStyles pattern
 */
import { JSX, splitProps, ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import './styles.scss';

export interface StackProps {
    /** Flex direction */
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /** Gap between children */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    /** Align items (cross axis) */
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    /** Justify content (main axis) */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /** Flex wrap */
    wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
    /** Custom class */
    class?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Full width */
    fullWidth?: boolean;
    /** Element to render as */
    as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer';
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Stack: ParentComponent<StackProps> = (props) => {
    const [local, others] = splitProps(props, [
        'direction', 'gap', 'align', 'justify', 'wrap',
        'class', 'style', 'children', 'fullWidth', 'as'
    ]);

    const rootClass = () => {
        const classes = ['md-stack'];

        // Direction (default: column)
        classes.push(`dir-${local.direction || 'column'}`);

        // Gap
        if (typeof local.gap === 'string') classes.push(`gap-${local.gap}`);

        // Align
        if (local.align) classes.push(`align-${local.align}`);

        // Justify
        if (local.justify) classes.push(`justify-${local.justify}`);

        // Wrap
        if (local.wrap === true) classes.push('flex-wrap');
        else if (local.wrap === false) classes.push('flex-nowrap');
        else if (local.wrap === 'wrap-reverse') classes.push('flex-wrap-reverse');
        else if (typeof local.wrap === 'string') classes.push(`flex-${local.wrap}`);

        // Full width
        if (local.fullWidth) classes.push('full-width');

        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    // Only use inline styles for numeric gap or custom styles
    const customStyles = (): JSX.CSSProperties | undefined => {
        if (typeof local.gap === 'number') {
            return { gap: `${local.gap}px`, ...local.style };
        }
        return local.style;
    };

    return (
        <Dynamic
            component={local.as || 'div'}
            class={rootClass()}
            style={customStyles()}
            data-component="stack"
        >
            {local.children}
        </Dynamic>
    );
};

export default Stack;
