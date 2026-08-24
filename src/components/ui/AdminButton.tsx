import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors';

    const variants = {
      primary: 'bg-foreground text-white hover:bg-black',
      secondary: 'bg-transparent border border-black/10 text-foreground hover:bg-black/5',
      danger: 'bg-danger text-white hover:bg-danger/90',
      ghost: 'bg-transparent text-muted hover:text-foreground',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClasses, variants[variant], 'disabled:opacity-55 disabled:cursor-not-allowed', className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

AdminButton.displayName = 'AdminButton';