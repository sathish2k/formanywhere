/**
 * ResetPassword Form - SolidJS Component with Modular Forms + Zod
 * Handles setting a new password using the token from the reset email
 * Uses Better Auth client SDK + @formanywhere/ui components
 */
import { createForm, zodForm, type FieldElementProps } from '@modular-forms/solid';
import { z } from 'zod';
import { Show, createSignal, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { Button } from '@formanywhere/ui/button';
import { TextField, type TextFieldProps } from '@formanywhere/ui/input';
import { Typography } from '@formanywhere/ui/typography';
import { authClient } from '@formanywhere/shared/auth-client';

// Validation schema with password confirmation
const ResetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

/** Adapt modular-forms FieldElementProps to our UI TextField props */
function adaptFieldProps(
    fp: FieldElementProps<ResetPasswordFormData, keyof ResetPasswordFormData>,
): Pick<TextFieldProps, 'ref' | 'name' | 'onInput' | 'onChange' | 'onBlur'> {
    return {
        ref: fp.ref as TextFieldProps['ref'],
        name: fp.name,
        onInput: (e: InputEvent) => (fp.onInput as (e: InputEvent) => void)(e),
        onChange: (e: Event) => (fp.onChange as (e: Event) => void)(e),
        onBlur: (e: FocusEvent) => (fp.onBlur as (e: FocusEvent) => void)(e),
    };
}

export function ResetPasswordForm() {
    const [form, { Form, Field }] = createForm<ResetPasswordFormData>({
        validate: zodForm(ResetPasswordSchema),
    });
    const [error, setError] = createSignal<string | null>(null);
    const [success, setSuccess] = createSignal(false);
    const [tokenMissing, setTokenMissing] = createSignal(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    onMount(() => {
        if (!searchParams.token) {
            setTokenMissing(true);
        }
    });

    const handleSubmit = async (values: ResetPasswordFormData) => {
        setError(null);
        const token = searchParams.token as string;

        if (!token) {
            setError('Reset token is missing. Please request a new reset link.');
            return;
        }

        try {
            const result = await authClient.resetPassword({
                newPassword: values.newPassword,
                token,
            });

            if (result.error) {
                setError(result.error.message || 'Failed to reset password. The link may have expired.');
                return;
            }

            setSuccess(true);

            // Redirect to sign in after a brief delay
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Token Missing State */}
            <Show when={tokenMissing()}>
                <div style={{ 'text-align': 'center' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            'border-radius': '50%',
                            background: 'color-mix(in srgb, var(--m3-color-error) 12%, transparent)',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            margin: '0 auto 1.5rem',
                            'font-size': '1.75rem',
                        }}
                    >
                        ⚠️
                    </div>
                    <Typography variant="title-large" color="on-surface" style={{ 'margin-bottom': '0.75rem' }}>
                        Invalid Reset Link
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant" style={{ 'margin-bottom': '2rem' }}>
                        This password reset link is invalid or has expired. Please request a new one.
                    </Typography>
                    <a href="/forgot-password" style={{ color: 'var(--m3-color-primary)', 'font-weight': 600 }}>
                        Request a new reset link
                    </a>
                </div>
            </Show>

            {/* Success State */}
            <Show when={success()}>
                <div style={{ 'text-align': 'center' }}>
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
                        ✅
                    </div>
                    <Typography variant="title-large" color="on-surface" style={{ 'margin-bottom': '0.75rem' }}>
                        Password Reset Successfully
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant" style={{ 'margin-bottom': '2rem' }}>
                        Your password has been updated. Redirecting you to sign in...
                    </Typography>
                    <a href="/signin" style={{ color: 'var(--m3-color-primary)', 'font-weight': 600 }}>
                        Sign in now
                    </a>
                </div>
            </Show>

            {/* Reset Password Form */}
            <Show when={!tokenMissing() && !success()}>
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

                <Form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.25rem' }}>
                        <Typography variant="body-medium" color="on-surface-variant">
                            Enter your new password below. Make sure it's at least 8 characters long.
                        </Typography>

                        <Field name="newPassword">
                            {(field, fieldProps) => (
                                <TextField
                                    {...adaptFieldProps(fieldProps)}
                                    type="password"
                                    label="New Password"
                                    placeholder="Enter your new password"
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
                                    label="Confirm New Password"
                                    placeholder="Confirm your new password"
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
                            <Show when={!form.submitting} fallback="Resetting password...">
                                Reset Password
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
