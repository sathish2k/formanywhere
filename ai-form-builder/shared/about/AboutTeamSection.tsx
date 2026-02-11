/**
 * About Team Section Component
 */

'use client';

import type { TeamMember } from '@/components/about/about.configuration';
import { Avatar, Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AboutTeamSectionProps {
  team: TeamMember[];
}

export function AboutTeamSection({ team }: AboutTeamSectionProps) {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <HeaderWrapper>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We're a diverse team of builders, designers, and problem-solvers united by our passion
            for creating exceptional products.
          </Typography>
        </HeaderWrapper>

        <TeamGrid>
          {team.map((member) => (
            <TeamCard key={member.name}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <MemberAvatar sx={{ bgcolor: member.color }}>{member.avatar}</MemberAvatar>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {member.bio}
                </Typography>
              </CardContent>
            </TeamCard>
          ))}
        </TeamGrid>

        <CTAWrapper>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We're always looking for talented people to join our team
          </Typography>
          <Button variant="outlined" size="large">
            View Open Positions
          </Button>
        </CTAWrapper>
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

const HeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: 48,
});

const TeamGrid = styled(Box)(({ theme }) => ({
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

const TeamCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
  },
}));

const MemberAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: 16,
  fontSize: '1.5rem',
  fontWeight: 700,
});

const CTAWrapper = styled(Box)({
  marginTop: 48,
  textAlign: 'center',
});
