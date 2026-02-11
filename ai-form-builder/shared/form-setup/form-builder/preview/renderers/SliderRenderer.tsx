/**
 * Slider Renderer
 * Renders slider input in preview mode
 */

'use client';

import { Box, FormHelperText, Slider as MuiSlider, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface SliderRendererProps {
  element: DroppedElement;
}

export function SliderRenderer({ element }: SliderRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;
  const min = element.min || 0;
  const max = element.max || 10;
  const step = element.step || 1;
  const defaultValue = element.defaultValue || min;

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {element.label}
            {element.required && ' *'}
          </Typography>
          <MuiSlider {...field} min={min} max={max} step={step} marks valueLabelDisplay="auto" />
          {(error || element.helperText) && (
            <FormHelperText error={!!error}>
              {error ? error.message : element.helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
