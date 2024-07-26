import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Divider = ({ className, ...props }: ComponentProps<'hr'>) => (
  <hr className={cn('w-full border-t border-border', className)} {...props} />
);
