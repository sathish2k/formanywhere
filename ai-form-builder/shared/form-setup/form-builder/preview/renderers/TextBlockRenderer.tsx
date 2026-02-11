/**
 * Text Block Renderer
 */

'use client';

import { Typography } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';

interface TextBlockRendererProps {
  element: DroppedElement;
}

export function TextBlockRenderer({ element }: TextBlockRendererProps) {
  return (
    <Typography variant="body1" align={element.align || 'left'}>
      {element.content || element.heading}
    </Typography>
  );
}
