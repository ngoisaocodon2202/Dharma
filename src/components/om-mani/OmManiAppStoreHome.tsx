'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Radio,
  Sparkles,
  Bell,
  Heart,
  ChevronRight,
  MapPin,
  Flame,
  Volume2,
  X,
  Share2,
  Download,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { useAuth } from '@/components/auth/AuthContext';
import { playBellSound, playWoodenFishSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { IncenseOfferingModal, MalaBeadsModal } from './OmManiInteractiveTools';
import { SearchModal } from '@/components/layout/SearchModal';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { cn } from '@/lib/utils';

// =============================================================================
// DATA: 7-DAY WEEKLY CALENDAR STRIP (MATCHING SCREENSHOT 1)
// =============================================================================
interface DayItem {
  name: string; // 'Hai', 'Ba', 'Tư', ...
  solarDate: string; // '02', '03', ...
  lunarDate: string; // '24', '25', ...
  hasDot?: boolean; // green/golden dot indicator
  isToday?: boolean;
  festivalName?: string;
}

const WEEK_DAYS: DayItem[] = [
  { name: 'Hai', solarDate: '02', lunarDate: '24' },
  { name: 'Ba', solarDate: '03', lunarDate: '25', hasDot: true },
  { name: 'Tư', solarDate: '04', lunarDate: '26' },
  { name: 'Năm', solarDate: '05', lunarDate: '27' },
  { name: 'Sáu', solarDate: '06', lunarDate: '28' },
  { name: 'Bảy', solarDate: '07', lunarDate: '29', hasDot: true },
  {
    name: 'CN',
    solarDate: '08',
    lunarDate: '30',
    hasDot: true,
    isToday: true,
    festivalName: 'Vía Dược Sư Lưu Ly Quang Vương Như Lai thành đạo',
  },
];

// =============================================================================
// DATA: BUDDHAS & BODHISATTVAS (MATCHING SCREENSHOT 5)
// =============================================================================
interface BuddhaCard {
  id: string;
  name: string;
  title: string;
  image: string;
  mantra: string;
  vow: string;
}

const BUDDHAS_LIST: BuddhaCard[] = [
  {
    id: 'duoc-su',
    name: 'Đức Phật Dược Sư',
    title: 'Dược Sư Lưu Ly Quang Vương Như Lai',
    image: '/images/buddha_temple.jpg',
    mantra: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    vow: '12 Đại nguyện diệt trừ mọi tật bệnh thân tâm, ban phát ánh sáng lưu ly thanh tịnh cho muôn loài.',
  },
  {
    id: 'thich-ca',
    name: 'Đức Phật Thích Ca Mâu Ni',
    title: 'Bổn Sư Thích Ca Mâu Ni Phật',
    image: '/images/golden_buddha.jpg',
    mantra: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    vow: 'Đấng Giác Ngộ khai mở Chánh pháp, chỉ dạy con đường Bát Chánh Đạo đưa chúng sinh thoát khỏi luân hồi.',
  },
  {
    id: 'a-di-da',
    name: 'Đức Phật A Di Đà',
    title: 'Tiếp Dẫn Đạo Sư A Di Đà Phật',
    image: '/images/buddha_meditation.jpg',
    mantra: 'Nam Mô A Di Đà Phật',
    vow: '48 Đại nguyện tiếp dẫn chúng sinh trì niệm danh hiệu về cõi Cực Lạc an vui, vĩnh viễn không thoái chuyển.',
  },
  {
    id: 'quan-am',
    name: 'Bồ Tát Quán Thế Âm',
    title: 'Đại Bi Quán Thế Âm Bồ Tát',
    image: '/images/quan_am_bodhisattva.jpg',
    mantra: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    vow: 'Tầm thanh cứu khổ, lắng nghe tiếng kêu cầu của muôn loài trong mười phương bằng lòng từ bi vô lượng.',
  },
  {
    id: 'dia-tang',
    name: 'Bồ Tát Địa Tạng',
    title: 'Đại Nguyện Địa Tạng Vương Bồ Tát',
    image: '/images/tran_nhan_tong_yentu.jpg',
    mantra: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vow: '“Địa ngục vị không, thệ bất thành Phật. Chúng sinh độ tận, phương chứng Bồ Đề.”',
  },
];

// =============================================================================
// DATA: VIETNAMESE ANCIENT TEMPLES (MATCHING SCREENSHOT 5)
// =============================================================================
interface TempleItem {
  name: string;
  location: string;
  image: string;
  href: string;
}

const TEMPLES_LIST: TempleItem[] = [
  {
    name: 'Chùa Một Cột',
    location: 'Hà Nội',
    image: '/images/ancient_pagoda.jpg',
    href: '/chua-dia-danh/chua-mot-cot-ha-noi',
  },
  {
    name: 'Chùa Bái Đính',
    location: 'Ninh Bình',
    image: '/images/chua_bai_dinh.jpg',
    href: '/chua-dia-danh/quan-su-co-tu-ha-noi',
  },
  {
    name: 'Chùa Yên Tử',
    location: 'Quảng Ninh',
    image: '/images/tran_nhan_tong_yentu.jpg',
    href: '/chua-dia-danh/thien-vien-truc-lam-yen-tu-quang-ninh',
  },
  {
    name: 'Chùa Thiên Mụ',
    location: 'Thừa Thiên Huế',
    image: '/images/ancient_pagoda.jpg',
    href: '/chua-dia-danh/chua-thien-mu-thua-thien-hue',
  },
  {
    name: 'Chùa Tam Chúc',
    location: 'Hà Nam',
    image: '/images/temple_sanctuary_bg.jpg',
    href: '/chua-dia-danh/quan-su-co-tu-ha-noi',
  },
];

// =============================================================================
// DATA: PRAYER TEXTS / BÀI KHẤN (MATCHING SCREENSHOT 5)
// =============================================================================
interface PrayerTextItem {
  badge: string;
  title: string;
  content: string;
}

const PRAYER_TEXTS: PrayerTextItem[] = [
  {
    badge: 'HÔM NAY • VÍA DƯỢC SƯ LƯU LY QUANG VƯƠNG NHƯ LAI THÀNH ĐẠO',
    title: 'Kinh Dược Sư',
    content:
      'Quy mạng Dược Sư Lưu Ly Quang, Bổn nguyện rộng sâu độ thế gian. Cứu khổ trừ tai thân mạng vững, Ánh sáng lưu ly tỏa muôn phương.\n\nNam mô Dược Sư Hải Hội Phật Bồ Tát (3 lần).\n\nNam mô bạt già phạt đế, bệ sát xã, lũ lô thích lưu ly, phách lạt bà, hắt ra xà dã, đát tha yết đa da, a ra ha đế, tam miệu tam bột đà da, đát điệt tha: Án, bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế tằng sa ha.',
  },
  {
    badge: 'LỄ TẠI GIA',
    title: 'Văn khấn mùng Một và ngày Rằm',
    content:
      'Nam Mô A Di Đà Phật (3 lần, 3 lạy)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\n\nCon kính lạy Hoàng thiên Hậu thổ chư vị Tôn thần, Bản xứ Thổ địa Long Mạch Tôn thần, các ngài Thần linh cai quản trong khu vực này.\n\nCon kính lạy Tiền chủ, Hậu chủ các vị hương linh ngự trên đất này.\n\nHôm nay là ngày sóc/vọng, tín chủ con thành tâm sắm sửa hương hoa trà quả, thắp nén tâm hương dâng lên trước án, cúi xin chư vị gia ân phù hộ độ trì cho gia đạo bình an, sở cầu như ý, sở nguyện tòng tâm.',
  },
];

export function OmManiAppStoreHome() {
  const router = useRouter();
  const { user } = useAuth();

  // Active day selection
  const [selectedDay, setSelectedDay] = useState<DayItem>(WEEK_DAYS[6]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaCard | null>(null);
  const [selectedPrayerText, setSelectedPrayerText] = useState<PrayerTextItem | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick Action Sound / Chimes
  const handleRingBell = () => {
    playBellSound(0.5);
    showToast('Nghe tiếng chuông phiền não tan mây khói...');
  };

  const handleWoodenFish = () => {
    playWoodenFishSound(0.6);
    showToast('Tâm thanh tịnh, chánh niệm từng phút giây');
  };

  const handleChantAudio = () => {
    playGrandTempleBellSound(0.4);
    showToast('Đang phát thanh âm niệm Phật thanh tịnh');
  };

  return (
    <div className="min-h-screen bg-[#110D0A] text-[#FDFBF7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Container matching phone aspect ratio centered on larger screens */}
      <div className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-3.5 sm:px-4 pt-3 pb-32 space-y-6">

        {/* ========================================================================= */}
        {/* 1. TOP APP BAR & GREETING (MATCHING SCREENSHOT 1)                         */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between gap-3 pt-1">
          {/* Left: Golden Circular Medallion */}
          <Link
            href="/ho-so"
            className="flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            title="Hồ sơ Phật tử"
          >
            <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_2px_10px_rgba(212,175,55,0.3)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#241710] flex items-center justify-center overflow-hidden">
                <BuddhaBodhiIcon className="w-5 h-5 text-[#FFE082]" />
              </div>
            </div>
          </Link>

          {/* Center: "Xin chào, Phật tử" */}
          <div className="min-w-0 flex-1 text-center font-heading text-[15px] sm:text-base font-bold text-stone-100 truncate">
            Xin chào,{' '}
            <span className="text-[#FFE082]">
              {user?.dharma_name || user?.full_name || 'Phật tử'}
            </span>
          </div>

          {/* Right: Language Switcher & Circular Search Icon Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <LanguageSwitcher compact variant="sanctuary" />
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-full border border-stone-800 bg-[#241710]/85 hover:bg-[#342217] flex items-center justify-center text-stone-300 hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Tìm kiếm"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4 text-stone-200" />
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. WEEKLY CALENDAR STRIP (MATCHING SCREENSHOT 1)                          */}
        {/* ========================================================================= */}
        <section aria-label="Lịch tuần Phật giáo">
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center select-none">
            {WEEK_DAYS.map((day) => {
              const isSelected = selectedDay.name === day.name;
              return (
                <button
                  key={day.name}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95',
                    isSelected
                      ? 'bg-gradient-to-b from-[#C4681E] to-[#99470B] text-white shadow-lg ring-1 ring-amber-300/40'
                      : 'bg-transparent text-stone-400 hover:text-stone-200'
                  )}
                >
                  <span className="text-[11px] font-medium opacity-85 leading-none">
                    {day.name}
                  </span>
                  <div className="flex items-center gap-0.5 my-1">
                    <span
                      className={cn(
                        'text-sm sm:text-base font-bold leading-none font-mono',
                        isSelected ? 'text-white' : 'text-stone-200'
                      )}
                    >
                      {day.solarDate}
                    </span>
                    {day.hasDot && (
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-amber-200' : 'bg-emerald-400'
                        )}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-mono opacity-70 leading-none">
                    {day.lunarDate}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FEATURED DAILY BUDDHIST CALENDAR CARD (MATCHING SCREENSHOT 1)          */}
        {/* ========================================================================= */}
        <section
          onClick={() => router.push('/lich-phat-giao')}
          className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-[#29140B] via-[#482010] to-[#733010] shadow-2xl p-5 sm:p-6 min-h-[220px] flex items-center justify-between cursor-pointer group active:scale-99 transition-all"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-radial-at-t from-amber-400/15 via-transparent to-transparent pointer-events-none" />

          {/* Left Text Information */}
          <div className="relative z-10 flex-1 pr-3">
            <div className="text-xs text-amber-200/90 font-medium whitespace-nowrap">
              Lập đông • Chủ nhật • {selectedDay.solarDate}/11/2026
            </div>
            <div className="text-xs text-amber-300 font-bold mt-1 flex items-center gap-1">
              <span>🌙 Âm lịch</span>
            </div>

            {/* Giant Bold Lunar Day Number */}
            <div className="font-heading text-6xl sm:text-7xl font-black text-white leading-none my-1 tracking-tight drop-shadow-md">
              {selectedDay.lunarDate}
            </div>

            <div className="text-sm font-semibold text-amber-100">Tháng 09</div>
            <div className="text-xs text-amber-300/80 font-medium">Năm Bính Ngọ</div>

            {/* Bottom Trai / Festival Pill */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-amber-400/30 text-amber-200 text-[11px] font-medium backdrop-blur-sm max-w-full truncate">
              <span>🌸</span>
              <span className="truncate">
                {selectedDay.festivalName || 'Ngày trai giới thanh tịnh • Tinh tấn tu học'}
              </span>
            </div>
          </div>

          {/* Right Buddha Statue in Sunset Glow */}
          <div className="relative w-36 sm:w-44 h-48 sm:h-52 shrink-0 flex items-center justify-end pointer-events-none">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src="/images/golden_buddha.jpg"
                alt="Đức Phật Bổn Sư"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {/* Sunset orange light blend overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#29140B] via-transparent to-amber-900/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29140B] via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. DAILY DHARMA QUOTE / PHÁP CÚ (MATCHING SCREENSHOT 1)                    */}
        {/* ========================================================================= */}
        <section className="relative py-4 px-3 text-center select-none">
          {/* Subtle Golden Lotus Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <BuddhaBodhiIcon className="w-36 h-36 text-amber-400" />
          </div>

          <blockquote className="font-heading italic text-stone-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto relative z-10">
            &ldquo;Như từ một đống hoa,<br />
            Nhiều tràng hoa được làm.<br />
            Cũng vậy, thân sanh tử,<br />
            Làm được nhiều việc lành.&rdquo;
          </blockquote>
          <p className="text-xs text-amber-300/90 font-medium mt-2.5 relative z-10">
            Trích Kinh Pháp Cú (Phẩm Hoa)
          </p>

          <div className="flex justify-center items-center gap-2 mt-2 text-amber-500/40 relative z-10">
            <span className="w-8 h-[1px] bg-amber-500/30" />
            <span className="text-xs">🪷</span>
            <span className="w-8 h-[1px] bg-amber-500/30" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TU TẬP NỔI BẬT (RADIAL MANDALA WHEEL - MATCHING SCREENSHOT 2)          */}
        {/* ========================================================================= */}
        <section aria-label="Tu tập nổi bật" className="space-y-3">
          <h2 className="font-heading font-bold text-base sm:text-lg text-stone-100">
            Tu tập nổi bật
          </h2>

          {/* Cosmic Radial Wheel Layout */}
          <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[370px] mx-auto flex items-center justify-center my-2">
            {/* Concentric Dashed Orbits */}
            <div className="absolute w-[290px] h-[290px] rounded-full border border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '60s' }} />
            <div className="absolute w-[220px] h-[220px] rounded-full border border-amber-500/15" />
            <div className="absolute w-[150px] h-[150px] rounded-full border border-dashed border-amber-500/20" />

            {/* CENTER GOLDEN BUTTON: Thiền định */}
            <button
              type="button"
              onClick={() => router.push('/phong-thien')}
              className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#C98B23] via-[#F3C25D] to-[#C98B23] text-charcoal-950 shadow-[0_0_35px_rgba(243,194,93,0.45)] flex flex-col items-center justify-center p-2 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1 text-charcoal-950 flex items-center justify-center">
                {/* Meditating Lotus Figure SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <circle cx="12" cy="5" r="2.2" />
                  <circle cx="12" cy="2.5" r="0.8" />
                  <path d="M12 8c-2.4 0-4.2 1.6-4.5 3.8l-.5 3.2c-.1.6.4 1.1 1 1.1h8c.6 0 1.1-.5 1-1.1l-.5-3.2C16.2 9.6 14.4 8 12 8z" opacity="0.9" />
                  <path d="M5.5 17.5c1.2-1.5 3.5-1.5 6.5-1.5s5.3 0 6.5 1.5c.8 1-1 2.5-3 2.5h-7c-2 0-3.8-1.5-3-2.5z" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xs sm:text-sm text-charcoal-950 leading-tight">
                Thiền định
              </span>
            </button>

            {/* 5 ORBITAL NODES (ARRANGED IN PENTAGON AT RADIUS ~116px) */}

            {/* 1. TOP (12:00, -90°): Tụng kinh */}
            <div
              className="absolute flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
              style={{ top: '6px', left: '50%', transform: 'translateX(-50%)' }}
              onClick={() => router.push('/thu-vien')}
            >
              <div className="w-12 h-12 rounded-full bg-[#201812] border border-amber-500/40 shadow-md flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:bg-[#2A1F17] transition-all">
                <BookOpen className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-semibold text-stone-300 mt-1 whitespace-nowrap">
                Tụng kinh
              </span>
            </div>

            {/* 2. TOP-RIGHT (2:24, -18°): Máy niệm */}
            <div
              className="absolute flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
              style={{ top: '24%', right: '14px' }}
              onClick={handleChantAudio}
            >
              <div className="w-12 h-12 rounded-full bg-[#201812] border border-amber-500/40 shadow-md flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:bg-[#2A1F17] transition-all">
                <Radio className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-semibold text-stone-300 mt-1 whitespace-nowrap">
                Máy niệm
              </span>
            </div>

            {/* 3. BOTTOM-RIGHT (4:48, +54°): Trì chú */}
            <div
              className="absolute flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
              style={{ bottom: '16%', right: '34px' }}
              onClick={() => {
                const el = document.getElementById('minh-chu-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else router.push('/thuc-hanh');
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#201812] border border-amber-500/40 shadow-md flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:bg-[#2A1F17] transition-all">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-semibold text-stone-300 mt-1 whitespace-nowrap">
                Trì chú
              </span>
            </div>

            {/* 4. BOTTOM-LEFT (7:12, +126°): Tràng hạt */}
            <div
              className="absolute flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
              style={{ bottom: '16%', left: '34px' }}
              onClick={() => setIsMalaOpen(true)}
            >
              <div className="w-12 h-12 rounded-full bg-[#201812] border border-amber-500/40 shadow-md flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:bg-[#2A1F17] transition-all">
                {/* Mala beads icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-amber-300">
                  <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                  <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                  <path d="M12 19v3" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-stone-300 mt-1 whitespace-nowrap">
                Tràng hạt
              </span>
            </div>

            {/* 5. TOP-LEFT (9:36, +198°): Chuông mõ */}
            <div
              className="absolute flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
              style={{ top: '24%', left: '14px' }}
              onClick={() => {
                handleRingBell();
                setTimeout(() => handleWoodenFish(), 500);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#201812] border border-amber-500/40 shadow-md flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:bg-[#2A1F17] transition-all">
                <Bell className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[11px] font-semibold text-stone-300 mt-1 whitespace-nowrap">
                Chuông mõ
              </span>
            </div>
          </div>

          {/* Button: Xem tất cả phương tiện tu tập */}
          <div className="flex justify-center pt-1">
            <Link
              href="/thuc-hanh"
              className="px-6 py-2 rounded-full border border-stone-700 bg-white/5 hover:bg-white/10 text-xs font-semibold text-amber-200 transition-colors shadow-sm active:scale-95"
            >
              Xem tất cả phương tiện tu tập
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. PHÒNG CẦU CHUNG (MATCHING SCREENSHOT 2 & 3)                           */}
        {/* ========================================================================= */}
        <section aria-label="Phòng cầu chung" className="space-y-3">
          <h2 className="font-heading font-bold text-base sm:text-lg text-stone-100">
            Phòng cầu chung
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Phòng Cầu An (Quán Thế Âm Bồ Tát) */}
            <div
              onClick={() => router.push('/cau-nguyen')}
              className="relative aspect-[3/4.2] rounded-3xl overflow-hidden border border-amber-500/30 bg-[#201712] shadow-xl group cursor-pointer active:scale-98 transition-all"
            >
              <img
                src="/images/quan_am_bodhisattva.jpg"
                alt="Phòng Cầu An - Quán Thế Âm Bồ Tát"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Đang diễn ra</span>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3 inset-x-3 text-left">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                  Phòng cầu an
                </h3>
                <p className="text-[11px] text-amber-200/90 font-medium flex items-center gap-1 mt-0.5">
                  <span>✍</span>
                  <span>Viết lời ước nguyện</span>
                </p>
              </div>
            </div>

            {/* Card 2: Phòng Cầu Siêu (Địa Tạng Vương Bồ Tát) */}
            <div
              onClick={() => router.push('/hoi-huong')}
              className="relative aspect-[3/4.2] rounded-3xl overflow-hidden border border-amber-500/30 bg-[#201712] shadow-xl group cursor-pointer active:scale-98 transition-all"
            >
              <img
                src="/images/tran_nhan_tong_yentu.jpg"
                alt="Phòng Cầu Siêu - Địa Tạng Vương Bồ Tát"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-bold text-rose-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Đang diễn ra</span>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3 inset-x-3 text-left">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                  Phòng cầu siêu
                </h3>
                <p className="text-[11px] text-amber-200/90 font-medium flex items-center gap-1 mt-0.5">
                  <span>✈</span>
                  <span>Gửi hồi hướng</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. ĐI CHÙA (CHÁNH ĐIỆN ONLINE - MATCHING SCREENSHOT 3)                    */}
        {/* ========================================================================= */}
        <section aria-label="Đi chùa online" className="space-y-3">
          <h2 className="font-heading font-bold text-base sm:text-lg text-stone-100">
            Đi chùa
          </h2>

          <div
            onClick={() => router.push('/cau-nguyen')}
            className="relative aspect-[16/8] sm:aspect-[16/7.5] rounded-3xl overflow-hidden border border-amber-500/30 bg-[#201712] shadow-2xl group cursor-pointer active:scale-99 transition-all"
          >
            <img
              src="/images/temple_sanctuary_bg.jpg"
              alt="Chánh điện Đi Chùa Online"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white drop-shadow-md">
                  Chánh điện
                </h3>
                <p className="text-xs text-amber-200/90 font-medium mt-0.5 truncate">
                  Ánh đèn sen soi sáng, hướng về chánh pháp
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-charcoal-950 font-bold text-xs shadow-md shrink-0 flex items-center gap-1 pointer-events-none"
              >
                <span>Vào chùa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Row underneath Chánh Điện */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => router.push('/thuc-hanh')}
              className="px-3.5 py-1.5 rounded-full bg-[#201812] border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>🧘</span>
              <span>Tu tập</span>
            </button>
            <button
              onClick={() => {
                handleRingBell();
                setTimeout(() => handleWoodenFish(), 400);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#201812] border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>🔔</span>
              <span>Chuông mõ</span>
            </button>
            <button
              onClick={() => {
                showToast('Nam Mô Đại Bi Quán Thế Âm Bồ Tát');
                playBellSound(0.4);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#201812] border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>✨</span>
              <span>Chú Đại Bi</span>
            </button>
            <button
              onClick={() => router.push('/phap-thoai')}
              className="px-3.5 py-1.5 rounded-full bg-[#201812] border border-stone-800 hover:border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <span>🎵</span>
              <span>Pháp thoại</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. SỰ KIỆN PHẬT GIÁO 2026 › (MATCHING SCREENSHOT 3 & 4)                   */}
        {/* ========================================================================= */}
        <section aria-label="Sự kiện Phật giáo 2026" className="space-y-3">
          <Link
            href="/lich-phat-giao"
            className="inline-flex items-center gap-1 font-heading font-bold text-base sm:text-lg text-stone-100 hover:text-amber-300 transition-colors"
          >
            <span>Sự kiện Phật Giáo 2026</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </Link>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {/* Card: Tháng 11 (6 sự kiện) */}
            <div className="w-[280px] sm:w-[320px] rounded-3xl bg-[#1C1612] border border-stone-800/80 p-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="font-heading font-bold text-sm text-amber-200">Tháng 11</h3>
                <span className="text-[11px] text-stone-400">6 sự kiện</span>
              </div>

              {/* Event 1 */}
              <div
                onClick={() => router.push('/lich-phat-giao')}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-950/80 shrink-0 border border-amber-500/20">
                  <img src="/images/buddha_temple.jpg" alt="Vía Dược Sư" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 truncate">
                    Vía Dược Sư Lưu Ly Quang Vương Nh...
                  </p>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    Chủ nhật, 08-11 • Âm lịch 30-09
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
              </div>

              {/* Event 2 */}
              <div
                onClick={() => router.push('/lich-phat-giao')}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-950/80 shrink-0 border border-amber-500/20">
                  <img src="/images/golden_buddha.jpg" alt="Mùng 1 tháng 10" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 truncate">
                    Ngày mùng 1 tháng 10 Âm lịch
                  </p>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    Thứ 2, 09-11 • Âm lịch 01-10
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
              </div>

              {/* Event 3 */}
              <div
                onClick={() => router.push('/lich-phat-giao')}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-950/80 shrink-0 border border-amber-500/20">
                  <img src="/images/tran_nhan_tong_yentu.jpg" alt="Vía Bồ Đề Đạt Ma" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 truncate">
                    Vía Bồ Đề Đạt Ma
                  </p>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    Thứ 6, 13-11 • Âm lịch 05-10
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
              </div>

              <div className="pt-1 text-center">
                <Link
                  href="/lich-phat-giao"
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  +3 sự kiện khác
                </Link>
              </div>
            </div>

            {/* Card: Tháng 12 (4 sự kiện) */}
            <div className="w-[280px] sm:w-[320px] rounded-3xl bg-[#1C1612] border border-stone-800/80 p-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="font-heading font-bold text-sm text-amber-200">Tháng 12</h3>
                <span className="text-[11px] text-stone-400">4 sự kiện</span>
              </div>

              {/* Event 1 */}
              <div
                onClick={() => router.push('/lich-phat-giao')}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-950/80 shrink-0 border border-amber-500/20">
                  <img src="/images/buddha_meditation.jpg" alt="Vía Phật A Di Đà" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 truncate">
                    Vía Đức Phật A Di Đà
                  </p>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    Thứ 4, 23-12 • Âm lịch 17-11
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
              </div>

              {/* Event 2 */}
              <div
                onClick={() => router.push('/lich-phat-giao')}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-950/80 shrink-0 border border-amber-500/20">
                  <img src="/images/lotus_blooming.jpg" alt="Rằm tháng 11" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-200 truncate">
                    Ngày rằm tháng 11 Âm lịch
                  </p>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    Thứ 2, 21-12 • Âm lịch 15-11
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
              </div>

              <div className="pt-6 text-center">
                <Link
                  href="/lich-phat-giao"
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  +2 sự kiện khác
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9 & 10. KHÁM PHÁ & ẢNH ĐẸP HÌNH NỀN (MATCHING SCREENSHOT 4)               */}
        {/* ========================================================================= */}
        <section aria-label="Khám phá và ảnh đẹp hình nền" className="space-y-3 pt-2">
          {/* Header with Buddha Hand Sketch Watermark on the Right */}
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-stone-100">
                Khám phá
              </h2>
              <p className="text-xs text-stone-400">Tìm hiểu thế giới Phật giáo</p>
            </div>

            {/* Subtle Buddha hand sketch */}
            <div className="w-16 h-10 text-stone-600 opacity-60 pointer-events-none">
              <svg viewBox="0 0 100 45" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 25 C 30 10, 60 15, 80 20 C 95 24, 98 32, 90 35 C 80 38, 70 28, 55 28 C 40 28, 25 35, 10 38" />
                <path d="M50 20 C 60 10, 75 12, 85 18" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>

          <h3 className="font-heading font-bold text-sm sm:text-base text-stone-200 pt-1">
            Ảnh đẹp &amp; hình nền
          </h3>

          {/* Masonry Layout: Left Tall, Right 2 Stacked */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Left Column: Tall Statue in Garden */}
            <div
              onClick={() =>
                setPreviewImage({
                  src: '/images/buddha_meditation.jpg',
                  title: 'Tượng Phật Tọa Thiền Trong Mưa',
                })
              }
              className="relative aspect-[3/4.8] rounded-2xl overflow-hidden border border-stone-800 bg-[#1C1612] group cursor-pointer active:scale-98 transition-all"
            >
              <img
                src="/images/buddha_meditation.jpg"
                alt="Tượng Phật Thiền Định"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right Column: Stacked 2 photos */}
            <div className="flex flex-col gap-2.5">
              {/* Top: Relief Reclining Buddha */}
              <div
                onClick={() =>
                  setPreviewImage({
                    src: '/images/ancient_pagoda.jpg',
                    title: 'Phù Điêu Phật Nhập Niết Bàn Khung Gỗ Vàng',
                  })
                }
                className="relative aspect-[4/2.6] rounded-2xl overflow-hidden border border-stone-800 bg-[#1C1612] group cursor-pointer active:scale-98 transition-all"
              >
                <img
                  src="/images/ancient_pagoda.jpg"
                  alt="Phù điêu Phật"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom: White Pagoda Buddha */}
              <div
                onClick={() =>
                  setPreviewImage({
                    src: '/images/buddha_temple.jpg',
                    title: 'Bảo Tháp & Tôn Tượng Phật Trắng Tự Viện',
                  })
                }
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-800 bg-[#1C1612] group cursor-pointer active:scale-98 transition-all"
              >
                <img
                  src="/images/buddha_temple.jpg"
                  alt="Tự viện Phật giáo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. THƯ VIỆN PHẬT & BỒ TÁT › (MATCHING SCREENSHOT 5)                      */}
        {/* ========================================================================= */}
        <section aria-label="Thư viện Phật và Bồ Tát" className="space-y-3">
          <Link
            href="/thu-vien"
            className="inline-flex items-center gap-1 font-heading font-bold text-base sm:text-lg text-stone-100 hover:text-amber-300 transition-colors"
          >
            <span>Thư viện Phật &amp; Bồ Tát</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </Link>

          {/* Horizontal Carousel of warm ivory portrait cards */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {BUDDHAS_LIST.map((buddha) => (
              <div
                key={buddha.id}
                onClick={() => setSelectedBuddha(buddha)}
                className="w-36 sm:w-40 rounded-2xl overflow-hidden border border-stone-800/80 bg-[#1C1612] shrink-0 group cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <div className="aspect-square bg-[#FDF8EC] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={buddha.image}
                    alt={buddha.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 text-center bg-[#1C1612]">
                  <p className="font-heading font-bold text-xs text-stone-200 truncate leading-snug">
                    {buddha.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. CHÙA VIỆT NAM › (MATCHING SCREENSHOT 5)                               */}
        {/* ========================================================================= */}
        <section aria-label="Chùa Việt Nam" className="space-y-3">
          <Link
            href="/chua-dia-danh"
            className="inline-flex items-center gap-1 font-heading font-bold text-base sm:text-lg text-stone-100 hover:text-amber-300 transition-colors"
          >
            <span>Chùa Việt Nam</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </Link>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {TEMPLES_LIST.map((temple) => (
              <div
                key={temple.name}
                onClick={() => router.push(temple.href)}
                className="w-48 sm:w-56 rounded-2xl overflow-hidden border border-stone-800/80 bg-[#1C1612] shrink-0 group cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 bg-[#1C1612]">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-stone-200 truncate">
                    {temple.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{temple.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. BÀI KHẤN › (MATCHING SCREENSHOT 5)                                    */}
        {/* ========================================================================= */}
        <section aria-label="Bài khấn" className="space-y-3">
          <Link
            href="/hoi-huong"
            className="inline-flex items-center gap-1 font-heading font-bold text-base sm:text-lg text-stone-100 hover:text-amber-300 transition-colors"
          >
            <span>Bài khấn</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            {PRAYER_TEXTS.map((item) => (
              <div
                key={item.title}
                onClick={() => setSelectedPrayerText(item)}
                className="p-4 rounded-2xl bg-[#241B14] border border-amber-600/30 hover:border-amber-400/60 shadow-md flex flex-col justify-between cursor-pointer group active:scale-98 transition-all min-h-[110px]"
              >
                <div>
                  <div className="text-[9.5px] uppercase font-bold tracking-wider text-amber-400/90 leading-tight">
                    {item.badge}
                  </div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white mt-1.5 leading-snug group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <div className="text-[10px] text-stone-400 mt-2 flex items-center gap-1">
                  <span>Chạm để đọc bài khấn</span>
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* MODALS & POPUPS                                                           */}
      {/* ========================================================================= */}

      {/* 1. Mala Beads 3D Modal */}
      <MalaBeadsModal isOpen={isMalaOpen} onClose={() => setIsMalaOpen(false)} />

      {/* 2. Incense Offering Modal */}
      <IncenseOfferingModal isOpen={isIncenseOpen} onClose={() => setIsIncenseOpen(false)} />

      {/* 3. Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 4. Buddha Info Modal */}
      {selectedBuddha && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBuddha(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in space-y-4">
            <button
              onClick={() => setSelectedBuddha(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-[#FDF8EC] p-2 flex items-center justify-center">
              <img src={selectedBuddha.image} alt={selectedBuddha.name} className="w-full h-full object-contain" />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#FFE082]">
                {selectedBuddha.title}
              </h3>
              <p className="text-xs text-amber-300/80 font-mono mt-1 italic">
                &ldquo;{selectedBuddha.mantra}&rdquo;
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-stone-300 leading-relaxed">
              <p className="font-bold text-amber-200 mb-1">Đại Nguyện &amp; Công Đức:</p>
              <p>{selectedBuddha.vow}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedBuddha(null);
                  playGrandTempleBellSound(0.5);
                  showToast(`Nhất tâm đảnh lễ ${selectedBuddha.name}`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-charcoal-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Đảnh Lễ Tam Bảo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Prayer Text / Bài Khấn Modal */}
      {selectedPrayerText && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrayerText(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {selectedPrayerText.badge}
                </span>
                <h3 className="font-heading font-bold text-base text-[#FFE082] truncate mt-0.5">
                  {selectedPrayerText.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPrayerText(null)}
                className="text-stone-400 hover:text-white p-1 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3 text-xs sm:text-sm text-stone-200 leading-relaxed font-serif whitespace-pre-line">
              {selectedPrayerText.content}
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedPrayerText(null)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Wallpaper Full-Screen Image Preview Modal */}
      {previewImage && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewImage(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-w-sm w-full rounded-3xl overflow-hidden bg-stone-950 border border-amber-500/30 p-2 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-full aspect-[3/4.5] rounded-2xl overflow-hidden">
              <img src={previewImage.src} alt={previewImage.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 text-center w-full">
              <p className="font-heading font-bold text-xs text-amber-200">{previewImage.title}</p>
              <div className="flex gap-2 mt-2 justify-center">
                <a
                  href={previewImage.src}
                  download
                  className="px-4 py-1.5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh về máy</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Floating Blessing Toast */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-[#24130A]/95 border border-[#D4AF37] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OmManiAppStoreHome;

