'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Trash2,
  Clock,
  UtensilsCrossed,
  ScrollText,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { getLunarDate, LunarDateInfo } from '@/lib/lunar-calendar';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { cn } from '@/lib/utils';

export interface PersonalReminder {
  id: string;
  title: string;
  note: string;
  type: 'gio' | 'quan_trong' | 'trai_gioi';
  solarDate: string; // YYYY-MM-DD
  lunarDay: number;
  lunarMonth: number;
  repeatType: 'lunar_yearly' | 'solar_yearly' | 'once';
  createdAt: string;
}

const REMINDER_STORAGE_KEY = 'phatphap_personal_reminders_v1';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export type TraiKyMode = 'all' | 'nhi_trai' | 'tu_trai' | 'luc_trai' | 'thap_trai';

const TRAI_DAYS: Record<Exclude<TraiKyMode, 'all'>, number[]> = {
  nhi_trai: [1, 15],
  tu_trai: [1, 14, 15, 30, 29],
  luc_trai: [8, 14, 15, 23, 28, 29, 30],
  thap_trai: [1, 8, 14, 15, 18, 23, 24, 28, 29, 30],
};

export default function BuddhistCalendarPage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1..12
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [traiFilter, setTraiFilter] = useState<TraiKyMode>('all');

  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Form states for adding reminder
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'gio' | 'quan_trong' | 'trai_gioi'>('gio');
  const [repeatType, setRepeatType] = useState<'lunar_yearly' | 'solar_yearly' | 'once'>('lunar_yearly');

  // Load saved reminders from localStorage
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(REMINDER_STORAGE_KEY) ||
        localStorage.getItem('phatphap_personal_reminders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReminders(parsed);
      }
    } catch {}
  }, []);

  const saveReminders = (next: PersonalReminder[]) => {
    setReminders(next);
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  // Selected Date Lunar Info
  const selectedLunarInfo: LunarDateInfo = useMemo(() => {
    return getLunarDate(viewYear, viewMonth, selectedDay);
  }, [viewYear, viewMonth, selectedDay]);

  const selectedDateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  // Build Calendar Grid for current viewYear & viewMonth
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1);
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();

    // Monday = 0 ... Sunday = 6
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: {
      day: number | null;
      solarStr?: string;
      lunar?: LunarDateInfo;
      dayReminders?: PersonalReminder[];
    }[] = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null });
    }

    for (let d = 1; d <= totalDays; d++) {
      const solarStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const lunar = getLunarDate(viewYear, viewMonth, d);

      // Check matching reminders for this day
      const matching = reminders.filter((r) => {
        if (r.repeatType === 'lunar_yearly') {
          return r.lunarDay === lunar.lunarDay && r.lunarMonth === lunar.lunarMonth;
        }
        if (r.repeatType === 'solar_yearly') {
          const [, m, dayPart] = r.solarDate.split('-').map(Number);
          return m === viewMonth && dayPart === d;
        }
        return r.solarDate === solarStr;
      });

      cells.push({
        day: d,
        solarStr,
        lunar,
        dayReminders: matching,
      });
    }

    return cells;
  }, [viewYear, viewMonth, reminders]);

  // Reminders matching currently selected day
  const selectedDayReminders = useMemo(() => {
    return reminders.filter((r) => {
      if (r.repeatType === 'lunar_yearly') {
        return (
          r.lunarDay === selectedLunarInfo.lunarDay &&
          r.lunarMonth === selectedLunarInfo.lunarMonth
        );
      }
      if (r.repeatType === 'solar_yearly') {
        const [, m, d] = r.solarDate.split('-').map(Number);
        return m === viewMonth && d === selectedDay;
      }
      return r.solarDate === selectedDateStr;
    });
  }, [reminders, selectedLunarInfo, viewMonth, selectedDay, selectedDateStr]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleGoToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const newItem: PersonalReminder = {
      id: `rem-${Date.now()}`,
      title: noteTitle.trim(),
      note: noteContent.trim(),
      type: noteType,
      solarDate: selectedDateStr,
      lunarDay: selectedLunarInfo.lunarDay,
      lunarMonth: selectedLunarInfo.lunarMonth,
      repeatType,
      createdAt: new Date().toISOString(),
    };

    saveReminders([newItem, ...reminders]);
    setNoteTitle('');
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleDeleteReminder = (id: string) => {
    saveReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-7">
      {/* 1. Header Banner — Clean & Mobile Friendly */}
      <div className="bg-gradient-to-r from-[#3d1f0d] via-[#5c1616] to-[#3d1f0d] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#d4af37]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ffd966] whitespace-nowrap">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Lịch Vạn Niên Âm Dương</span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-white leading-snug">
            Lịch Phật Giáo & Nhắc Nhở Ngày Giỗ
          </h1>
          <p className="text-xs text-[#e8d5b5] max-w-2xl leading-relaxed">
            Chọn bất kỳ ngày nào trên lịch để xem Âm lịch, Giờ Hoàng Đạo hoặc ghi chú Ngày Giỗ, Ngày Quan Trọng của gia đình.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#d4af37]/40 text-xs font-semibold text-[#ffd966] whitespace-nowrap text-center transition-colors cursor-pointer"
          >
            Hôm nay ({today.getDate()}/{today.getMonth() + 1})
          </button>
          <button
            type="button"
            onClick={() => setIsAddingNote(true)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-400 hover:to-saffron-500 text-charcoal-950 text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Thêm Nhắc Nhở</span>
          </button>
        </div>
      </div>

      {/* 2. Main Layout: Left 7 Cols Calendar Grid | Right 5 Cols Day Detail & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* LEFT: Perpetual Calendar Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-800 rounded-2xl sm:rounded-3xl border border-[#e5d8c1] dark:border-charcoal-700 shadow-md p-3 sm:p-5 space-y-3.5">
          {/* Single-Row Month / Year Controls (Never wraps on mobile) */}
          <div className="flex items-center justify-between gap-1.5 bg-[#fbf7ef] dark:bg-charcoal-900 p-1.5 sm:p-2 rounded-2xl border border-[#eadcc5] dark:border-charcoal-700">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-amber-50 border border-[#e5d8c1] dark:border-charcoal-700 flex items-center justify-center text-charcoal-700 dark:text-charcoal-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <CustomSelect
                compact
                value={viewMonth}
                onChange={(val) => {
                  setViewMonth(Number(val));
                  setSelectedDay(1);
                }}
                className="w-28 sm:w-32"
                buttonClassName="rounded-xl bg-white dark:bg-charcoal-800 border-[#e5d8c1]"
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: i + 1,
                  label: `Tháng ${i + 1}`,
                }))}
              />

              <CustomSelect
                compact
                align="right"
                value={viewYear}
                onChange={(val) => {
                  setViewYear(Number(val));
                  setSelectedDay(1);
                }}
                className="w-24 sm:w-28"
                buttonClassName="rounded-xl bg-white dark:bg-charcoal-800 border-[#e5d8c1]"
                options={Array.from({ length: 65 }, (_, i) => ({
                  value: 2020 + i,
                  label: `${2020 + i}`,
                }))}
              />
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-amber-50 border border-[#e5d8c1] dark:border-charcoal-700 flex items-center justify-center text-charcoal-700 dark:text-charcoal-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trai Kỳ Fasting Selector Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 whitespace-nowrap flex items-center gap-1 shrink-0">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" /> Trai Kỳ:
            </span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'nhi_trai', label: 'Nhị Trai (1, 15 ÂL)' },
              { id: 'tu_trai', label: 'Tứ Trai (1, 14, 15, 30)' },
              { id: 'luc_trai', label: 'Lục Trai (6 ngày)' },
              { id: 'thap_trai', label: 'Thập Trai (10 ngày)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTraiFilter(t.id as TraiKyMode)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 border',
                  traiFilter === t.id
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border-[#e5d8c1] dark:border-charcoal-700 hover:bg-amber-50'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Calendar Board Container */}
          <div className="bg-[#f8f2e6] dark:bg-charcoal-900/80 p-1.5 sm:p-2.5 rounded-2xl border border-[#e6d8c0] dark:border-charcoal-700 space-y-1.5">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {WEEKDAYS.map((w, idx) => (
                <div
                  key={w}
                  className={cn(
                    'py-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap',
                    idx === 6
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-[#6b4f2a] dark:text-charcoal-300'
                  )}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid — Symmetrical & Crisp on Mobile */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((cell, idx) => {
                if (!cell.day || !cell.lunar) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-12 sm:h-16 rounded-xl bg-white/40 dark:bg-charcoal-800/20"
                    />
                  );
                }

                const isToday =
                  cell.day === today.getDate() &&
                  viewMonth === today.getMonth() + 1 &&
                  viewYear === today.getFullYear();
                const isSelected = cell.day === selectedDay;
                const hasReminders = (cell.dayReminders?.length || 0) > 0;
                const hasGio = cell.dayReminders?.some((r) => r.type === 'gio');
                const isFirstLunar = cell.lunar.lunarDay === 1 || cell.day === 1;
                const isTraiMatch = traiFilter !== 'all' && TRAI_DAYS[traiFilter]?.includes(cell.lunar.lunarDay);

                return (
                  <button
                    key={cell.day}
                    type="button"
                    onClick={() => setSelectedDay(cell.day!)}
                    className={cn(
                      'relative h-12 sm:h-16 px-1 py-1 sm:p-2 rounded-xl border flex flex-col items-center sm:items-stretch justify-between transition-all cursor-pointer select-none overflow-hidden',
                      isSelected
                        ? 'bg-gradient-to-b from-[#b56708] to-[#8c4600] text-white border-[#8c4600] shadow-md scale-[1.02] z-10'
                        : isToday
                        ? 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-500 text-charcoal-900 dark:text-charcoal-100 ring-1 ring-amber-400'
                        : hasReminders
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-charcoal-900 dark:text-charcoal-100'
                        : isTraiMatch
                        ? 'bg-[#fff5dc] dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400 shadow-2xs'
                        : cell.lunar.isMainTraiDay
                        ? 'bg-[#fff9eb] dark:bg-charcoal-800 border-amber-300/90 dark:border-amber-700/60 text-charcoal-900 dark:text-charcoal-100'
                        : 'bg-white dark:bg-charcoal-800 border-[#e9decb] dark:border-charcoal-700 hover:border-amber-400 text-charcoal-800 dark:text-charcoal-200 shadow-2xs'
                    )}
                  >
                    {/* Top Row: Solar Day + Indicator Dots */}
                    <div className="w-full flex items-center justify-center sm:justify-between relative">
                      <span
                        className={cn(
                          'font-heading font-bold text-xs sm:text-base leading-none whitespace-nowrap',
                          isSelected
                            ? 'text-white'
                            : isToday
                            ? 'text-amber-900 dark:text-amber-300 font-extrabold'
                            : 'text-charcoal-900 dark:text-charcoal-100'
                        )}
                      >
                        {cell.day}
                      </span>

                      {/* Top-right indicator dot/icon */}
                      <div className="absolute right-0 top-0 sm:static flex items-center gap-0.5">
                        {hasReminders ? (
                          <span
                            className="text-[8px] sm:text-[10px] leading-none"
                            title="Có ngày giỗ / lời nhắc"
                          >
                            {hasGio ? '🕯️' : '⭐'}
                          </span>
                        ) : isTraiMatch ? (
                          <span
                            className="text-[9px] leading-none"
                            title="Ngày ăn chay theo Trai Kỳ đang chọn"
                          >
                            🪷
                          </span>
                        ) : cell.lunar.isMainTraiDay ? (
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isSelected ? 'bg-amber-200' : 'bg-amber-500'
                            )}
                            title="Ngày Trai (Mùng 1 / Rằm)"
                          />
                        ) : null}
                      </div>
                    </div>

                    {/* Bottom Row: Compact Lunar Day/Month (never overflows mobile cell) */}
                    <div className="w-full flex items-center justify-center sm:justify-between">
                      <span
                        className={cn(
                          'text-[9px] sm:text-[11px] leading-none whitespace-nowrap tracking-tight',
                          isSelected
                            ? 'text-amber-100 font-semibold'
                            : cell.lunar.isMainTraiDay || isFirstLunar
                            ? 'text-[#b4690e] dark:text-amber-400 font-bold'
                            : 'text-stone-400 dark:text-charcoal-400 font-medium'
                        )}
                      >
                        {isFirstLunar
                          ? `${cell.lunar.lunarDay}/${cell.lunar.lunarMonth}`
                          : cell.lunar.lunarDay}
                      </span>

                      {cell.lunar.isHoangDao && (
                        <span
                          className={cn(
                            'hidden sm:inline-block w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-emerald-300' : 'bg-emerald-500/80'
                          )}
                          title="Ngày Hoàng Đạo"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal-600 dark:text-charcoal-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /> Ngày Trai (1, 15 ÂL)
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> Hoàng Đạo
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span>🕯️</span> Ngày Giỗ
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span>⭐</span> Quan Trọng
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Selected Date Details + Personal Reminders Manager */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Card 1: Selected Day Sheet */}
          <div className="bg-gradient-to-br from-charcoal-900 via-stone-900 to-charcoal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] text-amber-300 font-semibold uppercase tracking-wider block whitespace-nowrap">
                  Dương Lịch Đang Chọn
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white whitespace-nowrap truncate">
                  Ngày {selectedDay}/{viewMonth}/{viewYear}
                </h2>
              </div>
              <div className="px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-right shrink-0">
                <div className="text-[10px] text-amber-200 uppercase whitespace-nowrap">Âm Lịch</div>
                <div className="font-heading font-extrabold text-xs sm:text-sm text-amber-300 whitespace-nowrap">
                  {selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} • {selectedLunarInfo.yearCanChi}
                </div>
              </div>
            </div>

            {/* Can Chi & Hoang Dao Status */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 min-w-0">
                <span className="text-[10px] text-stone-400 block whitespace-nowrap">Can Chi Ngày</span>
                <span className="font-semibold text-amber-100 mt-0.5 block whitespace-nowrap truncate">
                  {selectedLunarInfo.dayCanChi}
                </span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 min-w-0">
                <span className="text-[10px] text-stone-400 block whitespace-nowrap">Trực / Hoàng Đạo</span>
                <span
                  className={cn(
                    'font-semibold mt-0.5 block whitespace-nowrap truncate',
                    selectedLunarInfo.isHoangDao ? 'text-emerald-300' : 'text-stone-300'
                  )}
                >
                  {selectedLunarInfo.hoangDaoStar}
                </span>
              </div>
            </div>

            {/* Buddhist Holiday or Trai Day Banner */}
            {(selectedLunarInfo.buddhistEvent || selectedLunarInfo.isTraiDay) && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 space-y-1.5">
                {selectedLunarInfo.buddhistEvent && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <BuddhaBodhiIcon className="w-4 h-4 shrink-0" />
                    <span>{selectedLunarInfo.buddhistEvent}</span>
                  </div>
                )}
                {selectedLunarInfo.isTraiDay && (
                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="text-[11px] text-amber-100/90 leading-relaxed">
                      🪷 Ngày Trai Giới ({selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} ÂL): Khuyến tấn ăn chay, niệm Phật, làm việc thiện lành.
                    </div>
                    <Link
                      href="/mon-chay"
                      className="px-2.5 py-1 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-[10px] font-bold text-amber-200 border border-amber-400/40 whitespace-nowrap shrink-0 transition-colors"
                    >
                      Món chay dưỡng sinh →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Good Hours */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Giờ Hoàng Đạo trong ngày:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLunarInfo.goodHours.map((h) => (
                  <span
                    key={h}
                    className="px-2 py-0.5 rounded-lg bg-white/10 text-amber-200 text-[11px] font-medium whitespace-nowrap"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Reminders on this selected date */}
            {selectedDayReminders.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs font-bold text-rose-300 block">
                  📌 Ghi chú / Ngày giỗ trong ngày này:
                </span>
                {selectedDayReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{rem.type === 'gio' ? '🕯️' : rem.type === 'trai_gioi' ? '🪷' : '⭐'}</span>
                        <span className="truncate">{rem.title}</span>
                      </div>
                      {rem.note && <p className="text-[11px] text-stone-200 mt-0.5">{rem.note}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="text-rose-300 hover:text-white p-1 shrink-0"
                      title="Xóa lời nhắc"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Button to Add Note for Selected Date (Concise, single line) */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddingNote(true)}
              className="w-full text-xs font-bold whitespace-nowrap truncate"
            >
              <Plus className="w-4 h-4 mr-1 shrink-0" />
              <span className="whitespace-nowrap truncate">
                Ghi Chú Ngày Giỗ / Nhắc Nhở ({selectedDay}/{viewMonth})
              </span>
            </Button>
          </div>

          {/* Card 2: Form to Add Personal Reminder (when open) */}
          {isAddingNote && (
            <form
              onSubmit={handleAddReminder}
              className="bg-white dark:bg-charcoal-800 rounded-2xl sm:rounded-3xl border-2 border-saffron-400 dark:border-saffron-600 p-4 sm:p-5 space-y-3.5 shadow-lg animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap truncate">
                  Tạo Lịch Nhắc ({selectedDay}/{viewMonth} — {selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} ÂL)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="text-xs text-charcoal-400 hover:text-charcoal-700 whitespace-nowrap shrink-0"
                >
                  Đóng
                </button>
              </div>

              {/* Type Selector */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'gio', label: '🕯️ Ngày Giỗ', repeat: 'lunar_yearly' },
                  { id: 'quan_trong', label: '⭐ Quan Trọng', repeat: 'solar_yearly' },
                  { id: 'trai_gioi', label: '🪷 Đi Chùa', repeat: 'lunar_yearly' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setNoteType(t.id as any);
                      setRepeatType(t.repeat as any);
                    }}
                    className={cn(
                      'py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-bold border text-center whitespace-nowrap truncate transition-all cursor-pointer',
                      noteType === t.id
                        ? 'bg-saffron-600 text-white border-saffron-600'
                        : 'bg-ivory-50 dark:bg-charcoal-900 text-charcoal-700 dark:text-charcoal-300 border-ivory-200 dark:border-charcoal-700'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block">
                  Tên ngày giỗ / Sự kiện quan trọng *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ví dụ: Ngày giỗ Ông Nội, Sinh nhật Mẹ..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-ivory-50 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:border-saffron-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block">
                  Chế độ lặp lại hằng năm
                </label>
                <CustomSelect
                  compact
                  value={repeatType}
                  onChange={(val) => setRepeatType(val as 'lunar_yearly' | 'solar_yearly' | 'once')}
                  options={[
                    {
                      value: 'lunar_yearly',
                      label: `Hằng năm theo Âm lịch (${selectedLunarInfo.lunarDay}/${selectedLunarInfo.lunarMonth} ÂL — Ngày Giỗ)`,
                    },
                    {
                      value: 'solar_yearly',
                      label: `Hằng năm theo Dương lịch (${selectedDay}/${viewMonth} DL)`,
                    },
                    {
                      value: 'once',
                      label: `Chỉ nhắc 1 lần (${selectedDateStr})`,
                    },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block">
                  Ghi chú chi tiết (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Chuẩn bị mâm cơm chay, hoa sen, tụng kinh cầu siêu..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-ivory-50 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:border-saffron-500"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full text-xs font-bold whitespace-nowrap">
                Lưu Vào Lịch Nhắc Nhở
              </Button>
            </form>
          )}

          {/* Card 3: All Saved Personal Reminders List */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl sm:rounded-3xl border border-[#e5d8c1] dark:border-charcoal-700 p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Bell className="w-4 h-4 text-saffron-600 shrink-0" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap truncate">
                  Sổ Ghi Nhớ Ngày Giỗ & Sự Kiện ({reminders.length})
                </h3>
              </div>
              {user && (
                <span className="text-[11px] text-saffron-700 dark:text-saffron-400 font-semibold whitespace-nowrap shrink-0">
                  ☸ {user.dharma_name || user.full_name}
                </span>
              )}
            </div>

            {reminders.length === 0 ? (
              <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-charcoal-900/60 border border-dashed border-ivory-300 dark:border-charcoal-700 text-center space-y-1">
                <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300">
                  Chưa có ngày giỗ hoặc lời nhắc cá nhân nào.
                </p>
                <p className="text-[11px] text-charcoal-400">
                  Bấm vào một ngày trên lịch rồi chọn &ldquo;Ghi Chú Ngày Giỗ / Nhắc Nhở&rdquo; để lưu lại.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-2xl bg-ivory-50/90 dark:bg-charcoal-900/70 border border-ivory-200 dark:border-charcoal-700 flex items-start justify-between gap-2.5"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-charcoal-900 dark:text-charcoal-100">
                          {rem.type === 'gio' ? '🕯️' : rem.type === 'trai_gioi' ? '🪷' : '⭐'} {rem.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-950 text-saffron-800 dark:text-saffron-300 text-[10px] font-bold whitespace-nowrap">
                          {rem.repeatType === 'lunar_yearly'
                            ? `${rem.lunarDay}/${rem.lunarMonth} ÂL hằng năm`
                            : rem.repeatType === 'solar_yearly'
                            ? `${rem.solarDate.slice(5)} DL hằng năm`
                            : rem.solarDate}
                        </span>
                      </div>
                      {rem.note && (
                        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                          {rem.note}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 text-charcoal-400 hover:text-rose-600 transition-colors shrink-0"
                      title="Xóa ghi chú"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 4: Useful Practice Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/mon-chay"
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fdfaf3] to-[#fbf4e4] dark:from-charcoal-800 dark:to-charcoal-900 border border-[#e8dac1] dark:border-charcoal-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-xs group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300">
                  <span className="text-sm">🥗</span>
                  <span className="truncate">Sổ Tay Món Chay</span>
                </div>
                <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-snug">
                  20+ món chay thanh đạm, dinh dưỡng cho ngày trai giới và gia đình.
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Xem công thức →
              </div>
            </Link>

            <Link
              href="/hoi-huong"
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fdfaf3] to-[#fbf4e4] dark:from-charcoal-800 dark:to-charcoal-900 border border-[#e8dac1] dark:border-charcoal-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-xs group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300">
                  <span className="text-sm">📜</span>
                  <span className="truncate">Sớ Cầu An & Hồi Hướng</span>
                </div>
                <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-snug">
                  Soạn văn sớ cầu siêu ngày giỗ, cầu an gia quyến & in ấn trang nghiêm.
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Soạn văn sớ →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
