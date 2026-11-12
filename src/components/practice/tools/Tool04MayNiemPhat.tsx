'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Timer,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import {
  LotusMinimalIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { CHANT_MACHINE_TRACKS } from '@/data/practiceToolsData';
import {
  playChantingPulse,
  playBellSound,
  playWoodenFishSound,
  startHealingDrone,
  stopHealingDrone,
} from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

type AmbientMode = 'none' | 'bell' | 'lotus-432' | 'woodfish';
type SleepOption = 0 | 15 | 30 | 45 | 60;

interface Tool04MayNiemPhatProps {
  showToast: (msg: string) => void;
}

export function Tool04MayNiemPhat({ showToast }: Tool04MayNiemPhatProps) {
  const {
    chantMachineTrackId,
    chantMachineCount,
    chantMachineSpeed,
    setChantMachineTrack,
    setChantMachineSpeed,
    incrementChantMachineCount,
  } = useDharmaPracticeStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [syllableIdx, setSyllableIdx] = useState(0);
  const [ambientMode, setAmbientMode] = useState<AmbientMode>('bell');
  const [sleepTimerMins, setSleepTimerMins] = useState<SleepOption>(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState(0);
  const [petalPulse, setPetalPulse] = useState(false);

  const stepRef = useRef(0);
  const phraseCountRef = useRef(0);

  const activeIndex = useMemo(() => {
    const idx = CHANT_MACHINE_TRACKS.findIndex((t) => t.id === chantMachineTrackId);
    return idx >= 0 ? idx : 0;
  }, [chantMachineTrackId]);

  const activeTrack = CHANT_MACHINE_TRACKS[activeIndex];

  // Calculate syllable interval in ms based on speed setting
  const stepMs = useMemo(() => {
    const speedMult =
      chantMachineSpeed === 'slow' ? 1.32 : chantMachineSpeed === 'fast' ? 0.76 : 1.0;
    return Math.round((60000 / activeTrack.baseBpm) * speedMult);
  }, [activeTrack.baseBpm, chantMachineSpeed]);

  // Ambient 432Hz pad lifecycle
  useEffect(() => {
    if (isPlaying && ambientMode === 'lotus-432') {
      startHealingDrone(432, 0.14);
    } else {
      stopHealingDrone();
    }
    return () => {
      stopHealingDrone();
    };
  }, [isPlaying, ambientMode]);

  // Chanting loop & auto-increment synced to completed phrase
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const idx = stepRef.current % activeTrack.syllables.length;
      setSyllableIdx(idx);
      playChantingPulse(activeTrack.soundMotifId, idx, 0.3);

      if (ambientMode === 'woodfish') {
        playWoodenFishSound(0.24);
      } else if (ambientMode === 'bell' && idx === 0) {
        playBellSound(0.22);
      }

      const isEndOfPhrase = idx === activeTrack.syllables.length - 1;
      if (isEndOfPhrase) {
        phraseCountRef.current += 1;
        setSessionCount((c) => (c + 1 > 9999 ? 0 : c + 1));
        incrementChantMachineCount(activeTrack.title);
        setPetalPulse(true);
        setTimeout(() => setPetalPulse(false), 320);
      }

      stepRef.current = (stepRef.current + 1) % activeTrack.syllables.length;
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPlaying, stepMs, activeTrack, ambientMode, incrementChantMachineCount]);

  // Sleep timer countdown
  useEffect(() => {
    if (!isPlaying || sleepRemainingSec <= 0) return;
    const t = setInterval(() => {
      setSleepRemainingSec((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          stopHealingDrone();
          showToast('Hết giờ hẹn tắt Máy Niệm Phật • Tâm thanh tịnh an lạc');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, sleepRemainingSec, showToast]);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      stopHealingDrone();
    };
  }, []);

  const handleSelectTrack = (id: string) => {
    stepRef.current = 0;
    setSyllableIdx(0);
    setChantMachineTrack(id);
    playBellSound(0.25);
  };

  const handlePrevNext = (dir: -1 | 1) => {
    const nextIdx = (activeIndex + dir + CHANT_MACHINE_TRACKS.length) % CHANT_MACHINE_TRACKS.length;
    handleSelectTrack(CHANT_MACHINE_TRACKS[nextIdx].id);
  };

  const handleSetSleepOption = (mins: SleepOption) => {
    setSleepTimerMins(mins);
    setSleepRemainingSec(mins * 60);
    if (mins > 0) {
      showToast(`Đã hẹn tắt Máy Niệm Phật sau ${mins} phút`);
    }
  };

  const formatLcd = (val: number) => String(val % 10000).padStart(4, '0');
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT: PHYSICAL DIGITAL LOTUS CHANTING BOX */}
      <div className="lg:col-span-6 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-5 sm:p-6 shadow-md space-y-5 text-center">
        <div className="flex items-center justify-between text-xs font-bold text-[#8C5500]">
          <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAD7A7]">
            Đài Sen Máy Niệm Phật
          </span>
          {sleepTimerMins > 0 && sleepRemainingSec > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#D9A02E] text-[#8C5500] font-mono flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              {formatTimer(sleepRemainingSec)}
            </span>
          ) : (
            <span className="text-[11px] text-[#6B533B]">Tích lũy: {chantMachineCount.toLocaleString()} biến</span>
          )}
        </div>

        {/* Breathing Lotus Pedestal Centerpiece */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div
            className={cn(
              'w-40 h-40 sm:w-44 sm:h-44 rounded-full flex items-center justify-center relative transition-all duration-500',
              isPlaying && 'scale-105'
            )}
          >
            {/* Outer Breathing Halo */}
            <div
              className={cn(
                'absolute inset-0 rounded-full border-2 border-[#D9A02E]/60 transition-all duration-700',
                isPlaying ? 'animate-breathe-ring bg-[#FAD02C]/25' : 'bg-[#FFF6DF]/60'
              )}
            />
            <div
              className={cn(
                'relative w-32 h-32 rounded-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF4D0] to-[#FFE07D] border-2 border-[#D99B16] shadow-sm flex flex-col items-center justify-center transition-transform duration-300',
                petalPulse && 'scale-110 shadow-[0_0_28px_rgba(245,197,66,0.65)]'
              )}
            >
              <LotusMinimalIcon className="w-14 h-14 text-[#8C5500]" />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#7A5000]">
                {isPlaying ? 'Đang Trì Niệm' : 'Tạm Nghỉ'}
              </span>
            </div>
          </div>

          {/* Live Synchronized Syllable Highlighter */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 min-h-[36px]">
            {activeTrack.syllables.map((syl, i) => (
              <span
                key={`${activeTrack.id}-${i}`}
                className={cn(
                  'px-2 py-0.5 rounded-lg text-xs sm:text-sm font-serif font-bold transition-all',
                  isPlaying && syllableIdx === i
                    ? 'bg-[#C8780A] text-white scale-110 shadow-sm'
                    : 'bg-[#FFFFFF] text-[#2C1E10] border border-[#EAD7A7]'
                )}
              >
                {syl}
              </span>
            ))}
          </div>
        </div>

        {/* Digital LCD/LED Counter Screen (Bright Gold & Ivory Screen) */}
        <div className="mx-auto max-w-xs rounded-2xl bg-[#FFFFFF] border-2 border-[#C68B19] p-3.5 shadow-xs text-[#2C1E10]">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
            <span>Phiên Hiện Tại</span>
            <button
              type="button"
              onClick={() => setSessionCount(0)}
              className="hover:text-[#2C1E10] flex items-center gap-1 cursor-pointer"
              title="Đặt lại bộ đếm phiên"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="mt-1 font-mono text-4xl font-extrabold tracking-[0.22em] text-[#8C5500]">
            {formatLcd(sessionCount)}
          </div>
          <p className="mt-1 text-[11px] text-[#6B533B] truncate font-medium">
            {activeTrack.title} • {activeTrack.subtitle}
          </p>
        </div>

        {/* Hardware-Style Prev / Play-Pause / Next */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => handlePrevNext(-1)}
            className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#8C5500] flex items-center justify-center shadow-2xs active:scale-90 transition-all cursor-pointer"
            aria-label="Bài trước"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPlaying) {
                playBellSound(0.35);
                showToast(`Bắt đầu niệm: ${activeTrack.title}`);
              }
              setIsPlaying((p) => !p);
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFE79A] via-[#FAD02C] to-[#D99B16] border-2 border-white text-[#3D2505] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => handlePrevNext(1)}
            className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#8C5500] flex items-center justify-center shadow-2xs active:scale-90 transition-all cursor-pointer"
            aria-label="Bài kế tiếp"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Speed, Ambient & Sleep Timer Controls */}
        <div className="pt-2 space-y-3 text-left text-xs border-t border-[#EAD7A7]">
          {/* Cadence Speed */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] block">Tốc độ niệm:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slow' as const, label: 'Chậm (Định tâm)' },
                { id: 'medium' as const, label: 'Vừa (Hành trì)' },
                { id: 'fast' as const, label: 'Nhanh (Tinh tấn)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChantMachineSpeed(opt.id)}
                  className={cn(
                    'py-2 px-2 rounded-xl border font-bold text-[11px] cursor-pointer whitespace-normal text-center transition-all',
                    chantMachineSpeed === opt.id
                      ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Pad */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Nhạc nền tịnh tâm:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'bell' as const, label: 'Tiếng Chuông' },
                { id: 'lotus-432' as const, label: 'Đài Sen 432Hz' },
                { id: 'woodfish' as const, label: 'Mõ Nhẹ' },
                { id: 'none' as const, label: 'Thuần Chữ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAmbientMode(opt.id)}
                  className={cn(
                    'py-1.5 px-2 rounded-xl border font-bold text-[11px] cursor-pointer text-center',
                    ambientMode === opt.id
                      ? 'bg-[#FFE07D] border-[#C68B19] text-[#3D2505]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Timer */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" /> Hẹn giờ tắt tự động:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {([0, 15, 30, 45, 60] as SleepOption[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSetSleepOption(m)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-xl border font-bold text-[11px] cursor-pointer',
                    sleepTimerMins === m
                      ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {m === 0 ? 'Không giới hạn' : `${m} phút`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: 8 BUILT-IN CHANTING TRACKS LIST */}
      <div className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAD7A7]">
          <div>
            <h4 className="font-serif font-bold text-base text-[#2C1E10]">
              8 Kênh Niệm Phật &amp; Trì Chú Chuyên Tu
            </h4>
            <p className="text-xs text-[#6B533B]">
              Chọn hồng danh chư Phật hoặc thần chú hợp duyên hôm nay
            </p>
          </div>
          <TempleBellIcon className="w-5 h-5 text-[#8C5500]" />
        </div>

        <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
          {CHANT_MACHINE_TRACKS.map((track, idx) => {
            const active = track.id === activeTrack.id;
            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={cn(
                  'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                  active
                    ? 'bg-[#FFF9EB] border-[#C68B19] shadow-2xs'
                    : 'bg-[#FAF7F0] border-[#EAD7A7] hover:border-[#C68B19]'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      'w-7 h-7 rounded-xl text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5',
                      active ? 'bg-[#C8780A] text-white' : 'bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500]'
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-serif font-bold text-sm text-[#2C1E10] leading-snug">
                      {track.title}
                    </h5>
                    <p className="text-[11px] font-semibold text-[#8C5500] mt-0.5">
                      {track.subtitle}
                    </p>
                    <p className="text-[11px] text-[#6B533B] mt-1 leading-relaxed">
                      {track.vowNote}
                    </p>
                  </div>
                </div>

                {active && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#D9A02E] text-[10px] font-bold text-[#8C5500] shrink-0">
                    {isPlaying ? 'Đang phát' : 'Đang chọn'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

