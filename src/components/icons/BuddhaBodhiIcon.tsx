'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BuddhaBodhiIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number | string;
}

export function BuddhaBodhiIcon({ className, size, style, ...props }: BuddhaBodhiIconProps) {
  const customStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    maskImage: 'url(/icons/buddha_bodhi_black.png)',
    WebkitMaskImage: 'url(/icons/buddha_bodhi_black.png)',
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
      className={cn('inline-block shrink-0 aspect-square', className || 'w-4 h-4 text-saffron-600')}
      style={customStyle}
      role="img"
      aria-label="Đức Phật Bồ Đề"
      {...props}
    />
  );
}

export default BuddhaBodhiIcon;
