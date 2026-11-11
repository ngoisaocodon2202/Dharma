'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  X,
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
  MalaBeadsModal,
  recordDharmaMerit,
  getDharmaMeritLedger,
  DharmaMeritEntry,
} from '@/components/om-mani/OmManiInteractiveTools';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
  startMeditativeDrone,
  stopMeditativeDrone,
} from '@/lib/buddhistSounds';
import { OmManiDesktopPractice } from '@/components/om-mani/desktop/OmManiDesktopPractice';
import { BuddhasGalleryModal } from '@/components/buddhas/BuddhasGalleryModal';
import { cn } from '@/lib/utils';

export default function PracticePage() {
  const router = useRouter();


  // Modals state
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isMeditationModalOpen, setIsMeditationModalOpen] = useState(false);
  const [isChantMachineOpen, setIsChantMachineOpen] = useState(false);
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false);
  const [isPrayerPeaceOpen, setIsPrayerPeaceOpen] = useState(false);
  const [isPrayerRebirthOpen, setIsPrayerRebirthOpen] = useState(false);
  const [prayerTab, setPrayerTab] = useState<'sieu' | 'an'>('sieu');
  const [isBuddhasModalOpen, setIsBuddhasModalOpen] = useState(false);
  const [isMemorialBookOpen, setIsMemorialBookOpen] = useState(false);
  const [isMeritLedgerOpen, setIsMeritLedgerOpen] = useState(false);

  // Sound & music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Anapanasati 4-4-6 Meditation timer state inside modal
  const [meditationMinutes, setMeditationMinutes] = useState(15);
  const [meditationSecondsLeft, setMeditationSecondsLeft] = useState(15 * 60);
  const [isMeditationActive, setIsMeditationActive] = useState(false);
  const [breathTick, setBreathTick] = useState(0);

  // Auto-Rhythm Wooden Fish BPM inside Chuông Mõ Modal
  const [isAutoFishPlaying, setIsAutoFishPlaying] = useState(false);
  const [fishBpm, setFishBpm] = useState<50 | 68 | 88>(68);
  const [fishBeatCount, setFishBeatCount] = useState(0);

  // Chanting Machine state
  const [activeChantTrack, setActiveChantTrack] = useState('nam-mo-a-di-da-phat');
  const [isChantingPlaying, setIsChantingPlaying] = useState(false);

  // Prayer inputs
  const [peaceName, setPeaceName] = useState('');
  const [peaceWish, setPeaceWish] = useState('');
  const [rebirthName, setRebirthName] = useState('');
  const [rebirthWish, setRebirthWish] = useState('');

  // Merit Ledger entries
  const [meritEntries, setMeritEntries] = useState<DharmaMeritEntry[]>([]);

  // Sổ Giỗ Chạp storage
  const [memorials, setMemorials] = useState<
    { id: string; name: string; relation: string; lunarDate: string; solarDate: string }[]
  >([
    { id: '1', name: 'Ông Nội Nguyễn Văn Phúc', relation: 'Tổ phụ', lunarDate: '15 Tháng 07', solarDate: 'Rằm Vu Lan' },
    { id: '2', name: 'Bà Ngoại Lê Thị Hiền', relation: 'Tổ mẫu', lunarDate: '10 Tháng 10', solarDate: 'Lễ Thường Tân' },
  ]);
  const [newMemName, setNewMemName] = useState('');
  const [newMemRelation, setNewMemRelation] = useState('');
  const [newMemDate, setNewMemDate] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    setMeritEntries(getDharmaMeritLedger());
  }, [isMeritLedgerOpen, isPrayerPeaceOpen, isPrayerRebirthOpen, isMeditationModalOpen]);

  // Meditation timer countdown + 14s Anapanasati breathing cycle
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMeditationActive && meditationSecondsLeft > 0) {
      timer = setInterval(() => {
        setBreathTick((t) => (t + 1) % 14);
        setMeditationSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsMeditationActive(false);
            playGrandTempleBellSound(0.6);
            recordDharmaMerit({
              type: 'meditation',
              title: `Hoàn Mãn Tọa Thiền Anapanasati (${meditationMinutes} phút)`,
              detail: 'Thực hành quán niệm hơi thở 4-4-6 định tĩnh thân tâm',
              meritPoints: meditationMinutes * 3,
            });
            showToast('Thời khóa tọa thiền viên mãn! Đã ghi nhận vào Sổ Công Đức.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMeditationActive, meditationSecondsLeft, meditationMinutes]);

  // Auto-Rhythm Wooden Fish Interval (50 / 68 / 88 BPM)
  useEffect(() => {
    let fishTimer: NodeJS.Timeout | null = null;
    if (isAutoFishPlaying && isBellsModalOpen) {
      const intervalMs = Math.round((60 / fishBpm) * 1000);
      fishTimer = setInterval(() => {
        playWoodenFishSound(0.55);
        setFishBeatCount((c) => c + 1);
      }, intervalMs);
    }
    return () => {
      if (fishTimer) clearInterval(fishTimer);
    };
  }, [isAutoFishPlaying, fishBpm, isBellsModalOpen]);

  useEffect(() => {
    return () => {
      stopMeditativeDrone();
    };
  }, []);

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopMeditativeDrone();
      setIsMusicPlaying(false);
      showToast('Đã tạm dừng Tần Số Thiền 432Hz');
    } else {
      playBellSound(0.4);
      startMeditativeDrone(0.24);
      setIsMusicPlaying(true);
      showToast('Đang phát: Tần Số Thiền 432Hz Tịnh Hóa Thân Tâm');
    }
  };

  const getBreathingPhaseText = () => {
    if (!isMeditationActive) return 'Nhịp Thở Chánh Niệm 4s - 4s - 6s';
    if (breathTick < 4) return `Hít Vào Biết Hơi Thở Vào (${4 - breathTick}s)`;
    if (breathTick < 8) return `An Trú Tĩnh Lặng (${8 - breathTick}s)`;
    return `Thở Ra Buông Xả Phiền Não (${14 - breathTick}s)`;
  };

  const MOBILE_VEHICLES = [
    {
      id: 'thu-vien-bon-ton',
      title: 'Thư viện Bổn Tôn',
      subtitle: 'Chiêm bái chư Phật',
      image: '/images/buddhas/duc-phat-thich-ca.png',
      Icon: LotusMinimalIcon,
      onClick: () => router.push('/thu-vien-bon-ton'),
    },
    {
      id: 'di-chua',
      title: 'Đi chùa',
      subtitle: 'Lễ Phật cùng mọi người nơi chánh điện',
      image: '/images/temple_sanctuary_bg.jpg',
      Icon: PagodaMinimalIcon,
      onClick: () => router.push('/di-chua-online'),
    },
    {
      id: 'cau-sieu',
      title: 'Cầu siêu',
      subtitle: 'Thành tâm tưởng niệm',
      image: '/images/tran_nhan_tong_yentu.jpg',
      Icon: IncenseAltarIcon,
      onClick: () => {
        setPrayerTab('sieu');
        setIsPrayerRebirthOpen(true);
      },
    },
    {
      id: 'may-niem-phat',
      title: 'Máy niệm Phật',
      subtitle: 'Niệm danh hiệu, trì chú',
      image: '/images/golden_buddha_altar.jpg',
      Icon: TempleBellIcon,
      onClick: () => setIsChantMachineOpen(true),
    },
    {
      id: 'nghe-kinh',
      title: 'Nghe kinh',
      subtitle: 'Tải về, nghe không cần mạng',
      image: '/images/buddha_meditation.jpg',
      Icon: SutraScrollIcon,
      onClick: () => setIsChantMachineOpen(true),
    },
    {
      id: 'trang-hat',
      title: 'Tràng hạt',
      subtitle: 'Lần hạt, trì niệm',
      image: '/images/monk_incense.jpg',
      Icon: MalaBeadsMinimalIcon,
      onClick: () => setIsMalaOpen(true),
    },
    {
      id: 'chuong-mo',
      title: 'Chuông mõ',
      subtitle: 'Thỉnh chuông, gõ mõ tịnh tâm',
      image: '/images/ancient_pagoda.jpg',
      Icon: WoodenFishMinimalIcon,
      onClick: () => setIsBellsModalOpen(true),
    },
    {
      id: 'so-gio-chap',
      title: 'Sổ Giỗ Chạp',
      subtitle: 'Ghi nhớ ngày giỗ người thân',
      image: '/images/sutra_book.jpg',
      Icon: BodhiLeafIcon,
      onClick: () => setIsMemorialBookOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2E1E0F] selection:bg-[#F5C542]/30 selection:text-[#8C5500]">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - DHARMA REACT NATIVE SUPER-APP PRACTICE               */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        <div className="max-w-md sm:max-w-lg mx-auto px-3.5 sm:px-4 pt-3 pb-32 space-y-4">
          {/* 1. SAFE-AREA HEADER — Single-Line Guaranteed */}
          <header className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_16px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                  <MeditatingMonkOutlineIcon className="w-5 h-5 text-[#8C5500]" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-normal text-[#8C5500] block whitespace-nowrap">
                  DHARMA • TAM ĐẲNG HÀNH TRÌ
                </span>
                <h1 className="font-heading font-serif text-base sm:text-xl font-bold text-[#2E1E0F] leading-tight whitespace-nowrap">
                  Định Tâm &amp; Hành Trì
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playWoodenFishSound(0.3);
                setIsMeritLedgerOpen(true);
              }}
              className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#8C5500] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
            >
              <BodhiLeafIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Sổ Công Đức</span>
            </button>
          </header>

          {/* 2. HERO CARD: ANAPANASATI BREATHING MEDITATION */}
          <section aria-label="Phòng thiền hơi thở chánh niệm">
            <div
              className="relative rounded-3xl overflow-hidden border border-[#EEDBBA] shadow-md p-4 flex flex-col justify-between gap-3 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.2) 100%), url('/images/buddha_meditation.jpg')",
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#8C5500] text-[10px] font-bold uppercase tracking-wider border border-[#ECD9A8] whitespace-nowrap">
                  Thiền Quán Hơi Thở 4-4-6
                </div>
                <div className="relative w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white shadow-sm shrink-0">
                  <MeditatingMonkOutlineIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-white leading-tight whitespace-nowrap truncate">
                  Thiền Hơi Thở Anapanasati
                </h3>
                <p className="text-[11px] text-white/85 whitespace-nowrap truncate">
                  Hít vào 4s • An trú chánh niệm 4s • Thở ra buông xả 6s
                </p>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playBellSound(0.4);
                      setIsMeditationModalOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Bắt Đầu Thiền</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playGrandTempleBellSound(0.5);
                      showToast('Tiếng Đại Hồng Chung ngân vang • Tâm bình an');
                    }}
                    className="py-2 px-3 rounded-xl bg-white/95 border border-[#ECD9A8] text-[#8C5500] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Thỉnh Chuông</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. SECTION TITLE: PHƯƠNG TIỆN TU TẬP (100% MATCHING SCREENSHOT) */}
          <div className="pt-1">
            <h2 className="font-heading font-serif text-lg sm:text-xl font-bold text-[#2E1E0F]">
              Phương tiện tu tập
            </h2>
          </div>

          {/* 4. 2-COLUMN GRID OF THE 8 PRACTICE VEHICLES IN EXACT SCREENSHOT ORDER */}
          <section aria-label="Phương tiện tu tập">
            <div className="grid grid-cols-2 gap-3">
              {MOBILE_VEHICLES.map((item) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="relative rounded-3xl overflow-hidden aspect-[1.28/1] p-3.5 flex flex-col justify-between border border-[#ECD9A8]/50 hover:border-[#E5C158] cursor-pointer group active:scale-95 transition-all shadow-md bg-cover bg-center select-none"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.38) 55%, rgba(0, 0, 0, 0.15) 100%), url('${item.image}')`,
                    }}
                  >
                    {/* Top Right Translucent Icon Badge (Matching screenshot 100%) */}
                    <div className="flex justify-end">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/95 shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    {/* Center / Bottom Title and Subtitle (Matching screenshot 100%) */}
                    <div className="text-center px-1 pb-1">
                      <h4 className="font-heading font-serif font-bold text-sm sm:text-base text-white drop-shadow-md leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-white/80 drop-shadow-sm mt-0.5 leading-snug line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - DHARMA RADIANT GOLD PRACTICE SANCTUARY             */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopPractice
          onOpenMala={() => setIsMalaOpen(true)}
          onOpenBellFish={() => setIsBellsModalOpen(true)}
          onOpenChantMachine={() => setIsChantMachineOpen(true)}
          onOpenPrayPeace={() => setIsPrayerPeaceOpen(true)}
          onOpenPrayRebirth={() => setIsPrayerRebirthOpen(true)}
          onOpenOnlineTemple={() => router.push('/di-chua-online')}
          onOpenBuddhas={() => router.push('/thu-vien-bon-ton')}
          onOpenMemorial={() => setIsMemorialBookOpen(true)}
          onOpenMeritLedger={() => setIsMeritLedgerOpen(true)}
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
      {/* 2. MODAL: PHÒNG THIỀN HƠI THỞ ANAPANASATI 4-4-6                           */}
      {/* ========================================================================= */}
      {isMeditationModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMeditationModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-6 text-[#2E1E0F] shadow-2xl text-center space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsMeditationActive(false);
                setIsMeditationModalOpen(false);
              }}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5500] block">
                THIỀN QUÁN HƠI THỞ ANAPANASATI
              </span>
              <h3 className="font-heading font-serif text-xl font-bold text-[#2E1E0F] mt-1">
                Phòng Thiền Hơi Thở 4-4-6
              </h3>
              <p className="text-xs text-[#6A5234] mt-1">
                {getBreathingPhaseText()}
              </p>
            </div>

            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-3">
              <div
                className={cn(
                  'absolute inset-0 rounded-full border-2 border-[#EEDBBA] transition-all duration-1000',
                  isMeditationActive && breathTick < 4
                    ? 'scale-115 border-[#E5C158]'
                    : isMeditationActive && breathTick >= 8
                    ? 'scale-95 border-[#EEDBBA]'
                    : 'scale-105'
                )}
              />
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#F5C542]/25 to-[#FFD966]/10 border border-[#ECD9A8] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,197,66,0.25)]">
                <span className="font-mono text-3xl font-black text-[#8C5500]">
                  {Math.floor(meditationSecondsLeft / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(meditationSecondsLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#2E1E0F] uppercase tracking-wider font-bold mt-1">
                  {isMeditationActive ? 'Đang Thiền Định' : 'Sẵn Sàng'}
                </span>
              </div>
            </div>

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
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                      meditationMinutes === mins
                        ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505]'
                        : 'bg-white text-[#7D6442] border border-[#EEDBBA]'
                    )}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isMeditationActive) {
                    setIsMeditationActive(false);
                    showToast('Đã tạm dừng thời thiền');
                  } else {
                    playGrandTempleBellSound(0.5);
                    setIsMeditationActive(true);
                    showToast('Bắt đầu thiền hơi thở • Nguyện thân tâm an lạc');
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm shadow-md cursor-pointer"
              >
                {isMeditationActive ? 'Tạm Dừng' : 'Bắt Đầu Tọa Thiền'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMeditationActive(false);
                  setMeditationSecondsLeft(meditationMinutes * 60);
                  setBreathTick(0);
                  playWoodenFishSound(0.4);
                }}
                className="p-3 rounded-2xl bg-white border border-[#EEDBBA] text-[#8C5500] cursor-pointer"
                title="Đặt lại"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: PHÁP ÂM NIỆM PHẬT & THẦN CHÚ                                    */}
      {/* ========================================================================= */}
      {isChantMachineOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChantMachineOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => {
                stopMeditativeDrone();
                setIsChantingPlaying(false);
                setIsChantMachineOpen(false);
              }}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] mb-2">
                <TempleBellIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                Pháp Âm Niệm Phật &amp; Trì Chú
              </h3>
              <p className="text-xs text-[#6A5234]">
                Thanh âm niệm hồng danh chư Phật &amp; thần chú tịnh hóa
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'nam-mo-a-di-da-phat', title: 'Nam Mô A Di Đà Phật', sub: 'Niệm Phật Tịnh Độ tông trang nghiêm' },
                { id: 'nam-mo-bon-su', title: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật', sub: 'Tưởng niệm ân đức Đạo Sư Giác Ngộ' },
                { id: 'nam-mo-quan-the-am', title: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát', sub: 'Nuôi dưỡng tâm đại bi cứu khổ' },
                { id: 'duoc-su-chan-ngon', title: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật', sub: 'Tiêu trừ tật bệnh, thân tâm an lạc' },
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
                      ? 'bg-[#FFF4D0] border-[#E5C158] text-[#2E1E0F]'
                      : 'bg-white border-[#F2E5C7] text-[#7D6442]'
                  )}
                >
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#2E1E0F]">{track.title}</h5>
                    <p className="text-[11px] text-[#6A5234] mt-0.5">{track.sub}</p>
                  </div>
                  {activeChantTrack === track.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD966]" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isChantingPlaying) {
                    stopMeditativeDrone();
                    setIsChantingPlaying(false);
                    showToast('Đã tạm dừng Pháp Âm Niệm Phật');
                  } else {
                    playBellSound(0.5);
                    startMeditativeDrone(0.25);
                    setIsChantingPlaying(true);
                    showToast('Đang phát Pháp Âm Niệm Phật thanh tịnh');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isChantingPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isChantingPlaying ? 'Tạm Dừng Pháp Âm' : 'Phát Pháp Âm Niệm Phật'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CHUÔNG & MÕ GIỮ NHỊP BPM TỰ ĐỘNG (ORIGINAL DHARMA FEATURE)      */}
      {/* ========================================================================= */}
      {isBellsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAutoFishPlaying(false);
              setIsBellsModalOpen(false);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-6 text-[#2E1E0F] shadow-2xl text-center space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsAutoFishPlaying(false);
                setIsBellsModalOpen(false);
              }}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5500] block">
                PHÁP KHÍ THIỀN MÔN
              </span>
              <h3 className="font-heading font-serif text-xl font-bold text-[#2E1E0F] mt-1">
                Đại Hồng Chung &amp; Mõ Nhịp BPM
              </h3>
              <p className="text-xs text-[#6A5234] mt-1">
                Thỉnh chuông thủ công hoặc bật Mõ Tự Động giữ nhịp tụng kinh
              </p>
            </div>

            {/* 2 Minimalist SVG Strike Pads */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.55);
                  showToast('Tiếng chuông ngân vang • Phiền não nhẹ tan');
                }}
                className="p-5 rounded-3xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] active:scale-95 transition-all shadow-xl flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] group-hover:scale-110 transition-transform mb-2.5">
                  <TempleBellIcon className="w-7 h-7" />
                </div>
                <span className="font-heading font-serif font-bold text-sm text-[#2E1E0F]">
                  Thỉnh Chuông
                </span>
                <span className="text-[10px] text-[#7D6442] mt-0.5">Đại Hồng Chung</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playWoodenFishSound(0.7);
                  setFishBeatCount((c) => c + 1);
                }}
                className="p-5 rounded-3xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] active:scale-95 transition-all shadow-xl flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] group-hover:scale-110 transition-transform mb-2.5">
                  <WoodenFishMinimalIcon className="w-7 h-7" />
                </div>
                <span className="font-heading font-serif font-bold text-sm text-[#2E1E0F]">
                  Gõ Mõ ({fishBeatCount})
                </span>
                <span className="text-[10px] text-[#7D6442] mt-0.5">Mõ Gỗ Trầm</span>
              </button>
            </div>

            {/* Auto-Rhythm BPM Controller */}
            <div className="p-4 rounded-2xl bg-white border border-[#EEDBBA] space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C5500]">
                  Chế Độ Mõ Tự Động Trợ Duyệt Tụng Kinh
                </span>
                <span className="text-[11px] font-mono text-[#6A5234]">
                  {fishBpm} nhịp/phút
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { bpm: 50, label: '50 BPM • Khoan thai' },
                  { bpm: 68, label: '68 BPM • Chuẩn' },
                  { bpm: 88, label: '88 BPM • Tinh tấn' },
                ].map((opt) => (
                  <button
                    key={opt.bpm}
                    type="button"
                    onClick={() => setFishBpm(opt.bpm as 50 | 68 | 88)}
                    className={cn(
                      'py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center',
                      fishBpm === opt.bpm
                        ? 'bg-[#FFF4D0] border-[#E5C158] text-[#8C5500]'
                        : 'bg-white border-[#F2E5C7] text-[#7D6442]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !isAutoFishPlaying;
                  setIsAutoFishPlaying(next);
                  if (next) {
                    playWoodenFishSound(0.6);
                    showToast(`Đang bật Mõ Tự Động nhịp ${fishBpm} BPM`);
                  } else {
                    showToast('Đã tắt Mõ Tự Động');
                  }
                }}
                className={cn(
                  'w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer',
                  isAutoFishPlaying
                    ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                    : 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505]'
                )}
              >
                {isAutoFishPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>
                  {isAutoFishPlaying ? `Đang Gõ Nhịp ${fishBpm} BPM (Nhấn Để Dừng)` : 'Bật Mõ Giữ Nhịp Tự Động'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: ĐÀN TRÀNG HOA ĐĂNG CẦU AN                                       */}
      {/* ========================================================================= */}
      {isPrayerPeaceOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerPeaceOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsPrayerPeaceOpen(false)}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] mb-2">
                <LotusLanternIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                Thắp Đèn Hoa Đăng Cầu An
              </h3>
              <p className="text-xs text-[#6A5234] mt-0.5">
                Dâng ánh sáng từ bi nguyện cầu bình an cho cha mẹ &amp; gia quyến
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Phật tử / Gia chủ phát nguyện</label>
                <input
                  type="text"
                  value={peaceName}
                  onChange={(e) => setPeaceName(e.target.value)}
                  placeholder="Ví dụ: Phật tử Tâm An cùng gia quyến..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                />
              </div>

              <div>
                <label className="text-[#5A4329] block mb-1 font-medium">Lời nguyện Cầu An</label>
                <textarea
                  rows={3}
                  value={peaceWish}
                  onChange={(e) => setPeaceWish(e.target.value)}
                  placeholder="Nguyện mười phương Chư Phật gia hộ cho cha mẹ và gia quyến thân tâm thường an lạc, tật bệnh tiêu trừ..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  recordDharmaMerit({
                    type: 'lantern',
                    title: `Thắp Hoa Đăng Cầu An (${peaceName.trim() || 'Gia đạo bình an'})`,
                    detail:
                      peaceWish.trim() ||
                      'Nguyện cầu thân tâm an lạc, tật bệnh tiêu trừ, đạo tâm kiên cố',
                    meritPoints: 20,
                  });
                  setPeaceName('');
                  setPeaceWish('');
                  showToast('Đã thắp Hoa Đăng Cầu An & lưu vào Sổ Công Đức Dharma!');
                  setIsPrayerPeaceOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-md cursor-pointer mt-2"
              >
                Thắp Đèn Hoa Đăng &amp; Hồi Hướng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ĐÀN TRÀNG HOA ĐĂNG KỲ SIÊU & CẦU AN                             */}
      {/* ========================================================================= */}
      {isPrayerRebirthOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerRebirthOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsPrayerRebirthOpen(false)}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tab switch between Cầu Siêu & Cầu An */}
            <div className="flex rounded-2xl p-1 bg-[#FFF4D0] border border-[#ECD9A8] mt-1">
              <button
                type="button"
                onClick={() => setPrayerTab('sieu')}
                className={cn(
                  'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  prayerTab === 'sieu'
                    ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-xs'
                    : 'text-[#7D6442] hover:text-[#2E1E0F]'
                )}
              >
                Hoa Đăng Cầu Siêu
              </button>
              <button
                type="button"
                onClick={() => setPrayerTab('an')}
                className={cn(
                  'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  prayerTab === 'an'
                    ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-xs'
                    : 'text-[#7D6442] hover:text-[#2E1E0F]'
                )}
              >
                Hoa Đăng Cầu An
              </button>
            </div>

            {prayerTab === 'sieu' ? (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] mb-2">
                    <IncenseAltarIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                    Hoa Đăng Kỳ Siêu &amp; Tưởng Niệm
                  </h3>
                  <p className="text-xs text-[#6A5234] mt-0.5">
                    Hồi hướng công đức cầu siêu cửu huyền thất tổ &amp; hương linh quá vãng
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#5A4329] block mb-1 font-medium">Hương linh / Cửu huyền thất tổ</label>
                    <input
                      type="text"
                      value={rebirthName}
                      onChange={(e) => setRebirthName(e.target.value)}
                      placeholder="Ví dụ: Cửu huyền thất tổ nội ngoại hai bên..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-[#5A4329] block mb-1 font-medium">Lời nguyện Kỳ Siêu</label>
                    <textarea
                      rows={3}
                      value={rebirthWish}
                      onChange={(e) => setRebirthWish(e.target.value)}
                      placeholder="Nguyện nương nhờ ánh sáng từ bi của Đức Phật A Di Đà tiếp dẫn hương linh siêu sinh Tịnh Độ..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playGrandTempleBellSound(0.5);
                      recordDharmaMerit({
                        type: 'lantern',
                        title: `Kỳ Siêu Hồi Hướng (${rebirthName.trim() || 'Cửu huyền thất tổ'})`,
                        detail:
                          rebirthWish.trim() ||
                          'Nguyện hương linh nương nhờ công đức siêu sinh cõi Tịnh Độ an vui',
                        meritPoints: 20,
                      });
                      setRebirthName('');
                      setRebirthWish('');
                      showToast('Đã gửi lời Kỳ Siêu Hồi Hướng vào Sổ Công Đức Dharma!');
                      setIsPrayerRebirthOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-md cursor-pointer mt-2"
                  >
                    Gửi Lời Hồi Hướng Công Đức
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500] mb-2">
                    <LotusLanternIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                    Thắp Đèn Hoa Đăng Cầu An
                  </h3>
                  <p className="text-xs text-[#6A5234] mt-0.5">
                    Dâng ánh sáng từ bi nguyện cầu bình an cho cha mẹ &amp; gia quyến
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#5A4329] block mb-1 font-medium">Phật tử / Gia chủ phát nguyện</label>
                    <input
                      type="text"
                      value={peaceName}
                      onChange={(e) => setPeaceName(e.target.value)}
                      placeholder="Ví dụ: Phật tử Tâm An cùng gia quyến..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                    />
                  </div>

                  <div>
                    <label className="text-[#5A4329] block mb-1 font-medium">Lời nguyện Cầu An</label>
                    <textarea
                      rows={3}
                      value={peaceWish}
                      onChange={(e) => setPeaceWish(e.target.value)}
                      placeholder="Nguyện mười phương Chư Phật gia hộ cho cha mẹ và gia quyến thân tâm thường an lạc, tật bệnh tiêu trừ..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] focus:outline-hidden focus:border-[#E5C158]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playGrandTempleBellSound(0.5);
                      recordDharmaMerit({
                        type: 'lantern',
                        title: `Thắp Hoa Đăng Cầu An (${peaceName.trim() || 'Gia đạo bình an'})`,
                        detail:
                          peaceWish.trim() ||
                          'Nguyện cầu thân tâm an lạc, tật bệnh tiêu trừ, đạo tâm kiên cố',
                        meritPoints: 20,
                      });
                      setPeaceName('');
                      setPeaceWish('');
                      showToast('Đã thắp Hoa Đăng Cầu An & lưu vào Sổ Công Đức Dharma!');
                      setIsPrayerRebirthOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-md cursor-pointer mt-2"
                  >
                    Thắp Đèn Hoa Đăng Cầu An
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: THƯ VIỆN BỔN TÔN • 18 TÔN TƯỢNG PHẬT & BỒ TÁT                    */}
      {/* ========================================================================= */}
      <BuddhasGalleryModal
        isOpen={isBuddhasModalOpen}
        onClose={() => setIsBuddhasModalOpen(false)}
        showToast={showToast}
      />

      {/* ========================================================================= */}
      {/* 8. MODAL: SỔ HIẾU HẠNH GIA TIÊN                                           */}
      {/* ========================================================================= */}
      {isMemorialBookOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMemorialBookOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsMemorialBookOpen(false)}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                Sổ Hiếu Hạnh Gia Tiên
              </h3>
              <p className="text-xs text-[#6A5234]">
                Ghi nhớ ngày húy kỵ tổ tiên để tụng kinh &amp; hồi hướng báo hiếu
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {memorials.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-white border border-[#EEDBBA] flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-[#2E1E0F]">
                      {m.name} ({m.relation})
                    </h5>
                    <p className="text-[#8C5500] font-mono mt-0.5">
                      Âm lịch: {m.lunarDate} {m.solarDate && `• ${m.solarDate}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMemorials((prev) => prev.filter((item) => item.id !== m.id));
                      showToast('Đã xóa mục ghi nhớ');
                    }}
                    className="text-[#7D6442] hover:text-red-400 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EEDBBA] text-xs">
              <input
                type="text"
                placeholder="Họ tên & Pháp danh người thân"
                value={newMemName}
                onChange={(e) => setNewMemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Quan hệ (Ông/Bà/Cha/Mẹ)"
                  value={newMemRelation}
                  onChange={(e) => setNewMemRelation(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
                />
                <input
                  type="text"
                  placeholder="Ngày Âm (15/07)"
                  value={newMemDate}
                  onChange={(e) => setNewMemDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newMemName.trim()) return;
                  const item = {
                    id: Date.now().toString(),
                    name: newMemName.trim(),
                    relation: newMemRelation.trim() || 'Tiên linh',
                    lunarDate: newMemDate.trim() || 'Rằm tháng 7',
                    solarDate: 'Tưởng niệm hằng năm',
                  };
                  setMemorials((prev) => [...prev, item]);
                  setNewMemName('');
                  setNewMemRelation('');
                  setNewMemDate('');
                  playWoodenFishSound(0.5);
                  showToast('Đã lưu vào Sổ Hiếu Hạnh Gia Tiên');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold cursor-pointer"
              >
                + Lưu Ngày Tưởng Niệm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: SỔ CÔNG ĐỨC HỒI HƯỚNG (MERIT LEDGER)                            */}
      {/* ========================================================================= */}
      {isMeritLedgerOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMeritLedgerOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] p-5 text-[#2E1E0F] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA]">
              <div className="flex items-center gap-2">
                <BodhiLeafIcon className="w-5 h-5 text-[#8C5500]" />
                <div>
                  <h3 className="font-heading font-serif text-lg font-bold text-[#8C5500]">
                    Sổ Công Đức Hồi Hướng Dharma
                  </h3>
                  <p className="text-xs text-[#7D6442]">
                    Ghi nhận các thời khóa tọa thiền, trì niệm &amp; dâng hương
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMeritLedgerOpen(false)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2.5">
              {meritEntries.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-[#F2E5C7] text-center space-y-2">
                  <LotusMinimalIcon className="w-8 h-8 text-[#8C5500] mx-auto opacity-80" />
                  <p className="text-xs text-[#5A4329]">
                    Sổ Công Đức đang chờ ghi nhận thời khóa đầu tiên của bạn hôm nay.
                  </p>
                </div>
              ) : (
                meritEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-serif font-bold text-xs text-[#8C5500]">
                        {entry.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500]">
                        +{entry.meritPoints} công đức
                      </span>
                    </div>
                    <p className="text-xs text-[#5A4329]">{entry.detail}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-white/95 border border-[#ECD9A8] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#8C5500]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
