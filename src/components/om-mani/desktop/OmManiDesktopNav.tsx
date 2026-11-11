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
      <header className="hidden lg:block sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[#EEDBBA] text-[#2E1E0F] shadow-[0_4px_20px_rgba(180,140,50,0.06)] transition-all">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 xl:gap-6">
          {/* Left Brand: Dharma Golden Logo Image & Title */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group active:scale-95 transition-transform shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#ECD9A8] shadow-[0_2px_12px_rgba(200,160,50,0.18)] bg-[#FFFDF7] shrink-0">
              <img
                src="/dharma-logo.png"
                alt="Dharma Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="shrink-0">
              <div className="font-heading font-serif font-black text-lg tracking-wider text-[#2E1E0F] group-hover:text-[#A8720B] transition-colors flex items-center gap-2">
                <span>DHARMA</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#9A6405] border border-[#F2DE9C]">
                  Chánh Pháp
                </span>
              </div>
              <p className="text-[11px] text-[#7D6442] font-medium whitespace-nowrap">
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
                      ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold shadow-[0_2px_12px_rgba(240,180,30,0.3)]'
                      : 'text-[#6A5234] hover:text-[#2E1E0F] hover:bg-[#FFF9EA]'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-[#3D2505]' : 'text-[#B87B08]'
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
              className="px-3.5 py-2 rounded-xl bg-[#FFF9EA] border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] hover:bg-[#FFF4D0] text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Thỉnh Chuông Chánh Niệm"
            >
              <TempleBellIcon className="w-4 h-4 shrink-0 text-[#B87B08]" />
              <span className="whitespace-nowrap">Chuông Chánh Niệm</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher compact variant="default" />

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#FFFDF7] border border-[#EEDBBA] hover:border-[#E5C158] text-[#6A5234] hover:text-[#2E1E0F] flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer shrink-0"
              title="Tìm kiếm kinh điển & pháp thoại"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <Link
              href="/ho-so"
              className="flex items-center gap-2 pl-2 py-1.5 pr-3.5 rounded-xl bg-[#FFF9EA] border border-[#EEDBBA] hover:border-[#E5C158] text-[#2E1E0F] transition-all active:scale-95 shadow-xs whitespace-nowrap shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FAD02C] to-[#FFE79A] flex items-center justify-center text-[#3D2505] text-xs font-bold shrink-0">
                <BodhiLeafIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold max-w-[120px] truncate whitespace-nowrap text-[#8C5500]">
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
          <div className="px-5 py-3 rounded-2xl bg-white/95 border border-[#EEDBBA] text-[#2E1E0F] shadow-2xl backdrop-blur-md flex items-center gap-2.5">
            <LotusMinimalIcon className="w-5 h-5 text-[#B87B08] shrink-0" />
            <p className="font-heading text-sm font-bold text-[#8C5500]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
