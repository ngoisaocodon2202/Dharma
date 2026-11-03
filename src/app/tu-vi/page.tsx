'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Palette,
  Calendar,
  Compass,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sun,
  Shield,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { useAuth } from '@/components/auth/AuthContext';
import { calculateCanChiAndMenh } from '@/lib/tu-vi-calc';
import { getLunarDate, NGU_HANH_COLOR_MAP } from '@/lib/lunar-calendar';
import { cn } from '@/lib/utils';

export default function LuckyColorAndGoodDayPage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);

  // User birth info for Color & Element calculation
  const [birthYear, setBirthYear] = useState<number>(1996);
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');

  // Selected date for Good Day (Ngày Tốt) lookup
  const [checkYear, setCheckYear] = useState<number>(today.getFullYear());
  const [checkMonth, setCheckMonth] = useState<number>(today.getMonth() + 1);
  const [checkDay, setCheckDay] = useState<number>(today.getDate());

  useEffect(() => {
    if (user?.gender) {
      setGender(user.gender);
    }
  }, [user]);

  // Calculate User's Can Chi, Menh & Color Profile
  const canChiInfo = useMemo(() => {
    return calculateCanChiAndMenh(birthYear, gender, today.getFullYear());
  }, [birthYear, gender, today]);

  const colorProfile = useMemo(() => {
    return NGU_HANH_COLOR_MAP[canChiInfo.nguHanh] || NGU_HANH_COLOR_MAP.Kim;
  }, [canChiInfo]);

  // Calculate Selected Day's Lunar & Hoang Dao Info
  const selectedDayInfo = useMemo(() => {
    return getLunarDate(checkYear, checkMonth, checkDay);
  }, [checkYear, checkMonth, checkDay]);

  // List all Hoang Dao (Good Days) in the selected month
  const goodDaysInMonth = useMemo(() => {
    const totalDays = new Date(checkYear, checkMonth, 0).getDate();
    const list: { day: number; lunarDay: number; lunarMonth: number; dayCanChi: string; star: string }[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const info = getLunarDate(checkYear, checkMonth, d);
      if (info.isHoangDao) {
        list.push({
          day: d,
          lunarDay: info.lunarDay,
          lunarMonth: info.lunarMonth,
          dayCanChi: info.dayCanChi,
          star: info.hoangDaoStar.replace(' Hoàng Đạo', ''),
        });
      }
    }
    return list;
  }, [checkYear, checkMonth]);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
      {/* 1. Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-950 via-stone-900 to-amber-950 text-white p-5 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold whitespace-nowrap">
            <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Năng Lượng Ngũ Hành • Màu Chủ Đạo & Cát Nhật</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-amber-50 leading-tight">
            Xem Màu Chủ Đạo Bản Mệnh & Ngày Tốt Hoàng Đạo
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Khám phá màu sắc chủ đạo tương sinh theo Ngũ hành Nạp âm của bạn và tra cứu Ngày tốt, Giờ Hoàng Đạo,
            Hướng xuất hành cát tường để khởi sự hanh thông, tâm an vạn sự lành.
          </p>
        </div>
      </div>

      {/* 2. SECTION A: XEM MÀU CHỦ ĐẠO & BẢN MỆNH NGƯỜI DÙNG */}
      <section className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-5 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ivory-200 dark:border-charcoal-700 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block whitespace-nowrap">
              Phần 1 • Sắc Màu Hộ Mệnh Của Bạn
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
              Tra Cứu Màu Chủ Đạo & Ngũ Hành Bản Mệnh
            </h2>
          </div>

          {/* Quick Input Controls: Birth Year & Gender */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-ivory-50 dark:bg-charcoal-900 px-3 py-1.5 rounded-xl border border-ivory-200 dark:border-charcoal-700">
              <span className="text-xs font-semibold text-charcoal-500 whitespace-nowrap">Năm sinh:</span>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className="bg-transparent font-heading font-bold text-sm text-saffron-700 dark:text-saffron-400 focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 95 }, (_, i) => 1935 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex rounded-xl bg-ivory-100 dark:bg-charcoal-900 p-1 border border-ivory-200 dark:border-charcoal-700">
              <button
                type="button"
                onClick={() => setGender('Nam')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                  gender === 'Nam'
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'text-charcoal-600 dark:text-charcoal-400'
                )}
              >
                Nam Mạng
              </button>
              <button
                type="button"
                onClick={() => setGender('Nữ')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                  gender === 'Nữ'
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'text-charcoal-600 dark:text-charcoal-400'
                )}
              >
                Nữ Mạng
              </button>
            </div>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
            <span className="text-[11px] font-semibold uppercase text-amber-800 dark:text-amber-300 block whitespace-nowrap">
              Tuổi Can Chi
            </span>
            <p className="font-heading font-bold text-base sm:text-lg text-charcoal-900 dark:text-charcoal-50 mt-0.5 whitespace-nowrap">
              Tuổi {canChiInfo.canChi} ({birthYear})
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-saffron-50/80 dark:bg-saffron-950/30 border border-saffron-200/80 dark:border-saffron-800/60">
            <span className="text-[11px] font-semibold uppercase text-saffron-800 dark:text-saffron-300 block whitespace-nowrap">
              Mệnh Ngũ Hành Nạp Âm
            </span>
            <p className="font-heading font-bold text-base sm:text-lg text-saffron-700 dark:text-saffron-300 mt-0.5 whitespace-nowrap truncate">
              {canChiInfo.menh}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-jade-50/80 dark:bg-jade-950/30 border border-jade-200/80 dark:border-jade-800/60">
            <span className="text-[11px] font-semibold uppercase text-jade-800 dark:text-jade-300 block whitespace-nowrap">
              Cung Phi Bát Trạch ({gender})
            </span>
            <p className="font-heading font-bold text-base sm:text-lg text-jade-800 dark:text-jade-300 mt-0.5 whitespace-nowrap truncate">
              Cung {canChiInfo.cung}
            </p>
          </div>
        </div>

        {/* Color Swatches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary & Support Colors (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Màu Bản Mệnh */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-saffron-600 shrink-0" />
                <span>1. Màu Chủ Đạo Bản Mệnh ({colorProfile.elementTitle})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {colorProfile.primaryColors.map((c) => (
                  <div
                    key={c.name}
                    className="p-3.5 rounded-2xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 flex items-start gap-3"
                  >
                    <div
                      className="w-11 h-11 rounded-xl shrink-0 shadow-sm border border-black/10 dark:border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap truncate">
                        {c.name}
                      </div>
                      <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 leading-snug mt-0.5">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Màu Tương Sinh */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Màu Tương Sinh Đại Cát (Thu Hút Quý Nhân & Bình An)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorProfile.supportColors.map((c) => (
                  <div
                    key={c.name}
                    className="p-3.5 rounded-2xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 flex items-start gap-3"
                  >
                    <div
                      className="w-11 h-11 rounded-xl shrink-0 shadow-sm border border-black/10 dark:border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap truncate">
                        {c.name}
                      </div>
                      <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 leading-snug mt-0.5">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Màu Nên Hạn Chế */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Màu tương khắc nên hạn chế dùng làm màu chủ đạo:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {colorProfile.avoidColors.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-charcoal-900 border border-rose-200 dark:border-rose-800 text-xs font-medium text-charcoal-700 dark:text-charcoal-300 whitespace-nowrap"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 cols: Sacred Items, Directions & Dharma Advice */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 space-y-3 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase text-saffron-700 dark:text-saffron-400 block whitespace-nowrap">
                    Hướng Tốt & Số Cát Tường
                  </span>
                  <p className="text-xs text-charcoal-700 dark:text-charcoal-300">
                    <strong>Hướng hợp:</strong> {colorProfile.luckyDirection}
                  </p>
                  <p className="text-xs text-charcoal-700 dark:text-charcoal-300">
                    <strong>Số may mắn:</strong> {colorProfile.luckyNumbers}
                  </p>
                </div>

                <div className="pt-2 border-t border-ivory-200 dark:border-charcoal-800 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-saffron-700 dark:text-saffron-400 block whitespace-nowrap">
                    Pháp Bảo & Vật Phẩm Hộ Thân Hợp Mệnh
                  </span>
                  <ul className="space-y-1.5 text-xs text-charcoal-700 dark:text-charcoal-300">
                    {colorProfile.sacredItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-saffron-500 mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-charcoal-700 dark:text-charcoal-200 leading-relaxed">
                <strong className="text-saffron-800 dark:text-saffron-300 block mb-1">
                  ☸ Lời khuyên Chánh niệm:
                </strong>
                {colorProfile.dharmaAdvice}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION B: XEM NGÀY TỐT / NGÀY HOÀNG ĐẠO & GIỜ TỐT */}
      <section className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-5 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ivory-200 dark:border-charcoal-700 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-jade-700 dark:text-jade-400 block whitespace-nowrap">
              Phần 2 • Chọn Ngày Lành Tháng Tốt
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
              Xem Ngày Tốt, Giờ Hoàng Đạo & Hướng Xuất Hành
            </h2>
          </div>

          {/* Date Picker Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={checkDay}
              onChange={(e) => setCheckDay(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 text-xs sm:text-sm font-bold text-charcoal-900 dark:text-charcoal-100 cursor-pointer"
            >
              {Array.from({ length: new Date(checkYear, checkMonth, 0).getDate() }, (_, i) => i + 1).map(
                (d) => (
                  <option key={d} value={d}>
                    Ngày {d}
                  </option>
                )
              )}
            </select>

            <select
              value={checkMonth}
              onChange={(e) => {
                setCheckMonth(Number(e.target.value));
                setCheckDay(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 text-xs sm:text-sm font-bold text-charcoal-900 dark:text-charcoal-100 cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>

            <select
              value={checkYear}
              onChange={(e) => setCheckYear(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 text-xs sm:text-sm font-bold text-saffron-700 dark:text-saffron-400 cursor-pointer"
            >
              {Array.from({ length: 30 }, (_, i) => 2024 + i).map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Date Evaluation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Full Analysis of Selected Date */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={cn(
                'p-5 rounded-3xl border space-y-4',
                selectedDayInfo.isHoangDao
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-ivory-50 dark:bg-charcoal-900 border-ivory-200 dark:border-charcoal-700'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-charcoal-500 dark:text-charcoal-400 block">
                    Dương lịch: <strong>{checkDay}/{checkMonth}/{checkYear}</strong> • Âm lịch:{' '}
                    <strong>
                      {selectedDayInfo.lunarDay}/{selectedDayInfo.lunarMonth} ({selectedDayInfo.yearCanChi})
                    </strong>
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900 dark:text-charcoal-50 mt-0.5">
                    Ngày {selectedDayInfo.dayCanChi} — {selectedDayInfo.hoangDaoStar}
                  </h3>
                </div>

                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap',
                    selectedDayInfo.isHoangDao
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-600 text-white'
                  )}
                >
                  {selectedDayInfo.isHoangDao ? '★ Ngày Hoàng Đạo (Ngày Tốt)' : 'Ngày Bình Thường / Tĩnh Tâm'}
                </span>
              </div>

              {/* Giờ Hoàng Đạo */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-charcoal-800 dark:text-charcoal-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-saffron-600" />
                  <span>Các Khung Giờ Tốt (Giờ Hoàng Đạo) Trong Ngày:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedDayInfo.goodHours.map((h) => (
                    <div
                      key={h}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-xs font-semibold text-charcoal-800 dark:text-charcoal-200 text-center whitespace-nowrap"
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hướng Xuất Hành */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-xs space-y-1">
                <span className="font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-saffron-600" />
                  <span>Hướng Xuất Hành Cát Tường:</span>
                </span>
                <p className="text-charcoal-600 dark:text-charcoal-300 pl-5">
                  {selectedDayInfo.goodDirections}
                </p>
              </div>

              {/* Việc Nên Làm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                    ✓ Việc Thiện Lành Nên Làm:
                  </span>
                  <ul className="space-y-1 text-xs text-charcoal-600 dark:text-charcoal-300">
                    {selectedDayInfo.recommendedActions.map((act, i) => (
                      <li key={i}>• {act}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 space-y-1.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                    ☸ Lời Nhắc Tỉnh Thức:
                  </span>
                  <ul className="space-y-1 text-xs text-charcoal-600 dark:text-charcoal-300">
                    {selectedDayInfo.avoidActions.map((act, i) => (
                      <li key={i}>• {act}</li>
                    ))}
                    <li>• Tâm thiện, lời lành thì mọi ngày đều là ngày lành.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Quick List of All Good Days in Month */}
          <div className="lg:col-span-5 bg-ivory-50/80 dark:bg-charcoal-900/80 rounded-3xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap">
                Danh Sách Ngày Tốt Tháng {checkMonth}/{checkYear}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold whitespace-nowrap">
                {goodDaysInMonth.length} ngày đẹp
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
              {goodDaysInMonth.map((gd) => {
                const isSelected = gd.day === checkDay;
                return (
                  <button
                    key={gd.day}
                    type="button"
                    onClick={() => setCheckDay(gd.day)}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'bg-saffron-600 text-white border-saffron-600 shadow-xs'
                        : 'bg-white dark:bg-charcoal-800 border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400 text-charcoal-800 dark:text-charcoal-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm whitespace-nowrap">
                        Ngày {gd.day}/{checkMonth}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold whitespace-nowrap',
                          isSelected ? 'text-amber-100' : 'text-charcoal-400'
                        )}
                      >
                        {gd.lunarDay}/{gd.lunarMonth} ÂL
                      </span>
                    </div>
                    <div
                      className={cn(
                        'text-[10.5px] font-medium mt-1 truncate',
                        isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      ★ {gd.star}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-ivory-200 dark:border-charcoal-700 flex items-center justify-between text-xs">
              <span className="text-charcoal-500">Muốn đặt lịch nhắc ngày giỗ?</span>
              <Link
                href="/lich-phat-giao"
                className="font-bold text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>Mở Lịch Vạn Niên</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
