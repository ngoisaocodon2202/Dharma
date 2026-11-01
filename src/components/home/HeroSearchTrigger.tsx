'use client';

import React, { useState, useEffect } from 'react';
import { SearchModal } from '@/components/layout/SearchModal';
import { Search } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';

const SEARCH_SUGGESTIONS = [
  'Tìm kiếm bài viết "Tứ Diệu Đế & Bát Chánh Đạo"...',
  'Tìm kiếm pháp thoại "Thiền buông thư giữa đời thường"...',
  'Tìm kiếm danh lam "Chùa Quán Sứ, Chùa Hoằng Pháp"...',
  'Tìm kiếm kinh điển "Kinh Pháp Cú, Bát Nhã Ba La Mật"...',
  'Tìm kiếm lộ trình "Người mới tìm hiểu Phật giáo"...',
  'Tìm kiếm không gian "Phòng thiền tọa trực tuyến"...',
];

export function HeroSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="w-full max-w-xl mx-auto flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl border border-ivory-300 shadow-md hover:shadow-xl hover:border-saffron-400 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3 overflow-hidden text-charcoal-400 flex-1 mr-2">
          <Search className="w-5 h-5 text-saffron-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0" />
          <div className="relative h-6 overflow-hidden flex-1 flex items-center">
            <span
              key={suggestionIndex}
              className="text-xs sm:text-sm font-normal text-charcoal-600 truncate inline-block animate-fade-in-up"
            >
              {SEARCH_SUGGESTIONS[suggestionIndex]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-medium text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-md border border-saffron-200/60 whitespace-nowrap hidden sm:inline-flex items-center gap-1">
            <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-600 animate-pulse-glow" /> Tra cứu
          </span>
          <kbd className="hidden sm:inline text-xs font-mono px-2 py-1 bg-ivory-100 text-charcoal-600 rounded-lg border border-ivory-200 whitespace-nowrap">
            ⌘K
          </kbd>
        </div>
      </div>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
