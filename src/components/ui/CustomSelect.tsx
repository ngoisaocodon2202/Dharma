'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption<T extends string | number = string | number> {
  value: T;
  label: string;
  sublabel?: string;
}

interface CustomSelectProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}

export function CustomSelect<T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className,
  buttonClassName,
  menuClassName,
  compact = false,
  align = 'left',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative w-full select-none', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-2xl bg-[#fdfbf7] dark:bg-charcoal-900 border text-left transition-all cursor-pointer whitespace-nowrap',
          compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-3 text-xs sm:text-sm',
          isOpen
            ? 'border-[#b5892e] ring-2 ring-[#b5892e]/15 bg-white dark:bg-charcoal-800 shadow-xs'
            : 'border-stone-200/90 dark:border-charcoal-700 hover:border-[#d4af37]',
          buttonClassName
        )}
      >
        <span className="font-semibold text-stone-800 dark:text-stone-100 truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#b5892e] shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu — Always expands downward with smooth rounded corners & custom scrollbar */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1.5 z-50 min-w-full w-max max-w-[88vw] sm:max-w-xs rounded-2xl bg-white dark:bg-charcoal-900 border border-[#e6dfd3] dark:border-charcoal-700 shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          <div className="max-h-56 overflow-y-auto px-1.5 space-y-0.5 custom-dropdown-scroll">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  ref={isSelected ? selectedItemRef : null}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap',
                    isSelected
                      ? 'bg-gradient-to-r from-amber-50 to-[#fff6df] dark:from-saffron-950/60 dark:to-charcoal-800 text-[#4a2508] dark:text-amber-300 font-bold shadow-2xs'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-[#fdfbf7] dark:hover:bg-charcoal-800'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[10px] text-stone-400 dark:text-stone-500 font-normal truncate">
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#b5892e] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
