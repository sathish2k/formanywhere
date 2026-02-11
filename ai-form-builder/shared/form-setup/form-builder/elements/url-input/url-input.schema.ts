/**
 * URL Input Properties Schema
 */

import { z } from 'zod';

export const urlInputPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
});

export type UrlInputPropertiesFormData = z.infer<typeof urlInputPropertiesSchema>;
