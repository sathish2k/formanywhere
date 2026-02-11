/**
 * Templates CTA Section
 * Call to action for creating custom forms
 */

'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

export function TemplatesCTASection() {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <CTABox>
          <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
            Can't find what you're looking for?
          </Typography>
          <Subtitle variant="body1">
            Start from scratch with our powerful drag-and-drop form builder or let AI generate a
            custom form for you.
          </Subtitle>
          <ButtonStack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <PrimaryButton variant="contained" size="large">
                Create from Scratch
              </PrimaryButton>
            </Link>
            <SecondaryButton variant="outlined" size="large">
              Try AI Generator
            </SecondaryButton>
          </ButtonStack>
        </CTABox>
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
}));

const CTABox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: theme.spacing(3),
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const ButtonStack = styled(Stack)(() => ({}));

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
