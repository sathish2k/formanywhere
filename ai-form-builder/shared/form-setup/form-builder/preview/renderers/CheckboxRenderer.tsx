/**
 * Checkbox Renderer
 */

'use client';

import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface CheckboxRendererProps {
  element: DroppedElement;
}

export function CheckboxRenderer({ element }: CheckboxRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={false}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} required={element.required}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={element.label}
          />
          {(error || element.helperText) && (
            <FormHelperText>{error ? error.message : element.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
