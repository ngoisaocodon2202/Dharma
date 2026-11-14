'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Volume2, Check } from 'lucide-react';
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
// 0. DHARMA MERIT LEDGER HELPERS (POSTGRESQL SYNCED)
// ==========================================
export interface DharmaMeritEntry {
  id: string;
  type: string;
  title: string;
  detail: string;
  meritPoints: number;
  timestamp: string;
}

let inMemoryMeritCache: DharmaMeritEntry[] = [];

export function getDharmaMeritLedger(): DharmaMeritEntry[] {
  return inMemoryMeritCache;
}

export function recordDharmaMerit(input: {
  type: string;
  title: string;
  detail: string;
  meritPoints?: number;
}): DharmaMeritEntry[] {
  const newEntry: DharmaMeritEntry = {
    id: `merit-${Date.now()}`,
    type: input.type,
    title: input.title,
    detail: input.detail,
    meritPoints: input.meritPoints ?? 15,
    timestamp: new Date().toLocaleDateString('vi-VN'),
  };
  inMemoryMeritCache = [newEntry, ...inMemoryMeritCache].slice(0, 80);

  if (typeof window !== 'undefined') {
    fetch('/api/dharma/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource: 'merits',
        merit: {
          id: newEntry.id,
          date_key: new Date().toISOString().slice(0, 10),
          tool_slug: input.type,
          title: input.title,
          detail: input.detail,
          dedication_target: 'Khắp pháp giới chúng sinh',
          duration_minutes: 5,
          count_value: input.meritPoints ?? 15,
        },
      }),
    }).catch(() => {});
  }

  return inMemoryMeritCache;
}

// ==========================================
// 1. DÂNG HƯƠNG TAM BẢO (FULL-SCREEN PAGE VIEW)
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
  const [totalOffered, setTotalOffered] = useState(108);

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

  if (!isOpen || !mounted) return null;

  const handleLightIncense = () => {
    setIsLit(true);
    playBellSound(0.5);
    incrementDailyPractice('lay-phat', 3);
    setTotalOffered((prev) => prev + 1);
    recordDharmaMerit({
      type: 'di-chua',
      title: 'Dâng Nén Tâm Hương Tam Bảo',
      detail: 'Thành tâm dâng hương Giới - Định - Tuệ cúng dường Chư Phật',
      meritPoints: 15,
    });
  };

  const handlePray = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText.trim()) return;
    setIsSubmitted(true);
    playBellSound(0.45);

    recordDharmaMerit({
      type: 'cau-an',
      title: 'Dâng Hương & Phát Nguyện',
      detail: prayerText.trim(),
      meritPoints: 20,
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setPrayerText('');
    }, 3000);
  };

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar Full-Screen with Back Button */}
      <header className="shrink-0 h-14 px-4 bg-[#FAF7F0] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Quay lại"
          className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] transition-colors shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="min-w-0 text-center flex-1">
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            Dâng Hương Cúng Dường Tam Bảo
          </h3>
        </div>

        <div className="w-20 shrink-0 text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[11px] font-bold text-[#8C5500] whitespace-nowrap">
            {totalOffered} lễ
          </span>
        </div>
      </header>

      {/* Full-Screen Scrollable Altar View */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center">
        <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
          <div
            className={cn(
              'absolute inset-0 rounded-full bg-[#FFE9A6] blur-xl transition-all duration-1000',
              isLit ? 'scale-125 opacity-100 animate-pulse' : 'scale-100 opacity-50'
            )}
          />

          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#D9A02E] p-1 bg-gradient-to-b from-[#FFFDF8] to-[#FFE79A] shadow-md">
            <img
              src="/images/buddhas/thich-ca.jpg"
              alt="Đức Phật Bổn Sư"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="text-sm text-[#8C5500] font-bold tracking-wide mb-1 whitespace-nowrap">
          Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
        </div>
        <p className="text-xs text-[#6B533B] max-w-sm leading-relaxed mb-6 font-serif italic">
          &ldquo;Nguyện đem lòng thành kính, gửi theo đám mây hương, phảng phất khắp mười phương, cúng dường ngôi Tam Bảo.&rdquo;
        </p>

        {/* Incense Burner (Lư Hương) & Sticks */}
        <div className="relative w-48 h-36 flex flex-col items-center justify-end mb-6">
          {isLit && (
            <div className="absolute top-0 flex gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-16 bg-gradient-to-t from-[#D9A02E]/70 via-[#EAD7A7]/40 to-transparent rounded-full blur-[1px] animate-pulse"
                  style={{
                    animationDuration: `${1.8 + i * 0.4}s`,
                    transform: `rotate(${i === 0 ? -6 : i === 2 ? 6 : 0}deg) translateY(-8px)`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 items-end mb-1 z-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-500',
                    isLit
                      ? 'bg-[#FF6B00] shadow-[0_0_12px_#FF9500] animate-pulse scale-125'
                      : 'bg-[#8A6826]'
                  )}
                />
                <div className="w-[3px] h-16 bg-gradient-to-b from-[#C89628] via-[#8F6818] to-[#573E0B] rounded-xs" />
              </div>
            ))}
          </div>

          <div className="relative w-40 h-14 bg-gradient-to-r from-[#B8871D] via-[#F5C542] to-[#B8871D] rounded-b-3xl rounded-t-lg border-t-2 border-[#FFF0A8] shadow-md flex items-center justify-center">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#3D2505] flex items-center gap-1.5 whitespace-nowrap">
              <DharmaWheelIcon className="w-3.5 h-3.5 text-[#3D2505] shrink-0" />
              <span>Hương Vân Cái</span>
            </div>
          </div>
        </div>

        {!isLit ? (
          <button
            type="button"
            onClick={handleLightIncense}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <IncenseAltarIcon className="w-4 h-4 text-[#3D2505] shrink-0" />
            <span className="whitespace-nowrap truncate">Dâng Nén Tâm Hương &amp; Thỉnh Chuông</span>
          </button>
        ) : (
          <div className="w-full space-y-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#EAD7A7] shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF6DF] text-[#8C5500] text-xs font-semibold border border-[#EAD7A7] whitespace-nowrap">
              <LotusMinimalIcon className="w-3.5 h-3.5 text-[#8C5500] shrink-0" />
              <span>Giới hương • Định hương • Tuệ hương</span>
            </div>

            <form onSubmit={handlePray} className="space-y-2.5">
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Khởi tâm phát nguyện hoặc ghi lời hồi hướng công đức vào Sổ Công Đức..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] text-xs focus:outline-none focus:border-[#C68B19]"
              />
              <button
                type="submit"
                disabled={!prayerText.trim() || isSubmitted}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] disabled:opacity-40 text-[#3D2505] font-bold text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-[#3D2505] shrink-0" />
                    <span>Đã lưu vào Sổ Công Đức DHARMA!</span>
                  </>
                ) : (
                  <>
                    <LotusMinimalIcon className="w-4 h-4 text-[#3D2505] shrink-0" />
                    <span>Phát Nguyện &amp; Lưu Sổ Công Đức</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ==========================================
// 2. CHUỖI HẠT NIỆM PHẬT 108 HẠT (FULL-SCREEN PAGE VIEW)
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
  const [totalCount, setTotalCount] = useState(108);

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

  if (!isOpen || !mounted) return null;

  const handleNextBead = () => {
    playWoodenFishSound(0.6);
    incrementDailyPractice('niem-phat', 1);
    const nextIdx = (beadIndex + 1) % 108;
    setBeadIndex(nextIdx);

    if (nextIdx === 0) {
      setRoundCount((prev) => prev + 1);
      playBellSound(0.6);
      recordDharmaMerit({
        type: 'trang-hat',
        title: 'Hoàn mãn 1 chuỗi 108 hạt Bồ Đề',
        detail: selectedChant.name,
        meritPoints: 108,
      });
    }

    setTotalCount((prev) => prev + 1);
  };

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar Full-Screen with Back Button */}
      <header className="shrink-0 h-14 px-4 bg-[#FAF7F0] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Quay lại"
          className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] transition-colors shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="min-w-0 text-center flex-1">
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            Tràng Hạt Bồ Đề 108 Hạt
          </h3>
        </div>

        <div className="w-20 shrink-0 text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[11px] font-bold text-[#8C5500] whitespace-nowrap">
            {beadIndex + 1}/108
          </span>
        </div>
      </header>

      {/* Chant Selector Pills */}
      <div className="shrink-0 px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-2 bg-[#FFF9EB] border-b border-[#EAD7A7]">
        {CHANT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelectedChant(opt)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-bold transition-all cursor-pointer shrink-0',
              selectedChant.id === opt.id
                ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] shadow-xs'
                : 'bg-[#FFFFFF] text-[#6B533B] hover:text-[#8C5500] border border-[#EAD7A7]'
            )}
          >
            {opt.short}
          </button>
        ))}
      </div>

      {/* Main Interactive Bead Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center select-none">
        <div className="text-[#8C5500] text-[11px] font-bold uppercase tracking-widest mb-1 whitespace-nowrap">
          Pháp Âm Trì Niệm
        </div>
        <div className="font-serif font-bold text-base sm:text-lg text-[#2C1E10] mb-3 px-2">
          {selectedChant.name}
        </div>

        <RealisticMalaWheel
          currentBead={beadIndex + 1}
          totalBeads={108}
          onAdvanceBead={handleNextBead}
          chantLabel={selectedChant.name}
        />

        <div className="text-xs text-[#8C5500] font-medium flex items-center gap-1.5 mt-3 whitespace-nowrap">
          <Volume2 className="w-3.5 h-3.5 text-[#8C5500] shrink-0" />
          <span>Chạm vào tràng hạt để lần từng hạt &amp; định tâm</span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-[#EAD7A7] text-xs">
          <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-2xs">
            <div className="text-[#6B533B] text-[11px] whitespace-nowrap truncate">Chuỗi viên mãn hôm nay</div>
            <div className="font-bold text-[#8C5500] text-sm mt-0.5 whitespace-nowrap">
              {roundCount} chuỗi (108 hạt)
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-2xs">
            <div className="text-[#6B533B] text-[11px] whitespace-nowrap truncate">Tổng công đức trì niệm</div>
            <div className="font-bold text-[#8C5500] text-sm mt-0.5 font-mono whitespace-nowrap">
              {totalCount.toLocaleString('vi-VN')} biến
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
