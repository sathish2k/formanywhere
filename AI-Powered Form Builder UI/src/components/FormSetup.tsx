import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  Container,
  useScrollTrigger,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Sparkles,
  GripVertical,
  User,
  Settings,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { LayoutBuilder, LayoutConfig } from './LayoutBuilder';

interface FormSetupProps {
  onBack: () => void;
  onSetupComplete: (formData: FormSetupData) => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export interface FormSetupData {
  name: string;
  title: string; // Alias for name
  description: string;
  pages: PageData[];
  layout?: LayoutConfig;
}

export interface PageData {
  id: string;
  name: string;
  description: string;
}

export function FormSetup({ 
  onBack, 
  onSetupComplete,
  onUpdateTheme,
  currentPrimaryColor = '#FF3B30',
  currentSecondaryColor = '#1A1A1A'
}: FormSetupProps) {
  const [formName, setFormName] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [pages, setPages] = useState<PageData[]>([
    { id: 'page-1', name: 'Page 1', description: 'First page of your form' }
  ]);
  
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  // Layout state
  const [layouts, setLayouts] = useState<LayoutConfig[]>([]);
  const [layoutBuilderOpen, setLayoutBuilderOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState<LayoutConfig | null>(null);

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

  const handleSavePage = () => {
    if (editingPage) {
      // Edit existing page
      setPages(pages.map(p => 
        p.id === editingPage.id 
          ? { ...p, name: newPageName, description: newPageDescription }
          : p
      ));
    } else {
      // Add new page
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        name: newPageName,
        description: newPageDescription
      };
      setPages([...pages, newPage]);
    }
    setPageDialogOpen(false);
    setNewPageName('');
    setNewPageDescription('');
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length > 1) {
      setPages(pages.filter(p => p.id !== pageId));
    }
  };

  const handleSetupComplete = () => {
    onSetupComplete({
      name: formName,
      title: formName, // Alias for name
      description: formDescription,
      pages,
      layout: layouts.length > 0 ? layouts[0] : undefined
    });
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Layout handlers
  const handleAddLayout = () => {
    setEditingLayout(null);
    setLayoutBuilderOpen(true);
  };

  const handleEditLayout = (layout: LayoutConfig) => {
    setEditingLayout(layout);
    setLayoutBuilderOpen(true);
  };

  const handleSaveLayout = (layout: LayoutConfig) => {
    if (editingLayout) {
      setLayouts(layouts.map((l) => (l.id === layout.id ? layout : l)));
    } else {
      setLayouts([...layouts, layout]);
    }
    setLayoutBuilderOpen(false);
    setEditingLayout(null);
  };

  const handleDeleteLayout = (layoutId: string) => {
    setLayouts(layouts.filter((l) => l.id !== layoutId));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top Bar - Matching FormBuilder Design */}
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}40`,
              }}
            >
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Setup Your Form
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Configure form details and pages
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onUpdateTheme && (
            <ThemeCustomizer 
              onUpdateTheme={onUpdateTheme}
              currentPrimary={currentPrimaryColor}
              currentSecondary={currentSecondaryColor}
            />
          )}
          
          <IconButton
            size="small"
            onClick={handleProfileMenuOpen}
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
          
          <Chip 
            label="Free" 
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>
      
      {/* Settings Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <User size={16} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings size={16} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 4,
          px: 3,
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Paper
            sx={{
              p: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2
            }}
          >
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}40`,
                }}
              >
                <FileText size={32} color="white" strokeWidth={2} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Configure Your Form
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Set up your form details and organize it into pages
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Form Details Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Form Details
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Form Name <Typography component="span" color="error">*</Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter form name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Form Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe what this form is about..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Pages Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Form Pages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organize your form into multiple pages
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  onClick={handleAddPage}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Add Page
                </Button>
              </Box>

              {/* Pages List */}
              <Stack spacing={2}>
                {pages.map((page, index) => (
                  <Card
                    key={page.id}
                    variant="outlined"
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'grab',
                            color: 'text.secondary',
                            '&:active': {
                              cursor: 'grabbing'
                            }
                          }}
                        >
                          <GripVertical size={20} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip
                              label={`${index + 1}`}
                              size="small"
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontWeight: 700,
                                minWidth: 28,
                                height: 24
                              }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {page.name}
                            </Typography>
                          </Box>
                          {page.description && (
                            <Typography variant="body2" color="text.secondary">
                              {page.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
                      <Button
                        size="small"
                        startIcon={<Edit2 size={14} />}
                        onClick={() => handleEditPage(page)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.lighter',
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Trash2 size={14} />}
                        onClick={() => handleDeletePage(page.id)}
                        disabled={pages.length === 1}
                        sx={{
                          '&:hover': {
                            bgcolor: 'error.lighter',
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>

              {pages.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No pages added yet. Click "Add Page" to get started.
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Layout Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Form Layout
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure multi-step form layout and navigation
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<LayoutGrid size={18} />}
                  onClick={handleAddLayout}
                  sx={{ 
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    }
                  }}
                >
                  {layouts.length > 0 ? 'Edit Layout' : 'Add Layout'}
                </Button>
              </Box>

              {/* Layout List */}
              {layouts.length > 0 ? (
                <Stack spacing={2}>
                  {layouts.map((layout) => (
                    <Card
                      key={layout.id}
                      variant="outlined"
                      sx={{
                        transition: 'all 0.2s',
                        bgcolor: 'primary.lighter',
                        borderColor: 'primary.light',
                        '&:hover': {
                          boxShadow: 3,
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <LayoutGrid size={20} color="white" />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {layout.name}
                            </Typography>
                            {layout.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {layout.description}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={`Stepper: ${layout.stepperStyle}`}
                                size="small"
                                sx={{ bgcolor: 'background.paper' }}
                              />
                              <Chip
                                label={`Header: ${layout.headerElements.length} elements`}
                                size="small"
                                sx={{ bgcolor: 'background.paper' }}
                              />
                              <Chip
                                label={`Footer: ${layout.footerElements.length} elements`}
                                size="small"
                                sx={{ bgcolor: 'background.paper' }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
                        <Button
                          size="small"
                          startIcon={<Edit2 size={14} />}
                          onClick={() => handleEditLayout(layout)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.lighter',
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Trash2 size={14} />}
                          onClick={() => handleDeleteLayout(layout.id)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'error.lighter',
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: 'primary.light',
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <LayoutGrid size={48} style={{ color: '#999', marginBottom: 16 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    No Layout Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add a layout to configure your multi-step form navigation and UI
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={handleAddLayout}
                  >
                    Configure Layout
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'} • Multi-step form
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={20} />}
                onClick={handleSetupComplete}
                disabled={!formName || pages.length === 0}
                sx={{
                  bgcolor: 'primary.main',
                  px: 4,
                  py: 1.5
                }}
              >
                Start Building
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit Page Dialog */}
      <Dialog
        open={pageDialogOpen}
        onClose={() => setPageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPage ? 'Edit Page' : 'Add New Page'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Page Name <Typography component="span" color="error">*</Typography>
              </Typography>
              <TextField
                fullWidth
                autoFocus
                placeholder="e.g., Personal Information"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Page Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description of what this page contains..."
                value={newPageDescription}
                onChange={(e) => setNewPageDescription(e.target.value)}
              />
            </Box>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPageDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSavePage}
            variant="contained"
            disabled={!newPageName}
          >
            {editingPage ? 'Update Page' : 'Add Page'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Layout Builder Dialog */}
      <LayoutBuilder
        open={layoutBuilderOpen}
        onClose={() => setLayoutBuilderOpen(false)}
        editingLayout={editingLayout}
        onSave={handleSaveLayout}
        totalPages={pages.length}
      />
    </Box>
  );
}