import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { BookItem } from '@/components/books/types';
import { DirectReaderLauncher } from '@/components/books/DirectReaderLauncher';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { ArrowLeft, BookOpen, Layers, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await query(
    'SELECT id, slug, title, subtitle, author, translator, cover_image, description, category, total_pages, published_year, chapters FROM books WHERE slug = $1 OR id::text = $1 LIMIT 1',
    [slug]
  );

  if (res.rows.length === 0) {
    notFound();
  }

  const book: BookItem = res.rows[0];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Back link */}
      <div>
        <Link
          href="/thu-vien"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 dark:text-charcoal-400 hover:text-saffron-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tủ Kinh Sách</span>
        </Link>
      </div>

      {/* Book Detail Showcase Hero */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-8 md:p-10 shadow-lg flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
        {/* 3D Realistic Cover */}
        <div className="w-36 xs:w-44 sm:w-52 md:w-56 shrink-0 aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl border-l-[5px] sm:border-l-[6px] border-l-black/35 relative bg-ivory-100">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Info & CTAs */}
        <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-saffron-50 dark:bg-saffron-950/70 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800">
            <DharmaBookIcon className="w-3.5 h-3.5" />
            <span>Kinh Sách Phật Học</span>
          </div>

          <h1 className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
            {book.title}
          </h1>

          {book.subtitle && (
            <p className="text-xs sm:text-sm font-medium text-saffron-700 dark:text-saffron-400 italic">
              {book.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 text-xs text-charcoal-600 dark:text-charcoal-400 font-mono py-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
              {book.author}
            </span>
            {book.translator && <span className="hidden xs:inline">• Dịch: {book.translator}</span>}
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
              {book.total_pages} trang
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
              Năm {book.published_year || 2020}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed pt-1 sm:pt-2">
            {book.description}
          </p>

          {/* Action Trigger Buttons (Full width on mobile) */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-2.5 sm:gap-3">
            <DirectReaderLauncher book={book} className="w-full sm:w-auto" />
            <Link href="/thu-vien" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                Khám phá sách khác
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chapters Preview */}
      {book.chapters && book.chapters.length > 0 && (
        <div className="bg-ivory-50/70 dark:bg-charcoal-900/60 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-600" />
            Mục Lục Các Phần & Trích Đoạn Trực Tuyến
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {book.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase font-bold text-saffron-700 dark:text-saffron-400 block">
                    Phần {idx + 1}
                  </span>
                  <p className="font-heading text-xs sm:text-sm font-bold text-charcoal-800 dark:text-charcoal-200 truncate">
                    {ch.title}
                  </p>
                </div>
                <span className="text-xs text-charcoal-400 font-mono shrink-0">Trang {ch.startPage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
