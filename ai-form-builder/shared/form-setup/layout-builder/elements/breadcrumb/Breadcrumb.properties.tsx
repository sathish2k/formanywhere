/**
 * Breadcrumb Element Properties Panel
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface BreadcrumbPropertiesProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
}

export function BreadcrumbProperties({ element, onUpdate }: BreadcrumbPropertiesProps) {
  return (
    <EmptyPropertiesContainer>
      <Typography variant="body2" color="text.secondary">
        Breadcrumb shows page navigation trail
      </Typography>
    </EmptyPropertiesContainer>
  );
}

// Styled Components
const EmptyPropertiesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));
