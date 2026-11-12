'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, Clock, Sparkles, Type } from 'lucide-react';
import type { CuratedArticle } from '@/data/articles';
import { CURATED_ARTICLES } from '@/data/articles';
import { useDharmaStore } from '@/store/useDharmaStore';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';

interface Props {
  article: CuratedArticle;
}

export function CuratedArticleReader({ article }: Props) {
  const [fontSize, setFontSize] = useState<number>(17);
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const bookmarkedSlugs = useDharmaStore((s) => s.bookmarkedArticleSlugs);
  const toggleArticleBookmark = useDharmaStore((s) => s.toggleArticleBookmark);
  const addMeritEntry = useDharmaStore((s) => s.addMeritEntry);
  const isBookmarked = bookmarkedSlugs.includes(article.slug);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - h.clientHeight);
      setScrollPct(Math.min(100, Math.round((window.scrollY / max) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const relatedArticles = CURATED_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10] pb-24">
      {/* Top Sticky Progress & Reader Bar */}
      <div className="sticky top-0 lg:top-16 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#EAD7A7]">
        <div className="h-1 bg-[#FFF9EB] w-full">
          <div
            className="h-full bg-gradient-to-r from-[#C68B19] via-[#E5A91C] to-[#FFE07D] transition-all duration-150"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8C5500] hover:text-[#2C1E10] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cẩm Nang Chuyển Hóa Tâm</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Font size controls */}
            <div className="inline-flex items-center gap-1 bg-[#FFF9EB] border border-[#DFC27D] rounded-full px-2.5 py-1">
              <Type className="w-3.5 h-3.5 text-[#8C5500] mr-0.5" />
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.max(15, f - 1))}
                className="px-1.5 text-xs font-bold text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                title="Thu nhỏ chữ"
              >
                A-
              </button>
              <span className="text-[11px] font-mono font-bold text-[#8C5500]">{fontSize}px</span>
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.min(24, f + 1))}
                className="px-1.5 text-xs font-bold text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                title="Phóng to chữ"
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleArticleBookmark(article.slug)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border-[#C68B19]'
                  : 'bg-[#FFF9EB] text-[#8C5500] border-[#DFC27D] hover:bg-[#FFF6DF]'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Đã Lưu' : 'Lưu Đọc Sau'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Essay Container */}
      <article className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10 space-y-7">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#FFF9EB] border border-[#DFC27D] font-bold text-[#8C5500]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#6B533B]">
              <Clock className="w-3.5 h-3.5 text-[#8C5500]" />
              {article.readTime}
            </span>
            <span className="text-[#6B533B]">• {article.authorOrSource}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C1E10] leading-snug">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#2C1E10] leading-relaxed italic border-l-4 border-[#C68B19] pl-4 py-2 bg-[#FFFFFF] rounded-r-xl shadow-2xs">
            {article.excerpt}
          </p>
        </div>

        {/* Cover Thumbnail */}
        <div className="rounded-3xl overflow-hidden border border-[#EAD7A7] shadow-md aspect-[16/9] bg-[#FFF9EB]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sacred Sutra Quote Card */}
        <blockquote className="rounded-2xl bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC2] border border-[#DFC27D] p-5 sm:p-6 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#8C5500] text-xs font-bold uppercase tracking-wider">
            <LotusMinimalIcon className="w-4 h-4" />
            <span>Lời Kinh Soi Sáng</span>
          </div>
          <p className="font-serif text-base sm:text-lg font-bold italic text-[#2C1E10] leading-relaxed">
            &ldquo;{article.quote.text}&rdquo;
          </p>
          <footer className="text-xs font-bold text-[#8C5500] text-right">
            — {article.quote.source}
          </footer>
        </blockquote>

        {/* Sections */}
        <div className="space-y-8">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#8C5500]">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  style={{ fontSize: `${fontSize}px` }}
                  className="text-[#2C1E10] leading-[1.85] tracking-[0.01em]"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* 3-Step Daily Practice Checklist */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#DFC27D] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500]">
                Thực Hành Chuyển Hóa Ngay Hôm Nay
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1E10]">
                Lộ Trình 3 Bước Hành Trì
              </h3>
            </div>
            <Sparkles className="w-6 h-6 text-[#C68B19] shrink-0" />
          </div>

          <div className="space-y-2.5">
            {article.dailyChecklist.map((step, idx) => {
              const done = checkedSteps.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-[#FFF9EB] border-[#EAD7A7] text-[#2C1E10] hover:border-[#C68B19]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      done ? 'text-emerald-600' : 'text-[#8C5500]'
                    }`}
                  />
                  <span className={`text-sm leading-relaxed ${done ? 'line-through opacity-80' : 'font-semibold'}`}>
                    Bước {idx + 1}: {step}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAD7A7]">
            <p className="text-xs font-semibold text-[#6B533B]">
              Hoàn thành {checkedSteps.length}/{article.dailyChecklist.length} bước thực hành
            </p>
            <button
              type="button"
              onClick={() =>
                addMeritEntry({
                  category: 'TUNG_KINH',
                  title: `Đọc & Thực hành Pháp học: ${article.title}`,
                  dedicationText: 'Nguyện chuyển hóa thân tâm theo Chánh Pháp, đem an vui đến muôn loài.',
                })
              }
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Ghi Dấu Vào Sổ Công Đức
            </button>
          </div>
        </div>

        {/* Related Essays */}
        <div className="pt-6 border-t border-[#EAD7A7] space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2C1E10]">Bài Pháp Học Liên Quan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/bai-viet/${rel.slug}`}
                className="group rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] overflow-hidden transition-all shadow-2xs"
              >
                <div className="aspect-[16/10] bg-[#FFF9EB] overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#8C5500] uppercase">{rel.category}</span>
                  <h4 className="font-serif text-sm font-bold text-[#2C1E10] line-clamp-2 group-hover:text-[#8C5500]">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
