/**
 * Form Builder Main Page Component
 * Orchestrates the complete form builder experience
 */

import React from 'react';
import { Box } from '@mui/material';
import { FormBuilderNew } from '../../../../components/FormBuilderNew';

interface FormBuilderPageProps {
  onBack?: () => void;
  template?: 'blank' | 'with-layout' | 'with-login' | 'ai' | null;
  formData?: any;
}

export default function FormBuilderPage({ onBack, template, formData }: FormBuilderPageProps) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FormBuilderNew />
    </Box>
  );
}
