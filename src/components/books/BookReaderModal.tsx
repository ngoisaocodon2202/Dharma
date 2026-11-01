'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sliders,
  List,
  Columns,
  Square,
  Maximize2,
  Minimize2,
  Info,
  Sparkles
} from 'lucide-react';
import { BookItem, BookPage } from './types';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { cn } from '@/lib/utils';

interface BookReaderModalProps {
  book: BookItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

type ThemeType = 'cream' | 'white' | 'amber' | 'dark';
type FontSizeType = 'sm' | 'base' | 'lg';
type FontFamilyType = 'heading' | 'sans';

export function BookReaderModal({ book, isOpen, onClose, initialPage = 1 }: BookReaderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('cream');
  const [fontSize, setFontSize] = useState<FontSizeType>('base');
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('heading');
  const [spreadMode, setSpreadMode] = useState(false); // 2 pages on desktop
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookInfo, setShowBookInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(1); // Start directly on Page 1
  const [isMobile, setIsMobile] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Mount detection for React portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Screen resize detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSpreadMode(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Flatten and normalize all pages to NFC
  const allPages: BookPage[] = useMemo(() => {
    if (!book?.chapters || book.chapters.length === 0) return [];
    return book.chapters.flatMap((c) =>
      c.pages.map((p) => ({
        ...p,
        chapterTitle: (p.chapterTitle || '').normalize('NFC'),
        title: (p.title || '').normalize('NFC'),
        content: (p.content || '').normalize('NFC'),
        quote: p.quote ? p.quote.normalize('NFC') : undefined,
        footnote: p.footnote ? p.footnote.normalize('NFC') : undefined,
      }))
    );
  }, [book]);

  const totalPages = allPages.length;

  // Reset directly to Page 1 (or requested initial page) when book opens
  useEffect(() => {
    if (isOpen && totalPages > 0) {
      const target = initialPage >= 1 && initialPage <= totalPages ? initialPage : 1;
      setCurrentPageIndex(target);
      setShowBookInfo(false);
      setShowToc(false);
      setShowSettings(false);
    }
  }, [isOpen, initialPage, totalPages]);

  // Page navigation logic
  const isTwoPage = spreadMode && !isMobile;
  const step = isTwoPage ? 2 : 1;

  const handleNextPage = useCallback(() => {
    setCurrentPageIndex((prev) => {
      const next = prev + step;
      return next <= totalPages ? next : prev;
    });
  }, [step, totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPageIndex((prev) => {
      const next = prev - step;
      return next >= 1 ? next : 1;
    });
  }, [step]);

  const jumpToPage = useCallback(
    (pageNum: number) => {
      const target = Math.max(1, Math.min(pageNum, totalPages));
      // In 2-page mode, align to odd page so pairs are consistent
      const aligned = isTwoPage ? (target % 2 === 1 ? target : target - 1) : target;
      setCurrentPageIndex(aligned);
      setShowToc(false);
      setShowBookInfo(false);
    },
    [totalPages, isTwoPage]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (showToc) setShowToc(false);
        else if (showSettings) setShowSettings(false);
        else if (showBookInfo) setShowBookInfo(false);
        else onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      }
    },
    [isOpen, showToc, showSettings, showBookInfo, onClose, handleNextPage, handlePrevPage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch Swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) handleNextPage();
      else handlePrevPage();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !book) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Theme palettes (100% Solid Opaque)
  const themeStyles = {
    cream: {
      roomBg: 'bg-[#F2ECE1]',
      paperBg: 'bg-[#FDFBF7] text-[#2B2520] border-[#E5DAC4]',
      quoteBg: 'bg-[#F6EFE2] border-saffron-600 text-[#362E25]',
      topBar: 'bg-[#E8DFCE] text-[#2B2520] border-[#DDD1BE]',
      bottomBar: 'bg-[#E8DFCE] text-[#2B2520] border-[#DDD1BE]',
      accentColor: 'text-saffron-800 dark:text-saffron-400',
    },
    white: {
      roomBg: 'bg-[#F1F5F9]',
      paperBg: 'bg-[#FFFFFF] text-[#1E293B] border-[#E2E8F0]',
      quoteBg: 'bg-[#F8FAFC] border-saffron-600 text-[#1E293B]',
      topBar: 'bg-[#FFFFFF] text-[#1E293B] border-[#E2E8F0]',
      bottomBar: 'bg-[#FFFFFF] text-[#1E293B] border-[#E2E8F0]',
      accentColor: 'text-saffron-700',
    },
    amber: {
      roomBg: 'bg-[#E8DCC2]',
      paperBg: 'bg-[#FAF3DF] text-[#332515] border-[#E2D4B2]',
      quoteBg: 'bg-[#F2E5C7] border-amber-700 text-[#3D2C19]',
      topBar: 'bg-[#DFD0B2] text-[#332515] border-[#D1BF9D]',
      bottomBar: 'bg-[#DFD0B2] text-[#332515] border-[#D1BF9D]',
      accentColor: 'text-amber-800',
    },
    dark: {
      roomBg: 'bg-[#100F0E]',
      paperBg: 'bg-[#181615] text-[#E7E5E4] border-[#2A2724]',
      quoteBg: 'bg-[#221F1D] border-saffron-500 text-[#F5F5F4]',
      topBar: 'bg-[#161413] text-[#E7E5E4] border-[#262321]',
      bottomBar: 'bg-[#161413] text-[#E7E5E4] border-[#262321]',
      accentColor: 'text-saffron-400',
    },
  }[theme];

  const fontSizeClass = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
  }[fontSize];

  const fontFamilyClass =
    fontFamily === 'heading'
      ? 'font-heading font-normal tracking-wide'
      : 'font-sans font-normal tracking-normal';

  // Current page records
  const leftPage = allPages[currentPageIndex - 1] || null;
  const rightPage = isTwoPage && currentPageIndex < totalPages ? allPages[currentPageIndex] : null;

  const progressPercent = totalPages > 0 ? Math.min(100, Math.round((currentPageIndex / totalPages) * 100)) : 0;

  // The Modal UI Portaled directly to document.body
  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[99999] flex flex-col justify-between select-none overflow-hidden h-[100dvh] w-screen',
        themeStyles.roomBg
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`Đang đọc ${book.title}`}
    >
      {/* Golden progress line at top */}
      <div className="w-full h-1 bg-black/10 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-saffron-500 to-amber-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 1. TOP HEADER TOOLBAR (Clean & Compact: 50px) */}
      <header
        className={cn(
          'w-full h-12 sm:h-14 px-3 sm:px-6 flex items-center justify-between border-b shadow-xs transition-colors shrink-0 z-30',
          themeStyles.topBar
        )}
      >
        {/* Book Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <div className="w-6 h-8 sm:w-7 sm:h-9 rounded-sm overflow-hidden shadow-2xs border border-black/15 shrink-0 hidden xs:block">
            <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <DharmaBookIcon className="w-3.5 h-3.5 text-saffron-700 dark:text-saffron-400 shrink-0" />
              <h1 className="font-heading text-xs sm:text-sm font-bold truncate max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs opacity-75 truncate max-w-[180px] sm:max-w-sm">
              {leftPage?.chapterTitle || book.author}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Book Info button */}
          <button
            onClick={() => {
              setShowBookInfo(!showBookInfo);
              setShowToc(false);
              setShowSettings(false);
            }}
            className={cn(
              'px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all active:scale-95',
              showBookInfo
                ? 'bg-saffron-700 text-white border-saffron-800 shadow-xs'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/15'
            )}
            title="Xem thông tin & tóm tắt sách"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Thông tin</span>
          </button>

          {/* Table of contents */}
          <button
            onClick={() => {
              setShowToc(!showToc);
              setShowSettings(false);
              setShowBookInfo(false);
            }}
            className={cn(
              'px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all active:scale-95',
              showToc
                ? 'bg-saffron-700 text-white border-saffron-800 shadow-xs'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/15'
            )}
            title="Mục lục tác phẩm"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mục lục</span>
          </button>

          {/* Reading Preferences */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowToc(false);
              setShowBookInfo(false);
            }}
            className={cn(
              'px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all active:scale-95',
              showSettings
                ? 'bg-saffron-700 text-white border-saffron-800 shadow-xs'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/15'
            )}
            title="Cỡ chữ & Màu giấy"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tùy biến</span>
          </button>

          {/* View mode toggle on Desktop: 1-Page vs 2-Pages spread */}
          {!isMobile && (
            <button
              onClick={() => setSpreadMode(!spreadMode)}
              className={cn(
                'p-1.5 sm:p-2 rounded-lg text-xs font-semibold border hidden lg:flex items-center gap-1 transition-all',
                spreadMode
                  ? 'bg-saffron-700 text-white border-saffron-800'
                  : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 border-black/10'
              )}
              title={spreadMode ? 'Chuyển về 1 trang' : 'Mở 2 trang song song'}
            >
              {spreadMode ? <Square className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{spreadMode ? '1 Trang' : '2 Trang'}</span>
            </button>
          )}

          {/* Fullscreen toggle (Desktop) */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 text-xs hidden sm:block"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors active:scale-95 ml-0.5"
            title="Đóng phòng đọc (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. COMPACT BOOK INFO POPUP (Clean & Non-intrusive) */}
      {showBookInfo && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-2xs" onClick={() => setShowBookInfo(false)} />
          <aside className="fixed inset-x-4 sm:inset-x-auto sm:right-6 top-16 z-50 sm:w-96 max-h-[80vh] bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-300 dark:border-charcoal-700 shadow-2xl p-4 sm:p-5 overflow-y-auto space-y-3.5 animate-scale-in text-charcoal-900 dark:text-charcoal-100">
            <div className="flex items-start justify-between border-b border-ivory-200 dark:border-charcoal-700 pb-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-saffron-600" />
                <h3 className="font-heading text-sm font-bold">Thông Tin Tác Phẩm</h3>
              </div>
              <button onClick={() => setShowBookInfo(false)} className="text-charcoal-400 hover:text-charcoal-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="w-20 aspect-[3/4.2] rounded-lg overflow-hidden shadow-md shrink-0 border border-black/15">
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-heading font-bold text-sm text-saffron-800 dark:text-saffron-400 leading-snug">
                  {book.title}
                </h4>
                <p className="opacity-80">Tác giả: <strong>{book.author}</strong></p>
                {book.translator && <p className="opacity-80 italic">Dịch: {book.translator}</p>}
                <p className="opacity-70 font-mono text-[11px]">{book.total_pages} trang • Năm {book.published_year || 2020}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-charcoal-600 dark:text-charcoal-300 border-t border-ivory-100 dark:border-charcoal-800 pt-2.5">
              {book.description}
            </p>
          </aside>
        </>
      )}

      {/* 3. TABLE OF CONTENTS DRAWER */}
      {showToc && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-2xs" onClick={() => setShowToc(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-80 max-w-[85vw] bg-white dark:bg-charcoal-900 border-r border-ivory-300 dark:border-charcoal-700 shadow-2xl overflow-hidden flex flex-col animate-slide-right">
            <div className="p-3.5 bg-ivory-100 dark:bg-charcoal-800 border-b border-ivory-200 dark:border-charcoal-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-saffron-700 dark:text-saffron-400" />
                <h3 className="font-heading text-sm font-bold text-charcoal-900 dark:text-charcoal-50">
                  Mục Lục Tác Phẩm
                </h3>
              </div>
              <button onClick={() => setShowToc(false)} className="p-1 rounded-lg text-charcoal-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto flex-1 divide-y divide-ivory-100 dark:divide-charcoal-800">
              {book.chapters?.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToPage(ch.startPage)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group active:scale-98',
                    currentPageIndex === ch.startPage
                      ? 'bg-saffron-50 dark:bg-charcoal-800 font-bold border-l-3 border-saffron-600'
                      : 'hover:bg-ivory-50 dark:hover:bg-charcoal-800/60'
                  )}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] uppercase font-bold text-saffron-700 dark:text-saffron-400 tracking-wider block">
                      Phần {idx + 1}
                    </span>
                    <p className="font-heading text-xs font-semibold text-charcoal-800 dark:text-charcoal-200 group-hover:text-saffron-700 dark:group-hover:text-saffron-400 truncate">
                      {ch.title}
                    </p>
                  </div>
                  <span className="text-[11px] text-charcoal-400 font-mono shrink-0">Trang {ch.startPage}</span>
                </button>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* 4. SETTINGS DRAWER */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-2xs" onClick={() => setShowSettings(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 max-w-[85vw] bg-white dark:bg-charcoal-900 border-l border-ivory-300 dark:border-charcoal-700 shadow-2xl p-4 sm:p-5 space-y-5 overflow-y-auto animate-slide-left text-charcoal-900 dark:text-charcoal-100">
            <div className="flex items-center justify-between border-b border-ivory-200 dark:border-charcoal-700 pb-2.5">
              <h3 className="font-heading text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-saffron-700 dark:text-saffron-400" /> Tùy Biến Đọc Sách
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-1 text-charcoal-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Theme */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block">Màu Giấy</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'cream', name: 'Giấy Kem', bg: 'bg-[#FDFBF7] text-[#2B2520] border-[#E8DFC9]' },
                  { id: 'white', name: 'Trắng Sạch', bg: 'bg-white text-slate-900 border-slate-300' },
                  { id: 'amber', name: 'Hoàng Thổ', bg: 'bg-[#FAF3DF] text-[#332515] border-[#E2D4B2]' },
                  { id: 'dark', name: 'Đêm Tĩnh', bg: 'bg-[#181615] text-[#E7E5E4] border-[#2A2724]' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeType)}
                    className={cn(
                      'p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-all active:scale-95 shadow-2xs',
                      t.bg,
                      theme === t.id ? 'ring-2 ring-saffron-600 font-bold' : 'opacity-85 hover:opacity-100'
                    )}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{
                        backgroundColor:
                          t.id === 'dark' ? '#000' : t.id === 'white' ? '#fff' : t.id === 'amber' ? '#f59e0b' : '#fef08a',
                      }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Font Size */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block">Cỡ Chữ</span>
              <div className="grid grid-cols-3 gap-1.5 bg-ivory-100 dark:bg-charcoal-800 p-1.5 rounded-xl">
                {(['sm', 'base', 'lg'] as FontSizeType[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={cn(
                      'py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95',
                      fontSize === sz
                        ? 'bg-saffron-700 text-white shadow-xs'
                        : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900'
                    )}
                  >
                    {sz === 'sm' ? 'Nhỏ' : sz === 'base' ? 'Vừa' : 'Lớn'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block">Kiểu Chữ</span>
              <div className="grid grid-cols-2 gap-1.5 bg-ivory-100 dark:bg-charcoal-800 p-1.5 rounded-xl">
                <button
                  onClick={() => setFontFamily('heading')}
                  className={cn(
                    'py-2 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-center font-heading',
                    fontFamily === 'heading'
                      ? 'bg-saffron-700 text-white shadow-xs'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900'
                  )}
                >
                  Kinh Điển (Lora)
                </button>
                <button
                  onClick={() => setFontFamily('sans')}
                  className={cn(
                    'py-2 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-center font-sans',
                    fontFamily === 'sans'
                      ? 'bg-saffron-700 text-white shadow-xs'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900'
                  )}
                >
                  Hiện Đại (Sans)
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 5. MAIN STAGE - VIEWPORT-FITTED NATURAL BOOK CONTAINER */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative"
      >
        {/* Left Turn Button (Desktop) */}
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex <= 1}
          className={cn(
            'absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-14 sm:w-12 sm:h-20 rounded-xl hidden md:flex items-center justify-center transition-all group shadow-sm',
            currentPageIndex <= 1
              ? 'opacity-20 cursor-not-allowed bg-black/5 dark:bg-white/5'
              : 'bg-black/10 hover:bg-saffron-700 hover:text-white dark:bg-white/10 text-charcoal-800 dark:text-charcoal-200 cursor-pointer hover:scale-105 active:scale-95'
          )}
          title="Trang trước (←)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Turn Button (Desktop) */}
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages}
          className={cn(
            'absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-14 sm:w-12 sm:h-20 rounded-xl hidden md:flex items-center justify-center transition-all group shadow-sm',
            currentPageIndex >= totalPages
              ? 'opacity-20 cursor-not-allowed bg-black/5 dark:bg-white/5'
              : 'bg-black/10 hover:bg-saffron-700 hover:text-white dark:bg-white/10 text-charcoal-800 dark:text-charcoal-200 cursor-pointer hover:scale-105 active:scale-95'
          )}
          title="Trang sau (→)"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* THE FITTED BOOK CONTAINER - Fits 100% inside screen, NO clipping, NO scrolling! */}
        <div
          className={cn(
            'w-full h-full max-h-[580px] sm:max-h-[620px] md:max-h-[660px] flex items-stretch justify-center relative rounded-2xl md:rounded-3xl border transition-all duration-300 shadow-xl overflow-hidden',
            isTwoPage ? 'max-w-5xl xl:max-w-6xl' : 'max-w-2xl xl:max-w-3xl',
            themeStyles.paperBg
          )}
        >
          {/* LEFT PAGE (Or Single Page) */}
          {leftPage ? (
            <article
              className={cn(
                'flex-1 h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 select-text overflow-y-auto no-scrollbar',
                isTwoPage && 'border-r border-black/10 dark:border-white/10'
              )}
            >
              {/* Top Running Header */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 mb-3 text-[10px] sm:text-xs tracking-wider uppercase font-semibold opacity-60 shrink-0">
                <span className="truncate max-w-[160px] sm:max-w-xs">{book.title}</span>
                <span className="truncate max-w-[160px] sm:max-w-xs">{leftPage.chapterTitle}</span>
              </div>

              {/* Main Text Content */}
              <div className="flex-1 space-y-3 min-h-0 flex flex-col justify-center">
                {leftPage.title && (
                  <h2 className="font-heading text-base sm:text-xl font-bold tracking-tight text-saffron-800 dark:text-saffron-400 mb-1 border-l-3 border-saffron-600 pl-2.5">
                    {leftPage.title}
                  </h2>
                )}

                <div className={cn(fontFamilyClass, 'whitespace-pre-line text-left', fontSizeClass)}>
                  {leftPage.content}
                </div>

                {/* Golden quote box */}
                {leftPage.quote && (
                  <div
                    className={cn(
                      'p-3 sm:p-3.5 rounded-xl border-l-3 my-2 font-heading italic text-xs sm:text-sm leading-relaxed shadow-2xs',
                      themeStyles.quoteBg
                    )}
                  >
                    &ldquo;{leftPage.quote}&rdquo;
                  </div>
                )}
              </div>

              {/* Bottom Running Footer */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-end justify-between text-[10px] sm:text-xs opacity-60 font-mono shrink-0 mt-2">
                <span className="truncate max-w-[70%] italic">{leftPage.footnote || ''}</span>
                <span className="font-bold shrink-0">— Trang {leftPage.pageNumber} —</span>
              </div>
            </article>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm opacity-50">Hết nội dung</p>
            </div>
          )}

          {/* RIGHT PAGE (Only in 2-Page mode on desktop) */}
          {isTwoPage && (
            <article className="flex-1 h-full hidden md:flex flex-col justify-between p-4 sm:p-7 md:p-9 select-text overflow-y-auto no-scrollbar">
              {rightPage ? (
                <>
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 mb-3 text-[10px] sm:text-xs tracking-wider uppercase font-semibold opacity-60 shrink-0">
                    <span className="truncate max-w-xs">{rightPage.chapterTitle}</span>
                    <span className="truncate max-w-xs">{book.title}</span>
                  </div>

                  <div className="flex-1 space-y-3 min-h-0 flex flex-col justify-center">
                    {rightPage.title && (
                      <h2 className="font-heading text-base sm:text-xl font-bold tracking-tight text-saffron-800 dark:text-saffron-400 mb-1 border-l-3 border-saffron-600 pl-2.5">
                        {rightPage.title}
                      </h2>
                    )}

                    <div className={cn(fontFamilyClass, 'whitespace-pre-line text-left', fontSizeClass)}>
                      {rightPage.content}
                    </div>

                    {rightPage.quote && (
                      <div
                        className={cn(
                          'p-3 sm:p-3.5 rounded-xl border-l-3 my-2 font-heading italic text-xs sm:text-sm leading-relaxed shadow-2xs',
                          themeStyles.quoteBg
                        )}
                      >
                        &ldquo;{rightPage.quote}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-end justify-between text-[10px] sm:text-xs opacity-60 font-mono shrink-0 mt-2">
                    <span className="truncate max-w-[70%] italic">{rightPage.footnote || ''}</span>
                    <span className="font-bold shrink-0">— Trang {rightPage.pageNumber} —</span>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-75">
                  <DharmaBookIcon className="w-10 h-10 text-saffron-600 dark:text-saffron-400 opacity-60" />
                  <h3 className="font-heading text-sm font-bold">Đã xem hết các trang trích dẫn</h3>
                  <p className="text-xs max-w-xs leading-relaxed opacity-80">
                    &ldquo;Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo.&rdquo;
                  </p>
                </div>
              )}
            </article>
          )}
        </div>
      </main>

      {/* 6. BOTTOM NAVIGATION BAR (Compact & Responsive: 48px) */}
      <footer
        className={cn(
          'w-full h-12 sm:h-14 px-3 sm:px-6 border-t shadow-md flex items-center justify-between gap-3 shrink-0 z-30 transition-colors',
          themeStyles.bottomBar
        )}
      >
        {/* Prev Page Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex <= 1}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 disabled:opacity-25 text-xs font-bold active:scale-95 transition-all shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Trang Trước</span>
        </button>

        {/* Center: Page indicator & Scrubber */}
        <div className="flex-1 max-w-sm sm:max-w-md flex items-center gap-2 sm:gap-3 mx-2">
          <span className="text-xs font-mono font-bold whitespace-nowrap text-saffron-800 dark:text-saffron-400 shrink-0">
            {isTwoPage && rightPage
              ? `${leftPage?.pageNumber}-${rightPage.pageNumber} / ${totalPages}`
              : `${leftPage?.pageNumber || 1} / ${totalPages}`}
          </span>
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPageIndex}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              jumpToPage(val);
            }}
            className="w-full accent-saffron-700 dark:accent-saffron-500 cursor-pointer h-1.5 rounded-lg bg-black/20 dark:bg-white/20 touch-none"
            aria-label="Thanh trượt trang sách"
          />
        </div>

        {/* Next Page Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 disabled:opacity-25 text-xs font-bold active:scale-95 transition-all shrink-0"
        >
          <span className="hidden xs:inline">Trang Sau</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>,
    document.body
  );
}

export default BookReaderModal;
