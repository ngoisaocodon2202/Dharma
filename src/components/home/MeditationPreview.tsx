'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Wind, Trees, CloudRain } from 'lucide-react';
import Link from 'next/link';

export function MeditationPreview() {
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundChoice, setSoundChoice] = useState<'BELL' | 'RAIN' | 'FOREST' | 'SILENCE'>('BELL');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
    setIsActive(false);
  }, [durationMinutes]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left: Info & Sound Selection */}
        <div className="space-y-4 max-w-xl text-center lg:text-left w-full">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-jade-700 dark:text-jade-400 bg-jade-50 dark:bg-jade-950/40 px-3 py-1 rounded-full border border-jade-200 dark:border-jade-800">
            Không Gian Tĩnh Lặng
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-100">
            Phòng Thiền Trực Tuyến
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
            Ngồi yên trong tư thế vững chãi, buông lỏng hai vai và theo dõi hơi thở tự nhiên. Dành ít phút tĩnh lặng để tái tạo nguồn năng lượng an vui.
          </p>

          {/* Duration selectors */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs text-charcoal-500 dark:text-charcoal-400 block font-medium">
              Chọn thời gian tọa thiền:
            </span>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto lg:mx-0">
              {[5, 10, 20, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDurationMinutes(d)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors text-center ${
                    durationMinutes === d
                      ? 'bg-saffron-500 text-white shadow-sm font-semibold'
                      : 'bg-ivory-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
                  }`}
                >
                  {d} phút
                </button>
              ))}
            </div>
          </div>

          {/* Sound Choice */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs text-charcoal-500 dark:text-charcoal-400 block font-medium">
              Âm thanh nền:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md w-full mx-auto lg:mx-0">
              <button
                onClick={() => setSoundChoice('BELL')}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap ${
                  soundChoice === 'BELL'
                    ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 font-semibold shadow-2xs'
                    : 'border-ivory-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300'
                }`}
                title="Chuông chùa"
              >
                <Bell className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Chuông</span>
              </button>
              <button
                onClick={() => setSoundChoice('RAIN')}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap ${
                  soundChoice === 'RAIN'
                    ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 font-semibold shadow-2xs'
                    : 'border-ivory-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300'
                }`}
                title="Mưa thiền"
              >
                <CloudRain className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Mưa</span>
              </button>
              <button
                onClick={() => setSoundChoice('FOREST')}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap ${
                  soundChoice === 'FOREST'
                    ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 font-semibold shadow-2xs'
                    : 'border-ivory-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300'
                }`}
                title="Rừng thiền"
              >
                <Trees className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Rừng</span>
              </button>
              <button
                onClick={() => setSoundChoice('SILENCE')}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap ${
                  soundChoice === 'SILENCE'
                    ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 font-semibold shadow-2xs'
                    : 'border-ivory-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300'
                }`}
                title="Tĩnh lặng thuần khiết"
              >
                <Wind className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Tĩnh lặng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Circular Timer Display */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-ivory-50 dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-700 w-full lg:w-auto min-w-0 sm:min-w-[280px] overflow-hidden">
          <div className="relative flex items-center justify-center">
            {/* Concentric Breathing Aura Ring */}
            {isActive && (
              <>
                <div className="absolute -inset-4 rounded-full border-2 border-saffron-400/30 dark:border-saffron-500/30 animate-breathe-ring pointer-events-none" />
                <div className="absolute -inset-8 rounded-full border border-saffron-400/15 dark:border-saffron-500/15 animate-breathe-ring delay-300 pointer-events-none" />
              </>
            )}

            <div className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ${
              isActive 
                ? 'border-saffron-500/80 bg-saffron-50/40 dark:bg-saffron-950/30 animate-breathe shadow-xl shadow-saffron-500/20' 
                : 'border-ivory-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800'
            }`}>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap">
                {mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}` : secs}
              </span>
              <span className="text-[10px] sm:text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-1 uppercase tracking-wider whitespace-nowrap">
                {isActive ? 'Thở vào... Thở ra...' : 'Sẵn sàng tọa thiền'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6 whitespace-nowrap">
            <button
              onClick={toggleTimer}
              className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" /> Tạm dừng
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 ml-0.5" /> Bắt đầu
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-colors hover:rotate-[-45deg]"
              title="Đặt lại"
              aria-label="Đặt lại thời gian"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/phong-thien"
            className="text-xs text-saffron-700 dark:text-saffron-400 hover:underline mt-4 font-medium whitespace-nowrap flex items-center gap-1"
          >
            Mở toàn màn hình phòng thiền →
          </Link>
        </div>
      </div>
    </div>
  );
}
