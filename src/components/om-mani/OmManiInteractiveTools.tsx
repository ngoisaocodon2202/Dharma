'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Volume2, Flame, RefreshCw, Heart, Check, Bell } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

// ==========================================
// 1. THẮP HƯƠNG ONLINE (INCENSE CEREMONY)
// ==========================================
interface IncenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncenseOfferingModal({ isOpen, onClose }: IncenseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [incenseCount, setIncenseCount] = useState(3);
  const [prayerText, setPrayerText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalOffered, setTotalOffered] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('phatphap_personal_incense_count');
      if (saved) setTotalOffered(Number(saved));
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLightIncense = () => {
    setIsLit(true);
    playBellSound(0.5);
    const newCount = totalOffered + 1;
    setTotalOffered(newCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('phatphap_personal_incense_count', String(newCount));
    }
  };

  const handlePray = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText.trim()) return;
    setIsSubmitted(true);
    playBellSound(0.4);
    setTimeout(() => {
      setIsSubmitted(false);
      setPrayerText('');
    }, 4000);
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-amber-950/90 via-charcoal-900 to-charcoal-950 text-white rounded-3xl border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-scale-in">
        {/* Header */}
        <div className="relative px-4 sm:px-6 pt-5 pb-3.5 flex items-center justify-between gap-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-charcoal-950 shadow-md shrink-0">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm sm:text-base text-amber-200 whitespace-nowrap truncate">
                Thắp Hương Tam Bảo Trực Tuyến
              </h3>
              <p className="text-[11px] text-amber-300/70 whitespace-nowrap truncate">
                Nhất tâm đảnh lễ • Dâng nén tâm hương
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-300/70 hover:text-amber-100 hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Altar View */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Buddha Statue Aura */}
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            {/* Pulsing golden aura */}
            <div className={cn(
              "absolute inset-0 rounded-full bg-amber-400/20 blur-xl transition-all duration-1000",
              isLit ? "scale-125 opacity-100 animate-pulse" : "scale-100 opacity-40"
            )} />

            {/* Sacred Buddha Silhouette Image */}
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400/40 p-1 bg-gradient-to-b from-amber-600/30 to-amber-950/80 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <img
                src="/images/golden_buddha.jpg"
                alt="Đức Phật Bổn Sư"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="text-xs text-amber-300 font-medium tracking-wide mb-1">
            Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
          </div>
          <p className="text-[11px] text-stone-300 max-w-xs leading-relaxed mb-5">
            &ldquo;Khói hương quyện tỏa mười phương giới, biến thành mây lành khắp hư không.&rdquo;
          </p>

          {/* Incense Burner (Lư Hương) & Sticks */}
          <div className="relative w-44 h-32 flex flex-col items-center justify-end mb-6">
            {/* Animated Smoke if lit */}
            {isLit && (
              <div className="absolute top-0 flex gap-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-14 bg-gradient-to-t from-amber-200/80 via-white/40 to-transparent rounded-full blur-[1px] animate-pulse"
                    style={{
                      animationDuration: `${1.8 + i * 0.4}s`,
                      transform: `rotate(${i === 0 ? -6 : i === 2 ? 6 : 0}deg) translateY(-8px)`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* 3 Incense Sticks */}
            <div className="flex gap-4 items-end mb-1 z-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  {/* Glowing tip */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-500",
                      isLit
                        ? "bg-rose-500 shadow-[0_0_10px_#ff4444] animate-pulse scale-125"
                        : "bg-amber-800"
                    )}
                  />
                  {/* Stick */}
                  <div className="w-[3px] h-14 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-xs" />
                </div>
              ))}
            </div>

            {/* Bronze Incense Burner Vessel (Lư Hương Đồng) */}
            <div className="relative w-36 h-14 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-3xl rounded-t-lg border-t-2 border-amber-300 shadow-lg flex items-center justify-center">
              <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-charcoal-950 flex items-center gap-1 whitespace-nowrap">
                <BuddhaBodhiIcon className="w-3.5 h-3.5 text-amber-950 shrink-0" />
                <span>Bàn Thờ Tam Bảo</span>
              </div>
            </div>
          </div>

          {/* Action: Light Incense or Prayer */}
          {!isLit ? (
            <button
              onClick={handleLightIncense}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-saffron-600 hover:from-amber-400 hover:to-saffron-500 text-charcoal-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current text-charcoal-950 shrink-0" />
              <span className="whitespace-nowrap truncate">Chạm Để Thắp Hương & Gõ Chuông</span>
            </button>
          ) : (
            <div className="w-full space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                <span>Hương trầm đã thắp • Tâm thanh tịnh</span>
              </div>

              {/* Prayer form */}
              <form onSubmit={handlePray} className="space-y-2">
                <textarea
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  placeholder="Viết lời nguyện cầu an, cầu siêu hoặc hồi hướng công đức..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-charcoal-800/80 border border-amber-500/30 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!prayerText.trim() || isSubmitted}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600/80 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Đã hồi hướng lời nguyện an lành!</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-current shrink-0" />
                      <span>Gửi Nguyện Cầu Hồi Hướng</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Counter info */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 w-full flex items-center justify-between gap-2 text-[11px] text-amber-300/60 whitespace-nowrap">
            <span className="truncate">Số lần bạn đã dâng tâm hương</span>
            <span className="font-mono font-bold text-amber-300 shrink-0">
              {totalOffered.toLocaleString('vi-VN')} lần
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ==========================================
// 2. CHUỖI HẠT NIỆM PHẬT (MALA BEADS COUNTER)
// ==========================================
interface MalaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANT_OPTIONS = [
  { id: 'adida', name: 'Nam Mô A Di Đà Phật', short: 'A Di Đà Phật' },
  { id: 'ommani', name: 'Án Ma Ni Bát Mê Hồng (Om Mani Padme Hum)', short: 'Om Mani Padme Hum' },
  { id: 'quanam', name: 'Nam Mô Quán Thế Âm Bồ Tát', short: 'Quán Thế Âm' },
  { id: 'thichca', name: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật', short: 'Thích Ca Mâu Ni' },
  { id: 'diatang', name: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát', short: 'Địa Tạng Vương' },
  { id: 'duocsu', name: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật', short: 'Dược Sư Phật' },
];

export function MalaBeadsModal({ isOpen, onClose }: MalaModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedChant, setSelectedChant] = useState(CHANT_OPTIONS[0]);
  const [beadIndex, setBeadIndex] = useState(0); // 0 to 107
  const [roundCount, setRoundCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem('phatphap_personal_chant_count');
      if (savedCount) setTotalCount(Number(savedCount));
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const handleNextBead = () => {
    playWoodenFishSound(0.6);
    const nextIdx = (beadIndex + 1) % 108;
    setBeadIndex(nextIdx);

    if (nextIdx === 0) {
      setRoundCount(prev => prev + 1);
      playBellSound(0.6);
    }

    const nextTotal = totalCount + 1;
    setTotalCount(nextTotal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('phatphap_personal_chant_count', String(nextTotal));
    }
  };

  const handleResetRound = () => {
    setBeadIndex(0);
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-stone-900 via-charcoal-900 to-stone-950 text-white rounded-3xl border border-amber-600/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] animate-scale-in">
        {/* Header */}
        <div className="px-4 sm:px-5 pt-5 pb-3 flex items-center justify-between gap-2 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-charcoal-950 shadow-md shrink-0">
              <BuddhaBodhiIcon className="w-4 h-4 text-charcoal-950" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-amber-200 whitespace-nowrap truncate">
                Chuỗi Hạt 108 Niệm Phật
              </h3>
              <p className="text-[10px] text-amber-300/70 whitespace-nowrap truncate">
                Chạm vào màn hình để gõ mõ và lần từng hạt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chant Selector Pills */}
        <div className="px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-1.5 bg-black/20 border-b border-white/5">
          {CHANT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedChant(opt)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap font-medium transition-all",
                selectedChant.id === opt.id
                  ? "bg-amber-500 text-charcoal-950 font-bold shadow-xs scale-102"
                  : "bg-white/5 text-stone-300 hover:bg-white/10"
              )}
            >
              {opt.short}
            </button>
          ))}
        </div>

        {/* Main Interactive Bead Area */}
        <div
          onClick={handleNextBead}
          className="p-6 flex flex-col items-center text-center cursor-pointer select-none active:scale-98 transition-transform"
        >
          {/* Current Chant Display */}
          <div className="text-amber-300/80 text-[11px] uppercase tracking-wider mb-1">
            Đang Trì Niệm
          </div>
          <div className="font-heading font-bold text-lg sm:text-xl text-amber-100 min-h-[56px] flex items-center justify-center max-w-xs">
            {selectedChant.name}
          </div>

          {/* Circular Mala Beads Wheel */}
          <div className="relative w-52 h-52 my-4 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '40s' }} />

            {/* Glowing Golden Beads Around Perimeter */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
              const radius = 88;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isCurrent = Math.floor(beadIndex / 9) === i;

              return (
                <div
                  key={i}
                  className={cn(
                    "absolute w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center",
                    isCurrent
                      ? "bg-gradient-to-tr from-amber-400 via-amber-200 to-white shadow-[0_0_15px_#f59e0b] scale-135 z-10"
                      : "bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-900 border border-amber-600/40"
                  )}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                />
              );
            })}

            {/* Center Golden Core (Big Tap Target) */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-900/60 to-charcoal-950 border-2 border-amber-400/50 shadow-[inset_0_2px_10px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center p-2 group hover:border-amber-300">
              <span className="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold">
                Hạt số
              </span>
              <span className="font-mono text-3xl font-extrabold text-amber-200 my-0.5 leading-none">
                {beadIndex + 1}
              </span>
              <span className="text-[9px] text-stone-400">
                / 108 hạt
              </span>
            </div>
          </div>

          <div className="text-xs text-amber-300/80 font-medium flex items-center gap-1.5 mt-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Chạm bất kỳ đâu để niệm tiếp & gõ mõ</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-stone-400 text-[10px]">Vòng chuỗi hôm nay</div>
              <div className="font-bold text-amber-200 text-sm mt-0.5">
                {roundCount} vòng chuỗi
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-stone-400 text-[10px]">Tổng số lần niệm</div>
              <div className="font-bold text-amber-300 text-sm mt-0.5 font-mono">
                {totalCount.toLocaleString('vi-VN')} câu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
