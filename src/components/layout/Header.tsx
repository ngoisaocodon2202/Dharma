'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SearchModal } from './SearchModal';
import { useAuth } from '@/components/auth/AuthContext';
import { useMindfulness } from '@/components/mindfulness/MindfulnessContext';
import {
  Search,
  Menu,
  X,
  Compass,
  BookOpen,
  Music,
  MapPin,
  Users,
  LogOut,
  ShieldAlert,
  Wind,
  Scroll,
  Calendar,
  Building,
  Sparkles,
  ChevronDown,
  Flame,
  Bell,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { OmManiMobileHeader } from '@/components/om-mani/OmManiMobileHeader';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export interface SubNavItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  videoSrc?: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  name: string;
  href?: string;
  icon?: any;
  children?: SubNavItem[];
}

const DESKTOP_NAV_ITEMS: NavGroup[] = [
  {
    id: 'trang-chu',
    name: 'Trang chủ',
    href: '/',
    icon: BuddhaBodhiIcon,
  },
  {
    id: 'lich-su',
    name: 'Lịch sử Phật giáo',
    href: '/lich-su-phat-giao',
    icon: Scroll,
  },
  {
    id: 'hoc-phat',
    name: 'Học Phật',
    children: [
      {
        name: 'Bài giảng Sư Thầy & Chùa',
        href: '/bai-viet',
        icon: BookOpen,
        description: 'Bài viết mới cập nhật hàng ngày từ Chư Tăng Ni & Tự Viện',
        badge: 'Mỗi ngày',
      },
      {
        name: 'Lịch sử Phật giáo',
        href: '/lich-su-phat-giao',
        icon: Scroll,
        description: 'Cội nguồn từ Đức Phật Thích Ca tại Ấn Độ đến hiện tại',
        badge: '2.600 năm',
      },
      {
        name: 'Pháp thoại & Video',
        href: '/phap-thoai',
        icon: Music,
        description: 'Nghe giảng pháp, âm thanh tĩnh tâm & video tụng kinh',
      },
      {
        name: 'Lộ trình học Phật',
        href: '/lo-trinh-hoc',
        icon: Compass,
        description: 'Khóa học Phật pháp bài bản theo từng cấp độ',
      },
      {
        name: 'Tủ kinh sách',
        href: '/thu-vien',
        icon: Scroll,
        description: 'Kho tàng kinh điển Đại thừa & sách Phật học quý',
      },
      {
        name: 'Từ điển Phật học',
        href: '/tu-dien-phat-hoc',
        icon: BookOpen,
        description: 'Tra cứu thuật ngữ giáo lý căn bản Pāli, Phạn - Hán - Việt',
        badge: 'Tra cứu',
      },
    ],
  },
  {
    id: 'tu-tap',
    name: 'Lịch & Tu tập',
    children: [
      {
        name: 'Cầu Nguyện Online',
        href: '/cau-nguyen',
        icon: Flame,
        description: 'Đi chùa online, thắp nhang bái Phật, thỉnh chuông & cầu bình an',
        badge: 'Linh thiêng',
      },
      {
        name: 'Lịch Vạn Niên & Nhắc Nhở',
        href: '/lich-phat-giao',
        icon: Calendar,
        description: 'Xem Âm Dương lịch & ghi chú Ngày Giỗ, Ngày Quan Trọng',
        badge: 'Ghi chú',
      },
      {
        name: 'Màu Chủ Đạo & Ngày Tốt',
        href: '/tu-vi',
        icon: Sparkles,
        videoSrc: '/tuvi.mp4',
        description: 'Xem màu hợp bản mệnh Ngũ Hành, Ngày Hoàng Đạo & Giờ Tốt',
        badge: 'Bản Mệnh',
      },
      {
        name: 'Sổ tay món chay dưỡng sinh',
        href: '/mon-chay',
        icon: Sparkles,
        description: 'Gợi ý thực đơn món chay thanh tịnh, bổ dưỡng cho ngày trai giới',
        badge: 'Món Chay',
      },
      {
        name: 'Sớ Cầu An & Hồi Hướng',
        href: '/hoi-huong',
        icon: Scroll,
        description: 'Soạn văn sớ cầu an gia quyến, cầu siêu tiên tổ chuẩn truyền thống',
        badge: 'In Sớ',
      },
      {
        name: 'Phòng thiền trực tuyến',
        href: '/phong-thien',
        icon: Wind,
        description: 'Không gian thiền định chuông mõ trực tuyến thanh tịnh',
      },
      {
        name: 'Thực hành & Tràng hạt',
        href: '/thuc-hanh',
        icon: BuddhaBodhiIcon,
        description: 'Niệm Phật tràng hạt số, quán chiếu & Vườn Sen Tinh Tấn',
        badge: 'Tràng Hạt',
      },
    ],
  },
  {
    id: 'chua-tu-vien',
    name: 'Chùa & Tự viện',
    children: [
      {
        name: 'Chùa & Địa danh',
        href: '/chua-dia-danh',
        icon: MapPin,
        description: 'Bản đồ danh lam cổ tự & di tích Phật giáo linh thiêng',
      },
      {
        name: 'Sự kiện & Khóa tu',
        href: '/su-kien',
        icon: Calendar,
        description: 'Lịch khóa tu, đại lễ Phật đản, Vu Lan & sinh hoạt đạo tràng',
      },
      {
        name: 'Tự viện & Tổ chức',
        href: '/to-chuc',
        icon: Building,
        description: 'Thông tin giáo hội, thiền viện, tu viện & ban trị sự',
      },
    ],
  },
  {
    id: 'ai-phat-phap',
    name: 'AI Phật Pháp',
    href: '/hoi-dap-ai',
    icon: Sparkles,
  },
];

// Flat list grouped for Mobile Drawer
const MOBILE_SECTIONS = [
  {
    title: null,
    items: [
      { name: 'Trang chủ', href: '/', icon: BuddhaBodhiIcon, description: '' },
      { name: 'Lịch sử Phật giáo', href: '/lich-su-phat-giao', icon: Scroll, description: '', badge: '2.600 năm' },
      { name: 'AI Hỏi Đáp Phật Pháp', href: '/hoi-dap-ai', icon: Sparkles, description: '', badge: '24/7' },
    ],
  },
  {
    title: 'Lịch Vạn Niên & Tiện Ích',
    items: [
      { name: 'Cầu Nguyện Online', href: '/cau-nguyen', icon: Flame, description: 'Đi chùa online, thắp nhang & đọc kinh', badge: 'Mới' },
      { name: 'Lịch Vạn Niên & Nhắc Nhở', href: '/lich-phat-giao', icon: Calendar, description: '', badge: 'Ngày Giỗ' },
      { name: 'Sổ Tay Món Chay', href: '/mon-chay', icon: Sparkles, description: 'Món chay dưỡng sinh', badge: 'Món Chay' },
      { name: 'Sớ Cầu An & Hồi Hướng', href: '/hoi-huong', icon: Scroll, description: 'Soạn sớ trang nghiêm', badge: 'In Sớ' },
      { name: 'Xem Màu Chủ Đạo & Ngày Tốt', href: '/tu-vi', icon: Sparkles, videoSrc: '/tuvi.mp4', description: '', badge: 'Bản Mệnh' },
      { name: 'Tràng Hạt & Tu Tập', href: '/thuc-hanh', icon: BuddhaBodhiIcon, description: 'Đếm chuỗi 108 hạt & Vườn Sen', badge: '108 hạt' },
      { name: 'Phòng thiền trực tuyến', href: '/phong-thien', icon: Wind, description: '' },
    ],
  },
  {
    title: 'Học Phật & Tri Thức Mỗi Ngày',
    items: [
      { name: 'Từ Điển Phật Học', href: '/tu-dien-phat-hoc', icon: BookOpen, description: 'Tra cứu thuật ngữ căn bản', badge: 'Mới' },
      { name: 'Bài giảng Sư Thầy & Chùa', href: '/bai-viet', icon: BookOpen, description: '', badge: 'Hàng ngày' },
      { name: 'Pháp thoại & Video', href: '/phap-thoai', icon: Music, description: '' },
      { name: 'Lộ trình học Phật', href: '/lo-trinh-hoc', icon: Compass, description: '' },
      { name: 'Tủ kinh sách', href: '/thu-vien', icon: Scroll, description: '' },
    ],
  },
  {
    title: 'Chùa & Sự Kiện',
    items: [
      { name: 'Chùa & Địa danh', href: '/chua-dia-danh', icon: MapPin, description: '' },
      { name: 'Sự kiện & Khóa tu', href: '/su-kien', icon: Calendar, description: '' },
      { name: 'Tự viện & Tổ chức', href: '/to-chuc', icon: Building, description: '' },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const { setIsMindfulnessModalOpen, bellIntervalMinutes, seniorMode } = useMindfulness();

  // Hide on group chat pages or dedicated 100vh sanctuary pages
  if (
    /^\/cong-dong\/.+/.test(pathname) ||
    pathname === '/cau-nguyen' ||
    pathname === '/di-chua-online'
  ) {
    return null;
  }

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside & escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setActiveDropdown(null);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Mouse hover handlers with smooth delay
  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleToggle = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Mobile Native App Header (< lg) */}
      <div className="block lg:hidden">
        <OmManiMobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
      </div>

      {/* Desktop Portal Header (>= lg) */}
      <header className="hidden lg:block sticky top-0 z-40 w-full bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-ivory-200 dark:border-charcoal-800 transition-colors">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 xl:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group whitespace-nowrap">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-saffron-300/70 dark:border-saffron-700/70 shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 bg-ivory-100 shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Phật Pháp Logo"
                width={40}
                height={40}
                style={{ width: 40, height: 40, objectFit: 'cover' }}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="shrink-0">
              <span className="font-heading text-base sm:text-lg font-bold tracking-wide text-charcoal-900 dark:text-charcoal-50 block leading-tight whitespace-nowrap group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                PHẬT PHÁP
              </span>
              <span className="hidden xl:block text-[9px] xl:text-[10px] tracking-wider text-saffron-700 dark:text-saffron-400 font-medium uppercase whitespace-nowrap">
                Học Hỏi • Chia Sẻ • Kết Nối
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Streamlined with Dropdown Comboboxes) */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0"
            aria-label="Điều hướng chính"
          >
            {DESKTOP_NAV_ITEMS.map((item) => {
              // Direct Link Item
              if (item.href) {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5',
                      isActive
                        ? 'text-saffron-700 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 font-semibold shadow-xs'
                        : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800 hover:-translate-y-0.5'
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              }

              // Dropdown Combobox Item
              const isChildActive = item.children?.some((child) =>
                child.href === '/' ? pathname === '/' : pathname === child.href || pathname.startsWith(child.href + '/')
              );
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className={cn(
                      'px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 select-none cursor-pointer',
                      isChildActive
                        ? 'text-saffron-700 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 font-semibold shadow-xs'
                        : isOpen
                        ? 'text-charcoal-900 dark:text-charcoal-100 bg-ivory-100 dark:bg-charcoal-800'
                        : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-800 hover:-translate-y-0.5'
                    )}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        isOpen ? 'rotate-180 text-saffron-600' : 'text-charcoal-400'
                      )}
                    />
                  </button>

                  {/* Dropdown Menu Container */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-0 pt-2 z-40 animate-in fade-in-50 zoom-in-95 duration-150"
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="w-80 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 shadow-2xl shadow-charcoal-900/15 dark:shadow-charcoal-950/80 p-2 space-y-1">
                        {item.children?.map((child) => {
                          const isCurrent =
                            child.href === '/'
                              ? pathname === '/'
                              : pathname === child.href || pathname.startsWith(child.href + '/');
                          const ChildIcon = child.icon;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                'group/item flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150',
                                isCurrent
                                  ? 'bg-saffron-50 dark:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300'
                                  : 'hover:bg-ivory-100/80 dark:hover:bg-charcoal-800/80 text-charcoal-700 dark:text-charcoal-200'
                              )}
                            >
                              {/* Icon Container */}
                              <div
                                className={cn(
                                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/item:scale-105',
                                  isCurrent
                                    ? 'bg-saffron-100 dark:bg-saffron-900/80 text-saffron-700 dark:text-saffron-300 shadow-2xs'
                                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 group-hover/item:bg-saffron-100/60 dark:group-hover/item:bg-saffron-950/60 group-hover/item:text-saffron-600 dark:group-hover/item:text-saffron-400'
                                )}
                              >
                                {child.videoSrc ? (
                                  <div className="w-7 h-7 rounded-full overflow-hidden shadow-2xs">
                                    <video
                                      src={child.videoSrc}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="w-full h-full object-cover scale-110 pointer-events-none"
                                    />
                                  </div>
                                ) : (
                                  <ChildIcon className="w-4 h-4" />
                                )}
                              </div>

                              {/* Text Information */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={cn(
                                      'text-xs xl:text-[13px] font-semibold leading-tight transition-colors',
                                      isCurrent
                                        ? 'text-saffron-700 dark:text-saffron-400'
                                        : 'group-hover/item:text-saffron-700 dark:group-hover/item:text-saffron-400'
                                    )}
                                  >
                                    {child.name}
                                  </span>
                                  {child.badge && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-800 leading-none">
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 line-clamp-1 leading-snug mt-0.5">
                                  {child.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
            {/* Multi-language switcher */}
            <LanguageSwitcher />

            {/* Mindfulness Bell & Senior Mode Shortcut */}
            <button
              onClick={() => setIsMindfulnessModalOpen(true)}
              className={cn(
                'relative flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs border transition-all cursor-pointer whitespace-nowrap shrink-0',
                bellIntervalMinutes > 0 || seniorMode
                  ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-charcoal-600 dark:text-charcoal-300 bg-ivory-100/70 dark:bg-charcoal-800 border-ivory-200 dark:border-charcoal-700 hover:border-amber-400'
              )}
              title="Chuông Chánh Niệm & Chế Độ Chữ Lớn"
              aria-label="Chuông Chánh Niệm & Chế Độ Chữ Lớn"
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden xl:inline">Chánh Niệm</span>
              {bellIntervalMinutes > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs text-charcoal-500 dark:text-charcoal-400 bg-ivory-100/70 dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-300 dark:hover:border-saffron-700 hover:bg-ivory-100 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Tìm kiếm (Ctrl+K)"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4 text-charcoal-500 dark:text-charcoal-400 shrink-0" />
              <span className="hidden 2xl:inline whitespace-nowrap">Tìm kiếm...</span>
            </button>

            {/* User Profile or Dharma Name Entry */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 aspect-square md:w-auto md:h-auto md:aspect-auto p-0 md:py-1 md:pl-3 md:pr-1 gap-2 rounded-full border border-ivory-200 dark:border-charcoal-700 bg-white/60 dark:bg-charcoal-800/60 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-all active:scale-95 shadow-2xs shrink-0"
                  aria-label="Pháp danh Phật tử"
                  title={user.dharma_name || user.full_name}
                >
                  <span className="text-xs font-medium text-charcoal-800 dark:text-charcoal-200 hidden md:inline max-w-[130px] truncate whitespace-nowrap">
                    {user.dharma_name || user.full_name}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-xs font-bold text-saffron-800 dark:text-saffron-200 overflow-hidden shrink-0">
                    <span className="leading-none">{(user.dharma_name || user.full_name).charAt(0).toUpperCase()}</span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-charcoal-800 rounded-xl shadow-lg border border-ivory-200 dark:border-charcoal-700 py-1.5 z-40 animate-fade-in-up"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-ivory-100 dark:border-charcoal-700">
                      <p className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 truncate">
                        Pháp danh: {user.dharma_name || user.full_name}
                      </p>
                      <p className="text-[11px] text-saffron-600 dark:text-saffron-400">
                        Giới tính: {user.gender === 'female' ? 'Tín Nữ (Nữ)' : 'Thiện Nam (Nam)'}
                      </p>
                    </div>

                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 text-left transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-saffron-600" /> Đổi Pháp Danh
                    </button>

                    <Link
                      href="/ho-so"
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" /> Hồ sơ tu tập
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Xóa Pháp Danh
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="text-xs px-3 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>☸ Nhập Pháp Danh</span>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition-colors cursor-pointer shrink-0"
              aria-label="Mở menu điều hướng"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-saffron-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding Drawer Container */}
          <div className="relative w-[320px] max-w-[85vw] h-full bg-white dark:bg-charcoal-900 shadow-2xl flex flex-col justify-between p-5 pb-safe z-10 border-l border-ivory-200 dark:border-charcoal-800 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200 dark:border-charcoal-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-saffron-300/70 shadow-xs shrink-0 bg-ivory-100 flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Phật Pháp"
                      width={32}
                      height={32}
                      style={{ width: 32, height: 32, objectFit: 'cover' }}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-charcoal-900 dark:text-charcoal-100 block leading-tight">
                      PHẬT PHÁP
                    </span>
                    <span className="text-[9px] text-saffron-600 dark:text-saffron-400 block uppercase font-medium">
                      Học Hỏi • Chia Sẻ • Kết Nối
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-xs text-charcoal-500 dark:text-charcoal-400"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-saffron-600" />
                  Tìm kiếm bài viết, chùa...
                </span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-charcoal-700 border border-ivory-200 dark:border-charcoal-600 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Navigation Sections */}
              <nav className="space-y-4 pt-1">
                {MOBILE_SECTIONS.map((section, secIdx) => (
                  <div key={secIdx} className="space-y-1">
                    {section.title && (
                      <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-saffron-700/80 dark:text-saffron-400/80 mb-1">
                        {section.title}
                      </div>
                    )}
                    {section.items.map((link) => {
                      const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all',
                            isActive
                              ? 'text-saffron-700 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/50 font-semibold'
                              : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {'videoSrc' in link && link.videoSrc ? (
                              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                                <video
                                  src={link.videoSrc}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover scale-110 pointer-events-none"
                                />
                              </div>
                            ) : (
                              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-saffron-600' : 'text-charcoal-400')} />
                            )}
                            <span>{link.name}</span>
                          </div>
                          {'badge' in link && link.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300 leading-none">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Drawer Footer: Auth Actions */}
            <div className="pt-4 border-t border-ivory-200 dark:border-charcoal-800 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-xs font-bold text-saffron-800 dark:text-saffron-200 overflow-hidden shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="leading-none">{user.full_name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 truncate">
                        {user.full_name}
                      </div>
                      <div className="text-[11px] text-saffron-600">
                        {user.dharma_name ? `PD: ${user.dharma_name}` : user.role_id}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-xs text-rose-600"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full text-xs whitespace-nowrap"
                  >
                    ☸ Nhập Pháp Danh & Giới Tính
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
