/**
 * Grid Schema Utilities
 * Validates and manages schema-driven grid system
 */

import { DroppedElement } from '../types/form.types';

/**
 * Validates if a grid structure follows the schema rules
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate grid structure
 */
export function validateGridStructure(element: DroppedElement): ValidationResult {
  const errors: string[] = [];

  // Rule 1: Grid item must have a grid container parent
  if (element.item && !hasGridContainerParent(element)) {
    errors.push('Grid item without container');
  }

  // Rule 2: Grid container must have container: true
  if (element.type === 'grid-container' && !element.container) {
    errors.push('Grid must have container: true');
  }

  // Rule 3: Check total columns per row ≤ 12
  if (element.container && element.children) {
    const rowValidation = validateRowColumns(element.children);
    if (!rowValidation.valid) {
      errors.push(...rowValidation.errors);
    }
  }

  // Rule 4: No arbitrary CSS layout (check for invalid properties)
  const invalidCssProps = checkArbitraryCss(element);
  if (invalidCssProps.length > 0) {
    errors.push(`Arbitrary CSS layout detected: ${invalidCssProps.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if element has a grid container parent
 * (This would need parent context in real implementation)
 */
function hasGridContainerParent(element: DroppedElement): boolean {
  // In real implementation, we'd check parent element
  // For now, assume valid if item: true is set correctly
  return true;
}

/**
 * Validate that total columns per row don't exceed 12
 */
function validateRowColumns(children: DroppedElement[]): ValidationResult {
  const errors: string[] = [];
  
  // Calculate total columns at each breakpoint
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  
  for (const bp of breakpoints) {
    const total = children.reduce((sum, child) => {
      if (child.cols && child.cols[bp]) {
        return sum + child.cols[bp]!;
      }
      // If no specific breakpoint, use xs or default to 12
      return sum + (child.cols?.xs || 12);
    }, 0);
    
    if (total > 12) {
      errors.push(`Columns > 12 per row at breakpoint ${bp.toUpperCase()} (total: ${total})`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check for arbitrary CSS properties
 */
function checkArbitraryCss(element: DroppedElement): string[] {
  const invalidProps: string[] = [];
  
  // Check for flex properties (not allowed, must use MUI props)
  if (element.customStyle) {
    const style = element.customStyle.toLowerCase();
    if (style.includes('flex') && !style.includes('grid')) {
      invalidProps.push('flex');
    }
    if (style.includes('position: absolute') || style.includes('position:absolute')) {
      invalidProps.push('absolute positioning');
    }
  }
  
  return invalidProps;
}

/**
 * Create a grid container element
 */
export function createGridContainer(spacing: number = 2): DroppedElement {
  return {
    id: `grid-container-${Date.now()}`,
    type: 'grid-container',
    label: 'Grid',
    icon: null as any,
    color: '#1976D2',
    container: true,
    spacing,
    children: [],
    isLayoutElement: true,
  };
}

/**
 * Create a grid item element
 */
export function createGridItem(cols: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
} = { xs: 12, md: 6 }): DroppedElement {
  return {
    id: `grid-item-${Date.now()}`,
    type: 'grid-item',
    label: 'Grid Item',
    icon: null as any,
    color: '#00897B',
    item: true,
    cols,
    children: [],
    isLayoutElement: true,
  };
}

/**
 * Create a container element (MUI Container wrapper)
 */
export function createContainer(maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): DroppedElement {
  return {
    id: `container-${Date.now()}`,
    type: 'container',
    label: 'Container',
    icon: null as any,
    color: '#00897B',
    maxWidth,
    children: [],
    isLayoutElement: true,
  };
}

/**
 * Auto-calculate grid item columns to fit in 12-column grid
 */
export function autoCalculateGridCols(itemCount: number): { xs: number; md: number }[] {
  const configs: Record<number, { xs: number; md: number }[]> = {
    1: [{ xs: 12, md: 12 }],
    2: [
      { xs: 12, md: 6 },
      { xs: 12, md: 6 },
    ],
    3: [
      { xs: 12, md: 4 },
      { xs: 12, md: 4 },
      { xs: 12, md: 4 },
    ],
    4: [
      { xs: 12, md: 3 },
      { xs: 12, md: 3 },
      { xs: 12, md: 3 },
      { xs: 12, md: 3 },
    ],
  };

  return configs[itemCount] || configs[2];
}

/**
 * Convert legacy grid structure to new schema
 */
export function convertLegacyGrid(legacyGrid: DroppedElement): DroppedElement {
  if (!legacyGrid.rows) {
    return legacyGrid;
  }

  // Convert rows array to flat children with grid items
  const children: DroppedElement[] = [];
  
  legacyGrid.rows.forEach((row) => {
    row.forEach((col) => {
      // Convert grid-column to grid-item
      const gridItem: DroppedElement = {
        ...col,
        type: 'grid-item',
        item: true,
        cols: {
          xs: col.gridItemXs as number,
          sm: col.gridItemSm as number,
          md: col.gridItemMd as number,
          lg: col.gridItemLg as number,
          xl: col.gridItemXl as number,
        },
        // Remove legacy properties
        gridItemXs: undefined,
        gridItemSm: undefined,
        gridItemMd: undefined,
        gridItemLg: undefined,
        gridItemXl: undefined,
      };
      
      children.push(gridItem);
    });
  });

  return {
    ...legacyGrid,
    container: true,
    spacing: legacyGrid.gridSpacing || 2,
    children,
    rows: undefined, // Remove legacy rows
  };
}

/**
 * Export schema-compliant JSON
 */
export function exportSchemaJson(element: DroppedElement): any {
  const exported: any = {
    type: element.type,
  };

  // Container properties
  if (element.maxWidth) {
    exported.maxWidth = element.maxWidth;
  }

  // Grid container properties
  if (element.container) {
    exported.container = true;
    if (element.spacing !== undefined) {
      exported.spacing = element.spacing;
    }
  }

  // Grid item properties
  if (element.item) {
    exported.item = true;
    if (element.cols) {
      exported.cols = element.cols;
    }
  }

  // Field properties
  if (element.type === 'field') {
    exported.fieldType = element.label?.toLowerCase() || 'text';
    exported.name = element.id;
  }

  // Recursively export children
  if (element.children && element.children.length > 0) {
    exported.children = element.children.map(exportSchemaJson);
  }

  return exported;
}
