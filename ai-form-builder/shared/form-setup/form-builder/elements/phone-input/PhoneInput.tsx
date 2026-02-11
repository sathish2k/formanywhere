/**
 * Phone Input Component
 * Renders phone number input field on canvas
 */

'use client';

import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface PhoneInputProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PhoneInput({ element, isSelected, onClick }: PhoneInputProps) {
  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <TextField
        fullWidth
        type="tel"
        label={element.required ? `${element.label} *` : element.label}
        placeholder={element.placeholder || '+1 (555) 000-0000'}
        helperText={element.helperText}
        size="medium"
        disabled
        sx={{ pointerEvents: 'none' }}
      />
    </ElementWrapper>
  );
}

const ElementWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isSelected ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.action.hover,
  },
}));
