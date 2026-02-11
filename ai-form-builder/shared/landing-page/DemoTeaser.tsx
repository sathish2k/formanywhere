/**
 * Demo Teaser Component
 * Video preview section with play button overlay
 */

'use client';

import { Box, Chip, Container, Stack, Typography, useTheme } from '@mui/material';
import { Check, PlayCircle } from 'lucide-react';

interface DemoTeaserProps {
  onPlay?: () => void;
}

export function DemoTeaser({ onPlay }: DemoTeaserProps) {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'white', py: 6, borderY: '1px solid rgba(145, 158, 171, 0.16)' }}>
      <Container maxWidth="xl">
        <Box
          onClick={onPlay}
          sx={{
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#F4F6F8',
            p: 6,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            cursor: 'pointer',
            border: '2px solid rgba(145, 158, 171, 0.12)',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              '& .play-button': {
                transform: 'scale(1.1)',
                bgcolor: theme.palette.primary.main,
                '& svg': {
                  color: 'white',
                },
              },
            },
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Chip
              label="WATCH DEMO"
              icon={<PlayCircle size={16} />}
              sx={{
                mb: 2,
                bgcolor: `${theme.palette.primary.main}20`,
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, mb: 2 }}>
              See FormBuilder AI in Action
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
              Watch how you can build a complete multi-step form with AI assistance in under 60
              seconds
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              flexWrap="wrap"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Check size={20} color={theme.palette.primary.main} strokeWidth={2.5} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  No signup required
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Check size={20} color={theme.palette.primary.main} strokeWidth={2.5} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  60 seconds
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Right Demo Preview */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: 400 },
              height: 240,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.24)',
              bgcolor: 'white',
            }}
          >
            {/* Mock Video Thumbnail */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Form Preview in Background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  bottom: 20,
                  bgcolor: 'white',
                  borderRadius: 1.5,
                  p: 2,
                  opacity: 0.6,
                }}
              >
                <Stack spacing={1.5}>
                  <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '60%' }} />
                  <Box
                    sx={{
                      height: 24,
                      bgcolor: '#F9FAFB',
                      borderRadius: 1,
                      border: '1px solid #DFE3E8',
                    }}
                  />
                  <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '50%' }} />
                  <Box
                    sx={{
                      height: 24,
                      bgcolor: '#F9FAFB',
                      borderRadius: 1,
                      border: '1px solid #DFE3E8',
                    }}
                  />
                  <Box sx={{ height: 8, bgcolor: '#DFE3E8', borderRadius: 1, width: '70%' }} />
                  <Box
                    sx={{
                      height: 24,
                      bgcolor: '#F9FAFB',
                      borderRadius: 1,
                      border: '1px solid #DFE3E8',
                    }}
                  />
                </Stack>
              </Box>

              {/* Play Button Overlay */}
              <Box
                className="play-button"
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.4)',
                  transition: 'all 0.3s',
                }}
              >
                <PlayCircle
                  size={40}
                  color={theme.palette.primary.main}
                  strokeWidth={2}
                  fill={theme.palette.primary.main}
                />
              </Box>
            </Box>

            {/* Duration Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              0:60
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
