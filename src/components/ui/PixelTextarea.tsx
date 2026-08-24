import React from 'react';
import { cn } from '../../lib/utils';

export interface PixelTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const PixelTextarea = React.forwardRef<HTMLTextAreaElement, PixelTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-press-start text-[10px] text-pixel-text uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[100px] w-full bg-pixel-bg px-3 py-2 font-vt323 text-xl text-pixel-text placeholder:text-pixel-text-muted focus:outline-none transition-colors resize-y',
            'pixel-border',
            error ? 'border-pixel-danger focus:border-pixel-danger' : 'focus:border-pixel-primary',
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-press-start text-[8px] text-pixel-danger uppercase">
            {error}
          </span>
        )}
      </div>
    );
  }
);
PixelTextarea.displayName = 'PixelTextarea';
