/**
 * FormField Component
 * Styled text field with label and optional extra content
 */

'use client';

import { Box, Stack, TextField, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

interface FormFieldProps extends Omit<TextFieldProps, 'label'> {
  label: string;
  extra?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, extra, ...props },
  ref
) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {label}
        </Typography>
        {extra}
      </Stack>
      <TextField
        fullWidth
        inputRef={ref}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
          },
        }}
        {...props}
      />
    </Box>
  );
});
