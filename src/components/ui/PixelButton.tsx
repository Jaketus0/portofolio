import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-pixel-primary text-black hover:bg-pixel-primary/80 active:translate-y-1 active:shadow-[0_0_0_0_rgba(0,0,0,0.5)] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]',
      secondary: 'bg-pixel-panel text-pixel-primary hover:bg-pixel-border active:translate-y-1 active:shadow-[0_0_0_0_rgba(0,0,0,0.5)] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]',
      danger: 'bg-pixel-danger text-white hover:bg-pixel-danger/80 active:translate-y-1 active:shadow-[0_0_0_0_rgba(0,0,0,0.5)] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]',
      ghost: 'bg-transparent text-pixel-text hover:text-pixel-primary hover:bg-pixel-border/30',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center px-4 py-2 font-press-start text-[10px] uppercase transition-all',
          'pixel-border border-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

PixelButton.displayName = 'PixelButton';
