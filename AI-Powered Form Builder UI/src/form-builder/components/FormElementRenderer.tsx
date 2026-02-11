/**
 * Form Element Renderer
 * Renders individual form elements based on their type
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Chip,
  Divider,
  Button,
  alpha,
} from '@mui/material';
import { X, AlertCircle, Upload as UploadIcon, Star, Grid3x3, Plus } from 'lucide-react';
import { DroppedElement } from '../types/form.types';
import { GridLayoutDialog } from './GridLayoutDialog';
import { GridColumnElement } from './GridColumnElement';

interface FormElementRendererProps {
  element: DroppedElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDropInside?: (e: React.DragEvent, parentId: string, columnIndex?: number) => void;
  onNestedElementSelect?: (id: string) => void;
  onNestedElementRemove?: (id: string) => void;
  selectedElementId?: string | null;
  onCreateGrid?: (parentId: string, gridLayout: any) => void;
  onUpdateElement?: (id: string, updates: Partial<DroppedElement>) => void; // Add this for width updates
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = (({
  element,
  isSelected,
  onSelect,
  onRemove,
  onDragOver,
  onDropInside,
  onNestedElementSelect,
  onNestedElementRemove,
  selectedElementId,
  onCreateGrid,
  onUpdateElement,
}) => {
  const Icon = element.icon;
  const isLayoutElement = element.isLayoutElement;
  
  // Grid layout dialog state
  const [gridDialogOpen, setGridDialogOpen] = useState(false);

  // Helper to render nested elements
  const renderNestedElements = (children: DroppedElement[] | undefined, spacing: number = 16) => {
    if (!children || children.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        {children.map((child, index) => (
          <Box 
            key={child.id} 
            sx={{ mb: index < children.length - 1 ? `${spacing}px` : 0 }}
          >
            <FormElementRenderer
              element={child}
              isSelected={selectedElementId === child.id}
              onSelect={() => onNestedElementSelect?.(child.id)}
              onRemove={() => onNestedElementRemove?.(child.id)}
              onDragOver={onDragOver}
              onDropInside={onDropInside}
              onNestedElementSelect={onNestedElementSelect}
              onNestedElementRemove={onNestedElementRemove}
              selectedElementId={selectedElementId}
              onCreateGrid={onCreateGrid}
              onUpdateElement={onUpdateElement}
            />
          </Box>
        ))}
      </Box>
    );
  };

  // Helper for drop zones
  const renderDropZone = (text: string, parentId: string, columnIndex?: number) => (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropInside?.(e, parentId, columnIndex);
      }}
      sx={{
        minHeight: 80,
        p: 2,
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );

  const renderElementContent = () => {
    switch (element.type) {
      case 'section':
        return (
          <>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: element.sectionBgColor || 'background.paper',
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              {/* Add Grid Button - Show when section is empty or selected */}
              {isSelected && (!element.children || element.children.length === 0) && (
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Grid3x3 size={18} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGridDialogOpen(true);
                    }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                    }}
                  >
                    Create Grid Layout
                  </Button>
                </Box>
              )}
              
              {element.children && element.children.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {renderNestedElements(element.children, element.sectionSpacing ?? 16)}
                </Box>
              )}
              {/* Always show drop zone to allow adding more elements */}
              {renderDropZone(
                element.children && element.children.length > 0 
                  ? 'Drop more elements here' 
                  : 'Drop elements here to add to section', 
                element.id
              )}
            </Paper>

            {/* Grid Layout Dialog */}
            <GridLayoutDialog
              open={gridDialogOpen}
              onClose={() => setGridDialogOpen(false)}
              onSelect={(layout) => {
                onCreateGrid?.(element.id, layout);
                setGridDialogOpen(false);
              }}
            />
          </>
        );

      case 'card':
        return (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {element.children && element.children.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {renderNestedElements(element.children, 16)}
              </Box>
            )}
            {/* Always show drop zone to allow adding more elements */}
            {renderDropZone(
              element.children && element.children.length > 0 
                ? 'Drop more elements here' 
                : 'Drop elements here to add to card', 
              element.id
            )}
          </Paper>
        );

      case 'columns-2':
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${element.columnSpacing ?? 16}px` }}>
            <Box>
              {element.column1Children && element.column1Children.length > 0 ? (
                renderNestedElements(element.column1Children)
              ) : (
                renderDropZone('Drop in Column 1', element.id, 0)
              )}
            </Box>
            <Box>
              {element.column2Children && element.column2Children.length > 0 ? (
                renderNestedElements(element.column2Children)
              ) : (
                renderDropZone('Drop in Column 2', element.id, 1)
              )}
            </Box>
          </Box>
        );

      case 'columns-3':
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${element.columnSpacing ?? 16}px` }}>
            <Box>
              {element.column1Children && element.column1Children.length > 0 ? (
                renderNestedElements(element.column1Children)
              ) : (
                renderDropZone('Drop in Column 1', element.id, 0)
              )}
            </Box>
            <Box>
              {element.column2Children && element.column2Children.length > 0 ? (
                renderNestedElements(element.column2Children)
              ) : (
                renderDropZone('Drop in Column 2', element.id, 1)
              )}
            </Box>
            <Box>
              {element.column3Children && element.column3Children.length > 0 ? (
                renderNestedElements(element.column3Children)
              ) : (
                renderDropZone('Drop in Column 3', element.id, 2)
              )}
            </Box>
          </Box>
        );

      case 'divider':
        return (
          <Divider
            sx={{
              my: 2,
              borderColor: element.dividerColor || 'divider',
              borderWidth: element.dividerThickness || 1,
            }}
          />
        );

      case 'spacer':
        return (
          <Box
            sx={{
              height: element.spacerHeight || 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {element.spacerHeight || 24}px spacing
            </Typography>
          </Box>
        );

      case 'heading':
        return (
          <Typography
            variant={element.headingLevel || 'h5'}
            sx={{
              fontWeight: element.headingWeight || 600,
              color: element.headingColor || 'text.primary',
            }}
          >
            {element.headingText || 'Heading Text'}
          </Typography>
        );

      case 'text-block':
        return (
          <Typography
            variant="body1"
            sx={{
              color: element.textBlockColor || 'text.secondary',
              textAlign: element.textBlockAlign || 'left',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {element.textBlockContent || 'Add your text content here...'}
          </Typography>
        );

      case 'container':
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Container - Drop elements here
            </Typography>
          </Paper>
        );

      case 'stack':
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Stack Layout - Vertical arrangement
            </Typography>
          </Paper>
        );

      case 'grid':
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Grid Layout - Column arrangement
            </Typography>
          </Paper>
        );

      case 'logo':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <img
              src={element.logoUrl || 'https://via.placeholder.com/150x50?text=Your+Logo'}
              alt={element.logoAlt || 'Logo'}
              style={{ maxWidth: '150px', height: 'auto' }}
            />
          </Box>
        );

      case 'short-text':
      case 'email':
      case 'phone':
      case 'number':
      case 'url':
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
            type={
              element.type === 'email'
                ? 'email'
                : element.type === 'number'
                ? 'number'
                : 'text'
            }
            variant={element.inputVariant || 'outlined'}
          />
        );

      case 'long-text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={element.placeholder || 'Enter your text here...'}
            variant={element.inputVariant || 'outlined'}
          />
        );

      case 'dropdown':
        return (
          <FormControl fullWidth size="small">
            <Select defaultValue="">
              <MenuItem value="">Select an option</MenuItem>
              {element.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <RadioGroup>
            {element.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={<Radio size="small" />}
                label={option}
              />
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <Box>
            {element.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={<Checkbox size="small" />}
                label={option}
              />
            ))}
          </Box>
        );

      case 'switch':
        return <FormControlLabel control={<Switch />} label="Yes/No" />;

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            size="small"
            variant={element.inputVariant || 'outlined'}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'time':
        return (
          <TextField
            fullWidth
            type="time"
            size="small"
            variant={element.inputVariant || 'outlined'}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'file-upload':
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <UploadIcon size={20} color="#919EAB" style={{ marginBottom: 8 }} />
            <Typography variant="body2" color="text.secondary">
              Drag and drop file here or{' '}
              <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                Choose file
              </Typography>
            </Typography>
          </Paper>
        );

      case 'rating':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                color="#FFB020"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        );

      case 'grid-column':
        return (
          <GridColumnElement
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onRemove={onRemove}
            onUpdateWidth={(breakpoint, value) => {
              const updates: Partial<DroppedElement> = {};
              const key = `gridItem${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}` as keyof DroppedElement;
              updates[key] = value as any;
              onUpdateElement?.(element.id, updates);
            }}
            onDragOver={onDragOver}
            onDropInside={onDropInside}
            renderDropZone={renderDropZone}
            renderNestedElements={renderNestedElements}
          />
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            {element.label}
          </Typography>
        );
    }
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      sx={{
        mb: 3,
        p: 2,
        border: 2,
        borderColor: isSelected
          ? 'primary.main'
          : isLayoutElement
          ? 'info.main'
          : 'transparent',
        borderStyle: isSelected ? 'solid' : isLayoutElement ? 'solid' : 'dashed',
        borderRadius: 1,
        position: 'relative',
        bgcolor: isLayoutElement ? 'info.lighter' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
        },
        '&:hover .delete-button': {
          opacity: isLayoutElement ? 0 : 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: element.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} color="white" strokeWidth={2} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {element.label}{' '}
          {element.required && (
            <Typography component="span" color="error">
              *
            </Typography>
          )}
        </Typography>

        {isLayoutElement && (
          <Chip
            label="Global Layout"
            size="small"
            sx={{
              ml: 1,
              height: 20,
              fontSize: '0.7rem',
              bgcolor: 'info.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {renderElementContent()}

      {element.validation?.message && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <AlertCircle size={14} color="#FF5630" />
          <Typography variant="caption" color="error">
            {element.validation.message}
          </Typography>
        </Box>
      )}

      {!isLayoutElement && (
        <Box
          className="delete-button"
          sx={{
            position: 'absolute',
            right: -12,
            top: -12,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
});