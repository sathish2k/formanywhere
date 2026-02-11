/**
 * Drop Zone Component
 * Header/Footer drop zone for layout elements
 */

'use client';

import { Box, Chip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { MousePointer2 } from 'lucide-react';
import type { LayoutElement } from '../elements';

interface DropZoneProps {
  zone: 'header' | 'footer';
  elements: LayoutElement[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, target: 'header' | 'footer') => void;
  renderElement: (element: LayoutElement) => React.ReactNode;
  renderStepperPreview?: () => React.ReactNode;
  showStepper?: boolean;
}

export function DropZone({
  zone,
  elements,
  onDragOver,
  onDrop,
  renderElement,
  renderStepperPreview,
  showStepper,
}: DropZoneProps) {
  return (
    <DropZoneContainer
      hasElements={elements.length > 0}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, zone)}
    >
      <DropZoneHeader>
        <ZoneChip label={zone.toUpperCase()} size="small" />
        <Typography variant="caption" color="text.secondary">
          Drag elements here for {zone} section
        </Typography>
      </DropZoneHeader>

      {showStepper && renderStepperPreview?.()}

      {elements.length > 0 ? (
        elements.map((element) => renderElement(element))
      ) : (
        <EmptyState>
          <MousePointer2 size={48} style={{ color: '#919EAB', opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Drag elements from the left sidebar
            <br />
            to add them to the {zone}
          </Typography>
        </EmptyState>
      )}
    </DropZoneContainer>
  );
}

// Styled Components
const DropZoneContainer = styled(Box)<{ hasElements: boolean }>(({ theme, hasElements }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  minHeight: 200,
  border: '2px dashed',
  borderColor: hasElements ? theme.palette.primary.light : theme.palette.divider,
  borderRadius: theme.spacing(1.5),
  backgroundColor: hasElements ? alpha('#FF3B30', 0.02) : theme.palette.background.paper,
  boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)',
  transition: 'all 0.2s',
}));

const DropZoneHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const ZoneChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#FF3B30', 0.12),
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 0),
  gap: theme.spacing(2),
}));
