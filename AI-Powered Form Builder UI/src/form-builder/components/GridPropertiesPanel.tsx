/**
 * Grid Properties Panel
 * Comprehensive controls for MUI Grid Container properties
 */

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { ChevronDown, Grid as GridIcon, AlignLeft, AlignCenter, Layout } from 'lucide-react';
import { DroppedElement } from '../types/form.types';

interface GridPropertiesPanelProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function GridPropertiesPanel({ element, onUpdate }: GridPropertiesPanelProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GridIcon size={20} />
        Grid Container Properties
      </Typography>

      {/* Basic Grid Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ChevronDown size={18} />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Basic Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Grid Columns */}
            <FormControl fullWidth size="small">
              <InputLabel>Grid Columns</InputLabel>
              <Select
                value={element.gridColumns || 12}
                label="Grid Columns"
                onChange={(e) => onUpdate({ gridColumns: Number(e.target.value) })}
              >
                <MenuItem value={1}>1 Column</MenuItem>
                <MenuItem value={2}>2 Columns</MenuItem>
                <MenuItem value={3}>3 Columns</MenuItem>
                <MenuItem value={4}>4 Columns</MenuItem>
                <MenuItem value={6}>6 Columns</MenuItem>
                <MenuItem value={8}>8 Columns</MenuItem>
                <MenuItem value={12}>12 Columns (Default)</MenuItem>
                <MenuItem value={16}>16 Columns</MenuItem>
                <MenuItem value={24}>24 Columns</MenuItem>
              </Select>
            </FormControl>

            {/* Spacing */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                Spacing: {element.gridSpacing || 2}
              </Typography>
              <Slider
                value={element.gridSpacing || 2}
                onChange={(_, value) => onUpdate({ gridSpacing: value as number })}
                min={0}
                max={10}
                step={0.5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Row Spacing */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                Row Spacing: {element.gridRowSpacing !== undefined ? element.gridRowSpacing : 'Auto'}
              </Typography>
              <Slider
                value={element.gridRowSpacing !== undefined ? element.gridRowSpacing : element.gridSpacing || 2}
                onChange={(_, value) => onUpdate({ gridRowSpacing: value as number })}
                min={0}
                max={10}
                step={0.5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Column Spacing */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
                Column Spacing: {element.gridColumnSpacing !== undefined ? element.gridColumnSpacing : 'Auto'}
              </Typography>
              <Slider
                value={element.gridColumnSpacing !== undefined ? element.gridColumnSpacing : element.gridSpacing || 2}
                onChange={(_, value) => onUpdate({ gridColumnSpacing: value as number })}
                min={0}
                max={10}
                step={0.5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Layout & Direction */}
      <Accordion>
        <AccordionSummary expandIcon={<ChevronDown size={18} />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Layout & Direction
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Direction */}
            <FormControl fullWidth size="small">
              <InputLabel>Direction</InputLabel>
              <Select
                value={element.gridDirection || 'row'}
                label="Direction"
                onChange={(e) => onUpdate({ gridDirection: e.target.value as any })}
              >
                <MenuItem value="row">Row (Horizontal)</MenuItem>
                <MenuItem value="row-reverse">Row Reverse</MenuItem>
                <MenuItem value="column">Column (Vertical)</MenuItem>
                <MenuItem value="column-reverse">Column Reverse</MenuItem>
              </Select>
            </FormControl>

            {/* Wrap */}
            <FormControl fullWidth size="small">
              <InputLabel>Wrapping</InputLabel>
              <Select
                value={element.gridWrap || 'wrap'}
                label="Wrapping"
                onChange={(e) => onUpdate({ gridWrap: e.target.value as any })}
              >
                <MenuItem value="wrap">Wrap</MenuItem>
                <MenuItem value="nowrap">No Wrap</MenuItem>
                <MenuItem value="wrap-reverse">Wrap Reverse</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Alignment */}
      <Accordion>
        <AccordionSummary expandIcon={<ChevronDown size={18} />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Alignment
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Justify Content (Horizontal) */}
            <FormControl fullWidth size="small">
              <InputLabel>Justify Content (Horizontal)</InputLabel>
              <Select
                value={element.gridJustifyContent || 'flex-start'}
                label="Justify Content (Horizontal)"
                onChange={(e) => onUpdate({ gridJustifyContent: e.target.value as any })}
              >
                <MenuItem value="flex-start">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlignLeft size={14} />
                    Start
                  </Box>
                </MenuItem>
                <MenuItem value="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlignCenter size={14} />
                    Center
                  </Box>
                </MenuItem>
                <MenuItem value="flex-end">End</MenuItem>
                <MenuItem value="space-between">Space Between</MenuItem>
                <MenuItem value="space-around">Space Around</MenuItem>
                <MenuItem value="space-evenly">Space Evenly</MenuItem>
              </Select>
            </FormControl>

            {/* Align Items (Vertical) */}
            <FormControl fullWidth size="small">
              <InputLabel>Align Items (Vertical)</InputLabel>
              <Select
                value={element.gridAlignItems || 'stretch'}
                label="Align Items (Vertical)"
                onChange={(e) => onUpdate({ gridAlignItems: e.target.value as any })}
              >
                <MenuItem value="flex-start">Start</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="flex-end">End</MenuItem>
                <MenuItem value="stretch">Stretch</MenuItem>
                <MenuItem value="baseline">Baseline</MenuItem>
              </Select>
            </FormControl>

            {/* Align Content (Multi-row) */}
            <FormControl fullWidth size="small">
              <InputLabel>Align Content (Multi-row)</InputLabel>
              <Select
                value={element.gridAlignContent || 'flex-start'}
                label="Align Content (Multi-row)"
                onChange={(e) => onUpdate({ gridAlignContent: e.target.value as any })}
              >
                <MenuItem value="flex-start">Start</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="flex-end">End</MenuItem>
                <MenuItem value="space-between">Space Between</MenuItem>
                <MenuItem value="space-around">Space Around</MenuItem>
                <MenuItem value="stretch">Stretch</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Grid Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'info.main', display: 'block', mb: 1 }}>
          Grid System Info
        </Typography>
        <Stack spacing={0.5}>
          <Chip
            label={`${element.rows?.length || 0} Row(s)`}
            size="small"
            sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600 }}
          />
          <Chip
            label={`${element.rows?.[0]?.length || 0} Column(s) in Row 1`}
            size="small"
            sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600 }}
          />
          <Typography variant="caption" color="info.main" sx={{ mt: 1 }}>
            {element.gridColumns || 12}-column grid system
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
