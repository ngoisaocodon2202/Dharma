'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  BookOpen,
  Play,
  Pause,
  MapPin,
  Download,
  PenLine,
  Send,
  Volume2,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';
import { SearchModal } from '@/components/layout/SearchModal';
import { getDailyDhammapadaVerse, DHAMMAPADA_VERSES, type DhammapadaVerse } from '@/data/dhammapada';
import { BUDDHAS_DATA } from '@/data/buddhasData';
import { PAGODAS_DATA } from '@/data/pagodas';
import { CURATED_ARTICLES } from '@/data/articles';
import {
  BAI_KHAN_DATA,
  WALLPAPER_GALLERY,
  type BaiKhanItem,
  type WallpaperGalleryItem,
} from '@/data/dharmaExtraData';
import { ORDERED_CORE_PRACTICE_TOOLS, NEW_DHARMA_PRACTICE_TOOLS } from '@/data/practiceToolsData';
import { BUDDHA_ASSETS } from '@/lib/assets';
import { getLunarDate } from '@/lib/lunar-calendar';
import {
  playBellSound,
  playChantingPulse,
  startHealingDrone,
  stopHealingDrone,
} from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import {
  useDharmaStore,
  getTodayDateKey,
  createEmptyDailyLog,
  type TimePeriodKey,
} from '@/store/useDharmaStore';
import { cn } from '@/lib/utils';

const WEEKDAY_STRIP_LABELS = [
  { short: 'Hai', full: 'Thứ Hai' },
  { short: 'Ba', full: 'Thứ Ba' },
  { short: 'Tư', full: 'Thứ Tư' },
  { short: 'Năm', full: 'Thứ Năm' },
  { short: 'Sáu', full: 'Thứ Sáu' },
  { short: 'Bảy', full: 'Thứ Bảy' },
  { short: 'CN', full: 'Chủ nhật' },
];

interface WeekStripDayItem {
  dateKey: string;
  weekdayShort: string;
  weekdayFull: string;
  solarLabel: string;
  solarNum: string;
  lunarDay: number;
  lunarMonth: number;
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
  tietKhi: string;
  isLucTrai: boolean;
  isThapTrai: boolean;
  viaChuPhat?: string;
  isToday: boolean;
  hasGreenDot: boolean;
  hasOrangeDot: boolean;
}

function buildCurrentWeekDays(now: Date): WeekStripDayItem[] {
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = `${todayMidnight.getFullYear()}-${String(todayMidnight.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(todayMidnight.getDate()).padStart(2, '0')}`;

  const jsDay = todayMidnight.getDay();
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;

  const days: WeekStripDayItem[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(
      todayMidnight.getFullYear(),
      todayMidnight.getMonth(),
      todayMidnight.getDate() + mondayOffset + i
    );
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const info = getLunarDate(y, m, day);
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const labelMeta = WEEKDAY_STRIP_LABELS[i];

    days.push({
      dateKey,
      weekdayShort: labelMeta.short,
      weekdayFull: labelMeta.full,
      solarLabel: `${String(day).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
      solarNum: String(day).padStart(2, '0'),
      lunarDay: info.lunarDay,
      lunarMonth: info.lunarMonth,
      yearCanChi: info.yearCanChi,
      monthCanChi: info.monthCanChi,
      dayCanChi: info.dayCanChi,
      tietKhi: info.tietKhi,
      isLucTrai: info.isLucTrai,
      isThapTrai: info.isThapTrai,
      viaChuPhat: info.viaChuPhat,
      isToday: dateKey === todayKey,
      hasGreenDot: !info.viaChuPhat && (info.isLucTrai || info.isThapTrai),
      hasOrangeDot: Boolean(info.viaChuPhat || info.isMainTraiDay),
    });
  }
  return days;
}

function findNextViaCountdown(now: Date): { title: string; daysRemaining: number } | null {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let offset = 1; offset <= 60; offset++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    const info = getLunarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (info.viaChuPhat) {
      return { title: info.viaChuPhat, daysRemaining: offset };
    }
  }
  return null;
}

interface MonthEventGroup {
  month: number;
  year: number;
  totalCount: number;
  items: Array<{
    title: string;
    subtitle: string;
    image: string;
  }>;
}

function buildUpcomingMonthsEvents(now: Date): MonthEventGroup[] {
  const groups: MonthEventGroup[] = [];
  for (let mOffset = 0; mOffset < 3; mOffset++) {
    const target = new Date(now.getFullYear(), now.getMonth() + mOffset, 1);
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const items: MonthEventGroup['items'] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month - 1, d);
      const lunar = getLunarDate(year, month, d);
      if (lunar.viaChuPhat || lunar.isMainTraiDay) {
        const jsWd = dateObj.getDay();
        const wdName =
          jsWd === 0
            ? 'Chủ nhật'
            : jsWd === 1
            ? 'Thứ 2'
            : jsWd === 2
            ? 'Thứ 3'
            : jsWd === 3
            ? 'Thứ 4'
            : jsWd === 4
            ? 'Thứ 5'
            : jsWd === 5
            ? 'Thứ 6'
            : 'Thứ 7';
        const title =
          lunar.viaChuPhat ||
          (lunar.lunarDay === 1
            ? `Ngày mùng 1 tháng ${lunar.lunarMonth} Âm lịch`
            : `Ngày Rằm tháng ${lunar.lunarMonth} Âm lịch`);
        const img = lunar.viaChuPhat
          ? lunar.viaChuPhat.includes('Dược Sư')
            ? BUDDHA_ASSETS['duoc-su']
            : lunar.viaChuPhat.includes('Quán Thế Âm') || lunar.viaChuPhat.includes('Quan Âm')
            ? BUDDHA_ASSETS['quan-am']
            : lunar.viaChuPhat.includes('A Di Đà')
            ? BUDDHA_ASSETS['a-di-da']
            : lunar.viaChuPhat.includes('Địa Tạng')
            ? BUDDHA_ASSETS['dia-tang']
            : BUDDHA_ASSETS['thich-ca']
          : '/images/buddhas/dai-nhat-nhu-lai.png';

        items.push({
          title,
          subtitle: `${wdName}, ${String(d).padStart(2, '0')}-${String(month).padStart(
            2,
            '0'
          )} • Âm lịch ${String(lunar.lunarDay).padStart(2, '0')}-${String(lunar.lunarMonth).padStart(
            2,
            '0'
          )}`,
          image: img,
        });
      }
    }

    groups.push({
      month,
      year,
      totalCount: items.length,
      items,
    });
  }
  return groups;
}

interface CanonicalBonTon {
  slug: string;
  libraryId: string;
  name: string;
  fullTitle: string;
  feastDay: string;
  image: string;
  mantra: string;
  vowsSummary: string[];
}

const FIVE_CANONICAL_BON_TON: CanonicalBonTon[] = [
  {
    slug: 'thich-ca',
    libraryId: 'duc-phat-thich-ca-mau-ni',
    name: 'Đức Phật Thích Ca Mâu Ni',
    fullTitle: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    feastDay: 'Đản sanh: 08/04 & 15/04 ÂL • Thành đạo: 08/12 ÂL',
    image: BUDDHA_ASSETS['thich-ca'],
    mantra: 'Namo Tassa Bhagavato Arahato Sammāsambuddhassa • Om Muni Muni Mahāmuniye Svāhā',
    vowsSummary: [
      'Thị hiện cõi Ta Bà uế trược, chỉ bày Tứ Diệu Đế và Bát Chánh Đạo giúp chúng sinh tự thắp đuốc giác ngộ.',
      'Chuyển pháp luân suốt 45 năm không mệt mỏi vì an lạc và giải thoát của chư thiên cùng nhân loại.',
      'Lấy Giới – Định – Tuệ làm nền tảng tu học bình đẳng cho tứ chúng đệ tử.',
    ],
  },
  {
    slug: 'duoc-su',
    libraryId: 'duc-phat-duoc-su',
    name: 'Đức Phật Dược Sư Lưu Ly Quang',
    fullTitle: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    feastDay: 'Ngày vía: 30 tháng 09 Âm lịch (hoặc 29/09 tháng thiếu)',
    image: BUDDHA_ASSETS['duoc-su'],
    mantra: 'Tadyathā: Oṃ Bhaiṣajye Bhaiṣajye Bhaiṣajya-Samudgate Svāhā',
    vowsSummary: [
      '12 Đại Nguyện Dược Sư: Thân tướng quang minh trong suốt như ngọc Lưu Ly chiếu sáng vô biên thế giới.',
      'Chữa lành mọi tật bệnh thân tâm, tiêu trừ tai ách, giúp người bệnh tật nghèo khổ đều được đầy đủ phương tiện tu hành.',
      'Chuyển hóa tà kiến về chánh kiến Đại Thừa, hộ niệm người lâm chung an lành sinh về cõi tịnh.',
    ],
  },
  {
    slug: 'a-di-da',
    libraryId: 'duc-phat-a-di-da',
    name: 'Đức Phật A Di Đà',
    fullTitle: 'Nam Mô A Di Đà Phật (Vô Lượng Quang • Vô Lượng Thọ)',
    feastDay: 'Ngày vía: 17 tháng 11 Âm lịch',
    image: BUDDHA_ASSETS['a-di-da'],
    mantra: 'Nam Mô A Di Đà Phật • Oṃ Ami Dewa Hriḥ',
    vowsSummary: [
      '48 Đại Nguyện kiến lập thế giới Cực Lạc thanh tịnh trang nghiêm không còn ba đường ác.',
      'Nguyện thứ 18 (Thập Niệm Tất Sinh): Chúng sinh mười phương chí tâm tín ưa, xưng niệm danh hiệu Ngài cho đến mười niệm đều được tiếp dẫn.',
      'Phóng hào quang vô lượng nhiếp thọ người niệm Phật, lúc lâm chung tâm không điên đảo, hóa sinh nơi hoa sen bảy báu.',
    ],
  },
  {
    slug: 'quan-am',
    libraryId: 'quan-the-am-bo-tat',
    name: 'Bồ Tát Quán Thế Âm',
    fullTitle: 'Nam Mô Đại Từ Đại Bi Tầm Thanh Cứu Khổ Cứu Nạn Quán Thế Âm Bồ Tát',
    feastDay: 'Ngày vía: 19/02 (Đản sanh) • 19/06 (Thành đạo) • 19/09 (Xuất gia) ÂL',
    image: BUDDHA_ASSETS['quan-am'],
    mantra: 'Oṃ Maṇi Padme Hūṃ • Nam Mô Quán Thế Âm Bồ Tát',
    vowsSummary: [
      '12 Đại Nguyện Quán Âm: Lắng nghe tiếng kêu khổ của chúng sinh mười phương mà ứng hiện cứu độ không chậm trễ.',
      'Dùng cành dương liễu và nước cam lồ rưới mát lửa sân giận, tai nạn nước lửa, hiểm nguy bức bách.',
      'Tùy duyên hiện 32 ứng thân để thuyết pháp độ sinh, ban vui (Từ) và cứu khổ (Bi) bình đẳng.',
    ],
  },
  {
    slug: 'dia-tang',
    libraryId: 'dia-tang-vuong-bo-tat',
    name: 'Bồ Tát Địa Tạng Vương',
    fullTitle: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    feastDay: 'Ngày vía: 30 tháng 07 Âm lịch (Mùa Vu Lan Báo Hiếu)',
    image: BUDDHA_ASSETS['dia-tang'],
    mantra: 'Oṃ Ha Ha Ha Vismaye Svāhā • Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vowsSummary: [
      'Đại Nguyện Địa Tạng: "Địa ngục vị không, thệ bất thành Phật; Chúng sinh độ tận, phương chứng Bồ Đề."',
      'Dùng tích trượng sáu vòng mở cửa u minh và minh châu Như Ý soi sáng cõi tối tăm đau khổ.',
      'Phó chúc của Đức Phật Thích Ca tại cung trời Đao Lợi: Cứu vớt chúng sinh đời Mạt pháp và siêu độ cửu huyền thất tổ.',
    ],
  },
];

const DAILY_FOUR_SESSIONS: Array<{
  key: TimePeriodKey;
  title: string;
  timeRange: string;
  subtitle: string;
}> = [
  {
    key: 'thoiKhuya',
    title: 'Thời Khuya',
    timeRange: '04:00 - 05:30',
    subtitle: 'Nghi thức Lăng Nghiêm / Công phu khuya',
  },
  {
    key: 'thoiSang',
    title: 'Thời Sáng',
    timeRange: '06:00 - 07:30',
    subtitle: 'Trì Chú Đại Bi & Kinh Nhật Tụng',
  },
  {
    key: 'thoiChieu',
    title: 'Thời Chiều',
    timeRange: '16:00 - 17:30',
    subtitle: 'Kinh A Di Đà & Mông Sơn Thí Thực',
  },
  {
    key: 'thoiToi',
    title: 'Thời Tối',
    timeRange: '19:30 - 21:00',
    subtitle: 'Tịnh Độ Niệm Phật & Sám Hối Sáu Căn',
  },
];

export function DharmaHomeView() {
  const { profile } = useDharmaPracticeStore();
  const dailyLogs = useDharmaStore((s) => s.dailyLogs);
  const toggleTimePeriod = useDharmaStore((s) => s.toggleTimePeriod);
  const bookmarkedVerseIds = useDharmaStore((s) => s.bookmarkedVerseIds);
  const toggleVerseBookmark = useDharmaStore((s) => s.toggleVerseBookmark);

  const [now, setNow] = useState<Date>(() => new Date());
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Verse state
  const dailyVerse = useMemo(() => getDailyDhammapadaVerse(now), [now]);
  const [customVerse, setCustomVerse] = useState<DhammapadaVerse | null>(null);

  // Full-Screen Sub-Pages: Bài Khấn, Wallpaper Preview, About DHARMA, 5-Buddha Detail
  const [activeBaiKhan, setActiveBaiKhan] = useState<BaiKhanItem | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperGalleryItem | null>(null);
  const [selectedBonTon, setSelectedBonTon] = useState<CanonicalBonTon | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Auto-scroll state for Bài Khấn full-screen reader
  const baiKhanScrollRef = useRef<HTMLDivElement | null>(null);
  const [isBaiKhanAutoScrolling, setIsBaiKhanAutoScrolling] = useState(true);
  const [baiKhanScrollSpeed, setBaiKhanScrollSpeed] = useState<number>(1);
  const [copiedBaiKhan, setCopiedBaiKhan] = useState(false);

  // Featured Heart Sutra Sanskrit Audio State
  const [isSanskritPlaying, setIsSanskritPlaying] = useState(false);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    const jsDay = d.getDay();
    setSelectedDayIdx(jsDay === 0 ? 6 : jsDay - 1);

    const interval = setInterval(() => {
      const fresh = new Date();
      setNow((prev) => (prev.getDate() !== fresh.getDate() ? fresh : prev));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isSanskritPlaying) {
      stopHealingDrone();
      return;
    }
    startHealingDrone(432, 0.16);
    let step = 0;
    const id = setInterval(() => {
      playChantingPulse('luc-tu', step % 6, 0.22);
      step++;
    }, 1150);
    return () => {
      clearInterval(id);
      stopHealingDrone();
    };
  }, [isSanskritPlaying]);

  // Smooth sub-pixel auto-scroll for Bài Khấn full-screen teleprompter
  useEffect(() => {
    if (!activeBaiKhan || !isBaiKhanAutoScrolling) return;
    let rafId: number;
    let lastTs = performance.now();
    let acc = 0;

    const step = (ts: number) => {
      const dt = Math.min(64, ts - lastTs);
      lastTs = ts;
      const el = baiKhanScrollRef.current;
      if (el) {
        const pxPerSec = 26 * baiKhanScrollSpeed;
        acc += (pxPerSec * dt) / 1000;
        if (acc >= 0.5) {
          const move = Math.floor(acc * 2) / 2;
          el.scrollTop += move;
          acc -= move;
        }
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
          setIsBaiKhanAutoScrolling(false);
          return;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [activeBaiKhan, isBaiKhanAutoScrolling, baiKhanScrollSpeed]);

  const weekDays = useMemo(() => buildCurrentWeekDays(now), [now]);
  const selectedDay = weekDays[selectedDayIdx] || weekDays[0];
  const nextViaCountdown = useMemo(() => findNextViaCountdown(now), [now]);
  const monthEventGroups = useMemo(() => buildUpcomingMonthsEvents(now), [now]);
  const activeVerse = customVerse || dailyVerse;
  const isVerseSaved = bookmarkedVerseIds.includes(activeVerse.id);

  const todayKey = getTodayDateKey();
  const todayLog = dailyLogs[todayKey] || createEmptyDailyLog(todayKey);
  const completedSessionCount = DAILY_FOUR_SESSIONS.filter((s) => Boolean(todayLog[s.key])).length;
  const sessionProgressPct = completedSessionCount * 25;

  const rotateVerse = () => {
    playBellSound(0.28);
    const nextIdx = Math.floor(Math.random() * DHAMMAPADA_VERSES.length);
    setCustomVerse(DHAMMAPADA_VERSES[nextIdx]);
  };

  const handleCopyBaiKhan = async () => {
    if (!activeBaiKhan) return;
    const text = [
      activeBaiKhan.title,
      '',
      activeBaiKhan.openingVerse,
      '',
      ...activeBaiKhan.paragraphs,
      '',
      activeBaiKhan.closingVerse,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBaiKhan(true);
      setTimeout(() => setCopiedBaiKhan(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10] pb-10">
      <div className="w-full max-w-xl mx-auto lg:max-w-6xl px-3.5 sm:px-6 pt-3 lg:pt-6 space-y-6">
        {/* 1. MOBILE REACT-NATIVE HEADER BAR */}
        <header className="lg:hidden flex items-center justify-between gap-2.5 pt-0.5">
          <Link
            href="/ho-so"
            className="w-9 h-9 rounded-2xl overflow-hidden border border-[#DFC27D] bg-[#FFFDF8] shrink-0 shadow-xs"
            title={profile.dharmaName || 'Dharma'}
          >
            <img
              src={profile.avatarUrl || '/images/dharma-logo.png'}
              alt={profile.dharmaName || 'Dharma'}
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] truncate">
              LIÊN HOA ĐÀI • DHARMA
            </p>
            <p className="text-sm font-bold text-[#2C1E10] truncate">
              An lạc, <span className="text-[#8C5500]">{profile.dharmaName || 'Dharma'}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Tìm kiếm"
            className="w-9 h-9 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] flex items-center justify-center text-[#5C3A08] cursor-pointer active:scale-95 shrink-0 shadow-xs"
          >
            <Search className="w-4 h-4" />
          </button>
        </header>

        {/* 2. LIÊN HOA NHẬT ẤN & BÁT BẢO PHÁP KHÍ CỐT LÕI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN (7 cols): 7-Day Week Strip + Golden Lunar Card + Dhammapada Verse */}
          <div className="lg:col-span-7 space-y-4">
            {/* 7-Day Week Strip — Compact Square Tiles */}
            <div className="grid grid-cols-7 gap-1 text-center select-none bg-[#FFFFFF] p-1 rounded-2xl border border-[#EAD7A7] shadow-xs">
              {weekDays.map((d, idx) => {
                const isSelected = idx === selectedDayIdx;
                const isSunday = idx === 6;

                return (
                  <button
                    key={d.dateKey}
                    type="button"
                    onClick={() => setSelectedDayIdx(idx)}
                    className={cn(
                      'h-11 sm:h-12 flex flex-col items-center justify-center gap-0.5 py-0.5 px-0.5 rounded-xl transition-all cursor-pointer relative',
                      isSelected
                        ? 'bg-gradient-to-b from-[#C68B19] to-[#8C5500] text-white shadow-xs'
                        : 'hover:bg-[#FFF9EB] text-[#6B533B]'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[9px] font-bold leading-none whitespace-nowrap',
                        isSelected
                          ? 'text-white'
                          : isSunday
                          ? 'text-[#C0392B]'
                          : 'text-[#7E664E]'
                      )}
                    >
                      {d.weekdayShort}
                    </span>

                    <div className="relative flex items-center justify-center">
                      <span
                        className={cn(
                          'text-xs sm:text-sm font-extrabold leading-none whitespace-nowrap',
                          isSelected ? 'text-white' : 'text-[#2C1E10]'
                        )}
                      >
                        {d.solarNum}
                      </span>
                      {(d.hasOrangeDot || d.hasGreenDot) && (
                        <span
                          className={cn(
                            'w-1 h-1 rounded-full absolute -right-1.5 -top-0.5',
                            d.hasOrangeDot ? 'bg-[#E67E22]' : 'bg-[#27AE60]'
                          )}
                        />
                      )}
                    </div>

                    <span
                      className={cn(
                        'text-[9px] font-semibold leading-none whitespace-nowrap',
                        isSelected ? 'text-[#FFF4D2]' : 'text-[#8C5500]'
                      )}
                    >
                      {String(d.lunarDay).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Warm Golden Lunar Hero Card — Compact Square-Proportioned */}
            <div className="relative rounded-2xl overflow-hidden border border-[#DFC27D] bg-gradient-to-br from-[#FFF9EB] via-[#FCECC9] to-[#F5DC9C] min-h-[176px] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm">
              <img
                src="/images/buddhas/duc-phat-thich-ca.png"
                alt="Đức Phật Từ Bi"
                className="absolute inset-y-0 right-0 w-[48%] h-full object-cover object-top opacity-90 pointer-events-none select-none"
                style={{
                  maskImage: 'linear-gradient(to left, black 40%, transparent 98%)',
                  WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 98%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9EB]/95 via-[#FCECC9]/75 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1 max-w-[68%]">
                <p className="text-[11px] font-bold text-[#6B533B] whitespace-nowrap truncate">
                  {selectedDay.tietKhi} • {selectedDay.weekdayFull} • {selectedDay.solarLabel}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C5500] whitespace-nowrap">
                  <span>🌙 Âm lịch</span>
                  {selectedDay.isLucTrai && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-bold whitespace-nowrap">
                      Ngày Lục Trai
                    </span>
                  )}
                  {!selectedDay.isLucTrai && selectedDay.isThapTrai && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-bold whitespace-nowrap">
                      Ngày Thập Trai
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold leading-none tracking-tight text-[#2C1E10] whitespace-nowrap">
                    {String(selectedDay.lunarDay).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-[#2C1E10] whitespace-nowrap">
                      Tháng {String(selectedDay.lunarMonth).padStart(2, '0')} ÂL
                    </p>
                    <p className="text-[10px] font-semibold text-[#6B533B] whitespace-nowrap truncate">
                      {selectedDay.yearCanChi} • Ngày {selectedDay.dayCanChi}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/lich-phat-giao"
                className="relative z-10 mt-2.5 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#FFFFFF]/90 backdrop-blur-md border border-[#DFC27D] hover:border-[#8C5500] transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs leading-none shrink-0">🪷</span>
                  <span className="text-[11px] font-bold text-[#2C1E10] whitespace-nowrap truncate">
                    {selectedDay.viaChuPhat ||
                      (selectedDay.isLucTrai
                        ? 'Ngày Lục Trai tịnh tâm ăn chay'
                        : selectedDay.isThapTrai
                        ? 'Ngày Thập Trai giữ tâm thanh tịnh'
                        : nextViaCountdown
                        ? `Còn ${nextViaCountdown.daysRemaining} ngày đến ${nextViaCountdown.title}`
                        : `Tiết ${selectedDay.tietKhi} • Mở Ấn Lịch tháng ${selectedDay.lunarMonth}`)}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C5500] shrink-0" />
              </Link>
            </div>

            {/* Kệ Pháp Cú Hôm Nay */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] relative flex flex-col items-center text-center space-y-2.5 shadow-xs">
              <LotusMinimalIcon className="w-24 h-24 text-[#C68B19]/10 absolute inset-0 m-auto pointer-events-none" />
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                Lời Phật Dạy Hôm Nay • {activeVerse.chapter} ({activeVerse.verseNumber})
              </span>
              <p className="relative z-10 font-serif italic text-sm text-[#2C1E10] leading-relaxed max-w-md line-clamp-3">
                “{activeVerse.verse}”
              </p>

              <div className="relative z-10 flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={rotateVerse}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF9EB] hover:bg-[#FCECC9] border border-[#DFC27D] text-[11px] font-bold text-[#8C5500] inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Gieo Kệ Pháp Cú</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.22);
                    toggleVerseBookmark(activeVerse.id);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all whitespace-nowrap',
                    isVerseSaved
                      ? 'bg-[#8C5500] text-white border-[#8C5500]'
                      : 'bg-[#FFFFFF] hover:bg-[#FFF9EB] text-[#5C3A08] border-[#EAD7A7]'
                  )}
                >
                  {isVerseSaved ? (
                    <BookmarkCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span>{isVerseSaved ? 'Đã lưu kệ' : 'Lưu kệ tâm đắc'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): PHƯƠNG TIỆN TU TẬP */}
          <section className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
                Phương Tiện Tu Tập
              </h2>
              <Link
                href="/thuc-hanh"
                className="px-3 py-1.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[11px] font-bold text-[#8C5500] whitespace-nowrap shrink-0"
              >
                Xem tất cả →
              </Link>
            </div>

            {/* Compact Square 2x4 Grid (Zero Text Overflow) */}
            <div className="grid grid-cols-2 gap-2.5">
              {ORDERED_CORE_PRACTICE_TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative aspect-[1.28/1] rounded-2xl overflow-hidden border border-[#DFC27D] bg-[#2C1E10] shadow-xs hover:shadow-md transition-all"
                >
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <div className="absolute inset-x-2.5 bottom-2 text-left">
                    <h3 className="text-xs sm:text-[13px] font-bold text-white truncate">
                      {tool.title}
                    </h3>
                    <p className="text-[10px] text-[#FCECC9] truncate">{tool.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* 3. PHÁP MÔN ỨNG DỤNG & CHÁNH NIỆM */}
        <section className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
              Pháp Môn Ứng Dụng &amp; Chánh Niệm
            </h2>
            <Link
              href="/thuc-hanh"
              className="text-xs font-bold text-[#8C5500] hover:underline whitespace-nowrap shrink-0"
            >
              Khám phá →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {NEW_DHARMA_PRACTICE_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFF9EB] hover:bg-[#FCECC9]/70 border border-[#EAD7A7] hover:border-[#C68B19] transition-all min-w-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#DFC27D] shrink-0 bg-[#2C1E10]">
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-[#2C1E10] truncate">{tool.title}</h3>
                  <p className="text-[10px] text-[#6B533B] truncate mt-0.5">{tool.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. ĐÀN TRÀNG CẦU AN & CẦU SIÊU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <section className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
                Đàn Tràng Cầu An &amp; Cầu Siêu
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Đàn Dược Sư Cầu An */}
              <Link
                href="/cau-nguyen"
                className="group relative rounded-2xl overflow-hidden aspect-[4/4.2] border border-[#DFC27D] shadow-sm bg-[#2C1E10]"
              >
                <img
                  src="/images/dharma/tools/09-cau-an.jpg"
                  alt="Đàn Cầu An"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-3 inset-x-3 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    Phòng Cầu An
                  </h3>
                  <p className="text-[11px] text-[#FCECC9] flex items-center gap-1 truncate">
                    <PenLine className="w-3 h-3 shrink-0" />
                    <span className="truncate">Gửi lời cầu bình an</span>
                  </p>
                </div>
              </Link>

              {/* Đàn Địa Tạng Cầu Siêu */}
              <Link
                href="/cau-sieu"
                className="group relative rounded-2xl overflow-hidden aspect-[4/4.2] border border-[#DFC27D] shadow-sm bg-[#2C1E10]"
              >
                <img
                  src="/images/dharma/tools/03-cau-sieu.jpg"
                  alt="Đàn Cầu Siêu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-3 inset-x-3 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    Phòng Cầu Siêu
                  </h3>
                  <p className="text-[11px] text-[#FCECC9] flex items-center gap-1 truncate">
                    <Send className="w-3 h-3 shrink-0" />
                    <span className="truncate">Hồi hướng Cửu Huyền</span>
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Chánh Điện Tam Bảo */}
          <section className="lg:col-span-5 flex flex-col space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
              Lễ Phật Chánh Điện Tam Bảo
            </h2>

            <Link
              href="/di-chua-online"
              className="group relative flex-1 min-h-[195px] rounded-2xl overflow-hidden border border-[#DFC27D] shadow-sm flex flex-col justify-end p-4 bg-[#2C1E10]"
            >
              <img
                src="/images/dharma/tools/02-di-chua.jpg"
                alt="Chánh điện Tam Bảo"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white truncate">
                    Chánh Điện Online
                  </h3>
                  <p className="text-xs text-[#EAE2D0] truncate">
                    Đảnh lễ Tam Bảo, dâng hương &amp; tụng kinh
                  </p>
                </div>

                <span className="px-3.5 py-2 rounded-xl bg-[#FFF9EB] text-[#8C5500] text-xs font-bold shrink-0 inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <span>Vào lễ Phật</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </section>
        </div>

        {/* 5. THỜI KHÓA TỨ THỜI CÔNG PHU HẰNG NGÀY */}
        <section className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
                Thời Khóa 4 Thời Hôm Nay
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] whitespace-nowrap">
                {completedSessionCount}/4 Thời ({sessionProgressPct}%)
              </span>
              <Link
                href="/ho-so"
                className="text-xs font-bold text-[#6B533B] hover:text-[#8C5500] whitespace-nowrap"
              >
                Sổ Công Đức →
              </Link>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-[#FAF3E3] overflow-hidden border border-[#EAD7A7]">
            <div
              className="h-full bg-gradient-to-r from-[#8C5500] via-[#C68B19] to-[#E5A93B] transition-all duration-500"
              style={{ width: `${sessionProgressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DAILY_FOUR_SESSIONS.map((sess) => {
              const isDone = Boolean(todayLog[sess.key]);
              return (
                <button
                  key={sess.key}
                  type="button"
                  onClick={() => {
                    playBellSound(0.32);
                    toggleTimePeriod(sess.key);
                  }}
                  className={cn(
                    'text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 active:scale-[0.99] min-w-0',
                    isDone
                      ? 'bg-[#FFF9EB] border-[#C68B19] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] hover:border-[#C68B19]'
                  )}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8C5500] whitespace-nowrap">
                      <Clock className="w-3 h-3 shrink-0" />
                      {sess.timeRange}
                    </span>
                    <CheckCircle2
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isDone ? 'text-emerald-600' : 'text-[#C8B99E]'
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#2C1E10] truncate">
                      {sess.title}
                    </h3>
                    <p className="text-[11px] text-[#6B533B] truncate mt-0.5">{sess.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. BẢO ĐIỆN NGŨ PHƯƠNG BỔN TÔN & 18 VỊ PHẬT, BỒ TÁT */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Link
                href="/thu-vien-bon-ton"
                className="inline-flex items-center gap-1 text-base sm:text-lg font-bold text-[#2C1E10] hover:text-[#8C5500] truncate"
              >
                <span className="truncate">Bảo Điện Chư Phật &amp; Bồ Tát</span>
                <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
              </Link>
            </div>

            <Link
              href="/thu-vien-bon-ton"
              className="px-3 py-1.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] whitespace-nowrap shrink-0"
            >
              Trọn bộ 18 Vị →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {FIVE_CANONICAL_BON_TON.map((bt) => (
              <button
                key={bt.slug}
                type="button"
                onClick={() => {
                  playBellSound(0.28);
                  setSelectedBonTon(bt);
                }}
                className="group rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] flex flex-col shadow-xs transition-all cursor-pointer text-left"
              >
                <div className="aspect-square bg-[#FFF9EB] overflow-hidden relative">
                  <img
                    src={bt.image}
                    alt={bt.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-[#FFFFFF]/90 text-[#8C5500] border border-[#DFC27D] text-[10px] font-bold">
                    Đại Nguyện
                  </span>
                </div>
                <div className="px-2.5 py-2 bg-[#FFFFFF] flex items-center justify-center text-center">
                  <span className="text-xs font-bold text-[#2C1E10] truncate w-full">
                    {bt.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 7. VĂN KHẤN CỔ TRUYỀN & THIỀN ÂM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <section className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#2C1E10] truncate">
                  Văn Khấn Cổ Truyền Việt Nam
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBaiKhanAutoScrolling(true);
                  setActiveBaiKhan(BAI_KHAN_DATA[0]);
                }}
                className="px-3 py-1 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer whitespace-nowrap"
              >
                Xem tất cả →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {BAI_KHAN_DATA.slice(0, 4).map((bk) => (
                <button
                  key={bk.id}
                  type="button"
                  onClick={() => {
                    setIsBaiKhanAutoScrolling(true);
                    setActiveBaiKhan(bk);
                  }}
                  className="text-left p-3 rounded-2xl bg-[#FFF9EB] hover:bg-[#FCECC9]/70 border border-[#EAD7A7] space-y-1 cursor-pointer transition-all min-w-0"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block truncate">
                    {bk.eyebrow}
                  </span>
                  <p className="text-xs font-bold text-[#2C1E10] truncate">{bk.title}</p>
                  <p className="text-[10px] text-[#6B533B] truncate">{bk.occasion}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#FFF9EB] via-[#FCECC9] to-[#F4D99B] border border-[#DFC27D] p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs">
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/80 border border-[#DFC27D] text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                THIỀN ÂM TẦN SỐ 432HZ • 528HZ
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1E10] truncate">
                Bát Nhã Tâm Kinh &amp; Sóng Âm Chữa Lành
              </h3>
              <p className="text-xs text-[#5C3A08] line-clamp-2">
                Kết hợp sóng âm tần số 432Hz thư giãn sâu cùng chuông xoay Tây Tạng và giọng tụng kinh nhẹ nhàng.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFFFF]/90 border border-[#DFC27D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-[#8C5500]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2C1E10] truncate">
                    Tâm Kinh Tịnh Tâm 432Hz
                  </p>
                  <p className="text-[11px] text-[#6B533B] truncate">
                    {isSanskritPlaying ? 'Đang phát tần số 432Hz...' : 'Chạm để phát sóng âm an thần'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSanskritPlaying((v) => !v)}
                className="w-10 h-10 rounded-xl bg-[#8C5500] text-white hover:bg-[#6E4200] flex items-center justify-center shadow-sm cursor-pointer shrink-0"
                aria-label={isSanskritPlaying ? 'Tạm dừng' : 'Phát 432Hz'}
              >
                {isSanskritPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </section>
        </div>

        {/* 8. SỰ KIỆN PHẬT GIÁO SẮP TỚI */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href="/lich-phat-giao"
              className="inline-flex items-center gap-1 text-base sm:text-lg font-bold text-[#2C1E10] hover:text-[#8C5500] truncate"
            >
              <span className="truncate">Ấn Lịch Sự Kiện Phật Giáo {now.getFullYear()}</span>
              <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {monthEventGroups.map((grp) => (
              <Link
                key={`${grp.year}-${grp.month}`}
                href="/lich-phat-giao"
                className="rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] p-3.5 space-y-2.5 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#8C5500]">Tháng {grp.month}</span>
                  <span className="text-xs font-semibold text-[#6B533B]">
                    {grp.totalCount} ngày lễ/trai
                  </span>
                </div>

                <div className="space-y-2">
                  {grp.items.slice(0, 3).map((ev, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-10 h-10 rounded-xl object-cover border border-[#EAD7A7] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#2C1E10] truncate">{ev.title}</p>
                        <p className="text-[11px] text-[#6B533B] truncate">{ev.subtitle}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C5500] shrink-0" />
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. 18 DANH LAM CỔ TỰ 3 MIỀN & HÌNH NỀN 4K */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/chua-dia-danh"
              className="inline-flex items-center gap-1 text-base sm:text-lg font-bold text-[#2C1E10] hover:text-[#8C5500] truncate"
            >
              <span className="truncate">Hành Hương 18 Danh Lam Cổ Tự Việt Nam</span>
              <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
            </Link>
            <Link
              href="/chua-dia-danh"
              className="text-xs font-bold text-[#8C5500] hover:underline whitespace-nowrap shrink-0"
            >
              Xem bản đồ →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PAGODAS_DATA.slice(0, 4).map((p) => (
              <Link
                key={p.slug}
                href={`/chua-dia-danh/${p.slug}`}
                className="group rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-all shadow-xs"
              >
                <div className="aspect-[16/10] bg-[#FFF9EB] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-2.5 space-y-0.5">
                  <h3 className="text-xs font-bold text-[#2C1E10] truncate">{p.name}</h3>
                  <p className="text-[11px] text-[#6B533B] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0 text-[#8C5500]" />
                    <span className="truncate">
                      {p.province} • {p.region}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 11. THƯ VIỆN ẢNH THIỀN & HÌNH NỀN 4K */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#2C1E10] truncate">
            Ấn Phẩm Hình Nền Phật Giáo 4K
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {WALLPAPER_GALLERY.map((wp) => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setActiveWallpaper(wp)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#DFC27D] bg-[#FFFFFF] cursor-pointer shadow-xs"
              >
                <img
                  src={wp.image}
                  alt={wp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 right-2.5 text-left text-xs font-bold text-white truncate">
                  {wp.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 12. CẨM NANG PHÁP HỌC & CHUYỂN HÓA TÂM */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/bai-viet"
              className="inline-flex items-center gap-1 text-base sm:text-lg font-bold text-[#2C1E10] hover:text-[#8C5500] truncate"
            >
              <span className="truncate">Cẩm Nang Chuyển Hóa Tâm</span>
              <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
            </Link>
            <Link
              href="/bai-viet"
              className="text-xs font-bold text-[#8C5500] hover:underline whitespace-nowrap shrink-0"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CURATED_ARTICLES.slice(0, 4).map((art) => (
              <Link
                key={art.slug}
                href={`/bai-viet/${art.slug}`}
                className="group flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-all shadow-xs min-w-0"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF9EB] border border-[#DFC27D] shrink-0">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C5500] uppercase truncate">
                    <span className="truncate">{art.category}</span>
                    <span>•</span>
                    <span className="text-[#6B533B] font-medium whitespace-nowrap">{art.readTime}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#2C1E10] group-hover:text-[#8C5500] truncate">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-[#6B533B] truncate">{art.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ===================================================================== */}
      {/* FULL-SCREEN SUB-PAGE 1: CHI TIẾT BỔN TÔN (100% FULL SCREEN + QUAY LẠI) */}
      {/* ===================================================================== */}
      {selectedBonTon && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedBonTon(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              {selectedBonTon.name}
            </h2>
            <Link
              href={`/thu-vien-bon-ton?id=${encodeURIComponent(selectedBonTon.libraryId)}`}
              onClick={() => setSelectedBonTon(null)}
              className="px-3 py-2 rounded-xl bg-[#8C5500] text-white text-xs font-bold whitespace-nowrap"
            >
              Tiểu sử đầy đủ
            </Link>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-5">
            <div className="rounded-3xl overflow-hidden bg-[#FFF9EB] border border-[#DFC27D] p-4 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
              <img
                src={selectedBonTon.image}
                alt={selectedBonTon.name}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border border-[#DFC27D] shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left min-w-0">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DFC27D] text-[11px] font-bold text-[#8C5500]">
                  {selectedBonTon.feastDay}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1E10]">
                  {selectedBonTon.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#6B533B]">
                  {selectedBonTon.fullTitle}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-2 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C5500]">
                Tâm Chú &amp; Hồng Danh Trì Niệm
              </span>
              <p className="font-serif italic text-base sm:text-lg font-semibold text-[#2C1E10] leading-relaxed">
                {selectedBonTon.mantra}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500]">
                Mười Phương Đại Nguyện Cốt Tủy
              </h4>
              <ul className="space-y-2.5 text-sm text-[#2C1E10] list-disc pl-5">
                {selectedBonTon.vowsSummary.map((v, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <footer className="px-4 py-3 bg-[#FFFDF8] border-t border-[#EAD7A7] flex items-center justify-between gap-3 max-w-3xl mx-auto w-full shrink-0">
            <button
              type="button"
              onClick={() => setSelectedBonTon(null)}
              className="px-4 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#5C3A08] cursor-pointer"
            >
              ← Quay lại trang chủ
            </button>
            <Link
              href={`/thuc-hanh?phap-khi=trang-hat&bon-ton=${encodeURIComponent(
                selectedBonTon.slug
              )}`}
              onClick={() => setSelectedBonTon(null)}
              className="px-5 py-2.5 rounded-xl bg-[#8C5500] hover:bg-[#6E4200] text-white text-xs font-bold shadow-sm"
            >
              Lần chuỗi niệm 108 biến 📿
            </Link>
          </footer>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN SUB-PAGE 2: VĂN KHẤN TỰ CUỘN TELEPROMPTER (100% FULL)      */}
      {/* ===================================================================== */}
      {activeBaiKhan && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveBaiKhan(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsBaiKhanAutoScrolling((v) => !v)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer border',
                  isBaiKhanAutoScrolling
                    ? 'bg-[#8C5500] text-white border-[#8C5500]'
                    : 'bg-[#FFF9EB] text-[#8C5500] border-[#DFC27D]'
                )}
              >
                {isBaiKhanAutoScrolling ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Đang tự lướt</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Tự động lướt</span>
                  </>
                )}
              </button>

              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setBaiKhanScrollSpeed(spd)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border',
                    baiKhanScrollSpeed === spd
                      ? 'bg-[#C68B19] text-white border-[#C68B19]'
                      : 'bg-[#FFFFFF] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </header>

          {/* Switcher across all 4 Bai Khan */}
          <div className="px-4 py-2.5 bg-[#FFF9EB] border-b border-[#EAD7A7] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {BAI_KHAN_DATA.map((bk) => (
              <button
                key={bk.id}
                type="button"
                onClick={() => {
                  setActiveBaiKhan(bk);
                  setIsBaiKhanAutoScrolling(true);
                  if (baiKhanScrollRef.current) baiKhanScrollRef.current.scrollTop = 0;
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border',
                  bk.id === activeBaiKhan.id
                    ? 'bg-[#8C5500] text-white border-[#8C5500]'
                    : 'bg-[#FFFFFF] text-[#5C3A08] border-[#DFC27D]'
                )}
              >
                {bk.title}
              </button>
            ))}
          </div>

          <div
            ref={baiKhanScrollRef}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full space-y-5"
          >
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C5500]">
                {activeBaiKhan.eyebrow}
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C1E10]">
                {activeBaiKhan.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B533B] italic">{activeBaiKhan.occasion}</p>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#DFC27D] space-y-5 text-base sm:text-xl leading-relaxed text-[#2C1E10] font-serif shadow-xs">
              <p className="whitespace-pre-line font-bold text-[#8C5500]">
                {activeBaiKhan.openingVerse}
              </p>
              {activeBaiKhan.paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line leading-loose">
                  {para}
                </p>
              ))}
              <p className="whitespace-pre-line font-bold text-[#8C5500] border-t border-[#EAD7A7] pt-4">
                {activeBaiKhan.closingVerse}
              </p>
            </div>
            <div className="h-32" />
          </div>

          <footer className="px-4 py-3 bg-[#FFFDF8] border-t border-[#EAD7A7] flex items-center justify-between gap-3 max-w-3xl mx-auto w-full shrink-0">
            <button
              type="button"
              onClick={handleCopyBaiKhan}
              className="px-4 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedBaiKhan ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBaiKhan ? 'Đã sao chép văn khấn' : 'Sao chép bài khấn'}</span>
            </button>
            <Link
              href="/thu-vien"
              onClick={() => setActiveBaiKhan(null)}
              className="px-5 py-2.5 rounded-xl bg-[#8C5500] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Mở Kinh Sách</span>
            </Link>
          </footer>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN SUB-PAGE 3: XEM & TẢI HÌNH NỀN 4K (100% FULL SCREEN)       */}
      {/* ===================================================================== */}
      {activeWallpaper && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveWallpaper(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              {activeWallpaper.title}
            </h2>
            <a
              href={activeWallpaper.image}
              download
              className="px-4 py-2 rounded-xl bg-[#8C5500] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải 4K</span>
            </a>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full gap-4">
            <div className="w-full rounded-3xl overflow-hidden border border-[#DFC27D] bg-[#FFFFFF] shadow-md">
              <img
                src={activeWallpaper.image}
                alt={activeWallpaper.title}
                className="w-full max-h-[72dvh] object-contain bg-[#2C1E10]"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#2C1E10]">{activeWallpaper.title}</h3>
              <p className="text-xs text-[#6B533B]">{activeWallpaper.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN SUB-PAGE 4: VỀ DHARMA (100% FULL SCREEN)                   */}
      {/* ===================================================================== */}
      {isAboutOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setIsAboutOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm font-bold text-[#2C1E10]">Về Đạo Tràng Số DHARMA</h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-4">
            <img
              src="/dharma-logo.png"
              alt="DHARMA"
              className="w-20 h-20 rounded-3xl border border-[#DFC27D] object-cover shadow-sm"
            />
            <h3 className="font-serif font-bold text-2xl text-[#8C5500]">
              DHARMA — Ánh Sáng Chánh Niệm
            </h3>
            <p className="text-sm text-[#2C1E10] leading-relaxed">
              DHARMA là không gian tu tập chánh niệm thuần Việt đồng hành cùng người cư sĩ tại gia
              trong đời sống hằng ngày.
            </p>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
