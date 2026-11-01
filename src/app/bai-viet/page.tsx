import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Clock, Eye, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ 'chuyen-muc'?: string; q?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { 'chuyen-muc': categorySlug, q: searchQuery } = await searchParams;

  // 1. Fetch categories
  const categoriesRes = await query(
    'SELECT id, name, slug, description FROM article_categories ORDER BY sort_order ASC, name ASC'
  );
  const categories = categoriesRes.rows;

  // 2. Build articles query
  let sql = `
    SELECT a.id, a.title, a.slug, a.excerpt, a.cover_image, a.reading_time_minutes, a.view_count, a.published_at,
           c.name as category_name, c.slug as category_slug,
           p.full_name as author_name, p.dharma_name as author_dharma_name, p.avatar_url as author_avatar
    FROM articles a
    JOIN article_categories c ON a.category_id = c.id
    JOIN profiles p ON a.author_id = p.user_id
    WHERE a.status = 'PUBLISHED' AND a.deleted_at IS NULL
  `;
  const params: any[] = [];

  if (categorySlug) {
    params.push(categorySlug);
    sql += ` AND c.slug = $${params.length}`;
  }

  if (searchQuery) {
    params.push(`%${searchQuery}%`);
    sql += ` AND (a.title ILIKE $${params.length} OR a.excerpt ILIKE $${params.length})`;
  }

  sql += ' ORDER BY a.published_at DESC LIMIT 20';

  const articlesRes = await query(sql, params);
  const articles = articlesRes.rows;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 animate-pulse-glow flex-shrink-0" />
          <span>Thư viện Tri thức</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
          Bài Viết Phật Pháp
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed">
          Tập hợp những bài khảo luận, giảng giải giáo lý căn bản, phương pháp thiền tập và câu chuyện chuyển hóa tâm thức được chia sẻ bởi chư Tăng Ni và các tác giả Phật tử.
        </p>

        {/* Category Pills Filter — Horizontal Scroll on Mobile, Wrap on Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth pt-3 sm:pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <Link
            href="/bai-viet"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              !categorySlug
                ? 'bg-saffron-500 text-white shadow-sm'
                : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400'
            }`}
          >
            Tất cả
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/bai-viet?chuyen-muc=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                categorySlug === cat.slug
                  ? 'bg-saffron-500 text-white shadow-sm'
                  : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-saffron-400'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <ScrollReveal delayMs={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <Card key={article.id} className="flex flex-col justify-between overflow-hidden group hover-lift">
                <div>
                  <div className="relative aspect-[16/10] bg-ivory-100 overflow-hidden">
                    <img
                      src={article.cover_image || '/images/lotus_blooming.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="saffron">{article.category_name}</Badge>
                    </div>
                  </div>
                  <CardHeader className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-charcoal-400">
                      <span>{formatDate(article.published_at)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.reading_time_minutes} phút đọc
                      </span>
                    </div>
                    <Link href={`/bai-viet/${article.slug}`}>
                      <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h2>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </div>

                <CardFooter>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-[10px] font-semibold text-saffron-800">
                      {article.author_avatar ? (
                        <img src={article.author_avatar} alt={article.author_name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        article.author_name.charAt(0)
                      )}
                    </div>
                    <span className="text-xs text-charcoal-700 dark:text-charcoal-300">
                      {article.author_dharma_name || article.author_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-charcoal-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{article.view_count || 100}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      ) : (
        <EmptyState
          title="Chưa có bài viết nào"
          description="Hiện chưa có bài viết nào trong chuyên mục này. Quý đạo hữu vui lòng quay lại sau."
        />
      )}
    </div>
  );
}
