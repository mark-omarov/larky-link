import { URLList } from '@/components/url-list';
import { env } from '@/env.mjs';
import { getSessionKey } from '@/lib/session';
import {
  fetchPaginatedURLs,
  type URLServiceSearchParams,
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
import { getPageLinks, getUrlWithUpdatedParams } from '@/lib/utils';
import { ItemsPerPageSelect } from '@/components/items-per-page-select';

export const ITEMS_PER_PAGE_OPTIONS = ['10', '30', '50'] as const;

// TODO: Separate and setup error boundary
export default async function Home({
  searchParams: searchParamsProp,
}: {
  searchParams: URLServiceSearchParams;
}) {
  const sessionKey = getSessionKey();
  const searchParams = sanitizeSearchParams(searchParamsProp);
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
      <footer className="container mx-auto max-w-3xl">
        <section className="mx-auto flex w-full justify-end">
          <ItemsPerPageSelect
            value={searchParams.limit}
            options={ITEMS_PER_PAGE_OPTIONS}
          />
        </section>
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?${getUrlWithUpdatedParams(searchParams, {
                    page: page - 1,
                  }).toString()}`}
                />
              </PaginationItem>
            )}
            {pageLinks.map((p, idx) =>
              p === '...' ? (
                <PaginationItem key={idx}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={p === page}
                    href={`?${getUrlWithUpdatedParams(searchParams, {
                      page: p,
                    }).toString()}`}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            {page < pages && (
              <PaginationItem>
                <PaginationNext
                  href={`?${getUrlWithUpdatedParams(searchParams, {
                    page: page + 1,
                  }).toString()}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </footer>
    </main>
  );
}

function sanitizeSearchParams(
  searchParams: Partial<URLServiceSearchParams>,
): URLServiceSearchParams {
  const urlSearchParams = new URLSearchParams(searchParams);
  if (
    !ITEMS_PER_PAGE_OPTIONS.some(
      (option) => option === urlSearchParams.get('limit'),
    )
  ) {
    urlSearchParams.set('limit', ITEMS_PER_PAGE_OPTIONS[0]);
  }

  return {
    limit: urlSearchParams.get('limit') ?? ITEMS_PER_PAGE_OPTIONS[0],
    page: urlSearchParams.get('page') ?? '1',
  };
}
