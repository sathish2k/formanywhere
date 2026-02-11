import { Box, Container, Typography, Button, Stack, Paper, Divider, TextField, useTheme } from '@mui/material';
import { Sparkles, Github, Mail, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

interface SignInProps {
  onSignIn: () => void;
  onBackToHome: () => void;
}

export function SignIn({ onSignIn, onBackToHome }: SignInProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'white' }}>
      {/* Left Side - Branding & Marketing */}
      <Box
        sx={{
          flex: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 8,
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, cursor: 'pointer' }} onClick={onBackToHome}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={22} color="white" strokeWidth={2.5} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              FormBuilder AI
            </Typography>
          </Box>
        </Box>

        {/* Marketing Content */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Typography variant="h3" sx={{ color: 'white', mb: 3, lineHeight: 1.3 }}>
            Build powerful forms{' '}
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              in minutes
            </Box>
            , not hours
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, fontSize: '1.125rem', lineHeight: 1.7 }}>
            Join thousands of teams using FormBuilder AI to create beautiful, intelligent forms with drag-and-drop simplicity.
          </Typography>

          <Stack spacing={2.5}>
            {[
              'AI-powered form generation',
              'Multi-step wizard support',
              'Advanced conditional logic',
              'Real-time analytics dashboard',
            ].map((feature) => (
              <Stack key={feature} direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={14} color="white" strokeWidth={3} />
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Stats */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={6}>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', mb: 0.5 }}>
                10K+
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Active Users
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', mb: 0.5 }}>
                500K+
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Forms Created
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', mb: 0.5 }}>
                99.9%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Uptime
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Sign In Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          bgcolor: '#FAFAFA',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }} onClick={onBackToHome}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) => `0px 8px 16px 0px ${theme.palette.primary.main}40`,
              }}
            >
              <Sparkles size={22} color="white" strokeWidth={2.5} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              FormBuilder AI
            </Typography>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: 'text.primary' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              {isSignUp ? 'Get started with FormBuilder AI for free' : 'Sign in to your account to continue'}
            </Typography>
          </Box>

          {/* Social Login Buttons */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
              onClick={onSignIn}
              sx={{
                py: 1.5,
                bgcolor: 'white',
                border: '1.5px solid',
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'grey.50',
                  borderColor: 'grey.400',
                },
              }}
            >
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<Github size={20} />}
              onClick={onSignIn}
              sx={{
                py: 1.5,
                bgcolor: 'white',
                border: '1.5px solid',
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'grey.50',
                  borderColor: 'grey.400',
                },
              }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              or
            </Typography>
          </Divider>

          {/* Email Sign In Form */}
          <Stack spacing={3}>
            {isSignUp && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  placeholder="John Doe"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>
            )}

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="you@company.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                  },
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Password
                </Typography>
                {!isSignUp && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot?
                  </Typography>
                )}
              </Stack>
              <TextField
                fullWidth
                type="password"
                placeholder={isSignUp ? 'Create a password (min. 8 characters)' : 'Enter your password'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                  },
                }}
              />
            </Box>

            {isSignUp && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Confirm your password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onSignIn}
              endIcon={<ArrowRight size={18} />}
              sx={{
                py: 1.5,
                boxShadow: (theme) => `0px 8px 16px 0px ${theme.palette.primary.main}40`,
                '&:hover': {
                  boxShadow: (theme) => `0px 12px 24px 0px ${theme.palette.primary.main}50`,
                },
              }}
            >
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </Stack>

          {/* Sign Up Link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Typography
                component="span"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign in' : 'Sign up for free'}
              </Typography>
            </Typography>
          </Box>

          {/* Terms */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
            By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <Typography component="span" variant="caption" sx={{ color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography component="span" variant="caption" sx={{ color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}