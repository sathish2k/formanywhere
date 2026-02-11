/**
 * Properties Panel
 * Right-side panel for editing selected form element properties
 */

'use client';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { X } from 'lucide-react';
import { CardProperties } from '../elements/card/Card.properties';
import { CheckboxProperties } from '../elements/checkbox';
import { DatePickerProperties } from '../elements/date-picker';
import { DividerProperties } from '../elements/divider';
import { FileUploadProperties } from '../elements/file-upload';
import { HeadingProperties } from '../elements/heading';
import { MatrixProperties } from '../elements/matrix';
import { MultiSelectProperties } from '../elements/multi-select';
import { NumberInputProperties } from '../elements/number-input';
import { PhoneInputProperties } from '../elements/phone-input';
import { RadioProperties } from '../elements/radio';
import { RatingProperties } from '../elements/rating';
import { SectionProperties } from '../elements/section';
import { SelectProperties } from '../elements/select';
import { SliderProperties } from '../elements/slider';
import { SpacerProperties } from '../elements/spacer/Spacer.properties';
import { TextBlockProperties } from '../elements/text-block/TextBlock.properties';
import { TextInputProperties } from '../elements/text-input';
import { TextareaProperties } from '../elements/textarea';
import { TimePickerProperties } from '../elements/time-picker';
import { UrlInputProperties } from '../elements/url-input';
import type { DroppedElement } from '../form-builder.configuration';

interface PropertiesPanelProps {
  selectedElement: DroppedElement | null;
  onUpdateElement: (updates: Partial<DroppedElement>) => void;
  onCloseElement: () => void;
}

export function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onCloseElement,
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
              Drag and drop form elements from the left sidebar to build your form.
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

    // Route to specific property component based on element type
    switch (selectedElement.type) {
      case 'text-input':
      case 'email-input':
        return <TextInputProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'number-input':
        return <NumberInputProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'select':
        return <SelectProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'textarea':
        return <TextareaProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'checkbox':
        return <CheckboxProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'radio':
        return <RadioProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'date-picker':
        return <DatePickerProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'file-upload':
        return <FileUploadProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'phone-input':
        return <PhoneInputProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'url-input':
        return <UrlInputProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'rating':
        return <RatingProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'slider':
        return <SliderProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'time-picker':
        return <TimePickerProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'multi-select':
        return <MultiSelectProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'matrix':
        return <MatrixProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'section':
        return <SectionProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'card':
        return <CardProperties element={selectedElement} onUpdate={onUpdateElement} />;


      case 'heading':
        return <HeadingProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'text-block':
        return <TextBlockProperties element={selectedElement} onUpdate={onUpdateElement} />;

      case 'divider':
        return <DividerProperties />;

      case 'spacer':
        return <SpacerProperties element={selectedElement} onUpdate={onUpdateElement} />;

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            No properties available for this element type
          </Typography>
        );
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {selectedElement ? 'Element Properties' : 'Form Properties'}
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
