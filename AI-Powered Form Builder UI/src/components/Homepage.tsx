import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Stack, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Checkbox, 
  alpha, 
  useTheme,
  Paper,
  OutlinedInput,
  Tooltip,
  Popover,
  FormGroup,
  FormControlLabel,
  Avatar,
  Pagination,
  AppBar as MuiAppBar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery
} from '@mui/material';
import { 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  Eye, 
  Check,
  Download,
  ArrowDownUp,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Calendar,
  MessageSquare,
  User,
  SlidersHorizontal,
  Info,
  Menu as MenuIcon,
  X,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { FormTemplate } from '../App';
import { ProfileScreen } from './ProfileScreen';

// Simple AppBar component for the Homepage
function AppBar({ onViewProfile, onNavigateToTemplates }: { onViewProfile: () => void; onNavigateToTemplates?: () => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleViewProfile = () => {
    onViewProfile();
    handleProfileClose();
  };

  const drawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Drawer Header */}
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 0.5,
              bgcolor: '#1A1A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} color="white" strokeWidth={2.5} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1A1A1A',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            FormBuilder AI
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            U
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              User Name
            </Typography>
            <Typography variant="caption" color="text.secondary">
              user@example.com
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1.5, mb: 0.5 }} onClick={onNavigateToTemplates}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FileText size={20} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText 
              primary="Templates" 
              primaryTypographyProps={{ 
                variant: 'body2',
                color: 'text.secondary' 
              }} 
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1.5, mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HelpCircle size={20} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText 
              primary="Help" 
              primaryTypographyProps={{ 
                variant: 'body2',
                color: 'text.secondary' 
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper', 
          borderBottom: 1, 
          borderColor: 'divider',
          py: 2
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon size={24} />
                </IconButton>
              )}
              {/* Logo matching Landing Page */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 0.5,
                    bgcolor: '#1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} color="white" strokeWidth={2.5} />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#1A1A1A',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  FormBuilder AI
                </Typography>
              </Box>
            </Box>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={onNavigateToTemplates}
                  sx={{ 
                    textTransform: 'none',
                    color: 'text.secondary',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: alpha(theme.palette.secondary.main, 0.04),
                    }
                  }}
                >
                  Templates
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  sx={{ 
                    textTransform: 'none',
                    color: 'text.secondary',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: alpha(theme.palette.secondary.main, 0.04),
                    }
                  }}
                >
                  Help
                </Button>
                <IconButton 
                  onClick={handleProfileClick}
                  sx={{ 
                    p: 0,
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', cursor: 'pointer' }}>
                    U
                  </Avatar>
                </IconButton>
              </Box>
            )}
          </Box>
        </Container>
      </MuiAppBar>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            User Name
          </Typography>
          <Typography variant="caption" color="text.secondary">
            user@example.com
          </Typography>
        </Box>
        <MenuItem onClick={handleViewProfile} sx={{ py: 1.5, gap: 1.5 }}>
          <User size={18} />
          <Typography variant="body2">Profile Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5 }}>
          <Bell size={18} />
          <Typography variant="body2">Notifications</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5 }}>
          <Settings size={18} />
          <Typography variant="body2">Account Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}>
          <LogOut size={18} />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

interface HomepageProps {
  onTemplateSelect: (template: FormTemplate) => void;
  onViewProfile?: () => void;
  onNavigateToTemplates?: () => void;
}

interface FormData {
  id: number;
  name: string;
  responses: number;
  creator: string;
  color: string;
  createdAt: Date;
}

type SortOption = 'name-asc' | 'name-desc' | 'responses-asc' | 'responses-desc' | 'date-asc' | 'date-desc';

interface FilterState {
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
  responseRanges: string[];
  creators: string[];
  statuses: string[];
  creatorSearch: string;
}

export function Homepage({ onTemplateSelect, onViewProfile, onNavigateToTemplates }: HomepageProps) {
  const theme = useTheme();
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [moreFiltersAnchorEl, setMoreFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<null | HTMLElement>(null);
  const [responseRangeAnchorEl, setResponseRangeAnchorEl] = useState<null | HTMLElement>(null);
  const [creatorsAnchorEl, setCreatorsAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>('date-desc');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    responseRanges: [],
    creators: [],
    statuses: [],
    creatorSearch: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const allFormsData: FormData[] = [
    { id: 1, name: 'Sales Form', responses: 50, creator: 'Dinesh Kumar', color: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', createdAt: new Date('2024-01-15') },
    { id: 2, name: 'Product Form', responses: 60, creator: 'Andrew Robert', color: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', createdAt: new Date('2024-02-20') },
    { id: 3, name: 'Marketing Form', responses: 88, creator: 'Tarik Azzes', color: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)', createdAt: new Date('2024-03-10') },
    { id: 4, name: 'Survey Form', responses: 99, creator: 'John mark', color: 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)', createdAt: new Date('2024-03-25') },
    { id: 5, name: 'Customer Success Form', responses: 45, creator: 'Dinesh Kumar', color: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)', createdAt: new Date('2024-02-28') },
    { id: 6, name: 'School Forms', responses: 72, creator: 'Sarah Johnson', color: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)', createdAt: new Date('2024-03-15') },
    { id: 7, name: 'E-Commerce Forms', responses: 35, creator: 'Mike Chen', color: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', createdAt: new Date('2024-01-20') },
    { id: 8, name: 'Feedback Form', responses: 120, creator: 'Emily Davis', color: 'linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)', createdAt: new Date('2024-03-28') },
    { id: 9, name: 'Registration Form', responses: 95, creator: 'Alex Turner', color: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', createdAt: new Date('2024-03-22') },
    { id: 10, name: 'Contact Form', responses: 55, creator: 'Lisa Wang', color: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', createdAt: new Date('2024-02-10') },
    { id: 11, name: 'Newsletter Signup', responses: 150, creator: 'Tom Hardy', color: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)', createdAt: new Date('2024-03-30') },
    { id: 12, name: 'Event Registration', responses: 80, creator: 'Nina Patel', color: 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)', createdAt: new Date('2024-03-18') },
  ];

  const uniqueCreators = Array.from(new Set(allFormsData.map(form => form.creator)));

  // Filtered creators based on search
  const filteredCreators = useMemo(() => {
    return uniqueCreators.filter(creator =>
      creator.toLowerCase().includes(filters.creatorSearch.toLowerCase())
    );
  }, [filters.creatorSearch]);

  // Filter logic
  const filteredForms = useMemo(() => {
    return allFormsData.filter(form => {
      // Date filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (form.createdAt < fromDate) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (form.createdAt > toDate) return false;
      }

      // Response range filter
      if (form.responses < filters.responseRanges[0] || form.responses > filters.responseRanges[1]) {
        return false;
      }

      // Creator filter
      if (filters.creators.length > 0 && !filters.creators.includes(form.creator)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort logic
  const sortedForms = useMemo(() => {
    const forms = [...filteredForms];
    
    switch (currentSort) {
      case 'name-asc':
        return forms.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return forms.sort((a, b) => b.name.localeCompare(a.name));
      case 'responses-asc':
        return forms.sort((a, b) => a.responses - b.responses);
      case 'responses-desc':
        return forms.sort((a, b) => b.responses - a.responses);
      case 'date-asc':
        return forms.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'date-desc':
        return forms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      default:
        return forms;
    }
  }, [filteredForms, currentSort]);

  // Pagination logic
  const paginatedForms = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedForms.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedForms, page]);

  const totalPages = Math.ceil(sortedForms.length / itemsPerPage);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleMoreFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreFiltersAnchorEl(event.currentTarget);
  };

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateRangeAnchorEl(event.currentTarget);
  };

  const handleResponseRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setResponseRangeAnchorEl(event.currentTarget);
  };

  const handleCreatorsClick = (event: React.MouseEvent<HTMLElement>) => {
    setCreatorsAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleMoreFiltersClose = () => {
    setMoreFiltersAnchorEl(null);
  };

  const handleDateRangeClose = () => {
    setDateRangeAnchorEl(null);
  };

  const handleResponseRangeClose = () => {
    setResponseRangeAnchorEl(null);
  };

  const handleCreatorsClose = () => {
    setCreatorsAnchorEl(null);
  };

  const handleSortSelect = (sort: SortOption) => {
    setCurrentSort(sort);
    handleSortClose();
    setPage(1);
  };

  const handleCreatorToggle = (creator: string) => {
    setFilters(prev => ({
      ...prev,
      creators: prev.creators.includes(creator)
        ? prev.creators.filter(c => c !== creator)
        : [...prev.creators, creator]
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
      responseRanges: [],
      creators: [],
      statuses: [],
      creatorSearch: '',
    });
    setPage(1);
  };

  const handleApplyFilters = () => {
    handleMoreFiltersClose();
    setPage(1);
  };

  const getSortLabel = () => {
    switch (currentSort) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'responses-asc': return 'Responses (Low-High)';
      case 'responses-desc': return 'Responses (High-Low)';
      case 'date-asc': return 'Date (Oldest)';
      case 'date-desc': return 'Date (Newest)';
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.responseRanges.length > 0) count++;
    if (filters.creators.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* App Bar */}
      <AppBar onViewProfile={onViewProfile || (() => {})} onNavigateToTemplates={onNavigateToTemplates} />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Create Form Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
            Create Form
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {/* Start From Scratch */}
            <Paper
              onClick={() => onTemplateSelect('blank')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: 2,
                borderColor: 'grey.300',
                borderStyle: 'dashed',
                bgcolor: 'transparent',
                boxShadow: 'none',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(91, 95, 237, 0.04)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  bgcolor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Plus size={48} color={theme.palette.primary.main} strokeWidth={2.5} />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.primary' }}>
                Start From Scratch
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Jump right in and build something beautiful
              </Typography>
            </Paper>

            {/* Use Template */}
            <Paper
              onClick={() => onTemplateSelect('with-layout')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: 1,
                borderColor: 'transparent',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0px 0px 2px 0px rgba(91, 95, 237, 0.2), 0px 16px 32px -4px rgba(91, 95, 237, 0.24)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  position: 'relative',
                  boxShadow: `0px 8px 16px 0px ${alpha(theme.palette.primary.main, 0.24)}`,
                }}
              >
                <Box sx={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderRadius: '50%', bgcolor: 'white' }} />
                <Box sx={{ position: 'absolute', top: 12, right: 12, width: 32, height: 4, borderRadius: 1, bgcolor: 'white' }} />
                <Box sx={{ position: 'absolute', bottom: 20, left: 16, right: 16, height: 3, borderRadius: 1, bgcolor: 'white' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.primary' }}>
                Use Template
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Use a template to create and send a survey faster
              </Typography>
            </Paper>

            {/* Import Form */}
            <Paper
              onClick={() => onTemplateSelect('blank')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: 1,
                borderColor: 'transparent',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0px 0px 2px 0px rgba(91, 95, 237, 0.2), 0px 16px 32px -4px rgba(91, 95, 237, 0.24)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  position: 'relative',
                  boxShadow: `0px 8px 16px 0px ${alpha(theme.palette.primary.main, 0.24)}`,
                }}
              >
                <Box sx={{ width: 40, height: 3, borderRadius: 1, bgcolor: 'white', mb: 2 }} />
                <Download size={28} color="white" strokeWidth={2.5} style={{ position: 'absolute' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.primary' }}>
                Import Form
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Convert your existing forms instantly
              </Typography>
            </Paper>

            {/* Create with AI */}
            <Paper
              onClick={() => onTemplateSelect('ai')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: 1,
                borderColor: 'transparent',
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0px 0px 2px 0px rgba(91, 95, 237, 0.2), 0px 16px 32px -4px rgba(91, 95, 237, 0.24)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  bgcolor: 'white',
                  border: 3,
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Sparkles size={36} color={theme.palette.primary.main} strokeWidth={2.5} />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.primary' }}>
                Create with AI
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Save time and create forms faster let AI handle the first draft
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* All Forms Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ color: 'text.primary' }}>
              All Forms
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowDownUp size={18} />}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'grey.300',
                  '&:hover': {
                    borderColor: 'grey.400',
                    bgcolor: 'grey.100',
                  }
                }}
                onClick={handleSortClick}
              >
                Sort By
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem onClick={() => handleSortSelect('name-asc')}>
                  <ListItemIcon>
                    <ArrowDown size={16} />
                  </ListItemIcon>
                  <ListItemText>Name (A-Z)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('name-desc')}>
                  <ListItemIcon>
                    <ArrowUp size={16} />
                  </ListItemIcon>
                  <ListItemText>Name (Z-A)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('responses-asc')}>
                  <ListItemIcon>
                    <ArrowDown size={16} />
                  </ListItemIcon>
                  <ListItemText>Responses (Low-High)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('responses-desc')}>
                  <ListItemIcon>
                    <ArrowUp size={16} />
                  </ListItemIcon>
                  <ListItemText>Responses (High-Low)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('date-asc')}>
                  <ListItemIcon>
                    <ArrowDown size={16} />
                  </ListItemIcon>
                  <ListItemText>Date (Oldest)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('date-desc')}>
                  <ListItemIcon>
                    <ArrowUp size={16} />
                  </ListItemIcon>
                  <ListItemText>Date (Newest)</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Inline Filter Bar */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              border: 1,
              borderColor: 'grey.300',
              boxShadow: 'none',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {/* Search Filter */}
              <OutlinedInput
                placeholder="Search forms..."
                size="small"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                startAdornment={
                  <InputAdornment position="start">
                    <Search size={18} color="#637381" />
                  </InputAdornment>
                }
                sx={{
                  minWidth: 240,
                  flex: '1 1 auto',
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.400',
                  },
                }}
              />

              {/* Date Range Filter */}
              <Tooltip
                title={
                  filters.dateFrom || filters.dateTo ? (
                    <Box>
                      {filters.dateFrom && <Typography variant="caption">From: {filters.dateFrom}</Typography>}
                      {filters.dateFrom && filters.dateTo && <br />}
                      {filters.dateTo && <Typography variant="caption">To: {filters.dateTo}</Typography>}
                    </Box>
                  ) : ''
                }
                arrow
                placement="top"
              >
                <Button
                  variant="outlined"
                  onClick={handleDateRangeClick}
                  endIcon={<ChevronDown size={16} />}
                  sx={{
                    minWidth: 150,
                    maxWidth: 250,
                    justifyContent: 'space-between',
                    color: 'text.secondary',
                    borderColor: filters.dateFrom || filters.dateTo ? 'primary.main' : 'grey.300',
                    bgcolor: filters.dateFrom || filters.dateTo ? 'rgba(91, 95, 237, 0.08)' : 'transparent',
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: filters.dateFrom || filters.dateTo ? 'rgba(91, 95, 237, 0.12)' : 'grey.100',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden' }}>
                    <Calendar size={16} />
                    {filters.dateFrom || filters.dateTo ? (
                      <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                        {filters.dateFrom && (
                          <Chip
                            label={filters.dateFrom}
                            size="small"
                            onDelete={(e) => {
                              e.stopPropagation();
                              setFilters(prev => ({ ...prev, dateFrom: '' }));
                            }}
                            sx={{
                              height: 20,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                              '& .MuiChip-deleteIcon': { 
                                color: 'white', 
                                fontSize: '0.875rem',
                                '&:hover': { color: 'rgba(255,255,255,0.8)' }
                              }
                            }}
                          />
                        )}
                        {filters.dateTo && (
                          <Chip
                            label={filters.dateTo}
                            size="small"
                            onDelete={(e) => {
                              e.stopPropagation();
                              setFilters(prev => ({ ...prev, dateTo: '' }));
                            }}
                            sx={{
                              height: 20,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                              '& .MuiChip-deleteIcon': { 
                                color: 'white', 
                                fontSize: '0.875rem',
                                '&:hover': { color: 'rgba(255,255,255,0.8)' }
                              }
                            }}
                          />
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2">Date Range</Typography>
                    )}
                  </Box>
                </Button>
              </Tooltip>
              <Popover
                open={Boolean(dateRangeAnchorEl)}
                anchorEl={dateRangeAnchorEl}
                onClose={handleDateRangeClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                      mt: 1,
                      p: 2,
                      width: 280,
                    }
                  }
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="From"
                    type="date"
                    size="small"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="To"
                    type="date"
                    size="small"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }));
                        handleDateRangeClose();
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={handleDateRangeClose}
                    >
                      Apply
                    </Button>
                  </Stack>
                </Stack>
              </Popover>

              {/* Response Range Filter */}
              <Tooltip
                title={
                  filters.responseRanges.length > 0 ? (
                    <Box>
                      {filters.responseRanges.map((range, index) => (
                        <Box key={range}>
                          <Typography variant="caption">{range} responses</Typography>
                          {index < filters.responseRanges.length - 1 && <br />}
                        </Box>
                      ))}
                    </Box>
                  ) : ''
                }
                arrow
                placement="top"
              >
                <Button
                  variant="outlined"
                  onClick={handleResponseRangeClick}
                  endIcon={<ChevronDown size={16} />}
                  sx={{
                    minWidth: 150,
                    maxWidth: 250,
                    justifyContent: 'space-between',
                    color: 'text.secondary',
                    borderColor: filters.responseRanges.length > 0 ? 'primary.main' : 'grey.300',
                    bgcolor: filters.responseRanges.length > 0 ? 'rgba(91, 95, 237, 0.08)' : 'transparent',
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: filters.responseRanges.length > 0 ? 'rgba(91, 95, 237, 0.12)' : 'grey.100',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden' }}>
                    <MessageSquare size={16} />
                    {filters.responseRanges.length > 0 ? (
                      <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                        {filters.responseRanges.map(range => (
                          <Chip
                            key={range}
                            label={range}
                            size="small"
                            onDelete={(e) => {
                              e.stopPropagation();
                              setFilters(prev => ({ ...prev, responseRanges: prev.responseRanges.filter(r => r !== range) }));
                            }}
                            sx={{
                              height: 20,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                              '& .MuiChip-deleteIcon': { 
                                color: 'white', 
                                fontSize: '0.875rem',
                                '&:hover': { color: 'rgba(255,255,255,0.8)' }
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2">Responses</Typography>
                    )}
                  </Box>
                </Button>
              </Tooltip>
              <Menu
                anchorEl={responseRangeAnchorEl}
                open={Boolean(responseRangeAnchorEl)}
                onClose={handleResponseRangeClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem onClick={() => {
                  const val = '0-50';
                  setFilters(prev => ({
                    ...prev,
                    responseRanges: prev.responseRanges.includes(val)
                      ? prev.responseRanges.filter(r => r !== val)
                      : [...prev.responseRanges, val]
                  }));
                }}>
                  <ListItemIcon>
                    {filters.responseRanges.includes('0-50') ? <Check size={16} color={theme.palette.primary.main} strokeWidth={2.5} /> : <Box sx={{ width: 16 }} />}
                  </ListItemIcon>
                  <ListItemText>0-50 responses</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  const val = '51-100';
                  setFilters(prev => ({
                    ...prev,
                    responseRanges: prev.responseRanges.includes(val)
                      ? prev.responseRanges.filter(r => r !== val)
                      : [...prev.responseRanges, val]
                  }));
                }}>
                  <ListItemIcon>
                    {filters.responseRanges.includes('51-100') ? <Check size={16} color={theme.palette.primary.main} strokeWidth={2.5} /> : <Box sx={{ width: 16 }} />}
                  </ListItemIcon>
                  <ListItemText>51-100 responses</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  const val = '101+';
                  setFilters(prev => ({
                    ...prev,
                    responseRanges: prev.responseRanges.includes(val)
                      ? prev.responseRanges.filter(r => r !== val)
                      : [...prev.responseRanges, val]
                  }));
                }}>
                  <ListItemIcon>
                    {filters.responseRanges.includes('101+') ? <Check size={16} color={theme.palette.primary.main} strokeWidth={2.5} /> : <Box sx={{ width: 16 }} />}
                  </ListItemIcon>
                  <ListItemText>101+ responses</ListItemText>
                </MenuItem>
              </Menu>

              {/* Creator Filter */}
              <Tooltip
                title={
                  filters.creators.length > 0 ? (
                    <Box>
                      {filters.creators.map((creator, index) => (
                        <Box key={creator}>
                          <Typography variant="caption">{creator}</Typography>
                          {index < filters.creators.length - 1 && <br />}
                        </Box>
                      ))}
                    </Box>
                  ) : ''
                }
                arrow
                placement="top"
              >
                <Button
                  variant="outlined"
                  onClick={handleCreatorsClick}
                  endIcon={<ChevronDown size={16} />}
                  sx={{
                    minWidth: 150,
                    maxWidth: 250,
                    justifyContent: 'space-between',
                    color: 'text.secondary',
                    borderColor: filters.creators.length > 0 ? 'primary.main' : 'grey.300',
                    bgcolor: filters.creators.length > 0 ? 'rgba(91, 95, 237, 0.08)' : 'transparent',
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: filters.creators.length > 0 ? 'rgba(91, 95, 237, 0.12)' : 'grey.100',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden' }}>
                    <User size={16} />
                    {filters.creators.length > 0 ? (
                      <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                        {filters.creators.slice(0, 2).map(creator => (
                          <Chip
                            key={creator}
                            label={creator}
                            size="small"
                            onDelete={(e) => {
                              e.stopPropagation();
                              handleCreatorToggle(creator);
                            }}
                            avatar={
                              <Avatar sx={{ width: 16, height: 16, fontSize: '0.5rem', bgcolor: 'white', color: 'primary.main' }}>
                                {creator.charAt(0)}
                              </Avatar>
                            }
                            sx={{
                              height: 20,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                              '& .MuiChip-deleteIcon': { 
                                color: 'white', 
                                fontSize: '0.875rem',
                                '&:hover': { color: 'rgba(255,255,255,0.8)' }
                              }
                            }}
                          />
                        ))}
                        {filters.creators.length > 2 && (
                          <Chip
                            label={`+${filters.creators.length - 2}`}
                            size="small"
                            sx={{
                              height: 20,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                            }}
                          />
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2">Creators</Typography>
                    )}
                  </Box>
                </Button>
              </Tooltip>
              <Popover
                open={Boolean(creatorsAnchorEl)}
                anchorEl={creatorsAnchorEl}
                onClose={handleCreatorsClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                      mt: 1,
                      width: 300,
                    }
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  {/* Search Input */}
                  <OutlinedInput
                    placeholder="Search creators..."
                    size="small"
                    value={filters.creatorSearch}
                    onChange={(e) => setFilters(prev => ({ ...prev, creatorSearch: e.target.value }))}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search size={16} color="#637381" />
                      </InputAdornment>
                    }
                    fullWidth
                    sx={{
                      mb: 1.5,
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.400',
                      },
                    }}
                  />
                  
                  {/* Creators List */}
                  <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
                    {filteredCreators.length > 0 ? (
                      <FormGroup>
                        {filteredCreators.map(creator => (
                          <FormControlLabel
                            key={creator}
                            control={
                              <Checkbox
                                checked={filters.creators.includes(creator)}
                                onChange={() => handleCreatorToggle(creator)}
                                size="small"
                                sx={{
                                  '&.Mui-checked': {
                                    color: 'primary.main',
                                  }
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.625rem',
                                    bgcolor: 'primary.main',
                                  }}
                                >
                                  {creator.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{creator}</Typography>
                              </Box>
                            }
                            sx={{ ml: -0.5, '&:hover': { bgcolor: 'grey.100', borderRadius: 1 } }}
                          />
                        ))}
                      </FormGroup>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No creators found
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setFilters(prev => ({ ...prev, creators: [], creatorSearch: '' }));
                      }}
                      sx={{
                        color: 'text.secondary',
                        borderColor: 'grey.300',
                        '&:hover': {
                          borderColor: 'grey.400',
                          bgcolor: 'grey.100',
                        }
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={handleCreatorsClose}
                      sx={{
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0px 8px 16px 0px rgba(91, 95, 237, 0.24)',
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>
                </Box>
              </Popover>

              {/* More Filters Button */}
              <Button
                variant="outlined"
                startIcon={<SlidersHorizontal size={16} />}
                onClick={handleMoreFiltersClick}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'grey.300',
                  '&:hover': {
                    borderColor: 'grey.400',
                    bgcolor: 'grey.100',
                  }
                }}
              >
                More Filters
              </Button>
              
              {/* Clear All Button - Only show when filters are active */}
              {(filters.dateFrom || filters.dateTo || filters.responseRanges.length > 0 || filters.creators.length > 0) && (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleResetFilters}
                  sx={{ 
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.lighter' }
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Stack>
          </Paper>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {paginatedForms.map((form) => (
              <Paper
                key={form.id}
                sx={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 1,
                  borderColor: 'transparent',
                  boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                  '&:hover': {
                    boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 16px 32px -4px rgba(145, 158, 171, 0.16)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box
                  sx={{
                    height: 140,
                    background: form.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 2
                  }}
                >
                  <Paper
                    sx={{
                      width: '85%',
                      height: '75%',
                      bgcolor: 'white',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {form.name}
                    </Typography>
                  </Paper>
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      {form.responses} Responses
                    </Typography>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <MoreVertical size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '0.625rem',
                          bgcolor: 'primary.main',
                        }}
                      >
                        {form.creator.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {form.creator}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: 'text.disabled' }}>
                      <Info size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size="medium"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}