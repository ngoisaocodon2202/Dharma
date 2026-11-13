'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Button } from '@/components/ui/Button';
import { useAuth } from './AuthContext';

const SUGGESTED_DHARMA_NAMES = [
  'Tâm An',
  'Diệu Âm',
  'Vạn Hạnh',
  'Minh Đức',
  'Tịnh Tâm',
  'Thiện Pháp',
  'Huệ Quang',
  'Từ Hòa',
];

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dharmaName, setDharmaName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMounted(false);
      if (user) {
        setDharmaName(user.dharma_name || user.full_name || '');
        setGender(user.gender === 'Nữ' || user.gender === 'female' ? 'Nữ' : 'Nam');
      }
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
  }, [isAuthModalOpen, user]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = dharmaName.trim();
    if (!trimmed) {
      setErrorMessage('Xin đạo hữu vui lòng nhập Pháp Danh hoặc tên gọi.');
      return;
    }

    const userId = `phattu-${trimmed.toLowerCase().replace(/\s+/g, '-')}`;
    login({
      id: userId,
      email: '',
      role_id: 'PHAT_TU',
      full_name: trimmed,
      dharma_name: trimmed,
      gender,
    });
  };

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 w-screen h-[100dvh] z-[99999] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden transition-opacity duration-200 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Full-Screen Top Header */}
      <header className="px-4 sm:px-6 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0 shadow-xs">
        <button
          type="button"
          onClick={closeAuthModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] hover:border-[#8C5500] text-xs font-bold text-[#8C5500] cursor-pointer whitespace-nowrap shrink-0"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Quay lại</span>
        </button>

        <span className="text-sm sm:text-base font-heading font-bold text-[#2C1E10] truncate">
          Nhập Pháp Danh Đạo Hữu
        </span>

        <div className="w-20 shrink-0 hidden sm:block" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col">
        <div className="my-auto w-full max-w-lg mx-auto bg-[#FFFDF8] rounded-3xl shadow-sm border border-[#EAD7A7] p-5 sm:p-8 space-y-5">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-saffron-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-amber-50 flex items-center justify-center">
                <BuddhaBodhiIcon className="w-6 h-6 text-saffron-600" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-saffron-700 whitespace-nowrap">
              Quy Y Tam Bảo • Tỉnh Thức Mỗi Ngày
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900">
              Nhập Pháp Danh Đạo Hữu
            </h2>
            <p className="text-xs text-charcoal-500 leading-relaxed max-w-sm">
              Chỉ cần nhập Pháp danh (hoặc tên gọi) và giới tính để lưu sổ công phu, lịch ngày giỗ và xem màu bản mệnh.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 dharma-input-panel-lock">
            {errorMessage && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 rounded-xl border border-rose-200">
                {errorMessage}
              </div>
            )}

            {/* 1. Pháp Danh Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal-800 whitespace-nowrap">
                1. Pháp Danh (hoặc Tên gọi của bạn) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-saffron-600 pointer-events-none">
                  ☸
                </span>
                <input
                  type="text"
                  required
                  value={dharmaName}
                  onChange={(e) => setDharmaName(e.target.value)}
                  placeholder="Ví dụ: Tâm Nguyên, Diệu Âm..."
                  className="w-full pl-10 pr-4 py-3 text-base sm:text-sm bg-ivory-50 border border-ivory-300 rounded-xl text-charcoal-900 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-400/20 font-medium"
                />
              </div>

              {/* Quick Suggestions */}
              <div className="pt-1">
                <span className="text-[10px] text-charcoal-400 block mb-1.5">
                  Gợi ý Pháp danh cát tường (nếu chưa có):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_DHARMA_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setDharmaName(name)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        dharmaName === name
                          ? 'bg-saffron-600 text-white shadow-2xs'
                          : 'bg-ivory-100 text-charcoal-600 hover:bg-saffron-50 border border-ivory-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Giới Tính Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal-800 whitespace-nowrap">
                2. Giới Tính <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('Nam')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    gender === 'Nam'
                      ? 'bg-saffron-50 border-saffron-500 text-saffron-900 ring-2 ring-saffron-400/20'
                      : 'bg-ivory-50 border-ivory-200 text-charcoal-700 hover:border-saffron-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold whitespace-nowrap">Thiện Nam</div>
                    <div className="text-[10px] text-charcoal-500 whitespace-nowrap">
                      Nam Phật tử
                    </div>
                  </div>
                  {gender === 'Nam' && (
                    <div className="w-5 h-5 rounded-full bg-saffron-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('Nữ')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    gender === 'Nữ'
                      ? 'bg-saffron-50 border-saffron-500 text-saffron-900 ring-2 ring-saffron-400/20'
                      : 'bg-ivory-50 border-ivory-200 text-charcoal-700 hover:border-saffron-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold whitespace-nowrap">Tín Nữ</div>
                    <div className="text-[10px] text-charcoal-500 whitespace-nowrap">
                      Nữ Phật tử
                    </div>
                  </div>
                  {gender === 'Nữ' && (
                    <div className="w-5 h-5 rounded-full bg-saffron-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 mr-1.5 shrink-0" />
                <span>Xác Nhận &amp; Bắt Đầu Tu Học</span>
              </Button>
            </div>
          </form>

          {/* Footer Quote */}
          <div className="text-center pt-1">
            <span className="text-[11px] text-charcoal-400 italic">
              &ldquo;Nhất tâm quy y Phật, Pháp, Tăng&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
