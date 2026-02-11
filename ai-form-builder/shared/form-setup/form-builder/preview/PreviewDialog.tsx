/**
 * Preview Dialog
 * Full-screen modal for previewing the form with device view toggles
 */

'use client';

import { Box, Dialog, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { useState } from 'react';
import type { DroppedElement, PageData } from '../form-builder.configuration';
import { FormRenderer } from './FormRenderer';

type ViewMode = 'desktop' | 'mobile' | 'tablet';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  pages: PageData[];
  pageElements: Record<string, DroppedElement[]>;
  formTitle: string;
}

export function PreviewDialog({
  open,
  onClose,
  pages,
  pageElements,
  formTitle,
}: PreviewDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: '#F5F5F7',
        },
      }}
    >
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
          <PreviewLabel>Preview: {formTitle}</PreviewLabel>
        </Box>

        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange} size="small">
          <ToggleButton value="desktop">
            <Monitor size={18} style={{ marginRight: 8 }} />
            Desktop
          </ToggleButton>
          <ToggleButton value="tablet">
            <Tablet size={18} style={{ marginRight: 8 }} />
            Tablet
          </ToggleButton>
          <ToggleButton value="mobile">
            <Smartphone size={18} style={{ marginRight: 8 }} />
            Mobile
          </ToggleButton>
        </ToggleButtonGroup>
      </TopBar>

      <PreviewContainer>
        <PreviewFrame viewMode={viewMode}>
          <FormRenderer pages={pages} pageElements={pageElements} formTitle={formTitle} />
        </PreviewFrame>
      </PreviewContainer>
    </Dialog>
  );
}

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#fff',
}));

const PreviewLabel = styled('div')(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const PreviewContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  overflow: 'auto',
});

const PreviewFrame = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'viewMode',
})<{ viewMode: ViewMode }>(({ viewMode }) => {
  const widths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '480px',
  };

  return {
    width: widths[viewMode],
    maxWidth: '100%',
    minHeight: '600px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
  };
});
