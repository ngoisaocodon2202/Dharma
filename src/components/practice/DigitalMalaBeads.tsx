'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, VolumeX, CheckCircle, Award } from 'lucide-react';
import { playWoodenFishSound, playBellSound } from '@/lib/buddhistSounds';
import { incrementDailyPractice } from '@/lib/dailyPracticeProgress';
import { RealisticMalaWheel } from '@/components/dharma/RealisticMalaWheel';
import { cn } from '@/lib/utils';

interface DigitalMalaProps {
  onSessionComplete?: (count: number, mantra: string) => void;
}

const MANTRAS = [
  { id: 'adida', name: 'Nam Mô A Di Đà Phật', short: 'A Di Đà Phật' },
  { id: 'quanam', name: 'Nam Mô Quán Thế Âm Bồ Tát', short: 'Quán Thế Âm' },
  { id: 'thichca', name: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật', short: 'Thích Ca Mâu Ni' },
  { id: 'duocsu', name: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật', short: 'Phật Dược Sư' },
  { id: 'luctu', name: 'Án Ma Ni Bát Mê Hồng (Om Mani Padme Hum)', short: 'Lục Tự Đại Minh' },
];

const BEAD_SIZES = [
  { size: 18, label: 'Chuỗi 18 hạt (Tiểu chuỗi)' },
  { size: 27, label: 'Chuỗi 27 hạt' },
  { size: 108, label: 'Chuỗi 108 hạt (Đại chuỗi chuẩn)' },
];

export function DigitalMalaBeads({ onSessionComplete }: DigitalMalaProps) {
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0].id);
  const [beadSize, setBeadSize] = useState(108);
  const [currentBead, setCurrentBead] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // Load saved beads history
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('phatphap_mala_total_count');
      if (savedCount) {
        // total logged
      }
    } catch {}
  }, []);

  const triggerBeadAdvance = () => {
    // Haptic vibration feedback
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(22);
      } catch {}
    }

    // Sound feedback
    if (soundEnabled) {
      playWoodenFishSound(0.35);
    }

    incrementDailyPractice(selectedMantra === 'luctu' ? 'tri-chu' : 'niem-phat', 1);

    setCurrentBead((prev) => {
      const next = prev + 1;
      if (next >= beadSize) {
        // Completed 1 full round of beads
        setCompletedRounds((r) => r + 1);
        if (soundEnabled) {
          playBellSound(0.5);
        }
        setToastFeedback(`Hoàn thành 1 chuỗi ${beadSize} biến niệm danh hiệu!`);
        setTimeout(() => setToastFeedback(null), 3500);

        // Save to LocalStorage Sadhana Log
        try {
          const today = new Date().toISOString().split('T')[0];
          const key = `sadhana_beads_${today}`;
          const current = parseInt(localStorage.getItem(key) || '0', 10);
          localStorage.setItem(key, String(current + beadSize));
        } catch {}

        if (onSessionComplete) {
          onSessionComplete(beadSize, selectedMantra);
        }

        return 0;
      }
      return next;
    });
  };

  const resetCounter = () => {
    setCurrentBead(0);
    setCompletedRounds(0);
  };

  const mantraObj = MANTRAS.find((m) => m.id === selectedMantra) || MANTRAS[0];

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF8] to-[#FFF9EB] text-[#2C1E10] rounded-3xl border border-[#DFC27D] shadow-md p-5 sm:p-7 space-y-6 select-none">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#EAD7A7] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8C5500]" />
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#2C1E10]">
              Tràng Hạt Số &amp; Niệm Phật
            </h3>
            <p className="text-xs text-[#6B533B]">
              Chạm hoặc vuốt để lần hạt • Phản hồi rung haptic an tịnh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-2 rounded-xl border transition-all text-xs font-bold active:scale-95',
              soundEnabled
                ? 'bg-[#FFF6DF] border-[#C68B19] text-[#8C5500]'
                : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
            )}
            title={soundEnabled ? 'Đang bật tiếng mõ' : 'Đang tắt tiếng mõ'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={resetCounter}
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#6B533B] hover:text-[#2C1E10] active:scale-95 transition-all"
            title="Đặt lại bộ đếm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Select Mantra & Bead Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#8C5500] mb-1">
            Danh Hiệu Niệm:
          </label>
          <select
            value={selectedMantra}
            onChange={(e) => setSelectedMantra(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#2C1E10] focus:outline-none focus:ring-1 focus:ring-[#C68B19]"
          >
            {MANTRAS.map((m) => (
              <option key={m.id} value={m.id} className="bg-white text-[#2E1E0F]">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8C5500] mb-1">
            Loại Tràng Hạt:
          </label>
          <select
            value={beadSize}
            onChange={(e) => {
              setBeadSize(Number(e.target.value));
              setCurrentBead(0);
            }}
            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#DFC27D] text-xs sm:text-sm font-bold text-[#2C1E10] focus:outline-none focus:ring-1 focus:ring-[#C68B19]"
          >
            {BEAD_SIZES.map((b) => (
              <option key={b.size} value={b.size} className="bg-white text-[#2E1E0F]">
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN 3D WOODEN MALA BEADS INTERACTION */}
      <div className="py-2 flex flex-col items-center">
        <RealisticMalaWheel
          currentBead={currentBead === 0 ? 1 : currentBead}
          totalBeads={beadSize}
          onAdvanceBead={triggerBeadAdvance}
          chantLabel={mantraObj.name}
        />

        <p className="text-xs text-[#6B533B] font-semibold mt-3 text-center">
          {completedRounds > 0 ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> Đã xong {completedRounds} chuỗi ({completedRounds * beadSize} biến)
            </span>
          ) : (
            'Chạm vào tràng hạt để lần từng hạt & gõ mõ'
          )}
        </p>
      </div>

      {/* Toast Feedback */}
      {toastFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-center text-emerald-800 text-xs sm:text-sm font-bold animate-fade-in">
          {toastFeedback}
        </div>
      )}

      {/* Bottom Summary & Pro-Tip */}
      <div className="pt-2 border-t border-[#EAD7A7] flex items-center justify-between text-xs text-[#6B533B]">
        <span className="flex items-center gap-1">
          <Award className="w-4 h-4 text-[#8C5500]" />
          <span>Tổng số biến niệm: <strong className="text-[#2C1E10]">{completedRounds * beadSize + currentBead}</strong></span>
        </span>
        <span className="italic text-[11px] font-semibold text-[#8C5500]">
          Tâm tịnh chí thành, vạn đức viên mãn
        </span>
      </div>
    </div>
  );
}

