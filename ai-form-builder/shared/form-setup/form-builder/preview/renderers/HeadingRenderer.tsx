/**
 * Heading Renderer
 */

'use client';

import { Typography } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';

interface HeadingRendererProps {
  element: DroppedElement;
}

export function HeadingRenderer({ element }: HeadingRendererProps) {
  const sizeMap = {
    small: 'h6',
    medium: 'h5',
    large: 'h4',
  };

  const variant = sizeMap[element.size || 'medium'] as 'h4' | 'h5' | 'h6';

  return (
    <Typography variant={variant} align={element.align || 'left'} sx={{ mb: 1 }}>
      {element.heading}
    </Typography>
  );
}
