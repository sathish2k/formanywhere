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
    'mail': {
        path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
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

    // Navigation extras
    'arrow-left': {
        path: 'M19 12H5M12 19l-7-7 7-7',
        viewBox: '0 0 24 24',
    },
    'chevron-right': {
        path: 'M9 18l6-6-6-6',
        viewBox: '0 0 24 24',
    },

    // Editor
    'pencil': {
        path: 'M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z',
        viewBox: '0 0 24 24',
    },
    'grip-vertical': {
        path: 'M9 4h.01M9 8h.01M9 12h.01M9 16h.01M9 20h.01M15 4h.01M15 8h.01M15 12h.01M15 16h.01M15 20h.01',
        viewBox: '0 0 24 24',
    },
    'layers': {
        path: 'M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-7M22 8.5l-10 7-10-7',
        viewBox: '0 0 24 24',
    },
    'type': {
        path: 'M4 7V4h16v3M9 20h6M12 4v16',
        viewBox: '0 0 24 24',
    },
    'at-sign': {
        path: 'M12 16a4 4 0 100-8 4 4 0 000 8zM16 12v1.5A2.5 2.5 0 0021 12a9 9 0 10-5.55 8.32',
        viewBox: '0 0 24 24',
    },
    'hash': {
        path: 'M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18',
        viewBox: '0 0 24 24',
    },
    'align-left': {
        path: 'M17 10H3M21 6H3M21 14H3M17 18H3',
        viewBox: '0 0 24 24',
    },
    'list': {
        path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
        viewBox: '0 0 24 24',
    },
    'toggle-left': {
        path: 'M16 5H8a7 7 0 000 14h8a7 7 0 000-14zM8 12a3 3 0 100-6 3 3 0 000 6z',
        viewBox: '0 0 24 24',
    },
    'radio': {
        path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 16a4 4 0 100-8 4 4 0 000 8z',
        viewBox: '0 0 24 24',
    },
    'upload': {
        path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
        viewBox: '0 0 24 24',
    },
    'pen-tool': {
        path: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 13a2 2 0 100-4 2 2 0 000 4z',
        viewBox: '0 0 24 24',
    },
    'move': {
        path: 'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20',
        viewBox: '0 0 24 24',
    },
    'save': {
        path: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
        viewBox: '0 0 24 24',
    },
    'play': {
        path: 'M5 3l14 9-14 9V3z',
        viewBox: '0 0 24 24',
    },
    'undo': {
        path: 'M3 7v6h6M3 13a9 9 0 0117.94-1.3',
        viewBox: '0 0 24 24',
    },
    'redo': {
        path: 'M21 7v6h-6M21 13a9 9 0 01-17.94-1.3',
        viewBox: '0 0 24 24',
    },
    'image': {
        path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',
        viewBox: '0 0 24 24',
    },

    // Additional icons for form builder
    'phone': {
        path: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0122 16.92z',
        viewBox: '0 0 24 24',
    },
    'link': {
        path: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
        viewBox: '0 0 24 24',
    },
    'columns': {
        path: 'M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18',
        viewBox: '0 0 24 24',
    },
    'grid-3x3': {
        path: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18',
        viewBox: '0 0 24 24',
    },
    'square': {
        path: 'M3 3h18v18H3z',
        viewBox: '0 0 24 24',
    },
    'minus': {
        path: 'M5 12h14',
        viewBox: '0 0 24 24',
    },
    'heading': {
        path: 'M6 12h12M6 4v16M18 4v16',
        viewBox: '0 0 24 24',
    },
    'star': {
        path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        viewBox: '0 0 24 24',
    },
    'clock': {
        path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
        viewBox: '0 0 24 24',
    },
    'mouse-pointer': {
        path: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z',
        viewBox: '0 0 24 24',
    },
    'search': {
        path: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
        viewBox: '0 0 24 24',
    },
    'git-branch': {
        path: 'M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 9a9 9 0 01-9 9',
        viewBox: '0 0 24 24',
    },
    'workflow': {
        path: 'M3 3h6v6H3zM15 3h6v6H15zM9 15h6v6H9zM6 9v3a3 3 0 003 3h6a3 3 0 003-3V9',
        viewBox: '0 0 24 24',
    },
    'box': {
        path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
        viewBox: '0 0 24 24',
    },
    'credit-card': {
        path: 'M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22',
        viewBox: '0 0 24 24',
    },
    'move-vertical': {
        path: 'M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4',
        viewBox: '0 0 24 24',
    },
    'layout': {
        path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM3 9h18M9 21V9',
        viewBox: '0 0 24 24',
    },
    'text-cursor': {
        path: 'M6 4h4a2 2 0 012 2v12a2 2 0 01-2 2H6M18 4h-4a2 2 0 00-2 2v12a2 2 0 002 2h4',
        viewBox: '0 0 24 24',
    },
    'monitor': {
        path: 'M2 3h20a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM8 21h8M12 17v4',
        viewBox: '0 0 24 24',
    },
    'tablet': {
        path: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01',
        viewBox: '0 0 24 24',
    },
    'smartphone': {
        path: 'M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01',
        viewBox: '0 0 24 24',
    },
    'chevron-left': {
        path: 'M15 18l-6-6 6-6',
        viewBox: '0 0 24 24',
    },
    'eye-off': {
        path: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22',
        viewBox: '0 0 24 24',
    },
    'bug': {
        path: 'M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M6 17l-4 1M17.47 9c1.93-.2 3.53-1.9 3.53-4M18 13h4M18 17l4 1',
        viewBox: '0 0 24 24',
    },
    'skip-forward': {
        path: 'M5 4l10 8-10 8V4zM19 5v14',
        viewBox: '0 0 24 24',
    },
    'fast-forward': {
        path: 'M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z',
        viewBox: '0 0 24 24',
    },
    'refresh-cw': {
        path: 'M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
        viewBox: '0 0 24 24',
    },
    'activity': {
        path: 'M22 12h-4l-3 9L9 3l-3 9H2',
        viewBox: '0 0 24 24',
    },
    'bar-chart': {
        path: 'M12 20V10M18 20V4M6 20v-4',
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
