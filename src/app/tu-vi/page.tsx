'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Palette,
  Calendar,
  Compass,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Briefcase,
  Coins,
  Heart,
  Activity,
  BookOpen,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { calculateCanChiAndMenh, GIO_SINH_OPTIONS, FOCUS_AREAS } from '@/lib/tu-vi-calc';
import { getLunarDate, NGU_HANH_COLOR_MAP } from '@/lib/lunar-calendar';
import type { TuViAnalysisResult } from '@/app/api/tu-vi/route';
import { cn } from '@/lib/utils';

export default function PersonalDestinyAnalysisPage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const resultRef = useRef<HTMLDivElement>(null);

  // Personal Information Form State
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [birthDay, setBirthDay] = useState<number>(15);
  const [birthMonth, setBirthMonth] = useState<number>(6);
  const [birthYear, setBirthYear] = useState<number>(1996);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [birthHour, setBirthHour] = useState<string>('KhongRo');
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [focusArea, setFocusArea] = useState<string>('tong_quan');
  const [wishes, setWishes] = useState<string>('');

  // Processing & Result State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TuViAnalysisResult | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{
    fullName: string;
    gender: 'Nam' | 'Nữ';
    birthDateFormatted: string;
    birthYear: number;
    birthHourLabel: string;
    calendarType: 'solar' | 'lunar';
    viewYear: number;
    focusLabel: string;
  } | null>(null);

  // Prefill from logged-in Dharma profile if available
  useEffect(() => {
    if (user) {
      if (!fullName && (user.dharma_name || user.full_name)) {
        setFullName(user.dharma_name || user.full_name);
      }
      if (user.gender) {
        setGender(user.gender === 'female' || user.gender === 'Nữ' ? 'Nữ' : 'Nam');
      }
    }
  }, [user, fullName]);

  // Active Can Chi & Color Profile for the analyzed user
  const activeCanChi = useMemo(() => {
    const targetYear = submittedInfo ? submittedInfo.birthYear : birthYear;
    const targetGender = submittedInfo ? submittedInfo.gender : gender;
    const targetViewYear = submittedInfo ? submittedInfo.viewYear : viewYear;
    return calculateCanChiAndMenh(targetYear, targetGender, targetViewYear);
  }, [submittedInfo, birthYear, gender, viewYear]);

  const colorProfile = useMemo(() => {
    return NGU_HANH_COLOR_MAP[activeCanChi.nguHanh] || NGU_HANH_COLOR_MAP.Kim;
  }, [activeCanChi]);

  // Good days (Hoàng Đạo) in current month for reference
  const auspiciousDaysThisMonth = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const totalDays = new Date(year, month, 0).getDate();
    const list: {
      day: number;
      month: number;
      lunarDay: number;
      lunarMonth: number;
      dayCanChi: string;
      star: string;
      auspiciousHours: string[];
    }[] = [];

    for (let d = 1; d <= totalDays; d++) {
      const info = getLunarDate(year, month, d);
      if (info.isHoangDao) {
        list.push({
          day: d,
          month,
          lunarDay: info.lunarDay,
          lunarMonth: info.lunarMonth,
          dayCanChi: info.dayCanChi,
          star: info.hoangDaoStar.replace(' Hoàng Đạo', ''),
          auspiciousHours: (info.hoangDaoHours || []).slice(0, 3),
        });
      }
    }
    return list.slice(0, 8);
  }, [today]);

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setErrorMsg('Vui lòng nhập Họ tên hoặc Pháp danh của bạn để bắt đầu phân tích.');
      return;
    }

    const paddedMonth = String(birthMonth).padStart(2, '0');
    const paddedDay = String(birthDay).padStart(2, '0');
    const birthDateISO = `${birthYear}-${paddedMonth}-${paddedDay}`;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/tu-vi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          gender,
          birthDate: birthDateISO,
          birthHour,
          calendarType,
          viewYear,
          focusArea,
          wishes: wishes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || 'Không thể phân tích dữ liệu lúc này.');
      }

      const hourObj = GIO_SINH_OPTIONS.find((g) => g.value === birthHour) || GIO_SINH_OPTIONS[0];
      const focusObj = FOCUS_AREAS.find((f) => f.value === focusArea) || FOCUS_AREAS[0];

      setAnalysisResult(json.data);
      setSubmittedInfo({
        fullName: trimmedName,
        gender,
        birthDateFormatted: `${paddedDay}/${paddedMonth}/${birthYear}`,
        birthYear,
        birthHourLabel: hourObj.label,
        calendarType,
        viewYear,
        focusLabel: focusObj.label,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.';
      setErrorMsg(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Hero Header with Clear Anti-Superstition Orientation */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3d1f0d] via-[#5c1616] to-[#2b1408] text-white p-5 sm:p-8 shadow-xl border border-[#d4af37]/40">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd966] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            <Compass className="w-3.5 h-3.5 text-[#ffd966] shrink-0" />
            <span>Phân Tích Bản Mệnh • Màu Hợp & Ngày Tốt</span>
          </div>

          <h1 className="font-heading text-xl sm:text-3xl font-bold text-amber-50 leading-snug">
            Nhập Thông Tin Cá Nhân & Phân Tích Bản Mệnh Hướng Thiện
          </h1>

          <p className="text-xs sm:text-sm text-[#e8d5b5] leading-relaxed">
            Nhập họ tên, ngày tháng năm sinh và giờ sinh để hệ thống tổng hợp thông số{' '}
            <strong>Can Chi, Ngũ Hành Nạp Âm, Màu Chủ Đạo, Ngày Tốt</strong> và gợi ý định hướng sống chánh niệm.
          </p>

          {/* Explicit Non-Superstition Disclaimer Badge */}
          <div className="pt-1">
            <div className="inline-flex items-start sm:items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/25 border border-amber-300/25 text-[11px] sm:text-xs text-amber-200/95">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Lưu ý Chánh kiến:</strong> Kết quả phân tích dựa trên văn hóa lịch pháp Đông phương và triết lý Nhân Quả,{' '}
                <span className="underline decoration-amber-400/60">chỉ mang tính chất tham khảo</span>, hoàn toàn không cổ xúy mê tín dị đoan.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PERSONAL INFORMATION INPUT FORM */}
      <section className="bg-white dark:bg-charcoal-800 rounded-3xl border border-[#e6dfd3] dark:border-charcoal-700 shadow-md p-4 sm:p-7">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 dark:border-charcoal-700 pb-4 mb-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-[#b5892e] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b5892e] block whitespace-nowrap">
                Bước 1 • Thông Tin Của Bạn
              </span>
              <h2 className="font-heading text-base sm:text-xl font-bold text-stone-800 dark:text-stone-100 whitespace-nowrap truncate">
                Nhập Dữ Liệu Cá Nhân Cần Phân Tích
              </h2>
            </div>
          </div>

          {analysisResult && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã xử lý hồ sơ</span>
            </span>
          )}
        </div>

        <form onSubmit={handleAnalyzeSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Full Name & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                1. Họ và Tên hoặc Pháp Danh *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An (hoặc Pháp danh Thiện Tâm)..."
                className="w-full px-4 py-3 rounded-2xl bg-[#fdfbf7] dark:bg-charcoal-900 border border-stone-200/90 dark:border-charcoal-700 text-sm font-medium text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#b5892e] focus:ring-2 focus:ring-[#b5892e]/15 transition-all"
              />
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                2. Giới Tính *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setGender('Nam')}
                  className={cn(
                    'py-3 px-3 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer',
                    gender === 'Nam'
                      ? 'bg-gradient-to-br from-amber-50 to-[#fff8e6] border-[#b5892e] text-[#4a2508] shadow-2xs'
                      : 'bg-[#fdfbf7] dark:bg-charcoal-900 border-stone-200 dark:border-charcoal-700 text-stone-600 dark:text-stone-400'
                  )}
                >
                  <span>🙏</span>
                  <span>Nam Mạng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Nữ')}
                  className={cn(
                    'py-3 px-3 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer',
                    gender === 'Nữ'
                      ? 'bg-gradient-to-br from-amber-50 to-[#fff8e6] border-[#b5892e] text-[#4a2508] shadow-2xs'
                      : 'bg-[#fdfbf7] dark:bg-charcoal-900 border-stone-200 dark:border-charcoal-700 text-stone-600 dark:text-stone-400'
                  )}
                >
                  <span>🪷</span>
                  <span>Nữ Mạng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Birth Date (Day / Month / Year) & Calendar Type */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                3. Ngày Tháng Năm Sinh *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <CustomSelect
                  value={birthDay}
                  onChange={(val) => setBirthDay(Number(val))}
                  options={Array.from({ length: 31 }, (_, i) => ({
                    value: i + 1,
                    label: `Ngày ${i + 1}`,
                  }))}
                />

                <CustomSelect
                  value={birthMonth}
                  onChange={(val) => setBirthMonth(Number(val))}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: i + 1,
                    label: `Tháng ${i + 1}`,
                  }))}
                />

                <CustomSelect
                  value={birthYear}
                  onChange={(val) => setBirthYear(Number(val))}
                  align="right"
                  options={Array.from({ length: 95 }, (_, i) => ({
                    value: 1935 + i,
                    label: `Năm ${1935 + i}`,
                  }))}
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                Loại Lịch Ngày Sinh
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarType('solar')}
                  className={cn(
                    'py-3 px-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                    calendarType === 'solar'
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-[#fdfbf7] border-stone-200 text-stone-600'
                  )}
                >
                  Dương Lịch
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarType('lunar')}
                  className={cn(
                    'py-3 px-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                    calendarType === 'lunar'
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-[#fdfbf7] border-stone-200 text-stone-600'
                  )}
                >
                  Âm Lịch
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Birth Hour & Focus Area & View Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                4. Giờ Sinh (12 Canh Giờ)
              </label>
              <CustomSelect
                value={birthHour}
                onChange={(val) => setBirthHour(String(val))}
                options={GIO_SINH_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                  sublabel: opt.description,
                }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                5. Khía Cạnh Cần Tham Khảo
              </label>
              <CustomSelect
                value={focusArea}
                onChange={(val) => setFocusArea(String(val))}
                options={FOCUS_AREAS.map((area) => ({
                  value: area.value,
                  label: area.label,
                }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
                6. Năm Phân Tích Vận Trình
              </label>
              <CustomSelect
                value={viewYear}
                onChange={(val) => setViewYear(Number(val))}
                align="right"
                options={[2025, 2026, 2027, 2028, 2029, 2030].map((y) => ({
                  value: y,
                  label: `Năm ${y}`,
                }))}
              />
            </div>
          </div>

          {/* Row 4: Optional Personal Wishes / Questions */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap truncate">
              7. Mong Muốn Hoặc Điều Đang Trăn Trở (Tùy chọn)
            </label>
            <input
              type="text"
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Ví dụ: Mong cầu gia đạo bình an, công việc thuận lợi, tìm hiểu màu sắc hợp mệnh..."
              className="w-full px-4 py-3 rounded-2xl bg-[#fdfbf7] dark:bg-charcoal-900 border border-stone-200/90 dark:border-charcoal-700 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#b5892e]"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 dark:border-charcoal-700">
            <p className="text-[11px] text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#b5892e] shrink-0" />
              <span>Hệ thống xử lý dữ liệu trực tiếp theo Ngũ hành Nạp âm & Bát trạch.</span>
            </p>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto min-w-[260px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#b5892e] via-[#c99a36] to-[#8c6514] hover:from-[#9a721c] hover:to-[#70500e] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>Đang phân tích dữ liệu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Phân Tích Bản Mệnh & Xem Kết Quả</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 3. PERSONALIZED ANALYSIS RESULT (Only shown after user submits personal info) */}
      <div ref={resultRef}>
        {analysisResult && submittedInfo ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* A. Summary Card of Processed Personal Data */}
            <section className="bg-white dark:bg-charcoal-800 rounded-3xl border-2 border-[#d4af37]/50 shadow-lg p-5 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-charcoal-700 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                    ☸ Hồ Sơ Phân Tích Cá Nhân (Tham Khảo)
                  </span>
                  <h2 className="font-heading text-lg sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
                    {submittedInfo.fullName} • {submittedInfo.gender} Mạng
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Sinh ngày {submittedInfo.birthDateFormatted} (
                    {submittedInfo.calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'}) •{' '}
                    {submittedInfo.birthHourLabel}
                  </p>
                </div>

                <div className="shrink-0 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-right">
                  <span className="text-[10px] font-bold uppercase text-amber-700 block whitespace-nowrap">
                    Năm chiêm nghiệm {submittedInfo.viewYear}
                  </span>
                  <span className="font-heading font-bold text-sm text-stone-800 whitespace-nowrap">
                    Năm {analysisResult.namXemCanChi} • {analysisResult.tuoiAm} tuổi âm
                  </span>
                </div>
              </div>

              {/* 4 Key Pillars Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block whitespace-nowrap">
                    Tuổi Can Chi
                  </span>
                  <p className="font-heading font-bold text-sm sm:text-base text-stone-800 mt-0.5 whitespace-nowrap truncate">
                    Tuổi {analysisResult.canChi}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block whitespace-nowrap">
                    Ngũ Hành Nạp Âm
                  </span>
                  <p className="font-heading font-bold text-sm sm:text-base text-amber-900 mt-0.5 whitespace-nowrap truncate">
                    {analysisResult.menh}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block whitespace-nowrap">
                    Cung Phi Bát Trạch
                  </span>
                  <p className="font-heading font-bold text-sm sm:text-base text-emerald-900 mt-0.5 whitespace-nowrap truncate">
                    {analysisResult.cung}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block whitespace-nowrap">
                    Hướng & Số Cát Tường
                  </span>
                  <p className="font-heading font-bold text-xs sm:text-sm text-stone-800 mt-0.5 whitespace-nowrap truncate">
                    Số: {colorProfile.luckyNumbers}
                  </p>
                </div>
              </div>

              {/* B. Detailed Analysis Cards (5 Life Aspects) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-[#fffdf7] border border-amber-200/90 space-y-1.5">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#5c1616] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#b5892e] shrink-0" />
                    <span>1. Tổng Quan Vận Trình & Bản Mệnh Năm {submittedInfo.viewYear}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {analysisResult.tongQuan}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 space-y-1.5">
                  <h3 className="font-heading font-bold text-sm text-stone-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#b5892e] shrink-0" />
                    <span>2. Công Danh & Sự Nghiệp</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {analysisResult.congDanh}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 space-y-1.5">
                  <h3 className="font-heading font-bold text-sm text-stone-800 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>3. Tài Chính & Phúc Lộc</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {analysisResult.taiLoc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 space-y-1.5">
                  <h3 className="font-heading font-bold text-sm text-stone-800 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>4. Gia Đạo & Nhân Duyên</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {analysisResult.tinhDuyen}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 space-y-1.5">
                  <h3 className="font-heading font-bold text-sm text-stone-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5. Sức Khỏe Thân Tâm</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {analysisResult.sucKhoe}
                  </p>
                </div>
              </div>
            </section>

            {/* C. Personalized Lucky Colors & Element Harmony */}
            <section className="bg-white dark:bg-charcoal-800 rounded-3xl border border-[#e6dfd3] shadow-md p-5 sm:p-7 space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b5892e] block whitespace-nowrap">
                  Màu Sắc Ngũ Hành Của {submittedInfo.fullName}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-800 mt-0.5">
                  Màu Chủ Đạo Bản Mệnh & Màu Tương Sinh ({colorProfile.elementTitle})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {colorProfile.primaryColors.map((c) => (
                  <div
                    key={c.name}
                    className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 shadow-xs border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-stone-800 whitespace-nowrap truncate">
                        {c.name} (Bản mệnh)
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorProfile.supportColors.map((c) => (
                  <div
                    key={c.name}
                    className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 flex items-start gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 shadow-xs border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-emerald-950 whitespace-nowrap truncate">
                        {c.name} (Tương sinh)
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* D. Mindful Buddhist Guidance ("Đức Năng Thắng Số") & Auspicious Days */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <section className="lg:col-span-7 bg-white rounded-3xl border border-[#e6dfd3] shadow-md p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#b5892e] shrink-0" />
                  <h3 className="font-heading text-base sm:text-lg font-bold text-stone-800">
                    Định Hướng Chánh Niệm • &ldquo;Đức Năng Thắng Số&rdquo;
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                    <strong className="text-[#5c1616] block mb-0.5">✦ Quán chiếu Nhân Quả:</strong>
                    {analysisResult.loiKhuyenPhatPhap.nghiepDuyen}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-stone-200/80">
                    <strong className="text-stone-800 block mb-0.5">✦ Phương pháp chuyển hóa tâm thức:</strong>
                    {analysisResult.loiKhuyenPhatPhap.phuongPhapHoaGiai}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-stone-200/80">
                    <strong className="text-stone-800 block mb-0.5">✦ Kinh điển & Thực hành gợi ý:</strong>
                    {analysisResult.loiKhuyenPhatPhap.kinhChuPhuHop}
                  </div>
                </div>
              </section>

              <section className="lg:col-span-5 bg-white rounded-3xl border border-[#e6dfd3] shadow-md p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
                  <h3 className="font-heading text-base sm:text-lg font-bold text-stone-800">
                    Ngày Tốt Hoàng Đạo Trong Tháng
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Các ngày cát lành trong tháng {today.getMonth() + 1}/{today.getFullYear()} thuận lợi để khởi sự việc thiện, đi chùa, xuất hành:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {auspiciousDaysThisMonth.map((item) => (
                    <div
                      key={item.day}
                      className="p-3 rounded-2xl bg-[#fdfbf7] border border-stone-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs sm:text-sm text-stone-800">
                          {item.day}/{item.month} DL
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.lunarDay}/{item.lunarMonth} ÂL
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">
                        Ngày {item.dayCanChi} • Sao {item.star}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Empty State Prompt Before Submitting */
          <div className="rounded-3xl bg-[#fdfbf7] border border-dashed border-[#d4af37]/60 p-6 sm:p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-[#b5892e] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-stone-800">
              Nhập Thông Tin Cá Nhân Ở Trên Để Xem Phân Tích
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
              Sau khi bạn điền Họ tên, Ngày tháng năm sinh và bấm{' '}
              <strong>&ldquo;Phân Tích Bản Mệnh & Xem Kết Quả&rdquo;</strong>, hệ thống sẽ tính toán bảng Màu Chủ Đạo, Ngũ Hành Nạp Âm, Luận Giải Vận Trình và Ngày Tốt dành riêng cho bạn.
            </p>
          </div>
        )}
      </div>

      {/* 4. Bottom Ethical & Non-Superstition Disclaimer */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#b5892e] shrink-0 mt-0.5" />
        <div className="text-xs text-stone-600 leading-relaxed space-y-1">
          <p className="font-bold text-stone-800">
            Nguyên tắc Tham khảo Văn hóa & Không Mê tín Dị đoan:
          </p>
          <p>
            Toàn bộ dữ liệu phân tích Can Chi, Ngũ Hành, Màu Sắc Chủ Đạo và Ngày Tốt trên trang này được tổng hợp từ lịch pháp truyền thống Đông phương nhằm mục đích tham khảo văn hóa và khích lệ đời sống hướng thiện. Đạo Phật dạy rằng mọi ngày đều là ngày lành khi thân làm việc thiện, miệng nói lời hay, tâm giữ ý lành (<em>&ldquo;Đức năng thắng số&rdquo;</em>).
          </p>
        </div>
      </div>
    </div>
  );
}
