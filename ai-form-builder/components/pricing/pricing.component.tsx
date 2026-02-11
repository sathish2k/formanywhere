/**
 * Pricing Page Component
 * Pricing plans with monthly/annual toggle
 */

'use client';

import { defaultFooterProps, defaultFooterSections, defaultNavLinks } from '@/shared/config';
import {
  PricingCTASection,
  PricingCard,
  PricingFAQSection,
  PricingHeroSection,
} from '@/shared/pricing';
import { Footer, Header } from '@/shared/ui';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { pricingFAQs, pricingPlans } from './pricing.configuration';

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <PageWrapper>
      <Header navLinks={defaultNavLinks} signInLabel="Sign in" getStartedLabel="Try for Free" />

      <PricingHeroSection isAnnual={isAnnual} onToggle={setIsAnnual} />

      <Container maxWidth="lg">
        <PlansGrid>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </PlansGrid>

        <PricingFAQSection faqs={pricingFAQs} />
        <PricingCTASection />
      </Container>

      <Footer
        tagline={defaultFooterProps.tagline}
        sections={defaultFooterSections}
        copyright={defaultFooterProps.copyright}
      />
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#FAFAFA',
});

const PlansGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));
