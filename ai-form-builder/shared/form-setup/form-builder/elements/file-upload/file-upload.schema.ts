import { Upload } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const FileUploadSchema: ElementDefinition = {
  type: 'file-upload',
  label: 'File Upload',
  icon: Upload,
  category: 'Input Fields',
  color: '#795548',
  description: 'File upload field',
};

export const FileUploadDefaults = {
  label: 'File Upload',
  placeholder: 'Click or drag to upload',
  width: 'full' as const,
  accept: '*/*',
  maxFiles: 1,
  required: false,
};
