/**
 * Heading Element Properties Schema
 * Zod validation schema for heading element properties
 */

import { z } from 'zod';

export const headingPropertiesSchema = z.object({
  label: z.string().min(1, 'Heading text is required'),
  typographyVariant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2']),
  align: z.enum(['left', 'center', 'right', 'justify']),
  color: z.enum([
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'textPrimary',
    'textSecondary',
  ]),
  gutterBottom: z.boolean(),
  noWrap: z.boolean(),
});

export type HeadingPropertiesFormData = z.infer<typeof headingPropertiesSchema>;

export const headingPropertiesDefaults: HeadingPropertiesFormData = {
  label: '',
  typographyVariant: 'h4',
  align: 'center',
  color: 'textPrimary',
  gutterBottom: true,
  noWrap: false,
};
