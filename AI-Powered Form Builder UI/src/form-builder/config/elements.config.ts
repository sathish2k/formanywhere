/**
 * Form elements configuration
 * Defines all available form elements with their properties
 */

import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Link as LinkIcon,
  ChevronDown,
  CircleDot,
  CheckSquare,
  ToggleLeft,
  Calendar,
  Clock,
  Upload as UploadIcon,
  Star,
  Square,
  Layers,
  Grid3x3,
  Image as ImageIcon,
  Columns,
  RectangleHorizontal,
  Minus,
  MoveVertical,
  CreditCard,
  Heading as HeadingIcon,
  FileText,
  Box as BoxIcon,
  LayoutGrid,
} from 'lucide-react';

import { FormElement } from '../types/form.types';

export const FORM_ELEMENTS: FormElement[] = [
  // Layout Containers
  { 
    id: 'container', 
    type: 'container', 
    label: 'Container', 
    icon: BoxIcon, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'grid-container', 
    type: 'grid-container', 
    label: 'Grid', 
    icon: LayoutGrid, 
    color: '#1976D2', 
    category: 'Layout' 
  },
  { 
    id: 'section', 
    type: 'section', 
    label: 'Section', 
    icon: Square, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'card', 
    type: 'card', 
    label: 'Card', 
    icon: CreditCard, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'grid-column', 
    type: 'grid-column', 
    label: 'Grid Column', 
    icon: Columns, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'divider', 
    type: 'divider', 
    label: 'Divider', 
    icon: Minus, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'spacer', 
    type: 'spacer', 
    label: 'Spacer', 
    icon: MoveVertical, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'heading', 
    type: 'heading', 
    label: 'Heading', 
    icon: HeadingIcon, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'logo', 
    type: 'logo', 
    label: 'Logo', 
    icon: ImageIcon, 
    color: '#00897B', 
    category: 'Layout' 
  },
  { 
    id: 'text-block', 
    type: 'text-block', 
    label: 'Text Block', 
    icon: FileText, 
    color: '#00897B', 
    category: 'Layout' 
  },
  
  // Text Inputs
  { 
    id: 'short-text', 
    type: 'short-text', 
    label: 'Short Text', 
    icon: Type, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  { 
    id: 'long-text', 
    type: 'long-text', 
    label: 'Long Text', 
    icon: AlignLeft, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  { 
    id: 'email', 
    type: 'email', 
    label: 'Email', 
    icon: Mail, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  { 
    id: 'phone', 
    type: 'phone', 
    label: 'Phone Number', 
    icon: Phone, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  { 
    id: 'number', 
    type: 'number', 
    label: 'Number', 
    icon: Hash, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  { 
    id: 'url', 
    type: 'url', 
    label: 'Website URL', 
    icon: LinkIcon, 
    color: '#1976D2', 
    category: 'Text Inputs' 
  },
  
  // Choice Inputs
  { 
    id: 'dropdown', 
    type: 'dropdown', 
    label: 'Dropdown', 
    icon: ChevronDown, 
    color: '#7B1FA2', 
    category: 'Choice' 
  },
  { 
    id: 'radio', 
    type: 'radio', 
    label: 'Multiple Choice', 
    icon: CircleDot, 
    color: '#7B1FA2', 
    category: 'Choice' 
  },
  { 
    id: 'checkbox', 
    type: 'checkbox', 
    label: 'Checkboxes', 
    icon: CheckSquare, 
    color: '#7B1FA2', 
    category: 'Choice' 
  },
  { 
    id: 'switch', 
    type: 'switch', 
    label: 'Yes/No', 
    icon: ToggleLeft, 
    color: '#7B1FA2', 
    category: 'Choice' 
  },
  
  // Date & Time
  { 
    id: 'date', 
    type: 'date', 
    label: 'Date', 
    icon: Calendar, 
    color: '#F57C00', 
    category: 'Date & Time' 
  },
  { 
    id: 'time', 
    type: 'time', 
    label: 'Time', 
    icon: Clock, 
    color: '#F57C00', 
    category: 'Date & Time' 
  },
  
  // Advanced
  { 
    id: 'file-upload', 
    type: 'file-upload', 
    label: 'File Upload', 
    icon: UploadIcon, 
    color: '#00897B', 
    category: 'Advanced' 
  },
  { 
    id: 'rating', 
    type: 'rating', 
    label: 'Rating', 
    icon: Star, 
    color: '#00897B', 
    category: 'Advanced' 
  },
];

export const ELEMENT_CATEGORIES = [
  'Layout',
  'Text Inputs',
  'Choice',
  'Date & Time',
  'Advanced'
] as const;