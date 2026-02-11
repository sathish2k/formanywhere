/**
 * Layout Builder
 * Main dialog component for configuring form layout
 * Uses modular subcomponents and styled components
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, Paper, Stack, TextField, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { Sparkles } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LayoutSettingsFormData,
  layoutSettingsDefaults,
  layoutSettingsSchema,
} from './layout-builder.configuration';

import { DropZone } from './drop-zone';
import { ElementCard } from './element-card';
import { PropertiesPanel } from './properties-panel';
// Import subcomponents
import { Sidebar } from './sidebar';

// Import modular elements
import {
  BackArrow,
  BackButton,
  Breadcrumb,
  type ElementDefinition,
  Heading,
  LAYOUT_ELEMENTS,
  type LayoutElement,
  NextArrow,
  NextButton,
  PageIndicator,
  ProgressBar,
  Stepper,
  ThreeColumn,
  TwoColumn,
} from './elements';

import type { LayoutConfig, PageData } from '@/components/form-setup/form-setup.configuration';

// Types
export type { LayoutElement } from './elements';

interface LayoutBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (layout: LayoutConfig) => void;
  editingLayout?: LayoutConfig | null;
  totalPages: number;
  pages?: PageData[];
}

export function LayoutBuilder({
  open,
  onClose,
  onSave,
  editingLayout,
  totalPages,
  pages = [],
}: LayoutBuilderProps) {
  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<LayoutSettingsFormData>({
    resolver: zodResolver(layoutSettingsSchema),
    defaultValues: layoutSettingsDefaults,
  });

  // Watch form values for conditional rendering
  const stepperPosition = watch('stepperPosition');
  const _stepperStyle = watch('stepperStyle');

  // State for non-form data
  const [headerElements, setHeaderElements] = useState<LayoutElement[]>([]);
  const [footerElements, setFooterElements] = useState<LayoutElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Navigation: true,
    Content: true,
    Actions: true,
  });
  const [draggedElement, setDraggedElement] = useState<ElementDefinition | null>(null);

  // Initialize with editing layout
  useEffect(() => {
    if (editingLayout) {
      reset({
        layoutName: editingLayout.name,
        layoutDescription: editingLayout.description,
        stepperPosition: editingLayout.stepperPosition,
        stepperStyle: editingLayout.stepperStyle,
      });
      setHeaderElements(editingLayout.headerElements);
      setFooterElements(editingLayout.footerElements);
    } else {
      reset(layoutSettingsDefaults);
      setHeaderElements([]);
      setFooterElements([]);
    }
    setSelectedElementId(null);
  }, [editingLayout, open, reset]);

  // Handlers
  const handleDragStart = (e: React.DragEvent, element: ElementDefinition) => {
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
      type: draggedElement.type,
      label: draggedElement.label,
      position: 'center',
      variant: 'contained',
      showLabel: true,
    };

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
    parentId: string,
    columnKey: 'column1' | 'column2' | 'column3',
    target: 'header' | 'footer'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedElement) return;

    const newElement: LayoutElement = {
      id: `${draggedElement.type}-${Date.now()}`,
      type: draggedElement.type,
      label: draggedElement.label,
      position: 'center',
      variant: 'contained',
      showLabel: true,
    };

    const updateColumnChildren = (list: LayoutElement[]) =>
      list.map((el) => {
        if (el.id === parentId) {
          const existingChildren = el.children?.[columnKey] || [];
          return {
            ...el,
            children: {
              ...el.children,
              [columnKey]: [...existingChildren, newElement],
            },
          };
        }
        return el;
      });

    if (target === 'header') {
      setHeaderElements(updateColumnChildren(headerElements));
    } else {
      setFooterElements(updateColumnChildren(footerElements));
    }
    setDraggedElement(null);
  };

  const handleRemoveElement = (elementId: string, target: 'header' | 'footer') => {
    const removeFromList = (list: LayoutElement[]): LayoutElement[] => {
      return list
        .filter((e) => e.id !== elementId)
        .map((el) => {
          if (el.children) {
            return {
              ...el,
              children: {
                column1: el.children.column1 ? removeFromList(el.children.column1) : undefined,
                column2: el.children.column2 ? removeFromList(el.children.column2) : undefined,
                column3: el.children.column3 ? removeFromList(el.children.column3) : undefined,
              },
            };
          }
          return el;
        });
    };

    if (target === 'header') {
      setHeaderElements(removeFromList(headerElements));
    } else {
      setFooterElements(removeFromList(footerElements));
    }
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleUpdateElement = (updates: Partial<LayoutElement>) => {
    if (!selectedElementId) return;

    const updateInList = (list: LayoutElement[]): LayoutElement[] =>
      list.map((el) => {
        if (el.id === selectedElementId) {
          return { ...el, ...updates };
        }
        if (el.children) {
          return {
            ...el,
            children: {
              column1: el.children.column1 ? updateInList(el.children.column1) : undefined,
              column2: el.children.column2 ? updateInList(el.children.column2) : undefined,
              column3: el.children.column3 ? updateInList(el.children.column3) : undefined,
            },
          };
        }
        return el;
      });

    setHeaderElements(updateInList(headerElements));
    setFooterElements(updateInList(footerElements));
  };

  const handleCloseElement = () => setSelectedElementId(null);

  // Find element recursively (including nested elements in columns)
  const findElement = (list: LayoutElement[], id: string): LayoutElement | null => {
    for (const el of list) {
      if (el.id === id) {
        console.log('Found element:', el);
        return el;
      }
      if (el.children) {
        const found =
          findElement(el.children.column1 || [], id) ||
          findElement(el.children.column2 || [], id) ||
          findElement(el.children.column3 || [], id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedElementId
    ? findElement([...headerElements, ...footerElements], selectedElementId)
    : null;

  console.log('Selected Element ID:', selectedElementId);
  console.log('Selected Element:', selectedElement);

  const onSubmit = (data: LayoutSettingsFormData) => {
    const layout: LayoutConfig = {
      id: editingLayout?.id || `layout-${Date.now()}`,
      name: data.layoutName,
      description: data.layoutDescription || '',
      headerElements,
      footerElements,
      stepperPosition: data.stepperPosition,
      stepperStyle: data.stepperStyle,
    };
    onSave(layout);
    onClose();
  };

  // Render element using modular components
  const renderElement = (element: LayoutElement, target?: 'header' | 'footer') => {
    const props = { element, totalPages, isSmall: false };

    switch (element.type) {
      case 'heading':
        return <Heading {...props} />;
      case 'stepper':
        return <Stepper {...props} />;
      case 'nextButton':
        return <NextButton {...props} />;
      case 'backButton':
        return <BackButton {...props} />;
      case 'nextArrow':
        return <NextArrow {...props} />;
      case 'backArrow':
        return <BackArrow {...props} />;
      case 'progressBar':
        return <ProgressBar {...props} />;
      case 'breadcrumb':
        return <Breadcrumb {...props} />;
      case 'pageIndicator':
        return <PageIndicator {...props} />;
      case 'twoColumn':
        return (
          <TwoColumn
            {...props}
            target={target}
            onDropInColumn={handleDropInColumn}
            renderChild={(child) => renderNestedElementCard(child, target!)}
          />
        );
      case 'threeColumn':
        return (
          <ThreeColumn
            {...props}
            target={target}
            onDropInColumn={handleDropInColumn}
            renderChild={(child) => renderNestedElementCard(child, target!)}
          />
        );
      default:
        return <Typography variant="caption">{element.label}</Typography>;
    }
  };

  // Render element card with controls
  const renderElementCard = (element: LayoutElement, target: 'header' | 'footer') => (
    <ElementCard
      key={element.id}
      isSelected={selectedElementId === element.id}
      label={LAYOUT_ELEMENTS.find((e) => e.type === element.type)?.label}
      align={element.position}
      onSelect={() => setSelectedElementId(element.id)}
      onRemove={() => handleRemoveElement(element.id, target)}
    >
      {renderElement(element, target)}
    </ElementCard>
  );

  // Render nested element card (for elements inside columns)
  const renderNestedElementCard = (element: LayoutElement, target: 'header' | 'footer') => (
    <ElementCard
      key={element.id}
      isSelected={selectedElementId === element.id}
      label={LAYOUT_ELEMENTS.find((e) => e.type === element.type)?.label}
      align={element.position}
      onSelect={(e) => {
        e?.stopPropagation(); // Stop event from bubbling to parent
        setSelectedElementId(element.id);
      }}
      onRemove={(e) => {
        e?.stopPropagation(); // Stop event from bubbling to parent
        handleRemoveElement(element.id, target);
      }}
    >
      {renderElement(element, target)}
    </ElementCard>
  );

  const handleCanvasClick = () => {
    if (selectedElementId) setSelectedElementId(null);
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth={false} fullWidth>
      <DialogContainer>
        {/* Header */}
        <DialogHeader>
          <HeaderContent>
            <HeaderIconBox>
              <Sparkles size={22} color="white" strokeWidth={2.5} />
            </HeaderIconBox>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Layout Builder
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Design your multi-step form layout
              </Typography>
            </Box>
          </HeaderContent>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
              Save Layout
            </Button>
          </Box>
        </DialogHeader>

        {/* Main Content */}
        <MainContainer>
          {/* Sidebar */}
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            expandedCategories={expandedCategories}
            onToggleCategory={(cat) =>
              setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
            }
            onDragStart={handleDragStart}
          />

          {/* Canvas */}
          <Canvas onClick={handleCanvasClick}>
            <CanvasContent>
              {/* Layout Settings */}
              <SettingsCard>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Layout Name"
                    size="small"
                    error={!!errors.layoutName}
                    helperText={errors.layoutName?.message}
                    {...register('layoutName')}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    size="small"
                    multiline
                    rows={2}
                    error={!!errors.layoutDescription}
                    helperText={errors.layoutDescription?.message}
                    {...register('layoutDescription')}
                  />
                </Stack>
              </SettingsCard>

              {/* Stepper Guidance */}
              {stepperPosition === 'top' && (
                <PreviewCard>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Drag a <strong>Stepper</strong> element into the Header or Footer zone
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Then customize orientation, style, steps, and page mapping in Properties Panel
                    </Typography>
                  </Box>
                </PreviewCard>
              )}

              {/* Header Drop Zone */}
              <DropZone
                zone="header"
                elements={headerElements}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                renderElement={(el) => renderElementCard(el, 'header')}
              />

              {/* Content Placeholder */}
              <ContentPlaceholder>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Form Content Area
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your form pages will be displayed here
                </Typography>
              </ContentPlaceholder>

              {/* Footer Drop Zone */}
              <DropZone
                zone="footer"
                elements={footerElements}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                renderElement={(el) => renderElementCard(el, 'footer')}
              />
            </CanvasContent>
          </Canvas>

          {/* Properties Panel */}
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onCloseElement={handleCloseElement}
            control={control}
            watch={watch}
            errors={errors}
            pages={pages}
          />
        </MainContainer>
      </DialogContainer>
    </StyledDialog>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    height: '90vh',
    maxWidth: '90vw',
  },
}));

const DialogContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const DialogHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const HeaderIconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1.5),
  background: 'linear-gradient(135deg, #FF3B30 0%, #D32F2F 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
}));

const MainContainer = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const Canvas = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  flexDirection: 'column',
}));

const CanvasContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 900,
  margin: '0 auto',
}));

const SettingsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)',
}));

const PreviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  boxShadow: '0 1px 3px rgba(145, 158, 171, 0.12)',
}));

const ContentPlaceholder = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.common.black, 0.02), // Lighter, cleaner background
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));
