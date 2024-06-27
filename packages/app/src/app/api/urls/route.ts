import { desc, count } from 'drizzle-orm';

import { db } from '@/db';
import { urls } from '@/schema';

// TODO: Handle unexpected errors
// TODO: Session association
export async function GET(request: Request) {
  const totalUrls = await db
    .select({ count: count() })
    .from(urls)
    .then(([result] = []) => result.count ?? 0);
  const { searchParams } = new URL(request.url);
  const limit = getLimit(searchParams);
  const totalPages = Math.ceil(totalUrls / Number(limit));
  const page = getPage(searchParams, totalPages);
  const selectedUrls = await db
    .select()
    .from(urls)
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
