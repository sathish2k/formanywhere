/**
 * Layout Selection Component
 * Step 1: Choose form layout (Classic or Card)
 * Uses LayoutOptionCard from shared/form-builder
 */

'use client';

import { DashboardAppBar } from '@/shared/dashboard';
import { LayoutOptionCard } from '@/shared/form-builder';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { type FormLayoutType, layoutOptions } from './form-builder.configuration';

export function LayoutSelection() {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSelectLayout = (layout: FormLayoutType) => {
    router.push(`/form-builder/setup?layout=${layout}`);
  };

  return (
    <PageWrapper>
      <DashboardAppBar userName={userName} userEmail={userEmail} />

      <ContentWrapper>
        <Container maxWidth="lg">
          <BackButton startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
            Back
          </BackButton>

          <HeaderSection>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
              Choose Form Layout
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              Select a layout according to your needs
            </Typography>
          </HeaderSection>

          <LayoutGrid>
            {layoutOptions.map((option) => (
              <LayoutOptionCard
                key={option.id}
                type={option.id}
                title={option.title}
                description={option.description}
                onClick={() => handleSelectLayout(option.id)}
              />
            ))}
          </LayoutGrid>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const ContentWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 64,
  paddingBottom: 64,
  minHeight: 'calc(100vh - 64px)',
});

const BackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

const LayoutGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  maxWidth: 1000,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));
