/**
 * Number Input Renderer
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface NumberInputRendererProps {
  element: DroppedElement;
}

export function NumberInputRenderer({ element }: NumberInputRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        ...(element.validation?.min !== undefined && {
          min: {
            value: element.validation.min,
            message: `Minimum value is ${element.validation.min}`,
          },
        }),
        ...(element.validation?.max !== undefined && {
          max: {
            value: element.validation.max,
            message: `Maximum value is ${element.validation.max}`,
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="number"
          label={element.label}
          placeholder={element.placeholder}
          helperText={error ? error.message : element.helperText}
          error={!!error}
          required={element.required}
          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
        />
      )}
    />
  );
}
