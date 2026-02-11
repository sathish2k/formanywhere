/**
 * Pricing FAQ Section Component
 */

'use client';

import type { FAQ } from '@/components/pricing/pricing.configuration';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PricingFAQSectionProps {
  faqs: FAQ[];
}

export function PricingFAQSection({ faqs }: PricingFAQSectionProps) {
  return (
    <SectionWrapper>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Frequently Asked Questions
      </Typography>
      <Stack spacing={3}>
        {faqs.map((faq) => (
          <FAQCard key={faq.q}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {faq.q}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {faq.a}
            </Typography>
          </FAQCard>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  textAlign: 'left',
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const FAQCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.divider,
}));
