'use client';

import { useState, ComponentProps, ButtonHTMLAttributes } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CopyUrlButtonProps = ComponentProps<'button'> &
  ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps & { url: string };

export const CopyURLButton = ({
  url,
  className,
  ...props
}: CopyUrlButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () =>
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={className}
            variant="outline"
            onClick={handleCopy}
            {...props}
          >
            {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
            <span className="ml-1 sm:hidden">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="hidden">
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
