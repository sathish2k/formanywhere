/**
 * Arrow Element Properties Panel
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface ArrowPropertiesProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
}

export function ArrowProperties({ element, onUpdate }: ArrowPropertiesProps) {
  return (
    <EmptyPropertiesContainer>
      <Typography variant="body2" color="text.secondary">
        No additional properties for arrow buttons
      </Typography>
    </EmptyPropertiesContainer>
  );
}

// Styled Components
const EmptyPropertiesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));
