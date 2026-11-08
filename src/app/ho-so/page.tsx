'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Edit3,
  MoreHorizontal,
  Camera,
  ChevronRight,
  BookOpen,
  Heart,
  Calendar,
  Clock,
  BarChart2,
  Settings,
  Share2,
  X,
  Check,
  User,
  Sparkles,
  ExternalLink,
  Bell,
  Globe,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { useAuth } from '@/components/auth/AuthContext';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { playBellSound, playWoodenFishSound, playPageTurnSound } from '@/lib/buddhistSounds';
import { OmManiDesktopProfile } from '@/components/om-mani/desktop/OmManiDesktopProfile';
import { cn } from '@/lib/utils';

// Meditating Figure Icon for stats
const MeditatingFigureIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="2.5" r="0.8" />
    <path d="M12 8c-2.4 0-4.2 1.6-4.5 3.8l-.5 3.2c-.1.6.4 1.1 1 1.1h8c.6 0 1.1-.5 1-1.1l-.5-3.2C16.2 9.6 14.4 8 12 8z" opacity="0.9" />
    <path d="M5.5 17.5c1.2-1.5 3.5-1.5 6.5-1.5s5.3 0 6.5 1.5c.8 1-1 2.5-3 2.5h-7c-2 0-3.8-1.5-3-2.5z" />
  </svg>
);

const MalaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="11" r="7" strokeDasharray="2 3" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M12 18v4M10 22h4" strokeLinecap="round" />
  </svg>
);

const PrayingHandsIcon = ({ className }: { className?: string }) => (
  <span className={className}>🙏</span>
);

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, setDharmaProfile, logout } = useAuth();

  // Profile fields state
  const [dharmaName, setDharmaName] = useState(user?.dharma_name || user?.full_name || 'Phật tử');
  const [realName, setRealName] = useState(user?.full_name || '');
  const [refugeDate, setRefugeDate] = useState('2024-01-01');
  const [userMotto, setUserMotto] = useState('Thiền là trở về sống trọn vẹn với hiện tại.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAboutOmManiOpen, setIsAboutOmManiOpen] = useState(false);
  const [isMemorialBookOpen, setIsMemorialBookOpen] = useState(false);
  const [isPersonalEventsOpen, setIsPersonalEventsOpen] = useState(false);
  const [isMeditationScheduleOpen, setIsMeditationScheduleOpen] = useState(false);
  const [isSupportOmManiOpen, setIsSupportOmManiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsDetailOpen, setIsStatsDetailOpen] = useState(false);

  // Practice Statistics counters
  const [stats, setStats] = useState({
    chantCount: 0,
    meditationMinutes: 0,
    malaBeadsCount: 0,
    prayersCount: 0,
    consecutiveDays: 0,
  });

  // Load saved metrics & preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChants = Number(localStorage.getItem('phatphap_personal_chant_count') || 0);
      const savedMala = Number(localStorage.getItem('phatphap_mala_beads_count') || 0);
      const savedMins = Number(localStorage.getItem('phatphap_meditation_minutes') || 0);
      const savedPrayers = Number(localStorage.getItem('phatphap_prayers_count') || 0);
      const savedMotto = localStorage.getItem('phatphap_user_motto');

      setStats({
        chantCount: savedChants,
        meditationMinutes: savedMins,
        malaBeadsCount: savedMala,
        prayersCount: savedPrayers,
        consecutiveDays: savedChants > 0 || savedMins > 0 ? 1 : 0,
      });

      if (savedMotto) setUserMotto(savedMotto);
      if (user?.dharma_name) setDharmaName(user.dharma_name);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dharmaName.trim()) return;

    setDharmaProfile(dharmaName.trim(), user?.gender === 'female' ? 'female' : 'male');
    if (typeof window !== 'undefined') {
      localStorage.setItem('phatphap_user_motto', userMotto.trim());
      localStorage.setItem('phatphap_refuge_date', refugeDate);
    }
    playWoodenFishSound(0.5);
    showToast('Đã lưu thông tin hồ sơ Phật tử');
    setIsEditProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#110D0A] text-[#FDFBF7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - 100% Locked Apple iOS Om Mani Layout                 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        {/* Container matching mobile aspect ratio */}
        <div className="max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-2 pb-32 space-y-5">

        {/* ========================================================================= */}
        {/* 1. TOP HEADER BANNER & AVATAR (MATCHING SCREENSHOT 1)                     */}
        {/* ========================================================================= */}
        <section aria-label="Hồ sơ Phật tử" className="relative text-center">
          {/* Header Banner Image (Buddha Statue with Golden Lotus Petals) */}
          <div
            className="w-full h-44 sm:h-52 rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(17, 13, 10, 0.2) 0%, rgba(17, 13, 10, 0.7) 100%), url('/images/golden_buddha.jpg')",
            }}
          >
            {/* Top Right Action Icons inside Banner */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-stone-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                title="Chỉnh sửa hồ sơ"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-stone-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                title="Cài đặt"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Overlapping Medallion Avatar with Camera Badge */}
          <div className="relative -mt-16 sm:-mt-20 inline-block">
            {/* Golden Circle Border Medallion */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#110D0A] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-2xl p-1 flex items-center justify-center mx-auto">
              <div className="w-full h-full rounded-full bg-[#20150E] flex flex-col items-center justify-center text-center overflow-hidden">
                <BuddhaBodhiIcon className="w-10 h-10 text-[#FFE082]" />
                <span className="text-[10px] font-bold text-[#FFE082] tracking-widest mt-0.5">OMA</span>
              </div>
            </div>

            {/* Bottom-right Camera Badge Button */}
            <button
              type="button"
              onClick={() => {
                playWoodenFishSound(0.3);
                setIsEditProfileOpen(true);
              }}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white text-stone-900 border border-stone-300 shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              title="Thay đổi ảnh đại diện"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Name & Status Quote */}
          <div className="mt-2.5 space-y-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              {dharmaName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 italic max-w-xs mx-auto">
              &ldquo;{userMotto}&rdquo;
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION: HÀNH TRÌNH TU TẬP (MATCHING SCREENSHOT 1 & 2)                 */}
        {/* ========================================================================= */}
        <section aria-label="Hành trình tu tập" className="rounded-3xl bg-[#1C140E] border border-stone-800/80 p-4 sm:p-5 space-y-4 shadow-xl relative overflow-hidden">
          {/* Subtle Golden Mandala Watermark */}
          <div className="absolute top-2 right-2 w-36 h-36 opacity-10 pointer-events-none">
            <BuddhaBodhiIcon className="w-full h-full text-amber-400" />
          </div>

          {/* Header Row: Big Number & Slogan */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="font-serif font-black text-4xl sm:text-5xl text-[#FFE082] leading-none">
                {stats.consecutiveDays}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-stone-300 mt-1">
                ngày tinh tấn
              </div>
            </div>
            <div className="text-stone-400 text-xs text-right font-medium max-w-[150px]">
              Hành trình chánh niệm mỗi ngày
            </div>
          </div>

          {/* Monthly Mini-Calendar Grid */}
          <div className="pt-2 border-t border-stone-800/60 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-200">Tháng 11 năm 2026</span>
              <span className="text-amber-400 font-bold">{stats.consecutiveDays} ngày</span>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-[10px] text-stone-500 font-medium">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span className="text-stone-400">CN</span>
            </div>

            {/* Days Numbers Grid */}
            <div className="grid grid-cols-7 text-center gap-y-1.5 text-xs font-mono">
              <span className="text-stone-600">26</span>
              <span className="text-stone-600">27</span>
              <span className="text-stone-600">28</span>
              <span className="text-stone-600">29</span>
              <span className="text-stone-600">30</span>
              <span className="text-stone-600">31</span>
              <span className="text-stone-300">1</span>

              <span className="text-stone-300">2</span>
              <span className="text-stone-300">3</span>
              <span className="text-stone-300">4</span>
              <span className="text-stone-300">5</span>
              <span className="text-stone-300">6</span>
              <span className="text-stone-300">7</span>
              {/* Active Today Circle (8) */}
              <div className="flex items-center justify-center">
                <span className="w-6 h-6 rounded-full border border-amber-400/80 text-amber-200 font-bold flex items-center justify-center bg-amber-500/20">
                  8
                </span>
              </div>

              <span className="text-stone-300">9</span>
              <span className="text-stone-300">10</span>
              <span className="text-stone-300">11</span>
              <span className="text-stone-300">12</span>
              <span className="text-stone-300">13</span>
              <span className="text-stone-300">14</span>
              <span className="text-stone-300">15</span>

              <span className="text-stone-300">16</span>
              <span className="text-stone-300">17</span>
              <span className="text-stone-300">18</span>
              <span className="text-stone-300">19</span>
              <span className="text-stone-300">20</span>
              <span className="text-stone-300">21</span>
              <span className="text-stone-300">22</span>

              <span className="text-stone-300">23</span>
              <span className="text-stone-300">24</span>
              <span className="text-stone-300">25</span>
              <span className="text-stone-300">26</span>
              <span className="text-stone-300">27</span>
              <span className="text-stone-300">28</span>
              <span className="text-stone-300">29</span>

              <span className="text-stone-300">30</span>
              <span className="text-stone-600">1</span>
              <span className="text-stone-600">2</span>
              <span className="text-stone-600">3</span>
              <span className="text-stone-600">4</span>
              <span className="text-stone-600">5</span>
              <span className="text-stone-600">6</span>
            </div>
          </div>

          {/* Metrics List (Matching Screenshot 1 & 2) */}
          <div className="pt-2 border-t border-stone-800/60 divide-y divide-stone-800/40 text-xs sm:text-sm">
            {/* Item 1: Tụng kinh */}
            <div
              onClick={() => router.push('/thu-vien')}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#28180E] border border-white/5 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-medium text-white group-hover:text-amber-200">Tụng kinh</span>
              </div>
              <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-300">
                <span>{stats.chantCount} lần</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Item 2: Thiền định */}
            <div
              onClick={() => router.push('/thuc-hanh')}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#28180E] border border-white/5 flex items-center justify-center text-amber-300">
                  <MeditatingFigureIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-white group-hover:text-amber-200">Thiền định</span>
              </div>
              <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-300">
                <span>{stats.meditationMinutes} phút</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Item 3: Lần chuỗi hạt */}
            <div
              onClick={() => router.push('/thuc-hanh')}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#28180E] border border-white/5 flex items-center justify-center text-amber-300">
                  <MalaIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-white group-hover:text-amber-200">Lần chuỗi hạt</span>
              </div>
              <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-300">
                <span>{stats.malaBeadsCount} hạt</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Item 4: Cầu nguyện */}
            <div
              onClick={() => router.push('/thuc-hanh')}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#28180E] border border-white/5 flex items-center justify-center text-amber-300">
                  <span className="text-xs">🙏</span>
                </div>
                <span className="font-medium text-white group-hover:text-amber-200">Cầu nguyện</span>
              </div>
              <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-300">
                <span>{stats.prayersCount} lời cầu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Item 5: Thống kê chi tiết */}
            <div
              onClick={() => setIsStatsDetailOpen(true)}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#28180E] border border-white/5 flex items-center justify-center text-amber-300">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-white group-hover:text-amber-200 block">Thống kê</span>
                  <span className="text-[11px] text-stone-400 block">Xem chi tiết tiến trình</span>
                </div>
              </div>
              <div className="text-stone-500 group-hover:text-amber-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CARD: VỀ OM MANI (MATCHING SCREENSHOT 2)                                */}
        {/* ========================================================================= */}
        <section aria-label="Về Om Mani">
          <div
            onClick={() => setIsAboutOmManiOpen(true)}
            className="rounded-3xl p-4 bg-[#1C140E] border border-stone-800/80 hover:border-amber-500/40 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#20150E] flex items-center justify-center">
                  <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                  Về Om Mani
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cộng đồng, chia sẻ &amp; cảm nhận
                </p>
              </div>
            </div>
            <div className="text-stone-500 group-hover:text-amber-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION: CÁ NHÂN (MATCHING SCREENSHOT 2 & 3)                           */}
        {/* ========================================================================= */}
        <section aria-label="Cá nhân" className="rounded-3xl bg-[#1C140E] border border-stone-800/80 p-4 sm:p-5 space-y-3.5 shadow-xl">
          <h3 className="font-heading font-bold text-base sm:text-lg text-white">
            Cá nhân
          </h3>

          <div className="divide-y divide-stone-800/40 text-xs sm:text-sm">
            {/* Item 1: Hồ sơ Phật tử */}
            <div
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <User className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Hồ sơ Phật tử</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Cập nhật pháp danh, thế danh, ngày quy y</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>

            {/* Item 2: Sổ Giỗ Chạp */}
            <div
              onClick={() => setIsMemorialBookOpen(true)}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Heart className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Sổ Giỗ Chạp</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Ghi nhớ ngày giỗ người thân</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>

            {/* Item 3: Sự kiện cá nhân */}
            <div
              onClick={() => router.push('/lich-phat-giao')}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Calendar className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Sự kiện cá nhân</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Tạo và quản lý sự kiện cá nhân</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>

            {/* Item 4: Lịch thiền định */}
            <div
              onClick={() => setIsMeditationScheduleOpen(true)}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Clock className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Lịch thiền định</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Tạo lịch nhắc thiền định</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CARD: ỦNG HỘ OM MANI (MATCHING SCREENSHOT 3)                           */}
        {/* ========================================================================= */}
        <section aria-label="Ủng hộ Om Mani">
          <div
            onClick={() => setIsSupportOmManiOpen(true)}
            className="rounded-3xl p-4 bg-[#1C140E] border border-stone-800/80 hover:border-amber-500/40 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#291A11] border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                <span className="text-sm">🪷</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                  Ủng hộ Om Mani
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Tiếp sức để Om Mani đi xa hơn
                </p>
              </div>
            </div>
            <div className="text-stone-500 group-hover:text-amber-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SECTION: CỘNG ĐỒNG OM MANI (MATCHING SCREENSHOT 3)                     */}
        {/* ========================================================================= */}
        <section aria-label="Cộng đồng Om Mani" className="rounded-3xl bg-[#1C140E] border border-stone-800/80 p-4 sm:p-5 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-base sm:text-lg text-white">
            Cộng đồng Om Mani
          </h3>

          {/* Group 1: Nhóm cộng đồng */}
          <div className="space-y-2">
            <span className="text-xs text-stone-400 font-medium block">Nhóm cộng đồng</span>
            <div className="flex gap-2.5">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-2xl bg-[#241710] hover:bg-[#342217] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">Z</span>
                <span>Zalo</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-2xl bg-[#241710] hover:bg-[#342217] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">f</span>
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Group 2: Kênh chính thức */}
          <div className="space-y-2 pt-1">
            <span className="text-xs text-stone-400 font-medium block">Kênh chính thức</span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-2xl bg-[#241710] hover:bg-[#342217] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-xs">🎵</span>
                <span>TikTok</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-2xl bg-[#241710] hover:bg-[#342217] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold">f</span>
                <span>FanPage</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 rounded-2xl bg-[#241710] hover:bg-[#342217] border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-red-500 font-bold text-xs">▶</span>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. SECTION: CÀI ĐẶT (MATCHING SCREENSHOT 3)                                */}
        {/* ========================================================================= */}
        <section aria-label="Cài đặt" className="rounded-3xl bg-[#1C140E] border border-stone-800/80 p-4 sm:p-5 space-y-3.5 shadow-xl">
          <h3 className="font-heading font-bold text-base sm:text-lg text-white">
            Cài đặt
          </h3>

          <div className="divide-y divide-stone-800/40 text-xs sm:text-sm">
            {/* Item 1: Cài đặt chung */}
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Settings className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Cài đặt</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Thông báo, ngôn ngữ ứng dụng, ...</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>

            {/* Item 2: Chia sẻ ứng dụng */}
            <div
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                  navigator
                    .share({
                      title: 'Om Mani — Ứng Dụng Phật Giáo',
                      text: 'Tải ứng dụng Om Mani để cùng tu tập, niệm Phật, lần chuỗi và thiền định mỗi ngày.',
                      url: window.location.origin,
                    })
                    .catch(() => {});
                } else {
                  showToast('Đã sao chép liên kết ứng dụng Om Mani');
                }
              }}
              className="flex items-center justify-between py-3 hover:text-amber-200 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Share2 className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <div>
                  <h5 className="font-bold text-white group-hover:text-amber-200">Chia sẻ ứng dụng</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">Mời bạn bè cùng sử dụng Om Mani</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-300" />
            </div>
          </div>
        </section>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - Luxury Dark Gold Buddhist Sanctuary Layout         */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopProfile
          dharmaName={dharmaName}
          fullName={realName}
          userMotto={userMotto}
          refugeDate={refugeDate}
          refugeTemple="Chùa Giác Ngộ (TP. HCM)"
          masterName="HT. Thích Nhật Từ"
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMemorial={() => setIsMemorialBookOpen(true)}
          onOpenPersonalEvents={() => setIsPersonalEventsOpen(true)}
          onOpenMeditationSchedule={() => setIsMeditationScheduleOpen(true)}
          onOpenSupport={() => setIsSupportOmManiOpen(true)}
          onLogout={() => {
            logout();
            showToast('Đã đăng xuất tài khoản');
          }}
          showToast={showToast}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: HỒ SƠ PHẬT TỬ                                                   */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditProfileOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-heading font-bold text-base text-[#FFE082]">
                Hồ Sơ Phật Tử
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-medium">Pháp Danh *</label>
                <input
                  type="text"
                  required
                  value={dharmaName}
                  onChange={(e) => setDharmaName(e.target.value)}
                  placeholder="Ví dụ: Giác Tịnh, Diệu Âm, Tâm Thiện..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Thế danh (Tên thật)</label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="Họ và tên ngoài đời"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Câu tâm niệm sống</label>
                <input
                  type="text"
                  value={userMotto}
                  onChange={(e) => setUserMotto(e.target.value)}
                  placeholder="Ví dụ: Sống trọn vẹn trong hiện tại..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-medium">Ngày Quy Y Tam Bảo</label>
                <input
                  type="date"
                  value={refugeDate}
                  onChange={(e) => setRefugeDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-white focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md active:scale-95"
                >
                  Lưu Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VỀ OM MANI                                                      */}
      {/* ========================================================================= */}
      {isAboutOmManiOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAboutOmManiOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-6 text-white shadow-2xl animate-scale-in text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsAboutOmManiOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-[#20150E] flex items-center justify-center">
                <BuddhaBodhiIcon className="w-8 h-8 text-[#FFE082]" />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082]">
                Om Mani — Ứng Dụng Phật Giáo
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Đồng hành cùng Phật tử trên 174 quốc gia
              </p>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed text-left p-3.5 rounded-2xl bg-black/40 border border-white/5">
              Om Mani là không gian tâm linh thuần tịnh giúp bạn gác lại lo toan trần thế, tìm về sự an định qua từng tiếng chuông mõ, hạt chuỗi niệm Phật và những lời dạy sâu sắc của Đức Thế Tôn.
            </p>

            <button
              type="button"
              onClick={() => setIsAboutOmManiOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ỦNG HỘ OM MANI                                                   */}
      {/* ========================================================================= */}
      {isSupportOmManiOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSupportOmManiOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-6 text-white shadow-2xl animate-scale-in text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsSupportOmManiOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-3xl">🪷</span>

            <h3 className="font-heading font-serif text-lg font-bold text-[#FFE082]">
              Ủng Hộ &amp; Đồng Hành
            </h3>

            <p className="text-xs text-stone-300 leading-relaxed text-left p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span>
                Toàn bộ sự đóng góp tùy hỷ của quý Phật tử sẽ được dùng để duy trì máy chủ, số hóa kinh điển và lan tỏa Phật pháp miễn phí đến khắp mọi miền.
              </span>
              <span className="block font-bold text-amber-300 pt-1">
                Ngân hàng: MB Bank (Quân Đội)<br />
                Số TK: 0987654321<br />
                Chủ TK: QUY OM MANI DHARMA
              </span>
            </p>

            <button
              type="button"
              onClick={() => {
                showToast('Chân thành tri ân công đức của quý Phật tử!');
                setIsSupportOmManiOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs"
            >
              Hoan Hỷ Tri Ân
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CÀI ĐẶT                                                          */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-heading font-bold text-base text-[#FFE082]">
                Cài Đặt Ứng Dụng
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Language */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>Ngôn ngữ hiển thị</span>
                </div>
                <LanguageSwitcher compact variant="sanctuary" />
              </div>

              {/* Sound Effect */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>Chuông chánh niệm</span>
                </div>
                <span className="text-emerald-400 font-bold">Đang bật</span>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Dữ liệu tu tập</span>
                </div>
                <span className="text-stone-400">Lưu cục bộ an toàn</span>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsSettingsOpen(false);
                    showToast('Đã đăng xuất tài khoản');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: THỐNG KÊ TIẾN TRÌNH CHI TIẾT                                    */}
      {/* ========================================================================= */}
      {isStatsDetailOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsStatsDetailOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-heading font-bold text-base text-[#FFE082]">
                Chi Tiết Tiến Trình Tu Tập
              </h3>
              <button
                type="button"
                onClick={() => setIsStatsDetailOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#FFE082] block">{stats.chantCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Khóa tụng kinh</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#FFE082] block">{stats.meditationMinutes}p</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Tọa thiền</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#FFE082] block">{stats.malaBeadsCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Hạt niệm Phật</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#FFE082] block">{stats.prayersCount}</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Lời khấn cầu</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic text-center">
              &ldquo;Mỗi bước chân chánh niệm là một đóa hoa sen nở rộ.&rdquo;
            </p>

            <button
              type="button"
              onClick={() => setIsStatsDetailOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING TOAST                                                            */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2 rounded-2xl bg-[#24130A]/95 border border-[#D4AF37] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
