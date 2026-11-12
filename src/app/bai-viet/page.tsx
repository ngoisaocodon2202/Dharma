'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Search, Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { CURATED_ARTICLES } from '@/data/articles';
import { useDharmaStore } from '@/store/useDharmaStore';
import { cn } from '@/lib/utils';

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);

  const bookmarkedArticleSlugs = useDharmaStore((s) => s.bookmarkedArticleSlugs);
  const toggleArticleBookmark = useDharmaStore((s) => s.toggleArticleBookmark);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(CURATED_ARTICLES.map((a) => a.category)));
    return ['Tất cả', ...unique];
  }, []);

  const filteredArticles = useMemo(() => {
    return CURATED_ARTICLES.filter((a) => {
      if (selectedCategory !== 'Tất cả' && a.category !== selectedCategory) return false;
      if (onlyBookmarked && !bookmarkedArticleSlugs.includes(a.slug)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.authorOrSource.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, onlyBookmarked, searchQuery, bookmarkedArticleSlugs]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 space-y-6">
        {/* Header */}
        <header className="space-y-4 border-b border-[#EAD7A7] pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8C5500] font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Pháp Học &amp; Thực Hành • 8 Bài Cẩm Nang</span>
              </div>
              <h1 className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#2C1E10]">
                Cẩm Nang Chuyển Hóa Tâm
              </h1>
              <p className="text-xs sm:text-sm text-[#6B533B] max-w-2xl">
                Tuyển tập 8 bài luận giải giáo lý và lộ trình thực hành 3 bước hằng ngày trích dẫn từ Kinh tạng Nikaya &amp; Đại Thừa.
              </p>
            </div>

            {/* Search & Bookmark Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#8C5500] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài pháp học..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] focus:border-[#C68B19] text-xs text-[#2C1E10] placeholder-[#8E775B] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setOnlyBookmarked((v) => !v)}
                className={cn(
                  'px-3.5 py-2 rounded-2xl border text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors',
                  onlyBookmarked
                    ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border-[#C68B19]'
                    : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#8C5500]'
                )}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Đã lưu ({bookmarkedArticleSlugs.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border',
                    active
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border-[#C68B19]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((art) => {
            const isSaved = bookmarkedArticleSlugs.includes(art.slug);
            return (
              <article
                key={art.slug}
                className="group rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] overflow-hidden shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <Link href={`/bai-viet/${art.slug}`} className="block relative aspect-[16/9] bg-[#FFF9EB] overflow-hidden border-b border-[#EAD7A7]">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFFFF]/95 border border-[#DFC27D] text-[10px] font-bold text-[#8C5500] shadow-2xs">
                      {art.category}
                    </span>
                  </Link>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#6B533B]">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#8C5500]" />
                        {art.readTime}
                      </span>
                      <span className="truncate">{art.authorOrSource}</span>
                    </div>

                    <Link href={`/bai-viet/${art.slug}`}>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors leading-snug">
                        {art.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#6B533B] line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-[#FFF9EB] border-t border-[#EAD7A7] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleArticleBookmark(art.slug)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-colors',
                      isSaved
                        ? 'bg-[#FFF6DF] border-[#C68B19] text-[#8C5500]'
                        : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:text-[#2C1E10]'
                    )}
                  >
                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
                  </button>

                  <Link
                    href={`/bai-viet/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8C5500] hover:underline"
                  >
                    <span>Đọc &amp; Thực hành 3 bước</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
