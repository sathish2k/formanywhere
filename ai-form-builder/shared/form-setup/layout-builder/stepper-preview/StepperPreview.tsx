/**
 * Stepper Preview Component
 * Visual preview of stepper styles
 */

'use client';

import { Box, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepperPreviewProps {
  stepperStyle: 'dots' | 'numbers' | 'progress' | 'arrows';
  totalPages: number;
}

export function StepperPreview({ stepperStyle, totalPages }: StepperPreviewProps) {
  const pages = totalPages || 3;

  return (
    <PreviewContainer>
      {stepperStyle === 'dots' &&
        Array.from({ length: pages }).map((_, i) => <StepDot key={i} isActive={i === 0} />)}
      {stepperStyle === 'numbers' &&
        Array.from({ length: pages }).map((_, i) => (
          <StepNumber key={i} label={i + 1} size="small" isActive={i === 0} />
        ))}
      {stepperStyle === 'progress' && (
        <ProgressTrack>
          <ProgressFill style={{ width: `${(1 / pages) * 100}%` }} />
        </ProgressTrack>
      )}
      {stepperStyle === 'arrows' && (
        <ArrowsContainer>
          <ArrowLeft size={16} />
          <Typography variant="body2" fontWeight={600}>
            Step 1 of {pages}
          </Typography>
          <ArrowRight size={16} />
        </ArrowsContainer>
      )}
    </PreviewContainer>
  );
}

// Styled Components
const PreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StepDot = styled(Box)<{ isActive: boolean }>(({ theme, isActive }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.action.disabled,
}));

const StepNumber = styled(Chip)<{ isActive: boolean }>(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.action.disabled,
  color: isActive ? theme.palette.common.white : theme.palette.text.secondary,
  fontWeight: 700,
  minWidth: 32,
  height: 32,
}));

const ProgressTrack = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 8,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.action.disabled,
  position: 'relative',
  overflow: 'hidden',
}));

const ProgressFill = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.primary.main,
  transition: 'width 0.3s',
}));

const ArrowsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
