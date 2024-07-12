'use client';

import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const CopyURLButton = ({ url }: { url: string }) => {
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
            className="w-full min-[375px]:w-auto"
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
            <span className="ml-1 min-[375px]:hidden">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="hidden min-[375px]:block">
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
