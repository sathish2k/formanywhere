/**
 * Properties Panel
 * Right-side panel for editing selected element properties
 */

'use client';
import type { PageData } from '@/components/form-setup/form-setup.configuration';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { X } from 'lucide-react';
import { ButtonProperties } from '../elements/button/Button.properties';
import { ColumnProperties } from '../elements/column/Column.properties';
import type { LayoutElement } from '../elements/element.types';
import { HeadingProperties } from '../elements/heading/Heading.properties';
import { StepperProperties } from '../elements/stepper/Stepper.properties';

interface PropertiesPanelProps {
  selectedElement: LayoutElement | null;
  onUpdateElement: (updates: Partial<LayoutElement>) => void;
  onCloseElement: () => void;
  // Form control for layout settings
  control?: any;
  watch?: any;
  errors?: any;
  pages?: PageData[];
}

export function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onCloseElement,
  control,
  watch,
  errors,
  pages = [],
}: PropertiesPanelProps) {
  const renderProperties = () => {
    if (!selectedElement) {
      return (
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', lineHeight: 1.6 }}
            >
              Drag and drop layout elements from the left sidebar to build your header and footer
              sections.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', lineHeight: 1.6, fontWeight: 600 }}
            >
              💡 Tip: Select an element to edit its properties.
            </Typography>
          </Box>
        </Stack>
      );
    }

    switch (selectedElement.type) {
      case 'nextButton':
      case 'backButton':
      case 'nextArrow':
      case 'backArrow':
        return <ButtonProperties element={selectedElement} onUpdate={onUpdateElement} />;
      case 'heading':
        return <HeadingProperties element={selectedElement} onUpdate={onUpdateElement} />;
      case 'stepper':
        return (
          <StepperProperties element={selectedElement} onUpdate={onUpdateElement} pages={pages} />
        );
      case 'twoColumn':
      case 'threeColumn':
        return <ColumnProperties element={selectedElement} onUpdate={onUpdateElement} />;
      case 'progressBar':
      case 'breadcrumb':
      case 'pageIndicator':
        return (
          <Typography variant="body2" color="text.secondary">
            No editable properties for this element
          </Typography>
        );
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unknown element type
          </Typography>
        );
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {selectedElement ? 'Element Properties' : 'Layout Properties'}
          </Typography>
          {selectedElement && (
            <IconButton size="small" onClick={onCloseElement}>
              <X size={18} />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />
      </PanelHeader>

      <PanelContent>{renderProperties()}</PanelContent>
    </PanelContainer>
  );
}

// Styled Components
const PanelContainer = styled(Box)(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  borderLeft: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
  boxShadow: '-2px 0 8px rgba(145, 158, 171, 0.04)',
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const PanelContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3, 3),
}));
