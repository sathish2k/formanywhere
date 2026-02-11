/**
 * OrDivider Component
 * Divider with "or" text in the center
 */

'use client';

import { Divider, Typography } from '@mui/material';

interface OrDividerProps {
  text?: string;
}

export function OrDivider({ text = 'or' }: OrDividerProps) {
  return (
    <Divider sx={{ my: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
        {text}
      </Typography>
    </Divider>
  );
}
