import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'saffron' | 'jade' | 'lotus' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'md', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium whitespace-nowrap rounded-full transition-colors';

  const variants = {
    saffron: 'bg-saffron-100 text-saffron-800 border border-saffron-200/60',
    jade: 'bg-jade-100 text-jade-800 border border-jade-200/60',
    lotus: 'bg-lotus-100 text-lotus-800 border border-lotus-200/60',
    neutral: 'bg-ivory-100 text-charcoal-700 border border-ivory-200',
    outline: 'border border-ivory-300 text-charcoal-700 bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
