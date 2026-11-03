'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';

const HERO_SLIDES = [
  {
    title: 'LỊCH SỬ PHẬT GIÁO TỪ KHỞI NGUYÊN ĐẾN HIỆN ĐẠI',
    subtitle: 'Hành trình 2.600 năm ánh đạo vàng từ Ấn Độ cổ đại đến Trúc Lâm Yên Tử và Phật giáo toàn cầu',
    image: '/images/om_mani_hero.jpg',
    tag: 'Lịch Sử & Cội Nguồn',
    ctaText: 'Khám Phá Lịch Sử',
    href: '/lich-su-phat-giao',
  },
  {
    title: 'LỊCH VẠN NIÊN & NHẮC NHỞ NGÀY QUAN TRỌNG',
    subtitle: 'Tra cứu Âm Dương lịch vạn niên, ngày Rằm - Mùng 1 và ghi chú Ngày Giỗ, Ngày Quan Trọng của gia đình',
    image: '/images/tran_nhan_tong_yentu.jpg',
    tag: 'Lịch Phật Giáo Vạn Niên',
    ctaText: 'Mở Lịch & Tạo Nhắc Nhở',
    href: '/lich-phat-giao',
  },
  {
    title: 'PHÁP THOẠI CHƯ TÔN ĐỨC & KHO TÀNG KINH ĐIỂN',
    subtitle: 'Bài viết mới cập nhật mỗi ngày từ các Sư Thầy, Tự Viện cùng tủ Kinh sách & AI Hỏi Đáp Phật Pháp',
    image: '/images/buddha_meditation.jpg',
    tag: 'Cập Nhật Hàng Ngày',
    ctaText: 'Đọc Bài Giảng Mới Nhất',
    href: '/bai-viet',
  },
];

interface OmManiHeroBannerProps {
  onOpenIncense?: () => void;
  onOpenMala?: () => void;
}

export function OmManiHeroBanner({ onOpenIncense, onOpenMala }: OmManiHeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-amber-500/25 bg-charcoal-950 text-white">
      {/* Container with well-proportioned height */}
      <div className="relative h-[210px] sm:h-[250px] md:h-[280px] w-full overflow-hidden">
        {/* Background Slides */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center brightness-[0.68] contrast-[1.05]"
            />
          </div>
        ))}

        {/* Ambient Gradient Overlays for perfect legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-transparent to-transparent" />

        {/* Dynamic Flex Content Layout (Zero overlap guaranteed) */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6">
          {/* Top Bar: Tag & Dot Indicators */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-amber-400/35 text-amber-200 text-[10.5px] font-semibold tracking-wide">
              <BuddhaBodhiIcon className="w-3 h-3 text-amber-400" />
              <span>{slide.tag}</span>
            </div>

            {/* Slide Pill Indicators */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Chuyển đến slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Info: Clean, concise & professional */}
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <h2 className="font-heading font-bold text-base sm:text-xl md:text-2xl text-amber-100 tracking-tight leading-snug drop-shadow-sm">
              {slide.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-200/90 font-normal leading-relaxed line-clamp-2 drop-shadow-xs">
              {slide.subtitle}
            </p>

            <div className="pt-0.5">
              <Link
                href={slide.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-400 hover:to-saffron-500 text-charcoal-950 font-bold text-xs tracking-wide shadow-md active:scale-95 transition-all"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
