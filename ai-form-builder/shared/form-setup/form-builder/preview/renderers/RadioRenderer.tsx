/**
 * Radio Renderer
 */

'use client';

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface RadioRendererProps {
  element: DroppedElement;
}

export function RadioRenderer({ element }: RadioRendererProps) {
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
        <FormControl error={!!error} required={element.required}>
          <FormLabel>{element.label}</FormLabel>
          <RadioGroup {...field}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {(error || element.helperText) && (
            <FormHelperText>{error ? error.message : element.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
