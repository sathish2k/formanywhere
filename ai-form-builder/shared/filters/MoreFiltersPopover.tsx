/**
 * More Filters Popover Component
 * Additional filter options in a popover
 */

'use client';

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface MoreFiltersPopoverProps {
  statuses: string[];
  onStatusesChange: (statuses: string[]) => void;
}

const AVAILABLE_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export function MoreFiltersPopover({ statuses, onStatusesChange }: MoreFiltersPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStatusToggle = (status: string) => {
    if (statuses.includes(status)) {
      onStatusesChange(statuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...statuses, status]);
    }
  };

  const handleClear = () => {
    onStatusesChange([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasActiveFilters = statuses.length > 0;

  return (
    <>
      <FilterButton
        variant="outlined"
        startIcon={<SlidersHorizontal size={16} />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        hasValue={hasActiveFilters}
      >
        More Filters
        {hasActiveFilters && <CountBadge>{statuses.length}</CountBadge>}
      </FilterButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              mt: 1,
              width: 280,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Form Status
          </Typography>

          <FormGroup>
            {AVAILABLE_STATUSES.map((status) => (
              <FormControlLabel
                key={status.value}
                control={
                  <Checkbox
                    checked={statuses.includes(status.value)}
                    onChange={() => handleStatusToggle(status.value)}
                    size="small"
                    sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                  />
                }
                label={<Typography variant="body2">{status.label}</Typography>}
                sx={{ '&:hover': { bgcolor: 'grey.100', borderRadius: 1 } }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1}>
            <ClearButton size="small" variant="outlined" fullWidth onClick={handleClear}>
              Clear
            </ClearButton>
            <ApplyButton size="small" variant="contained" fullWidth onClick={handleClose}>
              Apply
            </ApplyButton>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

// Styled Components
const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})<{ hasValue?: boolean }>(({ theme, hasValue }) => ({
  color: theme.palette.text.secondary,
  borderColor: hasValue ? theme.palette.primary.main : theme.palette.grey[300],
  backgroundColor: hasValue ? `${theme.palette.primary.main}14` : 'transparent',
  textTransform: 'none',
  gap: 8,
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: hasValue ? `${theme.palette.primary.main}1F` : theme.palette.grey[100],
  },
}));

const CountBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontSize: '0.625rem',
  fontWeight: 700,
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 4,
}));

const ClearButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100],
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  '&:hover': {
    boxShadow: `0px 8px 16px 0px ${theme.palette.primary.main}3D`,
  },
}));
