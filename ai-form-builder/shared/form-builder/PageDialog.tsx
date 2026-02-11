/**
 * Page Dialog
 * Dialog for adding/editing pages in form setup
 */

'use client';

import type { PageData } from '@/components/form-builder/form-builder.configuration';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface PageDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  editingPage: PageData | null;
  pageName: string;
  onPageNameChange: (name: string) => void;
  pageDescription: string;
  onPageDescriptionChange: (description: string) => void;
}

export function PageDialog({
  open,
  onClose,
  onSave,
  editingPage,
  pageName,
  onPageNameChange,
  pageDescription,
  onPageDescriptionChange,
}: PageDialogProps) {
  const handleSave = () => {
    onSave(pageName, pageDescription);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Page Name{' '}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <TextField
              fullWidth
              autoFocus
              placeholder="e.g., Personal Information"
              value={pageName}
              onChange={(e) => onPageNameChange(e.target.value)}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Page Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of what this page contains..."
              value={pageDescription}
              onChange={(e) => onPageDescriptionChange(e.target.value)}
            />
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!pageName}>
          {editingPage ? 'Update Page' : 'Add Page'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
