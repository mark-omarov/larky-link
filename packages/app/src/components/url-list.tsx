import { CopyURLButton } from '@/components/copy-url-button';
import { Divider } from '@/components/divider';
import { Input } from '@/components/ui/input';

export const URLListItem = ({ url, ...props }: { url: string }) => {
  return (
    <li
      className="space-y-2 p-2 min-[375px]:flex min-[375px]:items-center min-[375px]:justify-between min-[375px]:space-x-2 min-[375px]:space-y-0"
      {...props}
    >
      <Input disabled value={url} />
      <CopyURLButton url={url} />
    </li>
  );
};

export const URLList = ({
  list,
}: {
  list: { id: number; shortUrl: string }[];
}) => {
  return (
    <ul className="w-full max-w-sm">
      {list.map((item, idx) => (
        <>
          {idx > 0 && <Divider />}
          <URLListItem key={item.id} url={item.shortUrl} />
        </>
      ))}
    </ul>
  );
};
