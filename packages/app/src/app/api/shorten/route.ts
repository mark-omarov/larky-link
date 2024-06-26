import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { ulid } from 'ulidx';

import { db } from '@/db';
import { createRedis } from '@/redis';
import { redisConfig } from '@/config';
import { insertURLSchema, urls } from '@/schema';
import { generateRandomString } from '@/lib/utils';

async function generateKey(): Promise<string> {
  const key = generateRandomString();
  const [record] = await db.select().from(urls).where(eq(urls.key, key));
  if (record) return generateKey();
  return key;
}

// TODO: Response with zod errors + openapi generator (optional)
export async function POST(request: Request) {
  const redis = await createRedis();
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
  await db.insert(urls).values({
    key,
    url,
    // TODO: Duplicated, refactor
    session:
      cookies().get('_laky-link-ulid')?.value ??
      request.headers
        .get('set-cookie')
        ?.split(';')
        ?.find((c) => c.startsWith('_laky-link-ulid'))
        ?.split('=')?.[1] ??
      ulid(),
  });
  // TODO: Graceful handling in API endpoints and middleware
  await redis.set(key, url, { EX: redisConfig.default.ex, NX: true });

  return Response.json({ key, url });
}
