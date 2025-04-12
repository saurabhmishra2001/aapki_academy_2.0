// components/ui/badge.js
import React from 'react';
import { cn } from '../../../lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variant === 'default'
          ? 'border-transparent bg-primary text-primary-foreground'
          : variant === 'secondary'
          ? 'border-transparent bg-secondary text-secondary-foreground'
          : variant === 'destructive'
          ? 'border-transparent bg-destructive text-destructive-foreground'
          : 'border-input bg-background',
        className
      )}
      {...props}
    />
  );
}