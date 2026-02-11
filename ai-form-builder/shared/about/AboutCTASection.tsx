/**
 * About CTA Section Component
 */

'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AboutCTASection() {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <CTACard>
          <DecorativeCircle />
          <ContentWrapper>
            <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
              Ready to get started?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of teams using FormBuilder AI to create beautiful, intelligent forms.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <PrimaryButton variant="contained" size="large" endIcon={<ArrowRight />}>
                  Start Free Trial
                </PrimaryButton>
              </Link>
              <SecondaryButton variant="outlined" size="large">
                Contact Sales
              </SecondaryButton>
            </Stack>
          </ContentWrapper>
        </CTACard>
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const CTACard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const DecorativeCircle = styled(Box)({
  position: 'absolute',
  bottom: -100,
  right: -100,
  width: 300,
  height: 300,
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: 'white',
  color: 'white',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));
