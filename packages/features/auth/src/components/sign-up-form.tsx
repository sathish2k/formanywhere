/**
 * SignUp Form - SolidJS Component with Modular Forms + Zod
 * Handles user registration with type-safe validation
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

// Validation schema with password confirmation
const SignUpSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

interface SignUpFormProps {
    onSuccess?: () => void;
}

export function SignUpForm(props: SignUpFormProps) {
    const [form, { Form, Field }] = createForm<SignUpFormData>({
        validate: zodForm(SignUpSchema),
    });
    const [error, setError] = createSignal<string | null>(null);

    const handleSubmit = async (values: SignUpFormData) => {
        setError(null);
        try {
            const result = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.fullName,
            });

            if (result.error) {
                setError(result.error.message || 'Registration failed');
                return;
            }

            window.location.href = '/dashboard';
            props.onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    const handleGoogleSignUp = async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/dashboard',
        });
    };

    const handleGithubSignUp = async () => {
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/dashboard',
        });
    };

    return (
        <div class="w-full">
            {/* Social Login Buttons */}
            <div class="flex flex-col gap-3 mb-6">
                <Button
                    variant="outlined"
                    onClick={handleGoogleSignUp}
                    style={{ width: '100%', padding: '14px 16px', 'justify-content': 'center', gap: '12px' }}
                >
                    <GoogleIcon width={20} height={20} aria-hidden="true" />
                    Continue with Google
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleGithubSignUp}
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

            {/* Sign Up Form */}
            <Form onSubmit={handleSubmit}>
                <div class="flex flex-col gap-5">
                    <TextField
                        name="fullName"
                        type="text"
                        label="Full Name"
                        placeholder="Enter your full name"
                        variant="outlined"
                    />

                    <TextField
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        variant="outlined"
                    />

                    <TextField
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Create a password"
                        variant="outlined"
                    />

                    <TextField
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        variant="outlined"
                    />

                    {/* Terms Checkbox */}
                    <Checkbox
                        label={
                            <span>
                                I agree to the <a href="/terms" class="text-tertiary hover:underline">Terms of Service</a> and <a href="/privacy" class="text-tertiary hover:underline">Privacy Policy</a>
                            </span>
                        }
                        ariaLabel="I agree to the Terms of Service and Privacy Policy"
                    />

                    <Button
                        type="submit"
                        variant="filled"
                        color="primary"
                        disabled={form.submitting}
                        loading={form.submitting}
                        style={{ width: '100%', padding: '14px 24px' }}
                    >
                        <Show when={!form.submitting} fallback="Creating account...">
                            Create Account
                        </Show>
                    </Button>
                </div>
            </Form>

            {/* Sign In Link */}
            <Typography variant="body-medium" color="on-surface-variant" align="center" class="mt-8">
                Already have an account?{' '}
                <a href="/signin" class="text-primary font-semibold hover:underline">Sign in</a>
            </Typography>
        </div>
    );
}
