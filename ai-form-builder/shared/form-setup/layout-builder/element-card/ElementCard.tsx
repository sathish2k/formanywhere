'use client';

import { Box, Chip, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { GripVertical, Trash2 } from 'lucide-react';

interface ElementCardProps {
  isSelected: boolean;
  label?: string;
  align?: 'left' | 'center' | 'right';
  onSelect: (e?: React.MouseEvent) => void;
  onRemove: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function ElementCard({
  isSelected,
  label,
  align = 'center',
  onSelect,
  onRemove,
  children,
}: ElementCardProps) {
  return (
    <CardContainer
      isSelected={isSelected}
      onClick={(e) => {
        e.stopPropagation(); // Always stop propagation
        onSelect(e);
      }}
    >
      {label && <ElementBadge label={label} size="small" />}
      <ElementControls isVisible={isSelected}>
        <ControlButton size="small">
          <GripVertical size={14} />
        </ControlButton>
        <ControlButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          isDelete
        >
          <Trash2 size={14} />
        </ControlButton>
      </ElementControls>
      <ElementContent align={align}>{children}</ElementContent>
    </CardContainer>
  );
}

// Styled Components
const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '2px solid',
  borderColor: isSelected ? theme.palette.primary.main : 'transparent',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: isSelected ? `0 0 0 4px ${alpha('#FF3B30', 0.12)}` : 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 4px ${alpha('#FF3B30', 0.08)}`,
  },
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

const ControlButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isDelete',
})<{ isDelete?: boolean }>(({ theme, isDelete }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: isDelete ? theme.palette.error.lighter : theme.palette.primary.lighter,
    color: isDelete ? theme.palette.error.main : theme.palette.primary.main,
  },
}));

const ElementContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align: 'left' | 'center' | 'right' }>(({ align }) => ({
  display: 'flex',
  justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
  alignItems: 'center',
}));
