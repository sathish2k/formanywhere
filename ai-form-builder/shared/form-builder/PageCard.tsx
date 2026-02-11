/**
 * Page Card
 * Reusable card component for form pages in setup
 */

'use client';

import type { PageData } from '@/components/form-builder/form-builder.configuration';
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { Edit2, GripVertical, Trash2 } from 'lucide-react';

interface PageCardProps {
  page: PageData;
  index: number;
  onEdit: (page: PageData) => void;
  onDelete: (pageId: string) => void;
  canDelete: boolean;
}

export function PageCard({ page, index, onEdit, onDelete, canDelete }: PageCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              color: 'text.secondary',
            }}
          >
            <GripVertical size={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label={`${index + 1}`}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 700,
                  minWidth: 28,
                  height: 24,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {page.name}
              </Typography>
            </Box>
            {page.description && (
              <Typography variant="body2" color="text.secondary">
                {page.description}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<Edit2 size={14} />}
          onClick={() => onEdit(page)}
          sx={{ color: 'primary.main' }}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<Trash2 size={14} />}
          onClick={() => onDelete(page.id)}
          disabled={!canDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
