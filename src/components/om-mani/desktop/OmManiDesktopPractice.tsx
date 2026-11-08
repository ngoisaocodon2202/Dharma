'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bell,
  Heart,
  Sparkles,
  Headphones,
  Radio,
  BookOpen,
  Calendar,
  Flame,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
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
  isMusicPlaying,
  onToggleMusic,
  showToast,
}: OmManiDesktopPracticeProps) {
  const router = useRouter();

  // Desktop In-page Zen Meditation Timer
  const [meditationMinutes, setMeditationMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playGrandTempleBellSound(0.6);
      showToast('Thời khóa thiền định viên mãn. Thở vào tâm bình an.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, showToast]);

  const handleSelectMinutes = (m: number) => {
    setMeditationMinutes(m);
    setSecondsRemaining(m * 60);
    setIsTimerRunning(false);
    playBellSound(0.3);
  };

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      showToast('Đã tạm dừng thiền định');
    } else {
      setIsTimerRunning(true);
      playGrandTempleBellSound(0.5);
      showToast('Bắt đầu thời khóa thiền định. Thả lỏng thân tâm...');
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(meditationMinutes * 60);
    playBellSound(0.3);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const PRACTICE_CARDS = [
    {
      id: 'trang-hat',
      title: 'Tràng Hạt',
      subtitle: 'Lần hạt, trì niệm danh hiệu',
      badge: '📿',
      image: '/images/buddha_temple.jpg',
      action: onOpenMala,
    },
    {
      id: 'chuong-mo',
      title: 'Chuông Mõ',
      subtitle: 'Thỉnh chuông, gõ mõ tịnh tâm',
      badge: '🔔',
      image: '/images/ancient_pagoda.jpg',
      action: onOpenBellFish,
    },
    {
      id: 'nghe-kinh',
      title: 'Nghe Kinh',
      subtitle: 'Tải về, nghe không cần mạng',
      badge: '🎧',
      image: '/images/buddha_meditation.jpg',
      action: () => router.push('/phap-thoai'),
    },
    {
      id: 'may-niem-phat',
      title: 'Máy Niệm Phật',
      subtitle: 'Niệm danh hiệu, trì chú 24/7',
      badge: '📻',
      image: '/images/golden_buddha.jpg',
      action: onOpenChantMachine,
    },
    {
      id: 'cau-an',
      title: 'Cầu An',
      subtitle: 'Nguyện cầu bình an cho gia quyến',
      badge: '🙏',
      image: '/images/buddha_teaching.jpg',
      action: onOpenPrayPeace,
    },
    {
      id: 'cau-sieu',
      title: 'Cầu Siêu',
      subtitle: 'Thành tâm tưởng niệm tiên tổ',
      badge: '🕯️',
      image: '/images/pagoda_sunset.jpg',
      action: onOpenPrayRebirth,
    },
    {
      id: 'di-chua',
      title: 'Đi Chùa Online',
      subtitle: 'Lễ Phật nơi chánh điện trực tuyến',
      badge: '🏛️',
      image: '/images/lotus_pond.jpg',
      action: onOpenOnlineTemple,
    },
    {
      id: 'thu-vien-bon-ton',
      title: 'Thư Viện Bổn Tôn',
      subtitle: 'Chiêm bái chư Phật & Bồ Tát',
      badge: '🪷',
      image: '/images/buddha_library.jpg',
      action: onOpenBuddhas,
    },
    {
      id: 'nhac-tu-tap',
      title: 'Nhạc Tu Tập',
      subtitle: isMusicPlaying ? 'Đang phát thanh âm thiền môn' : 'Âm thanh thư giãn thiền môn',
      badge: '🎶',
      image: '/images/mindfulness_peace.jpg',
      action: onToggleMusic,
      isHighlighted: isMusicPlaying,
    },
    {
      id: 'so-gio-chap',
      title: 'Sổ Giỗ Chạp',
      subtitle: 'Ghi nhớ ngày giỗ người thân',
      badge: '📜',
      image: '/images/ancient_pagoda.jpg',
      action: onOpenMemorial,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TITLE                                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1F140D] flex items-center justify-center">
              <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-serif text-2xl font-black text-white flex items-center gap-2.5">
              <span>Phương Tiện Tu Tập &amp; Chánh Niệm</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Mười pháp bảo trợ duyên giúp lắng đọng thân tâm, định tĩnh trí tuệ và nuôi dưỡng từ bi
            </p>
          </div>
        </div>

        {/* Global Sound Quick Control */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMusic}
            className={cn(
              'px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md',
              isMusicPlaying
                ? 'bg-amber-600/30 border-amber-400 text-amber-200'
                : 'bg-[#1C140E] border-white/10 text-stone-300 hover:text-white'
            )}
          >
            <Volume2 className={cn('w-4 h-4', isMusicPlaying && 'animate-pulse text-amber-400')} />
            <span>{isMusicPlaying ? 'Đang Phát Nhạc Thiền OM' : 'Bật Nhạc Thiền OM'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playGrandTempleBellSound(0.5);
              showToast('Thở vào tâm tĩnh lặng, thở ra miệng mỉm cười');
            }}
            className="px-4 py-2 rounded-2xl bg-[#1C140E] border border-amber-500/40 hover:border-amber-300 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Bell className="w-4 h-4" />
            <span>Thỉnh Đại Hồng Chung</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO ZEN MEDITATION STUDIO (7 COLS & 5 COLS)                           */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive Meditation Clock & Breathing Guide (7 cols) */}
        <div className="col-span-12 xl:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-[#241710] via-[#1C120C] to-[#120B07] border border-amber-500/30 shadow-2xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold uppercase tracking-wider">
                Thời Khóa Thiền Định
              </span>
              <span className="text-xs text-amber-200/70 font-serif italic">
                &ldquo;Dành vài phút trở về với hơi thở&rdquo;
              </span>
            </div>

            <div>
              <h2 className="font-heading font-serif text-2xl font-bold text-white">
                Thiền Định &amp; Theo Dõi Hơi Thở
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Lắng nghe từng hơi thở vào, hơi thở ra. Đưa tâm trở về với thân, an trú trọn vẹn trong hiện tại.
              </p>
            </div>
          </div>

          {/* Interactive Breathing Visualizer & Clock */}
          <div className="relative z-10 flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Animated pulsating halo */}
              <div
                className={cn(
                  'absolute inset-0 rounded-full border border-amber-400/30 transition-all duration-1000',
                  isTimerRunning ? 'scale-125 border-amber-400 animate-ping opacity-30' : 'scale-100'
                )}
              />
              <div
                className={cn(
                  'absolute inset-4 rounded-full border-2 border-dashed border-amber-400/40 transition-all duration-1000',
                  isTimerRunning ? 'animate-[spin_40s_linear_infinite]' : ''
                )}
              />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-amber-600/20 via-amber-500/10 to-transparent blur-md" />

              {/* Central Clock Display */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#FFE082] tracking-wider">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[11px] font-semibold text-amber-200/80 mt-1">
                  {isTimerRunning ? 'Hít vào... Thở ra...' : 'Sẵn Sàng Tĩnh Tâm'}
                </span>
              </div>
            </div>

            {/* Preset Time Buttons */}
            <div className="flex items-center gap-2 mt-4">
              {[5, 10, 15, 20, 30].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMinutes(m)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    meditationMinutes === m
                      ? 'bg-amber-500 text-charcoal-950 shadow-md font-black'
                      : 'bg-black/40 text-stone-300 hover:text-white hover:bg-black/60 border border-white/5'
                  )}
                >
                  {m} phút
                </button>
              ))}
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-amber-500/15">
            <button
              type="button"
              onClick={handleToggleTimer}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38328] hover:from-[#FFE082] hover:to-[#D4AF37] text-charcoal-950 font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Tạm Dừng Thiền</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt Đầu Thời Khóa</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Đặt lại đồng hồ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Practice Sanctuary Spotlight & Quick Stats (5 cols) */}
        <div className="col-span-12 xl:col-span-5 p-8 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-serif font-bold text-sm text-[#FFE082]">
                  Tinh Tấn Mỗi Ngày
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Đang trực tuyến
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Mỗi ngày dành ít nhất 5 đến 15 phút thực hành một trong mười phương tiện dưới đây sẽ giúp tạo lập trường năng lượng an lành, xua tan phiền não và tích lũy công đức cho tự thân cùng gia đình.
            </p>

            {/* Quick Actions List */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={onOpenMala}
                className="w-full p-3.5 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📿</span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200">
                      108 Hạt Chuỗi Niệm Phật 3D
                    </h4>
                    <p className="text-[11px] text-stone-400">Trì niệm danh hiệu Bổn Sư, Di Đà, Quán Âm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onOpenChantMachine}
                className="w-full p-3.5 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📻</span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200">
                      Máy Niệm Phật 24/7
                    </h4>
                    <p className="text-[11px] text-stone-400">Tuyển tập 10 bài niệm danh hiệu trang nghiêm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>

              <button
                type="button"
                onClick={onOpenOnlineTemple}
                className="w-full p-3.5 rounded-2xl bg-[#20150E] border border-white/5 hover:border-amber-400/40 text-left flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏛️</span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-200">
                      Chánh Điện Đi Chùa Online
                    </h4>
                    <p className="text-[11px] text-stone-400">Dâng hoa, bái Phật cùng đạo hữu khắp năm châu</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-amber-200/90 italic text-center font-serif">
            &ldquo;Tâm là chủ của mọi hành động. Tâm an lạc thì hạnh phúc tự nhiên nối tiếp như bóng với hình.&rdquo;
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TEN PRACTICE VEHICLES GRID (5 COLUMNS OR 4 COLUMNS RESPONSIVE)          */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div>
            <h2 className="font-heading font-serif text-xl font-bold text-white flex items-center gap-2">
              <span>Mười Phương Tiện Tu Tập</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                10 phương tiện
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Chọn phương tiện phù hợp với thời gian và duyên lành của bạn hôm nay
            </p>
          </div>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {PRACTICE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={card.action}
              className={cn(
                'group relative rounded-3xl overflow-hidden aspect-[4/4.2] p-4 flex flex-col justify-between border cursor-pointer active:scale-95 transition-all duration-300 hover:-translate-y-1 shadow-xl bg-cover bg-center',
                card.isHighlighted
                  ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-950/50'
                  : 'border-white/10 hover:border-amber-400/60'
              )}
              style={{
                backgroundImage: `linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.55) 55%, rgba(17, 13, 10, 0.25) 100%), url('${card.image}')`,
              }}
            >
              {/* Top Badge Icon */}
              <div className="self-end w-9 h-9 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center text-base shadow-md group-hover:scale-110 transition-transform">
                {card.badge}
              </div>

              {/* Bottom Card Title & Subtitle */}
              <div className="space-y-1">
                <h4 className="font-heading font-serif font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  {card.title}
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

