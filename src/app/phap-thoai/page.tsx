import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { formatDuration } from '@/lib/utils';
import { AudioPlayButton } from '@/components/home/AudioPlayButton';
import { BookmarkButton } from '@/components/article/BookmarkButton';
import { Headphones, Music, Radio, Mic, Video, Search } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoCatalogView } from '@/components/video/VideoCatalogView';

export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    'dinh-dang'?: string;
    'the-loai'?: string;
    'giang-su'?: string;
    q?: string;
  }>;
}

const AUDIO_CATEGORIES = [
  { label: 'Tất cả', value: '', icon: Headphones },
  { label: 'Pháp thoại', value: 'PHAP_THOAI', icon: Mic },
  { label: 'Kinh tụng', value: 'KINH_TUNG', icon: Music },
  { label: 'Thiền quán', value: 'THIEN', icon: Radio },
  { label: 'Podcast', value: 'PODCAST', icon: Headphones },
];

const VIDEO_CATEGORIES = [
  { label: 'Tất cả video', value: '', icon: Video },
  { label: 'Pháp thoại', value: 'PHAP_THOAI', icon: Mic },
  { label: 'Thiền quán', value: 'THIEN_QUAN', icon: Radio },
  { label: 'Kinh tụng', value: 'KINH_TUNG', icon: Music },
  { label: 'Di sản Cổ tự', value: 'VAN_HOA', icon: BuddhaBodhiIcon },
];

const CATEGORY_LABELS: Record<string, string> = {
  PHAP_THOAI: 'Pháp thoại',
  KINH_TUNG: 'Kinh tụng',
  THIEN: 'Thiền dẫn',
  THIEN_QUAN: 'Thiền quán',
  PODCAST: 'Podcast',
  VAN_HOA: 'Di sản Cổ tự',
};

export default async function AudioAndVideoPage({ searchParams }: Props) {
  const {
    'dinh-dang': formatParam,
    'the-loai': categoryFilter,
    'giang-su': speakerFilter,
    q: searchQuery,
  } = await searchParams;

  const isVideoMode = formatParam === 'video';

  if (isVideoMode) {
    // 1. VIDEO MODE
    let sql = `SELECT id, title, speaker, video_url, thumbnail_url, duration_seconds, category,
                      description, view_count, created_at
               FROM videos WHERE 1=1`;
    const params: any[] = [];

    if (categoryFilter) {
      params.push(categoryFilter);
      sql += ` AND category = $${params.length}`;
    }
    if (speakerFilter) {
      params.push(`%${speakerFilter}%`);
      sql += ` AND speaker ILIKE $${params.length}`;
    }
    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      sql += ` AND (title ILIKE $${params.length} OR speaker ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY view_count DESC, created_at DESC';

    const [videosRes, speakersRes, countsRes] = await Promise.all([
      query(sql, params),
      query(`SELECT DISTINCT speaker FROM videos ORDER BY speaker ASC LIMIT 20`),
      Promise.all([
        query('SELECT count(*) FROM audio'),
        query('SELECT count(*) FROM videos'),
      ]),
    ]);

    const videos = videosRes.rows;
    const speakers = speakersRes.rows.map((r: any) => r.speaker);
    const audioCount = countsRes[0].rows[0]?.count || 0;
    const videoCount = countsRes[1].rows[0]?.count || 0;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider whitespace-nowrap">
            <Video className="w-4 h-4 animate-pulse-glow" />
            <span className="whitespace-nowrap">Kho Video & Pháp Âm Trực Quan</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
                Video Phật Pháp & Danh Lam Cổ Tự
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed mt-1">
                Xem trực tiếp các bài giảng sâu sắc của các bậc thầy Thích Pháp Hòa, Thích Minh Niệm, Thích Nhất Hạnh cùng các thước phim tư liệu toàn cảnh di sản cổ tự.
              </p>
            </div>

            {/* Quick Search Bar */}
            <form method="GET" action="/phap-thoai" className="relative w-full md:w-72 flex-shrink-0">
              <input type="hidden" name="dinh-dang" value="video" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ''}
                placeholder="Tìm bài giảng, giảng sư..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-2xs"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Format Switcher Tabs (Audio vs Video) */}
          <div className="grid grid-cols-2 gap-2 pt-2 max-w-md">
            <Link
              href="/phap-thoai"
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border border-ivory-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400 flex items-center justify-center gap-1.5"
            >
              <Headphones className="w-4 h-4 text-charcoal-500" />
              <span>Pháp Âm ({audioCount})</span>
            </Link>
            <Link
              href="/phap-thoai?dinh-dang=video"
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-saffron-500 text-white shadow-xs flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Video Tuyển Chọn ({videoCount})</span>
            </Link>
          </div>

          {/* Category Filter Pills (Horizontal scrolling container with edge bleed) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {VIDEO_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={
                  c.value
                    ? `/phap-thoai?dinh-dang=video&the-loai=${c.value}`
                    : '/phap-thoai?dinh-dang=video'
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all inline-flex items-center gap-1.5 ${
                  categoryFilter === c.value || (!categoryFilter && !c.value)
                    ? 'bg-saffron-500 text-white shadow-xs'
                    : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400'
                }`}
              >
                <c.icon className="w-3.5 h-3.5" />
                {c.label}
              </Link>
            ))}
          </div>

          {/* Speaker Filter Pills */}
          {speakers.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
              <span className="text-xs text-charcoal-400 flex-shrink-0 whitespace-nowrap">
                Giảng sư:
              </span>
              <Link
                href="/phap-thoai?dinh-dang=video"
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  !speakerFilter
                    ? 'bg-jade-500 text-white'
                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:text-jade-700'
                }`}
              >
                Tất cả
              </Link>
              {speakers.map((s: string) => (
                <Link
                  key={s}
                  href={`/phap-thoai?dinh-dang=video&giang-su=${encodeURIComponent(s)}`}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    speakerFilter === s
                      ? 'bg-jade-500 text-white'
                      : 'bg-ivory-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-jade-50 dark:hover:bg-jade-950/30 hover:text-jade-700'
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Video Catalog Grid */}
        <VideoCatalogView
          videos={videos}
          speakers={speakers}
          currentSpeaker={speakerFilter}
          currentCategory={categoryFilter}
        />
      </div>
    );
  }

  // 2. AUDIO MODE (DEFAULT)
  let sql = `SELECT id, title, speaker, audio_url, duration_seconds, category,
                    cover_image, description, listen_count, created_at
             FROM audio WHERE 1=1`;
  const params: any[] = [];

  if (categoryFilter) {
    params.push(categoryFilter);
    sql += ` AND category = $${params.length}`;
  }
  if (speakerFilter) {
    params.push(`%${speakerFilter}%`);
    sql += ` AND speaker ILIKE $${params.length}`;
  }
  if (searchQuery) {
    params.push(`%${searchQuery}%`);
    sql += ` AND (title ILIKE $${params.length} OR speaker ILIKE $${params.length})`;
  }

  sql += ' ORDER BY listen_count DESC, created_at DESC';

  const [audioRes, speakersRes, countsRes] = await Promise.all([
    query(sql, params),
    query(`SELECT DISTINCT speaker FROM audio ORDER BY speaker ASC LIMIT 20`),
    Promise.all([
      query('SELECT count(*) FROM audio'),
      query('SELECT count(*) FROM videos'),
    ]),
  ]);

  const tracks = audioRes.rows;
  const speakers = speakersRes.rows.map((r: any) => r.speaker);
  const audioCount = countsRes[0].rows[0]?.count || 0;
  const videoCount = countsRes[1].rows[0]?.count || 0;

  const featured = tracks[0];
  const rest = tracks.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider whitespace-nowrap">
          <Headphones className="w-4 h-4 animate-pulse-glow" />
          <span className="whitespace-nowrap">Âm thanh Tỉnh thức</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
              Pháp Thoại & Kinh Tụng
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed mt-1">
              Lắng nghe những thời pháp âm nuôi dưỡng tuệ giác, chuông mõ kinh tụng an định tâm hồn và những bài hướng dẫn thiền buông thư giữa đời thường.
            </p>
          </div>

          {/* Search Input */}
          <form method="GET" action="/phap-thoai" className="relative w-full md:w-72 flex-shrink-0">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ''}
              placeholder="Tìm pháp âm, giảng sư..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Format Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 pt-2 max-w-md">
          <Link
            href="/phap-thoai"
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all bg-saffron-500 text-white shadow-xs flex items-center justify-center gap-1.5"
          >
            <Headphones className="w-4 h-4 text-white" />
            <span>Pháp Âm ({audioCount})</span>
          </Link>
          <Link
            href="/phap-thoai?dinh-dang=video"
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border border-ivory-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400 flex items-center justify-center gap-1.5"
          >
            <Video className="w-4 h-4 text-charcoal-500" />
            <span>Video Tuyển Chọn ({videoCount})</span>
          </Link>
        </div>

        {/* Category Filter Pills (Horizontal scroll with edge bleed) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {AUDIO_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={c.value ? `/phap-thoai?the-loai=${c.value}` : '/phap-thoai'}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all inline-flex items-center gap-1.5 ${
                categoryFilter === c.value || (!categoryFilter && !c.value)
                  ? 'bg-saffron-500 text-white shadow-xs'
                  : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400'
              }`}
            >
              <c.icon className="w-3.5 h-3.5" />
              {c.label}
            </Link>
          ))}
        </div>

        {/* Speaker Filter */}
        {speakers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            <span className="text-xs text-charcoal-400 flex-shrink-0 whitespace-nowrap">Giảng sư:</span>
            {speakers.map((s: string) => (
              <Link
                key={s}
                href={speakerFilter === s ? '/phap-thoai' : `/phap-thoai?giang-su=${encodeURIComponent(s)}`}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  speakerFilter === s
                    ? 'bg-jade-500 text-white'
                    : 'bg-ivory-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-jade-50 dark:hover:bg-jade-950/30 hover:text-jade-700'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        )}
      </div>

      {tracks.length === 0 ? (
        <EmptyState
          title="Không tìm thấy pháp thoại"
          description="Hiện chưa có bản ghi âm nào trong thể loại này. Quý đạo hữu hãy quay lại sau hoặc xóa bộ lọc."
        />
      ) : (
        <>
          {/* Featured Track */}
          {featured && !searchQuery && !speakerFilter && (
            <div className="bg-gradient-to-br from-saffron-50 to-jade-50 dark:from-charcoal-800 dark:to-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
              <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-ivory-100 flex-shrink-0">
                <img
                  src={featured.cover_image || 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500&auto=format&fit=crop&q=80'}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/30 flex items-center justify-center">
                  <AudioPlayButton track={featured} size="lg" />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="saffron" size="sm">Nghe nhiều nhất</Badge>
                  <Badge variant="neutral" size="sm">{CATEGORY_LABELS[featured.category] || featured.category}</Badge>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-snug">
                  {featured.title}
                </h2>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-2">
                  {featured.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-charcoal-500 pt-2 whitespace-nowrap">
                  <span className="font-medium text-saffron-700 dark:text-saffron-400">Giảng sư: {featured.speaker}</span>
                  <span>•</span>
                  <span>{formatDuration(featured.duration_seconds)}</span>
                  <span>•</span>
                  <span>{featured.listen_count?.toLocaleString('vi-VN')} lượt nghe</span>
                </div>
              </div>
            </div>
          )}

          {/* Tracks Grid */}
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap">
              {featured && !searchQuery && !speakerFilter ? 'Tất cả bài pháp thoại' : `Kết quả (${tracks.length})`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.map((track: any) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 p-4 flex items-center gap-4 hover-lift group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ivory-100 flex-shrink-0">
                    <img
                      src={track.cover_image || 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=200&auto=format&fit=crop&q=80'}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal-900/30 flex items-center justify-center">
                      <AudioPlayButton track={track} size="sm" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-charcoal-400 mb-0.5 whitespace-nowrap">
                      <span className="text-saffron-700 dark:text-saffron-400 font-medium">
                        {CATEGORY_LABELS[track.category] || track.category}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(track.duration_seconds)}</span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 truncate group-hover:text-saffron-600 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 truncate mt-0.5">
                      {track.speaker}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <BookmarkButton entityType="AUDIO" entityId={track.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
