/**
 * URL Input Renderer
 * Renders URL input field in preview mode
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface UrlInputRendererProps {
  element: DroppedElement;
}

export function UrlInputRenderer({ element }: UrlInputRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        pattern: {
          value: /^https?:\/\/.+/i,
          message: 'Please enter a valid URL starting with http:// or https://',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="url"
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
