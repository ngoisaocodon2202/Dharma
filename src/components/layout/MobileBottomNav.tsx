'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, MessageCircleQuestion, User } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';

const BOTTOM_NAV_ITEMS = [
  { name: 'Trang chủ', href: '/', icon: BuddhaBodhiIcon },
  { name: 'Lịch Vạn Niên', href: '/lich-phat-giao', icon: Calendar },
  {
    name: 'Cầu Nguyện',
    href: '/cau-nguyen',
    icon: Sparkles,
    videoSrc: '/tuvi.mp4',
    isCenter: true,
  },
  { name: 'Hỏi Đáp AI', href: '/hoi-dap-ai', icon: Sparkles },
  { name: 'Hồ sơ', href: '/ho-so', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on group chat pages or full-screen sanctuary to keep full height
  if (/^\/cong-dong\/.+/.test(pathname) || pathname === '/cau-nguyen' || pathname === '/di-chua-online') return null;

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pb-safe overflow-visible select-none shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
    >
      {/* ================= 100% OPAQUE BACKGROUND WITH ZERO BOTTOM BLEED ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Solid base covering the lower body & safe-area completely (extends down by 60px for overscroll protection) */}
        <div className="absolute top-[24px] -bottom-[60px] left-0 right-0 bg-white dark:bg-charcoal-900" />

        {/* Top Left flat shoulder */}
        <div className="absolute top-0 left-0 right-[calc(50%+68px)] h-[25px] bg-white dark:bg-charcoal-900 border-t border-ivory-200/90 dark:border-charcoal-800" />

        {/* Center wide U-shaped curved notch cradle (136px wide - rộng rãi, không dính 2 bên) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[136px] h-[25px]">
          <svg
            viewBox="0 0 136 25"
            className="w-full h-full text-ivory-200/90 dark:text-charcoal-800 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Seamless background fill from curve down to base */}
            <path
              d="M 0 0 C 25 0, 32 24, 68 24 C 104 24, 111 0, 136 0 L 136 25 L 0 25 Z"
              className="fill-white dark:fill-charcoal-900"
            />

            {/* Smooth curved top border line */}
            <path
              d="M 0 0 C 25 0, 32 24, 68 24 C 104 24, 111 0, 136 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Top Right flat shoulder */}
        <div className="absolute top-0 left-[calc(50%+68px)] right-0 h-[25px] bg-white dark:bg-charcoal-900 border-t border-ivory-200/90 dark:border-charcoal-800" />
      </div>

      {/* ================= NAVIGATION ITEMS GRID (h-[60px], THOÁNG ĐÃNG, KHÔNG SÁT ĐÁY) ================= */}
      <div className="relative grid grid-cols-5 h-[60px] items-center max-w-lg mx-auto px-1 z-10 overflow-visible">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          // ================= CENTER ELEVATED BUTTON + PILL BADGE (TỬ VI) =================
          // 50% trên nằm ở ngoài, 50% dưới nằm trong hõm cong, có khoảng đệm thoáng ở dưới
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center h-full group overflow-visible"
              >
                {/* Center elevated anchor */}
                <div className="relative -top-5 flex flex-col items-center">
                  {/* Glowing outer halo around circle */}
                  <div
                    className={cn(
                      'absolute -inset-1.5 rounded-full bg-gradient-to-tr from-amber-400/35 via-saffron-500/40 to-amber-300/35 blur-[5px] transition-all pointer-events-none',
                      isActive ? 'opacity-100 scale-110 animate-pulse' : 'opacity-50 group-hover:opacity-100'
                    )}
                  />

                  {/* Quả cầu tròn 52px có viền trắng dày nổi bật, 50% trên và 50% dưới hõm cong */}
                  <div
                    className={cn(
                      'relative w-[52px] h-[52px] rounded-full p-[2.5px] bg-white dark:bg-charcoal-800 shadow-[0_4px_16px_rgba(217,119,6,0.35)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.5)] border-2 border-amber-300 dark:border-amber-600 transition-transform duration-200 active:scale-95 flex items-center justify-center',
                      isActive ? 'scale-105 ring-2 ring-saffron-400 ring-offset-2 ring-offset-white dark:ring-offset-charcoal-900' : 'group-hover:scale-105'
                    )}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-amber-50 dark:bg-charcoal-950 flex items-center justify-center shadow-inner">
                      <video
                        src={item.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-115 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Nút nhộng hình viên nang (Pill Capsule Badge) có whitespace-nowrap không xuống dòng */}
                  <div
                    className={cn(
                      'mt-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-tight transition-all shadow-xs flex items-center justify-center leading-none whitespace-nowrap',
                      isActive
                        ? 'bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 text-white shadow-[0_2px_8px_rgba(217,119,6,0.4)] ring-1.5 ring-saffron-300'
                        : 'bg-gradient-to-r from-amber-500 via-saffron-500 to-amber-600 text-white shadow-[0_2px_6px_rgba(217,119,6,0.25)] group-hover:from-amber-600 group-hover:to-saffron-700'
                    )}
                  >
                    <span className="whitespace-nowrap">{item.name}</span>
                  </div>
                </div>
              </Link>
            );
          }

          // ================= 4 STANDARD ITEMS (COMPACT & PROPORTIONAL) =================
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center h-full py-1 text-center transition-all select-none group',
                isActive
                  ? 'text-saffron-700 dark:text-saffron-400'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-100 active:scale-95'
              )}
            >
              {/* Active indicator top bar dot */}
              {isActive && (
                <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-saffron-500 dark:bg-saffron-400" />
              )}

              {/* Circular Icon Container matching reference UI */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-saffron-100 dark:bg-saffron-950/80 text-saffron-700 dark:text-saffron-300 shadow-xs scale-105'
                    : 'bg-ivory-100/70 dark:bg-charcoal-800/70 text-charcoal-600 dark:text-charcoal-400 group-hover:bg-ivory-200 dark:group-hover:bg-charcoal-700 group-hover:text-charcoal-900'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={cn(
                  'text-[9.5px] mt-0.5 tracking-tight leading-none whitespace-nowrap truncate max-w-[68px] transition-colors',
                  isActive ? 'font-bold text-saffron-700 dark:text-saffron-400' : 'font-medium'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
