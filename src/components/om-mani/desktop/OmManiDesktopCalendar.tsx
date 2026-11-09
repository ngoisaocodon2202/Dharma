'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Calendar as CalendarIcon,
  Clock,
  Check,
  X,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  AlmsBowlIcon,
  LotusMinimalIcon,
  TempleBellIcon,
  BodhiLeafIcon,
  PagodaMinimalIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';
import {
  BuddhistEventItem,
  PersonalReminder,
  CalendarFilterMode,
  VegetarianMealPlan,
} from '@/app/lich-phat-giao/page';

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
  filterMode: CalendarFilterMode;
  onChangeFilterMode: (mode: CalendarFilterMode) => void;
  selectedMealPlan: VegetarianMealPlan;
  hasRecordedVowToday: boolean;
  onRecordTraiDayVow: () => void;
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
  filterMode,
  onChangeFilterMode,
  selectedMealPlan,
  hasRecordedVowToday,
  onRecordTraiDayVow,
}: OmManiDesktopCalendarProps) {
  const selectedDayEvent = currentMonthEvents.find((e) => {
    const parts = e.solarDate.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    return day === selectedDay && month === viewMonth;
  });

  const selectedCell = calendarCells.find(
    (c) => c.isCurrentMonth && c.solarDay === selectedDay
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP BAR: TITLE, MONTH NAVIGATOR & ACTION BUTTONS                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-[#F5C542]/25">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#181207] flex items-center justify-center">
              <DharmaWheelIcon className="w-6 h-6 text-[#FFD966]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/35 text-[10px] font-bold uppercase tracking-widest text-[#FFD966]">
                DHARMA CALENDAR
              </span>
              <span className="text-xs text-[#C7B68B]">
                Âm Dương Đối Chiếu • Lục Trai &amp; Thập Trai
              </span>
            </div>
            <h1 className="font-heading font-serif text-2xl font-bold text-[#FFFDF7] mt-1">
              Lịch Pháp Bảo &amp; Trợ Lý Trai Giới
            </h1>
          </div>
        </div>

        {/* Center: Month Selector & Quick Today Jump */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#241B0B] border border-[#F5C542]/35 rounded-2xl p-1 shadow-md">
            <button
              type="button"
              onClick={onPrevMonth}
              className="p-2 hover:bg-[#2E220E] rounded-xl text-[#D6C394] hover:text-[#FFFDF7] transition-colors cursor-pointer"
              title="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-heading font-serif font-bold text-sm sm:text-base text-[#FFD966] px-4 min-w-[155px] text-center">
              Tháng {viewMonth} • {viewYear}
            </div>
            <button
              type="button"
              onClick={onNextMonth}
              className="p-2 hover:bg-[#2E220E] rounded-xl text-[#D6C394] hover:text-[#FFFDF7] transition-colors cursor-pointer"
              title="Tháng kế tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onJumpToday}
            className="px-3.5 py-2.5 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#F5C542]/60 text-[#F3E3B2] hover:text-[#FFFDF7] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Về Hôm Nay
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleReminder}
            className={cn(
              'px-3.5 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
              isReminderEnabled
                ? 'bg-[#F5C542]/20 border-[#F5C542]/50 text-[#FFD966]'
                : 'bg-[#241B0B] border-white/10 text-[#C7B68B] hover:text-[#FFFDF7]'
            )}
          >
            <TempleBellIcon className="w-4 h-4" />
            <span>{isReminderEnabled ? 'Chuông Báo Trai: Bật' : 'Chuông Báo Trai: Tắt'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddReminder}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#E5A91C] text-[#181207] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Lịch Nhắc Tu Tập</span>
          </button>

          <button
            type="button"
            onClick={onOpenYearEvents}
            className="px-4 py-2.5 rounded-2xl bg-[#241B0B] border border-[#F5C542]/40 hover:border-[#FFD966] text-[#FFD966] hover:text-[#FFFDF7] text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Niên Biểu Phật Sự
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEGMENTED FILTER BAR & TODAY TRAI VOW BANNER                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* 3-Mode Segmented Control */}
        <div className="col-span-12 lg:col-span-6 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25">
          {[
            { id: 'all', label: 'Tất Cả Ngày Âm Dương', icon: CalendarIcon },
            { id: 'trai_gioi', label: 'Lịch Trai Giới (Ăn Chay)', icon: AlmsBowlIcon },
            { id: 'via_phat', label: 'Đại Lễ & Vía Phật', icon: LotusMinimalIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = filterMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeFilterMode(tab.id as CalendarFilterMode)}
                className={cn(
                  'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                  active
                    ? 'bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#E5A91C] text-[#181207] shadow-md'
                    : 'text-[#D6C394] hover:text-[#FFFDF7] hover:bg-[#2E220E]/60'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Trai Giới Vow Record Card */}
        <div className="col-span-12 lg:col-span-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#241B0B] via-[#2E220E] to-[#241B0B] border border-[#F5C542]/35 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] shrink-0">
              <AlmsBowlIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966] block">
                Phát Nguyện Trai Giới Hôm Nay (30/09 Âm Lịch)
              </span>
              <p className="text-xs text-[#F3E3B2] truncate mt-0.5">
                Ngày Thập Trai &amp; Vía Đức Phật Dược Sư • Giữ tâm từ bi, ăn chay thanh tịnh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRecordTraiDayVow}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer',
              hasRecordedVowToday
                ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                : 'bg-[#F5C542]/20 hover:bg-[#F5C542] text-[#FFD966] hover:text-[#181207] border border-[#F5C542]/50'
            )}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{hasRecordedVowToday ? 'Đã Thọ Trai Hôm Nay' : 'Ghi Nhận Thọ Trai'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN LAYOUT (7 COLS CALENDAR GRID & 5 COLS INSPECTOR)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Calendar Grid (7 cols) */}
        <div className="col-span-12 xl:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#241B0B] border border-[#F5C542]/30 shadow-xl space-y-4">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-2 pb-3 border-b border-[#F5C542]/15 text-center">
              {DESKTOP_WEEKDAYS.map((wd) => (
                <div
                  key={wd.label}
                  className={cn(
                    'text-xs font-bold uppercase tracking-wider',
                    wd.isSunday ? 'text-amber-300 font-black' : 'text-[#C7B68B]'
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

                const isDimmedByFilter =
                  cell.isCurrentMonth &&
                  ((filterMode === 'trai_gioi' && !cell.hasGreenDot) ||
                    (filterMode === 'via_phat' && !cell.hasAmberDot));

                return (
                  <button
                    key={`${cell.solarMonth}-${cell.solarDay}-${idx}`}
                    type="button"
                    onClick={() => onSelectDay(cell)}
                    className={cn(
                      'min-h-[84px] p-2.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 relative group cursor-pointer border',
                      cell.isCurrentMonth
                        ? isSelectedCell
                          ? 'bg-gradient-to-b from-[#F5C542] via-[#FFD966] to-[#E5A91C] text-[#181207] border-[#FFF3B0] shadow-[0_6px_22px_rgba(245,197,66,0.35)] ring-2 ring-[#FFD966]/70'
                          : isDimmedByFilter
                          ? 'bg-[#181207]/50 border-white/5 text-[#C7B68B]/40 opacity-50'
                          : 'bg-[#181207]/90 hover:bg-[#2E220E] border-[#F5C542]/15 hover:border-[#F5C542]/50 text-[#FFFDF7]'
                        : 'bg-[#120D05]/60 border-white/5 text-[#C7B68B]/30 hover:text-[#C7B68B]/60'
                    )}
                  >
                    {/* Top Row: Solar Day + Dot Indicators */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={cn(
                          'text-sm sm:text-base font-bold font-mono',
                          isSelectedCell
                            ? 'text-[#181207] font-black'
                            : cell.isSunday && cell.isCurrentMonth
                            ? 'text-[#FFD966]'
                            : cell.isCurrentMonth
                            ? 'text-[#FFFDF7]'
                            : 'text-[#C7B68B]/35'
                        )}
                      >
                        {String(cell.solarDay).padStart(2, '0')}
                      </span>

                      {/* Dots */}
                      <div className="flex items-center gap-1">
                        {cell.hasGreenDot && (
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full',
                              isSelectedCell
                                ? 'bg-[#181207]'
                                : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)]'
                            )}
                            title="Ngày Trai Giới (Ăn chay)"
                          />
                        )}
                        {cell.hasAmberDot && (
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full',
                              isSelectedCell
                                ? 'bg-[#181207]'
                                : 'bg-[#FFD966] shadow-[0_0_8px_rgba(255,217,102,0.9)]'
                            )}
                            title="Ngày Vía Phật & Đại Lễ"
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Lunar Day & Label */}
                    <div className="flex items-end justify-between w-full pt-2">
                      <span
                        className={cn(
                          'text-[11px] font-mono font-semibold',
                          isSelectedCell
                            ? 'text-[#181207] font-bold'
                            : cell.isCurrentMonth
                            ? 'text-[#F3E3B2]/85'
                            : 'text-[#C7B68B]/30'
                        )}
                      >
                        {cell.lunarDisplay}
                      </span>

                      {cell.solarDay === 8 && cell.isCurrentMonth && (
                        <span
                          className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded font-bold uppercase',
                            isSelectedCell
                              ? 'bg-[#181207]/20 text-[#181207]'
                              : 'bg-[#F5C542]/20 text-[#FFD966] border border-[#F5C542]/35'
                          )}
                        >
                          Nay
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend Footer */}
            <div className="pt-4 border-t border-[#F5C542]/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#D6C394]">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                  <span>Ngày Trai Giới (Thập Trai)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD966] shadow-sm" />
                  <span>Vía Chư Phật &amp; Bồ Tát</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#FFD966]/80">
                Chọn ngày bất kỳ để xem Thực Đơn Chay &amp; Giờ Hoàng Đạo
              </span>
            </div>
          </div>

          {/* Cẩm Nang Trai Giới & Thực Đơn Chay Dưỡng Sinh (Original Dharma Feature) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#241B0B] via-[#2E220E] to-[#181207] border border-[#F5C542]/35 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966]">
                  <AlmsBowlIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-serif font-bold text-base text-[#FFD966]">
                    Thực Đơn Chay Dưỡng Sinh &amp; Ý Nghĩa Trai Giới
                  </h3>
                  <p className="text-xs text-[#C7B68B]">
                    Gợi ý ẩm thực thanh tịnh cho ngày {selectedDay}/{viewMonth} (Âm lịch: {selectedDateLunarInfo.lunarDay}/{selectedDateLunarInfo.lunarMonth})
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/35 text-[11px] font-bold text-[#FFD966]">
                {selectedCell?.hasGreenDot ? 'Ngày Thập Trai Khuyến Tu' : 'Chánh Niệm Thường Nhật'}
              </span>
            </div>

            <p className="text-xs text-[#F3E3B2] leading-relaxed bg-[#181207]/60 p-3.5 rounded-2xl border border-[#F5C542]/15">
              {selectedMealPlan.traiMeaning}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966]">
                  Điểm Tâm Sáng
                </span>
                <p className="font-heading font-serif font-bold text-sm text-[#FFFDF7]">
                  {selectedMealPlan.breakfast}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966]">
                  Ngọ Trai (Bữa Trưa)
                </span>
                <p className="font-heading font-serif font-bold text-sm text-[#FFFDF7]">
                  {selectedMealPlan.lunch}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966]">
                  Dược Thất (Bữa Chiều)
                </span>
                <p className="font-heading font-serif font-bold text-sm text-[#FFFDF7]">
                  {selectedMealPlan.dinner}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-[#C7B68B]">
              <span>Trà thiền khuyên dùng: <strong className="text-[#FFD966]">{selectedMealPlan.tea}</strong></span>
              <span className="italic">“Ngũ quán tưởng trước khi thọ thực để nuôi dưỡng lòng biết ơn”</span>
            </div>
          </div>
        </div>

        {/* Right Column: Date Inspector & Monthly Events List (5 cols) */}
        <div className="col-span-12 xl:col-span-5 space-y-6">
          {/* Selected Date Inspector Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#241B0B] via-[#2E220E] to-[#181207] border border-[#F5C542]/35 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-2">
                <LotusMinimalIcon className="w-4 h-4 text-[#FFD966]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                  Thông Tin Âm Lịch &amp; Can Chi
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F5C542]/20 text-[#FFD966] border border-[#F5C542]/35">
                {String(selectedDay).padStart(2, '0')}/{String(viewMonth).padStart(2, '0')}/{viewYear}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-heading font-serif text-lg font-bold text-[#FFFDF7]">
                  Ngày {selectedDay} tháng {viewMonth} năm {viewYear}
                </h4>
                <p className="text-xs text-[#FFD966] font-medium mt-1">
                  Âm lịch: Ngày {selectedDateLunarInfo.lunarDay} tháng {selectedDateLunarInfo.lunarMonth} năm {selectedDateLunarInfo.yearCanChi}
                </p>
              </div>

              {/* Can Chi Details Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-0.5">
                  <span className="text-[10px] text-[#C7B68B] uppercase tracking-wider">
                    Can Chi Ngày
                  </span>
                  <p className="font-bold text-[#FFFDF7]">
                    {selectedDateLunarInfo.dayCanChi}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-0.5">
                  <span className="text-[10px] text-[#C7B68B] uppercase tracking-wider">
                    Tiết Khí
                  </span>
                  <p className="font-bold text-[#FFFDF7]">
                    {selectedDateLunarInfo.tietKhi}
                  </p>
                </div>
              </div>

              {/* Giờ Hoàng Đạo */}
              <div className="p-3.5 rounded-2xl bg-[#181207]/80 border border-[#F5C542]/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD966]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Giờ Cát Tường Hành Trì &amp; Lễ Bái:</span>
                </div>
                <p className="text-xs text-[#F3E3B2] leading-relaxed">
                  {selectedDateLunarInfo.gioHoangDao}
                </p>
              </div>

              {/* If event today */}
              {selectedDayEvent && (
                <div
                  onClick={() => onSelectEvent(selectedDayEvent)}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-[#33250E] to-[#241B0B] border border-[#F5C542]/50 flex items-center gap-3 cursor-pointer group hover:border-[#FFD966] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#F5C542]/30">
                    <img
                      src={selectedDayEvent.image}
                      alt={selectedDayEvent.fullTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#FFD966] uppercase tracking-wider">
                      Sự Kiện Phật Sự Trong Ngày
                    </span>
                    <h5 className="font-heading font-serif font-bold text-xs text-[#FFFDF7] truncate group-hover:text-[#FFD966]">
                      {selectedDayEvent.fullTitle}
                    </h5>
                    <p className="text-[11px] text-[#D6C394] truncate">
                      Xem nghi thức hành trì &amp; ý nghĩa →
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAddReminder}
                className="w-full py-2.5 rounded-xl bg-[#181207] border border-[#F5C542]/40 hover:border-[#FFD966] text-[#FFD966] hover:text-[#FFFDF7] font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Đặt Nhắc Nhở Hành Trì Ngày Này</span>
              </button>
            </div>
          </div>

          {/* Monthly Events List Card */}
          <div className="p-6 rounded-3xl bg-[#241B0B] border border-[#F5C542]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/15">
              <div className="flex items-center gap-2">
                <PagodaMinimalIcon className="w-4 h-4 text-[#FFD966]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                  Sự Kiện Phật Sự Tháng {viewMonth}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#D6C394]">
                {currentMonthEvents.length} ngày lễ
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {currentMonthEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="p-3 rounded-2xl bg-[#181207]/90 border border-[#F5C542]/15 hover:border-[#F5C542]/50 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#F5C542]/25">
                      <img
                        src={ev.image}
                        alt={ev.fullTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-heading font-serif font-bold text-xs text-[#FFFDF7] group-hover:text-[#FFD966] truncate">
                        {ev.title}
                      </h5>
                      <p className="text-[11px] text-[#C7B68B] truncate mt-0.5">
                        {ev.dayOfWeek}, {ev.solarDate} • Âm lịch {ev.lunarDate}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C7B68B] group-hover:text-[#FFD966] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Personal Reminders if any */}
          {reminders.length > 0 && (
            <div className="p-5 rounded-3xl bg-[#241B0B] border border-[#F5C542]/25 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-serif font-bold text-xs uppercase tracking-wider text-[#FFD966]">
                  Lời Nhắc Cá Nhân ({reminders.length})
                </h4>
              </div>
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-2xl bg-[#181207] border border-[#F5C542]/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#FFFDF7] block">{rem.title}</span>
                      <span className="text-[#C7B68B] mt-0.5 block">
                        {rem.solarDate} {rem.lunarDateStr && `(Âm: ${rem.lunarDateStr})`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteReminder(rem.id)}
                      className="text-[#C7B68B] hover:text-red-400 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
