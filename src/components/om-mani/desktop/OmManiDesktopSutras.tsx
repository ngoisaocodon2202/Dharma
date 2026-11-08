'use client';

import React from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  Share2,
  ChevronRight,
  Filter,
  Sparkles,
  Heart,
  Flame,
  Volume2,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound, playPageTurnSound } from '@/lib/buddhistSounds';
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
  showToast: (msg: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tất cả kinh điển', count: '8 bộ kinh' },
  { id: 'bac-tong', label: 'Kinh điển Bắc Tông (Đại Thừa)', count: '4 bộ kinh' },
  { id: 'nam-tong', label: 'Kinh điển Nam Tông (Nguyên Thủy)', count: '4 bộ kinh' },
  { id: 'mat-tong', label: 'Mật Tông & Thần Chú', count: 'Tuyển tập' },
];

export function OmManiDesktopSutras({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredSutras,
  onOpenSutra,
  onOpenPrayerModal,
  showToast,
}: OmManiDesktopSutrasProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH BAR                                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1F140D] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#FFE082]" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-serif text-2xl font-black text-white flex items-center gap-2.5">
              <span>Kho Tàng Kinh Điển &amp; Pháp Bảo</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Kinh văn đối chiếu, dịch nghĩa trang nghiêm, trợ duyên cho việc đọc tụng và chiêm nghiệm mỗi ngày
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài kinh, thần chú..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#1C140E] border border-amber-500/30 focus:border-amber-400 text-xs text-white placeholder-stone-500 outline-none transition-all shadow-md"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-stone-400 hover:text-white text-xs absolute right-3 top-1/2 -translate-y-1/2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN LAYOUT: 3 COLS SIDEBAR & 9 COLS SUTRA CARDS GRID            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (3 cols) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Tradition Categories List */}
          <div className="p-5 rounded-3xl bg-[#18110B] border border-amber-500/25 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-2 border-b border-amber-500/15">
              Tông Phái &amp; Truyền Thừa
            </h3>

            <div className="space-y-1 pt-1">
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
                      'w-full p-3 rounded-2xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer',
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                        : 'text-stone-300 hover:text-white hover:bg-[#22160F]'
                    )}
                  >
                    <span>{cat.label}</span>
                    <span className={cn('text-[10px] font-mono', isActive ? 'text-amber-200' : 'text-stone-500')}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Prayer Highlight Card */}
          <div
            onClick={onOpenPrayerModal}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#27170E] via-[#20130B] to-[#170E09] border border-amber-500/35 shadow-xl hover:border-amber-400 cursor-pointer transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Nghi Thức Hôm Nay
              </span>
              <span className="text-sm">🌸</span>
            </div>

            <div>
              <h4 className="font-heading font-serif font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                Bài Khấn Nguyện Sớm Mai
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Vía Dược Sư Lưu Ly Quang Vương Như Lai Thành Đạo
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>Đọc bài khấn →</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Practice Advice Box */}
          <div className="p-4 rounded-2xl bg-[#140E0A] border border-white/5 space-y-2 text-xs text-stone-400 leading-relaxed">
            <h5 className="font-bold text-amber-200">Khai Kinh Kệ:</h5>
            <p className="font-serif italic text-amber-100/80">
              &ldquo;Phật pháp rộng sâu rất nhiệm mầu,<br />
              Trăm nghìn muôn kiếp khó tìm cầu.<br />
              Con nay nghe thấy chuyên trì tụng,<br />
              Nguyện hiểu Như Lai nghĩa nhiệm mầu.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Content: Sutra Cards Grid (9 cols) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-stone-400">
            <span>
              Hiển thị <strong className="text-white">{filteredSutras.length}</strong> bài kinh
              {searchQuery && ` khớp với "${searchQuery}"`}
            </span>
            <span className="text-stone-500 font-mono text-[11px]">
              Tất cả bản kinh đã được hiệu đính chuẩn xác
            </span>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSutras.map((sutra) => (
              <div
                key={sutra.id}
                onClick={() => {
                  playPageTurnSound(0.3);
                  onOpenSutra(sutra);
                }}
                className="group rounded-3xl bg-[#18110B] border border-amber-500/20 hover:border-amber-400/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Tag & Verses count */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25 font-bold">
                      {sutra.categoryLabel}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {sutra.versesCount ? `${sutra.versesCount} câu kệ` : 'Trọn bộ'}
                    </span>
                  </div>

                  {/* Red Cherry Blossom Thumbnail & Title */}
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-amber-500/30 bg-gradient-to-tr from-[#50130C] via-[#7B1D11] to-[#3B0C06] p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-xl border border-amber-400/30 flex items-center justify-center">
                        <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-serif font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors leading-snug">
                        {sutra.title}
                      </h3>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                    {sutra.excerpt}
                  </p>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-stone-400 group-hover:text-amber-200 transition-colors font-medium">
                    Đọc kinh nghiệm văn →
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#20150E] group-hover:bg-amber-500 text-stone-400 group-hover:text-charcoal-950 flex items-center justify-center transition-all">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSutras.length === 0 && (
            <div className="p-12 rounded-3xl bg-[#18110B] border border-white/5 text-center space-y-3">
              <span className="text-3xl">🔍</span>
              <h4 className="font-heading font-bold text-base text-white">
                Không tìm thấy bài kinh phù hợp
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Không có bài kinh nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;. Hãy thử tìm với từ khóa khác như &ldquo;Pháp Cú&rdquo;, &ldquo;Bát Nhã&rdquo;, &ldquo;Đại Bi&rdquo;...
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold"
              >
                Xem tất cả bài kinh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

