'use client';

import React, { useState } from 'react';
import { Sparkles, Play, Pause, Volume2, Shield, Heart, Check } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound } from '@/lib/buddhistSounds';
import { incrementDailyPractice } from '@/lib/dailyPracticeProgress';
import { cn } from '@/lib/utils';

interface MantraItem {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  meaning: string;
  benefit: string;
  textVi: string;
  repeatCountDefault: number;
}

const MANTRAS_DATA: MantraItem[] = [
  {
    id: 'om-mani',
    name: 'Lục Tự Đại Minh Chú',
    sanskrit: 'Oṃ Maṇi Padme Hūṃ',
    category: 'Bình an',
    meaning: 'Viên ngọc quý sáng soi trong đóa sen thanh khiết',
    benefit: 'Đóng sáu cánh cửa tái sinh trong lục đạo luân hồi, thanh tịnh thân tâm, khai mở lòng đại bi vô lượng.',
    textVi: 'Án Ma Ni Bát Mê Hồng (Om Mani Padme Hum)',
    repeatCountDefault: 108,
  },
  {
    id: 'om-ah-hum',
    name: 'Kim Cương Đạo Sư Minh Chú',
    sanskrit: 'Oṃ Āḥ Hūṃ Vajra Guru Padma Siddhi Hūṃ',
    category: 'Trừ chướng ngại',
    meaning: 'Quy y Thân Khẩu Ý chư Phật, bậc Đạo Sư Liên Hoa Sanh gia trì thành tựu',
    benefit: 'Tiêu trừ chướng ngại, hóa giải hiểm nguy, chuyển hóa nghịch cảnh thành thuận duyên tu tập.',
    textVi: 'Om A Hùng Vát-za-ra Gu-ru Bát-ma Sít-đi Hùng',
    repeatCountDefault: 21,
  },
  {
    id: 'dai-bi',
    name: 'Đại Bi Thần Chú',
    sanskrit: 'Mahā Karuṇā Dhāraṇī',
    category: 'Cứu khổ',
    meaning: 'Tâm đại bi vô ngại của Đức Quán Thế Âm Bồ Tát',
    benefit: 'Được mười phương chư Phật hộ niệm, tiêu trừ túc nghiệp trọng tội, tăng trưởng phước đức bồ đề.',
    textVi: 'Nam mô hắc ra đát na đa ra dạ da. Nam mô a rị da, bà lô kiết đế, thước bát ra da...',
    repeatCountDefault: 7,
  },
  {
    id: 'duoc-su',
    name: 'Dược Sư Quán Đảnh Chân Ngôn',
    sanskrit: 'Bhaiṣajyaguru Dhāraṇī',
    category: 'Sức khỏe',
    meaning: 'Ánh sáng lưu ly chữa lành mọi tật bệnh thân tâm',
    benefit: 'Tiêu trừ bệnh tật hiểm nghèo, tâm an ổn thanh tịnh, thân thể an khang, thọ mạng gia tăng.',
    textVi: 'Nam mô bạt già phạt đế, bệ sát xã, lũ lô thích lưu ly, phách lạt bà, hắt ra xà dã...',
    repeatCountDefault: 21,
  },
];

const FILTER_TAGS = ['Tất cả', 'Bình an', 'Trừ chướng ngại', 'Sức khỏe', 'Cứu khổ'];

export function OmManiMantrasSection() {
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [chantCounters, setChantCounters] = useState<Record<string, number>>({
    'om-mani': 0,
    'om-ah-hum': 0,
    'dai-bi': 0,
    'duoc-su': 0,
  });

  const filteredMantras =
    selectedTag === 'Tất cả'
      ? MANTRAS_DATA
      : MANTRAS_DATA.filter((m) => m.category === selectedTag);

  const handleChantMantra = (id: string) => {
    playWoodenFishSound(0.5);
    incrementDailyPractice('tri-chu', 1);
    setChantCounters((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <section id="minh-chu-section" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-saffron-500 shrink-0" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-50 whitespace-nowrap">
              Minh Chú & Thần Chú
            </h3>
          </div>
          <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5 whitespace-nowrap">
            Mật thừa tuyển chọn gia trì bình an
          </p>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="overflow-x-auto no-scrollbar flex items-center gap-2 py-0.5">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0',
              selectedTag === tag
                ? 'bg-amber-500 text-charcoal-950 shadow-xs font-bold'
                : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Mantras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredMantras.map((mantra) => {
          const currentCount = chantCounters[mantra.id] || 0;

          return (
            <div
              key={mantra.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {mantra.category}
                  </span>
                  <h4 className="font-heading font-bold text-base text-charcoal-900 dark:text-charcoal-100 mt-1.5">
                    {mantra.name}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {mantra.sanskrit}
                  </div>
                </div>

                {/* Counter Pill */}
                <div className="px-2.5 py-1 rounded-xl bg-ivory-100 dark:bg-charcoal-700 text-center shrink-0 whitespace-nowrap">
                  <div className="text-[9px] text-charcoal-500 uppercase whitespace-nowrap">Đã trì</div>
                  <div className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400 whitespace-nowrap">
                    {currentCount} biến
                  </div>
                </div>
              </div>

              {/* Mantra text in Vietnamese */}
              <div className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-900/60 border border-ivory-200/80 dark:border-charcoal-700/80 text-xs text-charcoal-800 dark:text-charcoal-200 font-serif italic leading-relaxed">
                &ldquo;{mantra.textVi}&rdquo;
              </div>

              {/* Benefit */}
              <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                {mantra.benefit}
              </p>

              {/* Action buttons */}
              <div className="pt-2 border-t border-ivory-100 dark:border-charcoal-700 flex items-center justify-between gap-2">
                <button
                  onClick={() => playBellSound(0.4)}
                  className="px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-charcoal-700 hover:bg-ivory-200 text-charcoal-700 dark:text-charcoal-300 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="whitespace-nowrap">Nghe chuông</span>
                </button>

                <button
                  onClick={() => handleChantMantra(mantra.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-400 hover:to-saffron-500 text-charcoal-950 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Trì Tụng (+1)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
