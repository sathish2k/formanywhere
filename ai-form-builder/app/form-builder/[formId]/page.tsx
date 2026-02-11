/**
 * Form Builder Page
 * Dynamic route for editing forms
 */

import { FormBuilder } from '@/shared/form-setup/form-builder';

export default async function FormBuilderPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params;
  return <FormBuilder formId={formId} />;
}
