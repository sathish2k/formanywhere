/**
 * Form Pages Section
 * Page list with add, edit, delete functionality
 */

'use client';

import type { PageData } from '@/components/form-setup/form-setup.configuration';
import { PageCard } from '@/shared/form-builder';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

interface FormPagesSectionProps {
  pages: PageData[];
  onAddPage: () => void;
  onEditPage: (page: PageData) => void;
  onDeletePage: (pageId: string) => void;
}

export function FormPagesSection({
  pages,
  onAddPage,
  onEditPage,
  onDeletePage,
}: FormPagesSectionProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Form Pages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your form into multiple pages
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={onAddPage}>
          Add Page
        </Button>
      </Box>

      <Stack spacing={2}>
        {pages.map((page, index) => (
          <PageCard
            key={page.id}
            page={page}
            index={index}
            onEdit={onEditPage}
            onDelete={onDeletePage}
            canDelete={pages.length > 1}
          />
        ))}
      </Stack>
    </Box>
  );
}
