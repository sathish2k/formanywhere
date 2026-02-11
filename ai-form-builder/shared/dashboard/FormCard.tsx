/**
 * Form Card Component
 * Individual form card with actions - matches reference design
 */

'use client';

import type { FormData } from '@/components/dashboard/dashboard.configuration';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Copy, Edit2, ExternalLink, Eye, Info, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FormCardProps {
  form: FormData;
  onEdit?: (formId: string) => void;
  onDuplicate?: (formId: string) => void;
  onDelete?: (formId: string) => void;
  onView?: (formId: string) => void;
}

export function FormCard({ form, onEdit, onDuplicate, onDelete, onView }: FormCardProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    handleMenuClose();
    action();
  };

  return (
    <StyledPaper elevation={0}>
      {/* Card Preview with Form Name */}
      <CardPreview style={{ background: form.color }}>
        <PreviewPaper>
          <Typography variant="caption" color="text.secondary">
            {form.name}
          </Typography>
        </PreviewPaper>
      </CardPreview>

      {/* Card Content */}
      <CardContent>
        {/* Header with Responses and Menu */}
        <CardHeader>
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {form.responses} Responses
          </Typography>
          <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'text.secondary' }}>
            <MoreVertical size={16} />
          </IconButton>
        </CardHeader>

        {/* Footer with Creator and Info */}
        <CardFooter>
          <CreatorInfo>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.625rem',
                bgcolor: 'primary.main',
              }}
            >
              {form.creator.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {form.creator}
            </Typography>
          </CreatorInfo>
          <IconButton size="small" sx={{ color: 'text.disabled' }}>
            <Info size={16} />
          </IconButton>
        </CardFooter>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              borderRadius: 2,
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            },
          },
        }}
      >
        <MenuItem onClick={() => handleAction(() => onEdit?.(form.id))} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Edit2 size={16} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onView?.(form.id))} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Eye size={16} />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onDuplicate?.(form.id))} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Copy size={16} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ExternalLink size={16} />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => handleAction(() => onDelete?.(form.id))}
          sx={{ gap: 1.5, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 'auto', color: 'error.main' }}>
            <Trash2 size={16} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </StyledPaper>
  );
}

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  border: '1px solid transparent',
  boxShadow:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow:
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 16px 32px -4px rgba(145, 158, 171, 0.16)',
    transform: 'translateY(-4px)',
  },
}));

const CardPreview = styled(Box)(({ theme }) => ({
  height: 140,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: theme.spacing(2),
}));

const PreviewPaper = styled(Paper)(({ theme }) => ({
  width: '85%',
  height: '75%',
  backgroundColor: 'white',
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.08)',
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});

const CardFooter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CreatorInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});
