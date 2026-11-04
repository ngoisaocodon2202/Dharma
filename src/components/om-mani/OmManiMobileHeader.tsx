'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Flame, Bell, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { playBellSound } from '@/lib/buddhistSounds';
import { IncenseOfferingModal, MalaBeadsModal } from './OmManiInteractiveTools';
import { SearchModal } from '@/components/layout/SearchModal';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { cn } from '@/lib/utils';

interface OmManiMobileHeaderProps {
  onOpenMenu?: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', name: 'Trang chủ', href: '/' },
  { id: 'cau-nguyen', name: 'Cầu Nguyện Online', href: '/cau-nguyen', badge: 'Linh thiêng' },
  { id: 'lich-su', name: 'Lịch Sử Phật Giáo', href: '/lich-su-phat-giao', badge: 'Mới' },
  { id: 'lich-nhac', name: 'Lịch Nhắc Nhở', href: '/lich-phat-giao' },
  { id: 'tu-vi', name: 'Màu & Ngày Tốt', href: '/tu-vi' },
  { id: 'ai-phat-phap', name: 'AI Phật Pháp', href: '/hoi-dap-ai' },
  { id: 'bai-viet', name: 'Bài Giảng Sư Thầy', href: '/bai-viet' },
  { id: 'tung-kinh', name: 'Tụng Kinh', href: '/thu-vien' },
  { id: 'phap-thoai', name: 'Pháp Thoại', href: '/phap-thoai' },
  { id: 'phong-thien', name: 'Phòng Thiền', href: '/phong-thien' },
  { id: 'chua', name: 'Danh Lam Cổ Tự', href: '/chua-dia-danh' },
];

export function OmManiMobileHeader({ onOpenMenu }: OmManiMobileHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Horizontal drag + wheel scroll for Category Pill Tabs
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Auto-center active pill on route change
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      const targetLeft =
        activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [pathname]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleRingBell = () => {
    playBellSound(0.5);
  };

  return (
    <>
      {/* ================= NATIVE-APP HEADER FOR MOBILE ================= */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-ivory-200 dark:border-charcoal-800 transition-colors">
        {/* Top App Bar */}
        <div className="px-3 py-2 flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Avatar & App Branding / Daily Greeting */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link href="/" className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 via-saffron-500 to-amber-700 p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-[13px] bg-amber-50 dark:bg-charcoal-900 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Phật Pháp"
                    width={34}
                    height={34}
                    style={{ width: 34, height: 34, objectFit: 'cover' }}
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
              </div>
            </Link>

            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <span className="font-heading font-extrabold text-xs sm:text-sm tracking-tight text-charcoal-900 dark:text-charcoal-50 truncate whitespace-nowrap block">
                PHẬT PHÁP • BỒ ĐỀ TÂM
              </span>
              <p className="text-[10px] text-saffron-700 dark:text-saffron-400 font-medium truncate flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                <span className="truncate">
                  {user
                    ? `Chào ${user.dharma_name || user.full_name}`
                    : 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật'}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Language Switcher + Quick Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Compact Multi-Language Switcher */}
            <LanguageSwitcher compact />

            {/* Quick Gõ Chuông Button */}
            <button
              onClick={handleRingBell}
              className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-charcoal-800 transition-colors active:scale-90 shrink-0"
              title="Gõ chuông thanh tịnh"
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors active:scale-90 shrink-0"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Hamburger / All Pages Drawer Toggle */}
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors active:scale-90 shrink-0"
                title="Mục lục tất cả trang"
              >
                <Menu className="w-4 h-4 text-charcoal-700 dark:text-charcoal-200" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Pill Tabs — Supports Touch Swipe, Mouse Drag & Mouse Wheel */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
          className="w-full px-3 pb-2.5 pt-1 overflow-x-auto no-scrollbar flex items-center gap-2 cursor-grab active:cursor-grabbing select-none"
        >
          {CATEGORY_TABS.map((tab) => {
            const isSelected =
              tab.href === '/'
                ? pathname === '/'
                : pathname === tab.href || pathname?.startsWith(tab.href + '/');

            return (
              <Link
                key={tab.id}
                href={tab.href}
                draggable={false}
                data-active={isSelected ? 'true' : 'false'}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 select-none',
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-saffron-500 to-amber-600 text-white shadow-xs ring-1 ring-amber-300/60'
                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200 dark:hover:bg-charcoal-700'
                )}
              >
                <span className="whitespace-nowrap">{tab.name}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold uppercase leading-none whitespace-nowrap">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Modals */}
      <IncenseOfferingModal
        isOpen={isIncenseOpen}
        onClose={() => setIsIncenseOpen(false)}
      />
      <MalaBeadsModal
        isOpen={isMalaOpen}
        onClose={() => setIsMalaOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
