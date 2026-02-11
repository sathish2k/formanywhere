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
  
  // 📐 MUI GRID LAYOUT (for sections)
  gridContainer?: boolean; // Is this a grid container
  gridColumns?: number; // Number of columns (1-12)
  gridSpacing?: number; // Spacing between grid items (0-10)
  gridDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; // Grid direction
  gridJustifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'; // Horizontal alignment
  gridAlignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'; // Vertical alignment
  gridWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; // Grid wrapping
  
  // Advanced Grid Container Properties (MUI Grid v2)
  gridRowSpacing?: number; // Vertical spacing (0-10)
  gridColumnSpacing?: number; // Horizontal spacing (0-10)
  gridAlignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch'; // Multi-row alignment
  
  // Grid item properties (for children in grid)
  gridItemXs?: number | 'auto'; // xs breakpoint (0-12)
  gridItemSm?: number | 'auto'; // sm breakpoint (0-12)
  gridItemMd?: number | 'auto'; // md breakpoint (0-12)
  gridItemLg?: number | 'auto'; // lg breakpoint (0-12)
  gridItemXl?: number | 'auto'; // xl breakpoint (0-12)
  
  // Grid item order (MUI Grid v2 supports order via sx prop if needed)
  gridItemOrder?: number; // Visual order (-1 to 12)
  
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
  
  // 🎯 NEW SCHEMA-DRIVEN GRID SYSTEM
  // Container properties
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false; // MUI Container maxWidth
  
  // Grid container properties (MUI Grid with container: true)
  container?: boolean; // Is this a grid container
  spacing?: number; // Uniform spacing (0-10)
  
  // Grid item properties (MUI Grid with item: true)
  item?: boolean; // Is this a grid item
  cols?: {
    xs?: number; // 0-12
    sm?: number; // 0-12
    md?: number; // 0-12
    lg?: number; // 0-12
    xl?: number; // 0-12
  };
  
  // Legacy multi-row grid support (for backward compatibility)
  rows?: DroppedElement[][]; // Array of rows, each row contains columns
}