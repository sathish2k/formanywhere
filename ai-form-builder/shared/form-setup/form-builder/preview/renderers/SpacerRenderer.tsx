/**
 * Spacer Renderer
 */

'use client';

import { Box } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';

interface SpacerRendererProps {
  element: DroppedElement;
}

export function SpacerRenderer({ element }: SpacerRendererProps) {
  const heightMap = {
    small: 16,
    medium: 32,
    large: 48,
  };

  const height = heightMap[element.size || 'medium'];

  return <Box sx={{ height }} />;
}
