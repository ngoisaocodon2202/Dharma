'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Heart, Bell } from 'lucide-react';
import { playBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

interface BuddhaItem {
  id: string;
  name: string;
  title: string;
  image: string;
  mantra: string;
  vow: string;
  symbol: string;
}

const BUDDHAS_DATA: BuddhaItem[] = [
  {
    id: 'thich-ca',
    name: 'Phật Thích Ca',
    title: 'Đức Bổn Sư Thích Ca Mâu Ni Phật',
    image: '/images/golden_buddha.jpg',
    mantra: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    vow: 'Khai mở con đường giác ngộ, chỉ rõ Tứ Diệu Đế & Bát Chánh Đạo đưa chúng sinh thoát khỏi luân hồi sinh tử.',
    symbol: 'Bánh xe Pháp Luân',
  },
  {
    id: 'a-di-da',
    name: 'Phật A Di Đà',
    title: 'Đức Phật A Di Đà',
    image: '/images/buddha_meditation.jpg',
    mantra: 'Nam Mô A Di Đà Phật',
    vow: '48 Đại nguyện tiếp dẫn chúng sinh có tâm niệm Phật vãng sanh về cõi Tây Phương Cực Lạc thanh tịnh.',
    symbol: 'Hoa sen Đại Đạo',
  },
  {
    id: 'quan-am',
    name: 'Bồ Tát Quán Âm',
    title: 'Đại Bi Quán Thế Âm Bồ Tát',
    image: '/images/quan_am_bodhisattva.jpg',
    mantra: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    vow: 'Lắng nghe tiếng kêu cứu của muôn loài trong mười phương, ban bố tình thương và sự chở che không phân biệt.',
    symbol: 'Bình cam lồ & Cành dương liễu',
  },
  {
    id: 'dia-tang',
    name: 'Bồ Tát Địa Tạng',
    title: 'Đại Nguyện Địa Tạng Vương Bồ Tát',
    image: '/images/tran_nhan_tong_yentu.jpg',
    mantra: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vow: '“Địa ngục vị không, thệ bất thành Phật. Chúng sinh độ tận, phương chứng Bồ Đề.”',
    symbol: 'Tích trượng & Viên minh châu',
  },
  {
    id: 'duoc-su',
    name: 'Phật Dược Sư',
    title: 'Dược Sư Lưu Ly Quang Vương Phật',
    image: '/images/buddha_temple.jpg',
    mantra: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    vow: '12 Đại nguyện trừ dứt mọi bệnh tật thể xác và tâm bệnh, ban phước lành, ánh sáng lưu ly chiếu rọi muôn nơi.',
    symbol: 'Bát thuốc lưu ly',
  },
  {
    id: 'van-thu',
    name: 'Bồ Tát Văn Thù',
    title: 'Đại Trí Văn Thù Sư Lợi Bồ Tát',
    image: '/images/buddha_bodhi_tree.png',
    mantra: 'Nam Mô Đại Trí Văn Thù Sư Lợi Bồ Tát',
    vow: 'Dùng thanh kiếm trí tuệ chặt đứt phiền não, vô minh, khai mở tuệ giác vô thượng cho người tu học.',
    symbol: 'Thanh gươm trí tuệ & Kinh Bát Nhã',
  },
];

export function OmManiBuddhasCarousel() {
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaItem | null>(null);
  const [hasProstrated, setHasProstrated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBuddha(null);
    };

    if (selectedBuddha) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBuddha]);

  const handleOpen = (buddha: BuddhaItem) => {
    setSelectedBuddha(buddha);
    setHasProstrated(false);
  };

  const handleProstrate = () => {
    playBellSound(0.5);
    setHasProstrated(true);
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
            Chư Phật & Bồ Tát
          </h3>
        </div>
        <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-saffron-700 dark:text-saffron-400">
          Chạm để đảnh lễ
        </span>
      </div>

      {/* Horizontal Carousel of Avatars */}
      <div className="overflow-x-auto no-scrollbar pb-2 pt-1 -mx-2 px-2 flex gap-3.5 sm:gap-5">
        {BUDDHAS_DATA.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleOpen(b)}
            className="flex flex-col items-center text-center group shrink-0 focus:outline-none cursor-pointer"
          >
            {/* Circular Avatar with Golden Ring */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 active:scale-95">
              {/* Outer halo */}
              <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm group-hover:opacity-100 opacity-40 transition-opacity" />

              <div className="relative w-full h-full rounded-full overflow-hidden bg-ivory-100 dark:bg-charcoal-900 border border-white/50">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            <span className="font-heading font-semibold text-xs text-charcoal-800 dark:text-charcoal-200 mt-1.5 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors whitespace-nowrap">
              {b.name}
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Modal for Holy Homage (Portaled directly to document.body) */}
      {selectedBuddha && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedBuddha(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedBuddha.title}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-stone-900 via-charcoal-900 to-charcoal-950 text-white rounded-3xl border border-amber-500/40 shadow-2xl p-5 sm:p-6 flex flex-col items-center text-center animate-scale-in"
          >
            <button
              type="button"
              onClick={() => setSelectedBuddha(null)}
              className="absolute top-3.5 right-3.5 p-2 rounded-full text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
              aria-label="Đóng cửa sổ đảnh lễ"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Holy Portrait */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-600 shadow-xl my-2 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-stone-950">
                <img
                  src={selectedBuddha.image}
                  alt={selectedBuddha.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h4 className="font-heading font-bold text-base sm:text-lg text-amber-200 mt-2 px-6">
              {selectedBuddha.title}
            </h4>

            <p className="text-xs text-amber-300 font-serif italic mt-1.5 px-3 py-1 rounded-full bg-white/5 border border-amber-500/20">
              {selectedBuddha.mantra}
            </p>

            <div className="my-4 text-xs text-stone-300 leading-relaxed text-left bg-black/40 p-3.5 sm:p-4 rounded-2xl border border-white/10 space-y-2 w-full">
              <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                Đại Nguyện & Hạnh Nguyện
              </div>
              <p className="text-stone-200">{selectedBuddha.vow}</p>
              <div className="text-[11px] text-stone-400 pt-1 border-t border-white/5">
                Biểu tượng: <span className="text-amber-200 font-medium">{selectedBuddha.symbol}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProstrate}
              className={cn(
                'w-full py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer',
                hasProstrated
                  ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-saffron-500 hover:from-amber-400 hover:to-saffron-400 text-stone-950 shadow-amber-900/30 font-extrabold'
              )}
            >
              <Bell className="w-4 h-4 fill-current shrink-0" />
              <span>
                {hasProstrated ? 'Đã thành tâm đảnh lễ một lạy!' : 'Chí Tâm Đảnh Lễ (Lạy Phật)'}
              </span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
