import { desc, count, eq } from 'drizzle-orm';
import { pg } from '@/connectors/postgres';
import { urls, type SelectURL } from '@/schema';
import { parseAndValidateNumber } from '@/lib/utils';
import { paginationConfig, type PaginationConfig } from '@/config';

export type URLSearchParams = { limit: string; page: string };

export type URLPaginationResult = {
  urls: Omit<SelectURL, 'session' | 'url'>[];
  count: number;
  limit: PaginationConfig['limit']['defaultValue'];
  pages: PaginationConfig['page']['defaultValue'];
  page: PaginationConfig['page']['defaultValue'];
};

export async function fetchPaginatedURLs({
  searchParams,
  sessionKey,
}: {
  searchParams: URLSearchParams;
  sessionKey: string;
}): Promise<URLPaginationResult> {
  const totalURLCount = await pg
    .select({ count: count() })
    .from(urls)
    .where(eq(urls.session, sessionKey))
    .then(([result] = []) => result.count ?? 0);

  if (totalURLCount <= 0)
    return {
      urls: [],
      count: 0,
      limit: paginationConfig.limit.defaultValue,
      pages: paginationConfig.page.defaultValue,
      page: paginationConfig.page.defaultValue,
    };

  const limit = parseAndValidateNumber({
    input: searchParams.limit,
    defaultValue: paginationConfig.limit.defaultValue,
    minValue: paginationConfig.limit.minValue,
    maxValue: paginationConfig.limit.maxValue,
  });

  const pages = Math.ceil(totalURLCount / limit);
  const page = parseAndValidateNumber({
    input: searchParams.page,
    defaultValue: paginationConfig.page.defaultValue,
    minValue: paginationConfig.page.minValue,
    maxValue: pages,
  });

  const sessionURLs = await pg
    .select({
      id: urls.id,
      key: urls.key,
      url: urls.url,
      createdAt: urls.createdAt,
    })
    .from(urls)
    .where(eq(urls.session, sessionKey))
    .orderBy(desc(urls.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    urls: sessionURLs,
    count: totalURLCount,
    limit,
    pages,
    page,
  };
}
