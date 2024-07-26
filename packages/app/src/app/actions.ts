'use server';

import { eq } from 'drizzle-orm';
import { ulid } from 'ulidx';
import { revalidatePath } from 'next/cache';
import { typeToFlattenedError } from 'zod';

import { pg, client } from '@/connectors/postgres';
import { createRedis } from '@/connectors/redis';
import { redisConfig } from '@/config';
import { insertURLSchema, urls } from '@/schema';
import { generateRandomString } from '@/lib/utils';
import { getSessionKey } from '@/lib/session';

async function generateKey(): Promise<string> {
  const key = generateRandomString();
  const [record] = await pg.select().from(urls).where(eq(urls.key, key));
  if (record) return generateKey();
  return key;
}

export type ShortenResult =
  | { success: true; errors?: never }
  | { success: false; errors: typeToFlattenedError<{ url: string }> };

export async function shorten(url: string): Promise<ShortenResult> {
  const { success, data, error } = insertURLSchema
    .pick({ url: true })
    .safeParse({ url });

  if (!success) {
    return {
      success,
      errors: error.flatten(),
    };
  }

  try {
    const redis = await createRedis();
    const key = await generateKey();
    await pg.insert(urls).values({
      key,
      url: data.url,
      session: getSessionKey() ?? ulid(),
    });
    await redis.set(key, data.url, {
      EX: redisConfig.options.ex,
      NX: redisConfig.options.nx,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('Unexpected error');
  }
}
