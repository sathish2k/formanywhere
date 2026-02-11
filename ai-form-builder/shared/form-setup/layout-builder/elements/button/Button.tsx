/**
 * Button Elements Component
 * Next and Back buttons using element properties
 */

'use client';

import { Box, Button as MuiButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LayoutElement } from '../element.types';

interface ButtonProps {
  element: LayoutElement;
  isSmall?: boolean;
}

// Next Button
export function NextButton({ element, isSmall }: ButtonProps) {
  const variant = (element.variant as 'contained' | 'outlined' | 'text') || 'contained';
  const size = element.size || 'medium';
  const color =
    (element.color === 'textPrimary' || element.color === 'textSecondary'
      ? 'primary'
      : element.color) || 'primary';
  const disabled = element.disabled || false;
  const fullWidth = element.fullWidth || false;
  const showLabel = element.showLabel !== false;
  const position = element.position || 'center';

  const button = (
    <MuiButton
      variant={variant}
      size={isSmall ? 'small' : size}
      color={color as any}
      disabled={disabled}
      fullWidth={fullWidth}
      endIcon={<ChevronRight size={isSmall ? 14 : 18} />}
      sx={{ minWidth: fullWidth ? undefined : 120 }}
    >
      {showLabel ? element.label || 'Next' : <ChevronRight size={isSmall ? 14 : 18} />}
    </MuiButton>
  );

  if (isSmall) {
    return button;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent:
          position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
        width: '100%',
      }}
    >
      {button}
    </Box>
  );
}

// Back Button
export function BackButton({ element, isSmall }: ButtonProps) {
  const variant = (element.variant as 'contained' | 'outlined' | 'text') || 'outlined';
  const size = element.size || 'medium';
  const color =
    (element.color === 'textPrimary' || element.color === 'textSecondary'
      ? 'primary'
      : element.color) || 'primary';
  const disabled = element.disabled || false;
  const fullWidth = element.fullWidth || false;
  const showLabel = element.showLabel !== false;
  const position = element.position || 'center';

  const button = (
    <MuiButton
      variant={variant}
      size={isSmall ? 'small' : size}
      color={color as any}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={<ChevronLeft size={isSmall ? 14 : 18} />}
      sx={{ minWidth: fullWidth ? undefined : 120 }}
    >
      {showLabel ? element.label || 'Back' : <ChevronLeft size={isSmall ? 14 : 18} />}
    </MuiButton>
  );

  if (isSmall) {
    return button;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent:
          position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
        width: '100%',
      }}
    >
      {button}
    </Box>
  );
}

// Next Arrow (icon only)
export function NextArrow({ element, isSmall }: ButtonProps) {
  return <NextButton element={{ ...element, showLabel: false }} isSmall={isSmall} />;
}

// Back Arrow (icon only)
export function BackArrow({ element, isSmall }: ButtonProps) {
  return <BackButton element={{ ...element, showLabel: false }} isSmall={isSmall} />;
}
