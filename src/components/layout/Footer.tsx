'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { BuddhaMeditationIcon } from '@/components/icons/BuddhaMeditationIcon';
import { TemplePagodaIcon } from '@/components/icons/TemplePagodaIcon';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';

export function Footer() {
  const pathname = usePathname();

  // Hide on group chat pages, dedicated 100vh sanctuary pages, or Om Mani AppStore pages
  if (
    /^\/cong-dong\/.+/.test(pathname) ||
    pathname === '/cau-nguyen' ||
    pathname === '/di-chua-online' ||
    pathname === '/' ||
    pathname === '/lich-phat-giao'
  ) {
    return null;
  }

  // On non-home pages (where footer is omitted), render a bottom spacer on mobile
  // so the entire UI can always scroll completely above the fixed MobileBottomNav
  if (pathname !== '/') {
    return (
      <div
        className="w-full h-28 sm:h-32 lg:h-12 pointer-events-none shrink-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <footer className="w-full pt-6 pb-28 sm:pb-32 lg:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Single Unified Zen Master Panel */}
        <div className="bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md rounded-3xl border border-ivory-300/80 dark:border-charcoal-700 shadow-xl overflow-hidden p-5 sm:p-8 lg:p-10 space-y-8">
          {/* 1. Header Banner: Brand Identity & Sacred Verse */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-ivory-200/80 dark:border-charcoal-700/80">
            {/* Logo & Slogan */}
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-saffron-300/80 dark:border-saffron-700/80 shadow-sm group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 bg-ivory-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Phật Pháp Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-wide text-charcoal-900 dark:text-charcoal-50 block leading-tight group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                  PHẬT PHÁP
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider text-saffron-700 dark:text-saffron-400 font-semibold block uppercase">
                  Học Hỏi • Chia Sẻ • Kết Nối
                </span>
              </div>
            </Link>

            {/* Sacred Dedication Verse Card */}
            <div className="px-4 py-2.5 bg-saffron-50/70 dark:bg-charcoal-900/60 rounded-2xl border border-saffron-200/80 dark:border-charcoal-700 flex items-center gap-2.5 max-w-full">
              <BuddhaBodhiIcon className="w-5 h-5 text-saffron-600 dark:text-saffron-400 flex-shrink-0 animate-pulse-glow" />
              <p className="font-heading italic text-xs sm:text-[13px] text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
                &ldquo;Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo.&rdquo;
              </p>
            </div>
          </div>

          {/* 2. Three Cohesive Category Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Tile 1: Giáo lý & Thư viện */}
            <div className="p-4 sm:p-5 bg-ivory-50/70 dark:bg-charcoal-900/50 rounded-2xl border border-ivory-200/70 dark:border-charcoal-700/60 space-y-3.5 hover:border-saffron-300/80 dark:hover:border-saffron-700/60 transition-colors">
              <div className="flex items-center gap-2 pb-2 border-b border-ivory-200/60 dark:border-charcoal-800">
                <div className="w-7 h-7 rounded-lg bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-400 flex items-center justify-center flex-shrink-0">
                  <DharmaBookIcon className="w-4 h-4 text-saffron-700 dark:text-saffron-400" />
                </div>
                <h4 className="font-heading text-sm font-bold text-charcoal-900 dark:text-charcoal-100">
                  Giáo Lý & Thư Viện
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/lich-su-phat-giao"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-saffron-700 dark:hover:text-saffron-400 hover:translate-x-1 transition-all"
                  >
                    <span>Lịch sử Phật giáo (2.600 năm)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bai-viet"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-saffron-700 dark:hover:text-saffron-400 hover:translate-x-1 transition-all"
                  >
                    <span>Bài giảng Sư Thầy & Tự Viện (Hàng ngày)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/thu-vien"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-saffron-700 dark:hover:text-saffron-400 hover:translate-x-1 transition-all"
                  >
                    <span>Tủ kinh sách Phật học</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoi-dap-ai"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-saffron-700 dark:hover:text-saffron-400 hover:translate-x-1 transition-all"
                  >
                    <span>AI Hỗ Trợ Hỏi Đáp Phật Pháp</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tile 2: Lịch Vạn Niên & Tu Học */}
            <div className="p-4 sm:p-5 bg-ivory-50/70 dark:bg-charcoal-900/50 rounded-2xl border border-ivory-200/70 dark:border-charcoal-700/60 space-y-3.5 hover:border-jade-300/80 dark:hover:border-jade-700/60 transition-colors">
              <div className="flex items-center gap-2 pb-2 border-b border-ivory-200/60 dark:border-charcoal-800">
                <div className="w-7 h-7 rounded-lg bg-jade-100 dark:bg-jade-950/60 text-jade-700 dark:text-jade-400 flex items-center justify-center flex-shrink-0">
                  <BuddhaMeditationIcon className="w-4 h-4 text-jade-700 dark:text-jade-400" />
                </div>
                <h4 className="font-heading text-sm font-bold text-charcoal-900 dark:text-charcoal-100">
                  Lịch Vạn Niên & Tu Tập
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/lich-phat-giao"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-jade-700 dark:hover:text-jade-400 hover:translate-x-1 transition-all"
                  >
                    <span>Lịch Vạn Niên & Nhắc Nhở Ngày Giỗ</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tu-vi"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-jade-700 dark:hover:text-jade-400 hover:translate-x-1 transition-all"
                  >
                    <span>Xem Màu Chủ Đạo & Ngày Tốt</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phong-thien"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-jade-700 dark:hover:text-jade-400 hover:translate-x-1 transition-all"
                  >
                    <span>Phòng thiền trực tuyến</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lo-trinh-hoc"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-jade-700 dark:hover:text-jade-400 hover:translate-x-1 transition-all"
                  >
                    <span>Lộ trình học Phật (5 Tuyến)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tile 3: Chùa & Tự Viện */}
            <div className="p-4 sm:p-5 bg-ivory-50/70 dark:bg-charcoal-900/50 rounded-2xl border border-ivory-200/70 dark:border-charcoal-700/60 space-y-3.5 hover:border-lotus-300/80 dark:hover:border-lotus-700/60 transition-colors">
              <div className="flex items-center gap-2 pb-2 border-b border-ivory-200/60 dark:border-charcoal-800">
                <div className="w-7 h-7 rounded-lg bg-lotus-100 dark:bg-lotus-950/60 text-lotus-700 dark:text-lotus-400 flex items-center justify-center flex-shrink-0">
                  <TemplePagodaIcon className="w-4 h-4 text-lotus-700 dark:text-lotus-400" />
                </div>
                <h4 className="font-heading text-sm font-bold text-charcoal-900 dark:text-charcoal-100">
                  Chùa & Tự Viện
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/chua-dia-danh"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-lotus-700 dark:hover:text-lotus-400 hover:translate-x-1 transition-all"
                  >
                    <span>Chùa & Địa danh Phật giáo</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/to-chuc"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-lotus-700 dark:hover:text-lotus-400 hover:translate-x-1 transition-all"
                  >
                    <span>Trang chính thức Chùa / Viện</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/su-kien"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-lotus-700 dark:hover:text-lotus-400 hover:translate-x-1 transition-all"
                  >
                    <span>Sự kiện & Khóa tu</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phap-thoai"
                    className="flex items-center justify-between py-1 text-charcoal-600 dark:text-charcoal-300 hover:text-lotus-700 dark:hover:text-lotus-400 hover:translate-x-1 transition-all"
                  >
                    <span>Pháp thoại & Video Cổ tự</span>
                    <ArrowUpRight className="w-3 h-3 opacity-40" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Bottom Row: Disclaimer & Legal Links */}
          <div className="pt-6 border-t border-ivory-200/80 dark:border-charcoal-700/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-charcoal-500 dark:text-charcoal-400">
            <p className="text-center md:text-left leading-relaxed max-w-2xl text-[11px] sm:text-xs">
              ✦ <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Phi thương mại</span> — Nền tảng hướng tới mục đích xiển dương Chánh pháp, từ bi và trí tuệ.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-xs whitespace-nowrap">
              <span>© 2026 Phật Pháp Việt Nam</span>
              <span>•</span>
              <Link href="/quy-chuan" className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
                Quy chuẩn
              </Link>
              <span>•</span>
              <Link href="/bao-mat" className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
