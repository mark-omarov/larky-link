import { permanentRedirect, RedirectType } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { urls, insertURLSchema } from '@/schema';
import { pg, client } from '@/connectors/postgres';
import { createRedis } from '@/connectors/redis';
import { redisConfig } from '@/config';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const { success, data, error } = insertURLSchema
    .pick({ key: true })
    .safeParse({ key: params.slug });

  console.log(success, data, error);

  if (!success) {
    console.error(error);
    return permanentRedirect('/', RedirectType.replace);
  }

  const redis = await createRedis();

  let url = await redis.get(data.key);
  if (url) return permanentRedirect(url, RedirectType.replace);

  const [record] = await pg.select().from(urls).where(eq(urls.key, data.key));
  client.end();

  if (record?.url) {
    url = record.url;
    redis.set(data.key, url, {
      EX: redisConfig.options.ex,
      NX: redisConfig.options.nx,
    });
    return permanentRedirect(record.url, RedirectType.replace);
  }

  return permanentRedirect('/', RedirectType.replace);
}
