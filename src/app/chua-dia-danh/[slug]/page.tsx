import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { PAGODAS_DATA } from '@/data/pagodas';
import { MapPin, Phone, Globe, CheckCircle, Navigation, Calendar, Compass } from 'lucide-react';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const curated = PAGODAS_DATA.find((p) => p.slug === slug);
  if (curated) {
    return {
      title: `${curated.name} — Danh Lam Cổ Tự DHARMA`,
      description: curated.shortDesc,
    };
  }
  try {
    const res = await query('SELECT name, description FROM temples WHERE slug = $1', [slug]);
    const t = res.rows[0];
    if (t) {
      return {
        title: `${t.name} — DHARMA`,
        description: t.description?.slice(0, 160),
      };
    }
  } catch {}
  return { title: 'Danh Lam Cổ Tự — DHARMA' };
}

export default async function TempleDetailPage({ params }: Props) {
  const { slug } = await params;

  // 1. Check Curated 18 Vietnamese Pagodas first (Zero DB outage dependency)
  const curated = PAGODAS_DATA.find((p) => p.slug === slug);
  if (curated) {
    const related = PAGODAS_DATA.filter(
      (p) => p.region === curated.region && p.slug !== curated.slug
    ).slice(0, 3);

    return (
      <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
          <nav className="flex items-center gap-2 text-xs text-[#6B533B]">
            <Link href="/" className="hover:text-[#8C5500] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/chua-dia-danh" className="hover:text-[#8C5500] transition-colors">
              Danh Lam Cổ Tự
            </Link>
            <span>/</span>
            <span className="text-[#8C5500] font-bold truncate max-w-[240px]">
              {curated.name}
            </span>
          </nav>

          {/* Cover Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#EAD7A7] shadow-md">
            <img
              src={curated.image}
              alt={curated.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FFFFFF]/95 border border-[#DFC27D] text-xs font-bold text-[#8C5500] shadow-xs">
                {curated.region} • {curated.province}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFF9EB]/95 border border-[#EAD7A7] text-[#2C1E10] text-xs font-bold shadow-xs">
                Hệ phái: {curated.sect}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-xs space-y-6">
            <div>
              <h1 className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#2C1E10]">
                {curated.name}
              </h1>
              {curated.alternateName && (
                <p className="text-sm text-[#8C5500] font-bold mt-1">
                  Tôn hiệu khác: {curated.alternateName}
                </p>
              )}
              <p className="text-sm text-[#6B533B] mt-2 leading-relaxed">{curated.shortDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8C5500] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Niên Đại Khởi Dựng
                </span>
                <p className="font-bold text-[#2C1E10]">{curated.foundingYear}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8C5500] flex items-center gap-1">
                  <LotusMinimalIcon className="w-3.5 h-3.5" /> Tôn Tượng Chính
                </span>
                <p className="font-bold text-[#2C1E10]">{curated.worshipFocus}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8C5500] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> Tọa Độ GPS
                </span>
                <p className="font-mono font-bold text-[#2C1E10]">
                  {curated.coordinates.lat.toFixed(4)}, {curated.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF6DF] border border-[#DFC27D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#8C5500] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Địa Chỉ
                </span>
                <p className="text-sm font-medium text-[#2C1E10]">{curated.address}</p>
              </div>
              <a
                href={curated.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19] font-bold inline-flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Chỉ Đường Google Maps</span>
              </a>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-serif font-bold text-lg text-[#8C5500]">
                Lịch Sử &amp; Giá Trị Tâm Linh
              </h2>
              <p className="text-sm text-[#2C1E10] leading-relaxed">{curated.history}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-2.5">
              <h2 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                Điểm Nhấn Kiến Trúc &amp; Di Sản Văn Hóa
              </h2>
              <ul className="space-y-1.5 text-sm text-[#2C1E10] list-disc pl-5">
                {curated.architecturalHighlights.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nearby / Same Region Pagodas */}
          {related.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-heading font-serif font-bold text-lg text-[#8C5500]">
                Cổ Tự Khác Tại {curated.region}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/chua-dia-danh/${p.slug}`}
                    className="rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] overflow-hidden shadow-2xs transition-all"
                  >
                    <div className="aspect-[16/10] bg-[#FFF9EB] overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3.5">
                      <span className="text-[10px] font-bold text-[#8C5500] uppercase">
                        {p.province}
                      </span>
                      <h4 className="font-heading font-serif font-bold text-sm text-[#2C1E10] truncate mt-0.5">
                        {p.name}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // 2. Fallback to PostgreSQL custom record if present
  let temple: any = null;
  let nearby: any[] = [];
  try {
    const res = await query(
      `SELECT id, name, slug, category, tradition, abbot_name, address, province, district,
              latitude, longitude, cover_image, description, history, phone, website, is_verified
       FROM temples WHERE slug = $1`,
      [slug]
    );
    temple = res.rows[0];
    if (temple) {
      const nearbyRes = await query(
        `SELECT id, name, slug, category, tradition, province, district, cover_image
         FROM temples WHERE province = $1 AND id != $2 ORDER BY name ASC LIMIT 3`,
        [temple.province, temple.id]
      );
      nearby = nearbyRes.rows;
    }
  } catch {}

  if (!temple) notFound();

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-[#6B533B]">
          <Link href="/" className="hover:text-[#8C5500] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/chua-dia-danh" className="hover:text-[#8C5500] transition-colors">
            Danh Lam Cổ Tự
          </Link>
          <span>/</span>
          <span className="text-[#8C5500] font-bold truncate max-w-[240px]">{temple.name}</span>
        </nav>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E10]">
              {temple.name}
            </h1>
            {temple.is_verified && <CheckCircle className="w-5 h-5 text-emerald-600" />}
          </div>
          <p className="text-sm text-[#6B533B]">{temple.description}</p>
          <div className="text-xs text-[#6B533B] space-y-1">
            {temple.address && (
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8C5500]" /> {temple.address}
              </p>
            )}
            {temple.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8C5500]" /> {temple.phone}
              </p>
            )}
            {temple.website && (
              <p className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8C5500]" /> {temple.website}
              </p>
            )}
          </div>
          {nearby.length > 0 && (
            <div className="pt-4 border-t border-[#EAD7A7]">
              <p className="text-xs font-bold text-[#8C5500] mb-2">Chùa cùng tỉnh thành:</p>
              <div className="flex flex-wrap gap-2">
                {nearby.map((n: any) => (
                  <Link
                    key={n.id}
                    href={`/chua-dia-danh/${n.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF9EB] border border-[#EAD7A7] text-xs font-semibold text-[#2C1E10]"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
