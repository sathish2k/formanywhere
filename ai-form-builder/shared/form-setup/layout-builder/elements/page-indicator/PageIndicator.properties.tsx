/**
 * PageIndicator Element Properties Panel
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface PageIndicatorPropertiesProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
}

export function PageIndicatorProperties({ element, onUpdate }: PageIndicatorPropertiesProps) {
  return (
    <EmptyPropertiesContainer>
      <Typography variant="body2" color="text.secondary">
        Page indicator shows current page number
      </Typography>
    </EmptyPropertiesContainer>
  );
}

// Styled Components
const EmptyPropertiesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));
