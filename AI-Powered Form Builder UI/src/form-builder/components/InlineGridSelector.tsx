/**
 * Inline Grid Selector
 * Quick grid creation directly on canvas
 */

import { Box, Paper, Typography, alpha, IconButton, Tooltip } from '@mui/material';
import { Columns, Grid3x3, RectangleVertical } from 'lucide-react';
import { motion } from 'motion/react';

interface InlineGridSelectorProps {
  onSelectColumns: (columns: number) => void;
}

export function InlineGridSelector({ onSelectColumns }: InlineGridSelectorProps) {
  const gridOptions = [
    {
      columns: 1,
      icon: RectangleVertical,
      label: '1 Column',
      preview: [12],
      description: 'Full width',
    },
    {
      columns: 2,
      icon: Columns,
      label: '2 Columns',
      preview: [6, 6],
      description: 'Equal split',
    },
    {
      columns: 3,
      icon: Grid3x3,
      label: '3 Columns',
      preview: [4, 4, 4],
      description: 'Equal split',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          py: 4,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          Choose your layout
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {gridOptions.map((option, index) => {
            const Icon = option.icon;
            
            return (
              <motion.div
                key={option.columns}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  onClick={() => onSelectColumns(option.columns)}
                  sx={{
                    p: 3,
                    minWidth: 140,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    <Icon size={28} color="currentColor" style={{ color: 'var(--primary-main)' }} />
                  </Box>

                  {/* Label */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                      mb: 0.5,
                    }}
                  >
                    {option.label}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      display: 'block',
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    {option.description}
                  </Typography>

                  {/* Visual Preview */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      justifyContent: 'center',
                    }}
                  >
                    {option.preview.map((width, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: width,
                          height: 32,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                          borderRadius: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
}
