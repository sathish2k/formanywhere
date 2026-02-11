/**
 * Slider Component
 * Renders slider input on canvas
 */

'use client';

import { Box, Slider as MuiSlider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface SliderInputProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SliderInput({ element, isSelected, onClick }: SliderInputProps) {
  const min = element.min || 0;
  const max = element.max || 10;
  const step = element.step || 1;
  const defaultValue = typeof element.defaultValue === 'number' ? element.defaultValue : min;

  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {element.required ? `${element.label} *` : element.label}
        </Typography>
        <MuiSlider
          value={defaultValue}
          min={min}
          max={max}
          step={step}
          marks
          valueLabelDisplay="auto"
          disabled
          sx={{ pointerEvents: 'none' }}
        />
        {element.helperText && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {element.helperText}
          </Typography>
        )}
      </Box>
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
