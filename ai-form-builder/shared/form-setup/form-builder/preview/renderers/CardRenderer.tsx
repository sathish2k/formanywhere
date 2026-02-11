/**
 * Card Renderer
 */

'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';
import { ElementRenderer } from '../ElementRenderer';

interface CardRendererProps {
  element: DroppedElement;
}

export function CardRenderer({ element }: CardRendererProps) {
  const children = element.children || [];

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
