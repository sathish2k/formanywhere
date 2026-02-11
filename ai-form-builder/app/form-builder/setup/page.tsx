/**
 * Form Builder - Form Setup Page
 * Route: /form-builder/setup
 */

import { FormSetup } from '@/components/form-setup/form-setup.component';
import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default function FormSetupPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FormSetup />
    </Suspense>
  );
}
