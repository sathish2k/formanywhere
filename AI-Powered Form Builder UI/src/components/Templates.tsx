import { Box, Container, Typography, Button, Stack, Card, CardContent, TextField, Chip, InputAdornment, useTheme } from '@mui/material';
import { Search, ArrowRight, FileText, Users, Building2, Heart, ShoppingCart, Calendar, MessageSquare, ClipboardList, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { SharedAppBar } from './SharedAppBar';
import { SharedFooter } from './SharedFooter';

interface TemplatesProps {
  onUseTemplate?: (templateId: string) => void;
  onBackToHome: () => void;
  onPricing?: () => void;
  onAbout?: () => void;
  onFeatures?: () => void;
  onGetStarted?: () => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export function Templates({ 
  onUseTemplate, 
  onBackToHome, 
  onPricing, 
  onAbout,
  onFeatures,
  onGetStarted,
  onUpdateTheme,
  currentPrimaryColor = '#FF3B30',
  currentSecondaryColor = '#1A1A1A'
}: TemplatesProps) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Templates', icon: FileText },
    { id: 'contact', label: 'Contact Forms', icon: MessageSquare },
    { id: 'registration', label: 'Registration', icon: ClipboardList },
    { id: 'survey', label: 'Surveys', icon: Users },
    { id: 'booking', label: 'Booking', icon: Calendar },
    { id: 'order', label: 'Order Forms', icon: ShoppingCart },
    { id: 'feedback', label: 'Feedback', icon: Heart },
    { id: 'lead', label: 'Lead Generation', icon: TrendingUp },
  ];

  const templates = [
    {
      id: 'contact-basic',
      name: 'Simple Contact Form',
      description: 'A clean and minimal contact form for general inquiries',
      category: 'contact',
      popular: true,
      uses: '12.5K',
      fields: ['Name', 'Email', 'Message'],
      image: 'contact form',
    },
    {
      id: 'registration-event',
      name: 'Event Registration',
      description: 'Collect attendee information for conferences and events',
      category: 'registration',
      popular: true,
      uses: '8.2K',
      fields: ['Name', 'Email', 'Company', 'Ticket Type'],
      image: 'event registration',
    },
    {
      id: 'survey-customer',
      name: 'Customer Satisfaction Survey',
      description: 'Measure customer satisfaction with NPS and ratings',
      category: 'survey',
      popular: false,
      uses: '6.8K',
      fields: ['Rating', 'Feedback', 'Recommendations'],
      image: 'survey form',
    },
    {
      id: 'booking-appointment',
      name: 'Appointment Booking',
      description: 'Schedule appointments with calendar integration',
      category: 'booking',
      popular: true,
      uses: '10.1K',
      fields: ['Name', 'Email', 'Date', 'Time', 'Service'],
      image: 'appointment booking',
    },
    {
      id: 'order-product',
      name: 'Product Order Form',
      description: 'Accept product orders with quantity and shipping details',
      category: 'order',
      popular: false,
      uses: '5.3K',
      fields: ['Product', 'Quantity', 'Shipping Address'],
      image: 'order form',
    },
    {
      id: 'feedback-employee',
      name: 'Employee Feedback',
      description: 'Gather 360-degree feedback from team members',
      category: 'feedback',
      popular: false,
      uses: '4.7K',
      fields: ['Performance', 'Goals', 'Comments'],
      image: 'feedback form',
    },
    {
      id: 'lead-demo',
      name: 'Demo Request Form',
      description: 'Qualify leads and schedule product demonstrations',
      category: 'lead',
      popular: true,
      uses: '9.4K',
      fields: ['Company', 'Role', 'Team Size', 'Use Case'],
      image: 'demo request',
    },
    {
      id: 'registration-webinar',
      name: 'Webinar Registration',
      description: 'Sign up attendees for online webinars and training',
      category: 'registration',
      popular: false,
      uses: '7.1K',
      fields: ['Name', 'Email', 'Job Title', 'Questions'],
      image: 'webinar form',
    },
    {
      id: 'survey-employee',
      name: 'Employee Engagement Survey',
      description: 'Measure team morale and engagement levels',
      category: 'survey',
      popular: false,
      uses: '3.9K',
      fields: ['Satisfaction', 'Culture', 'Growth'],
      image: 'employee survey',
    },
    {
      id: 'contact-support',
      name: 'Customer Support Form',
      description: 'Handle support tickets with priority and category',
      category: 'contact',
      popular: false,
      uses: '11.2K',
      fields: ['Name', 'Issue Type', 'Priority', 'Description'],
      image: 'support form',
    },
    {
      id: 'booking-restaurant',
      name: 'Restaurant Reservation',
      description: 'Take reservations with party size and preferences',
      category: 'booking',
      popular: false,
      uses: '6.5K',
      fields: ['Name', 'Date', 'Time', 'Party Size', 'Special Requests'],
      image: 'restaurant booking',
    },
    {
      id: 'lead-consultation',
      name: 'Free Consultation Request',
      description: 'Capture leads for consulting services',
      category: 'lead',
      popular: false,
      uses: '5.8K',
      fields: ['Name', 'Business', 'Budget', 'Timeline'],
      image: 'consultation form',
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularTemplates = templates.filter(t => t.popular);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
      <SharedAppBar 
        onBackToHome={onBackToHome} 
        onPricing={onPricing} 
        onAbout={onAbout}
        onFeatures={onFeatures}
        onGetStarted={onGetStarted}
        onUpdateTheme={onUpdateTheme}
        currentPrimaryColor={currentPrimaryColor}
        currentSecondaryColor={currentSecondaryColor}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              label="Form Templates"
              sx={{
                mb: 3,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Start with a template
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)' }}>
              Choose from our library of professionally designed form templates. Customize and deploy in minutes.
            </Typography>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="rgba(0, 0, 0, 0.54)" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Popular Templates */}
      {selectedCategory === 'all' && !searchQuery && (
        <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
              <Star size={24} color={theme.palette.primary.main} fill={theme.palette.primary.main} />
              <Typography variant="h4">
                Popular Templates
              </Typography>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              {popularTemplates.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0px 8px 24px 0px ${theme.palette.primary.main}20`,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Template Icon/Preview */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 140,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <FileText size={48} color={theme.palette.primary.main} strokeWidth={1.5} />
                      {template.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            height: 24,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>

                    {/* Template Info */}
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {template.description}
                    </Typography>

                    {/* Fields */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      {template.fields.slice(0, 3).map((field, index) => (
                        <Chip
                          key={index}
                          label={field}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#F5F5F5',
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Footer */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {template.uses} uses
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        endIcon={<ArrowRight size={16} />}
                        onClick={() => onUseTemplate?.(template.id)}
                        sx={{ minWidth: 'auto' }}
                      >
                        Use
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Category Filters */}
      <Box sx={{ bgcolor: 'white', py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Chip
                  key={category.id}
                  icon={<Icon size={16} />}
                  label={category.label}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    height: 40,
                    px: 1,
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    color: isSelected ? 'white' : 'text.primary',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    fontWeight: isSelected ? 600 : 400,
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiChip-icon': {
                      color: isSelected ? 'white' : theme.palette.primary.main,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Container>
      </Box>

      {/* All Templates Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {filteredTemplates.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  bgcolor: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0px 8px 24px 0px ${theme.palette.primary.main}20`,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Template Preview */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 160,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <FileText size={56} color={theme.palette.primary.main} strokeWidth={1.5} />
                    {template.popular && (
                      <Chip
                        label="Popular"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          height: 24,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  {/* Template Info */}
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, minHeight: 40 }}>
                    {template.description}
                  </Typography>

                  {/* Category Badge */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={categories.find(c => c.id === template.category)?.label || template.category}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        bgcolor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Fields */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
                    {template.fields.slice(0, 4).map((field, index) => (
                      <Chip
                        key={index}
                        label={field}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: '#F5F5F5',
                        }}
                      />
                    ))}
                    {template.fields.length > 4 && (
                      <Chip
                        label={`+${template.fields.length - 4}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: '#F5F5F5',
                        }}
                      />
                    )}
                  </Stack>

                  {/* Footer */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                      {template.uses} uses
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowRight size={16} />}
                      onClick={() => onUseTemplate?.(template.id)}
                      sx={{
                        minWidth: 'auto',
                        textTransform: 'none',
                      }}
                    >
                      Use Template
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FileText size={64} color="#CCC" strokeWidth={1.5} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              No templates found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 10 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Can't find what you're looking for?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3, maxWidth: 600, mx: 'auto' }}>
              Start from scratch with our powerful drag-and-drop form builder or let AI generate a custom form for you.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={onBackToHome}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Create from Scratch
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Try AI Generator
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <SharedFooter />
    </Box>
  );
}