import React from 'react';
import { cn } from '../../lib/utils';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  headerClassName?: string;
  contentClassName?: string;
}

export function AdminCard({ children, className, title, onClose, headerClassName, contentClassName, ...props }: AdminCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-black/5 text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    >
      {title && (
        <div className={cn('flex items-center justify-between border-b border-black/5 px-4 py-3', headerClassName)}>
          <h3 className="text-xs font-medium tracking-wider text-muted text-uppercase">{title}</h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-5 w-5 items-center justify-center text-muted hover:text-foreground"
              aria-label="Close"
            >
              <span className="text-sm">×</span>
            </button>
          )}
        </div>
      )}
      <div className={cn('p-4', contentClassName)}>{children}</div>
    </div>
  );
}

AdminCard.displayName = 'AdminCard';