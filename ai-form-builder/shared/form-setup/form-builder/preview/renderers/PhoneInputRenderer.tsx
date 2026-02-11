/**
 * Phone Input Renderer
 * Renders phone input field in preview mode
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface PhoneInputRendererProps {
  element: DroppedElement;
}

export function PhoneInputRenderer({ element }: PhoneInputRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        pattern: {
          value: /^[\d\s\-\+\(\)]+$/,
          message: 'Please enter a valid phone number',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="tel"
          label={element.label}
          placeholder={element.placeholder}
          helperText={error ? error.message : element.helperText}
          error={!!error}
          required={element.required}
        />
      )}
    />
  );
}
