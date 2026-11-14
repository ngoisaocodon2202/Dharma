'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  externalAudioRef?: React.RefObject<HTMLAudioElement | null>;
  portalContainer?: HTMLElement | null;
  onPlayStateChange?: (playing: boolean) => void;
  onCompleted: () => void;
}

interface FloatingSyllable {
  uid: number;
  text: string;
  xPct: number;
  yPct: number;
  driftX: number;
  tiltDeg: number;
  sizeClass: string;
  createdAt: number;
}

interface ScatterSpot {
  xPct: number;
  yPct: number;
  driftX: number;
  tilt: number;
}

// Distributed across the whole deity detail card (Hero portrait top, middle tabs, and bottom mantra area)
const SCATTER_SPOTS: ScatterSpot[] = [
  { xPct: 20, yPct: 14, driftX: -12, tilt: -6 },
  { xPct: 80, yPct: 62, driftX: 12, tilt: 5 },
  { xPct: 18, yPct: 48, driftX: -10, tilt: -4 },
  { xPct: 78, yPct: 18, driftX: 14, tilt: 6 },
  { xPct: 48, yPct: 76, driftX: -8, tilt: -3 },
  { xPct: 52, yPct: 8, driftX: 8, tilt: 4 },
  { xPct: 22, yPct: 78, driftX: -14, tilt: -5 },
  { xPct: 82, yPct: 38, driftX: 10, tilt: 5 },
  { xPct: 32, yPct: 28, driftX: -8, tilt: 3 },
  { xPct: 72, yPct: 82, driftX: 12, tilt: -6 },
  { xPct: 15, yPct: 64, driftX: 10, tilt: 4 },
  { xPct: 64, yPct: 44, driftX: -10, tilt: -4 },
];

// Compensate slight PCM output / visual render lead so floating syllables land in lockstep with audible voice
const AUDIO_SYNC_OFFSET_SEC = 0;

export function MantraKineticPlayer({
  buddhaId,
  sanskritDefault,
  vietnameseDefault,
  meaningDefault,
  benefitsDefault,
  playTrigger,
  externalAudioRef,
  portalContainer,
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

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nextCueIdxRef = useRef(0);
  const uidCounterRef = useRef(0);
  const playTriggerRef = useRef(playTrigger);
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onCompletedRef = useRef(onCompleted);

  const getAudioEl = useCallback(
    () => externalAudioRef?.current ?? localAudioRef.current,
    [externalAudioRef]
  );

  useEffect(() => {
    playTriggerRef.current = playTrigger;
  }, [playTrigger]);

  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
  }, [onPlayStateChange]);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [awaitingGestureUnlock, setAwaitingGestureUnlock] = useState(false);
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
    const audio = getAudioEl();
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
    setAwaitingGestureUnlock(false);
    setCurrentTimeSec(0);
    setActiveDisplayIdx(-1);
    setFloatingItems([]);
    onPlayStateChangeRef.current?.(false);
  }, [cancelLoop, getAudioEl]);

  const advanceCuesAtTime = useCallback(
    (t: number, nowMs: number) => {
      setCurrentTimeSec(t);

      const triggerSeed = playTriggerRef.current;
      let spawnedAny = false;
      const newlySpawned: FloatingSyllable[] = [];
      let latestDisplay = -1;

      while (
        nextCueIdxRef.current < cues.length &&
        t >= cues[nextCueIdxRef.current].atSec
      ) {
        const cueIdx = nextCueIdxRef.current;
        const cue = cues[cueIdx];
        const spot = SCATTER_SPOTS[(cueIdx + triggerSeed * 3) % SCATTER_SPOTS.length];
        const xJitter = ((cueIdx * 11 + triggerSeed * 7) % 11) - 5;
        const yJitter = ((cueIdx * 7 + triggerSeed * 5) % 7) - 3;
        const xPct = Math.min(89, Math.max(11, spot.xPct + xJitter));
        const yPct = Math.min(86, Math.max(7, spot.yPct + yJitter));
        const isStrong = cueIdx % 4 === 0 || cue.text === 'OM' || cue.text === 'HUM';

        uidCounterRef.current += 1;
        newlySpawned.push({
          uid: uidCounterRef.current,
          text: cue.text,
          xPct,
          yPct,
          driftX: spot.driftX,
          tiltDeg: spot.tilt,
          sizeClass: isStrong
            ? 'text-2xl sm:text-3xl font-extrabold'
            : 'text-lg sm:text-2xl font-bold',
          createdAt: nowMs,
        });

        latestDisplay = cue.displayIndex;
        nextCueIdxRef.current += 1;
        spawnedAny = true;
      }

      if (spawnedAny) {
        setActiveDisplayIdx(latestDisplay);
        setFloatingItems((prev) => {
          const alive = prev.filter((item) => nowMs - item.createdAt < 2250);
          return [...alive, ...newlySpawned].slice(-18);
        });
      } else {
        setFloatingItems((prev) => {
          if (!prev.length) return prev;
          const alive = prev.filter((item) => nowMs - item.createdAt < 2250);
          return alive.length === prev.length ? prev : alive;
        });
      }
    },
    [cues]
  );

  const tickAnimation = useCallback(() => {
    const nowMs = performance.now();
    const audio = getAudioEl();
    if (!audio || audio.paused || audio.ended) {
      rafRef.current = null;
      return;
    }

    // Strict sync lock: never advance text cues until audio buffer is ready and clock is moving audibly
    if (audio.readyState >= 2 && audio.currentTime > 0.03) {
      const syncedTime = Math.max(0, audio.currentTime - AUDIO_SYNC_OFFSET_SEC);
      advanceCuesAtTime(syncedTime, nowMs);
    }
    rafRef.current = requestAnimationFrame(tickAnimation);
  }, [advanceCuesAtTime, getAudioEl]);

  const startPlayback = useCallback(async () => {
    const audio = getAudioEl();
    if (!audio || !config?.audioUrl) return;

    cancelLoop();
    nextCueIdxRef.current = 0;
    setActiveDisplayIdx(-1);
    setFloatingItems([]);
    setCurrentTimeSec(0);

    try {
      const targetSrc = config.audioUrl;
      const currentAttr = audio.getAttribute('src') || '';
      if (currentAttr !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
      }
      if (audio.paused || audio.currentTime > 0.35) {
        audio.currentTime = 0;
      }
    } catch {
      // Safe fallback before metadata settles
    }

    try {
      if (audio.paused) {
        await audio.play();
      }
      setAwaitingGestureUnlock(false);
      setIsPlaying(true);
      onPlayStateChangeRef.current?.(true);
      rafRef.current = requestAnimationFrame(tickAnimation);
    } catch {
      // Autoplay blocked on direct deep-link: pause cleanly and start BOTH sound & words together on first tap
      setAwaitingGestureUnlock(true);
      setIsPlaying(false);
      onPlayStateChangeRef.current?.(false);
    }
  }, [cancelLoop, config?.audioUrl, getAudioEl, tickAnimation]);

  // If browser blocked initial cold-load audio, start BOTH audio + text together on first user interaction
  useEffect(() => {
    if (!awaitingGestureUnlock) return;
    let handled = false;
    const handleUnlock = () => {
      if (handled) return;
      handled = true;
      setAwaitingGestureUnlock(false);
      startPlayback();
    };
    window.addEventListener('pointerdown', handleUnlock, { once: true, passive: true });
    window.addEventListener('keydown', handleUnlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
    };
  }, [awaitingGestureUnlock, startPlayback]);

  const prevBuddhaIdRef = useRef(buddhaId);

  // Reset UI expansion only when actually switching deities
  useEffect(() => {
    if (prevBuddhaIdRef.current !== buddhaId) {
      prevBuddhaIdRef.current = buddhaId;
      stopPlayback();
      setShowFullDetails(false);
    }
  }, [buddhaId, stopPlayback]);

  // Auto-play / attach synced loop when deity opens or replay is triggered
  useEffect(() => {
    if (playTrigger <= 0) return;
    let active = true;
    const audio = getAudioEl();

    const handleEnded = () => {
      if (!active) return;
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
    };

    const handlePlayingEvent = () => {
      if (!active) return;
      setAwaitingGestureUnlock(false);
      setIsPlaying(true);
      onPlayStateChangeRef.current?.(true);
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tickAnimation);
      }
    };

    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('playing', handlePlayingEvent);
    }

    // If shared audio was already started synchronously inside user click, attach immediately; else start cleanly
    if (audio && !audio.paused && !audio.ended) {
      handlePlayingEvent();
    } else {
      Promise.resolve().then(() => {
        if (active) startPlayback();
      });
    }

    return () => {
      active = false;
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('playing', handlePlayingEvent);
      }
      stopPlayback();
    };
  }, [playTrigger, buddhaId, cancelLoop, getAudioEl, startPlayback, stopPlayback, tickAnimation]);

  const handleToggle = () => {
    if (isPlaying && !awaitingGestureUnlock) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const progressPct = Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100));

  const floatingSpans = floatingItems.map((item) => (
    <span
      key={item.uid}
      style={
        {
          left: `${item.xPct}%`,
          top: `${item.yPct}%`,
          '--drift-x': `${item.driftX}px`,
          '--tilt': `${item.tiltDeg}deg`,
        } as React.CSSProperties
      }
      className={cn(
        'mantra-floating-syllable absolute font-serif tracking-wider whitespace-nowrap select-none pointer-events-none',
        item.sizeClass
      )}
    >
      {item.text}
    </span>
  ));

  return (
    <div className="space-y-5 relative">
      {!externalAudioRef && config?.audioUrl && (
        <audio
          ref={localAudioRef}
          src={config.audioUrl}
          preload="auto"
          playsInline
        />
      )}

      {/* Render across entire deity view when portalContainer is mounted */}
      {portalContainer && createPortal(floatingSpans, portalContainer)}

      {/* Open Borderless Kinetic Mantra Stage directly on canvas (Image-2 clean typography style) */}
      <div className="relative py-2 overflow-visible">
        {!portalContainer && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-12 bottom-4 overflow-x-clip overflow-y-visible z-20"
          >
            {floatingSpans}
          </div>
        )}

        <div className="relative z-10 text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#7D5822]">
            <Volume2 className={cn('w-3.5 h-3.5', isPlaying && 'animate-pulse text-[#C58C1B]')} />
            <span>
              {awaitingGestureUnlock
                ? 'Chạm Để Phát Thần Chú & Chữ'
                : isPlaying && cues.length > 0 && currentTimeSec < cues[0].atSec
                  ? 'Đang Dạo Khúc Thiền Âm...'
                  : isPlaying
                    ? 'Đang Trì Tụng Cùng Pháp Âm'
                    : 'Thần Chú & Phiên Âm'}
            </span>
          </div>

          {/* Primary Sanskrit Line */}
          <p className="text-[15px] sm:text-base font-serif font-bold text-[#6E4200] leading-relaxed select-all px-1">
            {config?.sanskritLine || sanskritDefault}
          </p>

          {/* Interactive Syllable Highlight Strip synced to audible vocal clock */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            {displayTokens.map((tok, idx) => {
              const isActive = isPlaying && activeDisplayIdx === idx;
              const isPast = isPlaying && activeDisplayIdx > idx;
              return (
                <span
                  key={`${tok}-${idx}`}
                  className={cn(
                    'px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all duration-200',
                    isActive
                      ? 'mantra-cue-active scale-110 -translate-y-0.5'
                      : isPast
                        ? 'bg-[#C58C1B]/15 text-[#7A4B00]'
                        : 'bg-black/[0.045] text-[#5C4428]'
                  )}
                >
                  {tok}
                </span>
              );
            })}
          </div>

          {/* Minimal hairline progress */}
          <div className="max-w-xs mx-auto pt-0.5">
            <div className="h-1 w-full rounded-full bg-black/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C58C1B] transition-[width] duration-150 ease-linear"
                style={{ width: `${isPlaying ? progressPct : 0}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#7D5822]">
              <span>{isPlaying ? `${Math.floor(currentTimeSec)}s` : '1 biến trọn'}</span>
              <span>{Math.round(durationSec)}s</span>
            </div>
          </div>

          {/* Centered Toggle Control: "Trì chú" */}
          <div className="pt-0.5 flex justify-center">
            <button
              type="button"
              onClick={handleToggle}
              className={cn(
                'min-w-[144px] py-2.5 px-6 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap',
                isPlaying
                  ? 'bg-[#8A5400] text-white'
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

      {/* Ý Nghĩa Chân Ngôn — Open borderless flow directly on canvas */}
      <div className="space-y-1.5 text-[15px] leading-relaxed">
        <h4 className="font-bold text-[#78531E] text-base">
          Ý nghĩa chân ngôn
        </h4>
        <p className="text-[#2C1E10]">
          {config?.meaningShort || meaningDefault}
        </p>
      </div>

      {/* Expandable Classical Full Text & Benefits — Open without enclosing panel borders */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowFullDetails((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#78531E] hover:text-[#2C1E10] transition-colors cursor-pointer"
        >
          <span className="whitespace-nowrap">Xem phiên âm &amp; công đức</span>
          {showFullDetails ? (
            <ChevronUp className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" />
          )}
        </button>

        {showFullDetails && (
          <div className="pt-1 space-y-4 text-[15px] leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-bold text-[#78531E] text-base">
                Phiên âm kinh văn
              </h4>
              <p className="font-mono text-xs sm:text-sm text-[#2C1E10] leading-relaxed select-all">
                {config?.phoneticLine || vietnameseDefault}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#78531E] text-base">
                Ý nghĩa mở rộng
              </h4>
              <p className="text-[#2C1E10] leading-relaxed">{meaningDefault}</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#78531E] text-base">
                Công đức trì tụng
              </h4>
              <p className="text-[#2C1E10] leading-relaxed">{benefitsDefault}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
