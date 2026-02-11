/**
 * Heading Element Component
 * Renders a page heading/title using element properties
 */

'use client';

import { Typography } from '@mui/material';
import type { LayoutElement } from '../element.types';

interface HeadingProps {
  element: LayoutElement;
  isSmall?: boolean;
}

export function Heading({ element, isSmall }: HeadingProps) {
  // Use element properties or defaults
  const variant = element.typographyVariant || 'h4';
  const align = element.align || 'center';
  const gutterBottom = element.gutterBottom !== false;
  const noWrap = element.noWrap || false;

  // Handle color mapping
  const getColor = (color?: string): any => {
    if (!color || color === 'textPrimary') return 'text.primary';
    if (color === 'textSecondary') return 'text.secondary';
    return `${color}.main`;
  };

  if (isSmall) {
    return (
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {element.label || 'Heading'}
      </Typography>
    );
  }

  return (
    <Typography
      variant={variant}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      sx={{
        fontWeight: 700,
        color: getColor(element.color),
      }}
    >
      {element.label || 'Page Heading'}
    </Typography>
  );
}
