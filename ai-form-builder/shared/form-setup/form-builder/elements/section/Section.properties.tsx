/**
 * Section Properties
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DroppedElement } from '../../form-builder.configuration';

const sectionPropertiesSchema = z.object({
  heading: z.string().min(1),
});

type SectionPropertiesFormData = z.infer<typeof sectionPropertiesSchema>;

interface SectionPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function SectionProperties({ element, onUpdate }: SectionPropertiesProps) {
  const { watch, reset, register } = useForm<SectionPropertiesFormData>({
    resolver: zodResolver(sectionPropertiesSchema),
    defaultValues: {
      heading: element.heading || '',
    },
  });

  useEffect(() => {
    const subscription = watch((values) => onUpdate(values as any));
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      heading: element.heading || '',
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Section Title
        </Typography>
        <TextField fullWidth size="small" {...register('heading')} />
      </Box>
    </Stack>
  );
}
