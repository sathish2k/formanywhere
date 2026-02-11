/**
 * Form Canvas (Updated with Element Renderers)
 * Drop zone for form elements with actual component rendering
 */

'use client';

import { Box, Chip, IconButton, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ElementRenderer } from '../elements/ElementRenderer';
import { EmptyCanvasState } from './EmptyCanvasState';
import type { DroppedElement } from '../form-builder.configuration';

interface FormCanvasProps {
  elements: DroppedElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateElement: (elementId: string, updates: Partial<DroppedElement>) => void;
  onReorderElements: (sourceIndex: number, targetIndex: number) => void;
  onDropIntoContainer: (
    containerId: string,
    newElement: DroppedElement,
    columnIndex?: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onCreateGridLayout: () => void;
}

export function FormCanvas({
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onUpdateElement,
  onReorderElements,
  onDropIntoContainer,
  onDragOver,
  onDrop,
  onCreateGridLayout,
}: FormCanvasProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOverElement = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorderElements(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Show empty state if no elements
  if (elements.length === 0) {
    return (
      <CanvasContainer onDragOver={onDragOver} onDrop={onDrop}>
        <EmptyCanvasState onCreateGridLayout={onCreateGridLayout} />
      </CanvasContainer>
    );
  }

  return (
    <CanvasContainer onDragOver={onDragOver} onDrop={onDrop}>
      {elements.length === 0 ? (
        <EmptyState>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Drag elements here to start building your form
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Elements will appear here when you drag them from the sidebar
          </Typography>
        </EmptyState>
      ) : (
        elements.length > 0 && (
          <CanvasCard>
            <ElementsList>
              {elements.map((element, index) => (
                <ElementWrapper
                  key={element.id}
                  draggable={false}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                  isSelected={selectedElementId === element.id}
                  onDragOver={(e) => handleDragOverElement(e, index)}
                  onDragLeave={handleDragLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectElement(element.id);
                  }}
                >
                  {selectedElementId === element.id && (
                    <ElementBadge label={element.label} size="small" />
                  )}
                  <ElementControls isVisible={selectedElementId === element.id}>
                    <DragHandle
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical size={14} />
                    </DragHandle>
                    <DeleteButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement(element.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </DeleteButton>
                  </ElementControls>
                  <ElementContent>
                    <ElementRenderer
                      element={element}
                      isSelected={selectedElementId === element.id}
                      onClick={() => onSelectElement(element.id)}
                      onDeleteElement={onDeleteElement}
                      onUpdateElement={onUpdateElement}
                      onDropIntoContainer={onDropIntoContainer}
                      onSelectElement={onSelectElement}
                    />
                  </ElementContent>
                </ElementWrapper>
              ))}
            </ElementsList>
          </CanvasCard>
        )
      )}
    </CanvasContainer>
  );
}

// Styled Components
const CanvasContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  minHeight: '400px',
  overflow: 'auto',
}));

const EmptyState = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  textAlign: 'center',
});

const ElementsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const ElementWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isDragging' && prop !== 'isDragOver' && prop !== 'isSelected',
})<{ isDragging?: boolean; isDragOver?: boolean; isSelected?: boolean }>(
  ({ theme, isDragging, isDragOver, isSelected }) => ({
    position: 'relative',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    opacity: isDragging ? 0.5 : 1,
    borderLeft: isDragOver ? `3px solid ${theme.palette.primary.main}` : 'none',
    '&:hover': {
      backgroundColor: isSelected
        ? alpha(theme.palette.primary.main, 0.04)
        : alpha(theme.palette.primary.main, 0.02),
    },
  })
);

const CanvasCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}));

const ElementBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  left: 12,
  zIndex: 5,
  height: 20,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  fontSize: '0.6875rem',
  fontWeight: 600,
}));

const ElementControls = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean }>(({ theme, isVisible }) => ({
  position: 'absolute',
  top: -12,
  right: -12,
  zIndex: 10,
  display: 'flex',
  gap: theme.spacing(0.5),
  opacity: isVisible ? 1 : 0,
  transition: 'opacity 0.2s',
}));

const DragHandle = styled(IconButton)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  cursor: 'grab',
  color: theme.palette.text.secondary,
  '&:active': {
    cursor: 'grabbing',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
    color: theme.palette.primary.main,
  },
}));

const ElementContent = styled(Box)({
  width: '100%',
  minWidth: 0,
});

const DeleteButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isDelete',
})(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.error.lighter,
    color: theme.palette.error.main,
  },
}));
