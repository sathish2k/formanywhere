/**
 * Material 3 Theme Provider for SolidJS
 *
 * Industry-standard CSS-only approach:
 * - All color tokens live in theme-schemes.css as plain CSS custom properties
 *   under html[data-theme="scheme"][data-mode="light|dark"] selectors.
 * - This provider only manages the HTML attributes and persists the choice.
 * - Zero JS inline style manipulation — no flash, no race condition.
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

    // Initialize from cookies (preferred — matches what the server read) or localStorage fallback
    const readPersisted = (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        const match = document.cookie.match(new RegExp('(?:^|;)\\s*' + key + '=([^;]*)'));
        if (match) return decodeURIComponent(match[1]);
        return localStorage.getItem(key);
    };

    const getInitialTheme = (): Theme => {
        const stored = readPersisted(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
        return props.defaultTheme ?? 'system';
    };

    const getInitialColorScheme = (): ColorScheme => {
        const stored = readPersisted(colorStorageKey);
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

    /**
     * Write a client-accessible cookie so the server can read the preference
     * on the next request and inject the correct theme attrs into the SSR HTML,
     * eliminating the flash of unstyled content.  The cookie is intentionally
     * NOT HttpOnly so the blocking <head> script can also read it.
     */
    const setPersisted = (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, value);
        // 1-year expiry; path=/ so it's sent for every page request
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
    };

    const setTheme = (newTheme: Theme) => {
        setThemeInternal(newTheme);
        setPersisted(storageKey, newTheme);
    };

    const setColorScheme = (scheme: ColorScheme) => {
        setColorSchemeInternal(scheme);
        setPersisted(colorStorageKey, scheme);
    };

    // Sync HTML attributes — CSS in theme-schemes.css does the rest
    createEffect(() => {
        if (typeof document === 'undefined') return;

        const resolved = resolvedTheme();
        const scheme = colorScheme();
        document.documentElement.setAttribute('data-mode', resolved);
        document.documentElement.setAttribute('data-theme', scheme);

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
