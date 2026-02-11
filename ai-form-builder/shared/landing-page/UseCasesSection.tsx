/**
 * Use Cases Section Component
 * 6-industry use case cards
 */

'use client';

import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Building2,
  FileText,
  Globe,
  Lightbulb,
  type LucideIcon,
  TrendingUp,
  Users,
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
}));

const UseCasesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const UseCaseCard = styled(Paper)<{ hoverColor: string }>(({ theme, hoverColor }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(145, 158, 171, 0.16)',
  transition: 'all 0.3s',
  '&:hover': {
    borderColor: hoverColor,
    boxShadow: `0px 0px 0px 2px ${hoverColor}20`,
  },
}));

const UseCaseIconBox = styled(Box)<{ iconColor: string }>(({ theme, iconColor }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1.5),
  backgroundColor: `${iconColor}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const UseCaseTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

const UseCaseDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

interface UseCase {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

const useCases: UseCase[] = [
  {
    icon: Building2,
    title: 'Enterprise',
    desc: 'Employee onboarding, internal surveys, compliance forms',
    color: '#5B5FED',
  },
  {
    icon: Users,
    title: 'Healthcare',
    desc: 'Patient intake, appointment scheduling, health assessments',
    color: '#00B8D9',
  },
  {
    icon: TrendingUp,
    title: 'Marketing',
    desc: 'Lead generation, customer feedback, event registration',
    color: '#22C55E',
  },
  {
    icon: FileText,
    title: 'Education',
    desc: 'Student applications, course enrollment, assessments',
    color: '#FFAB00',
  },
  {
    icon: Globe,
    title: 'Government',
    desc: 'Public services, citizen feedback, permit applications',
    color: '#5B5FED',
  },
  {
    icon: Lightbulb,
    title: 'Non-Profit',
    desc: 'Volunteer registration, donation forms, grant applications',
    color: '#FF5630',
  },
];

export function UseCasesSection() {
  return (
    <SectionWrapper>
      <Container maxWidth="xl">
        <SectionHeader>
          <SectionChip label="USE CASES" />
          <SectionTitle variant="h2">Built for Every Industry</SectionTitle>
          <SectionSubtitle variant="h6">
            Trusted solutions for diverse business needs
          </SectionSubtitle>
        </SectionHeader>

        <UseCasesGrid>
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} elevation={0} hoverColor={useCase.color}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <UseCaseIconBox iconColor={useCase.color}>
                  <useCase.icon size={20} color={useCase.color} strokeWidth={2} />
                </UseCaseIconBox>
                <Box>
                  <UseCaseTitle variant="h6">{useCase.title}</UseCaseTitle>
                  <UseCaseDescription variant="body2">{useCase.desc}</UseCaseDescription>
                </Box>
              </Stack>
            </UseCaseCard>
          ))}
        </UseCasesGrid>
      </Container>
    </SectionWrapper>
  );
}
