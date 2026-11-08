'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Heart,
  Flame,
  Check,
  X,
  Share2,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';
import { BuddhistEventItem, PersonalReminder } from '@/app/lich-phat-giao/page';

export interface CalendarCell {
  solarDay: number;
  isCurrentMonth: boolean;
  solarMonth: number;
  solarYear: number;
  isSunday: boolean;
  lunarDay: number;
  lunarMonth: number;
  lunarDisplay: string;
  hasGreenDot: boolean;
  hasAmberDot: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface OmManiDesktopCalendarProps {
  viewYear: number;
  viewMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday: () => void;
  calendarCells: CalendarCell[];
  selectedDay: number;
  onSelectDay: (cell: CalendarCell) => void;
  selectedDateLunarInfo: any;
  currentMonthEvents: BuddhistEventItem[];
  reminders: PersonalReminder[];
  onOpenAddReminder: () => void;
  onOpenYearEvents: () => void;
  onSelectEvent: (event: BuddhistEventItem) => void;
  onDeleteReminder: (id: string) => void;
  isReminderEnabled: boolean;
  onToggleReminder: () => void;
}

const DESKTOP_WEEKDAYS = [
  { label: 'Thứ Hai', isSunday: false },
  { label: 'Thứ Ba', isSunday: false },
  { label: 'Thứ Tư', isSunday: false },
  { label: 'Thứ Năm', isSunday: false },
  { label: 'Thứ Sáu', isSunday: false },
  { label: 'Thứ Bảy', isSunday: false },
  { label: 'Chủ Nhật', isSunday: true },
];

export function OmManiDesktopCalendar({
  viewYear,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
  calendarCells,
  selectedDay,
  onSelectDay,
  selectedDateLunarInfo,
  currentMonthEvents,
  reminders,
  onOpenAddReminder,
  onOpenYearEvents,
  onSelectEvent,
  onDeleteReminder,
  isReminderEnabled,
  onToggleReminder,
}: OmManiDesktopCalendarProps) {
  // Find event happening on selected day
  const selectedDayEvent = currentMonthEvents.find((e) => {
    const parts = e.solarDate.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    return day === selectedDay && month === viewMonth;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP BAR: TITLE, MONTH NAVIGATOR & ACTION BUTTONS                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1F140D] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[#FFE082]" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-serif text-2xl font-black text-white flex items-center gap-2.5">
              <span>Lịch Vạn Niên &amp; Ngày Lễ Phật Giáo</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Lịch âm dương chính xác, ngày vía chư Phật, ngày trai giới và giờ hoàng đạo
            </p>
          </div>
        </div>

        {/* Center: Month Selector & Quick Today Jump */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#1C140E] border border-amber-500/30 rounded-2xl p-1 shadow-md">
            <button
              type="button"
              onClick={onPrevMonth}
              className="p-2 hover:bg-[#2A1D15] rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-heading font-serif font-bold text-sm sm:text-base text-amber-200 px-4 min-w-[150px] text-center">
              Tháng {viewMonth} - {viewYear}
            </div>
            <button
              type="button"
              onClick={onNextMonth}
              className="p-2 hover:bg-[#2A1D15] rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Tháng kế tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onJumpToday}
            className="px-3.5 py-2 rounded-2xl bg-[#1C140E] border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Hôm nay
          </button>
        </div>

        {/* Right Actions: Add Reminder & Year Events Modal */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleReminder}
            className={cn(
              'px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
              isReminderEnabled
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-[#1C140E] border-white/10 text-stone-400 hover:text-stone-200'
            )}
            title="Bật/Tắt nhắc nhở âm lịch"
          >
            <Bell className={cn('w-3.5 h-3.5', isReminderEnabled && 'fill-current')} />
            <span>{isReminderEnabled ? 'Thông Báo: Bật' : 'Thông Báo: Tắt'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddReminder}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Lời Nhắc</span>
          </button>

          <button
            type="button"
            onClick={onOpenYearEvents}
            className="px-4 py-2 rounded-2xl bg-[#1C140E] border border-amber-500/40 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Sự Kiện Trong Năm
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN LAYOUT (7 COLS CALENDAR GRID & 5 COLS INSPECTOR)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Calendar Grid (7 cols) */}
        <div className="col-span-12 xl:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-4">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-2 pb-3 border-b border-amber-500/15 text-center">
              {DESKTOP_WEEKDAYS.map((wd) => (
                <div
                  key={wd.label}
                  className={cn(
                    'text-xs font-bold uppercase tracking-wider',
                    wd.isSunday ? 'text-red-400 font-black' : 'text-stone-400'
                  )}
                >
                  {wd.label}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, idx) => {
                const isSelectedCell =
                  cell.isCurrentMonth && cell.solarDay === selectedDay;

                return (
                  <button
                    key={`${cell.solarMonth}-${cell.solarDay}-${idx}`}
                    type="button"
                    onClick={() => onSelectDay(cell)}
                    className={cn(
                      'min-h-[82px] p-2.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 relative group cursor-pointer border',
                      cell.isCurrentMonth
                        ? isSelectedCell
                          ? 'bg-gradient-to-b from-[#A8581E] to-[#6E320A] text-white border-amber-300 shadow-xl ring-2 ring-amber-400/60'
                          : 'bg-[#20150E] hover:bg-[#2B1C13] border-stone-800/80 hover:border-amber-500/40 text-stone-200'
                        : 'bg-[#140E0A]/60 border-stone-900/60 text-stone-600 hover:text-stone-400'
                    )}
                  >
                    {/* Top Row: Solar Day + Dot Indicators */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={cn(
                          'text-sm sm:text-base font-bold font-mono',
                          cell.isSunday && cell.isCurrentMonth && !isSelectedCell
                            ? 'text-red-400'
                            : isSelectedCell
                            ? 'text-white'
                            : 'text-stone-200'
                        )}
                      >
                        {String(cell.solarDay).padStart(2, '0')}
                      </span>

                      {/* Dots */}
                      <div className="flex items-center gap-1">
                        {cell.hasGreenDot && (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                            title="Ngày trai giới"
                          />
                        )}
                        {cell.hasAmberDot && (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] animate-pulse"
                            title="Ngày lễ / Vía Phật"
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Lunar Day & Label */}
                    <div className="flex items-end justify-between w-full pt-2">
                      <span
                        className={cn(
                          'text-[11px] font-mono font-medium',
                          isSelectedCell
                            ? 'text-amber-100 font-bold'
                            : cell.isCurrentMonth
                            ? 'text-amber-300/80'
                            : 'text-stone-600'
                        )}
                      >
                        {cell.lunarDisplay}
                      </span>

                      {cell.solarDay === 8 && cell.isCurrentMonth && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend Footer */}
            <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                  <span>Ngày Trai Giới (Ăn chay)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                  <span>Ngày Vía Phật &amp; Đại Lễ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
                  <span>Chủ Nhật</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-amber-300/70">
                Nhấn vào ngày để xem chi tiết âm lịch
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Date Inspector & Monthly Events List (5 cols) */}
        <div className="col-span-12 xl:col-span-5 space-y-6">
          {/* Selected Date Inspector Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E140D] via-[#241710] to-[#170E09] border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Chi Tiết Ngày Đã Chọn
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {String(selectedDay).padStart(2, '0')}/{String(viewMonth).padStart(2, '0')}/{viewYear}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-heading font-serif text-lg font-bold text-white">
                  Chủ Nhật, ngày {selectedDay} tháng {viewMonth} năm {viewYear}
                </h4>
                <p className="text-xs text-amber-200 mt-1">
                  Âm lịch: Ngày {selectedDateLunarInfo.lunarDay} tháng {selectedDateLunarInfo.lunarMonth} năm {selectedDateLunarInfo.yearCanChi}
                </p>
              </div>

              {/* Can Chi Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    Can Chi Ngày
                  </span>
                  <p className="font-bold text-stone-200">
                    {selectedDateLunarInfo.dayCanChi}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    Tiết Khí
                  </span>
                  <p className="font-bold text-stone-200">
                    {selectedDateLunarInfo.tietKhi}
                  </p>
                </div>
              </div>

              {/* Giờ Hoàng Đạo */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Giờ Hoàng Đạo Cát Tường:</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedDateLunarInfo.gioHoangDao}
                </p>
              </div>

              {/* If event today */}
              {selectedDayEvent && (
                <div
                  onClick={() => onSelectEvent(selectedDayEvent)}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-[#381F10] to-[#25140A] border border-amber-500/40 flex items-center gap-3 cursor-pointer group hover:border-amber-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={selectedDayEvent.image}
                      alt={selectedDayEvent.fullTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      Đại Lễ Phật Giáo
                    </span>
                    <h5 className="font-heading font-serif font-bold text-xs text-white truncate group-hover:text-amber-200">
                      {selectedDayEvent.fullTitle}
                    </h5>
                    <p className="text-[11px] text-stone-400 truncate">
                      Nhấn để xem chi tiết ý nghĩa &amp; nghi thức →
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAddReminder}
                className="w-full py-2.5 rounded-xl bg-[#20150E] border border-amber-500/40 hover:border-amber-300 text-amber-200 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Nhắc Nhở Cho Ngày Này</span>
              </button>
            </div>
          </div>

          {/* Monthly Events List Card */}
          <div className="p-6 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                Các Sự Kiện Trong Tháng {viewMonth}
              </h3>
              <span className="text-xs text-stone-400">
                {currentMonthEvents.length} sự kiện
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {currentMonthEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="p-3 rounded-2xl bg-[#20150E] border border-stone-800/80 hover:border-amber-500/40 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/5">
                      <img
                        src={ev.image}
                        alt={ev.fullTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-heading font-serif font-bold text-xs text-white group-hover:text-amber-200 truncate">
                        {ev.title}
                      </h5>
                      <p className="text-[11px] text-stone-400 truncate">
                        {ev.dayOfWeek}, {ev.solarDate} · Âm {ev.lunarDate}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

