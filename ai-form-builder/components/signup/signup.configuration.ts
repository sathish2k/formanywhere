/**
 * SignUp Configuration
 * Zod validation schema and form defaults
 */

import { z } from 'zod';

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signupSchema>;

export const signupDefaults: SignUpFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
