'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, Check } from 'lucide-react';
import {
  IncenseAltarIcon,
  MalaBeadsMinimalIcon,
  LotusMinimalIcon,
  DharmaWheelIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { incrementDailyPractice } from '@/lib/dailyPracticeProgress';
import { RealisticMalaWheel } from './RealisticMalaWheel';
import { cn } from '@/lib/utils';

// ==========================================
// 0. DHARMA MERIT LEDGER HELPERS
// ==========================================
export interface DharmaMeritEntry {
  id: string;
  type: string;
  title: string;
  detail: string;
  meritPoints: number;
  timestamp: string;
}

const MERIT_LEDGER_KEY = 'phatphap_dharma_merit_ledger';

export function getDharmaMeritLedger(): DharmaMeritEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MERIT_LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any, idx: number) => ({
      id: item.id || `merit-${idx}`,
      type: item.type || 'practice',
      title: item.title || item.type || 'Thời Khóa Hành Trì Dharma',
      detail: item.detail || 'Hồi hướng công đức Pháp Giới chúng sinh',
      meritPoints: typeof item.meritPoints === 'number' ? item.meritPoints : 15,
      timestamp: item.timestamp || new Date().toLocaleDateString('vi-VN'),
    }));
  } catch {
    return [];
  }
}

export function recordDharmaMerit(input: {
  type: string;
  title: string;
  detail: string;
  meritPoints?: number;
}): DharmaMeritEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getDharmaMeritLedger();
    const newEntry: DharmaMeritEntry = {
      id: `merit-${Date.now()}`,
      type: input.type,
      title: input.title,
      detail: input.detail,
      meritPoints: input.meritPoints ?? 15,
      timestamp: new Date().toLocaleDateString('vi-VN'),
    };
    const next = [newEntry, ...current].slice(0, 60);
    localStorage.setItem(MERIT_LEDGER_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

// ==========================================
// 1. DÂNG HƯƠNG TAM BẢO (INCENSE CEREMONY)
// ==========================================
interface IncenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncenseOfferingModal({ isOpen, onClose }: IncenseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLit, setIsLit] = useState(false);
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
    incrementDailyPractice('lay-phat', 3);
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
    playBellSound(0.45);

    // Save to Dharma Merit Ledger
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('phatphap_dharma_merit_ledger');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          id: `merit-${Date.now()}`,
          type: 'Dâng Hương & Phát Nguyện',
          detail: prayerText.trim(),
          timestamp: new Date().toLocaleDateString('vi-VN'),
        });
        localStorage.setItem('phatphap_dharma_merit_ledger', JSON.stringify(list.slice(0, 50)));
      } catch {}
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setPrayerText('');
    }, 3500);
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#2A1F0B] via-[#1F1708] to-[#161005] text-[#FFFDF7] rounded-t-[30px] sm:rounded-3xl border-t sm:border border-[#F5C542]/40 shadow-[0_-12px_50px_rgba(0,0,0,0.85)] animate-scale-in">
        {/* React Native Drag Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#F5C542]/35" />
        </div>

        {/* Header */}
        <div className="relative px-5 pt-4 pb-3.5 flex items-center justify-between gap-2 border-b border-[#F5C542]/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFE07D] to-[#E5A91C] flex items-center justify-center text-[#1A1305] shadow-md shrink-0">
              <IncenseAltarIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-serif font-bold text-sm sm:text-base text-[#FFD966] whitespace-nowrap truncate">
                Dâng Hương Cúng Dường Tam Bảo
              </h3>
              <p className="text-[11px] text-[#D6C394] whitespace-nowrap truncate">
                Ngũ phần Pháp thân hương • Nhất tâm kính lễ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#C7B68B] hover:text-[#FFD966] hover:bg-[#F5C542]/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Altar View */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Buddha Statue Aura */}
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-[#F5C542]/25 blur-xl transition-all duration-1000',
                isLit ? 'scale-125 opacity-100 animate-pulse' : 'scale-100 opacity-45'
              )}
            />

            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#FFD966]/60 p-1 bg-gradient-to-b from-[#F5C542]/30 to-[#241B0B] shadow-[0_0_28px_rgba(245,197,66,0.35)]">
              <img
                src="/images/golden_buddha.jpg"
                alt="Đức Phật Bổn Sư"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="text-xs text-[#FFD966] font-bold tracking-wide mb-1">
            Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
          </div>
          <p className="text-[11px] text-[#D6C394] max-w-xs leading-relaxed mb-5 font-serif italic">
            &ldquo;Nguyện đem lòng thành kính, gửi theo đám mây hương, phảng phất khắp mười phương, cúng dường ngôi Tam Bảo.&rdquo;
          </p>

          {/* Incense Burner (Lư Hương) & Sticks */}
          <div className="relative w-44 h-32 flex flex-col items-center justify-end mb-6">
            {isLit && (
              <div className="absolute top-0 flex gap-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-14 bg-gradient-to-t from-[#FFE07D]/80 via-white/40 to-transparent rounded-full blur-[1px] animate-pulse"
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
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-500',
                      isLit
                        ? 'bg-[#FFD966] shadow-[0_0_12px_#FFD966] animate-pulse scale-125'
                        : 'bg-[#8A6826]'
                    )}
                  />
                  <div className="w-[3px] h-14 bg-gradient-to-b from-[#C89628] via-[#8F6818] to-[#573E0B] rounded-xs" />
                </div>
              ))}
            </div>

            {/* Golden Bronze Incense Burner Vessel */}
            <div className="relative w-36 h-14 bg-gradient-to-r from-[#B8871D] via-[#F5C542] to-[#B8871D] rounded-b-3xl rounded-t-lg border-t-2 border-[#FFF0A8] shadow-lg flex items-center justify-center">
              <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#1A1305] flex items-center gap-1.5 whitespace-nowrap">
                <DharmaWheelIcon className="w-3.5 h-3.5 text-[#1A1305] shrink-0" />
                <span>Hương Vân Cái</span>
              </div>
            </div>
          </div>

          {/* Action: Light Incense or Prayer */}
          {!isLit ? (
            <button
              onClick={handleLightIncense}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] hover:brightness-105 text-[#1A1305] font-bold text-xs sm:text-sm tracking-wide shadow-[0_6px_24px_rgba(245,197,66,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <IncenseAltarIcon className="w-4 h-4 text-[#1A1305] shrink-0" />
              <span className="whitespace-nowrap truncate">Dâng Nén Tâm Hương &amp; Thỉnh Chuông</span>
            </button>
          ) : (
            <div className="w-full space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5C542]/20 text-[#FFD966] text-xs font-semibold border border-[#F5C542]/45 whitespace-nowrap">
                <LotusMinimalIcon className="w-3.5 h-3.5 text-[#FFD966] shrink-0" />
                <span>Giới hương • Định hương • Tuệ hương</span>
              </div>

              <form onSubmit={handlePray} className="space-y-2.5">
                <textarea
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  placeholder="Khởi tâm phát nguyện hoặc ghi lời hồi hướng công đức vào Sổ Công Đức..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-[#161005]/90 border border-[#F5C542]/35 text-[#FFFDF7] placeholder-[#9E8C66] text-xs focus:outline-none focus:border-[#FFD966]"
                />
                <button
                  type="submit"
                  disabled={!prayerText.trim() || isSubmitted}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] disabled:opacity-40 text-[#1A1305] font-bold text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-[#1A1305] shrink-0" />
                      <span>Đã ghi nhận vào Sổ Công Đức Dharma!</span>
                    </>
                  ) : (
                    <>
                      <LotusMinimalIcon className="w-4 h-4 text-[#1A1305] shrink-0" />
                      <span>Phát Nguyện &amp; Lưu Sổ Công Đức</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Counter info */}
          <div className="mt-4 pt-3 border-t border-[#F5C542]/20 w-full flex items-center justify-between gap-2 text-[11px] text-[#C7B68B] whitespace-nowrap">
            <span className="truncate">Tổng số lễ dâng tâm hương</span>
            <span className="font-mono font-bold text-[#FFD966] shrink-0">
              {totalOffered.toLocaleString('vi-VN')} lễ
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ==========================================
// 2. CHUỖI HẠT NIỆM PHẬT 108 HẠT (MALA BEADS)
// ==========================================
interface MalaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANT_OPTIONS = [
  { id: 'thichca', name: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật', short: 'Thích Ca Mâu Ni' },
  { id: 'adida', name: 'Nam Mô A Di Đà Phật', short: 'A Di Đà Phật' },
  { id: 'quanam', name: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát', short: 'Quán Thế Âm' },
  { id: 'duocsu', name: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật', short: 'Dược Sư Phật' },
  { id: 'diatang', name: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát', short: 'Địa Tạng Vương' },
];

export function MalaBeadsModal({ isOpen, onClose }: MalaModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedChant, setSelectedChant] = useState(CHANT_OPTIONS[0]);
  const [beadIndex, setBeadIndex] = useState(0);
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
    incrementDailyPractice('niem-phat', 1);
    const nextIdx = (beadIndex + 1) % 108;
    setBeadIndex(nextIdx);

    if (nextIdx === 0) {
      setRoundCount((prev) => prev + 1);
      playBellSound(0.6);
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('phatphap_dharma_merit_ledger');
          const list = raw ? JSON.parse(raw) : [];
          list.unshift({
            id: `merit-${Date.now()}`,
            type: 'Hoàn mãn 1 chuỗi 108 hạt',
            detail: selectedChant.name,
            timestamp: new Date().toLocaleDateString('vi-VN'),
          });
          localStorage.setItem('phatphap_dharma_merit_ledger', JSON.stringify(list.slice(0, 50)));
        } catch {}
      }
    }

    const nextTotal = totalCount + 1;
    setTotalCount(nextTotal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('phatphap_personal_chant_count', String(nextTotal));
    }
  };

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#2A1F0B] via-[#1F1708] to-[#161005] text-[#FFFDF7] rounded-t-[30px] sm:rounded-3xl border-t sm:border border-[#F5C542]/40 shadow-[0_-12px_50px_rgba(0,0,0,0.85)] animate-scale-in">
        {/* React Native Drag Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#F5C542]/35" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3.5 flex items-center justify-between gap-2 border-b border-[#F5C542]/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFE07D] to-[#E5A91C] flex items-center justify-center text-[#1A1305] shadow-md shrink-0">
              <MalaBeadsMinimalIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-serif font-bold text-sm sm:text-base text-[#FFD966] whitespace-nowrap truncate">
                Tràng Hạt Bồ Đề 108 Hạt
              </h3>
              <p className="text-[11px] text-[#D6C394] whitespace-nowrap truncate">
                Nhất tâm trì niệm • Diệt trừ 108 phiền não
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#C7B68B] hover:text-[#FFD966] hover:bg-[#F5C542]/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chant Selector Pills */}
        <div className="px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-2 bg-[#140F05]/60 border-b border-[#F5C542]/15">
          {CHANT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedChant(opt)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[11px] whitespace-nowrap font-semibold transition-all cursor-pointer',
                selectedChant.id === opt.id
                  ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#1A1305] font-bold shadow-sm'
                  : 'bg-[#251C0B] text-[#D6C394] hover:text-[#FFD966] border border-[#F5C542]/20'
              )}
            >
              {opt.short}
            </button>
          ))}
        </div>

        {/* Main Interactive Bead Area */}
        <div className="p-5 sm:p-6 flex flex-col items-center text-center select-none">
          <div className="text-[#F5C542] text-[10px] font-bold uppercase tracking-widest mb-1">
            Pháp Âm Trì Niệm
          </div>
          <div className="font-heading font-serif font-bold text-base sm:text-lg text-[#FFFDF7] min-h-[44px] flex items-center justify-center max-w-xs mb-2">
            {selectedChant.name}
          </div>

          <RealisticMalaWheel
            currentBead={beadIndex + 1}
            totalBeads={108}
            onAdvanceBead={handleNextBead}
            chantLabel={selectedChant.name}
          />

          <div className="text-xs text-[#FFD966] font-medium flex items-center gap-1.5 mt-3">
            <Volume2 className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Chạm vào tràng hạt để lần từng hạt &amp; định tâm</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-[#F5C542]/20 text-xs">
            <div className="p-3 rounded-2xl bg-[#251C0B] border border-[#F5C542]/20">
              <div className="text-[#C7B68B] text-[10px]">Số chuỗi viên mãn hôm nay</div>
              <div className="font-bold text-[#FFD966] text-sm mt-0.5">
                {roundCount} chuỗi (108 hạt)
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#251C0B] border border-[#F5C542]/20">
              <div className="text-[#C7B68B] text-[10px]">Tổng công đức trì niệm</div>
              <div className="font-bold text-[#FFD966] text-sm mt-0.5 font-mono">
                {totalCount.toLocaleString('vi-VN')} biến
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
