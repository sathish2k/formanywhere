import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// ─── Better Auth Core Tables ────────────────────────────────────────────────
// These tables are required by Better Auth for user management,
// session handling, account linking, and email verification.

/**
 * Users table - Core user identity.
 * Better Auth manages this table for authentication.
 */
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Sessions table - Tracks active user sessions.
 * Each session has a token and an expiry date.
 */
export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

/**
 * Accounts table - Links auth providers to users.
 * Supports email/password, Google, GitHub, and other OAuth providers.
 */
export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Verification table - Stores email verification and password reset tokens.
 */
export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Application Tables ─────────────────────────────────────────────────────

/**
 * Forms table — stores user-created forms with their full schema.
 */
export const form = pgTable('form', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default('Untitled Form'),
    description: text('description'),
    /** Full form schema (elements, settings, rules) stored as JSONB */
    schema: jsonb('schema'),
    status: text('status').notNull().default('draft'), // draft | published | archived
    submissions: integer('submissions').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Blogs table — stores AI generated blogs.
 */
export const blog = pgTable('blog', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    coverImage: text('cover_image'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    tags: jsonb('tags'),
    audioUrl: text('audio_url'),
    trustScore: integer('trust_score').default(90),
    socialMediaPosts: jsonb('social_media_posts'),
    citations: jsonb('citations'),
    status: text('status').notNull().default('published'), // draft | published
    publishedAt: timestamp('published_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
