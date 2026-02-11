/**
 * Rating Properties
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select as MuiSelect,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';
import { type RatingPropertiesFormData, ratingPropertiesSchema } from './rating.schema';

interface RatingPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function RatingProperties({ element, onUpdate }: RatingPropertiesProps) {
  const { control, watch, reset, register } = useForm<RatingPropertiesFormData>({
    resolver: zodResolver(ratingPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      helperText: element.helperText || '',
      required: element.required || false,
      maxStars: element.maxStars || 5,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        fieldName: values.fieldName,
        helperText: values.helperText,
        required: values.required,
        maxStars: values.maxStars,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      label: element.label || '',
      fieldName: element.fieldName || '',
      helperText: element.helperText || '',
      required: element.required || false,
      maxStars: element.maxStars || 5,
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Label
        </Typography>
        <TextField fullWidth size="small" {...register('label')} />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Field Name
        </Typography>
        <TextField fullWidth size="small" {...register('fieldName')} />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Maximum Stars
        </Typography>
        <Controller
          name="maxStars"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="body2" gutterBottom>
                {field.value} stars
              </Typography>
              <Slider {...field} min={3} max={10} marks valueLabelDisplay="auto" />
            </Box>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Helper Text
        </Typography>
        <TextField fullWidth size="small" {...register('helperText')} multiline rows={2} />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Required
        </Typography>
        <Controller
          name="required"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <MuiSelect
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </MuiSelect>
            </FormControl>
          )}
        />
      </Box>
    </Stack>
  );
}
