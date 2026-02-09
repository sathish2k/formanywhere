/**
 * Icon Component
 * Renders inline SVG icons with theme-aware colors using currentColor
 * Icons are defined as path data for optimal performance
 */
import { Component, JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

/** Icon path definitions - add new icons here */
const ICON_PATHS: Record<string, { path: string; viewBox?: string; fill?: boolean }> = {
    // Navigation
    'arrow-right': {
        path: 'M5 12h14M12 5l7 7-7 7',
        viewBox: '0 0 24 24',
    },
    'chevron-down': {
        path: 'M6 9l6 6 6-6',
        viewBox: '0 0 24 24',
    },
    'menu-hamburger': {
        path: 'M4 6h16M4 12h16M4 18h16',
        viewBox: '0 0 24 24',
    },


    // Status
    'check': {
        path: 'M5 12l5 5L20 7',
        viewBox: '0 0 24 24',
    },
    'check-circle': {
        path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        viewBox: '0 0 24 24',
    },
    'cross': {
        path: 'M6 18L18 6M6 6l12 12',
        viewBox: '0 0 24 24',
    },

    // Features
    'lightning': {
        path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        viewBox: '0 0 24 24',
    },
    'sparkle': {
        path: 'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z',
        viewBox: '0 0 24 24',
    },
    'heart': {
        path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
        viewBox: '0 0 24 24',
    },
    'rocket': {
        path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z',
        viewBox: '0 0 24 24',
    },
    'ai': {
        path: 'M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1.27c.34-.6.99-1 1.73-1a2 2 0 010 4c-.74 0-1.39-.4-1.73-1H20a7 7 0 01-7 7v1.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V17a7 7 0 01-7-7H2.73c-.34.6-.99 1-1.73 1a2 2 0 010-4c.74 0 1.39.4 1.73 1H4a7 7 0 017-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z',
        viewBox: '0 0 24 24',
    },
    // Theme
    'theme-sun': {
        path: 'M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
        viewBox: '0 0 24 24',
    },
};

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
    /** Icon name from the defined set */
    name: keyof typeof ICON_PATHS | string;
    /** Size in pixels (applies to both width and height) */
    size?: number | string;
    /** Color - defaults to currentColor for theme support */
    color?: string;
}

export const Icon: Component<IconProps> = (props) => {
    const [local, others] = splitProps(props, ['name', 'size', 'color', 'class', 'style']);

    const iconData = () => ICON_PATHS[local.name] || ICON_PATHS['check'];
    const size = () => local.size || 24;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size()}
            height={size()}
            viewBox={iconData().viewBox || '0 0 24 24'}
            fill="none"
            stroke={local.color || 'currentColor'}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={local.class}
            style={local.style}
            aria-hidden="true"
            {...others}
        >
            <path d={iconData().path} />
        </svg>
    );
};

/** Available icon names for type safety */
export const ICON_NAMES = Object.keys(ICON_PATHS) as (keyof typeof ICON_PATHS)[];

export default Icon;
