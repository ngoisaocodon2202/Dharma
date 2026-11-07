'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, CheckCircle2, Award, Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayLog {
  date: string;
  meditationMinutes: number;
  beadCount: number;
  scripturePages: number;
  notes: string;
}

export function SadhanaTracker() {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [todayMeditation, setTodayMeditation] = useState(15);
  const [todayBeads, setTodayBeads] = useState(108);
  const [todayPages, setTodayPages] = useState(3);
  const [toast, setToast] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('phatphap_sadhana_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleSaveToday = (e: React.FormEvent) => {
    e.preventDefault();

    const existingIndex = logs.findIndex((l) => l.date === todayStr);
    const newLog: DayLog = {
      date: todayStr,
      meditationMinutes: Number(todayMeditation),
      beadCount: Number(todayBeads),
      scripturePages: Number(todayPages),
      notes: 'Hồi hướng công đức an lành cho muôn loài',
    };

    let updatedLogs: DayLog[];
    if (existingIndex >= 0) {
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs = [newLog, ...logs];
    }

    setLogs(updatedLogs);
    try {
      localStorage.setItem('phatphap_sadhana_logs', JSON.stringify(updatedLogs));
    } catch {}

    setToast('Đã lưu nhật ký tinh tấn hôm nay vào Vườn Sen Tâm Linh!');
    setTimeout(() => setToast(null), 3500);
  };

  // Total statistics
  const totalMeditation = logs.reduce((acc, curr) => acc + (curr.meditationMinutes || 0), 0);
  const totalBeads = logs.reduce((acc, curr) => acc + (curr.beadCount || 0), 0);
  const totalDays = logs.length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Vườn Sen Tâm Linh (Mindful Lotus Garden) */}
      <div className="bg-gradient-to-b from-[#24130A] via-[#1B0C06] to-[#140804] text-[#FDFBF7] rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFE082]" />
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FFE082]">
                Vườn Sen Tâm Linh
              </h3>
              <p className="text-xs text-stone-300">
                Mỗi ngày tinh tấn công phu là một đóa sen tươi thắm nở rộ
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#854D0E] text-white">
            {totalDays} ngày tinh tấn
          </span>
        </div>

        {/* Lotus Bloom Grid (Visualizing past 14 days) */}
        <div className="grid grid-cols-7 gap-2.5 py-2">
          {[...Array(14)].map((_, idx) => {
            const hasPractice = idx < totalDays;
            return (
              <div
                key={idx}
                className={cn(
                  'aspect-square rounded-2xl border flex flex-col items-center justify-center p-1 transition-all',
                  hasPractice
                    ? 'border-[#FFE082] bg-gradient-to-b from-amber-500/20 to-amber-900/40 shadow-sm'
                    : 'border-stone-800 bg-black/30 opacity-40'
                )}
                title={hasPractice ? `Ngày tinh tấn thứ ${idx + 1}` : 'Chưa có nhật ký'}
              >
                <span className="text-xl sm:text-2xl">{hasPractice ? '🪷' : '🌱'}</span>
                <span className="text-[9px] text-[#FFE082] mt-0.5">Ngày {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D4AF37]/30 text-center">
          <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
            <p className="text-[11px] text-stone-400">Tọa thiền</p>
            <p className="font-heading text-base sm:text-lg font-bold text-[#FFE082]">
              {totalMeditation} <span className="text-xs font-normal">phút</span>
            </p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
            <p className="text-[11px] text-stone-400">Niệm Phật</p>
            <p className="font-heading text-base sm:text-lg font-bold text-[#FFE082]">
              {totalBeads} <span className="text-xs font-normal">biến</span>
            </p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
            <p className="text-[11px] text-stone-400">Ngày tu tập</p>
            <p className="font-heading text-base sm:text-lg font-bold text-[#FFE082]">
              {totalDays} <span className="text-xs font-normal">ngày</span>
            </p>
          </div>
        </div>
      </div>

      {/* Record Today's Practice Form */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 border-b border-ivory-100 dark:border-charcoal-700 pb-3">
          <Calendar className="w-5 h-5 text-saffron-600" />
          <h4 className="font-heading font-bold text-base sm:text-lg text-charcoal-900 dark:text-ivory-100">
            Ghi Nhận Thời Khóa Hôm Nay
          </h4>
        </div>

        <form onSubmit={handleSaveToday} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1">
                Tọa thiền (phút):
              </label>
              <input
                type="number"
                min="0"
                value={todayMeditation}
                onChange={(e) => setTodayMeditation(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1">
                Niệm Phật (biến/hạt):
              </label>
              <input
                type="number"
                min="0"
                step="9"
                value={todayBeads}
                onChange={(e) => setTodayBeads(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1">
                Đọc kinh (trang):
              </label>
              <input
                type="number"
                min="0"
                value={todayPages}
                onChange={(e) => setTodayPages(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-ivory-50 dark:bg-charcoal-900 text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
              />
            </div>
          </div>

          {toast && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in">
              {toast}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-700 hover:to-saffron-800 text-white font-heading font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu Nhật Ký Công Phu Hôm Nay</span>
          </button>
        </form>
      </div>
    </div>
  );
}

