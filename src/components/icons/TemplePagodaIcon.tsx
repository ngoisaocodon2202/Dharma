'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TemplePagodaIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number | string;
}

export function TemplePagodaIcon({ className, size, style, ...props }: TemplePagodaIconProps) {
  const customStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    maskImage: 'url(/icons/temple_pagoda_black.png)',
    WebkitMaskImage: 'url(/icons/temple_pagoda_black.png)',
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
      className={cn('inline-block shrink-0 aspect-square', className || 'w-4 h-4 text-lotus-700 dark:text-lotus-400')}
      style={customStyle}
      role="img"
      aria-label="Cổ Tự & Chùa Chiền"
      {...props}
    />
  );
}

export default TemplePagodaIcon;
