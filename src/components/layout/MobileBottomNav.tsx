'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar } from 'lucide-react';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { playWoodenFishSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

const BOTTOM_NAV_ITEMS = [
  { name: 'Khai Tâm', href: '/', icon: LotusMinimalIcon, isCenter: false },
  { name: 'Lịch Pháp', href: '/lich-phat-giao', icon: Calendar, isCenter: false },
  { name: 'Hành Trì', href: '/thuc-hanh', icon: DharmaWheelIcon, isCenter: true },
  { name: 'Kinh Tạng', href: '/thu-vien', icon: SutraScrollIcon, isCenter: false },
  { name: 'Cư Sĩ', href: '/ho-so', icon: BodhiLeafIcon, isCenter: false },
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
      aria-label="Thanh điều hướng di động Dharma"
      className="fixed bottom-3 inset-x-0 z-40 lg:hidden px-3.5 pointer-events-none select-none"
    >
      <div className="w-full max-w-md mx-auto pointer-events-auto">
        {/* React Native Super-App Floating Tab Bar in Radiant Buddhist Gold */}
        <div className="relative rounded-[28px] bg-[#1E1609]/95 backdrop-blur-2xl border border-[#F5C542]/35 shadow-[0_14px_44px_rgba(0,0,0,0.75),0_0_20px_rgba(245,197,66,0.12)] px-2 py-1.5 flex items-center justify-between gap-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => playWoodenFishSound(0.2)}
                  className="flex-1 flex flex-col items-center justify-center -mt-5 group active:scale-95 transition-transform"
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border',
                      isActive
                        ? 'bg-gradient-to-br from-[#FFE07D] via-[#F5C542] to-[#D49B16] text-[#1A1305] border-[#FFF3B0] shadow-[0_4px_20px_rgba(245,197,66,0.55)] scale-105'
                        : 'bg-gradient-to-br from-[#3A2B0F] to-[#251B09] text-[#F5C542] border-[#F5C542]/45 hover:border-[#FFD966]'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 whitespace-nowrap leading-tight tracking-tight transition-colors',
                      isActive ? 'font-bold text-[#FFD966]' : 'font-medium text-[#D6C394]'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => playWoodenFishSound(0.15)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-[#F5C542]/15 text-[#FFD966]'
                    : 'text-[#A89874] hover:text-[#F3E3B2]'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isActive ? 'scale-105 text-[#FFD966]' : 'text-[#A89874]'
                    )}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD966] shadow-[0_0_6px_#FFD966]" />
                  )}
                </div>

                <span
                  className={cn(
                    'text-[10px] mt-1 whitespace-nowrap leading-tight tracking-tight transition-colors',
                    isActive ? 'font-bold text-[#FFD966]' : 'font-normal text-[#A89874]'
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
