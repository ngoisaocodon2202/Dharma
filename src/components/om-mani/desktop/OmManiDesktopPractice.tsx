'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  MeditatingMonkOutlineIcon,
  MalaBeadsMinimalIcon,
  WoodenFishMinimalIcon,
  TempleBellIcon,
  LotusLanternIcon,
  IncenseAltarIcon,
  PagodaMinimalIcon,
  LotusMinimalIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
} from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { cn } from '@/lib/utils';

export interface OmManiDesktopPracticeProps {
  onOpenMala: () => void;
  onOpenBellFish: () => void;
  onOpenChantMachine: () => void;
  onOpenPrayPeace: () => void;
  onOpenPrayRebirth: () => void;
  onOpenOnlineTemple: () => void;
  onOpenBuddhas: () => void;
  onOpenMemorial: () => void;
  onOpenMeritLedger: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  showToast: (msg: string) => void;
}

export function OmManiDesktopPractice({
  onOpenMala,
  onOpenBellFish,
  onOpenChantMachine,
  onOpenPrayPeace,
  onOpenPrayRebirth,
  onOpenOnlineTemple,
  onOpenBuddhas,
  onOpenMemorial,
  onOpenMeritLedger,
  isMusicPlaying,
  onToggleMusic,
  showToast,
}: OmManiDesktopPracticeProps) {
  const router = useRouter();

  // Desktop In-page Zen Meditation Timer & Anapanasati 4-4-6 Breathing Phase
  const [meditationMinutes, setMeditationMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathTick, setBreathTick] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
        setBreathTick((t) => (t + 1) % 14);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playGrandTempleBellSound(0.6);
      recordDharmaMerit({
        type: 'meditation',
        title: `Hoàn Mãn Tọa Thiền Quán Hơi Thở (${meditationMinutes} phút)`,
        detail: 'Thực hành thiền hơi thở Anapanasati 4-4-6 định tĩnh thân tâm',
        meritPoints: meditationMinutes * 3,
      });
      showToast('Thời khóa tọa thiền viên mãn! Đã ghi nhận vào Sổ Công Đức Dharma.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, meditationMinutes, showToast]);

  const getBreathingPhaseLabel = () => {
    if (!isTimerRunning) return 'Chuẩn Bị An Trú Chánh Niệm (Nhịp 4-4-6)';
    if (breathTick < 4) return `Hít Vào Biết Hơi Thở Vào (${4 - breathTick}s)`;
    if (breathTick < 8) return `An Trú Tĩnh Lặng Giữa Hơi Thở (${8 - breathTick}s)`;
    return `Thở Ra Buông Xả Phiền Não (${14 - breathTick}s)`;
  };

  const handleSelectMinutes = (m: number) => {
    setMeditationMinutes(m);
    setSecondsRemaining(m * 60);
    setIsTimerRunning(false);
    setBreathTick(0);
    playBellSound(0.3);
  };

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      showToast('Đã tạm dừng thời khóa tọa thiền');
    } else {
      setIsTimerRunning(true);
      playGrandTempleBellSound(0.5);
      showToast('Bắt đầu tọa thiền Anapanasati • Hít vào 4s, An trú 4s, Thở ra 6s');
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(meditationMinutes * 60);
    setBreathTick(0);
    playBellSound(0.3);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const PRACTICE_CARDS = [
    {
      id: 'thu-vien-bon-ton',
      number: '01',
      title: 'Thư viện Bổn Tôn',
      subtitle: 'Chiêm bái hồng danh & đại nguyện chư Phật, Bồ Tát',
      Icon: LotusMinimalIcon,
      image: '/images/buddhas/duc-phat-thich-ca.png',
      action: onOpenBuddhas,
    },
    {
      id: 'di-chua',
      number: '02',
      title: 'Đi chùa',
      subtitle: 'Lễ Phật cùng đại chúng nơi chánh điện trang nghiêm',
      Icon: PagodaMinimalIcon,
      image: '/images/temple_sanctuary_bg.jpg',
      action: onOpenOnlineTemple,
    },
    {
      id: 'cau-sieu',
      number: '03',
      title: 'Cầu siêu',
      subtitle: 'Thành tâm tưởng niệm cửu huyền thất tổ & hồi hướng cầu an',
      Icon: IncenseAltarIcon,
      image: '/images/cau-sieu-bg.jpg',
      action: onOpenPrayRebirth,
    },
    {
      id: 'may-niem-phat',
      number: '04',
      title: 'Máy niệm Phật',
      subtitle: 'Niệm danh hiệu chư Phật, trì chú & phát nguyện tịnh hóa',
      Icon: TempleBellIcon,
      image: '/images/golden_buddha_altar.jpg',
      action: onOpenChantMachine,
    },
    {
      id: 'nghe-kinh',
      number: '05',
      title: 'Nghe kinh',
      subtitle: 'Tải về, nghe không cần mạng lời Phật dạy & pháp thoại',
      Icon: SutraScrollIcon,
      image: '/images/buddha_meditation.jpg',
      action: () => router.push('/phap-thoai'),
    },
    {
      id: 'trang-hat',
      number: '06',
      title: 'Tràng hạt',
      subtitle: '108 hạt Bồ Đề lần hạt trì niệm danh hiệu chư Phật',
      Icon: MalaBeadsMinimalIcon,
      image: '/images/monk_incense.jpg',
      action: onOpenMala,
    },
    {
      id: 'chuong-mo',
      number: '07',
      title: 'Chuông mõ',
      subtitle: 'Thỉnh chuông, gõ mõ tịnh tâm nhịp tự động BPM',
      Icon: WoodenFishMinimalIcon,
      image: '/images/ancient_pagoda.jpg',
      action: onOpenBellFish,
    },
    {
      id: 'so-gio-chap',
      number: '08',
      title: 'Sổ Giỗ Chạp',
      subtitle: 'Ghi nhớ ngày giỗ người thân & tri ân tổ tiên',
      Icon: BodhiLeafIcon,
      image: '/images/sutra_book.jpg',
      action: onOpenMemorial,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TITLE                                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EEDBBA]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <MeditatingMonkOutlineIcon className="w-6 h-6 text-[#8C5500]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                DHARMA SANCTUARY
              </span>
              <span className="text-xs text-[#7D6442]">
                Lộ Trình 3 Bước: Định Tâm → Trì Niệm → Hồi Hướng
              </span>
            </div>
            <h1 className="font-heading font-serif text-2xl font-bold text-[#2E1E0F] mt-1">
              Không Gian Hành Trì &amp; Thiền Quán Hơi Thở
            </h1>
          </div>
        </div>

        {/* Global Sound & Merit Ledger Quick Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenMeritLedger}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#ECD9A8] hover:border-[#E5C158] text-[#8C5500] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <BodhiLeafIcon className="w-4 h-4" />
            <span>Sổ Công Đức Hồi Hướng</span>
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            className={cn(
              'px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md',
              isMusicPlaying
                ? 'bg-[#FFF4D0] border-[#E5C158] text-[#8C5500]'
                : 'bg-white border-white/10 text-[#6A5234] hover:text-[#2E1E0F]'
            )}
          >
            <Volume2 className={cn('w-4 h-4', isMusicPlaying && 'animate-pulse text-[#8C5500]')} />
            <span>{isMusicPlaying ? 'Đang Phát Tần Số 432Hz' : 'Bật Tần Số Thiền 432Hz'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playGrandTempleBellSound(0.5);
              showToast('Tiếng Đại Hồng Chung ngân vang • Thở vào tâm tĩnh lặng');
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <TempleBellIcon className="w-4 h-4" />
            <span>Thỉnh Đại Hồng Chung</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO ANAPANASATI BREATHING MEDITATION STUDIO (7 COLS & 5 COLS)         */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive Anapanasati 4-4-6 Breathing Clock (7 cols) */}
        <div className="col-span-12 xl:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#EEDBBA] shadow-2xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFF9EA] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FFF4D0] text-[#8C5500] border border-[#ECD9A8] font-bold uppercase tracking-wider">
                Bước 1 • Định Tâm Quán Niệm Hơi Thở (Anapanasati)
              </span>
              <span className="text-xs text-[#5A4329] font-serif italic">
                “Tâm dẫn đầu các pháp, tâm làm chủ, tâm tạo”
              </span>
            </div>

            <div>
              <h2 className="font-heading font-serif text-2xl font-bold text-[#2E1E0F]">
                Phòng Thiền Hơi Thở Chánh Niệm 4-4-6
              </h2>
              <p className="text-xs text-[#6A5234] mt-1">
                Hít vào sâu 4 giây • Giữ hơi an trú 4 giây • Thở ra chậm rãi buông thư 6 giây. Khi hoàn mãn tự động ghi nhận vào Sổ Công Đức.
              </p>
            </div>
          </div>

          {/* Interactive Breathing Visualizer & Clock */}
          <div className="relative z-10 flex flex-col items-center justify-center py-4">
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div
                className={cn(
                  'absolute inset-0 rounded-full border border-[#EEDBBA] transition-all duration-1000',
                  isTimerRunning && breathTick < 4
                    ? 'scale-115 border-[#E5C158] bg-[#FFF9EA]'
                    : isTimerRunning && breathTick >= 8
                    ? 'scale-95 border-[#EEDBBA]'
                    : 'scale-105'
                )}
              />
              <div
                className={cn(
                  'absolute inset-4 rounded-full border-2 border-dashed border-[#ECD9A8] transition-all duration-1000',
                  isTimerRunning ? 'animate-[spin_40s_linear_infinite]' : ''
                )}
              />

              {/* Central Clock Display */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#8C5500] tracking-wider">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[11px] font-bold text-[#2E1E0F] mt-1.5 leading-snug">
                  {getBreathingPhaseLabel()}
                </span>
              </div>
            </div>

            {/* Preset Time Buttons */}
            <div className="flex items-center gap-2 mt-5">
              {[5, 10, 15, 20, 30].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMinutes(m)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    meditationMinutes === m
                      ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-md font-black'
                      : 'bg-white text-[#6A5234] hover:text-[#2E1E0F] border border-[#EEDBBA]'
                  )}
                >
                  {m} phút
                </button>
              ))}
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-[#EEDBBA]">
            <button
              type="button"
              onClick={handleToggleTimer}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Tạm Dừng Tọa Thiền</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt Đầu Thiền Hơi Thở</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              className="p-3 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] transition-all active:scale-95 cursor-pointer"
              title="Đặt lại đồng hồ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: 3-Step Dharma Practice Architecture Spotlight (5 cols) */}
        <div className="col-span-12 xl:col-span-5 p-8 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA]">
              <div className="flex items-center gap-2">
                <DharmaWheelIcon className="w-4 h-4 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
                  Tam Đẳng Hành Trì Tại Gia
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                 Chuẩn Pháp Môn Dharma
              </span>
            </div>

            <p className="text-xs text-[#5A4329] leading-relaxed">
              Khác với việc sử dụng các công cụ rời rạc, Dharma thiết kế hành trình tu tập mỗi ngày theo đúng 3 bước truyền thống của người con Phật: <strong className="text-[#8C5500]">Định Tâm → Trì Niệm → Hồi Hướng</strong>.
            </p>

            {/* Quick Actions List */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={onOpenMala}
                className="w-full p-3.5 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <MalaBeadsMinimalIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Bước 1 • Lần Chuỗi Bồ Đề 108 Hạt
                    </h4>
                    <p className="text-[11px] text-[#7D6442]">Nhiếp tâm qua từng hạt chuỗi và danh hiệu Phật</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>

              <button
                type="button"
                onClick={onOpenBellFish}
                className="w-full p-3.5 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <WoodenFishMinimalIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Bước 2 • Mõ Nhịp Tự Động 50 / 68 / 88 BPM
                    </h4>
                    <p className="text-[11px] text-[#7D6442]">Giữ nhịp tụng kinh đều đặn không mỏi tay</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>

              <button
                type="button"
                onClick={onOpenPrayPeace}
                className="w-full p-3.5 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
                    <LotusLanternIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2E1E0F] group-hover:text-[#8C5500]">
                      Bước 3 • Thắp Đèn Hoa Đăng &amp; Hồi Hướng
                    </h4>
                    <p className="text-[11px] text-[#7D6442]">Lưu giữ lời nguyện vào Sổ Công Đức cá nhân</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7D6442] group-hover:text-[#8C5500]" />
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] text-xs text-[#8C5500] italic text-center font-serif">
            “Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sinh, đều trọn thành Phật đạo.”
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EIGHT DHARMA PRACTICE VEHICLES GRID (4 COLUMNS)                        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA]">
          <div>
            <h2 className="font-heading font-serif text-xl font-bold text-[#2E1E0F] flex items-center gap-2.5">
              <span>Phương Tiện Tu Tập</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500] border border-[#EEDBBA]">
                8 Pháp Khí
              </span>
            </h2>
            <p className="text-xs text-[#7D6442] mt-1">
              Pháp khí hành trì chuẩn mực — Tích lũy công đức và nuôi dưỡng bồ đề tâm mỗi ngày
            </p>
          </div>
        </div>

        {/* 4-Column Responsive Grid (2 rows x 4 cols = 8 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRACTICE_CARDS.map((card) => {
            const Icon = card.Icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3.8] p-4 flex flex-col justify-between border border-[#ECD9A8]/60 hover:border-[#E5C158] cursor-pointer active:scale-95 transition-all duration-300 hover:-translate-y-1 shadow-lg bg-cover bg-center select-none"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.42) 55%, rgba(0, 0, 0, 0.15) 100%), url('${card.image}')`,
                }}
              >
                {/* Top Row: Number Badge & Translucent Icon Badge (Matching layout) */}
                <div className="flex items-center justify-between gap-2">
                  <span className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-[#FFE79A] flex items-center justify-center shadow-sm">
                    {card.number}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/95 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Subtitle (Centered matching screenshot style) */}
                <div className="text-center px-1">
                  <h4 className="font-heading font-serif font-bold text-base text-white group-hover:text-[#FFE79A] transition-colors leading-tight drop-shadow-md">
                    {card.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed mt-1 drop-shadow-sm">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
