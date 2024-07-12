import { cn } from '@/lib/utils';

export const Divider = ({ className }: { className?: string }) => {
  return <hr className={cn('my-4 border-t border-border', className)} />;
};
