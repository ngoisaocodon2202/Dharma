'use client';

import React from 'react';
import {
  Search,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  SutraScrollIcon,
  DharmaWheelIcon,
  LotusMinimalIcon,
  WoodenFishMinimalIcon,
  TempleBellIcon,
  BodhiLeafIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { playPageTurnSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';
import { SutraItem } from '@/app/thu-vien/page';

export interface OmManiDesktopSutrasProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredSutras: SutraItem[];
  onOpenSutra: (sutra: SutraItem) => void;
  onOpenPrayerModal: () => void;
  sutraChantCounts: Record<string, number>;
  showToast: (msg: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Toàn Bộ Kinh Tạng', count: '8 bản kinh' },
  { id: 'nam-tong', label: 'Kinh Nguyên Thủy (Nikāya)', count: '4 bản kinh' },
  { id: 'bac-tong', label: 'Kinh Điển Đại Thừa', count: '4 bản kinh' },
  { id: 'mat-tong', label: 'Nghi Thức & Chơn Ngôn', count: 'Nhật tụng' },
];

export function OmManiDesktopSutras({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredSutras,
  onOpenSutra,
  onOpenPrayerModal,
  sutraChantCounts,
}: OmManiDesktopSutrasProps) {
  const totalChantedCount = Object.values(sutraChantCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH BAR                                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EEDBBA]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <SutraScrollIcon className="w-6 h-6 text-[#8C5500]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                DHARMA TRIPITAKA
              </span>
              <span className="text-xs text-[#7D6442]">
                Trình Tụng Kinh Tự Động Cuộn Chữ &amp; Mõ Giữ Nhịp
              </span>
            </div>
            <h1 className="font-heading font-serif text-2xl font-bold text-[#2E1E0F] mt-1">
              Tam Tạng Kinh Điển &amp; Nghi Thức Trì Tụng
            </h1>
          </div>
        </div>

        {/* Right: Total Chanted Counter + Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#EEDBBA] flex items-center gap-2 text-xs">
            <BodhiLeafIcon className="w-4 h-4 text-[#8C5500]" />
            <span className="text-[#6A5234]">Tổng số biến đã tụng:</span>
            <strong className="font-mono text-[#8C5500]">{totalChantedCount} biến</strong>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7D6442] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài kinh, phẩm kinh, kệ..."
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white border border-[#EEDBBA] focus:border-[#E5C158] text-xs text-[#2E1E0F] placeholder-[#C7B68B]/60 outline-none transition-all shadow-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#7D6442] hover:text-[#2E1E0F] text-xs absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN LAYOUT: 3 COLS SIDEBAR & 9 COLS SUTRA CARDS GRID            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (3 cols) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Tradition Categories List */}
          <div className="p-5 rounded-3xl bg-white border border-[#EEDBBA] shadow-xl space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] pb-2 border-b border-[#EEDBBA] flex items-center gap-2">
              <DharmaWheelIcon className="w-4 h-4" />
              <span>Hệ Phái Kinh Tạng</span>
            </h3>

            <div className="space-y-1.5 pt-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playPageTurnSound(0.2);
                      setSelectedCategory(cat.id);
                    }}
                    className={cn(
                      'w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer',
                      isActive
                        ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-md'
                        : 'text-[#6A5234] hover:text-[#2E1E0F] hover:bg-[#FFF9EA]'
                    )}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        'text-[10px] font-mono',
                        isActive ? 'text-[#3D2505] font-bold' : 'text-[#7D6442]'
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Ritual Highlight Card */}
          <div
            onClick={onOpenPrayerModal}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] shadow-xl hover:border-[#E5C158] cursor-pointer transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500] border border-[#EEDBBA]">
                Nghi Thức Hôm Nay
              </span>
              <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
            </div>

            <div>
              <h4 className="font-heading font-serif font-bold text-sm text-[#2E1E0F] group-hover:text-[#8C5500] transition-colors">
                Nghi Thức Khấn Nguyện &amp; Chú Dược Sư
              </h4>
              <p className="text-xs text-[#5A4329] mt-1 leading-relaxed">
                Kính lễ Vía Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai (30/09 Âm lịch)
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-[#8C5500] font-bold">
              <span>Mở Nghi Thức Trì Tụng →</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Khai Kinh Kệ Box */}
          <div className="p-4 rounded-2xl bg-white border border-[#EEDBBA] space-y-2 text-xs leading-relaxed">
            <h5 className="font-bold text-[#8C5500] flex items-center gap-1.5">
              <TempleBellIcon className="w-3.5 h-3.5" />
              <span>Kệ Khai Kinh:</span>
            </h5>
            <p className="font-serif italic text-[#5A4329]">
              “Phật pháp rộng sâu rất nhiệm mầu,<br />
              Trăm nghìn muôn kiếp khó tìm cầu.<br />
              Con nay nghe thấy chuyên trì tụng,<br />
              Nguyện hiểu Như Lai nghĩa nhiệm mầu.”
            </p>
          </div>
        </div>

        {/* Right Content: Sutra Cards Grid (9 cols) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2E5C7] text-xs text-[#6A5234]">
            <span>
              Hiển thị <strong className="text-[#8C5500]">{filteredSutras.length}</strong> bản kinh trong Tam Tạng
              {searchQuery && ` khớp với "${searchQuery}"`}
            </span>
            <span className="text-[#8C5500] font-mono text-[11px] flex items-center gap-1.5">
              <WoodenFishMinimalIcon className="w-3.5 h-3.5" />
              <span>Hỗ trợ Cuộn Kinh Tự Động &amp; Mõ Đều Nhịp</span>
            </span>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSutras.map((sutra) => {
              const chantCount = sutraChantCounts[sutra.id] || 0;
              return (
                <div
                  key={sutra.id}
                  onClick={() => {
                    playPageTurnSound(0.3);
                    onOpenSutra(sutra);
                  }}
                  className="group rounded-3xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Tag & Chanted count */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500] border border-[#EEDBBA] font-bold">
                        {sutra.categoryLabel}
                      </span>
                      <span className="text-[11px] text-[#6A5234] font-mono">
                        {chantCount > 0 ? (
                          <strong className="text-emerald-400">Đã tụng {chantCount} biến</strong>
                        ) : (
                          `${sutra.versesCount || 18} câu kệ`
                        )}
                      </span>
                    </div>

                    {/* Buddhist Thumbnail & Title */}
                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-[#ECD9A8] bg-white relative shadow-md">
                        <img
                          src={sutra.image}
                          alt={sutra.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-serif font-bold text-sm sm:text-base text-[#2E1E0F] group-hover:text-[#8C5500] transition-colors leading-snug">
                          {sutra.title}
                        </h3>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-[#5A4329]/90 line-clamp-3 leading-relaxed">
                      {sutra.excerpt}
                    </p>
                  </div>

                  {/* Bottom Card Action */}
                  <div className="pt-3 border-t border-[#F2E5C7] flex items-center justify-between text-xs">
                    <span className="text-[#8C5500] font-bold">
                      Khai kinh trì tụng →
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#EEDBBA] group-hover:bg-[#F5C542] text-[#8C5500] group-hover:text-[#3D2505] flex items-center justify-center transition-all">
                      <SutraScrollIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
