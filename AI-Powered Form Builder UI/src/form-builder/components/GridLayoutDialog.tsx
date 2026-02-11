/**
 * Grid Layout Dialog
 * Beautiful dialog for creating grid layouts in sections
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import { X, Grid3x3, Columns, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GridLayoutOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  columns: number;
  layout: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }[];
}

const GRID_LAYOUTS: GridLayoutOption[] = [
  {
    id: '1-column',
    name: '1 Column',
    description: 'Single column layout - full width',
    icon: LayoutGrid,
    columns: 1,
    layout: [{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }],
  },
  {
    id: '2-columns',
    name: '2 Columns',
    description: 'Two equal columns - 50/50',
    icon: Columns,
    columns: 2,
    layout: [
      { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    ],
  },
  {
    id: '3-columns',
    name: '3 Columns',
    description: 'Three equal columns - 33/33/33',
    icon: Grid3x3,
    columns: 3,
    layout: [
      { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
      { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
      { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
    ],
  },
  {
    id: '4-columns',
    name: '4 Columns',
    description: 'Four equal columns - 25/25/25/25',
    icon: Grid3x3,
    columns: 4,
    layout: [
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    ],
  },
  {
    id: 'sidebar-left',
    name: 'Sidebar Left',
    description: 'Left sidebar - 33/66',
    icon: Columns,
    columns: 2,
    layout: [
      { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 },
    ],
  },
  {
    id: 'sidebar-right',
    name: 'Sidebar Right',
    description: 'Right sidebar - 66/33',
    icon: Columns,
    columns: 2,
    layout: [
      { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 },
      { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
    ],
  },
  {
    id: '2-1-ratio',
    name: '2:1 Layout',
    description: 'Two columns - 66/33',
    icon: Columns,
    columns: 2,
    layout: [
      { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 },
      { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
    ],
  },
  {
    id: '1-2-ratio',
    name: '1:2 Layout',
    description: 'Two columns - 33/66',
    icon: Columns,
    columns: 2,
    layout: [
      { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 },
    ],
  },
  {
    id: '1-2-1',
    name: '1:2:1 Layout',
    description: 'Three columns - 25/50/25',
    icon: Grid3x3,
    columns: 3,
    layout: [
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
      { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    ],
  },
];

interface GridLayoutDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateGrid?: (layout: GridLayoutOption) => void;
}

export function GridLayoutDialog({ open, onClose, onCreateGrid }: GridLayoutDialogProps) {
  const [selectedLayout, setSelectedLayout] = useState<GridLayoutOption | null>(null);
  const [hoveredLayout, setHoveredLayout] = useState<string | null>(null);

  const handleSelect = (layout: GridLayoutOption) => {
    setSelectedLayout(layout);
  };

  const handleConfirm = () => {
    if (selectedLayout) {
      onCreateGrid?.(selectedLayout);
      onClose();
      setSelectedLayout(null);
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedLayout(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Sparkles size={20} color="white" strokeWidth={2.5} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Choose Grid Layout
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select a responsive grid layout for your section
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleCancel} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Grid container spacing={2}>
          {GRID_LAYOUTS.map((layout) => {
            const Icon = layout.icon;
            const isSelected = selectedLayout?.id === layout.id;
            const isHovered = hoveredLayout === layout.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={layout.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Paper
                    onClick={() => handleSelect(layout)}
                    onMouseEnter={() => setHoveredLayout(layout.id)}
                    onMouseLeave={() => setHoveredLayout(null)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected
                        ? (theme) => alpha(theme.palette.primary.main, 0.04)
                        : 'background.paper',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    }}
                  >
                    {/* Selection indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                          }}
                        >
                          <Chip
                            label="Selected"
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        bgcolor: isSelected
                          ? 'primary.main'
                          : (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon
                        size={24}
                        color={isSelected ? '#fff' : undefined}
                        style={{
                          color: isSelected ? '#fff' : undefined,
                        }}
                      />
                    </Box>

                    {/* Layout name */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {layout.name}
                    </Typography>

                    {/* Description */}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      {layout.description}
                    </Typography>

                    {/* Visual grid preview */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 2,
                      }}
                    >
                      {layout.layout.map((col, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            flex: col.md || 12,
                            height: 32,
                            bgcolor: isSelected
                              ? 'primary.main'
                              : (theme) => alpha(theme.palette.primary.main, 0.2),
                            borderRadius: 0.5,
                            transition: 'all 0.2s ease',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button onClick={handleCancel} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedLayout}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Create Grid
        </Button>
      </DialogActions>
    </Dialog>
  );
}