import { defineConfig } from 'drizzle-kit';
import { env } from '@/env.mjs';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  migrations: {
    schema: 'public',
  },
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
