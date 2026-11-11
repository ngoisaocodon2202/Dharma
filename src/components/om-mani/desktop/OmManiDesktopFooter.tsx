'use client';

import React from 'react';
import Link from 'next/link';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  TempleBellIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
  AlmsBowlIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { playGrandTempleBellSound } from '@/lib/buddhistSounds';

export function OmManiDesktopFooter() {
  const handleRingBell = () => {
    playGrandTempleBellSound(0.5);
  };

  return (
    <footer className="hidden lg:block w-full bg-[#FFFDF7] border-t border-[#EEDBBA] text-[#5A4329] pt-16 pb-12 transition-colors relative overflow-hidden">
      {/* Radiant Buddhist pale gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-36 bg-[#F5C542]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Top bar: Brand + Pāli Dhammapada Verse + Quick Bell */}
        <div className="flex items-center justify-between pb-10 border-b border-[#EEDBBA]">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl overflow-hidden border border-[#ECD9A8] shadow-[0_2px_12px_rgba(200,160,50,0.18)] bg-white shrink-0">
              <img
                src="/dharma-logo.png"
                alt="Dharma Logo"
                className="w-12 h-12 object-cover"
              />
            </div>
            <div>
              <div className="font-heading font-serif font-black text-xl tracking-wider text-[#2E1E0F] flex items-center gap-2.5">
                <span>DHARMA</span>
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#9A6405] border border-[#F2DE9C]">
                  Tam Tạng &amp; Hành Trì
                </span>
              </div>
              <p className="text-xs text-[#7D6442] font-serif italic mt-1">
                &ldquo;Sabbadānaṃ dhammadānaṃ jināti — Trong các sự bố thí, Pháp thí là tối thượng&rdquo; (Pháp Cú 354)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRingBell}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] text-xs font-bold flex items-center gap-2 shadow-[0_2px_12px_rgba(240,180,30,0.3)] transition-all active:scale-95 cursor-pointer"
            >
              <TempleBellIcon className="w-4 h-4 text-[#3D2505]" />
              <span>Thỉnh Chuông Hồi Hướng</span>
            </button>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-4 gap-8">
          {/* Col 1: Tam Tạng Kinh Điển */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] flex items-center gap-2">
              <SutraScrollIcon className="w-4 h-4 text-[#B87B08]" />
              <span>Tam Tạng Kinh Điển</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#6A5234]">
              <li>
                <Link href="/thu-vien" className="hover:text-[#A8720B] transition-colors">
                  Kinh Pháp Cú (Dhammapada)
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-[#A8720B] transition-colors">
                  Bát Nhã Ba La Mật Đa Tâm Kinh
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-[#A8720B] transition-colors">
                  Kinh Kim Cương Bát Nhã
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-[#A8720B] transition-colors">
                  Kinh Dược Sư Lưu Ly Bổn Nguyện
                </Link>
              </li>
              <li>
                <Link href="/thu-vien" className="hover:text-[#A8720B] transition-colors">
                  Kinh Địa Tạng Bồ Tát Bổn Nguyện
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Không Gian Hành Trì */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] flex items-center gap-2">
              <DharmaWheelIcon className="w-4 h-4 text-[#B87B08]" />
              <span>Không Gian Hành Trì</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#6A5234]">
              <li>
                <Link href="/thuc-hanh" className="hover:text-[#A8720B] transition-colors">
                  Phòng Thiền Hơi Thở Anapanasati
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-[#A8720B] transition-colors">
                  Mõ Tụng Kinh Tự Động Theo Nhịp BPM
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-[#A8720B] transition-colors">
                  Tràng Hạt 108 Hạt &amp; Hồi Hướng Công Đức
                </Link>
              </li>
              <li>
                <Link href="/thuc-hanh" className="hover:text-[#A8720B] transition-colors">
                  Đàn Tràng Thắp Đèn Hoa Đăng Cầu Nguyện
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#A8720B] transition-colors">
                  Bộ Hòa Âm Thiền Tự Đa Tầng 432Hz
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Lịch Pháp & Trai Giới */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] flex items-center gap-2">
              <AlmsBowlIcon className="w-4 h-4 text-[#B87B08]" />
              <span>Lịch Pháp &amp; Trai Giới</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#6A5234]">
              <li>
                <Link href="/lich-phat-giao" className="hover:text-[#A8720B] transition-colors">
                  Lịch Vạn Niên &amp; Vía Chư Phật 2026
                </Link>
              </li>
              <li>
                <Link href="/lich-phat-giao" className="hover:text-[#A8720B] transition-colors">
                  Lịch Ăn Chay Lục Trai &amp; Thập Trai
                </Link>
              </li>
              <li>
                <Link href="/lich-phat-giao" className="hover:text-[#A8720B] transition-colors">
                  Thực Đơn Chay Dưỡng Sinh Ngày Trai
                </Link>
              </li>
              <li>
                <Link href="/ho-so" className="hover:text-[#A8720B] transition-colors">
                  Sổ Giỗ Chạp &amp; Tưởng Niệm Gia Tiên
                </Link>
              </li>
              <li>
                <Link href="/ho-so" className="hover:text-[#A8720B] transition-colors">
                  Bảng Tự Kiểm Ngũ Giới Cư Sĩ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tôn Chỉ Hoằng Pháp */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C5500] flex items-center gap-2">
              <BodhiLeafIcon className="w-4 h-4 text-[#B87B08]" />
              <span>Tôn Chỉ Dharma</span>
            </h4>
            <p className="text-xs text-[#6A5234] leading-relaxed">
              Dharma được kiến tạo như một đạo tràng kỹ thuật số thanh tịnh, giúp người cư sĩ tại gia duy trì 4 thời công phu, thọ trì kinh điển Tam Tạng và nuôi dưỡng hạt giống Bồ Đề mỗi ngày.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <LotusMinimalIcon className="w-4 h-4 text-[#B87B08]" />
              <span className="text-xs text-[#8C5500] font-medium">Chánh Niệm • Từ Bi • Trí Tuệ</span>
            </div>
          </div>
        </div>

        {/* Bottom strip: Dedication of Merit & Copyright */}
        <div className="pt-8 border-t border-[#EEDBBA] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7D6442]">
          <p className="font-serif italic text-[#8C5500] text-center md:text-left">
            &ldquo;Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sinh, đều trọn thành Phật đạo.&rdquo;
          </p>
          <p className="text-[#6A5234]">
            &copy; 2026 DHARMA — Không Gian Chánh Niệm &amp; Tam Tạng Pháp Bảo.
          </p>
        </div>
      </div>
    </footer>
  );
}
