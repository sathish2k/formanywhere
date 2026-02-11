/**
 * Container Element Component
 * MUI Container wrapper with maxWidth support
 */

import React from 'react';
import { Container, Box, IconButton, Typography, alpha, Chip } from '@mui/material';
import { Trash2, Box as BoxIcon } from 'lucide-react';
import { DroppedElement } from '../types/form.types';
import { FormElementRenderer } from './FormElementRenderer';

interface ContainerElementProps {
  element: DroppedElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDropInside?: (e: React.DragEvent, parentId: string) => void;
  onNestedElementSelect?: (id: string) => void;
  onNestedElementRemove?: (id: string) => void;
  selectedElementId?: string | null;
  onUpdateElement?: (id: string, updates: Partial<DroppedElement>) => void;
}

export function ContainerElement({
  element,
  isSelected,
  onSelect,
  onRemove,
  onDragOver,
  onDropInside,
  onNestedElementSelect,
  onNestedElementRemove,
  selectedElementId,
  onUpdateElement,
}: ContainerElementProps) {
  const maxWidth = element.maxWidth || 'md';

  const renderNestedElements = (children: DroppedElement[]) => {
    return children.map((child) => (
      <FormElementRenderer
        key={child.id}
        element={child}
        isSelected={selectedElementId === child.id}
        onSelect={() => onNestedElementSelect?.(child.id)}
        onRemove={() => onNestedElementRemove?.(child.id)}
        onDragOver={onDragOver}
        onDropInside={onDropInside}
        onNestedElementSelect={onNestedElementSelect}
        onNestedElementRemove={onNestedElementRemove}
        selectedElementId={selectedElementId}
        onUpdateElement={onUpdateElement}
      />
    ));
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      sx={{
        position: 'relative',
        mb: 2,
        border: '2px solid',
        borderColor: isSelected ? 'error.main' : 'transparent',
        borderRadius: 1.5,
        transition: 'all 0.2s',
        bgcolor: 'background.paper',
        '&:hover': {
          borderColor: isSelected ? 'error.main' : 'grey.300',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: isSelected ? alpha('#FF3B30', 0.05) : 'grey.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BoxIcon size={18} color="#00897B" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Container
          </Typography>
          <Chip
            label={`Max Width: ${maxWidth}`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: alpha('#00897B', 0.1),
              color: '#00897B',
            }}
          />
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            color: 'text.disabled',
            '&:hover': {
              color: 'error.main',
              bgcolor: alpha('#FF3B30', 0.08),
            },
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      </Box>

      {/* Content Area */}
      <Container
        maxWidth={maxWidth === false ? false : maxWidth}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDragOver?.(e);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDropInside?.(e, element.id);
        }}
        sx={{
          py: 3,
          minHeight: 120,
          border: '2px dashed',
          borderColor: (theme) => alpha(theme.palette.grey[400], 0.3),
          borderRadius: 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.02),
          },
        }}
      >
        {element.children && element.children.length > 0 ? (
          <Box>{renderNestedElements(element.children)}</Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
            }}
          >
            <Typography variant="body2" color="text.disabled">
              Drop elements here
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
              This container will constrain content to {maxWidth} width
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
