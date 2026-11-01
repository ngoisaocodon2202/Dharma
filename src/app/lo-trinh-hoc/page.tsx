import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Compass, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LearningPathsPage() {
  const res = await query(
    'SELECT id, title, slug, description, level, estimated_hours, total_modules, sort_order FROM learning_paths ORDER BY sort_order ASC'
  );
  const paths = res.rows;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-jade-700 dark:text-jade-400 font-semibold uppercase tracking-wider">
          <Compass className="w-4 h-4 animate-pulse-glow flex-shrink-0" />
          <span>Học Phật có Hệ thống</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
          Lộ Trình Học Phật
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed">
          Năm tuyến học tập tuần tự từ căn bản đến nâng cao, giúp người học Phật nắm vững giáo lý, phương pháp thực hành chánh niệm và ứng dụng từ bi vào cuộc sống.
        </p>
      </div>

      {/* Paths List */}
      <div className="space-y-6 animate-fade-in delay-100">
        {paths.map((path: any, index: number) => (
          <div
            key={path.id}
            className="p-5 sm:p-6 bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 shadow-sm hover-lift group"
          >
            <div className="flex items-start gap-4">
              {/* Step number */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-jade-50 dark:bg-jade-950/40 border border-jade-200 dark:border-jade-800 flex items-center justify-center font-heading font-bold text-jade-700 dark:text-jade-300 text-base sm:text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                0{index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-jade-100 dark:bg-jade-900/40 text-jade-800 dark:text-jade-300 rounded font-semibold">
                    {path.level === 'BEGINNER' ? 'Nhập môn' : path.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Chuyên sâu'}
                  </span>
                  <span className="text-xs text-charcoal-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {path.estimated_hours}h
                  </span>
                  <span className="text-xs text-charcoal-400">{path.total_modules} bài</span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900 dark:text-charcoal-100 group-hover:text-jade-600 transition-colors leading-snug">
                  {path.title}
                </h3>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-2">
                  {path.description}
                </p>

                {/* CTA row */}
                <div className="pt-1">
                  <Link
                    href={`/lo-trinh-hoc/${path.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-jade-600 to-jade-700 text-white hover:from-jade-700 hover:to-jade-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Bắt đầu tuyến này
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
