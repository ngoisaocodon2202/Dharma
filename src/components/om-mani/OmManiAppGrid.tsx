'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Flame,
  BookOpen,
  Headphones,
  Wind,
  MapPin,
  Heart,
  Users,
  Scroll,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';

interface OmManiAppGridProps {
  onOpenIncense?: () => void;
  onOpenMala?: () => void;
}

interface AppItem {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  imageSrc?: string;
  videoSrc?: string;
  gradient: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

export function OmManiAppGrid({ onOpenIncense, onOpenMala }: OmManiAppGridProps) {
  const APP_ITEMS: AppItem[] = [
    {
      id: 'lich-su',
      title: 'Lịch Sử Phật',
      icon: Scroll,
      imageSrc: '/images/apps/tu-tap.jpg',
      gradient: 'from-amber-700 to-red-900',
      badge: 'CỘI NGUỒN',
      href: '/lich-su-phat-giao',
    },
    {
      id: 'lich-nhac-nho',
      title: 'Lịch Vạn Niên',
      icon: Compass,
      imageSrc: '/images/apps/minh-chu.jpg',
      gradient: 'from-emerald-600 to-teal-800',
      badge: 'GHI CHÚ',
      href: '/lich-phat-giao',
    },
    {
      id: 'cau-nguyen',
      title: 'Đi Chùa',
      icon: Flame,
      imageSrc: '/images/golden_buddha_altar.jpg',
      gradient: 'from-amber-600 to-red-800',
      badge: 'CẦU NGUYỆN',
      href: '/cau-nguyen',
    },
    {
      id: 'tu-vi',
      title: 'Xem Ngày Tốt',
      icon: Sparkles,
      videoSrc: '/tuvi.mp4',
      gradient: 'from-amber-400 to-amber-600',
      badge: 'BẢN MỆNH',
      href: '/tu-vi',
    },
    {
      id: 'ai-phat-phap',
      title: 'AI Phật Pháp',
      icon: BuddhaBodhiIcon,
      imageSrc: '/images/apps/dao-trang.jpg',
      gradient: 'from-red-700 to-amber-900',
      badge: 'HỎI ĐÁP',
      href: '/hoi-dap-ai',
    },
    {
      id: 'tung-kinh',
      title: 'Tụng Kinh',
      icon: BookOpen,
      imageSrc: '/images/apps/tung-kinh.jpg',
      gradient: 'from-amber-700 to-yellow-900',
      href: '/thu-vien',
    },
    {
      id: 'niem-phat',
      title: 'Niệm Phật',
      icon: Heart,
      imageSrc: '/images/apps/niem-phat.jpg',
      gradient: 'from-amber-600 to-amber-900',
      onClick: onOpenMala,
    },
    {
      id: 'thap-huong',
      title: 'Thắp Hương',
      icon: Flame,
      imageSrc: '/images/apps/thap-huong.jpg',
      gradient: 'from-orange-600 to-rose-900',
      onClick: onOpenIncense,
    },
    {
      id: 'phap-thoai',
      title: 'Pháp Thoại',
      icon: Headphones,
      imageSrc: '/images/apps/phap-thoai.jpg',
      gradient: 'from-indigo-600 to-purple-900',
      href: '/phap-thoai',
    },
    {
      id: 'phong-thien',
      title: 'Phòng Thiền',
      icon: Wind,
      imageSrc: '/images/apps/phong-thien.jpg',
      gradient: 'from-cyan-600 to-blue-900',
      href: '/phong-thien',
    },
    {
      id: 'chua-co-tu',
      title: 'Chùa Cổ Tự',
      icon: MapPin,
      imageSrc: '/images/apps/chua-co-tu.jpg',
      gradient: 'from-rose-600 to-red-950',
      href: '/chua-dia-danh',
    },
    {
      id: 'mon-chay',
      title: 'Món Chay',
      icon: Sparkles,
      imageSrc: '/images/zen_garden.jpg',
      gradient: 'from-emerald-600 to-green-900',
      badge: 'DƯỠNG SINH',
      href: '/mon-chay',
    },
    {
      id: 'so-hoi-huong',
      title: 'Sớ Cầu An',
      icon: Scroll,
      imageSrc: '/images/sutra_book.jpg',
      gradient: 'from-amber-600 to-yellow-900',
      badge: 'IN SỚ',
      href: '/hoi-huong',
    },
    {
      id: 'tu-dien',
      title: 'Từ Điển Phật',
      icon: BookOpen,
      imageSrc: '/images/tripitaka_koreana.jpg',
      gradient: 'from-stone-600 to-amber-950',
      badge: 'TRA CỨU',
      href: '/tu-dien-phat-hoc',
    },
    {
      id: 'vuon-sen',
      title: 'Vườn Sen',
      icon: Heart,
      imageSrc: '/images/lotus_blooming.jpg',
      gradient: 'from-pink-600 to-rose-900',
      badge: 'TU TẬP',
      href: '/thuc-hanh',
    },
  ];

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-saffron-500" />
          <h3 className="font-heading font-bold text-base sm:text-lg text-charcoal-900 dark:text-charcoal-50">
            Ứng Dụng & Tiện Ích Phật Pháp
          </h3>
        </div>
        <span className="text-[11px] font-medium text-saffron-700 dark:text-saffron-400">
          Tất cả trong một
        </span>
      </div>

      {/* Grid of iOS-style Squircles (5 cols, 3 balanced rows of 5 = 15 apps) */}
      <div className="grid grid-cols-5 gap-x-1.5 gap-y-3.5 sm:gap-4 pt-1">
        {APP_ITEMS.map((item) => {
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center text-center group cursor-pointer select-none min-w-0">
              {/* Squircle Icon Tile */}
              <div className="relative">
                <div
                  className={cn(
                    'w-12 h-12 sm:w-14 sm:h-14 aspect-square rounded-[18px] sm:rounded-2xl p-[1.5px] shadow-sm group-hover:shadow-md transition-all duration-200 active:scale-90 group-hover:scale-105 overflow-hidden flex items-center justify-center relative ring-1 ring-black/5 dark:ring-white/10',
                    'bg-gradient-to-br',
                    item.gradient
                  )}
                >
                  {/* Glossy highlight line */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[18px] z-10" />

                  {item.videoSrc ? (
                    <div className="w-full h-full rounded-[16px] sm:rounded-[14px] overflow-hidden bg-black/40 flex items-center justify-center">
                      <video
                        src={item.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-110 pointer-events-none"
                      />
                    </div>
                  ) : item.imageSrc ? (
                    <div className="w-full h-full rounded-[16px] sm:rounded-[14px] overflow-hidden bg-black/20 flex items-center justify-center relative">
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : Icon ? (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm transition-transform group-hover:scale-110" />
                  ) : null}
                </div>

                {/* Badge if present — single line pill centered above icon */}
                {item.badge && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[7px] sm:text-[8px] font-black uppercase leading-none whitespace-nowrap shadow-xs z-20 border border-amber-200">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Title — concise, single line, never truncates or wraps */}
              <span className="font-heading font-semibold text-[10px] sm:text-xs text-charcoal-800 dark:text-charcoal-100 mt-1.5 whitespace-nowrap tracking-tight leading-tight group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                {item.title}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="focus:outline-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.id} href={item.href || '/'}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
