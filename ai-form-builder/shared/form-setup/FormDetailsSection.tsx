/**
 * Form Details Section
 * Form name and description inputs
 */

'use client';

import { Box, Stack, TextField, Typography } from '@mui/material';

interface FormDetailsSectionProps {
  formName: string;
  onFormNameChange: (name: string) => void;
  formDescription: string;
  onFormDescriptionChange: (description: string) => void;
}

export function FormDetailsSection({
  formName,
  onFormNameChange,
  formDescription,
  onFormDescriptionChange,
}: FormDetailsSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Form Details
      </Typography>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Form Name{' '}
            <Typography component="span" color="error">
              *
            </Typography>
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter form name"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem', fontWeight: 600 } }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Form Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Describe what this form is about..."
            value={formDescription}
            onChange={(e) => onFormDescriptionChange(e.target.value)}
          />
        </Box>
      </Stack>
    </Box>
  );
}
