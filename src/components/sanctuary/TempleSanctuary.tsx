'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Flame,
  BookOpen,
  Bell,
  Heart,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  Calendar,
  History,
  Plus,
  Minus,
  Play,
  Pause,
} from 'lucide-react';
import { playBellSound, playWoodenFishSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

// Pre-loaded Authentic Sutras for Senior Reading
interface SutraText {
  id: string;
  title: string;
  subtitle: string;
  verses: string[];
}

const SUTRA_COLLECTIONS: SutraText[] = [
  {
    id: 'bat-nha',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
    subtitle: 'Kinh điển cốt tủy phá tan mọi sợ hãi, lo âu và phiền não',
    verses: [
      'Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.',
      'Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc. Thọ, tưởng, hành, thức diệc phục như thị.',
      'Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm.',
      'Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp.',
      'Vô nhãn giới nãi chí vô ý thức giới; vô vô minh, diệc vô vô minh tận; nãi chí vô lão tử, diệc vô lão tử tận.',
      'Vô khổ, tập, diệt, đạo; vô trí diệc vô đắc. Dĩ vô sở đắc cố, Bồ Đề Tát Đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại.',
      'Vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.',
      'Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.',
      'Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chân thật bất hư.',
      'Cố thuyết Bát Nhã Ba La Mật Đa chú. Tức thuyết chú viết:\nYết đế, yết đế, Ba la yết đế, Ba la tăng yết đế, Bồ đề tát bà ha! (3 lần)',
    ],
  },
  {
    id: 'tu-bi',
    title: 'Kinh Từ Bi (Metta Sutta)',
    subtitle: 'Lời Phật dạy về rải tâm từ ái, bao dung đến muôn loài vạn vật',
    verses: [
      'Nguyện cho con luôn an lành, không hờn giận, không oán thù, thân tâm thường lạc.',
      'Nguyện cho cha mẹ, thầy tổ, bà con thân quyến và bạn bè luôn được an vui, tiêu trừ tật bệnh.',
      'Nguyện cho tất cả chúng sanh hữu tình, dù lớn hay nhỏ, dù gần hay xa, đều được sống trong an tịnh và từ bi.',
      'Như người mẹ hiền suốt đời hy sinh che chở cho đứa con một duy nhất, ta hãy mở rộng lòng thương vô lượng đến tất cả muôn loài.',
      'Đem tâm từ ái bao la rải khắp mười phương, phía trên, phía dưới và chung quanh, không chướng ngại, không căm hận, không hằn thù.',
      'Dù khi đứng, khi đi, khi ngồi hay khi nằm, hãy giữ tâm niệm từ bi ấy suốt cả ngày đêm.',
      'Đây là lối sống thanh cao nhất nơi cõi nhân gian, đưa đến giải thoát và an lạc vĩnh hằng.',
    ],
  },
  {
    id: 'sam-hoi',
    title: 'Kinh Sám Hối & Hồi Hướng An Lành',
    subtitle: 'Gột rửa nghiệp chướng, hướng tâm về nẻo thiện thanh tịnh',
    verses: [
      'Con xưa đã tạo bao ác nghiệp, đều do vô thấu tham sân si.',
      'Từ thân, miệng, ý phát sinh ra, hôm nay con thảy đều sám hối.',
      'Nam Mô Cầu Sám Hối Bồ Tát Ma Ha Tát. (3 lần)',
      'Nguyện tiêu ba chướng trừ phiền não, nguyện được trí tuệ thật sáng ngời.',
      'Nguyện cho tội chướng thảy tiêu trừ, đời đời thường hành Bồ Tát đạo.',
      'Nguyện đem công đức lành này, hồi hướng khắp tất cả chúng sanh, đệ tử và muôn loài, đều trọn thành Phật đạo.',
    ],
  },
];

// Quick suggestion chips for middle-aged and elderly users
const PRAYER_QUICK_CHIPS = [
  'Cầu gia đạo bình an, con cháu hiếu thuận',
  'Cầu sức khỏe dồi dào, tật bệnh tiêu trừ',
  'Cầu tâm thanh tịnh, vạn sự cát tường',
  'Cầu cửu huyền thất tổ siêu sanh tịnh độ',
  'Cầu công việc hanh thông, tai qua nạn khỏi',
  'Cầu quốc thái dân an, mưa thuận gió hòa',
];

interface SavedPrayer {
  id: string;
  name: string;
  content: string;
  date: string;
}

export function TempleSanctuary() {
  // Sanctuary interactive states
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [isBellRippling, setIsBellRippling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isScriptureModalOpen, setIsScriptureModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Scripture Reader states
  const [selectedSutraIndex, setSelectedSutraIndex] = useState(0);
  const [fontSizePx, setFontSizePx] = useState(24);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  // Prayer state
  const [prayerName, setPrayerName] = useState('');
  const [prayerContent, setPrayerContent] = useState('');
  const [floatingPrayer, setFloatingPrayer] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<SavedPrayer[]>([]);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scriptureScrollRef = useRef<HTMLDivElement | null>(null);

  // Load saved prayers from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('phatphap_sanctuary_prayers');
      if (stored) {
        setSavedPrayers(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Display toast with automatic fade-out
  const showToast = (msg: string, durationMs = 4500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, durationMs);
  };

  // 1. ACTION: THẮP NHANG
  const handleLightIncense = () => {
    setIsIncenseLit(true);
    setIsBowing(true);

    if (soundEnabled) {
      playBellSound(0.35);
    }

    showToast(
      'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật. Tâm hương vừa thắp, khói trầm lan tỏa, nguyện cầu mười phương an lành, tật bệnh tiêu trừ.',
      5500
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3200);
  };

  // 2. ACTION: THỈNH CHUÔNG (ĐẠI HỒNG CHUNG)
  const handleRingBell = () => {
    setIsBellRippling(true);
    if (soundEnabled) {
      playGrandTempleBellSound(0.5);
    }

    showToast(
      'Nghe tiếng chuông lòng nhẹ tưng bừng, phiền não tan mây khói, tâm an miệng mỉm cười. Nguyện dứt oan khiên tiêu nghiệp chướng.',
      5000
    );

    setTimeout(() => {
      setIsBellRippling(false);
    }, 2800);
  };

  // 3. ACTION: ĐỌC KINH
  const handleOpenScripture = () => {
    setIsScriptureModalOpen(true);
    if (soundEnabled) {
      playWoodenFishSound(0.4);
    }
  };

  // Auto-chanting verse ticker
  useEffect(() => {
    if (isAutoScrolling && isScriptureModalOpen) {
      autoScrollTimerRef.current = setInterval(() => {
        setActiveVerseIndex((prev) => {
          const currentVerses = SUTRA_COLLECTIONS[selectedSutraIndex].verses;
          const next = (prev + 1) % currentVerses.length;
          if (soundEnabled) {
            playWoodenFishSound(0.3);
          }
          return next;
        });
      }, 5500);
    } else {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    }
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScrolling, isScriptureModalOpen, selectedSutraIndex, soundEnabled]);

  // 4. ACTION: DÂNG LỜI CẦU NGUYỆN
  const handleSubmitPrayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const content = prayerContent.trim() || 'Cầu gia đạo bình an, tai qua nạn khỏi, vạn sự cát tường';
    const name = prayerName.trim() || 'Phật tử thiện tâm';

    const newPrayer: SavedPrayer = {
      id: Date.now().toString(),
      name,
      content,
      date: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newPrayer, ...savedPrayers];
    setSavedPrayers(updated);
    try {
      localStorage.setItem('phatphap_sanctuary_prayers', JSON.stringify(updated));
    } catch {}

    setFloatingPrayer(content);
    setIsPrayerModalOpen(false);
    setIsBowing(true);

    if (soundEnabled) {
      playBellSound(0.4);
    }

    showToast(
      `Đã dâng lời cầu nguyện của "${name}" lên mười phương Tam Bảo. Đèn hoa sen nguyện ước đang bay về đài sen chư Phật.`,
      6000
    );

    setTimeout(() => {
      setIsBowing(false);
      setFloatingPrayer(null);
    }, 4500);
  };

  const currentSutra = SUTRA_COLLECTIONS[selectedSutraIndex];

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#180C06] text-[#FDFBF7] select-none font-sans flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <header className="relative z-30 h-14 sm:h-16 px-3 sm:px-6 bg-[#24130A]/95 border-b border-[#D4AF37]/35 backdrop-blur-md flex items-center justify-between shrink-0 shadow-lg">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-[#D4AF37]/40 text-[#FDFBF7] font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden xs:inline">Trang Chủ</span>
        </Link>

        {/* Sanctuary Title with Auspicious Symbols */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Sparkles className="w-4 h-4 animate-pulse text-[#FFE082]" />
            <h1 className="font-heading text-base sm:text-xl font-bold tracking-wide uppercase text-[#FFE082] drop-shadow-md">
              Đi Chùa & Cầu Nguyện Online
            </h1>
            <Sparkles className="w-4 h-4 animate-pulse text-[#FFE082]" />
          </div>
          <p className="text-[10.5px] sm:text-xs text-[#D7C4A5] opacity-90 hidden sm:block">
            Không Gian Tam Bảo Trang Nghiêm • Nhất Tâm Chiêm Bái
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* CRITICAL: "Xem Ngày Tốt" link preserved as requested by user! */}
          <Link
            href="/tu-vi"
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/60 text-[#FFE082] text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-xs"
            title="Tra cứu Màu Hợp & Ngày Tốt Hoàng Đạo"
          >
            <Calendar className="w-4 h-4 text-[#FFE082]" />
            <span className="hidden md:inline">Xem Ngày Tốt</span>
          </Link>

          {/* Sổ Lời Nguyện Cầu */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-[#D4AF37]/40 text-[#FDFBF7] text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-xs"
            title="Xem Sổ Lời Nguyện Cầu Đã Dâng"
          >
            <History className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Sổ Lời Nguyện</span>
            {savedPrayers.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#2C1A12] text-[10px] font-extrabold ml-0.5">
                {savedPrayers.length}
              </span>
            )}
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-2 rounded-xl border transition-all active:scale-95 shadow-xs',
              soundEnabled
                ? 'bg-[#D4AF37]/25 border-[#D4AF37]/60 text-[#FFE082]'
                : 'bg-black/40 border-stone-700 text-stone-400'
            )}
            title={soundEnabled ? 'Đang bật âm thanh chuông mõ' : 'Đang tắt âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TOP BLESSING NOTIFICATION TOAST (EXTRA-LARGE FONT FOR SENIORS)         */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="absolute top-18 sm:top-20 inset-x-3 sm:inset-x-8 z-40 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="max-w-2xl bg-[#24130A]/95 border-2 border-[#D4AF37] rounded-2xl p-3.5 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-center backdrop-blur-md">
            <p className="font-heading text-sm sm:text-lg md:text-xl font-bold text-[#FFE082] leading-snug">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REALISTIC & COHESIVE 2.5D CHÁNH ĐIỆN (TEMPLE SANCTUARY HALL)           */}
      {/* ========================================================================= */}
      <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col justify-end">
        {/* Real Temple Sanctuary Background with Warm Teakwood Pillars & Ambient Fog */}
        <div className="absolute inset-0 z-0">
          {/* Subtle real temple hall image texture */}
          <img
            src="/images/buddha_temple.jpg"
            alt="Chánh Điện Chùa Cổ"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
          />
          {/* Deep sacred ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140804] via-[#200F07]/90 to-[#120703]/95" />

          {/* Left & Right Red-Gold Temple Pillars (Cột Gỗ Lim Chùa Cổ) */}
          <div className="absolute inset-y-0 left-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#200A04] via-[#3E160A] to-transparent border-r border-[#D4AF37]/20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#200A04] via-[#3E160A] to-transparent border-l border-[#D4AF37]/20 pointer-events-none" />

          {/* Traditional Carved Wooden Frieze at Top (Hoành Phi) */}
          <div className="absolute top-0 inset-x-8 sm:inset-x-20 h-6 sm:h-8 bg-[#3E160A]/90 border-b border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
            <span className="font-heading text-[11px] sm:text-xs font-bold tracking-[0.3em] text-[#FFE082] uppercase">
              ✦ Phật Quang Phổ Chiếu • Vạn Đức Trang Nghiêm ✦
            </span>
          </div>

          {/* Polished Lacquer Temple Floor (Sàn Chùa Bóng Gương) */}
          <div className="absolute bottom-0 inset-x-0 h-44 sm:h-52 bg-gradient-to-t from-[#0C0402] via-[#1B0C06] to-transparent pointer-events-none border-t border-[#D4AF37]/15" />
        </div>

        {/* Floating Lotus Prayer (rises towards Buddha when prayer is submitted) */}
        {floatingPrayer && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-prayer-lotus-float flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_25px_#FFE082]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="30" fill="url(#lotusGlow)" opacity="0.6" />
                <path d="M50 20 C40 38 35 60 50 72 C65 60 60 38 50 20 Z" fill="#FFE082" />
                <path d="M30 40 C28 55 35 68 50 72 C40 68 35 52 30 40 Z" fill="#F59E0B" />
                <path d="M70 40 C72 55 65 68 50 72 C60 68 65 52 70 40 Z" fill="#F59E0B" />
                <circle cx="50" cy="46" r="6" fill="#FFF" />
              </svg>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#24130A]/95 border-2 border-[#D4AF37] text-[#FFE082] text-xs sm:text-sm font-bold whitespace-nowrap mt-1 shadow-2xl">
              &ldquo;{floatingPrayer}&rdquo;
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* THE INTEGRATED 3D SANCTUARY STAGE (GROUNDED ARCHITECTURAL COMPOSITION)  */}
        {/* ======================================================================= */}
        <div className="relative z-10 w-full max-w-4xl mx-auto h-full flex flex-col justify-end px-3 sm:px-8 pb-1">
          {/* --------------------------------------------------------------------- */}
          {/* 1. UPPER ALTAR: SACRED GOLDEN BUDDHA STATUE & GOLDEN HALO             */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative flex flex-col items-center mb-1 sm:mb-2">
            {/* Giant Breathing Golden Halo Glow */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-52 sm:w-72 md:w-84 aspect-square rounded-full animate-halo-breathing pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,224,130,0.55) 0%, rgba(212,175,55,0.3) 45%, rgba(180,83,9,0.1) 70%, transparent 100%)',
              }}
            />

            {/* Sacred Buddha Shrine Portal with Golden Gilded Arch */}
            <div className="relative w-44 sm:w-56 md:w-64 aspect-[1/1.15] rounded-t-full border-2 border-[#D4AF37]/70 p-1.5 bg-gradient-to-b from-[#3E160A]/80 via-[#200A04]/90 to-[#140804] shadow-[0_0_35px_rgba(212,175,55,0.4)]">
              {/* Authentic Golden Buddha Image */}
              <div className="relative w-full h-full rounded-t-full overflow-hidden border border-[#D4AF37]/40 shadow-inner">
                <img
                  src="/images/golden_buddha.jpg"
                  alt="Đức Bổn Sư Thích Ca Mâu Ni Phật"
                  className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
                />
                {/* Soft ambient lighting gradient at the bottom of the statue */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#140804] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Multi-tiered Lotus Throne (Đài Sen Tam Cấp) */}
            <div className="w-52 sm:w-64 md:w-72 -mt-3 relative z-10 flex flex-col items-center">
              <div className="w-full h-4 bg-gradient-to-r from-[#8A6715] via-[#FFE082] to-[#8A6715] rounded-t-lg border border-[#D4AF37] shadow-md flex items-center justify-around px-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2 rounded-full bg-[#FFE082] opacity-80 shadow-xs" />
                ))}
              </div>
              <div className="w-[92%] h-3 bg-gradient-to-r from-[#4A3508] via-[#8A6715] to-[#4A3508] rounded-b-md border-x border-b border-[#D4AF37]/50" />
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 2. MIDDLE ALTAR TABLE + INCENSE BURNER + BODHI TREE + TEMPLE BELL      */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative w-full flex items-end justify-between px-1 sm:px-4 -mt-2 sm:-mt-3">
            {/* LEFT FLANK: Potted Bodhi Tree (Cây Bồ Đề Cổ Thụ) */}
            <div className="relative w-24 sm:w-32 md:w-40 flex flex-col items-center shrink-0 z-15">
              {/* Drifting Bodhi Leaves */}
              <div className="absolute top-4 left-2 w-3.5 h-3.5 pointer-events-none animate-bodhi-leaf-1">
                <svg viewBox="0 0 20 24" className="w-full h-full fill-[#A3E635] drop-shadow-sm">
                  <path d="M10 0 C6 8 0 14 0 18 C0 22 5 24 10 24 C15 24 20 22 20 18 C20 14 14 8 10 0 Z" />
                </svg>
              </div>
              <div className="absolute top-10 right-2 w-3 h-3 pointer-events-none animate-bodhi-leaf-2">
                <svg viewBox="0 0 20 24" className="w-full h-full fill-[#FACC15] drop-shadow-sm">
                  <path d="M10 0 C6 8 0 14 0 18 C0 22 5 24 10 24 C15 24 20 22 20 18 C20 14 14 8 10 0 Z" />
                </svg>
              </div>

              {/* Bodhi Tree Branch Canopy with Heart Leaves */}
              <div className="w-20 sm:w-28 md:w-34 aspect-square mb-[-6px]">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                  {/* Trunk */}
                  <path d="M60 115 Q56 80 48 60 Q62 50 64 35" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M54 75 Q40 65 35 50" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M58 85 Q72 75 80 62" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Leaves */}
                  <g fill="#65A30D" stroke="#365314" strokeWidth="0.6">
                    <path d="M35 48 C28 38 40 28 46 40 C52 28 64 38 58 48 Z" fill="#84CC16" />
                    <path d="M64 32 C58 20 72 12 78 22 C84 12 98 20 92 32 Z" fill="#A3E635" />
                    <path d="M80 58 C74 48 86 40 92 50 C98 40 110 48 104 58 Z" fill="#65A30D" />
                    <path d="M25 56 C19 48 31 40 35 48 C39 40 51 48 45 56 Z" fill="#4D7C0F" />
                    <path d="M50 72 C44 64 54 58 58 64 C62 58 72 64 66 72 Z" fill="#84CC16" />
                  </g>
                </svg>
              </div>

              {/* Ceramic Blue-and-White Lotus Planter (Chậu Gốm Cổ) */}
              <div className="w-14 sm:w-20 md:w-24 h-10 sm:h-14 bg-gradient-to-b from-[#E0E7FF] to-[#C7D2FE] border-2 border-[#3730A3] rounded-b-xl shadow-lg flex flex-col items-center justify-center relative">
                <span className="text-[9px] font-bold text-[#312E81] uppercase tracking-wider">✦ Sen Lam ✦</span>
                <div className="w-full h-1.5 bg-[#312E81] absolute -top-1 rounded-sm" />
              </div>
              {/* Wooden Stand */}
              <div className="w-16 sm:w-22 md:w-26 h-3 bg-[#3E2723] rounded-sm shadow-md mt-0.5" />
            </div>

            {/* CENTER: Grand Altar Table & Bronze Incense Burner (Lư Hương) */}
            <div className="relative flex-1 flex flex-col items-center z-20 px-2">
              {/* Realistic Wispy Incense Smoke Particles (when lit) */}
              {isIncenseLit && (
                <div className="absolute -top-16 inset-x-0 flex justify-center items-end h-24 pointer-events-none">
                  <div className="w-1.5 h-16 bg-gradient-to-t from-white/80 to-transparent rounded-full blur-[1px] animate-incense-smoke-1 mr-3" />
                  <div className="w-2 h-20 bg-gradient-to-t from-amber-100/90 to-transparent rounded-full blur-[1px] animate-incense-smoke-2" />
                  <div className="w-1.5 h-16 bg-gradient-to-t from-white/80 to-transparent rounded-full blur-[1px] animate-incense-smoke-3 ml-3" />
                </div>
              )}

              {/* Bronze Incense Burner (Lư Hương Đồng Tam Túc) */}
              <div
                onClick={handleLightIncense}
                className="relative cursor-pointer group active:scale-95 transition-transform"
                title="Nhấn vào Lư Hương để thắp 3 nén nhang trầm"
              >
                <svg viewBox="0 0 120 84" className="w-24 sm:w-32 md:w-36 h-auto drop-shadow-2xl" fill="none">
                  <defs>
                    <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="35%" stopColor="#D4AF37" />
                      <stop offset="70%" stopColor="#8A6715" />
                      <stop offset="100%" stopColor="#4A3508" />
                    </linearGradient>
                  </defs>

                  {/* 3 Incense Sticks */}
                  <line x1="50" y1={isIncenseLit ? 16 : 24} x2="55" y2="48" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
                  {isIncenseLit && (
                    <circle cx="50" cy="16" r="2.4" fill="#EF4444" className="animate-ping" />
                  )}

                  <line x1="60" y1={isIncenseLit ? 10 : 20} x2="60" y2="48" stroke="#991B1B" strokeWidth="2.4" strokeLinecap="round" />
                  {isIncenseLit && (
                    <circle cx="60" cy="10" r="2.6" fill="#F97316" className="animate-pulse" />
                  )}

                  <line x1="70" y1={isIncenseLit ? 16 : 24} x2="65" y2="48" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
                  {isIncenseLit && (
                    <circle cx="70" cy="16" r="2.4" fill="#EF4444" className="animate-ping" />
                  )}

                  {/* Burner Body */}
                  <path d="M30 42 Q60 38 90 42 L86 64 Q60 70 34 64 Z" fill="url(#bronzeGrad)" stroke="#FFE082" strokeWidth="1" />
                  {/* Rim with Sandalwood Ash */}
                  <ellipse cx="60" cy="42" rx="32" ry="6" fill="#8A6715" stroke="#D4AF37" strokeWidth="1.2" />
                  <ellipse cx="60" cy="42" rx="27" ry="4" fill="#E7E5E4" />

                  {/* Handles */}
                  <path d="M28 46 C18 46 18 58 30 60" stroke="url(#bronzeGrad)" strokeWidth="3" fill="none" />
                  <path d="M92 46 C102 46 102 58 90 60" stroke="url(#bronzeGrad)" strokeWidth="3" fill="none" />

                  {/* Feet */}
                  <path d="M42 64 L38 78 L46 78 Z" fill="#664D0E" />
                  <path d="M60 67 L57 80 L63 80 Z" fill="#8A6715" />
                  <path d="M78 64 L82 78 L74 78 Z" fill="#664D0E" />
                </svg>
              </div>

              {/* Grand Carved Altar Table (Bàn Thờ Tam Bảo Thếp Vàng) */}
              <div className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] bg-gradient-to-r from-[#2A0E06] via-[#4A1A0C] to-[#2A0E06] rounded-t-xl border-t-2 border-x-2 border-[#D4AF37] shadow-2xl p-1.5 sm:p-2 flex items-center justify-between">
                {/* Left Altar Oil Lamp / Candle */}
                <div className="flex items-center gap-1 pl-1">
                  <div className="w-3 h-5 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 animate-candle-glow shadow-[0_0_12px_#F59E0B]" />
                  <div className="w-2.5 h-4 bg-[#8A6715] rounded-xs" />
                </div>

                {/* Central Altar Gold Inscription */}
                <div className="text-center">
                  <span className="font-heading text-xs sm:text-sm font-bold tracking-widest text-[#FFE082] uppercase drop-shadow-sm">
                    ✦ Tam Bảo Chứng Minh ✦
                  </span>
                </div>

                {/* Right Altar Oil Lamp / Candle */}
                <div className="flex items-center gap-1 pr-1">
                  <div className="w-2.5 h-4 bg-[#8A6715] rounded-xs" />
                  <div className="w-3 h-5 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 animate-candle-glow shadow-[0_0_12px_#F59E0B]" />
                </div>
              </div>
            </div>

            {/* RIGHT FLANK: Hanging Temple Bell (Đại Hồng Chung) */}
            <div
              onClick={handleRingBell}
              className="relative w-24 sm:w-32 md:w-40 flex flex-col items-center shrink-0 z-15 cursor-pointer group active:scale-95 transition-transform"
              title="Nhấn để Thỉnh Đại Hồng Chung"
            >
              {/* Expanding Ripple Waves */}
              {isBellRippling && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[#FFE082] pointer-events-none animate-bell-ripple" />
              )}

              {/* Timber Bell Frame & Bronze Bell */}
              <div className="w-20 sm:w-28 md:w-34 aspect-[1/1.3] relative flex flex-col items-center">
                <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-2xl" fill="none">
                  <defs>
                    <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4A3508" />
                      <stop offset="35%" stopColor="#D4AF37" />
                      <stop offset="70%" stopColor="#FFE082" />
                      <stop offset="100%" stopColor="#5A4308" />
                    </linearGradient>
                  </defs>

                  {/* Frame */}
                  <rect x="10" y="8" width="100" height="10" rx="2" fill="#3E2723" stroke="#5D4037" strokeWidth="1.2" />
                  <rect x="14" y="18" width="8" height="120" fill="#2E1C18" />
                  <rect x="98" y="18" width="8" height="120" fill="#2E1C18" />

                  {/* Hanging loop */}
                  <rect x="58" y="18" width="4" height="14" fill="#B45309" />
                  <circle cx="60" cy="34" r="5" fill="#8A6715" />

                  {/* Bell Body */}
                  <path
                    d="M44 42 C44 38 76 38 76 42 C78 64 84 94 88 104 L32 104 C36 94 42 64 44 42 Z"
                    fill="url(#bellGrad)"
                    stroke="#FFE082"
                    strokeWidth="1.2"
                  />
                  {/* Bands */}
                  <line x1="41" y1="54" x2="79" y2="54" stroke="#5A4308" strokeWidth="1.8" />
                  <line x1="38" y1="76" x2="82" y2="76" stroke="#5A4308" strokeWidth="1.8" />
                  <line x1="34" y1="96" x2="86" y2="96" stroke="#FFE082" strokeWidth="2.2" />
                  {/* Lotus strike boss */}
                  <circle cx="60" cy="84" r="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
                  <circle cx="60" cy="84" r="2" fill="#FFF" />

                  {/* Striker */}
                  <rect x="72" y="80" width="28" height="9" rx="3" fill="#5D4037" stroke="#3E2723" strokeWidth="1" transform="rotate(-15 72 80)" />
                </svg>
              </div>

              {/* Bell Stand Base */}
              <div className="w-18 sm:w-26 md:w-30 h-3 bg-[#2E1C18] rounded-sm shadow-md -mt-1" />
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 3. FOREGROUND: SEATED PRACTITIONER ON MAT + SCRIPTURE LOW DESK         */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative z-25 w-full flex items-end justify-center gap-3 sm:gap-8 pt-1 sm:pt-2">
            {/* SEATED PRACTITIONER IN ÁO LAM (Phật Tử Cung Kính Lễ Phật) */}
            <div
              className={cn(
                'relative w-36 sm:w-46 md:w-52 aspect-[1/1.05] transition-transform duration-500 origin-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]',
                isBowing ? 'animate-practitioner-bow' : 'animate-practitioner-breathe'
              )}
            >
              <svg viewBox="0 0 200 210" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="aoLamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#64748B" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="matStraw" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D7C4A5" />
                    <stop offset="50%" stopColor="#F5EBE0" />
                    <stop offset="100%" stopColor="#B89F7D" />
                  </linearGradient>
                </defs>

                {/* Woven Lotus Mat */}
                <ellipse cx="100" cy="190" rx="84" ry="16" fill="url(#matStraw)" stroke="#92734F" strokeWidth="2" />
                <ellipse cx="100" cy="190" rx="76" ry="12" stroke="#B89F7D" strokeWidth="1" strokeDasharray="4 3" />

                {/* Crossed Legs in Full Lotus covered by Áo Lam */}
                <path
                  d="M36 162 C44 148 72 150 100 154 C128 150 156 148 164 162 C170 178 156 192 100 192 C44 192 30 178 36 162 Z"
                  fill="url(#aoLamGrad)"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Torso in Vietnamese Buddhist Lay Robe (Áo Lam truyền thống) */}
                <path
                  d="M68 88 C56 110 54 144 56 168 L144 168 C146 144 144 110 132 88 Z"
                  fill="url(#aoLamGrad)"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <path d="M100 82 L100 120 L110 162" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M88 88 Q100 94 112 88" stroke="#475569" strokeWidth="2" fill="none" />

                {/* Clasped Hands in Anjali Mudra (Chắp Tay Búp Sen) */}
                <g transform="translate(0, -4)">
                  <ellipse cx="100" cy="120" rx="8" ry="15" fill="#FBD38D" stroke="#B7791F" strokeWidth="1.2" />
                  <path d="M96 108 C98 104 102 104 104 108 L104 130 C102 132 98 132 96 130 Z" fill="#FEEBC8" />
                  <ellipse cx="86" cy="132" rx="7" ry="9" fill="#64748B" />
                  <ellipse cx="114" cy="132" rx="7" ry="9" fill="#64748B" />
                </g>

                {/* Head & Serene Visage */}
                <rect x="94" y="70" width="12" height="14" fill="#F6AD55" rx="3" />
                <ellipse cx="100" cy="56" rx="19" ry="22" fill="#FBD38D" />
                <path d="M82 52 C82 34 118 34 118 52 C114 44 86 44 82 52 Z" fill="#1F2937" />
                <circle cx="100" cy="34" r="5.5" fill="#1F2937" />

                {/* Peaceful Eyes in Gentle Prayer */}
                <path d="M91 55 Q95 58 98 55" stroke="#7B341E" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M102 55 Q105 58 109 55" stroke="#7B341E" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M100 55 L99 61 L102 61" stroke="#9C4221" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M94 66 Q100 70 106 66" stroke="#7B341E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* SCRIPTURE LOW DESK (Bàn Kỷ Gỗ & Sách Kinh Vàng) */}
            <div
              onClick={handleOpenScripture}
              className="relative w-36 sm:w-46 md:w-52 aspect-[1.2/1] shrink-0 cursor-pointer group active:scale-95 transition-transform"
              title="Nhấn vào Bàn Kỷ hoặc Sách Kinh để Đọc Kinh Tụng Niệm"
            >
              {/* Quick Helper Pill Badge */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#2C1A12] text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-md opacity-90 group-hover:opacity-100 flex items-center gap-1 animate-bounce">
                <BookOpen className="w-3 h-3 text-[#2C1A12]" />
                <span>Chạm Đọc Kinh</span>
              </div>

              {/* INLINE SVG: Low Rosewood Desk with Open Sutra Book & Wooden Fish */}
              <svg viewBox="0 0 180 140" className="w-full h-full drop-shadow-2xl" fill="none">
                {/* Desk Top Surface */}
                <path d="M15 68 L165 68 L175 82 L5 82 Z" fill="#4E342E" stroke="#6D4C41" strokeWidth="1.5" />
                <rect x="5" y="82" width="170" height="10" fill="#3E2723" />

                {/* Curved Legs */}
                <path d="M20 92 C15 115 10 125 15 132 L28 132 C24 120 28 105 32 92 Z" fill="#2E1C18" />
                <path d="M160 92 C165 115 170 125 165 132 L152 132 C156 120 152 105 148 92 Z" fill="#2E1C18" />

                {/* OPEN SCRIPTURE BOOK (Sách Kinh Vàng Kim) */}
                <g transform="translate(25, 38)">
                  <path d="M10 24 Q45 16 75 22 Q105 16 140 24 L135 52 Q105 44 75 50 Q45 44 15 52 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                  <path d="M12 26 Q45 18 75 24 L75 52 Q45 46 17 54 Z" fill="#FFFBEB" />
                  <path d="M75 24 Q105 18 138 26 L133 54 Q105 46 75 52 Z" fill="#FFFBEB" />
                  <line x1="75" y1="22" x2="75" y2="52" stroke="#B45309" strokeWidth="1.5" />
                  <line x1="24" y1="32" x2="65" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="24" y1="38" x2="68" y2="38" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="24" y1="44" x2="60" y2="44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="82" y1="32" x2="126" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="82" y1="38" x2="122" y2="38" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="82" y1="44" x2="118" y2="44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* WOODEN FISH GONG & MALLET */}
                <g transform="translate(136, 48)">
                  <ellipse cx="14" cy="24" rx="14" ry="5" fill="#DC2626" />
                  <ellipse cx="14" cy="15" rx="11" ry="9" fill="#92400E" stroke="#B45309" strokeWidth="1" />
                  <circle cx="10" cy="13" r="2" fill="#FEF3C7" />
                  <path d="M12 18 Q16 20 22 17" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="22" y1="8" x2="32" y2="24" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="21" cy="7" r="3.5" fill="#EF4444" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FIXED BOTTOM CONTROL BAR (OVERSIZED, SENIOR-FRIENDLY, MIN-HEIGHT 72PX) */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full bg-gradient-to-t from-[#140804] via-[#24130A] to-[#2C1A12] border-t-2 border-[#D4AF37]/60 shadow-[0_-12px_40px_rgba(0,0,0,0.95)] p-2.5 sm:p-3.5 shrink-0 pb-safe">
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-4xl mx-auto">
          {/* Button 1: THẮP NHANG */}
          <button
            onClick={handleLightIncense}
            className="min-h-[70px] sm:min-h-[76px] rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#854D0E] to-[#4A2803] hover:from-[#A16207] hover:to-[#5C3005] border-2 border-[#EAB308] text-[#FEF08A] shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FACC15]" />
            </div>
            <span className="font-heading text-xs sm:text-base font-bold whitespace-nowrap tracking-wide">
              Thắp Nhang
            </span>
          </button>

          {/* Button 2: ĐỌC KINH */}
          <button
            onClick={handleOpenScripture}
            className="min-h-[70px] sm:min-h-[76px] rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#78350F] to-[#3B1502] hover:from-[#92400E] hover:to-[#4D1D04] border-2 border-[#F59E0B] text-[#FEF3C7] shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#FCD34D]" />
            </div>
            <span className="font-heading text-xs sm:text-base font-bold whitespace-nowrap tracking-wide">
              Đọc Kinh
            </span>
          </button>

          {/* Button 3: THỈNH CHUÔNG */}
          <button
            onClick={handleRingBell}
            className="min-h-[70px] sm:min-h-[76px] rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#854D0E] to-[#4A2803] hover:from-[#A16207] hover:to-[#5C3005] border-2 border-[#EAB308] text-[#FEF08A] shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#FACC15]" />
            </div>
            <span className="font-heading text-xs sm:text-base font-bold whitespace-nowrap tracking-wide">
              Thỉnh Chuông
            </span>
          </button>

          {/* Button 4: CẦU NGUYỆN */}
          <button
            onClick={() => setIsPrayerModalOpen(true)}
            className="min-h-[70px] sm:min-h-[76px] rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#B45309] to-[#612404] hover:from-[#D97706] hover:to-[#78350F] border-2 border-[#FBBF24] text-[#FFFBEB] shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDE047]" />
            </div>
            <span className="font-heading text-xs sm:text-base font-bold whitespace-nowrap tracking-wide">
              Cầu Nguyện
            </span>
          </button>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. SCRIPTURE READING MODAL (ĐỌC KINH OVERLAY - SENIOR ACCESSIBILITY)      */}
      {/* ========================================================================= */}
      {isScriptureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[92vh] max-h-[780px] bg-[#FDF8EC] text-[#2A1810] rounded-2xl sm:rounded-3xl border-4 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden">
            {/* Modal Header & Accessibility Controls */}
            <div className="p-3 sm:p-4 bg-[#F5EADB] border-b-2 border-[#D4AF37]/50 flex items-center justify-between gap-2 shrink-0">
              {/* Sutra Selector Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
                {SUTRA_COLLECTIONS.map((sutra, idx) => (
                  <button
                    key={sutra.id}
                    onClick={() => {
                      setSelectedSutraIndex(idx);
                      setActiveVerseIndex(0);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-xl font-heading text-xs sm:text-sm font-bold whitespace-nowrap transition-all',
                      selectedSutraIndex === idx
                        ? 'bg-[#854D0E] text-white shadow-xs'
                        : 'bg-white/80 text-[#5C3005] hover:bg-white border border-[#D4AF37]/40'
                    )}
                  >
                    {sutra.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>

              {/* Senior Font Resizer & Audio Toggles */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-0.5 active:scale-95"
                  title="Thu nhỏ cỡ chữ"
                >
                  <Minus className="w-3.5 h-3.5" /> A-
                </button>

                <button
                  onClick={() => setFontSizePx((prev) => Math.min(36, prev + 2))}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-0.5 active:scale-95"
                  title="Phóng to cỡ chữ cho dễ đọc"
                >
                  <Plus className="w-3.5 h-3.5" /> A+
                </button>

                <button
                  onClick={() => {
                    if (soundEnabled) playWoodenFishSound(0.5);
                  }}
                  className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#854D0E] text-white font-bold text-xs sm:text-sm active:scale-95 shadow-xs"
                  title="Gõ Mõ một tiếng"
                >
                  🪘 Gõ Mõ
                </button>

                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={cn(
                    'p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 active:scale-95 transition-all',
                    isAutoScrolling
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-[#D4AF37] text-[#5C3005]'
                  )}
                  title="Tự động đọc tụng từng câu"
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">Tụng Tự Động</span>
                </button>

                <button
                  onClick={() => setIsScriptureModalOpen(false)}
                  className="p-1.5 sm:p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white active:scale-95 shadow-xs ml-1"
                  title="Đóng Sách Kinh"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Sutra Title Banner */}
            <div className="p-3 sm:p-4 text-center border-b border-[#D4AF37]/30 bg-[#FFFDF5]">
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#854D0E]">
                {currentSutra.title}
              </h2>
              <p className="text-xs sm:text-sm italic text-[#78350F] mt-0.5 opacity-90">
                {currentSutra.subtitle}
              </p>
            </div>

            {/* Scripture Main Reading Body */}
            <div
              ref={scriptureScrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 leading-relaxed custom-dropdown-scroll select-text"
              style={{ fontSize: `${fontSizePx}px` }}
            >
              {currentSutra.verses.map((verse, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-3 sm:p-4 rounded-xl transition-all duration-300 font-heading',
                    isAutoScrolling && activeVerseIndex === idx
                      ? 'bg-[#FEF08A] text-[#713F12] border-l-4 border-[#CA8A04] shadow-md font-bold scale-[1.01]'
                      : 'hover:bg-white/60 text-[#2A1810]'
                  )}
                >
                  <p className="leading-[1.8]">{verse}</p>
                </div>
              ))}
            </div>

            {/* Modal Bottom Close Button */}
            <div className="p-3 bg-[#F5EADB] border-t-2 border-[#D4AF37]/50 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-[#78350F]">
                ✦ Cỡ chữ: <strong>{fontSizePx}px</strong> • Dùng A+/A- để tăng giảm ✦
              </span>

              <button
                onClick={() => setIsScriptureModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-heading font-bold text-sm sm:text-base shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Đóng Sách Kinh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PRAYER FORM MODAL (CẦU NGUYỆN / HỒI HƯỚNG)                             */}
      {/* ========================================================================= */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#FDF8EC] text-[#2A1810] rounded-2xl sm:rounded-3xl border-4 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between border-b-2 border-[#D4AF37]/40 pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#854D0E]">
                <Heart className="w-6 h-6 text-[#DC2626]" />
                <h3 className="font-heading text-lg sm:text-2xl font-bold">
                  Dâng Lời Cầu Nguyện
                </h3>
              </div>
              <button
                onClick={() => setIsPrayerModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPrayer} className="space-y-4">
              <div>
                <label className="block font-heading font-bold text-sm sm:text-base text-[#78350F] mb-1">
                  1. Họ Tên hoặc Pháp Danh của Quý Phật Tử:
                </label>
                <input
                  type="text"
                  value={prayerName}
                  onChange={(e) => setPrayerName(e.target.value)}
                  placeholder="Ví dụ: Thiện Tâm, Diệu Âm, Nguyễn Văn An..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#D4AF37]/60 bg-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#854D0E]"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-sm sm:text-base text-[#78350F] mb-2">
                  2. Chọn Nhanh Tâm Nguyện (Nhấn để chọn):
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRAYER_QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrayerContent(chip)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border text-left transition-all active:scale-95',
                        prayerContent === chip
                          ? 'bg-[#854D0E] text-white border-[#713F12] shadow-xs'
                          : 'bg-white hover:bg-amber-50 text-[#78350F] border-[#D4AF37]/50'
                      )}
                    >
                      ✦ {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-sm sm:text-base text-[#78350F] mb-1">
                  3. Hoặc Viết Tâm Nguyện Riêng Của Bạn:
                </label>
                <textarea
                  rows={3}
                  value={prayerContent}
                  onChange={(e) => setPrayerContent(e.target.value)}
                  placeholder="Ghi lời hồi hướng, cầu an cho gia đình hoặc cầu siêu cho cửu huyền thất tổ..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#D4AF37]/60 bg-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#854D0E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrayerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-sm sm:text-base"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#78350F] hover:from-[#D97706] hover:to-[#92400E] text-white font-heading font-bold text-base sm:text-lg shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5 text-amber-300" />
                  <span>Dâng Lời Cầu Nguyện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SỔ LỜI NGUYỆN CẦU (LỊCH SỬ CÔNG ĐỨC)                                   */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#FDF8EC] text-[#2A1810] rounded-2xl sm:rounded-3xl border-4 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between border-b-2 border-[#D4AF37]/40 pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#854D0E]">
                <History className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-heading text-lg sm:text-2xl font-bold">
                  Sổ Lời Nguyện Cầu Đã Dâng ({savedPrayers.length})
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedPrayers.length > 0 ? (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto custom-dropdown-scroll pr-1">
                {savedPrayers.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#D4AF37]/50 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm text-[#78350F]">
                      <span className="font-bold text-[#854D0E]">Phật tử: {item.name}</span>
                      <span className="opacity-75">{item.date}</span>
                    </div>
                    <p className="font-heading text-sm sm:text-base font-semibold text-[#2A1810] leading-snug">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-stone-600 space-y-2">
                <Heart className="w-10 h-10 mx-auto text-[#D4AF37] opacity-60" />
                <p className="font-heading text-base font-bold">Chưa có lời nguyện nào được lưu</p>
                <p className="text-sm">Hãy nhấn nút &ldquo;Cầu Nguyện&rdquo; để dâng tâm nguyện đầu tiên của quý vị.</p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-[#D4AF37]/30 mt-4">
              <Link
                href="/tu-vi"
                className="text-xs sm:text-sm font-bold text-[#B45309] hover:underline flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                <span>Xem Thêm Ngày Tốt Hoàng Đạo & Bản Mệnh</span>
              </Link>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#854D0E] text-white font-bold text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TempleSanctuary;
