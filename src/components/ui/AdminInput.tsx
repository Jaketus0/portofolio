import React from 'react';
import { cn } from '../../lib/utils';

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-muted">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-black/5 bg-white px-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-black/10',
            error ? 'border-danger focus:ring-danger' : '',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger">{error}</span>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';