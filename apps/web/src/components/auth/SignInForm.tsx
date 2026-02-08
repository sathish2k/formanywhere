/**
 * SignIn Form - SolidJS Component with Modular Forms + Zod
 * Handles email/password authentication with type-safe validation
 * Uses @formanywhere/ui components with proper theming
 */
import { createForm, zodForm } from '@modular-forms/solid';
import { z } from 'zod';
import { Show } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { TextField } from '@formanywhere/ui/input';
import { Divider } from '@formanywhere/ui/divider';
import { Typography } from '@formanywhere/ui/typography';
import { Checkbox } from '@formanywhere/ui/checkbox';

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
}

export function SignInForm(props: SignInFormProps) {
    const [form, { Form, Field }] = createForm<SignInFormData>({
        validate: zodForm(SignInSchema),
    });

    const handleSubmit = async (values: SignInFormData) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Invalid credentials');
            }

            window.location.href = '/app';
            props.onSuccess?.();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = '/api/auth/google';
    };

    const handleGithubSignIn = () => {
        window.location.href = '/api/auth/github';
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
                    <img src="/icons/google.svg" alt="" class="w-5 h-5" aria-hidden="true" />
                    Continue with Google
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleGithubSignIn}
                    style={{ width: '100%', padding: '14px 16px', 'justify-content': 'center', gap: '12px' }}
                >
                    <img src="/icons/github.svg" alt="" class="w-5 h-5" aria-hidden="true" />
                    Continue with GitHub
                </Button>
            </div>

            {/* Divider */}
            <div class="flex items-center gap-4 my-6">
                <div class="flex-1"><Divider /></div>
                <Typography variant="body-small" color="on-surface-variant">or</Typography>
                <div class="flex-1"><Divider /></div>
            </div>

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
                            <a href="/forgot-password" class="text-sm text-primary hover:underline">Forgot?</a>
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
                        color="secondary"
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
                <span class="text-on-surface cursor-pointer hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span class="text-on-surface cursor-pointer hover:underline">Privacy Policy</span>
            </Typography>
        </div>
    );
}
