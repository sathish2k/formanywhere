/**
 * Material 3 Theme Provider for SolidJS
 * 
 * Provides theme context and syncs with CSS via data-theme attribute.
 * CSS variables are loaded from @formanywhere/ui/styles/theme.css
 */
import { createSignal, createContext, useContext, createEffect, onMount, ParentComponent, Accessor } from 'solid-js';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'red';

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

    const resolvedTheme = (): 'light' | 'dark' => {
        if (theme() === 'system') {
            if (typeof window === 'undefined') return 'light';
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
        document.documentElement.setAttribute('data-mode', resolved);

        // Also toggle .dark class for Tailwind
        if (resolved === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });

    // Sync color scheme with document
    createEffect(() => {
        if (typeof document === 'undefined') return;
        document.documentElement.setAttribute('data-theme', colorScheme());
    });

    // Listen for system preference changes
    onMount(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            // Trigger reactivity update when system preference changes
            if (theme() === 'system') {
                setThemeInternal('system'); // Force re-evaluation
            }
        };
        mediaQuery.addEventListener('change', handleChange);
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
