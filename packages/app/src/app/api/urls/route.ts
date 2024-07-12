import { paginationConfig } from '@/config';
import { getSessionKey } from '@/lib/session';
import { fetchPaginatedURLs, URLPaginationResult } from '@/services/urlService';

export async function GET(request: Request) {
  const sessionKey = getSessionKey();
  if (!sessionKey) {
    const result: URLPaginationResult = {
      urls: [],
      count: 0,
      limit: paginationConfig.limit.defaultValue,
      pages: paginationConfig.page.defaultValue,
      page: paginationConfig.page.defaultValue,
    };
    return Response.json(result);
  }

  const { searchParams } = new URL(request.url);
  const result: URLPaginationResult = await fetchPaginatedURLs({
    searchParams: {
      limit: searchParams.get('limit') ?? '',
      page: searchParams.get('page') ?? '',
    },
    sessionKey,
  });

  return Response.json(result);
}
