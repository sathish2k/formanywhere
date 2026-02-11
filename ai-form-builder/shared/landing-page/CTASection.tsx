/**
 * CTA Section Component
 * Gradient call-to-action block
 */

'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Styled Components
const CTAWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

const CTAContent = styled(Box)({
  textAlign: 'center',
});

const CTATitle = styled(Typography)(({ theme }) => ({
  color: '#FFFFFF',
  fontWeight: 800,
  marginBottom: theme.spacing(2),
}));

const CTASubtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 400,
  marginBottom: theme.spacing(5),
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: theme.palette.primary.main,
  fontWeight: 700,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  fontSize: '1.125rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderWidth: 2,
  borderColor: '#FFFFFF',
  color: '#FFFFFF',
  fontWeight: 700,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  fontSize: '1.125rem',
  '&:hover': {
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

export function CTASection() {
  return (
    <CTAWrapper>
      <Container maxWidth="md">
        <CTAContent>
          <CTATitle variant="h2">Ready to Transform Your Forms?</CTATitle>
          <CTASubtitle variant="h6">
            Join 10,000+ companies building better forms with AI. Start your free trial today.
          </CTASubtitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <PrimaryButton variant="contained" size="large" endIcon={<ArrowRight />}>
                Start Free Trial
              </PrimaryButton>
            </Link>
            <OutlinedButton variant="outlined" size="large" startIcon={<MessageSquare />}>
              Contact Sales
            </OutlinedButton>
          </Stack>
        </CTAContent>
      </Container>
    </CTAWrapper>
  );
}
