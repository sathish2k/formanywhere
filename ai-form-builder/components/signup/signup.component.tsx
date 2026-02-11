/**
 * SignUp Component
 * Main signup form with name/email/password and social login options
 */

'use client';

import { AuthBranding } from '@/shared/auth';
import { FormField, OrDivider, SocialButtons } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type SignUpFormData, signupDefaults, signupSchema } from './signup.configuration';
import { signUpWithEmail, signUpWithGithub, signUpWithGoogle } from './signup.datasource';

export function SignUp() {
  const router = useRouter();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaults,
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUpWithEmail(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signUpWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign up failed:', error);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await signUpWithGithub();
      router.push('/dashboard');
    } catch (error) {
      console.error('GitHub sign up failed:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Branding Panel */}
      <AuthBranding />

      {/* Right Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 4, sm: 6, md: 8 },
          bgcolor: '#FAFAFA',
        }}
      >
        <Box sx={{ maxWidth: 440, width: '100%' }}>
          {/* Logo for mobile */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 1.5,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={22} color="white" strokeWidth={2.5} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                FormBuilder AI
              </Typography>
            </Box>
          </Link>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: 'text.primary' }}>
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Start building beautiful forms in minutes
            </Typography>
          </Box>

          {/* Social Login Buttons */}
          <SocialButtons
            onGoogleClick={handleGoogleSignUp}
            onGithubClick={handleGithubSignUp}
            isLoading={isSubmitting}
          />

          {/* Divider */}
          <OrDivider />

          {/* Email Sign Up Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FormField
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                {...register('fullName')}
              />

              <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Create a password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />

              <FormField
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  py: 1.5,
                  boxShadow: '0px 8px 16px 0px rgba(91, 95, 237, 0.24)',
                  '&:hover': {
                    boxShadow: '0px 12px 24px 0px rgba(91, 95, 237, 0.32)',
                  },
                }}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          {/* Sign In Link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/signin" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>

          {/* Terms */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 4 }}
          >
            By signing up, you agree to our{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
