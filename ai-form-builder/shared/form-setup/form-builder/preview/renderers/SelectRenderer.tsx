/**
 * Select Renderer
 */

'use client';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface SelectRendererProps {
  element: DroppedElement;
}

export function SelectRenderer({ element }: SelectRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;
  const options = element.options || [];

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} required={element.required}>
          <InputLabel>{element.label}</InputLabel>
          <Select {...field} label={element.label}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || element.helperText) && (
            <FormHelperText>{error ? error.message : element.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
