import { URLList } from '@/components/url-list';
import { env } from '@/env.mjs';
import { getSessionKey } from '@/lib/session';
import {
  fetchPaginatedURLs,
  type URLSearchParams,
  type URLPaginationResult,
} from '@/services/urlService';

type Props = {
  searchParams: URLSearchParams;
};

// TODO: Separate and setup error boundary
export default async function Home({ searchParams }: Props) {
  const sessionKey = getSessionKey();
  const urlPaginationResult: URLPaginationResult | null = sessionKey
    ? await fetchPaginatedURLs({ searchParams, sessionKey })
    : null;
  return (
    <main className="container flex flex-col items-center p-0">
      {urlPaginationResult && (
        <URLList
          list={urlPaginationResult.urls.map((item) => ({
            id: item.id,
            shortUrl: new URL(item.key, env.DOMAIN).toString(),
          }))}
        />
      )}
    </main>
  );
}
