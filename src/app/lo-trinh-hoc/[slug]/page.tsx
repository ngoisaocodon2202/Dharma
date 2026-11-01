import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Compass, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { LearningPathProgress } from '@/components/learn/LearningPathProgress';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await query('SELECT title, description FROM learning_paths WHERE slug = $1', [slug]);
  const p = res.rows[0];
  if (!p) return { title: 'Không tìm thấy — Phật Pháp' };
  return { title: `${p.title} — Phật Pháp`, description: p.description?.slice(0, 160) };
}

const LEVEL_LABELS: Record<string, { label: string; variant: 'jade' | 'saffron' | 'lotus' }> = {
  BEGINNER: { label: 'Nhập môn', variant: 'jade' },
  INTERMEDIATE: { label: 'Trung cấp', variant: 'saffron' },
  ADVANCED: { label: 'Chuyên sâu', variant: 'lotus' },
};

export default async function LearningPathDetailPage({ params }: Props) {
  const { slug } = await params;

  const pathRes = await query(
    'SELECT id, title, slug, description, level, estimated_hours, total_modules FROM learning_paths WHERE slug = $1',
    [slug]
  );
  const path = pathRes.rows[0];
  if (!path) notFound();

  const modulesRes = await query(
    `SELECT id, title, description, order_index, content, duration_minutes
     FROM learning_path_modules WHERE path_id = $1 ORDER BY order_index ASC`,
    [path.id]
  );
  const modules = modulesRes.rows;

  // Related paths
  const relatedRes = await query(
    `SELECT id, title, slug, level, estimated_hours, total_modules
     FROM learning_paths WHERE id != $1 ORDER BY sort_order ASC LIMIT 3`,
    [path.id]
  );
  const related = relatedRes.rows;

  const levelMeta = LEVEL_LABELS[path.level] || { label: path.level, variant: 'jade' as const };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400">
        <Link href="/" className="hover:text-saffron-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/lo-trinh-hoc" className="hover:text-saffron-600 transition-colors">Lộ trình học</Link>
        <span>/</span>
        <span className="text-charcoal-700 dark:text-charcoal-300 truncate max-w-[200px]">{path.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={levelMeta.variant}>{levelMeta.label}</Badge>
              <span className="text-xs text-charcoal-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {path.estimated_hours} giờ
              </span>
              <span className="text-xs text-charcoal-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> {path.total_modules} bài
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
              {path.title}
            </h1>
            <p className="text-base text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              {path.description}
            </p>
          </div>

          {/* Module List — client component handles progress state */}
          <LearningPathProgress pathSlug={slug} pathId={path.id} modules={modules} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-5 space-y-4 shadow-sm">
            <h3 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-100">
              Tổng quan lộ trình
            </h3>
            <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-400">
              <li className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-jade-500 flex-shrink-0" />
                Trình độ: {levelMeta.label}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                {path.estimated_hours} giờ học ước tính
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-lotus-500 flex-shrink-0" />
                {modules.length} bài giảng có nội dung
              </li>
            </ul>
          </div>

          {related.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-bold text-charcoal-700 dark:text-charcoal-300">
                Lộ trình khác
              </h3>
              <div className="space-y-2">
                {related.map((r: any) => {
                  const rm = LEVEL_LABELS[r.level] || { label: r.level, variant: 'jade' as const };
                  return (
                    <Link
                      key={r.id}
                      href={`/lo-trinh-hoc/${r.slug}`}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 hover:border-jade-400 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 group-hover:text-jade-600 transition-colors line-clamp-1">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-charcoal-400 mt-0.5">
                          {rm.label} · {r.estimated_hours}h
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-charcoal-300 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
