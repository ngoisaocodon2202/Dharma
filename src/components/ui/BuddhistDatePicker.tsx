'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuddhistDatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
}

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function BuddhistDatePicker({
  value,
  onChange,
  className,
  placeholder = 'Chọn ngày sinh...',
  required = false,
  minYear = 1920,
  maxYear = new Date().getFullYear() + 1,
}: BuddhistDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const parsedValue = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return { year: y, month: m, day: d };
  }, [value]);

  // Current view year & month in calendar
  const [viewYear, setViewYear] = useState<number>(() => {
    return parsedValue ? parsedValue.year : 1998;
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    return parsedValue ? parsedValue.month : 5; // June (0-indexed 5)
  });

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.month);
    }
  }, [value]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Year options list (from maxYear down to minYear)
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      arr.push(y);
    }
    return arr;
  }, [minYear, maxYear]);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => Math.max(minYear, y - 1));
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => Math.min(maxYear, y + 1));
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Days in month calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    // Sunday is 0 in JS, make Monday 0
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
    }[] = [];

    const today = new Date();
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    // Days from prev month
    for (let i = startDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected: Boolean(
          parsedValue &&
            parsedValue.year === y &&
            parsedValue.month === m &&
            parsedValue.day === d
        ),
        isToday: todayY === y && todayM === m && todayD === d,
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      days.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isSelected: Boolean(
          parsedValue &&
            parsedValue.year === viewYear &&
            parsedValue.month === viewMonth &&
            parsedValue.day === d
        ),
        isToday: todayY === viewYear && todayM === viewMonth && todayD === d,
      });
    }

    // Fill trailing days for 6 rows grid (42 days)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected: Boolean(
          parsedValue &&
            parsedValue.year === y &&
            parsedValue.month === m &&
            parsedValue.day === d
        ),
        isToday: todayY === y && todayM === m && todayD === d,
      });
    }

    return days;
  }, [viewYear, viewMonth, parsedValue]);

  const handleSelectDay = (y: number, m: number, d: number) => {
    const formattedMonth = String(m + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    onChange(`${y}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    handleSelectDay(y, m, d);
  };

  // Formatted display text (e.g. 15/06/1998)
  const displayText = useMemo(() => {
    if (!parsedValue) return '';
    const dd = String(parsedValue.day).padStart(2, '0');
    const mm = String(parsedValue.month + 1).padStart(2, '0');
    return `${dd}/${mm}/${parsedValue.year}`;
  }, [parsedValue]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Clickable Display Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl cursor-pointer select-none transition-all',
          'bg-ivory-50/70 dark:bg-charcoal-800/80 border border-ivory-300 dark:border-charcoal-700',
          'hover:border-saffron-400 dark:hover:border-saffron-600',
          isOpen
            ? 'ring-2 ring-saffron-500/40 border-saffron-500 shadow-sm'
            : '',
          className
        )}
      >
        <span
          className={cn(
            'text-sm font-medium tracking-wide',
            displayText
              ? 'text-charcoal-900 dark:text-charcoal-50 font-semibold'
              : 'text-charcoal-400 dark:text-charcoal-500'
          )}
        >
          {displayText || placeholder}
        </span>

        <div className="flex items-center gap-1.5 text-saffron-600 dark:text-saffron-400">
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Popover Calendar (Portaled to body to never clip on mobile or scroll) */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsOpen(false)}
          >
            <div
              ref={popoverRef}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white dark:bg-charcoal-850 rounded-2xl shadow-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden p-4 sm:p-5 animate-scale-in text-charcoal-900 dark:text-charcoal-100 space-y-3.5"
            >
              {/* Header: Month & Year Controls */}
              <div className="flex items-center justify-between gap-1 pb-2 border-b border-ivory-200 dark:border-charcoal-700">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 hover:text-saffron-600 transition-colors"
                  aria-label="Tháng trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {/* Month Select */}
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                    className="px-2 py-1 rounded-lg bg-ivory-100 dark:bg-charcoal-750 border border-ivory-200 dark:border-charcoal-600 text-xs sm:text-sm font-bold text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-1 focus:ring-saffron-500 cursor-pointer"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={name} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>

                  {/* Year Select */}
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                    className="px-2 py-1 rounded-lg bg-ivory-100 dark:bg-charcoal-750 border border-ivory-200 dark:border-charcoal-600 text-xs sm:text-sm font-bold text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-1 focus:ring-saffron-500 cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        Năm {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 hover:text-saffron-600 transition-colors"
                  aria-label="Tháng sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Header */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEK_DAYS.map((wd, i) => (
                  <div
                    key={wd}
                    className={cn(
                      'text-[11px] font-bold py-1',
                      i >= 5
                        ? 'text-saffron-600 dark:text-saffron-400'
                        : 'text-charcoal-500 dark:text-charcoal-400'
                    )}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((cd, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectDay(cd.year, cd.month, cd.day)}
                      className={cn(
                        'w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative',
                        cd.isSelected
                          ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-saffron-500 text-charcoal-950 font-black shadow-md scale-105 ring-2 ring-amber-300'
                          : cd.isCurrentMonth
                          ? 'text-charcoal-900 dark:text-charcoal-100 hover:bg-saffron-100 dark:hover:bg-charcoal-700 hover:text-saffron-700'
                          : 'text-charcoal-300 dark:text-charcoal-600 hover:bg-ivory-50 dark:hover:bg-charcoal-800',
                        cd.isToday && !cd.isSelected
                          ? 'border border-saffron-500 font-bold text-saffron-600 dark:text-saffron-400'
                          : ''
                      )}
                    >
                      <span>{cd.day}</span>
                      {cd.isToday && !cd.isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-saffron-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-ivory-200 dark:border-charcoal-700 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleSelectToday}
                  className="px-2.5 py-1 rounded-lg text-saffron-700 dark:text-saffron-400 font-semibold hover:bg-saffron-50 dark:hover:bg-charcoal-750 transition-colors"
                >
                  Hôm nay
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 rounded-lg bg-ivory-200 dark:bg-charcoal-700 hover:bg-ivory-300 text-charcoal-800 dark:text-charcoal-200 font-medium transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
