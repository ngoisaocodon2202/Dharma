'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Search, BookOpen, MapPin, Music, Compass, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [queryText, setQueryText] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [results, setResults] = useState<{
    articles: any[];
    temples: any[];
    audio: any[];
    learningPaths: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const POPULAR_TAGS = [
    'Tứ Diệu Đế',
    'Thiền buông thư',
    'Chùa Quán Sứ',
    'Kinh Pháp Cú',
    'Bát Chánh Đạo',
    'Thích Nhất Hạnh',
  ];

  const PLACEHOLDERS = [
    'Tìm kiếm "Tứ Diệu Đế & Bát Chánh Đạo"...',
    'Tìm kiếm pháp thoại "Thiền buông thư"...',
    'Tìm kiếm chùa "Quán Sứ", "Hoằng Pháp"...',
    'Tìm kiếm kinh "Pháp Cú", "Bát Nhã"...',
    'Tìm kiếm lộ trình "Nhập môn Phật giáo"...',
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!queryText || queryText.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(queryText.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [queryText]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Search Input with animated placeholder */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-saffron-600 dark:text-saffron-400" />
          <input
            type="text"
            autoFocus
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={PLACEHOLDERS[suggestionIdx]}
            className="w-full pl-11 pr-10 py-3 text-base bg-ivory-50/80 dark:bg-charcoal-700/60 border border-ivory-300 dark:border-charcoal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500/40 text-charcoal-900 dark:text-charcoal-100 transition-all placeholder:text-charcoal-400 placeholder:transition-opacity"
          />
          {isLoading && (
            <Loader2 className="absolute right-3.5 top-3.5 w-5 h-5 text-saffron-500 animate-spin" />
          )}
        </div>

        {/* Dynamic Animated Suggestion Text Banner & Quick Tags */}
        {!queryText && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-saffron-50/80 dark:bg-saffron-950/40 border border-saffron-200/60 dark:border-saffron-800/50 text-xs overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse flex-shrink-0" />
              <span className="font-semibold text-saffron-800 dark:text-saffron-300 whitespace-nowrap flex-shrink-0">
                Gợi ý tìm kiếm:
              </span>
              <div className="relative h-4 overflow-hidden flex-1 flex items-center">
                <span
                  key={suggestionIdx}
                  className="font-medium text-charcoal-700 dark:text-charcoal-200 truncate inline-block animate-fade-in-up"
                >
                  {PLACEHOLDERS[suggestionIdx].replace('Tìm kiếm ', '')}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                Từ khóa phổ biến
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQueryText(tag)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-ivory-100/80 dark:bg-charcoal-700/70 hover:bg-saffron-100 dark:hover:bg-saffron-900/40 text-charcoal-700 dark:text-charcoal-300 hover:text-saffron-800 dark:hover:text-saffron-200 transition-all cursor-pointer border border-ivory-200 dark:border-charcoal-600 hover:border-saffron-300 whitespace-nowrap active:scale-95"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="max-h-[55vh] overflow-y-auto space-y-4 pr-1">
          {queryText.trim().length < 2 && (
            <div className="py-8 text-center text-xs text-charcoal-400">
              Nhập từ khóa tìm kiếm (tối thiểu 2 ký tự) để tra cứu bài giảng, địa danh chùa, lộ trình học...
            </div>
          )}

          {results && (
            <>
              {/* Articles */}
              {results.articles?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-saffron-500" /> Bài viết Phật pháp
                  </h4>
                  <div className="space-y-1.5">
                    {results.articles.map((item) => (
                      <Link
                        key={item.id}
                        href={`/bai-viet/${item.slug}`}
                        onClick={onClose}
                        className="block p-2.5 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700/70 transition-colors"
                      >
                        <div className="text-sm font-medium text-charcoal-900 dark:text-charcoal-100">
                          {item.title}
                        </div>
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 line-clamp-1 mt-0.5">
                          {item.excerpt}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Temples */}
              {results.temples?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-jade-500" /> Chùa & Địa danh
                  </h4>
                  <div className="space-y-1.5">
                    {results.temples.map((item) => (
                      <Link
                        key={item.id}
                        href={`/chua-dia-danh/${item.slug}`}
                        onClick={onClose}
                        className="block p-2.5 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700/70 transition-colors"
                      >
                        <div className="text-sm font-medium text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
                          {item.name}
                          {item.is_verified && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-jade-100 dark:bg-jade-900/40 text-jade-700 dark:text-jade-300 rounded font-normal">
                              Xác minh
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                          {item.address}, {item.province}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio */}
              {results.audio?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-lotus-500" /> Pháp thoại & Audio
                  </h4>
                  <div className="space-y-1.5">
                    {results.audio.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700/70 transition-colors cursor-pointer"
                        onClick={onClose}
                      >
                        <div className="text-sm font-medium text-charcoal-900 dark:text-charcoal-100">
                          {item.title}
                        </div>
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                          Giảng sư: {item.speaker}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Paths */}
              {results.learningPaths?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-saffron-500" /> Lộ trình học Phật
                  </h4>
                  <div className="space-y-1.5">
                    {results.learningPaths.map((item) => (
                      <Link
                        key={item.id}
                        href={`/lo-trinh-hoc/${item.slug}`}
                        onClick={onClose}
                        className="block p-2.5 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700/70 transition-colors"
                      >
                        <div className="text-sm font-medium text-charcoal-900 dark:text-charcoal-100">
                          {item.title}
                        </div>
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.articles?.length === 0 &&
                results.temples?.length === 0 &&
                results.audio?.length === 0 &&
                results.learningPaths?.length === 0 && (
                  <div className="py-8 text-center text-sm text-charcoal-500">
                    Không tìm thấy nội dung phù hợp với từ khóa &ldquo;{queryText}&rdquo;. Quý đạo hữu hãy thử từ khóa khác.
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
