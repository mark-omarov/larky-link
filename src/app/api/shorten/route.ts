import { eq } from 'drizzle-orm';
import { Redis } from '@upstash/redis';

import { db } from '@/db';
import { redisConfig } from '@/config';
import { insertURLSchema, urls } from '@/schema';
import { generateRandomString } from '@/lib/utils';

const redis = Redis.fromEnv();

async function generateKey(): Promise<string> {
  const key = generateRandomString();
  const [record] = await db.select().from(urls).where(eq(urls.key, key));
  if (record) return generateKey();
  return key;
}

// TODO: Response with zod errors + openapi generator (optional)
export async function POST(request: Request) {
  const url = await request
    .json()
    .then(
      ({ original_url }) =>
        insertURLSchema.pick({ url: true }).parse({ url: original_url }).url ??
        null,
    )
    .catch(() => null);

  if (!url) return Response.json({ error: 'Invalid URL' }, { status: 400 });

  const key = await generateKey();
  await db.insert(urls).values({ key, url });
  // TODO: Graceful handling in API endpoints and middleware
  await redis.set(key, url, { ex: redisConfig.default.ex, nx: true });

  return Response.json({ key, url });
}
