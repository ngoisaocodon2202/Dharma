'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'lotus';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'group relative inline-flex items-center justify-center font-medium whitespace-nowrap overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 active:scale-[0.97] active:translate-y-0 select-none rounded-xl';

    const variants = {
      primary:
        'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:from-saffron-600 hover:to-saffron-700 hover:shadow-lg hover:shadow-saffron-500/25 hover:-translate-y-0.5 active:bg-saffron-700',
      secondary:
        'bg-gradient-to-r from-jade-600 to-jade-700 text-white hover:from-jade-700 hover:to-jade-800 hover:shadow-lg hover:shadow-jade-600/25 hover:-translate-y-0.5 active:bg-jade-800',
      outline:
        'border border-ivory-300 bg-white/70 text-charcoal-800 hover:border-saffron-400 hover:text-saffron-700 hover:bg-saffron-50/40 hover:-translate-y-0.5 hover:shadow-sm',
      ghost:
        'bg-transparent text-charcoal-700 hover:bg-saffron-50 hover:text-saffron-700 hover:-translate-y-0.5',
      lotus:
        'bg-gradient-to-r from-lotus-500 to-lotus-600 text-white hover:from-lotus-600 hover:to-lotus-700 hover:shadow-lg hover:shadow-lotus-500/25 hover:-translate-y-0.5 active:bg-lotus-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4.5 py-2 text-sm',
      lg: 'px-6 py-2.5 text-base',
    };

    const showShimmer = variant === 'primary' || variant === 'secondary' || variant === 'lotus';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Subtle light shimmer sweep on hover */}
        {showShimmer && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
          />
        )}

        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap truncate">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
