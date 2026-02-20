/**
 * Material 3 Theme Provider for SolidJS
 * 
 * Provides theme context and syncs with CSS via data-theme attribute.
 * CSS variables are loaded from @formanywhere/ui/styles/theme.css
 * 
 * Color tokens are pre-computed at build time — no runtime dependency
 * on @material/material-color-utilities (saves ~15 KB gzipped).
 */
import { createSignal, createContext, useContext, createEffect, onMount, ParentComponent, Accessor } from 'solid-js';
import { PRECOMPUTED_TOKENS } from './precomputed-tokens';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'red';

const applyRuntimeMaterialTheme = (scheme: ColorScheme, isDark: boolean) => {
    if (typeof document === 'undefined') return;

    const mode = isDark ? 'dark' : 'light';
    const tokens = PRECOMPUTED_TOKENS[scheme]?.[mode];
    if (!tokens) return;

    const root = document.documentElement;
    for (const [token, value] of Object.entries(tokens)) {
        root.style.setProperty(`--md-sys-color-${token}`, value);
        root.style.setProperty(`--m3-color-${token}`, value);
    }

    const onSurface = tokens['on-surface'];
    if (onSurface?.startsWith('#') && onSurface.length === 7) {
        const r = parseInt(onSurface.slice(1, 3), 16);
        const g = parseInt(onSurface.slice(3, 5), 16);
        const b = parseInt(onSurface.slice(5, 7), 16);
        root.style.setProperty('--m3-color-on-surface-rgb', `${r}, ${g}, ${b}`);
    }
};

interface ThemeContextValue {
    /** Current theme setting */
    theme: Accessor<Theme>;
    /** Set theme (light/dark/system) */
    setTheme: (theme: Theme) => void;
    /** Resolved theme based on system preference */
    resolvedTheme: Accessor<'light' | 'dark'>;
    /** Current color scheme */
    colorScheme: Accessor<ColorScheme>;
    /** Set color scheme */
    setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>();

export interface ThemeProviderProps {
    /** Default theme */
    defaultTheme?: Theme;
    /** Default color scheme */
    defaultColorScheme?: ColorScheme;
    /** Storage key for persistence */
    storageKey?: string;
}

export const ThemeProvider: ParentComponent<ThemeProviderProps> = (props) => {
    const storageKey = props.storageKey ?? 'formanywhere-theme';
    const colorStorageKey = `${storageKey}-color`;

    // Initialize from localStorage or props
    const getInitialTheme = (): Theme => {
        if (typeof window === 'undefined') return props.defaultTheme ?? 'system';
        const stored = localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
        return props.defaultTheme ?? 'system';
    };

    const getInitialColorScheme = (): ColorScheme => {
        if (typeof window === 'undefined') return props.defaultColorScheme ?? 'green';
        const stored = localStorage.getItem(colorStorageKey);
        if (
            stored === 'green' ||
            stored === 'purple' ||
            stored === 'blue' ||
            stored === 'pink' ||
            stored === 'orange' ||
            stored === 'red'
        ) {
            return stored;
        }
        return props.defaultColorScheme ?? 'green';
    };

    const [theme, setThemeInternal] = createSignal<Theme>(getInitialTheme());
    const [colorScheme, setColorSchemeInternal] = createSignal<ColorScheme>(getInitialColorScheme());
    const [systemPrefersDark, setSystemPrefersDark] = createSignal<boolean>(
        typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    );

    const resolvedTheme = (): 'light' | 'dark' => {
        if (theme() === 'system') {
            return systemPrefersDark() ? 'dark' : 'light';
        }
        return theme() as 'light' | 'dark';
    };

    const setTheme = (newTheme: Theme) => {
        setThemeInternal(newTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, newTheme);
        }
    };

    const setColorScheme = (scheme: ColorScheme) => {
        setColorSchemeInternal(scheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem(colorStorageKey, scheme);
        }
    };

    // Sync theme with document data-theme attribute
    createEffect(() => {
        if (typeof document === 'undefined') return;

        const resolved = resolvedTheme();
        const scheme = colorScheme();
        document.documentElement.setAttribute('data-mode', resolved);
        document.documentElement.setAttribute('data-theme', scheme);

        applyRuntimeMaterialTheme(scheme, resolved === 'dark');

        // Also toggle .dark class for Tailwind
        if (resolved === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });

    // Listen for system preference changes
    onMount(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => setSystemPrefersDark(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        setSystemPrefersDark(mediaQuery.matches);
        return () => mediaQuery.removeEventListener('change', handleChange);
    });

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            resolvedTheme,
            colorScheme,
            setColorScheme
        }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access theme context
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
