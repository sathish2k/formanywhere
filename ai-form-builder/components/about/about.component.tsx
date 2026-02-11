/**
 * About Page Component
 * Company information, team, and values
 */

'use client';

import {
  AboutCTASection,
  AboutHeroSection,
  AboutStorySection,
  AboutTeamSection,
  AboutValuesSection,
} from '@/shared/about';
import { defaultFooterProps, defaultFooterSections, defaultNavLinks } from '@/shared/config';
import { Footer, Header } from '@/shared/ui';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { aboutMilestones, aboutStats, aboutTeam, aboutValues } from './about.configuration';

export function About() {
  return (
    <PageWrapper>
      <Header navLinks={defaultNavLinks} signInLabel="Sign in" getStartedLabel="Try for Free" />
      <AboutHeroSection stats={aboutStats} />
      <AboutStorySection milestones={aboutMilestones} />
      <AboutValuesSection values={aboutValues} />
      <AboutTeamSection team={aboutTeam} />
      <AboutCTASection />
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
