'use client';

import React from 'react';
import Link from 'next/link';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Heart, Bell, ExternalLink, Sparkles, Compass } from 'lucide-react';
import { playGrandTempleBellSound } from '@/lib/buddhistSounds';

export function OmManiDesktopFooter() {
  const handleRingBell = () => {
    playGrandTempleBellSound(0.5);
  };

  return (
    <footer className="hidden lg:block w-full bg-[#0D0907] border-t border-amber-500/20 text-stone-300 pt-16 pb-12 transition-colors relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Top bar: Brand + Sanskrit Verse + Quick Bell */}
        <div className="flex items-center justify-between pb-10 border-b border-amber-500/15">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5B548] via-[#FFE082] to-[#B38328] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#18110B] flex items-center justify-center">
                <BuddhaBodhiIcon className="w-6 h-6 text-[#FFE082]" />
              </div>
            </div>
            <div>
              <div className="font-heading font-serif font-black text-xl tracking-wider text-white flex items-center gap-2">
                <span>OM MANI</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Phật Giáo Việt Nam
                </span>
              </div>
              <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
                ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ — Án Ma Ni Bát Mê Hồng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRingBell}
              className="px-4 py-2.5 rounded-2xl bg-[#1C140E] border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Bell className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Thỉnh Chuông Hồi Hướng</span>
            </button>
            <div className="px-4 py-2 rounded-2xl bg-[#18110B] border border-white/5 text-[11px] text-stone-400">
              <span className="text-amber-400 font-bold">174+ Quốc Gia</span> đang kết nối tu học
            </div>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-4 gap-8">
          {/* Col 1: Kho Tàng Kinh Điển */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Kho Tàng Kinh Điển</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/thu-vien" className="hover:text-amber-200 transition-colors">
                  Bát Nhã Ba La Mật Đa Tâm Kinh
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-amber-200 transition-colors">
                  Kinh Kim Cương Bát Nhã
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-amber-200 transition-colors">
                  Kinh Phổ Môn &amp; Đại Bi Thần Chú
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-amber-200 transition-colors">
                  Kinh Dược Sư Bổn Nguyện Công Đức
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-amber-200 transition-colors">
                  Kinh Địa Tạng Bồ Tát Bổn Nguyện
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Phương Tiện Tu Tập */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phương Tiện Tu Tập</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/thuc-hanh" className="hover:text-amber-200 transition-colors">
                  Chuông Mõ &amp; Khánh Đồng Trực Tuyến
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-amber-200 transition-colors">
                  Tràng Hạt 108 Hạt Trì Niệm Danh Hiệu
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-amber-200 transition-colors">
                  Thiền Định Chánh Niệm Hơi Thở
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-amber-200 transition-colors">
                  Máy Niệm Phật 24/7 &amp; Nhạc Tu Tập
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-amber-200 transition-colors">
                  Cầu An Cho Thân Tộc &amp; Cầu Siêu Tiên Tổ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Lịch & Văn Hóa */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-2">
              <span>🪷</span>
              <span>Lịch Vạn Niên &amp; Sự Kiện</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lich-phat-giao" className="hover:text-amber-200 transition-colors">
                  Lịch Âm Dương &amp; Ngày Vía Chư Phật 2026
                </Link>
              </li>
              <li>
                <Link href="/lich-phat-giao" className="hover:text-amber-200 transition-colors">
                  Lịch Ăn Chay (Thập Trai, Lục Trai)
                </Link>
              </li>
              <li>
                <Link href="/lich-phat-giao" className="hover:text-amber-200 transition-colors">
                  Giờ Hoàng Đạo &amp; Tiết Khí 24 Mùa
                </Link>
              </li>
              <li>
                <Link href="/ho-so" className="hover:text-amber-200 transition-colors">
                  Sổ Giỗ Chạp &amp; Tưởng Niệm Người Thân
                </Link>
              </li>
              <li>
                <Link href="/ho-so" className="hover:text-amber-200 transition-colors">
                  Lịch Nhắc Nhở Thiền Định Mỗi Sáng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Đồng Hành & Chia Sẻ */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-2">
              <span>🤍</span>
              <span>Đồng Hành Cùng Om Mani</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Mỗi ngày dành 5 phút tĩnh lặng trước khi bắt đầu ngày mới giúp bạn mở rộng tâm từ, xua tan phiền não và tích lũy phước báu.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Hệ Thống Đang Vận Hành Ổn Định</span>
            </div>
          </div>
        </div>

        {/* Bottom strip: Dedication of Merit & Copyright */}
        <div className="pt-8 border-t border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="font-serif italic text-amber-200/70 text-center md:text-left">
            &ldquo;Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sinh, đều trọn thành Phật đạo.&rdquo;
          </p>
          <p className="text-stone-400">
            &copy; 2026 Om Mani — Nền Tảng Tu Học &amp; Chánh Niệm Phật Giáo.
          </p>
        </div>
      </div>
    </footer>
  );
}

