import React from 'react';
import { cn } from '../../lib/utils';

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-muted">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-black/5 bg-white px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-black/10',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

AdminSelect.displayName = 'AdminSelect';