/**
 * Material-UI Theme Configuration
 * Minimals.cc inspired enterprise-grade theme
 */

import { createTheme } from '@mui/material/styles';

// Extend MUI theme types
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

export const createAppTheme = (primaryColor: string = '#E57373', secondaryColor: string = '#1A1A1A') => {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: '#EF9A9A',
        dark: '#D32F2F',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: secondaryColor,
        light: '#2A2A2A',
        dark: '#0A0A0A',
        contrastText: '#FFFFFF',
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
        primary: '#1A1A1A',
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
    },
    typography: {
      fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '4rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 800,
        fontSize: '3rem',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 700,
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 700,
        fontSize: '1.125rem',
        lineHeight: 1.5,
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 1px 2px 0px rgba(145, 158, 171, 0.16)',
      '0px 1px 4px 0px rgba(145, 158, 171, 0.16)',
      '0px 2px 4px -1px rgba(145, 158, 171, 0.16)',
      '0px 3px 8px -1px rgba(145, 158, 171, 0.16)',
      '0px 4px 12px -1px rgba(145, 158, 171, 0.16)',
      '0px 6px 16px -2px rgba(145, 158, 171, 0.16)',
      '0px 8px 20px -2px rgba(145, 158, 171, 0.16)',
      '0px 12px 24px -4px rgba(145, 158, 171, 0.16)',
      '0px 16px 32px -4px rgba(145, 158, 171, 0.16)',
      '0px 20px 40px -4px rgba(145, 158, 171, 0.16)',
      '0px 24px 48px -4px rgba(145, 158, 171, 0.16)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 16px 32px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 20px 40px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 28px 56px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 32px 64px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 36px 72px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 40px 80px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 44px 88px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 48px 96px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 52px 104px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 56px 112px -4px rgba(145, 158, 171, 0.12)',
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 60px 120px -4px rgba(145, 158, 171, 0.12)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.9375rem',
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 8px 16px 0px rgba(229, 115, 115, 0.24)',
            },
          },
          sizeLarge: {
            padding: '11px 22px',
            fontSize: '0.9375rem',
          },
          sizeSmall: {
            padding: '6px 12px',
            fontSize: '0.8125rem',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: '0px 1px 2px 0px rgba(145, 158, 171, 0.16)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            borderRadius: 16,
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: '24px 24px 0',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 24,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': {
              backgroundColor: 'rgba(145, 158, 171, 0.08)',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            marginTop: 8,
          },
          list: {
            padding: '8px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 0',
            padding: '8px 12px',
            '&:hover': {
              backgroundColor: 'rgba(145, 158, 171, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(229, 115, 115, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(229, 115, 115, 0.12)',
              },
            },
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            '& .MuiPaginationItem-root': {
              borderRadius: 8,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(145, 158, 171, 0.08)',
              },
              '&.Mui-selected': {
                backgroundColor: '#E57373',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
              },
            },
          },
        },
      },
    },
  });
};

// Default theme export
export const theme = createAppTheme();
