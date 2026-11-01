import React from 'react';
import { cn } from '@/lib/utils';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-ivory-300 bg-ivory-50/50',
        className
      )}
    >
      <div className="w-12 h-12 mb-3 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600">
        {icon || <BuddhaBodhiIcon className="w-7 h-7 text-saffron-600" />}
      </div>
      <h4 className="font-heading text-lg font-medium text-charcoal-800">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-charcoal-500 mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
