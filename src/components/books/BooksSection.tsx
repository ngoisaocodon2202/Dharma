'use client';

import React, { useState, useMemo } from 'react';
import { BookItem } from './types';
import { BookCard } from './BookCard';
import { BookReaderModal } from './BookReaderModal';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BooksSectionProps {
  books: BookItem[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
}

export function BooksSection({
  books,
  title = 'Tủ Kinh Sách Phật Học',
  subtitle = 'Pháp bảo vô giá',
  showFilters = false,
  limit,
}: BooksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'Tất Cả' },
    { id: 'KINH_DIEN', label: 'Kinh Điển' },
    { id: 'THIEN_HOC', label: 'Thiền Học' },
    { id: 'TRIET_HOC', label: 'Triết Học' },
    { id: 'NHAN_QUA', label: 'Nhân Quả' },
    { id: 'GIAO_LY', label: 'Giáo Lý' },
  ];

  const filteredBooks = useMemo(() => {
    let list = books;
    if (selectedCategory !== 'ALL') {
      list = list.filter((b) => b.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q))
      );
    }
    if (limit && limit > 0) {
      list = list.slice(0, limit);
    }
    return list;
  }, [books, selectedCategory, searchQuery, limit]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters and Search bar */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3.5 bg-ivory-50/80 dark:bg-charcoal-800/80 p-2.5 sm:p-4 rounded-2xl border border-ivory-200 dark:border-charcoal-700">
          {/* Category Tabs (Horizontal Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 scroll-smooth">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={cn(
                  'px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95',
                  selectedCategory === c.id
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 border border-ivory-200 dark:border-charcoal-600'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên kinh sách, tác giả..."
              className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-1.5 rounded-xl text-base sm:text-xs bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 text-charcoal-900 dark:text-charcoal-100"
            />
          </div>
        </div>
      )}

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenReader={(b) => setReadingBook(b)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 sm:py-12 bg-ivory-50 dark:bg-charcoal-800/50 rounded-2xl border border-ivory-200 dark:border-charcoal-700 space-y-2 p-4">
          <BookOpen className="w-8 h-8 mx-auto text-charcoal-400 opacity-60" />
          <p className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300">
            Không tìm thấy kinh sách phù hợp
          </p>
          <p className="text-xs text-charcoal-500">
            Vui lòng thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
          </p>
        </div>
      )}

      {/* Interactive E-Reader Modal */}
      <BookReaderModal
        book={readingBook}
        isOpen={!!readingBook}
        onClose={() => setReadingBook(null)}
      />
    </div>
  );
}

export default BooksSection;
