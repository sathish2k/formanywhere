/**
 * Rating Properties Schema
 */

import { z } from 'zod';

export const ratingPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  helperText: z.string().optional(),
  required: z.boolean(),
  maxStars: z.number().min(3, 'Minimum 3 stars').max(10, 'Maximum 10 stars'),
});

export type RatingPropertiesFormData = z.infer<typeof ratingPropertiesSchema>;
