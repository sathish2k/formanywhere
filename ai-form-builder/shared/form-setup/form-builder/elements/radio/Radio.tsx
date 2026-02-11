/**
 * Radio Component
 */

'use client';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface RadioProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Radio({ element, isSelected, onClick }: RadioProps) {
  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <FormControl component="fieldset" disabled sx={{ pointerEvents: 'none' }}>
        <FormLabel component="legend">{element.label}</FormLabel>
        <RadioGroup>
          {element.options?.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.value}
              control={<MuiRadio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {element.helperText && (
          <HelperText variant="caption" color="text.secondary">
            {element.helperText}
          </HelperText>
        )}
      </FormControl>
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
  marginTop: theme.spacing(0.5),
}));
