/**
 * ThemeToggle Component
 * Theme selector popup with color theme options
 */
import { Component, createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Menu } from '@formanywhere/ui/menu';
import ThemeSunIcon from '../../../icons/svg/theme-sun.svg';
import CheckmarkIcon from '../../../icons/svg/checkmark.svg';

// Theme Options
export interface ThemeOption {
    name: string;
    theme: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    tertiary: string;
    tertiaryDark: string;
}

export const defaultThemes: ThemeOption[] = [
    { name: 'Green', theme: 'green', primary: '#00A76F', primaryDark: '#007867', secondary: '#212B36', secondaryDark: '#161C24', tertiary: '#00B8D9', tertiaryDark: '#006C9C' },
    { name: 'Purple', theme: 'purple', primary: '#7635DC', primaryDark: '#4319A5', secondary: '#00A76F', secondaryDark: '#007867', tertiary: '#00B8D9', tertiaryDark: '#006C9C' },
    { name: 'Blue', theme: 'blue', primary: '#078DEE', primaryDark: '#0351AB', secondary: '#FF5630', secondaryDark: '#B71833', tertiary: '#00A76F', tertiaryDark: '#007867' },
    { name: 'Cyan', theme: 'pink', primary: '#2065D1', primaryDark: '#103996', secondary: '#FF6B6B', secondaryDark: '#C92A2A', tertiary: '#00A76F', tertiaryDark: '#007867' },
    { name: 'Orange', theme: 'orange', primary: '#FDA92D', primaryDark: '#B66816', secondary: '#5D4037', secondaryDark: '#3E2723', tertiary: '#8E33FF', tertiaryDark: '#5119B7' },
    { name: 'Red', theme: 'red', primary: '#FF3030', primaryDark: '#B71833', secondary: '#FDA92D', secondaryDark: '#B66816', tertiary: '#00A76F', tertiaryDark: '#007867' },
];

export function applyTheme(option: ThemeOption) {
    // ... existing implementation ...
    const root = document.documentElement;

    // Legacy Tailwind tokens
    root.style.setProperty('--color-primary', option.primary);
    root.style.setProperty('--color-primary-dark', option.primaryDark);
    root.style.setProperty('--color-primary-light', `${option.primary}1A`);
    root.style.setProperty('--color-primary-container', `${option.primary}1F`);
    root.style.setProperty('--color-on-primary-container', option.primaryDark);
    root.style.setProperty('--color-secondary', option.secondary);
    root.style.setProperty('--color-secondary-dark', option.secondaryDark);
    root.style.setProperty('--color-secondary-light', `${option.secondary}1A`);
    root.style.setProperty('--color-secondary-container', `${option.secondary}1F`);
    root.style.setProperty('--color-on-secondary-container', option.secondaryDark);
    root.style.setProperty('--color-tertiary', option.tertiary);
    root.style.setProperty('--color-tertiary-dark', option.tertiaryDark);
    root.style.setProperty('--color-tertiary-light', `${option.tertiary}1A`);
    root.style.setProperty('--color-tertiary-container', `${option.tertiary}1F`);
    root.style.setProperty('--color-on-tertiary-container', option.tertiaryDark);

    // M3 tokens
    root.style.setProperty('--m3-color-primary', option.primary);
    root.style.setProperty('--m3-color-primary-dark', option.primaryDark);
    root.style.setProperty('--m3-color-on-primary', '#ffffff');
    root.style.setProperty('--m3-color-primary-container', `${option.primary}1F`);
    root.style.setProperty('--m3-color-on-primary-container', option.primaryDark);
    root.style.setProperty('--m3-color-secondary', option.secondary);
    root.style.setProperty('--m3-color-secondary-dark', option.secondaryDark);
    root.style.setProperty('--m3-color-on-secondary', '#ffffff');
    root.style.setProperty('--m3-color-secondary-container', `${option.secondary}1F`);
    root.style.setProperty('--m3-color-on-secondary-container', option.secondaryDark);
    root.style.setProperty('--m3-color-tertiary', option.tertiary);
    root.style.setProperty('--m3-color-tertiary-dark', option.tertiaryDark);
    root.style.setProperty('--m3-color-on-tertiary', '#ffffff');
    root.style.setProperty('--m3-color-tertiary-container', `${option.tertiary}1F`);
    root.style.setProperty('--m3-color-on-tertiary-container', option.tertiaryDark);

    root.setAttribute('data-theme', option.theme);
    localStorage.setItem('formanywhere-theme', option.theme);
}

export const ThemeToggle: Component = () => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [currentTheme, setCurrentTheme] = createSignal('green');
    const [anchorEl, setAnchorEl] = createSignal<HTMLElement | undefined>(undefined);

    onMount(() => {
        const saved = localStorage.getItem('formanywhere-theme') || 'green';
        setCurrentTheme(saved);
        const option = defaultThemes.find(t => t.theme === saved);
        if (option) applyTheme(option);
    });

    const handleSelect = (option: ThemeOption) => {
        setCurrentTheme(option.theme);
        applyTheme(option);
        setIsOpen(false);
    };

    const toggleOpen = (e: MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling to document
        setAnchorEl(e.currentTarget as HTMLElement);
        setIsOpen(!isOpen());
    };

    const ThemeIcon = () => (
        <ThemeSunIcon
            width={20}
            height={20}
            aria-hidden="true"
        />
    );

    return (
        <>
            <IconButton
                variant="filled-tonal"
                icon={<ThemeIcon />}
                onClick={toggleOpen}
                aria-label="Toggle light or dark theme"
                aria-haspopup="true"
                aria-expanded={isOpen()}
            />

            <Menu
                open={isOpen()}
                onClose={() => setIsOpen(false)}
                anchorEl={anchorEl()}
                position="bottom-end"
                style={{
                    'min-width': '320px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    'backdrop-filter': 'blur(20px)',
                    '-webkit-backdrop-filter': 'blur(20px)',
                    'border': '1px solid rgba(255, 255, 255, 0.3)',
                    'border-radius': '16px',
                    'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h3 class="font-bold text-on-surface mb-4 text-sm tracking-tight px-2">
                    Choose Your Theme
                </h3>
                <div class="grid gap-4" style={{ 'display': 'grid', 'grid-template-columns': 'repeat(3, 1fr)' }}>
                    <For each={defaultThemes}>
                        {(option) => (
                            <button
                                onClick={() => handleSelect(option)}
                                class="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:-translate-y-1 bg-transparent border-none p-0"
                            >
                                <div
                                    class="relative flex items-center justify-center"
                                    style={{ width: '70px', height: '50px' }}
                                >
                                    <div
                                        class="absolute left-0 w-12 h-12 rounded-full border-[3px] shadow-lg z-[2] transition-all duration-300"
                                        style={{
                                            background: `linear-gradient(135deg, ${option.primary}, ${option.primary}99)`,
                                            'border-color': currentTheme() === option.theme ? option.primary : 'white',
                                            'box-shadow': currentTheme() === option.theme
                                                ? `0 8px 24px ${option.primary}40, 0 0 0 4px ${option.primary}15`
                                                : `0 4px 12px ${option.primary}25`,
                                        }}
                                    />
                                    <div
                                        class="absolute right-0 w-12 h-12 rounded-full bg-[#1A1A1A] border-[3px] shadow-lg z-[1] transition-all duration-300"
                                        style={{
                                            'border-color': currentTheme() === option.theme ? option.primary : 'white',
                                        }}
                                    />
                                    <Show when={currentTheme() === option.theme}>
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md z-10 flex items-center justify-center">
                                            <CheckmarkIcon
                                                width={14}
                                                height={14}
                                                style={{ color: option.primary }}
                                            />
                                        </div>
                                    </Show>
                                </div>
                                <span
                                    class="text-xs transition-colors"
                                    style={{
                                        'font-weight': currentTheme() === option.theme ? '700' : '600',
                                        color: currentTheme() === option.theme ? option.primary : 'var(--m3-color-on-surface-variant, #49454F)',
                                    }}
                                >
                                    {option.name}
                                </span>
                            </button>
                        )}
                    </For>
                </div>
            </Menu>
        </>
    );
};

export default ThemeToggle;
