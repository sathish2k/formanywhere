/**
 * Material 3 Top App Bar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show, createSignal, onMount, onCleanup } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TopAppBarProps {
    /** Title text */
    title?: string;
    /** Navigation icon slot (e.g. back, menu) */
    navigationIcon?: JSX.Element;
    /** Action icon(s) slot */
    actions?: JSX.Element;
    /** Layout variant or visual style */
    variant?: 'small' | 'center-aligned' | 'medium' | 'large' | 'glass';
    /** Whether the bar is elevated (e.g. on scroll) */
    elevated?: boolean;
    /** Whether bar is fixed to top of viewport */
    fixed?: boolean;
    /** Auto-elevate on scroll */
    scrollElevate?: boolean;
    /** Scroll threshold for auto-elevate */
    scrollThreshold?: number;
    /** Enable glass styling (can be used alongside variant) */
    glass?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Children (overrides title slot) */
    children?: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const TopAppBar: Component<TopAppBarProps> = (props) => {

    const [scrollElevated, setScrollElevated] = createSignal(false);

    onMount(() => {
        if (props.scrollElevate && typeof window !== 'undefined') {
            const threshold = props.scrollThreshold ?? 0;
            const handler = () => setScrollElevated(window.scrollY > threshold);
            window.addEventListener('scroll', handler, { passive: true });
            onCleanup(() => window.removeEventListener('scroll', handler));
        }
    });

    const rootClass = () => {
        const classes = ['md-top-app-bar'];
        const v = props.variant ?? 'small';
        // Layout variants
        if (v === 'center-aligned' || v === 'medium' || v === 'large') classes.push(v);
        // Glass can be set via variant='glass' or glass prop
        if (v === 'glass' || props.glass) classes.push('glass');
        if (props.elevated || scrollElevated()) classes.push('elevated');
        if (props.fixed) classes.push('fixed');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <header class={rootClass()} style={props.style}>
            <Show when={props.navigationIcon}>
                <div class="md-top-app-bar__navigation">
                    {props.navigationIcon}
                </div>
            </Show>
            <div class="md-top-app-bar__title">
                {props.children ?? props.title}
            </div>
            <Show when={props.actions}>
                <div class="md-top-app-bar__actions">
                    {props.actions}
                </div>
            </Show>
        </header>
    );
};

export default TopAppBar;
