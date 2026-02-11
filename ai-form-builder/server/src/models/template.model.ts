/**
 * Template Model
 * MongoDB schema for form templates
 */

import mongoose, { type Document, type Model, Schema } from 'mongoose';
import type { IFormField } from './form.model';

export interface ITemplate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  fields: IFormField[];
  popular: boolean;
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

const templateFieldSchema = new Schema(
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

const templateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    fields: [templateFieldSchema],
    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
    uses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for scalable queries
templateSchema.index({ category: 1, uses: -1 }); // Filter by category, sort by popularity
templateSchema.index({ name: 'text', description: 'text' }); // Text search

export const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);
