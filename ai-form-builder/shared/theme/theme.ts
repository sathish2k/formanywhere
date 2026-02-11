/**
 * Material-UI Theme Configuration
 * Minimals.cc inspired enterprise-grade theme
 */

import { createTheme } from '@mui/material/styles';
import { components } from './components';
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';

// Extend MUI theme types
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = Number.parseInt(color.substring(0, 2), 16);
  const g = Number.parseInt(color.substring(2, 4), 16);
  const b = Number.parseInt(color.substring(4, 6), 16);

  // Darken
  const darkenedR = Math.max(0, Math.floor(r * (1 - percent / 100)));
  const darkenedG = Math.max(0, Math.floor(g * (1 - percent / 100)));
  const darkenedB = Math.max(0, Math.floor(b * (1 - percent / 100)));

  // Convert back to hex
  return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = Number.parseInt(color.substring(0, 2), 16);
  const g = Number.parseInt(color.substring(2, 4), 16);
  const b = Number.parseInt(color.substring(4, 6), 16);

  // Lighten
  const lightenedR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  const lightenedG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  const lightenedB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex
  return `#${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`;
}

/**
 * Creates a theme with custom primary and secondary colors
 */
export const createAppTheme = (primaryColor = '#FF3B30', secondaryColor = '#1A1A1A') => {
  return createTheme({
    palette: {
      ...palette,
      primary: {
        main: primaryColor,
        light: lightenColor(primaryColor, 20),
        dark: darkenColor(primaryColor, 25),
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: secondaryColor,
        light: '#2A2A2A',
        dark: '#0A0A0A',
        contrastText: '#FFFFFF',
      },
    },
    typography,
    shadows,
    shape: {
      borderRadius: 12,
    },
    components,
  });
};

// Static theme export for backward compatibility
export const theme = createAppTheme();
