'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  List,
  Columns,
  Square,
  Maximize2,
  Minimize2,
  Info,
  Volume2,
  VolumeX,
  Bookmark,
} from 'lucide-react';
import { BookItem, BookPage } from './types';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { playPageTurnSound } from '@/lib/buddhistSounds';
import { incrementDailyPractice } from '@/lib/dailyPracticeProgress';
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
type FlipDirection = 'idle' | 'next' | 'prev';

export function BookReaderModal({ book, isOpen, onClose, initialPage = 1 }: BookReaderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('cream');
  const [fontSize, setFontSize] = useState<FontSizeType>('base');
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('heading');
  const [spreadMode, setSpreadMode] = useState(false); // 2 pages on desktop
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookInfo, setShowBookInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // 3D Page Flip animation state
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('idle');
  const [outgoingPage, setOutgoingPage] = useState<BookPage | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

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

  // Flatten and normalize all pages to Unicode NFC so Vietnamese diacritics never glitch
  const allPages: BookPage[] = useMemo(() => {
    if (!book?.chapters || book.chapters.length === 0) return [];
    return book.chapters.flatMap((c) =>
      c.pages.map((p) => ({
        ...p,
        chapterTitle: (p.chapterTitle || c.title || '').normalize('NFC'),
        title: (p.title || '').normalize('NFC'),
        content: (p.content || '').normalize('NFC'),
        quote: p.quote ? p.quote.normalize('NFC') : undefined,
        footnote: p.footnote ? p.footnote.normalize('NFC') : undefined,
      }))
    );
  }, [book]);

  const totalPages = allPages.length;

  useEffect(() => {
    if (isOpen && totalPages > 0) {
      const target = initialPage >= 1 && initialPage <= totalPages ? initialPage : 1;
      setCurrentPageIndex(target);
      setFlipDirection('idle');
      setOutgoingPage(null);
      setShowBookInfo(false);
      setShowToc(false);
      setShowSettings(false);
      incrementDailyPractice('doc-kinh', 1);
    }
  }, [isOpen, initialPage, totalPages]);

  const isTwoPage = spreadMode && !isMobile;
  const step = isTwoPage ? 2 : 1;

  const triggerPageFlip = useCallback(
    (direction: 'next' | 'prev', targetIndex: number, currentDisplayedPage: BookPage | null) => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);

      if (soundEnabled) {
        playPageTurnSound(0.28);
      }

      setOutgoingPage(currentDisplayedPage);
      setFlipDirection(direction);
      setCurrentPageIndex(targetIndex);

      flipTimeoutRef.current = setTimeout(() => {
        setFlipDirection('idle');
        setOutgoingPage(null);
      }, 560);
    },
    [soundEnabled]
  );

  const handleNextPage = useCallback(() => {
    if (currentPageIndex >= totalPages || flipDirection !== 'idle') return;
    const nextIndex = Math.min(totalPages, currentPageIndex + step);
    if (nextIndex !== currentPageIndex) {
      const pageBeingTurned = isTwoPage
        ? allPages[currentPageIndex] || allPages[currentPageIndex - 1]
        : allPages[currentPageIndex - 1];
      triggerPageFlip('next', nextIndex, pageBeingTurned || null);
    }
  }, [currentPageIndex, totalPages, flipDirection, step, isTwoPage, allPages, triggerPageFlip]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex <= 1 || flipDirection !== 'idle') return;
    const prevIndex = Math.max(1, currentPageIndex - step);
    if (prevIndex !== currentPageIndex) {
      const pageBeingTurned = allPages[prevIndex - 1] || null;
      triggerPageFlip('prev', prevIndex, pageBeingTurned);
    }
  }, [currentPageIndex, flipDirection, step, allPages, triggerPageFlip]);

  const jumpToPage = useCallback(
    (pageNum: number) => {
      const target = Math.max(1, Math.min(pageNum, totalPages));
      const aligned = isTwoPage ? (target % 2 === 1 ? target : target - 1) : target;
      if (aligned !== currentPageIndex) {
        const dir = aligned > currentPageIndex ? 'next' : 'prev';
        const refPage = allPages[currentPageIndex - 1] || null;
        triggerPageFlip(dir, aligned, refPage);
      }
      setShowToc(false);
      setShowBookInfo(false);
    },
    [totalPages, isTwoPage, currentPageIndex, allPages, triggerPageFlip]
  );

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
        e.preventDefault();
        handleNextPage();
      }
    },
    [isOpen, showToc, showSettings, showBookInfo, onClose, handleNextPage, handlePrevPage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) handleNextPage();
      else handlePrevPage();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

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

  const themeStyles = {
    cream: {
      roomBg: 'bg-[#EDE4D3]',
      paperBg: 'bg-[#FDFBF7] text-[#2B221A] border-[#DFD3BC]',
      backLeafBg: 'bg-[#F5EFE2] text-[#2B221A]',
      quoteBg: 'bg-[#F6EFE0] border-saffron-600 text-[#3B2E1E]',
      topBar: 'bg-[#E6DBC8] text-[#2B221A] border-[#D6C7AE]',
      bottomBar: 'bg-[#E6DBC8] text-[#2B221A] border-[#D6C7AE]',
      stackClass: 'book-paper-stack-light',
    },
    white: {
      roomBg: 'bg-[#E2E8F0]',
      paperBg: 'bg-[#FFFFFF] text-[#1E293B] border-[#CBD5E1]',
      backLeafBg: 'bg-[#F8FAFC] text-[#1E293B]',
      quoteBg: 'bg-[#F8FAFC] border-saffron-600 text-[#1E293B]',
      topBar: 'bg-[#FFFFFF] text-[#1E293B] border-[#E2E8F0]',
      bottomBar: 'bg-[#FFFFFF] text-[#1E293B] border-[#E2E8F0]',
      stackClass: 'book-paper-stack-light',
    },
    amber: {
      roomBg: 'bg-[#E2D3B5]',
      paperBg: 'bg-[#FAF2DE] text-[#332412] border-[#DBC8A4]',
      backLeafBg: 'bg-[#F2E6CA] text-[#332412]',
      quoteBg: 'bg-[#F2E4C4] border-amber-700 text-[#3D2C19]',
      topBar: 'bg-[#DCCBA8] text-[#332412] border-[#CBB68E]',
      bottomBar: 'bg-[#DCCBA8] text-[#332412] border-[#CBB68E]',
      stackClass: 'book-paper-stack-light',
    },
    dark: {
      roomBg: 'bg-[#0E0D0C]',
      paperBg: 'bg-[#1A1816] text-[#ECE8E1] border-[#2E2A26]',
      backLeafBg: 'bg-[#151311] text-[#ECE8E1]',
      quoteBg: 'bg-[#24201D] border-saffron-500 text-[#F5F2EB]',
      topBar: 'bg-[#161413] text-[#ECE8E1] border-[#282421]',
      bottomBar: 'bg-[#161413] text-[#ECE8E1] border-[#282421]',
      stackClass: 'book-paper-stack-dark',
    },
  }[theme];

  const fontSizeClass = {
    sm: 'text-[13px] sm:text-sm leading-[1.8]',
    base: 'text-sm sm:text-[16px] leading-[1.85]',
    lg: 'text-[15px] sm:text-[18px] leading-[1.9]',
  }[fontSize];

  const fontFamilyClass =
    fontFamily === 'heading'
      ? 'font-heading font-normal tracking-normal'
      : 'font-sans font-normal tracking-normal';

  const leftPage = allPages[currentPageIndex - 1] || null;
  const rightPage = isTwoPage && currentPageIndex < totalPages ? allPages[currentPageIndex] : null;
  const progressPercent = totalPages > 0 ? Math.min(100, Math.round((currentPageIndex / totalPages) * 100)) : 0;

  // Reusable Page Face Renderer so both static pages and the 3D turning leaf look 100% authentic
  const renderPageContent = (page: BookPage, isRightSide = false) => (
    <div className="flex-1 h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 select-text overflow-hidden relative">
      {/* 1. Top Running Header (Pinned, never overlapped) */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 mb-2.5 text-[10px] sm:text-xs tracking-wider uppercase font-sans font-semibold shrink-0 gap-3">
        <span className="truncate text-saffron-800/85 dark:text-saffron-400/85 font-bold">
          {page.chapterTitle || book.title}
        </span>
        <span className="truncate text-right opacity-60 hidden sm:inline">
          {book.title}
        </span>
      </div>

      {/* 2. Main Sutra / Book Content (Contained within its own bounds, never overflows header/footer) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll pr-1 py-1 space-y-3">
        {page.title && (
          <h2 className="font-heading text-[15px] sm:text-lg md:text-xl font-bold tracking-tight text-saffron-800 dark:text-saffron-400 border-l-3 border-saffron-600 pl-2.5 leading-snug">
            {page.title}
          </h2>
        )}

        <div className={cn(fontFamilyClass, 'whitespace-pre-line text-justify', fontSizeClass)}>
          {page.content}
        </div>

        {page.quote && (
          <div
            className={cn(
              'p-2.5 sm:p-3.5 rounded-xl border-l-3 mt-2 font-heading italic text-xs sm:text-sm leading-relaxed shadow-2xs',
              themeStyles.quoteBg
            )}
          >
            &ldquo;{page.quote}&rdquo;
          </div>
        )}
      </div>

      {/* 3. Bottom Running Footer (Pinned, separated by border-t, never overlaps content above) */}
      <div className="pt-2.5 mt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] sm:text-xs font-sans tabular-nums shrink-0 gap-3">
        <span className="truncate italic opacity-70">{page.footnote || book.author}</span>
        <span className="font-bold shrink-0 text-saffron-800 dark:text-saffron-400 whitespace-nowrap">
          — Trang {page.pageNumber} / {totalPages} —
        </span>
      </div>
    </div>
  );

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[99999] flex flex-col justify-between select-none overflow-hidden h-[100dvh] w-screen font-sans',
        themeStyles.roomBg
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`Đang đọc ${book.title}`}
    >
      {/* Top Golden Progress Bar */}
      <div className="w-full h-1 bg-black/10 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 1. TOP HEADER TOOLBAR */}
      <header
        className={cn(
          'w-full h-12 sm:h-14 px-3 sm:px-6 flex items-center justify-between border-b shadow-xs transition-colors shrink-0 z-30',
          themeStyles.topBar
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <div className="w-6 h-8 sm:w-7 sm:h-9 rounded-sm overflow-hidden shadow-2xs border border-black/15 shrink-0 hidden xs:block">
            <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <DharmaBookIcon className="w-3.5 h-3.5 text-saffron-700 dark:text-saffron-400 shrink-0" />
              <h1 className="font-heading text-xs sm:text-sm font-bold truncate max-w-[145px] xs:max-w-[190px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs opacity-75 truncate max-w-[175px] sm:max-w-sm">
              {leftPage?.chapterTitle || book.author}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Sound Effect Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all active:scale-95',
              soundEnabled
                ? 'bg-saffron-600/15 text-saffron-800 dark:text-saffron-300 border-saffron-600/30'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 border-black/10 opacity-60'
            )}
            title={soundEnabled ? 'Đang bật âm thanh lật giấy' : 'Đang tắt âm thanh lật giấy'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">{soundEnabled ? 'Âm lật giấy' : 'Tắt tiếng'}</span>
          </button>

          {/* Book Info */}
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

          {/* Table of Contents */}
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
            <span className="hidden sm:inline">Mục lục ({book.chapters?.length || 4})</span>
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

          {/* 1-Page vs 2-Page Spread on Desktop */}
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

          {/* Fullscreen toggle */}
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
            title="Đóng sách (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. BOOK INFO POPUP */}
      {showBookInfo && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-2xs" onClick={() => setShowBookInfo(false)} />
          <aside className="fixed inset-x-4 sm:inset-x-auto sm:right-6 top-16 z-50 sm:w-96 max-h-[80vh] bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-300 dark:border-charcoal-700 shadow-2xl p-4 sm:p-5 overflow-y-auto space-y-3.5 animate-scale-in text-charcoal-900 dark:text-charcoal-100">
            <div className="flex items-start justify-between border-b border-ivory-200 dark:border-charcoal-700 pb-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-saffron-600" />
                <h3 className="font-heading text-sm font-bold">Thông Tin Kinh Sách</h3>
              </div>
              <button onClick={() => setShowBookInfo(false)} className="text-charcoal-400 hover:text-charcoal-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="w-20 aspect-[3/4.2] rounded-lg overflow-hidden shadow-md shrink-0 border border-black/15">
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs font-sans">
                <h4 className="font-heading font-bold text-sm text-saffron-800 dark:text-saffron-400 leading-snug">
                  {book.title}
                </h4>
                <p className="opacity-85">
                  Tác giả: <strong>{book.author}</strong>
                </p>
                {book.translator && <p className="opacity-80 italic">Bản dịch: {book.translator}</p>}
                <p className="opacity-75 tabular-nums text-[11px] font-medium">
                  {totalPages} trang đọc chọn lọc ({book.chapters?.length || 4} chương) • Xuất bản {book.published_year || 2021}
                </p>
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
                  Mục Lục Kinh Sách ({totalPages} trang)
                </h3>
              </div>
              <button onClick={() => setShowToc(false)} className="p-1 rounded-lg text-charcoal-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2.5 overflow-y-auto flex-1 space-y-2">
              {book.chapters?.map((ch, idx) => (
                <div key={idx} className="rounded-xl border border-ivory-200/80 dark:border-charcoal-800 overflow-hidden">
                  <button
                    onClick={() => jumpToPage(ch.startPage)}
                    className={cn(
                      'w-full text-left p-2.5 transition-all flex items-center justify-between group',
                      currentPageIndex >= ch.startPage &&
                        currentPageIndex < ch.startPage + ch.pages.length
                        ? 'bg-saffron-50/90 dark:bg-charcoal-800 font-bold border-l-3 border-saffron-600'
                        : 'bg-ivory-50/50 dark:bg-charcoal-900 hover:bg-ivory-100/70'
                    )}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-saffron-700 dark:text-saffron-400 tracking-wider block">
                        Phần {idx + 1}
                      </span>
                      <p className="font-heading text-xs font-bold text-charcoal-900 dark:text-charcoal-100 truncate">
                        {ch.title}
                      </p>
                    </div>
                    <span className="text-[11px] text-saffron-700 dark:text-saffron-400 font-sans tabular-nums font-semibold shrink-0">
                      Trang {ch.startPage}
                    </span>
                  </button>
                  <div className="divide-y divide-ivory-100 dark:divide-charcoal-800/60 bg-white dark:bg-charcoal-900/60">
                    {ch.pages.map((p) => (
                      <button
                        key={p.pageNumber}
                        onClick={() => jumpToPage(p.pageNumber)}
                        className={cn(
                          'w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors',
                          currentPageIndex === p.pageNumber
                            ? 'text-saffron-700 dark:text-saffron-400 font-bold bg-saffron-50/40 dark:bg-saffron-950/20'
                            : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-50 dark:hover:bg-charcoal-800/40'
                        )}
                      >
                        <span className="truncate">• {p.title}</span>
                        <span className="text-[10px] tabular-nums opacity-65 shrink-0">Tr. {p.pageNumber}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
                <Sliders className="w-4 h-4 text-saffron-700 dark:text-saffron-400" /> Tùy Biến Trang Sách
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-1 text-charcoal-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Theme */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block">Màu Giấy Sách</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'cream', name: 'Giấy Kem Cổ', bg: 'bg-[#FDFBF7] text-[#2B2520] border-[#E8DFC9]' },
                  { id: 'white', name: 'Trắng Tinh Khiết', bg: 'bg-white text-slate-900 border-slate-300' },
                  { id: 'amber', name: 'Giấy Dó Vàng', bg: 'bg-[#FAF3DF] text-[#332515] border-[#E2D4B2]' },
                  { id: 'dark', name: 'Đêm Thiền Tĩnh', bg: 'bg-[#181615] text-[#E7E5E4] border-[#2A2724]' },
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
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block">Phông Chữ Tiếng Việt</span>
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
                  Hiện Đại (Be VN)
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 5. MAIN 3D BOOK STAGE */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative book-stage-3d"
      >
        {/* Left Turn Button (Desktop) */}
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex <= 1 || flipDirection !== 'idle'}
          className={cn(
            'absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-14 sm:w-12 sm:h-20 rounded-xl hidden md:flex items-center justify-center transition-all group shadow-sm',
            currentPageIndex <= 1
              ? 'opacity-20 cursor-not-allowed bg-black/5 dark:bg-white/5'
              : 'bg-black/10 hover:bg-saffron-700 hover:text-white dark:bg-white/10 text-charcoal-800 dark:text-charcoal-200 cursor-pointer hover:scale-105 active:scale-95'
          )}
          title="Lật trang trước (←)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Turn Button (Desktop) */}
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages || flipDirection !== 'idle'}
          className={cn(
            'absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-9 h-14 sm:w-12 sm:h-20 rounded-xl hidden md:flex items-center justify-center transition-all group shadow-sm',
            currentPageIndex >= totalPages
              ? 'opacity-20 cursor-not-allowed bg-black/5 dark:bg-white/5'
              : 'bg-black/10 hover:bg-saffron-700 hover:text-white dark:bg-white/10 text-charcoal-800 dark:text-charcoal-200 cursor-pointer hover:scale-105 active:scale-95'
          )}
          title="Lật trang sau (→)"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* PHYSICAL HARDCOVER BOOK FRAME WITH LAYERED PAPER STACK */}
        <div
          className={cn(
            'w-full h-full max-h-[640px] sm:max-h-[680px] md:max-h-[720px] flex items-stretch justify-center relative rounded-r-2xl rounded-l-md md:rounded-r-3xl md:rounded-l-lg border transition-colors duration-300 book-stage-3d',
            isTwoPage ? 'max-w-5xl xl:max-w-6xl rounded-2xl md:rounded-3xl' : 'max-w-2xl xl:max-w-3xl',
            themeStyles.paperBg,
            themeStyles.stackClass
          )}
        >
          {/* Realistic Book Spine Crease Shadow */}
          {!isTwoPage ? (
            <div className="absolute inset-y-0 left-0 w-6 sm:w-8 bg-gradient-to-r from-black/18 via-black/5 to-transparent pointer-events-none z-10 rounded-l-md" />
          ) : (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none z-10 hidden md:block" />
          )}

          {/* Shadows cast onto the stationary page during a 3D page flip */}
          {flipDirection !== 'idle' && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none z-20 animate-flip-shadow rounded-r-2xl"
              aria-hidden="true"
            />
          )}

          {/* LEFT PAGE (Or Single Page) */}
          {leftPage ? (
            <article
              className={cn(
                'flex-1 h-full flex flex-col justify-between relative overflow-hidden',
                isTwoPage && 'border-r border-black/10 dark:border-white/10'
              )}
            >
              {renderPageContent(leftPage, false)}
            </article>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm opacity-50">Hết nội dung</p>
            </div>
          )}

          {/* RIGHT PAGE (Only in 2-Page Spread Mode on Desktop) */}
          {isTwoPage && (
            <article className="flex-1 h-full hidden md:flex flex-col justify-between relative overflow-hidden">
              {rightPage ? (
                renderPageContent(rightPage, true)
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-75">
                  <DharmaBookIcon className="w-10 h-10 text-saffron-600 dark:text-saffron-400 opacity-60" />
                  <h3 className="font-heading text-sm font-bold">Đã đọc trọn vẹn tác phẩm</h3>
                  <p className="text-xs max-w-xs leading-relaxed opacity-80 italic font-heading">
                    &ldquo;Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo.&rdquo;
                  </p>
                </div>
              )}
            </article>
          )}

          {/* 3D ANIMATED TURNING PAGE LEAF OVERLAY */}
          {flipDirection !== 'idle' && outgoingPage && (
            <div
              className={cn(
                'absolute inset-y-0 z-30 pointer-events-none rounded-r-2xl overflow-hidden border-l border-black/15',
                isTwoPage ? 'left-1/2 right-0 hidden md:block' : 'inset-x-0',
                flipDirection === 'next' ? 'animate-page-flip-next' : 'animate-page-flip-prev'
              )}
            >
              {/* Front Face of Turning Leaf */}
              <div className={cn('w-full h-full flex flex-col justify-between page-face-front relative', themeStyles.paperBg)}>
                {renderPageContent(outgoingPage, false)}
                {/* Dynamic curved paper sheen & fold shadow during turn */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-white/20 to-black/10 pointer-events-none" />
              </div>

              {/* Back Face of Turning Leaf */}
              <div
                className={cn(
                  'absolute inset-0 w-full h-full page-face-back flex flex-col justify-between p-6 sm:p-9',
                  themeStyles.backLeafBg
                )}
              >
                <div className="w-full h-full border border-black/5 rounded-lg p-6 flex flex-col justify-between opacity-25 select-none transform -scale-x-100">
                  <div className="h-3 w-1/2 bg-current/30 rounded" />
                  <div className="space-y-3">
                    <div className="h-4 w-2/3 bg-current/40 rounded" />
                    <div className="h-2.5 w-full bg-current/25 rounded" />
                    <div className="h-2.5 w-11/12 bg-current/25 rounded" />
                    <div className="h-2.5 w-4/5 bg-current/25 rounded" />
                    <div className="h-2.5 w-full bg-current/25 rounded" />
                    <div className="h-2.5 w-3/4 bg-current/25 rounded" />
                  </div>
                  <div className="h-3 w-1/3 bg-current/30 rounded self-end" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Interactive Curled Page Corner (Bottom Right on Desktop - Click to Flip Next) */}
          {currentPageIndex < totalPages && (
            <button
              type="button"
              onClick={handleNextPage}
              title="Nhấn để lật sang trang tiếp theo"
              aria-label="Lật sang trang tiếp theo"
              className="group/corner absolute bottom-0 right-0 z-25 w-7 h-7 hidden sm:block overflow-hidden cursor-pointer focus:outline-none opacity-60 hover:opacity-100 transition-opacity"
            >
              <div
                className="w-full h-full transition-all duration-300 group-hover/corner:scale-125 origin-bottom-right"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 50%, rgba(181,137,46,0.28) 50%, rgba(253,251,247,0.95) 62%, rgba(160,94,8,0.35) 100%)',
                  boxShadow: '-2px -2px 6px rgba(0,0,0,0.1)',
                  borderTopLeftRadius: '8px',
                }}
              />
            </button>
          )}
        </div>
      </main>

      {/* 6. BOTTOM NAVIGATION BAR */}
      <footer
        className={cn(
          'w-full h-12 sm:h-14 px-3 sm:px-6 border-t shadow-md flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-30 transition-colors font-sans',
          themeStyles.bottomBar
        )}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex <= 1 || flipDirection !== 'idle'}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-black/5 hover:bg-saffron-700 hover:text-white dark:bg-white/10 dark:hover:bg-saffron-600 disabled:opacity-25 text-xs font-bold active:scale-95 transition-all shrink-0 whitespace-nowrap"
        >
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Trang Trước</span>
        </button>

        {/* Center Scrubber & Page Indicator */}
        <div className="flex-1 max-w-sm sm:max-w-md flex items-center gap-2 sm:gap-3 mx-1 sm:mx-2">
          <span className="text-xs font-sans tabular-nums font-bold whitespace-nowrap text-saffron-800 dark:text-saffron-400 shrink-0">
            {isTwoPage && rightPage
              ? `Trang ${leftPage?.pageNumber}-${rightPage.pageNumber} / ${totalPages}`
              : `Trang ${leftPage?.pageNumber || 1} / ${totalPages}`}
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
            className="w-full accent-saffron-700 dark:accent-saffron-500 cursor-pointer h-1.5 rounded-lg bg-black/20 dark:bg-white/20 touch-none hidden xs:block"
            aria-label="Thanh trượt trang sách"
          />
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages || flipDirection !== 'idle'}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white disabled:opacity-25 text-xs font-bold active:scale-95 transition-all shrink-0 whitespace-nowrap shadow-2xs"
        >
          <span>Lật Trang Sau</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </footer>
    </div>,
    document.body
  );
}

export default BookReaderModal;
