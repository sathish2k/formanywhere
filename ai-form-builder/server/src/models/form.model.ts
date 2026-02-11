/**
 * Form Model
 * MongoDB schema for user-created forms
 */

import mongoose, { type Document, type Model, Schema } from 'mongoose';

export interface IFormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface IFormSettings {
  submitButtonText?: string;
  successMessage?: string;
  redirectUrl?: string;
  notifyEmail?: string;
  // Form setup configuration
  pages?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  layoutType?: 'classic' | 'card';
  layout?: any; // Layout configuration from LayoutBuilder
  pageElements?: Record<string, any[]>; // Form builder elements per page
  // Rules and workflows
  rules?: Array<{
    id: string;
    name: string;
    enabled: boolean;
    conditions: Array<{
      fieldId: string;
      operator: string;
      value: any;
    }>;
    operator: 'AND' | 'OR';
    actions: Array<{
      type: string;
      targetId: string;
      value?: any;
    }>;
  }>;
  workflows?: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    category: string;
    enabled: boolean;
    nodes: any[];
    edges: any[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface IForm extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fields: IFormField[];
  settings: IFormSettings;
  isPublished: boolean;
  submissions: number;
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: String,
    required: { type: Boolean, default: false },
    options: [String],
    validation: {
      min: Number,
      max: Number,
      pattern: String,
    },
  },
  { _id: false }
);

const formSettingsSchema = new Schema<IFormSettings>(
  {
    submitButtonText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you for your submission!' },
    redirectUrl: String,
    notifyEmail: String,
    pages: [
      {
        id: String,
        name: String,
        description: String,
      },
    ],
    layoutType: {
      type: String,
      enum: ['classic', 'card'],
      default: 'classic',
    },
    layout: Schema.Types.Mixed,
    pageElements: {
      type: Schema.Types.Mixed,
      default: {},
    },
    rules: [
      {
        _id: false,  // Prevent automatic ID generation
        id: String,
        name: String,
        enabled: Boolean,
        conditions: Schema.Types.Mixed,  // Changed from array of objects to Mixed
        operator: { type: String, enum: ['AND', 'OR'] },
        actions: Schema.Types.Mixed,  // Changed from array of objects to Mixed
      },
    ],
    workflows: [
      {
        _id: false,  // Prevent automatic ID generation
        id: String,
        name: String,
        description: String,
        tags: [String],
        category: String,
        enabled: Boolean,
        nodes: Schema.Types.Mixed,
        edges: Schema.Types.Mixed,
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { _id: false }
);

const formSchema = new Schema<IForm>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fields: [formFieldSchema],
    settings: {
      type: formSettingsSchema,
      default: {},
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    submissions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for scalable queries
formSchema.index({ userId: 1, updatedAt: -1 }); // Sorting by date
formSchema.index({ userId: 1, submissions: -1 }); // Sorting by responses
formSchema.index({ userId: 1, title: 1 }); // Sorting by name
formSchema.index({ title: 'text' }); // Text search on title

export const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', formSchema);
