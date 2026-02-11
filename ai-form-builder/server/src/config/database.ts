/**
 * MongoDB Database Connection
 */

import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    console.log('📦 Using existing database connection');
    return;
  }

  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName: 'formbuilder',
    });

    isConnected = connection.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  console.log('📦 Disconnected from MongoDB');
}
