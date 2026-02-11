/**
 * Home Page Component
 * Landing page using extracted section components
 */

'use client';

import { defaultFooterProps, defaultNavLinks, homeFooterSections } from '@/shared/config';
import {
  CTASection,
  DemoTeaser,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  IntegrationsSection,
  StatsSection,
  TestimonialsSection,
  UseCasesSection,
} from '@/shared/landing-page';
import { Footer, Header } from '@/shared/ui';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export function Home() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add onClick handler to Features link
  const navLinksWithHandlers = defaultNavLinks.map((link) =>
    link.label === 'Features' ? { ...link, onClick: scrollToFeatures } : link
  );

  return (
    <PageWrapper>
      <Header navLinks={navLinksWithHandlers} />
      <HeroSection />
      <DemoTeaser />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer
        tagline={defaultFooterProps.tagline}
        sections={homeFooterSections}
        copyright={defaultFooterProps.copyright}
      />
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[100],
}));
