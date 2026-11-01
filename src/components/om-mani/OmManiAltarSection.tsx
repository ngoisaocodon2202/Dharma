'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Bell, Heart, Volume2, Sparkles, Share2, Check } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';

interface OmManiAltarSectionProps {
  onOpenIncense?: () => void;
  onOpenMala?: () => void;
}

export function OmManiAltarSection({ onOpenIncense, onOpenMala }: OmManiAltarSectionProps) {
  const [chantCount, setChantCount] = useState(528980);
  const [hasChantedToday, setHasChantedToday] = useState(false);
  const [altarView, setAltarView] = useState<'buddha' | 'quanam'>('buddha');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('om_mani_altar_chant_count');
      if (saved) setChantCount(Number(saved));
    }
  }, []);

  const handleQuickChant = () => {
    playWoodenFishSound(0.6);
    const nextCount = chantCount + 1;
    setChantCount(nextCount);
    setHasChantedToday(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('om_mani_altar_chant_count', String(nextCount));
    }
  };

  const handleRingBell = () => {
    playBellSound(0.5);
  };

  return (
    <section id="altar-section" className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
            Thành Tâm Niệm Phật
          </h3>
        </div>
        <button
          onClick={() => setAltarView(altarView === 'buddha' ? 'quanam' : 'buddha')}
          className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 text-[11px] font-semibold text-amber-800 dark:text-amber-300 transition-colors whitespace-nowrap"
        >
          {altarView === 'buddha' ? 'Đổi qua Quán Âm' : 'Đổi qua A Di Đà'}
        </button>
      </div>

      {/* Main Sacred Altar Card */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-stone-900 via-charcoal-900 to-stone-950 text-white shadow-xl">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-radial-at-t from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        {/* Top Status Bar: Count of prayers */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-stone-300">Đang có</span>
            <span className="font-mono font-bold text-amber-300">
              {chantCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-stone-300">hương linh nhờ cầu niệm</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-stone-400 text-[11px] whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Hồi Hướng Mười Phương</span>
          </div>
        </div>

        {/* Center Golden Buddha Altar Area */}
        <div className="relative px-4 sm:px-6 pt-5 pb-4 flex flex-col items-center text-center">
          {/* Buddha Statue in Golden Halo Frame */}
          <div className="relative w-52 h-64 sm:w-60 sm:h-72 my-1 flex items-center justify-center">
            {/* Glowing Aura Rings */}
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />
            <div className="absolute inset-3 rounded-full border border-amber-400/30 animate-spin" style={{ animationDuration: '30s' }} />

            {/* Sacred Image Portrait */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] bg-gradient-to-b from-amber-600/30 to-black/80">
              <img
                src={
                  altarView === 'buddha'
                    ? '/images/golden_buddha.jpg'
                    : '/images/quan_am_bodhisattva.jpg'
                }
                alt={altarView === 'buddha' ? 'Phật A Di Đà' : 'Quán Thế Âm Bồ Tát'}
                className="w-full h-full object-cover object-center"
              />

              {/* Bottom label on statue */}
              <div className="absolute bottom-0 inset-x-0 px-2 py-2 bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-transparent">
                <p className="text-xs font-heading font-bold text-amber-200 whitespace-nowrap">
                  {altarView === 'buddha'
                    ? 'Nam Mô A Di Đà Phật'
                    : 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát'}
                </p>
                <p className="text-[9.5px] sm:text-[10px] text-amber-300/80 font-sans whitespace-nowrap tracking-tight">
                  {altarView === 'buddha'
                    ? 'Tiếp dẫn đạo sư • Tây Phương Cực Lạc'
                    : 'Tầm thanh cứu khổ • Đại từ đại bi'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Chant Tapper Button */}
          <div className="w-full max-w-sm mt-3 space-y-2">
            <button
              onClick={handleQuickChant}
              className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-saffron-500 to-amber-600 hover:from-amber-400 hover:to-saffron-500 text-charcoal-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(245,158,11,0.35)] active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap group"
            >
              <Heart className="w-4 h-4 fill-charcoal-950 text-charcoal-950 group-hover:scale-125 transition-transform shrink-0" />
              <span className="whitespace-nowrap">Chạm 1 Lần Niệm Phật (+1 Câu)</span>
            </button>

            {/* Sub actions row */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                onClick={onOpenIncense}
                className="py-2.5 px-1 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-semibold text-[11px] sm:text-xs border border-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                <span className="whitespace-nowrap">Thắp Hương</span>
              </button>

              <button
                onClick={onOpenMala}
                className="py-2.5 px-1 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-semibold text-[11px] sm:text-xs border border-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">Chuỗi Hạt</span>
              </button>

              <button
                onClick={handleRingBell}
                className="py-2.5 px-1 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-semibold text-[11px] sm:text-xs border border-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">Gõ Chuông</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
