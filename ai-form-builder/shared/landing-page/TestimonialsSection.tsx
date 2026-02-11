/**
 * Testimonials Section Component
 * 3-testimonial cards with star ratings
 */

'use client';

import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Star } from 'lucide-react';

// Styled Components
const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

const SectionChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.75rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 800,
  marginBottom: theme.spacing(2),
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
}));

const TestimonialsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(145, 158, 171, 0.16)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow:
      '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 24px 48px -8px rgba(145, 158, 171, 0.24)',
  },
}));

const StarsRow = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Quote = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.8,
  marginBottom: theme.spacing(4),
}));

const Avatar = styled(Box)<{ avatarColor: string }>(({ theme, avatarColor }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: `${avatarColor}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const AvatarInitials = styled(Typography)<{ avatarColor: string }>(({ avatarColor }) => ({
  color: avatarColor,
  fontWeight: 700,
}));

const AuthorName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
}));

const AuthorRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'FormBuilder AI has completely transformed how we collect customer feedback. The AI-powered form generation saved us countless hours.',
    author: 'Sarah Chen',
    role: 'Head of Product, TechCorp',
    rating: 5,
    color: '#5B5FED',
  },
  {
    quote:
      "The multi-step workflows and conditional logic are incredibly powerful. We've seen a 40% increase in form completion rates.",
    author: 'Michael Rodriguez',
    role: 'Marketing Director, GrowthCo',
    rating: 5,
    color: '#00B8D9',
  },
  {
    quote:
      'Enterprise-grade security was a must for us. FormBuilder AI delivers on every front - compliance, encryption, and reliability.',
    author: 'Emily Thompson',
    role: 'CTO, HealthTech Inc',
    rating: 5,
    color: '#22C55E',
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper>
      <Container maxWidth="xl">
        <SectionHeader>
          <SectionChip label="TESTIMONIALS" />
          <SectionTitle variant="h2">Loved by Teams Worldwide</SectionTitle>
          <SectionSubtitle variant="h6">See what our customers have to say</SectionSubtitle>
        </SectionHeader>

        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} elevation={0}>
              <StarsRow direction="row" spacing={0.5}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#FFAB00" color="#FFAB00" />
                ))}
              </StarsRow>
              <Quote variant="body1">"{testimonial.quote}"</Quote>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar avatarColor={testimonial.color}>
                  <AvatarInitials avatarColor={testimonial.color}>
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarInitials>
                </Avatar>
                <Box>
                  <AuthorName variant="subtitle2">{testimonial.author}</AuthorName>
                  <AuthorRole variant="caption">{testimonial.role}</AuthorRole>
                </Box>
              </Stack>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </Container>
    </SectionWrapper>
  );
}
