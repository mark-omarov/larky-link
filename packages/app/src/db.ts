import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env.mjs';

/**
 * No need to manually close the connection when running in serverless environments like Vercel.
 * @see {@link https://github.com/porsager/postgres?tab=readme-ov-file#connection-timeout|Postgres} Docs
 *
 * Disable prefetch as it is not supported for "Transaction" pool mode.
 * @see {@link https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle|Supabase} Docs
 */
export const client = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);
