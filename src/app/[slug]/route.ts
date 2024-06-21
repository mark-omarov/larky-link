import { permanentRedirect, RedirectType } from 'next/navigation';
import { Redis } from '@upstash/redis';
import { eq } from 'drizzle-orm';

import { urls, insertURLSchema } from '@/schema';
import { db } from '@/db';

// TODO: Run local Redis server for development
const redis = Redis.fromEnv();

// TODO: Parametrize
const REDIS_KEY_EX = 60 * 60 * 24 * 7;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const { success, data, error } = insertURLSchema
    .pick({ key: true })
    .safeParse({ key: params.slug });

  if (!success) {
    console.error(error);
    return permanentRedirect('/', RedirectType.replace);
  }

  let url = await redis.get<string>(data.key);
  if (url) return permanentRedirect(url, RedirectType.replace);

  const [record] = await db.select().from(urls).where(eq(urls.key, data.key));
  if (record?.url) {
    url = record.url;
    redis.set(data.key, url, { ex: REDIS_KEY_EX, nx: true });
    return permanentRedirect(record.url, RedirectType.replace);
  }

  return permanentRedirect('/', RedirectType.replace);
}
