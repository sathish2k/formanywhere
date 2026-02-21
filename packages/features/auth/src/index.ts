/**
 * Auth Feature Module
 *
 * Authentication components: SignIn, SignUp, Social Login, AuthGuard
 */

// ─── State ──────────────────────────────────────────────────────────────────
export { AuthProvider, useAuth } from './state/auth-provider';
export type { AuthContextValue } from './state/auth-provider';

// ─── Hooks ──────────────────────────────────────────────────────────────────
export { useIdleTimeout } from './hooks/useIdleTimeout';
export type { UseIdleTimeoutOptions } from './hooks/useIdleTimeout';

// ─── Components ─────────────────────────────────────────────────────────────
export { AuthGuard } from './components/auth-guard';
export type { AuthGuardProps } from './components/auth-guard';
export { SignInForm } from './components/sign-in-form';
export { SignUpForm } from './components/sign-up-form';
export { ForgotPasswordForm } from './components/forgot-password-form';
export { ResetPasswordForm } from './components/reset-password-form';
