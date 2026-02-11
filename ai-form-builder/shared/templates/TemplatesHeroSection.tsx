/**
 * Templates Hero Section
 * Hero section with search bar for templates page
 */

'use client';

import { Box, Chip, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';

interface TemplatesHeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TemplatesHeroSection({ searchQuery, onSearchChange }: TemplatesHeroSectionProps) {
  return (
    <HeroWrapper>
      <DecorativeCircle />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ContentWrapper>
          <StyledChip label="Form Templates" />
          <Title variant="h2">Start with a template</Title>
          <Subtitle variant="h6">
            Choose from our library of professionally designed form templates. Customize and deploy
            in minutes.
          </Subtitle>
          <SearchField
            fullWidth
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="rgba(0, 0, 0, 0.54)" />
                </InputAdornment>
              ),
            }}
          />
        </ContentWrapper>
      </Container>
    </HeroWrapper>
  );
}

// Styled Components
const HeroWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
}));

const DecorativeCircle = styled(Box)(() => ({
  position: 'absolute',
  top: -50,
  right: -50,
  width: 300,
  height: 300,
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ContentWrapper = styled(Box)(() => ({
  textAlign: 'center',
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const StyledChip = styled(Chip)(() => ({
  marginBottom: 24,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  fontWeight: 600,
}));

const Title = styled(Typography)(() => ({
  marginBottom: 16,
}));

const Subtitle = styled(Typography)(() => ({
  marginBottom: 32,
  color: 'rgba(255, 255, 255, 0.9)',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },
}));
