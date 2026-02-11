/**
 * PageIndicator Element Component
 * Shows current page number with styled components
 */

'use client';

import { Chip, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface PageIndicatorProps {
  element: LayoutElement;
  totalPages: number;
  isSmall?: boolean;
}

export function PageIndicator({ element, totalPages, isSmall }: PageIndicatorProps) {
  const pages = totalPages || 3;

  return <StyledChip label={`Page 1 of ${pages}`} size="small" isSmall={isSmall} />;
}

// Styled Components
const StyledChip = styled(Chip)<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  fontWeight: 600,
  backgroundColor: alpha('#FF3B30', 0.12),
  color: theme.palette.primary.main,
  height: isSmall ? 24 : 28,
}));
