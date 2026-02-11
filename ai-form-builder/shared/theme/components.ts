/**
 * MUI Component Style Overrides
 * Custom styling for Material-UI components
 */

import type { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
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
          boxShadow: '0px 8px 16px 0px rgba(91, 95, 237, 0.24)',
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
        boxShadow:
          '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
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
        boxShadow:
          '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
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
          backgroundColor: 'rgba(91, 95, 237, 0.08)',
          '&:hover': {
            backgroundColor: 'rgba(91, 95, 237, 0.12)',
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
            backgroundColor: '#5B5FED',
            color: 'white',
            '&:hover': {
              backgroundColor: '#4B4FDD',
            },
          },
        },
      },
    },
  },
};
