/**
 * Divider Properties
 */

'use client';

import { Divider as MuiDivider, Stack, Typography } from '@mui/material';

export function DividerProperties() {
  return (
    <Stack spacing={3}>
      <MuiDivider />
      <Typography variant="body2" color="text.secondary">
        No editable properties for this element
      </Typography>
    </Stack>
  );
}
