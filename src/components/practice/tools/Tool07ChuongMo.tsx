'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  BookOpen,
  Sparkles,
  Hand,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  TempleBellIcon,
  WoodenFishMinimalIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  BELL_TIMBRE_OPTIONS,
  WOODFISH_TIMBRE_OPTIONS,
  getMiniSutraTeleprompterItems,
} from '@/data/practiceToolsData';
import {
  playBellWithTimbre,
  playWoodfishWithTimbre,
  type BellTimbre,
  type WoodfishTimbre,
} from '@/lib/buddhistSounds';
import { useDharmaPracticeStore, getTodayDateKey } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

interface Tool07ChuongMoProps {
  showToast: (msg: string) => void;
}

export function Tool07ChuongMo({ showToast }: Tool07ChuongMoProps) {
  const {
    dailyLogs,
    bellStrikesCount,
    incrementWoodfishCount,
    incrementBellStrikes,
  } = useDharmaPracticeStore();

  const todayWoodfish = dailyLogs[getTodayDateKey()]?.woodfishCount || 0;

  // Instrument timbres
  const [bellTimbre, setBellTimbre] = useState<BellTimbre>('hue');
  const [woodfishTimbre, setWoodfishTimbre] = useState<WoodfishTimbre>('go-mit');

  // Auto rhythm, Tap tempo & Opening ritual state
  const [bpm, setBpm] = useState(68);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoBellEveryN, setAutoBellEveryN] = useState<0 | 12 | 36 | 108>(36);
  const [openingRitualStep, setOpeningRitualStep] = useState<number>(0); // 0 = off, 1..3 = Khai Kinh 3 tolls
  const [sessionWoodfishTaps, setSessionWoodfishTaps] = useState(0);
  const [sessionBellTaps, setSessionBellTaps] = useState(0);

  // Animations
  const [bellWaveKey, setBellWaveKey] = useState(0);
  const [woodfishWaveKey, setWoodfishWaveKey] = useState(0);

  // Embedded Mini-Sutra Teleprompter
  const [showMiniSutra, setShowMiniSutra] = useState(false);
  const sutraItems = useMemo(() => getMiniSutraTeleprompterItems(), []);
  const [activeSutraSlug, setActiveSutraSlug] = useState(sutraItems[0]?.slug || 'bat-nha');
  const [isTelepromptScrolling, setIsTelepromptScrolling] = useState(false);

  const sessionTapsRef = useRef(0);
  const tapTempoTimesRef = useRef<number[]>([]);
  const ritualTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const teleprompterBoxRef = useRef<HTMLDivElement | null>(null);

  const strikeBell = useCallback(
    (withRitualLog?: string) => {
      playBellWithTimbre(bellTimbre, 0.56);
      setBellWaveKey((k) => k + 1);
      setSessionBellTaps((c) => c + 1);
      incrementBellStrikes(1, withRitualLog);
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([30, 40, 30]);
        }
      } catch {}
    },
    [bellTimbre, incrementBellStrikes]
  );

  const strikeWoodfish = useCallback(() => {
    playWoodfishWithTimbre(woodfishTimbre, 0.58);
    setWoodfishWaveKey((k) => k + 1);
    const nextTap = sessionTapsRef.current + 1;
    sessionTapsRef.current = nextTap;
    setSessionWoodfishTaps(nextTap);
    incrementWoodfishCount(1);
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(22);
      }
    } catch {}

    if (autoBellEveryN > 0 && nextTap % autoBellEveryN === 0) {
      playBellWithTimbre(bellTimbre, 0.5);
      setBellWaveKey((k) => k + 1);
      incrementBellStrikes(1);
    }
  }, [autoBellEveryN, bellTimbre, incrementBellStrikes, incrementWoodfishCount, woodfishTimbre]);

  // Auto-rhythm BPM interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const ms = Math.max(400, Math.round(60000 / bpm));
    const timer = setInterval(() => {
      strikeWoodfish();
    }, ms);
    return () => clearInterval(timer);
  }, [isAutoPlaying, bpm, strikeWoodfish]);

  // Teleprompter gentle scroll while active
  useEffect(() => {
    if (!showMiniSutra || !isTelepromptScrolling) return;
    const t = setInterval(() => {
      const box = teleprompterBoxRef.current;
      if (box) {
        box.scrollTop += 1;
      }
    }, 65);
    return () => clearInterval(t);
  }, [showMiniSutra, isTelepromptScrolling]);

  // Hotkeys: C -> Chuông, Space / M -> Mõ
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.code === 'KeyC') {
        e.preventDefault();
        strikeBell();
      } else if (e.code === 'Space' || e.code === 'KeyM') {
        e.preventDefault();
        strikeWoodfish();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [strikeBell, strikeWoodfish]);

  // Cleanup opening ritual timers on unmount
  useEffect(() => {
    return () => {
      ritualTimersRef.current.forEach((t) => clearTimeout(t));
      ritualTimersRef.current = [];
    };
  }, []);

  const handleTapTempo = () => {
    const now = Date.now();
    const history = [...tapTempoTimesRef.current.filter((t) => now - t < 2600), now].slice(-4);
    tapTempoTimesRef.current = history;
    if (history.length >= 2) {
      let sumDiff = 0;
      for (let i = 1; i < history.length; i++) {
        sumDiff += history[i] - history[i - 1];
      }
      const avgMs = sumDiff / (history.length - 1);
      const computedBpm = Math.max(35, Math.min(150, Math.round(60000 / avgMs)));
      setBpm(computedBpm);
      showToast(`Đã bắt nhịp Tap Tempo: ${computedBpm} BPM`);
    } else {
      playWoodfishWithTimbre(woodfishTimbre, 0.3);
    }
  };

  const handleStartKhaiKinhRitual = () => {
    ritualTimersRef.current.forEach((t) => clearTimeout(t));
    ritualTimersRef.current = [];
    setIsAutoPlaying(false);
    setOpeningRitualStep(1);
    strikeBell('Khai Kinh Chuẩn (3 Hồi Chuông Gia Trì)');

    const t2 = setTimeout(() => {
      setOpeningRitualStep(2);
      strikeBell();
    }, 1150);
    const t3 = setTimeout(() => {
      setOpeningRitualStep(3);
      strikeBell();
    }, 2300);
    const t4 = setTimeout(() => {
      setOpeningRitualStep(0);
      setIsAutoPlaying(true);
      showToast(`Đã thỉnh đủ 3 hồi Chuông Khai Kinh • Khởi nhịp Mõ ${bpm} BPM`);
    }, 3450);

    ritualTimersRef.current = [t2, t3, t4];
  };

  const activeSutra = sutraItems.find((s) => s.slug === activeSutraSlug) || sutraItems[0];

  return (
    <div className="space-y-5">
      {/* 1. EMBEDDED MINI-SUTRA TELEPROMPTER TOGGLE & PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowMiniSutra((v) => !v)}
          className={cn(
            'px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all',
            showMiniSutra
              ? 'bg-[#FFE07D] border-[#C68B19] text-[#3D2505]'
              : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#8C5500] hover:bg-[#FFF6DF]'
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {showMiniSutra
              ? 'Ẩn Kinh Nhật Tụng Trên Màn Hình'
              : 'Mở Kinh Nhật Tụng Trên Màn Hình Chuông Mõ'}
          </span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#6B533B]">
          <span>Chuông hôm nay: {bellStrikesCount}</span>
          <span>•</span>
          <span>Mõ hôm nay: {todayWoodfish}</span>
        </div>
      </div>

      {showMiniSutra && activeSutra && (
        <div className="rounded-3xl bg-[#FFF9EB] border-2 border-[#EAD7A7] p-4 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EAD7A7]">
            <div className="flex flex-wrap gap-1.5">
              {sutraItems.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setActiveSutraSlug(s.slug)}
                  className={cn(
                    'px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer',
                    s.slug === activeSutraSlug
                      ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsTelepromptScrolling((v) => !v)}
              className="px-3 py-1 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[11px] font-bold text-[#8C5500] cursor-pointer"
            >
              {isTelepromptScrolling ? 'Dừng Cuộn Tự Động' : 'Cuộn Chữ Tự Động'}
            </button>
          </div>

          <div
            ref={teleprompterBoxRef}
            className="h-44 overflow-y-auto space-y-2.5 pr-2 text-xs sm:text-sm leading-relaxed text-[#2C1E10] font-serif"
          >
            {activeSutra.lines.map((line, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE DUAL INSTRUMENT STAGE (BELL LEFT + WOODFISH RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT INSTRUMENT: CHUÔNG GIA TRÌ / ĐẠI HỒNG CHUNG */}
        <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-5 flex flex-col items-center justify-between gap-4 shadow-xs text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-bold text-[#8C5500] z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAD7A7]">
              Phím C • Chuông Gia Trì
            </span>
            <span>Phiên: {sessionBellTaps} hồi</span>
          </div>

          <button
            type="button"
            onClick={() => strikeBell()}
            className="relative w-44 h-44 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform group"
          >
            {/* Expanding Soundwave Rings */}
            {bellWaveKey > 0 && (
              <span
                key={`bell-w-${bellWaveKey}`}
                className="pointer-events-none absolute inset-4 rounded-full border-2 border-[#D99B16] animate-sound-wave"
              />
            )}
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#FFE79A] via-[#E5A91C] to-[#8C5500] border-4 border-white shadow-[0_10px_30px_rgba(180,120,10,0.35)] flex flex-col items-center justify-center text-white">
              <TempleBellIcon className="w-12 h-12" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
                Thỉnh Chuông
              </span>
            </div>
          </button>

          {/* Bell Timbre Selector */}
          <div className="w-full space-y-1.5 text-left text-xs z-10">
            <span className="font-bold text-[#8C5500] block">Âm sắc Chuông:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {BELL_TIMBRE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setBellTimbre(opt.id);
                    playBellWithTimbre(opt.id, 0.45);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all',
                    bellTimbre === opt.id
                      ? 'bg-[#FFFFFF] border-[#C8780A] font-bold text-[#2C1E10] shadow-2xs'
                      : 'bg-[#FFFFFF]/80 border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  <span>
                    {opt.label} <span className="font-normal text-[10px]">({opt.desc})</span>
                  </span>
                  {bellTimbre === opt.id && <Check className="w-3.5 h-3.5 text-[#8C5500]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT INSTRUMENT: MÕ GỖ CHÙA CỔ */}
        <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-5 flex flex-col items-center justify-between gap-4 shadow-xs text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-bold text-[#8C5500] z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAD7A7]">
              Space / M • Mõ Tụng Kinh
            </span>
            <span>Phiên: {sessionWoodfishTaps} tiếng</span>
          </div>

          <button
            type="button"
            onClick={strikeWoodfish}
            className="relative w-44 h-44 flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-transform"
          >
            {woodfishWaveKey > 0 && (
              <span
                key={`fish-w-${woodfishWaveKey}`}
                className="pointer-events-none absolute inset-4 rounded-full border-2 border-[#A05E08] animate-sound-wave"
              />
            )}
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#D99B52] via-[#9C5D24] to-[#4E2A0B] border-4 border-white shadow-[0_10px_30px_rgba(90,50,10,0.35)] flex flex-col items-center justify-center text-[#FFE79A]">
              <WoodenFishMinimalIcon className="w-12 h-12" />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
                Gõ Mõ
              </span>
            </div>
          </button>

          {/* Woodfish Timbre Selector */}
          <div className="w-full space-y-1.5 text-left text-xs z-10">
            <span className="font-bold text-[#8C5500] block">Âm sắc Mõ Gỗ:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {WOODFISH_TIMBRE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setWoodfishTimbre(opt.id);
                    playWoodfishWithTimbre(opt.id, 0.5);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all',
                    woodfishTimbre === opt.id
                      ? 'bg-[#FFFFFF] border-[#C8780A] font-bold text-[#2C1E10] shadow-2xs'
                      : 'bg-[#FFFFFF]/80 border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  <span>
                    {opt.label} <span className="font-normal text-[10px]">({opt.desc})</span>
                  </span>
                  {woodfishTimbre === opt.id && <Check className="w-3.5 h-3.5 text-[#8C5500]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMART AUTO-RHYTHM, TAP TEMPO & KHAI KINH RITUAL BAR */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-4 shadow-xs text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-serif font-bold text-base text-[#2C1E10]">
              Điều Khiển Nhịp Tự Động &amp; Nghi Thức Khai Kinh
            </h4>
            <p className="text-[11px] text-[#6B533B]">
              Tự động giữ nhịp gõ mõ từ 35–150 BPM và phối chuông gia trì theo chu kỳ
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sessionTapsRef.current = 0;
              setSessionWoodfishTaps(0);
              setSessionBellTaps(0);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500] font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại phiên
          </button>
        </div>

        {/* BPM Slider + Tap Tempo */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between font-bold text-[#8C5500]">
              <span>Tốc độ giữ nhịp tự động:</span>
              <span className="font-mono text-sm text-[#2C1E10]">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min={35}
              max={150}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-[#C8780A] cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleTapTempo}
            className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9A02E] text-[#8C5500] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Hand className="w-4 h-4" />
            <span>Tap Tempo</span>
          </button>
        </div>

        {/* Auto Bell Interval Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-[#8C5500]">Phối Chuông tự động sau mỗi:</span>
          <div className="flex flex-wrap gap-1.5">
            {([12, 36, 108, 0] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAutoBellEveryN(n)}
                className={cn(
                  'px-3 py-1.5 rounded-xl border font-bold text-xs cursor-pointer',
                  autoBellEveryN === n
                    ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                    : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                )}
              >
                {n === 0 ? 'Không tự thỉnh chuông' : `${n} tiếng mõ`}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            disabled={openingRitualStep > 0}
            onClick={handleStartKhaiKinhRitual}
            className="py-3 px-4 rounded-2xl bg-[#FFF6DF] hover:bg-[#FCECC2] border border-[#D9A02E] text-[#7A5000] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-75"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {openingRitualStep > 0
                ? `Đang Thỉnh Khai Kinh Hồi ${openingRitualStep}/3...`
                : 'Khai Kinh Chuẩn (3 Hồi Chuông → Tự Gõ Mõ)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((v) => !v)}
            className={cn(
              'py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95',
              isAutoPlaying
                ? 'bg-[#8C5500] text-white'
                : 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505]'
            )}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {isAutoPlaying
                ? `Tạm Dừng Mõ Tự Động (${bpm} BPM)`
                : `Bật Mõ Tự Động (${bpm} BPM)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

