/**
 * File Upload Component
 */

'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Upload } from 'lucide-react';
import type { DroppedElement } from '../../form-builder.configuration';

interface FileUploadProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function FileUpload({ element, isSelected, onClick }: FileUploadProps) {
  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <UploadBox>
        <Upload size={32} style={{ color: '#919EAB' }} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          {element.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {element.placeholder || 'Click or drag to upload'}
        </Typography>
        {element.accept && (
          <Typography variant="caption" color="text.secondary">
            Accepted: {element.accept}
          </Typography>
        )}
      </UploadBox>
    </ElementWrapper>
  );
}

const ElementWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isSelected ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.action.hover,
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
}));
