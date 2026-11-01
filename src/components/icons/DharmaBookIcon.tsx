'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface DharmaBookIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number | string;
}

export function DharmaBookIcon({ className, size, style, ...props }: DharmaBookIconProps) {
  const customStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    maskImage: 'url(/icons/dharma_book_black.png)',
    WebkitMaskImage: 'url(/icons/dharma_book_black.png)',
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
      className={cn('inline-block shrink-0 aspect-square', className || 'w-4 h-4 text-saffron-700 dark:text-saffron-400')}
      style={customStyle}
      role="img"
      aria-label="Giáo Lý & Thư Viện"
      {...props}
    />
  );
}

export const DharmaLibraryIcon = DharmaBookIcon;
export default DharmaBookIcon;
