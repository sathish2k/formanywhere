/**
 * About Values Section Component
 */

'use client';

import type { ValueItem } from '@/components/about/about.configuration';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AboutValuesSectionProps {
  values: ValueItem[];
}

export function AboutValuesSection({ values }: AboutValuesSectionProps) {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <HeaderWrapper>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Our Values
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            These core principles guide everything we do, from product development to customer
            support.
          </Typography>
        </HeaderWrapper>

        <ValuesGrid>
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <ValueCard key={value.title}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <IconWrapper>
                    <Icon size={28} color="white" strokeWidth={2} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </ValueCard>
            );
          })}
        </ValuesGrid>
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

const HeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: 48,
});

const ValuesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const ValueCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(1),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));
