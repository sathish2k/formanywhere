/**
 * Save Status Indicator
 * Shows current save state with visual feedback
 */

'use client';

import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AlertCircle, Check, Clock } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  error?: string;
}

export function SaveStatusIndicator({ status, lastSaved, error }: SaveStatusIndicatorProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <CircularProgress size={16} />,
          text: 'Saving...',
          color: '#919EAB',
        };
      case 'saved':
        return {
          icon: <Check size={16} />,
          text: lastSaved ? `Saved ${getRelativeTime(lastSaved)}` : 'Saved',
          color: '#22C55E',
        };
      case 'error':
        return {
          icon: <AlertCircle size={16} />,
          text: 'Save failed',
          color: '#EF4444',
        };
      default:
        return {
          icon: <Clock size={16} />,
          text: 'Unsaved changes',
          color: '#F59E0B',
        };
    }
  };

  const content = getStatusContent();

  const indicator = (
    <StatusContainer>
      <IconWrapper color={content.color}>{content.icon}</IconWrapper>
      <StatusText color={content.color}>{content.text}</StatusText>
    </StatusContainer>
  );

  if (error) {
    return (
      <Tooltip title={error} arrow>
        {indicator}
      </Tooltip>
    );
  }

  return indicator;
}

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const StatusContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  color,
}));

const StatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color,
}));
