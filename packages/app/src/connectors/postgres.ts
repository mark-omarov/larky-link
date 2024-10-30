import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env.mjs';

let globalForClient = global as typeof global & {
  postgresClient?: ReturnType<typeof postgres>;
};

/**
 * No need to manually close the connection when running in serverless environments like Vercel.
 * @see {@link https://github.com/porsager/postgres?tab=readme-ov-file#connection-timeout|Postgres} Docs
 *
 * Disable prefetch as it is not supported for "Transaction" pool mode.
 * @see {@link https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle|Supabase} Docs
 */
export const client =
  globalForClient.postgresClient ??
  postgres(env.DATABASE_URL, {
    prepare: false,
    idle_timeout: 5,
  });

if (process.env.NODE_ENV !== 'production')
  globalForClient.postgresClient = client;

export const pg = drizzle(client);
