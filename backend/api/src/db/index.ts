import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = (() => {
    const url = process.env.DATABASE_URL;
    if (!url && process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL environment variable is required in production');
    }
    return url || 'postgres://postgres:postgres@localhost:5432/formanywhere';
})();

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
