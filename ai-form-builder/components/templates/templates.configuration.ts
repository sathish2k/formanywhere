/**
 * Templates Configuration
 * Static configuration data for templates page
 */

import type { TemplateCategory } from '@/shared/templates';
import {
  Calendar,
  ClipboardList,
  FileText,
  Heart,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

/**
 * Template Categories - Static configuration
 */
export const templateCategories: TemplateCategory[] = [
  { id: 'all', label: 'All Templates', icon: FileText },
  { id: 'contact', label: 'Contact Forms', icon: MessageSquare },
  { id: 'registration', label: 'Registration', icon: ClipboardList },
  { id: 'survey', label: 'Surveys', icon: Users },
  { id: 'booking', label: 'Booking', icon: Calendar },
  { id: 'order', label: 'Order Forms', icon: ShoppingCart },
  { id: 'feedback', label: 'Feedback', icon: Heart },
  { id: 'lead', label: 'Lead Generation', icon: TrendingUp },
];
