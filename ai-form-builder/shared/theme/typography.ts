/**
 * Typography Configuration
 * Public Sans font family with responsive heading scales
 */

export const typography = {
  fontFamily:
    '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
} as const;
