/**
 * Form Layout Section
 * Section to configure/view form layout with LayoutBuilder dialog
 */

'use client';

import type { LayoutConfig, PageData } from '@/components/form-setup/form-setup.configuration';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit2, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { LayoutBuilder } from './layout-builder';

interface FormLayoutSectionProps {
  layout: LayoutConfig | null;
  onLayoutChange: (layout: LayoutConfig | null) => void;
  totalPages: number;
  pages?: PageData[];
}

export function FormLayoutSection({
  layout,
  onLayoutChange,
  totalPages,
  pages = [],
}: FormLayoutSectionProps) {
  const [layoutBuilderOpen, setLayoutBuilderOpen] = useState(false);

  const handleAddLayout = () => {
    setLayoutBuilderOpen(true);
  };

  const handleEditLayout = () => {
    setLayoutBuilderOpen(true);
  };

  const handleSaveLayout = (newLayout: LayoutConfig) => {
    onLayoutChange(newLayout);
    setLayoutBuilderOpen(false);
  };

  const handleDeleteLayout = () => {
    onLayoutChange(null);
  };

  return (
    <Box>
      <SectionHeader>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Form Layout
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure multi-step form layout and navigation
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<LayoutGrid size={18} />}
          onClick={handleAddLayout}
          sx={{
            bgcolor: 'secondary.main',
            '&:hover': { bgcolor: 'secondary.dark' },
          }}
        >
          {layout ? 'Edit Layout' : 'Add Layout'}
        </Button>
      </SectionHeader>

      {layout ? (
        <Stack spacing={2}>
          <LayoutCard variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <LayoutIconBox>
                  <LayoutGrid size={20} color="white" />
                </LayoutIconBox>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {layout.name}
                  </Typography>
                  {layout.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {layout.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Stepper: ${layout.stepperStyle}`}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                    <Chip
                      label={`Header: ${layout.headerElements.length} elements`}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                    <Chip
                      label={`Footer: ${layout.footerElements.length} elements`}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
              <Button
                size="small"
                startIcon={<Edit2 size={14} />}
                onClick={handleEditLayout}
                sx={{ color: 'primary.main' }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<Trash2 size={14} />}
                onClick={handleDeleteLayout}
              >
                Delete
              </Button>
            </CardActions>
          </LayoutCard>
        </Stack>
      ) : (
        <EmptyLayoutBox>
          <LayoutGrid size={48} style={{ color: '#999', marginBottom: 16 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            No Layout Configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add a layout to configure your multi-step form navigation and UI
          </Typography>
          <Button variant="outlined" startIcon={<Plus size={16} />} onClick={handleAddLayout}>
            Configure Layout
          </Button>
        </EmptyLayoutBox>
      )}

      <LayoutBuilder
        open={layoutBuilderOpen}
        onClose={() => setLayoutBuilderOpen(false)}
        onSave={handleSaveLayout}
        editingLayout={layout}
        totalPages={totalPages}
        pages={pages}
      />
    </Box>
  );
}

// Styled Components
const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

const LayoutCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.2s',
  backgroundColor: theme.palette.primary.lighter || theme.palette.grey[50],
  borderColor: theme.palette.primary.light,
  '&:hover': {
    boxShadow: theme.shadows[3],
    borderColor: theme.palette.primary.main,
  },
}));

const LayoutIconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const EmptyLayoutBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6),
  border: '2px dashed',
  borderColor: theme.palette.primary.light,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.lighter || theme.palette.grey[50],
}));
