/**
 * Form Renderer
 * Renders the complete form with page navigation and validation
 */

'use client';

import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { DroppedElement, PageData } from '../form-builder.configuration';
import { ElementRenderer } from './ElementRenderer';

interface FormRendererProps {
  pages: PageData[];
  pageElements: Record<string, DroppedElement[]>;
  formTitle: string;
}

export function FormRenderer({ pages, pageElements, formTitle }: FormRendererProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm({
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const currentPage = pages[currentPageIndex];
  const elements = pageElements[currentPage.id] || [];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pages.length - 1;
  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SubmittedContainer>
        <Alert severity="success" sx={{ mb: 2 }}>
          Form submitted successfully!
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Thank you for your submission.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            setSubmitted(false);
            setCurrentPageIndex(0);
            methods.reset();
          }}
          sx={{ mt: 3 }}
        >
          Submit Another Response
        </Button>
      </SubmittedContainer>
    );
  }

  return (
    <FormProvider {...methods}>
      <FormContainer>
        {/* Progress Bar */}
        {pages.length > 1 && (
          <ProgressSection>
            <ProgressLabel>
              Page {currentPageIndex + 1} of {pages.length}
            </ProgressLabel>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
          </ProgressSection>
        )}

        {/* Form Title & Page Description */}
        <HeaderSection>
          <FormTitle>{formTitle}</FormTitle>
          {currentPage.description && <PageDescription>{currentPage.description}</PageDescription>}
        </HeaderSection>

        {/* Form Elements */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ElementsSection>
            {elements.map((element) => (
              <ElementRenderer key={element.id} element={element} />
            ))}
          </ElementsSection>

          {/* Navigation Buttons */}
          <NavigationSection>
            {!isFirstPage && (
              <Button variant="outlined" startIcon={<ChevronLeft size={18} />} onClick={handleBack}>
                Back
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            {!isLastPage ? (
              <Button variant="contained" endIcon={<ChevronRight size={18} />} onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Submit
              </Button>
            )}
          </NavigationSection>
        </form>
      </FormContainer>
    </FormProvider>
  );
}

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '800px',
  margin: '0 auto',
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const PageDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

const ElementsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const NavigationSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SubmittedContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
}));
