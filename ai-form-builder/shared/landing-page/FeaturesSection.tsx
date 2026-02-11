/**
 * Features Section Component
 * 6-feature grid with icons
 */

'use client';

import { Box, Chip, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  BarChart3,
  Code,
  Database,
  type LucideIcon,
  Sparkles,
  Wand2,
  Workflow,
} from 'lucide-react';

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

const SectionChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 800,
  marginBottom: theme.spacing(2),
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
  maxWidth: 600,
  margin: '0 auto',
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(145, 158, 171, 0.16)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow:
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
  },
}));

const FeatureIconBox = styled(Box)<{ iconColor: string }>(({ theme, iconColor }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(2),
  backgroundColor: `${iconColor}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: theme.spacing(1.5),
}));

const FeatureDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
}));

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: Sparkles,
      title: 'AI-Powered Form Generation',
      desc: 'Describe your requirements in plain English and let AI build your form instantly. Save hours of manual work.',
      color: '#5B5FED',
    },
    {
      icon: Workflow,
      title: 'Multi-Step Workflows',
      desc: 'Create complex multi-step forms with branching logic, conditional fields, and dynamic validation rules.',
      color: '#00B8D9',
    },
    {
      icon: Wand2,
      title: 'Visual Drag & Drop Builder',
      desc: 'Intuitive no-code builder with unlimited nesting, custom layouts, and real-time preview.',
      color: '#5B5FED',
    },
    {
      icon: Database,
      title: 'Secure Data Collection',
      desc: 'Enterprise-grade security with encryption at rest and in transit. GDPR, HIPAA, and SOC 2 compliant.',
      color: '#22C55E',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      desc: 'Real-time dashboards, conversion tracking, funnel analysis, and custom reports for data-driven decisions.',
      color: '#FFAB00',
    },
    {
      icon: Code,
      title: 'Developer-Friendly APIs',
      desc: 'RESTful APIs, webhooks, SDKs, and extensive documentation for custom integrations.',
      color: '#FF5630',
    },
  ];

  return (
    <SectionWrapper id="features">
      <Container maxWidth="xl">
        <SectionHeader>
          <SectionChip label="FEATURES" />
          <SectionTitle variant="h2">Everything You Need to Build Forms</SectionTitle>
          <SectionSubtitle variant="h6">
            Powerful features designed for enterprises, simple enough for everyone
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} elevation={0}>
              <FeatureIconBox iconColor={feature.color}>
                <feature.icon size={28} color={feature.color} strokeWidth={2} />
              </FeatureIconBox>
              <FeatureTitle variant="h6">{feature.title}</FeatureTitle>
              <FeatureDescription variant="body2">{feature.desc}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </SectionWrapper>
  );
}
