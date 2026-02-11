/**
 * About Story Section Component
 */

'use client';

import type { Milestone } from '@/components/about/about.configuration';
import { Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AboutStorySectionProps {
  milestones: Milestone[];
}

export function AboutStorySection({ milestones }: AboutStorySectionProps) {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <ContentGrid>
          <Box>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              FormBuilder AI was founded in 2022 by a team of engineers and designers who were
              frustrated with the complexity of existing form builders. We believed there had to be
              a better way.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              We set out to create a platform that combines the simplicity of drag-and-drop with the
              power of AI, enabling anyone to build sophisticated forms in minutes instead of hours.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Today, thousands of teams worldwide trust FormBuilder AI to power their most critical
              data collection workflows. From startups to Fortune 500 companies, we're helping
              organizations collect better data and make smarter decisions.
            </Typography>
          </Box>
          <Box>
            <MilestonesCard>
              <Stack spacing={3}>
                {milestones.map((milestone, index) => (
                  <Stack key={index} direction="row" spacing={2}>
                    <YearBadge>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                        {milestone.year}
                      </Typography>
                    </YearBadge>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {milestone.event}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {milestone.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </MilestonesCard>
          </Box>
        </ContentGrid>
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const ContentGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(6),
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

const MilestonesCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
}));

const YearBadge = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: theme.spacing(1),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));
