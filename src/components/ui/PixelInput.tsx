import React from 'react';
import { cn } from '../../lib/utils';

export interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-press-start text-[10px] text-pixel-text uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full bg-pixel-bg px-3 py-2 font-vt323 text-xl text-pixel-text placeholder:text-pixel-text-muted focus:outline-none transition-colors',
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
PixelInput.displayName = 'PixelInput';
