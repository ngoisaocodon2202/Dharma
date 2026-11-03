'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Flame, Bell, Sparkles, Moon, Sun, Volume2, Menu } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
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
  { id: 'lich-su', name: 'Lịch Sử Phật Giáo', href: '/lich-su-phat-giao', badge: 'Mới' },
  { id: 'lich-nhac', name: 'Lịch Nhắc Nhở', href: '/lich-phat-giao', badge: 'Âm Lịch' },
  { id: 'tu-vi', name: 'Màu & Ngày Tốt', href: '/tu-vi', badge: 'Hot' },
  { id: 'ai-phat-phap', name: 'AI Phật Pháp', href: '/hoi-dap-ai', badge: '24/7' },
  { id: 'bai-viet', name: 'Bài Giảng Sư Thầy', href: '/bai-viet' },
  { id: 'tung-kinh', name: 'Tụng Kinh', href: '/thu-vien' },
  { id: 'phap-thoai', name: 'Pháp Thoại', href: '/phap-thoai' },
  { id: 'phong-thien', name: 'Phòng Thiền', href: '/phong-thien' },
  { id: 'chua', name: 'Danh Lam Cổ Tự', href: '/chua-dia-danh' },
];

export function OmManiMobileHeader({ onOpenMenu }: OmManiMobileHeaderProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleRingBell = () => {
    playBellSound(0.5);
  };

  return (
    <>
      {/* ================= NATIVE-APP HEADER FOR MOBILE ================= */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-ivory-200 dark:border-charcoal-800 transition-colors">
        {/* Top App Bar */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Avatar & App Branding / Daily Greeting */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link href="/" className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-saffron-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-amber-50 dark:bg-charcoal-900 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Phật Pháp"
                    width={36}
                    height={36}
                    style={{ width: 36, height: 36, objectFit: 'cover' }}
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
              </div>
            </Link>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm tracking-tight text-charcoal-900 dark:text-charcoal-50 truncate">
                  BỒ ĐỀ TÂM • PHẬT PHÁP
                </span>
              </div>
              <p className="text-[10px] text-saffron-700 dark:text-saffron-400 font-medium truncate flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                <span>
                  {user
                    ? `Chào ${user.dharma_name || user.full_name}`
                    : 'Nam Mô Bổn Sư Thích Ca Mâu Ni'}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Language Switcher + Quick Action Buttons (Thắp Hương, Gõ Chuông, Tìm kiếm, Menu) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Compact Multi-Language Switcher */}
            <LanguageSwitcher compact />

            {/* Quick Thắp Hương Button */}
            <button
              onClick={() => setIsIncenseOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 text-[11px] font-semibold transition-all active:scale-95 shadow-2xs whitespace-nowrap"
              title="Thắp hương online"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse shrink-0" />
              <span>Thắp hương</span>
            </button>

            {/* Quick Gõ Chuông Button */}
            <button
              onClick={handleRingBell}
              className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-charcoal-800 transition-colors active:scale-90"
              title="Gõ chuông thanh tịnh"
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors active:scale-90"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Hamburger / All Pages Drawer Toggle */}
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="p-1.5 rounded-full text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors active:scale-90"
                title="Mục lục tất cả trang"
              >
                <Menu className="w-4 h-4 text-charcoal-700 dark:text-charcoal-200" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Pill Tabs (Exact Om Mani App Style) */}
        <div className="px-3 pb-2.5 pt-1 overflow-x-auto no-scrollbar flex items-center gap-2 max-w-7xl mx-auto">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1 select-none',
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-saffron-500 to-amber-600 text-white shadow-xs scale-102 ring-1.5 ring-amber-300/50'
                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200 dark:hover:bg-charcoal-700'
                )}
              >
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-rose-500 text-white font-extrabold uppercase">
                    {tab.badge}
                  </span>
                )}
              </a>
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
