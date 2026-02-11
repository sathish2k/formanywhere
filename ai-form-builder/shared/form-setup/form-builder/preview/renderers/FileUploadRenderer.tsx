/**
 * File Upload Renderer
 */

'use client';

import { Box, Button, FormHelperText, Typography } from '@mui/material';
import { Upload } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface FileUploadRendererProps {
  element: DroppedElement;
}

export function FileUploadRenderer({ element }: FileUploadRendererProps) {
  const { control } = useFormContext();
  const fieldName = element.fieldName || element.id;

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: element.required ? `${element.label} is required` : false,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
            {element.label}
            {element.required && <span style={{ color: '#d32f2f' }}> *</span>}
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<Upload size={18} />}
            sx={{ mb: 0.5 }}
          >
            Choose File{element.maxFiles && element.maxFiles > 1 ? 's' : ''}
            <input
              type="file"
              hidden
              accept={element.accept || '*/*'}
              multiple={element.maxFiles ? element.maxFiles > 1 : false}
              onChange={(e) => {
                const files = e.target.files;
                onChange(files);
              }}
            />
          </Button>
          {value && value.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {value.length} file(s) selected
            </Typography>
          )}
          {(error || element.helperText) && (
            <FormHelperText error={!!error}>
              {error ? error.message : element.helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
