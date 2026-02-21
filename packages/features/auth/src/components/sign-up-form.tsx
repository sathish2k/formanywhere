/**
 * SignUp Form - SolidJS Component with Modular Forms + Zod
 * Handles user registration with type-safe validation
 * Uses Better Auth client SDK + @formanywhere/ui components
 */
import { createForm, zodForm, type FieldElementProps } from '@modular-forms/solid';
import { z } from 'zod';
import { Show, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Button } from '@formanywhere/ui/button';
import { TextField, type TextFieldProps } from '@formanywhere/ui/input';
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

/** Adapt modular-forms FieldElementProps to our UI TextField props */
function adaptFieldProps(
    fp: FieldElementProps<SignUpFormData, keyof SignUpFormData>,
): Pick<TextFieldProps, 'ref' | 'name' | 'onInput' | 'onChange' | 'onBlur'> {
    return {
        ref: fp.ref as TextFieldProps['ref'],
        name: fp.name,
        onInput: (e: InputEvent) => (fp.onInput as (e: InputEvent) => void)(e),
        onChange: (e: Event) => (fp.onChange as (e: Event) => void)(e),
        onBlur: (e: FocusEvent) => (fp.onBlur as (e: FocusEvent) => void)(e),
    };
}

interface SignUpFormProps {
    onSuccess?: () => void;
}

export function SignUpForm(props: SignUpFormProps) {
    const [form, { Form, Field }] = createForm<SignUpFormData>({
        validate: zodForm(SignUpSchema),
    });
    const [error, setError] = createSignal<string | null>(null);
    const navigate = useNavigate();

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

            navigate('/signin');
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
        <div style={{ width: '100%' }}>
            {/* Social Login Buttons */}
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '0.75rem', 'margin-bottom': '1.5rem' }}>
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
            <div style={{ display: 'flex', 'align-items': 'center', gap: '1rem', 'margin-top': '1.5rem', 'margin-bottom': '1.5rem' }}>
                <div style={{ flex: 1 }}><Divider /></div>
                <Typography variant="body-small" color="on-surface-variant">or</Typography>
                <div style={{ flex: 1 }}><Divider /></div>
            </div>

            {/* Error Message */}
            <Show when={error()}>
                <div style={{ 'margin-bottom': '1rem', padding: '0.75rem', 'border-radius': '0.5rem', background: 'color-mix(in srgb, var(--m3-color-error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--m3-color-error) 20%, transparent)' }}>
                    <Typography variant="body-small" color="error">{error()}</Typography>
                </div>
            </Show>

            {/* Sign Up Form */}
            <Form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.25rem' }}>
                    <Field name="fullName">
                        {(field, fieldProps) => (
                            <TextField
                                {...adaptFieldProps(fieldProps)}
                                type="text"
                                label="Full Name"
                                placeholder="Enter your full name"
                                variant="outlined"
                                value={field.value ?? ''}
                                error={!!field.error}
                                errorText={field.error}
                            />
                        )}
                    </Field>

                    <Field name="email">
                        {(field, fieldProps) => (
                            <TextField
                                {...adaptFieldProps(fieldProps)}
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email"
                                variant="outlined"
                                value={field.value ?? ''}
                                error={!!field.error}
                                errorText={field.error}
                            />
                        )}
                    </Field>

                    <Field name="password">
                        {(field, fieldProps) => (
                            <TextField
                                {...adaptFieldProps(fieldProps)}
                                type="password"
                                label="Password"
                                placeholder="Create a password"
                                variant="outlined"
                                value={field.value ?? ''}
                                error={!!field.error}
                                errorText={field.error}
                            />
                        )}
                    </Field>

                    <Field name="confirmPassword">
                        {(field, fieldProps) => (
                            <TextField
                                {...adaptFieldProps(fieldProps)}
                                type="password"
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                variant="outlined"
                                value={field.value ?? ''}
                                error={!!field.error}
                                errorText={field.error}
                            />
                        )}
                    </Field>

                    {/* Terms Checkbox */}
                    <Checkbox
                        label={
                            <span>
                                I agree to the <a href="/terms" style={{ color: 'var(--m3-color-tertiary)' }}>Terms of Service</a> and <a href="/privacy" style={{ color: 'var(--m3-color-tertiary)' }}>Privacy Policy</a>
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
            <Typography variant="body-medium" color="on-surface-variant" align="center" style={{ 'margin-top': '2rem' }}>
                Already have an account?{' '}
                <a href="/signin" style={{ color: 'var(--m3-color-primary)', 'font-weight': 600 }}>Sign in</a>
            </Typography>
        </div>
    );
}
