/**
 * ProgressBar Element Properties Panel
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface ProgressBarPropertiesProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
}

export function ProgressBarProperties({ element, onUpdate }: ProgressBarPropertiesProps) {
  return (
    <EmptyPropertiesContainer>
      <Typography variant="body2" color="text.secondary">
        Progress bar shows current step progress
      </Typography>
    </EmptyPropertiesContainer>
  );
}

// Styled Components
const EmptyPropertiesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));
