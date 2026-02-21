/**
 * ForgotPassword Form - SolidJS Component with Modular Forms + Zod
 * Handles password reset request (sends reset email)
 * Uses Better Auth client SDK + @formanywhere/ui components
 */
import { createForm, zodForm, type FieldElementProps } from '@modular-forms/solid';
import { z } from 'zod';
import { Show, createSignal } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { TextField, type TextFieldProps } from '@formanywhere/ui/input';
import { Typography } from '@formanywhere/ui/typography';
import { authClient } from '@formanywhere/shared/auth-client';

// Validation schema
const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

/** Adapt modular-forms FieldElementProps to our UI TextField props */
function adaptFieldProps(
    fp: FieldElementProps<ForgotPasswordFormData, keyof ForgotPasswordFormData>,
): Pick<TextFieldProps, 'ref' | 'name' | 'onInput' | 'onChange' | 'onBlur'> {
    return {
        ref: fp.ref as TextFieldProps['ref'],
        name: fp.name,
        onInput: (e: InputEvent) => (fp.onInput as (e: InputEvent) => void)(e),
        onChange: (e: Event) => (fp.onChange as (e: Event) => void)(e),
        onBlur: (e: FocusEvent) => (fp.onBlur as (e: FocusEvent) => void)(e),
    };
}

export function ForgotPasswordForm() {
    const [form, { Form, Field }] = createForm<ForgotPasswordFormData>({
        validate: zodForm(ForgotPasswordSchema),
    });
    const [error, setError] = createSignal<string | null>(null);
    const [submitted, setSubmitted] = createSignal(false);

    const handleSubmit = async (values: ForgotPasswordFormData) => {
        setError(null);
        try {
            await authClient.requestPasswordReset({
                email: values.email,
                redirectTo: `${window.location.origin}/reset-password`,
            });

            // Always show success, even if email doesn't exist (prevents email enumeration)
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Show
                when={!submitted()}
                fallback={
                    <div style={{ 'text-align': 'center' }}>
                        {/* Success State */}
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                'border-radius': '50%',
                                background: 'color-mix(in srgb, var(--m3-color-primary) 12%, transparent)',
                                display: 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                margin: '0 auto 1.5rem',
                                'font-size': '1.75rem',
                            }}
                        >
                            ✉️
                        </div>
                        <Typography variant="title-large" color="on-surface" style={{ 'margin-bottom': '0.75rem' }}>
                            Check your email
                        </Typography>
                        <Typography variant="body-medium" color="on-surface-variant" style={{ 'margin-bottom': '2rem' }}>
                            If an account exists with that email, we've sent a password reset link. Please check your inbox and spam folder.
                        </Typography>
                        <a href="/signin" style={{ color: 'var(--m3-color-primary)', 'font-weight': 600 }}>
                            ← Back to Sign in
                        </a>
                    </div>
                }
            >
                {/* Error Message */}
                <Show when={error()}>
                    <div
                        style={{
                            'margin-bottom': '1rem',
                            padding: '0.75rem',
                            'border-radius': '0.5rem',
                            background: 'color-mix(in srgb, var(--m3-color-error) 10%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--m3-color-error) 20%, transparent)',
                        }}
                    >
                        <Typography variant="body-small" color="error">{error()}</Typography>
                    </div>
                </Show>

                {/* Forgot Password Form */}
                <Form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.25rem' }}>
                        <Typography variant="body-medium" color="on-surface-variant">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </Typography>

                        <Field name="email">
                            {(field, fieldProps) => (
                                <TextField
                                    {...adaptFieldProps(fieldProps)}
                                    type="email"
                                    label="Email Address"
                                    placeholder="you@company.com"
                                    variant="outlined"
                                    value={field.value ?? ''}
                                    error={!!field.error}
                                    errorText={field.error}
                                />
                            )}
                        </Field>

                        <Button
                            type="submit"
                            variant="filled"
                            color="primary"
                            disabled={form.submitting}
                            loading={form.submitting}
                            style={{ width: '100%', padding: '14px 24px' }}
                        >
                            <Show when={!form.submitting} fallback="Sending reset link...">
                                Send Reset Link
                            </Show>
                        </Button>
                    </div>
                </Form>

                {/* Back to Sign In */}
                <Typography variant="body-medium" color="on-surface-variant" align="center" style={{ 'margin-top': '2rem' }}>
                    Remember your password?{' '}
                    <a href="/signin" style={{ color: 'var(--m3-color-primary)', 'font-weight': 600 }}>Sign in</a>
                </Typography>
            </Show>
        </div>
    );
}
