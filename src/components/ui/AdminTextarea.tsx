import React from 'react';
import { cn } from '../../lib/utils';

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-muted">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-black/10 resize-y',
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

AdminTextarea.displayName = 'AdminTextarea';