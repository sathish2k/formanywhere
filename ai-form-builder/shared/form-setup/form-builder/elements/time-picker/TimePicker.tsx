/**
 * Time Picker Component
 */

'use client';

import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface TimePickerProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TimePicker({ element, isSelected, onClick }: TimePickerProps) {
  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <TextField
        fullWidth
        type="time"
        label={element.required ? `${element.label} *` : element.label}
        helperText={element.helperText}
        size="medium"
        disabled
        sx={{ pointerEvents: 'none' }}
        InputLabelProps={{ shrink: true }}
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
