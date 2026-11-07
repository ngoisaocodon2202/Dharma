'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, ArrowRight, AlertCircle, X } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playWoodenFishSound } from '@/lib/buddhistSounds';
import {
  DailyTaskId,
  getDailyPracticeProgress,
} from '@/lib/dailyPracticeProgress';
import { cn } from '@/lib/utils';

interface PracticeNode {
  id: DailyTaskId;
  name: string;
  sub: string;
  target: string;
  requiredCount: number;
  unit: string;
  imageSrc: string;
  href: string;
}

const PRACTICE_NODES: PracticeNode[] = [
  {
    id: 'niem-phat',
    name: 'Niệm Phật',
    sub: '108 câu A Di Đà Phật',
    target: 'Chuỗi hạt',
    requiredCount: 108,
    unit: 'câu',
    imageSrc: '/images/apps/niem-phat.jpg',
    href: '#altar-section',
  },
  {
    id: 'tri-chu',
    name: 'Trì Chú',
    sub: '21 biến Om Mani Padme Hum',
    target: 'Lục Tự Minh Chú',
    requiredCount: 21,
    unit: 'biến',
    imageSrc: '/images/apps/minh-chu.jpg',
    href: '#minh-chu-section',
  },
  {
    id: 'toa-thien',
    name: 'Tọa Thiền',
    sub: '15 phút chánh niệm hơi thở',
    target: 'Phòng thiền',
    requiredCount: 15,
    unit: 'phút',
    imageSrc: '/images/apps/phong-thien.jpg',
    href: '/phong-thien',
  },
  {
    id: 'lay-phat',
    name: 'Lạy Phật',
    sub: '12 lạy sám hối ba nghiệp',
    target: 'Thân tâm thanh tịnh',
    requiredCount: 12,
    unit: 'lạy',
    imageSrc: '/images/buddha_meditation.jpg',
    href: '/cau-nguyen',
  },
  {
    id: 'doc-kinh',
    name: 'Đọc Kinh',
    sub: '1 biến Bát Nhã Ba La Mật',
    target: 'Tủ kinh sách',
    requiredCount: 1,
    unit: 'biến',
    imageSrc: '/images/apps/tung-kinh.jpg',
    href: '/thu-vien',
  },
];

export function OmManiMandalaHub() {
  const router = useRouter();
  const [progress, setProgress] = useState<Record<DailyTaskId, number>>({
    'niem-phat': 0,
    'tri-chu': 0,
    'toa-thien': 0,
    'lay-phat': 0,
    'doc-kinh': 0,
  });
  const [incompleteNotice, setIncompleteNotice] = useState<PracticeNode | null>(null);

  useEffect(() => {
    const syncProgress = () => {
      setProgress(getDailyPracticeProgress());
    };
    syncProgress();

    window.addEventListener('phatphap-daily-practice-updated', syncProgress);
    window.addEventListener('storage', syncProgress);
    return () => {
      window.removeEventListener('phatphap-daily-practice-updated', syncProgress);
      window.removeEventListener('storage', syncProgress);
    };
  }, []);

  const handleCheckClick = (node: PracticeNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = progress[node.id] || 0;
    const isDone = current >= node.requiredCount;

    if (!isDone) {
      playWoodenFishSound(0.45);
      setIncompleteNotice(node);
    }
  };

  const handleGoToPractice = (node: PracticeNode) => {
    setIncompleteNotice(null);
    if (node.href.startsWith('#')) {
      const targetEl = document.querySelector(node.href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      router.push(node.href);
    }
  };

  const completedCount = PRACTICE_NODES.filter(
    (node) => (progress[node.id] || 0) >= node.requiredCount
  ).length;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-saffron-500 shrink-0" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
              Tu Tập Thiện Lành
            </h3>
          </div>
          <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5 whitespace-nowrap">
            5 nhánh công phu hằng ngày
          </p>
        </div>

        <div className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold">
          <span>{completedCount}/5 Hoàn thành</span>
        </div>
      </div>

      {/* Main Mandala Hub Card */}
      <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-amber-50/90 via-ivory-50 to-ivory-100 dark:from-charcoal-800 dark:via-charcoal-900 dark:to-charcoal-950 border border-amber-200/80 dark:border-charcoal-700 shadow-md">
        {/* Subtle background mandala rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div
            className="w-64 h-64 rounded-full border border-dashed border-amber-500 animate-spin"
            style={{ animationDuration: '60s' }}
          />
          <div className="absolute w-44 h-44 rounded-full border border-amber-400" />
        </div>

        {/* Center Lotus Emblem */}
        <div className="flex flex-col items-center text-center mb-5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-saffron-500 to-amber-600 p-1 shadow-lg flex items-center justify-center mb-2 animate-float">
            <div className="w-full h-full rounded-full bg-white dark:bg-charcoal-900 flex items-center justify-center">
              <BuddhaBodhiIcon className="w-8 h-8 text-saffron-600 dark:text-saffron-400 animate-pulse-glow" />
            </div>
          </div>
          <h4 className="font-heading font-bold text-base sm:text-lg text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
            Tâm Bồ Đề Kiên Cố
          </h4>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400 max-w-sm mt-0.5">
            Mỗi thời khóa là một bước chân đưa thân tâm trở về với phút giây tỉnh thức hiện tại.
          </p>
        </div>

        {/* Incomplete Task Guidance Notice */}
        {incompleteNotice && (
          <div className="relative z-20 mb-4 p-3.5 rounded-2xl bg-amber-100/95 dark:bg-amber-950/90 border border-amber-400 text-amber-950 dark:text-amber-100 shadow-sm animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">
                    Chưa hoàn thành &ldquo;{incompleteNotice.name}&rdquo; (
                    {Math.min(progress[incompleteNotice.id] || 0, incompleteNotice.requiredCount)}/
                    {incompleteNotice.requiredCount} {incompleteNotice.unit}).
                  </span>{' '}
                  Bạn cần thực hành đủ chỉ tiêu hôm nay thì hệ thống mới tự động tích xanh hoàn thành.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIncompleteNotice(null)}
                className="text-amber-700 hover:text-amber-950 p-0.5 shrink-0"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => handleGoToPractice(incompleteNotice)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
              >
                <span>Thực hành {incompleteNotice.name} ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5 Radial Practice Nodes List */}
        <div className="space-y-2.5 relative z-10">
          {PRACTICE_NODES.map((node) => {
            const currentVal = progress[node.id] || 0;
            const cappedVal = Math.min(currentVal, node.requiredCount);
            const isDone = currentVal >= node.requiredCount;
            const percent = Math.min(100, Math.round((currentVal / node.requiredCount) * 100));

            return (
              <div
                key={node.id}
                className={cn(
                  'flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 group',
                  isDone
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60 text-charcoal-900 dark:text-charcoal-100'
                    : 'bg-white dark:bg-charcoal-800/80 border-ivory-200 dark:border-charcoal-700 hover:border-amber-300 dark:hover:border-amber-600'
                )}
              >
                <Link
                  href={node.href}
                  className="flex items-center gap-3 min-w-0 flex-1 pr-2"
                >
                  {/* Photo Thumbnail */}
                  <div
                    className={cn(
                      'relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 shadow-xs ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-105',
                      isDone && 'ring-2 ring-emerald-500/60'
                    )}
                  >
                    <img
                      src={node.imageSrc}
                      alt={node.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-bold text-sm text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap">
                        {node.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 font-medium whitespace-nowrap shrink-0">
                        {node.target}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-charcoal-500 dark:text-charcoal-400 truncate whitespace-nowrap">
                        {node.sub}
                      </p>
                      <span
                        className={cn(
                          'text-[10px] font-mono font-bold whitespace-nowrap shrink-0',
                          isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                        )}
                      >
                        {cappedVal}/{node.requiredCount} {node.unit}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 rounded-full bg-ivory-200 dark:bg-charcoal-700 mt-1.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          isDone ? 'bg-emerald-500' : 'bg-amber-500'
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </Link>

                {/* Status Indicator Button (Only green when genuinely completed) */}
                <button
                  type="button"
                  onClick={(e) => handleCheckClick(node, e)}
                  className={cn(
                    'p-1.5 transition-colors shrink-0 cursor-pointer',
                    isDone
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-charcoal-300 hover:text-amber-600 dark:text-charcoal-600 dark:hover:text-amber-400'
                  )}
                  title={
                    isDone
                      ? `Đã hoàn thành (${cappedVal}/${node.requiredCount} ${node.unit})`
                      : `Chưa hoàn thành (${cappedVal}/${node.requiredCount} ${node.unit}) — Nhấn để xem hướng dẫn thực hành`
                  }
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to View Full Practice Diary */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-charcoal-700 flex items-center justify-between text-xs gap-2">
          <span className="text-charcoal-600 dark:text-charcoal-400 whitespace-nowrap truncate">
            Duy trì thói quen tinh tấn mỗi ngày
          </span>
          <Link
            href="/thuc-hanh"
            className="font-bold text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <span>Nhật ký tu tập</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
