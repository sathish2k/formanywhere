/**
 * Grid Column Element
 * Draggable grid column with width controls
 */

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  alpha,
  Popover,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DroppedElement } from '../types/form.types';
import { GridContextMenu } from './GridContextMenu';

interface GridColumnElementProps {
  element: DroppedElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdateWidth: (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl', value: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDropInside?: (e: React.DragEvent, parentId: string) => void;
  children?: React.ReactNode;
  renderDropZone?: (text: string, parentId: string) => React.ReactNode;
  renderNestedElements?: (children: DroppedElement[]) => React.ReactNode;
  onAddRow?: () => void;
  onAddColumn?: () => void;
  onUpdateOffset?: (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl', value: number) => void;
  onUpdateOrder?: (order: number) => void;
}

export function GridColumnElement({
  element,
  isSelected,
  onSelect,
  onRemove,
  onUpdateWidth,
  onDragOver,
  onDropInside,
  children,
  renderDropZone,
  renderNestedElements,
  onAddRow,
  onAddColumn,
  onUpdateOffset,
  onUpdateOrder,
}: GridColumnElementProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [settingsTab, setSettingsTab] = useState<'width' | 'offset' | 'order'>('width');

  const handleOpenSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    // Check if it's a right-click
    if (event.button === 2 || event.type === 'contextmenu') {
      setContextMenuAnchor(event.currentTarget);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuAnchor(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenuAnchor(null);
  };

  const open = Boolean(anchorEl);
  const contextMenuOpen = Boolean(contextMenuAnchor);

  const columnSizes = [
    { value: 1, label: '1/12' },
    { value: 2, label: '2/12' },
    { value: 3, label: '3/12' },
    { value: 4, label: '4/12' },
    { value: 5, label: '5/12' },
    { value: 6, label: '6/12' },
    { value: 7, label: '7/12' },
    { value: 8, label: '8/12' },
    { value: 9, label: '9/12' },
    { value: 10, label: '10/12' },
    { value: 11, label: '11/12' },
    { value: 12, label: '12/12' },
  ];

  const breakpoints = [
    { key: 'xs' as const, label: 'XS', description: 'Mobile' },
    { key: 'sm' as const, label: 'SM', description: 'Tablet' },
    { key: 'md' as const, label: 'MD', description: 'Desktop' },
    { key: 'lg' as const, label: 'LG', description: 'Large' },
    { key: 'xl' as const, label: 'XL', description: 'Extra Large' },
  ];

  const getCurrentWidth = (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    const key = `gridItem${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}` as keyof DroppedElement;
    return (element[key] as number) || 12;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <Paper
        onClick={onSelect}
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.stopPropagation();
          onDropInside?.(e, element.id);
        }}
        sx={{
          p: 0,
          minHeight: 200,
          height: '100%',
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '2px dashed',
          borderColor: isSelected ? 'error.main' : 'divider',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.02),
            '& .column-controls': {
              opacity: 1,
            },
          },
        }}
      >
        {/* Column Header with Badge and Delete */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 2,
            pb: 1.5,
            position: 'relative',
          }}
        >
          {/* Column Width Badge */}
          <Chip
            label={`${getCurrentWidth('md')}/12`}
            size="small"
            onClick={handleOpenSettings}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 24,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          />

          {/* Delete Icon - Top Right */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.disabled',
              '&:hover': {
                color: 'error.main',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>

        {/* Content Area */}
        <Box
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
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            pb: 3,
            minHeight: 120,
            border: '2px dashed',
            borderColor: (theme) => alpha(theme.palette.grey[400], 0.3),
            borderRadius: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'error.main',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.02),
            },
          }}
        >
          {element.children && element.children.length > 0 ? (
            <Box sx={{ width: '100%' }}>{renderNestedElements?.(element.children)}</Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: 'text.disabled',
                textAlign: 'center',
              }}
            >
              Drop elements here
            </Typography>
          )}
        </Box>

        {/* Width Settings Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseSettings}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ p: 2, minWidth: 280 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Column Width Settings
            </Typography>

            {/* Breakpoint Tabs */}
            <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
              {breakpoints.map((bp) => (
                <Button
                  key={bp.key}
                  size="small"
                  variant={activeBreakpoint === bp.key ? 'contained' : 'outlined'}
                  onClick={() => setActiveBreakpoint(bp.key)}
                  sx={{
                    minWidth: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  {bp.label}
                </Button>
              ))}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              {breakpoints.find((bp) => bp.key === activeBreakpoint)?.description}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Column Size Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
              }}
            >
              {columnSizes.map((size) => {
                const isActive = getCurrentWidth(activeBreakpoint) === size.value;
                
                return (
                  <Button
                    key={size.value}
                    size="small"
                    variant={isActive ? 'contained' : 'outlined'}
                    onClick={() => {
                      onUpdateWidth(activeBreakpoint, size.value);
                    }}
                    sx={{
                      minWidth: 0,
                      px: 1,
                      py: 0.75,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {size.value}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>
                Current: {getCurrentWidth(activeBreakpoint)}/12 ({Math.round((getCurrentWidth(activeBreakpoint) / 12) * 100)}%)
              </Typography>
            </Box>
          </Box>
        </Popover>

        {/* Context Menu */}
        <GridContextMenu
          open={contextMenuOpen}
          anchorEl={contextMenuAnchor}
          onClose={handleCloseContextMenu}
          onAddRow={onAddRow}
          onAddColumn={onAddColumn}
        />
      </Paper>
    </motion.div>
  );
}