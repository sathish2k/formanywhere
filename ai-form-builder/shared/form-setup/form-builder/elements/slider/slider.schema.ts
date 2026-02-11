/**
 * Slider Properties Schema
 */

import { z } from 'zod';

export const sliderPropertiesSchema = z
  .object({
    label: z.string().min(1, 'Label is required'),
    fieldName: z.string().min(1, 'Field name is required'),
    helperText: z.string().optional(),
    required: z.boolean(),
    min: z.number(),
    max: z.number(),
    step: z.number().min(1, 'Step must be at least 1'),
    defaultValue: z.number().optional(),
  })
  .refine((data) => data.max > data.min, {
    message: 'Maximum must be greater than minimum',
    path: ['max'],
  })
  .refine(
    (data) =>
      !data.defaultValue || (data.defaultValue >= data.min && data.defaultValue <= data.max),
    {
      message: 'Default value must be between min and max',
      path: ['defaultValue'],
    }
  );

export type SliderPropertiesFormData = z.infer<typeof sliderPropertiesSchema>;
