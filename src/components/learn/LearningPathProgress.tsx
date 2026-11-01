'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';

interface Module {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  content?: string;
  duration_minutes: number;
}

interface Props {
  pathSlug: string;
  pathId: string;
  modules: Module[];
}

export function LearningPathProgress({ pathSlug, modules }: Props) {
  const { user, openAuthModal } = useAuth();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    fetch(`/api/learning-paths/${pathSlug}/progress`)
      .then(r => r.json())
      .then(d => {
        setEnrolledAt(d.enrolledAt || null);
        setCompletedIds(new Set(d.completedModuleIds || []));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user, pathSlug]);

  const handleEnroll = async () => {
    if (!user) { openAuthModal(); return; }
    const res = await fetch(`/api/learning-paths/${pathSlug}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) setEnrolledAt(new Date().toISOString());
  };

  const toggleModule = async (moduleId: string) => {
    if (!user) { openAuthModal(); return; }
    if (!enrolledAt) await handleEnroll();

    setSavingId(moduleId);
    try {
      const res = await fetch(`/api/learning-paths/${pathSlug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: moduleId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedIds(prev => {
          const next = new Set(prev);
          if (data.completed) next.add(moduleId);
          else next.delete(moduleId);
          return next;
        });
      }
    } catch {}
    setSavingId(null);
  };

  const completedCount = completedIds.size;
  const progressPct = modules.length > 0
    ? Math.round((completedCount / modules.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      {enrolledAt && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <span>Tiến độ học tập</span>
            <span className="font-semibold text-jade-600 dark:text-jade-400">{completedCount}/{modules.length} bài ({progressPct}%)</span>
          </div>
          <div className="h-2 bg-ivory-200 dark:bg-charcoal-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-jade-500 to-jade-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-xs text-jade-600 dark:text-jade-400 text-center py-1">
              ✦ Tùy hỷ! Quý đạo hữu đã hoàn thành lộ trình học này.
            </p>
          )}
        </div>
      )}

      {/* Enroll CTA */}
      {!enrolledAt && !isLoading && (
        <div className="rounded-xl border border-jade-200 dark:border-jade-800 bg-gradient-to-r from-jade-50 to-jade-50/50 dark:from-jade-950/30 dark:to-jade-950/10 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-charcoal-900 dark:text-charcoal-100">Bắt đầu lộ trình này</p>
              <p className="text-xs text-charcoal-500 mt-0.5">Đăng ký để theo dõi tiến độ học tập</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleEnroll} className="flex-shrink-0 gap-1.5">
              <Play className="w-3.5 h-3.5" /> Bắt đầu học
            </Button>
          </div>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
          Nội dung lộ trình
        </h2>
        {modules.map((mod, idx) => {
          const isCompleted = completedIds.has(mod.id);
          const isExpanded = expandedId === mod.id;
          const isLocked = !enrolledAt && idx > 0;

          return (
            <div
              key={mod.id}
              className={`rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? 'border-jade-300 dark:border-jade-800 bg-jade-50/60 dark:bg-jade-950/20'
                  : 'border-ivory-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800'
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => !isLocked && toggleModule(mod.id)}
                  disabled={savingId === mod.id || isLocked}
                  className="flex-shrink-0 disabled:opacity-50 transition-transform hover:scale-110"
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-charcoal-300 dark:text-charcoal-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-jade-600 dark:text-jade-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-charcoal-300 dark:text-charcoal-600 hover:text-jade-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-charcoal-400 flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className={`text-sm font-semibold truncate ${isCompleted ? 'line-through text-charcoal-400' : 'text-charcoal-900 dark:text-charcoal-100'}`}>
                      {mod.title}
                    </p>
                  </div>
                  {mod.description && (
                    <p className="text-xs text-charcoal-500 mt-0.5 line-clamp-1">{mod.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-charcoal-400 font-mono whitespace-nowrap hidden sm:block">
                    {mod.duration_minutes} phút
                  </span>
                  {mod.content && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                      className="p-1 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-colors text-charcoal-400"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Module content */}
              {isExpanded && mod.content && (
                <div className="px-4 pb-4 pt-0 border-t border-ivory-100 dark:border-charcoal-700">
                  <div className="pt-3 text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-line">
                    {mod.content}
                  </div>
                  {enrolledAt && (
                    <button
                      onClick={() => toggleModule(mod.id)}
                      disabled={savingId === mod.id}
                      className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        isCompleted
                          ? 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-600 hover:bg-charcoal-200'
                          : 'bg-jade-100 dark:bg-jade-900/40 text-jade-700 dark:text-jade-300 hover:bg-jade-200'
                      }`}
                    >
                      {isCompleted ? 'Đánh dấu chưa học' : '✓ Đánh dấu đã học xong'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
