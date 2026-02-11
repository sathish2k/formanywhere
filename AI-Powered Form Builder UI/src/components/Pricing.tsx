import { Box, Container, Typography, Button, Stack, Card, CardContent, Switch, Chip, useTheme } from '@mui/material';
import { Check, X, ArrowRight, Zap, Users, Building2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { SharedAppBar } from './SharedAppBar';
import { SharedFooter } from './SharedFooter';

interface PricingProps {
  onGetStarted?: () => void;
  onBackToHome: () => void;
  onAbout?: () => void;
  onTemplates?: () => void;
  onFeatures?: () => void;
  onUpdateTheme?: (primary: string, secondary: string) => void;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
}

export function Pricing({ onGetStarted, onBackToHome, onAbout, onTemplates, onFeatures, onUpdateTheme, currentPrimaryColor = '#FF3B30', currentSecondaryColor = '#1A1A1A' }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const theme = useTheme();

  const plans = [
    {
      name: 'Starter',
      icon: Sparkles,
      description: 'Perfect for individuals and small projects',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        { name: 'Up to 3 forms', included: true },
        { name: '100 submissions/month', included: true },
        { name: 'Basic form fields', included: true },
        { name: 'Email notifications', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Community support', included: true },
        { name: 'Multi-step forms', included: false },
        { name: 'Conditional logic', included: false },
        { name: 'Custom branding', included: false },
        { name: 'API access', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      gradient: false,
    },
    {
      name: 'Professional',
      icon: Zap,
      description: 'For growing teams and businesses',
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: [
        { name: 'Unlimited forms', included: true },
        { name: '10,000 submissions/month', included: true },
        { name: 'All form field types', included: true },
        { name: 'Email notifications', included: true },
        { name: 'Premium templates', included: true },
        { name: 'Priority support', included: true },
        { name: 'Multi-step forms', included: true },
        { name: 'Conditional logic', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Team collaboration', included: false },
      ],
      cta: 'Start Free Trial',
      gradient: true,
    },
    {
      name: 'Enterprise',
      icon: Building2,
      description: 'For large organizations with custom needs',
      monthlyPrice: null,
      annualPrice: null,
      popular: false,
      features: [
        { name: 'Unlimited everything', included: true },
        { name: 'Custom submission limits', included: true },
        { name: 'All form field types', included: true },
        { name: 'Advanced notifications', included: true },
        { name: 'Custom templates', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Multi-step forms', included: true },
        { name: 'Advanced conditional logic', included: true },
        { name: 'White-label solution', included: true },
        { name: 'Full API access', included: true },
        { name: 'Custom analytics', included: true },
        { name: 'Team collaboration', included: true },
      ],
      cta: 'Contact Sales',
      gradient: false,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
      <SharedAppBar 
        onBackToHome={onBackToHome} 
        onAbout={onAbout}
        onTemplates={onTemplates}
        onFeatures={onFeatures}
        onGetStarted={onGetStarted}
        onUpdateTheme={onUpdateTheme}
        currentPrimaryColor={currentPrimaryColor}
        currentSecondaryColor={currentSecondaryColor}
      />

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Chip
            label="Pricing Plans"
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Typography variant="h2" sx={{ mb: 2, color: 'text.primary' }}>
            Simple, transparent pricing
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Choose the perfect plan for your needs. Always flexible to scale up or down.
          </Typography>

          {/* Annual/Monthly Toggle */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 6 }}>
            <Typography variant="body1" color={!isAnnual ? 'primary' : 'text.secondary'} sx={{ fontWeight: !isAnnual ? 600 : 400 }}>
              Monthly
            </Typography>
            <Switch checked={isAnnual} onChange={(e) => setIsAnnual(e.target.checked)} />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" color={isAnnual ? 'primary' : 'text.secondary'} sx={{ fontWeight: isAnnual ? 600 : 400 }}>
                Annual
              </Typography>
              <Chip
                label="Save 17%"
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  height: 24,
                }}
              />
            </Stack>
          </Stack>

          {/* Pricing Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 6 }}>
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              const displayPrice = price === null ? 'Custom' : price === 0 ? 'Free' : `$${price}`;
              const priceSubtext = price === null ? 'Contact us for pricing' : price === 0 ? 'Forever free' : isAnnual ? '/year' : '/month';

              return (
                <Box key={plan.name} sx={{ position: 'relative', pt: plan.popular ? 2 : 0 }}>
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <Chip
                        label="Most Popular"
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          fontWeight: 700,
                          boxShadow: '0px 4px 12px 0px rgba(91, 95, 237, 0.24)',
                          px: 2,
                          height: 32,
                        }}
                      />
                    </Box>
                  )}

                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      border: plan.popular ? '2px solid' : '1px solid',
                      borderColor: plan.popular ? 'primary.main' : 'divider',
                      background: plan.gradient ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'white',
                      color: plan.gradient ? 'white' : 'text.primary',
                      boxShadow: plan.popular ? `0px 12px 24px 0px ${theme.palette.primary.main}40` : 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: plan.popular ? `0px 16px 32px 0px ${theme.palette.primary.main}50` : 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: plan.gradient ? 'rgba(255, 255, 255, 0.2)' : `${theme.palette.primary.main}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Icon size={24} color={plan.gradient ? 'white' : theme.palette.primary.main} strokeWidth={2} />
                      </Box>

                      {/* Plan Name */}
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 3,
                          color: plan.gradient ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
                        }}
                      >
                        {plan.description}
                      </Typography>

                      {/* Price */}
                      <Stack direction="row" alignItems="baseline" sx={{ mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          {displayPrice}
                        </Typography>
                        {price !== null && price > 0 && (
                          <Typography
                            variant="body1"
                            sx={{
                              ml: 1,
                              color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                            }}
                          >
                            {priceSubtext}
                          </Typography>
                        )}
                        {price === 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                            }}
                          >
                            Forever free
                          </Typography>
                        )}
                        {price === null && (
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              color: plan.gradient ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                            }}
                          >
                            Contact us
                          </Typography>
                        )}
                      </Stack>

                      {/* CTA Button */}
                      <Button
                        variant={plan.gradient ? 'outlined' : 'contained'}
                        size="large"
                        fullWidth
                        endIcon={<ArrowRight size={18} />}
                        onClick={onGetStarted}
                        sx={{
                          py: 1.5,
                          mb: 3,
                          ...(plan.gradient
                            ? {
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': {
                                  borderColor: 'white',
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                },
                              }
                            : {
                                boxShadow: '0px 8px 16px 0px rgba(91, 95, 237, 0.24)',
                                '&:hover': {
                                  boxShadow: '0px 12px 24px 0px rgba(91, 95, 237, 0.32)',
                                },
                              }),
                        }}
                      >
                        {plan.cta}
                      </Button>

                      {/* Features List */}
                      <Stack spacing={2}>
                        {plan.features.map((feature) => (
                          <Stack key={feature.name} direction="row" spacing={1.5} alignItems="flex-start">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: feature.included
                                  ? plan.gradient
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : `${theme.palette.primary.main}20`
                                  : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mt: 0.2,
                              }}
                            >
                              {feature.included ? (
                                <Check size={14} color={plan.gradient ? 'white' : theme.palette.primary.main} strokeWidth={3} />
                              ) : (
                                <X size={14} color={plan.gradient ? 'rgba(255, 255, 255, 0.4)' : '#999'} strokeWidth={2} />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: feature.included
                                  ? plan.gradient
                                    ? 'white'
                                    : 'text.primary'
                                  : plan.gradient
                                  ? 'rgba(255, 255, 255, 0.5)'
                                  : 'text.disabled',
                                textDecoration: feature.included ? 'none' : 'line-through',
                              }}
                            >
                              {feature.name}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>

          {/* FAQ Section */}
          <Box sx={{ mt: 10, textAlign: 'left', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={3}>
              {[
                {
                  q: 'Can I change plans later?',
                  a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What happens when I exceed my submission limit?',
                  a: "You'll receive a notification when you're approaching your limit. You can upgrade your plan or purchase additional submissions.",
                },
                {
                  q: 'Do you offer refunds?',
                  a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
                },
                {
                  q: 'Is my data secure?',
                  a: 'Absolutely. We use enterprise-grade security with encryption at rest and in transit. SOC 2 Type II compliant.',
                },
              ].map((faq) => (
                <Box key={faq.q} sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {faq.q}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.a}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              mt: 10,
              p: 6,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
              Our team is here to help. Get in touch and we'll respond within 24 hours.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <SharedFooter />
    </Box>
  );
}