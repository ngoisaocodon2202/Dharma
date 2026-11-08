'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  X,
  Plus,
  Heart,
  Sparkles,
  Radio,
  Headphones,
  Music,
  BookOpen,
  Bell,
  Check,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { MalaBeadsModal } from '@/components/om-mani/OmManiInteractiveTools';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
  startMeditativeDrone,
  stopMeditativeDrone,
} from '@/lib/buddhistSounds';
import { OmManiDesktopPractice } from '@/components/om-mani/desktop/OmManiDesktopPractice';
import { cn } from '@/lib/utils';

// =============================================================================
// ICONS FOR PRACTICE VEHICLES
// =============================================================================
const MeditatingFigureIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="2.5" r="0.8" />
    <path d="M12 8c-2.4 0-4.2 1.6-4.5 3.8l-.5 3.2c-.1.6.4 1.1 1 1.1h8c.6 0 1.1-.5 1-1.1l-.5-3.2C16.2 9.6 14.4 8 12 8z" opacity="0.9" />
    <path d="M5.5 17.5c1.2-1.5 3.5-1.5 6.5-1.5s5.3 0 6.5 1.5c.8 1-1 2.5-3 2.5h-7c-2 0-3.8-1.5-3-2.5z" />
  </svg>
);

const MalaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="11" r="7" strokeDasharray="2 3" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M12 18v4M10 22h4" strokeLinecap="round" />
  </svg>
);

const WoodenFishIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4C7.58 4 4 7.58 4 12c0 2.5 1.15 4.73 2.95 6.2-.28-.7-.45-1.46-.45-2.2 0-3.31 2.69-6 6-6s6 2.69 6 6c0 .74-.17 1.5-.45 2.2C19.85 16.73 21 14.5 21 12c0-4.42-3.58-8-9-8z" />
    <circle cx="12" cy="16" r="2.5" opacity="0.6" />
    <path d="M8 12h8" stroke="#110D0A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PagodaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L9 6h6l-3-4zM6 8l-2 3h16l-2-3H6zm-1 5l-2 3h18l-2-3H5zm2 5v4h10v-4H7z" />
  </svg>
);

const LotusIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 3c-1.5 3-4 6-4 9 0 2.21 1.79 4 4 4s4-1.79 4-4c0-3-2.5-6-4-9z" opacity="0.9" />
    <path d="M6 14c-2-1.5-3-4-3-6 2.5.5 5 2.5 6 5-1.2.3-2.2.7-3 1z" />
    <path d="M18 14c2-1.5 3-4 3-6-2.5.5-5 2.5-6 5 1.2.3 2.2.7 3 1z" />
    <path d="M4 17c3-1 6-1 8 0 2-1 5-1 8 0-2 2-5 3-8 3s-6-1-8-3z" />
  </svg>
);

const MemorialBookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v7l3-2 3 2V4h5v16z" />
    <circle cx="12" cy="15" r="1.5" />
  </svg>
);

// =============================================================================
// DATA: THƯ VIỆN BỔN TÔN
// =============================================================================
interface BuddhaCard {
  id: string;
  name: string;
  title: string;
  image: string;
  mantra: string;
  vow: string;
}

const BUDDHAS_DATA: BuddhaCard[] = [
  {
    id: 'duoc-su',
    name: 'Đức Phật Dược Sư',
    title: 'Dược Sư Lưu Ly Quang Vương Như Lai',
    image: '/images/buddha_temple.jpg',
    mantra: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    vow: '12 Đại nguyện diệt trừ mọi tật bệnh thân tâm, ban phát ánh sáng lưu ly thanh tịnh cho muôn loài.',
  },
  {
    id: 'a-di-da',
    name: 'Đức Phật A Di Đà',
    title: 'Tiếp Dẫn Đạo Sư A Di Đà Phật',
    image: '/images/golden_buddha.jpg',
    mantra: 'Nam Mô A Di Đà Phật',
    vow: '48 Đại nguyện tiếp dẫn chúng sinh trì niệm danh hiệu về cõi Tây Phương Cực Lạc an vui giải thoát.',
  },
  {
    id: 'quan-am',
    name: 'Bồ Tát Quán Thế Âm',
    title: 'Đại Bi Quán Thế Âm Bồ Tát',
    image: '/images/quan_am_bodhisattva.jpg',
    mantra: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    vow: 'Tầm thanh cứu khổ, lắng nghe tiếng kêu cầu của muôn loài trong mười phương bằng lòng từ bi vô lượng.',
  },
  {
    id: 'dia-tang',
    name: 'Bồ Tát Địa Tạng',
    title: 'Đại Nguyện Địa Tạng Vương Bồ Tát',
    image: '/images/tran_nhan_tong_yentu.jpg',
    mantra: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vow: '“Địa ngục vị không, thệ bất thành Phật. Chúng sinh độ tận, phương chứng Bồ Đề.”',
  },
];

// =============================================================================
// MAIN COMPONENT: PRACTICE / TU TẬP PAGE (OM MANI APPSTORE UI)
// =============================================================================
export default function PracticePage() {
  const router = useRouter();

  // Modals state
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isMeditationModalOpen, setIsMeditationModalOpen] = useState(false);
  const [isChantMachineOpen, setIsChantMachineOpen] = useState(false);
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false);
  const [isPrayerPeaceOpen, setIsPrayerPeaceOpen] = useState(false);
  const [isPrayerRebirthOpen, setIsPrayerRebirthOpen] = useState(false);
  const [isBuddhasModalOpen, setIsBuddhasModalOpen] = useState(false);
  const [isMemorialBookOpen, setIsMemorialBookOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaCard | null>(null);

  // Sound & music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Meditation timer state inside modal
  const [meditationMinutes, setMeditationMinutes] = useState(15);
  const [meditationSecondsLeft, setMeditationSecondsLeft] = useState(15 * 60);
  const [isMeditationActive, setIsMeditationActive] = useState(false);

  // Chanting Machine state
  const [activeChantTrack, setActiveChantTrack] = useState('nam-mo-a-di-da-phat');
  const [isChantingPlaying, setIsChantingPlaying] = useState(false);

  // Sổ Giỗ Chạp storage
  const [memorials, setMemorials] = useState<
    { id: string; name: string; relation: string; lunarDate: string; solarDate: string }[]
  >([
    { id: '1', name: 'Ông Nội', relation: 'Ông', lunarDate: '15 Tháng 07', solarDate: 'Rằm Vu Lan' },
    { id: '2', name: 'Bà Ngoại', relation: 'Bà', lunarDate: '10 Tháng 10', solarDate: 'Tết Thường Tân' },
  ]);
  const [newMemName, setNewMemName] = useState('');
  const [newMemRelation, setNewMemRelation] = useState('');
  const [newMemDate, setNewMemDate] = useState('');

  // Toast feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Meditation timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMeditationActive && meditationSecondsLeft > 0) {
      timer = setInterval(() => {
        setMeditationSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsMeditationActive(false);
            playGrandTempleBellSound(0.5);
            showToast('Chúc mừng bạn đã hoàn thành thời thiền thanh tịnh!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMeditationActive, meditationSecondsLeft]);

  // Clean up ambient music on unmount
  useEffect(() => {
    return () => {
      stopMeditativeDrone();
    };
  }, []);

  // Toggle ambient music (Nhạc tu tập)
  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopMeditativeDrone();
      setIsMusicPlaying(false);
      showToast('Đã dừng nhạc thiền');
    } else {
      playBellSound(0.4);
      startMeditativeDrone(0.24);
      setIsMusicPlaying(true);
      showToast('Đang phát: Âm thanh thư giãn thiền môn (OM 136.1Hz)');
    }
  };

  return (
    <div className="min-h-screen bg-[#110D0A] text-[#FDFBF7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - 100% Locked Apple iOS Om Mani Layout                 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        {/* Container matching mobile aspect ratio */}
        <div className="max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-3 pb-32 space-y-6">

        {/* ========================================================================= */}
        {/* 1. TOP TITLE HEADER (MATCHING SCREENSHOT 1)                               */}
        {/* ========================================================================= */}
        <header className="pt-2">
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight leading-tight">
            Tu tập
          </h1>
        </header>

        {/* ========================================================================= */}
        {/* 2. HERO FEATURED CARD: THIỀN ĐỊNH (MATCHING SCREENSHOT 1)                 */}
        {/* ========================================================================= */}
        <section aria-label="Thiền định nổi bật">
          <div
            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[220px] sm:min-h-[250px] p-5 sm:p-6 flex flex-col justify-between group active:scale-[0.99] transition-all bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 50%, rgba(17, 13, 10, 0.2) 100%), url('/images/mindfulness_peace.jpg')",
            }}
          >
            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between relative z-10">
              {/* Badge: Nổi bật */}
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold border border-white/25 shadow-sm">
                Nổi bật
              </div>

              {/* Meditating Lotus Concentric Glow Icon */}
              <div className="relative w-10 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30" />
                <MeditatingFigureIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-4">
              <h2 className="font-heading font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Thiền định
              </h2>
              <p className="text-xs sm:text-sm font-medium text-stone-200 mt-1">
                Dành vài phút trở về với hơi thở
              </p>
              <p className="text-[11px] sm:text-xs text-stone-300/90 mt-0.5">
                Hôm nay bạn đã sẵn sàng tĩnh tâm?
              </p>

              {/* Big Golden Pill Button: [ ▶ Bắt đầu thiền ] */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.4);
                    setIsMeditationModalOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#F5D79E] hover:bg-[#FFE3AC] text-[#1E150F] font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  <span>Bắt đầu thiền</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION: PHƯƠNG TIỆN TU TẬP (10 CARDS - MATCHING SCREENSHOT 1 & 2)      */}
        {/* ========================================================================= */}
        <section aria-label="Phương tiện tu tập" className="space-y-3.5 pt-1">
          {/* Section Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-white tracking-wide">
            Phương tiện tu tập
          </h3>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">

            {/* CARD 1: Tràng hạt */}
            <div
              onClick={() => setIsMalaOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/monk_incense.jpg')",
              }}
            >
              {/* Top-Right Icon Badge */}
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <MalaIcon className="w-4 h-4" />
              </div>
              {/* Bottom Info */}
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Tràng hạt
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Lần hạt, trì niệm
                </p>
              </div>
            </div>

            {/* CARD 2: Chuông mõ */}
            <div
              onClick={() => setIsBellsModalOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/ancient_pagoda.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <WoodenFishIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Chuông mõ
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Thỉnh chuông, gõ mõ tịnh tâm
                </p>
              </div>
            </div>

            {/* CARD 3: Nghe kinh */}
            <div
              onClick={() => router.push('/phap-thoai')}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/buddha_meditation.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Nghe kinh
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Tải về, nghe không cần mạng
                </p>
              </div>
            </div>

            {/* CARD 4: Máy niệm Phật */}
            <div
              onClick={() => setIsChantMachineOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/golden_buddha.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Máy niệm Phật
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Niệm danh hiệu, trì chú
                </p>
              </div>
            </div>

            {/* CARD 5: Cầu an */}
            <div
              onClick={() => setIsPrayerPeaceOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/quan_am_bodhisattva.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <span className="text-xs">🙏</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Cầu an
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Nguyện cầu bình an
                </p>
              </div>
            </div>

            {/* CARD 6: Cầu siêu */}
            <div
              onClick={() => setIsPrayerRebirthOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/tran_nhan_tong_yentu.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <span className="text-xs">🙇</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Cầu siêu
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Thành tâm tưởng niệm
                </p>
              </div>
            </div>

            {/* CARD 7: Đi chùa */}
            <div
              onClick={() => router.push('/di-chua-online')}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/temple_sanctuary_bg.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <PagodaIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Đi chùa
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Lễ Phật cùng mọi người nơi chánh điện
                </p>
              </div>
            </div>

            {/* CARD 8: Thư viện Bổn Tôn */}
            <div
              onClick={() => setIsBuddhasModalOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/buddha_temple.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <LotusIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Thư viện Bổn Tôn
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Chiêm bái chư Phật
                </p>
              </div>
            </div>

            {/* CARD 9: Nhạc tu tập */}
            <div
              onClick={handleToggleMusic}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/lotus_pond.jpg')",
              }}
            >
              <div
                className={cn(
                  'self-end w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all',
                  isMusicPlaying
                    ? 'bg-amber-500 text-charcoal-950 border-amber-300 animate-pulse'
                    : 'bg-black/45 border-white/20 text-white'
                )}
              >
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Nhạc tu tập
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  {isMusicPlaying ? 'Đang phát thanh tịnh...' : 'Âm thanh thư giãn'}
                </p>
              </div>
            </div>

            {/* CARD 10: Sổ Giỗ Chạp */}
            <div
              onClick={() => setIsMemorialBookOpen(true)}
              className="relative rounded-3xl overflow-hidden aspect-[4/3.2] p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(17, 13, 10, 0.95) 0%, rgba(17, 13, 10, 0.45) 60%, rgba(17, 13, 10, 0.2) 100%), url('/images/incense_smoke.jpg')",
              }}
            >
              <div className="self-end w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <MemorialBookIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-tight">
                  Sổ Giỗ Chạp
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 truncate">
                  Ghi nhớ ngày giỗ người thân
                </p>
              </div>
            </div>

          </div>
        </section>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - Luxury Dark Gold Buddhist Sanctuary Layout         */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopPractice
          onOpenMala={() => setIsMalaOpen(true)}
          onOpenBellFish={() => setIsBellFishOpen(true)}
          onOpenChantMachine={() => setIsChantMachineOpen(true)}
          onOpenPrayPeace={() => setIsPrayPeaceOpen(true)}
          onOpenPrayRebirth={() => setIsPrayRebirthOpen(true)}
          onOpenOnlineTemple={() => setIsOnlineTempleOpen(true)}
          onOpenBuddhas={() => setIsBuddhaLibraryOpen(true)}
          onOpenMemorial={() => setIsMemorialOpen(true)}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          showToast={showToast}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL: 108 MALA BEADS                                                  */}
      {/* ========================================================================= */}
      <MalaBeadsModal isOpen={isMalaOpen} onClose={() => setIsMalaOpen(false)} />

      {/* ========================================================================= */}
      {/* 2. MODAL: THIỀN ĐỊNH QUICK SESSION                                        */}
      {/* ========================================================================= */}
      {isMeditationModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMeditationModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-6 text-white shadow-2xl animate-scale-in text-center space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsMeditationActive(false);
                setIsMeditationModalOpen(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-heading font-serif text-xl font-bold text-[#FFE082]">
                Thời Khóa Thiền Định
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Theo dõi hơi thở vào, hơi thở ra trong chánh niệm
              </p>
            </div>

            {/* Breathing Circle Indicator */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
              <div
                className={cn(
                  'absolute inset-0 rounded-full border-2 border-amber-400/30 transition-all duration-1000',
                  isMeditationActive ? 'scale-110 border-amber-400 animate-pulse' : 'scale-100'
                )}
              />
              <div
                className={cn(
                  'w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-400/10 border border-amber-400/40 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-transform duration-700',
                  isMeditationActive ? 'scale-105' : 'scale-100'
                )}
              >
                <span className="font-mono text-3xl font-black text-white">
                  {Math.floor(meditationSecondsLeft / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(meditationSecondsLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold mt-0.5">
                  {isMeditationActive ? 'Thở đều & Tĩnh tâm' : 'Sẵn sàng'}
                </span>
              </div>
            </div>

            {/* Time Presets */}
            {!isMeditationActive && (
              <div className="flex justify-center gap-2">
                {[5, 10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setMeditationMinutes(mins);
                      setMeditationSecondsLeft(mins * 60);
                    }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                      meditationMinutes === mins
                        ? 'bg-amber-600 text-white border border-amber-400'
                        : 'bg-black/40 text-stone-400 border border-white/5 hover:text-white'
                    )}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isMeditationActive) {
                    setIsMeditationActive(false);
                    showToast('Đã tạm dừng thời thiền');
                  } else {
                    playBellSound(0.5);
                    setIsMeditationActive(true);
                    showToast('Bắt đầu thời thiền. Nguyện thân tâm an lạc.');
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-charcoal-950 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                {isMeditationActive ? 'Tạm Dừng' : 'Bắt Đầu Tọa Thiền'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMeditationActive(false);
                  setMeditationSecondsLeft(meditationMinutes * 60);
                  playWoodenFishSound(0.4);
                }}
                className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                title="Đặt lại"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: MÁY NIỆM PHẬT                                                   */}
      {/* ========================================================================= */}
      {isChantMachineOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChantMachineOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <button
              type="button"
              onClick={() => {
                stopMeditativeDrone();
                setIsChantingPlaying(false);
                setIsChantMachineOpen(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082]">
                Máy Niệm Phật Trực Tuyến
              </h3>
              <p className="text-xs text-stone-300">
                Phát thanh âm niệm danh hiệu Phật &amp; trì chú liên tục
              </p>
            </div>

            {/* Chanting Tracks */}
            <div className="space-y-2">
              {[
                { id: 'nam-mo-a-di-da-phat', title: 'Nam Mô A Di Đà Phật', sub: 'Niệm Phật 4 chữ trang nghiêm' },
                { id: 'om-mani-padme-hum', title: 'Om Mani Padme Hum', sub: 'Lục Tự Đại Minh Chú tiếng Phạn' },
                { id: 'nam-mo-quan-the-am-bo-tat', title: 'Nam Mô Quán Thế Âm Bồ Tát', sub: 'Tầm thanh cứu khổ' },
                { id: 'duoc-su-quan-danh-chan-ngon', title: 'Dược Sư Quán Đảnh Chơn Ngôn', sub: 'Tiêu trừ tật bệnh, an lành' },
              ].map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setActiveChantTrack(track.id);
                    playBellSound(0.4);
                  }}
                  className={cn(
                    'p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between',
                    activeChantTrack === track.id
                      ? 'bg-amber-600/25 border-amber-400 text-white'
                      : 'bg-black/30 border-white/5 text-stone-400 hover:text-white'
                  )}
                >
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-100">{track.title}</h5>
                    <p className="text-[11px] text-stone-400 mt-0.5">{track.sub}</p>
                  </div>
                  {activeChantTrack === track.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Play Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isChantingPlaying) {
                    stopMeditativeDrone();
                    setIsChantingPlaying(false);
                    showToast('Đã dừng máy niệm Phật');
                  } else {
                    playBellSound(0.5);
                    startMeditativeDrone(0.25);
                    setIsChantingPlaying(true);
                    showToast('Đang phát máy niệm Phật thanh tịnh');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-charcoal-950 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isChantingPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isChantingPlaying ? 'Tạm Dừng Máy Niệm' : 'Bật Máy Niệm Phật'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CHUÔNG MÕ TỊNH TÂM                                              */}
      {/* ========================================================================= */}
      {isBellsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBellsModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-6 text-white shadow-2xl animate-scale-in text-center space-y-5">
            <button
              type="button"
              onClick={() => setIsBellsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-heading font-serif text-xl font-bold text-[#FFE082]">
                Chuông &amp; Mõ Tịnh Tâm
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Chạm vào chuông đồng hoặc mõ gỗ để thỉnh âm thanh thanh tịnh
              </p>
            </div>

            {/* 2 Big Strike Pads */}
            <div className="grid grid-cols-2 gap-4 my-2">
              {/* Bell Strike Pad */}
              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  showToast('Tiếng chuông ngân vang, phiền não đoạn tận');
                }}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#332217] to-[#1E130B] border border-amber-500/30 hover:border-amber-400 active:scale-90 transition-all shadow-xl flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl group-hover:scale-110 transition-transform mb-2">
                  🔔
                </div>
                <span className="font-bold text-sm text-stone-100">Thỉnh Chuông</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Đại Hồng Chung</span>
              </button>

              {/* Wooden Fish Strike Pad */}
              <button
                type="button"
                onClick={() => {
                  playWoodenFishSound(0.7);
                  showToast('Cốc! Tâm an tịnh từng phút giây');
                }}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#332217] to-[#1E130B] border border-amber-500/30 hover:border-amber-400 active:scale-90 transition-all shadow-xl flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl group-hover:scale-110 transition-transform mb-2">
                  🪵
                </div>
                <span className="font-bold text-sm text-stone-100">Gõ Mõ</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Mõ Gỗ Mộc</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 italic">
              Âm thanh được tổng hợp chuẩn Web Audio độ trễ bằng 0
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: CẦU AN                                                          */}
      {/* ========================================================================= */}
      {isPrayerPeaceOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerPeaceOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <button
              type="button"
              onClick={() => setIsPrayerPeaceOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-2xl">🙏</span>
              <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082] mt-1">
                Phòng Cầu An — Nguyện Bình An
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Dâng lời ước nguyện thiện lành trước Tam Bảo
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Họ tên người cầu an</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An, Pháp danh Tâm Thiện..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Lời khấn nguyện</label>
                <textarea
                  rows={3}
                  placeholder="Nguyện cầu mười phương Chư Phật gia hộ cho cha mẹ và gia đình thân tâm an lạc, tai qua nạn khỏi, tật bệnh tiêu trừ..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  showToast('Đã dâng sớ cầu an lên Tam Bảo. Nguyện sở cầu như ý!');
                  setIsPrayerPeaceOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-charcoal-950 font-bold shadow-md active:scale-95 transition-all mt-2"
              >
                Dâng Lời Khấn Nguyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: CẦU SIÊU                                                         */}
      {/* ========================================================================= */}
      {isPrayerRebirthOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerRebirthOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <button
              type="button"
              onClick={() => setIsPrayerRebirthOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-2xl">🙇</span>
              <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082] mt-1">
                Phòng Cầu Siêu — Hồi Hướng
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Thành tâm hồi hướng công đức cho hương linh quá vãng
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Họ tên hương linh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hương linh Cụ Bà Lê Thị Hoa..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Lời hồi hướng</label>
                <textarea
                  rows={3}
                  placeholder="Nguyện nương nhờ oai lực Địa Tạng Bồ Tát và chư Phật mười phương tiếp dẫn hương linh vãng sinh Tịnh Độ, siêu sinh an lạc quốc..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  showToast('Đã gửi lời hồi hướng công đức. Nguyện hương linh siêu thăng Tịnh Độ!');
                  setIsPrayerRebirthOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-charcoal-950 font-bold shadow-md active:scale-95 transition-all mt-2"
              >
                Gửi Lời Hồi Hướng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: THƯ VIỆN BỔN TÔN                                                */}
      {/* ========================================================================= */}
      {isBuddhasModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBuddhasModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div>
                <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082]">
                  Thư Viện Bổn Tôn
                </h3>
                <p className="text-xs text-stone-400">Chiêm bái &amp; đảnh lễ chư Phật, chư Bồ Tát</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBuddhasModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3">
              {BUDDHAS_DATA.map((buddha) => (
                <div
                  key={buddha.id}
                  onClick={() => {
                    playBellSound(0.4);
                    setSelectedBuddha(buddha);
                  }}
                  className="flex gap-3.5 items-center p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-400/40 cursor-pointer active:scale-98 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                    <img src={buddha.image} alt={buddha.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-heading font-bold text-sm text-stone-100">{buddha.name}</h5>
                    <p className="text-xs text-amber-300 font-mono italic truncate">{buddha.mantra}</p>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{buddha.vow}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBuddhasModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: SỔ GIỖ CHẠP                                                     */}
      {/* ========================================================================= */}
      {isMemorialBookOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMemorialBookOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <button
              type="button"
              onClick={() => setIsMemorialBookOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082]">
                Sổ Giỗ Chạp Gia Tiên
              </h3>
              <p className="text-xs text-stone-300">
                Ghi nhớ ngày giỗ người thân, nhắc nhở hiếu hạnh
              </p>
            </div>

            {/* Memorial List */}
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {memorials.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-white">
                      {m.name} ({m.relation})
                    </h5>
                    <p className="text-amber-300 font-mono mt-0.5">
                      Âm lịch: {m.lunarDate} {m.solarDate && `• ${m.solarDate}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMemorials((prev) => prev.filter((item) => item.id !== m.id));
                      showToast('Đã xóa mục giỗ chạp');
                    }}
                    className="text-stone-500 hover:text-red-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Section */}
            <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
              <input
                type="text"
                placeholder="Tên người thân (Ví dụ: Cụ Cố Nội)"
                value={newMemName}
                onChange={(e) => setNewMemName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-stone-700 text-white placeholder-stone-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Quan hệ (Ông/Bà/Bố/Mẹ)"
                  value={newMemRelation}
                  onChange={(e) => setNewMemRelation(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-stone-700 text-white placeholder-stone-500"
                />
                <input
                  type="text"
                  placeholder="Ngày Âm (15/07)"
                  value={newMemDate}
                  onChange={(e) => setNewMemDate(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-stone-700 text-white placeholder-stone-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newMemName.trim()) return;
                  const item = {
                    id: Date.now().toString(),
                    name: newMemName.trim(),
                    relation: newMemRelation.trim() || 'Người thân',
                    lunarDate: newMemDate.trim() || 'Đang cập nhật',
                    solarDate: 'Nhắc nhở hàng năm',
                  };
                  setMemorials((prev) => [...prev, item]);
                  setNewMemName('');
                  setNewMemRelation('');
                  setNewMemDate('');
                  playWoodenFishSound(0.5);
                  showToast('Đã lưu ngày giỗ chạp gia tiên');
                }}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
              >
                + Thêm Ngày Giỗ Mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING TOAST                                                            */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2 rounded-2xl bg-[#24130A]/95 border border-[#D4AF37] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
