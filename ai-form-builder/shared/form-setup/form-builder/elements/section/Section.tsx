/**
 * Section Component - Container element with nested children support
 */

'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import type { DroppedElement } from '../../form-builder.configuration';
import { createDroppedElement } from '../../utils/element.utils';
import { ElementRenderer } from '../ElementRenderer';

interface SectionProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
  onDeleteElement?: (id: string) => void;
  onUpdateElement?: (elementId: string, updates: Partial<DroppedElement>) => void;
  onDropIntoContainer?: (
    containerId: string,
    newElement: DroppedElement,
    columnIndex?: number
  ) => void;
  onSelectElement?: (id: string) => void;
}

export function Section({
  element,
  isSelected,
  onClick,
  onDeleteElement,
  onUpdateElement,
  onDropIntoContainer,
  onSelectElement,
}: SectionProps) {
  const [draggedOverColumn, setDraggedOverColumn] = useState<number | null>(null);

  // Get children based on element type
  const getChildren = () => {
    return element.children || [];
  };

  // Handle drag over container
  const handleDragOver = (e: React.DragEvent, columnIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverColumn(columnIndex ?? -1);
  };

  // Handle drop into container
  const handleDrop = (e: React.DragEvent, columnIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverColumn(null);

    const elementType = e.dataTransfer.getData('elementType') as any;
    if (elementType) {
      const newElement = createDroppedElement(elementType);
      if (newElement && onDropIntoContainer) {
        onDropIntoContainer(element.id, newElement, columnIndex);
      }
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  // Section only handles 'section' and 'card' types now
  if (element.type !== 'section' && element.type !== 'card') {
    return null;
  }

  const children = getChildren();
  const isEmpty = children.length === 0;

  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <SectionBox variant={element.type}>
        <SectionTitle>
          {element.heading || (element.type === 'section' ? 'Section Title' : 'Card Title')}
        </SectionTitle>
        <DropZone
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
          onDragLeave={handleDragLeave}
          isEmpty={isEmpty}
          isDragOver={draggedOverColumn === -1}
        >
          {isEmpty ? (
            <PlaceholderText>Drop form elements here</PlaceholderText>
          ) : (
            children.map((child) => (
              <NestedElement key={child.id}>
                <ElementRenderer
                  element={child}
                  isSelected={false}
                  onClick={(e?: React.MouseEvent) => {
                    e?.stopPropagation();
                    onSelectElement?.(child.id);
                  }}
                  onDeleteElement={onDeleteElement}
                  onUpdateElement={onUpdateElement}
                  onDropIntoContainer={onDropIntoContainer}
                />
              </NestedElement>
            ))
          )}
        </DropZone>
      </SectionBox>
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

const SectionBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'section' | 'card' }>(({ theme, variant }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  minHeight: 100,
  backgroundColor: variant === 'card' ? theme.palette.background.paper : 'transparent',
  boxShadow: variant === 'card' ? theme.shadows[1] : 'none',
}));

const ColumnsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const Column = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'columnCount',
})<{ columnCount: number }>(({ columnCount }) => ({
  flex: 1,
  minWidth: 0,
}));

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isEmpty' && prop !== 'isDragOver',
})<{ isEmpty: boolean; isDragOver: boolean }>(({ theme, isEmpty, isDragOver }) => ({
  minHeight: isEmpty ? 80 : 'auto',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isDragOver ? `${theme.palette.primary.light}10` : 'transparent',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  alignItems: isEmpty ? 'center' : 'stretch',
  justifyContent: isEmpty ? 'center' : 'flex-start',
  transition: 'all 0.2s',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const PlaceholderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '0.875rem',
  textAlign: 'center',
}));

const NestedElement = styled(Box)({
  position: 'relative',
});
