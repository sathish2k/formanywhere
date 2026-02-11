/**
 * SignIn Datasource
 * API calls for signin functionality using NextAuth
 */

import { signIn } from 'next-auth/react';
import type { SignInFormData } from './signin.configuration';

export interface SignInResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(data: SignInFormData): Promise<SignInResponse> {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: 'Invalid email or password',
        error: result.error,
      };
    }

    return {
      success: true,
      message: 'Sign in successful',
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An error occurred during sign in',
    };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<SignInResponse> {
  try {
    await signIn('google', { callbackUrl: '/dashboard' });
    return { success: true };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, message: 'Google sign in failed' };
  }
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGithub(): Promise<SignInResponse> {
  try {
    await signIn('github', { callbackUrl: '/dashboard' });
    return { success: true };
  } catch (error) {
    console.error('GitHub sign in error:', error);
    return { success: false, message: 'GitHub sign in failed' };
  }
}
