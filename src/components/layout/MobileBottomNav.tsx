'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BookOpen, User } from 'lucide-react';
import { MeditatingMonkOutlineIcon } from '@/components/icons/DharmaMinimalIcons';
import { playSoftTabBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

const BOTTOM_NAV_ITEMS = [
  { name: 'Liên Hoa Đài', href: '/', Icon: Home },
  { name: 'Ấn Lịch', href: '/lich-phat-giao', Icon: Calendar },
  { name: 'Đạo Tràng', href: '/thuc-hanh', Icon: MeditatingMonkOutlineIcon },
  { name: 'Kinh Tạng', href: '/thu-vien', Icon: BookOpen },
  { name: 'Tâm Hạnh', href: '/ho-so', Icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (
    /^\/cong-dong\/.+/.test(pathname) ||
    pathname === '/cau-nguyen' ||
    pathname.startsWith('/cau-nguyen/') ||
    pathname === '/cau-sieu' ||
    pathname.startsWith('/cau-sieu/') ||
    pathname === '/di-chua' ||
    pathname === '/di-chua-online' ||
    pathname === '/thu-vien-bon-ton' ||
    pathname.startsWith('/thu-vien-bon-ton/')
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Điều hướng ứng dụng di động DHARMA"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#F7F1E2] border-t border-black/15 shadow-[0_-6px_24px_rgba(44,30,16,0.14)] select-none"
    >
      <div className="w-full max-w-md mx-auto px-2 py-2 flex items-center justify-between gap-1">
        {BOTTOM_NAV_ITEMS.map(({ name, href, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => playSoftTabBellSound(0.2)}
              className={cn(
                'flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 active:scale-95',
                isActive
                  ? 'bg-[#8C5500] text-white shadow-xs'
                  : 'text-[#2C1E10] hover:bg-black/[0.04]'
              )}
            >
              <Icon
                className={cn(
                  'w-[19px] h-[19px] shrink-0 transition-transform duration-200',
                  isActive ? 'scale-105 text-white' : 'text-[#2C1E10]'
                )}
              />
              <span
                className={cn(
                  'text-[10.5px] mt-0.5 whitespace-nowrap truncate max-w-full leading-tight tracking-tight',
                  isActive ? 'font-bold text-white' : 'font-semibold text-[#2C1E10]'
                )}
              >
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
