/**
 * Matrix Properties Schema
 */

import { z } from 'zod';

export const matrixPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  helperText: z.string().optional(),
  required: z.boolean(),
  rows: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, 'Row label is required'),
      })
    )
    .min(1, 'At least one row is required'),
  columns: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, 'Column label is required'),
      })
    )
    .min(1, 'At least one column is required'),
});

export type MatrixPropertiesFormData = z.infer<typeof matrixPropertiesSchema>;
