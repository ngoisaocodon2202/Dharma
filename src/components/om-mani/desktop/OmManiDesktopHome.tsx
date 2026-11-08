'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Bell,
  Heart,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  ExternalLink,
  BookOpen,
  Volume2,
  Calendar as CalendarIcon,
  Flame,
  Radio,
  Clock,
  Compass,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
} from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

export interface OmManiDesktopHomeProps {
  user: any;
  showToast: (msg: string) => void;
  onOpenMala: () => void;
  onOpenIncense: () => void;
  onOpenSearch: () => void;
  onSelectArticle: (article: any) => void;
  onSelectBuddha: (buddha: any) => void;
  onSelectWallpaper: (wp: any) => void;
  onSelectSutra: (text: any) => void;
  onOpenAbout: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isDroneActive: boolean;
  onToggleDrone: () => void;
  weekDays: any[];
  featuredArticles: any[];
  buddhas: any[];
  temples: any[];
  wallpapers: any[];
}

export function OmManiDesktopHome({
  user,
  showToast,
  onOpenMala,
  onOpenIncense,
  onOpenSearch,
  onSelectArticle,
  onSelectBuddha,
  onSelectWallpaper,
  onSelectSutra,
  onOpenAbout,
  isPlayingMusic,
  onToggleMusic,
  isDroneActive,
  onToggleDrone,
  weekDays,
  featuredArticles,
  buddhas,
  temples,
  wallpapers,
}: OmManiDesktopHomeProps) {
  const router = useRouter();
  const [selectedDayIdx, setSelectedDayIdx] = useState(6); // default today (CN 08)

  const handleChant = () => {
    playGrandTempleBellSound(0.4);
    showToast('Đang phát âm thanh niệm Chú Đại Bi thanh tịnh');
  };

  const handleBell = () => {
    playBellSound(0.5);
    showToast('Thở vào tâm tĩnh lặng, thở ra miệng mỉm cười');
  };

  const handleWoodenFish = () => {
    playWoodenFishSound(0.5);
    showToast('Gõ mõ tịch tĩnh, thân tâm an định');
  };

  const selectedDay = weekDays[selectedDayIdx] || weekDays[6];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ========================================================================= */}
      {/* 1. TOP HERO SECTION: 2-COLUMN DASHBOARD (7 COLS & 5 COLS)                */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Greeting, Big Festival Banner, Verse & Action Pills */}
        <div className="col-span-12 xl:col-span-7 flex flex-col justify-between space-y-6">
          {/* Welcome & Calendar Sync Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C130D] via-[#221710] to-[#170E09] border border-amber-500/25 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#20150E] flex items-center justify-center">
                      <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
                    </div>
                  </div>
                  <div>
                    <h1 className="font-heading font-serif text-xl font-bold text-white flex items-center gap-2">
                      Xin chào,{' '}
                      <span className="text-[#FFE082]">
                        {user?.dharma_name || user?.full_name || 'Phật tử'}
                      </span>
                    </h1>
                    <p className="text-xs text-amber-200/70">
                      Kính chúc ngày mới vạn sự an lạc, tâm bồ đề kiên cố
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold inline-flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Chủ Nhật, 08/11/2026</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Âm lịch: 30 tháng 09 năm Bính Ngọ
                  </p>
                </div>
              </div>

              {/* Today's Special Celebration Highlight */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#2F1D11] to-[#1F140D] border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌸</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Đại Lễ Phật Giáo Hôm Nay
                    </span>
                  </div>
                  <h3 className="font-heading font-serif font-bold text-sm text-white">
                    Vía Dược Sư Lưu Ly Quang Vương Như Lai Thành Đạo
                  </h3>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Nguyện tiêu trừ tật bệnh chướng duyên, gia tăng phúc thọ, thân tâm an ổn.
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenIncense}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-200" />
                    <span>Dâng Hoa &amp; Nhang</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleChant}
                    className="px-4 py-2 rounded-xl bg-[#20150E] border border-amber-500/40 hover:border-amber-300 text-amber-300 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Tụng Chú Dược Sư</span>
                  </button>
                </div>
              </div>

              {/* Daily Wisdom Verse */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 text-base">“</span>
                  <p className="text-xs font-serif italic text-amber-100/90 leading-relaxed">
                    Tâm an vạn sự an, tâm định trăm nghiệp dứt. Mỗi bước chân là một đóa sen nở giữa cõi trần gian.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBell}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
                  title="Thỉnh chuông chánh niệm"
                >
                  <Bell className="w-3 h-3 fill-current" />
                  <span>Thỉnh Chuông</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Practice Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={onOpenMala}
              className="p-3.5 rounded-2xl bg-[#1C140E] border border-amber-500/20 hover:border-amber-400/60 hover:bg-[#251A12] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                📿
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-amber-200">
                108 Tràng Hạt
              </span>
            </button>

            <button
              type="button"
              onClick={handleWoodenFish}
              className="p-3.5 rounded-2xl bg-[#1C140E] border border-amber-500/20 hover:border-amber-400/60 hover:bg-[#251A12] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                🔔
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-amber-200">
                Chuông Mõ Tĩnh Tâm
              </span>
            </button>

            <button
              type="button"
              onClick={handleChant}
              className="p-3.5 rounded-2xl bg-[#1C140E] border border-amber-500/20 hover:border-amber-400/60 hover:bg-[#251A12] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-amber-200">
                Chú Đại Bi
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleDrone}
              className={cn(
                'p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer',
                isDroneActive
                  ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-lg'
                  : 'bg-[#1C140E] border-amber-500/20 hover:border-amber-400/60 hover:bg-[#251A12] text-stone-200'
              )}
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                {isDroneActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </div>
              <span className="text-xs font-bold group-hover:text-amber-200">
                {isDroneActive ? 'Tạm Dừng OM' : 'Nhạc Thiền OM'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Cosmic Radial Mandala Wheel & Weekly Strip */}
        <div className="col-span-12 xl:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#1C130D] via-[#221710] to-[#170E09] border border-amber-500/25 shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
            <div className="flex items-center gap-2">
              <span className="text-base">☸️</span>
              <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                Bánh Xe Pháp Luân &amp; Lịch Tuần
              </h3>
            </div>
            <Link
              href="/lich-phat-giao"
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Xem cả tháng</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Celestial Wheel Visual */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Spinning decorative ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/30 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-amber-400/20" />
              <div className="absolute inset-7 rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent blur-md" />

              {/* 8 Radial ray markers */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/25 to-transparent"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}

              {/* Central Lotus Medallion */}
              <div className="relative z-10 w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_25px_rgba(212,175,55,0.45)] flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-full bg-[#1F140D] flex flex-col items-center justify-center p-2 text-center">
                  <BuddhaBodhiIcon className="w-8 h-8 text-[#FFE082]" />
                  <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest mt-0.5">
                    DHAMMA
                  </span>
                </div>
              </div>
            </div>

            {/* Selected day banner */}
            <div className="mt-3 text-center space-y-1">
              <p className="text-xs font-bold text-white">
                Thứ {selectedDay.name} · Ngày {selectedDay.solarDate}/11
              </p>
              <p className="text-[11px] text-amber-300/80">
                Âm lịch: Ngày {selectedDay.lunarDate}/09
                {selectedDay.festivalName ? ` · ${selectedDay.festivalName}` : ''}
              </p>
            </div>
          </div>

          {/* 7-Day Selector Strip */}
          <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-amber-500/15">
            {weekDays.map((d, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={d.solarDate}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  className={cn(
                    'py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-center',
                    isSelected
                      ? 'bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-md ring-1 ring-amber-300/50'
                      : 'bg-black/30 hover:bg-[#2A1D15] text-stone-300'
                  )}
                >
                  <span className="text-[10px] font-semibold opacity-80">{d.name}</span>
                  <span className="text-xs font-bold mt-0.5">{d.solarDate}</span>
                  <span className="text-[9px] text-amber-200/70">{d.lunarDate}</span>
                  {d.hasDot && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED SPECIAL COLLABORATION BANNER: OM MANI × IMEE OOI             */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-[#A65B32]/40 bg-gradient-to-r from-[#3D140C] via-[#2F100A] to-[#1F0A06] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_center,rgba(212,118,55,0.18),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
          {/* Left Art & Text Info (7 cols) */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HỢP TÁC ĐẶC BIỆT · OM MANI × IMEE OOI</span>
            </div>

            <h2 className="font-heading font-serif text-2xl xl:text-3xl font-black text-white leading-tight">
              Bát Nhã Ba La Mật Đa Tâm Kinh, tiếng Phạn
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
              Bản thu thanh âm thiêng liêng từ danh ca Phật giáo Imee Ooi. Những thanh âm Phạn ngữ cổ xưa giúp xua tan căng thẳng, đưa tâm thức trở về nguồn cội tịch tịnh và trí tuệ vô biên.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onToggleMusic}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38328] hover:from-[#FFE082] hover:to-[#D4AF37] text-charcoal-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {isPlayingMusic ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Tạm Dừng Trì Tụng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lắng Nghe Ngay</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectSutra({
                    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh (Phạn - Hán - Việt)',
                    tradition: 'Đại Thừa',
                    content: `BÁT NHÃ BA LA MẬT ĐA TÂM KINH\n(Prajñāpāramitā Hṛdaya Sūtra)\n\nQuán Tự Tại Bồ Tát hành thâm Bát nhã Ba la mật đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách...\n\nGate gate pāragate pārasaṃgate bodhi svāhā.`,
                  });
                }}
                className="px-5 py-3 rounded-full bg-black/40 border border-white/10 hover:border-amber-400/50 text-stone-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Xem Toàn Văn Kinh</span>
              </button>
            </div>
          </div>

          {/* Right Album Player Card (5 cols) */}
          <div className="col-span-12 lg:col-span-5 p-5 rounded-2xl bg-[#1D0C07]/80 border border-amber-500/20 backdrop-blur-sm shadow-xl flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-[#2C130B] flex items-center justify-center shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
                alt="Mantras of the Sanskrit"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                Album Đang Phát
              </span>
              <h4 className="font-heading font-serif font-bold text-sm text-white truncate">
                Mantras of the Sanskrit
              </h4>
              <p className="text-xs text-stone-400">Nghệ sĩ: Imee Ooi (Huang Huiyin)</p>

              <div className="w-full bg-stone-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={cn(
                    'h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300',
                    isPlayingMusic ? 'w-2/3 animate-pulse' : 'w-1/4'
                  )}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleMusic}
              className="w-11 h-11 rounded-full bg-[#FFE082] text-charcoal-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {isPlayingMusic ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THREE-COLUMN BUDDHIST SANCTUARY MODULES                                */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8">
        {/* Col 1: Chánh Điện Online & Phòng Cầu Nguyện (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#18110B] border border-amber-500/20 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Chánh Điện &amp; Cầu Nguyện Trực Tuyến
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {/* Room 1 */}
              <div className="p-3.5 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 transition-all space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Chánh Điện Quán Thế Âm</h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">
                    1.428 trực tuyến
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Phòng trì tụng Chú Đại Bi và niệm danh hiệu Bồ Tát cứu khổ
                </p>
              </div>

              {/* Room 2 */}
              <div className="p-3.5 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 transition-all space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Đạo Tràng Dược Sư Tiêu Tai</h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">
                    892 trực tuyến
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Cầu an tật bệnh, tiêu trừ chướng ngại, hồi hướng thân quyến
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenIncense}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>Vào Lễ Phật &amp; Dâng Nhang</span>
            </button>
          </div>
        </div>

        {/* Col 2: Thư Viện Chư Phật & Bổn Tôn (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#18110B] border border-amber-500/20 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <span className="text-sm">🪷</span>
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Thư Viện Chư Phật &amp; Bổn Tôn
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">Chiêm bái &amp; đại nguyện</span>
            </div>

            <div className="space-y-2.5">
              {buddhas.slice(0, 3).map((b) => (
                <div
                  key={b.name}
                  onClick={() => onSelectBuddha(b)}
                  className="p-3 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-[#FDF8EC] p-1 border border-amber-500/30 shrink-0">
                    <img src={b.image} alt={b.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200 truncate">
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate">{b.vow}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/thuc-hanh"
              className="w-full py-3 rounded-2xl bg-[#20150E] border border-amber-500/30 hover:border-amber-300 text-amber-200 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Xem Thêm Bổn Tôn Tu Tập</span>
            </Link>
          </div>
        </div>

        {/* Col 3: Danh Lam Cổ Tự & Hình Nền Thanh Tịnh (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl bg-[#18110B] border border-amber-500/20 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Danh Lam Cổ Tự Việt Nam
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">Di tích tâm linh</span>
            </div>

            <div className="space-y-2.5">
              {temples.slice(0, 3).map((t) => (
                <div
                  key={t.name}
                  className="p-3 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200 truncate">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/chua-viet-nam"
              className="w-full py-3 rounded-2xl bg-[#20150E] border border-amber-500/30 hover:border-amber-300 text-amber-200 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Khám Phá Bản Đồ Chùa Chiền</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EDITORIAL SECTION: BÀI VIẾT ĐƯỢC QUAN TÂM (4 COLUMNS X 2 ROWS)        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div>
            <h2 className="font-heading font-serif text-xl font-bold text-white flex items-center gap-2">
              <span>Bài Viết Được Quan Tâm</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                8 bài chọn lọc
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Pháp thoại, đạo lý nhân quả, nghi thức truyền thống và nghệ thuật sống an lạc
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Tìm kiếm bài viết</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group rounded-3xl bg-[#18110B] border border-amber-500/20 hover:border-amber-400/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18110B] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30">
                    Phật Pháp
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-serif font-bold text-sm text-white group-hover:text-amber-200 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-300/80">
                <span>{article.readTime || '5 phút đọc'}</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-amber-200 font-semibold">
                  Đọc tiếp →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. GLOBAL FELLOWSHIP BANNER: 174 COUNTRIES                                */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-gradient-to-r from-[#1E140E] via-[#261911] to-[#1E140E] border border-amber-500/25 p-8 text-center shadow-2xl space-y-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="font-heading font-serif text-4xl sm:text-5xl font-black text-[#FFE082] tracking-tight">
            174
          </div>
          <div className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
            Quốc gia &amp; Vùng lãnh thổ đang tu tập trên Om Mani
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-lg mx-auto">
            Không phân biệt biên giới, hàng triệu người con Phật khắp năm châu cùng lắng đọng tâm tư, thực tập chánh niệm mỗi ngày.
          </p>
        </div>

        {/* Global Flags Strip */}
        <div className="flex items-center justify-center gap-4 text-2xl pt-2">
          <span title="Việt Nam">🇻🇳</span>
          <span title="Ấn Độ">🇮🇳</span>
          <span title="Nhật Bản">🇯🇵</span>
          <span title="Hàn Quốc">🇰🇷</span>
          <span title="Thái Lan">🇹🇭</span>
          <span title="Myanmar">🇲🇲</span>
          <span title="Pháp">🇫🇷</span>
          <span title="Hoa Kỳ">🇺🇸</span>
          <span title="Vương Quốc Anh">🇬🇧</span>
          <span title="Đức">🇩🇪</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenAbout}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#20150E] border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>🪷</span>
            <span>Tìm Hiểu Thêm Về Om Mani</span>
          </button>
        </div>
      </section>
    </div>
  );
}

