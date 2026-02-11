/**
 * Stack Component for SolidJS
 * A flex container with layout props for direction, gap, alignment
 *
 * CSS class-based styling with M3 design tokens
 * Uses utility CSS classes for common presets with injectStyles pattern
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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 STACK - Flex layout utility component
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-stack {
    display: flex;
    box-sizing: border-box;
}

/* ─── DIRECTION ────────────────────────────────────────────────────────────── */

.md-stack.dir-row { flex-direction: row; }
.md-stack.dir-column { flex-direction: column; }
.md-stack.dir-row-reverse { flex-direction: row-reverse; }
.md-stack.dir-column-reverse { flex-direction: column-reverse; }

/* ─── GAP ──────────────────────────────────────────────────────────────────── */

.md-stack.gap-none { gap: 0; }
.md-stack.gap-xs { gap: 4px; }
.md-stack.gap-sm { gap: 8px; }
.md-stack.gap-md { gap: 16px; }
.md-stack.gap-lg { gap: 24px; }
.md-stack.gap-xl { gap: 32px; }

/* ─── ALIGN ITEMS ──────────────────────────────────────────────────────────── */

.md-stack.align-start { align-items: flex-start; }
.md-stack.align-center { align-items: center; }
.md-stack.align-end { align-items: flex-end; }
.md-stack.align-stretch { align-items: stretch; }
.md-stack.align-baseline { align-items: baseline; }

/* ─── JUSTIFY CONTENT ──────────────────────────────────────────────────────── */

.md-stack.justify-start { justify-content: flex-start; }
.md-stack.justify-center { justify-content: center; }
.md-stack.justify-end { justify-content: flex-end; }
.md-stack.justify-between { justify-content: space-between; }
.md-stack.justify-around { justify-content: space-around; }
.md-stack.justify-evenly { justify-content: space-evenly; }

/* ─── WRAP ─────────────────────────────────────────────────────────────────── */

.md-stack.flex-wrap { flex-wrap: wrap; }
.md-stack.flex-nowrap { flex-wrap: nowrap; }
.md-stack.flex-wrap-reverse { flex-wrap: wrap-reverse; }

/* ─── MODIFIERS ────────────────────────────────────────────────────────────── */

.md-stack.full-width { width: 100%; }
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-stack', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Stack: ParentComponent<StackProps> = (props) => {
    const [local, others] = splitProps(props, [
        'direction', 'gap', 'align', 'justify', 'wrap',
        'class', 'style', 'children', 'fullWidth', 'as'
    ]);

    injectStyles();

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

// Convenience components
export const HStack: ParentComponent<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="row" />
);

export const VStack: ParentComponent<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="column" />
);

export default Stack;
