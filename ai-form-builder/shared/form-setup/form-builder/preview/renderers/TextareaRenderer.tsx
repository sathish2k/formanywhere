/**
 * Textarea Renderer
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface TextareaRendererProps {
  element: DroppedElement;
}

export function TextareaRenderer({ element }: TextareaRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        ...(element.validation?.minLength && {
          minLength: {
            value: element.validation.minLength,
            message: `Minimum ${element.validation.minLength} characters required`,
          },
        }),
        ...(element.validation?.maxLength && {
          maxLength: {
            value: element.validation.maxLength,
            message: `Maximum ${element.validation.maxLength} characters allowed`,
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          multiline
          rows={typeof element.rows === 'number' ? element.rows : 4}
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
