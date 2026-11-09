'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Search } from 'lucide-react';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { useAuth } from '@/components/auth/AuthContext';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { SearchModal } from '@/components/layout/SearchModal';
import { playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Khai Tâm', href: '/', icon: LotusMinimalIcon },
  { name: 'Lịch Vạn Niên', href: '/lich-phat-giao', icon: Calendar },
  { name: 'Hành Trì', href: '/thuc-hanh', icon: DharmaWheelIcon },
  { name: 'Kinh Tạng', href: '/thu-vien', icon: SutraScrollIcon },
  { name: 'Cư Sĩ', href: '/ho-so', icon: BodhiLeafIcon },
];

export function OmManiDesktopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRingMindfulnessBell = () => {
    playGrandTempleBellSound(0.5);
    showToast('Thở vào tâm tĩnh lặng, thở ra miệng mỉm cười');
  };

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 w-full bg-[#181207]/95 backdrop-blur-xl border-b border-[#F5C542]/25 text-[#FFFDF7] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 xl:gap-6">
          {/* Left Brand: Dharma Wheel Golden Emblem & Title */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group active:scale-95 transition-transform shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#FFF0A8] shadow-[0_0_20px_rgba(245,197,66,0.35)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#211808] flex items-center justify-center">
                <DharmaWheelIcon className="w-6 h-6 text-[#FFD966] group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>

            <div className="shrink-0">
              <div className="font-heading font-serif font-black text-lg tracking-wider text-[#FFFDF7] group-hover:text-[#FFD966] transition-colors flex items-center gap-2">
                <span>DHARMA</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#F5C542]/18 text-[#FFD966] border border-[#F5C542]/40">
                  Chánh Pháp
                </span>
              </div>
              <p className="text-[11px] text-[#C7B68B] font-medium whitespace-nowrap">
                Không Gian Chánh Niệm &amp; Tam Tạng Pháp Bảo
              </p>
            </div>
          </Link>

          {/* Center Navigation Links — Single-Line Guaranteed */}
          <nav className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-2xl text-xs xl:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0',
                    isActive
                      ? 'bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#1A1305] font-bold shadow-[0_4px_18px_rgba(245,197,66,0.35)]'
                      : 'text-[#E5D5AB] hover:text-[#FFD966] hover:bg-[#2A200D]'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-[#1A1305]' : 'text-[#F5C542]'
                    )}
                  />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Layperson Profile */}
          <div className="flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Mindfulness Bell Shortcut Button */}
            <button
              type="button"
              onClick={handleRingMindfulnessBell}
              className="px-3.5 py-2 rounded-xl bg-[#251C0B] border border-[#F5C542]/35 hover:border-[#FFD966] text-[#FFD966] hover:bg-[#30240E] text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Thỉnh Chuông Chánh Niệm"
            >
              <TempleBellIcon className="w-4 h-4 shrink-0 text-[#FFD966]" />
              <span className="whitespace-nowrap">Chuông Chánh Niệm</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher compact variant="sanctuary" />

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#251C0B] border border-[#F5C542]/25 hover:border-[#FFD966] text-[#F3E3B2] hover:text-[#FFD966] flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
              title="Tìm kiếm kinh điển & pháp thoại"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <Link
              href="/ho-so"
              className="flex items-center gap-2 pl-2 py-1.5 pr-3.5 rounded-xl bg-[#251C0B] border border-[#F5C542]/25 hover:border-[#FFD966] text-[#FFFDF7] transition-all active:scale-95 shadow-md whitespace-nowrap shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#E5A91C] to-[#FFE07D] flex items-center justify-center text-[#1A1305] text-xs font-bold shrink-0">
                <BodhiLeafIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold max-w-[120px] truncate whitespace-nowrap text-[#FFD966]">
                {user?.dharma_name || user?.full_name || 'Cư sĩ'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="hidden lg:flex fixed top-22 right-6 z-50 pointer-events-none animate-fadeInDown">
          <div className="px-5 py-3 rounded-2xl bg-[#241B0B]/95 border border-[#F5C542] text-white shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <LotusMinimalIcon className="w-5 h-5 text-[#FFD966] shrink-0" />
            <p className="font-heading text-sm font-bold text-[#FFD966]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
