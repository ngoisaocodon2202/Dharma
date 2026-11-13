'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  SkipBack,
  SkipForward,
  Heart,
  Search,
  X,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Headphones,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
} from 'lucide-react';
import {
  NGHE_KINH_CATEGORIES,
  NGHE_KINH_VIDEOS,
  type NgheKinhCategory,
  type NgheKinhVideoItem,
} from '@/data/ngheKinhVideos';
import { SUTRAS_DATA } from '@/data/sutras';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

interface Tool05NgheKinhProps {
  showToast: (msg: string) => void;
}

const PAGE_SIZE = 18;
const FAVORITES_STORAGE_KEY = 'dharma_nghe_kinh_favorites_v1';
const LISTENED_STORAGE_KEY = 'dharma_nghe_kinh_listened_v1';

function formatClock(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function Tool05NgheKinh({ showToast }: Tool05NgheKinhProps) {
  const { addMeritEntry } = useDharmaPracticeStore();
  const playerTopRef = useRef<HTMLDivElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<'Tất cả' | NgheKinhCategory>('Tất cả');
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'favorites' | 'listened'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [activeVideo, setActiveVideo] = useState<NgheKinhVideoItem>(NGHE_KINH_VIDEOS[0]);
  const [hasStartedPlayer, setHasStartedPlayer] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [showSutraText, setShowSutraText] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [listenedIds, setListenedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs));
      const savedListened = localStorage.getItem(LISTENED_STORAGE_KEY);
      if (savedListened) setListenedIds(JSON.parse(savedListened));
    } catch {
      // ignore localStorage read errors
    }
  }, []);

  const persistList = (key: string, next: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  };

  const toggleFavorite = (id: string, title?: string) => {
    const exists = favoriteIds.includes(id);
    const next = exists ? favoriteIds.filter((item) => item !== id) : [...favoriteIds, id];
    persistList(FAVORITES_STORAGE_KEY, next, setFavoriteIds);
    playWoodenFishSound(0.25);
    if (title) {
      showToast(exists ? `Đã bỏ yêu thích "${title}"` : `Đã lưu "${title}" vào danh sách yêu thích`);
    }
  };

  const handleMarkCompleted = (video: NgheKinhVideoItem) => {
    const alreadyDone = listenedIds.includes(video.id);
    if (!alreadyDone) {
      persistList(LISTENED_STORAGE_KEY, [...listenedIds, video.id], setListenedIds);
    }
    addMeritEntry({
      category: 'TUNG_KINH',
      title: `Nghe trọn bài kinh: ${video.title}`,
      dedicationText: 'Nghe pháp âm thanh tịnh, thấu hiểu nghĩa kinh, tăng trưởng trí tuệ từ bi.',
    });
    playBellSound(0.45);
    showToast(`Hoàn mãn nghe bài: ${video.title} (+1 Công Đức)`);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Tất cả': NGHE_KINH_VIDEOS.length };
    for (const v of NGHE_KINH_VIDEOS) {
      counts[v.category] = (counts[v.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return NGHE_KINH_VIDEOS.filter((v) => {
      if (selectedCategory !== 'Tất cả' && v.category !== selectedCategory) return false;
      if (libraryFilter === 'favorites' && !favoriteIds.includes(v.id)) return false;
      if (libraryFilter === 'listened' && !listenedIds.includes(v.id)) return false;
      if (q) {
        const hay = `${v.title} ${v.channel} ${v.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, libraryFilter, searchQuery, favoriteIds, listenedIds]);

  const visibleVideos = useMemo(
    () => filteredVideos.slice(0, visibleCount),
    [filteredVideos, visibleCount]
  );

  const activeIdx = filteredVideos.findIndex((v) => v.id === activeVideo.id);
  const matchingSutra = useMemo(() => {
    if (!activeVideo.sutraSlug) return null;
    return SUTRAS_DATA.find((s) => s.slug === activeVideo.sutraSlug) || null;
  }, [activeVideo.sutraSlug]);

  const selectAndPlayVideo = (video: NgheKinhVideoItem, scrollToStage = false) => {
    playWoodenFishSound(0.28);
    setActiveVideo(video);
    setHasStartedPlayer(true);
    setShouldAutoplay(true);
    setShowSutraText(false);
    if (scrollToStage && playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleStepVideo = (dir: -1 | 1) => {
    if (filteredVideos.length === 0) return;
    const baseIdx = activeIdx >= 0 ? activeIdx : 0;
    const nextIdx = (baseIdx + dir + filteredVideos.length) % filteredVideos.length;
    selectAndPlayVideo(filteredVideos[nextIdx], false);
  };

  const isFavoriteActive = favoriteIds.includes(activeVideo.id);
  const isListenedActive = listenedIds.includes(activeVideo.id);

  return (
    <div className="space-y-5">
      {/* 1. FEATURED VIDEO PLAYER STAGE (Responsive Split on Desktop, Stacked on Mobile) */}
      <section
        ref={playerTopRef}
        className="rounded-3xl bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border-2 border-[#D9A02E] p-3.5 sm:p-5 shadow-xs space-y-3.5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-5 lg:items-start overflow-hidden"
      >
        {/* Left Column on Desktop: Metadata Strip + 16:9 YouTube Player */}
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#EAD7A7] text-[10px] font-bold uppercase tracking-wider text-[#8C5500] whitespace-nowrap">
                {activeVideo.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[10px] font-mono font-bold text-[#7A5000]">
                <Clock className="w-3 h-3" />
                {formatClock(activeVideo.durationSec)}
              </span>
              {isListenedActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Đã nghe trọn
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => toggleFavorite(activeVideo.id, activeVideo.title)}
                className={cn(
                  'px-2.5 py-1 rounded-xl border text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer',
                  isFavoriteActive
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                )}
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className={cn('w-3.5 h-3.5', isFavoriteActive && 'fill-current')} />
                <span className="hidden sm:inline">{isFavoriteActive ? 'Đã thích' : 'Yêu thích'}</span>
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] text-xs font-bold text-[#8C5500] inline-flex items-center gap-1 transition-colors"
                title="Mở video gốc trên YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YouTube</span>
              </a>
            </div>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#1D140C] border border-[#D9A02E]/60 shadow-inner relative">
            {hasStartedPlayer ? (
              <iframe
                key={`${activeVideo.youtubeId}-${shouldAutoplay ? 'auto' : 'manual'}`}
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=${shouldAutoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  playBellSound(0.25);
                  setHasStartedPlayer(true);
                  setShouldAutoplay(true);
                }}
                className="group relative w-full h-full block text-left cursor-pointer"
                aria-label={`Phát bài kinh ${activeVideo.title}`}
              >
                <img
                  src={activeVideo.thumbnailUrl}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/15 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform border-2 border-[#FFF8E6]">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
                  </div>
                  <span className="mt-2.5 px-3.5 py-1 rounded-full bg-black/65 backdrop-blur-sm text-[#FFF4D2] text-xs font-bold border border-white/20">
                    Chạm để phát bài kinh ({formatClock(activeVideo.durationSec)})
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Column on Desktop: Details, Transport Controls & Collapsible Sutra Text */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 min-w-0 lg:pt-1">
          <div className="min-w-0 space-y-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10] leading-snug break-words [overflow-wrap:anywhere]">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-[#6B533B] break-words">
              {activeVideo.channel}
              {filteredVideos.length > 0 && activeIdx >= 0
                ? ` • Bài ${activeIdx + 1}/${filteredVideos.length}`
                : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepVideo(-1)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] text-xs font-bold text-[#8C5500] inline-flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              title="Bài trước"
            >
              <SkipBack className="w-3.5 h-3.5 shrink-0" />
              <span>Trước</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepVideo(1)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] text-xs font-bold text-[#8C5500] inline-flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              title="Bài tiếp theo"
            >
              <span>Tiếp</span>
              <SkipForward className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => handleMarkCompleted(activeVideo)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Hoàn mãn (+1 Công Đức)</span>
            </button>
          </div>

          {/* Optional Collapsible Read-Along Sutra Text Panel */}
          {matchingSutra && (
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSutraText((v) => !v)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs font-bold text-[#8C5500] hover:bg-[#FFF9EB] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">Đọc bản văn tham khảo: {matchingSutra.title}</span>
                </span>
                {showSutraText ? (
                  <ChevronUp className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                )}
              </button>

              {showSutraText && (
                <div className="px-3.5 pb-3.5 pt-1 max-h-56 overflow-y-auto space-y-2 text-xs sm:text-sm leading-relaxed text-[#4E3822] border-t border-[#EAD7A7]/60">
                  {matchingSutra.toanVan.map((sec, idx) => (
                    <div key={idx} className="space-y-1.5 pt-2">
                      <p className="font-bold text-[#8C5500]">{sec.title}</p>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="whitespace-pre-line">
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. SEARCH + CATEGORY FILTER STRIP */}
      <section className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-3.5 sm:p-4 space-y-3 shadow-2xs dharma-input-panel-lock">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] truncate">
                Kho Kinh Tụng Tuyển Chọn (10–20 Phút)
              </h4>
              <p className="text-[11px] text-[#6B533B] truncate">
                {NGHE_KINH_VIDEOS.length} video kinh tụng theo danh mục • Chạm để nghe ngay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'all', label: `Tất cả (${NGHE_KINH_VIDEOS.length})` },
                { id: 'favorites', label: `Yêu thích (${favoriteIds.length})` },
                { id: 'listened', label: `Đã nghe (${listenedIds.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setLibraryFilter(tab.id);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  'px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0',
                  libraryFilter === tab.id
                    ? 'bg-[#FFF6DF] border-[#C68B19] text-[#8C5500]'
                    : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C5500] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="nghe-kinh-search"
            name="q"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Tìm tên bài kinh, chú, phẩm kinh, giảng sư..."
            aria-label="Tìm kiếm bài kinh"
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#EAD7A7] focus:border-[#C68B19] outline-none text-base sm:text-sm text-[#2C1E10] placeholder:text-[#8E775B]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:flex-wrap">
          {NGHE_KINH_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all cursor-pointer',
                  active
                    ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505] shadow-2xs'
                    : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    active ? 'bg-[#3D2505]/10 text-[#3D2505]' : 'bg-[#FFFFFF] text-[#8C5500]'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. VIDEO TRACKS GRID */}
      {filteredVideos.length === 0 ? (
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-8 text-center space-y-2">
          <p className="font-serif font-bold text-sm text-[#2C1E10]">
            Không tìm thấy bài kinh phù hợp
          </p>
          <p className="text-xs text-[#6B533B]">
            Thử đổi từ khóa tìm kiếm hoặc chọn danh mục &ldquo;Tất cả&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Tất cả');
              setLibraryFilter('all');
              setSearchQuery('');
              setVisibleCount(PAGE_SIZE);
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] cursor-pointer"
          >
            Xem toàn bộ {NGHE_KINH_VIDEOS.length} bài kinh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visibleVideos.map((video) => {
              const isSelected = activeVideo.id === video.id;
              const isFav = favoriteIds.includes(video.id);
              const isDone = listenedIds.includes(video.id);

              return (
                <article
                  key={video.id}
                  onClick={() => selectAndPlayVideo(video, true)}
                  className={cn(
                    'group rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col min-w-0',
                    isSelected
                      ? 'bg-[#FFF9EB] border-2 border-[#C68B19] shadow-sm'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] hover:border-[#C68B19] hover:shadow-xs'
                  )}
                >
                  {/* Thumbnail Header */}
                  <div className="relative aspect-video w-full bg-[#1F150C] overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(video.id, video.title);
                      }}
                      className={cn(
                        'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer',
                        isFav
                          ? 'bg-rose-600 text-white'
                          : 'bg-black/45 text-white/90 hover:bg-black/70'
                      )}
                      aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                    >
                      <Heart className={cn('w-3.5 h-3.5', isFav && 'fill-current')} />
                    </button>

                    {/* Active Badge */}
                    {isSelected && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FAD02C] text-[#3D2505] text-[10px] font-bold shadow-xs">
                        Đang chọn
                      </span>
                    )}

                    {/* Duration Chip */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 text-white text-[11px] font-mono font-bold">
                      {formatClock(video.durationSec)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5 min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500]">
                          {video.category}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-bold text-emerald-700 inline-flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Đã nghe
                          </span>
                        )}
                      </div>

                      <h5 className="font-serif font-bold text-sm text-[#2C1E10] leading-snug line-clamp-2 break-words [overflow-wrap:anywhere]">
                        {video.title}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EAD7A7]/40 min-w-0">
                      <span className="text-[11px] text-[#6B533B] truncate flex-1">
                        {video.channel}
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0',
                          isSelected
                            ? 'bg-[#FAD02C] text-[#3D2505]'
                            : 'bg-[#FFF6DF] text-[#8C5500] group-hover:bg-[#FAD02C] group-hover:text-[#3D2505] transition-colors'
                        )}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Nghe
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More / Show Less */}
          {filteredVideos.length > visibleCount ? (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-5 py-2.5 rounded-2xl bg-[#FFF6DF] hover:bg-[#FCECC2] border border-[#D9A02E] text-xs font-bold text-[#7A5000] inline-flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
                <span>
                  Xem thêm {Math.min(PAGE_SIZE, filteredVideos.length - visibleCount)} bài kinh (còn{' '}
                  {filteredVideos.length - visibleCount})
                </span>
              </button>
            </div>
          ) : (
            filteredVideos.length > PAGE_SIZE && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs font-bold text-[#6B533B] hover:border-[#C68B19] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Thu gọn danh sách</span>
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
