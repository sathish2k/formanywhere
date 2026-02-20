/**
 * SignIn Form - SolidJS Component with Modular Forms + Zod
 * Handles email/password authentication with type-safe validation
 * Uses Better Auth client SDK + @formanywhere/ui components
 */
import { createForm, zodForm } from '@modular-forms/solid';
import { z } from 'zod';
import { Show, createSignal } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { TextField } from '@formanywhere/ui/input';
import { Divider } from '@formanywhere/ui/divider';
import { Typography } from '@formanywhere/ui/typography';
import { Checkbox } from '@formanywhere/ui/checkbox';
import GoogleIcon from '@formanywhere/shared/icons/svg/google.svg?component-solid';
import GithubIcon from '@formanywhere/shared/icons/svg/github.svg?component-solid';
import { authClient } from '@formanywhere/shared/auth-client';

// Validation schema
const SignInSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof SignInSchema>;

interface SignInFormProps {
    onSuccess?: () => void;
    /** URL to redirect to after successful login (from ?returnTo= query param) */
    returnTo?: string;
}

export function SignInForm(props: SignInFormProps) {
    const [form, { Form, Field }] = createForm<SignInFormData>({
        validate: zodForm(SignInSchema),
    });
    const [error, setError] = createSignal<string | null>(null);

    /** Get redirect URL — check props, then query param, then default */
    const getRedirectUrl = () => {
        if (props.returnTo) return props.returnTo;
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('returnTo') || '/dashboard';
        }
        return '/dashboard';
    };

    const handleSubmit = async (values: SignInFormData) => {
        setError(null);
        try {
            const result = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });

            if (result.error) {
                setError(result.error.message || 'Invalid credentials');
                return;
            }

            window.location.href = getRedirectUrl();
            props.onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Sign in failed. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: getRedirectUrl(),
        });
    };

    const handleGithubSignIn = async () => {
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: getRedirectUrl(),
        });
    };

    return (
        <div class="w-full">
            {/* Social Login Buttons */}
            <div class="flex flex-col gap-3 mb-6">
                <Button
                    variant="outlined"
                    onClick={handleGoogleSignIn}
                    style={{ width: '100%', padding: '14px 16px', 'justify-content': 'center', gap: '12px' }}
                >
                    <GoogleIcon width={20} height={20} aria-hidden="true" />
                    Continue with Google
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleGithubSignIn}
                    style={{ width: '100%', padding: '14px 16px', 'justify-content': 'center', gap: '12px' }}
                >
                    <GithubIcon width={20} height={20} aria-hidden="true" style={{ color: 'black' }} />
                    Continue with GitHub
                </Button>
            </div>

            {/* Divider */}
            <div class="flex items-center gap-4 my-6">
                <div class="flex-1"><Divider /></div>
                <Typography variant="body-small" color="on-surface-variant">or</Typography>
                <div class="flex-1"><Divider /></div>
            </div>

            {/* Error Message */}
            <Show when={error()}>
                <div class="mb-4 p-3 rounded-lg bg-error/10 border border-error/20">
                    <Typography variant="body-small" color="error">{error()}</Typography>
                </div>
            </Show>

            {/* Email Sign In Form */}
            <Form onSubmit={handleSubmit}>
                <div class="flex flex-col gap-5">
                    <TextField
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="you@company.com"
                        variant="outlined"
                    />

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <Typography variant="label-large" color="on-surface">Password</Typography>
                            <a href="/forgot-password" class="text-sm text-tertiary hover:underline">Forgot?</a>
                        </div>
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            variant="outlined"
                        />
                    </div>

                    {/* Remember Me Checkbox */}
                    <Checkbox label="Remember me" />

                    <Button
                        type="submit"
                        variant="filled"
                        color="primary"
                        disabled={form.submitting}
                        loading={form.submitting}
                        style={{ width: '100%', padding: '14px 24px' }}
                    >
                        <Show when={!form.submitting} fallback="Signing in...">
                            Sign in
                        </Show>
                    </Button>
                </div>
            </Form>

            {/* Sign Up Link */}
            <Typography variant="body-medium" color="on-surface-variant" align="center" class="mt-8">
                Don't have an account?{' '}
                <a href="/signup" class="text-primary font-semibold hover:underline">Sign up for free</a>
            </Typography>

            {/* Terms */}
            <Typography variant="body-small" color="on-surface-variant" align="center" class="mt-6">
                By signing in, you agree to our{' '}
                <span class="text-tertiary cursor-pointer hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span class="text-tertiary cursor-pointer hover:underline">Privacy Policy</span>
            </Typography>
        </div>
    );
}
