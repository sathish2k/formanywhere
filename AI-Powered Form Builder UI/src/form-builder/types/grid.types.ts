/**
 * Grid Layout Types
 * Types for MUI Grid layout system
 */

export interface GridLayoutOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  columns: number;
  layout: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }[];
}

export interface GridColumnData {
  id: string;
  columnIndex: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
