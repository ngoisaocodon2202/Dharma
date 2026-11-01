import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { MapPin, Search, Building, Filter } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { TempleGalleryView } from '@/components/temple/TempleGalleryView';

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ tinh?: string; 'the-loai'?: string; q?: string }>;
}

export default async function TemplesPage({ searchParams }: Props) {
  const { tinh: provinceFilter, 'the-loai': typeFilter, q: searchQuery } = await searchParams;

  let sql = `SELECT id, name, slug, category, tradition, abbot_name, address, province, district,
                    latitude, longitude, cover_image, description, is_verified
             FROM temples WHERE 1=1`;
  const params: any[] = [];

  if (provinceFilter) {
    params.push(provinceFilter);
    sql += ` AND province = $${params.length}`;
  }

  if (typeFilter) {
    params.push(typeFilter);
    sql += ` AND category = $${params.length}`;
  }

  if (searchQuery) {
    params.push(`%${searchQuery}%`);
    sql += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }

  sql += ' ORDER BY is_verified DESC, name ASC';

  const [templesRes, provincesRes] = await Promise.all([
    query(sql, params),
    query('SELECT DISTINCT province FROM temples ORDER BY province ASC'),
  ]);

  const temples = templesRes.rows;
  const provinces = provincesRes.rows.map((r: any) => r.province);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-4 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-lotus-700 dark:text-lotus-400 font-semibold uppercase tracking-wider">
          <MapPin className="w-4 h-4 animate-pulse-glow flex-shrink-0" />
          <span>Danh lam Cổ tự & Thánh tích Trang Nghiêm</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
              Chùa & Địa Danh Phật Giáo
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed mt-1">
              Khám phá những ngôi cổ tự nghìn năm, thiền viện thanh tịnh và thánh tích mầu nhiệm với hình ảnh thực tế chất lượng cao thanh tịnh.
            </p>
          </div>

          {/* Quick Search Input */}
          <form method="GET" action="/chua-dia-danh" className="relative w-full md:w-72 flex-shrink-0">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ''}
              placeholder="Tìm tên chùa, địa chỉ..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:ring-2 focus:ring-lotus-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Province Filter Pills (Horizontal scrolling container without line breaking on mobile) */}
        <div className="pt-2">
          <div className="text-[11px] font-medium text-charcoal-500 dark:text-charcoal-400 mb-2 whitespace-nowrap">
            Lọc theo Tỉnh / Thành phố:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            <Link
              href="/chua-dia-danh"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                !provinceFilter
                  ? 'bg-lotus-600 text-white shadow-xs'
                  : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-lotus-400'
              }`}
            >
              Tất cả tỉnh thành ({provinces.length})
            </Link>
            {provinces.map((p: string) => (
              <Link
                key={p}
                href={`/chua-dia-danh?tinh=${encodeURIComponent(p)}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  provinceFilter === p
                    ? 'bg-lotus-600 text-white shadow-xs'
                    : 'bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:border-lotus-400'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Grid / Gallery Lightbox) */}
      {temples.length > 0 ? (
        <TempleGalleryView temples={temples} />
      ) : (
        <EmptyState
          title="Không tìm thấy chùa hoặc địa danh"
          description="Hiện chưa có dữ liệu tự viện tại địa phương đã chọn. Quý đạo hữu hãy thử tìm kiếm tỉnh thành khác hoặc xóa bộ lọc."
        />
      )}
    </div>
  );
}
