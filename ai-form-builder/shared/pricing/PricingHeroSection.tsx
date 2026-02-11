/**
 * Pricing Hero Section Component
 */

'use client';

import { Box, Chip, Container, Stack, Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PricingHeroSectionProps {
  isAnnual: boolean;
  onToggle: (value: boolean) => void;
}

export function PricingHeroSection({ isAnnual, onToggle }: PricingHeroSectionProps) {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <GradientChip label="Pricing Plans" />
        <Typography variant="h2" sx={{ mb: 2, color: 'text.primary' }}>
          Simple, transparent pricing
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Choose the perfect plan for your needs. Always flexible to scale up or down.
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ mb: 6 }}
        >
          <Typography
            variant="body1"
            color={!isAnnual ? 'primary' : 'text.secondary'}
            sx={{ fontWeight: !isAnnual ? 600 : 400 }}
          >
            Monthly
          </Typography>
          <Switch checked={isAnnual} onChange={(e) => onToggle(e.target.checked)} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="body1"
              color={isAnnual ? 'primary' : 'text.secondary'}
              sx={{ fontWeight: isAnnual ? 600 : 400 }}
            >
              Annual
            </Typography>
            <SaveChip label="Save 17%" size="small" />
          </Stack>
        </Stack>
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(2),
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(10),
  },
}));

const GradientChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  fontWeight: 600,
}));

const SaveChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  height: 24,
}));
