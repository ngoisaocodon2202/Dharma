'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { AudioPlayButton } from './AudioPlayButton';
import { useAuth } from '@/components/auth/AuthContext';

export interface DailyPracticeData {
  id: string;
  practice_date: string;
  mindful_quote: string;
  quote_source?: string;
  reflection_text: string;
  mindful_action: string;
  audio_title?: string;
  audio_url?: string;
  duration_seconds?: number;
}

export function DailyPracticeCard({ practice }: { practice: DailyPracticeData }) {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // On mount: check server (if logged in) or localStorage (guest)
  useEffect(() => {
    if (user) {
      fetch('/api/practice/history')
        .then(r => r.json())
        .then(d => {
          if ((d.completedIds || []).includes(practice.id)) setIsCompleted(true);
        })
        .catch(() => {});
    } else {
      const saved = localStorage.getItem(`daily_practice_${practice.id}`);
      if (saved === 'true') setIsCompleted(true);
    }
  }, [practice.id, user]);

  const toggleComplete = async () => {
    const next = !isCompleted;
    setIsCompleted(next);

    if (user) {
      setIsSaving(true);
      try {
        await fetch('/api/practice/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ practice_id: practice.id }),
        });
      } catch {}
      setIsSaving(false);
    } else {
      localStorage.setItem(`daily_practice_${practice.id}`, String(next));
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-ivory-50 to-saffron-50/40 dark:from-charcoal-800 dark:via-charcoal-800 dark:to-charcoal-900 rounded-2xl border border-saffron-200/80 dark:border-charcoal-700 p-4 sm:p-6 md:p-8 shadow-sm hover-lift">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-ivory-200 dark:border-charcoal-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-saffron-100 dark:bg-saffron-900/50 flex items-center justify-center text-saffron-700 dark:text-saffron-300 flex-shrink-0">
            <BuddhaBodhiIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
              Thực Hành Hôm Nay
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-500 dark:text-charcoal-400">
              Mỗi ngày một hạt mầm tỉnh thức gieo vào tâm trí
            </p>
          </div>
        </div>

        <button
          onClick={toggleComplete}
          disabled={isSaving}
          className={`flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all cursor-pointer disabled:opacity-60 min-h-[42px] ${
            isCompleted
              ? 'bg-jade-100 dark:bg-jade-900/40 text-jade-700 dark:text-jade-300 border border-jade-300 dark:border-jade-800'
              : 'bg-ivory-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-600 hover:border-saffron-400'
          }`}
        >
          {isCompleted ? (
            <><CheckCircle2 className="w-4 h-4 text-jade-600 dark:text-jade-400 flex-shrink-0" /> Đã hoàn thành</>
          ) : (
            <><Circle className="w-4 h-4 text-charcoal-400 flex-shrink-0" /> Đánh dấu hoàn thành</>
          )}
        </button>
      </div>

      <div className="py-4 sm:py-6">
        <blockquote className="font-heading text-base sm:text-lg md:text-xl font-medium text-charcoal-900 dark:text-charcoal-100 leading-relaxed italic">
          &ldquo;{practice.mindful_quote}&rdquo;
        </blockquote>
        {practice.quote_source && (
          <p className="text-xs text-saffron-700 dark:text-saffron-400 font-medium mt-1.5">
            — {practice.quote_source}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-ivory-200 dark:border-charcoal-700">
        <div>
          <h4 className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-1.5 sm:mb-2">
            Chiêm nghiệm sâu
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            {practice.reflection_text}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-charcoal-700/50 rounded-xl p-3.5 sm:p-4 border border-ivory-200 dark:border-charcoal-600/60">
          <h4 className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider mb-1.5">
            Bài thực hành nhỏ
          </h4>
          <p className="text-xs sm:text-sm font-medium text-charcoal-800 dark:text-charcoal-200 leading-snug">
            {practice.mindful_action}
          </p>

          {practice.audio_url && (
            <div className="mt-3.5 pt-3 border-t border-ivory-100 dark:border-charcoal-600 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] text-charcoal-500 block">Âm thanh trợ niệm:</span>
                <span className="text-xs font-medium text-charcoal-800 dark:text-charcoal-200 truncate block">
                  {practice.audio_title || 'Thời thiền ngắn'}
                </span>
              </div>
              <AudioPlayButton
                size="sm"
                track={{
                  id: practice.id,
                  title: practice.audio_title || 'Thời thiền ngắn',
                  speaker: 'Phật Pháp Platform',
                  audio_url: practice.audio_url,
                  duration_seconds: practice.duration_seconds || 300,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="mt-4 p-2.5 bg-jade-50 dark:bg-jade-950/30 text-jade-800 dark:text-jade-300 rounded-lg text-xs text-center border border-jade-200 dark:border-jade-900/50">
          ✦ Tùy hỷ công đức tu tập chánh niệm của quý đạo hữu trong ngày hôm nay!
        </div>
      )}
    </div>
  );
}
