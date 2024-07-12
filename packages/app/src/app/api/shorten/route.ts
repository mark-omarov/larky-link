import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { ulid } from 'ulidx';

import { pg } from '@/connectors/postgres';
import { createRedis } from '@/connectors/redis';
import { redisConfig, sessionConfig } from '@/config';
import { insertURLSchema, urls } from '@/schema';
import { generateRandomString } from '@/lib/utils';

async function generateKey(): Promise<string> {
  const key = generateRandomString();
  const [record] = await pg.select().from(urls).where(eq(urls.key, key));
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
  await pg.insert(urls).values({
    key,
    url,
    // TODO: Duplicated, refactor
    session:
      cookies().get(sessionConfig.cookie.name)?.value ??
      request.headers
        .get('set-cookie')
        ?.split(';')
        ?.find((c) => c.startsWith(sessionConfig.cookie.name))
        ?.split('=')?.[1] ??
      ulid(),
  });
  // TODO: Graceful handling in API endpoints and middleware
  await redis.set(key, url, { EX: redisConfig.options.ex, NX: true });

  return Response.json({ key, url });
}
