'use client';

import React from 'react';
import { useMindfulness } from './MindfulnessContext';
import { ArrowLeft, Bell, Eye, Volume2, Check } from 'lucide-react';
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
    <div className="fixed inset-0 w-screen h-[100dvh] z-[99999] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in">
      {/* Full-Screen Sticky Header */}
      <header className="px-4 sm:px-6 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMindfulnessModalOpen(false)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] hover:border-[#8C5500] text-xs font-bold text-[#8C5500] cursor-pointer whitespace-nowrap shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Quay lại</span>
        </button>

        <div className="min-w-0 flex-1 text-center">
          <h3 className="font-heading text-base sm:text-lg font-bold text-[#854D0E] truncate">
            Chánh Niệm &amp; Trợ Năng
          </h3>
          <p className="text-[11px] text-[#6B533B] truncate">
            Nuôi dưỡng sự tĩnh lặng &amp; tối ưu hiển thị cho mắt
          </p>
        </div>

        <div className="w-20 shrink-0 hidden sm:block" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto w-full bg-[#FFFDF8] border border-[#EAD7A7] rounded-3xl p-5 sm:p-7 space-y-6 shadow-xs">
          {/* Section 1: Chuông Chánh Niệm Định Kỳ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#78350F] flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>Chuông Chánh Niệm Định Kỳ</span>
                </h4>
                <p className="text-xs text-[#6B533B] mt-0.5">
                  Phát tiếng chuông ngân nhắc nhở dừng lại và thở an tịnh
                </p>
              </div>

              <button
                type="button"
                onClick={triggerManualBell}
                className="px-3.5 py-2 rounded-xl bg-[#854D0E] hover:bg-[#A16207] text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>Thử chuông</span>
              </button>
            </div>

            {/* Interval Selection Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERVALS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setBellIntervalMinutes(item.value)}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all active:scale-95 whitespace-nowrap cursor-pointer',
                    bellIntervalMinutes === item.value
                      ? 'bg-[#854D0E] text-white border-[#713F12] shadow-sm'
                      : 'bg-white text-[#78350F] border-[#D4AF37]/40 hover:bg-amber-50'
                  )}
                >
                  <span>{item.label}</span>
                  {bellIntervalMinutes === item.value && <Check className="w-4 h-4 ml-1 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Chế Độ Chữ Lớn Cho Người Cao Tuổi */}
          <div className="space-y-2 pt-4 border-t border-[#D4AF37]/25">
            <div className="flex items-center justify-between gap-3">
              <div className="pr-3 min-w-0">
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#78350F] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>Chế Độ Chữ Lớn (Cho Người Lớn Tuổi)</span>
                </h4>
                <p className="text-xs text-[#6B533B] mt-0.5">
                  Tự động phóng to phông chữ toàn trang, tăng tương phản sắc nét
                </p>
              </div>

              <button
                type="button"
                onClick={toggleSeniorMode}
                className={cn(
                  'w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 focus:outline-none shadow-inner cursor-pointer',
                  seniorMode ? 'bg-[#854D0E]' : 'bg-stone-300'
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
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-3.5 bg-[#FFFDF8] border-t border-[#EAD7A7] shrink-0">
        <div className="max-w-2xl mx-auto flex justify-end">
          <button
            type="button"
            onClick={() => setIsMindfulnessModalOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B45309] to-[#78350F] text-white font-bold text-sm shadow-md active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </footer>
    </div>
  );
}

