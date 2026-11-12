'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Calendar,
  BookOpen,
  User,
  Search,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import { MeditatingMonkOutlineIcon } from '@/components/icons/DharmaMinimalIcons';
import { SearchModal } from './SearchModal';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

const DESKTOP_TABS = [
  { name: 'Liên Hoa Đài', href: '/', Icon: Home },
  { name: 'Ấn Lịch Cát Tường', href: '/lich-phat-giao', Icon: Calendar },
  { name: 'Đạo Tràng Tu Tập', href: '/thuc-hanh', Icon: MeditatingMonkOutlineIcon },
  { name: 'Pháp Âm & Kinh Tạng', href: '/thu-vien', Icon: BookOpen },
  { name: 'Hồ Sơ Tâm Hạnh', href: '/ho-so', Icon: User },
];

const FULLSCREEN_ROUTES = [
  '/cau-sieu',
  '/cau-nguyen',
  '/di-chua',
  '/di-chua-online',
  '/thu-vien-bon-ton',
];

const NATIVE_MOBILE_TAB_ROUTES = new Set([
  '/',
  '/lich-phat-giao',
  '/thuc-hanh',
  '/thu-vien',
  '/ho-so',
]);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useDharmaPracticeStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [bellToast, setBellToast] = useState(false);

  const isFullscreenRoom =
    FULLSCREEN_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`)) ||
    /^\/cong-dong\/.+/.test(pathname);

  if (isFullscreenRoom) {
    return null;
  }

  const isMainTab = NATIVE_MOBILE_TAB_ROUTES.has(pathname);

  const handleStrikeBell = () => {
    playGrandTempleBellSound(0.5);
    setBellToast(true);
    setTimeout(() => setBellToast(false), 2600);
  };

  return (
    <>
      {/* 1. COMPACT SUB-PAGE MOBILE HEADER (< lg) */}
      {!isMainTab && (
        <header className="lg:hidden sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-[#EAD7A7]">
          <div className="px-3.5 h-13 flex items-center justify-between gap-2 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D9A02E] bg-[#FFF6DF] shrink-0">
                <img src="/dharma-logo.png" alt="DHARMA" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-sm text-[#8C5500] tracking-wide whitespace-nowrap truncate">
                DHARMA
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* 2. UNIFIED DESKTOP DHARMA HEADER (>= lg) */}
      <header className="hidden lg:block sticky top-0 z-40 w-full bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-[#EAD7A7] shadow-2xs overflow-x-clip">
        <div className="w-full max-w-7xl mx-auto px-4 xl:px-6 h-16 flex items-center justify-between gap-2 xl:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full overflow-hidden border-2 border-[#D9A02E] bg-[#FFF6DF] shadow-2xs shrink-0">
              <img
                src="/dharma-logo.png"
                alt="DHARMA"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-sm xl:text-base tracking-wider text-[#2C1E10] group-hover:text-[#8C5500] transition-colors block leading-tight whitespace-nowrap">
                DHARMA
              </span>
              <span className="hidden xl:block text-[10px] text-[#6B533B] leading-tight whitespace-nowrap">
                Liên Hoa Đài Chánh Niệm
              </span>
            </div>
          </Link>

          {/* Center: Clean 5-Tab Dharma Navigation */}
          <nav
            aria-label="Điều hướng chính DHARMA"
            className="flex items-center gap-0.5 xl:gap-1 bg-[#FAF7F0] border border-[#EAD7A7] rounded-full p-1 min-w-0 shrink"
          >
            {DESKTOP_TABS.map(({ name, href, Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0',
                    isActive
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] font-bold shadow-2xs border border-[#D9A02E]'
                      : 'text-[#6B533B] hover:text-[#2C1E10] hover:bg-[#FFF6DF]/60'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Bell, Search & Practitioner Chip */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStrikeBell}
              title="Thỉnh Chuông Chánh Niệm"
              className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#FFF6DF] border border-[#E5C67E] text-[#8C5500] hover:bg-[#FCECC2] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              aria-label="Thỉnh Chuông Chánh Niệm"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              title="Tìm kiếm kinh điển, chùa, bổn tôn"
              className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#FFF6DF] border border-[#E5C67E] text-[#2C1E10] hover:bg-[#FCECC2] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/ho-so"
              className="flex items-center gap-1.5 pl-1 pr-1 xl:pr-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#E5C67E] hover:bg-[#FCECC2] transition-colors shrink-0"
              title={profile.dharmaName || 'Phật tử'}
            >
              <div className="w-7 h-7 rounded-full bg-[#FFE07D] border border-[#D9A02E] flex items-center justify-center text-xs font-bold text-[#3D2505] shrink-0">
                {(profile.dharmaName || 'P').charAt(0).toUpperCase()}
              </div>
              <span className="hidden xl:inline text-xs font-bold text-[#7A5000] max-w-[92px] whitespace-nowrap truncate">
                {profile.dharmaName || 'Phật tử'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {bellToast && (
        <div className="fixed top-20 right-4 z-[999] px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#D9A02E] text-[#2C1E10] text-xs font-bold shadow-lg animate-fade-in">
          🔔 Thở vào tâm tĩnh lặng • Thở ra miệng mỉm cười
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
