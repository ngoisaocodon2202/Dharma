'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Play,
  Pause,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Timer,
  RotateCcw,
  Sparkles,
  Music2,
} from 'lucide-react';
import { CHANT_MACHINE_TRACKS, ChantBoxTrack } from '@/data/practiceToolsData';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

export interface Tool04MayNiemPhatProps {
  onClose?: () => void;
  showToast: (msg: string) => void;
}

type LoopMode = 'one' | 'all' | 'off';
type AmbientSound = 'none' | 'bell' | 'woodfish';
type SleepMinutes = 0 | 15 | 30 | 45 | 60;

export function Tool04MayNiemPhat({ onClose, showToast }: Tool04MayNiemPhatProps) {
  const {
    chantMachineTrackId,
    chantMachineCount,
    setChantMachineTrack,
    incrementChantMachineCount,
  } = useDharmaPracticeStore();

  // Active track index
  const activeIndex = useMemo(() => {
    const idx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === chantMachineTrackId);
    return idx >= 0 ? idx : 0;
  }, [chantMachineTrackId]);

  const activeTrack = CHANT_MACHINE_TRACKS[activeIndex] || CHANT_MACHINE_TRACKS[0];

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('one');
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [sleepTimerMins, setSleepTimerMins] = useState<SleepMinutes>(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number>(0);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);

  // Stats & Visual Sync
  const [sessionCount, setSessionCount] = useState(0);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState(0);

  // Audio References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playlistContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      incrementChantMachineCount(activeTrack.title);
      setSessionCount((c) => c + 1);

      if (ambientSound === 'bell') {
        playBellSound(0.25);
      } else if (ambientSound === 'woodfish') {
        playWoodenFishSound(0.22);
      }

      if (loopMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (loopMode === 'all') {
        handleNextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      // If real MP3 fails, try fallback or speech synthesis
      if (activeTrack.audioFallbackUrl && audio.src.endsWith(activeTrack.audioUrl)) {
        audio.src = activeTrack.audioFallbackUrl;
        audio.play().catch(() => speakFallbackChant(activeTrack.speechText));
      } else {
        speakFallbackChant(activeTrack.speechText);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTrack, loopMode, ambientSound, incrementChantMachineCount]);

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Speech Synthesis fallback helper
  const speakFallbackChant = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = playbackSpeed * 0.9;
    utter.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi')) || voices[0];
    if (viVoice) utter.voice = viVoice;

    utter.onend = () => {
      incrementChantMachineCount(activeTrack.title);
      setSessionCount((c) => c + 1);
      if (loopMode === 'one') {
        setTimeout(() => speakFallbackChant(text), 400);
      } else if (loopMode === 'all') {
        handleNextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utter);
  };

  // Play a specific track immediately
  const playTrack = (track: ChantBoxTrack) => {
    setChantMachineTrack(track.id);
    setActiveSyllableIdx(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.currentTime = 0;

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If auto-play blocked or audio load error, fallback
          speakFallbackChant(track.speechText);
          setIsPlaying(true);
        });
    }

    if (ambientSound === 'bell') {
      playBellSound(0.28);
    }
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      playTrack(activeTrack);
    }
  };

  // Advance to next track
  const handleNextTrack = () => {
    let nextIdx = 0;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * CHANT_MACHINE_TRACKS.length);
    } else {
      nextIdx = (activeIndex + 1) % CHANT_MACHINE_TRACKS.length;
    }
    const nextTrack = CHANT_MACHINE_TRACKS[nextIdx];
    playTrack(nextTrack);
  };

  // Cycle loop modes: one -> all -> off -> one
  const handleToggleLoopMode = () => {
    if (loopMode === 'one') {
      setLoopMode('all');
      showToast('Chế độ: Lặp lại toàn bộ danh sách');
    } else if (loopMode === 'all') {
      setLoopMode('off');
      showToast('Chế độ: Không lặp');
    } else {
      setLoopMode('one');
      showToast('Chế độ: Lặp lại bài hiện tại');
    }
  };

  // Syllable rhythmic animator during play
  useEffect(() => {
    if (!isPlaying) {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      return;
    }

    const intervalMs = Math.max(300, Math.round(60000 / activeTrack.baseBpm / playbackSpeed));
    beatTimerRef.current = setInterval(() => {
      setActiveSyllableIdx((prev) => (prev + 1) % activeTrack.syllables.length);
    }, intervalMs);

    return () => {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    };
  }, [isPlaying, activeTrack, playbackSpeed]);

  // Sleep Timer Countdown
  useEffect(() => {
    if (!isPlaying || sleepRemainingSec <= 0) return;
    const t = setInterval(() => {
      setSleepRemainingSec((prev) => {
        if (prev <= 1) {
          if (audioRef.current) audioRef.current.pause();
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsPlaying(false);
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

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FDF8EC] text-[#2C1E10] flex flex-col justify-between overflow-hidden select-none">
      {/* 1. TOP HEADER (Identical to Om Mani App Screenshot) */}
      <div className="relative z-20 px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Left: Close Button (X) */}
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

        {/* Center: Title */}
        <h1 className="font-serif font-bold text-lg sm:text-xl text-[#3D2505] tracking-wide">
          Máy niệm Phật
        </h1>

        {/* Right: Settings / Sleep Timer Quick Button */}
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

      {/* 2. SERENE BUDDHA HERO VIEW (Top Half matching Om Mani landscape painting) */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-6 overflow-hidden">
        {/* Scenic Buddhist Landscape Background with Misty Mountains & Ancient Pagoda */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('/images/ancient_pagoda.jpg')`,
            filter: 'sepia(30%) saturate(120%) brightness(105%)',
          }}
        />
        {/* Soft Golden Sunrise Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/90 via-[#FFF4D0]/60 to-[#FDF8EC] pointer-events-none" />

        {/* Floating Auspicious Mountain Pagoda Silhouette (Left) */}
        <div className="absolute left-4 top-10 sm:left-12 sm:top-14 opacity-25 pointer-events-none select-none">
          <svg className="w-16 h-24 text-[#8C5500]" viewBox="0 0 60 100" fill="currentColor">
            <path d="M30 0 L33 12 L27 12 Z M20 14 L40 14 L42 22 L18 22 Z M15 24 L45 24 L48 36 L12 36 Z M10 38 L50 38 L54 54 L6 54 Z M5 56 L55 56 L58 76 L2 76 Z M0 78 L60 78 L60 100 L0 100 Z" />
          </svg>
        </div>

        {/* Buddha Centerpiece Visual */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-sm">
          {/* Radiant Golden Halo Ring */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* Outer Pulsing Aura */}
            <div
              className={cn(
                'absolute inset-0 rounded-full transition-all duration-1000',
                isPlaying
                  ? 'bg-gradient-to-tr from-[#FFD24D]/50 via-[#FFA726]/40 to-[#FFEBA3]/60 blur-xl scale-110 animate-pulse'
                  : 'bg-[#FFE699]/30 blur-md scale-95'
              )}
            />

            {/* Inner Sacred Light Circle */}
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-[#D9A02E]/70 bg-gradient-to-b from-[#FFFDF5] via-[#FFF6DE] to-[#FFEAA7] shadow-[0_0_40px_rgba(235,170,40,0.35)] flex items-center justify-center overflow-hidden">
              <img
                src={activeTrack.heroImage}
                alt={activeTrack.title}
                className={cn(
                  'w-36 h-36 sm:w-44 sm:h-44 object-contain transition-transform duration-700',
                  isPlaying ? 'scale-105' : 'scale-100'
                )}
              />
            </div>
          </div>

          {/* Romanized Sanskrit / English Deva Name (Identical to "Amitābha Buddha" in Screenshot) */}
          <h2 className="mt-4 font-serif text-base sm:text-lg font-bold text-[#5C3D18] tracking-wider italic">
            {activeTrack.devaName}
          </h2>

          {/* Rhythmic Syllable Highlighting Beat */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 px-2">
            {activeTrack.syllables.map((syl, i) => (
              <span
                key={`${activeTrack.id}-${i}`}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-serif font-bold transition-all duration-200',
                  isPlaying && activeSyllableIdx === i
                    ? 'bg-[#C8780A] text-white scale-110 shadow-sm'
                    : 'bg-white/80 text-[#5C3D18] border border-[#EAD7A7]'
                )}
              >
                {syl}
              </span>
            ))}
          </div>

          {/* Session Count & Timer Badge */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E8D4A8] text-xs font-semibold text-[#8C5500] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C8780A]" />
            <span>Đã trì niệm: {sessionCount} biến</span>
            <span className="text-[#B39977]">•</span>
            <span>Tổng: {chantMachineCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3. OPTIONAL SETTINGS DRAWER (Sleep timer, speed, ambient sounds) */}
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

      {/* 4. BOTTOM SHEET: CHANTING PLAYLIST (Matching Screenshot 1 & 2) */}
      <div className="relative z-20 w-full max-w-xl mx-auto rounded-t-[32px] bg-gradient-to-b from-[#FFFDF7] via-[#FFFBF0] to-[#FFF9E9] border-t-2 border-x-2 border-[#EAD7A7] shadow-[0_-8px_32px_rgba(180,140,60,0.14)] flex flex-col transition-all duration-300">
        {/* Drag Handle Bar */}
        <div
          onClick={() => setSheetExpanded((v) => !v)}
          className="pt-2.5 pb-1 flex justify-center cursor-pointer select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-[#D4C3A3]/80 hover:bg-[#BBA375] transition-colors" />
        </div>

        {/* Playlist Subheader: "Danh sách" & "Phát ngẫu nhiên" */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-[#F2E5C4]">
          <span className="font-serif font-bold text-base text-[#2C1E10]">Danh sách</span>
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

        {/* Scrollable Tracks List (Exact 12 Om Mani Tracks from Screenshots) */}
        <div
          ref={playlistContainerRef}
          className={cn(
            'overflow-y-auto px-3 py-2 space-y-1.5 transition-all duration-300 pr-2',
            sheetExpanded ? 'max-h-[290px] sm:max-h-[340px]' : 'max-h-0 py-0 overflow-hidden'
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
                {/* Deity Avatar + Name */}
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
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Play / Status Button */}
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

        {/* 5. BOTTOM CONTROL DOCK (Identical to Om Mani App: Lặp lại | Play/Pause | Danh sách) */}
        <div className="px-6 py-3.5 bg-[#FFFDF8] border-t border-[#F2E5C4] flex items-center justify-between gap-4">
          {/* Left: "Lặp lại" Button */}
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

          {/* Center: Large Prominent Circular Play/Pause Button */}
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
            {/* Outer Ring Glow */}
            <div className="absolute -inset-1 rounded-full border border-[#D9A02E]/60 pointer-events-none" />
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
            )}
          </button>

          {/* Right: "Danh sách" Button */}
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
