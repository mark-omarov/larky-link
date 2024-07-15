import { URLList } from '@/components/url-list';
import { env } from '@/env.mjs';
import { getSessionKey } from '@/lib/session';
import {
  fetchPaginatedURLs,
  type URLSearchParams,
  type URLPaginationResult,
} from '@/services/urlService';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getPageLinks } from '@/lib/utils';

// TODO: Separate and setup error boundary
export default async function Home({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  const sessionKey = getSessionKey();
  const urlPaginationResult: URLPaginationResult | null = sessionKey
    ? await fetchPaginatedURLs({ searchParams, sessionKey })
    : null;

  if (!urlPaginationResult) {
    return null;
  }

  const { page, pages } = urlPaginationResult;
  const pageLinks = getPageLinks(page, pages);

  return (
    <main className="container flex flex-col items-center space-y-4 p-0">
      <URLList
        list={urlPaginationResult.urls.map((item) => ({
          id: item.id,
          shortUrl: new URL(item.key, env.DOMAIN).toString(),
        }))}
      />
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?page=${page - 1}`} />
            </PaginationItem>
          )}
          {pageLinks.map((p, index) =>
            p === '...' ? (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationLink isActive={p === page} href={`?page=${p}`}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          {page < pages && (
            <PaginationItem>
              <PaginationNext href={`?page=${page + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </main>
  );
}
