import { Box, Container, Typography, Button, Stack, Card, CardContent, Avatar, Chip, useTheme } from '@mui/material';
import { Sparkles, Target, Users, Zap, Shield, Globe, Heart, Award } from 'lucide-react';
import { SharedAppBar } from './SharedAppBar';
import { SharedFooter } from './SharedFooter';

interface AboutProps {
  onGetStarted?: () => void;
  onBackToHome: () => void;
  onPricing?: () => void;
  onTemplates?: () => void;
  onFeatures?: () => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export function About({ onGetStarted, onBackToHome, onPricing, onTemplates, onFeatures, onUpdateTheme, currentPrimaryColor = '#FF3B30', currentSecondaryColor = '#1A1A1A' }: AboutProps) {
  const theme = useTheme();
  
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe form building should be intuitive, powerful, and accessible to everyone.',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Leveraging AI and modern technology to push the boundaries of what forms can do.',
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security ensuring your data is always protected and compliant.',
    },
    {
      icon: Heart,
      title: 'Customer Success',
      description: 'Your success is our success. We provide world-class support every step of the way.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Product at SaaS unicorn. Stanford CS grad.',
      avatar: 'SJ',
      color: '#5B5FED',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google Staff Engineer. MIT alumnus with AI/ML expertise.',
      avatar: 'MC',
      color: '#8E33FF',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      bio: 'Award-winning designer from Apple and Airbnb.',
      avatar: 'ER',
      color: '#FF6B9D',
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: '15 years building scalable systems at Facebook and Uber.',
      avatar: 'DK',
      color: '#00D4AA',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '500K+', label: 'Forms Created' },
    { value: '50M+', label: 'Submissions Processed' },
    { value: '99.9%', label: 'Uptime SLA' },
  ];

  const milestones = [
    { year: '2022', event: 'Founded', description: 'FormBuilder AI was born from a frustration with complex form tools' },
    { year: '2023', event: 'Series A', description: 'Raised $10M led by top-tier VCs to scale our platform' },
    { year: '2023', event: '1,000 Customers', description: 'Reached our first major milestone with enterprise clients' },
    { year: '2024', event: 'AI Integration', description: 'Launched AI-powered form generation and analytics' },
    { year: '2024', event: 'Global Expansion', description: 'Expanded to serve customers in 50+ countries' },
    { year: '2025', event: 'Today', description: 'Leading the future of intelligent form building' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
      <SharedAppBar 
        onBackToHome={onBackToHome} 
        onPricing={onPricing}
        onTemplates={onTemplates}
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
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              label="About Us"
              sx={{
                mb: 3,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Typography variant="h2" sx={{ mb: 3 }}>
              Building the future of intelligent forms
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
              We're on a mission to transform how businesses collect, manage, and act on data through AI-powered form solutions that are beautiful, powerful, and
              incredibly easy to use.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Get Started Free
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mt: 6 }}>
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              FormBuilder AI was founded in 2022 by a team of engineers and designers who were frustrated with the complexity of existing form builders. We
              believed there had to be a better way.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
              We set out to create a platform that combines the simplicity of drag-and-drop with the power of AI, enabling anyone to build sophisticated forms in
              minutes instead of hours.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Today, thousands of teams worldwide trust FormBuilder AI to power their most critical data collection workflows. From startups to Fortune 500
              companies, we're helping organizations collect better data and make smarter decisions.
            </Typography>
          </Box>
          <Box>
            <Box
              sx={{
                bgcolor: 'white',
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Stack spacing={3}>
                {milestones.map((milestone, index) => (
                  <Stack key={index} direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                        {milestone.year}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {milestone.event}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {milestone.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Our Values
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              These core principles guide everything we do, from product development to customer support.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon size={28} color="white" strokeWidth={2} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We're a diverse team of builders, designers, and problem-solvers united by our passion for creating exceptional products.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {team.map((member) => (
            <Card
              key={member.name}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                bgcolor: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: member.color,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {member.bio}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We're always looking for talented people to join our team
          </Typography>
          <Button variant="outlined" size="large">
            View Open Positions
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative circle */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
                Ready to get started?
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Join thousands of teams using FormBuilder AI to create beautiful, intelligent forms.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Start Free Trial
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
                  Contact Sales
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <SharedFooter />
    </Box>
  );
}