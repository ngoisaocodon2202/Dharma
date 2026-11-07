'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RealisticMalaWheelProps {
  currentBead: number; // 1-based or 0-based current bead count
  totalBeads?: number; // default 108
  onAdvanceBead: () => void;
  chantLabel?: string;
}

interface FloatingParticle {
  id: number;
  beadNum: number;
}

const RING_BEAD_COUNT = 18; // 18 realistic wooden beads around the necklace ring (360 / 18 = 20deg per tap)

export function RealisticMalaWheel({
  currentBead,
  totalBeads = 108,
  onAdvanceBead,
  chantLabel = 'Nam Mô A Di Đà Phật',
}: RealisticMalaWheelProps) {
  const [stepCount, setStepCount] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Sync initial stepCount if reset
  useEffect(() => {
    if (currentBead === 0 && stepCount > 0 && stepCount % totalBeads !== 0) {
      setStepCount(0);
    }
  }, [currentBead, stepCount, totalBeads]);

  const handleTap = () => {
    setStepCount((prev) => prev + 1);
    setIsPulling(true);

    const nextDisplayNum = (currentBead % totalBeads) + 1;
    const pid = Date.now() + Math.random();
    setParticles((prev) => [...prev.slice(-4), { id: pid, beadNum: nextDisplayNum }]);

    onAdvanceBead();

    setTimeout(() => {
      setIsPulling(false);
    }, 240);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pid));
    }, 1100);
  };

  // Rotation angle: each tap rotates the entire wooden necklace by +20 degrees clockwise
  const rotationDeg = stepCount * (360 / RING_BEAD_COUNT);
  const activeSlotIndex =
    ((RING_BEAD_COUNT - (stepCount % RING_BEAD_COUNT)) % RING_BEAD_COUNT);

  const displayBeadNumber = currentBead === 0 ? 1 : currentBead;

  return (
    <div
      onClick={handleTap}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer group"
    >
      {/* ================= FLOATING MERIT PARTICLES ON EACH BEAD TAP ================= */}
      <div className="pointer-events-none absolute -top-4 inset-x-0 flex justify-center z-30">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/95 to-yellow-400/95 text-charcoal-950 font-extrabold text-xs shadow-[0_0_20px_rgba(251,191,36,0.8)] flex items-center gap-1 whitespace-nowrap animate-float-up-fade"
          >
            <span>🪷 Hạt #{p.beadNum}</span>
            <span className="opacity-80">• +1 Công đức</span>
          </div>
        ))}
      </div>

      {/* ================= TOP ACTIVE BEAD POINTER / THUMB GUIDE ================= */}
      <div className="relative z-20 mb-1 flex flex-col items-center pointer-events-none">
        <div
          className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 whitespace-nowrap',
            isPulling
              ? 'bg-amber-400 text-charcoal-950 border-white shadow-[0_0_16px_#fbbf24] scale-110'
              : 'bg-amber-950/90 text-amber-300 border-amber-500/50'
          )}
        >
          ▼ Hạt Đang Lần ▼
        </div>
      </div>

      {/* ================= 3D WOODEN MALA NECKLACE RING ================= */}
      <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center my-1">
        {/* Expanding Ripple Ring when pulling a bead */}
        <div
          className={cn(
            'absolute top-2 w-12 h-12 rounded-full border-2 border-amber-300 pointer-events-none transition-all duration-500',
            isPulling ? 'scale-200 opacity-0' : 'scale-75 opacity-0'
          )}
        />

        {/* Ambient Sacred Golden Halo */}
        <div
          className={cn(
            'absolute inset-4 rounded-full bg-radial from-amber-500/20 via-amber-900/10 to-transparent blur-xl transition-all duration-300 pointer-events-none',
            isPulling ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
          )}
        />

        {/* Red & Gold Braided Silk Cord (Dây chỉ đỏ bện kim tuyến xuyên tâm hạt) */}
        <svg
          viewBox="0 0 240 240"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Outer subtle dharma wheel aura */}
          <circle
            cx="120"
            cy="120"
            r="102"
            fill="none"
            stroke="rgba(245, 158, 11, 0.18)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          {/* Main Red Silk Cord */}
          <circle
            cx="120"
            cy="120"
            r="92"
            fill="none"
            stroke="#991B1B"
            strokeWidth="5"
          />
          {/* Braided Gold Thread */}
          <circle
            cx="120"
            cy="120"
            r="92"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Bottom Red Silk Tassel & Guru Gourd (Tua rua Cát Tường) */}
        <div
          className={cn(
            'absolute -bottom-4 flex flex-col items-center pointer-events-none z-0 transition-transform duration-300 origin-top',
            isPulling ? 'rotate-6 scale-105' : 'rotate-0'
          )}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-200 shadow-sm" />
          <div className="w-1.5 h-3 bg-red-700" />
          <div className="w-5 h-7 rounded-b-lg bg-gradient-to-b from-red-600 via-red-700 to-red-900 border-t-2 border-amber-400 shadow-md" />
        </div>

        {/* Rotating Ring of 18 Realistic 3D Sandalwood Beads */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `rotate(${rotationDeg}deg)`,
          }}
        >
          {[...Array(RING_BEAD_COUNT)].map((_, i) => {
            const angle = (i / RING_BEAD_COUNT) * 2 * Math.PI - Math.PI / 2;
            const radius = 92; // Matches SVG cord radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isTopActive = i === activeSlotIndex;
            const isGuruBead = i === 0; // Guru bead (Hạt Mẫu) with golden ring

            return (
              <div
                key={i}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${-rotationDeg}deg)`,
                }}
                className="absolute flex items-center justify-center transition-transform duration-300"
              >
                <div
                  className={cn(
                    'relative rounded-full transition-all duration-250 flex items-center justify-center',
                    isTopActive
                      ? 'w-9 h-9 sm:w-10 sm:h-10 scale-115 z-20 shadow-[0_0_22px_#fbbf24,inset_0_2px_6px_rgba(255,255,255,0.6)] ring-2 ring-amber-300'
                      : isGuruBead
                        ? 'w-8 h-8 z-10 shadow-[0_4px_10px_rgba(0,0,0,0.75)] ring-1 ring-amber-400/80'
                        : 'w-7 h-7 sm:w-7.5 sm:h-7.5 shadow-[0_4px_8px_rgba(0,0,0,0.7)]'
                  )}
                  style={{
                    background: isTopActive
                      ? 'radial-gradient(circle at 30% 28%, #FFFBEB 0%, #FDE68A 18%, #D97706 48%, #78350F 82%, #270E03 100%)'
                      : 'radial-gradient(circle at 30% 28%, #FCD34D 0%, #B45309 22%, #6B2E08 58%, #3B1704 85%, #1A0901 100%)',
                  }}
                >
                  {/* Natural Wood Grain Texture Ring */}
                  <div className="absolute inset-1 rounded-full border border-amber-950/35 pointer-events-none" />
                  <div className="absolute inset-2 rounded-full border border-amber-200/15 pointer-events-none" />

                  {/* 3D Specular Gloss Highlight */}
                  <div className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full bg-white/45 blur-[0.3px] -rotate-25 pointer-events-none" />

                  {/* Engraved Buddhist Lotus / Swastika Symbol on Active or Guru Bead */}
                  {isTopActive ? (
                    <span className="text-[11px] font-bold text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] select-none">
                      ☸
                    </span>
                  ) : isGuruBead ? (
                    <span className="text-[9px] font-bold text-amber-200/90 select-none">
                      卍
                    </span>
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-amber-950/60" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= CENTER COUNTER MEDALLION ================= */}
        <div
          className={cn(
            'relative z-10 w-32 h-32 sm:w-34 sm:h-34 rounded-full bg-gradient-to-b from-[#3B1909] via-[#220D04] to-[#120601] border-2 flex flex-col items-center justify-center p-2 shadow-[inset_0_2px_15px_rgba(245,158,11,0.28),0_8px_24px_rgba(0,0,0,0.8)] transition-all duration-200',
            isPulling
              ? 'border-amber-300 scale-95 shadow-[0_0_25px_rgba(251,191,36,0.45)]'
              : 'border-amber-500/60 group-hover:border-amber-400'
          )}
        >
          <span className="text-[10px] uppercase tracking-widest text-amber-300/90 font-bold whitespace-nowrap">
            Hạt Chuỗi Số
          </span>
          <span
            className={cn(
              'font-mono text-3xl sm:text-4xl font-extrabold text-[#FFE082] my-0.5 leading-none transition-transform duration-150',
              isPulling && 'scale-115 text-white'
            )}
          >
            {displayBeadNumber}
          </span>
          <span className="text-[10px] text-amber-200/70 font-medium whitespace-nowrap">
            / {totalBeads} hạt
          </span>
        </div>
      </div>

      {/* ================= CLOSE-UP TACTILE BEAD PULLING TRACK ================= */}
      <div className="mt-3 w-full max-w-[260px] px-3 py-2 rounded-2xl bg-black/35 border border-amber-500/25 flex items-center justify-between gap-1.5 relative overflow-hidden">
        {/* Red cord line behind close-up beads */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent pointer-events-none" />

        {[-2, -1, 0, 1, 2].map((offset) => {
          const beadNum =
            ((displayBeadNumber - 1 + offset + totalBeads) % totalBeads) + 1;
          const isCenter = offset === 0;

          return (
            <div
              key={`${stepCount}-${offset}`}
              className={cn(
                'relative z-10 rounded-full flex items-center justify-center font-mono font-bold transition-all duration-200 shrink-0',
                isCenter
                  ? 'w-9 h-9 text-xs text-charcoal-950 ring-2 ring-amber-200 shadow-[0_0_14px_#f59e0b] scale-110'
                  : Math.abs(offset) === 1
                    ? 'w-7 h-7 text-[10px] text-amber-200/90 opacity-85'
                    : 'w-5 h-5 text-[9px] text-amber-300/60 opacity-50'
              )}
              style={{
                background: isCenter
                  ? 'radial-gradient(circle at 30% 30%, #FFFBEB 0%, #FDE68A 25%, #D97706 65%, #78350F 100%)'
                  : 'radial-gradient(circle at 30% 30%, #D97706 0%, #78350F 60%, #270E03 100%)',
              }}
            >
              {beadNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
