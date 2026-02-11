/**
 * Form Builder - Main Component
 * Complete form builder with drag-and-drop, element management, and multiple pages
 */

'use client';

import type { FormSetupData } from '@/components/form-setup/form-setup.configuration';
import {
  fetchFormById,
  publishForm,
  updateFormBuilder,
} from '@/components/form-setup/form-setup.datasource';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft, Eye, Plus, Save, Workflow, GitBranch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SaveStatusIndicator } from './components/SaveStatusIndicator';
import { ElementsSidebar } from './elements-sidebar';
import type { DroppedElement, ElementDefinition, PageData } from './form-builder.configuration';
import { FormCanvas } from './form-canvas';
import { useAutoSave } from './hooks/useAutoSave';
import { PreviewDialog } from './preview/PreviewDialog';
import { PropertiesPanel } from './properties-panel';
import {
  deleteElementById,
  insertElementIntoContainer,
  reorderElements,
  updateElementById,
} from './utils/element-path.utils';
import { createDroppedElement } from './utils/element.utils';
import { convertToFormFields } from './utils/form-conversion.utils';
import { WorkflowBuilder } from './workflow/WorkflowBuilder';
import type { Rule } from './form-builder.configuration';
import { RulesManager } from './components/RulesManager';
import { LayoutPickerDialog } from './dialogs/LayoutPickerDialog';

interface FormBuilderProps {
  formId: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState<(FormSetupData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Builder state
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageElements, setPageElements] = useState<Record<string, DroppedElement[]>>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Sidebar state
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Input Fields': true,
    Layout: true,
    Decorators: true,
  });

  // Page dialog state
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // Publish state
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Auto-save functionality
  const handleSave = async () => {
    if (!formData) return;

    const { fields, pageFields } = convertToFormFields(pageElements, pages);
    await updateFormBuilder(formId, { fields, pages, pageFields, pageElements, rules: formRules, workflows: formWorkflows });
  };

  const {
    status: saveStatus,
    lastSaved,
    error: saveError,
    saveNow,
  } = useAutoSave({
    data: { pageElements, pages },
    onSave: handleSave,
    interval: 30000, // 30 seconds
    enabled: true,
  });

  // Layout picker state
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);

  // Workflow and rules state
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [formRules, setFormRules] = useState<Rule[]>([]);
  const [formWorkflows, setFormWorkflows] = useState<any[]>([]);

  // Load form data
  useEffect(() => {
    async function loadForm() {
      try {
        const data = await fetchFormById(formId);
        setFormData(data);
        setPages(data.pages);
        setIsPublished((data as any).isPublished || false);

        // Initialize page elements from database or create empty structure
        const initialElements: Record<string, DroppedElement[]> = {};

        // If pageElements exist in the data, use them
        if ((data as any).pageElements) {
          Object.assign(initialElements, (data as any).pageElements);
        } else {
          // Otherwise, initialize empty arrays for each page
          data.pages.forEach((page) => {
            initialElements[page.id] = [];
          });
        }

        console.log('Loaded pageElements:', initialElements);
        setPageElements(initialElements);

        // Load rules and workflows from form settings
        console.log('Form data settings:', (data as any).settings);
        if ((data as any).settings?.rules) {
          console.log('Loading rules:', (data as any).settings.rules);
          setFormRules((data as any).settings.rules);
        }
        if ((data as any).settings?.workflows) {
          console.log('Loading workflows:', (data as any).settings.workflows);
          setFormWorkflows((data as any).settings.workflows);
        }
      } catch (err) {
        console.error('Failed to load form:', err);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [formId]);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, element: ElementDefinition) => {
    e.dataTransfer.setData('elementType', element.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') as any;
    const newElement = createDroppedElement(elementType);

    if (newElement) {
      const currentPageId = pages[currentPageIndex].id;
      setPageElements({
        ...pageElements,
        [currentPageId]: [...(pageElements[currentPageId] || []), newElement],
      });
      setSelectedElementId(newElement.id);
    }
  };

  // Page management
  const handleAddPage = () => {
    setNewPageName(`Page ${pages.length + 1}`);
    setPageDialogOpen(true);
  };

  const handleSavePage = () => {
    const newPage: PageData = {
      id: `page-${Date.now()}`,
      name: newPageName,
      description: '',
    };
    setPages([...pages, newPage]);
    setPageElements({
      ...pageElements,
      [newPage.id]: [],
    });
    setCurrentPageIndex(pages.length);
    setPageDialogOpen(false);
    setNewPageName('');
  };

  const handleUpdateElement = (elementId: string, updates: Partial<DroppedElement>) => {
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: updateElementById(pageElements[currentPageId], elementId, updates),
    });
  };

  const handleDeleteElement = (elementId: string) => {
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: deleteElementById(pageElements[currentPageId], elementId),
    });
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  // Reordering at root level
  const handleReorderElements = (sourceIndex: number, targetIndex: number) => {
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: reorderElements(pageElements[currentPageId], sourceIndex, targetIndex),
    });
  };

  // Drop into nested container
  const handleDropIntoContainer = (
    containerId: string,
    newElement: DroppedElement,
    columnIndex?: number
  ) => {
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: insertElementIntoContainer(
        pageElements[currentPageId],
        containerId,
        newElement,
        columnIndex
      ),
    });
    setSelectedElementId(newElement.id);
  };

  // Handle grid layout creation
  const handleCreateGridLayout = () => {
    setLayoutPickerOpen(true);
  };

  const handleSelectLayout = (columnCount: 1 | 2 | 3) => {
    const gridElement = createDroppedElement('grid-layout');
    if (!gridElement) return;

    // Create grid items based on selected column count
    const gridSize = 12 / columnCount;
    const gridItems = Array.from({ length: columnCount }, (_, i) => ({
      id: `grid-item-${Date.now()}-${i}`,
      size: gridSize,
      children: [],
    }));

    gridElement.gridItems = gridItems;

    // Add to current page
    const currentPageId = pages[currentPageIndex].id;
    setPageElements({
      ...pageElements,
      [currentPageId]: [...(pageElements[currentPageId] || []), gridElement],
    });
    setSelectedElementId(gridElement.id);
  };

  // Publish/unpublish handler
  const handlePublishToggle = async () => {
    if (!formData || isPublishing) return;

    try {
      setIsPublishing(true);
      const newPublishedState = !isPublished;
      await publishForm(formId, newPublishedState);
      setIsPublished(newPublishedState);
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Rule handlers
  const handleAddRule = (rule: Rule) => {
    setFormRules([...formRules, rule]);
  };

  const handleUpdateRule = (ruleId: string, rule: Rule) => {
    setFormRules(formRules.map((r) => (r.id === ruleId ? rule : r)));
  };

  const handleDeleteRule = (ruleId: string) => {
    setFormRules(formRules.filter((r) => r.id !== ruleId));
  };

  // Workflow save handler
  const handleSaveWorkflow = async (nodes: any[], edges: any[]) => {
    console.log('Saving workflow:', { nodes, edges });
    // Workflows will be saved with the form
    setWorkflowDialogOpen(false);
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading form builder...
        </Typography>
      </LoadingWrapper>
    );
  }

  if (error || !formData) {
    return (
      <ErrorWrapper>
        <Typography variant="h6" color="error">
          {error || 'Form not found'}
        </Typography>
      </ErrorWrapper>
    );
  }

  const currentElements = pageElements[pages[currentPageIndex]?.id] || [];

  return (
    <PageWrapper>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/dashboard')}
            size="small"
          >
            Back
          </Button>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {formData.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formData.description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SaveStatusIndicator
            status={saveStatus}
            lastSaved={lastSaved || undefined}
            error={saveError || undefined}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Save size={18} />}
              onClick={saveNow}
              disabled={saveStatus === 'saving'}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Eye size={18} />}
              onClick={() => setPreviewOpen(true)}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<GitBranch size={18} />}
              onClick={() => setRulesDialogOpen(true)}
            >
              Rules
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Workflow size={18} />}
              onClick={() => setWorkflowDialogOpen(true)}
            >
              Workflows
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handlePublishToggle}
              disabled={isPublishing}
              color={isPublished ? 'secondary' : 'primary'}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </Box>
        </Box>
      </TopBar>

      {/* Page Navigation */}
      <PageNav>
        <Button startIcon={<Plus size={18} />} onClick={handleAddPage} size="small">
          Add Page
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flex: 1, overflow: 'auto' }}>
          {pages.map((page, index) => (
            <PageTab
              key={page.id}
              onClick={() => setCurrentPageIndex(index)}
              isActive={currentPageIndex === index}
            >
              <Typography variant="body2">{page.name}</Typography>
            </PageTab>
          ))}
        </Box>
      </PageNav>

      {/* Main Content */}
      <MainContainer>
        <ElementsSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          expandedCategories={expandedCategories}
          onToggleCategory={(cat) =>
            setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
          }
          onDragStart={handleDragStart}
        />
        <FormCanvas
          elements={currentElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onDeleteElement={handleDeleteElement}
          onUpdateElement={handleUpdateElement}
          onReorderElements={handleReorderElements}
          onDropIntoContainer={handleDropIntoContainer}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onCreateGridLayout={handleCreateGridLayout}
        />
        <PropertiesPanel
          selectedElement={currentElements.find((el) => el.id === selectedElementId) || null}
          onUpdateElement={(updates) => handleUpdateElement(selectedElementId!, updates)}
          onCloseElement={() => setSelectedElementId(null)}
        />
      </MainContainer>

      {/* Page Dialog */}
      <Dialog open={pageDialogOpen} onClose={() => setPageDialogOpen(false)}>
        <DialogTitle>Add New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Page Name"
            fullWidth
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePage} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      {
        formData && (
          <PreviewDialog
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            pages={pages}
            pageElements={pageElements}
            formTitle={formData.name}
          />
        )
      }

      {/* Rules Manager */}
      <RulesManager
        open={rulesDialogOpen}
        onClose={() => setRulesDialogOpen(false)}
        rules={formRules}
        elements={currentElements}
        onAddRule={handleAddRule}
        onUpdateRule={handleUpdateRule}
        onDeleteRule={handleDeleteRule}
      />

      {/* Workflow Builder */}
      <WorkflowBuilder
        open={workflowDialogOpen}
        onClose={() => setWorkflowDialogOpen(false)}
        workflows={formWorkflows}
        rules={formRules}
        elements={currentElements}
        pages={pages}
        onAddRule={handleAddRule}
        onUpdateRule={handleUpdateRule}
        onDeleteRule={handleDeleteRule}
        onSave={handleSaveWorkflow}
      />
    </PageWrapper >
  );
}

// Styled Components
const PageWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#FAFAFA',
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

const ErrorWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PageNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PageTab = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
  color: isActive ? 'white' : theme.palette.text.secondary,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.grey[100],
  },
}));

const MainContainer = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});
