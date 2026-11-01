'use client';

import React from 'react';
import { BookItem } from './types';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { BookOpen, User, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: BookItem;
  onOpenReader: (book: BookItem) => void;
  className?: string;
}

export function BookCard({ book, onOpenReader, className }: BookCardProps) {
  const categoryBadge = {
    KINH_DIEN: { label: 'Kinh Điển', color: 'bg-saffron-100 text-saffron-800 dark:bg-saffron-950/70 dark:text-saffron-300 border-saffron-200' },
    TRIET_HOC: { label: 'Triết Học', color: 'bg-jade-100 text-jade-800 dark:bg-jade-950/70 dark:text-jade-300 border-jade-200' },
    THIEN_HOC: { label: 'Thiền Học', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200' },
    VANG_BONG: { label: 'Vang Bóng', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200' },
    NHAN_QUA: { label: 'Nhân Quả', color: 'bg-lotus-100 text-lotus-800 dark:bg-lotus-950/70 dark:text-lotus-300 border-lotus-200' },
    GIAO_LY: { label: 'Giáo Lý', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200' },
  }[book.category] || { label: 'Phật Học', color: 'bg-ivory-200 text-charcoal-800 border-ivory-300' };

  return (
    <div
      className={cn(
        'group flex flex-col justify-between bg-white dark:bg-charcoal-800/90 rounded-2xl border border-ivory-200/90 dark:border-charcoal-700/80 p-2.5 sm:p-4 hover:border-saffron-300 dark:hover:border-saffron-700/70 shadow-xs hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      <div>
        {/* 3D Realistic Book Cover Frame */}
        <div
          onClick={() => onOpenReader(book)}
          className="relative aspect-[3/4.2] rounded-xl overflow-hidden mb-2.5 sm:mb-3.5 cursor-pointer bg-ivory-100 dark:bg-charcoal-900 border-l-[4px] sm:border-l-[5px] border-l-black/35 shadow-md group-hover:shadow-2xl group-hover:-translate-y-1 sm:group-hover:-translate-y-1.5 group-hover:scale-[1.02] transition-all duration-300 active:scale-98"
        >
          {/* Authentic Book Cover Image */}
          <img
            src={book.cover_image}
            alt={`Bìa sách ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Spine crease and sheen gradient reflection */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2.5 sm:p-3">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-saffron-600 text-white font-semibold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-lg animate-pulse-glow">
              <DharmaBookIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Đọc từng trang
            </span>
          </div>

          {/* Category Pill Tag on top left */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
            <span
              className={cn(
                'text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border shadow-xs backdrop-blur-xs',
                categoryBadge.color
              )}
            >
              {categoryBadge.label}
            </span>
          </div>
        </div>

        {/* Book Title & Subtitle */}
        <div className="space-y-1">
          <h3
            onClick={() => onOpenReader(book)}
            className="font-heading text-xs sm:text-sm md:text-base font-bold text-charcoal-900 dark:text-charcoal-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="text-[10px] sm:text-xs text-charcoal-600 dark:text-charcoal-400 flex items-center gap-1 truncate">
            <User className="w-3 h-3 text-saffron-600 shrink-0 opacity-70" />
            <span className="truncate">{book.author}</span>
          </p>

          {book.translator && (
            <p className="text-[9px] sm:text-[11px] text-charcoal-500 dark:text-charcoal-400 truncate italic">
              {book.translator}
            </p>
          )}

          {book.description && (
            <p className="text-[11px] sm:text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 pt-1 leading-relaxed hidden sm:block">
              {book.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-ivory-100 dark:border-charcoal-700/80 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-charcoal-500 dark:text-charcoal-400 font-mono truncate">
          <span className="flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
            {book.total_pages} tr
          </span>
          <span className="hidden xs:inline">• {book.published_year || 2020}</span>
        </div>

        <button
          onClick={() => onOpenReader(book)}
          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:text-white hover:bg-saffron-600 transition-all flex items-center gap-1 border border-saffron-200 dark:border-saffron-800/60 shrink-0 active:scale-95"
        >
          <BookOpen className="w-3 h-3" />
          <span>Đọc</span>
        </button>
      </div>
    </div>
  );
}

export default BookCard;
