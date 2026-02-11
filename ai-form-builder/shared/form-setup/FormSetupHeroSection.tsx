/**
 * Form Setup Hero Section
 * Header section with icon and title
 */

'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileText } from 'lucide-react';

export function FormSetupHeroSection() {
  return (
    <HeroWrapper>
      <HeroIcon>
        <FileText size={32} color="white" strokeWidth={2} />
      </HeroIcon>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
        Configure Your Form
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Set up your form details and organize it into pages
      </Typography>
    </HeroWrapper>
  );
}

// Styled Components
const HeroWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const HeroIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
}));
