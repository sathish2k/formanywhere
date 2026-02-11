/**
 * How It Works Section Component
 * 3-step process with highlighted middle card
 */

'use client';

import { Box, Chip, Container, Paper, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, type LucideIcon, Palette, Rocket, Settings } from 'lucide-react';

// Styled Components
const SectionWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(10),
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
}));

const StepsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const StepCard = styled(Paper)<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  padding: theme.spacing(5),
  height: '100%',
  background: highlighted
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : theme.palette.background.paper,
  color: highlighted ? '#FFFFFF' : theme.palette.text.primary,
  borderRadius: theme.spacing(3),
  border: highlighted ? 'none' : '1px solid rgba(145, 158, 171, 0.16)',
  position: 'relative',
  overflow: 'hidden',
}));

const StepNumber = styled(Typography)<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  color: highlighted ? 'rgba(255, 255, 255, 0.5)' : theme.palette.grey[500],
  fontWeight: 800,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
}));

const StepIconBox = styled(Box)<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1.5),
  backgroundColor: highlighted ? 'rgba(255, 255, 255, 0.2)' : `${theme.palette.primary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const StepDescription = styled(Typography)<{ highlighted?: boolean }>(({ highlighted }) => ({
  color: highlighted ? 'rgba(255, 255, 255, 0.9)' : '#637381',
  lineHeight: 1.8,
  marginBottom: 24,
}));

const CheckItem = styled(Typography)<{ highlighted?: boolean }>(({ highlighted }) => ({
  color: highlighted ? 'rgba(255, 255, 255, 0.9)' : '#637381',
  fontWeight: 500,
}));

interface Step {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  items: string[];
}

const steps: Step[] = [
  {
    step: '01',
    title: 'Design Your Form',
    desc: 'Use our AI assistant or drag-and-drop builder to create your perfect form. Choose from templates or start from scratch.',
    icon: Palette,
    items: ['AI-powered generation', 'Pre-built templates', 'Custom branding'],
  },
  {
    step: '02',
    title: 'Configure & Customize',
    desc: 'Add logic, validations, integrations, and styling. Set up multi-step workflows with conditional branching.',
    icon: Settings,
    items: ['Conditional logic', 'Field validations', 'Third-party integrations'],
  },
  {
    step: '03',
    title: 'Deploy & Collect',
    desc: 'Share via link, embed on your website, or integrate with your app. Start collecting responses immediately.',
    icon: Rocket,
    items: ['Multiple deployment options', 'Real-time responses', 'Automated workflows'],
  },
];

export function HowItWorksSection() {
  const theme = useTheme();

  return (
    <SectionWrapper maxWidth="xl">
      <SectionHeader>
        <SectionChip label="HOW IT WORKS" />
        <SectionTitle variant="h2">Get Started in 3 Simple Steps</SectionTitle>
        <SectionSubtitle variant="h6">From idea to deployed form in minutes</SectionSubtitle>
      </SectionHeader>

      <StepsGrid>
        {steps.map((step, index) => {
          const isHighlighted = index === 1;
          return (
            <StepCard key={index} highlighted={isHighlighted} elevation={0}>
              <StepNumber highlighted={isHighlighted}>{step.step}</StepNumber>
              <StepIconBox highlighted={isHighlighted}>
                <step.icon
                  size={24}
                  color={isHighlighted ? 'white' : theme.palette.primary.main}
                  strokeWidth={2}
                />
              </StepIconBox>
              <StepTitle variant="h5">{step.title}</StepTitle>
              <StepDescription variant="body2" highlighted={isHighlighted}>
                {step.desc}
              </StepDescription>
              <Stack spacing={1.5}>
                {step.items.map((item, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    <Check size={18} color={isHighlighted ? 'white' : theme.palette.primary.main} />
                    <CheckItem variant="body2" highlighted={isHighlighted}>
                      {item}
                    </CheckItem>
                  </Stack>
                ))}
              </Stack>
            </StepCard>
          );
        })}
      </StepsGrid>
    </SectionWrapper>
  );
}
