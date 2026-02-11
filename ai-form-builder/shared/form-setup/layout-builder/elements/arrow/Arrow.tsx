/**
 * Arrow Elements Component
 * Next and Back arrows (icon-only navigation) with styled components
 */

'use client';

import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LayoutElement } from '../element.types';

interface ArrowProps {
  element: LayoutElement;
  isSmall?: boolean;
}

// Next Arrow
export function NextArrow({ element, isSmall }: ArrowProps) {
  const size = isSmall ? 16 : 20;

  return (
    <NextArrowButton size={isSmall ? 'small' : 'medium'}>
      <ArrowRight size={size} />
    </NextArrowButton>
  );
}

// Back Arrow
export function BackArrow({ element, isSmall }: ArrowProps) {
  const size = isSmall ? 16 : 20;

  return (
    <BackArrowButton size={isSmall ? 'small' : 'medium'}>
      <ArrowLeft size={size} />
    </BackArrowButton>
  );
}

// Styled Components
const NextArrowButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const BackArrowButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));
