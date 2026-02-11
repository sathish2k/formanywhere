/**
 * Form Builder - New Modular Architecture
 * Migrated from monolithic FormBuilder.tsx to use the new form-builder module
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Typography,
  Autocomplete,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import { MoreVertical, Edit2, Copy, Trash2, Plus, Settings, Code, Link as LinkIcon, BarChart3, Image as ImageIcon, Workflow, ArrowLeft, Columns } from 'lucide-react';
import { ElementsSidebar } from '../form-builder/components/ElementsSidebar';
import { FormCanvas } from '../form-builder/components/FormCanvas';
import { PropertiesPanelNew } from '../form-builder/components/PropertiesPanelNew';
import { LogicDialog } from '../form-builder/components/LogicDialog';
import { WorkflowManager } from '../form-builder/components/WorkflowManager';
import { DroppedElement, PageData, FormRule, LayoutConfig } from '../form-builder/types/form.types';
import { FORM_ELEMENTS } from '../form-builder/config/elements.config';
import { createDroppedElement } from '../form-builder/utils/form.utils';
import { FormSetupData } from './FormSetup';
import { PreviewMode } from './PreviewMode';
import { CustomizeTab } from './CustomizeTab';
import { PublishTab } from './PublishTab';
import { ThemeCustomizer } from './ThemeCustomizer';

export type FormTemplate = 'blank' | 'with-layout' | 'with-login' | 'ai' | null;

interface FormBuilderNewProps {
  onBack: () => void;
  template: FormTemplate;
  formData: FormSetupData;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export function FormBuilderNew({ 
  onBack, 
  template, 
  formData,
  onUpdateTheme,
  currentPrimaryColor = '#FF3B30',
  currentSecondaryColor = '#1A1A1A'
}: FormBuilderNewProps) {
  // Settings menu state
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [integrateDialogOpen, setIntegrateDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  
  const [previewOpen, setPreviewOpen] = useState(false);

  // Schema View state
  const [schemaViewOpen, setSchemaViewOpen] = useState(false);

  // Element selection
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Layout management - Initialize from formData.layout if available
  const [layoutElements, setLayoutElements] = useState<LayoutConfig>(() => {
    if (formData.layout) {
      // Convert LayoutBuilder's LayoutConfig to PreviewMode's LayoutConfig
      return {
        header: formData.layout.headerElements as any || [],
        footer: formData.layout.footerElements as any || [],
        stepper: formData.layout.stepperPosition !== 'none',
      };
    }
    return {
      header: [],
      footer: [],
      stepper: true,
    };
  });

  // Logic Rules management
  const [logicDialogOpen, setLogicDialogOpen] = useState(false);
  const [workflowBuilderOpen, setWorkflowBuilderOpen] = useState(false);
  const [formRules, setFormRules] = useState<FormRule[]>([
    {
      id: 'rule-demo-1',
      name: 'Show Address Fields When Country is Selected',
      enabled: true,
      trigger: 'onChange',
      triggerFieldId: 'country-field',
      conditions: [
        { fieldId: 'country-field', operator: 'isNotEmpty', value: '' },
      ],
      conditionOperator: 'AND',
      actions: [
        { type: 'show', targetId: 'address-field', value: '' },
        { type: 'show', targetId: 'city-field', value: '' },
      ],
    },
    {
      id: 'rule-demo-2',
      name: 'Navigate to Payment Page When Amount > 100',
      enabled: true,
      trigger: 'onBlur',
      triggerFieldId: 'amount-field',
      conditions: [
        { fieldId: 'amount-field', operator: 'greaterThan', value: '100' },
      ],
      conditionOperator: 'AND',
      actions: [
        { type: 'navigate', targetId: 'payment-page', value: '' },
      ],
    },
    {
      id: 'rule-demo-3',
      name: 'Enable Submit When Terms Accepted AND Email Verified',
      enabled: false,
      trigger: 'onChange',
      triggerFieldId: 'terms-checkbox',
      conditions: [
        { fieldId: 'terms-checkbox', operator: 'equals', value: 'true' },
        { fieldId: 'email-verified', operator: 'equals', value: 'true' },
      ],
      conditionOperator: 'AND',
      actions: [
        { type: 'enable', targetId: 'submit-button', value: '' },
      ],
    },
  ]);

  // Page management
  const [pages, setPages] = useState<PageData[]>(formData.pages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageMenuAnchor, setPageMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState<PageData | null>(null);
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');

  // Page elements storage
  const [pageElements, setPageElements] = useState<Record<string, DroppedElement[]>>(() => {
    const initial: Record<string, DroppedElement[]> = {};
    formData.pages.forEach((page) => {
      initial[page.id] = [];
    });
    return initial;
  });

  // Get current elements based on context (editing layout or page)
  const currentElements = pageElements[pages[currentPageIndex]?.id] || [];

  // Get all elements for the current page (for rules reference)
  const currentPageElements = pageElements[pages[currentPageIndex]?.id] || [];

  // Helper function to find an element recursively (including nested children)
  const findElementById = (elements: DroppedElement[], id: string): DroppedElement | null => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      // Search in children (for sections and cards)
      if (element.children) {
        const found = findElementById(element.children, id);
        if (found) return found;
      }
      // Search in column children (for columns)
      if (element.column1Children) {
        const found = findElementById(element.column1Children, id);
        if (found) return found;
      }
      if (element.column2Children) {
        const found = findElementById(element.column2Children, id);
        if (found) return found;
      }
      if (element.column3Children) {
        const found = findElementById(element.column3Children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedElementId ? findElementById(currentElements, selectedElementId) : null;
  const currentPage = pages[currentPageIndex];

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, element: typeof FORM_ELEMENTS[0]) => {
    e.dataTransfer.setData('elementType', element.type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType');
    const newElement = createDroppedElement(elementType);

    if (!newElement) return;

    // Check if this is a layout container or a form field
    const layoutContainerTypes = ['section', 'card'];
    const layoutDecorators = ['divider', 'spacer', 'heading', 'logo', 'text-block'];
    const isLayoutElement = [...layoutContainerTypes, ...layoutDecorators].includes(elementType);

    // Only allow layout elements to be dropped directly on canvas
    if (!isLayoutElement) {
      alert('Form fields must be placed inside a container (Section, Card, or Columns). Please add a layout container first.');
      return;
    }

    if (newElement) {
      // Add to current page
      const currentPageId = pages[currentPageIndex].id;
      setPageElements({
        ...pageElements,
        [currentPageId]: [...currentElements, newElement],
      });
      setSelectedElementId(newElement.id);
    }
  };

  // Grid Creation Handler
  const handleCreateGrid = (columns: number) => {
    const currentPageId = pages[currentPageIndex].id;
    
    // Define breakpoint configurations for each column count
    const gridConfigs: Record<number, { xs: number; sm: number; md: number; lg: number; xl: number }[]> = {
      1: [{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }],
      2: [
        { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
        { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
      ],
      3: [
        { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
        { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
        { xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
      ],
    };

    const config = gridConfigs[columns] || gridConfigs[2];

    // Create a grid container that will hold rows
    const gridContainerId = `grid-container-${Date.now()}`;

    // Create grid column elements for the first row
    const gridColumns = config.map((columnConfig, index) => {
      const columnElement: DroppedElement = {
        id: `grid-column-${Date.now()}-${index}`,
        type: 'grid-column',
        label: `Column ${index + 1}`,
        icon: Columns,
        color: '#00897B',
        isLayoutElement: true,
        
        // MUI Grid item breakpoints
        gridItemXs: columnConfig.xs,
        gridItemSm: columnConfig.sm,
        gridItemMd: columnConfig.md,
        gridItemLg: columnConfig.lg,
        gridItemXl: columnConfig.xl,
        
        // Container for child elements
        children: [],
      };
      
      return columnElement;
    });

    // Create grid container wrapper with rows structure
    const gridContainer: DroppedElement = {
      id: gridContainerId,
      type: 'grid-container',
      label: `${columns} Column Grid`,
      icon: Columns,
      color: '#1976D2',
      isLayoutElement: true,
      rows: [gridColumns], // Store columns in rows array
      gridSpacing: 2, // Default spacing
    };

    // Add grid container to canvas
    setPageElements({
      ...pageElements,
      [currentPageId]: [...currentElements, gridContainer],
    });

    // Select the container
    setSelectedElementId(gridContainer.id);
  };

  // Add Row to Grid Container
  const handleAddRowToGrid = (containerId: string) => {
    const updateGridContainer = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        if (el.id === containerId && el.type === 'grid-container' && el.rows) {
          // Get the column count from the first row
          const firstRow = el.rows[0] || [];
          const columnCount = firstRow.length;
          
          // Create new columns for the new row with same breakpoints as first row
          const newRow = firstRow.map((col, index) => ({
            id: `grid-column-${Date.now()}-${index}`,
            type: 'grid-column' as const,
            label: `Column ${index + 1}`,
            icon: Columns,
            color: '#00897B',
            isLayoutElement: true,
            gridItemXs: col.gridItemXs,
            gridItemSm: col.gridItemSm,
            gridItemMd: col.gridItemMd,
            gridItemLg: col.gridItemLg,
            gridItemXl: col.gridItemXl,
            children: [],
          }));
          
          return {
            ...el,
            rows: [...el.rows, newRow],
          };
        }
        return el;
      });
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateGridContainer(currentElements),
    });
  };

  // Add Column to Specific Row in Grid Container
  const handleAddColumnToGrid = (containerId: string, rowIndex: number) => {
    const updateGridContainer = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        if (el.id === containerId && el.type === 'grid-container' && el.rows) {
          const updatedRows = el.rows.map((row, index) => {
            if (index === rowIndex) {
              // Add a new column with default breakpoints
              const newColumn: DroppedElement = {
                id: `grid-column-${Date.now()}`,
                type: 'grid-column',
                label: `Column ${row.length + 1}`,
                icon: Columns,
                color: '#00897B',
                isLayoutElement: true,
                gridItemXs: 12,
                gridItemSm: 6,
                gridItemMd: 4,
                gridItemLg: 4,
                gridItemXl: 4,
                children: [],
              };
              return [...row, newColumn];
            }
            return row;
          });
          
          return {
            ...el,
            rows: updatedRows,
          };
        }
        return el;
      });
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateGridContainer(currentElements),
    });
  };

  // Delete Row from Grid Container
  const handleDeleteRow = (containerId: string, rowIndex: number) => {
    const updateGridContainer = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        if (el.id === containerId && el.type === 'grid-container' && el.rows) {
          // Filter out the row at rowIndex
          const updatedRows = el.rows.filter((_, index) => index !== rowIndex);
          
          // If no rows left, remove the entire grid container
          if (updatedRows.length === 0) {
            return null as any; // Will be filtered out
          }
          
          return {
            ...el,
            rows: updatedRows,
          };
        }
        return el;
      }).filter(Boolean); // Remove null elements
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateGridContainer(currentElements),
    });
  };

  const handleElementSelect = (id: string) => {
    setSelectedElementId(id);
  };

  const handleElementRemove = (id: string) => {
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: currentElements.filter((el) => el.id !== id),
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleUpdateElement = (id: string, updates: Partial<DroppedElement>) => {
    const updateElementsRecursively = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        if (el.id === id) {
          return { ...el, ...updates };
        }
        
        // Check if element has rows (grid-container)
        if (el.type === 'grid-container' && el.rows) {
          const updatedRows = el.rows.map((row) =>
            row.map((col) => {
              if (col.id === id) {
                return { ...col, ...updates };
              }
              // Check nested children in columns
              if (col.children) {
                return { ...col, children: updateElementsRecursively(col.children) };
              }
              return col;
            })
          );
          
          // Check if any row was updated
          if (JSON.stringify(updatedRows) !== JSON.stringify(el.rows)) {
            return { ...el, rows: updatedRows };
          }
        }
        
        // Check nested children
        if (el.children) {
          return { ...el, children: updateElementsRecursively(el.children) };
        }
        // Check column children
        if (el.column1Children || el.column2Children || el.column3Children) {
          return {
            ...el,
            column1Children: el.column1Children ? updateElementsRecursively(el.column1Children) : el.column1Children,
            column2Children: el.column2Children ? updateElementsRecursively(el.column2Children) : el.column2Children,
            column3Children: el.column3Children ? updateElementsRecursively(el.column3Children) : el.column3Children,
          };
        }
        return el;
      });
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateElementsRecursively(currentElements),
    });
  };

  // Nested Element Handlers
  const handleDropInside = (e: React.DragEvent, parentId: string, columnIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const elementType = e.dataTransfer.getData('elementType');
    const newElement = createDroppedElement(elementType);

    if (!newElement) return;

    // Inside containers, we can drop ANY element type (form fields, sections, cards, columns, etc.)
    // This allows nesting: sections can contain cards, cards can contain columns, etc.

    const updateElementsWithNested = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        if (el.id === parentId) {
          // Handle column layouts - only allow ONE element per column
          if (columnIndex !== undefined) {
            if (columnIndex === 0) {
              // Check if column already has an element
              if (el.column1Children && el.column1Children.length > 0) {
                return el; // Don't add, column is full
              }
              return {
                ...el,
                column1Children: [newElement], // Replace, not append
              };
            } else if (columnIndex === 1) {
              // Check if column already has an element
              if (el.column2Children && el.column2Children.length > 0) {
                return el; // Don't add, column is full
              }
              return {
                ...el,
                column2Children: [newElement], // Replace, not append
              };
            } else if (columnIndex === 2) {
              // Check if column already has an element
              if (el.column3Children && el.column3Children.length > 0) {
                return el; // Don't add, column is full
              }
              return {
                ...el,
                column3Children: [newElement], // Replace, not append
              };
            }
          }
          // Handle regular containers (section, card) - allow multiple elements
          return {
            ...el,
            children: [...(el.children || []), newElement],
          };
        }

        // Check if element has rows (grid-container)
        if (el.type === 'grid-container' && el.rows) {
          const updatedRows = el.rows.map((row) =>
            row.map((col) => {
              if (col.id === parentId) {
                // Found the column, add element to its children
                return {
                  ...col,
                  children: [...(col.children || []), newElement],
                };
              }
              return col;
            })
          );
          
          // Check if any row was updated
          if (JSON.stringify(updatedRows) !== JSON.stringify(el.rows)) {
            return { ...el, rows: updatedRows };
          }
        }

        // Check nested children in regular elements
        if (el.children && el.children.length > 0) {
          return {
            ...el,
            children: updateElementsWithNested(el.children),
          };
        }
        if (el.column1Children && el.column1Children.length > 0) {
          const updated = { ...el };
          updated.column1Children = updateElementsWithNested(el.column1Children);
          if (el.column2Children) updated.column2Children = updateElementsWithNested(el.column2Children);
          if (el.column3Children) updated.column3Children = updateElementsWithNested(el.column3Children);
          return updated;
        }
        return el;
      });
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateElementsWithNested(currentElements),
    });
    setSelectedElementId(newElement.id);
  };

  const handleNestedElementSelect = (id: string) => {
    setSelectedElementId(id);
  };

  const handleNestedElementRemove = (id: string) => {
    const removeNestedElement = (elements: DroppedElement[]): DroppedElement[] => {
      return elements.map((el) => {
        // Handle grid-container with rows
        if (el.type === 'grid-container' && el.rows) {
          const updatedRows = el.rows.map(row => 
            row.filter(col => col.id !== id)
          ).filter(row => row.length > 0); // Remove empty rows
          
          return {
            ...el,
            rows: updatedRows,
          };
        }
        
        // Check if this element has the child we want to remove
        if (el.children?.some((child) => child.id === id)) {
          return {
            ...el,
            children: el.children.filter((child) => child.id !== id),
          };
        }
        if (el.column1Children?.some((child) => child.id === id)) {
          return {
            ...el,
            column1Children: el.column1Children.filter((child) => child.id !== id),
          };
        }
        if (el.column2Children?.some((child) => child.id === id)) {
          return {
            ...el,
            column2Children: el.column2Children.filter((child) => child.id !== id),
          };
        }
        if (el.column3Children?.some((child) => child.id === id)) {
          return {
            ...el,
            column3Children: el.column3Children.filter((child) => child.id !== id),
          };
        }
        return el;
      });
    };

    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: removeNestedElement(currentElements),
    });
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Page Management Handlers
  const handlePageClick = (index: number) => {
    setCurrentPageIndex(index);
    setSelectedElementId(null);
  };

  const handlePageMenuOpen = (event: React.MouseEvent<HTMLElement>, page: PageData) => {
    event.stopPropagation();
    setPageMenuAnchor(event.currentTarget);
    setSelectedPageForMenu(page);
  };

  const handlePageMenuClose = () => {
    setPageMenuAnchor(null);
    setSelectedPageForMenu(null);
  };

  const handleAddPage = () => {
    setEditingPage(null);
    setNewPageName(`Page ${pages.length + 1}`);
    setNewPageDescription('');
    setPageDialogOpen(true);
  };

  const handleEditPage = () => {
    if (selectedPageForMenu) {
      setEditingPage(selectedPageForMenu);
      setNewPageName(selectedPageForMenu.name);
      setNewPageDescription(selectedPageForMenu.description);
      setPageDialogOpen(true);
      handlePageMenuClose();
    }
  };

  const handleDuplicatePage = () => {
    if (selectedPageForMenu) {
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        name: `${selectedPageForMenu.name} (Copy)`,
        description: selectedPageForMenu.description,
      };
      setPages([...pages, newPage]);
      setPageElements({
        ...pageElements,
        [newPage.id]: [...(pageElements[selectedPageForMenu.id] || [])],
      });
      handlePageMenuClose();
    }
  };

  const handleDeletePage = () => {
    if (selectedPageForMenu && pages.length > 1) {
      const newPages = pages.filter((p) => p.id !== selectedPageForMenu.id);
      setPages(newPages);
      const newPageElements = { ...pageElements };
      delete newPageElements[selectedPageForMenu.id];
      setPageElements(newPageElements);

      if (currentPageIndex >= newPages.length) {
        setCurrentPageIndex(newPages.length - 1);
      }
      handlePageMenuClose();
    }
  };

  const handleSavePage = () => {
    if (editingPage) {
      setPages(
        pages.map((p) =>
          p.id === editingPage.id
            ? { ...p, name: newPageName, description: newPageDescription }
            : p
        )
      );
    } else {
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        name: newPageName,
        description: newPageDescription,
      };
      setPages([...pages, newPage]);

      // Pre-fill with layout elements
      const layoutElementsForPage: DroppedElement[] = [];
      if (layoutElements.logo) {
        layoutElementsForPage.push({
          id: `logo-${newPage.id}`,
          type: 'logo',
          label: 'Logo',
          icon: ImageIcon,
          color: '#00897B',
          logoUrl: layoutElements.logo.url,
          logoAlt: layoutElements.logo.alt,
          isLayoutElement: true,
        });
      }
      if (layoutElements.header.length > 0) {
        layoutElementsForPage.push(
          ...layoutElements.header.map((el) => ({
            ...el,
            id: `${el.id}-page-${newPage.id}`,
            isLayoutElement: true,
          }))
        );
      }
      if (layoutElements.footer.length > 0) {
        layoutElementsForPage.push(
          ...layoutElements.footer.map((el) => ({
            ...el,
            id: `${el.id}-page-${newPage.id}`,
            isLayoutElement: true,
          }))
        );
      }

      setPageElements({
        ...pageElements,
        [newPage.id]: layoutElementsForPage,
      });
      setCurrentPageIndex(pages.length);
    }
    setPageDialogOpen(false);
    setNewPageName('');
    setNewPageDescription('');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top AppBar - Enhanced Modern Design with Theme Support */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(145, 158, 171, 0.04)',
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={onBack} 
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {formData.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formData.description}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPreviewOpen(true)}
            sx={{ 
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            Preview
          </Button>
          
          {onUpdateTheme && (
            <ThemeCustomizer 
              onUpdateTheme={onUpdateTheme}
              currentPrimary={currentPrimaryColor}
              currentSecondary={currentSecondaryColor}
            />
          )}
          
          <IconButton 
            onClick={(e) => setSettingsMenuAnchor(e.currentTarget)} 
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <Settings size={20} />
          </IconButton>
          
          <Button
            variant="contained"
            size="small"
            onClick={() => setPublishDialogOpen(true)}
            sx={{ 
              textTransform: 'none',
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Publish
          </Button>
        </Box>
      </Box>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={() => setSettingsMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { setSchemaViewOpen(true); setSettingsMenuAnchor(null); }}>
          <ListItemIcon>
            <Code size={16} />
          </ListItemIcon>
          <ListItemText>View Schema</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setCustomizeDialogOpen(true); setSettingsMenuAnchor(null); }}>
          <ListItemIcon>
            <Settings size={16} />
          </ListItemIcon>
          <ListItemText>Customize Theme</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setIntegrateDialogOpen(true); setSettingsMenuAnchor(null); }}>
          <ListItemIcon>
            <LinkIcon size={16} />
          </ListItemIcon>
          <ListItemText>Integrations</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setResultsDialogOpen(true); setSettingsMenuAnchor(null); }}>
          <ListItemIcon>
            <BarChart3 size={16} />
          </ListItemIcon>
          <ListItemText>View Results</ListItemText>
        </MenuItem>
      </Menu>

      {/* Page Navigation - Enhanced Design */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          boxShadow: '0 1px 3px rgba(145, 158, 171, 0.04)',
        }}
      >
        {/* Add Page Button */}
        <Button
          startIcon={<Plus size={18} strokeWidth={2.5} />}
          onClick={handleAddPage}
          size="small"
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'grey.100',
              borderColor: 'secondary.main',
              color: 'secondary.main',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(145, 158, 171, 0.12)',
            },
          }}
        >
          Add page
        </Button>

        <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 0.5 }} />

        {/* Page Tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, overflow: 'auto' }}>
          {pages.map((page, index) => (
            <Box
              key={page.id}
              onClick={() => handlePageClick(index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: 1.5,
                cursor: 'pointer',
                bgcolor: currentPageIndex === index ? 'secondary.main' : 'transparent',
                border: '1px solid',
                borderColor: currentPageIndex === index ? 'secondary.main' : 'divider',
                transition: 'all 0.2s',
                minWidth: 'fit-content',
                '&:hover': {
                  bgcolor: currentPageIndex === index ? 'secondary.dark' : 'grey.100',
                  borderColor: currentPageIndex === index ? 'secondary.dark' : 'grey.300',
                  transform: 'translateY(-1px)',
                  boxShadow: currentPageIndex === index 
                    ? '0 4px 12px rgba(0, 0, 0, 0.24)'
                    : '0 2px 8px rgba(145, 158, 171, 0.12)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: currentPageIndex === index ? 700 : 500,
                  fontSize: '0.875rem',
                  color: currentPageIndex === index ? 'white' : 'text.secondary',
                  letterSpacing: '-0.01em',
                  userSelect: 'none',
                }}
              >
                {page.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handlePageMenuOpen(e, page)}
                sx={{
                  p: 0.5,
                  ml: 0.5,
                  color: currentPageIndex === index ? 'white' : 'text.secondary',
                  '&:hover': {
                    bgcolor: currentPageIndex === index ? 'rgba(255, 255, 255, 0.15)' : 'grey.300',
                    color: currentPageIndex === index ? 'white' : 'text.primary',
                  },
                }}
              >
                <MoreVertical size={14} />
              </IconButton>
            </Box>
          ))}
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 0.5 }} />

        {/* Logic Button */}
        <Button
          size="small"
          startIcon={<Settings size={16} />}
          onClick={() => setLogicDialogOpen(true)}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'grey.100',
              borderColor: 'grey.300',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(145, 158, 171, 0.12)',
            },
          }}
        >
          Logic
        </Button>

        {/* Workflow Button */}
        <Button
          size="small"
          startIcon={<Workflow size={16} />}
          onClick={() => setWorkflowBuilderOpen(true)}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'grey.100',
              borderColor: 'grey.300',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(145, 158, 171, 0.12)',
            },
          }}
        >
          Workflow
        </Button>
      </Box>

      {/* Main Content - Form Builder */}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 128px)' }}>
        <ElementsSidebar onDragStart={handleDragStart} />

        <FormCanvas
          currentPage={currentPage}
          elements={currentElements}
          selectedElementId={selectedElementId}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onElementSelect={handleElementSelect}
          onElementRemove={handleElementRemove}
          onDropInside={handleDropInside}
          onNestedElementSelect={handleNestedElementSelect}
          onNestedElementRemove={handleNestedElementRemove}
          onCreateGrid={handleCreateGrid}
          onUpdateElement={handleUpdateElement}
          onAddRowToGrid={handleAddRowToGrid}
          onAddColumnToGrid={handleAddColumnToGrid}
          onDeleteRow={handleDeleteRow}
        />

        {selectedElementId && (
          <PropertiesPanelNew
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onClose={() => setSelectedElementId(null)}
            allElements={currentPageElements}
          />
        )}
      </Box>

      {/* Page Menu */}
      <Menu
        anchorEl={pageMenuAnchor}
        open={Boolean(pageMenuAnchor)}
        onClose={handlePageMenuClose}
      >
        <MenuItem onClick={handleEditPage}>
          <ListItemIcon>
            <Edit2 size={16} />
          </ListItemIcon>
          <ListItemText>Edit Page</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicatePage}>
          <ListItemIcon>
            <Copy size={16} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeletePage}
          disabled={pages.length <= 1}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Trash2 size={16} color="currentColor" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Page Dialog */}
      <Dialog open={pageDialogOpen} onClose={() => setPageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Page Name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              autoFocus
            />
            <TextField
              fullWidth
              label="Description (optional)"
              value={newPageDescription}
              onChange={(e) => setNewPageDescription(e.target.value)}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePage} disabled={!newPageName.trim()}>
            {editingPage ? 'Save' : 'Add Page'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      {previewOpen && (
        <PreviewMode
          formName={formData.title}
          formDescription={formData.description}
          pages={pages}
          pageElements={pageElements}
          layoutConfig={layoutElements}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {/* Customize Dialog */}
      <Dialog open={customizeDialogOpen} onClose={() => setCustomizeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customize Theme</DialogTitle>
        <DialogContent>
          <CustomizeTab onPreview={() => setPreviewOpen(true)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomizeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Integrations Dialog */}
      <Dialog open={integrateDialogOpen} onClose={() => setIntegrateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Integrations</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Connect your form to external services</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIntegrateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={resultsDialogOpen} onClose={() => setResultsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Form Results</DialogTitle>
        <DialogContent>
          <Typography variant="body1">View and analyze form submissions</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Publish Form</DialogTitle>
        <DialogContent>
          <PublishTab formName={formData.title} onPreview={() => setPreviewOpen(true)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Schema View Dialog */}
      <Dialog open={schemaViewOpen} onClose={() => setSchemaViewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code size={20} />
            <Typography variant="h6">Form Schema</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: '#1E1E1E',
              color: '#D4D4D4',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.875rem',
              maxHeight: '70vh',
              overflow: 'auto',
              borderRadius: 1,
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(
                {
                  formTitle: formData.title,
                  formDescription: formData.description,
                  layout: {
                    logo: layoutElements.logo,
                    stepper: layoutElements.stepper,
                    header: layoutElements.header,
                    footer: layoutElements.footer,
                  },
                  pages: pages.map((page) => ({
                    id: page.id,
                    name: page.name,
                    description: page.description,
                    elements: pageElements[page.id] || [],
                  })),
                },
                null,
                2
              )}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const schema = JSON.stringify(
                {
                  formTitle: formData.title,
                  formDescription: formData.description,
                  layout: layoutElements,
                  pages: pages.map((page) => ({
                    id: page.id,
                    name: page.name,
                    description: page.description,
                    elements: pageElements[page.id] || [],
                  })),
                },
                null,
                2
              );
              navigator.clipboard.writeText(schema);
            }}
          >
            Copy to Clipboard
          </Button>
          <Button onClick={() => setSchemaViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Logic Dialog */}
      <LogicDialog
        open={logicDialogOpen}
        onClose={() => setLogicDialogOpen(false)}
        rules={formRules}
        onAddRule={(rule) => setFormRules([...formRules, rule])}
        onUpdateRule={(ruleId, updatedRule) => {
          setFormRules(formRules.map((r) => (r.id === ruleId ? updatedRule : r)));
        }}
        onDeleteRule={(ruleId) => {
          setFormRules(formRules.filter((r) => r.id !== ruleId));
        }}
        elements={currentPageElements}
        pages={pages}
      />

      {/* Workflow Builder Dialog */}
      <WorkflowManager
        open={workflowBuilderOpen}
        onClose={() => setWorkflowBuilderOpen(false)}
        rules={formRules}
        onAddRule={(rule) => setFormRules([...formRules, rule])}
        onUpdateRule={(ruleId, updatedRule) => {
          setFormRules(formRules.map((r) => (r.id === ruleId ? updatedRule : r)));
        }}
        onDeleteRule={(ruleId) => {
          setFormRules(formRules.filter((r) => r.id !== ruleId));
        }}
        elements={currentPageElements}
        pages={pages}
      />
    </Box>
  );
}