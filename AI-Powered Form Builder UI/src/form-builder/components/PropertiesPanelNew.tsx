/**
 * Comprehensive Properties Panel Component
 * Organized properties with Universal, Element-Specific, and Advanced tabs
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Chip,
  Paper,
} from '@mui/material';
import {
  X,
  Settings,
  Palette,
  Code,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Square,
  Type,
} from 'lucide-react';
import { DroppedElement } from '../types/form.types';
import { GridPropertiesPanel } from './GridPropertiesPanel';

interface PropertiesPanelNewProps {
  selectedElement: DroppedElement | null;
  onUpdateElement: (id: string, updates: Partial<DroppedElement>) => void;
  onClose: () => void;
  allElements?: DroppedElement[];
}

const DRAWER_WIDTH = 360;

export function PropertiesPanelNew({
  selectedElement,
  onUpdateElement,
  onClose,
  allElements = [],
}: PropertiesPanelNewProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!selectedElement) return null;

  const handleUpdate = (updates: Partial<DroppedElement>) => {
    onUpdateElement(selectedElement.id, updates);
  };

  // Determine which element-specific properties to show
  const isTextInput = ['short-text', 'long-text', 'email', 'url'].includes(selectedElement.type);
  const isNumberInput = selectedElement.type === 'number';
  const isTextarea = selectedElement.type === 'long-text';
  const isDropdown = selectedElement.type === 'dropdown';
  const isCheckbox = selectedElement.type === 'checkbox';
  const isRadio = selectedElement.type === 'radio';
  const isSwitch = selectedElement.type === 'switch';
  const isDatePicker = ['date', 'time'].includes(selectedElement.type);
  const isFileUpload = selectedElement.type === 'file-upload';
  const isRating = selectedElement.type === 'rating';
  const isSection = selectedElement.type === 'section';
  const isHeading = selectedElement.type === 'heading';
  const isLogo = selectedElement.type === 'logo';
  const isDivider = selectedElement.type === 'divider';
  const isSpacer = selectedElement.type === 'spacer';
  const isTextBlock = selectedElement.type === 'text-block';
  const isGridContainer = selectedElement.type === 'grid-container';

  // Determine if element is a form input (needs form properties like required, disabled)
  const isFormInput = isTextInput || isNumberInput || isTextarea || isDropdown || 
                      isCheckbox || isRadio || isSwitch || isDatePicker || 
                      isFileUpload || isRating;
  
  // Layout elements don't need form properties
  const isLayoutElement = isSection || isHeading || isLogo || isDivider || isSpacer || 
                          isTextBlock || selectedElement.type === 'card' ||
                          selectedElement.type.includes('columns');

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        bgcolor: '#FFFFFF',
        borderLeft: '1px solid #E8EAED',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #E8EAED',
          bgcolor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: selectedElement.color + '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <selectedElement.icon size={16} color={selectedElement.color} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {selectedElement.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Properties
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{
          borderBottom: '1px solid #E8EAED',
          bgcolor: '#FAFAFA',
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
          },
        }}
      >
        <Tab label="Basic" icon={<Settings size={14} />} iconPosition="start" />
        <Tab label="Style" icon={<Palette size={14} />} iconPosition="start" />
        <Tab label="Advanced" icon={<Code size={14} />} iconPosition="start" />
      </Tabs>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* GRID CONTAINER - Special Panel */}
        {isGridContainer ? (
          <GridPropertiesPanel element={selectedElement} onUpdate={handleUpdate} />
        ) : (
          <>
        {/* BASIC TAB */}
        {activeTab === 0 && (
          <Stack spacing={2}>
            {/* Label */}
            <TextField
              fullWidth
              size="small"
              label="Label"
              value={selectedElement.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />

            {/* Helper Text */}
            <TextField
              fullWidth
              size="small"
              label="Helper Text"
              value={selectedElement.helperText || ''}
              onChange={(e) => handleUpdate({ helperText: e.target.value })}
              placeholder="Add description or help text"
            />

            {/* Placeholder (Text inputs only) */}
            {isTextInput && (
              <TextField
                fullWidth
                size="small"
                label="Placeholder"
                value={selectedElement.placeholder || ''}
                onChange={(e) => handleUpdate({ placeholder: e.target.value })}
              />
            )}

            {/* Default Value */}
            <TextField
              fullWidth
              size="small"
              label="Default Value"
              value={selectedElement.defaultValue || ''}
              onChange={(e) => handleUpdate({ defaultValue: e.target.value })}
            />

            <Divider />

            {/* Required */}
            {isFormInput && (
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={selectedElement.required || false}
                    onChange={(e) => handleUpdate({ required: e.target.checked })}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Required</Typography>
                    <Chip label="Validation" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                  </Box>
                }
              />
            )}

            {/* Visible */}
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={selectedElement.visible !== false}
                  onChange={(e) => handleUpdate({ visible: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedElement.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  <Typography variant="body2">Visible</Typography>
                </Box>
              }
            />

            {/* Disabled */}
            {isFormInput && (
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={selectedElement.disabled || false}
                    onChange={(e) => handleUpdate({ disabled: e.target.checked })}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedElement.disabled ? <Lock size={14} /> : <Unlock size={14} />}
                    <Typography variant="body2">Disabled</Typography>
                  </Box>
                }
              />
            )}

            <Divider />

            {/* Element-Specific Properties */}
            {/* TEXT INPUT PROPERTIES */}
            {isTextInput && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Text Input Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Min Length"
                      value={selectedElement.minLength || ''}
                      onChange={(e) => handleUpdate({ minLength: parseInt(e.target.value) || undefined })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Max Length"
                      value={selectedElement.maxLength || ''}
                      onChange={(e) => handleUpdate({ maxLength: parseInt(e.target.value) || undefined })}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Autocomplete</InputLabel>
                      <Select
                        value={selectedElement.autocomplete || 'off'}
                        onChange={(e) => handleUpdate({ autocomplete: e.target.value as 'on' | 'off' })}
                        label="Autocomplete"
                      >
                        <MenuItem value="on">On</MenuItem>
                        <MenuItem value="off">Off</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.clearable || false}
                          onChange={(e) => handleUpdate({ clearable: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Clear Button</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* NUMBER INPUT PROPERTIES */}
            {isNumberInput && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Number Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Min Value"
                      value={selectedElement.minValue || ''}
                      onChange={(e) => handleUpdate({ minValue: parseFloat(e.target.value) || undefined })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Max Value"
                      value={selectedElement.maxValue || ''}
                      onChange={(e) => handleUpdate({ maxValue: parseFloat(e.target.value) || undefined })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Step Value"
                      value={selectedElement.stepValue || 1}
                      onChange={(e) => handleUpdate({ stepValue: parseFloat(e.target.value) || 1 })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Decimal Places"
                      value={selectedElement.precision || 0}
                      onChange={(e) => handleUpdate({ precision: parseInt(e.target.value) || 0 })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Unit (₹, $, %, kg)"
                      value={selectedElement.unit || ''}
                      onChange={(e) => handleUpdate({ unit: e.target.value })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.showArrows !== false}
                          onChange={(e) => handleUpdate({ showArrows: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Arrows</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* TEXTAREA PROPERTIES */}
            {isTextarea && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Textarea Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Rows"
                      value={selectedElement.rows || 4}
                      onChange={(e) => handleUpdate({ rows: parseInt(e.target.value) || 4 })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.autoResize || false}
                          onChange={(e) => handleUpdate({ autoResize: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Auto Resize</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.characterCounter || false}
                          onChange={(e) => handleUpdate({ characterCounter: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Character Count</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.richText || false}
                          onChange={(e) => handleUpdate({ richText: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Rich Text Editor</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* DROPDOWN/SELECT PROPERTIES */}
            {isDropdown && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Dropdown Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Options (comma-separated)"
                      value={selectedElement.options?.join(', ') || ''}
                      onChange={(e) =>
                        handleUpdate({ options: e.target.value.split(',').map((o) => o.trim()) })
                      }
                      multiline
                      rows={3}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.multipleSelect || false}
                          onChange={(e) => handleUpdate({ multipleSelect: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Multiple Selection</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.searchable || false}
                          onChange={(e) => handleUpdate({ searchable: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Searchable</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.clearable || false}
                          onChange={(e) => handleUpdate({ clearable: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Clearable</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* CHECKBOX/RADIO PROPERTIES */}
            {(isCheckbox || isRadio) && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    {isCheckbox ? 'Checkbox' : 'Radio'} Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Options (comma-separated)"
                      value={selectedElement.options?.join(', ') || ''}
                      onChange={(e) =>
                        handleUpdate({ options: e.target.value.split(',').map((o) => o.trim()) })
                      }
                      multiline
                      rows={3}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Layout</InputLabel>
                      <Select
                        value={selectedElement.layout || 'vertical'}
                        onChange={(e) => handleUpdate({ layout: e.target.value as 'vertical' | 'horizontal' })}
                        label="Layout"
                      >
                        <MenuItem value="vertical">Vertical</MenuItem>
                        <MenuItem value="horizontal">Horizontal</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* SWITCH/TOGGLE PROPERTIES */}
            {isSwitch && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Toggle Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="On Label"
                      value={selectedElement.onLabel || 'Yes'}
                      onChange={(e) => handleUpdate({ onLabel: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Off Label"
                      value={selectedElement.offLabel || 'No'}
                      onChange={(e) => handleUpdate({ offLabel: e.target.value })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.defaultState || false}
                          onChange={(e) => handleUpdate({ defaultState: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Default State (On)</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* DATE/TIME PICKER PROPERTIES */}
            {isDatePicker && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Date/Time Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.disablePastDates || false}
                          onChange={(e) => handleUpdate({ disablePastDates: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Disable Past Dates</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.disableFutureDates || false}
                          onChange={(e) => handleUpdate({ disableFutureDates: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Disable Future Dates</Typography>}
                    />
                    {selectedElement.type === 'date' && (
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={selectedElement.timeSelection || false}
                            onChange={(e) => handleUpdate({ timeSelection: e.target.checked })}
                          />
                        }
                        label={<Typography variant="body2">Include Time Selection</Typography>}
                      />
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* FILE UPLOAD PROPERTIES */}
            {isFileUpload && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    File Upload Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Allowed File Types"
                      value={selectedElement.allowedFileTypes?.join(', ') || ''}
                      onChange={(e) =>
                        handleUpdate({ allowedFileTypes: e.target.value.split(',').map((t) => t.trim()) })
                      }
                      placeholder=".pdf, .jpg, .png"
                      helperText="Comma-separated extensions"
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Max File Size (MB)"
                      value={selectedElement.maxFileSize || 10}
                      onChange={(e) => handleUpdate({ maxFileSize: parseInt(e.target.value) || 10 })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.multipleFiles || false}
                          onChange={(e) => handleUpdate({ multipleFiles: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Allow Multiple Files</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.dragDropEnabled !== false}
                          onChange={(e) => handleUpdate({ dragDropEnabled: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Drag & Drop Enabled</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.previewEnabled !== false}
                          onChange={(e) => handleUpdate({ previewEnabled: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Preview</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* RATING PROPERTIES */}
            {isRating && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Rating Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Maximum Rating"
                      value={selectedElement.ratingMax || 5}
                      onChange={(e) => handleUpdate({ ratingMax: parseInt(e.target.value) || 5 })}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Icon Type</InputLabel>
                      <Select
                        value={selectedElement.ratingIcon || 'star'}
                        onChange={(e) => handleUpdate({ ratingIcon: e.target.value as 'star' | 'heart' | 'circle' })}
                        label="Icon Type"
                      >
                        <MenuItem value="star">Star</MenuItem>
                        <MenuItem value="heart">Heart</MenuItem>
                        <MenuItem value="circle">Circle</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.showValue !== false}
                          onChange={(e) => handleUpdate({ showValue: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Value</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* SECTION PROPERTIES */}
            {isSection && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Section Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Title"
                      value={selectedElement.sectionTitle || ''}
                      onChange={(e) => handleUpdate({ sectionTitle: e.target.value })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.collapsible || false}
                          onChange={(e) => handleUpdate({ collapsible: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Collapsible</Typography>}
                    />
                    {selectedElement.collapsible && (
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={selectedElement.defaultExpanded !== false}
                            onChange={(e) => handleUpdate({ defaultExpanded: e.target.checked })}
                          />
                        }
                        label={<Typography variant="body2">Default Expanded</Typography>}
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={selectedElement.showBorder !== false}
                          onChange={(e) => handleUpdate({ showBorder: e.target.checked })}
                        />
                      }
                      label={<Typography variant="body2">Show Border</Typography>}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* HEADING PROPERTIES */}
            {isHeading && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Heading Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Heading Text"
                      value={selectedElement.headingText || ''}
                      onChange={(e) => handleUpdate({ headingText: e.target.value })}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={selectedElement.headingLevel || 'h2'}
                        onChange={(e) =>
                          handleUpdate({ headingLevel: e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' })
                        }
                        label="Level"
                      >
                        <MenuItem value="h1">H1</MenuItem>
                        <MenuItem value="h2">H2</MenuItem>
                        <MenuItem value="h3">H3</MenuItem>
                        <MenuItem value="h4">H4</MenuItem>
                        <MenuItem value="h5">H5</MenuItem>
                        <MenuItem value="h6">H6</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Font Weight"
                      value={selectedElement.headingWeight || 600}
                      onChange={(e) => handleUpdate({ headingWeight: parseInt(e.target.value) || 600 })}
                      inputProps={{ min: 100, max: 900, step: 100 }}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* LOGO PROPERTIES */}
            {isLogo && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Logo Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Logo URL"
                      value={selectedElement.logoUrl || ''}
                      onChange={(e) => handleUpdate({ logoUrl: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Alt Text"
                      value={selectedElement.logoAlt || ''}
                      onChange={(e) => handleUpdate({ logoAlt: e.target.value })}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* TEXT BLOCK PROPERTIES */}
            {isTextBlock && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Text Block Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Content"
                      value={selectedElement.textBlockContent || ''}
                      onChange={(e) => handleUpdate({ textBlockContent: e.target.value })}
                      multiline
                      rows={4}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* DIVIDER PROPERTIES */}
            {isDivider && (
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Divider Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Thickness (px)"
                      value={selectedElement.dividerThickness || 1}
                      onChange={(e) => handleUpdate({ dividerThickness: parseInt(e.target.value) || 1 })}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* SPACER PROPERTIES */}
            {isSpacer && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    Spacer Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Height (px)"
                      value={selectedElement.spacerHeight || 24}
                      onChange={(e) => handleUpdate({ spacerHeight: parseInt(e.target.value) || 24 })}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}
          </Stack>
        )}

        {/* STYLE TAB */}
        {activeTab === 1 && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Layout & Spacing
            </Typography>

            {/* Width */}
            <FormControl fullWidth size="small">
              <InputLabel>Width</InputLabel>
              <Select
                value={selectedElement.width || 'full'}
                onChange={(e) => handleUpdate({ width: e.target.value as 'auto' | 'full' | 'custom' })}
                label="Width"
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="full">Full Width</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>

            {selectedElement.width === 'custom' && (
              <TextField
                fullWidth
                size="small"
                label="Custom Width"
                value={selectedElement.customWidth || '50%'}
                onChange={(e) => handleUpdate({ customWidth: e.target.value })}
                placeholder="50%, 300px, etc."
              />
            )}

            {/* Alignment */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={selectedElement.alignment || 'left'}
                exclusive
                onChange={(_, value) => value && handleUpdate({ alignment: value })}
                size="small"
                fullWidth
              >
                <ToggleButton value="left">
                  <AlignLeft size={16} />
                </ToggleButton>
                <ToggleButton value="center">
                  <AlignCenter size={16} />
                </ToggleButton>
                <ToggleButton value="right">
                  <AlignRight size={16} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Size */}
            <FormControl fullWidth size="small">
              <InputLabel>Size</InputLabel>
              <Select
                value={selectedElement.size || 'medium'}
                onChange={(e) => handleUpdate({ size: e.target.value as 'small' | 'medium' | 'large' })}
                label="Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>

            {/* Variant (for inputs) */}
            {(isTextInput || isNumberInput || isTextarea || isDropdown) && (
              <FormControl fullWidth size="small">
                <InputLabel>Variant</InputLabel>
                <Select
                  value={selectedElement.inputVariant || 'outlined'}
                  onChange={(e) =>
                    handleUpdate({ inputVariant: e.target.value as 'outlined' | 'filled' | 'standard' })
                  }
                  label="Variant"
                >
                  <MenuItem value="outlined">Outlined</MenuItem>
                  <MenuItem value="filled">Filled</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                </Select>
              </FormControl>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Margins */}
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                  Margins
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Top: {selectedElement.marginTop || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.marginTop || 0}
                      onChange={(_, value) => handleUpdate({ marginTop: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Bottom: {selectedElement.marginBottom || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.marginBottom || 0}
                      onChange={(_, value) => handleUpdate({ marginBottom: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Left: {selectedElement.marginLeft || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.marginLeft || 0}
                      onChange={(_, value) => handleUpdate({ marginLeft: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Right: {selectedElement.marginRight || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.marginRight || 0}
                      onChange={(_, value) => handleUpdate({ marginRight: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Paddings */}
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                  Padding
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Top: {selectedElement.paddingTop || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.paddingTop || 0}
                      onChange={(_, value) => handleUpdate({ paddingTop: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Bottom: {selectedElement.paddingBottom || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.paddingBottom || 0}
                      onChange={(_, value) => handleUpdate({ paddingBottom: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Left: {selectedElement.paddingLeft || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.paddingLeft || 0}
                      onChange={(_, value) => handleUpdate({ paddingLeft: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Right: {selectedElement.paddingRight || 0}px
                    </Typography>
                    <Slider
                      value={selectedElement.paddingRight || 0}
                      onChange={(_, value) => handleUpdate({ paddingRight: value as number })}
                      min={0}
                      max={100}
                      size="small"
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Border Radius */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Border Radius: {selectedElement.borderRadius || 4}px
              </Typography>
              <Slider
                value={selectedElement.borderRadius || 4}
                onChange={(_, value) => handleUpdate({ borderRadius: value as number })}
                min={0}
                max={50}
                size="small"
              />
            </Box>

            {/* Color Theme */}
            <TextField
              fullWidth
              size="small"
              label="Color Theme"
              type="color"
              value={selectedElement.colorTheme || selectedElement.color}
              onChange={(e) => handleUpdate({ colorTheme: e.target.value })}
            />
          </Stack>
        )}

        {/* ADVANCED TAB */}
        {activeTab === 2 && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Advanced Settings
            </Typography>

            {/* Custom Class */}
            <TextField
              fullWidth
              size="small"
              label="Custom CSS Class"
              value={selectedElement.customClass || ''}
              onChange={(e) => handleUpdate({ customClass: e.target.value })}
              placeholder="my-custom-class"
            />

            {/* Custom Style */}
            <TextField
              fullWidth
              size="small"
              label="Custom Inline Styles"
              value={selectedElement.customStyle || ''}
              onChange={(e) => handleUpdate({ customStyle: e.target.value })}
              multiline
              rows={3}
              placeholder='{"backgroundColor": "#fff"}'
              helperText="JSON format"
            />

            <Divider sx={{ my: 2 }} />

            {/* Element Info */}
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8F9FA' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Element Information
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">ID:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {selectedElement.id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Type:</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {selectedElement.type}
                  </Typography>
                </Box>
                {selectedElement.isLayoutElement && (
                  <Chip label="Layout Element" size="small" color="primary" sx={{ mt: 1 }} />
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
          </>
        )}
      </Box>
    </Box>
  );
}