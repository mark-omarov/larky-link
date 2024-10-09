import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  migrations: {
    schema: 'app',
  },
  schemaFilter: ['app'],
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
