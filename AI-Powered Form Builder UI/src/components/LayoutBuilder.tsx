import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
  Tooltip,
  Collapse,
  InputAdornment,
} from '@mui/material';
import {
  X,
  GripVertical,
  Heading,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Circle,
  LayoutGrid,
  Plus,
  Trash2,
  Settings,
  Search,
  ChevronDown,
  MousePointer2,
  Sparkles,
  Columns2,
  Columns3,
} from 'lucide-react';

export interface LayoutElement {
  id: string;
  type: 'stepper' | 'heading' | 'nextButton' | 'backButton' | 'nextArrow' | 'backArrow' | 'progressBar' | 'pageIndicator' | 'breadcrumb' | 'twoColumn' | 'threeColumn';
  label?: string;
  position?: 'left' | 'center' | 'right';
  variant?: string;
  // Stepper-specific properties
  orientation?: 'horizontal' | 'vertical';
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  stepperVariant?: 'dots' | 'numbers' | 'progress' | 'text';
  icon?: string;
  config?: Record<string, any>;
  children?: {
    column1?: LayoutElement[];
    column2?: LayoutElement[];
    column3?: LayoutElement[];
  };
}

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  headerElements: LayoutElement[];
  footerElements: LayoutElement[];
  stepperPosition: 'top' | 'left' | 'none';
  stepperStyle: 'dots' | 'numbers' | 'progress' | 'arrows';
}

interface LayoutBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (layout: LayoutConfig) => void;
  editingLayout?: LayoutConfig | null;
  totalPages: number;
}

interface LayoutElementType {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const LAYOUT_ELEMENTS: LayoutElementType[] = [
  {
    id: 'stepper',
    type: 'stepper',
    label: 'Step Indicator',
    icon: <LayoutGrid size={18} />,
    description: 'Visual step progress',
    category: 'Navigation',
  },
  {
    id: 'heading',
    type: 'heading',
    label: 'Heading',
    icon: <Heading size={18} />,
    description: 'Page title/heading',
    category: 'Content',
  },
  {
    id: 'progressBar',
    type: 'progressBar',
    label: 'Progress Bar',
    icon: <Circle size={18} />,
    description: 'Linear progress',
    category: 'Navigation',
  },
  {
    id: 'breadcrumb',
    type: 'breadcrumb',
    label: 'Breadcrumb',
    icon: <ChevronRight size={18} />,
    description: 'Page breadcrumb',
    category: 'Navigation',
  },
  {
    id: 'nextButton',
    type: 'nextButton',
    label: 'Next Button',
    icon: <ChevronRight size={18} />,
    description: 'Next page button',
    category: 'Actions',
  },
  {
    id: 'backButton',
    type: 'backButton',
    label: 'Back Button',
    icon: <ChevronLeft size={18} />,
    description: 'Previous page button',
    category: 'Actions',
  },
  {
    id: 'nextArrow',
    type: 'nextArrow',
    label: 'Next Arrow',
    icon: <ArrowRight size={18} />,
    description: 'Icon-only next',
    category: 'Actions',
  },
  {
    id: 'backArrow',
    type: 'backArrow',
    label: 'Back Arrow',
    icon: <ArrowLeft size={18} />,
    description: 'Icon-only back',
    category: 'Actions',
  },
  {
    id: 'pageIndicator',
    type: 'pageIndicator',
    label: 'Page Counter',
    icon: <Circle size={18} />,
    description: 'Current page number',
    category: 'Navigation',
  },
  {
    id: 'twoColumn',
    type: 'twoColumn',
    label: 'Two Columns',
    icon: <Columns2 size={18} />,
    description: 'Two-column layout',
    category: 'Content',
  },
  {
    id: 'threeColumn',
    type: 'threeColumn',
    label: 'Three Columns',
    icon: <Columns3 size={18} />,
    description: 'Three-column layout',
    category: 'Content',
  },
];

const ELEMENT_CATEGORIES = ['Navigation', 'Content', 'Actions'];

export function LayoutBuilder({
  open,
  onClose,
  onSave,
  editingLayout,
  totalPages,
}: LayoutBuilderProps) {
  const [layoutName, setLayoutName] = useState(editingLayout?.name || 'Default Layout');
  const [layoutDescription, setLayoutDescription] = useState(editingLayout?.description || '');
  const [headerElements, setHeaderElements] = useState<LayoutElement[]>(
    editingLayout?.headerElements || []
  );
  const [footerElements, setFooterElements] = useState<LayoutElement[]>(
    editingLayout?.footerElements || []
  );
  const [stepperPosition, setStepperPosition] = useState<'top' | 'left' | 'none'>(
    editingLayout?.stepperPosition || 'none'
  );
  const [stepperStyle, setStepperStyle] = useState<'dots' | 'numbers' | 'progress' | 'arrows'>(
    editingLayout?.stepperStyle || 'numbers'
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Navigation': true,
    'Content': true,
    'Actions': true,
  });
  const [draggedElement, setDraggedElement] = useState<LayoutElementType | null>(null);

  // Helper function to find element including nested elements in columns
  const findElement = (elementId: string, elements: LayoutElement[]): LayoutElement | null => {
    for (const el of elements) {
      if (el.id === elementId) return el;
      
      // Check inside column children
      if (el.children) {
        if (el.children.column1) {
          const found = findElement(elementId, el.children.column1);
          if (found) return found;
        }
        if (el.children.column2) {
          const found = findElement(elementId, el.children.column2);
          if (found) return found;
        }
        if (el.children.column3) {
          const found = findElement(elementId, el.children.column3);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const selectedElement = selectedElementId
    ? findElement(selectedElementId, [...headerElements, ...footerElements])
    : null;

  const selectedElementTarget = selectedElementId
    ? findElement(selectedElementId, headerElements)
      ? 'header'
      : 'footer'
    : null;

  const handleDragStart = (e: React.DragEvent, element: LayoutElementType) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, target: 'header' | 'footer') => {
    e.preventDefault();
    if (!draggedElement) return;

    const newElement: LayoutElement = {
      id: `${draggedElement.type}-${Date.now()}`,
      type: draggedElement.type as any,
      label: draggedElement.label,
      position: 'center',
      variant: 'contained',
      showLabel: true,
      config: {},
    };

    // Add children property for column layouts
    if (draggedElement.type === 'twoColumn') {
      newElement.children = { column1: [], column2: [] };
    } else if (draggedElement.type === 'threeColumn') {
      newElement.children = { column1: [], column2: [], column3: [] };
    }

    if (target === 'header') {
      setHeaderElements([...headerElements, newElement]);
    } else {
      setFooterElements([...footerElements, newElement]);
    }

    setDraggedElement(null);
  };

  const handleDropInColumn = (
    e: React.DragEvent,
    parentElementId: string,
    columnKey: 'column1' | 'column2' | 'column3',
    target: 'header' | 'footer'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedElement) return;

    const newElement: LayoutElement = {
      id: `${draggedElement.type}-${Date.now()}`,
      type: draggedElement.type as any,
      label: draggedElement.label,
      position: 'center',
      variant: 'contained',
      showLabel: true,
      config: {},
    };

    const updateElements = (elements: LayoutElement[]): LayoutElement[] => {
      return elements.map((el) => {
        if (el.id === parentElementId && el.children) {
          return {
            ...el,
            children: {
              ...el.children,
              [columnKey]: [...(el.children[columnKey] || []), newElement],
            },
          };
        }
        return el;
      });
    };

    if (target === 'header') {
      setHeaderElements(updateElements(headerElements));
    } else {
      setFooterElements(updateElements(footerElements));
    }

    setDraggedElement(null);
  };

  const handleRemoveElement = (elementId: string, target: 'header' | 'footer') => {
    if (target === 'header') {
      setHeaderElements(headerElements.filter((e) => e.id !== elementId));
    } else {
      setFooterElements(footerElements.filter((e) => e.id !== elementId));
    }
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleRemoveElementFromColumn = (
    parentElementId: string,
    columnKey: 'column1' | 'column2' | 'column3',
    elementId: string,
    target: 'header' | 'footer'
  ) => {
    const updateElements = (elements: LayoutElement[]): LayoutElement[] => {
      return elements.map((el) => {
        if (el.id === parentElementId && el.children) {
          return {
            ...el,
            children: {
              ...el.children,
              [columnKey]: (el.children[columnKey] || []).filter((child) => child.id !== elementId),
            },
          };
        }
        return el;
      });
    };

    if (target === 'header') {
      setHeaderElements(updateElements(headerElements));
    } else {
      setFooterElements(updateElements(footerElements));
    }

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleUpdateElement = (updates: Partial<LayoutElement>) => {
    if (!selectedElementId || !selectedElementTarget) return;

    const updateElements = (elements: LayoutElement[]): LayoutElement[] => {
      return elements.map((el) => {
        if (el.id === selectedElementId) {
          return { ...el, ...updates };
        }
        
        // Update nested elements in columns
        if (el.children) {
          return {
            ...el,
            children: {
              column1: el.children.column1 ? updateElements(el.children.column1) : undefined,
              column2: el.children.column2 ? updateElements(el.children.column2) : undefined,
              column3: el.children.column3 ? updateElements(el.children.column3) : undefined,
            },
          };
        }
        
        return el;
      });
    };

    if (selectedElementTarget === 'header') {
      setHeaderElements(updateElements(headerElements));
    } else {
      setFooterElements(updateElements(footerElements));
    }
  };

  const handleSave = () => {
    const layout: LayoutConfig = {
      id: editingLayout?.id || `layout-${Date.now()}`,
      name: layoutName,
      description: layoutDescription,
      headerElements,
      footerElements,
      stepperPosition,
      stepperStyle,
    };
    onSave(layout);
    onClose();
  };

  const filteredElements = LAYOUT_ELEMENTS.filter(
    (el) =>
      el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedElements = filteredElements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, LayoutElementType[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderStepperPreview = () => {
    if (stepperPosition === 'none') return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {stepperStyle === 'dots' &&
            Array.from({ length: totalPages }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: i === 0 ? 'primary.main' : 'action.disabled',
                }}
              />
            ))}
          {stepperStyle === 'numbers' &&
            Array.from({ length: totalPages }).map((_, i) => (
              <Chip
                key={i}
                label={i + 1}
                size="small"
                sx={{
                  bgcolor: i === 0 ? 'primary.main' : 'action.disabled',
                  color: i === 0 ? 'white' : 'text.secondary',
                  fontWeight: 700,
                  minWidth: 32,
                  height: 32,
                }}
              />
            ))}
          {stepperStyle === 'progress' && (
            <Box
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 1,
                bgcolor: 'action.disabled',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(1 / totalPages) * 100}%`,
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s',
                }}
              />
            </Box>
          )}
          {stepperStyle === 'arrows' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArrowLeft size={16} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Step 1 of {totalPages}
              </Typography>
              <ArrowRight size={16} />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Helper function to render smaller versions of elements inside columns
  const renderSmallElement = (element: LayoutElement) => {
    switch (element.type) {
      case 'heading':
        return (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {element.label || 'Heading'}
          </Typography>
        );
      case 'nextButton':
        return (
          <Button variant={element.variant as any || 'contained'} size="small" endIcon={<ChevronRight size={14} />}>
            {element.label || 'Next'}
          </Button>
        );
      case 'backButton':
        return (
          <Button variant={element.variant as any || 'outlined'} size="small" startIcon={<ChevronLeft size={14} />}>
            {element.label || 'Back'}
          </Button>
        );
      case 'nextArrow':
        return (
          <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <ArrowRight size={16} />
          </IconButton>
        );
      case 'backArrow':
        return (
          <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowLeft size={16} />
          </IconButton>
        );
      case 'progressBar':
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ height: 6, borderRadius: 1, bgcolor: 'action.disabled', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '33%', bgcolor: 'primary.main' }} />
            </Box>
          </Box>
        );
      case 'breadcrumb':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption">Step 1</Typography>
            <ChevronRight size={12} />
            <Typography variant="caption" fontWeight={600}>Step 2</Typography>
          </Box>
        );
      case 'pageIndicator':
        return (
          <Chip label={`Page 1 of ${totalPages}`} size="small" sx={{ bgcolor: alpha('#FF3B30', 0.12), color: 'primary.main', height: 24 }} />
        );
      case 'stepper':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
              <Chip
                key={i}
                label={i + 1}
                size="small"
                sx={{
                  bgcolor: i === 0 ? 'primary.main' : 'action.disabled',
                  color: i === 0 ? 'white' : 'text.secondary',
                  minWidth: 24,
                  height: 24,
                }}
              />
            ))}
          </Box>
        );
      default:
        return <Typography variant="caption">{element.label}</Typography>;
    }
  };

  // Helper function to render column children with alignment support
  const renderColumnChildren = (
    children: LayoutElement[],
    parentElementId: string,
    columnKey: 'column1' | 'column2' | 'column3',
    target: 'header' | 'footer'
  ) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {children.map((child) => (
          <Box
            key={child.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElementId(child.id);
            }}
            sx={{
              position: 'relative',
              p: 1.5,
              border: '1px solid',
              borderColor: selectedElementId === child.id ? 'primary.main' : 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
              display: 'flex',
              justifyContent: child.position === 'left' ? 'flex-start' : child.position === 'right' ? 'flex-end' : 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveElementFromColumn(parentElementId, columnKey, child.id, target);
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'error.lighter',
                  color: 'error.main',
                },
              }}
            >
              <X size={12} />
            </IconButton>
            {renderSmallElement(child)}
          </Box>
        ))}
      </Box>
    );
  };

  const renderElementCard = (element: LayoutElement, target: 'header' | 'footer') => {
    const elementDef = LAYOUT_ELEMENTS.find((e) => e.type === element.type);
    const isSelected = selectedElementId === element.id;

    // Render the actual element based on type
    const renderActualElement = () => {
      const justifyContent = element.position === 'left' ? 'flex-start' : element.position === 'right' ? 'flex-end' : 'center';
      
      switch (element.type) {
        case 'heading':
          return (
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                textAlign: element.position === 'left' ? 'left' : element.position === 'right' ? 'right' : 'center',
              }}
            >
              {element.label || 'Page Heading'}
            </Typography>
          );
        
        case 'nextButton':
          return (
            <Button
              variant={element.variant as any || 'contained'}
              endIcon={<ChevronRight size={18} />}
              sx={{ minWidth: 120 }}
            >
              {element.showLabel !== false ? (element.label || 'Next') : <ChevronRight size={18} />}
            </Button>
          );
        
        case 'backButton':
          return (
            <Button
              variant={element.variant as any || 'outlined'}
              startIcon={<ChevronLeft size={18} />}
              sx={{ minWidth: 120 }}
            >
              {element.showLabel !== false ? (element.label || 'Back') : <ChevronLeft size={18} />}
            </Button>
          );
        
        case 'nextArrow':
          return (
            <IconButton
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ArrowRight size={20} />
            </IconButton>
          );
        
        case 'backArrow':
          return (
            <IconButton
              sx={{
                bgcolor: 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          );
        
        case 'progressBar':
          return (
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'action.disabled',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '33%',
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s',
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                Step 1 of {totalPages}
              </Typography>
            </Box>
          );
        
        case 'breadcrumb':
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Personal Info
              </Typography>
              <ChevronRight size={16} style={{ color: '#919EAB' }} />
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Contact Details
              </Typography>
              <ChevronRight size={16} style={{ color: '#919EAB' }} />
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Review
              </Typography>
            </Box>
          );
        
        case 'pageIndicator':
          return (
            <Chip
              label={`Page 1 of ${totalPages}`}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: alpha('#FF3B30', 0.12),
                color: 'primary.main',
              }}
            />
          );
        
        case 'stepper':
          return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Chip
                  key={i}
                  label={i + 1}
                  size="small"
                  sx={{
                    bgcolor: i === 0 ? 'primary.main' : 'action.disabled',
                    color: i === 0 ? 'white' : 'text.secondary',
                    fontWeight: 700,
                    minWidth: 32,
                    height: 32,
                  }}
                />
              ))}
            </Box>
          );
        
        case 'twoColumn':
          return (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
              {/* Column 1 */}
              <Box
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropInColumn(e, element.id, 'column1', target)}
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: (element.children?.column1?.length || 0) > 0 ? 'primary.light' : 'divider',
                  borderRadius: 1,
                  bgcolor: (element.children?.column1?.length || 0) > 0 ? alpha('#FF3B30', 0.02) : 'background.paper',
                  minHeight: 80,
                  transition: 'all 0.2s',
                }}
              >
                {(element.children?.column1?.length || 0) > 0 ? (
                  renderColumnChildren(element.children!.column1!, element.id, 'column1', target)
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Column 1
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Column 2 */}
              <Box
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropInColumn(e, element.id, 'column2', target)}
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: (element.children?.column2?.length || 0) > 0 ? 'primary.light' : 'divider',
                  borderRadius: 1,
                  bgcolor: (element.children?.column2?.length || 0) > 0 ? alpha('#FF3B30', 0.02) : 'background.paper',
                  minHeight: 80,
                  transition: 'all 0.2s',
                }}
              >
                {(element.children?.column2?.length || 0) > 0 ? (
                  renderColumnChildren(element.children!.column2!, element.id, 'column2', target)
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Column 2
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        
        case 'threeColumn':
          return (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, width: '100%' }}>
              {/* Column 1 */}
              <Box
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropInColumn(e, element.id, 'column1', target)}
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: (element.children?.column1?.length || 0) > 0 ? 'primary.light' : 'divider',
                  borderRadius: 1,
                  bgcolor: (element.children?.column1?.length || 0) > 0 ? alpha('#FF3B30', 0.02) : 'background.paper',
                  minHeight: 80,
                  transition: 'all 0.2s',
                }}
              >
                {(element.children?.column1?.length || 0) > 0 ? (
                  renderColumnChildren(element.children!.column1!, element.id, 'column1', target)
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Column 1
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Column 2 */}
              <Box
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropInColumn(e, element.id, 'column2', target)}
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: (element.children?.column2?.length || 0) > 0 ? 'primary.light' : 'divider',
                  borderRadius: 1,
                  bgcolor: (element.children?.column2?.length || 0) > 0 ? alpha('#FF3B30', 0.02) : 'background.paper',
                  minHeight: 80,
                  transition: 'all 0.2s',
                }}
              >
                {(element.children?.column2?.length || 0) > 0 ? (
                  renderColumnChildren(element.children!.column2!, element.id, 'column2', target)
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Column 2
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Column 3 */}
              <Box
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropInColumn(e, element.id, 'column3', target)}
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: (element.children?.column3?.length || 0) > 0 ? 'primary.light' : 'divider',
                  borderRadius: 1,
                  bgcolor: (element.children?.column3?.length || 0) > 0 ? alpha('#FF3B30', 0.02) : 'background.paper',
                  minHeight: 80,
                  transition: 'all 0.2s',
                }}
              >
                {(element.children?.column3?.length || 0) > 0 ? (
                  renderColumnChildren(element.children!.column3!, element.id, 'column3', target)
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Column 3
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        
        default:
          return <Typography variant="body2">{element.label}</Typography>;
      }
    };

    return (
      <Box
        key={element.id}
        onClick={() => setSelectedElementId(element.id)}
        sx={{
          position: 'relative',
          mb: 2,
          borderRadius: 2,
          border: '2px solid',
          borderColor: isSelected ? 'primary.main' : 'transparent',
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isSelected ? `0 0 0 4px ${alpha('#FF3B30', 0.12)}` : 'none',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 4px ${alpha('#FF3B30', 0.08)}`,
          },
        }}
      >
        {/* Controls Overlay - Shows on Hover */}
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: -12,
            zIndex: 10,
            display: 'flex',
            gap: 0.5,
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s',
            '.MuiBox-root:hover &': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            sx={{
              width: 28,
              height: 28,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              },
            }}
          >
            <GripVertical size={14} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveElement(element.id, target);
            }}
            sx={{
              width: 28,
              height: 28,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'error.lighter',
                color: 'error.main',
              },
            }}
          >
            <Trash2 size={14} />
          </IconButton>
        </Box>

        {/* Element Label Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: 12,
            zIndex: 5,
          }}
        >
          <Chip
            icon={elementDef?.icon as any}
            label={elementDef?.label}
            size="small"
            sx={{
              height: 20,
              bgcolor: 'background.paper',
              boxShadow: 1,
              fontSize: '0.6875rem',
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: '0.875rem',
                color: 'primary.main',
              },
            }}
          />
        </Box>

        {/* Actual Element Render */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: element.position === 'left' ? 'flex-start' : element.position === 'right' ? 'flex-end' : 'center',
            alignItems: 'center',
          }}
        >
          {renderActualElement()}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: { height: '90vh', maxWidth: '90vw' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #FF3B30 0%, #D32F2F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
                }}
              >
                <Sparkles size={22} color="white" strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Layout Builder
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Design your multi-step form layout
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained" disabled={!layoutName}>
                Save Layout
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar - Elements */}
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '2px 0 8px rgba(145, 158, 171, 0.04)',
            }}
          >
            {/* Sidebar Header */}
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: 'text.primary',
                  fontSize: '1rem',
                }}
              >
                Layout Elements
              </Typography>
              <TextField
                fullWidth
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} style={{ color: '#919EAB' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.100',
                    border: 'none',
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                    '&.Mui-focused': {
                      bgcolor: 'background.paper',
                      boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.24)}`,
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: 1.25,
                  },
                }}
              />
            </Box>

            {/* Elements by Category */}
            <Box sx={{ overflowY: 'auto', flex: 1, px: 2, pb: 2 }}>
              {ELEMENT_CATEGORIES.map((category) => {
                const elements = groupedElements[category] || [];
                if (elements.length === 0) return null;

                const isExpanded = searchQuery ? true : (expandedCategories[category] ?? true);

                return (
                  <Box key={category} sx={{ mb: 1.5 }}>
                    {/* Category Header */}
                    <Box
                      onClick={() => !searchQuery && toggleCategory(category)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        py: 1,
                        px: 1.5,
                        cursor: searchQuery ? 'default' : 'pointer',
                        borderRadius: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: searchQuery ? 'transparent' : alpha('#919EAB', 0.08),
                        },
                      }}
                    >
                      {!searchQuery &&
                        (isExpanded ? (
                          <ChevronDown size={16} style={{ color: '#637381' }} />
                        ) : (
                          <ChevronRight size={16} style={{ color: '#637381' }} />
                        ))}
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.6875rem',
                          color: 'text.secondary',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {category}
                      </Typography>
                    </Box>

                    {/* Elements */}
                    <Collapse in={isExpanded} timeout="auto">
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 0.5, px: 0.5 }}>
                        {elements.map((element) => (
                          <Tooltip key={element.type} title={`Drag to add ${element.label}`} placement="right" arrow>
                            <Box
                              draggable
                              onDragStart={(e) => handleDragStart(e, element)}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                p: 1.5,
                                borderRadius: 2,
                                cursor: 'grab',
                                transition: 'all 0.2s',
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: alpha('#FF3B30', 0.04),
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2,
                                },
                                '&:active': {
                                  cursor: 'grabbing',
                                  transform: 'translateY(0)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1.5,
                                  bgcolor: alpha('#FF3B30', 0.12),
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {element.icon}
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.6875rem',
                                  textAlign: 'center',
                                  color: 'text.secondary',
                                  lineHeight: 1.2,
                                }}
                              >
                                {element.label}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Center Canvas */}
          <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, p: 4 }}>
              <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                {/* Layout Details */}
                <Paper sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)' }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Layout Name"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={layoutDescription}
                      onChange={(e) => setLayoutDescription(e.target.value)}
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Stack>
                </Paper>

                {/* Header Section */}
                <Paper
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'header')}
                  sx={{
                    p: 3,
                    mb: 3,
                    minHeight: 200,
                    border: '2px dashed',
                    borderColor: headerElements.length === 0 ? 'divider' : 'primary.light',
                    bgcolor: headerElements.length === 0 ? 'background.paper' : alpha('#FF3B30', 0.02),
                    boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label="HEADER"
                      size="small"
                      sx={{
                        bgcolor: alpha('#FF3B30', 0.12),
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Drag elements here for header section
                    </Typography>
                  </Box>

                  {stepperPosition === 'top' && renderStepperPreview()}

                  {headerElements.length > 0 ? (
                    headerElements.map((element) => renderElementCard(element, 'header'))
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 6,
                        gap: 2,
                      }}
                    >
                      <MousePointer2 size={48} style={{ color: '#919EAB', opacity: 0.3 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Drag elements from the left sidebar
                        <br />
                        to build your header layout
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {/* Content Placeholder */}
                <Paper
                  sx={{
                    p: 4,
                    mb: 3,
                    bgcolor: 'action.hover',
                    border: '1px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Form Content Area
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your form pages will be displayed here
                  </Typography>
                </Paper>

                {/* Footer Section */}
                <Paper
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'footer')}
                  sx={{
                    p: 3,
                    minHeight: 200,
                    border: '2px dashed',
                    borderColor: footerElements.length === 0 ? 'divider' : 'primary.light',
                    bgcolor: footerElements.length === 0 ? 'background.paper' : alpha('#FF3B30', 0.02),
                    boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label="FOOTER"
                      size="small"
                      sx={{
                        bgcolor: alpha('#FF3B30', 0.12),
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Drag elements here for footer section
                    </Typography>
                  </Box>

                  {footerElements.length > 0 ? (
                    footerElements.map((element) => renderElementCard(element, 'footer'))
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 6,
                        gap: 2,
                      }}
                    >
                      <MousePointer2 size={48} style={{ color: '#919EAB', opacity: 0.3 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Drag elements from the left sidebar
                        <br />
                        to build your footer layout
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          </Box>

          {/* Right Panel - Properties */}
          <Box
            sx={{
              width: 320,
              flexShrink: 0,
              borderLeft: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto',
              boxShadow: '-2px 0 8px rgba(145, 158, 171, 0.04)',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  {selectedElement ? 'Element Properties' : 'Layout Properties'}
                </Typography>
                {selectedElement && (
                  <IconButton size="small" onClick={() => setSelectedElementId(null)}>
                    <X size={18} />
                  </IconButton>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {selectedElement && selectedElementTarget ? (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                      Label
                    </Typography>
                    <TextField
                      fullWidth
                      value={selectedElement.label}
                      onChange={(e) => handleUpdateElement({ label: e.target.value })}
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                      Position
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedElement.position || 'center'}
                        onChange={(e) => handleUpdateElement({ position: e.target.value as any })}
                      >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {(selectedElement.type === 'nextButton' || selectedElement.type === 'backButton') && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                        Variant
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={selectedElement.variant || 'contained'}
                          onChange={(e) => handleUpdateElement({ variant: e.target.value })}
                        >
                          <MenuItem value="contained">Contained</MenuItem>
                          <MenuItem value="outlined">Outlined</MenuItem>
                          <MenuItem value="text">Text</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {selectedElement.type === 'stepper' && (
                    <>
                      <Divider />
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                          Orientation
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedElement.orientation || 'horizontal'}
                            onChange={(e) => handleUpdateElement({ orientation: e.target.value as any })}
                          >
                            <MenuItem value="horizontal">Horizontal</MenuItem>
                            <MenuItem value="vertical">Vertical</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                          Style
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedElement.stepperVariant || 'numbers'}
                            onChange={(e) => handleUpdateElement({ stepperVariant: e.target.value as any })}
                          >
                            <MenuItem value="dots">Dots</MenuItem>
                            <MenuItem value="numbers">Numbers</MenuItem>
                            <MenuItem value="progress">Progress Bar</MenuItem>
                            <MenuItem value="text">Text Labels</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                          Alternative Label
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedElement.alternativeLabel ? 'true' : 'false'}
                            onChange={(e) => handleUpdateElement({ alternativeLabel: e.target.value === 'true' })}
                          >
                            <MenuItem value="false">Disabled</MenuItem>
                            <MenuItem value="true">Enabled</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Show labels below step icons
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
                          Non-linear
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedElement.nonLinear ? 'true' : 'false'}
                            onChange={(e) => handleUpdateElement({ nonLinear: e.target.value === 'true' })}
                          >
                            <MenuItem value="false">Disabled</MenuItem>
                            <MenuItem value="true">Enabled</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Allow users to navigate to any step
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
                      Drag and drop layout elements from the left sidebar to build your header and footer sections.
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6, fontWeight: 600 }}>
                      💡 Tip: Select an element to edit its properties.
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}