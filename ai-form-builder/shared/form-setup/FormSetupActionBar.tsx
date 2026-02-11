/**
 * Form Setup Action Bar
 * Bottom bar with page count and submit button
 */

'use client';

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight } from 'lucide-react';

interface FormSetupActionBarProps {
  pageCount: number;
  layoutType: 'classic' | 'card';
  formName: string;
  onSubmit: () => void;
}

export function FormSetupActionBar({
  pageCount,
  layoutType,
  formName,
  onSubmit,
}: FormSetupActionBarProps) {
  return (
    <ActionBarWrapper>
      <Typography variant="body2" color="text.secondary">
        {pageCount} {pageCount === 1 ? 'page' : 'pages'} •{' '}
        {layoutType === 'card' ? 'Card' : 'Classic'} layout
      </Typography>
      <Button
        variant="contained"
        size="large"
        endIcon={<ArrowRight size={20} />}
        onClick={onSubmit}
        disabled={!formName || pageCount === 0}
        sx={{ px: 4, py: 1.5 }}
      >
        Start Building
      </Button>
    </ActionBarWrapper>
  );
}

// Styled Components
const ActionBarWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
