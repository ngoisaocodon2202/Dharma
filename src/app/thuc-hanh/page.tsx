import React from 'react';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { DailyPracticeCard, DailyPracticeData } from '@/components/home/DailyPracticeCard';
import { Calendar } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider">
          <BuddhaBodhiIcon className="w-4 h-4 text-saffron-600 dark:text-saffron-400 animate-pulse-glow" />
          <span>Nuôi Dưỡng Chánh Niệm</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
          Thực Hành Hôm Nay
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto leading-relaxed">
          Mỗi ngày là một cơ hội để sống tỉnh thức. Không có áp lực, không thi đua thành tích, chỉ có sự quan sát thân tâm trong an lành.
        </p>
      </div>

      {/* Today's practice */}
      {todayPractice ? (
        <div className="space-y-2 animate-fade-in delay-100">
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

      {/* Past practices */}
      {pastPractices.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-saffron-500" /> Thực hành những ngày trước
          </h2>
          <div className="space-y-4">
            {pastPractices.map(practice => (
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
  );
}
