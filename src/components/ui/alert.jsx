// components/ui/alert.js
import React from 'react';
import { cn } from '../../../lib/utils';
import { AlertCircle } from 'lucide-react';

export function Alert({ className, variant = 'default', children, ...props }) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variant === 'destructive'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-blue-200 bg-blue-50 text-blue-700',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {variant === 'destructive' && <AlertCircle className="h-4 w-4" />}
        {children}
      </div>
    </div>
  );
}

export function AlertDescription({ className, ...props }) {
  return <p className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />;
}