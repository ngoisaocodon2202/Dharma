'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Share2,
  Copy,
  ChevronDown,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { BUDDHIST_GLOSSARY, GLOSSARY_CATEGORIES, GlossaryItem } from '@/lib/buddhistGlossary';
import { cn } from '@/lib/utils';

export default function BuddhistGlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>('vo-nga');
  const [fontSize, setFontSize] = useState<number>(16);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter glossary items
  const filteredItems = useMemo(() => {
    return BUDDHIST_GLOSSARY.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        (item.sanskritPali && item.sanskritPali.toLowerCase().includes(q)) ||
        item.summary.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (item: GlossaryItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${item.term} (${item.sanskritPali || ''}):\n${item.summary}\n${item.detail}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-text">
      {/* Top Header */}
      <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ</span>
          </Link>

          {/* Font Resizer for Elderly Users */}
          <div className="flex items-center gap-1 bg-ivory-100 dark:bg-charcoal-800 p-1 rounded-xl border border-ivory-200 dark:border-charcoal-700">
            <button
              onClick={() => setFontSize((p) => Math.max(14, p - 2))}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-charcoal-700 shadow-2xs hover:bg-ivory-50 active:scale-95"
              title="Thu nhỏ chữ"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs px-2 font-bold text-charcoal-600 dark:text-charcoal-300">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((p) => Math.min(24, p + 2))}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-charcoal-700 shadow-2xs hover:bg-ivory-50 active:scale-95"
              title="Phóng to chữ dễ đọc"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-saffron-600 dark:text-saffron-400 animate-pulse-glow" />
            <span>Pháp Bảo Vô Giá • Tra Cứu Chánh Kiến</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
            Từ Điển Phật Học Bỏ Túi
          </h1>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl mx-auto leading-relaxed">
            Giải nghĩa các thuật ngữ cốt lõi trong kinh sách Phật giáo bằng ngôn ngữ bình dị, dễ hiểu, giúp người tu học vững bước trên con đường tuệ giác.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm thuật ngữ (ví dụ: Vô ngã, Bát chánh đạo, Duyên khởi, Anatta...)"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-ivory-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
          {Object.entries(GLOSSARY_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95',
                selectedCategory === key
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items List */}
      <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs',
                  isExpanded
                    ? 'border-saffron-400 dark:border-saffron-700 bg-white dark:bg-charcoal-800 shadow-md ring-1 ring-saffron-400/30'
                    : 'border-ivory-200 dark:border-charcoal-700 bg-ivory-50/70 dark:bg-charcoal-900/40 hover:bg-white'
                )}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading font-bold text-lg sm:text-xl text-charcoal-900 dark:text-ivory-100">
                        {item.term}
                      </h2>
                      {item.sanskritPali && (
                        <span className="text-xs italic text-saffron-700 dark:text-saffron-400 font-medium bg-saffron-50 dark:bg-saffron-950/40 px-2.5 py-0.5 rounded-full border border-saffron-200/50">
                          {item.sanskritPali}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-charcoal-600 dark:text-charcoal-300 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item);
                      }}
                      className="p-2 rounded-xl text-charcoal-400 hover:text-saffron-600 hover:bg-ivory-100 dark:hover:bg-charcoal-700"
                      title="Sao chép định nghĩa"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <div className={cn('p-1 text-charcoal-400 transition-transform duration-300', isExpanded && 'rotate-180')}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 pt-0 border-t border-ivory-100 dark:border-charcoal-700 space-y-4 animate-fade-in">
                    <div className="space-y-2 pt-3">
                      <h3 className="font-heading font-bold text-sm text-saffron-800 dark:text-saffron-300 uppercase tracking-wider">
                        Ý Nghĩa &amp; Giáo Lý:
                      </h3>
                      <p className="text-charcoal-700 dark:text-charcoal-200 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-saffron-50/80 dark:bg-saffron-950/30 border border-saffron-200 dark:border-saffron-800/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-800 dark:text-saffron-300">
                        <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                        <span>Lời Khuyên Thực Hành Đời Sống:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-saffron-900 dark:text-saffron-200 italic leading-relaxed">
                        &ldquo;{item.reflection}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-saffron-400 opacity-40" />
            <p className="font-heading font-bold text-base text-charcoal-700 dark:text-charcoal-300">
              Không tìm thấy thuật ngữ phù hợp
            </p>
            <p className="text-xs text-charcoal-500">
              Hãy thử tìm với các từ khóa ngắn gọn hơn như: &ldquo;Vô ngã&rdquo;, &ldquo;Đạo&rdquo;, &ldquo;Tâm&rdquo;...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

