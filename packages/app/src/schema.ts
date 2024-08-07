import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const KEY_LENGTH = 8 as const;

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: KEY_LENGTH }).unique().notNull(),
  url: text('url').notNull(),
  session: text('session'),
  createdAt: integer('createdAt')
    .notNull()
    .default(sql`extract(epoch from now())`),
});

export const insertURLSchema = createInsertSchema(urls, {
  key: (schema) => schema.key.min(KEY_LENGTH).regex(/[a-zA-Z0-9]/),
  url: (schema) => schema.url.min(1, { message: 'Missing url' }).url(),
});

export type InsertURL = z.infer<typeof insertURLSchema>;

export const selectURLSchema = createSelectSchema(urls);

export type SelectURL = z.infer<typeof selectURLSchema>;
