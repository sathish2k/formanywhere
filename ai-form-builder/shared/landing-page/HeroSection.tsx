/**
 * Hero Section Component
 * Landing page hero with title, subtitle, CTAs, and form preview
 */

'use client';

import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

// Styled Components
const HeroWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const HeroGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(6),
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const BadgeChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    fontSize: '3.75rem',
  },
}));

const GradientText = styled('span')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
  lineHeight: 1.8,
  marginBottom: theme.spacing(4),
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  paddingTop: theme.spacing(1.75),
  paddingBottom: theme.spacing(1.75),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  backgroundColor: theme.palette.grey[900],
  '&:hover': {
    backgroundColor: '#000000',
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  paddingTop: theme.spacing(1.75),
  paddingBottom: theme.spacing(1.75),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  fontSize: '1rem',
  fontWeight: 600,
  borderWidth: 2,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  borderColor: theme.palette.grey[900],
  color: theme.palette.grey[900],
  '&:hover': {
    borderWidth: 2,
  },
}));

const PreviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  boxShadow:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
  background: theme.palette.background.paper,
  border: '1px solid rgba(145, 158, 171, 0.16)',
}));

const FormPreviewContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const WindowDot = styled(Box)<{ dotColor: string }>(({ dotColor }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: dotColor,
}));

const FormField = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const FormFieldActive = styled(FormField)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
}));

const InputPlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: 40,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.info.lighter,
  color: theme.palette.info.main,
  fontWeight: 600,
}));

export function HeroSection() {
  return (
    <HeroWrapper maxWidth="xl">
      <HeroGrid>
        <Box>
          <BadgeChip label="AI-POWERED AUTOMATION" />
          <HeroTitle variant="h1">
            Build Powerful Forms & Workflows
            <GradientText> in Minutes</GradientText>
          </HeroTitle>
          <HeroSubtitle variant="h6">
            Enterprise-grade form builder with AI assistance, multi-step workflows, conditional
            logic, and seamless integrations. Deploy anywhere, collect data securely.
          </HeroSubtitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PrimaryButton variant="contained" size="large" startIcon={<PlayCircle size={20} />}>
              Watch a demo
            </PrimaryButton>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <OutlinedButton variant="outlined" size="large">
                Get started for free
              </OutlinedButton>
            </Link>
          </Stack>
        </Box>
        <Box>
          <PreviewCard>
            <FormPreviewContainer>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <WindowDot dotColor="#FF5630" />
                  <WindowDot dotColor="#FFAB00" />
                  <WindowDot dotColor="#36B37E" />
                </Stack>
                <FormFieldActive>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Full Name *
                  </Typography>
                  <InputPlaceholder />
                </FormFieldActive>
                <FormField>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Email Address *
                  </Typography>
                  <InputPlaceholder />
                </FormField>
                <FormField>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Phone Number
                  </Typography>
                  <InputPlaceholder />
                </FormField>
              </Stack>
            </FormPreviewContainer>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <FeatureChip label="Drag & Drop" size="small" />
              <FeatureChip label="AI Powered" size="small" />
              <InfoChip label="Multi-Step" size="small" />
            </Stack>
          </PreviewCard>
        </Box>
      </HeroGrid>
    </HeroWrapper>
  );
}
