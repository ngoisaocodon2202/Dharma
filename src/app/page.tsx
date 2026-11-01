import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { formatDate, formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { HeroSearchTrigger } from '@/components/home/HeroSearchTrigger';
import { DailyPracticeCard, DailyPracticeData } from '@/components/home/DailyPracticeCard';
import { AudioPlayButton } from '@/components/home/AudioPlayButton';
import { MeditationPreview } from '@/components/home/MeditationPreview';
import { VideoSection } from '@/components/video/VideoSection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { BooksSection } from '@/components/books/BooksSection';
import { OmManiHomeClient } from '@/components/om-mani/OmManiHomeClient';
import {
  BookOpen,
  Music,
  MapPin,
  Clock,
  Compass,
  Video,
  CheckCircle,
  Users,
  Calendar,
  Building,
  ArrowRight,
  Eye,
  Heart,
  Scroll,
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  // Query data from PostgreSQL
  const [
    categoriesRes,
    articlesRes,
    practiceRes,
    pathsRes,
    audioRes,
    templesRes,
    videosRes,
    eventsRes,
    orgsRes,
    booksRes,
  ] = await Promise.all([
    query('SELECT id, name, slug, description FROM article_categories ORDER BY sort_order ASC, name ASC LIMIT 8'),
    query(`
      SELECT a.id, a.title, a.slug, a.excerpt, a.cover_image, a.reading_time_minutes, a.view_count, a.published_at,
             c.name as category_name, c.slug as category_slug,
             p.full_name as author_name, p.dharma_name as author_dharma_name, p.avatar_url as author_avatar
      FROM articles a
      JOIN article_categories c ON a.category_id = c.id
      JOIN profiles p ON a.author_id = p.user_id
      WHERE a.status = 'PUBLISHED' AND a.deleted_at IS NULL
      ORDER BY a.published_at DESC LIMIT 5
    `),
    query(`
      SELECT dp.id, dp.practice_date, dp.mindful_quote, dp.quote_source, dp.reflection_text, dp.mindful_action,
             a.title as audio_title, a.audio_url, a.duration_seconds
      FROM daily_practices dp
      LEFT JOIN audio a ON dp.audio_id = a.id
      ORDER BY dp.practice_date DESC LIMIT 1
    `),
    query('SELECT id, title, slug, description, level, estimated_hours, total_modules FROM learning_paths ORDER BY sort_order ASC LIMIT 5'),
    query('SELECT id, title, speaker, audio_url, duration_seconds, category, cover_image, description, listen_count FROM audio ORDER BY listen_count DESC LIMIT 4'),
    query('SELECT id, name, slug, category, tradition, abbot_name, address, province, district, cover_image, description, is_verified FROM temples ORDER BY is_verified DESC, name ASC LIMIT 6'),
    query('SELECT id, title, speaker, video_url, thumbnail_url, duration_seconds, category, description, view_count FROM videos ORDER BY view_count DESC LIMIT 12'),
    query('SELECT id, title, slug, description, cover_image, start_date, location FROM events ORDER BY start_date ASC LIMIT 3'),
    query('SELECT id, name, slug, org_type, logo_url, description, address, website, is_verified FROM organizations WHERE is_verified = true LIMIT 2'),
    query('SELECT id, slug, title, subtitle, author, translator, cover_image, description, category, total_pages, published_year, chapters FROM books ORDER BY published_year DESC, created_at DESC LIMIT 8'),
  ]);

  const categories = categoriesRes.rows;
  const articles = articlesRes.rows;
  const dailyPractice = (practiceRes.rows[0] as DailyPracticeData) || null;
  const learningPaths = pathsRes.rows;
  const audioTracks = audioRes.rows;
  const temples = templesRes.rows;
  const videos = videosRes.rows;
  const events = eventsRes.rows;
  const organizations = orgsRes.rows;
  const books = booksRes.rows;

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 pb-24">
      {/* 1. BỒ ĐỀ TÂM - PHẬT PHÁP TOÀN CẦU (NATIVE APP INTERACTIVE SUITE) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-6">
        <OmManiHomeClient />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 lg:space-y-20">
        {/* 2. CHỦ ĐỀ PHẬT PHÁP (TOPICS) */}
        <ScrollReveal>
          <section id="chu-de" className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider block">
                  Chuyên mục
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Chủ Đề Phật Pháp
                </h2>
              </div>
              <Link
                href="/bai-viet"
                className="text-xs font-medium text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Xem tất cả chuyên mục <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/bai-viet?chuyen-muc=${cat.slug}`}
                  className="group p-5 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400 dark:hover:border-saffron-600 transition-all hover-lift"
                >
                  <div className="w-9 h-9 rounded-lg bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-charcoal-900 dark:text-charcoal-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors whitespace-nowrap truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {cat.description || 'Khám phá giáo lý và những bài học từ bi sâu sắc.'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 3. BÀI VIẾT MỚI (EDITORIAL ARTICLES) */}
        <ScrollReveal delayMs={100}>
          <section id="bai-viet" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider block">
                  Tri thức & Tỉnh thức
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Bài Viết Mới & Khuyên Đọc
                </h2>
              </div>
              <Link
                href="/bai-viet"
                className="text-xs font-medium text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1"
              >
                Xem toàn bộ bài viết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured Article (Left 7 Cols) */}
              {featuredArticle && (
                <div className="lg:col-span-7">
                  <Card className="h-full flex flex-col group overflow-hidden">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-ivory-100">
                      <img
                        src={featuredArticle.cover_image || '/images/buddha_meditation.jpg'}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="saffron">{featuredArticle.category_name}</Badge>
                      </div>
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400">
                        <span>{formatDate(featuredArticle.published_at)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {featuredArticle.reading_time_minutes} phút đọc
                        </span>
                      </div>
                      <Link href={`/bai-viet/${featuredArticle.slug}`}>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-100 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors leading-tight">
                          {featuredArticle.title}
                        </h3>
                      </Link>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-charcoal-600 dark:text-charcoal-300 line-clamp-3 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-xs font-semibold text-saffron-800 overflow-hidden">
                          {featuredArticle.author_avatar ? (
                            <img src={featuredArticle.author_avatar} alt={featuredArticle.author_name} className="w-full h-full object-cover" />
                          ) : (
                            featuredArticle.author_name.charAt(0)
                          )}
                        </div>
                        <span className="font-medium text-charcoal-800 dark:text-charcoal-200">
                          {featuredArticle.author_dharma_name ? `Thầy ${featuredArticle.author_dharma_name}` : featuredArticle.author_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-charcoal-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{featuredArticle.view_count || 120}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Side Articles List (Right 5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {sideArticles.map((article: any) => (
                  <div
                    key={article.id}
                    className="p-3.5 sm:p-4 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-300 dark:hover:border-saffron-700 transition-all flex gap-3 sm:gap-4 group hover-lift"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0">
                      <img
                        src={article.cover_image || '/images/lotus_blooming.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-400 mb-1">
                          <span className="text-saffron-700 dark:text-saffron-400 font-medium">{article.category_name}</span>
                          <span>•</span>
                          <span>{article.reading_time_minutes} phút</span>
                        </div>
                        <Link href={`/bai-viet/${article.slug}`}>
                          <h4 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 line-clamp-2 hover:text-saffron-600 transition-colors leading-snug">
                            {article.title}
                          </h4>
                        </Link>
                      </div>
                      <div className="text-[11px] text-charcoal-500 mt-2">
                        {article.author_dharma_name || article.author_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 4. THỰC HÀNH HÔM NAY (DAILY PRACTICE) */}
        {dailyPractice && (
          <ScrollReveal delayMs={100}>
            <section className="space-y-4">
              <DailyPracticeCard practice={dailyPractice} />
            </section>
          </ScrollReveal>
        )}

        {/* 5. LỘ TRÌNH HỌC PHẬT (LEARNING PATHS) */}
        <ScrollReveal delayMs={100}>
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-jade-700 dark:text-jade-400 uppercase tracking-wider block">
                  Từng bước thấu hiểu Chánh pháp
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Lộ Trình Học Phật
                </h2>
              </div>
              <Link
                href="/lo-trinh-hoc"
                className="text-xs font-medium text-jade-700 dark:text-jade-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Xem tất cả lộ trình <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {learningPaths.map((path: any) => (
                <Card key={path.id} className="flex flex-col justify-between p-4 sm:p-6 hover-lift">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-mono px-2 py-0.5 bg-jade-50 dark:bg-jade-950/40 text-jade-700 dark:text-jade-300 rounded border border-jade-200/60 dark:border-jade-800/60 whitespace-nowrap">
                        {path.level === 'BEGINNER' ? 'Cơ bản' : path.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao'}
                      </span>
                      <span className="text-xs text-charcoal-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5" /> {path.estimated_hours} giờ học
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                      {path.title}
                    </h3>
                    <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-3 leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-ivory-100 dark:border-charcoal-700 flex items-center justify-between">
                    <span className="text-xs text-charcoal-500 whitespace-nowrap">
                      {path.total_modules} bài học
                    </span>
                    <Link href={`/lo-trinh-hoc/${path.slug}`}>
                      <Button variant="secondary" size="sm" className="whitespace-nowrap">
                        Bắt đầu học
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 6. PHÁP THOẠI & AUDIO (AUDIO LECTURES) */}
        <ScrollReveal delayMs={100}>
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider block">
                  Pháp âm giải thoát
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Pháp Thoại & Kinh Tụng Tuyển Chọn
                </h2>
              </div>
              <Link
                href="/phap-thoai"
                className="text-xs font-medium text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Nghe thêm audio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {audioTracks.map((track: any) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 p-4 flex flex-col justify-between shadow-sm hover-lift group"
                >
                  <div>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-ivory-100 mb-3">
                      <img
                        src={track.cover_image || '/images/incense_smoke.jpg'}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-charcoal-900/20 flex items-center justify-center">
                        <AudioPlayButton track={track} size="md" />
                      </div>
                    </div>
                    <span className="text-[10px] text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider block mb-1 whitespace-nowrap">
                      {track.category === 'PHAP_THOAI' ? 'Pháp thoại' : track.category === 'KINH_TUNG' ? 'Kinh tụng' : 'Thiền quán'}
                    </span>
                    <h4 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 line-clamp-2 leading-snug">
                      {track.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 truncate">
                      {track.speaker}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-ivory-100 dark:border-charcoal-700 flex items-center justify-between text-xs text-charcoal-400 whitespace-nowrap">
                    <span>{formatDuration(track.duration_seconds)}</span>
                    <span>{track.listen_count || 1200} lượt nghe</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 7. PHÒNG THIỀN TRỰC TUYẾN (MEDITATION SANCTUARY PREVIEW) */}
        <ScrollReveal delayMs={100}>
          <section>
            <MeditationPreview />
          </section>
        </ScrollReveal>

        {/* 8. CHÙA & ĐỊA DANH PHẬT GIÁO (TEMPLES) */}
        <ScrollReveal delayMs={100}>
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-lotus-700 dark:text-lotus-400 uppercase tracking-wider block">
                  Cổ tự & Di tích
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Chùa & Địa Danh Phật Giáo
                </h2>
              </div>
              <Link
                href="/chua-dia-danh"
                className="text-xs font-medium text-lotus-700 dark:text-lotus-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Khám phá bản đồ chùa <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {temples.map((temple: any) => (
                <Card key={temple.id} className="overflow-hidden group hover-lift flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] bg-ivory-100 overflow-hidden">
                      <img
                        src={temple.cover_image || 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&auto=format&fit=crop&q=85'}
                        alt={temple.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-white flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                        <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-400" />
                        <span>Danh Lam Cổ Tự</span>
                      </div>
                      {temple.is_verified && (
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-jade-700 dark:text-jade-300 flex items-center gap-1 shadow-xs whitespace-nowrap">
                          <CheckCircle className="w-3.5 h-3.5 text-jade-600" /> Đã xác minh
                        </div>
                      )}
                    </div>
                    <CardHeader className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-charcoal-500 whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5 text-lotus-500 flex-shrink-0" />
                        <span className="font-medium text-lotus-700 dark:text-lotus-400">{temple.province}</span>
                        <span>•</span>
                        <span className="truncate">{temple.tradition || 'Bắc tông'}</span>
                      </div>
                      <Link href={`/chua-dia-danh/${temple.slug}`}>
                        <h3 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 hover:text-lotus-600 transition-colors line-clamp-1">
                          {temple.name}
                        </h3>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                        {temple.description}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter className="pt-3 border-t border-ivory-100 dark:border-charcoal-800">
                    <span className="text-xs text-charcoal-500 truncate max-w-[200px] whitespace-nowrap">
                      {temple.address}
                    </span>
                    <Link
                      href={`/chua-dia-danh/${temple.slug}`}
                      className="text-xs text-lotus-600 dark:text-lotus-400 font-semibold hover:underline whitespace-nowrap flex-shrink-0"
                    >
                      Chi tiết →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 9. VIDEO PHẬT PHÁP (INTERACTIVE VIDEO SECTION) */}
        <ScrollReveal delayMs={100}>
          <section id="video-phat-phap">
            <VideoSection initialVideos={videos} />
          </section>
        </ScrollReveal>

        {/* 10. SỰ KIỆN KHÓA TU & TU HỌC */}
        {events.length > 0 && (
          <ScrollReveal delayMs={100}>
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
                <div>
                  <span className="text-xs font-semibold text-lotus-700 dark:text-lotus-400 uppercase tracking-wider block">
                    Hoạt động Phật sự
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                    Sự Kiện & Khóa Tu An Lạc
                  </h2>
                </div>
                <Link
                  href="/su-kien"
                  className="text-xs font-medium text-lotus-700 dark:text-lotus-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                >
                  Xem lịch khóa tu <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((ev: any) => (
                  <div
                    key={ev.id}
                    className="p-5 bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 hover:border-lotus-400 dark:hover:border-lotus-600 transition-all hover-lift flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-lotus-600 dark:text-lotus-400 font-semibold whitespace-nowrap">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(ev.start_date)}</span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-100 leading-snug">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-ivory-100 dark:border-charcoal-700 flex items-center justify-between text-xs">
                      <span className="text-charcoal-500 truncate max-w-[180px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </span>
                      <Link
                        href={`/su-kien/${ev.slug}`}
                        className="text-lotus-600 dark:text-lotus-400 font-semibold hover:underline whitespace-nowrap flex-shrink-0 ml-2"
                      >
                        Đăng ký →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 10. TỦ KINH SÁCH & THƯ VIỆN (SACRED BOOKS) */}
        <ScrollReveal delayMs={100}>
          <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider block">
                  Pháp bảo vô giá
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Tủ Kinh Sách Phật Học
                </h2>
              </div>
              <Link
                href="/thu-vien"
                className="text-xs font-medium text-saffron-700 dark:text-saffron-400 hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Mở rộng thư viện <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <BooksSection books={books} limit={8} />
          </section>
        </ScrollReveal>

        {/* 11. TRANG CHÍNH THỨC CHÙA / TỔ CHỨC (ORGANIZATIONS) */}
        <ScrollReveal delayMs={100}>
          <section className="bg-ivory-100/70 dark:bg-charcoal-800/60 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-xs font-semibold text-jade-700 dark:text-jade-400 uppercase tracking-wider block">
                  Thông tin chính thống
                </span>
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-100">
                  Trang Chính Thức Của Các Tự Viện & Tổ Chức
                </h3>
              </div>
              <Link href="/to-chuc" className="flex-shrink-0">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Danh sách tổ chức đã xác minh
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org: any) => (
                <div key={org.id} className="p-4 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-6 h-6 text-saffron-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <h4 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 truncate">
                        {org.name}
                      </h4>
                      <CheckCircle className="w-4 h-4 text-jade-600 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                      {org.description}
                    </p>
                    <p className="text-[11px] text-charcoal-400 mt-2 whitespace-nowrap truncate">
                      {org.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 12. CALL TO ACTION (CTA) */}
        <ScrollReveal delayMs={100}>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-600 via-saffron-700 to-saffron-900 text-white p-6 sm:p-10 md:p-14 text-center space-y-5 sm:space-y-6 shadow-xl">
            <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-saffron-200 font-semibold">
                Gieo Duyên Lành — Tinh Tấn Tu Học
              </span>
              <h2 className="font-heading text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                Cùng kết nối và xây dựng không gian Phật pháp tỉnh thức
              </h2>
              <p className="text-xs sm:text-sm text-saffron-100/90 leading-relaxed font-light">
                Đăng ký tài khoản để đánh dấu bài giảng yêu thích, theo dõi lộ trình học Phật cá nhân và trao đổi cùng các đạo hữu đồng tu trên khắp mọi miền.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/bai-viet" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-charcoal-900 hover:bg-saffron-50 shadow-lg font-semibold hover:scale-105 transition-transform">
                  Bắt đầu khám phá ngay
                </Button>
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
