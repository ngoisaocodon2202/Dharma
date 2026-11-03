'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Trash2,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  Flame,
  Star,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { getLunarDate, LunarDateInfo } from '@/lib/lunar-calendar';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
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

const REMINDER_STORAGE_KEY = 'phatphap_personal_reminders';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function BuddhistCalendarPage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1..12
  const [selectedDay, setSelectedDay] = useState(today.getDate());

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
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
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
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 dark:border-charcoal-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 whitespace-nowrap">
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>Lịch Vạn Niên Âm Dương • Sổ Ghi Nhớ Ngày Giỗ & Trai Giới</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
            Lịch Phật Giáo & Nhắc Nhở Ngày Quan Trọng
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl">
            Tra cứu lịch Âm – Dương vĩnh cửu, ngày trai, ngày vía Phật và bấm vào bất kỳ ngày nào để ghi chú{' '}
            <strong className="text-charcoal-900 dark:text-charcoal-100">Ngày Giỗ gia tiên</strong> hoặc{' '}
            <strong className="text-charcoal-900 dark:text-charcoal-100">Ngày quan trọng</strong> của riêng bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleGoToday} className="whitespace-nowrap">
            Hôm nay ({today.getDate()}/{today.getMonth() + 1}/{today.getFullYear()})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" />
            <span>Thêm Ngày Giỗ / Nhắc Nhở</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Layout: Left 7 Cols Calendar Grid | Right 5 Cols Day Detail & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Perpetual Calendar Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-4 sm:p-6 space-y-4">
          {/* Month / Year Controls */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-ivory-100 dark:border-charcoal-700">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-700 hover:bg-saffron-100 text-charcoal-700 dark:text-charcoal-200 transition-colors cursor-pointer shrink-0"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <select
                value={viewMonth}
                onChange={(e) => {
                  setViewMonth(Number(e.target.value));
                  setSelectedDay(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m} Dương lịch
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => {
                  setViewYear(Number(e.target.value));
                  setSelectedDay(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 font-heading font-bold text-sm sm:text-base text-saffron-700 dark:text-saffron-400 focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                {Array.from({ length: 60 }, (_, i) => 2020 + i).map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-ivory-100 dark:bg-charcoal-700 hover:bg-saffron-100 text-charcoal-700 dark:text-charcoal-200 transition-colors cursor-pointer shrink-0"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={w}
                className={cn(
                  'py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap',
                  idx === 6 ? 'text-rose-600 dark:text-rose-400' : 'text-charcoal-500 dark:text-charcoal-400'
                )}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell.day || !cell.lunar) {
                return <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-xl bg-ivory-50/40 dark:bg-charcoal-900/20" />;
              }

              const isToday =
                cell.day === today.getDate() &&
                viewMonth === today.getMonth() + 1 &&
                viewYear === today.getFullYear();
              const isSelected = cell.day === selectedDay;
              const hasReminders = (cell.dayReminders?.length || 0) > 0;
              const hasGio = cell.dayReminders?.some((r) => r.type === 'gio');

              return (
                <button
                  key={cell.day}
                  type="button"
                  onClick={() => setSelectedDay(cell.day!)}
                  className={cn(
                    'relative h-14 sm:h-20 p-1 sm:p-2 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer select-none overflow-hidden',
                    isSelected
                      ? 'bg-saffron-600 text-white border-saffron-600 shadow-md scale-[1.02] z-10'
                      : isToday
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-charcoal-900 dark:text-charcoal-100 ring-1 ring-amber-400'
                      : hasReminders
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-charcoal-900 dark:text-charcoal-100'
                      : cell.lunar.isMainTraiDay
                      ? 'bg-saffron-50/60 dark:bg-charcoal-900 border-saffron-200 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100'
                      : 'bg-white dark:bg-charcoal-900/60 border-ivory-200 dark:border-charcoal-700 hover:border-saffron-300 text-charcoal-800 dark:text-charcoal-200'
                  )}
                >
                  {/* Top Row: Solar Day + Indicator Dots */}
                  <div className="w-full flex items-start justify-between">
                    <span
                      className={cn(
                        'font-heading font-bold text-xs sm:text-base leading-none whitespace-nowrap',
                        isSelected
                          ? 'text-white'
                          : isToday
                          ? 'text-saffron-700 dark:text-saffron-300'
                          : 'text-charcoal-900 dark:text-charcoal-100'
                      )}
                    >
                      {cell.day}
                    </span>

                    <div className="flex items-center gap-0.5">
                      {hasReminders && (
                        <span
                          className={cn(
                            'text-[10px] leading-none',
                            isSelected ? 'text-amber-200' : 'text-rose-600'
                          )}
                          title="Có ngày giỗ / lời nhắc"
                        >
                          {hasGio ? '🕯️' : '⭐'}
                        </span>
                      )}
                      {!hasReminders && cell.lunar.isMainTraiDay && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-amber-200' : 'bg-saffron-500'
                          )}
                          title="Ngày Sóc Vọng (Mùng 1 / Rằm)"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Lunar Day/Month */}
                  <div className="w-full flex items-end justify-between">
                    <span
                      className={cn(
                        'text-[9.5px] sm:text-[11px] font-medium leading-none whitespace-nowrap',
                        isSelected
                          ? 'text-amber-100'
                          : cell.lunar.isMainTraiDay
                          ? 'text-saffron-700 dark:text-saffron-400 font-bold'
                          : 'text-charcoal-400 dark:text-charcoal-500'
                      )}
                    >
                      {cell.lunar.lunarDay === 1 || cell.day === 1
                        ? `${cell.lunar.lunarDay}/${cell.lunar.lunarMonth} ÂL`
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

          {/* Legend */}
          <div className="pt-3 border-t border-ivory-100 dark:border-charcoal-700 flex flex-wrap items-center gap-3 text-[11px] text-charcoal-500 dark:text-charcoal-400">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-saffron-500" /> Ngày Trai (Mùng 1, Rằm)
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ngày Hoàng Đạo
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span>🕯️</span> Ngày Giỗ / Kỵ Nhật
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span>⭐</span> Ngày Quan Trọng Của Bạn
            </span>
          </div>
        </div>

        {/* RIGHT: Selected Date Details + Personal Reminders Manager */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Selected Day Sheet */}
          <div className="bg-gradient-to-br from-charcoal-900 via-stone-900 to-charcoal-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider block whitespace-nowrap">
                  Chi Tiết Ngày Đang Chọn
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
                  Ngày {selectedDay} tháng {viewMonth} năm {viewYear}
                </h2>
              </div>
              <div className="px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-right shrink-0">
                <div className="text-[10px] text-amber-200 uppercase whitespace-nowrap">Âm Lịch</div>
                <div className="font-heading font-extrabold text-sm sm:text-base text-amber-300 whitespace-nowrap">
                  {selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} ({selectedLunarInfo.yearCanChi})
                </div>
              </div>
            </div>

            {/* Can Chi & Hoang Dao Status */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block whitespace-nowrap">Can Chi Ngày / Tháng</span>
                <span className="font-semibold text-amber-100 mt-0.5 block whitespace-nowrap truncate">
                  Ngày {selectedLunarInfo.dayCanChi} • Tháng {selectedLunarInfo.monthCanChi}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-stone-400 block whitespace-nowrap">Trực / Sao Hoàng Đạo</span>
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
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 space-y-1">
                {selectedLunarInfo.buddhistEvent && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <BuddhaBodhiIcon className="w-4 h-4 shrink-0" />
                    <span>{selectedLunarInfo.buddhistEvent}</span>
                  </div>
                )}
                {selectedLunarInfo.isTraiDay && (
                  <div className="text-[11px] text-amber-100/90">
                    🪷 Ngày Trai Giới (Mùng {selectedLunarInfo.lunarDay} Âm lịch): Khuyến tấn ăn chay, niệm Phật, phóng sinh làm lành.
                  </div>
                )}
              </div>
            )}

            {/* Good Hours */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Giờ Hoàng Đạo (Giờ Tốt) trong ngày:
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
                  📌 Ghi chú / Ngày giỗ của bạn trong ngày này:
                </span>
                {selectedDayReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{rem.type === 'gio' ? '🕯️' : rem.type === 'trai_gioi' ? '🪷' : '⭐'}</span>
                        <span className="truncate">{rem.title}</span>
                      </div>
                      {rem.note && <p className="text-[11px] text-stone-200 mt-1">{rem.note}</p>}
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

            {/* Quick Button to Add Note for Selected Date */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddingNote(true)}
              className="w-full text-xs font-bold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1.5 shrink-0" />
              <span>
                Ghi chú Ngày Giỗ / Việc Quan Trọng vào ngày {selectedDay}/{viewMonth} ({selectedLunarInfo.lunarDay}/
                {selectedLunarInfo.lunarMonth} ÂL)
              </span>
            </Button>
          </div>

          {/* Card 2: Form to Add Personal Reminder (when open) */}
          {isAddingNote && (
            <form
              onSubmit={handleAddReminder}
              className="bg-white dark:bg-charcoal-800 rounded-3xl border-2 border-saffron-400 dark:border-saffron-600 p-5 space-y-4 shadow-lg animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
                  Đặt Lịch Nhắc Nhở ({selectedDay}/{viewMonth} — {selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} ÂL)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="text-xs text-charcoal-400 hover:text-charcoal-700"
                >
                  Đóng
                </button>
              </div>

              {/* Type Selector */}
              <div className="grid grid-cols-3 gap-2">
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
                      'py-2 px-2 rounded-xl text-xs font-bold border text-center whitespace-nowrap transition-all cursor-pointer',
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
                  placeholder="Ví dụ: Ngày giỗ Ông Nội, Sinh nhật Mẹ, Cúng Rằm..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-ivory-50 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:border-saffron-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 block">
                  Chế độ lặp lại hằng năm
                </label>
                <select
                  value={repeatType}
                  onChange={(e) => setRepeatType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-ivory-50 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 text-charcoal-900 dark:text-charcoal-100"
                >
                  <option value="lunar_yearly">
                    Lặp lại hằng năm theo Âm lịch ({selectedLunarInfo.lunarDay}/{selectedLunarInfo.lunarMonth} ÂL — Khuyên dùng cho Ngày Giỗ)
                  </option>
                  <option value="solar_yearly">
                    Lặp lại hằng năm theo Dương lịch ({selectedDay}/{viewMonth} DL)
                  </option>
                  <option value="once">Chỉ nhắc một lần vào ngày {selectedDateStr}</option>
                </select>
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

              <Button type="submit" variant="primary" size="md" className="w-full text-xs font-bold">
                Lưu Vào Lịch Nhắc Nhở
              </Button>
            </form>
          )}

          {/* Card 3: All Saved Personal Reminders List */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-saffron-600" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
                  Sổ Ghi Nhớ Ngày Giỗ & Sự Kiện ({reminders.length})
                </h3>
              </div>
              {user && (
                <span className="text-[11px] text-saffron-700 dark:text-saffron-400 font-semibold whitespace-nowrap">
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
                  Hãy bấm vào một ngày trên lịch rồi chọn &ldquo;Ghi chú Ngày Giỗ / Việc Quan Trọng&rdquo; để lưu lại vĩnh viễn.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-2xl bg-ivory-50/90 dark:bg-charcoal-900/70 border border-ivory-200 dark:border-charcoal-700 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-charcoal-900 dark:text-charcoal-100">
                          {rem.type === 'gio' ? '🕯️' : rem.type === 'trai_gioi' ? '🪷' : '⭐'} {rem.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-950 text-saffron-800 dark:text-saffron-300 text-[10px] font-bold whitespace-nowrap">
                          {rem.repeatType === 'lunar_yearly'
                            ? `${rem.lunarDay}/${rem.lunarMonth} Âm lịch hằng năm`
                            : rem.repeatType === 'solar_yearly'
                            ? `${rem.solarDate.slice(5)} Dương lịch hằng năm`
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
        </div>
      </div>
    </div>
  );
}

