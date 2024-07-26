import Image from 'next/image';
import { Bungee } from 'next/font/google';
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
} from '@/components/ui/pagination';
import { cn, getPageLinks, getUrlWithUpdatedParams } from '@/lib/utils';
import { ItemsPerPageSelect } from '@/components/items-per-page-select';
import { ShortenForm } from '@/components/shorten-form';
import { Divider } from '@/components/divider';

export const ITEMS_PER_PAGE_OPTIONS = ['10', '20', '30', '40', '50'] as const;

const bungee = Bungee({ weight: '400', subsets: ['latin'] });

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

  const { count, page, pages } = urlPaginationResult;
  const pageLinks = getPageLinks(page, pages);

  return (
    <main className="container min-h-screen max-w-3xl space-y-8 px-2 pb-2 pt-16">
      <header className="container mx-auto pl-0 pr-0">
        <Image
          src="/icon.png"
          width={50}
          height={50}
          alt="Picture of the author"
          className="mx-auto"
        />
        <h1
          className={cn('text-center text-3xl text-[--logo]', bungee.className)}
        >
          Larky Link
        </h1>
        <h2 className="text-center">Charting Joyful Links</h2>
      </header>
      <section className="container mx-auto pl-0 pr-0">
        <ShortenForm className="mx-auto" />
      </section>
      {urlPaginationResult.urls.length > 0 && (
        <>
          <Divider className="mx-auto" />
          <section className="container mx-auto pl-0 pr-0">
            <URLList
              list={urlPaginationResult.urls.map((item) => ({
                id: item.id,
                shortUrl: new URL(item.key, env.DOMAIN).toString(),
              }))}
            />
          </section>
        </>
      )}
      {count > Number(ITEMS_PER_PAGE_OPTIONS[0]) && (
        <section className="container mx-auto space-y-2 pl-0 pr-0">
          <section className="w-full">
            <div className="mx-auto flex max-w-sm items-center justify-end">
              <span className="mr-2 text-sm">Display items:</span>
              <ItemsPerPageSelect
                value={searchParams.limit}
                options={ITEMS_PER_PAGE_OPTIONS}
              />
            </div>
          </section>
          {pages > 1 && (
            <section className="w-full">
              <Pagination>
                <PaginationContent>
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
                </PaginationContent>
              </Pagination>
            </section>
          )}
        </section>
      )}
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
