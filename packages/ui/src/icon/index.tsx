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
    'arrow-down': {
        path: 'M12 5v14M19 12l-7 7-7-7',
        viewBox: '0 0 24 24',
    },
    'arrow-up': {
        path: 'M12 19V5M5 12l7-7 7 7',
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
    'close': {
        path: 'M18 6L6 18M6 6l12 12',
        viewBox: '0 0 24 24',
    },

    // Actions
    'plus': {
        path: 'M12 5v14M5 12h14',
        viewBox: '0 0 24 24',
    },
    'edit': {
        path: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
        viewBox: '0 0 24 24',
    },
    'trash': {
        path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
        viewBox: '0 0 24 24',
    },
    'copy': {
        path: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
        viewBox: '0 0 24 24',
    },
    'share': {
        path: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
        viewBox: '0 0 24 24',
    },
    'download': {
        path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
        viewBox: '0 0 24 24',
    },
    'more-vert': {
        path: 'M12 13a1 1 0 100-2 1 1 0 000 2zM12 6a1 1 0 100-2 1 1 0 000 2zM12 20a1 1 0 100-2 1 1 0 000 2z',
        viewBox: '0 0 24 24',
    },
    'sort': {
        path: 'M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4',
        viewBox: '0 0 24 24',
    },
    'eye': {
        path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
        viewBox: '0 0 24 24',
    },

    // People & Profile
    'person': {
        path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
        viewBox: '0 0 24 24',
    },
    'bell': {
        path: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
        viewBox: '0 0 24 24',
    },
    'settings': {
        path: 'M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2zM12 15a3 3 0 100-6 3 3 0 000 6z',
        viewBox: '0 0 24 24',
    },
    'logout': {
        path: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
        viewBox: '0 0 24 24',
    },

    // Content
    'file-text': {
        path: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
        viewBox: '0 0 24 24',
    },
    'help-circle': {
        path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01',
        viewBox: '0 0 24 24',
    },
    'info': {
        path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01',
        viewBox: '0 0 24 24',
    },

    // Data & Filters
    'calendar': {
        path: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
        viewBox: '0 0 24 24',
    },
    'message-square': {
        path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
        viewBox: '0 0 24 24',
    },
    'sliders': {
        path: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
        viewBox: '0 0 24 24',
    },
    'checkbox-checked': {
        path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 12l2 2 4-4',
        viewBox: '0 0 24 24',
    },
    'checkbox-empty': {
        path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z',
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
