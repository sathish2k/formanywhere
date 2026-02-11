/**
 * Form Canvas Component
 * Center canvas for building forms with drag-and-drop functionality
 * Enhanced Minimals.cc inspired design with modern UI patterns
 */

import React, { useState } from 'react';
import { Box, Typography, Chip, alpha, useTheme, Button, Divider, Grid } from '@mui/material';
import { MousePointer2, Sparkles, Grid3x3, Plus } from 'lucide-react';
import { DroppedElement, PageData } from '../types/form.types';
import { FormElementRenderer } from './FormElementRenderer';
import { GridContainerElement } from './GridContainerElement';
import { InlineGridSelector } from './InlineGridSelector';
import { AddGridButton } from './AddGridButton';
import { motion, AnimatePresence } from 'motion/react';

interface FormCanvasProps {
  currentPage: PageData;
  elements: DroppedElement[];
  selectedElementId: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onElementSelect: (id: string) => void;
  onElementRemove: (id: string) => void;
  editingLayout?: 'header' | 'footer' | null;
  onDropInside?: (e: React.DragEvent, parentId: string, columnIndex?: number) => void;
  onNestedElementSelect?: (id: string) => void;
  onNestedElementRemove?: (id: string) => void;
  onCreateGrid?: (columns: number) => void;
  onUpdateElement?: (id: string, updates: Partial<DroppedElement>) => void;
  onAddRowToGrid?: (containerId: string) => void;
  onAddColumnToGrid?: (containerId: string, rowIndex: number) => void;
  onDeleteRow?: (containerId: string, rowIndex: number) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({
  currentPage,
  elements,
  selectedElementId,
  onDragOver,
  onDrop,
  onElementSelect,
  onElementRemove,
  editingLayout,
  onDropInside,
  onNestedElementSelect,
  onNestedElementRemove,
  onCreateGrid,
  onUpdateElement,
  onAddRowToGrid,
  onAddColumnToGrid,
  onDeleteRow,
}) => {
  const isEmpty = elements.length === 0;
  const theme = useTheme();
  const [showGridSelector, setShowGridSelector] = useState(isEmpty);

  const handleCreateGrid = (columns: number) => {
    onCreateGrid?.(columns);
    setShowGridSelector(false);
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'grey.100',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Page Title Bar */}
      {editingLayout && (
        <Box
          sx={{
            px: 4,
            py: 2.5,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${editingLayout === 'header' ? 'Header' : 'Footer'} Layout`}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Canvas Area */}
      <Box
        onDragOver={onDragOver}
        onDrop={onDrop}
        sx={{
          flex: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 900,
            mx: 'auto',
            minHeight: isEmpty ? 600 : 'auto',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            p: isEmpty ? 0 : 5,
            position: 'relative',
            transition: 'all 0.3s',
            '&:hover': isEmpty ? {
              borderColor: 'primary.main',
              boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.12)}`,
            } : {},
          }}
        >
          {isEmpty ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 600,
                textAlign: 'center',
                px: 4,
              }}
            >
              {showGridSelector ? (
                // Show inline grid selector
                <InlineGridSelector onSelectColumns={handleCreateGrid} />
              ) : (
                // Show initial empty state
                <>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 4,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                    }}
                  >
                    <Sparkles size={56} color={theme.palette.primary.main} strokeWidth={1.5} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1.5,
                      color: 'text.primary',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Start Building Your Form
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      color: 'text.secondary',
                      maxWidth: 480,
                      lineHeight: 1.7,
                    }}
                  >
                    Create a responsive grid layout first, then drag and drop form elements into columns.
                  </Typography>

                  {/* Primary CTA - Create Grid Layout */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Grid3x3 size={20} />}
                      onClick={() => setShowGridSelector(true)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '0.9375rem',
                        borderRadius: 2,
                        mb: 3,
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                        '&:hover': {
                          boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Create Grid Layout
                    </Button>
                  </motion.div>

                  <Divider sx={{ width: '100%', maxWidth: 300, mb: 3 }}>
                    <Typography variant="caption" color="text.disabled">
                      OR
                    </Typography>
                  </Divider>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                      border: '1px dashed',
                      borderColor: 'info.main',
                    }}
                  >
                    <MousePointer2 size={20} color={theme.palette.info.main} strokeWidth={2} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'info.main',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                      }}
                    >
                      Drag elements from the left sidebar
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Box>
              {showGridSelector && (
                <InlineGridSelector onSelectColumns={handleCreateGrid} />
              )}
              
              {!showGridSelector && (() => {
                // Render all elements - grid-container elements will have rows as children
                const renderedElements: React.ReactNode[] = [];
                
                elements.forEach((element, index) => {
                  // Check if this is a grid-container
                  if (element.type === 'grid-container' && element.rows) {
                    // Render grid container with rows
                    renderedElements.push(
                      <GridContainerElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onSelect={() => onElementSelect(element.id)}
                        onRemove={() => onElementRemove(element.id)}
                        onDragOver={onDragOver}
                        onDropInside={onDropInside}
                        onNestedElementSelect={onNestedElementSelect}
                        onNestedElementRemove={onNestedElementRemove}
                        selectedElementId={selectedElementId}
                        onUpdateElement={onUpdateElement}
                        onAddRow={onAddRowToGrid!}
                        onAddColumn={onAddColumnToGrid!}
                        onAddRowToGrid={onAddRowToGrid}
                        onAddColumnToGrid={onAddColumnToGrid}
                        onDeleteRow={onDeleteRow}
                      />
                    );
                  } else {
                    // Render regular element
                    renderedElements.push(
                      <Box
                        key={element.id}
                        sx={{ mb: 3 }}
                      >
                        <FormElementRenderer
                          element={element}
                          isSelected={selectedElementId === element.id}
                          onSelect={() => onElementSelect(element.id)}
                          onRemove={() => onElementRemove(element.id)}
                          onDragOver={onDragOver}
                          onDropInside={onDropInside}
                          onNestedElementSelect={onNestedElementSelect}
                          onNestedElementRemove={onNestedElementRemove}
                          selectedElementId={selectedElementId}
                          onUpdateElement={onUpdateElement}
                        />
                      </Box>
                    );
                  }
                });
                
                return renderedElements;
              })()}
              
              {/* Add Grid Button - Show after existing elements */}
              {!isEmpty && !showGridSelector && (
                <AddGridButton onClick={() => setShowGridSelector(true)} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};