/**
 * SignIn Configuration
 * Zod validation schema and form defaults
 */

import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type SignInFormData = z.infer<typeof signinSchema>;

export const signinDefaults: SignInFormData = {
  email: '',
  password: '',
};
