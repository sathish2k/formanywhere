/**
 * SignUp Form - SolidJS Component with Modular Forms + Zod
 * Handles user registration with type-safe validation
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
import GoogleIcon from '../../icons/svg/google.svg?component-solid';
import GithubIcon from '../../icons/svg/github.svg?component-solid';

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

    const handleSubmit = async (values: SignUpFormData) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: values.fullName,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }

            window.location.href = '/app';
            props.onSuccess?.();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoogleSignUp = () => {
        window.location.href = '/api/auth/google';
    };

    const handleGithubSignUp = () => {
        window.location.href = '/api/auth/github';
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
