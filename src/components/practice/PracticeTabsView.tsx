'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Heart } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { DailyPracticeCard, DailyPracticeData } from '@/components/home/DailyPracticeCard';
import { DigitalMalaBeads } from './DigitalMalaBeads';
import { SadhanaTracker } from './SadhanaTracker';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PracticeTabsViewProps {
  todayPractice?: DailyPracticeData;
  pastPractices: DailyPracticeData[];
}

export function PracticeTabsView({ todayPractice, pastPractices }: PracticeTabsViewProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'mala' | 'sadhana'>('daily');

  return (
    <div className="space-y-8">
      {/* Tab Navigation Pill Bar — 3 equal single-line pills on mobile & desktop */}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 sm:inline-flex gap-1 p-1.5 rounded-2xl bg-ivory-200/80 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 shadow-xs w-full sm:w-auto max-w-md sm:max-w-none">
          <button
            onClick={() => setActiveTab('daily')}
            className={cn(
              'px-2 sm:px-5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer',
              activeTab === 'daily'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'text-charcoal-700 dark:text-charcoal-300 hover:text-saffron-600'
            )}
          >
            <BuddhaBodhiIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">Quán Chiếu</span>
          </button>

          <button
            onClick={() => setActiveTab('mala')}
            className={cn(
              'px-2 sm:px-5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer',
              activeTab === 'mala'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'text-charcoal-700 dark:text-charcoal-300 hover:text-saffron-600'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">Tràng Hạt</span>
          </button>

          <button
            onClick={() => setActiveTab('sadhana')}
            className={cn(
              'px-2 sm:px-5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer',
              activeTab === 'sadhana'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'text-charcoal-700 dark:text-charcoal-300 hover:text-saffron-600'
            )}
          >
            <span className="shrink-0">🪷</span>
            <span className="whitespace-nowrap">Vườn Sen</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Practice Content */}
      {activeTab === 'daily' && (
        <div className="space-y-8 animate-fade-in">
          {todayPractice ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Hôm nay — {formatDate(todayPractice.practice_date)}
              </p>
              <DailyPracticeCard practice={todayPractice} />
            </div>
          ) : (
            <div className="text-center py-12 text-charcoal-400 space-y-2">
              <BuddhaBodhiIcon className="w-12 h-12 mx-auto opacity-30 text-saffron-500" />
              <p className="text-sm">Chưa có bài thực hành cho ngày hôm nay.</p>
            </div>
          )}

          {pastPractices.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-saffron-500" /> Thực hành những ngày trước
              </h2>
              <div className="space-y-4">
                {pastPractices.map((practice) => (
                  <div key={practice.id} className="space-y-1">
                    <p className="text-xs text-charcoal-400 font-medium px-1">
                      {formatDate(practice.practice_date)}
                    </p>
                    <DailyPracticeCard practice={practice} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Tab 2: Digital Mala Beads */}
      {activeTab === 'mala' && (
        <div className="animate-fade-in">
          <DigitalMalaBeads />
        </div>
      )}

      {/* Tab 3: Sadhana Tracker & Lotus Garden */}
      {activeTab === 'sadhana' && (
        <div className="animate-fade-in">
          <SadhanaTracker />
        </div>
      )}
    </div>
  );
}

