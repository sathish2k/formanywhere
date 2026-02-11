/**
 * Color Palette Configuration
 * Minimals.cc inspired enterprise-grade palette
 */

export const palette = {
  primary: {
    main: '#5B5FED',
    light: '#7B7FF7',
    dark: '#4B4FDD',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8E33FF',
    light: '#A855F7',
    dark: '#7C22E6',
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    lighter: '#D1FAE5',
    dark: '#16A34A',
  },
  error: {
    main: '#FF5630',
    light: '#FF7452',
    lighter: '#FFE7E0',
    dark: '#E64A19',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFC107',
    lighter: '#FFF7CD',
    dark: '#FF8F00',
  },
  info: {
    main: '#00B8D9',
    light: '#00C5E8',
    lighter: '#CAFDF5',
    dark: '#0097B8',
  },
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212B36',
    secondary: '#637381',
    disabled: '#919EAB',
  },
  grey: {
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
  },
  divider: '#F4F6F8',
} as const;
