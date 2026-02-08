/**
 * Stack Component for SolidJS
 * A flex container with layout props for direction, gap, alignment
 */
import { JSX, splitProps, ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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

// Spacing presets
const SPACING: Record<string, string> = {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
};

// Align items mapping
const ALIGN_MAP: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
};

// Justify content mapping
const JUSTIFY_MAP: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
};

const stackStyles = (props: StackProps): JSX.CSSProperties => {
    const styles: JSX.CSSProperties = {
        display: 'flex',
        'flex-direction': props.direction || 'column',
    };

    // Gap
    if (props.gap !== undefined) {
        styles.gap = typeof props.gap === 'number'
            ? `${props.gap}px`
            : SPACING[props.gap] || props.gap;
    }

    // Align items
    if (props.align) {
        styles['align-items'] = ALIGN_MAP[props.align] || props.align;
    }

    // Justify content
    if (props.justify) {
        styles['justify-content'] = JUSTIFY_MAP[props.justify] || props.justify;
    }

    // Flex wrap
    if (props.wrap !== undefined) {
        styles['flex-wrap'] = props.wrap === true ? 'wrap' : props.wrap === false ? 'nowrap' : props.wrap;
    }

    // Full width
    if (props.fullWidth) {
        styles.width = '100%';
    }

    return styles;
};

export const Stack: ParentComponent<StackProps> = (props) => {
    const [local, others] = splitProps(props, [
        'direction', 'gap', 'align', 'justify', 'wrap',
        'class', 'style', 'children', 'fullWidth', 'as'
    ]);

    const Tag = local.as || 'div';

    return (
        <Dynamic
            component={local.as || 'div'}
            class={local.class || ''}
            style={{
                ...stackStyles(local),
                ...local.style,
            }}
            data-component="stack"
        >
            {local.children}
        </Dynamic>
    );
};

// Convenience components
export const HStack: ParentComponent<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="row" />
);

export const VStack: ParentComponent<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="column" />
);

export default Stack;
