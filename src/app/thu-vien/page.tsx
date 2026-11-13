'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  BookOpen,
  MoreHorizontal,
  Bookmark,
  X,
  ChevronDown,
  Copy,
  Check,
  Play,
  Pause,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CenterToast } from '@/components/ui/CenterToast';
import {
  SUTRAS_DATA,
  SUTRA_CATEGORIES,
  getSutraBySlugOrId,
  type SutraCategory,
  type SutraText,
} from '@/data/sutras';
import { BAI_KHAN_DATA, type BaiKhanItem } from '@/data/dharmaExtraData';
import { DharmaSutraReader } from '@/components/sutra/DharmaSutraReader';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { getLunarDate } from '@/lib/lunar-calendar';
import { playPageTurnSound, playBeadTickSound, playOmTempleBellSound } from '@/lib/buddhistSounds';

const SUTRA_COUNTS_STORAGE_KEY = 'phatphap_dharma_sutra_counts_v2';

const BUDDHA_THUMBS_BY_CATEGORY: Record<string, string[]> = {
  'Kinh Nhật Tụng': [
    '/images/buddhas/duc-phat-thich-ca.png',
    '/images/buddhas/duc-phat-duoc-su.png',
    '/images/buddhas/phat-di-lac.png',
    '/images/buddhas/quan-the-am-bo-tat.png',
  ],
  'Tịnh Độ Tông': [
    '/images/buddhas/duc-phat-a-di-da.png',
    '/images/buddhas/dai-the-chi-bo-tat.png',
    '/images/buddhas/quan-the-am-bo-tat.png',
    '/images/buddhas/pho-hien-bo-tat.png',
  ],
  'Mật Tông': [
    '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png',
    '/images/buddhas/chuan-de-bo-tat.png',
    '/images/buddhas/kim-cang-thu-bo-tat.png',
    '/images/buddhas/duc-tara-da-la-bo-tat.png',
    '/images/buddhas/dai-nhat-nhu-lai.png',
  ],
  'Thiền & Bát Nhã': [
    '/images/buddhas/van-thu-su-loi-bo-tat.png',
    '/images/buddhas/to-su-bo-de-dat-ma.png',
    '/images/buddhas/ton-gia-ma-ha-ca-diep.png',
    '/images/buddhas/duc-phat-thich-ca.png',
  ],
  'Kinh Nguyên Thủy (Nikaya)': [
    '/images/buddhas/duc-phat-thich-ca.png',
    '/images/buddhas/ton-gia-a-nan-da.png',
    '/images/buddhas/ton-gia-ma-ha-ca-diep.png',
    '/images/buddhas/dai-nhat-nhu-lai.png',
  ],
  'Kinh Đại Thừa & Pháp Hoa': [
    '/images/buddhas/pho-hien-bo-tat.png',
    '/images/buddhas/van-thu-su-loi-bo-tat.png',
    '/images/buddhas/quan-the-am-bo-tat.png',
    '/images/buddhas/duc-phat-thich-ca.png',
  ],
  'Thiền Kệ & Lời Phật Dạy': [
    '/images/buddhas/to-su-bo-de-dat-ma.png',
    '/images/buddhas/ton-gia-ma-ha-ca-diep.png',
    '/images/buddhas/ton-gia-a-nan-da.png',
    '/images/buddhas/duc-phat-thich-ca.png',
  ],
  'Nghi Thức Sám Hối & Cúng Cơm': [
    '/images/buddhas/dia-tang-vuong-bo-tat.png',
    '/images/buddhas/vi-da-ton-thien-bo-tat.png',
    '/images/buddhas/quan-the-am-bo-tat.png',
    '/images/buddhas/duc-phat-a-di-da.png',
  ],
};

function mapSutraImage(slug: string, category?: string, idx = 0): string {
  switch (slug) {
    case 'bat-nha':
      return '/images/buddhas/van-thu-su-loi-bo-tat.png';
    case 'kim-cuong':
      return '/images/buddhas/duc-phat-thich-ca.png';
    case 'duoc-su':
      return '/images/buddhas/duc-phat-duoc-su.png';
    case 'a-di-da':
      return '/images/buddhas/duc-phat-a-di-da.png';
    case 'dia-tang':
      return '/images/buddhas/dia-tang-vuong-bo-tat.png';
    case 'dai-bi':
      return '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png';
    case 'pho-mon':
      return '/images/buddhas/quan-the-am-bo-tat.png';
    case 'phap-cu':
      return '/images/buddhas/dai-nhat-nhu-lai.png';
    case 'vu-lan':
    case 'vu-lan-sam-hoi':
      return '/images/buddhas/pho-hien-bo-tat.png';
    default: {
      const s = slug.toLowerCase();
      if (s.includes('duoc-su')) return '/images/buddhas/duc-phat-duoc-su.png';
      if (s.includes('di-lac')) return '/images/buddhas/phat-di-lac.png';
      if (s.includes('chuan-de')) return '/images/buddhas/chuan-de-bo-tat.png';
      if (s.includes('pho-hien')) return '/images/buddhas/pho-hien-bo-tat.png';
      if (s.includes('van-thu')) return '/images/buddhas/van-thu-su-loi-bo-tat.png';
      if (s.includes('dia-tang') || s.includes('chieu-hon')) return '/images/buddhas/dia-tang-vuong-bo-tat.png';
      if (s.includes('quan-am') || s.includes('dai-bi') || s.includes('om-mani')) return '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png';
      if (s.includes('a-di-da') || s.includes('vo-luong-tho') || s.includes('niem-phat') || s.includes('vang-sanh')) return '/images/buddhas/duc-phat-a-di-da.png';
      if (s.includes('lang-nghiem')) return '/images/buddhas/kim-cang-thu-bo-tat.png';
      if (s.includes('luc-to') || s.includes('tin-tam') || s.includes('chung-dao')) return '/images/buddhas/to-su-bo-de-dat-ma.png';
      const pool = (category && BUDDHA_THUMBS_BY_CATEGORY[category]) || BUDDHA_THUMBS_BY_CATEGORY['Kinh Nhật Tụng'];
      return pool[idx % pool.length];
    }
  }
}

function BuddhistLibraryInner() {
  const searchParams = useSearchParams();
  const bookmarkedSutraIds = useDharmaPracticeStore((s) => s.bookmarkedSutraIds);
  const toggleSutraBookmark = useDharmaPracticeStore((s) => s.toggleSutraBookmark);

  const [nowDate] = useState<Date>(() => new Date());
  const todayLunar = useMemo(
    () => getLunarDate(nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()),
    [nowDate]
  );

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bookmarked' | SutraCategory>('all');
  const [visibleLimit, setVisibleLimit] = useState<number>(30);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingSutra, setReadingSutra] = useState<(SutraText & { image?: string }) | null>(null);
  const [menuSutra, setMenuSutra] = useState<(SutraText & { image: string }) | null>(null);
  const [showBaiKhanModal, setShowBaiKhanModal] = useState(false);
  const [selectedBaiKhan, setSelectedBaiKhan] = useState<BaiKhanItem>(BAI_KHAN_DATA[0]);
  const [copiedKhan, setCopiedKhan] = useState(false);
  const [sutraChantCounts, setSutraChantCounts] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-scroll state for Bài Khấn full-screen teleprompter
  const baiKhanScrollRef = useRef<HTMLDivElement | null>(null);
  const [isBaiKhanAutoScrolling, setIsBaiKhanAutoScrolling] = useState(true);
  const [baiKhanSpeed, setBaiKhanSpeed] = useState<number>(1);

  const sutrasWithImages = useMemo(
    () =>
      SUTRAS_DATA.map((s, idx) => ({
        ...s,
        image: mapSutraImage(s.slug, s.category, idx),
      })),
    []
  );

  useEffect(() => {
    try {
      const savedCounts = localStorage.getItem(SUTRA_COUNTS_STORAGE_KEY);
      if (savedCounts) {
        setSutraChantCounts(JSON.parse(savedCounts));
      }
    } catch {}
    fetch(`/api/dharma/sync?resource=kv&key=${encodeURIComponent(SUTRA_COUNTS_STORAGE_KEY)}`, {
      cache: 'no-store',
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.value) {
          try {
            const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            setSutraChantCounts(parsed);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Support deep-link ?kinh=<slug|id>
  useEffect(() => {
    const kinhParam = searchParams?.get('kinh');
    if (!kinhParam) return;
    const found = getSutraBySlugOrId(kinhParam);
    if (found) {
      setReadingSutra({
        ...found,
        image: mapSutraImage(found.slug, found.category, 0),
      });
    }
  }, [searchParams]);

  // Smooth sub-pixel auto-scroll for Bài Khấn full-screen teleprompter
  useEffect(() => {
    if (!showBaiKhanModal || !isBaiKhanAutoScrolling) return;
    let rafId: number;
    let lastTs = performance.now();
    let acc = 0;

    const step = (ts: number) => {
      const dt = Math.min(64, ts - lastTs);
      lastTs = ts;
      const el = baiKhanScrollRef.current;
      if (el) {
        const pxPerSec = 26 * baiKhanSpeed;
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
  }, [showBaiKhanModal, isBaiKhanAutoScrolling, baiKhanSpeed, selectedBaiKhan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRecitationComplete = (sutra: SutraText) => {
    const nextCounts = {
      ...sutraChantCounts,
      [sutra.id]: (sutraChantCounts[sutra.id] || 0) + 1,
    };
    setSutraChantCounts(nextCounts);
    try {
      const raw = JSON.stringify(nextCounts);
      localStorage.setItem(SUTRA_COUNTS_STORAGE_KEY, raw);
      fetch('/api/dharma/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'kv',
          key: SUTRA_COUNTS_STORAGE_KEY,
          value: raw,
        }),
      }).catch(() => {});
    } catch {}
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sutrasWithImages.length };
    for (const s of sutrasWithImages) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [sutrasWithImages]);

  const filteredSutras = useMemo(() => {
    return sutrasWithImages.filter((s) => {
      if (selectedCategory === 'bookmarked') {
        if (!bookmarkedSutraIds.includes(s.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (s.category !== selectedCategory) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.sanskritOrPaliTitle.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sutrasWithImages, selectedCategory, searchQuery, bookmarkedSutraIds]);

  const todayRitualHeadline = todayLunar.viaChuPhat
    ? `Hôm nay • ${todayLunar.viaChuPhat}`
    : todayLunar.lunarDay === 1 || todayLunar.lunarDay === 15
    ? `Hôm nay • ${todayLunar.lunarDay === 1 ? 'Mùng 1 Sóc' : 'Ngày Rằm'} tháng ${todayLunar.lunarMonth} Âm lịch`
    : `Hôm nay • ${String(todayLunar.lunarDay).padStart(2, '0')}/${String(
        todayLunar.lunarMonth
      ).padStart(2, '0')} Âm lịch • Niệm Phật Hồi Hướng`;

  const handleOpenTodayRitualSutra = () => {
    const lowerVia = (todayLunar.viaChuPhat || '').toLowerCase();
    const targetSlug = lowerVia.includes('địa tạng')
      ? 'dia-tang'
      : lowerVia.includes('quán thế âm')
      ? 'dai-bi'
      : lowerVia.includes('a di đà')
      ? 'a-di-da'
      : lowerVia.includes('dược sư')
      ? 'duoc-su'
      : 'bat-nha';
    const target = sutrasWithImages.find((s) => s.slug === targetSlug) || sutrasWithImages[0];
    setShowBaiKhanModal(false);
    playPageTurnSound(0.3);
    setReadingSutra(target);
  };

  const handleCopyBaiKhan = async () => {
    const fullText = [
      selectedBaiKhan.title,
      '',
      selectedBaiKhan.openingVerse,
      '',
      ...selectedBaiKhan.paragraphs,
      '',
      selectedBaiKhan.closingVerse,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedKhan(true);
      setTimeout(() => setCopiedKhan(false), 2000);
      showToast('Đã sao chép văn khấn');
    } catch {
      showToast('Không thể sao chép trên trình duyệt này');
    }
  };

  const activeFilterLabel =
    selectedCategory === 'all'
      ? 'Tất cả'
      : selectedCategory === 'bookmarked'
      ? 'Đã lưu'
      : selectedCategory;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 pt-3 lg:pt-6 pb-48 lg:pb-16 space-y-4">
        {/* ===================================================================== */}
        {/* DHARMA TOP BAR: Filter Pill | Centered Title | Bookmark Button        */}
        {/* ===================================================================== */}
        <header className="relative z-40 flex items-center justify-between gap-3 pt-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryMenu((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#2C1E10] hover:border-[#C68B19] transition-colors cursor-pointer shadow-xs"
            >
              <span className="truncate max-w-[120px]">{activeFilterLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C5500]" />
            </button>

            {showCategoryMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowCategoryMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] shadow-xl p-1.5 z-40 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowCategoryMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors',
                      selectedCategory === 'all'
                        ? 'bg-[#FFF9EB] text-[#8C5500] border border-[#DFC27D]'
                        : 'text-[#2C1E10] hover:bg-[#FFF9EB]'
                    )}
                  >
                    <span>Tất cả kinh điển</span>
                    <span className="text-[11px] text-[#6B533B]">{categoryCounts.all}</span>
                  </button>
                  {SUTRA_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryMenu(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors',
                        selectedCategory === cat
                          ? 'bg-[#FFF9EB] text-[#8C5500] border border-[#DFC27D]'
                          : 'text-[#2C1E10] hover:bg-[#FFF9EB]'
                      )}
                    >
                      <span className="truncate">{cat}</span>
                      <span className="text-[11px] text-[#6B533B]">
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-center min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block truncate">
              TAM TẠNG KINH ĐIỂN
            </span>
            <h1 className="text-base lg:text-xl font-bold text-[#2C1E10] tracking-tight truncate">
              Pháp Âm &amp; Kinh Tạng
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              playBeadTickSound(0.25);
              setSelectedCategory((prev) => (prev === 'bookmarked' ? 'all' : 'bookmarked'));
            }}
            className={cn(
              'w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer relative shadow-xs',
              selectedCategory === 'bookmarked'
                ? 'bg-[#8C5500] border-[#8C5500] text-white'
                : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#2C1E10] hover:border-[#C68B19]'
            )}
            aria-label="Lọc kinh đã lưu"
            title={`Kinh đã lưu (${bookmarkedSutraIds.length})`}
          >
            <BookOpen className="w-4 h-4" />
            {bookmarkedSutraIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C68B19] text-white text-[9px] font-bold flex items-center justify-center">
                {bookmarkedSutraIds.length}
              </span>
            )}
          </button>
        </header>

        {/* ===================================================================== */}
        {/* SEARCH PILL & CATEGORY CHIPS                                          */}
        {/* ===================================================================== */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C5500] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Tìm trong ${sutrasWithImages.length} bài kinh, thần chú, nghi thức...`}
              className="w-full h-11 pl-11 pr-10 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-sm text-[#2C1E10] placeholder:text-[#8E7A63] focus:outline-none focus:border-[#8C5500] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                aria-label="Xoá tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setVisibleLimit(30);
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-[#8C5500] border-[#8C5500] text-white'
                  : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19] hover:text-[#2C1E10]'
              )}
            >
              Tất cả ({categoryCounts.all})
            </button>
            {SUTRA_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleLimit(60);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-[#8C5500] border-[#8C5500] text-white'
                    : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19] hover:text-[#2C1E10]'
                )}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SUTRA LIST (COMPACT SQUARE THUMBNAIL CARDS - ZERO TEXT OVERFLOW)      */}
        {/* ===================================================================== */}
        {filteredSutras.length === 0 ? (
          <div className="py-16 text-center space-y-2 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-xs">
            <BookOpen className="w-8 h-8 text-[#8C5500] mx-auto" />
            <p className="text-sm font-bold text-[#2C1E10]">
              Không tìm thấy bài kinh phù hợp
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              Hiển thị toàn bộ Tam Tạng Kinh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {(selectedCategory === 'all' && !searchQuery.trim()
                ? filteredSutras.slice(0, visibleLimit)
                : filteredSutras
              ).map((sutra) => {
              const count = sutraChantCounts[sutra.id] || 0;
              const isBookmarked = bookmarkedSutraIds.includes(sutra.id);
              return (
                <div
                  key={sutra.id}
                  onClick={() => {
                    playPageTurnSound(0.32);
                    setReadingSutra(sutra);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      playPageTurnSound(0.32);
                      setReadingSutra(sutra);
                    }
                  }}
                  className="group flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] hover:bg-[#FFF9EB]/60 transition-all cursor-pointer shadow-xs min-w-0"
                >
                  {/* Square rounded artwork thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FFF9EB] border border-[#DFC27D] shrink-0 relative">
                    <img
                      src={sutra.image}
                      alt={sutra.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text column */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C5500] truncate">
                      <span className="truncate">Kinh • {sutra.category}</span>
                      {isBookmarked && (
                        <Bookmark className="w-3 h-3 text-[#C68B19] fill-[#C68B19] shrink-0" />
                      )}
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                          • {count} biến
                        </span>
                      )}
                    </div>
                    <h2 className="text-sm sm:text-[15px] font-bold text-[#2C1E10] truncate group-hover:text-[#8C5500] transition-colors mt-0.5">
                      {sutra.title}
                    </h2>
                    <p className="text-[11px] text-[#6B533B] truncate">
                      Thời lượng trì tụng ~{sutra.durationMins} phút
                    </p>
                  </div>

                  {/* More menu (...) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuSutra(sutra);
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#6B533B] hover:text-[#2C1E10] hover:bg-[#FFF9EB] border border-transparent hover:border-[#DFC27D] transition-colors shrink-0 cursor-pointer"
                    aria-label={`Tùy chọn cho ${sutra.title}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            </div>
            {selectedCategory === 'all' && !searchQuery.trim() && visibleLimit < filteredSutras.length && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleLimit((prev) => prev + 30)}
                  className="px-5 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] text-xs font-bold text-[#8C5500] hover:bg-[#FFF9EB] transition-colors cursor-pointer shadow-xs"
                >
                  Xem thêm kinh điển ({filteredSutras.length - visibleLimit} bài còn lại)
                </button>
              </div>
            )}
          </>
        )}

        {/* ===================================================================== */}
        {/* STICKY / PINNED "VĂN KHẤN CỔ TRUYỀN" BANNER                           */}
        {/* ===================================================================== */}
        <div className="fixed bottom-[76px] inset-x-3.5 z-20 lg:static lg:pt-4">
          <button
            type="button"
            onClick={() => {
              playOmTempleBellSound(0.4);
              setIsBaiKhanAutoScrolling(true);
              setShowBaiKhanModal(true);
            }}
            className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF9EB] via-[#FCECC9] to-[#F5DC9C] border border-[#DFC27D] shadow-lg text-left relative overflow-hidden group cursor-pointer hover:border-[#8C5500] transition-all"
          >
            <div className="min-w-0 flex-1 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block truncate">
                NGHI THỨC LỄ BÁI GIA TIÊN &amp; TAM BẢO
              </span>
              <p className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
                Văn Khấn Truyền Thống Việt Nam
              </p>
              <p className="text-xs text-[#6B533B] mt-0.5 truncate">
                {todayRitualHeadline}
              </p>
            </div>
            <img
              src="/images/quan_am_altar.jpg"
              alt=""
              aria-hidden="true"
              className="w-14 h-14 rounded-xl object-cover border border-[#DFC27D] shrink-0 pointer-events-none"
            />
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* FULL-SCREEN SUTRA DETAIL & OPTIONS PAGE (100% FULL SCREEN + QUAY LẠI)   */}
      {/* ======================================================================= */}
      {menuSutra && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMenuSutra(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              Thông Tin Kinh Điển
            </h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full space-y-5">
            <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] flex items-center gap-4 shadow-xs">
              <img
                src={menuSutra.image}
                alt={menuSutra.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#DFC27D] shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-xs font-bold text-[#8C5500]">
                  {menuSutra.category} • ~{menuSutra.durationMins} phút
                </span>
                <h3 className="text-lg font-bold text-[#2C1E10] leading-snug">
                  {menuSutra.title}
                </h3>
                <p className="text-xs text-[#6B533B] truncate">
                  {menuSutra.sanskritOrPaliTitle}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-2 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500]">
                Ý Nghĩa &amp; Công Đức Trì Tụng
              </h4>
              <p className="text-sm text-[#2C1E10] leading-relaxed">{menuSutra.summary}</p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const s = menuSutra;
                  setMenuSutra(null);
                  playPageTurnSound(0.32);
                  setReadingSutra(s);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#8C5500] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#6E4200] transition-colors cursor-pointer shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mở Kinh Trì Tụng Ngay</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const id = menuSutra.id;
                  const existed = bookmarkedSutraIds.includes(id);
                  playBeadTickSound(0.3);
                  toggleSutraBookmark(id);
                  showToast(existed ? 'Đã bỏ lưu bản kinh' : 'Đã lưu vào Tủ Kinh Yêu Thích');
                  setMenuSutra(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FCECC9] transition-colors cursor-pointer"
              >
                <Bookmark
                  className={cn(
                    'w-4 h-4',
                    bookmarkedSutraIds.includes(menuSutra.id) && 'fill-[#8C5500] text-[#8C5500]'
                  )}
                />
                <span>
                  {bookmarkedSutraIds.includes(menuSutra.id)
                    ? 'Bỏ khỏi kinh đã lưu'
                    : 'Lưu bản kinh yêu thích'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* FULL-SCREEN BÀI KHẤN TRUYỀN THỐNG + AUTO-SCROLL TELEPROMPTER            */}
      {/* ======================================================================= */}
      {showBaiKhanModal && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowBaiKhanModal(false)}
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
                  onClick={() => setBaiKhanSpeed(spd)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border',
                    baiKhanSpeed === spd
                      ? 'bg-[#C68B19] text-white border-[#C68B19]'
                      : 'bg-[#FFFFFF] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </header>

          {/* Selector pills */}
          <div className="px-4 py-2.5 bg-[#FFF9EB] border-b border-[#EAD7A7] flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {BAI_KHAN_DATA.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedBaiKhan(item);
                  setIsBaiKhanAutoScrolling(true);
                  if (baiKhanScrollRef.current) baiKhanScrollRef.current.scrollTop = 0;
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors border',
                  selectedBaiKhan.id === item.id
                    ? 'bg-[#8C5500] text-white border-[#8C5500]'
                    : 'bg-[#FFFFFF] text-[#5C3A08] border-[#DFC27D]'
                )}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Prayer body with smooth auto-scroll */}
          <div
            ref={baiKhanScrollRef}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full space-y-5"
          >
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C5500]">
                {selectedBaiKhan.eyebrow}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1E10]">
                {selectedBaiKhan.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B533B] italic">{selectedBaiKhan.occasion}</p>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#DFC27D] space-y-5 text-base sm:text-xl leading-relaxed text-[#2C1E10] font-serif shadow-xs">
              <p className="whitespace-pre-line font-bold text-[#8C5500]">
                {selectedBaiKhan.openingVerse}
              </p>
              {selectedBaiKhan.paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line leading-loose">
                  {p}
                </p>
              ))}
              <p className="whitespace-pre-line font-bold text-[#8C5500] pt-4 border-t border-[#EAD7A7]">
                {selectedBaiKhan.closingVerse}
              </p>
            </div>
            <div className="h-32" />
          </div>

          {/* Footer actions */}
          <div className="px-4 py-3 border-t border-[#EAD7A7] bg-[#FFFDF8] flex flex-wrap items-center justify-between gap-2.5 max-w-3xl mx-auto w-full shrink-0">
            <button
              type="button"
              onClick={handleCopyBaiKhan}
              className="px-4 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKhan ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKhan ? 'Đã sao chép' : 'Sao chép bài khấn'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenTodayRitualSutra}
              className="px-4 py-2.5 rounded-xl bg-[#8C5500] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#6E4200]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mở kinh tụng hôm nay</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* FULL-SCREEN DHARMA INTERACTIVE SUTRA READER                             */}
      {/* ======================================================================= */}
      {readingSutra && (
        <DharmaSutraReader
          sutra={readingSutra}
          onClose={() => setReadingSutra(null)}
          showToast={showToast}
          chantCount={sutraChantCounts[readingSutra.id] || 0}
          onRecitationComplete={handleRecitationComplete}
        />
      )}

      {/* FLOATING TOAST */}
      <CenterToast message={toastMessage} icon="check" />
    </div>
  );
}

export default function BuddhistLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-sm font-bold text-[#8C5500]">
          Đang khai mở Kinh sách...
        </div>
      }
    >
      <BuddhistLibraryInner />
    </Suspense>
  );
}
