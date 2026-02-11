/**
 * Date Range Filter Component
 * Reusable date range picker with chips
 */

'use client';

import { Box, Button, Chip, Popover, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangeFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const hasValue = Boolean(dateFrom || dateTo);

  return (
    <>
      <Tooltip
        title={
          hasValue ? (
            <Box>
              {dateFrom && <Typography variant="caption">From: {dateFrom}</Typography>}
              {dateFrom && dateTo && <br />}
              {dateTo && <Typography variant="caption">To: {dateTo}</Typography>}
            </Box>
          ) : (
            ''
          )
        }
        arrow
        placement="top"
      >
        <FilterButton
          variant="outlined"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<ChevronDown size={16} />}
          hasValue={hasValue}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden' }}
          >
            <Calendar size={16} />
            {hasValue ? (
              <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                {dateFrom && (
                  <StyledChip
                    label={dateFrom}
                    size="small"
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDateFromChange('');
                    }}
                  />
                )}
                {dateTo && (
                  <StyledChip
                    label={dateTo}
                    size="small"
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDateToChange('');
                    }}
                  />
                )}
              </Stack>
            ) : (
              <Typography variant="body2">Date Range</Typography>
            )}
          </Box>
        </FilterButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              mt: 1,
              p: 2,
              width: 280,
            },
          },
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
      </Popover>
    </>
  );
}

// Styled Components
const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})<{ hasValue: boolean }>(({ theme, hasValue }) => ({
  minWidth: 150,
  maxWidth: 250,
  justifyContent: 'space-between',
  color: theme.palette.text.secondary,
  borderColor: hasValue ? theme.palette.primary.main : theme.palette.grey[300],
  backgroundColor: hasValue ? `${theme.palette.primary.main}14` : 'transparent',
  textTransform: 'none',
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: hasValue ? `${theme.palette.primary.main}1F` : theme.palette.grey[100],
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 20,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
  '& .MuiChip-deleteIcon': {
    color: 'white',
    fontSize: '0.875rem',
    '&:hover': { color: 'rgba(255,255,255,0.8)' },
  },
}));
