import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  strong?: boolean;
}

export function GlassCard({
  className,
  hover = false,
  strong = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? 'glass-strong' : 'glass',
        hover && 'glass-hover',
        'rounded-3xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}