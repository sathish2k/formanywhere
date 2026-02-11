/**
 * Form Setup Component
 * Main entry point for form setup page
 * Uses shared UI sections from shared/form-setup
 */

'use client';

import { DashboardAppBar } from '@/shared/dashboard';
import { PageDialog } from '@/shared/form-builder';
import {
  FormDetailsSection,
  FormLayoutSection,
  FormPagesSection,
  FormSetupActionBar,
  FormSetupHeroSection,
} from '@/shared/form-setup';
import { Box, Container, Divider, IconButton, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  type FormSetupData,
  type LayoutConfig,
  type PageData,
  defaultPage,
} from './form-setup.configuration';
import { saveForm } from './form-setup.datasource';

export function FormSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const layoutType = (searchParams.get('layout') as 'classic' | 'card') || 'classic';
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';

  // Form state
  const [formName, setFormName] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [pages, setPages] = useState<PageData[]>([defaultPage]);
  const [layout, setLayout] = useState<LayoutConfig | null>(null);

  // Dialog state
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');

  const handleBack = () => {
    router.push('/form-builder/new');
  };

  const handleAddPage = () => {
    setEditingPage(null);
    setNewPageName(`Page ${pages.length + 1}`);
    setNewPageDescription('');
    setPageDialogOpen(true);
  };

  const handleEditPage = (page: PageData) => {
    setEditingPage(page);
    setNewPageName(page.name);
    setNewPageDescription(page.description);
    setPageDialogOpen(true);
  };

  const handleSavePage = (name: string, description: string) => {
    if (editingPage) {
      setPages(pages.map((p) => (p.id === editingPage.id ? { ...p, name, description } : p)));
    } else {
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        name,
        description,
      };
      setPages([...pages, newPage]);
    }
    setPageDialogOpen(false);
    setNewPageName('');
    setNewPageDescription('');
    setEditingPage(null);
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length > 1) {
      setPages(pages.filter((p) => p.id !== pageId));
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      alert('Please log in to save your form.');
      return;
    }

    // Prepare complete form data for backend
    const formData: FormSetupData = {
      name: formName,
      description: formDescription,
      pages: pages,
      layoutType: layoutType,
      layout: layout, // Can be null (optional)
    };

    console.log('Saving form data to backend:', formData);

    try {
      // Save form to backend with userId
      const { id: formId } = await saveForm(formData, session.user.id);
      console.log('Form saved successfully with ID:', formId);

      // Navigate to form builder with form ID
      router.push(`/form-builder/${formId}`);
    } catch (error) {
      console.error('Error saving form:', error);
      // TODO: Show error toast notification
      alert('Failed to save form. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <DashboardAppBar userName={userName} userEmail={userEmail} />

      <ContentWrapper>
        <Container maxWidth="md" disableGutters>
          <TopBar>
            <IconButton onClick={handleBack} size="small" sx={{ color: 'text.secondary' }}>
              <ArrowLeft size={20} />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconBox>
                <Sparkles size={20} color="white" strokeWidth={2.5} />
              </IconBox>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Setup Your Form
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Configure form details and pages
                </Typography>
              </Box>
            </Box>
          </TopBar>

          <FormPaper>
            <FormSetupHeroSection />

            <Divider sx={{ mb: 4 }} />

            <FormDetailsSection
              formName={formName}
              onFormNameChange={setFormName}
              formDescription={formDescription}
              onFormDescriptionChange={setFormDescription}
            />

            <Divider sx={{ mb: 4 }} />

            <FormPagesSection
              pages={pages}
              onAddPage={handleAddPage}
              onEditPage={handleEditPage}
              onDeletePage={handleDeletePage}
            />

            <Divider sx={{ my: 4 }} />

            <FormLayoutSection
              layout={layout}
              onLayoutChange={setLayout}
              totalPages={pages.length}
              pages={pages}
            />

            <Divider sx={{ my: 4 }} />

            <FormSetupActionBar
              pageCount={pages.length}
              layoutType={layoutType}
              formName={formName}
              onSubmit={handleSubmit}
            />
          </FormPaper>
        </Container>
      </ContentWrapper>

      <PageDialog
        open={pageDialogOpen}
        onClose={() => setPageDialogOpen(false)}
        onSave={handleSavePage}
        editingPage={editingPage}
        pageName={newPageName}
        onPageNameChange={setNewPageName}
        pageDescription={newPageDescription}
        onPageDescriptionChange={setNewPageDescription}
      />
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[50],
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.spacing(1.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  borderRadius: theme.spacing(2),
}));
