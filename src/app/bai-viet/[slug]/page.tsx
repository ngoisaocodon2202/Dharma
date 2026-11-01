import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Clock, Share2 } from 'lucide-react';
import { BookmarkButton } from '@/components/article/BookmarkButton';
import { CommentSection } from '@/components/article/CommentSection';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await query('SELECT title, excerpt, cover_image FROM articles WHERE slug = $1', [slug]);
  const article = res.rows[0];
  if (!article) return { title: 'Bài viết không tìm thấy — Phật Pháp' };
  return {
    title: `${article.title} — Phật Pháp`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      type: 'article',
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const res = await query(
    `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.cover_image,
            a.reading_time_minutes, a.view_count, a.published_at,
            c.name as category_name, c.slug as category_slug,
            p.full_name as author_name, p.dharma_name as author_dharma_name,
            p.avatar_url as author_avatar, p.bio as author_bio
     FROM articles a
     JOIN article_categories c ON a.category_id = c.id
     JOIN profiles p ON a.author_id = p.user_id
     WHERE a.slug = $1 AND a.status = 'PUBLISHED' AND a.deleted_at IS NULL`,
    [slug]
  );

  const article = res.rows[0];
  if (!article) notFound();

  // Increment view count asynchronously (fire & forget)
  query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [article.id]).catch(() => {});

  // Related articles
  const relatedRes = await query(
    `SELECT a.id, a.title, a.slug, a.cover_image, a.reading_time_minutes, a.published_at,
            c.name as category_name
     FROM articles a
     JOIN article_categories c ON a.category_id = c.id
     WHERE a.id != $1 AND a.status = 'PUBLISHED' AND a.deleted_at IS NULL
     ORDER BY a.published_at DESC LIMIT 3`,
    [article.id]
  );
  const related = relatedRes.rows;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image,
    datePublished: article.published_at,
    author: {
      '@type': 'Person',
      name: article.author_dharma_name || article.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Phật Pháp',
    },
  };

  const displayAuthor = article.author_dharma_name
    ? `Thầy ${article.author_dharma_name}`
    : article.author_name;

  return (
    <article className="py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          <Link href="/" className="hover:text-saffron-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/bai-viet" className="hover:text-saffron-600 transition-colors">Bài viết</Link>
          <span>/</span>
          <span className="text-charcoal-700 dark:text-charcoal-300 truncate max-w-[200px]">
            {article.category_name}
          </span>
        </nav>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="saffron">{article.category_name}</Badge>
          <span className="text-xs text-charcoal-400">•</span>
          <span className="text-xs text-charcoal-500">{formatDate(article.published_at)}</span>
          <span className="text-xs text-charcoal-400">•</span>
          <span className="text-xs text-charcoal-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.reading_time_minutes} phút đọc
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
          {article.title}
        </h1>

        {/* Lead */}
        <p className="text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 font-light leading-relaxed border-l-2 border-saffron-500 pl-3.5 sm:pl-4 py-1 italic">
          {article.excerpt}
        </p>

        {/* Author + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 py-3.5 sm:py-4 border-y border-ivory-200 dark:border-charcoal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center font-semibold text-saffron-700 overflow-hidden flex-shrink-0">
              {article.author_avatar ? (
                <img src={article.author_avatar} alt={article.author_name} className="w-full h-full object-cover" />
              ) : (
                article.author_name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-900 dark:text-charcoal-100">{displayAuthor}</p>
              <p className="text-xs text-charcoal-500">Tác giả bài giảng</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkButton entityType="ARTICLE" entityId={article.id} />
            <button
              onClick={undefined}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ivory-300 dark:border-charcoal-600 bg-white/70 dark:bg-charcoal-800/70 text-charcoal-700 dark:text-charcoal-300 px-3 py-1.5 text-xs font-medium hover:border-saffron-400 hover:text-saffron-700 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" /> Chia sẻ
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="editorial-content whitespace-pre-line text-charcoal-800 dark:text-charcoal-200 leading-relaxed text-lg">
          {article.content}
        </div>

        {/* Author Bio */}
        <div className="mt-14 p-6 bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center font-bold text-saffron-700 text-lg flex-shrink-0 overflow-hidden">
            {article.author_avatar ? (
              <img src={article.author_avatar} alt={article.author_name} className="w-full h-full object-cover" />
            ) : (
              article.author_name.charAt(0)
            )}
          </div>
          <div className="space-y-1">
            <h4 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-100">
              {displayAuthor}
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
              {article.author_bio || 'Tác giả chia sẻ giáo lý Phật pháp và thực hành chánh niệm tại nền tảng Phật Pháp.'}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-14">
          <CommentSection articleSlug={slug} />
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 border-t border-ivory-200 dark:border-charcoal-800 space-y-6">
          <h3 className="font-heading text-xl font-bold text-charcoal-900 dark:text-charcoal-100">
            Bài viết cùng chủ đề
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item: any) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-ivory-100 mb-3">
                  <img
                    src={item.cover_image || '/images/lotus_blooming.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-[11px] text-saffron-700 dark:text-saffron-400 font-medium mb-1">
                  {item.category_name}
                </div>
                <Link href={`/bai-viet/${item.slug}`}>
                  <h4 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 line-clamp-2 hover:text-saffron-600 transition-colors">
                    {item.title}
                  </h4>
                </Link>
                <p className="text-[11px] text-charcoal-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.reading_time_minutes} phút
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
