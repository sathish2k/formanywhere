/**
 * File Upload Properties
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DroppedElement } from '../../form-builder.configuration';

const fileUploadPropertiesSchema = z.object({
  label: z.string().min(1),
  fieldName: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean(),
  accept: z.string().optional(),
  maxFiles: z.number().min(1).max(10),
});

type FileUploadPropertiesFormData = z.infer<typeof fileUploadPropertiesSchema>;

interface FileUploadPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function FileUploadProperties({ element, onUpdate }: FileUploadPropertiesProps) {
  const { control, watch, reset, register } = useForm<FileUploadPropertiesFormData>({
    resolver: zodResolver(fileUploadPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      required: element.required || false,
      accept: element.accept || '*/*',
      maxFiles: element.maxFiles || 1,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => onUpdate(values as any));
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      required: element.required || false,
      accept: element.accept || '*/*',
      maxFiles: element.maxFiles || 1,
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
          Accept Types
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="image/*,application/pdf"
          {...register('accept')}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Max Files
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('maxFiles', { valueAsNumber: true })}
        />
      </Box>
    </Stack>
  );
}
