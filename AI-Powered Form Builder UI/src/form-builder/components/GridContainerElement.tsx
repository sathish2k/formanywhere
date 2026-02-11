/**
 * Grid Container Element
 * Wraps grid rows and columns with controls to add rows/columns
 */

import React, { useState } from 'react';
import { Box, Grid, IconButton, Tooltip, Paper, alpha, Menu, MenuItem, ListItemIcon, ListItemText, Chip, Button } from '@mui/material';
import { Plus, MoreVertical, Columns, Rows, Trash2, LayoutGrid } from 'lucide-react';
import { DroppedElement } from '../types/form.types';
import { FormElementRenderer } from './FormElementRenderer';
import { motion } from 'motion/react';

interface GridContainerElementProps {
  element: DroppedElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onAddRow: (containerId: string) => void;
  onAddColumn: (containerId: string, rowIndex: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDropInside?: (e: React.DragEvent, parentId: string) => void;
  onNestedElementSelect?: (id: string) => void;
  onNestedElementRemove?: (id: string) => void;
  selectedElementId?: string | null;
  onUpdateElement?: (id: string, updates: Partial<DroppedElement>) => void;
  onAddRowToGrid?: (containerId: string) => void;
  onAddColumnToGrid?: (containerId: string, rowIndex: number) => void;
  onDeleteRow?: (containerId: string, rowIndex: number) => void;
}

export function GridContainerElement({
  element,
  isSelected,
  onSelect,
  onRemove,
  onAddRow,
  onAddColumn,
  onDragOver,
  onDropInside,
  onNestedElementSelect,
  onNestedElementRemove,
  selectedElementId,
  onUpdateElement,
  onAddRowToGrid,
  onAddColumnToGrid,
  onDeleteRow,
}: GridContainerElementProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenRowMenu = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    event.stopPropagation();
    setRowMenuAnchor(event.currentTarget);
    setSelectedRowIndex(rowIndex);
  };

  const handleCloseRowMenu = () => {
    setRowMenuAnchor(null);
    setSelectedRowIndex(null);
  };

  // Grid rows structure: element.rows = [[col1, col2], [col3, col4, col5]]
  const rows = element.rows || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        sx={{
          position: 'relative',
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.02),
          border: '2px dashed',
          borderColor: isSelected ? 'error.main' : (theme) => alpha(theme.palette.error.main, 0.3),
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'error.main',
            '& .grid-controls': {
              opacity: 1,
            },
          },
        }}
      >
        {/* Grid Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          {/* Grid Layout Label */}
          <Chip
            icon={<LayoutGrid size={14} />}
            label="Grid Layout"
            size="small"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              fontWeight: 600,
              fontSize: '0.75rem',
              '& .MuiChip-icon': {
                color: 'text.secondary',
              },
            }}
          />

          {/* Grid Controls */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Grid Options">
              <IconButton
                size="small"
                onClick={handleOpenMenu}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Grid">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    color: 'error.main',
                  },
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Render each row */}
        {rows.map((row, rowIndex) => (
          <Box key={`row-${rowIndex}`} sx={{ mb: 3 }}>
            {/* Row Header - Always show for better UX */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                gap: 1,
              }}
            >
              <Chip
                label={`Row ${rowIndex + 1}`}
                size="small"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
              <Tooltip title="Row Options">
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenRowMenu(e, rowIndex)}
                  sx={{
                    color: 'text.secondary',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                      color: 'error.main',
                    },
                  }}
                >
                  <MoreVertical size={14} />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid
              container
              spacing={element.gridSpacing || 2}
              rowSpacing={element.gridRowSpacing}
              columnSpacing={element.gridColumnSpacing}
              direction={element.gridDirection || 'row'}
              justifyContent={element.gridJustifyContent || 'flex-start'}
              alignItems={element.gridAlignItems || 'stretch'}
              alignContent={element.gridAlignContent}
              wrap={element.gridWrap || 'wrap'}
              columns={element.gridColumns || 12}
            >
              {row.map((col, colIndex) => (
                <Grid
                  item
                  key={col.id}
                  xs={col.gridItemXs || 12}
                  sm={col.gridItemSm || 12}
                  md={col.gridItemMd || 12}
                  lg={col.gridItemLg || 12}
                  xl={col.gridItemXl || 12}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIndex * 0.1, duration: 0.4 }}
                  >
                    <FormElementRenderer
                      element={col}
                      isSelected={selectedElementId === col.id}
                      onSelect={() => onNestedElementSelect?.(col.id)}
                      onRemove={() => onNestedElementRemove?.(col.id)}
                      onDragOver={onDragOver}
                      onDropInside={onDropInside}
                      onNestedElementSelect={onNestedElementSelect}
                      onNestedElementRemove={onNestedElementRemove}
                      selectedElementId={selectedElementId}
                      onUpdateElement={onUpdateElement}
                      onAddRow={() => onAddRowToGrid?.(element.id)}
                      onAddColumn={() => onAddColumnToGrid?.(element.id, rowIndex)}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Grid Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              onAddRowToGrid?.(element.id);
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <Rows size={18} />
            </ListItemIcon>
            <ListItemText primary="Add Row" />
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              onAddColumnToGrid?.(element.id, rows.length - 1);
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <Columns size={18} />
            </ListItemIcon>
            <ListItemText primary="Add Column" />
          </MenuItem>
        </Menu>

        {/* Row Options Menu */}
        <Menu
          anchorEl={rowMenuAnchor}
          open={Boolean(rowMenuAnchor)}
          onClose={handleCloseRowMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              if (selectedRowIndex !== null) {
                onAddColumnToGrid?.(element.id, selectedRowIndex);
              }
              handleCloseRowMenu();
            }}
          >
            <ListItemIcon>
              <Columns size={18} />
            </ListItemIcon>
            <ListItemText primary="Add Column" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (selectedRowIndex !== null) {
                onDeleteRow?.(element.id, selectedRowIndex);
              }
              handleCloseRowMenu();
            }}
            sx={{
              color: 'error.main',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon>
              <Trash2 size={18} color="currentColor" />
            </ListItemIcon>
            <ListItemText primary="Delete Row" />
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
}