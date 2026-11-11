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
        {/* React Native Super-App Floating Tab Bar in Clean White & Pale Sacred Gold */}
        <div className="relative rounded-[28px] bg-white/95 backdrop-blur-2xl border border-[#ECD9A8] shadow-[0_12px_36px_rgba(180,140,50,0.16),0_2px_8px_rgba(0,0,0,0.04)] px-2 py-1.5 flex items-center justify-between gap-1">
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
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border',
                      isActive
                        ? 'bg-gradient-to-br from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] border-[#FFF8CC] shadow-[0_4px_18px_rgba(240,180,30,0.4)] scale-105'
                        : 'bg-gradient-to-br from-[#FFFDF7] to-[#FFF5D6] text-[#A8720B] border-[#ECD9A8] hover:border-[#E5C158]'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 whitespace-nowrap leading-tight tracking-tight transition-colors',
                      isActive ? 'font-bold text-[#A8720B]' : 'font-medium text-[#7D6442]'
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
                    ? 'bg-[#FFF4D0] text-[#A8720B]'
                    : 'text-[#826A4A] hover:text-[#3D2505]'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isActive ? 'scale-105 text-[#A8720B]' : 'text-[#826A4A]'
                    )}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#E5A716] shadow-[0_0_6px_#E5A716]" />
                  )}
                </div>

                <span
                  className={cn(
                    'text-[10px] mt-1 whitespace-nowrap leading-tight tracking-tight transition-colors',
                    isActive ? 'font-bold text-[#A8720B]' : 'font-normal text-[#826A4A]'
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
