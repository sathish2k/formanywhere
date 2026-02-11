/**
 * AuthBranding Component
 * Left panel with logo, marketing content, and stats for auth screens
 */

'use client';

import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AuthBrandingProps {
  features?: string[];
  stats?: Array<{ value: string; label: string }>;
}

const defaultFeatures = [
  'AI-powered form generation',
  'Multi-step wizard support',
  'Advanced conditional logic',
  'Real-time analytics dashboard',
];

const defaultStats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Forms Created' },
  { value: '99.9%', label: 'Uptime' },
];

export function AuthBranding({
  features = defaultFeatures,
  stats = defaultStats,
}: AuthBrandingProps) {
  const theme = useTheme();

  return (
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
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
              cursor: 'pointer',
            }}
          >
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
        </Link>
      </Box>

      {/* Marketing Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
        <Typography variant="h3" sx={{ color: 'white', mb: 3, lineHeight: 1.3 }}>
          Build powerful forms in minutes, not hours
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            fontSize: '1.125rem',
            lineHeight: 1.7,
          }}
        >
          Join thousands of teams using FormBuilder AI to create beautiful, intelligent forms with
          drag-and-drop simplicity.
        </Typography>

        <Stack spacing={2.5}>
          {features.map((feature) => (
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
          {stats.map((stat) => (
            <Box key={stat.label}>
              <Typography variant="h4" sx={{ color: 'white', mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
