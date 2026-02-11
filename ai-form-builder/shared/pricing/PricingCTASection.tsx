/**
 * Pricing CTA Section Component
 */

'use client';

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export function PricingCTASection() {
  return (
    <CTACard>
      <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
        Still have questions?
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
        Our team is here to help. Get in touch and we'll respond within 24 hours.
      </Typography>
      <CTAButton variant="contained" size="large">
        Contact Sales
      </CTAButton>
    </CTACard>
  );
}

// Styled Components
const CTACard = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(6),
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  textAlign: 'center',
}));

const CTAButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));
