'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
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
  const [fontSizePx, setFontSizePx] = useState(24); // Senior friendly default: 24px
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isAutoWoodfish, setIsAutoWoodfish] = useState(false);

  // Prayer state
  const [prayerName, setPrayerName] = useState('');
  const [prayerContent, setPrayerContent] = useState('');
  const [floatingPrayer, setFloatingPrayer] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<SavedPrayer[]>([]);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoWoodfishTimerRef = useRef<NodeJS.Timeout | null>(null);
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

    // Stop bowing after 3 full bowing cycles (~3.2s)
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

  // 3. ACTION: ĐỌC KINH (SCRIPTURE OVERLAY)
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
      }, 5500); // 5.5s per verse for easy senior reading
    } else {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    }
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScrolling, isScriptureModalOpen, selectedSutraIndex, soundEnabled]);

  // Auto wooden fish rhythm
  useEffect(() => {
    if (isAutoWoodfish && isScriptureModalOpen) {
      autoWoodfishTimerRef.current = setInterval(() => {
        if (soundEnabled) {
          playWoodenFishSound(0.35);
        }
      }, 1000); // 60 bpm chanting pace
    } else {
      if (autoWoodfishTimerRef.current) clearInterval(autoWoodfishTimerRef.current);
    }
    return () => {
      if (autoWoodfishTimerRef.current) clearInterval(autoWoodfishTimerRef.current);
    };
  }, [isAutoWoodfish, isScriptureModalOpen, soundEnabled]);

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

    // Trigger floating lotus lantern animation in sanctuary
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
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#1E110A] text-[#FDFBF7] select-none font-sans flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION BAR (SENIOR-FRIENDLY & HIGH-CONTRAST)            */}
      {/* ========================================================================= */}
      <header className="relative z-30 h-14 sm:h-16 px-3 sm:px-6 bg-[#2C1A12]/95 border-b border-[#D4AF37]/30 backdrop-blur-md flex items-center justify-between shrink-0 shadow-lg">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/35 hover:bg-black/55 border border-[#D4AF37]/40 text-[#FDFBF7] font-bold text-sm sm:text-base active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#D4AF37]" />
          <span className="hidden xs:inline">Trang Chủ</span>
        </Link>

        {/* Sanctuary Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <h1 className="font-heading text-base sm:text-xl font-bold tracking-wide uppercase text-[#FFE082]">
              Cầu Nguyện Online
            </h1>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <p className="text-[11px] sm:text-xs text-[#D7C4A5] opacity-90 hidden sm:block">
            Không Gian Đi Chùa & Cầu Nguyện Tam Bảo Thanh Tịnh
          </p>
        </div>

        {/* Action Shortcuts: Sổ Cầu Nguyện + Link Xem Ngày Tốt + Âm Thanh */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* CRITICAL: "Xem Ngày Tốt" link preserved as requested by user! */}
          <Link
            href="/tu-vi"
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/50 text-[#FFE082] text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-xs"
            title="Tra cứu Màu Hợp & Ngày Tốt Hoàng Đạo"
          >
            <Calendar className="w-4 h-4 text-[#FFE082]" />
            <span className="hidden md:inline">Xem Ngày Tốt</span>
          </Link>

          {/* Sổ Lời Nguyện Cầu (Xem lịch sử) */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-black/35 hover:bg-black/55 border border-[#D4AF37]/40 text-[#FDFBF7] text-xs sm:text-sm font-bold active:scale-95 transition-all"
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
              'p-2 rounded-xl border transition-all active:scale-95',
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
          <div className="max-w-2xl bg-[#2C1A12]/95 border-2 border-[#D4AF37] rounded-2xl p-3.5 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
            <p className="font-heading text-base sm:text-xl font-bold text-[#FFE082] leading-snug">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN 2.5D SANCTUARY VIEWPORT (FIXED 100VH - ZERO BODY SCROLL)          */}
      {/* ========================================================================= */}
      <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col justify-between">
        {/* Deep temple sanctuary architectural backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180C06] via-[#2A160C] to-[#120804] pointer-events-none" />

        {/* Traditional carved wooden lattice background wall (Mành nan gỗ lim) */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#D4AF37 1px, #180C06 1px)`,
            backgroundSize: '28px 28px',
            backgroundPosition: '0 0, 14px 14px',
          }}
        />

        {/* Giant breathing golden halo behind Buddha statue */}
        <div
          className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] md:w-[620px] aspect-square rounded-full animate-halo-breathing pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,224,130,0.45) 0%, rgba(212,175,55,0.25) 45%, rgba(180,83,9,0.08) 70%, transparent 100%)',
          }}
        />

        {/* ----------------------------------------------------------------------- */}
        {/* UPPER CENTER ZONE: THE SOLEMN BUDDHA STATUE & LOTUS THRONE (TOP 42%)   */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 w-full flex flex-col items-center pt-1 sm:pt-3">
          {/* Floating Prayer Lotus Lantern (rises towards Buddha when prayer is submitted) */}
          {floatingPrayer && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-prayer-lotus-float flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_20px_#FFE082]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="30" fill="url(#lotusGlow)" opacity="0.6" />
                  {/* Golden Lotus Lantern Petals */}
                  <path d="M50 20 C40 38 35 60 50 72 C65 60 60 38 50 20 Z" fill="#FFE082" />
                  <path d="M30 40 C28 55 35 68 50 72 C40 68 35 52 30 40 Z" fill="#F59E0B" />
                  <path d="M70 40 C72 55 65 68 50 72 C60 68 65 52 70 40 Z" fill="#F59E0B" />
                  <circle cx="50" cy="46" r="6" fill="#FFF" />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#2C1A12]/90 border border-[#D4AF37] text-[#FFE082] text-xs font-bold whitespace-nowrap mt-1 shadow-lg">
                &ldquo;{floatingPrayer}&rdquo;
              </div>
            </div>
          )}

          {/* INLINE SVG: Serene Buddha Statue seated in Lotus Pedestal */}
          <div className="relative w-44 sm:w-56 md:w-64 aspect-[1/1.1] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]">
            <svg viewBox="0 0 240 260" className="w-full h-full" fill="none">
              <defs>
                <radialGradient id="buddhaGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8A6715" />
                </radialGradient>
                <linearGradient id="goldThrone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E6C265" />
                  <stop offset="50%" stopColor="#B38B22" />
                  <stop offset="100%" stopColor="#664D0E" />
                </linearGradient>
                <linearGradient id="robeDrape" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C8780A" />
                  <stop offset="50%" stopColor="#E8920A" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
              </defs>

              {/* Head Halo Circle */}
              <circle cx="120" cy="72" r="48" fill="url(#buddhaGlow)" opacity="0.35" />
              <circle cx="120" cy="72" r="44" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

              {/* Ushnisha (Top hair knot) & Jewel */}
              <circle cx="120" cy="38" r="9" fill="#B38B22" />
              <circle cx="120" cy="30" r="3.5" fill="#EF4444" />

              {/* Buddha Head and Hair Curls */}
              <ellipse cx="120" cy="68" rx="26" ry="30" fill="url(#buddhaGlow)" />
              {/* Hairline curls */}
              <path
                d="M96 60 C98 48 142 48 144 60 C140 54 100 54 96 60 Z"
                fill="#8A6715"
              />

              {/* Serene Face Details */}
              {/* Urna (Wisdom mark between brows) */}
              <circle cx="120" cy="62" r="1.6" fill="#DC2626" />
              {/* Eyes downcast in deep meditation */}
              <path d="M106 68 Q113 72 117 68" stroke="#5A4308" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M123 68 Q127 72 134 68" stroke="#5A4308" strokeWidth="1.8" strokeLinecap="round" />
              {/* Gentle serene nose & smile */}
              <path d="M120 68 L119 75 L122 75" stroke="#7A5C10" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M113 82 Q120 86 127 82" stroke="#684B08" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              {/* Elongated earlobes */}
              <path d="M93 64 C91 74 93 84 96 86" stroke="#B38B22" strokeWidth="3" strokeLinecap="round" />
              <path d="M147 64 C149 74 147 84 144 86" stroke="#B38B22" strokeWidth="3" strokeLinecap="round" />

              {/* Torso & Monk Layrobe */}
              <path
                d="M94 94 C76 112 70 148 72 176 L168 176 C170 148 164 112 146 94 Z"
                fill="url(#buddhaGlow)"
              />
              {/* Kasaya Robe Drapes over left shoulder */}
              <path
                d="M94 94 Q116 110 142 135 L148 176 L72 176 Q78 126 94 94 Z"
                fill="url(#robeDrape)"
                opacity="0.9"
              />

              {/* Hands in Dhyana Mudra (Thiền Định Ấn) */}
              <ellipse cx="120" cy="166" rx="20" ry="8" fill="#F5D77F" stroke="#9A7432" strokeWidth="1" />
              <path d="M112 165 C116 163 124 163 128 165" stroke="#7A5C10" strokeWidth="1.2" />

              {/* Crossed Legs in Lotus (Vajrasana) */}
              <path
                d="M56 172 C62 162 90 166 120 168 C150 166 178 162 184 172 C188 184 172 196 120 196 C68 196 52 184 56 172 Z"
                fill="url(#buddhaGlow)"
                stroke="#8A6715"
                strokeWidth="1.2"
              />

              {/* Multi-tiered Golden Lotus Pedestal (Đài Sen Tam Cấp) */}
              <g transform="translate(0, 186)">
                {/* Upper lotus petals */}
                <path d="M68 10 C80 -4 95 -6 102 10" fill="url(#goldThrone)" stroke="#D4AF37" strokeWidth="1" />
                <path d="M96 10 C108 -8 132 -8 144 10" fill="#E6C265" stroke="#FFE082" strokeWidth="1" />
                <path d="M138 10 C145 -6 160 -4 172 10" fill="url(#goldThrone)" stroke="#D4AF37" strokeWidth="1" />
                <path d="M50 16 C62 2 76 2 86 16" fill="#B38B22" />
                <path d="M154 16 C164 2 178 2 190 16" fill="#B38B22" />

                {/* Base throne */}
                <path d="M42 22 L198 22 L190 38 L50 38 Z" fill="url(#goldThrone)" />
                <rect x="36" y="38" width="168" height="14" rx="4" fill="#664D0E" stroke="#B38B22" strokeWidth="1.5" />
                {/* Traditional lotus relief dots on pedestal */}
                <circle cx="60" cy="45" r="2.5" fill="#FFE082" />
                <circle cx="80" cy="45" r="2.5" fill="#FFE082" />
                <circle cx="100" cy="45" r="2.5" fill="#FFE082" />
                <circle cx="120" cy="45" r="3" fill="#FFE082" />
                <circle cx="140" cy="45" r="2.5" fill="#FFE082" />
                <circle cx="160" cy="45" r="2.5" fill="#FFE082" />
                <circle cx="180" cy="45" r="2.5" fill="#FFE082" />
              </g>
            </svg>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* MIDDLE ZONE: ALTAR TABLE + INCENSE BURNER + BODHI TREE + TEMPLE BELL     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-15 w-full flex items-center justify-between px-3 sm:px-8 md:px-14 -mt-2 sm:-mt-4">
          {/* MIDDLE LEFT: Potted Bodhi Tree (Cây Bồ Đề chậu gốm cổ) */}
          <div className="relative w-28 sm:w-36 md:w-44 aspect-[1/1.4] shrink-0">
            {/* Drifting Bodhi Leaves Animations */}
            <div className="absolute top-8 left-4 w-4 h-4 pointer-events-none animate-bodhi-leaf-1">
              <svg viewBox="0 0 20 24" className="w-full h-full fill-[#84CC16] drop-shadow-sm">
                <path d="M10 0 C6 8 0 14 0 18 C0 22 5 24 10 24 C15 24 20 22 20 18 C20 14 14 8 10 0 Z" />
              </svg>
            </div>
            <div className="absolute top-12 right-2 w-3.5 h-3.5 pointer-events-none animate-bodhi-leaf-2">
              <svg viewBox="0 0 20 24" className="w-full h-full fill-[#A3E635] drop-shadow-sm">
                <path d="M10 0 C6 8 0 14 0 18 C0 22 5 24 10 24 C15 24 20 22 20 18 C20 14 14 8 10 0 Z" />
              </svg>
            </div>

            {/* INLINE SVG: Bodhi Tree in Ancient Lotus Pot */}
            <svg viewBox="0 0 140 190" className="w-full h-full" fill="none">
              {/* Wooden Stand */}
              <rect x="35" y="172" width="70" height="8" rx="2" fill="#3E2723" />
              <rect x="42" y="180" width="10" height="8" fill="#2E1C18" />
              <rect x="88" y="180" width="10" height="8" fill="#2E1C18" />

              {/* Antique Ceramic Planter (Chậu gốm hoa văn men lam) */}
              <path d="M38 125 L102 125 L94 172 L46 172 Z" fill="#E0E7FF" stroke="#3730A3" strokeWidth="1.5" />
              <path d="M34 121 L106 121 L102 126 L38 126 Z" fill="#C7D2FE" stroke="#312E81" strokeWidth="1.2" />
              {/* Blue Lotus motif on pot */}
              <circle cx="70" cy="148" r="10" fill="#818CF8" opacity="0.4" />
              <path d="M60 152 Q70 140 80 152" stroke="#3730A3" strokeWidth="1.5" fill="none" />

              {/* Bodhi Tree Trunk (Gnarled sacred wood) */}
              <path d="M68 125 Q64 95 54 75 Q70 65 72 45" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
              <path d="M64 90 Q78 80 88 65" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" />
              <path d="M56 75 Q42 62 38 48" stroke="#4E342E" strokeWidth="4.5" strokeLinecap="round" />

              {/* Canopy of Heart-shaped Bodhi Leaves */}
              <g fill="#65A30D" stroke="#365314" strokeWidth="0.8">
                <path d="M38 42 C32 32 44 22 50 34 C56 22 68 32 62 42 Z" />
                <path d="M68 38 C62 26 76 18 82 28 C88 18 102 26 96 38 Z" fill="#84CC16" />
                <path d="M88 56 C82 46 94 38 100 48 C106 38 118 46 112 56 Z" />
                <path d="M26 50 C20 42 32 34 36 42 C40 34 52 42 46 50 Z" fill="#4D7C0F" />
                <path d="M68 55 C64 48 72 42 76 48 C80 42 88 48 84 55 Z" fill="#84CC16" />
                <path d="M50 68 C44 60 54 54 58 60 C62 54 72 60 66 68 Z" fill="#65A30D" />
              </g>
            </svg>
          </div>

          {/* MIDDLE CENTER: Altar Table & Antique Bronze Incense Burner (Lư Hương) */}
          <div className="relative flex flex-col items-center">
            {/* 3 Rising Wispy Incense Smoke Particles (when lit) */}
            {isIncenseLit && (
              <div className="absolute -top-16 inset-x-0 flex justify-center items-end h-24 pointer-events-none">
                <div className="w-1.5 h-16 bg-gradient-to-t from-white/70 to-transparent rounded-full blur-[1px] animate-incense-smoke-1 mr-3" />
                <div className="w-2 h-20 bg-gradient-to-t from-amber-100/80 to-transparent rounded-full blur-[1px] animate-incense-smoke-2" />
                <div className="w-1.5 h-16 bg-gradient-to-t from-white/70 to-transparent rounded-full blur-[1px] animate-incense-smoke-3 ml-3" />
              </div>
            )}

            {/* Bronze Incense Burner (Lư Hương Đồng Tam Túc) */}
            <div
              onClick={handleLightIncense}
              className="relative cursor-pointer group active:scale-95 transition-transform"
              title="Nhấn để thắp 3 nén nhang trầm"
            >
              <svg viewBox="0 0 120 90" className="w-24 sm:w-32 md:w-36 h-auto drop-shadow-xl" fill="none">
                <defs>
                  <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#8A6715" />
                    <stop offset="100%" stopColor="#4A3508" />
                  </linearGradient>
                </defs>

                {/* 3 Incense Sticks */}
                {/* Stick 1 (Left) */}
                <line x1="50" y1={isIncenseLit ? 20 : 26} x2="55" y2="52" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
                {isIncenseLit && (
                  <circle cx="50" cy="20" r="2.2" fill="#EF4444" className="animate-ping" />
                )}

                {/* Stick 2 (Center) */}
                <line x1="60" y1={isIncenseLit ? 14 : 22} x2="60" y2="52" stroke="#991B1B" strokeWidth="2.4" strokeLinecap="round" />
                {isIncenseLit && (
                  <circle cx="60" cy="14" r="2.5" fill="#F97316" className="animate-pulse" />
                )}

                {/* Stick 3 (Right) */}
                <line x1="70" y1={isIncenseLit ? 20 : 26} x2="65" y2="52" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
                {isIncenseLit && (
                  <circle cx="70" cy="20" r="2.2" fill="#EF4444" className="animate-ping" />
                )}

                {/* Burner Body (Cauldron shape) */}
                <path d="M30 46 Q60 42 90 46 L86 70 Q60 76 34 70 Z" fill="url(#bronzeGrad)" stroke="#FFE082" strokeWidth="1" />
                {/* Burner Rim with Sandalwood Ash */}
                <ellipse cx="60" cy="46" rx="32" ry="7" fill="#8A6715" stroke="#D4AF37" strokeWidth="1.2" />
                <ellipse cx="60" cy="46" rx="27" ry="5" fill="#D6D3D1" />

                {/* Two Ear Handles (Quai rồng mây) */}
                <path d="M28 50 C18 50 18 64 30 66" stroke="url(#bronzeGrad)" strokeWidth="3" fill="none" />
                <path d="M92 50 C102 50 102 64 90 66" stroke="url(#bronzeGrad)" strokeWidth="3" fill="none" />

                {/* Three Tripod Feet (Chân tam túc) */}
                <path d="M42 70 L38 84 L46 84 Z" fill="#664D0E" />
                <path d="M60 73 L57 86 L63 86 Z" fill="#8A6715" />
                <path d="M78 70 L82 84 L74 84 Z" fill="#664D0E" />
              </svg>
            </div>

            {/* Carved Wooden Altar Table (Bàn Thờ Gỗ Hương) */}
            <div className="w-56 sm:w-72 md:w-84 h-5 sm:h-7 bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#3E2723] rounded-md border-t-2 border-[#D4AF37] shadow-2xl flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-heading tracking-widest text-[#FFE082] opacity-80 uppercase">
                ✦ Vạn Đức Trang Nghiêm ✦
              </span>
            </div>
          </div>

          {/* MIDDLE RIGHT: Hanging Temple Bell (Đại Hồng Chung) */}
          <div
            onClick={handleRingBell}
            className="relative w-28 sm:w-36 md:w-44 aspect-[1/1.4] shrink-0 flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            title="Nhấn để Thỉnh Đại Hồng Chung"
          >
            {/* Concentric Golden Soundwave Ripple when bell is rung */}
            {isBellRippling && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[#FFE082] pointer-events-none animate-bell-ripple" />
            )}

            {/* INLINE SVG: Traditional Bronze Temple Bell & Timber Frame */}
            <svg viewBox="0 0 140 190" className="w-full h-full drop-shadow-xl" fill="none">
              <defs>
                <linearGradient id="bellBronze" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A3508" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#FFE082" />
                  <stop offset="100%" stopColor="#5A4308" />
                </linearGradient>
              </defs>

              {/* Wooden Frame Beam */}
              <rect x="15" y="10" width="110" height="12" rx="2" fill="#4E342E" stroke="#3E2723" strokeWidth="1.5" />
              <rect x="20" y="22" width="12" height="160" fill="#3E2723" />
              <rect x="108" y="22" width="12" height="160" fill="#3E2723" />

              {/* Hanging Rope / Iron Link */}
              <rect x="68" y="22" width="4" height="20" fill="#B45309" />

              {/* Dragon Crown (Quai chuông Bồ Lao) */}
              <path d="M58 42 C58 32 82 32 82 42 Z" fill="#8A6715" stroke="#FFE082" strokeWidth="1" />

              {/* Bell Body (Đại Hồng Chung) */}
              <path
                d="M50 50 C50 44 90 44 90 50 C92 78 98 115 104 126 L36 126 C42 115 48 78 50 50 Z"
                fill="url(#bellBronze)"
                stroke="#FFE082"
                strokeWidth="1.2"
              />

              {/* Bell Traditional Relief Bands & Inscriptions */}
              <line x1="47" y1="62" x2="93" y2="62" stroke="#5A4308" strokeWidth="2" />
              <line x1="43" y1="88" x2="97" y2="88" stroke="#5A4308" strokeWidth="2" />
              <line x1="39" y1="116" x2="101" y2="116" stroke="#FFE082" strokeWidth="2.5" />

              {/* Lotus Relief Bosses on Bell (Núm chuông điểm gõ) */}
              <circle cx="70" cy="98" r="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              <circle cx="70" cy="98" r="2.5" fill="#FFF" />

              {/* Bell Striker (Chày gỗ gõ chuông) */}
              <g transform="translate(10, 0)">
                <rect x="86" y="92" width="34" height="12" rx="4" fill="#5D4037" stroke="#3E2723" strokeWidth="1" transform="rotate(-15 86 92)" />
                <line x1="112" y1="22" x2="108" y2="86" stroke="#B45309" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* LOWER FOREGROUND: PRACTITIONER ON MAT + LOW SCRIPTURE DESK (BOTTOM)     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-20 w-full flex items-end justify-center px-4 sm:px-12 pb-2 sm:pb-3 gap-3 sm:gap-8">
          {/* PRACTITIONER MASCOT (Nhân vật Phật tử trung niên trong Áo Lam trang nghiêm) */}
          <div
            className={cn(
              'relative w-36 sm:w-48 md:w-56 aspect-[1/1.1] transition-transform duration-500 origin-bottom',
              isBowing ? 'animate-practitioner-bow' : 'animate-practitioner-breathe'
            )}
          >
            {/* INLINE SVG: Middle-aged Vietnamese Practitioner in Lotus Posture with Clasped Hands */}
            <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl" fill="none">
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

              {/* 1. Woven Lotus Meditation Mat (Tọa Cụ Búp Sen) */}
              <ellipse cx="100" cy="198" rx="88" ry="18" fill="url(#matStraw)" stroke="#92734F" strokeWidth="2" />
              <ellipse cx="100" cy="198" rx="80" ry="14" stroke="#B89F7D" strokeWidth="1" strokeDasharray="4 3" />

              {/* 2. Crossed Legs in Full Lotus covered by Áo Lam */}
              <path
                d="M32 170 C40 156 70 158 100 162 C130 158 160 156 168 170 C174 186 160 200 100 200 C40 200 26 186 32 170 Z"
                fill="url(#aoLamGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* 3. Dignified Torso in Vietnamese Buddhist Lay Robe (Áo Lam truyền thống) */}
              <path
                d="M66 94 C54 116 52 152 54 176 L146 176 C148 152 146 116 134 94 Z"
                fill="url(#aoLamGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Layrobe folds & mandarin collar line */}
              <path d="M100 86 L100 126 L112 170" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M86 92 Q100 98 114 92" stroke="#475569" strokeWidth="2" fill="none" />

              {/* 4. Clasped Hands in Anjali Mudra (Chắp tay búp sen cung kính) */}
              <g transform="translate(0, -2)">
                <ellipse cx="100" cy="126" rx="9" ry="16" fill="#FBD38D" stroke="#B7791F" strokeWidth="1.2" />
                <path d="M96 114 C98 110 102 110 104 114 L104 136 C102 138 98 138 96 136 Z" fill="#FEEBC8" />
                {/* Sleeve cuffs gathering */}
                <ellipse cx="86" cy="138" rx="8" ry="10" fill="#64748B" />
                <ellipse cx="114" cy="138" rx="8" ry="10" fill="#64748B" />
              </g>

              {/* 5. Middle-aged Practitioner Head & Serene Visage */}
              {/* Neck */}
              <rect x="93" y="76" width="14" height="14" fill="#F6AD55" rx="3" />
              {/* Dignified Face (45 - 65 yrs old, calm, wisdom, no chibi cartoon) */}
              <ellipse cx="100" cy="62" rx="20" ry="24" fill="#FBD38D" />
              {/* Neat Black/Salt-and-Pepper Hair bun / cut */}
              <path
                d="M80 58 C80 38 120 38 120 58 C116 50 84 50 80 58 Z"
                fill="#1F2937"
              />
              <circle cx="100" cy="38" r="6" fill="#1F2937" />

              {/* Peaceful Eyes in Gentle Prayer */}
              <path d="M90 60 Q94 63 97 60" stroke="#7B341E" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M103 60 Q106 63 110 60" stroke="#7B341E" strokeWidth="1.5" strokeLinecap="round" />
              {/* Gentle serene nose & warm compassionate smile */}
              <path d="M100 60 L99 66 L102 66" stroke="#9C4221" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M94 72 Q100 76 106 72" stroke="#7B341E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* SCRIPTURE LOW DESK (Bàn Kỷ Gỗ Đọc Kinh & Mõ Gỗ) */}
          <div
            onClick={handleOpenScripture}
            className="relative w-36 sm:w-48 md:w-56 aspect-[1.2/1] shrink-0 cursor-pointer group active:scale-95 transition-transform"
            title="Nhấn vào Bàn Kỷ hoặc Sách Kinh để Đọc Kinh Tụng Niệm"
          >
            {/* Quick helper badge above desk */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#2C1A12] text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-md opacity-90 group-hover:opacity-100 flex items-center gap-1 animate-bounce">
              <BookOpen className="w-3 h-3" />
              <span>Chạm Đọc Kinh</span>
            </div>

            {/* INLINE SVG: Low Rosewood Desk with Open Scripture Book & Wooden Fish */}
            <svg viewBox="0 0 180 150" className="w-full h-full drop-shadow-xl" fill="none">
              {/* Wooden Table Top (Mặt kỷ gỗ trắc) */}
              <path d="M15 72 L165 72 L175 88 L5 88 Z" fill="#4E342E" stroke="#6D4C41" strokeWidth="1.5" />
              <rect x="5" y="88" width="170" height="12" fill="#3E2723" />

              {/* Curved Scroll Legs (Chân quỳ chạm hoa văn) */}
              <path d="M20 100 C15 125 10 135 15 142 L28 142 C24 130 28 115 32 100 Z" fill="#2E1C18" />
              <path d="M160 100 C165 125 170 135 165 142 L152 142 C156 130 152 115 148 100 Z" fill="#2E1C18" />

              {/* OPEN GOLDEN SCRIPTURE BOOK (Sách Kinh Vàng Kim) */}
              <g transform="translate(25, 42)">
                {/* Book Pages Base */}
                <path d="M10 24 Q45 16 75 22 Q105 16 140 24 L135 52 Q105 44 75 50 Q45 44 15 52 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                <path d="M12 26 Q45 18 75 24 L75 52 Q45 46 17 54 Z" fill="#FFFBEB" />
                <path d="M75 24 Q105 18 138 26 L133 54 Q105 46 75 52 Z" fill="#FFFBEB" />
                {/* Spine crease */}
                <line x1="75" y1="22" x2="75" y2="52" stroke="#B45309" strokeWidth="1.5" />
                {/* Legible Sutra Lines representation */}
                <line x1="24" y1="32" x2="65" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="38" x2="68" y2="38" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="44" x2="60" y2="44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="82" y1="32" x2="126" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="82" y1="38" x2="122" y2="38" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="82" y1="44" x2="118" y2="44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* WOODEN FISH GONG & MALLET (Mõ Gỗ Mít & Dùi Gõ) */}
              <g transform="translate(136, 52)">
                {/* Cushion */}
                <ellipse cx="14" cy="24" rx="14" ry="5" fill="#DC2626" />
                {/* Fish Gong Body */}
                <ellipse cx="14" cy="15" rx="11" ry="9" fill="#92400E" stroke="#B45309" strokeWidth="1" />
                <circle cx="10" cy="13" r="2" fill="#FEF3C7" />
                {/* Sound Slit */}
                <path d="M12 18 Q16 20 22 17" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
                {/* Mallet */}
                <line x1="22" y1="8" x2="32" y2="24" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="21" cy="7" r="3.5" fill="#EF4444" />
              </g>
            </svg>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FIXED BOTTOM CONTROL BAR (OVERSIZED, SENIOR-FRIENDLY, MIN-HEIGHT 68PX) */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full bg-[#2C1A12] border-t-2 border-[#D4AF37]/50 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] p-2 sm:p-3 shrink-0 pb-safe">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
          {/* Button 1: THẮP NHANG */}
          <button
            onClick={handleLightIncense}
            className="min-h-[68px] sm:min-h-[74px] rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#854D0E] to-[#5C3005] hover:from-[#A16207] hover:to-[#713F12] border-2 border-[#EAB308] text-[#FEF08A] shadow-md flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FACC15]" />
            </div>
            <span className="font-heading text-sm sm:text-base font-bold whitespace-nowrap tracking-wide">
              Thắp Nhang
            </span>
          </button>

          {/* Button 2: ĐỌC KINH */}
          <button
            onClick={handleOpenScripture}
            className="min-h-[68px] sm:min-h-[74px] rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#78350F] to-[#451A03] hover:from-[#92400E] hover:to-[#5A2406] border-2 border-[#F59E0B] text-[#FEF3C7] shadow-md flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#FCD34D]" />
            </div>
            <span className="font-heading text-sm sm:text-base font-bold whitespace-nowrap tracking-wide">
              Đọc Kinh
            </span>
          </button>

          {/* Button 3: THỈNH CHUÔNG */}
          <button
            onClick={handleRingBell}
            className="min-h-[68px] sm:min-h-[74px] rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#854D0E] to-[#5C3005] hover:from-[#A16207] hover:to-[#713F12] border-2 border-[#EAB308] text-[#FEF08A] shadow-md flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#FACC15]" />
            </div>
            <span className="font-heading text-sm sm:text-base font-bold whitespace-nowrap tracking-wide">
              Thỉnh Chuông
            </span>
          </button>

          {/* Button 4: CẦU NGUYỆN */}
          <button
            onClick={() => setIsPrayerModalOpen(true)}
            className="min-h-[68px] sm:min-h-[74px] rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#B45309] to-[#78350F] hover:from-[#D97706] hover:to-[#92400E] border-2 border-[#FBBF24] text-[#FFFBEB] shadow-md flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDE047]" />
            </div>
            <span className="font-heading text-sm sm:text-base font-bold whitespace-nowrap tracking-wide">
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
                {/* Font Size Minus */}
                <button
                  onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-0.5 active:scale-95"
                  title="Thu nhỏ cỡ chữ"
                >
                  <Minus className="w-3.5 h-3.5" /> A-
                </button>

                {/* Font Size Plus */}
                <button
                  onClick={() => setFontSizePx((prev) => Math.min(36, prev + 2))}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-0.5 active:scale-95"
                  title="Phóng to cỡ chữ cho dễ đọc"
                >
                  <Plus className="w-3.5 h-3.5" /> A+
                </button>

                {/* Single Tap Gõ Mõ */}
                <button
                  onClick={() => {
                    if (soundEnabled) playWoodenFishSound(0.5);
                  }}
                  className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#854D0E] text-white font-bold text-xs sm:text-sm active:scale-95 shadow-xs"
                  title="Gõ Mõ một tiếng"
                >
                  🪘 Gõ Mõ
                </button>

                {/* Auto Chanting Toggle */}
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

                {/* Close Button Top */}
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

            {/* Scripture Main Reading Body (Extra large readable font for seniors) */}
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

            {/* Modal Bottom Close Button (Senior-Friendly Large Touch Target) */}
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
              {/* Dharma Name or Full Name */}
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

              {/* Quick Suggestion Chips (Critical for middle-aged/elderly to avoid long typing) */}
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

              {/* Custom Prayer Text */}
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

              {/* Action Buttons */}
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

