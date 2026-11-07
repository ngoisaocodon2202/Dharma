import React from 'react';
import { query } from '@/lib/db';
import { DailyPracticeData } from '@/components/home/DailyPracticeCard';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { PracticeTabsView } from '@/components/practice/PracticeTabsView';

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const res = await query(`
    SELECT dp.id, dp.practice_date, dp.mindful_quote, dp.quote_source,
           dp.reflection_text, dp.mindful_action,
           a.id as audio_id, a.title as audio_title, a.audio_url, a.duration_seconds
    FROM daily_practices dp
    LEFT JOIN audio a ON dp.audio_id = a.id
    ORDER BY dp.practice_date DESC LIMIT 7
  `);

  const practices = res.rows as DailyPracticeData[];
  const todayPractice = practices[0];
  const pastPractices = practices.slice(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider">
          <BuddhaBodhiIcon className="w-4 h-4 text-saffron-600 dark:text-saffron-400 animate-pulse-glow" />
          <span>Nuôi Dưỡng Chánh Niệm &amp; Công Phu</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
          Không Gian Tu Học &amp; Tinh Tấn
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto leading-relaxed">
          Mỗi ngày là một cơ hội để sống tỉnh thức. Tọa thiền an tịnh, lần tràng hạt niệm Phật, và tưới tẩm đóa sen thiện lành trong tâm hồn.
        </p>
      </div>

      {/* Tabs View */}
      <PracticeTabsView todayPractice={todayPractice} pastPractices={pastPractices} />
    </div>
  );
}
