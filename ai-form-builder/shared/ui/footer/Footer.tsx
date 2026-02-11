/**
 * Footer Component
 * Dark theme footer with gradient logo and social links
 */

'use client';

import { Box, Container, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface FooterSection {
  title: string;
  links: Array<{ label: string; href?: string }>;
}

interface FooterProps {
  tagline: string;
  sections: FooterSection[];
  copyright: string;
  socialLinks?: string[];
}

export function Footer({ tagline, sections, copyright, socialLinks = [] }: FooterProps) {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#212B36', py: 10 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
            gap: 6,
            mb: 6,
          }}
        >
          {/* Company Info - Spans 2 columns */}
          <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} color="white" strokeWidth={2.5} />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  FormBuilder AI
                </Typography>
              </Box>
            </Link>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, mb: 3 }}
            >
              {tagline}
            </Typography>
            {/* Social Icons */}
            <Stack direction="row" spacing={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                <Typography sx={{ color: 'white' }}>𝕏</Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                <Typography sx={{ color: 'white' }}>in</Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                <Typography sx={{ color: 'white' }}>f</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Link Sections */}
          {sections.map((section) => (
            <Box key={section.title}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <Typography
                    key={link.label}
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {copyright}
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
