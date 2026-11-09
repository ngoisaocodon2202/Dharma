'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Play,
  Pause,
  MapPin,
  Volume2,
  Calendar as CalendarIcon,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  TempleBellIcon,
  WoodenFishMinimalIcon,
  MalaBeadsMinimalIcon,
  IncenseAltarIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
  PagodaMinimalIcon,
  LotusLanternIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
} from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

export interface DhammapadaVerse {
  id: string;
  number: string;
  chapter: string;
  pali: string;
  vietnamese: string;
  application: string;
}

export interface DailyPeriodItem {
  id: string;
  period: string;
  timeRange: string;
  title: string;
  practice: string;
}

export interface OmManiDesktopHomeProps {
  user: any;
  showToast: (msg: string) => void;
  onOpenMala: () => void;
  onOpenIncense: () => void;
  onOpenSearch: () => void;
  onSelectArticle: (article: any) => void;
  onSelectBuddha: (buddha: any) => void;
  onSelectSutra: (text: any) => void;
  onOpenAbout: () => void;
  isDroneActive: boolean;
  onToggleDrone: () => void;
  isAutoWoodenFish: boolean;
  onToggleAutoWoodenFish: () => void;
  currentVerse: DhammapadaVerse;
  onDrawNewVerse: () => void;
  dailyPeriods: DailyPeriodItem[];
  completedPeriods: string[];
  onTogglePeriod: (id: string) => void;
  weekDays: any[];
  featuredArticles: any[];
  buddhas: any[];
  temples: any[];
}

export function OmManiDesktopHome({
  user,
  showToast,
  onOpenMala,
  onOpenIncense,
  onOpenSearch,
  onSelectArticle,
  onSelectBuddha,
  onSelectSutra,
  onOpenAbout,
  isDroneActive,
  onToggleDrone,
  isAutoWoodenFish,
  onToggleAutoWoodenFish,
  currentVerse,
  onDrawNewVerse,
  dailyPeriods,
  completedPeriods,
  onTogglePeriod,
  weekDays,
  featuredArticles,
  buddhas,
  temples,
}: OmManiDesktopHomeProps) {
  const router = useRouter();
  const [selectedDayIdx, setSelectedDayIdx] = useState(6);
  const [articleCategory, setArticleCategory] = useState<string>('Tất cả');

  const selectedDay = weekDays[selectedDayIdx] || weekDays[6];
  const progressPercent = Math.round((completedPeriods.length / dailyPeriods.length) * 100);

  const categories = ['Tất cả', 'Chữa lành tâm', 'Nhân quả & Phúc báo', 'Thiền đời thường', 'Hiếu đạo'];
  const filteredArticles =
    articleCategory === 'Tất cả'
      ? featuredArticles
      : featuredArticles.filter((a) => a.category === articleCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ========================================================================= */}
      {/* 1. TOP HERO SECTION: 2-COLUMN DHARMA SANCTUARY (7 COLS & 5 COLS)         */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column (7 cols): Greeting, 4-Period Daily Practice & Quick Tools */}
        <div className="col-span-12 xl:col-span-7 flex flex-col justify-between space-y-6">
          {/* Welcome & Daily 4-Period Practice Card */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-[#2B200B] via-[#221909] to-[#191206] border border-[#F5C542]/35 shadow-[0_16px_48px_rgba(0,0,0,0.55)] relative overflow-hidden space-y-5">
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-[#F5C542]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between gap-4 pb-4 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#FFF0A8] shadow-[0_0_20px_rgba(245,197,66,0.35)] flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#211808] flex items-center justify-center">
                    <DharmaWheelIcon className="w-6 h-6 text-[#FFD966]" />
                  </div>
                </div>
                <div>
                  <h1 className="font-heading font-serif text-xl font-bold text-[#FFFDF7] flex items-center gap-2">
                    Nam Mô Bổn Sư,{' '}
                    <span className="text-[#FFD966]">
                      {user?.dharma_name || user?.full_name || 'Cư sĩ'}
                    </span>
                  </h1>
                  <p className="text-xs text-[#D6C394]">
                    Nguyện ngày mới chánh niệm sáng tỏ, thân tâm an trú trong Chánh pháp
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-semibold px-3.5 py-1 rounded-full bg-[#F5C542]/18 border border-[#F5C542]/40 text-[#FFD966] inline-flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Chủ Nhật, 08/11/2026</span>
                </div>
                <p className="text-[11px] text-[#C7B68B] mt-1">
                  Âm lịch: 30/09 Bính Ngọ • Vía Phật Dược Sư
                </p>
              </div>
            </div>

            {/* 4-Period Daily Practice Tracker (Thời Khóa 4 Thời Công Phu) */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BodhiLeafIcon className="w-4 h-4 text-[#FFD966]" />
                  <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                    Thời Khóa 4 Thời Tỉnh Thức Hôm Nay
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#FFD966]">
                  Hoàn thành {completedPeriods.length}/{dailyPeriods.length} thời ({progressPercent}%)
                </span>
              </div>

              {/* Golden Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#140F05] border border-[#F5C542]/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E5A91C] via-[#F5C542] to-[#FFE07D] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(6, progressPercent)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {dailyPeriods.map((item) => {
                  const isDone = completedPeriods.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTogglePeriod(item.id)}
                      className={cn(
                        'p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer group',
                        isDone
                          ? 'bg-gradient-to-r from-[#3D2D0D] to-[#2B200B] border-[#FFD966]/60 shadow-[0_0_15px_rgba(245,197,66,0.18)]'
                          : 'bg-[#1B1407]/85 border-[#F5C542]/20 hover:border-[#F5C542]/50'
                      )}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C542]">
                            {item.period}
                          </span>
                          <span className="text-[10px] text-[#A89874] font-mono">
                            {item.timeRange}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-xs text-[#FFFDF7] group-hover:text-[#FFD966] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#C7B68B] line-clamp-1">
                          {item.practice}
                        </p>
                      </div>

                      <div
                        className={cn(
                          'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all',
                          isDone
                            ? 'bg-gradient-to-br from-[#FFE07D] to-[#F5C542] text-[#1A1305] border-[#FFF0A8]'
                            : 'bg-[#140F05] border-[#F5C542]/30 text-transparent group-hover:border-[#FFD966]'
                        )}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4 Minimalist Golden Practice Shortcut Buttons */}
          <div className="grid grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={onOpenIncense}
              className="p-4 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] hover:bg-[#2E220E] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <IncenseAltarIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966]">
                Dâng Hương Tam Bảo
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenMala}
              className="p-4 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] hover:bg-[#2E220E] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <MalaBeadsMinimalIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966]">
                Tràng Hạt 108 Hạt
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playGrandTempleBellSound(0.5);
                showToast('Tiếng Đại Hồng Chung ngân vang, thức tỉnh chánh niệm');
              }}
              className="p-4 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] hover:bg-[#2E220E] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <TempleBellIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966]">
                Thỉnh Đại Hồng Chung
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/thu-vien')}
              className="p-4 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] hover:bg-[#2E220E] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <SutraScrollIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966]">
                Tụng Kinh Tam Tạng
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Daily Dhammapada Oracle & Weekly Calendar */}
        <div className="col-span-12 xl:col-span-5 p-7 rounded-3xl bg-gradient-to-br from-[#2B200B] via-[#221909] to-[#191206] border border-[#F5C542]/35 shadow-[0_16px_48px_rgba(0,0,0,0.55)] flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
            <div className="flex items-center gap-2">
              <LotusMinimalIcon className="w-5 h-5 text-[#FFD966]" />
              <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                Thỉnh Kệ Pháp Cú Hôm Nay (Dhammapada)
              </h3>
            </div>
            <button
              type="button"
              onClick={onDrawNewVerse}
              className="px-3 py-1 rounded-xl bg-[#F5C542]/15 hover:bg-[#F5C542]/25 border border-[#F5C542]/35 text-[#FFD966] text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thỉnh Kệ Khác</span>
            </button>
          </div>

          {/* Dhammapada Verse Display Card */}
          <div className="p-5 rounded-2xl bg-[#181207]/90 border border-[#F5C542]/30 space-y-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#F5C542]">
              <span>{currentVerse.chapter}</span>
              <span>{currentVerse.number}</span>
            </div>

            <p className="text-xs font-serif italic text-[#C7B68B] border-l-2 border-[#F5C542]/50 pl-3">
              &ldquo;{currentVerse.pali}&rdquo;
            </p>

            <blockquote className="font-heading font-serif text-sm sm:text-[15px] font-bold text-[#FFFDF7] leading-relaxed whitespace-pre-line">
              {currentVerse.vietnamese}
            </blockquote>

            <div className="pt-2.5 border-t border-[#F5C542]/15 flex items-start gap-2 text-xs text-[#F3E3B2]">
              <BodhiLeafIcon className="w-4 h-4 text-[#FFD966] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#FFD966]">Quán chiếu hôm nay: </span>
                <span>{currentVerse.application}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Lunar/Solar Strip */}
          <div className="space-y-2.5 pt-2 border-t border-[#F5C542]/20">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F3E3B2]">
                Thứ {selectedDay.name} • Ngày {selectedDay.solarDate}/11 (Âm {selectedDay.lunarDate}/09)
              </span>
              <Link
                href="/lich-phat-giao"
                className="text-[11px] text-[#FFD966] hover:underline flex items-center gap-1"
              >
                <span>Lịch tháng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((d, idx) => {
                const isSelected = selectedDayIdx === idx;
                return (
                  <button
                    key={d.solarDate}
                    type="button"
                    onClick={() => setSelectedDayIdx(idx)}
                    className={cn(
                      'py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-center border',
                      isSelected
                        ? 'bg-gradient-to-b from-[#FFE07D] to-[#E5A91C] text-[#1A1305] border-[#FFF0A8] font-bold shadow-md'
                        : 'bg-[#181207] hover:bg-[#2A200D] text-[#D6C394] border-[#F5C542]/20'
                    )}
                  >
                    <span className="text-[10px] font-semibold opacity-85">{d.name}</span>
                    <span className="text-xs font-bold mt-0.5">{d.solarDate}</span>
                    <span className={cn('text-[9px]', isSelected ? 'text-[#1A1305]/80 font-bold' : 'text-[#F5C542]')}>
                      {d.lunarDate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DHARMA MULTI-LAYER MONASTERY SOUNDSCAPE MIXER (100% ORIGINAL)          */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-[#F5C542]/35 bg-gradient-to-r from-[#2E220B] via-[#231908] to-[#191205] p-7 shadow-2xl">
        <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
          {/* Left Description (5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#FFD966] text-xs font-bold">
              <TempleBellIcon className="w-3.5 h-3.5" />
              <span>PHÁP ÂM THIỀN TỰ ĐA TẦNG • DHARMA AUDIO</span>
            </div>

            <h2 className="font-heading font-serif text-2xl font-black text-[#FFFDF7] leading-tight">
              Không Gian Thanh Âm Chùa Cổ &amp; Tần Số 432Hz
            </h2>

            <p className="text-[#D6C394] text-xs sm:text-sm leading-relaxed">
              Tự do kết hợp tiếng Đại Hồng Chung, tiếng Mõ tụng kinh giữ nhịp đều đặn và sóng âm định tâm 432Hz giúp tịnh hóa không gian làm việc, đọc kinh hoặc tọa thiền.
            </p>
          </div>

          {/* Right 4-Channel Interactive Sound Controls (7 cols) */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Channel 1: Đại Hồng Chung */}
            <button
              type="button"
              onClick={() => {
                playGrandTempleBellSound(0.6);
                showToast('Đang ngân vang: Đại Hồng Chung Chùa Cổ');
              }}
              className="p-4 rounded-2xl bg-[#181207]/90 border border-[#F5C542]/30 hover:border-[#FFD966] flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <TempleBellIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFFDF7]">Đại Hồng Chung</h4>
                <p className="text-[10px] text-[#C7B68B] mt-0.5">Chạm để thỉnh chuông</p>
              </div>
            </button>

            {/* Channel 2: Mõ Chùa Đều Nhịp (Auto 60 BPM) */}
            <button
              type="button"
              onClick={onToggleAutoWoodenFish}
              className={cn(
                'p-4 rounded-2xl border flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer group',
                isAutoWoodenFish
                  ? 'bg-gradient-to-b from-[#FFE07D] to-[#E5A91C] text-[#1A1305] border-[#FFF0A8] shadow-[0_0_20px_rgba(245,197,66,0.4)]'
                  : 'bg-[#181207]/90 border-[#F5C542]/30 hover:border-[#FFD966] text-[#FFFDF7]'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
                  isAutoWoodenFish
                    ? 'bg-[#1A1305]/15 text-[#1A1305]'
                    : 'bg-[#F5C542]/15 border border-[#F5C542]/35 text-[#FFD966]'
                )}
              >
                <WoodenFishMinimalIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">
                  {isAutoWoodenFish ? 'Mõ Nhịp: Đang Gõ' : 'Mõ Nhịp Tự Động'}
                </h4>
                <p className={cn('text-[10px] mt-0.5', isAutoWoodenFish ? 'text-[#1A1305]/80 font-semibold' : 'text-[#C7B68B]')}>
                  Nhịp 60 BPM tụng kinh
                </p>
              </div>
            </button>

            {/* Channel 3: Sóng Âm Tịnh Tâm 432Hz */}
            <button
              type="button"
              onClick={onToggleDrone}
              className={cn(
                'p-4 rounded-2xl border flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer group',
                isDroneActive
                  ? 'bg-gradient-to-b from-[#FFE07D] to-[#E5A91C] text-[#1A1305] border-[#FFF0A8] shadow-[0_0_20px_rgba(245,197,66,0.4)]'
                  : 'bg-[#181207]/90 border-[#F5C542]/30 hover:border-[#FFD966] text-[#FFFDF7]'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
                  isDroneActive
                    ? 'bg-[#1A1305]/15 text-[#1A1305]'
                    : 'bg-[#F5C542]/15 border border-[#F5C542]/35 text-[#FFD966]'
                )}
              >
                {isDroneActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold">
                  {isDroneActive ? 'Tần Số: Đang Phát' : 'Tần Số Tịnh Tâm'}
                </h4>
                <p className={cn('text-[10px] mt-0.5', isDroneActive ? 'text-[#1A1305]/80 font-semibold' : 'text-[#C7B68B]')}>
                  Chuông xoay 432Hz
                </p>
              </div>
            </button>

            {/* Channel 4: Khánh Đồng Chánh Niệm */}
            <button
              type="button"
              onClick={() => {
                playBellSound(0.5);
                showToast('Tiếng khánh đồng thanh lương — Trở về hơi thở hiện tại');
              }}
              className="p-4 rounded-2xl bg-[#181207]/90 border border-[#F5C542]/30 hover:border-[#FFD966] flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] group-hover:scale-110 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFFDF7]">Khánh Đồng</h4>
                <p className="text-[10px] text-[#C7B68B] mt-0.5">Chuông báo tỉnh thức</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THREE-COLUMN DHARMA SANCTUARY MODULES                                  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8">
        {/* Col 1: Đàn Tràng Hoa Đăng & Dâng Hương (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#241B0B] border border-[#F5C542]/25 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-2">
                <LotusLanternIcon className="w-4 h-4 text-[#FFD966]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                  Phật Đài &amp; Nguyện Hương Trực Tuyến
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#FFD966] animate-pulse" />
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-[#F5C542]/30">
              <img
                src="/images/golden_buddha_altar.jpg"
                alt="Phật Đài Trang Nghiêm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181207] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966]">
                  Hương Vân Cái Bồ Tát
                </span>
                <h4 className="text-xs font-bold text-white">
                  Chánh Điện Tam Bảo Thanh Tịnh
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#C7B68B] leading-relaxed">
              Dâng nén tâm hương cúng dường mười phương Tam Bảo, phát nguyện bình an cho gia quyến và ghi nhận vào Sổ Công Đức cá nhân.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenIncense}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] hover:brightness-105 text-[#1A1305] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <IncenseAltarIcon className="w-4 h-4 text-[#1A1305]" />
            <span>Dâng Hương &amp; Phát Nguyện</span>
          </button>
        </div>

        {/* Col 2: Chư Vị Phật & Bồ Tát Bổn Tôn (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#241B0B] border border-[#F5C542]/25 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-2">
                <LotusMinimalIcon className="w-4 h-4 text-[#FFD966]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                  Chiêm Bái Chư Phật &amp; Đại Nguyện
                </h3>
              </div>
              <span className="text-[11px] text-[#C7B68B]">5 vị Bổn Tôn</span>
            </div>

            <div className="space-y-2.5">
              {buddhas.slice(0, 3).map((b) => (
                <div
                  key={b.name}
                  onClick={() => onSelectBuddha(b)}
                  className="p-3 rounded-2xl bg-[#1A1306] border border-[#F5C542]/20 hover:border-[#FFD966] transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#F5C542]/40 shrink-0">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966] truncate">
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-[#C7B68B] truncate">{b.vow}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#F5C542] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/thuc-hanh"
            className="w-full py-3 rounded-2xl bg-[#1A1306] border border-[#F5C542]/35 hover:border-[#FFD966] text-[#FFD966] font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <DharmaWheelIcon className="w-4 h-4" />
            <span>Mở Không Gian Hành Trì</span>
          </Link>
        </div>

        {/* Col 3: Danh Lam Cổ Tự Việt Nam (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#241B0B] border border-[#F5C542]/25 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20">
              <div className="flex items-center gap-2">
                <PagodaMinimalIcon className="w-4 h-4 text-[#FFD966]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFD966]">
                  Danh Lam Cổ Tự Việt Nam
                </h3>
              </div>
              <span className="text-[11px] text-[#C7B68B]">Di sản Phật giáo</span>
            </div>

            <div className="space-y-2.5">
              {temples.slice(0, 3).map((t) => (
                <div
                  key={t.name}
                  onClick={() => router.push(t.href)}
                  className="p-3 rounded-2xl bg-[#1A1306] border border-[#F5C542]/20 hover:border-[#FFD966] transition-all flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#F5C542]/30">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#FFFDF7] group-hover:text-[#FFD966] truncate">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-[#C7B68B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#F5C542] shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#F5C542] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/chua-dia-danh"
            className="w-full py-3 rounded-2xl bg-[#1A1306] border border-[#F5C542]/35 hover:border-[#FFD966] text-[#FFD966] font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Khám Phá Bản Đồ Chùa Cổ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CURATED DHARMA TEACHINGS: CẨM NANG CHUYỂN HÓA TÂM (4 COLS X 2 ROWS)    */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#F5C542]/25">
          <div>
            <h2 className="font-heading font-serif text-xl font-bold text-[#FFFDF7] flex items-center gap-2.5">
              <SutraScrollIcon className="w-5 h-5 text-[#FFD966]" />
              <span>Pháp Học &amp; Cẩm Nang Chuyển Hóa Tâm</span>
            </h2>
            <p className="text-xs text-[#C7B68B] mt-1">
              Lời Phật dạy ứng dụng trực tiếp vào việc hóa giải phiền não, nuôi dưỡng hiếu đạo và bình an nội tại
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setArticleCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                  articleCategory === cat
                    ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#1A1305] font-bold shadow-sm'
                    : 'bg-[#241B0B] border border-[#F5C542]/25 text-[#D6C394] hover:text-[#FFD966]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group rounded-3xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#181207]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241B0B] via-transparent to-transparent opacity-85" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#181207]/85 backdrop-blur-md text-[#FFD966] border border-[#F5C542]/40">
                    {article.category || 'Pháp Bảo'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-serif font-bold text-sm text-[#FFFDF7] group-hover:text-[#FFD966] line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#C7B68B] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-[#F5C542]/15 flex items-center justify-between text-[11px] text-[#FFD966]">
                <span>{article.readTime || '4 phút đọc'}</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                  Đọc chi tiết →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
