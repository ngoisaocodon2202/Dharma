import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { MapPin, Calendar, BookOpen, Headphones, User, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const res = await query(
    `SELECT p.full_name, p.dharma_name FROM profiles p
     JOIN users u ON p.user_id = u.id
     WHERE u.email = $1 OR p.full_name ILIKE $1`,
    [username]
  );
  const profile = res.rows[0];
  if (!profile) return { title: 'Hồ sơ không tồn tại — Phật Pháp' };
  const name = profile.dharma_name ? `Thầy ${profile.dharma_name}` : profile.full_name;
  return { title: `${name} — Phật Pháp` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  // Find user by slug-style username (full_name encoded) or dharma_name
  const userRes = await query(
    `SELECT u.id, u.email, u.role_id, u.created_at as joined_at,
            p.full_name, p.dharma_name, p.avatar_url, p.cover_url, p.bio, p.province, p.is_public
     FROM users u
     JOIN profiles p ON u.id = p.user_id
     WHERE u.is_active = true AND u.deleted_at IS NULL
       AND (LOWER(REPLACE(p.full_name, ' ', '-')) = $1
         OR LOWER(p.dharma_name) = $1
         OR u.id::text = $1)`,
    [username.toLowerCase()]
  );

  const profile = userRes.rows[0];
  if (!profile) notFound();

  if (!profile.is_public) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-3">
        <User className="w-12 h-12 text-charcoal-300 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-charcoal-700 dark:text-charcoal-300">
          Hồ sơ này được đặt ở chế độ riêng tư
        </h2>
        <p className="text-sm text-charcoal-500">Đạo hữu này chưa công khai trang hồ sơ.</p>
      </div>
    );
  }

  // Fetch user's published articles
  const articlesRes = await query(
    `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_image, a.reading_time_minutes, a.published_at, a.view_count,
            c.name as category_name
     FROM articles a
     JOIN article_categories c ON a.category_id = c.id
     WHERE a.author_id = $1 AND a.status = 'PUBLISHED' AND a.deleted_at IS NULL
     ORDER BY a.published_at DESC LIMIT 6`,
    [profile.id]
  );
  const articles = articlesRes.rows;

  // Fetch bookmarked articles
  const bookmarksRes = await query(
    `SELECT a.id, a.title, a.slug, a.cover_image, a.reading_time_minutes,
            c.name as category_name
     FROM bookmarks b
     JOIN articles a ON b.entity_id = a.id
     JOIN article_categories c ON a.category_id = c.id
     WHERE b.user_id = $1 AND b.entity_type = 'ARTICLE' AND a.deleted_at IS NULL
     ORDER BY b.created_at DESC LIMIT 4`,
    [profile.id]
  );
  const bookmarks = bookmarksRes.rows;

  const displayName = profile.dharma_name ? `Thầy ${profile.dharma_name}` : profile.full_name;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-saffron-100 to-jade-100 dark:from-saffron-950/40 dark:to-jade-950/40">
          {profile.cover_url && (
            <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute -bottom-8 left-6">
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-charcoal-900 bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center text-2xl font-bold text-saffron-700 overflow-hidden shadow-md">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              profile.full_name.charAt(0)
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-10 space-y-2">
        <h1 className="font-heading text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
          {displayName}
        </h1>
        {profile.dharma_name && (
          <p className="text-sm text-charcoal-500">Pháp danh: {profile.dharma_name}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-charcoal-500">
          {profile.province && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-lotus-500" /> {profile.province}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-jade-500" /> Tham gia {formatDate(profile.joined_at)}
          </span>
          <Badge variant="jade" size="sm">{articles.length} bài viết</Badge>
        </div>
        {profile.bio && (
          <p className="text-sm text-charcoal-600 dark:text-charcoal-400 leading-relaxed max-w-2xl pt-2">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Published Articles */}
      {articles.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-saffron-500" /> Bài viết đã đăng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a: any) => (
              <Card key={a.id} className="group overflow-hidden hover-lift">
                <div className="aspect-[16/10] overflow-hidden bg-ivory-100">
                  <img
                    src={a.cover_image || 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=500&auto=format&fit=crop&q=80'}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="space-y-1">
                  <Badge variant="saffron" size="sm">{a.category_name}</Badge>
                  <Link href={`/bai-viet/${a.slug}`}>
                    <h3 className="font-heading text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 hover:text-saffron-600 transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-[11px] text-charcoal-400">
                    <Clock className="w-3 h-3" /> {a.reading_time_minutes} phút
                    <span>•</span>
                    {formatDate(a.published_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-jade-500" /> Bài đã lưu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((b: any) => (
              <Link
                key={b.id}
                href={`/bai-viet/${b.slug}`}
                className="flex items-center gap-3 p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400 transition-all group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0">
                  <img
                    src={b.cover_image || 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=200&auto=format&fit=crop&q=80'}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-saffron-600 dark:text-saffron-400 font-medium">{b.category_name}</p>
                  <h4 className="text-sm font-semibold text-charcoal-900 dark:text-charcoal-100 group-hover:text-saffron-600 transition-colors line-clamp-2">
                    {b.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && bookmarks.length === 0 && (
        <div className="text-center py-16 text-charcoal-400 space-y-2">
          <User className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm">Đạo hữu này chưa có hoạt động công khai.</p>
        </div>
      )}
    </div>
  );
}
