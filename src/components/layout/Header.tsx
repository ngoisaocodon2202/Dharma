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
  ChevronLeft,
} from 'lucide-react';
import { MeditatingMonkOutlineIcon } from '@/components/icons/DharmaMinimalIcons';
import { SearchModal } from './SearchModal';
import { CenterToast } from '@/components/ui/CenterToast';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { playGrandTempleBellSound, playSoftTabBellSound } from '@/lib/buddhistSounds';
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
        <header className="lg:hidden sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-black/8">
          <div className="px-3.5 h-13 flex items-center justify-between gap-2 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => {
                playSoftTabBellSound(0.18);
                router.back();
              }}
              className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] text-[#2C1E10] flex items-center justify-center cursor-pointer active:scale-95 shrink-0 transition-colors"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FFF6DF] shrink-0">
                <img src="/dharma-logo.png" alt="DHARMA" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-sm text-[#8C5500] tracking-wide whitespace-nowrap truncate">
                DHARMA
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-full bg-[#EFECE5] text-[#7A5000] flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* 2. UNIFIED DESKTOP DHARMA HEADER (>= lg) */}
      <header className="hidden lg:block sticky top-0 z-40 w-full bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-black/8 shadow-2xs overflow-x-clip">
        <div className="w-full max-w-7xl mx-auto px-4 xl:px-6 h-16 flex items-center justify-between gap-2 xl:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full overflow-hidden ring-1 ring-[#D9A02E]/40 bg-[#FFF6DF] shadow-2xs shrink-0">
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
            className="flex items-center gap-0.5 xl:gap-1 bg-[#EFECE5] rounded-full p-1 min-w-0 shrink"
          >
            {DESKTOP_TABS.map(({ name, href, Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => playSoftTabBellSound(0.2)}
                  className={cn(
                    'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0',
                    isActive
                      ? 'bg-[#8C5500] text-white font-bold shadow-xs'
                      : 'text-[#5A4329] hover:text-[#2C1E10] hover:bg-white/60'
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
              className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#EFECE5] text-[#8C5500] hover:bg-[#E7E1D5] flex items-center justify-center cursor-pointer transition-colors shrink-0"
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
              title={profile.dharmaName || 'Dharma'}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FFE07D] border border-[#D9A02E] flex items-center justify-center shrink-0">
                <img
                  src={profile.avatarUrl || '/images/dharma-logo.png'}
                  alt={profile.dharmaName || 'Dharma'}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden xl:inline text-xs font-bold text-[#7A5000] max-w-[92px] whitespace-nowrap truncate">
                {profile.dharmaName || 'Dharma'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <CenterToast
        message={bellToast ? 'Thở vào tâm tĩnh lặng • Thở ra miệng mỉm cười' : null}
        icon="bell"
        title="Tiếng Chuông Tỉnh Thức"
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
