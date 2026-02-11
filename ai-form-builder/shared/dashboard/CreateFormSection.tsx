/**
 * Create Form Section Component
 * 4 cards for creating new forms
 */

'use client';

import {
  type CreateFormOption,
  createFormOptions,
} from '@/components/dashboard/dashboard.configuration';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Download, Plus, Sparkles } from 'lucide-react';

interface CreateFormSectionProps {
  onSelectOption: (optionId: string) => void;
}

export function CreateFormSection({ onSelectOption }: CreateFormSectionProps) {
  const theme = useTheme();

  const getCardStyles = (variant: CreateFormOption['variant']) => {
    switch (variant) {
      case 'dashed':
        return {
          border: 2,
          borderColor: 'grey.300',
          borderStyle: 'dashed',
          bgcolor: 'transparent',
          boxShadow: 'none',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: `${theme.palette.primary.main}08`,
          },
        };
      case 'gradient':
        return {
          border: 1,
          borderColor: 'transparent',
          boxShadow:
            '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
          '&:hover': {
            boxShadow: `0px 0px 2px 0px ${theme.palette.primary.main}33, 0px 16px 32px -4px ${theme.palette.primary.main}40`,
          },
        };
      case 'outlined':
        return {
          border: 1,
          borderColor: 'transparent',
          boxShadow:
            '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
          '&:hover': {
            boxShadow: `0px 0px 2px 0px ${theme.palette.primary.main}33, 0px 16px 32px -4px ${theme.palette.primary.main}40`,
          },
        };
      default:
        return {};
    }
  };

  const renderIcon = (option: CreateFormOption) => {
    if (option.variant === 'dashed') {
      return (
        <IconBox sx={{ bgcolor: 'transparent' }}>
          <Plus size={48} color={theme.palette.primary.main} strokeWidth={2.5} />
        </IconBox>
      );
    }

    if (option.variant === 'gradient') {
      return (
        <GradientIconBox>
          {option.id === 'template' ? (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'white',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 32,
                  height: 4,
                  borderRadius: 1,
                  bgcolor: 'white',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 16,
                  right: 16,
                  height: 3,
                  borderRadius: 1,
                  bgcolor: 'white',
                }}
              />
            </>
          ) : (
            <Download size={28} color="white" strokeWidth={2.5} />
          )}
        </GradientIconBox>
      );
    }

    return (
      <OutlinedIconBox>
        <Sparkles size={36} color={theme.palette.primary.main} strokeWidth={2.5} />
      </OutlinedIconBox>
    );
  };

  return (
    <SectionWrapper>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Create Form
      </Typography>
      <CardsGrid>
        {createFormOptions.map((option) => (
          <StyledPaper
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            sx={getCardStyles(option.variant)}
          >
            {renderIcon(option)}
            <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.primary' }}>
              {option.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          </StyledPaper>
        ))}
      </CardsGrid>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
}));

const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const GradientIconBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  position: 'relative',
  boxShadow: `0px 8px 16px 0px ${alpha(theme.palette.primary.main, 0.24)}`,
}));

const OutlinedIconBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.spacing(2),
  backgroundColor: 'white',
  border: `3px solid ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));
