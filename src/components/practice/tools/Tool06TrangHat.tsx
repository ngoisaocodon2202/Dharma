'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Check,
  Target,
  SlidersHorizontal,
  ArrowDown,
} from 'lucide-react';
import {
  MalaBeadsMinimalIcon,
  LotusMinimalIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  MALA_DEITY_PRESETS,
  MALA_MATERIALS,
  MALA_SIZES,
} from '@/data/practiceToolsData';
import {
  playBeadTickSound,
  playChantingPulse,
  playOmTempleBellSound,
} from '@/lib/buddhistSounds';
import { useDharmaPracticeStore, getTodayDateKey } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

type MalaViewMode = 'vertical-slide' | 'circular-ring';

interface Tool06TrangHatProps {
  bonTonParam?: string | null;
  showToast: (msg: string) => void;
}

function mapBonTonSlug(slug?: string | null): string {
  const s = (slug || '').toLowerCase();
  if (s.includes('quan-am') || s.includes('quan-the-am')) return 'quan-am';
  if (s.includes('thich-ca')) return 'thich-ca';
  if (s.includes('duoc-su')) return 'duoc-su';
  if (s.includes('dia-tang')) return 'dia-tang';
  if (s.includes('luc-tu')) return 'luc-tu';
  return 'a-di-da';
}

export function Tool06TrangHat({ bonTonParam, showToast }: Tool06TrangHatProps) {
  const {
    dailyLogs,
    malaCurrentBead,
    malaCompletedMalas,
    malaLifetimeBeads,
    malaSelectedDeityId,
    malaMaterial,
    malaSize,
    malaDailyTargetRounds,
    setMalaSelectedDeity,
    setMalaCustomization,
    incrementMalaBead,
    resetMalaCurrentBead,
    addMeritEntry,
  } = useDharmaPracticeStore();

  const [viewMode, setViewMode] = useState<MalaViewMode>('vertical-slide');
  const [slideStep, setSlideStep] = useState(0);
  const [isAnimatingSlide, setIsAnimatingSlide] = useState(false);
  const [floatingFeedback, setFloatingFeedback] = useState<{ id: number; label: string } | null>(null);
  const [dedicationModalOpen, setDedicationModalOpen] = useState(false);
  const [dedicationText, setDedicationText] = useState(
    'Nguyện đem công đức trì niệm danh hiệu Chư Phật hồi hướng cho gia đạo bình an, cửu huyền thất tổ siêu sanh Tịnh Độ và muôn loài an lạc.'
  );

  const touchStartYRef = useRef<number | null>(null);
  const wheelLockRef = useRef<number>(0);

  useEffect(() => {
    if (bonTonParam) {
      setMalaSelectedDeity(mapBonTonSlug(bonTonParam));
    }
  }, [bonTonParam, setMalaSelectedDeity]);

  const activeDeity = useMemo(
    () => MALA_DEITY_PRESETS.find((d) => d.id === malaSelectedDeityId) || MALA_DEITY_PRESETS[0],
    [malaSelectedDeityId]
  );

  const activeMaterial = useMemo(
    () => MALA_MATERIALS.find((m) => m.id === malaMaterial) || MALA_MATERIALS[0],
    [malaMaterial]
  );

  const todayBeads = dailyLogs[getTodayDateKey()]?.malaBeadsCount || 0;
  const dailyTargetBeads = malaDailyTargetRounds * malaSize;
  const dailyGoalPct = Math.min(100, Math.round((todayBeads / Math.max(1, dailyTargetBeads)) * 100));

  const advanceBead = useCallback(() => {
    playBeadTickSound(0.62);
    const pulseTrackId =
      activeDeity.id === 'quan-am'
        ? 'quan-am'
        : activeDeity.id === 'luc-tu'
          ? 'luc-tu'
          : 'a-di-da';
    playChantingPulse(pulseTrackId, malaCurrentBead, 0.22);

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    } catch {}

    setSlideStep((s) => s + 1);
    setIsAnimatingSlide(true);
    setTimeout(() => setIsAnimatingSlide(false), 210);

    const { completedFullMala } = incrementMalaBead(1, activeDeity.name, malaSize);
    const displayNum = (malaCurrentBead % malaSize) + 1;
    setFloatingFeedback({ id: Date.now(), label: `Hạt ${displayNum}/${malaSize}` });

    if (completedFullMala) {
      playOmTempleBellSound(0.7);
      setDedicationText(
        `Nguyện đem công đức hoàn mãn trọn vẹn ${malaSize} biến niệm "${activeDeity.mantra}" hồi hướng cầu bình an cho gia đạo, oan gia trái chủ được giải kết và hết thảy chúng sinh sớm thành Phật đạo.`
      );
      setDedicationModalOpen(true);
    }
  }, [activeDeity.id, activeDeity.mantra, activeDeity.name, incrementMalaBead, malaCurrentBead, malaSize]);

  // Keyboard support: Space / ArrowDown
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
      if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault();
        advanceBead();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceBead]);

  // Circular ring visual node count: show exact dots up to 54, or 54 dual-count nodes for 108
  const visualRingNodes = malaSize === 108 ? 54 : malaSize;
  const filledNodesCount =
    malaSize === 108 ? Math.floor(malaCurrentBead / 2) : malaCurrentBead;

  return (
    <div className="space-y-5">
      {/* 1. DAILY TARGET & STATS SUMMARY */}
      <div className="rounded-3xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#8C5500] flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            <span>
              Mục tiêu hôm nay: {todayBeads}/{dailyTargetBeads} hạt ({malaDailyTargetRounds} chuỗi × {malaSize})
            </span>
          </span>
          <span className="font-mono font-bold text-[#2C1E10]">
            Hoàn mãn: {malaCompletedMalas} chuỗi • Tổng: {malaLifetimeBeads.toLocaleString()} hạt
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[#EAD7A7]/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F5C542] to-[#C8780A] transition-all duration-300"
            style={{ width: `${dailyGoalPct}%` }}
          />
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: INTERACTIVE STAGE (LEFT) + CUSTOMIZER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT STAGE */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-4 sm:p-6 shadow-sm space-y-4">
          {/* View Mode Toggle + Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex p-1 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] gap-1">
              <button
                type="button"
                onClick={() => setViewMode('vertical-slide')}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  viewMode === 'vertical-slide'
                    ? 'bg-[#FAD02C] text-[#3D2505] shadow-2xs'
                    : 'text-[#6B533B] hover:text-[#2C1E10]'
                )}
              >
                Chuỗi Trượt Dọc (Vuốt/Cuộn)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('circular-ring')}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  viewMode === 'circular-ring'
                    ? 'bg-[#FAD02C] text-[#3D2505] shadow-2xs'
                    : 'text-[#6B533B] hover:text-[#2C1E10]'
                )}
              >
                Vòng {malaSize} Hạt Toàn Cảnh
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                resetMalaCurrentBead();
                setSlideStep(0);
                showToast('Đã đặt lại vòng tràng hạt hiện tại về 0');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] flex items-center gap-1 cursor-pointer hover:bg-[#FFF6DF]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Đặt lại vòng
            </button>
          </div>

          {/* Active Mantra Banner */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] p-3 text-center">
            <p className="font-serif font-bold text-base sm:text-lg text-[#8C5500]">
              {activeDeity.mantra}
            </p>
            <p className="text-[11px] text-[#6B533B] mt-0.5">{activeDeity.vow}</p>
          </div>

          {/* STAGE A: DHARMA VERTICAL SLIDING MALA (SWIPE / WHEEL / SPACE / TAP) */}
          {viewMode === 'vertical-slide' ? (
            <div
              role="button"
              tabIndex={0}
              onClick={advanceBead}
              onTouchStart={(e) => {
                touchStartYRef.current = e.touches[0]?.clientY ?? null;
              }}
              onTouchEnd={(e) => {
                const startY = touchStartYRef.current;
                const endY = e.changedTouches[0]?.clientY;
                if (startY !== null && endY !== undefined && Math.abs(endY - startY) >= 24) {
                  e.preventDefault();
                  advanceBead();
                }
                touchStartYRef.current = null;
              }}
              onWheel={(e) => {
                const now = Date.now();
                if (now - wheelLockRef.current > 110 && Math.abs(e.deltaY) > 6) {
                  wheelLockRef.current = now;
                  advanceBead();
                }
              }}
              className="relative h-[370px] rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FFF9EB] to-[#FFFFFF] border border-[#EAD7A7] overflow-hidden flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing focus:outline-none"
            >
              {/* Top & Bottom Soft Vignette Fades */}
              <div className="pointer-events-none absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#FFFDF8] to-transparent z-20" />
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#FFFDF8] to-transparent z-20" />

              {/* Vertical Braided Silk Cord */}
              <div className="pointer-events-none absolute inset-y-0 w-1.5 bg-gradient-to-b from-amber-700 via-red-800 to-amber-700 opacity-80" />

              {/* Center Target Aura Line */}
              <div className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 h-24 rounded-2xl border border-dashed border-[#D9A02E] bg-[#FFF6DF]/70 z-0 flex items-center justify-between px-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                  Vùng Lần Hạt
                </span>
                <span className="font-mono text-lg font-extrabold text-[#8C5500]">
                  {malaCurrentBead} / {malaSize}
                </span>
              </div>

              {/* Floating Count Pill */}
              {floatingFeedback && (
                <div
                  key={floatingFeedback.id}
                  className="pointer-events-none absolute top-5 right-5 z-30 px-3 py-1 rounded-full bg-[#FFE07D] border border-[#C68B19] text-[#3D2505] text-xs font-bold shadow-md animate-float-up-fade"
                >
                  {floatingFeedback.label} • +1
                </div>
              )}

              {/* 5 Stacked 3D Beads Sliding Vertically */}
              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-3.5 transition-transform duration-200 ease-out',
                  isAnimatingSlide ? 'translate-y-4' : 'translate-y-0'
                )}
              >
                {[-2, -1, 0, 1, 2].map((slot) => {
                  const isCenter = slot === 0;
                  const beadNum = ((malaCurrentBead + slot + malaSize) % malaSize) || malaSize;
                  const isGuru = (slideStep + slot) % malaSize === 0 && slideStep > 0;
                  return (
                    <div
                      key={slot}
                      className={cn(
                        'rounded-full flex items-center justify-center transition-all duration-200 relative',
                        isCenter
                          ? cn(
                              'w-20 h-20 shadow-[0_10px_28px_rgba(140,85,0,0.38)] ring-4',
                              activeMaterial.ringColor
                            )
                          : Math.abs(slot) === 1
                            ? 'w-14 h-14 shadow-md opacity-90'
                            : 'w-11 h-11 shadow-sm opacity-65'
                      )}
                      style={{
                        background: isCenter
                          ? activeMaterial.activeGradient
                          : activeMaterial.gradient,
                      }}
                    >
                      {/* Specular Gloss Highlight */}
                      <span className="absolute top-2 left-3 w-3 h-2 rounded-full bg-white/55 blur-[0.5px]" />
                      {isCenter && (
                        <span className="text-sm font-mono font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                          {isGuru ? 'G' : beadNum}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Tactile Hint */}
              <div className="pointer-events-none absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8C5500]">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                <span>Vuốt xuống, Cuộn chuột, Nhấn Space hoặc Chạm để lần từng hạt</span>
              </div>
            </div>
          ) : (
            /* STAGE B: CIRCULAR MANDALA RING SHOWING GURU BEAD + PROGRESS */
            <div
              onClick={advanceBead}
              className="relative py-4 flex flex-col items-center justify-center cursor-pointer select-none"
            >
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                <svg viewBox="0 0 280 280" className="w-full h-full">
                  {/* Outer Subtle Track */}
                  <circle
                    cx="140"
                    cy="140"
                    r="114"
                    fill="none"
                    stroke="#EEDBBA"
                    strokeWidth="2.5"
                  />
                  {/* Individual Beads Around the Ring */}
                  {Array.from({ length: visualRingNodes }).map((_, idx) => {
                    const angle = (idx / visualRingNodes) * 2 * Math.PI - Math.PI / 2;
                    const x = 140 + Math.cos(angle) * 114;
                    const y = 140 + Math.sin(angle) * 114;
                    const isGuru = idx === 0;
                    const isCompleted = idx < filledNodesCount;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={isGuru ? 7.5 : visualRingNodes <= 27 ? 6.5 : 4.2}
                        fill={
                          isGuru
                            ? '#B91C1C'
                            : isCompleted
                              ? '#C8780A'
                              : '#F5E6C8'
                        }
                        stroke={isGuru ? '#FAD02C' : isCompleted ? '#8C5500' : '#D6BE90'}
                        strokeWidth={isGuru ? 2 : 1}
                      />
                    );
                  })}
                </svg>

                {/* Guru Tassel Accent Badge */}
                <div className="absolute -top-1 px-2.5 py-0.5 rounded-full bg-rose-700 border border-[#FAD02C] text-[10px] font-bold text-white shadow">
                  Hạt Mẫu ({malaSize})
                </div>

                {/* Center Tap Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <LotusMinimalIcon className="w-7 h-7 text-[#8C5500] mb-1" />
                  <span className="font-mono text-4xl font-extrabold text-[#2C1E10]">
                    {malaCurrentBead}
                  </span>
                  <span className="text-xs font-bold text-[#8C5500]">
                    / {malaSize} hạt
                  </span>
                  <span className="mt-1.5 text-[10px] text-[#6B533B] px-3 py-0.5 rounded-full bg-[#FFFFFF] border border-[#EAD7A7]">
                    Chạm vòng hoặc nhấn Space
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={advanceBead}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <MalaBeadsMinimalIcon className="w-4 h-4" />
            <span>Lần Hạt Trì Niệm ({malaCurrentBead} / {malaSize})</span>
          </button>
        </div>

        {/* RIGHT CUSTOMIZER: MATERIAL, SIZE, DEITY THEME & DAILY TARGET */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-4 text-xs shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EAD7A7]">
            <SlidersHorizontal className="w-4 h-4 text-[#8C5500]" />
            <h4 className="font-serif font-bold text-base text-[#2C1E10]">
              Tùy Chỉnh Tràng Hạt &amp; Mục Tiêu
            </h4>
          </div>

          {/* 4 Bead Materials */}
          <div className="space-y-2">
            <span className="font-bold text-[#8C5500] block">Chất liệu tràng hạt:</span>
            <div className="grid grid-cols-2 gap-2">
              {MALA_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setMalaCustomization({ malaMaterial: mat.id })}
                  className={cn(
                    'p-2.5 rounded-2xl border text-left flex items-center gap-2.5 cursor-pointer transition-all',
                    malaMaterial === mat.id
                      ? 'bg-[#FFF9EB] border-[#C8780A] shadow-2xs'
                      : 'bg-[#FAF7F0] border-[#EAD7A7] hover:border-[#C68B19]'
                  )}
                >
                  <span
                    className="w-6 h-6 rounded-full shrink-0 border border-black/10 shadow-sm"
                    style={{ background: mat.gradient }}
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-[#2C1E10] block truncate">{mat.name}</span>
                    <span className="text-[10px] text-[#6B533B] block truncate">{mat.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ring Size */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] block">Quy mô vòng chuỗi:</span>
            <div className="grid grid-cols-4 gap-2">
              {MALA_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setMalaCustomization({ malaSize: sz })}
                  className={cn(
                    'py-2 rounded-xl border font-bold text-xs cursor-pointer transition-all',
                    malaSize === sz
                      ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                      : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {sz} hạt
                </button>
              ))}
            </div>
          </div>

          {/* Daily Target */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] block">Mục tiêu mỗi ngày:</span>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 10].map((rounds) => (
                <button
                  key={rounds}
                  type="button"
                  onClick={() => setMalaCustomization({ malaDailyTargetRounds: rounds })}
                  className={cn(
                    'py-2 px-2 rounded-xl border font-bold text-[11px] cursor-pointer whitespace-normal text-center transition-all',
                    malaDailyTargetRounds === rounds
                      ? 'bg-[#FFE07D] border-[#C68B19] text-[#3D2505]'
                      : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {rounds} chuỗi ({rounds * malaSize} biến)
                </button>
              ))}
            </div>
          </div>

          {/* Chant Deity Subject */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#8C5500] block">Chủ đề trì niệm:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {MALA_DEITY_PRESETS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setMalaSelectedDeity(d.id)}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all',
                    malaSelectedDeityId === d.id
                      ? 'bg-[#FFF9EB] border-[#C8780A]'
                      : 'bg-[#FAF7F0] border-[#EAD7A7] hover:border-[#C68B19]'
                  )}
                >
                  <div className="min-w-0">
                    <span className="font-bold text-[#2C1E10] block truncate">{d.name}</span>
                    <span className="text-[11px] text-[#8C5500] block truncate">{d.mantra}</span>
                  </div>
                  {malaSelectedDeityId === d.id && (
                    <Check className="w-4 h-4 text-[#8C5500] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROUND COMPLETION DEDICATION MODAL (NGHI THỨC HỒI HƯỚNG CÔNG ĐỨC) */}
      {dedicationModalOpen && (
        <div
          className="fixed inset-0 w-screen h-[100dvh] z-[100001] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <header className="px-4 sm:px-6 py-3 bg-[#FAF7F0] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setDedicationModalOpen(false)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] cursor-pointer shrink-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#8C5500] truncate">
              Hồi Hướng Công Đức • {malaSize} Biến
            </h3>
            <div className="w-20 shrink-0 hidden sm:block" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
            <div className="my-auto w-full max-w-lg mx-auto rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-5 sm:p-7 shadow-xs space-y-5 dharma-input-panel-lock">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#8C5500]">
                  Viên Mãn Trọn Vẹn {malaSize} Biến Trì Niệm
                </h4>
                <p className="text-xs text-[#6B533B]">
                  Công đức đã tự động ghi nhận • Hãy gửi lời hồi hướng thanh tịnh
                </p>
              </div>

              <textarea
                rows={4}
                value={dedicationText}
                onChange={(e) => setDedicationText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#EAD7A7] text-base sm:text-sm text-[#2C1E10] focus:outline-none focus:border-[#C8780A]"
              />
            </div>
          </div>

          <footer className="px-4 sm:px-6 py-3.5 bg-[#FFFDF8] border-t border-[#EAD7A7] shrink-0">
            <div className="max-w-lg mx-auto w-full flex gap-2.5">
              <button
                type="button"
                onClick={() => setDedicationModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B] font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  addMeritEntry({
                    category: 'NIEM_PHAT',
                    title: `Hồi hướng ${malaSize} biến: ${activeDeity.name}`,
                    dedicationText,
                  });
                  resetMalaCurrentBead();
                  setDedicationModalOpen(false);
                  showToast('Đã lưu lời Hồi Hướng Công Đức vào Sổ Công Đức!');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
              >
                Lưu Hồi Hướng &amp; Lần Mới
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

