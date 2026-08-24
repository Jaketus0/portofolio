import React from 'react';
import { cn } from '../../lib/utils';

interface PixelWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  headerClassName?: string;
  contentClassName?: string;
}

export function PixelWindow({
  children,
  className,
  title,
  onClose,
  headerClassName,
  contentClassName,
  ...props
}: PixelWindowProps) {
  return (
    <div
      className={cn(
        'pixel-border bg-pixel-panel text-pixel-text shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]',
        className
      )}
      {...props}
    >
      {title && (
        <div
          className={cn(
            'flex items-center justify-between border-b-4 border-pixel-border bg-pixel-border/30 px-3 py-2',
            headerClassName
          )}
        >
          <span className="font-press-start text-[10px] uppercase text-pixel-text">
            {title}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="group ml-4 p-1 hover:bg-pixel-danger"
              aria-label="Close"
            >
              <div className="h-2 w-2 bg-pixel-text group-hover:bg-white" style={{ clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)'}} />
            </button>
          )}
        </div>
      )}
      <div className={cn('p-4', contentClassName)}>{children}</div>
    </div>
  );
}
