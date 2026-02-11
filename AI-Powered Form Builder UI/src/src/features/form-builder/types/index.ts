/**
 * Core type definitions for the form builder system
 */

export interface FormElement {
  id: string;
  type: string;
  label: string;
  icon: any;
  color: string;
  category: string;
}

export interface DroppedElement {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  icon: any;
  color: string;
  required?: boolean;
  options?: string[];
  validation?: ValidationRule;
  isLayoutElement?: boolean;
  
  // ✅ UNIVERSAL UI PROPERTIES (Applies to ALL elements)
  helperText?: string; // Description/helper text
  visible?: boolean; // Show/hide element
  disabled?: boolean; // Disable element
  width?: 'auto' | 'full' | 'custom'; // Width setting
  customWidth?: string; // Custom width value (e.g., "50%", "300px")
  alignment?: 'left' | 'center' | 'right'; // Alignment
  marginTop?: number; // Margin top in px
  marginBottom?: number; // Margin bottom in px
  marginLeft?: number; // Margin left in px
  marginRight?: number; // Margin right in px
  paddingTop?: number; // Padding top in px
  paddingBottom?: number; // Padding bottom in px
  paddingLeft?: number; // Padding left in px
  paddingRight?: number; // Padding right in px
  inputVariant?: 'outlined' | 'filled' | 'standard'; // Input variant
  size?: 'small' | 'medium' | 'large'; // Element size
  colorTheme?: string; // Color theme
  borderRadius?: number; // Border radius in px
  customClass?: string; // Custom CSS class
  customStyle?: string; // Custom inline styles
  
  // 🧾 TEXT INPUT (Text / Email / Password / Search)
  defaultValue?: any; // Default value
  maxLength?: number; // Max character length
  minLength?: number; // Min character length
  prefixIcon?: string; // Icon before input
  suffixIcon?: string; // Icon after input
  autocomplete?: 'on' | 'off'; // Autocomplete setting
  mask?: string; // Input mask (email, phone, custom)
  clearable?: boolean; // Show clear button
  
  // 🔢 NUMBER INPUT
  minValue?: number; // Minimum value
  maxValue?: number; // Maximum value
  stepValue?: number; // Step increment
  precision?: number; // Decimal places
  unit?: string; // Unit display (₹, $, %, kg)
  showArrows?: boolean; // Show increment/decrement arrows
  
  // 📝 TEXTAREA
  rows?: number; // Number of rows
  autoResize?: boolean; // Auto-resize on content
  characterCounter?: boolean; // Show character count
  richText?: boolean; // Enable rich text editor
  
  // 🔽 DROPDOWN / SELECT
  multipleSelect?: boolean; // Allow multiple selections
  searchable?: boolean; // Enable search in dropdown
  optionGrouping?: boolean; // Group options
  optionGroups?: { label: string; options: string[] }[]; // Grouped options
  
  // ☑️ CHECKBOX & 🔘 RADIO BUTTON
  layout?: 'vertical' | 'horizontal'; // Options layout
  defaultSelected?: string | string[]; // Default selected value(s)
  
  // 🔀 TOGGLE / SWITCH
  onLabel?: string; // Label for "on" state
  offLabel?: string; // Label for "off" state
  defaultState?: boolean; // Default toggle state
  
  // 📅 DATE / TIME PICKER
  dateFormat?: string; // Date format (MM/DD/YYYY, etc.)
  minDate?: string; // Minimum selectable date
  maxDate?: string; // Maximum selectable date
  disablePastDates?: boolean; // Disable past dates
  disableFutureDates?: boolean; // Disable future dates
  timeSelection?: boolean; // Enable time selection
  
  // 📁 FILE UPLOAD
  allowedFileTypes?: string[]; // Allowed file extensions
  maxFileSize?: number; // Max file size in MB
  multipleFiles?: boolean; // Allow multiple files
  dragDropEnabled?: boolean; // Enable drag & drop
  previewEnabled?: boolean; // Show file preview
  
  // ⭐ RATING / SLIDER
  ratingMax?: number; // Maximum rating value
  showValue?: boolean; // Display current value
  ratingIcon?: 'star' | 'heart' | 'circle'; // Rating icon type
  
  // 🧱 SECTION / GROUP
  sectionTitle?: string; // Section title
  collapsible?: boolean; // Can be collapsed
  defaultExpanded?: boolean; // Default expanded state
  showBorder?: boolean; // Show border
  sectionBgColor?: string; // Background color
  sectionSpacing?: number; // Spacing between elements
  
  // 🔘 BUTTON
  buttonText?: string; // Button label
  buttonVariant?: 'contained' | 'outlined' | 'text'; // Button style
  buttonIcon?: string; // Button icon
  buttonIconPosition?: 'start' | 'end'; // Icon position
  buttonLoading?: boolean; // Loading state
  
  // Logo properties
  logoUrl?: string;
  logoAlt?: string;
  
  // Heading properties
  headingText?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: number;
  headingColor?: string;
  
  // Divider properties
  dividerThickness?: number;
  dividerColor?: string;
  
  // Spacer properties
  spacerHeight?: number;
  
  // Column properties
  columnSpacing?: number; // Gap between columns
  
  // Text Block properties
  textBlockContent?: string;
  textBlockColor?: string;
  textBlockAlign?: 'left' | 'center' | 'right';
  
  // Container support for nested elements
  children?: DroppedElement[];
  
  // Column-specific children (for 2 or 3 column layouts)
  column1Children?: DroppedElement[];
  column2Children?: DroppedElement[];
  column3Children?: DroppedElement[];
  
  // Conditional logic
  conditionalLogic?: ConditionalLogic;
}

export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
  customRule?: (value: any) => boolean;
}

export interface ConditionalLogic {
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  conditions: Condition[];
  operator: 'AND' | 'OR';
}

export interface Condition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 
    'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 
    'isEmpty' | 'isNotEmpty' | 'isChecked' | 'isNotChecked';
  value: any;
}

export interface LayoutConfig {
  logo?: {
    url: string;
    alt: string;
  };
  stepper: boolean;
  header: DroppedElement[];
  footer: DroppedElement[];
}

export interface PageData {
  id: string;
  name: string;
  description: string;
}

export interface FormData {
  id: string;
  name: string;
  description: string;
  pages: PageData[];
  layout: LayoutConfig;
  theme?: ThemeConfig;
  settings?: FormSettings;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  spacing: number;
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  showProgressBar: boolean;
  saveProgress: boolean;
  requireAuthentication: boolean;
  enableNotifications: boolean;
  customCSS?: string;
  customJS?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RuleAction {
  type: 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'require' | 'navigate';
  targetId?: string;
  value?: any;
}

export interface Rule {
  id: string;
  name: string;
  conditions: Condition[];
  actions: RuleAction[];
  operator: 'AND' | 'OR';
  enabled: boolean;
}

export type ElementCategory = 'Layout' | 'Text Inputs' | 'Choice' | 'Date & Time' | 'Advanced';
