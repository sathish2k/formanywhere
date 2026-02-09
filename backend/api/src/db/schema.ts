import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    password: text('password'),
    name: text('name'),
    provider: text('provider'),
    providerId: text('provider_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
