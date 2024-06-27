import { desc, count, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { ulid } from 'ulidx';

import { db } from '@/db';
import { urls } from '@/schema';

// TODO: Handle unexpected errors
// TODO: Gotta cleanup this mess, also the APIs should be available to authenticated users only via API Key
// The cookie will be moved to the page route, it's in API route temporarily
export async function GET(request: Request) {
  const ulidCookieValue =
    cookies().get('_laky-link-ulid')?.value ??
    request.headers
      .get('set-cookie')
      ?.split(';')
      ?.find((c) => c.startsWith('_laky-link-ulid'))
      ?.split('=')?.[1] ??
    ulid();
  const totalUrls = await db
    .select({ count: count() })
    .from(urls)
    .where(eq(urls.session, ulidCookieValue))
    .then(([result] = []) => result.count ?? 0);

  if (totalUrls <= 0) {
    return Response.json({
      urls: [],
      totalUrls,
      totalPages: 0,
      limit: 10,
      page: 1,
    });
  }

  const { searchParams } = new URL(request.url);
  const limit = getLimit(searchParams);
  const totalPages = Math.ceil(totalUrls / Number(limit));
  const page = getPage(searchParams, totalPages);
  const selectedUrls = await db
    .select({
      id: urls.id,
      key: urls.key,
      url: urls.url,
      createdAt: urls.createdAt,
    })
    .from(urls)
    .where(eq(urls.session, ulidCookieValue))
    .orderBy(desc(urls.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return Response.json({
    urls: selectedUrls,
    totalUrls,
    totalPages,
    limit,
    page,
  });
}

function getPage(searchParams: URLSearchParams, totalPages: number) {
  const page = parseInt(searchParams.get('page') ?? '', 10);
  if (isNaN(page) || page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

function getLimit(searchParams: URLSearchParams) {
  const limit = parseInt(searchParams.get('limit') ?? '', 10);
  if (isNaN(limit) || limit < 1 || limit > 10) return 10;
  return limit;
}
