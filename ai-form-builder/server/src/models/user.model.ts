/**
 * User Model
 * MongoDB schema for users with authentication and Stripe billing
 */

import bcrypt from 'bcryptjs';
import mongoose, { type Document, type Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  image?: string;
  provider?: 'credentials' | 'google' | 'github';
  providerId?: string;
  // Profile fields
  phone?: string;
  company?: string;
  jobTitle?: string;
  language?: string;
  timezone?: string;
  // Stripe fields
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | null;
  currentPlan?: 'free' | 'pro' | 'enterprise';
  // Notification settings
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't include password by default in queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    providerId: {
      type: String,
    },
    // Profile fields
    phone: { type: String },
    company: { type: String },
    jobTitle: { type: String },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    // Stripe fields
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete', null],
      default: null,
    },
    currentPlan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    // Notification settings
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
