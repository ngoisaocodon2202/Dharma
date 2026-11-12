'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  Repeat,
  Repeat1,
  ListMusic,
  Shuffle,
  Volume2,
  Timer,
  Sparkles,
  RotateCcw,
  RotateCw,
  Music2,
} from 'lucide-react';
import { CHANT_MACHINE_TRACKS, type ChantBoxTrack } from '@/data/practiceToolsData';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

export interface Tool04MayNiemPhatProps {
  onClose?: () => void;
  showToast: (msg: string) => void;
}

type LoopMode = 'off' | 'one' | 'all';
type AmbientSound = 'none' | 'bell' | 'woodfish';
type SleepMinutes = 0 | 15 | 30 | 45 | 60;

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function Tool04MayNiemPhat({ onClose, showToast }: Tool04MayNiemPhatProps) {
  const {
    chantMachineTrackId,
    chantMachineCount,
    chantMachineSpeed,
    setChantMachineTrack,
    setChantMachineSpeed,
    incrementChantMachineCount,
  } = useDharmaPracticeStore();

  const activeIndex = useMemo(() => {
    const idx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === chantMachineTrackId);
    return idx >= 0 ? idx : 1; // Mặc định Niệm Nam Mô A Di Đà Phật
  }, [chantMachineTrackId]);

  const activeTrack = CHANT_MACHINE_TRACKS[activeIndex] ?? CHANT_MACHINE_TRACKS[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('one');
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() =>
    chantMachineSpeed === 'slow' ? 0.85 : chantMachineSpeed === 'fast' ? 1.2 : 1.0
  );
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [sleepTimerMins, setSleepTimerMins] = useState<SleepMinutes>(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number>(0);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistContainerRef = useRef<HTMLDivElement | null>(null);
  const loadedUrlRef = useRef<string>('');
  const triedFallbackRef = useRef<boolean>(false);

  // Refs giữ trạng thái mới nhất để event handler <audio> không bị stale và không reset element
  const activeTrackRef = useRef(activeTrack);
  const loopModeRef = useRef(loopMode);
  const isShuffleRef = useRef(isShuffle);
  const playbackSpeedRef = useRef(playbackSpeed);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
  }, [activeTrack]);

  useEffect(() => {
    loopModeRef.current = loopMode;
  }, [loopMode]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Cleanup duy nhất khi đóng hoàn toàn Máy niệm Phật
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startAudioSource = useCallback(
    async (track: ChantBoxTrack, restart: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      const needSwapSource = loadedUrlRef.current !== track.audioUrl;
      if (needSwapSource || restart) {
        triedFallbackRef.current = false;
        loadedUrlRef.current = track.audioUrl;
        audio.src = track.audioUrl;
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      audio.playbackRate = playbackSpeedRef.current;
      setIsLoadingAudio(true);

      try {
        await audio.play();
        setIsPlaying(true);
        setIsLoadingAudio(false);
      } catch (err) {
        setIsLoadingAudio(false);
        const name = err instanceof Error ? err.name : '';
        // AbortError xảy ra khi người dùng chuyển bài nhanh -> không xem là lỗi nguồn
        if (name === 'AbortError') return;
        setIsPlaying(false);
        showToast('Nhấn nút Phát để bắt đầu nghe bài niệm MP3');
      }
    },
    [showToast]
  );

  const playTrack = useCallback(
    (track: ChantBoxTrack) => {
      const switching = track.id !== activeTrackRef.current.id;
      setChantMachineTrack(track.id);
      if (ambientSound === 'bell') {
        playBellSound(0.45);
      } else if (ambientSound === 'woodfish') {
        playWoodenFishSound(0.35);
      }
      void startAudioSource(track, switching);
    },
    [ambientSound, setChantMachineTrack, startAudioSource]
  );

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (ambientSound === 'bell') {
      playBellSound(0.45);
    } else if (ambientSound === 'woodfish') {
      playWoodenFishSound(0.35);
    }

    const needInitialLoad = !loadedUrlRef.current || loadedUrlRef.current !== activeTrack.audioUrl;
    void startAudioSource(activeTrack, needInitialLoad);
  }, [activeTrack, ambientSound, startAudioSource]);

  const handleNextTrack = useCallback(
    (autoAdvance = false) => {
      const currentIdx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === activeTrackRef.current.id);
      let nextIdx = currentIdx + 1;
      if (isShuffleRef.current && CHANT_MACHINE_TRACKS.length > 1) {
        do {
          nextIdx = Math.floor(Math.random() * CHANT_MACHINE_TRACKS.length);
        } while (nextIdx === currentIdx);
      } else if (nextIdx >= CHANT_MACHINE_TRACKS.length) {
        nextIdx = 0;
      }
      const nextTrack = CHANT_MACHINE_TRACKS[nextIdx];
      if (!autoAdvance || loopModeRef.current === 'all') {
        playTrack(nextTrack);
      }
    },
    [playTrack]
  );

  const handleAudioEnded = useCallback(() => {
    const track = activeTrackRef.current;
    setSessionCount((c) => c + 1);
    incrementChantMachineCount(track.title);

    const mode = loopModeRef.current;
    const audio = audioRef.current;

    if (ambientSound === 'bell') {
      playBellSound(0.45);
    }

    if (mode === 'one' && audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => setIsPlaying(false));
      return;
    }

    if (mode === 'all') {
      handleNextTrack(true);
      return;
    }

    setIsPlaying(false);
  }, [ambientSound, handleNextTrack, incrementChantMachineCount]);

  const handleAudioError = useCallback(() => {
    const audio = audioRef.current;
    const track = activeTrackRef.current;
    if (
      audio &&
      !triedFallbackRef.current &&
      track.audioFallbackUrl &&
      track.audioFallbackUrl !== loadedUrlRef.current
    ) {
      triedFallbackRef.current = true;
      loadedUrlRef.current = track.audioFallbackUrl;
      audio.src = track.audioFallbackUrl;
      audio.playbackRate = playbackSpeedRef.current;
      void audio.play().catch(() => {
        setIsPlaying(false);
        setIsLoadingAudio(false);
      });
      return;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
    showToast(`Không tải được pháp âm ${track.title}`);
  }, [showToast]);

  const handleSeekOffset = (deltaSec: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const target = Math.max(0, Math.min(audio.duration, audio.currentTime + deltaSec));
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const handleCycleSpeed = () => {
    const presets: Array<{ val: number; key: 'slow' | 'medium' | 'fast'; label: string }> = [
      { val: 0.85, key: 'slow', label: '0.85x (Chậm)' },
      { val: 1.0, key: 'medium', label: '1.0x (Chuẩn)' },
      { val: 1.2, key: 'fast', label: '1.2x (Nhanh)' },
    ];
    const currentIdx = presets.findIndex((p) => Math.abs(p.val - playbackSpeed) < 0.05);
    const next = presets[(currentIdx + 1) % presets.length];
    setPlaybackSpeed(next.val);
    setChantMachineSpeed(next.key);
    showToast(`Tốc độ niệm: ${next.label}`);
  };

  const handleToggleLoopMode = () => {
    const next: LoopMode = loopMode === 'one' ? 'all' : loopMode === 'all' ? 'off' : 'one';
    setLoopMode(next);
    showToast(
      next === 'one'
        ? 'Lặp lại 1 bài liên tục'
        : next === 'all'
        ? 'Tự động phát tiếp danh sách'
        : 'Phát hết bài rồi dừng'
    );
  };

  // Ambient beat tick định kỳ khi người dùng bật chuông/mõ nhẹ
  useEffect(() => {
    if (!isPlaying || ambientSound === 'none') return;
    const beatMs = Math.max(800, Math.round((60 / Math.max(40, activeTrack.baseBpm)) * 1000 / playbackSpeed));
    const timer = setInterval(() => {
      if (ambientSound === 'woodfish') {
        playWoodenFishSound(0.24);
      }
    }, beatMs);
    return () => clearInterval(timer);
  }, [isPlaying, ambientSound, activeTrack.baseBpm, playbackSpeed]);

  // Countdown Hẹn Giờ Tắt
  useEffect(() => {
    if (!isPlaying || sleepRemainingSec <= 0) return;
    const t = setInterval(() => {
      setSleepRemainingSec((prev) => {
        if (prev <= 1) {
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
          setSleepTimerMins(0);
          showToast('Hết giờ hẹn tắt Máy Niệm Phật • Thân tâm an lạc');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, sleepRemainingSec, showToast]);

  const handleSetSleepOption = (mins: SleepMinutes) => {
    setSleepTimerMins(mins);
    setSleepRemainingSec(mins * 60);
    if (mins > 0) {
      showToast(`Đã hẹn tắt Máy Niệm Phật sau ${mins} phút`);
    } else {
      showToast('Đã tắt hẹn giờ');
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FDF8EC] text-[#2C1E10] flex flex-col justify-between overflow-hidden select-none">
      {/* Audio Engine cố định trong DOM để không bao giờ bị destroy khi chuyển bài hay đổi repeat mode */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d)) setDuration(d);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
          if (Number.isFinite(e.currentTarget.duration) && e.currentTarget.duration > 0) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        className="hidden"
      />

      {/* 1. TOP HEADER */}
      <div className="relative z-20 px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            if (onClose) onClose();
            else if (typeof window !== 'undefined') window.history.back();
          }}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#E8D4A8] text-[#5C3D18] hover:bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95"
          aria-label="Đóng máy niệm Phật"
          title="Đóng máy niệm Phật"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="font-serif font-bold text-lg sm:text-xl text-[#3D2505] tracking-wide">
          Máy niệm Phật
        </h1>

        <button
          type="button"
          onClick={() => setShowSettingsDrawer((v) => !v)}
          className={cn(
            'w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-[#E8D4A8] text-[#5C3D18] hover:bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95',
            showSettingsDrawer && 'bg-[#FFE699] text-[#7A4900]'
          )}
          aria-label="Cài đặt phát âm thanh & hẹn giờ"
          title="Cài đặt phát & hẹn giờ tắt"
        >
          {sleepTimerMins > 0 ? (
            <span className="font-mono text-[10px] font-bold text-[#8C5500]">
              {Math.ceil(sleepRemainingSec / 60)}m
            </span>
          ) : (
            <Timer className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. SERENE BUDDHA HERO VIEW */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('/images/ancient_pagoda.jpg')`,
            filter: 'sepia(30%) saturate(120%) brightness(105%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/90 via-[#FFF4D0]/60 to-[#FDF8EC] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-sm">
          {/* Radiant Golden Halo Ring */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <div
              className={cn(
                'absolute inset-0 rounded-full transition-all duration-1000',
                isPlaying
                  ? 'bg-gradient-to-tr from-[#FFD24D]/50 via-[#FFA726]/40 to-[#FFEBA3]/60 blur-xl scale-110 animate-pulse'
                  : 'bg-[#FFE699]/30 blur-md scale-95'
              )}
            />
            <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-[#D9A02E]/70 bg-gradient-to-b from-[#FFFDF5] via-[#FFF6DE] to-[#FFEAA7] shadow-[0_0_40px_rgba(235,170,40,0.35)] flex items-center justify-center overflow-hidden">
              <img
                src={activeTrack.heroImage}
                alt={activeTrack.title}
                className={cn(
                  'w-32 h-32 sm:w-40 sm:h-40 object-contain transition-transform duration-700',
                  isPlaying ? 'scale-105' : 'scale-100'
                )}
              />
            </div>
          </div>

          <h2 className="mt-3 font-serif text-base sm:text-lg font-bold text-[#5C3D18] tracking-wider italic">
            {activeTrack.devaName}
          </h2>
          <p className="mt-0.5 font-serif font-bold text-sm text-[#2C1E10] line-clamp-1">
            {activeTrack.title}
          </p>
          <p className="mt-0.5 text-[11px] text-[#7A5000] line-clamp-2 max-w-xs">
            {activeTrack.vowNote}
          </p>

          {/* Continuous MP3 Player Scrubber & Quick Speed */}
          <div className="mt-3 w-full px-3 py-2.5 rounded-2xl bg-white/85 backdrop-blur-sm border border-[#EAD7A7] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#7A5000]">
              <span>{formatClock(currentTime)}</span>
              <span className="inline-flex items-center gap-1 font-sans text-[10px] text-[#8C5500]">
                <Music2 className="w-3 h-3" />
                {isLoadingAudio ? 'Đang tải MP3...' : isPlaying ? 'Đang niệm liền mạch' : 'File MP3 chính thống'}
              </span>
              <span>{duration > 0 ? formatClock(duration) : '01:30'}</span>
            </div>

            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 90}
              step={0.5}
              value={Math.min(currentTime, duration > 0 ? duration : 90)}
              onChange={(e) => {
                const nextSec = Number(e.target.value);
                setCurrentTime(nextSec);
                if (audioRef.current) audioRef.current.currentTime = nextSec;
              }}
              className="w-full h-1.5 rounded-full accent-[#C8780A] bg-[#F2E5C4] cursor-pointer"
              aria-label="Tua tiến lùi thời lượng bài niệm"
            />

            <div className="flex items-center justify-between pt-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleSeekOffset(-10)}
                className="px-2 py-0.5 rounded-lg border border-[#EAD7A7] bg-[#FAF7F0] text-[#5C3D18] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#FFF4D0]"
              >
                <RotateCcw className="w-3 h-3" /> -10s
              </button>

              <button
                type="button"
                onClick={handleCycleSpeed}
                className="px-2.5 py-0.5 rounded-lg border border-[#E5C67E] bg-[#FFF4D0] text-[#7A4000] font-mono font-bold cursor-pointer hover:bg-[#FFE699]"
              >
                {playbackSpeed.toFixed(playbackSpeed === 1 ? 1 : 2)}x
              </button>

              <button
                type="button"
                onClick={() => handleSeekOffset(10)}
                className="px-2 py-0.5 rounded-lg border border-[#EAD7A7] bg-[#FAF7F0] text-[#5C3D18] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#FFF4D0]"
              >
                +10s <RotateCw className="w-3 h-3" />
              </button>
            </div>
            <div className="sr-only">{Math.round(progressPct)}%</div>
          </div>

          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E8D4A8] text-xs font-semibold text-[#8C5500] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8780A]" />
            <span>Đã niệm: {sessionCount} lượt</span>
            <span className="text-[#B39977]">•</span>
            <span>Tổng: {chantMachineCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3. SETTINGS DRAWER */}
      {showSettingsDrawer && (
        <div className="relative z-30 mx-4 mb-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5C67E] shadow-md space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F0E0B8]">
            <span className="font-bold text-[#5C3D18] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" /> Hẹn Giờ Tự Động Tắt
            </span>
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(false)}
              className="text-[#8C5500] hover:text-[#3D2505] font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {([0, 15, 30, 45, 60] as SleepMinutes[]).map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSetSleepOption(mins)}
                className={cn(
                  'px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer',
                  sleepTimerMins === mins
                    ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505] shadow-2xs'
                    : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                )}
              >
                {mins === 0 ? 'Không giới hạn' : `${mins} phút`}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#F0E0B8]">
            <span className="font-bold text-[#5C3D18] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Âm Nền Tịnh Tâm:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'none' as const, label: 'Thuần niệm' },
                { id: 'bell' as const, label: 'Chuông bát' },
                { id: 'woodfish' as const, label: 'Mõ nhẹ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAmbientSound(opt.id)}
                  className={cn(
                    'px-2 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer',
                    ambientSound === opt.id
                      ? 'bg-[#FFE07D] border-[#C68B19] text-[#3D2505]'
                      : 'bg-white border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM SHEET: CHANTING PLAYLIST */}
      <div className="relative z-20 w-full max-w-xl mx-auto rounded-t-[32px] bg-gradient-to-b from-[#FFFDF7] via-[#FFFBF0] to-[#FFF9E9] border-t-2 border-x-2 border-[#EAD7A7] shadow-[0_-8px_32px_rgba(180,140,60,0.14)] flex flex-col transition-all duration-300">
        <div
          onClick={() => setSheetExpanded((v) => !v)}
          className="pt-2.5 pb-1 flex justify-center cursor-pointer select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-[#D4C3A3]/80 hover:bg-[#BBA375] transition-colors" />
        </div>

        <div className="px-5 py-2 flex items-center justify-between border-b border-[#F2E5C4]">
          <span className="font-serif font-bold text-base text-[#2C1E10]">Danh sách ({CHANT_MACHINE_TRACKS.length})</span>
          <button
            type="button"
            onClick={() => {
              setIsShuffle((s) => !s);
              showToast(isShuffle ? 'Đã tắt phát ngẫu nhiên' : 'Đã bật phát ngẫu nhiên');
            }}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer active:scale-95',
              isShuffle
                ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                : 'bg-white border-[#EAD7A7] text-[#6B533B] hover:bg-[#FAF7F0]'
            )}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Phát ngẫu nhiên</span>
          </button>
        </div>

        <div
          ref={playlistContainerRef}
          className={cn(
            'overflow-y-auto px-3 py-2 space-y-1.5 transition-all duration-300 pr-2',
            sheetExpanded ? 'max-h-[260px] sm:max-h-[300px]' : 'max-h-0 py-0 overflow-hidden'
          )}
        >
          {CHANT_MACHINE_TRACKS.map((track) => {
            const isSelected = track.id === activeTrack.id;
            const isCurrentPlaying = isSelected && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={cn(
                  'group p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer',
                  isSelected
                    ? 'bg-[#FFF4D0] border-[#D9A02E] shadow-2xs'
                    : 'bg-white/90 border-[#F0E2C2] hover:bg-[#FFFDF5] hover:border-[#E5C67E]'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={track.avatarImage}
                      alt={track.title}
                      className={cn(
                        'w-11 h-11 rounded-full object-cover border-2 transition-transform duration-300',
                        isSelected
                          ? 'border-[#C8780A] scale-105 shadow-xs'
                          : 'border-[#EAD7A7] group-hover:scale-102'
                      )}
                    />
                    {isCurrentPlaying && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#C8780A] border-2 border-white animate-ping" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={cn(
                        'font-serif font-bold text-xs sm:text-sm truncate transition-colors',
                        isSelected ? 'text-[#8C4800]' : 'text-[#2C1E10]'
                      )}
                    >
                      {track.title}
                    </h3>
                    <p className="text-[11px] font-medium text-[#7A5000] truncate mt-0.5">
                      {track.subtitle} • MP3 liền mạch
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                      handleTogglePlay();
                    } else {
                      playTrack(track);
                    }
                  }}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer active:scale-90',
                    isCurrentPlaying
                      ? 'bg-[#C8780A] border-[#9A4200] text-white shadow-xs'
                      : isSelected
                      ? 'bg-[#FFE699] border-[#D9A02E] text-[#6B3A00]'
                      : 'bg-white border-[#E8D4A8] text-[#5C3D18] hover:bg-[#FFF8E6]'
                  )}
                  aria-label={isCurrentPlaying ? 'Tạm dừng' : 'Phát bài niệm này'}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 5. BOTTOM CONTROL DOCK */}
        <div className="px-6 py-3.5 bg-[#FFFDF8] border-t border-[#F2E5C4] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleToggleLoopMode}
            className="flex flex-col items-center gap-1 text-[#5C3D18] hover:text-[#2C1E10] transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                'w-11 h-11 rounded-full border flex items-center justify-center transition-all group-active:scale-95',
                loopMode !== 'off'
                  ? 'bg-[#FFE699] border-[#C8780A] text-[#7A4000]'
                  : 'bg-white border-[#E8D4A8] text-[#7A5A38]'
              )}
            >
              {loopMode === 'one' ? (
                <Repeat1 className="w-5 h-5 text-[#C8780A]" />
              ) : loopMode === 'all' ? (
                <Repeat className="w-5 h-5 text-[#C8780A]" />
              ) : (
                <Repeat className="w-5 h-5 opacity-40" />
              )}
            </div>
            <span className="text-[11px] font-bold">
              {loopMode === 'one' ? 'Lặp lại 1' : loopMode === 'all' ? 'Lặp danh sách' : 'Lặp lại'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={cn(
              'relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer',
              isPlaying
                ? 'bg-gradient-to-b from-[#2C1E10] to-[#120B05] border-[#D9A02E] text-[#FAD02C]'
                : 'bg-gradient-to-b from-[#FFE89E] via-[#FAD02C] to-[#D99B16] border-white text-[#3D2505]'
            )}
            aria-label={isPlaying ? 'Tạm dừng niệm' : 'Bắt đầu niệm Phật'}
          >
            <div className="absolute -inset-1 rounded-full border border-[#D9A02E]/60 pointer-events-none" />
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSheetExpanded((v) => !v)}
            className="flex flex-col items-center gap-1 text-[#5C3D18] hover:text-[#2C1E10] transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                'w-11 h-11 rounded-full border flex items-center justify-center transition-all group-active:scale-95',
                sheetExpanded
                  ? 'bg-[#FFE699] border-[#C8780A] text-[#7A4000]'
                  : 'bg-white border-[#E8D4A8] text-[#7A5A38]'
              )}
            >
              <ListMusic className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">Danh sách</span>
          </button>
        </div>
      </div>
    </div>
  );
}
