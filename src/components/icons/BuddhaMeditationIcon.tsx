'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BuddhaMeditationIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number | string;
}

export function BuddhaMeditationIcon({ className, size, style, ...props }: BuddhaMeditationIconProps) {
  const customStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    maskImage: 'url(/icons/buddha_meditation_black.png?v=2)',
    WebkitMaskImage: 'url(/icons/buddha_meditation_black.png?v=2)',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    backgroundColor: 'currentColor',
    width: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
    height: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
    ...style,
  };

  return (
    <span
      className={cn('inline-block shrink-0 aspect-square', className || 'w-4 h-4 text-jade-700 dark:text-jade-400')}
      style={customStyle}
      role="img"
      aria-label="Đức Phật Thiền Định"
      {...props}
    />
  );
}

export default BuddhaMeditationIcon;
