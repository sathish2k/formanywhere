/**
 * Section Renderer
 */

'use client';

import { Box, Typography } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';
import { ElementRenderer } from '../ElementRenderer';

interface SectionRendererProps {
  element: DroppedElement;
}

export function SectionRenderer({ element }: SectionRendererProps) {
  const children = element.children || [];

  return (
    <Box sx={{ mb: 3 }}>
      {element.heading && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {element.heading}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children.map((child) => (
          <ElementRenderer key={child.id} element={child} />
        ))}
      </Box>
    </Box>
  );
}
