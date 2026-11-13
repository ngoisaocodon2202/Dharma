'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CenterToastProps {
  message: string | null | undefined;
  variant?: 'warm' | 'dark' | 'mindful';
  icon?: 'check' | 'sparkles' | 'bell' | 'none';
  title?: string;
  subtitle?: string;
}

/**
 * Portal-backed viewport-centered toast notification.
 * Anchors cleanly to the center of the screen above all modals, drawers, and dropdowns,
 * wrapping multi-line messages safely so text never clips or overflows horizontally.
 */
export function CenterToast({
  message,
  variant = 'warm',
  icon = 'sparkles',
  title,
  subtitle,
}: CenterToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !message) return null;

  const isDark = variant === 'dark';
  const isMindful = variant === 'mindful';

  const renderIcon = () => {
    if (icon === 'none') return null;

    const iconEl =
      icon === 'check' ? (
        <Check className="w-4 h-4" />
      ) : icon === 'bell' ? (
        <Bell className="w-4 h-4" />
      ) : (
        <Sparkles className="w-4 h-4" />
      );

    return (
      <span
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 border',
          isDark
            ? 'bg-[#3A2110] border-[#A97B4F]/65 text-[#E6C7A0]'
            : icon === 'check'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-[#FFF6DF] border-[#E5C67E] text-[#C68B19]'
        )}
      >
        {iconEl}
      </span>
    );
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000000] pointer-events-none flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className={cn(
          'pointer-events-none w-fit max-w-[min(24rem,calc(100vw-2rem))] rounded-2xl px-4 sm:px-5 py-3.5 shadow-[0_24px_60px_rgba(44,30,16,0.28)] animate-scale-in',
          isDark
            ? 'bg-[#1B0D09]/95 backdrop-blur-md border-2 border-[#A97B4F]/85 text-[#FFF4D2] shadow-[0_24px_60px_rgba(0,0,0,0.68)]'
            : 'bg-[#FFFDF8] border-2 border-[#D9A02E] text-[#2C1E10]',
          isMindful && 'w-full px-5 py-4 text-center rounded-3xl'
        )}
      >
        {isMindful || title ? (
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="flex items-center justify-center gap-2">
              {renderIcon()}
              {title && (
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase tracking-wider',
                    isDark ? 'text-[#E6C7A0]' : 'text-[#8C5500]'
                  )}
                >
                  {title}
                </span>
              )}
            </div>
            <p className="font-heading text-sm sm:text-base font-bold leading-relaxed break-words [overflow-wrap:anywhere]">
              {isMindful ? `\u201C${message}\u201D` : message}
            </p>
            {subtitle && (
              <p
                className={cn(
                  'text-[11px] leading-relaxed break-words [overflow-wrap:anywhere]',
                  isDark ? 'text-[#D8C1A0]' : 'text-[#7D6442]'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {renderIcon()}
            <p className="min-w-0 text-xs sm:text-sm font-bold leading-relaxed break-words [overflow-wrap:anywhere]">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

