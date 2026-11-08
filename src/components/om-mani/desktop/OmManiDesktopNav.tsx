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
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { useAuth } from '@/components/auth/AuthContext';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { SearchModal } from '@/components/layout/SearchModal';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

// Meditating Figure Icon for "Tu tập"
const MeditatingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="2.5" r="0.8" />
    <path d="M12 8c-2.4 0-4.2 1.6-4.5 3.8l-.5 3.2c-.1.6.4 1.1 1 1.1h8c.6 0 1.1-.5 1-1.1l-.5-3.2C16.2 9.6 14.4 8 12 8z" opacity="0.9" />
    <path d="M5.5 17.5c1.2-1.5 3.5-1.5 6.5-1.5s5.3 0 6.5 1.5c.8 1-1 2.5-3 2.5h-7c-2 0-3.8-1.5-3-2.5z" />
  </svg>
);

const NAV_ITEMS = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Lịch Vạn Niên', href: '/lich-phat-giao', icon: Calendar },
  { name: 'Phương Tiện Tu Tập', href: '/thuc-hanh', icon: MeditatingIcon },
  { name: 'Kho Tàng Kinh Điển', href: '/thu-vien', icon: BookOpen },
  { name: 'Cá Nhân & Tiến Trình', href: '/ho-so', icon: User },
];

export function OmManiDesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
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
      <header className="hidden lg:block sticky top-0 z-50 w-full bg-[#140E0A]/95 backdrop-blur-md border-b border-amber-500/20 text-[#FDFBF7] shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
          {/* Left Brand: Golden Lotus Emblem & Title */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group active:scale-95 transition-transform shrink-0"
          >
            <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#20150E] flex items-center justify-center">
                <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <div className="font-heading font-serif font-black text-lg tracking-wider text-white group-hover:text-amber-200 transition-colors flex items-center gap-2">
                <span>OM MANI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Phật Pháp
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">
                Cổng Thông Tin &amp; Không Gian Tỉnh Thức
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-1.5 xl:gap-2">
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
                    'px-3.5 py-2 rounded-2xl text-xs xl:text-[13px] font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-gradient-to-b from-[#C4681E] to-[#99470B] text-white font-bold shadow-md shadow-amber-950/40 ring-1 ring-amber-300/40'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-amber-100' : 'text-stone-400')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mindfulness Bell Shortcut Button */}
            <button
              type="button"
              onClick={handleRingMindfulnessBell}
              className="px-3 py-1.5 rounded-full bg-[#201712] border border-amber-500/30 hover:border-amber-400/80 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Thỉnh Chuông Chánh Niệm"
            >
              <Bell className="w-3.5 h-3.5 fill-current" />
              <span>Chuông Chánh Niệm</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher compact variant="sanctuary" />

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-[#201712] border border-white/10 hover:border-amber-400/50 text-stone-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer"
              title="Tìm kiếm kinh điển & bài viết"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Profile Avatar Link */}
            <Link
              href="/ho-so"
              className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-[#201712] border border-white/10 hover:border-amber-400/50 text-stone-200 hover:text-white transition-all active:scale-95 shadow-md"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-charcoal-950 text-xs font-bold">
                {user?.dharma_name ? user.dharma_name.charAt(0) : '🪷'}
              </div>
              <span className="text-xs font-medium max-w-[100px] truncate">
                {user?.dharma_name || user?.full_name || 'Phật tử'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="hidden lg:flex fixed top-20 right-6 z-50 pointer-events-none animate-fadeInDown">
          <div className="px-5 py-3 rounded-2xl bg-[#20150E]/95 border border-[#D4AF37] text-white shadow-2xl backdrop-blur-md flex items-center gap-2">
            <span className="text-amber-300 text-lg">🪷</span>
            <p className="font-heading text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

