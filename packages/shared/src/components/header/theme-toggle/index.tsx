/**
 * ThemeToggle Component
 * Theme selector popup using ThemeProvider context
 * Supports color scheme switching (6 presets) and light/dark/system mode
 */
import { Component, createSignal, Show, For } from 'solid-js';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Menu } from '@formanywhere/ui/menu';
import { useTheme, type ColorScheme } from '@formanywhere/ui/theme';
import ThemeSunIcon from '../../../icons/svg/theme-sun.svg';
import CheckmarkIcon from '../../../icons/svg/checkmark.svg';

// Color scheme display info (seed colors for UI preview)
interface ColorPreset {
    name: string;
    scheme: ColorScheme;
    primary: string;
    secondary: string;
}

const colorPresets: ColorPreset[] = [
    { name: 'Green', scheme: 'green', primary: '#00A76F', secondary: '#212B36' },
    { name: 'Purple', scheme: 'purple', primary: '#7635DC', secondary: '#00A76F' },
    { name: 'Blue', scheme: 'blue', primary: '#078DEE', secondary: '#FF5630' },
    { name: 'Cyan', scheme: 'pink', primary: '#2065D1', secondary: '#FF6B6B' },
    { name: 'Orange', scheme: 'orange', primary: '#FDA92D', secondary: '#5D4037' },
    { name: 'Red', scheme: 'red', primary: '#FF3030', secondary: '#FDA92D' },
];

export const ThemeToggle: Component = () => {
    const { colorScheme, setColorScheme, theme, setTheme, resolvedTheme } = useTheme();
    const [isOpen, setIsOpen] = createSignal(false);
    const [anchorEl, setAnchorEl] = createSignal<HTMLElement | undefined>(undefined);

    const handleSelectColor = (preset: ColorPreset) => {
        setColorScheme(preset.scheme);
    };

    const toggleOpen = (e: MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget as HTMLElement);
        setIsOpen(!isOpen());
    };

    const isDark = () => resolvedTheme() === 'dark';

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
                variant="text"
                icon={<ThemeIcon />}
                onClick={toggleOpen}
                aria-label="Theme settings"
                aria-haspopup="true"
                aria-expanded={isOpen()}
            />

            <Menu
                open={isOpen()}
                onClose={() => setIsOpen(false)}
                anchorEl={anchorEl()}
                position="bottom-end"
                style={{
                    'min-width': '340px',
                    padding: '20px',
                    background: isDark()
                        ? 'rgba(30, 30, 30, 0.92)'
                        : 'rgba(255, 255, 255, 0.92)',
                    'backdrop-filter': 'blur(24px)',
                    '-webkit-backdrop-filter': 'blur(24px)',
                    border: isDark()
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.06)',
                    'border-radius': '20px',
                    'box-shadow': isDark()
                        ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                        : '0 12px 40px rgba(0, 0, 0, 0.12)',
                }}
            >
                {/* Mode Toggle (Light / Dark / System) */}
                <div style={{
                    'margin-bottom': '20px',
                }}>
                    <div style={{
                        'font-size': '11px',
                        'font-weight': '600',
                        'text-transform': 'uppercase',
                        'letter-spacing': '0.08em',
                        color: 'var(--m3-color-on-surface-variant, #49454F)',
                        'margin-bottom': '10px',
                        padding: '0 4px',
                    }}>
                        Appearance
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        background: isDark()
                            ? 'rgba(255, 255, 255, 0.06)'
                            : 'rgba(0, 0, 0, 0.04)',
                        'border-radius': '12px',
                        padding: '4px',
                    }}>
                        <For each={[
                            { value: 'light' as const, label: '☀️ Light' },
                            { value: 'dark' as const, label: '🌙 Dark' },
                            { value: 'system' as const, label: '💻 System' },
                        ]}>
                            {(mode) => (
                                <button
                                    onClick={() => setTheme(mode.value)}
                                    style={{
                                        flex: '1',
                                        padding: '8px 12px',
                                        border: 'none',
                                        'border-radius': '10px',
                                        cursor: 'pointer',
                                        'font-size': '13px',
                                        'font-weight': theme() === mode.value ? '600' : '500',
                                        transition: 'all 0.2s ease',
                                        background: theme() === mode.value
                                            ? 'var(--m3-color-primary, #00A76F)'
                                            : 'transparent',
                                        color: theme() === mode.value
                                            ? 'var(--m3-color-on-primary, #fff)'
                                            : 'var(--m3-color-on-surface-variant, #49454F)',
                                    }}
                                >
                                    {mode.label}
                                </button>
                            )}
                        </For>
                    </div>
                </div>

                {/* Color Scheme Grid */}
                <div style={{
                    'font-size': '11px',
                    'font-weight': '600',
                    'text-transform': 'uppercase',
                    'letter-spacing': '0.08em',
                    color: 'var(--m3-color-on-surface-variant, #49454F)',
                    'margin-bottom': '12px',
                    padding: '0 4px',
                }}>
                    Color Scheme
                </div>
                <div style={{
                    display: 'grid',
                    'grid-template-columns': 'repeat(3, 1fr)',
                    gap: '12px',
                }}>
                    <For each={colorPresets}>
                        {(preset) => {
                            const isActive = () => colorScheme() === preset.scheme;
                            return (
                                <button
                                    onClick={() => handleSelectColor(preset)}
                                    style={{
                                        display: 'flex',
                                        'flex-direction': 'column',
                                        'align-items': 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '8px 4px',
                                        'border-radius': '14px',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        ...(isActive()
                                            ? {
                                                  background: isDark()
                                                      ? 'rgba(255, 255, 255, 0.06)'
                                                      : 'rgba(0, 0, 0, 0.04)',
                                              }
                                            : {}),
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive())
                                            e.currentTarget.style.background = isDark()
                                                ? 'rgba(255, 255, 255, 0.04)'
                                                : 'rgba(0, 0, 0, 0.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive())
                                            e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {/* Color circles */}
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '64px',
                                            height: '44px',
                                        }}
                                    >
                                        {/* Primary circle */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: '0',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '40px',
                                                height: '40px',
                                                'border-radius': '50%',
                                                'z-index': '2',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                background: preset.primary,
                                                border: isActive()
                                                    ? `3px solid ${preset.primary}`
                                                    : isDark()
                                                        ? '3px solid rgba(255,255,255,0.15)'
                                                        : '3px solid rgba(255,255,255,0.9)',
                                                'box-shadow': isActive()
                                                    ? `0 4px 16px ${preset.primary}50, 0 0 0 3px ${preset.primary}20`
                                                    : `0 2px 8px ${preset.primary}30`,
                                            }}
                                        />
                                        {/* Secondary circle */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '40px',
                                                height: '40px',
                                                'border-radius': '50%',
                                                'z-index': '1',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                background: preset.secondary,
                                                border: isDark()
                                                    ? '3px solid rgba(255,255,255,0.15)'
                                                    : '3px solid rgba(255,255,255,0.9)',
                                            }}
                                        />
                                        {/* Active checkmark */}
                                        <Show when={isActive()}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '22px',
                                                height: '22px',
                                                background: 'white',
                                                'border-radius': '50%',
                                                'box-shadow': '0 2px 8px rgba(0,0,0,0.2)',
                                                'z-index': '10',
                                                display: 'flex',
                                                'align-items': 'center',
                                                'justify-content': 'center',
                                            }}>
                                                <CheckmarkIcon
                                                    width={12}
                                                    height={12}
                                                    style={{ color: preset.primary }}
                                                />
                                            </div>
                                        </Show>
                                    </div>
                                    {/* Label */}
                                    <span
                                        style={{
                                            'font-size': '11px',
                                            'font-weight': isActive() ? '700' : '500',
                                            transition: 'all 0.2s ease',
                                            color: isActive()
                                                ? preset.primary
                                                : 'var(--m3-color-on-surface-variant, #49454F)',
                                        }}
                                    >
                                        {preset.name}
                                    </span>
                                </button>
                            );
                        }}
                    </For>
                </div>
            </Menu>
        </>
    );
};

export default ThemeToggle;
