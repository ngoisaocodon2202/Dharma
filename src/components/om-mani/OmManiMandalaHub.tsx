'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, Play, Sparkles, BookOpen, Wind, Compass } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

interface PracticeNode {
  id: string;
  name: string;
  sub: string;
  target: string;
  imageSrc: string;
  href: string;
}

const PRACTICE_NODES: PracticeNode[] = [
  {
    id: 'niem-phat',
    name: 'Niệm Phật',
    sub: '108 câu A Di Đà Phật',
    target: 'Chuỗi hạt',
    imageSrc: '/images/apps/niem-phat.jpg',
    href: '#altar-section',
  },
  {
    id: 'tri-chu',
    name: 'Trì Chú',
    sub: '21 biến Om Mani Padme Hum',
    target: 'Lục Tự Minh Chú',
    imageSrc: '/images/apps/minh-chu.jpg',
    href: '#minh-chu-section',
  },
  {
    id: 'toa-thien',
    name: 'Tọa Thiền',
    sub: '15 phút chánh niệm hơi thở',
    target: 'Phòng thiền',
    imageSrc: '/images/apps/phong-thien.jpg',
    href: '/phong-thien',
  },
  {
    id: 'lay-phat',
    name: 'Lạy Phật',
    sub: '12 lạy sám hối ba nghiệp',
    target: 'Thân tâm thanh tịnh',
    imageSrc: '/images/buddha_meditation.jpg',
    href: '/thuc-hanh',
  },
  {
    id: 'doc-kinh',
    name: 'Đọc Kinh',
    sub: '1 biến Bát Nhã Ba La Mật',
    target: 'Tủ kinh sách',
    imageSrc: '/images/apps/tung-kinh.jpg',
    href: '/thu-vien',
  },
];

export function OmManiMandalaHub() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    'niem-phat': true,
    'toa-thien': true,
  });

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playWoodenFishSound(0.5);
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

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
          <div className="w-64 h-64 rounded-full border border-dashed border-amber-500 animate-spin" style={{ animationDuration: '60s' }} />
          <div className="absolute w-44 h-44 rounded-full border border-amber-400" />
        </div>

        {/* Center Lotus Emblem */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
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

        {/* 5 Radial Practice Nodes List */}
        <div className="space-y-2.5 relative z-10">
          {PRACTICE_NODES.map((node) => {
            const isDone = !!completed[node.id];

            return (
              <div
                key={node.id}
                className={cn(
                  'flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 group',
                  isDone
                    ? 'bg-amber-100/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-charcoal-900 dark:text-charcoal-100'
                    : 'bg-white dark:bg-charcoal-800/80 border-ivory-200 dark:border-charcoal-700 hover:border-amber-300 dark:hover:border-amber-600'
                )}
              >
                <Link
                  href={node.href}
                  className="flex items-center gap-3 min-w-0 flex-1"
                >
                  {/* Photo Thumbnail */}
                  <div
                    className={cn(
                      'relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 shadow-xs ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-105',
                      isDone && 'ring-2 ring-emerald-500/50'
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

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-bold text-sm text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap">
                        {node.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 font-medium whitespace-nowrap shrink-0">
                        {node.target}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 truncate mt-0.5 whitespace-nowrap">
                      {node.sub}
                    </p>
                  </div>
                </Link>

                {/* Toggle Button */}
                <button
                  onClick={(e) => toggleComplete(node.id, e)}
                  className="p-1.5 text-charcoal-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0"
                  title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6 text-charcoal-300 dark:text-charcoal-600" />
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
