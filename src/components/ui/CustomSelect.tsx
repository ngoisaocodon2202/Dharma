'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowClear?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = '-- Chọn lựa chọn --',
  searchable = true,
  searchPlaceholder = 'Tìm kiếm...',
  allowClear = false,
  icon,
  disabled = false,
  className,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to { value, label, description }
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => String(opt.value) === String(value));
  }, [normalizedOptions, value]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const term = searchTerm.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(term) ||
      String(opt.value).toLowerCase().includes(term) ||
      (opt.description && opt.description.toLowerCase().includes(term))
    );
  }, [normalizedOptions, searchTerm]);

  // Close on click outside & Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full select-none', isOpen ? 'z-30' : 'z-10', className)}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full py-2.5 sm:py-3 px-3.5 text-xs sm:text-sm rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer',
          'bg-ivory-50/60 dark:bg-charcoal-800/80 border-ivory-300 dark:border-charcoal-700',
          'text-charcoal-900 dark:text-charcoal-100',
          isOpen
            ? 'border-saffron-500 dark:border-saffron-400 ring-2 ring-saffron-400/20 bg-white dark:bg-charcoal-800 shadow-sm'
            : 'hover:border-saffron-400 dark:hover:border-saffron-600',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          {icon && <span className="shrink-0 text-charcoal-400 dark:text-charcoal-500">{icon}</span>}
          {selectedOption ? (
            <span className="truncate font-medium text-charcoal-900 dark:text-charcoal-100">
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate text-charcoal-400 dark:text-charcoal-500">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {allowClear && selectedOption && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-ivory-200 dark:hover:bg-charcoal-600 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 transition-colors cursor-pointer"
              title="Xóa lựa chọn"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-charcoal-400 transition-transform duration-200',
              isOpen && 'rotate-180 text-saffron-600 dark:text-saffron-400'
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu (Guaranteed to drop DOWNWARDS) */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-white dark:bg-charcoal-850 border border-ivory-200 dark:border-charcoal-700 shadow-2xl shadow-charcoal-900/15 dark:shadow-charcoal-950/80 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150"
          role="listbox"
        >
          {/* Search Bar inside Dropdown */}
          {searchable && (
            <div className="p-2 border-b border-ivory-100 dark:border-charcoal-700/80 bg-ivory-50/70 dark:bg-charcoal-800/80">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-charcoal-700 border border-ivory-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-100 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-400/30 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-charcoal-400 hover:text-charcoal-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-ivory-300 dark:scrollbar-thumb-charcoal-600">
            {/* Optional Reset / Clear option */}
            {allowClear && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer',
                  !value
                    ? 'bg-saffron-50 dark:bg-saffron-950/50 text-saffron-700 dark:text-saffron-300 font-semibold'
                    : 'text-charcoal-500 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-700/60'
                )}
              >
                <span className="italic">{placeholder}</span>
                {!value && <Check className="w-4 h-4 text-saffron-600 shrink-0 ml-2" />}
              </button>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-saffron-50 dark:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300 font-semibold'
                        : 'text-charcoal-800 dark:text-charcoal-200 hover:bg-ivory-100/90 dark:hover:bg-charcoal-700/80 hover:text-charcoal-900 dark:hover:text-white'
                    )}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="truncate font-medium">{opt.label}</div>
                      {opt.description && (
                        <div className="text-[11px] text-charcoal-500 dark:text-charcoal-400 font-normal truncate mt-0.5">
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-saffron-600 dark:text-saffron-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-charcoal-400">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
