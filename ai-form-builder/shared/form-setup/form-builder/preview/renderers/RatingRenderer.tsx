/**
 * Rating Renderer
 * Renders rating input in preview mode
 */

'use client';

import { Box, FormHelperText, Rating as MuiRating, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface RatingRendererProps {
  element: DroppedElement;
}

export function RatingRenderer({ element }: RatingRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;
  const maxStars = element.maxStars || 5;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        min: element.required ? { value: 1, message: 'Please provide a rating' } : undefined,
      }}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {element.label}
            {element.required && ' *'}
          </Typography>
          <MuiRating
            {...field}
            value={field.value || 0}
            onChange={(_, value) => field.onChange(value)}
            max={maxStars}
            size="large"
          />
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
