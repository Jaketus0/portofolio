import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-black/[0.06] opacity-80',
        className
      )}
      aria-hidden
    >
      <div className="shimmer-line absolute inset-y-0 w-1/2" />
    </div>
  );
}