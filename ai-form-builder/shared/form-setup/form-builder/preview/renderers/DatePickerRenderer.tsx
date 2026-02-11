/**
 * Date Picker Renderer
 */

'use client';

import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface DatePickerRendererProps {
  element: DroppedElement;
}

export function DatePickerRenderer({ element }: DatePickerRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="date"
          label={element.label}
          helperText={error ? error.message : element.helperText}
          error={!!error}
          required={element.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
}
