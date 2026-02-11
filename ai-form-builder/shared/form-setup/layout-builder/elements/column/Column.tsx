/**
 * Column Layout Elements Component
 * Two and Three column layouts with styled components
 */

'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Plus } from 'lucide-react';
import type { LayoutElement } from '../element.types';

interface ColumnProps {
  element: LayoutElement;
  onDropInColumn?: (
    e: React.DragEvent,
    parentId: string,
    columnKey: 'column1' | 'column2' | 'column3',
    target: 'header' | 'footer'
  ) => void;
  target?: 'header' | 'footer';
  renderChild?: (child: LayoutElement) => React.ReactNode;
}

// Two Column
export function TwoColumn({ element, onDropInColumn, target, renderChild }: ColumnProps) {
  const column1 = element.children?.column1 || [];
  const column2 = element.children?.column2 || [];
  const gap = element.columnGap || 'medium';
  const alignment = element.columnAlignment || 'stretch';

  return (
    <ColumnsContainer gap={gap} alignment={alignment}>
      <ColumnDropZone
        onDragOver={handleDragOver}
        onDrop={(e) => onDropInColumn?.(e, element.id, 'column1', target || 'header')}
      >
        {column1.length > 0 ? column1.map((child) => renderChild?.(child)) : <EmptyColumnState />}
      </ColumnDropZone>
      <ColumnDropZone
        onDragOver={handleDragOver}
        onDrop={(e) => onDropInColumn?.(e, element.id, 'column2', target || 'header')}
      >
        {column2.length > 0 ? column2.map((child) => renderChild?.(child)) : <EmptyColumnState />}
      </ColumnDropZone>
    </ColumnsContainer>
  );
}

// Three Column
export function ThreeColumn({ element, onDropInColumn, target, renderChild }: ColumnProps) {
  const column1 = element.children?.column1 || [];
  const column2 = element.children?.column2 || [];
  const column3 = element.children?.column3 || [];
  const gap = element.columnGap || 'medium';
  const alignment = element.columnAlignment || 'stretch';

  return (
    <ColumnsContainer gap={gap} alignment={alignment}>
      <ColumnDropZone
        onDragOver={handleDragOver}
        onDrop={(e) => onDropInColumn?.(e, element.id, 'column1', target || 'header')}
      >
        {column1.length > 0 ? column1.map((child) => renderChild?.(child)) : <EmptyColumnState />}
      </ColumnDropZone>
      <ColumnDropZone
        onDragOver={handleDragOver}
        onDrop={(e) => onDropInColumn?.(e, element.id, 'column2', target || 'header')}
      >
        {column2.length > 0 ? column2.map((child) => renderChild?.(child)) : <EmptyColumnState />}
      </ColumnDropZone>
      <ColumnDropZone
        onDragOver={handleDragOver}
        onDrop={(e) => onDropInColumn?.(e, element.id, 'column3', target || 'header')}
      >
        {column3.length > 0 ? column3.map((child) => renderChild?.(child)) : <EmptyColumnState />}
      </ColumnDropZone>
    </ColumnsContainer>
  );
}

// Helper
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

// Empty State Component
function EmptyColumnState() {
  return (
    <EmptyState>
      <Plus size={16} />
      <Typography variant="caption">Drop here</Typography>
    </EmptyState>
  );
}

// Helper functions for gap spacing
const getGapSpacing = (theme: any, gap: string) => {
  switch (gap) {
    case 'none':
      return 0;
    case 'small':
      return theme.spacing(1);
    case 'medium':
      return theme.spacing(2);
    case 'large':
      return theme.spacing(3);
    default:
      return theme.spacing(2);
  }
};

// Helper function for alignment
const getAlignment = (alignment: string) => {
  switch (alignment) {
    case 'top':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'bottom':
      return 'flex-end';
    case 'stretch':
      return 'stretch';
    default:
      return 'stretch';
  }
};

// Styled Components
const ColumnsContainer = styled(Box)<{ gap: string; alignment: string }>(
  ({ theme, gap, alignment }) => ({
    display: 'flex',
    gap: getGapSpacing(theme, gap),
    alignItems: getAlignment(alignment),
    width: '100%',
  })
);

const ColumnDropZone = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 80,
  padding: theme.spacing(1.5),
  border: '1px dashed',
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));
