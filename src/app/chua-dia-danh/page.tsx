'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Check,
  Navigation,
  X,
  Compass,
  Calendar,
} from 'lucide-react';
import {
  PagodaMinimalIcon,
  LotusMinimalIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  PAGODAS_DATA,
  PagodaItem,
  PagodaRegion,
  PagodaSect,
} from '@/data/pagodas';
import { useDharmaStore } from '@/store/useDharmaStore';
import { playOmTempleBellSound, playBeadTickSound } from '@/lib/buddhistSounds';
import { CenterToast } from '@/components/ui/CenterToast';
import { cn } from '@/lib/utils';

type RegionFilter = 'Tất cả' | PagodaRegion;
type SectFilter = 'Tất cả' | PagodaSect | 'Đã Chiêm Bái';

export default function PagodasDirectoryPage() {
  const { visitedPagodaSlugs, togglePagodaCheckin } = useDharmaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('Tất cả');
  const [sectFilter, setSectFilter] = useState<SectFilter>('Tất cả');
  const [selectedPagoda, setSelectedPagoda] = useState<PagodaItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const regionCounts = useMemo(() => {
    return {
      'Tất cả': PAGODAS_DATA.length,
      'Miền Bắc': PAGODAS_DATA.filter((p) => p.region === 'Miền Bắc').length,
      'Miền Trung': PAGODAS_DATA.filter((p) => p.region === 'Miền Trung').length,
      'Miền Nam': PAGODAS_DATA.filter((p) => p.region === 'Miền Nam').length,
    };
  }, []);

  const filteredPagodas = useMemo(() => {
    return PAGODAS_DATA.filter((p) => {
      if (regionFilter !== 'Tất cả' && p.region !== regionFilter) return false;
      if (sectFilter === 'Đã Chiêm Bái') {
        if (!visitedPagodaSlugs.includes(p.slug)) return false;
      } else if (sectFilter !== 'Tất cả' && p.sect !== sectFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.alternateName || '').toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.worshipFocus.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [regionFilter, sectFilter, searchQuery, visitedPagodaSlugs]);

  const handleToggleCheckin = (pagoda: PagodaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadyVisited = visitedPagodaSlugs.includes(pagoda.slug);
    togglePagodaCheckin(pagoda.slug, pagoda.name);
    if (!alreadyVisited) {
      playOmTempleBellSound(0.5);
      showToast(`Đã ghi dấu hành hương đảnh lễ tại ${pagoda.name}!`);
    } else {
      playBeadTickSound(0.3);
      showToast(`Đã bỏ dấu hành hương tại ${pagoda.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 space-y-6">
        {/* ===================================================================== */}
        {/* 1. HEADER & PILGRIMAGE TRACKER                                        */}
        {/* ===================================================================== */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#EAD7A7]">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF6DF] border border-[#DFC27D] flex items-center justify-center shrink-0 shadow-2xs">
              <PagodaMinimalIcon className="w-6 h-6 text-[#8C5500]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9EB] border border-[#DFC27D] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                  HÀNH HƯƠNG VIỆT NAM • 18 CỔ TỰ
                </span>
                <span className="text-xs text-[#6B533B]">
                  Bắc • Trung • Nam — Bắc Tông • Thiền Trúc Lâm • Nam Tông
                </span>
              </div>
              <h1 className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#2C1E10] mt-1">
                Bản Đồ Danh Lam Cổ Tự 3 Miền
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Pilgrimage Check-in Badge */}
            <div className="px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] flex items-center gap-2.5 shadow-2xs shrink-0">
              <Compass className="w-4 h-4 text-[#8C5500]" />
              <div className="text-xs">
                <span className="text-[#6B533B] block leading-none">Hành trình chiêm bái</span>
                <strong className="font-mono text-[#8C5500] text-sm">
                  {visitedPagodaSlugs.length} / {PAGODAS_DATA.length} danh lam
                </strong>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8C5500] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên chùa, tỉnh thành, hệ phái..."
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] focus:border-[#C68B19] text-xs text-[#2C1E10] placeholder-[#8E775B] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#6B533B] hover:text-[#2C1E10] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* 2. REGION & SECT FILTERS                                              */}
        {/* ===================================================================== */}
        <section className="space-y-3">
          {/* Regions Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {(['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'] as RegionFilter[]).map((reg) => {
              const active = regionFilter === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => {
                    playBeadTickSound(0.25);
                    setRegionFilter(reg);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0',
                    active
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border-[#C68B19] shadow-2xs'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                  )}
                >
                  {reg} ({regionCounts[reg]})
                </button>
              );
            })}
          </div>

          {/* Sects Row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {(['Tất cả', 'Bắc Tông', 'Thiền Trúc Lâm', 'Nam Tông', 'Đã Chiêm Bái'] as SectFilter[]).map(
                (sect) => {
                  const active = sectFilter === sect;
                  return (
                    <button
                      key={sect}
                      type="button"
                      onClick={() => {
                        playBeadTickSound(0.2);
                        setSectFilter(sect);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0',
                        active
                          ? 'bg-[#FFF6DF] text-[#8C5500] border-[#C68B19]'
                          : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B] hover:text-[#2C1E10]'
                      )}
                    >
                      {sect === 'Tất cả' ? 'Tất cả Hệ Phái' : sect}
                    </button>
                  );
                }
              )}
            </div>

            <Link
              href="/di-chua-online"
              className="px-3.5 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#DFC27D] text-[#8C5500] text-[11px] font-bold hover:bg-[#FCECC2] transition-colors whitespace-nowrap"
            >
              Vào Chánh Điện Trực Tuyến →
            </Link>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. PAGODAS GRID                                                       */}
        {/* ===================================================================== */}
        {filteredPagodas.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] text-center space-y-3">
            <LotusMinimalIcon className="w-8 h-8 text-[#8C5500] mx-auto opacity-80" />
            <h3 className="font-heading font-serif text-lg font-bold text-[#2C1E10]">
              Chưa tìm thấy danh lam phù hợp
            </h3>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('Tất cả');
                setSectFilter('Tất cả');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-xs font-bold text-[#2C1E10] border border-[#C68B19] cursor-pointer"
            >
              Xem toàn bộ 18 danh lam cổ tự
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPagodas.map((pagoda) => {
              const visited = visitedPagodaSlugs.includes(pagoda.slug);
              return (
                <article
                  key={pagoda.slug}
                  onClick={() => {
                    playBeadTickSound(0.25);
                    setSelectedPagoda(pagoda);
                  }}
                  className="group rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] overflow-hidden shadow-xs transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] bg-[#FFF9EB] overflow-hidden border-b border-[#EAD7A7]">
                      <img
                        src={pagoda.image}
                        alt={pagoda.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF]/95 text-[#8C5500] text-[10px] font-bold border border-[#DFC27D] shadow-2xs">
                          {pagoda.region}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#FFF9EB]/95 text-[#2C1E10] text-[10px] font-bold border border-[#EAD7A7] shadow-2xs">
                          {pagoda.sect}
                        </span>
                      </div>

                      {visited && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Đã Chiêm Bái</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#6B533B]">
                        <span className="flex items-center gap-1 font-bold text-[#2C1E10]">
                          <MapPin className="w-3.5 h-3.5 text-[#8C5500]" />
                          {pagoda.province}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#8C5500]">
                          {pagoda.foundingYear.split('(')[0].trim()}
                        </span>
                      </div>

                      <h2 className="font-heading font-serif font-bold text-lg text-[#2C1E10] group-hover:text-[#8C5500] transition-colors leading-snug">
                        {pagoda.name}
                      </h2>

                      <p className="text-xs text-[#6B533B] line-clamp-2 leading-relaxed">
                        {pagoda.shortDesc}
                      </p>

                      <div className="pt-1 text-[11px] text-[#8C5500] font-bold truncate">
                        Thờ phụng: {pagoda.worshipFocus}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3.5 bg-[#FFF9EB] border-t border-[#EAD7A7] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleCheckin(pagoda, e)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer',
                        visited
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-[#FFFFFF] border-[#DFC27D] text-[#8C5500] hover:bg-[#FFF6DF]'
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{visited ? 'Đã Đảnh Lễ' : 'Đảnh Lễ / Check-in'}</span>
                    </button>

                    <span className="text-xs font-bold text-[#8C5500] group-hover:translate-x-0.5 transition-transform">
                      Chi tiết →
                    </span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DETAIL MODAL FOR SELECTED PAGODA                                      */}
      {/* ===================================================================== */}
      {selectedPagoda && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPagoda(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-5 bg-black/50 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFDF8] border-2 border-[#C68B19] overflow-hidden shadow-2xl text-[#2C1E10]">
            <button
              type="button"
              onClick={() => setSelectedPagoda(null)}
              className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-[#FFFFFF]/90 border border-[#DFC27D] text-[#2C1E10] shadow-xs cursor-pointer"
              aria-label="Đóng chi tiết"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Hero Image */}
              <div className="relative aspect-[16/9] bg-[#FFF9EB] border-b border-[#EAD7A7]">
                <img
                  src={selectedPagoda.image}
                  alt={selectedPagoda.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FFFFFF]/95 border border-[#DFC27D] text-[11px] font-bold text-[#8C5500] shadow-2xs">
                    {selectedPagoda.region} • {selectedPagoda.province}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FFF9EB]/95 border border-[#EAD7A7] text-[#2C1E10] text-[11px] font-bold shadow-2xs">
                    Hệ phái: {selectedPagoda.sect}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-7 space-y-5">
                <div>
                  <h2 className="font-heading font-serif text-xl sm:text-2xl font-bold text-[#2C1E10]">
                    {selectedPagoda.name}
                  </h2>
                  {selectedPagoda.alternateName && (
                    <p className="text-xs font-bold text-[#8C5500] mt-0.5">
                      Tôn hiệu khác: {selectedPagoda.alternateName}
                    </p>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C5500] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Niên Đại Khởi Dựng
                    </span>
                    <p className="font-bold text-[#2C1E10]">{selectedPagoda.foundingYear}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C5500] flex items-center gap-1">
                      <LotusMinimalIcon className="w-3.5 h-3.5" /> Tôn Tượng Chính Điện
                    </span>
                    <p className="font-bold text-[#2C1E10]">{selectedPagoda.worshipFocus}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="p-3.5 rounded-2xl bg-[#FFF6DF] border border-[#DFC27D] flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[#8C5500] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Địa Chỉ Cổ Tự ({selectedPagoda.coordinates.lat.toFixed(4)},{' '}
                      {selectedPagoda.coordinates.lng.toFixed(4)})
                    </span>
                    <p className="text-[#2C1E10] font-medium">{selectedPagoda.address}</p>
                  </div>
                  <a
                    href={selectedPagoda.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19] font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>

                {/* History */}
                <div className="space-y-1.5">
                  <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
                    Lịch Sử Hình Thành &amp; Tâm Linh
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2C1E10] leading-relaxed">
                    {selectedPagoda.history}
                  </p>
                </div>

                {/* Architectural Highlights */}
                <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-2">
                  <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
                    Điểm Nhấn Kiến Trúc &amp; Di Sản
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#2C1E10] list-disc pl-5">
                    {selectedPagoda.architecturalHighlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="p-4 border-t border-[#EAD7A7] bg-[#FFFDF8] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <Link
                href={`/chua-dia-danh/${selectedPagoda.slug}`}
                className="px-4 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] hover:bg-[#FFF6DF]"
              >
                Mở Trang Riêng ↗
              </Link>

              <button
                type="button"
                onClick={() => handleToggleCheckin(selectedPagoda)}
                className={cn(
                  'flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs',
                  visitedPagodaSlugs.includes(selectedPagoda.slug)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]'
                )}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {visitedPagodaSlugs.includes(selectedPagoda.slug)
                    ? 'Đã Ghi Dấu Chiêm Bái'
                    : 'Đảnh Lễ & Ghi Dấu Hành Hương'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <CenterToast message={toastMsg} icon="sparkles" />
    </div>
  );
}
