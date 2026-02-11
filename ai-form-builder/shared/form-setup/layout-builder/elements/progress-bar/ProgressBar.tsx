/**
 * ProgressBar Element Component
 * Linear progress indicator with styled components
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface ProgressBarProps {
  element: LayoutElement;
  totalPages: number;
  isSmall?: boolean;
}

export function ProgressBar({ element, totalPages, isSmall }: ProgressBarProps) {
  const pages = totalPages || 3;
  const progress = (1 / pages) * 100;

  if (isSmall) {
    return (
      <SmallProgressContainer>
        <ProgressTrack>
          <ProgressFill style={{ width: '33%' }} />
        </ProgressTrack>
      </SmallProgressContainer>
    );
  }

  return (
    <ProgressContainer>
      <ProgressTrack large>
        <ProgressFill style={{ width: `${progress}%` }} />
      </ProgressTrack>
      <ProgressLabel>Step 1 of {pages}</ProgressLabel>
    </ProgressContainer>
  );
}

// Styled Components
const SmallProgressContainer = styled(Box)({
  width: '100%',
});

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
}));

const ProgressTrack = styled(Box)<{ large?: boolean }>(({ theme, large }) => ({
  height: large ? 8 : 6,
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

const ProgressLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  display: 'block',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
}));
