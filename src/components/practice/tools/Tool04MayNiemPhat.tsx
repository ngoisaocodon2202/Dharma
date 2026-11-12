'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  X,
} from 'lucide-react';
import { CHANT_MACHINE_TRACKS, type ChantBoxTrack } from '@/data/practiceToolsData';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

export interface Tool04MayNiemPhatProps {
  onClose: () => void;
  showToast: (msg: string) => void;
}

type LoopMode = 'one' | 'all' | 'off';

export function Tool04MayNiemPhat({ onClose, showToast }: Tool04MayNiemPhatProps) {
  const {
    chantMachineTrackId,
    setChantMachineTrack,
    incrementChantMachineCount,
  } = useDharmaPracticeStore();

  const initialTrackIndex = useMemo(() => {
    const idx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === chantMachineTrackId);
    return idx >= 0 ? idx : 0;
  }, [chantMachineTrackId]);

  const [activeIndex, setActiveIndex] = useState<number>(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('one');
  const [sheetExpanded, setSheetExpanded] = useState<boolean>(true);

  const activeTrack: ChantBoxTrack = CHANT_MACHINE_TRACKS[activeIndex] ?? CHANT_MACHINE_TRACKS[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fallbackAttemptedRef = useRef<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const loopModeRef = useRef(loopMode);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    loopModeRef.current = loopMode;
  }, [loopMode]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Sync external store changes cleanly
  useEffect(() => {
    const idx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === chantMachineTrackId);
    if (idx >= 0 && idx !== activeIndexRef.current) {
      setActiveIndex(idx);
    }
  }, [chantMachineTrackId]);

  // Clean up audio when modal/tool unmounts
  useEffect(() => {
    const el = audioRef.current;
    return () => {
      if (el) {
        el.pause();
      }
    };
  }, []);

  const loadAndPlayTrack = useCallback(
    (index: number, autoPlay: boolean) => {
      const target = CHANT_MACHINE_TRACKS[index] ?? CHANT_MACHINE_TRACKS[0];
      if (!target) return;

      fallbackAttemptedRef.current = null;
      setActiveIndex(index);
      setChantMachineTrack(target.id);

      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = target.audioUrl;
        audio.currentTime = 0;
        audio.load();

        if (autoPlay) {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(false);
        }
      }

      // Smoothly bring active track into view when list sheet is open
      requestAnimationFrame(() => {
        rowRefs.current[target.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    },
    [setChantMachineTrack],
  );

  // Ensure audio src is initialized on first mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.getAttribute('src')) {
      audio.src = activeTrack.audioUrl;
      audio.load();
    }
  }, [activeTrack.audioUrl]);

  const handleToggleMainPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (!audio.getAttribute('src')) {
      audio.src = activeTrack.audioUrl;
      audio.load();
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
        showToast('Không thể phát âm thanh, vui lòng thử lại');
      });
  }, [activeTrack.audioUrl, isPlaying, showToast]);

  const handleRowAction = useCallback(
    (index: number) => {
      const target = CHANT_MACHINE_TRACKS[index];
      if (!target) return;

      if (index === activeIndex) {
        handleToggleMainPlay();
      } else {
        loadAndPlayTrack(index, true);
      }
    },
    [activeIndex, handleToggleMainPlay, loadAndPlayTrack],
  );

  const handlePrevTrack = useCallback(() => {
    const total = CHANT_MACHINE_TRACKS.length;
    const prevIdx = (activeIndex - 1 + total) % total;
    loadAndPlayTrack(prevIdx, isPlayingRef.current || !sheetExpanded);
  }, [activeIndex, loadAndPlayTrack, sheetExpanded]);

  const handleNextTrack = useCallback(() => {
    const total = CHANT_MACHINE_TRACKS.length;
    const nextIdx = (activeIndex + 1) % total;
    loadAndPlayTrack(nextIdx, isPlayingRef.current || !sheetExpanded);
  }, [activeIndex, loadAndPlayTrack, sheetExpanded]);

  const handleShufflePlay = useCallback(() => {
    const total = CHANT_MACHINE_TRACKS.length;
    if (total <= 1) {
      loadAndPlayTrack(0, true);
      return;
    }

    let nextIdx = activeIndex;
    while (nextIdx === activeIndex) {
      nextIdx = Math.floor(Math.random() * total);
    }

    loadAndPlayTrack(nextIdx, true);
  }, [activeIndex, loadAndPlayTrack]);

  const handleCycleLoop = useCallback(() => {
    setLoopMode((prev) => {
      const next: LoopMode = prev === 'one' ? 'all' : prev === 'all' ? 'off' : 'one';
      if (next === 'one') showToast('Lặp lại bài hiện tại');
      else if (next === 'all') showToast('Phát lặp toàn bộ danh sách');
      else showToast('Tắt chế độ lặp lại');
      return next;
    });
  }, [showToast]);

  const handleAudioEnded = useCallback(() => {
    const current = CHANT_MACHINE_TRACKS[activeIndexRef.current];
    if (current) {
      incrementChantMachineCount(current.id);
    }

    const mode = loopModeRef.current;
    const audio = audioRef.current;

    if (mode === 'one' && audio) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    if (mode === 'all') {
      const nextIdx = (activeIndexRef.current + 1) % CHANT_MACHINE_TRACKS.length;
      loadAndPlayTrack(nextIdx, true);
      return;
    }

    setIsPlaying(false);
  }, [incrementChantMachineCount, loadAndPlayTrack]);

  const handleAudioError = useCallback(() => {
    const current = CHANT_MACHINE_TRACKS[activeIndexRef.current];
    const audio = audioRef.current;
    if (!current || !audio) return;

    if (
      current.audioFallbackUrl &&
      fallbackAttemptedRef.current !== current.id
    ) {
      fallbackAttemptedRef.current = current.id;
      audio.src = current.audioFallbackUrl;
      audio.load();
      if (isPlayingRef.current) {
        audio.play().catch(() => setIsPlaying(false));
      }
      return;
    }

    setIsPlaying(false);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] min-h-[640px] max-h-[100dvh] bg-[#FBF4E4] text-[#261B12] flex flex-col overflow-hidden select-none">
      {/* Persistent audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />

      {/* Full-bleed ink-wash pagoda & lotus wallpaper */}
      <img
        src="/images/chant_machine_bg.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FBF4E4]/55 via-transparent to-[#FBF4E4]/45"
      />

      {/* Top Header: Close + Title only */}
      <header className="relative z-20 shrink-0 px-4 pt-4 pb-2 sm:px-6 flex items-center justify-between max-w-xl w-full mx-auto">
        <button
          type="button"
          onClick={() => {
            audioRef.current?.pause();
            onClose();
          }}
          aria-label="Đóng Máy niệm Phật"
          className="w-11 h-11 rounded-full bg-[#FCF8EE]/90 border border-[#E8DEC8]/80 shadow-[0_2px_10px_rgba(38,27,18,0.08)] backdrop-blur-md flex items-center justify-center text-[#261B12] hover:bg-white transition active:scale-95"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        <h1 className="font-serif font-semibold text-[21px] sm:text-[23px] tracking-tight text-[#261B12] drop-shadow-[0_1px_4px_rgba(255,250,238,0.95)]">
          Máy niệm Phật
        </h1>

        <div className="w-11 h-11" aria-hidden="true" />
      </header>

      {/* Main Workspace */}
      {sheetExpanded ? (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between max-w-xl w-full mx-auto">
          {/* Compact Deity Hero Stage */}
          <div className="shrink-0 flex flex-col items-center justify-center px-5 pt-1 pb-3">
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden="true"
                className={cn(
                  'absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,232,168,0.88)_0%,rgba(246,204,116,0.36)_50%,transparent_72%)] transition-transform duration-700',
                  isPlaying ? 'scale-105 animate-pulse' : 'scale-100 opacity-90',
                )}
              />
              <img
                src={activeTrack.heroImage}
                alt={activeTrack.subtitle}
                className={cn(
                  'relative z-10 w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-full mix-blend-multiply [mask-image:radial-gradient(circle,black_56%,transparent_75%)] drop-shadow-[0_10px_22px_rgba(130,88,28,0.2)] transition-transform duration-500',
                  isPlaying && 'scale-[1.03]',
                )}
              />
            </div>

            <h2 className="mt-1 px-5 py-0.5 rounded-full bg-[#FBF4E4]/65 backdrop-blur-[2px] text-center font-serif font-semibold text-[18px] sm:text-[20px] leading-snug text-[#241A10] line-clamp-2">
              {activeTrack.title}
            </h2>
          </div>

          {/* Expandable Track List Sheet */}
          <div className="flex-1 min-h-0 flex flex-col rounded-t-[28px] bg-[#FAF5E7]/95 backdrop-blur-xl border-t border-white/85 shadow-[0_-10px_36px_rgba(38,27,18,0.12)] overflow-hidden">
            {/* Sheet Tap/Collapse Handle */}
            <button
              type="button"
              onClick={() => setSheetExpanded(false)}
              aria-label="Thu gọn danh sách bài niệm"
              className="w-full py-2.5 flex items-center justify-center cursor-pointer hover:opacity-80 transition shrink-0"
            >
              <span className="w-10 h-1.5 rounded-full bg-[#C7BDA9]/85" />
            </button>

            {/* Sheet Subheader: Danh sách + Phát ngẫu nhiên */}
            <div className="shrink-0 px-5 pb-2.5 flex items-center justify-between">
              <span className="text-[15px] font-medium text-[#5A4B38]">
                Danh sách
              </span>

              <button
                type="button"
                onClick={handleShufflePlay}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E6DBC3] shadow-[0_1px_4px_rgba(38,27,18,0.06)] text-[13px] font-medium text-[#261B12] hover:bg-[#FFFDF7] active:scale-95 transition"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#3B2C1B]" />
                <span>Phát ngẫu nhiên</span>
              </button>
            </div>

            {/* Scrollable Playlist */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3.5 pb-3 space-y-1">
              {CHANT_MACHINE_TRACKS.map((track, idx) => {
                const isSelected = idx === activeIndex;
                const isTrackPlaying = isSelected && isPlaying;

                return (
                  <div
                    key={track.id}
                    ref={(el) => {
                      rowRefs.current[track.id] = el;
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-2xl transition',
                      isSelected
                        ? 'bg-white/80 shadow-[0_2px_10px_rgba(38,27,18,0.05)] ring-1 ring-[#DFCFAF]/75'
                        : 'hover:bg-white/45',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleRowAction(idx)}
                      className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#B6842D] rounded-xl"
                    >
                      {/* Deity Circular Avatar */}
                      <div className="w-11 h-11 rounded-full shrink-0 border border-[#DFC99B]/85 bg-gradient-to-b from-[#FFF9E8] to-[#F3E1B9] flex items-center justify-center overflow-hidden shadow-inner">
                        <img
                          src={track.avatarImage}
                          alt={track.subtitle}
                          className="w-10 h-10 object-contain rounded-full mix-blend-multiply"
                        />
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-snug text-[#241A10] line-clamp-2">
                          {track.title}
                        </p>
                        <p className="text-[13px] text-[#6E5E4B] mt-0.5 truncate">
                          {track.subtitle}
                        </p>
                      </div>
                    </button>

                    {/* Row Play / Pause Circle */}
                    <button
                      type="button"
                      onClick={() => handleRowAction(idx)}
                      aria-label={
                        isTrackPlaying
                          ? `Tạm dừng ${track.title}`
                          : `Phát ${track.title}`
                      }
                      className={cn(
                        'w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-all active:scale-90',
                        isTrackPlaying
                          ? 'bg-[#231B14] text-white shadow-sm'
                          : 'bg-[#ECE6D8] text-[#231B14] hover:bg-[#E1D8C5]',
                      )}
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dock inside cream sheet bottom */}
            <BottomTransportDock
              loopMode={loopMode}
              isPlaying={isPlaying}
              sheetExpanded={sheetExpanded}
              onCycleLoop={handleCycleLoop}
              onTogglePlay={handleToggleMainPlay}
              onToggleSheet={() => setSheetExpanded(false)}
              elevatedOverScene={false}
            />
          </div>
        </div>
      ) : (
        /* Collapsed Full-Screen Devotional Mode (matches niemphat.mp4) */
        <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between max-w-xl w-full mx-auto">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
            {/* Deity Artwork Stage with Prev < and Next > Circular Arrows */}
            <div className="relative w-full flex items-center justify-center gap-2 sm:gap-5">
              <button
                type="button"
                onClick={handlePrevTrack}
                aria-label="Bài niệm trước"
                className="relative z-20 w-11 h-11 shrink-0 rounded-full bg-white/85 backdrop-blur-md border border-[#E6DBC3]/85 shadow-[0_4px_14px_rgba(38,27,18,0.1)] flex items-center justify-center text-[#261B12] hover:bg-white active:scale-90 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[radial-gradient(circle,rgba(255,235,175,0.94)_0%,rgba(246,204,116,0.42)_48%,transparent_72%)] transition-transform duration-700',
                    isPlaying ? 'scale-105 animate-pulse' : 'scale-100 opacity-95',
                  )}
                />
                <img
                  src={activeTrack.heroImage}
                  alt={activeTrack.subtitle}
                  className={cn(
                    'relative z-10 w-60 h-60 sm:w-72 sm:h-72 object-contain rounded-full mix-blend-multiply [mask-image:radial-gradient(circle,black_54%,transparent_75%)] drop-shadow-[0_14px_34px_rgba(130,88,28,0.24)] transition-transform duration-500',
                    isPlaying && 'scale-[1.03]',
                  )}
                />
              </div>

              <button
                type="button"
                onClick={handleNextTrack}
                aria-label="Bài niệm kế tiếp"
                className="relative z-20 w-11 h-11 shrink-0 rounded-full bg-white/85 backdrop-blur-md border border-[#E6DBC3]/85 shadow-[0_4px_14px_rgba(38,27,18,0.1)] flex items-center justify-center text-[#261B12] hover:bg-white active:scale-90 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Spaced Uppercase Deity Label + Large Serif Chant Title */}
            <div className="mt-3 px-6 py-2.5 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(251,244,228,0.88)_0%,rgba(251,244,228,0.58)_60%,transparent_85%)] flex flex-col items-center">
              <p className="text-center text-[12.5px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#5E4A30]">
                {activeTrack.subtitle}
              </p>
              <h2 className="mt-1 text-center font-serif font-semibold text-[22px] sm:text-[26px] leading-snug text-[#241A10] max-w-md">
                {activeTrack.title}
              </h2>
            </div>
          </div>

          <BottomTransportDock
            loopMode={loopMode}
            isPlaying={isPlaying}
            sheetExpanded={sheetExpanded}
            onCycleLoop={handleCycleLoop}
            onTogglePlay={handleToggleMainPlay}
            onToggleSheet={() => setSheetExpanded(true)}
            elevatedOverScene
          />
        </div>
      )}
    </div>
  );
}

interface BottomTransportDockProps {
  loopMode: LoopMode;
  isPlaying: boolean;
  sheetExpanded: boolean;
  onCycleLoop: () => void;
  onTogglePlay: () => void;
  onToggleSheet: () => void;
  elevatedOverScene: boolean;
}

function BottomTransportDock({
  loopMode,
  isPlaying,
  sheetExpanded,
  onCycleLoop,
  onTogglePlay,
  onToggleSheet,
  elevatedOverScene,
}: BottomTransportDockProps) {
  return (
    <div
      className={cn(
        'shrink-0 z-20 px-6 pb-5 pt-3',
        elevatedOverScene
          ? 'bg-gradient-to-t from-[#FBF4E4]/95 via-[#FBF4E4]/75 to-transparent'
          : 'bg-[#FAF4E4]/95 border-t border-[#EAE0C8]/75',
      )}
    >
      <div className="grid grid-cols-3 items-center max-w-sm mx-auto">
        {/* Left: Lặp lại */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onCycleLoop}
            aria-label="Chế độ lặp lại"
            className={cn(
              'w-12 h-12 rounded-full border flex items-center justify-center shadow-[0_2px_8px_rgba(38,27,18,0.06)] transition active:scale-90',
              loopMode === 'off'
                ? 'bg-white/75 border-[#DED6C6] text-[#8E8170]'
                : 'bg-[#FFFDF7] border-[#D6BA82] text-[#3B2A18]',
            )}
          >
            {loopMode === 'one' ? (
              <Repeat1 className="w-5 h-5 stroke-[1.9]" />
            ) : (
              <Repeat className="w-5 h-5 stroke-[1.9]" />
            )}
          </button>
          <span className="mt-1.5 text-[12px] font-medium text-[#3D2E1E]">
            {loopMode === 'all' ? 'Lặp tất cả' : loopMode === 'off' ? 'Không lặp' : 'Lặp lại'}
          </span>
        </div>

        {/* Center: Primary Dark Play / Pause Button */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-full bg-[#E9E0CE]/90 shadow-[0_6px_22px_rgba(35,27,20,0.16)]">
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Tạm dừng niệm Phật' : 'Bắt đầu niệm Phật'}
              className="w-[66px] h-[66px] rounded-full bg-[#241B14] text-white flex items-center justify-center hover:bg-[#33271D] active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Danh sách toggle */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onToggleSheet}
            aria-label={sheetExpanded ? 'Thu gọn danh sách' : 'Mở danh sách'}
            className={cn(
              'w-12 h-12 rounded-full border flex items-center justify-center shadow-[0_2px_8px_rgba(38,27,18,0.06)] transition active:scale-90',
              sheetExpanded
                ? 'bg-[#FFFDF7] border-[#D6BA82] text-[#241A10]'
                : 'bg-white/90 border-[#E2D8C4] text-[#3D2E1E] hover:bg-white',
            )}
          >
            <List className="w-5 h-5 stroke-[2]" />
          </button>
          <span className="mt-1.5 text-[12px] font-medium text-[#3D2E1E]">
            Danh sách
          </span>
        </div>
      </div>
    </div>
  );
}
