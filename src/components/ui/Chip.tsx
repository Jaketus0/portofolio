import React from 'react';
import { cn } from '../../lib/utils';

export function Chip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/[0.03]',
        'px-3 py-1 text-xs font-medium text-zinc-600',
        className
      )}
    >
      {children}
    </span>
  );
}