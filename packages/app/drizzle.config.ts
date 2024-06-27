import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  migrations: {
    schema: 'public',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
