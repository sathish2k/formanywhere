/**
 * Multi-Select Properties Schema
 */

import { z } from 'zod';

export const multiSelectPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  helperText: z.string().optional(),
  required: z.boolean(),
  options: z
    .array(
      z.object({
        label: z.string().min(1, 'Option label is required'),
        value: z.string().min(1, 'Option value is required'),
      })
    )
    .min(1, 'At least one option is required'),
});

export type MultiSelectPropertiesFormData = z.infer<typeof multiSelectPropertiesSchema>;
