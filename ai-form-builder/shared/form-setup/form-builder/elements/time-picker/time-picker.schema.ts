/**
 * Time Picker Properties Schema
 */

import { z } from 'zod';

export const timePickerPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  helperText: z.string().optional(),
  required: z.boolean(),
});

export type TimePickerPropertiesFormData = z.infer<typeof timePickerPropertiesSchema>;
