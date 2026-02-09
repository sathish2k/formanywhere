/**
 * Asset Utilities - Optimized SVG/Image rendering for Astro
 * 
 * Best practices for Astro performance:
 * - Use static paths for images to enable Astro's image optimization
 * - Icons loaded from /icons/ are served directly, enabling browser caching
 * - Use type-safe icon names to prevent typos
 */

// Available icon names in public/icons/
export const ICON_NAMES = {
    // Navigation & UI
    arrowRight: 'arrow-right',
    chevronDown: 'chevron-down',
    menuHamburger: 'menu-hamburger',
    menuClose: 'menu-close',
    check: 'check',
    checkmark: 'checkmark',
    checkCircle: 'check-circle',
    cross: 'cross',

    // Features & Actions
    ai: 'ai',
    lightning: 'lightning',
    rocket: 'rocket',
    sparkle: 'sparkle',
    sparkles: 'sparkles',
    wand: 'wand',
    playCircle: 'play-circle',

    // Data & Content
    chart: 'chart',
    code: 'code',
    database: 'database',
    template: 'template',
    workflow: 'workflow',

    // Settings & Security
    settings: 'settings',
    shield: 'shield',
    palette: 'palette',

    // Plans & Pricing
    heart: 'heart',
    building: 'building',

    // Branding & Social
    logoIcon: 'logo-icon',
    github: 'github',
    google: 'google',
    twitter: 'twitter',
    themeSun: 'theme-sun',
} as const;

export type IconName = typeof ICON_NAMES[keyof typeof ICON_NAMES];

/**
 * Get the public path for an icon SVG
 * @param name - Icon name (without extension)
 * @returns Full path to the icon in /icons/
 * 
 * @example
 * getIconPath('arrow-right') // returns '/icons/arrow-right.svg'
 * getIconPath(ICON_NAMES.arrowRight) // returns '/icons/arrow-right.svg'
 */
export function getIconPath(name: IconName | string): string {
    return `/icons/${name}.svg`;
}

/**
 * Get the public path for any asset
 * @param path - Asset path relative to public folder
 * @returns Full public path
 * 
 * @example
 * getAssetPath('images/hero.png') // returns '/images/hero.png'
 */
export function getAssetPath(path: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${cleanPath}`;
}

/**
 * Props for rendering an icon image element
 * Use with img tag: <img {...getIconProps('arrow-right')} />
 */
export interface IconProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
}

/**
 * Get optimized props for an icon img element
 * @param name - Icon name
 * @param alt - Alt text for accessibility (defaults to empty for decorative icons)
 * @param size - Icon size in pixels (width and height)
 * 
 * @example
 * // In SolidJS:
 * <img {...getIconProps('check', '')} style={{ width: '24px', height: '24px' }} />
 */
export function getIconProps(
    name: IconName | string,
    alt: string = '',
    size: number = 24
): IconProps {
    return {
        src: getIconPath(name),
        alt,
        width: size,
        height: size,
        loading: 'lazy' as const,
        decoding: 'async' as const,
    };
}

/**
 * CSS filter to invert icon colors for dark backgrounds
 * Use with inline styles: style={{ filter: ICON_FILTERS.invert }}
 */
export const ICON_FILTERS = {
    /** Invert to white (for dark backgrounds) */
    invert: 'brightness(0) invert(1)',
    /** Invert to ~70% white (for subtle icons on dark backgrounds) */
    invertSubtle: 'brightness(0) invert(0.7)',
    /** No filter (default dark icons) */
    none: 'none',
} as const;
