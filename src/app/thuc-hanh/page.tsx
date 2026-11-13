'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Headphones,
  Radio,
  Heart,
  BookHeart,
  Music,
  Flame,
  Wind,
  Compass,
  Feather,
  Utensils,
  BookOpen,
} from 'lucide-react';
import {
  LotusMinimalIcon,
  MalaBeadsMinimalIcon,
  WoodenFishMinimalIcon,
  TempleSanctuaryIcon,
  LotusLanternIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  SanctuaryWorkspace,
  SanctuaryToolId,
} from '@/components/practice/SanctuaryWorkspace';
import {
  DharmaEightNewFeatures,
  EIGHT_NEW_FEATURES_LIST,
  NewFeatureToolId,
} from '@/components/dharma/DharmaEightNewFeatures';
import { playBeadTickSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore, getTodayDateKey, computePracticeStreak } from '@/store/useDharmaPracticeStore';
import { CenterToast } from '@/components/ui/CenterToast';
import { cn } from '@/lib/utils';

const VALID_SANCTUARY_SLUGS: SanctuaryToolId[] = [
  'di-chua',
  'cau-sieu',
  'may-niem-phat',
  'nghe-kinh',
  'trang-hat',
  'chuong-mo',
  'so-gio-chap',
  'thien-hoi-tho',
  'nhac-tu-tap',
  'hoa-dang',
];

const VALID_NEW_FEATURE_SLUGS: NewFeatureToolId[] = [
  'gieo-que-quan-am',
  'chep-kinh',
  'sam-hoi-108',
  'so-phong-sinh',
  'nhat-ky-thien-nghiep',
  'bep-thien-chay',
  'tu-dien-phap-so',
  'cong-dong-hoi-huong',
  'nhac-tu-tap',
];

interface PracticeCardItem {
  orderNum: number;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  Icon: React.ComponentType<{ className?: string }>;
  actionType: 'route' | 'sanctuary' | 'new-feature';
  routeHref?: string;
  sanctuaryId?: SanctuaryToolId;
  newFeatureId?: NewFeatureToolId;
}

// =============================================================================
// TOP 8 PRIMARY TOOLS — EXACT ORDERING 1 → 8 MATCHING USER SCREENSHOT 1
// =============================================================================
const TOP_EIGHT_PRACTICE_CARDS: PracticeCardItem[] = [
  {
    orderNum: 1,
    id: 'thu-vien-bon-ton',
    title: 'Thư viện Bổn Tôn',
    subtitle: 'Chiêm bái chư Phật',
    image: '/images/dharma/tools/01-thu-vien-bon-ton.jpg',
    Icon: LotusMinimalIcon,
    actionType: 'route',
    routeHref: '/thu-vien-bon-ton',
  },
  {
    orderNum: 2,
    id: 'di-chua',
    title: 'Đi chùa',
    subtitle: 'Lễ Phật nơi chánh điện',
    image: '/images/dharma/tools/02-di-chua.jpg',
    Icon: TempleSanctuaryIcon,
    actionType: 'route',
    routeHref: '/di-chua',
  },
  {
    orderNum: 3,
    id: 'cau-sieu',
    title: 'Cầu siêu',
    subtitle: 'Thành tâm tưởng niệm',
    image: '/images/dharma/tools/03-cau-sieu.jpg',
    Icon: Flame,
    actionType: 'route',
    routeHref: '/cau-sieu',
  },
  {
    orderNum: 4,
    id: 'may-niem-phat',
    title: 'Máy niệm Phật',
    subtitle: 'Niệm danh hiệu, trì chú',
    image: '/images/dharma/tools/04-may-niem-phat.jpg',
    Icon: Radio,
    actionType: 'sanctuary',
    sanctuaryId: 'may-niem-phat',
  },
  {
    orderNum: 5,
    id: 'nghe-kinh',
    title: 'Nghe kinh',
    subtitle: '158 bài kinh 10–20p',
    image: '/images/dharma/tools/05-nghe-kinh.jpg',
    Icon: Headphones,
    actionType: 'sanctuary',
    sanctuaryId: 'nghe-kinh',
  },
  {
    orderNum: 6,
    id: 'trang-hat',
    title: 'Tràng hạt',
    subtitle: 'Lần hạt, trì niệm',
    image: '/images/dharma/tools/06-trang-hat.jpg',
    Icon: MalaBeadsMinimalIcon,
    actionType: 'sanctuary',
    sanctuaryId: 'trang-hat',
  },
  {
    orderNum: 7,
    id: 'chuong-mo',
    title: 'Chuông mõ',
    subtitle: 'Thỉnh chuông, gõ mõ',
    image: '/images/dharma/tools/07-chuong-mo.jpg',
    Icon: WoodenFishMinimalIcon,
    actionType: 'sanctuary',
    sanctuaryId: 'chuong-mo',
  },
  {
    orderNum: 8,
    id: 'so-gio-chap',
    title: 'Sổ Giỗ Chạp',
    subtitle: 'Ghi nhớ ngày giỗ chạp',
    image: '/images/dharma/tools/08-so-gio-chap.jpg',
    Icon: BookHeart,
    actionType: 'sanctuary',
    sanctuaryId: 'so-gio-chap',
  },
];

// =============================================================================
// EXTENDED PRACTICE TOOLS (PUSHED BELOW POSITION 8 AS REQUESTED)
// =============================================================================
const EXTENDED_PRACTICE_CARDS: PracticeCardItem[] = [
  {
    orderNum: 9,
    id: 'cau-an',
    title: 'Phòng Cầu An',
    subtitle: 'Nguyện cầu bình an chung',
    image: '/images/dharma/tools/09-cau-an.jpg',
    Icon: Heart,
    actionType: 'route',
    routeHref: '/cau-nguyen',
  },
  {
    orderNum: 10,
    id: 'nhac-tu-tap',
    title: 'Nhạc Thiền Tần Số Hz',
    subtitle: 'Sóng âm 432Hz & Tụng kinh',
    image: '/images/dharma/tools/10-nhac-tu-tap-hz.jpg',
    Icon: Music,
    actionType: 'new-feature',
    newFeatureId: 'nhac-tu-tap',
  },
  {
    orderNum: 11,
    id: 'thien-hoi-tho',
    title: 'Thiền Hơi Thở',
    subtitle: 'Quán sổ tức an định tâm',
    image: '/images/dharma/tools/11-thien-hoi-tho.jpg',
    Icon: Wind,
    actionType: 'sanctuary',
    sanctuaryId: 'thien-hoi-tho',
  },
  {
    orderNum: 12,
    id: 'hoa-dang',
    title: 'Thả Hoa Đăng',
    subtitle: 'Thắp sáng tâm nguyện từ bi',
    image: '/images/dharma/tools/12-hoa-dang.jpg',
    Icon: LotusLanternIcon,
    actionType: 'sanctuary',
    sanctuaryId: 'hoa-dang',
  },
];

function ThucHanhInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phapKhiParam = searchParams.get('phap-khi') || searchParams.get('tool');
  const bonTonParam = searchParams.get('bon-ton');

  const { dailyLogs, meritEntries } = useDharmaPracticeStore();

  const [activeSanctuaryTool, setActiveSanctuaryTool] = useState<SanctuaryToolId | null>(null);
  const [activeNewFeatureTool, setActiveNewFeatureTool] = useState<NewFeatureToolId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    if (!phapKhiParam) {
      setActiveSanctuaryTool(null);
      setActiveNewFeatureTool(null);
      return;
    }
    if (phapKhiParam === 'nhac-tu-tap') {
      setActiveNewFeatureTool('nhac-tu-tap');
      return;
    }
    if (VALID_NEW_FEATURE_SLUGS.includes(phapKhiParam as NewFeatureToolId)) {
      setActiveNewFeatureTool(phapKhiParam as NewFeatureToolId);
      return;
    }
    if (VALID_SANCTUARY_SLUGS.includes(phapKhiParam as SanctuaryToolId)) {
      setActiveSanctuaryTool(phapKhiParam as SanctuaryToolId);
    }
  }, [phapKhiParam]);

  const handleSelectSanctuaryTool = (toolId: SanctuaryToolId) => {
    playBeadTickSound(0.35);
    setActiveSanctuaryTool(toolId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('phap-khi', toolId);
    router.replace(`/thuc-hanh?${params.toString()}`, { scroll: false });
  };

  const handleSelectNewFeature = (toolId: NewFeatureToolId) => {
    playBeadTickSound(0.35);
    setActiveNewFeatureTool(toolId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('phap-khi', toolId);
    router.replace(`/thuc-hanh?${params.toString()}`, { scroll: false });
  };

  const handleCloseAllTools = () => {
    setActiveSanctuaryTool(null);
    setActiveNewFeatureTool(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('phap-khi');
    params.delete('tool');
    const queryStr = params.toString();
    router.replace(queryStr ? `/thuc-hanh?${queryStr}` : '/thuc-hanh', { scroll: false });
  };

  const handleCardPress = (card: PracticeCardItem) => {
    playBeadTickSound(0.35);
    if (card.actionType === 'route' && card.routeHref) {
      router.push(card.routeHref);
      return;
    }
    if (card.actionType === 'new-feature' && card.newFeatureId) {
      handleSelectNewFeature(card.newFeatureId);
      return;
    }
    if (card.actionType === 'sanctuary' && card.sanctuaryId) {
      handleSelectSanctuaryTool(card.sanctuaryId);
    }
  };

  const todayLog = dailyLogs[getTodayDateKey()];
  const streakDays = computePracticeStreak(dailyLogs);

  const renderSquarePhotoCard = (card: PracticeCardItem) => {
    const CardIcon = card.Icon;
    return (
      <button
        key={card.id}
        type="button"
        onClick={() => handleCardPress(card)}
        className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-[#DFC27D] bg-[#FFF9EB] shadow-[0_4px_14px_rgba(184,134,11,0.10)] hover:border-[#C68B19] hover:shadow-md transition-all text-left flex flex-col justify-end p-3 sm:p-4 cursor-pointer active:scale-[0.98]"
      >
        <img
          src={card.image}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Warm Sacred Scrim so white/gold typography is 100% readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241608]/90 via-[#241608]/35 to-black/10" />

        {/* Top-Right Circular Icon Badge */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/25 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-xs">
          <CardIcon className="w-4 h-4" />
        </div>

        {/* Bottom Centered Title & Subtitle (Zero overflow, strict single line) */}
        <div className="relative z-10 text-center w-full px-1">
          <h3 className="font-serif font-bold text-[13px] sm:text-base text-white drop-shadow-xs leading-tight whitespace-nowrap truncate">
            {card.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-[#FFE8B3] mt-0.5 leading-snug whitespace-nowrap truncate">
            {card.subtitle}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10] pb-12">
      {/* Toast Notification */}
      <CenterToast message={toastMessage} icon="check" />

      {/* ===================================================================== */}
      {/* 1. MOBILE APP TOP HEADER BAR (LIGHT WARM GOLD & WHITE)                */}
      {/* ===================================================================== */}
      <div className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#EAD7A7] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <h1 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10] whitespace-nowrap truncate">
            Tu tập
          </h1>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-[11px] font-bold text-[#8C5500] whitespace-nowrap">
              🔥 {streakDays} ngày
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 whitespace-nowrap">
              {meritEntries.length} công đức
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN CONTENT CONTAINER                                             */}
      {/* ===================================================================== */}
      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 pt-4 space-y-6">
        {/* SECTION A: PHƯƠNG TIỆN TU TẬP */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            Phương tiện tu tập
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {TOP_EIGHT_PRACTICE_CARDS.map(renderSquarePhotoCard)}
          </div>
        </section>

        {/* SECTION B: PHÁP MÔN ỨNG DỤNG */}
        <section className="space-y-3 pt-1">
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            Pháp môn ứng dụng
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {EIGHT_NEW_FEATURES_LIST.map((feat) => (
              <button
                key={feat.id}
                type="button"
                onClick={() => handleSelectNewFeature(feat.id)}
                className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-[#DFC27D] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(184,134,11,0.10)] hover:border-[#C68B19] transition-all text-left flex flex-col justify-end p-2.5 sm:p-4 cursor-pointer active:scale-[0.98]"
              >
                <img
                  src={feat.image}
                  alt={feat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241608]/90 via-[#241608]/35 to-black/10" />

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#FFE07D] text-[#3D2505] text-[10px] font-extrabold whitespace-nowrap shadow-xs">
                  {feat.badge}
                </div>

                <div className="relative z-10 text-center w-full px-1">
                  <h3 className="font-serif font-bold text-[13px] sm:text-base text-white drop-shadow-xs leading-tight whitespace-nowrap truncate">
                    {feat.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[#FFE8B3] mt-0.5 leading-snug whitespace-nowrap truncate">
                    {feat.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION C: HỘ NIỆM & THIỀN TỊNH */}
        <section className="space-y-3 pt-1">
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            Hộ niệm &amp; Thiền định
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {EXTENDED_PRACTICE_CARDS.map(renderSquarePhotoCard)}
          </div>
        </section>

        {/* SECTION D: SUMMARY TODAY STATS CARD (LIGHT GOLD & WHITE) */}
        <section className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-2xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500] block whitespace-nowrap">
              Công Đức Hành Trì Hôm Nay
            </span>
            <p className="text-xs text-[#6B533B] truncate mt-0.5">
              Lần chuỗi: <strong className="text-[#2C1E10]">{todayLog?.malaBeadsCount || 0}</strong> hạt • Kinh tụng: <strong className="text-[#2C1E10]">{todayLog?.sutrasReadCount || 0}</strong> biến • Gõ mõ: <strong className="text-[#2C1E10]">{todayLog?.woodfishCount || 0}</strong> nhịp
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/ho-so')}
            className="px-3.5 py-2 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold shrink-0 whitespace-nowrap cursor-pointer hover:bg-[#FCECC2]"
          >
            Xem Sổ Công Đức
          </button>
        </section>
      </div>

      {/* ===================================================================== */}
      {/* FULL-SCREEN SANCTUARY WORKSPACE MODAL                                 */}
      {/* ===================================================================== */}
      {activeSanctuaryTool && (
        <SanctuaryWorkspace
          activeTool={activeSanctuaryTool}
          onSelectTool={handleSelectSanctuaryTool}
          onClose={handleCloseAllTools}
          bonTonParam={bonTonParam}
          showToast={showToast}
        />
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN 8 NEW FEATURES + HZ HEALING STUDIO                        */}
      {/* ===================================================================== */}
      {activeNewFeatureTool && (
        <DharmaEightNewFeatures
          activeTool={activeNewFeatureTool}
          onClose={handleCloseAllTools}
          showToast={showToast}
        />
      )}
    </div>
  );
}

export default function ThucHanhPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-6 text-sm text-[#8C5500]">
          Đang mở Đạo Tràng Tu Tập DHARMA...
        </div>
      }
    >
      <ThucHanhInner />
    </Suspense>
  );
}
