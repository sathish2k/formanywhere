/**
 * Add Grid Button
 * Floating button to add more grids
 */

import { Box, Button, alpha } from '@mui/material';
import { Plus, Grid3x3 } from 'lucide-react';
import { motion } from 'motion/react';

interface AddGridButtonProps {
  onClick: () => void;
}

export function AddGridButton({ onClick }: AddGridButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Plus size={18} />}
          endIcon={<Grid3x3 size={18} />}
          onClick={onClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            '&:hover': {
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: 'primary.dark',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          }}
        >
          Add Grid Section
        </Button>
      </Box>
    </motion.div>
  );
}
