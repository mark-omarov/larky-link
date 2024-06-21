import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const KEY_LENGTH = 8 as const;

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: KEY_LENGTH }).unique().notNull(),
  url: text('url').notNull(),
});

export const insertURLSchema = createInsertSchema(urls, {
  key: (schema) => schema.key.min(KEY_LENGTH).regex(/[a-zA-Z0-9]/),
});

export type InsertURL = z.infer<typeof insertURLSchema>;

export const selectURLSchema = createSelectSchema(urls);

export type SelectURL = z.infer<typeof selectURLSchema>;
