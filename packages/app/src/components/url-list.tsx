import { CopyURLButton } from '@/components/copy-url-button';
import { Input } from '@/components/ui/input';

export const URLListItem = ({ url, ...props }: { url: string }) => {
  return (
    <li
      className="space-y-2 p-2 min-[375px]:flex min-[375px]:items-center min-[375px]:justify-between min-[375px]:space-y-0"
      {...props}
    >
      <Input
        className="min-[375px]:rounded-none min-[375px]:rounded-l-lg min-[375px]:border-r-0"
        disabled
        value={url}
      />
      <CopyURLButton
        className="min-[375px]:border-l-1 min-[375px]:rounded-none min-[375px]:rounded-r-lg"
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
    <section className="container mx-auto max-w-3xl">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((item) => (
          <URLListItem key={item.id} url={item.shortUrl} />
        ))}
      </ul>
    </section>
  );
};
