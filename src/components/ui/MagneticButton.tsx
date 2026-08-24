import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(
  (
    { className, variant = 'primary', isLoading, children, ...props },
    ref
  ) => {
    const variants = {
      primary:
        'bg-zinc-900 text-white hover:bg-black',
      outline:
        'border border-black/15 text-zinc-900 hover:bg-black/5',
      ghost: 'text-zinc-500 hover:text-zinc-900 hover:bg-black/5',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2',
      'rounded-full px-6 py-3 text-sm font-medium transition-colors',
      'duration-300 focus-visible:outline-primary disabled:opacity-60',
      'disabled:cursor-not-allowed active:scale-[0.98]',
      variants[variant],
      className
    );

    return (
      <button ref={ref} type="button" className={baseClasses} {...props}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';