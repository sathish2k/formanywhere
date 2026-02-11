/**
 * Integrations Section Component
 * 8-integration logo cards
 */

'use client';

import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight } from 'lucide-react';

// Styled Components
const SectionWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

const SectionChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 800,
  marginBottom: theme.spacing(2),
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
}));

const IntegrationsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const IntegrationCard = styled(Paper)<{ brandColor: string }>(({ theme, brandColor }) => ({
  padding: theme.spacing(4),
  height: 180,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: theme.spacing(3),
  border: '2px solid rgba(145, 158, 171, 0.12)',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: brandColor,
    transform: 'translateY(-8px)',
    boxShadow: `0px 0px 0px 4px ${brandColor}20, 0px 24px 48px -8px rgba(145, 158, 171, 0.24)`,
  },
}));

const DecorativeCircle = styled(Box)<{ brandColor: string }>(({ brandColor }) => ({
  position: 'absolute',
  top: -20,
  right: -20,
  width: 100,
  height: 100,
  borderRadius: '50%',
  backgroundColor: `${brandColor}08`,
  transition: 'all 0.3s',
}));

const LogoBox = styled(Box)<{ brandColor: string }>(({ theme, brandColor }) => ({
  width: 72,
  height: 72,
  borderRadius: theme.spacing(2),
  backgroundColor: `${brandColor}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s',
}));

const LogoText = styled(Typography)<{ brandColor: string }>(({ brandColor }) => ({
  fontSize: '2rem',
  fontWeight: 800,
  color: brandColor,
  transition: 'all 0.3s',
}));

const IntegrationName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  zIndex: 1,
}));

const IntegrationDesc = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  position: 'relative',
  zIndex: 1,
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderWidth: 2,
  borderColor: 'rgba(145, 158, 171, 0.32)',
  fontWeight: 700,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  '&:hover': {
    borderWidth: 2,
  },
}));

interface Integration {
  name: string;
  desc: string;
  bgcolor: string;
  logo: string;
}

const integrations: Integration[] = [
  { name: 'Slack', desc: 'Team Communication', bgcolor: '#4A154B', logo: '⚡' },
  { name: 'Google Workspace', desc: 'Productivity Suite', bgcolor: '#4285F4', logo: 'G' },
  { name: 'Salesforce', desc: 'CRM Platform', bgcolor: '#00A1E0', logo: '☁️' },
  { name: 'Microsoft Teams', desc: 'Collaboration Hub', bgcolor: '#5B5FC7', logo: 'T' },
  { name: 'Stripe', desc: 'Payment Processing', bgcolor: '#635BFF', logo: 'S' },
  { name: 'HubSpot', desc: 'Marketing Automation', bgcolor: '#FF7A59', logo: 'H' },
  { name: 'Zapier', desc: 'Workflow Automation', bgcolor: '#FF4F00', logo: '⚙️' },
  { name: 'Notion', desc: 'Workspace', bgcolor: '#000000', logo: 'N' },
];

export function IntegrationsSection() {
  return (
    <SectionWrapper maxWidth="xl">
      <SectionHeader>
        <SectionChip label="INTEGRATIONS" />
        <SectionTitle variant="h2">Connect With Your Favorite Tools</SectionTitle>
        <SectionSubtitle variant="h6">
          Seamless integrations with industry-leading platforms
        </SectionSubtitle>
      </SectionHeader>

      <IntegrationsGrid>
        {integrations.map((integration, index) => (
          <IntegrationCard key={index} elevation={0} brandColor={integration.bgcolor}>
            <DecorativeCircle brandColor={integration.bgcolor} />
            <LogoBox brandColor={integration.bgcolor}>
              <LogoText brandColor={integration.bgcolor}>{integration.logo}</LogoText>
            </LogoBox>
            <IntegrationName variant="h6">{integration.name}</IntegrationName>
            <IntegrationDesc variant="caption">{integration.desc}</IntegrationDesc>
          </IntegrationCard>
        ))}
      </IntegrationsGrid>

      <Box sx={{ textAlign: 'center' }}>
        <FooterText variant="body2">
          Plus 100+ more integrations including Airtable, Mailchimp, PayPal, Zoom, and many others
        </FooterText>
        <ViewAllButton variant="outlined" endIcon={<ArrowRight size={18} />}>
          View All Integrations
        </ViewAllButton>
      </Box>
    </SectionWrapper>
  );
}
