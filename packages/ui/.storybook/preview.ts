import type { Preview } from 'storybook-solidjs-vite';
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
} from '@material/material-color-utilities';
import '../src/styles/theme.css';
import '../src/styles/glass.css';
import '../src/styles/typography.css';
import '../src/styles/ripple.css';

type StoryMode = 'light' | 'dark' | 'system';
type StoryTheme = 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'red';

const THEME_SEEDS: Record<StoryTheme, string> = {
  green: '#00a76f',
  purple: '#7635dc',
  blue: '#078dee',
  pink: '#d63c78',
  orange: '#fda92d',
  red: '#ff3030',
};

const materialColors = {
  background: MaterialDynamicColors.background,
  'on-background': MaterialDynamicColors.onBackground,
  surface: MaterialDynamicColors.surface,
  'surface-dim': MaterialDynamicColors.surfaceDim,
  'surface-bright': MaterialDynamicColors.surfaceBright,
  'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
  'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
  'surface-container': MaterialDynamicColors.surfaceContainer,
  'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
  'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
  'surface-variant': MaterialDynamicColors.surfaceVariant,
  'on-surface': MaterialDynamicColors.onSurface,
  'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
  'inverse-surface': MaterialDynamicColors.inverseSurface,
  'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
  outline: MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,
  shadow: MaterialDynamicColors.shadow,
  scrim: MaterialDynamicColors.scrim,
  'surface-tint': MaterialDynamicColors.surfaceTint,
  primary: MaterialDynamicColors.primary,
  'on-primary': MaterialDynamicColors.onPrimary,
  'primary-container': MaterialDynamicColors.primaryContainer,
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'inverse-primary': MaterialDynamicColors.inversePrimary,
  secondary: MaterialDynamicColors.secondary,
  'on-secondary': MaterialDynamicColors.onSecondary,
  'secondary-container': MaterialDynamicColors.secondaryContainer,
  'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
  tertiary: MaterialDynamicColors.tertiary,
  'on-tertiary': MaterialDynamicColors.onTertiary,
  'tertiary-container': MaterialDynamicColors.tertiaryContainer,
  'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
  error: MaterialDynamicColors.error,
  'on-error': MaterialDynamicColors.onError,
  'error-container': MaterialDynamicColors.errorContainer,
  'on-error-container': MaterialDynamicColors.onErrorContainer,
};

const applyGeneratedTheme = (seed: string, dark: boolean) => {
  const root = document.documentElement;
  const scheme = new SchemeContent(Hct.fromInt(argbFromHex(seed)), dark, 0);

  for (const [token, dynamicColor] of Object.entries(materialColors)) {
    const value = hexFromArgb(dynamicColor.getArgb(scheme));
    root.style.setProperty(`--md-sys-color-${token}`, value);
    root.style.setProperty(`--m3-color-${token}`, value);
  }

  const onSurface = root.style.getPropertyValue('--m3-color-on-surface').trim();
  if (onSurface.startsWith('#') && onSurface.length === 7) {
    const r = parseInt(onSurface.slice(1, 3), 16);
    const g = parseInt(onSurface.slice(3, 5), 16);
    const b = parseInt(onSurface.slice(5, 7), 16);
    root.style.setProperty('--m3-color-on-surface-rgb', `${r}, ${g}, ${b}`);
  }
};

const applyStoryTheme = (mode: StoryMode, theme: StoryTheme) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const resolvedMode = mode === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;

  const seed = THEME_SEEDS[theme] ?? THEME_SEEDS.green;

  document.documentElement.setAttribute('data-mode', resolvedMode);
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
  applyGeneratedTheme(seed, resolvedMode === 'dark');
};

const preview: Preview = {
  globalTypes: {
    mode: {
      name: 'Mode',
      description: 'Global color mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: ['light', 'dark', 'system'],
      },
    },
    colorTheme: {
      name: 'Theme',
      description: 'Global color theme',
      defaultValue: 'green',
      toolbar: {
        icon: 'paintbrush',
        items: ['green', 'purple', 'blue', 'pink', 'orange', 'red'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      applyStoryTheme(
        (context.globals.mode as StoryMode) ?? 'light',
        (context.globals.colorTheme as StoryTheme) ?? 'green'
      );

      return Story();
    },
  ],
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#f9fafb' },
        { name: 'paper', value: '#ffffff' },
        { name: 'dark', value: '#141A21' },
      ],
    },
    layout: 'centered',
  },
};

export default preview;