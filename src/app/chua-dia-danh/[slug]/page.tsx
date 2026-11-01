import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { BookmarkButton } from '@/components/article/BookmarkButton';
import { MapPin, Phone, Globe, CheckCircle, Navigation } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await query('SELECT name, description FROM temples WHERE slug = $1', [slug]);
  const t = res.rows[0];
  if (!t) return { title: 'Không tìm thấy — Phật Pháp' };
  return {
    title: `${t.name} — Phật Pháp`,
    description: t.description?.slice(0, 160),
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  CHUA: 'Chùa',
  THIEN_VIEN: 'Thiền viện',
  TINH_XA: 'Tịnh xá',
  TU_VIEN: 'Tu viện',
  DI_TICH: 'Di tích',
};

export default async function TempleDetailPage({ params }: Props) {
  const { slug } = await params;

  const res = await query(
    `SELECT id, name, slug, category, tradition, abbot_name, address, province, district,
            latitude, longitude, cover_image, description, history, phone, website, is_verified
     FROM temples WHERE slug = $1`,
    [slug]
  );
  const temple = res.rows[0];
  if (!temple) notFound();

  // Nearby temples (same province, different temple)
  const nearbyRes = await query(
    `SELECT id, name, slug, cover_image, category, province, is_verified
     FROM temples
     WHERE province = $1 AND id != $2
     ORDER BY is_verified DESC, name ASC LIMIT 4`,
    [temple.province, temple.id]
  );
  const nearby = nearbyRes.rows;

  const hasCoords = temple.latitude && temple.longitude;
  const mapsUrl = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${temple.latitude}&mlon=${temple.longitude}&zoom=16`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(temple.address)}`;

  const categoryLabel = CATEGORY_LABELS[temple.category] || temple.category;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400">
        <Link href="/" className="hover:text-saffron-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/chua-dia-danh" className="hover:text-saffron-600 transition-colors">Chùa & Địa danh</Link>
        <span>/</span>
        <span className="text-charcoal-700 dark:text-charcoal-300 truncate max-w-[200px]">{temple.name}</span>
      </nav>

      {/* Cover Image */}
      <div className="relative aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-ivory-100 shadow-md group">
        <img
          src={temple.cover_image || 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&auto=format&fit=crop&q=85'}
          alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-mono font-medium text-white flex items-center gap-1.5 shadow-sm whitespace-nowrap">
          <span className="text-saffron-400">✦</span> Ảnh Danh Lam Cổ Tự
        </div>
        {temple.is_verified && (
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-jade-700 dark:text-jade-300 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
            <CheckCircle className="w-4 h-4 text-jade-600" /> Đã xác minh
          </div>
        )}
        <a
          href={temple.cover_image}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-white/90 dark:bg-charcoal-900/90 hover:bg-white text-charcoal-800 dark:text-charcoal-200 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-xs shadow-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 whitespace-nowrap"
        >
          Mở ảnh toàn màn hình ↗
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="lotus">{categoryLabel}</Badge>
              {temple.tradition && <Badge variant="jade">{temple.tradition}</Badge>}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
              {temple.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-charcoal-500">
              <MapPin className="w-4 h-4 text-lotus-500 flex-shrink-0" />
              {temple.district ? `${temple.district}, ` : ''}{temple.province}
            </div>
          </div>

          {/* Description */}
          <div className="prose-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed space-y-3">
            <p>{temple.description}</p>
          </div>

          {/* History */}
          {temple.history && (
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                Lịch sử
              </h2>
              <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
                {temple.history}
              </p>
            </div>
          )}

          {/* Map embed via iframe (OpenStreetMap — no API key needed) */}
          {hasCoords && (
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-jade-500" /> Vị trí trên bản đồ
              </h2>
              <div className="rounded-xl overflow-hidden border border-ivory-200 dark:border-charcoal-700 shadow-sm">
                <iframe
                  title={`Bản đồ ${temple.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${temple.longitude - 0.01},${temple.latitude - 0.01},${temple.longitude + 0.01},${temple.latitude + 0.01}&layer=mapnik&marker=${temple.latitude},${temple.longitude}`}
                  width="100%"
                  height="320"
                  className="border-0"
                  loading="lazy"
                />
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-jade-600 dark:text-jade-400 hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" /> Xem bản đồ lớn hơn
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-5 space-y-4 shadow-sm">
            <h3 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-100">
              Thông tin liên hệ
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-charcoal-600 dark:text-charcoal-400">
                <MapPin className="w-4 h-4 text-lotus-500 flex-shrink-0 mt-0.5" />
                <span>{temple.address}</span>
              </div>

              {temple.abbot_name && (
                <div className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-400">
                  <span className="w-4 h-4 flex-shrink-0 text-center text-saffron-500">☸</span>
                  <span>Trụ trì: {temple.abbot_name}</span>
                </div>
              )}

              {temple.phone && (
                <a
                  href={`tel:${temple.phone}`}
                  className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-400 hover:text-saffron-600 transition-colors"
                >
                  <Phone className="w-4 h-4 text-jade-500 flex-shrink-0" />
                  <span>{temple.phone}</span>
                </a>
              )}

              {temple.website && (
                <a
                  href={temple.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-400 hover:text-saffron-600 transition-colors"
                >
                  <Globe className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  <span className="truncate">{temple.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>

            <div className="pt-2 border-t border-ivory-100 dark:border-charcoal-700 flex gap-2">
              <BookmarkButton entityType="TEMPLE" entityId={temple.id} className="flex-1 justify-center" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950/30 text-jade-700 dark:text-jade-400 px-3 py-1.5 text-xs font-medium hover:bg-jade-100 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" /> Chỉ đường
              </a>
            </div>
          </div>

          {/* Nearby temples */}
          {nearby.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-bold text-charcoal-700 dark:text-charcoal-300">
                Chùa lân cận tại {temple.province}
              </h3>
              <div className="space-y-2">
                {nearby.map((t: any) => (
                  <Link
                    key={t.id}
                    href={`/chua-dia-danh/${t.slug}`}
                    className="flex items-center gap-3 p-2.5 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700 hover:border-lotus-400 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0">
                      <img
                        src={t.cover_image || 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=120&auto=format&fit=crop&q=80'}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100 group-hover:text-lotus-600 transition-colors truncate">
                        {t.name}
                      </p>
                      {t.is_verified && (
                        <span className="text-[10px] text-jade-600 dark:text-jade-400 flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Xác minh
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
