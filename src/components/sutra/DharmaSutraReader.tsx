'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Check,
  Minus,
  Plus,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { SutraText, SutraSection } from '@/data/sutras';
import {
  LotusMinimalIcon,
  WoodenFishMinimalIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  playOmTempleBellSound,
  playWoodenFishSound,
  playBeadTickSound,
  startHealingDrone,
  stopHealingDrone,
} from '@/lib/buddhistSounds';
import { useDharmaStore } from '@/store/useDharmaStore';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
import { cn } from '@/lib/utils';

export type SutraPaperTheme = 'warm-parchment' | 'pure-white' | 'soft-gold';

export interface DharmaSutraReaderProps {
  sutra: SutraText;
  onClose: () => void;
  showToast: (msg: string) => void;
  chantCount?: number;
  onRecitationComplete?: (sutra: SutraText) => void;
}

const PAPER_THEMES: Record<
  SutraPaperTheme,
  {
    label: string;
    bg: string;
    toolbarBg: string;
    cardBg: string;
    text: string;
    subtext: string;
    accent: string;
    border: string;
  }
> = {
  'warm-parchment': {
    label: 'Vàng Kem Dịu',
    bg: 'bg-[#FAF7F0]',
    toolbarBg: 'bg-[#FFFDF8]/95',
    cardBg: 'bg-[#FFFFFF]',
    text: 'text-[#2C1E10]',
    subtext: 'text-[#6B533B]',
    accent: 'text-[#8C5500]',
    border: 'border-[#EAD7A7]',
  },
  'pure-white': {
    label: 'Trắng Tinh Khôi',
    bg: 'bg-[#FFFFFF]',
    toolbarBg: 'bg-[#FFFFFF]/95',
    cardBg: 'bg-[#FFFDF9]',
    text: 'text-[#1F160D]',
    subtext: 'text-[#6A5234]',
    accent: 'text-[#8C5500]',
    border: 'border-[#EEDBBA]',
  },
  'soft-gold': {
    label: 'Giấy Tuyên Hoàng Kim',
    bg: 'bg-[#FFF8E5]',
    toolbarBg: 'bg-[#FFF3D1]/95',
    cardBg: 'bg-[#FFFDF5]',
    text: 'text-[#2E1E0F]',
    subtext: 'text-[#6E522B]',
    accent: 'text-[#9A5E00]',
    border: 'border-[#E2C478]',
  },
};

const AUTO_SCROLL_SPEEDS = [
  { value: 0.5, label: '0.5x (Rất chậm)' },
  { value: 0.8, label: '0.8x (Chuẩn đọc)' },
  { value: 1.0, label: '1.0x (Vừa phải)' },
  { value: 1.5, label: '1.5x (Nhanh vừa)' },
  { value: 2.0, label: '2.0x (Nhanh)' },
] as const;

export function DharmaSutraReader({
  sutra,
  onClose,
  showToast,
  chantCount = 0,
  onRecitationComplete,
}: DharmaSutraReaderProps) {
  const {
    bookmarkedSutraIds,
    toggleSutraBookmark,
    incrementWoodfishCount,
    recordSutraCompletion,
  } = useDharmaStore();

  const isBookmarked = bookmarkedSutraIds.includes(sutra.id);

  // Typography & Light Warm Gold Paper Theme
  const [fontSizePx, setFontSizePx] = useState<number>(20);
  const [paperTheme, setPaperTheme] = useState<SutraPaperTheme>('warm-parchment');
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('serif');

  // Teleprompter Smooth Auto-Scroll (Auto-enabled so user doesn't have to scroll manually)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.8);
  const [scrollProgressPct, setScrollProgressPct] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRemainderRef = useRef<number>(0);
  const manualPauseUntilRef = useRef<number>(0);

  // Soothing Voice Recitation + 432Hz Healing Audio
  const [isVoiceChanting, setIsVoiceChanting] = useState(false);

  // Floating Chanting Assistant (Mõ & Chuông)
  const [isAutoFishOn, setIsAutoFishOn] = useState(false);
  const [fishBpm, setFishBpm] = useState<54 | 68 | 84>(68);
  const [sessionFishTaps, setSessionFishTaps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const theme = PAPER_THEMES[paperTheme];

  // Continuous sub-pixel requestAnimationFrame teleprompter
  useEffect(() => {
    if (!isAutoScrolling) return;
    let rafId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const el = scrollContainerRef.current;

      if (el && Date.now() >= manualPauseUntilRef.current) {
        const pxPerSecond = 24 * scrollSpeed;
        scrollRemainderRef.current += pxPerSecond * dt;
        const delta = Math.floor(scrollRemainderRef.current);
        if (delta >= 1) {
          el.scrollTop += delta;
          scrollRemainderRef.current -= delta;
          const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
          setScrollProgressPct(Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)));
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
            setIsAutoScrolling(false);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoScrolling, scrollSpeed]);

  // Gentle Voice & 432Hz Healing Sound accompaniment
  useEffect(() => {
    if (!isVoiceChanting) {
      stopHealingDrone();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    startHealingDrone('432', 0.18);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const allLines = [
          sutra.title,
          ...sutra.khaiKinh.paragraphs,
          ...sutra.toanVan.flatMap((c) => [c.title, ...c.paragraphs]),
          ...sutra.hoiHuong.paragraphs,
        ].join('. ');

        const utter = new SpeechSynthesisUtterance(allLines);
        utter.lang = 'vi-VN';
        utter.rate = 0.82;
        utter.pitch = 0.95;
        utter.onend = () => {
          setIsVoiceChanting(false);
          stopHealingDrone();
        };
        window.speechSynthesis.speak(utter);
      } catch {
        // fallback to 432Hz drone only
      }
    }

    return () => {
      stopHealingDrone();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isVoiceChanting, sutra]);

  // Auto-BPM Woodfish interval
  useEffect(() => {
    if (!isAutoFishOn) return;
    const ms = Math.round((60 / fishBpm) * 1000);
    const id = setInterval(() => {
      playWoodenFishSound(0.5);
      incrementWoodfishCount(1);
      setSessionFishTaps((c) => c + 1);
    }, ms);
    return () => clearInterval(id);
  }, [isAutoFishOn, fishBpm, incrementWoodfishCount]);

  // Escape key closes reader
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleTapFish = () => {
    playWoodenFishSound(0.6);
    try {
      navigator.vibrate?.(20);
    } catch {}
    incrementWoodfishCount(1);
    setSessionFishTaps((c) => c + 1);
  };

  const handleTapBell = () => {
    playOmTempleBellSound(0.55);
    showToast('Tiếng chuông ngân vang • Nhất tâm trì tụng');
  };

  const handleCompleteTime = () => {
    playOmTempleBellSound(0.68);
    setIsAutoScrolling(false);
    setIsAutoFishOn(false);
    setIsVoiceChanting(false);
    setIsCompleted(true);
    recordSutraCompletion(
      sutra.title,
      `Hoàn mãn thời kinh "${sutra.title}", nguyện hồi hướng công đức cho gia đạo bình an và muôn loài an lạc.`
    );
    recordDharmaMerit({
      type: 'tung-kinh',
      title: `Tụng hoàn mãn: ${sutra.title}`,
      detail: 'Thành tâm trì tụng và hồi hướng công đức',
      meritPoints: 30,
    });
    onRecitationComplete?.(sutra);
    showToast(`Hoàn mãn thời kinh "${sutra.title}"! Đã lưu vào Sổ Công Đức.`);
  };

  const renderSection = (sec: SutraSection, badge?: string) => (
    <section
      key={sec.title}
      className={cn('p-4 sm:p-6 rounded-2xl border space-y-3 shadow-2xs', theme.cardBg, theme.border)}
    >
      <div className="space-y-1 pb-2 border-b border-[#EAD7A7]/60">
        {badge && (
          <span className={cn('text-[10px] font-bold uppercase tracking-widest block whitespace-nowrap', theme.accent)}>
            {badge}
          </span>
        )}
        <h3 className={cn('font-serif font-bold text-base sm:text-lg', theme.accent)}>
          {sec.title}
        </h3>
        {sec.subtitle && <p className={cn('text-xs italic', theme.subtext)}>{sec.subtitle}</p>}
      </div>

      <div className="space-y-4">
        {sec.paragraphs.map((p, idx) => (
          <p
            key={idx}
            style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.85 }}
            className={cn(
              'whitespace-pre-line',
              fontStyle === 'serif' ? 'font-serif' : 'font-sans',
              theme.text
            )}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );

  return (
    <div
      className={cn(
        'fixed inset-0 w-screen h-[100dvh] z-[99999] flex flex-col overflow-hidden transition-colors duration-300',
        theme.bg,
        theme.text
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* ===================================================================== */}
      {/* FULL-SCREEN TOP HEADER WITH BACK BUTTON & AUTO-SCROLL CONTROLS        */}
      {/* ===================================================================== */}
      <header
        className={cn(
          'shrink-0 border-b px-3 sm:px-6 py-2.5 backdrop-blur-md space-y-2 shadow-2xs',
          theme.toolbarBg,
          theme.border
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <h1 className={cn('font-serif font-bold text-sm sm:text-lg whitespace-nowrap truncate', theme.text)}>
              {sutra.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] font-semibold whitespace-nowrap">
              <span className={theme.accent}>{sutra.category}</span>
              <span className={theme.subtext}>• Đã lướt {scrollProgressPct}%</span>
              {chantCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600/15 text-emerald-700 font-mono">
                  {chantCount} biến
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsVoiceChanting((v) => !v)}
              className={cn(
                'px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap',
                isVoiceChanting
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-[#FFF6DF] border-[#E5C67E] text-[#7A5000]'
              )}
              title="Bật giọng đọc kinh nhẹ nhàng & sóng âm 432Hz"
            >
              {isVoiceChanting ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isVoiceChanting ? 'Đang Tụng 432Hz' : 'Giọng Đọc + 432Hz'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playBeadTickSound(0.3);
                toggleSutraBookmark(sutra.id);
                showToast(isBookmarked ? 'Đã bỏ lưu bản kinh' : 'Đã lưu vào Tủ Kinh Yêu Thích');
              }}
              className={cn(
                'p-1.5 rounded-xl border transition-all cursor-pointer shrink-0',
                isBookmarked
                  ? 'bg-[#FAD02C] text-[#3D2505] border-[#E5A91C]'
                  : cn(theme.cardBg, theme.border, theme.subtext)
              )}
              title="Đánh dấu bản kinh"
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
            </button>
          </div>
        </div>

        {/* Teleprompter Auto-Scroll Bar + Font Controls */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs pt-0.5">
          {/* Auto-Scroll Teleprompter Primary Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                manualPauseUntilRef.current = 0;
                setIsAutoScrolling((v) => !v);
              }}
              className={cn(
                'px-3 py-1 rounded-xl border font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all',
                isAutoScrolling
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-[#FFF6DF] border-[#E5C67E] text-[#7A5000]'
              )}
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoScrolling ? 'Tự lướt: BẬT' : 'Tự lướt: TẮT'}</span>
            </button>

            <select
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className={cn(
                'px-2 py-1 rounded-xl border font-bold text-[11px] cursor-pointer whitespace-nowrap',
                theme.cardBg,
                theme.border,
                theme.text
              )}
              aria-label="Tốc độ tự lướt"
            >
              {AUTO_SCROLL_SPEEDS.map((sp) => (
                <option key={sp.value} value={sp.value}>
                  {sp.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop = 0;
                  setScrollProgressPct(0);
                  setIsAutoScrolling(true);
                }
              }}
              className={cn('p-1 rounded-xl border cursor-pointer shrink-0', theme.cardBg, theme.border, theme.subtext)}
              title="Cuộn lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Size & Paper Theme */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setFontSizePx((s) => Math.max(16, s - 2))}
              className={cn('px-2 py-1 rounded-lg border font-bold cursor-pointer whitespace-nowrap', theme.cardBg, theme.border)}
              title="Giảm cỡ chữ"
            >
              <Minus className="w-3 h-3 inline" /> A-
            </button>
            <span className={cn('font-mono text-[11px] min-w-[34px] text-center font-bold', theme.accent)}>
              {fontSizePx}
            </span>
            <button
              type="button"
              onClick={() => setFontSizePx((s) => Math.min(32, s + 2))}
              className={cn('px-2 py-1 rounded-lg border font-bold cursor-pointer whitespace-nowrap', theme.cardBg, theme.border)}
              title="Tăng cỡ chữ"
            >
              A+ <Plus className="w-3 h-3 inline" />
            </button>

            {(Object.keys(PAPER_THEMES) as SutraPaperTheme[]).map((key) => {
              const t = PAPER_THEMES[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaperTheme(key)}
                  className={cn(
                    'hidden md:inline-flex px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all',
                    paperTheme === key
                      ? 'bg-[#FAD02C] text-[#3D2505] border-[#E5A91C]'
                      : cn(theme.cardBg, theme.border, theme.subtext)
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thin Visual Progress Bar */}
        <div className="w-full h-1 bg-[#EAD7A7]/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D9A02E] to-emerald-600 transition-all duration-200"
            style={{ width: `${scrollProgressPct}%` }}
          />
        </div>
      </header>

      {/* ===================================================================== */}
      {/* SCROLLABLE COMPLETE LITURGICAL SUTRA CONTENT (HANDS-FREE AUTO-SCROLL) */}
      {/* ===================================================================== */}
      <div
        ref={scrollContainerRef}
        onTouchStart={() => {
          manualPauseUntilRef.current = Date.now() + 2800;
        }}
        onWheel={() => {
          manualPauseUntilRef.current = Date.now() + 2500;
        }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
          setScrollProgressPct(Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)));
        }}
        className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-5 sm:py-7"
      >
        <div className="max-w-3xl mx-auto space-y-5 pb-36">
          {/* Sutra Title Plaque */}
          <div className={cn('p-5 rounded-2xl border text-center space-y-2 shadow-2xs', theme.cardBg, theme.border)}>
            <LotusMinimalIcon className={cn('w-7 h-7 mx-auto', theme.accent)} />
            <h2 className={cn('font-serif font-bold text-xl sm:text-2xl', theme.text)}>
              {sutra.title}
            </h2>
            <p className={cn('text-xs italic', theme.subtext)}>
              {sutra.sanskritOrPaliTitle} • Dịch giả: {sutra.translator}
            </p>
            <p className={cn('text-xs sm:text-sm leading-relaxed pt-1 max-w-xl mx-auto', theme.subtext)}>
              {sutra.summary}
            </p>
          </div>

          {/* 1. Khai Kinh */}
          {renderSection(sutra.khaiKinh, 'Nghi Thức Mở Đầu')}

          {/* 2. Tịnh Pháp Giới */}
          {renderSection(sutra.tinhPhapGioi, 'Thanh Tịnh Tam Nghiệp')}

          {/* 3. Toàn Văn Chánh Kinh */}
          {sutra.toanVan.map((chapter, idx) =>
            renderSection(chapter, `Chánh Văn • Phần ${idx + 1}/${sutra.toanVan.length}`)
          )}

          {/* 4. Bát Nhã Tâm Kinh */}
          {renderSection(sutra.batNhaTamKinh, 'Trí Tuệ Bát Nhã')}

          {/* 5. Hồi Hướng */}
          {renderSection(sutra.hoiHuong, 'Phát Nguyện Hồi Hướng')}

          {/* 6. Tam Tự Quy Y */}
          {renderSection(sutra.tamTuQuyY, 'Kết Thời Lễ Tạ')}

          {/* Merit Note + Completion Action */}
          <div className={cn('p-6 rounded-2xl border text-center space-y-4 shadow-2xs', theme.cardBg, theme.border)}>
            <p className={cn('text-xs sm:text-sm italic', theme.subtext)}>
              “{sutra.meritNote}”
            </p>
            <button
              type="button"
              onClick={handleCompleteTime}
              disabled={isCompleted}
              className={cn(
                'w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap',
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] active:scale-95'
              )}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isCompleted
                  ? 'Đã Viên Mãn Thời Kinh Hôm Nay'
                  : 'Hoàn Mãn Thời Kinh & Lưu Sổ Công Đức'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FLOATING CHANTING ASSISTANT (MINI MÕ & CHUÔNG BOTTOM-RIGHT)           */}
      {/* ===================================================================== */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-col items-end gap-2">
        <div
          className={cn(
            'p-2 rounded-2xl border shadow-lg backdrop-blur-md flex items-center gap-1.5',
            theme.toolbarBg,
            theme.border
          )}
        >
          <button
            type="button"
            onClick={handleTapBell}
            className={cn(
              'px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform whitespace-nowrap',
              theme.cardBg,
              theme.border,
              theme.accent
            )}
            title="Thỉnh 1 tiếng Chuông"
          >
            <TempleBellIcon className="w-4 h-4 shrink-0" />
            <span>Chuông</span>
          </button>

          <button
            type="button"
            onClick={handleTapFish}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform whitespace-nowrap"
            title="Gõ 1 tiếng Mõ"
          >
            <WoodenFishMinimalIcon className="w-4 h-4 shrink-0" />
            <span>Gõ Mõ ({sessionFishTaps})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !isAutoFishOn;
              setIsAutoFishOn(next);
              if (next) playWoodenFishSound(0.5);
            }}
            className={cn(
              'px-2.5 py-2 rounded-xl border text-[11px] font-bold cursor-pointer whitespace-nowrap',
              isAutoFishOn
                ? 'bg-emerald-600 text-white border-emerald-500'
                : cn(theme.cardBg, theme.border, theme.subtext)
            )}
          >
            {isAutoFishOn ? `${fishBpm} BPM` : 'Auto Mõ'}
          </button>
          {isAutoFishOn && (
            <button
              type="button"
              onClick={() =>
                setFishBpm((b) => (b === 54 ? 68 : b === 68 ? 84 : 54))
              }
              className={cn(
                'px-2 py-2 rounded-xl border text-[10px] font-mono font-bold cursor-pointer whitespace-nowrap',
                theme.cardBg,
                theme.border,
                theme.accent
              )}
              title="Đổi nhịp Auto Mõ"
            >
              Đổi nhịp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
