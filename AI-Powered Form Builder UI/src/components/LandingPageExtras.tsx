import { Box, Container, Typography, Paper, Stack, Chip, Avatar, Divider, Button, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import { Star, Shield, Lock, Award, DollarSign, Check, ChevronDown } from 'lucide-react';

export function LandingPageTestimonials() {
  const theme = useTheme();
  
  return (
    <Box sx={{ bgcolor: 'white', py: 12 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="TESTIMONIALS"
            sx={{
              mb: 2,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
            Loved by Thousands of Users
          </Typography>
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
            See what our customers have to say about FormBuilder AI
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            {
              name: 'Sarah Johnson',
              role: 'Product Manager',
              company: 'TechCorp',
              avatar: 'S',
              rating: 5,
              text: 'FormBuilder AI has completely transformed how we collect customer feedback. The AI-powered generation saves us hours every week, and the analytics are incredibly insightful.',
              color: '#FF5630',
            },
            {
              name: 'Michael Chen',
              role: 'Operations Director',
              company: 'Global Solutions',
              avatar: 'M',
              rating: 5,
              text: 'The multi-step workflow feature is a game-changer. We\'ve been able to create complex onboarding forms that used to take developers weeks to build. Now it takes minutes!',
              color: '#00B8D9',
            },
            {
              name: 'Emily Rodriguez',
              role: 'Marketing Lead',
              company: 'StartupXYZ',
              avatar: 'E',
              rating: 5,
              text: 'Best form builder I\'ve ever used. The drag-and-drop interface is intuitive, and the integrations with our existing tools work flawlessly. Highly recommend!',
              color: '#22C55E',
            },
          ].map((testimonial, index) => (
            <Paper
              key={index}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid rgba(145, 158, 171, 0.16)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
                },
              }}
            >
              {/* Rating */}
              <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill={theme.palette.primary.main} color={theme.palette.primary.main} />
                ))}
              </Stack>

              {/* Quote */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#637381', 
                  lineHeight: 1.8, 
                  mb: 4,
                  flex: 1,
                  fontStyle: 'italic',
                }}
              >
                "{testimonial.text}"
              </Typography>

              {/* Author */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: testimonial.color,
                    fontWeight: 700,
                  }}
                >
                  {testimonial.avatar}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#212B36', fontWeight: 700 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#637381' }}>
                    {testimonial.role} at {testimonial.company}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export function LandingPageSecurity() {
  const theme = useTheme();
  
  return (
    <Box sx={{ bgcolor: '#F9FAFB', py: 14 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Chip
            label="SECURITY & COMPLIANCE"
            sx={{
              mb: 2,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
            Enterprise-Grade Security & Compliance
          </Typography>
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400, maxWidth: 800, mx: 'auto' }}>
            Bank-level security protecting millions of form submissions daily. Trusted by Fortune 500 companies and healthcare organizations worldwide.
          </Typography>
        </Box>

        {/* Main Certifications Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
          {[
            {
              icon: Shield,
              title: 'SOC 2 Type II',
              desc: 'Independently audited security controls',
              color: '#00B8D9',
              badge: 'Certified',
            },
            {
              icon: Lock,
              title: 'GDPR Compliant',
              desc: 'Full EU data protection compliance',
              color: '#22C55E',
              badge: 'Compliant',
            },
            {
              icon: Award,
              title: 'HIPAA Ready',
              desc: 'Healthcare data security standards',
              color: '#FF5630',
              badge: 'Ready',
            },
            {
              icon: Shield,
              title: 'ISO 27001',
              desc: 'Information security management',
              color: '#FFAB00',
              badge: 'Certified',
            },
          ].map((item, index) => (
            <Paper
              key={index}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                border: '2px solid rgba(145, 158, 171, 0.12)',
                bgcolor: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: item.color,
                  transform: 'translateY(-12px)',
                  boxShadow: `0px 0px 0px 4px ${item.color}20, 0px 24px 48px -8px rgba(145, 158, 171, 0.32)`,
                },
              }}
            >
              {/* Badge */}
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: `${item.color}20`,
                  color: item.color,
                  fontWeight: 700,
                  fontSize: '0.625rem',
                  height: 24,
                }}
              />

              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2.5,
                  bgcolor: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  position: 'relative',
                }}
              >
                <item.icon size={40} color={item.color} strokeWidth={2} />
                
                {/* Decorative ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: 2.5,
                    border: `2px dashed ${item.color}40`,
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.6 }}>
                {item.desc}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Security Features Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 8 }}>
          {/* Data Protection */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(145, 158, 171, 0.16)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: (theme) => `${theme.palette.primary.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={28} color={theme.palette.primary.main} strokeWidth={2} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                  Data Protection
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  Military-grade encryption and multi-layered security
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={2.5}>
              {[
                { label: 'AES-256 encryption at rest', sublabel: 'All data encrypted in our databases' },
                { label: 'TLS 1.3 encryption in transit', sublabel: 'Secure data transmission' },
                { label: 'End-to-end encryption options', sublabel: 'Zero-knowledge architecture available' },
                { label: 'Automated data backup', sublabel: 'Daily backups with 99.99% durability' },
              ].map((feature, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: (theme) => `${theme.palette.primary.main}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Check size={14} color={theme.palette.primary.main} strokeWidth={3} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#212B36', fontWeight: 600, mb: 0.5 }}>
                      {feature.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#637381' }}>
                      {feature.sublabel}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Access Control */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(145, 158, 171, 0.16)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: '#00B8D920',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={28} color="#00B8D9" strokeWidth={2} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                  Access Control
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  Advanced authentication and authorization
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={2.5}>
              {[
                { label: 'Multi-factor authentication (MFA)', sublabel: 'SMS, TOTP, and biometric support' },
                { label: 'Single Sign-On (SSO)', sublabel: 'SAML 2.0 and OAuth 2.0 support' },
                { label: 'Role-based access control (RBAC)', sublabel: 'Granular permission management' },
                { label: 'IP whitelisting', sublabel: 'Restrict access by location' },
              ].map((feature, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: '#00B8D920',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Check size={14} color="#00B8D9" strokeWidth={3} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#212B36', fontWeight: 600, mb: 0.5 }}>
                      {feature.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#637381' }}>
                      {feature.sublabel}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Infrastructure Security */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(145, 158, 171, 0.16)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: '#22C55E20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={28} color="#22C55E" strokeWidth={2} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                  Infrastructure Security
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  Enterprise cloud infrastructure
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={2.5}>
              {[
                { label: 'AWS/Azure cloud hosting', sublabel: 'Enterprise-grade infrastructure' },
                { label: 'DDoS protection', sublabel: 'Advanced threat mitigation' },
                { label: 'WAF (Web Application Firewall)', sublabel: 'Real-time attack prevention' },
                { label: '99.9% uptime SLA', sublabel: 'Guaranteed availability' },
              ].map((feature, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: '#22C55E20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Check size={14} color="#22C55E" strokeWidth={3} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#212B36', fontWeight: 600, mb: 0.5 }}>
                      {feature.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#637381' }}>
                      {feature.sublabel}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Monitoring & Auditing */}
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(145, 158, 171, 0.16)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: '#FFAB0020',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={28} color="#FFAB00" strokeWidth={2} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                  Monitoring & Auditing
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  Complete visibility and control
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={2.5}>
              {[
                { label: '24/7 security monitoring', sublabel: 'Real-time threat detection' },
                { label: 'Comprehensive audit logs', sublabel: 'Track all user activities' },
                { label: 'Automated vulnerability scanning', sublabel: 'Regular security assessments' },
                { label: 'Incident response team', sublabel: 'Dedicated security experts' },
              ].map((feature, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: '#FFAB0020',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Check size={14} color="#FFAB00" strokeWidth={3} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#212B36', fontWeight: 600, mb: 0.5 }}>
                      {feature.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#637381' }}>
                      {feature.sublabel}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Privacy & Compliance Bar */}
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
            border: `2px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Privacy & Compliance Commitments
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                title: 'Data Ownership',
                desc: 'You retain complete ownership of your data. We never sell or share your information with third parties.',
              },
              {
                title: 'Right to Delete',
                desc: 'Export or permanently delete your data at any time. GDPR-compliant data portability and erasure.',
              },
              {
                title: 'Regular Audits',
                desc: 'Annual SOC 2 Type II audits, quarterly penetration testing, and continuous compliance monitoring.',
              },
            ].map((item, index) => (
              <Stack key={index} spacing={1.5}>
                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#637381', lineHeight: 1.8 }}>
                  {item.desc}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Paper>

        {/* Trust Center CTA */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="body1" sx={{ color: '#637381', mb: 3 }}>
            Want to learn more about our security practices?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            endIcon={<Lock size={18} />}
            sx={{
              borderWidth: 2,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': { borderWidth: 2 },
            }}
          >
            Visit Trust Center
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export function LandingPagePricing() {
  const theme = useTheme();
  
  return (
    <Box sx={{ bgcolor: 'white', py: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="PRICING"
            sx={{
              mb: 2,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
            Choose the plan that's right for your team
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            {
              name: 'Starter',
              price: '$29',
              period: '/month',
              desc: 'Perfect for individuals and small teams',
              features: [
                'Up to 1,000 responses/month',
                '10 forms',
                'Basic templates',
                'Email support',
                'Standard integrations',
              ],
              highlighted: false,
            },
            {
              name: 'Professional',
              price: '$99',
              period: '/month',
              desc: 'For growing teams and businesses',
              features: [
                'Up to 10,000 responses/month',
                'Unlimited forms',
                'All templates',
                'Priority support',
                'Advanced integrations',
                'Custom branding',
                'AI form generation',
              ],
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              desc: 'For large organizations',
              features: [
                'Unlimited responses',
                'Unlimited forms',
                'Dedicated account manager',
                '24/7 phone support',
                'Custom integrations',
                'SSO & SAML',
                'SLA guarantee',
              ],
              highlighted: false,
            },
          ].map((plan, index) => (
            <Paper
              key={index}
              sx={{
                p: 5,
                borderRadius: 3,
                border: plan.highlighted ? `3px solid ${theme.palette.primary.main}` : '1px solid rgba(145, 158, 171, 0.16)',
                position: 'relative',
                transition: 'all 0.3s',
                transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.highlighted 
                  ? `0px 0px 0px 4px ${theme.palette.primary.main}20, 0px 24px 48px -8px rgba(145, 158, 171, 0.32)`
                  : 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0px 0px 0px 4px ${theme.palette.primary.main}20, 0px 24px 48px -8px rgba(145, 158, 171, 0.32)`,
                },
              }}
            >
              {plan.highlighted && (
                <Chip
                  label="MOST POPULAR"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.625rem',
                  }}
                />
              )}

              <Typography variant="h5" sx={{ color: '#212B36', fontWeight: 700, mb: 1 }}>
                {plan.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#637381', mb: 3, minHeight: 40 }}>
                {plan.desc}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: '#212B36', 
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#637381', ml: 1 }}>
                    {plan.period}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ mb: 4 }}>
                {plan.features.map((feature, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <Check size={20} color={theme.palette.primary.main} strokeWidth={2.5} />
                    <Typography variant="body2" sx={{ color: '#637381' }}>
                      {feature}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                variant={plan.highlighted ? 'contained' : 'outlined'}
                color={plan.highlighted ? 'secondary' : 'inherit'}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export function LandingPageFAQ() {
  const theme = useTheme();
  
  const faqs = [
    {
      question: 'How does the AI form generation work?',
      answer: 'Simply describe what kind of form you need in plain English, and our AI will automatically generate a complete form with appropriate fields, validation rules, and styling. You can then customize it further using our drag-and-drop builder.',
    },
    {
      question: 'Can I integrate FormBuilder AI with my existing tools?',
      answer: 'Yes! We offer 100+ integrations with popular tools including Slack, Salesforce, Google Workspace, HubSpot, and more. You can also use our REST API, webhooks, and Zapier integration for custom workflows.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 Type II compliance, GDPR compliance, and HIPAA-ready infrastructure. Your data is encrypted at rest and in transit, with regular security audits.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can export all your data at any time in multiple formats (CSV, JSON, Excel). If you cancel, you\'ll have 30 days to export your data before it\'s permanently deleted from our servers.',
    },
    {
      question: 'Can I customize the look and feel of my forms?',
      answer: 'Yes! You have full control over styling including colors, fonts, logos, and layouts. Professional and Enterprise plans include custom branding options to match your company\'s identity.',
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! All paid plans include a 14-day free trial with full access to all features. No credit card required to start your trial.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Chip
          label="FAQ"
          sx={{
            mb: 2,
            bgcolor: (theme) => `${theme.palette.primary.main}20`,
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        />
        <Typography variant="h2" sx={{ color: '#212B36', fontWeight: 800, mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ color: '#637381', fontWeight: 400 }}>
          Everything you need to know about FormBuilder AI
        </Typography>
      </Box>

      <Stack spacing={2}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              borderRadius: 2,
              border: '1px solid rgba(145, 158, 171, 0.16)',
              boxShadow: 'none',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                margin: 0,
                mb: 2,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={24} color="#637381" />}
              sx={{
                px: 3,
                py: 2,
                '&:hover': {
                  bgcolor: '#F9FAFB',
                },
              }}
            >
              <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <Typography variant="body1" sx={{ color: '#637381', lineHeight: 1.8 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body1" sx={{ color: '#637381', mb: 2 }}>
          Still have questions?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderWidth: 2,
            fontWeight: 700,
            px: 4,
            '&:hover': { borderWidth: 2 },
          }}
        >
          Contact Support
        </Button>
      </Box>
    </Container>
  );
}