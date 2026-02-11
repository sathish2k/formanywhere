/**
 * Checkbox Component
 */

'use client';

import { Box, FormControlLabel, Checkbox as MuiCheckbox, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface CheckboxProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Checkbox({ element, isSelected, onClick }: CheckboxProps) {
  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <FormControlLabel
        control={<MuiCheckbox disabled />}
        label={element.label}
        sx={{ pointerEvents: 'none' }}
      />
      {element.helperText && (
        <HelperText variant="caption" color="text.secondary">
          {element.helperText}
        </HelperText>
      )}
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

const HelperText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  display: 'block',
}));
