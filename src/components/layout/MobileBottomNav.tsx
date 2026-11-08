'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Lotus Meditator Icon for "Tu tập" matching Om Mani App
const MeditatingIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {/* Head with ushnisha */}
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="2.5" r="0.8" />
    {/* Body & Crossed legs in lotus posture */}
    <path d="M12 8c-2.4 0-4.2 1.6-4.5 3.8l-.5 3.2c-.1.6.4 1.1 1 1.1h8c.6 0 1.1-.5 1-1.1l-.5-3.2C16.2 9.6 14.4 8 12 8z" opacity="0.9" />
    {/* Lotus base knees & hands */}
    <path d="M5.5 17.5c1.2-1.5 3.5-1.5 6.5-1.5s5.3 0 6.5 1.5c.8 1-1 2.5-3 2.5h-7c-2 0-3.8-1.5-3-2.5z" />
  </svg>
);

const BOTTOM_NAV_ITEMS = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Lịch', href: '/lich-phat-giao', icon: Calendar },
  { name: 'Tu tập', href: '/thuc-hanh', icon: MeditatingIcon },
  { name: 'Kinh sách', href: '/thu-vien', icon: BookOpen },
  { name: 'Cá nhân', href: '/ho-so', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on dedicated 100vh sanctuary pages or group chats to preserve immersion
  if (
    /^\/cong-dong\/.+/.test(pathname) ||
    pathname === '/cau-nguyen' ||
    pathname === '/di-chua-online'
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Thanh điều hướng di động Om Mani"
      className="fixed bottom-3 inset-x-0 z-40 lg:hidden px-3 pointer-events-none select-none"
    >
      <div className="w-full max-w-md mx-auto pointer-events-auto">
        {/* Floating Glassmorphism Dock Pill matching Om Mani App 100% */}
        <div className="rounded-full bg-[#1C1510]/94 backdrop-blur-xl border border-[#D4AF37]/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] px-2 py-1.5 flex items-center justify-between gap-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-gradient-to-b from-[#8C5216]/65 to-[#663A0E]/65 text-[#FFE082] shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-150',
                      isActive ? 'scale-105 text-[#FFE082]' : 'text-stone-400'
                    )}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <span
                  className={cn(
                    'text-[10px] mt-0.5 whitespace-nowrap leading-tight tracking-tight transition-colors',
                    isActive ? 'font-bold text-[#FFE082]' : 'font-normal text-stone-400'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
export default MobileBottomNav;
