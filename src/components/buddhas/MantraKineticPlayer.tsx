'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Play, Square, Volume2 } from 'lucide-react';
import { BON_TON_MANTRA_CONFIG, type MantraCue } from '@/data/bonTonMantraAudio';
import { cn } from '@/lib/utils';

export interface MantraKineticPlayerProps {
  buddhaId: string;
  sanskritDefault: string;
  vietnameseDefault: string;
  meaningDefault: string;
  benefitsDefault: string;
  playTrigger: number;
  onPlayStateChange?: (playing: boolean) => void;
  onCompleted: () => void;
}

interface FloatingSyllable {
  uid: number;
  text: string;
  xPct: number;
  driftX: number;
  sizeClass: string;
  createdAt: number;
}

const LANE_POSITIONS = [50, 32, 68, 41, 59, 25, 75, 46];
const LANE_DRIFTS = [0, -14, 14, -9, 10, -16, 16, 6];

export function MantraKineticPlayer({
  buddhaId,
  sanskritDefault,
  vietnameseDefault,
  meaningDefault,
  benefitsDefault,
  playTrigger,
  onPlayStateChange,
  onCompleted,
}: MantraKineticPlayerProps) {
  const config = BON_TON_MANTRA_CONFIG[buddhaId];

  const cues: MantraCue[] = useMemo(() => {
    if (config?.cues?.length) return config.cues;
    const words = sanskritDefault.split(/\s+/).filter(Boolean).slice(0, 12);
    return words.map((w, idx) => ({
      text: w.replace(/[.,:;!?]/g, '').toUpperCase(),
      atSec: idx * 1.1 + 0.3,
      displayIndex: idx,
    }));
  }, [config, sanskritDefault]);

  const displayTokens = useMemo(() => {
    if (config?.displayTokens?.length) return config.displayTokens;
    return cues.map((c) => c.text);
  }, [config, cues]);

  const durationSec = config?.durationSec ?? 20;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nextCueIdxRef = useRef(0);
  const uidCounterRef = useRef(0);
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onCompletedRef = useRef(onCompleted);

  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
  }, [onPlayStateChange]);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeDisplayIdx, setActiveDisplayIdx] = useState(-1);
  const [floatingItems, setFloatingItems] = useState<FloatingSyllable[]>([]);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const cancelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    cancelLoop();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // Ignore if metadata is not loaded yet
      }
    }
    nextCueIdxRef.current = 0;
    setIsPlaying(false);
    setCurrentTimeSec(0);
    setActiveDisplayIdx(-1);
    setFloatingItems([]);
    onPlayStateChangeRef.current?.(false);
  }, [cancelLoop]);

  const tickAnimation = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused || audio.ended) {
      return;
    }

    const nowMs = performance.now();
    const t = audio.currentTime;
    setCurrentTimeSec(t);

    let spawnedAny = false;
    const newlySpawned: FloatingSyllable[] = [];
    let latestDisplay = -1;

    while (
      nextCueIdxRef.current < cues.length &&
      t >= cues[nextCueIdxRef.current].atSec
    ) {
      const cueIdx = nextCueIdxRef.current;
      const cue = cues[cueIdx];
      const laneIdx = cueIdx % LANE_POSITIONS.length;
      const isStrong = cueIdx % 4 === 0 || cue.text === 'OM' || cue.text === 'HUM';

      uidCounterRef.current += 1;
      newlySpawned.push({
        uid: uidCounterRef.current,
        text: cue.text,
        xPct: LANE_POSITIONS[laneIdx],
        driftX: LANE_DRIFTS[laneIdx],
        sizeClass: isStrong
          ? 'text-xl sm:text-2xl font-extrabold'
          : 'text-base sm:text-xl font-bold',
        createdAt: nowMs,
      });

      latestDisplay = cue.displayIndex;
      nextCueIdxRef.current += 1;
      spawnedAny = true;
    }

    if (spawnedAny) {
      setActiveDisplayIdx(latestDisplay);
      setFloatingItems((prev) => {
        const alive = prev.filter((item) => nowMs - item.createdAt < 2050);
        return [...alive, ...newlySpawned].slice(-14);
      });
    } else {
      setFloatingItems((prev) => {
        if (!prev.length) return prev;
        const alive = prev.filter((item) => nowMs - item.createdAt < 2050);
        return alive.length === prev.length ? prev : alive;
      });
    }

    rafRef.current = requestAnimationFrame(tickAnimation);
  }, [cues]);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !config?.audioUrl) return;

    cancelLoop();
    nextCueIdxRef.current = 0;
    setActiveDisplayIdx(-1);
    setFloatingItems([]);
    setCurrentTimeSec(0);

    try {
      audio.currentTime = 0;
    } catch {
      // Safe fallback before metadata settles
    }

    try {
      await audio.play();
      setIsPlaying(true);
      onPlayStateChangeRef.current?.(true);
      rafRef.current = requestAnimationFrame(tickAnimation);
    } catch {
      setIsPlaying(false);
      onPlayStateChangeRef.current?.(false);
    }
  }, [cancelLoop, config?.audioUrl, tickAnimation]);

  const prevBuddhaIdRef = useRef(buddhaId);

  // Reset UI expansion only when actually switching deities
  useEffect(() => {
    if (prevBuddhaIdRef.current !== buddhaId) {
      prevBuddhaIdRef.current = buddhaId;
      stopPlayback();
      setShowFullDetails(false);
    }
  }, [buddhaId, stopPlayback]);

  // Auto-play once when Tab 3 ("3. Thần Chú") is clicked (playTrigger > 0),
  // resilient to React StrictMode double mount/cleanup in dev mode.
  useEffect(() => {
    if (playTrigger <= 0) return;
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        startPlayback();
      }
    });
    return () => {
      active = false;
      stopPlayback();
    };
  }, [playTrigger, buddhaId, startPlayback, stopPlayback]);

  const handleEnded = useCallback(() => {
    cancelLoop();
    nextCueIdxRef.current = 0;
    setIsPlaying(false);
    setCurrentTimeSec(0);
    setActiveDisplayIdx(-1);
    onPlayStateChangeRef.current?.(false);
    onCompletedRef.current();
    setTimeout(() => {
      setFloatingItems([]);
    }, 1400);
  }, [cancelLoop]);

  const handleToggle = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const progressPct = Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100));

  return (
    <div className="space-y-3.5 relative">
      {config?.audioUrl && (
        <audio
          ref={audioRef}
          src={config.audioUrl}
          preload="auto"
          playsInline
          onEnded={handleEnded}
        />
      )}

      {/* Kinetic Mantra Sanctuary Box (light cream-gold + floating amber syllables) */}
      <div className="relative rounded-2xl border border-[#E2C275] bg-gradient-to-b from-[#FFF9EB] via-[#FFFBF2] to-[#FFF6E0] px-3.5 py-5 sm:px-5 sm:py-6 overflow-visible">
        {/* Floating kinetic syllables layer — clipped horizontally to never cause page overflow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-12 bottom-4 overflow-x-clip overflow-y-visible z-20"
        >
          {floatingItems.map((item) => (
            <span
              key={item.uid}
              style={
                {
                  left: `${item.xPct}%`,
                  bottom: '22%',
                  '--drift-x': `${item.driftX}px`,
                } as React.CSSProperties
              }
              className={cn(
                'mantra-floating-syllable absolute font-serif tracking-wider whitespace-nowrap select-none',
                item.sizeClass
              )}
            >
              {item.text}
            </span>
          ))}
        </div>

        <div className="relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF2CE] border border-[#E6C77E] text-[10px] font-bold uppercase tracking-widest text-[#8A5400]">
            <Volume2 className={cn('w-3 h-3', isPlaying && 'animate-pulse text-[#C58C1B]')} />
            <span>{isPlaying ? 'Đang Trì Tụng Trọn Biến' : 'Phạn Văn & Phiên Âm'}</span>
          </div>

          {/* Primary Sanskrit Line */}
          <p className="text-sm sm:text-base font-serif font-bold text-[#6E4200] leading-relaxed select-all px-1">
            {config?.sanskritLine || sanskritDefault}
          </p>

          {/* Interactive Syllable Highlight Strip synced to vocal audio */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {displayTokens.map((tok, idx) => {
              const isActive = isPlaying && activeDisplayIdx === idx;
              const isPast = isPlaying && activeDisplayIdx > idx;
              return (
                <span
                  key={`${tok}-${idx}`}
                  className={cn(
                    'px-2 py-0.5 rounded-lg border text-[11px] sm:text-xs font-mono font-bold transition-all duration-200',
                    isActive
                      ? 'mantra-cue-active scale-110 -translate-y-0.5'
                      : isPast
                        ? 'border-[#E6C77E] bg-[#FFF4D6] text-[#7A4B00]'
                        : 'border-[#F0E2BE] bg-white/80 text-[#5C4428]'
                  )}
                >
                  {tok}
                </span>
              );
            })}
          </div>

          {/* Subtle mantra progress bar while chanting */}
          <div className="max-w-xs mx-auto pt-1">
            <div className="h-1 w-full rounded-full bg-[#EAD7A7]/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C58C1B] transition-[width] duration-150 ease-linear"
                style={{ width: `${isPlaying ? progressPct : 0}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#8A5400]">
              <span>{isPlaying ? `${Math.floor(currentTimeSec)}s` : '1 biến trọn'}</span>
              <span>{Math.round(durationSec)}s</span>
            </div>
          </div>

          {/* Centered Toggle Control: "Trì chú" / "■ Trì chú" */}
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={handleToggle}
              className={cn(
                'min-w-[148px] py-2.5 px-6 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap',
                isPlaying
                  ? 'bg-[#8A5400] text-white ring-2 ring-[#E5B84B]/70'
                  : 'bg-[#C58C1B] text-white hover:bg-[#A6730E]'
              )}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Trì chú</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Trì chú</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ý Nghĩa Chân Ngôn */}
      <div className="p-3.5 rounded-xl bg-[#FFFBF2] border border-[#F0E2BE] space-y-1 text-xs sm:text-sm">
        <span className="font-bold text-[#8A5400] block uppercase text-[11px] tracking-wider">
          Ý Nghĩa Chân Ngôn
        </span>
        <p className="text-[#4A3620] leading-relaxed">
          {config?.meaningShort || meaningDefault}
        </p>
      </div>

      {/* Expandable Classical Full Text & Benefits (keeps full reference without cluttering kinetic view) */}
      <div className="rounded-xl border border-[#F0E2BE] bg-[#FFFDF8] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullDetails((v) => !v)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-[#8A5400] hover:bg-[#FFF8E6] transition-colors cursor-pointer"
        >
          <span>Xem đầy đủ phiên âm, ý nghĩa &amp; công đức trì tụng</span>
          {showFullDetails ? (
            <ChevronUp className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" />
          )}
        </button>

        {showFullDetails && (
          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 text-xs sm:text-sm border-t border-[#F2E5C7]">
            <div>
              <span className="font-bold text-[#7D6442] block text-[11px] uppercase tracking-wider">
                Phiên Âm Kinh Văn
              </span>
              <p className="font-mono text-xs text-[#2C1E10] leading-relaxed select-all mt-0.5">
                {vietnameseDefault}
              </p>
            </div>
            <div>
              <span className="font-bold text-[#8A5400] block text-[11px] uppercase tracking-wider">
                Ý Nghĩa Mở Rộng
              </span>
              <p className="text-[#4A3620] leading-relaxed mt-0.5">{meaningDefault}</p>
            </div>
            <div>
              <span className="font-bold text-[#8A5400] block text-[11px] uppercase tracking-wider">
                Công Đức &amp; Lợi Ích Trì Tụng
              </span>
              <p className="text-[#4A3620] leading-relaxed mt-0.5">{benefitsDefault}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
