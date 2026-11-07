'use client';

import React from 'react';
import { useMindfulness } from './MindfulnessContext';
import { Bell, Eye, X, Sparkles, Volume2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MindfulnessModal() {
  const {
    seniorMode,
    toggleSeniorMode,
    bellIntervalMinutes,
    setBellIntervalMinutes,
    triggerManualBell,
    isMindfulnessModalOpen,
    setIsMindfulnessModalOpen,
  } = useMindfulness();

  if (!isMindfulnessModalOpen) return null;

  const INTERVALS = [
    { value: 0, label: 'Tắt chuông' },
    { value: 15, label: 'Mỗi 15 phút' },
    { value: 30, label: 'Mỗi 30 phút' },
    { value: 45, label: 'Mỗi 45 phút' },
    { value: 60, label: 'Mỗi 1 tiếng' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FDF8EC] dark:bg-charcoal-900 text-[#2A1810] dark:text-ivory-100 rounded-3xl border-2 border-[#D4AF37] shadow-2xl p-5 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#B45309] dark:text-[#FFE082]">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#854D0E] dark:text-[#FFE082]">
                Chánh Niệm &amp; Trợ Năng
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Nuôi dưỡng sự tĩnh lặng &amp; tối ưu hiển thị cho mắt
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMindfulnessModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section 1: Chuông Chánh Niệm Định Kỳ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#78350F] dark:text-[#FDE68A] flex items-center gap-1.5">
                  <span>🔔 Chuông Chánh Niệm Định Kỳ</span>
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Phát tiếng chuông ngân nhắc nhở dừng lại và thở an tịnh
                </p>
              </div>

              <button
                onClick={triggerManualBell}
                className="px-3 py-1.5 rounded-xl bg-[#854D0E] hover:bg-[#A16207] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-sm shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Thử chuông</span>
              </button>
            </div>

            {/* Interval Selection Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERVALS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setBellIntervalMinutes(item.value)}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all active:scale-95',
                    bellIntervalMinutes === item.value
                      ? 'bg-[#854D0E] text-white border-[#713F12] shadow-sm'
                      : 'bg-white dark:bg-charcoal-800 text-[#78350F] dark:text-ivory-200 border-[#D4AF37]/40 hover:bg-amber-50'
                  )}
                >
                  <span>{item.label}</span>
                  {bellIntervalMinutes === item.value && <Check className="w-4 h-4 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Chế Độ Chữ Lớn Cho Người Cao Tuổi */}
          <div className="space-y-2 pt-3 border-t border-[#D4AF37]/25">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#78350F] dark:text-[#FDE68A] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#B45309] dark:text-[#FFE082]" />
                  <span>Chế Độ Chữ Lớn (Cho Người Lớn Tuổi)</span>
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Tự động phóng to phông chữ toàn trang, tăng tương phản sắc nét
                </p>
              </div>

              <button
                onClick={toggleSeniorMode}
                className={cn(
                  'w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 focus:outline-none shadow-inner',
                  seniorMode ? 'bg-[#854D0E]' : 'bg-stone-300 dark:bg-charcoal-700'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-black text-[#854D0E]',
                    seniorMode ? 'translate-x-6' : 'translate-x-0'
                  )}
                >
                  {seniorMode ? 'A+' : 'A'}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#D4AF37]/25 flex items-center justify-end">
          <button
            onClick={() => setIsMindfulnessModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#B45309] to-[#78350F] text-white font-bold text-sm shadow-md active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

