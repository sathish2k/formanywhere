/**
 * Text Input Renderer
 * Renders text and email input fields
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface TextInputRendererProps {
  element: DroppedElement;
}

export function TextInputRenderer({ element }: TextInputRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;
  const isEmail = element.type === 'email-input';

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
        ...(isEmail && {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }),
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
        ...(element.validation?.pattern && {
          pattern: {
            value: new RegExp(element.validation.pattern),
            message: element.validation.customMessage || 'Invalid format',
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={element.label}
          placeholder={element.placeholder}
          helperText={error ? error.message : element.helperText}
          error={!!error}
          type={isEmail ? 'email' : 'text'}
          required={element.required}
        />
      )}
    />
  );
}
