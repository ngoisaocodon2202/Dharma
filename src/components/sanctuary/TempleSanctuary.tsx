'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  Volume2,
  VolumeX,
  ArrowLeft,
  Calendar,
  History,
  Plus,
  Minus,
  Play,
  Pause,
  Sparkles,
  Share2,
  Download,
  Scroll,
} from 'lucide-react';
import { playBellSound, playWoodenFishSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { incrementDailyPractice } from '@/lib/dailyPracticeProgress';
import { useDharmaStore } from '@/store/useDharmaStore';
import { getLunarDate } from '@/lib/lunar-calendar';
import { cn } from '@/lib/utils';

// =============================================================================
// ICONS MATCHING USER'S MOCKUP 100%
// =============================================================================

// Golden Lotus Header Glyph
const HeaderLotusGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} fill="currentColor">
    <path d="M12 1C10.5 4.5 8.5 8 12 14C15.5 8 13.5 4.5 12 1Z" />
    <path d="M12 14C9.5 12 6.5 8.5 7 5.5C8.5 5 10.5 7.5 12 14Z" opacity="0.9" />
    <path d="M12 14C14.5 12 17.5 8.5 17 5.5C15.5 5 13.5 7.5 12 14Z" opacity="0.9" />
    <path d="M12 14C8 13 4 10.5 3 8C4.5 7 8 9.5 12 14Z" opacity="0.75" />
    <path d="M12 14C16 13 20 10.5 21 8C19.5 7 16 9.5 12 14Z" opacity="0.75" />
    <path d="M8 15C10 15.5 14 15.5 16 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Bottom Nav: Lotus (Thắp Nhang)
const LotusNavIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4C10 8 7 12 12 18C17 12 14 8 12 4Z" />
    <path d="M12 18C8.5 16.5 5 13.5 4.5 10C6.5 9 9.5 10.5 12 14.5" />
    <path d="M12 18C15.5 16.5 19 13.5 19.5 10C17.5 9 14.5 10.5 12 14.5" />
    <path d="M7 17.5C5.5 19 8.5 20 12 20C15.5 20 18.5 19 17 17.5" />
  </svg>
);

// Bottom Nav: Book (Đọc Kinh)
const BookNavIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4.5C3 3.67 3.67 3 4.5 3H10C11.1 3 12 3.9 12 5V19C12 18 11 17 10 17H4.5C3.67 17 3 17.67 3 18.5V4.5Z" />
    <path d="M21 4.5C21 3.67 20.33 3 19.5 3H14C12.9 3 12 3.9 12 5V19C12 18 13 17 14 17H19.5C20.33 17 21 17.67 21 18.5V4.5Z" />
  </svg>
);

// Bottom Nav: Dharma Wheel ☸ (Thỉnh Chuông)
const DharmaWheelNavIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6" />
    <path d="M12 15v6" />
    <path d="M3 12h6" />
    <path d="M15 12h6" />
    <path d="M5.64 5.64l4.24 4.24" />
    <path d="M14.12 14.12l4.24 4.24" />
    <path d="M18.36 5.64l-4.24 4.24" />
    <path d="M9.88 14.12l-4.24 4.24" />
    <circle cx="12" cy="1.8" r="1" fill="currentColor" />
    <circle cx="12" cy="22.2" r="1" fill="currentColor" />
    <circle cx="1.8" cy="12" r="1" fill="currentColor" />
    <circle cx="22.2" cy="12" r="1" fill="currentColor" />
  </svg>
);

// Bottom Nav: Heart (Cầu Nguyện)
const HeartNavIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.5 13.572L12 21L4.5 13.572C2.5 11.572 2.5 8.428 4.5 6.428C6.5 4.428 9.67 4.428 11.67 6.428L12 6.758L12.33 6.428C14.33 4.428 17.5 4.428 19.5 6.428C21.5 8.428 21.5 11.572 19.5 13.572Z" />
  </svg>
);

// =============================================================================
// ALTAR SPACES (ĐA ĐIỆN THỜ TAM BẢO)
// =============================================================================

export type AltarType = 'thich-ca' | 'quan-am' | 'duoc-su' | 'dia-tang';

interface AltarInfo {
  id: AltarType;
  title: string;
  subtitle: string;
  buddhaName: string;
  mantra: string;
  toneColor: string;
}

const ALTAR_SPACES: Record<AltarType, AltarInfo> = {
  'thich-ca': {
    id: 'thich-ca',
    title: 'Chánh Điện Bổn Sư',
    subtitle: 'Đức Bổn Sư Thích Ca Mâu Ni Phật • Trí Tuệ & Bình An',
    buddhaName: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    mantra: 'Tâm hương vừa thắp, nguyện mười phương thanh tịnh, phiền não đoạn trừ.',
    toneColor: 'from-amber-500/20 to-transparent',
  },
  'quan-am': {
    id: 'quan-am',
    title: 'Điện Quán Thế Âm',
    subtitle: 'Nam Hải Quán Thế Âm Bồ Tát • Cứu Khổ Cứu Nạn',
    buddhaName: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    mantra: 'Cành dương nước mát sái mười phương, tai qua nạn khỏi vạn sự tường.',
    toneColor: 'from-sky-500/20 to-transparent',
  },
  'duoc-su': {
    id: 'duoc-su',
    title: 'Điện Phật Dược Sư',
    subtitle: 'Dược Sư Lưu Ly Quang Vương Phật • Tiêu Trừ Tật Bệnh',
    buddhaName: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    mantra: 'Ánh sáng lưu ly diệt trừ thân bệnh, tâm bệnh, thân tâm thường lạc.',
    toneColor: 'from-emerald-500/20 to-transparent',
  },
  'dia-tang': {
    id: 'dia-tang',
    title: 'Điện Địa Tạng Vương',
    subtitle: 'Đại Nguyện Địa Tạng Vương Bồ Tát • Cầu Siêu Tiên Tổ',
    buddhaName: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    mantra: 'Trượng thiếc chấn khai địa ngục môn, cửu huyền thất tổ siêu sanh tịnh độ.',
    toneColor: 'from-rose-500/20 to-transparent',
  },
};

// Daily Dharma Zen Verses
const DAILY_DHARMA_VERSES = [
  {
    verse: 'Hận thù diệt hận thù, đời này không thể có. Từ bi diệt hận thù, là định luật ngàn thu.',
    source: 'Kinh Pháp Cú — Câu 5',
    reflection: 'Lấy lòng bao dung để hóa giải mọi khúc mắc, tâm tự tại ắt đời an vui.',
  },
  {
    verse: 'Tâm dẫn đầu muôn pháp, tâm làm chủ tạo tác. Tâm thanh tịnh an lành, hạnh phúc bước theo sau.',
    source: 'Kinh Pháp Cú — Câu 2',
    reflection: 'Giữ tâm ý trong sáng như bóng theo hình, an lạc tự nhiên hiển hiện.',
  },
  {
    verse: 'Chiến thắng vạn quân giặc nơi chiến trường, không bằng tự chiến thắng chính mình.',
    source: 'Kinh Pháp Cú — Câu 103',
    reflection: 'Chiến thắng lòng tham, sân, si của tự thân là chiến công oanh liệt nhất.',
  },
  {
    verse: 'Không làm các điều ác, nguyện làm các việc lành, giữ tâm ý thanh tịnh, đó là lời Phật dạy.',
    source: 'Kinh Pháp Cú — Câu 183',
    reflection: 'Cốt tủy của đạo Phật là lối sống thiện lương và tâm hồn thuần khiết.',
  },
];

// Pre-loaded Sutras
interface SutraText {
  id: string;
  title: string;
  subtitle: string;
  verses: string[];
}

const SUTRA_COLLECTIONS: SutraText[] = [
  {
    id: 'bat-nha',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
    subtitle: 'Kinh điển cốt tủy phá tan mọi sợ hãi, lo âu và phiền não',
    verses: [
      'Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.',
      'Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc. Thọ, tưởng, hành, thức diệc phục như thị.',
      'Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm.',
      'Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp.',
      'Vô nhãn giới nãi chí vô ý thức giới; vô vô minh, diệc vô vô minh tận; nãi chí vô lão tử, diệc vô lão tử tận.',
      'Vô khổ, tập, diệt, đạo; vô trí diệc vô đắc. Dĩ vô sở đắc cố, Bồ Đề Tát Đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại.',
      'Vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.',
      'Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.',
      'Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chân thật bất hư.',
      'Cố thuyết Bát Nhã Ba La Mật Đa chú. Tức thuyết chú viết:\nYết đế, yết đế, Ba la yết đế, Ba la tăng yết đế, Bồ đề tát bà ha! (3 lần)',
    ],
  },
  {
    id: 'dai-bi',
    title: 'Chú Đại Bi (Đại Bi Thần Chú)',
    subtitle: 'Thần chú cứu khổ cứu nạn của Bồ Tát Quán Thế Âm',
    verses: [
      'Nam mô Hắc Ra Đát Na, Đá Ra Dạ Da. Nam mô A Rị Da, Bà Lô Yết Đế, Thước Bát Ra Da, Bồ Đề Tát Đỏa Bà Da.',
      'Ma Ha Tát Đỏa Bà Da, Ma Ha Ca Lô Ni Ca Da. Án, Tát Bàn Ra Phạt Duệ, Số Đát Na Đát Tỏa.',
      'Nam mô Tất Kiết Lật Đỏa Y Mông A Rị Da, Bà Lô Kiết Đế Thất Phật Ra Lăng Đà Bà.',
      'Nam mô Na Ra Cẩn Trì, Hê Rị Ma Ha Bàn Đà Sa Mế, Tát Bà A Tha Đậu Thâu Bằng, A Thệ Dựng.',
      'Tát Bà Tát Đa, Na Ma Bà Tát Đa, Na Ma Bà Già, Ma Phạt Đạt Đậu. Đát Điệt Tha: Án, A Bà Lô Hê, Lô Ca Đế, Ca Ra Đế, Di Hê Rị.',
      'Ma Ha Bồ Đề Tát Đỏa, Tát Bà Tát Bà, Ma Ra Ma Ra, Ma Hê Ma Hê, Rị Đà Dựng. Cu Lô Cu Lô Kiết Mông, Độ Lô Độ Lô, Phạt Xà Da Đế.',
      'Ma Ha Phạt Xà Da Đế, Đà Ra Đà Ra, Địa Rị Ni, Thất Phật Ra Da, Giá Ra Giá Ra, Mạ Mạ Phạt Ma Ra, Mục Đế Lệ.',
      'Y Hê Y Hê, Thất Na Thất Na, A Ra Sâm Phật Ra Xá Lợi, Phạt Sa Phạt Sâm, Phật Ra Xá Da.',
      'Hô Lô Hô Lô Ma Ra, Hô Lô Hô Lô Hê Rị, Sa Ra Sa Ra, Tất Rị Tất Rị, Tô Rô Tô Rô, Bồ Đề Dạ Bồ Đề Dạ, Bồ Đà Dạ Bồ Đà Dạ.',
      'Di Đế Rị Dạ, Na Ra Cẩn Trì, Địa Rị Sắc Ni Na, Ba Dạ Ma Na, Ta Bà Ha.',
    ],
  },
  {
    id: 'tu-bi',
    title: 'Kinh Từ Bi (Metta Sutta)',
    subtitle: 'Lời Phật dạy về rải tâm từ ái, bao dung đến muôn loài vạn vật',
    verses: [
      'Nguyện cho con luôn an lành, không hờn giận, không oán thù, thân tâm thường lạc.',
      'Nguyện cho cha mẹ, thầy tổ, bà con thân quyến và bạn bè luôn được an vui, tiêu trừ tật bệnh.',
      'Nguyện cho tất cả chúng sanh hữu tình, dù lớn hay nhỏ, dù gần hay xa, đều được sống trong an tịnh và từ bi.',
      'Như người mẹ hiền suốt đời hy sinh che chở cho đứa con một duy nhất, ta hãy mở rộng lòng thương vô lượng đến tất cả muôn loài.',
      'Đem tâm từ ái bao la rải khắp mười phương, phía trên, phía dưới và chung quanh, không chướng ngại, không căm hận, không hằn thù.',
      'Dù khi đứng, khi đi, khi ngồi hay khi nằm, hãy giữ tâm niệm từ bi ấy suốt cả ngày đêm.',
      'Đây là lối sống thanh cao nhất nơi cõi nhân gian, đưa đến giải thoát và an lạc vĩnh hằng.',
    ],
  },
  {
    id: 'sam-hoi',
    title: 'Kinh Sám Hối & Hồi Hướng An Lành',
    subtitle: 'Gột rửa nghiệp chướng, hướng tâm về nẻo thiện thanh tịnh',
    verses: [
      'Con xưa đã tạo bao ác nghiệp, đều do vô thấu tham sân si.',
      'Từ thân, miệng, ý phát sinh ra, hôm nay con thảy đều sám hối.',
      'Nam Mô Cầu Sám Hối Bồ Tát Ma Ha Tát. (3 lần)',
      'Nguyện tiêu ba chướng trừ phiền não, nguyện được trí tuệ thật sáng ngời.',
      'Nguyện cho tội chướng thảy tiêu trừ, đời đời thường hành Bồ Tát đạo.',
      'Nguyện đem công đức lành này, hồi hướng khắp tất cả chúng sanh, đệ tử và muôn loài, đều trọn thành Phật đạo.',
    ],
  },
];

const PRAYER_QUICK_CHIPS = [
  'Cầu gia đạo bình an, con cháu hiếu thuận',
  'Cầu sức khỏe dồi dào, tật bệnh tiêu trừ',
  'Cầu tâm thanh tịnh, vạn sự cát tường',
  'Cầu cửu huyền thất tổ siêu sanh tịnh độ',
  'Cầu công việc hanh thông, tai qua nạn khỏi',
  'Cầu quốc thái dân an, mưa thuận gió hòa',
];

interface SavedPrayer {
  id: string;
  name: string;
  content: string;
  date: string;
  altarId?: string;
}

export function TempleSanctuary() {
  // Current active altar
  const [activeAltar, setActiveAltar] = useState<AltarType>('thich-ca');
  const [isAltarMenuOpen, setIsAltarMenuOpen] = useState(false);

  // Sanctuary interactive states
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [isOfferingLotus, setIsOfferingLotus] = useState(false);
  const [isOfferingWater, setIsOfferingWater] = useState(false);
  const [isOfferingFruit, setIsOfferingFruit] = useState(false);
  const [isLanternFloating, setIsLanternFloating] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [isBellRippling, setIsBellRippling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isScriptureModalOpen, setIsScriptureModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isOfferingsDrawerOpen, setIsOfferingsDrawerOpen] = useState(false);
  const [isDharmaQuoteModalOpen, setIsDharmaQuoteModalOpen] = useState(false);
  const [meritCertificate, setMeritCertificate] = useState<{
    id: string;
    senderName: string;
    recipientName: string;
    wishContent: string;
    type: 'CAU_AN' | 'CAU_SIEU';
    buddhaName: string;
    solarDate: string;
    lunarDate: string;
  } | null>(null);

  const addMeritEntry = useDharmaStore((s) => s.addMeritEntry);
  const addPrayerLamp = useDharmaStore((s) => s.addPrayerLamp);

  // Scripture Reader states
  const [selectedSutraIndex, setSelectedSutraIndex] = useState(0);
  const [fontSizePx, setFontSizePx] = useState(24);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  // Prayer state
  const [prayerType, setPrayerType] = useState<'CAU_AN' | 'CAU_SIEU'>('CAU_AN');
  const [prayerName, setPrayerName] = useState('');
  const [prayerRecipient, setPrayerRecipient] = useState('');
  const [prayerContent, setPrayerContent] = useState('');
  const [floatingPrayer, setFloatingPrayer] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<SavedPrayer[]>([]);

  // Daily Quote state
  const [todayQuoteIndex] = useState(() => Math.floor(Math.random() * DAILY_DHARMA_VERSES.length));

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scriptureScrollRef = useRef<HTMLDivElement | null>(null);

  // Load saved prayers from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('phatphap_sanctuary_prayers');
      if (stored) {
        setSavedPrayers(JSON.parse(stored));
      }
    } catch { }
  }, []);

  // Display toast with automatic fade-out
  const showToast = (msg: string, durationMs = 4500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, durationMs);
  };

  const currentAltar = ALTAR_SPACES[activeAltar];

  // 1. ACTION: THẮP NHANG
  const handleLightIncense = () => {
    setIsIncenseLit(true);
    setIsBowing(true);
    setIsOfferingsDrawerOpen(false);
    incrementDailyPractice('lay-phat', 3);
    addMeritEntry({
      category: 'HUONG_DANG',
      title: `Dâng Hương Tâm Thành tại điện ${currentAltar.buddhaName}`,
      dedicationText: 'Nguyện giới hương định hương hòa huệ hương, giải thoát tri kiến hương cúng dường Tam Bảo.',
    });

    if (soundEnabled) {
      playBellSound(0.4);
    }

    showToast(
      `${currentAltar.buddhaName}. ${currentAltar.mantra}`,
      5500
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3200);
  };

  // 2. ACTION: DÂNG HOA SEN
  const handleOfferLotus = () => {
    setIsOfferingLotus(true);
    setIsBowing(true);
    setIsOfferingsDrawerOpen(false);
    incrementDailyPractice('lay-phat', 3);
    addMeritEntry({
      category: 'HUONG_DANG',
      title: `Dâng Hương Tâm Thành tại điện ${currentAltar.buddhaName}`,
      dedicationText: 'Nguyện giới hương định hương hòa huệ hương, giải thoát tri kiến hương cúng dường Tam Bảo.',
    });

    if (soundEnabled) {
      playBellSound(0.45);
    }

    showToast(
      'Dâng đóa sen tinh khiết cúng dường Tam Bảo. Nguyện tâm thanh tịnh, nở hoa tuệ giác, lìa xa trần cấu.',
      5000
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3000);
  };

  // 3. ACTION: DÂNG NƯỚC CAM LỘ
  const handleOfferWater = () => {
    setIsOfferingWater(true);
    setIsBowing(true);
    setIsOfferingsDrawerOpen(false);

    if (soundEnabled) {
      playBellSound(0.4);
    }

    showToast(
      'Dâng chén nước trong lành cúng dường Phật - Pháp - Tăng. Nguyện tâm trong sáng phẳng lặng như gương.',
      5000
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3000);
  };

  // 3B. ACTION: DÂNG QUẢ NGỌT LÀNH
  const handleOfferFruit = () => {
    setIsOfferingFruit(true);
    setIsBowing(true);
    setIsOfferingsDrawerOpen(false);
    addMeritEntry({
      category: 'HUONG_DANG',
      title: `Dâng Quả Ngọt cúng dường ${currentAltar.buddhaName}`,
      dedicationText: 'Nguyện gieo nhân thiện lành thuần khiết để gặt hái hoa trái giác ngộ giải thoát.',
    });

    if (soundEnabled) {
      playBellSound(0.42);
    }

    showToast(
      'Dâng đĩa quả ngọt thanh khiết cúng dường Tam Bảo. Nguyện gieo nhân lành để gặt hái quả giác ngộ bình an.',
      5000
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3000);
  };

  // 4. ACTION: THẢ HOA ĐĂNG CẦU NGUYỆN
  const handleLanternRelease = () => {
    setIsLanternFloating(true);
    setIsBowing(true);
    setIsOfferingsDrawerOpen(false);

    if (soundEnabled) {
      playGrandTempleBellSound(0.5);
    }

    showToast(
      'Đèn hoa đăng nguyện ước đã xuôi dòng ánh sáng. Nguyện cầu quốc thái dân an, âm siêu dương thới.',
      5500
    );

    setTimeout(() => {
      setIsBowing(false);
    }, 3200);
  };

  // 5. ACTION: THỈNH CHUÔNG (ĐẠI HỒNG CHUNG)
  const handleRingBell = () => {
    setIsBellRippling(true);
    if (soundEnabled) {
      playGrandTempleBellSound(0.55);
    }

    showToast(
      'Nghe tiếng chuông phiền não tan mây khói, tâm an miệng mỉm cười. Nguyện dứt oan khiên tiêu nghiệp chướng.',
      5000
    );

    setTimeout(() => {
      setIsBellRippling(false);
    }, 2800);
  };

  // 6. ACTION: MINH / GÕ MÕ THANH TỊNH
  const handleMinhChime = () => {
    if (soundEnabled) {
      playWoodenFishSound(0.5);
    }
    showToast(
      'Tâm thanh tịnh, trí tuệ sáng ngời. Vạn sự cát tường, an nhiên tự tại.',
      4500
    );
  };

  // 7. ACTION: ĐỌC KINH (Tự động bật chế độ lướt chậm từ đầu đến cuối)
  const [scrollSpeedMultiplier, setScrollSpeedMultiplier] = useState<number>(0.8);
  const subPixelRemainderRef = useRef<number>(0);
  const manualTouchPauseRef = useRef<number>(0);

  const handleOpenScripture = () => {
    setIsScriptureModalOpen(true);
    setIsAutoScrolling(true);
    subPixelRemainderRef.current = 0;
    incrementDailyPractice('doc-kinh', 1);
    if (soundEnabled) {
      playWoodenFishSound(0.4);
    }
  };

  // Smooth continuous auto-scroll from top to bottom + verse tracker
  useEffect(() => {
    if (!isAutoScrolling || !isScriptureModalOpen) return;
    let rafId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const el = scriptureScrollRef.current;
      if (el && Date.now() >= manualTouchPauseRef.current) {
        const pxPerSec = 24 * scrollSpeedMultiplier;
        subPixelRemainderRef.current += pxPerSec * dt;
        const delta = Math.floor(subPixelRemainderRef.current);
        if (delta >= 1) {
          el.scrollTop += delta;
          subPixelRemainderRef.current -= delta;

          const totalScroll = Math.max(1, el.scrollHeight - el.clientHeight);
          const ratio = Math.min(1, el.scrollTop / totalScroll);
          const currentVerses = SUTRA_COLLECTIONS[selectedSutraIndex].verses;
          const computedIdx = Math.min(
            currentVerses.length - 1,
            Math.floor(ratio * currentVerses.length)
          );
          setActiveVerseIndex(computedIdx);

          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
            setIsAutoScrolling(false);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoScrolling, isScriptureModalOpen, scrollSpeedMultiplier, selectedSutraIndex]);

  // 8. ACTION: DÂNG LỜI CẦU NGUYỆN
  const handleSubmitPrayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const content = prayerContent.trim() || 'Cầu gia đạo bình an, tai qua nạn khỏi, vạn sự cát tường';
    const name = prayerName.trim() || 'Phật tử thiện tâm';
    const recipient = prayerRecipient.trim() || (prayerType === 'CAU_AN' ? 'Gia quyến & Cha Mẹ' : 'Cửu Huyền Thất Tổ');
    const now = new Date();
    const lunarInfo = getLunarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const solarFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const lunarFormatted = `Ngày ${lunarInfo.lunarDay} tháng ${lunarInfo.lunarMonth} năm ${lunarInfo.yearCanChi}`;

    const newPrayer: SavedPrayer = {
      id: Date.now().toString(),
      name,
      content,
      altarId: activeAltar,
      date: now.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newPrayer, ...savedPrayers];
    setSavedPrayers(updated);
    try {
      localStorage.setItem('phatphap_sanctuary_prayers', JSON.stringify(updated));
    } catch { }

    addPrayerLamp({
      type: prayerType,
      senderName: name,
      recipientName: recipient,
      wishContent: content,
    });

    // Sync real-time prayer to PostgreSQL (password: 220206)
    fetch('/api/dharma/prayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_type: prayerType === 'CAU_AN' ? 'cau_an' : 'cau_sieu',
        dharma_name: name,
        sender_name: name,
        target_name: recipient,
        target_info: currentAltar.buddhaName,
        category: prayerType === 'CAU_AN' ? 'Bình an gia đạo' : 'Siêu độ gia tiên',
        content,
      }),
    }).catch(() => {});

    setMeritCertificate({
      id: `SC-${String(Date.now()).slice(-6)}`,
      senderName: name,
      recipientName: recipient,
      wishContent: content,
      type: prayerType,
      buddhaName: currentAltar.buddhaName,
      solarDate: solarFormatted,
      lunarDate: lunarFormatted,
    });

    setFloatingPrayer(content);
    setIsPrayerModalOpen(false);
    setIsBowing(true);

    if (soundEnabled) {
      playBellSound(0.4);
    }

    showToast(
      `Đã dâng sớ cầu nguyện của "${name}" lên ${currentAltar.buddhaName}.`,
      6000
    );

    setTimeout(() => {
      setIsBowing(false);
      setFloatingPrayer(null);
    }, 4500);
  };

  const currentSutra = SUTRA_COLLECTIONS[selectedSutraIndex];
  const todayDharma = DAILY_DHARMA_VERSES[todayQuoteIndex];

  return (
    <div className="relative w-full h-[100dvh] bg-[#FAF7F0] flex items-center justify-center overflow-hidden select-none">
      {/* Container matching mobile screenshot frame 100% */}
      <div className="relative w-full max-w-[460px] h-[100dvh] bg-[#FFFDF8] text-[#2C1E10] flex flex-col justify-between overflow-hidden shadow-xl border-x border-[#EAD7A7]">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER NAVIGATION BAR (WARM GOLD & WHITE)                          */}
        {/* ========================================================================= */}
        <header className="relative z-30 h-[72px] px-3.5 bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC2] border-b border-[#EAD7A7] flex items-center justify-between shrink-0 shadow-xs">
          {/* Back to Home Button (Left Circle Button) */}
          <Link
            href="/"
            className="w-10 h-10 rounded-full border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex items-center justify-center text-[#8C5500] active:scale-95 transition-all shadow-2xs shrink-0"
            title="Trở về Trang Chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Sanctuary Center Title with Lotus Glyphs (Exact 2-line layout) */}
          <div
            onClick={() => setIsAltarMenuOpen(!isAltarMenuOpen)}
            className="flex flex-col items-center justify-center text-center px-1 cursor-pointer group active:scale-98 transition-transform"
            title="Nhấn để Chọn Điện Thờ Tam Bảo"
          >
            <div className="flex items-center gap-1">
              <HeaderLotusGlyph className="w-4 h-3 text-[#C68B19] mb-0.5" />
              <span className="text-[10px] text-[#8C5500] uppercase tracking-widest font-bold">
                {currentAltar.title}
              </span>
            </div>
            <h1 className="font-heading text-[13px] sm:text-[14px] font-bold tracking-[0.14em] uppercase text-[#2C1E10] leading-[1.25]">
              ĐI CHÙA &amp; CẦU<br />
              NGUYỆN ONLINE
            </h1>
            <HeaderLotusGlyph className="w-3.5 h-2.5 text-[#C68B19] mt-0.5" />
          </div>

          {/* Right Action Icons (Calendar, Daily Quote, History, Sound) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 1. Lời Phật Dạy Hằng Ngày */}
            <button
              onClick={() => setIsDharmaQuoteModalOpen(true)}
              className="w-9 h-9 rounded-full border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex items-center justify-center text-[#8C5500] active:scale-95 transition-all shadow-2xs"
              title="Trích Lộc Pháp Cú & Thư Pháp Thiền"
            >
              <Scroll className="w-4 h-4" />
            </button>

            {/* 2. Calendar (Xem Ngày Tốt) */}
            <Link
              href="/tu-vi"
              className="w-9 h-9 rounded-full border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex items-center justify-center text-[#8C5500] active:scale-95 transition-all shadow-2xs"
              title="Tra cứu Màu Hợp & Ngày Tốt Hoàng Đạo"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            {/* 3. Sổ Lời Nguyện Cầu (History) */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="relative w-9 h-9 rounded-full border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex items-center justify-center text-[#8C5500] active:scale-95 transition-all shadow-2xs"
              title="Sổ Lời Nguyện Cầu Đã Dâng"
            >
              <History className="w-4 h-4" />
              {savedPrayers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8C5500] text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                  {savedPrayers.length}
                </span>
              )}
            </button>

            {/* 4. Audio Mute/Unmute */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center active:scale-95 transition-all shadow-2xs',
                soundEnabled
                  ? 'border-[#C68B19] bg-[#FFF6DF] text-[#8C5500]'
                  : 'border-[#EAD7A7] bg-[#FFFFFF] text-[#6B533B]'
              )}
              title={soundEnabled ? 'Đang bật âm thanh chuông mõ' : 'Đang tắt âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 1.1. ALTAR SPACES SELECTOR DROPDOWN (ĐỔI ĐIỆN THỜ)                       */}
        {/* ========================================================================= */}
        {isAltarMenuOpen && (
          <div className="absolute top-[74px] inset-x-3 z-40 bg-[#FFFDF8] border-2 border-[#C68B19] rounded-2xl p-2.5 shadow-xl animate-fade-in-down">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#EAD7A7]">
              <span className="text-xs font-bold text-[#8C5500] uppercase tracking-wider">
                Chọn Điện Thờ Tam Bảo Chiêm Bái:
              </span>
              <button
                onClick={() => setIsAltarMenuOpen(false)}
                className="text-[#6B533B] hover:text-[#2C1E10] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ALTAR_SPACES) as AltarType[]).map((key) => {
                const item = ALTAR_SPACES[key];
                const isSelected = activeAltar === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveAltar(key);
                      setIsAltarMenuOpen(false);
                      if (soundEnabled) playBellSound(0.35);
                      showToast(`Đã chuyển tới ${item.title}. ${item.subtitle}`, 4000);
                    }}
                    className={cn(
                      'p-2 rounded-xl text-left border transition-all active:scale-95 flex flex-col gap-0.5',
                      isSelected
                        ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border-[#C68B19] shadow-2xs'
                        : 'bg-[#FFFFFF] hover:bg-[#FFF9EB] text-[#2C1E10] border-[#EAD7A7]'
                    )}
                  >
                    <span className="font-heading font-bold text-xs">{item.title}</span>
                    <span className="text-[10px] text-[#6B533B] truncate">{item.subtitle.split('•')[1] || item.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TOAST BLESSING NOTIFICATION                                            */}
        {/* ========================================================================= */}
        {toastMessage && (
          <div className="absolute top-[78px] inset-x-3 z-40 flex justify-center pointer-events-none animate-fadeInDown">
            <div className="w-full bg-[#FFF9EB] border-2 border-[#C68B19] rounded-2xl p-3 shadow-lg text-center">
              <p className="font-heading text-xs sm:text-sm font-bold text-[#8C5500] leading-snug">
                {toastMessage}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SACRED SANCTUARY SCENE (100% ARTWORK & INTERACTIVE HOTSPOTS)           */}
        {/* ========================================================================= */}
        <main className="relative flex-1 w-full overflow-hidden">
          {/* Exact Temple Artwork Background */}
          <img
            src="/images/temple_sanctuary_bg.jpg"
            alt="Chánh Điện Đi Chùa & Cầu Nguyện Online"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />

          {/* Altar Sacred Aura Tint (changes subtly per deity) */}
          <div className={cn('absolute inset-0 bg-gradient-to-t pointer-events-none transition-colors duration-700', currentAltar.toneColor)} />

          {/* Animated Wispy Incense Smoke Particles over Incense Burner */}
          {isIncenseLit && (
            <div className="absolute top-[28%] left-[49%] -translate-x-1/2 z-20 pointer-events-none flex justify-center items-end h-20 w-16">
              <div className="w-1.5 h-14 bg-gradient-to-t from-red-500/90 via-amber-200/70 to-transparent rounded-full blur-[1px] animate-incense-smoke-1 mr-2" />
              <div className="w-2 h-18 bg-gradient-to-t from-orange-500/90 via-amber-100/80 to-transparent rounded-full blur-[1px] animate-incense-smoke-2" />
              <div className="w-1.5 h-14 bg-gradient-to-t from-red-500/90 via-amber-200/70 to-transparent rounded-full blur-[1px] animate-incense-smoke-3 ml-2" />
            </div>
          )}

          {/* Dâng Hoa Sen Tươi (Blooming Lotus Offering Aura) */}
          {isOfferingLotus && (
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 drop-shadow-[0_0_25px_#F472B6] animate-pulse">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="28" fill="#F472B6" opacity="0.35" />
                  <path d="M50 15 C40 32 30 55 50 75 C70 55 60 32 50 15 Z" fill="#F43F5E" />
                  <path d="M28 35 C25 50 35 68 50 75 C40 65 30 50 28 35 Z" fill="#FB7185" />
                  <path d="M72 35 C75 50 65 68 50 75 C60 65 70 50 72 35 Z" fill="#FB7185" />
                  <circle cx="50" cy="46" r="6" fill="#FDE047" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#8C5500] bg-[#FFF9EB] border border-[#DFC27D] px-2.5 py-0.5 rounded-full mt-1 shadow-xs">
                ✦ Hoa Sen Cúng Dường ✦
              </span>
            </div>
          )}

          {/* Dâng Nước Cam Lộ (Pure Water Offering) */}
          {isOfferingWater && (
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-fade-in">
              <div className="w-14 h-14 drop-shadow-[0_0_25px_#38BDF8] animate-pulse">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 20 C45 35 32 55 32 68 C32 80 40 88 50 88 C60 88 68 80 68 68 C68 55 55 35 50 20 Z" fill="#38BDF8" opacity="0.9" />
                  <circle cx="44" cy="62" r="5" fill="#FFF" opacity="0.8" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#8C5500] bg-[#FFF9EB] border border-[#DFC27D] px-2.5 py-0.5 rounded-full mt-1 shadow-xs">
                ✦ Nước Cam Lộ Thanh Tịnh ✦
              </span>
            </div>
          )}

          {/* Thả Hoa Đăng Cầu Nguyện Ban Đêm */}
          {isLanternFloating && (
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 z-25 pointer-events-none flex flex-col items-center animate-prayer-lotus-float">
              <div className="w-14 h-14 drop-shadow-[0_0_30px_#F59E0B]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="28" fill="#F59E0B" opacity="0.4" />
                  <path d="M50 22 C42 36 36 55 50 68 C64 55 58 36 50 22 Z" fill="#FCD34D" />
                  <circle cx="50" cy="42" r="4.5" fill="#FFF" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#8C5500] bg-[#FFF9EB] border border-[#DFC27D] px-2.5 py-0.5 rounded-full mt-1 shadow-xs">
                🏮 Đèn Hoa Đăng Nguyện Ước
              </span>
            </div>
          )}

          {/* Animated Ripple Waves over Hanging Temple Bell */}
          {isBellRippling && (
            <div className="absolute top-[48%] right-[14%] -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-24 h-24 rounded-full border-2 border-[#FFE082] animate-bell-ripple" />
              <div className="w-32 h-32 rounded-full border border-[#D4AF37]/60 animate-bell-ripple [animation-delay:0.3s]" />
            </div>
          )}

          {/* Floating Lotus Prayer (rises towards Buddha when prayer is submitted) */}
          {floatingPrayer && (
            <div className="absolute top-[65%] left-[28%] z-30 pointer-events-none animate-prayer-lotus-float flex flex-col items-center">
              <div className="w-14 h-14 drop-shadow-[0_0_20px_#FFE082]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="30" fill="#FFE082" opacity="0.3" />
                  <path d="M50 20 C40 38 35 60 50 72 C65 60 60 38 50 20 Z" fill="#FFE082" />
                  <path d="M30 40 C28 55 35 68 50 72 C40 68 35 52 30 40 Z" fill="#F59E0B" />
                  <path d="M70 40 C72 55 65 68 50 72 C60 68 65 52 70 40 Z" fill="#F59E0B" />
                  <circle cx="50" cy="46" r="5" fill="#FFF" />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#FFF9EB] border border-[#C68B19] text-[#8C5500] text-[11px] font-bold whitespace-nowrap mt-1 shadow-lg">
                &ldquo;{floatingPrayer}&rdquo;
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* CALIBRATED INTERACTIVE HOTSPOTS OVER ARTWORK ELEMENTS                    */}
          {/* ----------------------------------------------------------------------- */}

          {/* Hotspot 1: Incense Burner (Lư Hương) -> Opens Offerings Drawer */}
          <button
            onClick={() => setIsOfferingsDrawerOpen(true)}
            className="absolute top-[31%] left-[40%] w-[20%] h-[11%] rounded-full cursor-pointer z-20 focus:outline-none group active:scale-95"
            title="Chạm vào Lư Hương để Dâng Hương & Hoa Quả"
          >
            <span className="sr-only">Cúng Dường Tam Bảo</span>
          </button>

          {/* Hotspot 2: Center Glowing Menu Card */}
          <div className="absolute top-[40.5%] left-[28%] w-[44%] h-[16.5%] z-20 flex flex-col justify-between">
            {/* Row 1: TAM BẢO */}
            <button
              onClick={() => setIsOfferingsDrawerOpen(true)}
              className="w-full h-[32%] rounded-lg cursor-pointer hover:bg-amber-500/10 active:bg-amber-500/25 transition-colors focus:outline-none"
              title="Đảnh lễ Tam Bảo & Cúng Dường"
            >
              <span className="sr-only">Tam Bảo</span>
            </button>

            {/* Row 2: CHUÔNG */}
            <button
              onClick={handleRingBell}
              className="w-full h-[32%] rounded-lg cursor-pointer hover:bg-amber-500/10 active:bg-amber-500/25 transition-colors focus:outline-none"
              title="Thỉnh Chuông Chùa"
            >
              <span className="sr-only">Chuông</span>
            </button>

            {/* Row 3: MINH */}
            <button
              onClick={handleMinhChime}
              className="w-full h-[32%] rounded-lg cursor-pointer hover:bg-amber-500/10 active:bg-amber-500/25 transition-colors focus:outline-none"
              title="Tâm Thanh Tịnh (Gõ Mõ)"
            >
              <span className="sr-only">Minh</span>
            </button>
          </div>

          {/* Hotspot 3: Hanging Great Bell (Đại Hồng Chung bên phải) */}
          <button
            onClick={handleRingBell}
            className="absolute top-[38%] right-[6%] w-[22%] h-[24%] rounded-xl cursor-pointer z-20 hover:bg-amber-500/10 active:scale-95 transition-all focus:outline-none"
            title="Chạm để Thỉnh Đại Hồng Chung"
          >
            <span className="sr-only">Thỉnh Chuông</span>
          </button>

          {/* Hotspot 4: Seated Monk Mascot (Phật tử ngồi thiền bên trái) */}
          <button
            onClick={() => {
              setIsBowing(true);
              if (soundEnabled) playBellSound(0.35);
              showToast(`${currentAltar.buddhaName}. Nhất tâm đảnh lễ mười phương Tam Bảo.`, 4000);
              setTimeout(() => setIsBowing(false), 2400);
            }}
            className={cn(
              'absolute top-[56%] left-[18%] w-[27%] h-[26%] rounded-full cursor-pointer z-20 hover:bg-amber-500/10 active:scale-95 transition-all focus:outline-none',
              isBowing && 'animate-practitioner-bow'
            )}
            title="Chạm vào Phật tử để Đảnh Lễ"
          >
            <span className="sr-only">Phật tử Đảnh Lễ</span>
          </button>

          {/* Hotspot 5: "Chạm Đọc Kinh" Pill Button & Wooden Desk */}
          <button
            onClick={handleOpenScripture}
            className="absolute top-[56.5%] right-[7%] w-[33%] h-[6.5%] rounded-full cursor-pointer z-20 hover:bg-amber-500/20 active:scale-95 transition-all focus:outline-none"
            title="Chạm để Mở Sách Kinh Tụng Niệm"
          >
            <span className="sr-only">Chạm Đọc Kinh</span>
          </button>

          {/* Hotspot 6: Carved Low Desk with Book & Red Beads */}
          <button
            onClick={handleOpenScripture}
            className="absolute top-[64.5%] right-[8%] w-[42%] h-[16%] rounded-xl cursor-pointer z-20 hover:bg-amber-500/10 active:scale-95 transition-all focus:outline-none"
            title="Chạm vào Bàn Kỷ hoặc Tràng Hạt để Đọc Kinh"
          >
            <span className="sr-only">Bàn Kỷ Kinh Sách</span>
          </button>
        </main>

        {/* ========================================================================= */}
        {/* 4. FIXED BOTTOM CONTROL BAR (WARM GOLD & WHITE)                           */}
        {/* ========================================================================= */}
        <footer className="relative z-30 h-[92px] px-3 py-2.5 bg-gradient-to-t from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC2] border-t border-[#EAD7A7] flex items-center shrink-0 shadow-[0_-4px_16px_rgba(140,85,0,0.08)]">
          <div className="grid grid-cols-4 gap-2 w-full h-full">
            {/* Button 1: THẮP NHANG & CÚNG DƯỜNG */}
            <button
              onClick={() => setIsOfferingsDrawerOpen(true)}
              className="h-full rounded-2xl border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all group cursor-pointer"
            >
              <LotusNavIcon className="w-6 h-6 text-[#8C5500] group-hover:scale-110 transition-transform" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold text-[#2C1E10] tracking-wide whitespace-nowrap">
                Thắp Nhang
              </span>
            </button>

            {/* Button 2: ĐỌC KINH */}
            <button
              onClick={handleOpenScripture}
              className="h-full rounded-2xl border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all group cursor-pointer"
            >
              <BookNavIcon className="w-6 h-6 text-[#8C5500] group-hover:scale-110 transition-transform" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold text-[#2C1E10] tracking-wide whitespace-nowrap">
                Đọc Kinh
              </span>
            </button>

            {/* Button 3: THỈNH CHUÔNG */}
            <button
              onClick={handleRingBell}
              className="h-full rounded-2xl border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all group cursor-pointer"
            >
              <DharmaWheelNavIcon className="w-6 h-6 text-[#8C5500] group-hover:scale-110 transition-transform" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold text-[#2C1E10] tracking-wide whitespace-nowrap">
                Thỉnh Chuông
              </span>
            </button>

            {/* Button 4: CẦU NGUYỆN */}
            <button
              onClick={() => setIsPrayerModalOpen(true)}
              className="h-full rounded-2xl border border-[#DFC27D] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all group cursor-pointer"
            >
              <HeartNavIcon className="w-6 h-6 text-[#8C5500] group-hover:scale-110 transition-transform" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold text-[#2C1E10] tracking-wide whitespace-nowrap">
                Cầu Nguyện
              </span>
            </button>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* 4.1. OFFERINGS FULL-SCREEN PAGE (NGHI THỨC CÚNG DƯỜNG TỊNH TÂM)           */}
      {/* ========================================================================= */}
      {isOfferingsDrawerOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsOfferingsDrawerOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Nghi Thức Cúng Dường Tam Bảo
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-lg mx-auto w-full space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] text-center space-y-1">
              <Sparkles className="w-5 h-5 text-[#C68B19] mx-auto" />
              <p className="font-serif font-bold text-sm text-[#2C1E10]">
                Thành Tâm Kính Dâng Lên {currentAltar.buddhaName}
              </p>
              <p className="text-xs text-[#6B533B]">
                Chọn lễ vật thanh tịnh để dâng cúng dường ngôi Tam Bảo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleLightIncense}
                className="p-4 rounded-2xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] border border-[#EAD7A7] flex items-center justify-center text-xl">
                  🔥
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#2C1E10] whitespace-nowrap">Thắp Nhang Trầm</span>
                <span className="text-[11px] text-[#6B533B] whitespace-nowrap">3 nén tâm hương</span>
              </button>

              <button
                type="button"
                onClick={handleOfferLotus}
                className="p-4 rounded-2xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] border border-[#EAD7A7] flex items-center justify-center text-xl">
                  🪷
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#2C1E10] whitespace-nowrap">Dâng Hoa Sen</span>
                <span className="text-[11px] text-[#6B533B] whitespace-nowrap">Hoa thơm thanh tịnh</span>
              </button>

              <button
                type="button"
                onClick={handleOfferWater}
                className="p-4 rounded-2xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] border border-[#EAD7A7] flex items-center justify-center text-xl">
                  💧
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#2C1E10] whitespace-nowrap">Nước Cam Lộ</span>
                <span className="text-[11px] text-[#6B533B] whitespace-nowrap">Tâm trong như nước</span>
              </button>

              <button
                type="button"
                onClick={handleLanternRelease}
                className="p-4 rounded-2xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] border border-[#EAD7A7] flex items-center justify-center text-xl">
                  🏮
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#2C1E10] whitespace-nowrap">Thả Hoa Đăng</span>
                <span className="text-[11px] text-[#6B533B] whitespace-nowrap">Ánh sáng nguyện ước</span>
              </button>

              <button
                type="button"
                onClick={handleOfferFruit}
                className="col-span-2 p-4 rounded-2xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] border border-[#EAD7A7] flex items-center justify-center text-xl shrink-0">
                  🍊
                </div>
                <div className="text-left min-w-0">
                  <div className="font-serif text-xs sm:text-sm font-bold text-[#2C1E10] whitespace-nowrap">Dâng Quả Ngọt Lành</div>
                  <div className="text-[11px] text-[#6B533B] truncate">
                    {isOfferingFruit ? '✓ Đã dâng đĩa quả thanh tịnh lên Phật đài' : 'Kính dâng ngũ quả thuần khiết cúng dường'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4.2. LỜI PHẬT DẠY HÔM NAY (FULL-SCREEN PAGE VIEW)                        */}
      {/* ========================================================================= */}
      {isDharmaQuoteModalOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsDharmaQuoteModalOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Lời Phật Dạy Hôm Nay
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center max-w-lg mx-auto w-full space-y-5">
            <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-sm text-center space-y-4">
              <HeaderLotusGlyph className="w-7 h-5 mx-auto text-[#C68B19]" />
              <p className="font-serif text-lg sm:text-xl font-bold text-[#2C1E10] leading-relaxed italic">
                &ldquo;{todayDharma.verse}&rdquo;
              </p>
              <div className="w-16 h-0.5 bg-[#D9A02E] mx-auto" />
              <p className="text-xs font-bold text-[#8C5500] tracking-wider uppercase">
                {todayDharma.source}
              </p>
              <p className="text-xs sm:text-sm text-[#6B533B] leading-relaxed">
                {todayDharma.reflection}
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${todayDharma.verse} — ${todayDharma.source}`);
                    showToast('Đã sao chép lời Phật dạy để gửi tặng người thân an lành.', 4000);
                  }
                }}
                className="py-3 px-4 rounded-xl border border-[#EAD7A7] bg-[#FFFFFF] hover:bg-[#FFF9EB] text-xs font-bold text-[#2C1E10] flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0 text-[#8C5500]" />
                <span>Sao Chép Lời Chúc</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDharmaQuoteModalOpen(false)}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] text-xs font-bold shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
              >
                Hoan Hỷ Lãnh Thọ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ĐỌC KINH & SÁM PHÁP FULL-SCREEN PAGE (100% FULL VIEW + AUTO-SCROLL)   */}
      {/* ========================================================================= */}
      {isScriptureModalOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Full-Screen Navigation Bar with Back Button */}
          <header className="shrink-0 bg-[#FFFDF8] border-b border-[#EAD7A7] px-3 sm:px-5 py-2.5 space-y-2 shadow-2xs">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAutoScrolling(false);
                  setIsScriptureModalOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <div className="min-w-0 flex-1 text-center px-1">
                <h2 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
                  {currentSutra.title}
                </h2>
                <p className="text-[11px] text-[#6B533B] whitespace-nowrap truncate">
                  {currentSutra.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
                  className="px-2 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] text-xs font-bold active:scale-95 inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                  title="Thu nhỏ cỡ chữ"
                >
                  <Minus className="w-3 h-3 shrink-0" />
                  <span>A-</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizePx((prev) => Math.min(34, prev + 2))}
                  className="px-2 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] text-xs font-bold active:scale-95 inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                  title="Phóng to cỡ chữ"
                >
                  <Plus className="w-3 h-3 shrink-0" />
                  <span>A+</span>
                </button>
              </div>
            </div>

            {/* Sutra Selector Pills + Smooth Auto-Scroll Controls */}
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-0.5">
              <div className="flex items-center gap-1.5 shrink-0">
                {SUTRA_COLLECTIONS.map((sutra, idx) => (
                  <button
                    key={sutra.id}
                    type="button"
                    onClick={() => {
                      setSelectedSutraIndex(idx);
                      setActiveVerseIndex(0);
                      if (scriptureScrollRef.current) {
                        scriptureScrollRef.current.scrollTop = 0;
                      }
                      setIsAutoScrolling(true);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border',
                      selectedSutraIndex === idx
                        ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] border-[#D9A02E] shadow-2xs'
                        : 'bg-[#FFFFFF] text-[#6B533B] border-[#EAD7A7] hover:bg-[#FFF9EB]'
                    )}
                  >
                    {sutra.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    manualTouchPauseRef.current = 0;
                    setIsAutoScrolling((v) => !v);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer border',
                    isAutoScrolling
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-[#FFF6DF] border-[#E5C67E] text-[#7A5000]'
                  )}
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0 fill-current" />}
                  <span>{isAutoScrolling ? 'Tự lướt: BẬT' : 'Tự lướt: TẮT'}</span>
                </button>

                <select
                  value={scrollSpeedMultiplier}
                  onChange={(e) => setScrollSpeedMultiplier(Number(e.target.value))}
                  className="px-2 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  <option value={0.5}>0.5x Chậm</option>
                  <option value={0.8}>0.8x Chuẩn</option>
                  <option value={1.0}>1.0x Vừa</option>
                  <option value={1.5}>1.5x Nhanh</option>
                  <option value={2.0}>2.0x</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playWoodenFishSound(0.5);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs active:scale-95 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>🪘</span>
                  <span>Gõ Mõ</span>
                </button>
              </div>
            </div>
          </header>

          {/* Full-Screen Scripture Reading Body (Auto-Scrolling Smoothly) */}
          <div
            ref={scriptureScrollRef}
            onTouchStart={() => {
              manualTouchPauseRef.current = Date.now() + 2800;
            }}
            onWheel={() => {
              manualTouchPauseRef.current = Date.now() + 2500;
            }}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full space-y-4 select-text"
            style={{ fontSize: `${fontSizePx}px` }}
          >
            <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] text-center space-y-1">
              <p className="font-serif font-bold text-base sm:text-lg text-[#8C5500]">
                {currentSutra.title}
              </p>
              <p className="text-xs text-[#6B533B]">
                ✨ Quý Phật tử nhiếp tâm thanh tịnh, chắp tay trì tụng trang nghiêm
              </p>
            </div>

            {currentSutra.verses.map((verse, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-4 rounded-2xl transition-all duration-300 font-serif border',
                  isAutoScrolling && activeVerseIndex === idx
                    ? 'bg-[#FFF6DF] text-[#2C1E10] border-[#D9A02E] shadow-xs font-bold'
                    : 'bg-[#FFFFFF] text-[#2C1E10] border-[#EAD7A7]/70'
                )}
              >
                <p className="leading-[1.85]">{verse}</p>
              </div>
            ))}

            <div className="pt-4 pb-12 text-center">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playGrandTempleBellSound(0.5);
                  setIsAutoScrolling(false);
                  setIsScriptureModalOpen(false);
                  showToast(`Hoàn mãn thời tụng "${currentSutra.title}". Công đức vô lượng!`, 4500);
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-sm shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>🙏 Hoàn Mãn Thời Kinh &amp; Quay Lại Chánh Điện</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DÂNG LỜI CẦU NGUYỆN / HỒI HƯỚNG (FULL-SCREEN PAGE VIEW)               */}
      {/* ========================================================================= */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fadeIn">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPrayerModalOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div className="min-w-0 text-center flex-1">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
                Dâng Sớ Cầu Nguyện
              </h3>
            </div>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full">
            <form onSubmit={handleSubmitPrayer} className="space-y-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#EAD7A7] shadow-2xs">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPrayerType('CAU_AN')}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all whitespace-nowrap truncate',
                    prayerType === 'CAU_AN'
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] border-[#D9A02E] shadow-2xs'
                      : 'bg-[#FAF7F0] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  ✦ Sớ Cầu An (Hiện Tiền)
                </button>
                <button
                  type="button"
                  onClick={() => setPrayerType('CAU_SIEU')}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all whitespace-nowrap truncate',
                    prayerType === 'CAU_SIEU'
                      ? 'bg-[#8C5500] text-white border-[#8C5500] shadow-2xs'
                      : 'bg-[#FAF7F0] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  🪷 Sớ Cầu Siêu (Hồi Hướng)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-bold text-xs sm:text-sm text-[#8C5500] mb-1">
                    1. Họ Tên hoặc Pháp Danh:
                  </label>
                  <input
                    type="text"
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    placeholder="Ví dụ: Thiện Tâm, Diệu Âm..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD7A7] bg-[#FAF7F0] text-[#2C1E10] placeholder-[#8E775B] text-xs sm:text-sm focus:outline-none focus:border-[#C68B19]"
                  />
                </div>
                <div>
                  <label className="block font-serif font-bold text-xs sm:text-sm text-[#8C5500] mb-1">
                    Hồi Hướng Đến Ai:
                  </label>
                  <input
                    type="text"
                    value={prayerRecipient}
                    onChange={(e) => setPrayerRecipient(e.target.value)}
                    placeholder="Cha mẹ, Gia quyến, Cửu huyền..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD7A7] bg-[#FAF7F0] text-[#2C1E10] placeholder-[#8E775B] text-xs sm:text-sm focus:outline-none focus:border-[#C68B19]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif font-bold text-xs sm:text-sm text-[#8C5500] mb-2">
                  2. Chọn Nhanh Tâm Nguyện:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRAYER_QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrayerContent(chip)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold border text-left transition-all active:scale-95 cursor-pointer',
                        prayerContent === chip
                          ? 'bg-[#FFF4D0] text-[#7A5000] border-[#D9A02E] font-bold'
                          : 'bg-[#FAF7F0] hover:bg-[#FFF9EB] text-[#6B533B] border-[#EAD7A7]'
                      )}
                    >
                      ✦ {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-serif font-bold text-xs sm:text-sm text-[#8C5500] mb-1">
                  3. Hoặc Viết Tâm Nguyện Riêng Của Bạn:
                </label>
                <textarea
                  rows={3}
                  value={prayerContent}
                  onChange={(e) => setPrayerContent(e.target.value)}
                  placeholder="Ghi lời hồi hướng, cầu an cho gia đình hoặc cầu siêu cho cửu huyền thất tổ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD7A7] bg-[#FAF7F0] text-[#2C1E10] placeholder-[#8E775B] text-sm focus:outline-none focus:border-[#C68B19]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-serif font-bold text-sm shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <HeartNavIcon className="w-4 h-4 text-[#3D2505]" />
                  <span>Dâng Sớ Cầu Nguyện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SỔ LỜI NGUYỆN CẦU ĐÃ DÂNG (FULL-SCREEN PAGE VIEW)                     */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fadeIn">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Sổ Lời Nguyện Cầu Đã Dâng ({savedPrayers.length})
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-3">
            {savedPrayers.length > 0 ? (
              savedPrayers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B533B]">
                    <span className="font-bold text-[#8C5500]">Phật tử: {item.name}</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="font-serif text-sm sm:text-base font-semibold text-[#2C1E10] leading-relaxed">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-[#6B533B] space-y-2 bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] p-6">
                <HeartNavIcon className="w-10 h-10 mx-auto text-[#C68B19]" />
                <p className="font-serif text-base font-bold text-[#2C1E10]">Chưa có lời nguyện nào được lưu</p>
                <p className="text-xs">Hãy nhấn nút &ldquo;Cầu Nguyện&rdquo; để dâng tâm nguyện đầu tiên của quý vị.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. GIẤY CHỨNG NHẬN CÔNG ĐỨC (FULL-SCREEN PAGE VIEW)                       */}
      {/* ========================================================================= */}
      {meritCertificate && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fadeIn">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setMeritCertificate(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Giấy Chứng Nhận Công Đức
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
            <div className="w-full bg-[#FFFFFF] rounded-3xl border-2 border-[#D9A02E] shadow-md p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center mx-auto text-[#8C5500]">
                <HeaderLotusGlyph className="w-7 h-5" />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C5500]">
                  {meritCertificate.type === 'CAU_AN' ? 'Sớ Cầu An Cát Tường' : 'Sớ Cầu Siêu Hồi Hướng'}
                </p>
                <h3 className="font-serif text-xl font-bold text-[#2C1E10] mt-1">
                  Giấy Chứng Nhận Công Đức
                </h3>
                <p className="text-[11px] font-mono text-[#6B533B] mt-0.5">Mã Sớ: {meritCertificate.id}</p>
              </div>

              <div className="rounded-2xl bg-[#FAF7F0] border border-[#EAD7A7] p-4 space-y-2 text-left text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B533B]">Tín chủ / Pháp danh:</span>
                  <span className="font-bold text-[#2C1E10]">{meritCertificate.senderName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B533B]">Hướng tâm đến:</span>
                  <span className="font-bold text-[#8C5500]">{meritCertificate.recipientName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B533B]">Điện thờ chứng minh:</span>
                  <span className="font-semibold text-[#2C1E10]">{meritCertificate.buddhaName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B533B]">Ngày lễ bái:</span>
                  <span className="font-medium text-[#2C1E10]">{meritCertificate.solarDate}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B533B]">Âm lịch:</span>
                  <span className="font-medium text-[#8C5500]">{meritCertificate.lunarDate}</span>
                </div>
                <div className="pt-2 border-t border-[#EAD7A7]">
                  <p className="text-[11px] font-bold text-[#8C5500] uppercase mb-1">Tâm Nguyện Đã Dâng:</p>
                  <p className="font-serif italic text-[#2C1E10] leading-relaxed">
                    &ldquo;{meritCertificate.wishContent}&rdquo;
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#6B533B] leading-relaxed">
                Đã ghi nhận vào <strong className="text-[#8C5500]">Sổ Công Đức DHARMA</strong> &amp; Phòng Cầu Nguyện.
              </p>

              <button
                type="button"
                onClick={() => setMeritCertificate(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-sm shadow-xs cursor-pointer whitespace-nowrap"
              >
                Nam Mô Hoan Hỷ Tạng Bồ Tát ☸
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TempleSanctuary;
