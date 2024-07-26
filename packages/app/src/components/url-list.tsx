import { CopyURLButton } from '@/components/copy-url-button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const URLListItem = ({ url, ...props }: { url: string }) => {
  return (
    <li
      className="mx-auto w-full max-w-sm space-y-2 p-0 sm:flex sm:space-y-0"
      {...props}
    >
      <Input
        aria-label={`Shortened URL: ${url}`}
        className="sm:rounded-none sm:rounded-l-lg sm:border-r-0"
        disabled
        value={url}
      />
      <CopyURLButton
        className="sm:border-l-1 w-full sm:w-fit sm:rounded-none sm:rounded-r-lg"
        url={url}
      />
    </li>
  );
};

export const URLList = ({
  list,
}: {
  list: { id: number; shortUrl: string }[];
}) => {
  return (
    <section className="container p-0">
      <ul
        className={cn('grid grid-cols-1 gap-4', {
          'sm:grid-cols-2': list.length > 1,
        })}
      >
        {list.map((item) => (
          <URLListItem key={item.id} url={item.shortUrl} />
        ))}
      </ul>
    </section>
  );
};
