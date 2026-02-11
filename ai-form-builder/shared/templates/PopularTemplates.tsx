/**
 * Popular Templates Section
 * Shows popular templates in a grid
 */

'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Star } from 'lucide-react';
import { type Template, TemplateCard } from './TemplateCard';

interface PopularTemplatesProps {
  templates: Template[];
}

export function PopularTemplates({ templates }: PopularTemplatesProps) {
  if (templates.length === 0) return null;

  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <HeaderStack direction="row" alignItems="center" spacing={1}>
          <StarIcon size={24} />
          <Typography variant="h4">Popular Templates</Typography>
        </HeaderStack>

        <TemplatesGrid>
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} variant="compact" />
          ))}
        </TemplatesGrid>
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const HeaderStack = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StarIcon = styled(Star)(({ theme }) => ({
  color: theme.palette.primary.main,
  fill: theme.palette.primary.main,
}));

const TemplatesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));
