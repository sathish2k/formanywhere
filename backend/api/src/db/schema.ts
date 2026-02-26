import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';

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
    role: text('role').notNull().default('user'), // 'user' | 'admin'
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
}, (table) => [
    index('session_user_id_idx').on(table.userId),
]);

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
}, (table) => [
    index('account_user_id_idx').on(table.userId),
]);

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
}, (table) => [
    index('form_user_id_idx').on(table.userId),
    index('form_status_idx').on(table.status),
    index('form_created_at_idx').on(table.createdAt),
]);

/**
 * Submissions table — stores individual form responses.
 * Data is stored as JSONB to flexibly match any form schema.
 */
export const submission = pgTable('submission', {
    id: text('id').primaryKey(),
    formId: text('form_id').notNull().references(() => form.id, { onDelete: 'cascade' }),
    /** Submitted field values: { [elementId]: value } */
    data: jsonb('data').notNull(),
    /** Optional metadata about the submitter */
    metadata: jsonb('metadata').$type<{
        ip?: string;
        userAgent?: string;
        referrer?: string;
        /** Time taken to fill the form (ms) */
        duration?: number;
    }>(),
    status: text('status').notNull().default('completed'), // completed | partial | spam
    submittedAt: timestamp('submitted_at').notNull().defaultNow(),
}, (table) => [
    index('submission_form_id_idx').on(table.formId),
    index('submission_submitted_at_idx').on(table.submittedAt),
]);

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
    category: text('category').default('random'), // tech | non-tech | random
    audioUrl: text('audio_url'),
    viewCount: integer('view_count').notNull().default(0),
    trustScore: integer('trust_score').default(90),
    socialMediaPosts: jsonb('social_media_posts'),
    citations: jsonb('citations'),
    status: text('status').notNull().default('published'), // draft | published
    publishedAt: timestamp('published_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('blog_published_at_idx').on(table.publishedAt),
    index('blog_category_idx').on(table.category),
    index('blog_view_count_idx').on(table.viewCount),
    index('blog_status_idx').on(table.status),
]);

/**
 * Blog views table — tracks unique views per visitor (YouTube-style).
 * A "view" is only counted once per visitor per blog within a 24-hour window.
 * Uses IP + User-Agent hash as a visitor fingerprint.
 */
export const blogView = pgTable('blog_view', {
    id: text('id').primaryKey(),
    blogId: text('blog_id').notNull().references(() => blog.id, { onDelete: 'cascade' }),
    /** SHA-256 hash of IP + User-Agent for privacy-safe dedup */
    visitorHash: text('visitor_hash').notNull(),
    viewedAt: timestamp('viewed_at').notNull().defaultNow(),
}, (table) => [
    index('blog_view_blog_id_idx').on(table.blogId),
    index('blog_view_visitor_idx').on(table.blogId, table.visitorHash),
]);

/**
 * Workflow execution logs — tracks node results and errors for workflows.
 */
export const workflowExecutionLog = pgTable('workflow_execution_log', {
    id: text('id').primaryKey(),
    formId: text('form_id').notNull().references(() => form.id, { onDelete: 'cascade' }),
    submissionId: text('submission_id').references(() => submission.id, { onDelete: 'set null' }),
    /** The raw execution trace (node results, API payloads, success/errors) */
    trace: jsonb('trace').notNull(),
    /** Total duration of workflow execution in milliseconds */
    duration: integer('duration'),
    /** Did the workflow complete without any unhandled errors? */
    success: boolean('success').notNull().default(true),
    executedAt: timestamp('executed_at').notNull().defaultNow(),
}, (table) => [
    index('workflow_execution_log_form_id_idx').on(table.formId),
    index('workflow_execution_log_submission_id_idx').on(table.submissionId),
    index('workflow_execution_log_executed_at_idx').on(table.executedAt),
]);
