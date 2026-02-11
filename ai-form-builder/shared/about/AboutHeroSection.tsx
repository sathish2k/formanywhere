/**
 * About Hero Section Component
 */

'use client';

import type { Stat } from '@/components/about/about.configuration';
import { Box, Button, Chip, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

interface AboutHeroSectionProps {
  stats: Stat[];
}

export function AboutHeroSection({ stats }: AboutHeroSectionProps) {
  return (
    <HeroWrapper>
      <DecorativeCircle sx={{ top: -100, right: -100, width: 400, height: 400 }} />
      <DecorativeCircle sx={{ bottom: -150, left: -150, width: 500, height: 500 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ContentWrapper>
          <StyledChip label="About Us" />
          <Typography variant="h2" sx={{ mb: 3 }}>
            Building the future of intelligent forms
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}
          >
            We're on a mission to transform how businesses collect, manage, and act on data through
            AI-powered form solutions that are beautiful, powerful, and incredibly easy to use.
          </Typography>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <CTAButton variant="contained" size="large">
              Get Started Free
            </CTAButton>
          </Link>
        </ContentWrapper>

        <StatsGrid>
          {stats.map((stat) => (
            <StatItem key={stat.label}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {stat.label}
              </Typography>
            </StatItem>
          ))}
        </StatsGrid>
      </Container>
    </HeroWrapper>
  );
}

// Styled Components
const HeroWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const DecorativeCircle = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

const ContentWrapper = styled(Box)({
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto',
});

const StyledChip = styled(Chip)({
  marginBottom: 24,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  fontWeight: 600,
});

const CTAButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const StatItem = styled(Box)({
  textAlign: 'center',
});
