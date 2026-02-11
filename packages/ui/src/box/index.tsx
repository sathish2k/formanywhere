/**
 * Box Component for SolidJS
 * A generic container with spacing and styling props
 *
 * CSS class-based styling with M3 design tokens
 * Uses utility CSS classes for common presets with injectStyles pattern
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

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 BOX - Layout utility component
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-box { box-sizing: border-box; }

/* ─── PADDING ──────────────────────────────────────────────────────────────── */

.md-box.p-none { padding: 0; }
.md-box.p-xs { padding: 4px; }
.md-box.p-sm { padding: 8px; }
.md-box.p-md { padding: 16px; }
.md-box.p-lg { padding: 24px; }
.md-box.p-xl { padding: 32px; }

.md-box.px-none { padding-left: 0; padding-right: 0; }
.md-box.px-xs { padding-left: 4px; padding-right: 4px; }
.md-box.px-sm { padding-left: 8px; padding-right: 8px; }
.md-box.px-md { padding-left: 16px; padding-right: 16px; }
.md-box.px-lg { padding-left: 24px; padding-right: 24px; }
.md-box.px-xl { padding-left: 32px; padding-right: 32px; }

.md-box.py-none { padding-top: 0; padding-bottom: 0; }
.md-box.py-xs { padding-top: 4px; padding-bottom: 4px; }
.md-box.py-sm { padding-top: 8px; padding-bottom: 8px; }
.md-box.py-md { padding-top: 16px; padding-bottom: 16px; }
.md-box.py-lg { padding-top: 24px; padding-bottom: 24px; }
.md-box.py-xl { padding-top: 32px; padding-bottom: 32px; }

/* ─── MARGIN ───────────────────────────────────────────────────────────────── */

.md-box.m-none { margin: 0; }
.md-box.m-xs { margin: 4px; }
.md-box.m-sm { margin: 8px; }
.md-box.m-md { margin: 16px; }
.md-box.m-lg { margin: 24px; }
.md-box.m-xl { margin: 32px; }
.md-box.m-auto { margin: auto; }

.md-box.mx-none { margin-left: 0; margin-right: 0; }
.md-box.mx-xs { margin-left: 4px; margin-right: 4px; }
.md-box.mx-sm { margin-left: 8px; margin-right: 8px; }
.md-box.mx-md { margin-left: 16px; margin-right: 16px; }
.md-box.mx-lg { margin-left: 24px; margin-right: 24px; }
.md-box.mx-xl { margin-left: 32px; margin-right: 32px; }
.md-box.mx-auto { margin-left: auto; margin-right: auto; }

.md-box.my-none { margin-top: 0; margin-bottom: 0; }
.md-box.my-xs { margin-top: 4px; margin-bottom: 4px; }
.md-box.my-sm { margin-top: 8px; margin-bottom: 8px; }
.md-box.my-md { margin-top: 16px; margin-bottom: 16px; }
.md-box.my-lg { margin-top: 24px; margin-bottom: 24px; }
.md-box.my-xl { margin-top: 32px; margin-bottom: 32px; }

/* ─── BORDER RADIUS ────────────────────────────────────────────────────────── */

.md-box.rounded-none { border-radius: 0; }
.md-box.rounded-sm { border-radius: var(--m3-shape-extra-small, 4px); }
.md-box.rounded-md { border-radius: var(--m3-shape-small, 8px); }
.md-box.rounded-lg { border-radius: var(--m3-shape-medium, 12px); }
.md-box.rounded-xl { border-radius: var(--m3-shape-large, 16px); }
.md-box.rounded-full { border-radius: var(--m3-shape-full, 9999px); }

/* ─── BACKGROUND ───────────────────────────────────────────────────────────── */

.md-box.bg-surface { background-color: var(--m3-color-surface, #fff); }
.md-box.bg-surface-variant { background-color: var(--m3-color-surface-variant, #e0e0e0); }
.md-box.bg-surface-dim { background-color: var(--m3-color-surface-dim, #f5f5f5); }
.md-box.bg-primary { background-color: var(--m3-color-primary, #6200EE); }
.md-box.bg-secondary { background-color: var(--m3-color-secondary, #8E33FF); }
.md-box.bg-tertiary { background-color: var(--m3-color-tertiary, #00B8D9); }
.md-box.bg-transparent { background-color: transparent; }

/* ─── TEXT COLOR ────────────────────────────────────────────────────────────── */

.md-box.text-on-surface { color: var(--m3-color-on-surface, #1a1a1a); }
.md-box.text-on-surface-variant { color: var(--m3-color-on-surface-variant, #666); }
.md-box.text-primary { color: var(--m3-color-primary, #6200EE); }
.md-box.text-secondary { color: var(--m3-color-secondary, #8E33FF); }
.md-box.text-tertiary { color: var(--m3-color-tertiary, #00B8D9); }
.md-box.text-on-primary { color: var(--m3-color-on-primary, #fff); }
.md-box.text-on-secondary { color: var(--m3-color-on-secondary, #fff); }
.md-box.text-on-tertiary { color: var(--m3-color-on-tertiary, #fff); }

/* ─── DISPLAY ──────────────────────────────────────────────────────────────── */

.md-box.d-block { display: block; }
.md-box.d-inline-block { display: inline-block; }
.md-box.d-flex { display: flex; }
.md-box.d-inline-flex { display: inline-flex; }
.md-box.d-grid { display: grid; }
.md-box.d-none { display: none; }

/* ─── MAX WIDTH ────────────────────────────────────────────────────────────── */

.md-box.max-w-xs { max-width: 320px; }
.md-box.max-w-sm { max-width: 640px; }
.md-box.max-w-md { max-width: 768px; }
.md-box.max-w-lg { max-width: 1024px; }
.md-box.max-w-xl { max-width: 1280px; }
.md-box.max-w-2xl { max-width: 1536px; }
.md-box.max-w-7xl { max-width: 1280px; }
.md-box.max-w-full { max-width: 100%; }
.md-box.max-w-none { max-width: none; }

/* ─── TEXT ALIGN ────────────────────────────────────────────────────────────── */

.md-box.text-left { text-align: left; }
.md-box.text-center { text-align: center; }
.md-box.text-right { text-align: right; }
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-box', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const Box: ParentComponent<BoxProps> = (props) => {
    const [local, others] = splitProps(props, [
        'padding', 'paddingX', 'paddingY',
        'margin', 'marginX', 'marginY',
        'rounded', 'bg', 'color', 'display', 'maxWidth', 'textAlign',
        'class', 'style', 'children', 'as'
    ]);

    injectStyles();

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
            class={rootClass()}
            style={customStyles()}
            data-component="box"
        >
            {local.children}
        </Dynamic>
    );
};

export default Box;
