'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Bookmark,
  Check,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Settings,
  ChevronUp,
  ChevronDown,
  Music2,
  X,
} from 'lucide-react';
import { SutraText, SutraSection } from '@/data/sutras';
import { resolveSutraAudio } from '@/data/sutraAudioMap';
import {
  WoodenFishMinimalIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  playOmTempleBellSound,
  playWoodenFishSound,
  playBeadTickSound,
  stopHealingDrone,
} from '@/lib/buddhistSounds';
import { useDharmaStore } from '@/store/useDharmaStore';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
import { cn } from '@/lib/utils';

function formatMediaClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatChapterHeading(title: string): string {
  return title.replace(/^III\.(\d+\.)?\s*/i, (_, num) => (num ? `${num} ` : '')).trim();
}

export type SutraPaperTheme = 'sepia' | 'ivory' | 'gold' | 'sage' | 'night';

export interface DharmaSutraReaderProps {
  sutra: SutraText;
  onClose: () => void;
  showToast: (msg: string) => void;
  chantCount?: number;
  onRecitationComplete?: (sutra: SutraText) => void;
}

interface PaperThemeSpec {
  label: string;
  swatchHex: string;
  isDark: boolean;
  bg: string;
  fadeFrom: string;
  text: string;
  subtext: string;
  headingText: string;
  pillBg: string;
  pillBorder: string;
  pillHover: string;
  chevronBg: string;
  panelBg: string;
  panelBorder: string;
  activeHighlight: string;
  accentColor: string;
}

const PAPER_THEMES: Record<SutraPaperTheme, PaperThemeSpec> = {
  sepia: {
    label: 'Giấy Ấm',
    swatchHex: '#EAE2D3',
    isDark: false,
    bg: 'bg-[#EAE2D3]',
    fadeFrom: 'from-[#EAE2D3]',
    text: 'text-[#28221A]',
    subtext: 'text-[#6D6354]',
    headingText: 'text-[#211B14]',
    pillBg: 'bg-[#F7F3EB]/75',
    pillBorder: 'border-[#D5C9B6]/70',
    pillHover: 'hover:bg-white/80',
    chevronBg: 'bg-[#D8CEBE]/75 text-[#584E41]',
    panelBg: 'bg-[#FAF6EE]',
    panelBorder: 'border-[#DDD1BE]',
    activeHighlight: 'bg-[#E1D5C1]/60',
    accentColor: '#9C6214',
  },
  ivory: {
    label: 'Trắng',
    swatchHex: '#FFFFFF',
    isDark: false,
    bg: 'bg-[#FFFFFF]',
    fadeFrom: 'from-[#FFFFFF]',
    text: 'text-[#1D1B18]',
    subtext: 'text-[#6A655D]',
    headingText: 'text-[#14120F]',
    pillBg: 'bg-[#F4F2EE]/85',
    pillBorder: 'border-stone-300/75',
    pillHover: 'hover:bg-stone-200/70',
    chevronBg: 'bg-stone-200/80 text-stone-700',
    panelBg: 'bg-white',
    panelBorder: 'border-stone-200',
    activeHighlight: 'bg-amber-50',
    accentColor: '#9C6214',
  },
  gold: {
    label: 'Hoàng Kim',
    swatchHex: '#FFF4D6',
    isDark: false,
    bg: 'bg-[#FFF5DC]',
    fadeFrom: 'from-[#FFF5DC]',
    text: 'text-[#31210E]',
    subtext: 'text-[#735A36]',
    headingText: 'text-[#2A1B08]',
    pillBg: 'bg-[#FFFDF5]/80',
    pillBorder: 'border-[#E3C784]/75',
    pillHover: 'hover:bg-white/90',
    chevronBg: 'bg-[#EAD6A5]/75 text-[#664615]',
    panelBg: 'bg-[#FFFDF7]',
    panelBorder: 'border-[#E5CF97]',
    activeHighlight: 'bg-[#FCEFC7]/75',
    accentColor: '#A6670A',
  },
  sage: {
    label: 'Xanh Dịu',
    swatchHex: '#E7EFE5',
    isDark: false,
    bg: 'bg-[#E7EFE5]',
    fadeFrom: 'from-[#E7EFE5]',
    text: 'text-[#1C2B1E]',
    subtext: 'text-[#4F6352]',
    headingText: 'text-[#142216]',
    pillBg: 'bg-[#F5F9F4]/80',
    pillBorder: 'border-[#C5D5C1]/75',
    pillHover: 'hover:bg-white/85',
    chevronBg: 'bg-[#CBDAC8]/75 text-[#38503B]',
    panelBg: 'bg-[#F8FBF7]',
    panelBorder: 'border-[#CCDACA]',
    activeHighlight: 'bg-[#D7E6D4]/65',
    accentColor: '#2F6842',
  },
  night: {
    label: 'Đọc Đêm',
    swatchHex: '#181411',
    isDark: true,
    bg: 'bg-[#181411]',
    fadeFrom: 'from-[#181411]',
    text: 'text-[#E7DDD0]',
    subtext: 'text-[#A69B8D]',
    headingText: 'text-[#F5EFE6]',
    pillBg: 'bg-[#2A231E]/85',
    pillBorder: 'border-white/12',
    pillHover: 'hover:bg-[#382F29]',
    chevronBg: 'bg-white/12 text-[#DED4C7]',
    panelBg: 'bg-[#231D18]',
    panelBorder: 'border-white/15',
    activeHighlight: 'bg-[#362C23]',
    accentColor: '#E5B85B',
  },
};

const AUTO_SCROLL_SPEEDS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.8, label: '0.8x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2.0x' },
] as const;

const READER_PREFS_KEY = 'dharma_reader_prefs_v2';

interface ReaderPrefs {
  paperTheme?: SutraPaperTheme;
  fontSizePx?: number;
  fontStyle?: 'sans' | 'serif';
  lineHeight?: number;
}

export function DharmaSutraReader({
  sutra,
  onClose,
  showToast,
  onRecitationComplete,
}: DharmaSutraReaderProps) {
  const {
    bookmarkedSutraIds,
    toggleSutraBookmark,
    incrementWoodfishCount,
    recordSutraCompletion,
  } = useDharmaStore();

  const isBookmarked = bookmarkedSutraIds.includes(sutra.id);
  const [mounted, setMounted] = useState(false);

  // Typography & Customizable Paper Color Theme (defaults closely match clean warm sepia reader)
  const [fontSizePx, setFontSizePx] = useState<number>(20);
  const [paperTheme, setPaperTheme] = useState<SutraPaperTheme>('sepia');
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif'>('sans');
  const [lineHeight, setLineHeight] = useState<number>(1.8);

  // Clean Floating Overlays: Section TOC dropdown & Settings panel
  const [showSectionToc, setShowSectionToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  // Optional Reading Utilities (tucked neatly inside Settings panel so main UI stays distraction-free)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.8);
  const [scrollProgressPct, setScrollProgressPct] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollRemainderRef = useRef<number>(0);
  const manualPauseUntilRef = useRef<number>(0);

  // Optional MP3 Sutra Chanting Player
  const sutraAudio = useMemo(() => resolveSutraAudio(sutra), [sutra]);
  const mp3AudioRef = useRef<HTMLAudioElement | null>(null);
  const lastSavedMp3TimeRef = useRef<number>(0);
  const triedFallbackMp3Ref = useRef<boolean>(false);
  const [showMp3Bar, setShowMp3Bar] = useState(false);
  const [isMp3Playing, setIsMp3Playing] = useState(false);
  const [mp3CurrentTime, setMp3CurrentTime] = useState(0);
  const [mp3Duration, setMp3Duration] = useState(0);
  const [mp3Rate, setMp3Rate] = useState<number>(1.0);
  const [activeMp3Url, setActiveMp3Url] = useState<string>(sutraAudio.mp3Url);

  // Wooden Fish & Completion
  const [isAutoFishOn, setIsAutoFishOn] = useState(false);
  const [sessionFishTaps, setSessionFishTaps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mount portal + load persisted reader preferences
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(READER_PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ReaderPrefs;
        if (parsed.paperTheme && parsed.paperTheme in PAPER_THEMES) {
          setPaperTheme(parsed.paperTheme);
        }
        if (typeof parsed.fontSizePx === 'number') {
          setFontSizePx(Math.min(30, Math.max(15, parsed.fontSizePx)));
        }
        if (parsed.fontStyle === 'sans' || parsed.fontStyle === 'serif') {
          setFontStyle(parsed.fontStyle);
        }
        if (typeof parsed.lineHeight === 'number') {
          setLineHeight(parsed.lineHeight);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const prefs: ReaderPrefs = { paperTheme, fontSizePx, fontStyle, lineHeight };
      localStorage.setItem(READER_PREFS_KEY, JSON.stringify(prefs));
    } catch {}
  }, [mounted, paperTheme, fontSizePx, fontStyle, lineHeight]);

  // Chánh Văn sections first so reader opens straight into actual scripture text
  const orderedSections = useMemo(
    () => [
      ...sutra.toanVan.map((ch, idx) => ({
        secKey: `toanvan-${idx}`,
        displayTitle: formatChapterHeading(ch.title),
        section: ch,
        groupLabel: `Chánh Văn • Phần ${idx + 1}`,
      })),
      {
        secKey: 'khai-kinh',
        displayTitle: sutra.khaiKinh.title,
        section: sutra.khaiKinh,
        groupLabel: 'Nghi Thức Mở Đầu',
      },
      {
        secKey: 'tinh-phap-gioi',
        displayTitle: sutra.tinhPhapGioi.title,
        section: sutra.tinhPhapGioi,
        groupLabel: 'Thanh Tịnh Tam Nghiệp',
      },
      ...(sutra.slug !== 'bat-nha-tam-kinh'
        ? [
            {
              secKey: 'bat-nha',
              displayTitle: sutra.batNhaTamKinh.title,
              section: sutra.batNhaTamKinh,
              groupLabel: 'Trí Tuệ Bát Nhã',
            },
          ]
        : []),
      {
        secKey: 'hoi-huong',
        displayTitle: sutra.hoiHuong.title,
        section: sutra.hoiHuong,
        groupLabel: 'Hồi Hướng Công Đức',
      },
      {
        secKey: 'tam-tu-quy-y',
        displayTitle: sutra.tamTuQuyY.title,
        section: sutra.tamTuQuyY,
        groupLabel: 'Tam Tự Quy Y',
      },
    ],
    [sutra]
  );

  // Reset per-sutra state when switching sutra
  useEffect(() => {
    setIsMp3Playing(false);
    setShowMp3Bar(false);
    setShowSectionToc(false);
    setActiveSectionIdx(0);
    setIsCompleted(false);
    triedFallbackMp3Ref.current = false;
    setActiveMp3Url(sutraAudio.mp3Url);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    if (mp3AudioRef.current) {
      mp3AudioRef.current.pause();
    }

    let restored = 0;
    try {
      const raw = localStorage.getItem('dharma_sutra_mp3_pos');
      const map = raw ? JSON.parse(raw) : {};
      if (typeof map?.[sutra.id] === 'number' && map[sutra.id] > 2) {
        restored = map[sutra.id];
      }
    } catch {}
    setMp3CurrentTime(restored);
    lastSavedMp3TimeRef.current = restored;
    setMp3Duration(0);
  }, [sutra.id, sutraAudio.mp3Url]);

  // Cleanup audio & body scroll lock
  useEffect(() => {
    stopHealingDrone();
    const audioEl = mp3AudioRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else if (showSectionToc) {
          setShowSectionToc(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (audioEl) audioEl.pause();
    };
  }, [onClose, showSettings, showSectionToc]);

  const saveMp3Position = (sec: number) => {
    try {
      const raw = localStorage.getItem('dharma_sutra_mp3_pos');
      const map = raw ? JSON.parse(raw) : {};
      map[sutra.id] = sec;
      localStorage.setItem('dharma_sutra_mp3_pos', JSON.stringify(map));
    } catch {}
  };

  const handleToggleMp3 = () => {
    const audio = mp3AudioRef.current;
    if (!audio) return;

    setShowMp3Bar(true);

    if (isMp3Playing) {
      audio.pause();
      setIsMp3Playing(false);
      saveMp3Position(audio.currentTime);
      return;
    }

    if (
      mp3CurrentTime > 2 &&
      Math.abs(audio.currentTime - mp3CurrentTime) > 1.5 &&
      Number.isFinite(audio.duration)
    ) {
      audio.currentTime = Math.min(mp3CurrentTime, audio.duration);
    }
    audio.playbackRate = mp3Rate;
    audio
      .play()
      .then(() => {
        setIsMp3Playing(true);
      })
      .catch(() => {
        setIsMp3Playing(false);
        showToast('Nhấn nút Phát trên thanh Pháp âm để nghe');
      });
  };

  const handleSeekMp3Offset = (deltaSec: number) => {
    const audio = mp3AudioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const next = Math.max(0, Math.min(audio.duration, audio.currentTime + deltaSec));
    audio.currentTime = next;
    setMp3CurrentTime(next);
    saveMp3Position(next);
  };

  const handleCycleMp3Rate = () => {
    const rates = [0.85, 1.0, 1.15, 1.3];
    const next = rates[(rates.indexOf(mp3Rate) + 1) % rates.length] ?? 1.0;
    setMp3Rate(next);
    if (mp3AudioRef.current) {
      mp3AudioRef.current.playbackRate = next;
    }
    showToast(`Tốc độ pháp âm: ${next.toFixed(next === 1 ? 1 : 2)}x`);
  };

  // Continuous sub-pixel requestAnimationFrame teleprompter when enabled in Settings
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

  // Optional Auto-BPM Woodfish interval
  useEffect(() => {
    if (!isAutoFishOn) return;
    const id = setInterval(() => {
      playWoodenFishSound(0.5);
      incrementWoodfishCount(1);
      setSessionFishTaps((c) => c + 1);
    }, Math.round((60 / 68) * 1000));
    return () => clearInterval(id);
  }, [isAutoFishOn, incrementWoodfishCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    setScrollProgressPct(Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)));

    // Sync active section banner with viewport reading position
    const containerTop = el.getBoundingClientRect().top;
    const triggerOffset = 148;
    let currentIdx = 0;
    for (let i = 0; i < sectionRefs.current.length; i += 1) {
      const secEl = sectionRefs.current[i];
      if (!secEl) continue;
      if (secEl.getBoundingClientRect().top - containerTop <= triggerOffset) {
        currentIdx = i;
      }
    }
    setActiveSectionIdx(currentIdx);
  };

  const handleJumpToSection = (idx: number) => {
    const target = sectionRefs.current[idx];
    const container = scrollContainerRef.current;
    if (target && container) {
      const top =
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        122;
      container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      setActiveSectionIdx(idx);
    }
    setShowSectionToc(false);
  };

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
    if (mp3AudioRef.current) mp3AudioRef.current.pause();
    setIsMp3Playing(false);
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
    showToast(`Hoàn mãn "${sutra.title}" • Đã lưu Sổ Công Đức`);
  };

  const theme = PAPER_THEMES[paperTheme];
  const activeSection = orderedSections[activeSectionIdx] ?? orderedSections[0];

  if (!mounted) return null;

  const readerNode = (
    <div
      className={cn(
        'fixed inset-0 w-screen h-[100dvh] z-[99999] flex flex-col overflow-hidden transition-colors duration-300 select-text',
        theme.bg,
        theme.text
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`Đọc kinh: ${sutra.title}`}
    >
      {/* Hidden HTML5 MP3 Audio Element */}
      <audio
        ref={mp3AudioRef}
        src={activeMp3Url}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (Number.isFinite(el.duration)) setMp3Duration(el.duration);
          if (mp3CurrentTime > 2 && Number.isFinite(el.duration)) {
            el.currentTime = Math.min(mp3CurrentTime, Math.max(0, el.duration - 2));
          }
        }}
        onTimeUpdate={(e) => {
          const cur = e.currentTarget.currentTime;
          setMp3CurrentTime(cur);
          if (Number.isFinite(e.currentTarget.duration)) {
            setMp3Duration(e.currentTarget.duration);
          }
          if (Math.abs(cur - lastSavedMp3TimeRef.current) >= 3) {
            lastSavedMp3TimeRef.current = cur;
            saveMp3Position(cur);
          }
        }}
        onEnded={() => {
          setIsMp3Playing(false);
          setMp3CurrentTime(0);
          saveMp3Position(0);
          playOmTempleBellSound(0.5);
          showToast(`Hoàn mãn pháp âm: ${sutra.title}`);
        }}
        onError={() => {
          if (
            !triedFallbackMp3Ref.current &&
            sutraAudio.fallbackMp3Url &&
            activeMp3Url !== sutraAudio.fallbackMp3Url
          ) {
            triedFallbackMp3Ref.current = true;
            setActiveMp3Url(sutraAudio.fallbackMp3Url);
            return;
          }
          setIsMp3Playing(false);
        }}
        className="hidden"
      />

      {/* ===================================================================== */}
      {/* FLOATING TRANSLUCENT TOP CHROME (X Close, Title, Save + Settings pill) */}
      {/* ===================================================================== */}
      <header className="absolute inset-x-0 top-0 z-30 pointer-events-none">
        <div
          className={cn(
            'bg-gradient-to-b via-transparent to-transparent px-3.5 sm:px-6 pt-3 pb-3',
            theme.fadeFrom
          )}
        >
          <div className="max-w-2xl mx-auto space-y-2">
            {/* Row 1: Circle X Close • Single-Line Title • Paired Bookmark & Settings Pill */}
            <div className="flex items-center justify-between gap-2.5 pointer-events-auto">
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng trình đọc kinh"
                className={cn(
                  'w-10 h-10 rounded-full border backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer',
                  theme.pillBg,
                  theme.pillBorder,
                  theme.pillHover,
                  theme.text
                )}
              >
                <X className="w-[18px] h-[18px] stroke-[2.2]" />
              </button>

              <h1
                className={cn(
                  'min-w-0 flex-1 text-center font-semibold text-[15px] sm:text-base whitespace-nowrap truncate px-1',
                  theme.headingText
                )}
              >
                {sutra.title}
              </h1>

              <div
                className={cn(
                  'rounded-full border backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-0.5 flex items-center gap-0.5 shrink-0',
                  theme.pillBg,
                  theme.pillBorder
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    playBeadTickSound(0.3);
                    toggleSutraBookmark(sutra.id);
                    showToast(isBookmarked ? 'Đã bỏ lưu bản kinh' : 'Đã lưu vào Tủ Kinh');
                  }}
                  aria-label="Lưu bản kinh"
                  title="Lưu bản kinh"
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap',
                    theme.pillHover
                  )}
                >
                  <Bookmark
                    className={cn('w-[18px] h-[18px]', isBookmarked && 'fill-current')}
                    style={isBookmarked ? { color: theme.accentColor } : undefined}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSectionToc(false);
                    setShowSettings((v) => !v);
                  }}
                  aria-label="Cài đặt đọc kinh"
                  title="Cài đặt màu nền & chữ"
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap',
                    showSettings && theme.activeHighlight,
                    theme.pillHover
                  )}
                >
                  <Settings className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Row 2: Active Chapter / Section Pill Banner + Quick-Jump Toggle */}
            {activeSection && (
              <div className="pointer-events-auto relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettings(false);
                    setShowSectionToc((v) => !v);
                  }}
                  className={cn(
                    'w-full rounded-2xl border backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer',
                    theme.pillBg,
                    theme.pillBorder,
                    theme.pillHover
                  )}
                  aria-expanded={showSectionToc}
                >
                  <span className={cn('text-xs sm:text-[13px] font-medium leading-snug line-clamp-2 flex-1', theme.subtext)}>
                    {activeSection.displayTitle}
                  </span>
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                      theme.chevronBg
                    )}
                  >
                    {showSectionToc ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {/* Collapsible Quick-Jump Section Menu */}
                {showSectionToc && (
                  <div
                    className={cn(
                      'mt-2 rounded-2xl border shadow-xl p-2 max-h-[55vh] overflow-y-auto space-y-1',
                      theme.panelBg,
                      theme.panelBorder
                    )}
                  >
                    {orderedSections.map((item, idx) => {
                      const isActive = idx === activeSectionIdx;
                      return (
                        <button
                          key={item.secKey}
                          type="button"
                          onClick={() => handleJumpToSection(idx)}
                          className={cn(
                            'w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer',
                            isActive ? theme.activeHighlight : theme.pillHover
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <span
                              className="block text-[10px] font-bold uppercase tracking-wider opacity-75"
                              style={{ color: theme.accentColor }}
                            >
                              {item.groupLabel}
                            </span>
                            <span className={cn('block font-medium truncate mt-0.5', theme.text)}>
                              {item.displayTitle}
                            </span>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 shrink-0" style={{ color: theme.accentColor }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Optional Compact MP3 Player Bar (only appears when user enables it inside Settings) */}
            {(showMp3Bar || isMp3Playing) && (
              <div
                className={cn(
                  'pointer-events-auto rounded-2xl border px-3 py-2 shadow-md flex items-center gap-2',
                  theme.panelBg,
                  theme.panelBorder
                )}
              >
                <button
                  type="button"
                  onClick={handleToggleMp3}
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                  style={{ backgroundColor: theme.accentColor }}
                  title={isMp3Playing ? 'Tạm dừng MP3' : 'Phát MP3'}
                >
                  {isMp3Playing ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSeekMp3Offset(-15)}
                  className={cn('px-1.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer shrink-0 whitespace-nowrap', theme.panelBorder, theme.subtext)}
                >
                  -15s
                </button>
                <span className={cn('font-mono text-[10px] font-bold shrink-0', theme.subtext)}>
                  {formatMediaClock(mp3CurrentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={mp3Duration > 0 ? mp3Duration : 180}
                  step={1}
                  value={Math.min(mp3CurrentTime, mp3Duration > 0 ? mp3Duration : 180)}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setMp3CurrentTime(next);
                    if (mp3AudioRef.current) mp3AudioRef.current.currentTime = next;
                    saveMp3Position(next);
                  }}
                  className="flex-1 min-w-[60px] h-1.5 cursor-pointer"
                  style={{ accentColor: theme.accentColor }}
                  aria-label="Tua tiến độ file kinh MP3"
                />
                <span className={cn('font-mono text-[10px] font-bold shrink-0', theme.subtext)}>
                  {mp3Duration > 0 ? formatMediaClock(mp3Duration) : '--:--'}
                </span>
                <button
                  type="button"
                  onClick={() => handleSeekMp3Offset(15)}
                  className={cn('px-1.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer shrink-0 whitespace-nowrap inline-flex items-center gap-0.5', theme.panelBorder, theme.subtext)}
                >
                  +15s <RotateCw className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCycleMp3Rate}
                  className={cn('px-1.5 py-1 rounded-lg border text-[10px] font-mono font-bold cursor-pointer shrink-0 whitespace-nowrap', theme.panelBorder)}
                  style={{ color: theme.accentColor }}
                >
                  {mp3Rate.toFixed(mp3Rate === 1 ? 1 : 2)}x
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (mp3AudioRef.current) mp3AudioRef.current.pause();
                    setIsMp3Playing(false);
                    setShowMp3Bar(false);
                  }}
                  className={cn('p-1 rounded-lg cursor-pointer shrink-0', theme.subtext)}
                  title="Đóng thanh pháp âm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* FULL-SCREEN EDGE-TO-EDGE BOOK READING CANVAS (NO CLUTTER CARDS)       */}
      {/* ===================================================================== */}
      <div
        ref={scrollContainerRef}
        onTouchStart={() => {
          manualPauseUntilRef.current = Date.now() + 2800;
        }}
        onWheel={() => {
          manualPauseUntilRef.current = Date.now() + 2500;
        }}
        onClick={() => {
          if (showSectionToc) setShowSectionToc(false);
        }}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 sm:px-8 pt-32 sm:pt-36 pb-20"
      >
        <div className="max-w-2xl mx-auto space-y-10">
          {orderedSections.map(({ secKey, displayTitle, section }, secIdx) => (
            <section
              key={secKey}
              ref={(el) => {
                sectionRefs.current[secIdx] = el;
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h2
                  className={cn(
                    'font-bold text-base sm:text-xl tracking-wide uppercase leading-snug',
                    fontStyle === 'serif' ? 'font-serif' : 'font-sans',
                    theme.headingText
                  )}
                >
                  {displayTitle}
                </h2>
                {section.subtitle && (
                  <p className={cn('text-xs sm:text-sm italic', theme.subtext)}>
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={`${secKey}::${pIdx}`}
                    style={{ fontSize: `${fontSizePx}px`, lineHeight }}
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
          ))}

          {/* Quiet Completion Section at end of scripture */}
          <div className={cn('pt-6 border-t text-center space-y-4', theme.panelBorder)}>
            <p className={cn('text-xs sm:text-sm italic leading-relaxed', theme.subtext)}>
              “{sutra.meritNote}”
            </p>
            <button
              type="button"
              onClick={handleCompleteTime}
              disabled={isCompleted}
              className={cn(
                'px-6 py-3 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm',
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'text-white active:scale-95'
              )}
              style={!isCompleted ? { backgroundColor: theme.accentColor } : undefined}
            >
              <Check className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span>
                {isCompleted ? 'Đã Viên Mãn Thời Kinh' : 'Hoàn Mãn Thời Kinh & Lưu Công Đức'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SETTINGS POPOVER (CUSTOMIZE COLORS, FONT SIZE, TYPOGRAPHY & EXTRAS)   */}
      {/* ===================================================================== */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] flex items-start justify-center sm:justify-end pt-16 px-3.5 sm:px-6"
          onClick={() => setShowSettings(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-sm rounded-3xl border shadow-2xl p-4 sm:p-5 space-y-4 animate-scale-in',
              theme.panelBg,
              theme.panelBorder,
              theme.text
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold">Cài đặt hiển thị kinh</h3>
                <p className={cn('text-[11px]', theme.subtext)}>
                  Tiến độ đọc hiện tại: {scrollProgressPct}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                aria-label="Đóng cài đặt"
                className={cn('w-8 h-8 rounded-full flex items-center justify-center cursor-pointer', theme.chevronBg)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Background Color Swatches */}
            <div className="space-y-2">
              <span className={cn('text-[11px] font-bold uppercase tracking-wider block', theme.subtext)}>
                Màu nền giấy đọc
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {(Object.keys(PAPER_THEMES) as SutraPaperTheme[]).map((key) => {
                  const spec = PAPER_THEMES[key];
                  const selected = paperTheme === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPaperTheme(key)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 px-1 py-1.5 rounded-2xl border transition-all cursor-pointer',
                        selected ? 'border-current shadow-xs' : theme.panelBorder
                      )}
                      style={selected ? { borderColor: theme.accentColor } : undefined}
                      title={spec.label}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: spec.swatchHex }}
                      >
                        {selected && (
                          <Check
                            className="w-4 h-4 stroke-[2.5]"
                            style={{ color: spec.isDark ? '#F5EFE6' : '#28221A' }}
                          />
                        )}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-semibold whitespace-nowrap">
                        {spec.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Font Size Stepper */}
            <div className="space-y-2">
              <span className={cn('text-[11px] font-bold uppercase tracking-wider block', theme.subtext)}>
                Cỡ chữ
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFontSizePx((s) => Math.max(15, s - 1))}
                  className={cn('py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap', theme.panelBorder, theme.pillHover)}
                >
                  <Minus className="w-3.5 h-3.5 shrink-0" />
                  <span>Nhỏ hơn</span>
                </button>
                <div className={cn('py-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-center', theme.panelBorder)}>
                  {fontSizePx}px
                </div>
                <button
                  type="button"
                  onClick={() => setFontSizePx((s) => Math.min(30, s + 1))}
                  className={cn('py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap', theme.panelBorder, theme.pillHover)}
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Lớn hơn</span>
                </button>
              </div>
            </div>

            {/* 3. Font Family & Line Height */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <span className={cn('text-[11px] font-bold uppercase tracking-wider block', theme.subtext)}>
                  Phông chữ
                </span>
                <div className={cn('grid grid-cols-2 p-1 rounded-xl border gap-1', theme.panelBorder)}>
                  <button
                    type="button"
                    onClick={() => setFontStyle('sans')}
                    className={cn(
                      'py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer whitespace-nowrap transition-colors',
                      fontStyle === 'sans' ? theme.activeHighlight : theme.subtext
                    )}
                  >
                    Sans
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontStyle('serif')}
                    className={cn(
                      'py-1.5 rounded-lg text-xs font-serif font-bold cursor-pointer whitespace-nowrap transition-colors',
                      fontStyle === 'serif' ? theme.activeHighlight : theme.subtext
                    )}
                  >
                    Serif
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className={cn('text-[11px] font-bold uppercase tracking-wider block', theme.subtext)}>
                  Giãn dòng
                </span>
                <div className={cn('grid grid-cols-3 p-1 rounded-xl border gap-1', theme.panelBorder)}>
                  {[
                    { val: 1.65, label: 'Vừa' },
                    { val: 1.8, label: 'Thoáng' },
                    { val: 2.05, label: 'Rộng' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setLineHeight(opt.val)}
                      className={cn(
                        'py-1.5 rounded-lg text-[11px] font-bold cursor-pointer whitespace-nowrap transition-colors',
                        Math.abs(lineHeight - opt.val) < 0.05 ? theme.activeHighlight : theme.subtext
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Optional Chanting & Auto-Scroll Utilities */}
            <div className={cn('pt-3 border-t space-y-2', theme.panelBorder)}>
              <span className={cn('text-[11px] font-bold uppercase tracking-wider block', theme.subtext)}>
                Tiện ích trì tụng
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    manualPauseUntilRef.current = 0;
                    setIsAutoScrolling((v) => !v);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors',
                    isAutoScrolling ? 'bg-emerald-600 text-white border-emerald-600' : theme.panelBorder
                  )}
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoScrolling ? 'Đang tự lướt' : 'Tự lướt'}</span>
                </button>

                {isAutoScrolling && (
                  <select
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    className={cn(
                      'px-2 py-1.5 rounded-xl border text-base sm:text-xs font-bold cursor-pointer whitespace-nowrap',
                      theme.panelBg,
                      theme.panelBorder,
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
                )}

                <button
                  type="button"
                  onClick={handleToggleMp3}
                  className={cn(
                    'px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors',
                    isMp3Playing || showMp3Bar
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : theme.panelBorder
                  )}
                >
                  <Music2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Pháp âm .MP3</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTop = 0;
                      setActiveSectionIdx(0);
                      setScrollProgressPct(0);
                    }
                    setShowSettings(false);
                    showToast('Đã cuộn về đầu bản kinh');
                  }}
                  className={cn('px-2.5 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap', theme.panelBorder)}
                  title="Về đầu bản kinh"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Về đầu</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTapBell}
                  className={cn('px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap', theme.panelBorder)}
                >
                  <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Thỉnh Chuông</span>
                </button>

                <button
                  type="button"
                  onClick={handleTapFish}
                  className={cn('px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap', theme.panelBorder)}
                >
                  <WoodenFishMinimalIcon className="w-3.5 h-3.5 shrink-0" />
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
                    'px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap',
                    isAutoFishOn ? 'bg-emerald-600 text-white border-emerald-600' : theme.panelBorder
                  )}
                >
                  {isAutoFishOn ? 'Auto Mõ: BẬT' : 'Auto Mõ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(readerNode, document.body);
}
