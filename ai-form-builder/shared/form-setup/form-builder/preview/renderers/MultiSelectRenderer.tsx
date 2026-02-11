/**
 * Multi-Select Renderer
 */

'use client';

import { Checkbox, ListItemText, MenuItem, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface MultiSelectRendererProps {
  element: DroppedElement;
}

export function MultiSelectRenderer({ element }: MultiSelectRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={[]}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (selected as string[]).join(', '),
          }}
          fullWidth
          label={element.label}
          helperText={error ? error.message : element.helperText}
          error={!!error}
          required={element.required}
        >
          {(element.options || []).map((option, index) => (
            <MenuItem key={index} value={option.value}>
              <Checkbox checked={(field.value as string[]).indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
