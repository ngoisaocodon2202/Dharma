'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Search, BookOpen, MapPin, Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface QuickDharmaItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
}

const DHARMA_QUICK_INDEX: QuickDharmaItem[] = [
  {
    id: 'q-1',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
    subtitle: 'Quán chiếu Ngũ Uẩn giai không, vượt thoát khổ ách',
    category: 'Tam Tạng Kinh Điển',
    href: '/thu-vien',
  },
  {
    id: 'q-2',
    title: 'Kinh Từ Bi (Karaniya Metta Sutta)',
    subtitle: 'Trải tâm từ bi vô lượng đến khắp mười phương chúng sinh',
    category: 'Kinh Nguyên Thủy Nikāya',
    href: '/thu-vien',
  },
  {
    id: 'q-3',
    title: 'Kinh Dược Sư Lưu Ly Quang Như Lai Bổn Nguyện',
    subtitle: 'Mười hai đại nguyện tiêu trừ tật bệnh, gia tăng phúc thọ',
    category: 'Kinh Đại Thừa',
    href: '/thu-vien',
  },
  {
    id: 'q-4',
    title: 'Thiền Hơi Thở Chánh Niệm Anapanasati (4-4-6)',
    subtitle: 'Phòng thiền định tâm 4s hít vào - 4s giữ - 6s thở ra',
    category: 'Phương Tiện Hành Trì',
    href: '/thuc-hanh',
  },
  {
    id: 'q-5',
    title: 'Tràng Hạt Bồ Đề 108 Hạt & Chuông Mõ Nhịp BPM',
    subtitle: 'Lần chuỗi niệm Phật và gõ mõ tự động 50/68/88 BPM',
    category: 'Pháp Khí Tu Tập',
    href: '/thuc-hanh',
  },
  {
    id: 'q-6',
    title: 'Lịch Vạn Niên Phật Giáo & Ngày Trai Giới',
    subtitle: 'Tra cứu ngày Sóc Vọng, Thập Trai và thực đơn chay dưỡng sinh',
    category: 'Lịch Vạn Niên',
    href: '/lich-phat-giao',
  },
  {
    id: 'q-7',
    title: 'Thẻ Cư Sĩ Hoàng Kim & Tự Kiểm Ngũ Giới',
    subtitle: 'Theo dõi Cây Bồ Đề Công Đức và giữ gìn 5 giới tại gia',
    category: 'Hồ Sơ Cư Sĩ',
    href: '/ho-so',
  },
  {
    id: 'q-8',
    title: 'Chánh Điện Lễ Phật & Dâng Hương Trực Tuyến',
    subtitle: 'Không gian lễ Phật, dâng hương và thỉnh Đại Hồng Chung',
    category: 'Đạo Tràng Online',
    href: '/di-chua-online',
  },
];

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [queryText, setQueryText] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);

  const POPULAR_TAGS = [
    'Bát Nhã Tâm Kinh',
    'Thiền hơi thở',
    'Kinh Dược Sư',
    '108 Hạt',
    'Lịch ăn chay',
    'Ngũ Giới',
  ];

  const PLACEHOLDERS = [
    'Tìm kiếm "Bát Nhã Tâm Kinh"...',
    'Tìm kiếm "Thiền hơi thở Anapanasati"...',
    'Tìm kiếm "Kinh Dược Sư", "Kinh Từ Bi"...',
    'Tìm kiếm "Lịch ăn chay & Thập Trai"...',
    'Tìm kiếm "108 Chuỗi Bồ Đề", "Ngũ Giới"...',
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return DHARMA_QUICK_INDEX;
    return DHARMA_QUICK_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [queryText]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tra Cứu Pháp Bảo Dharma"
      description="Tìm nhanh Kinh điển, Pháp khí hành trì, Lịch Trai Giới & Cẩm nang"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8C5500]" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={PLACEHOLDERS[suggestionIdx]}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#EEDBBA] rounded-xl focus:outline-none focus:border-[#E5C158] text-[#2E1E0F] placeholder:text-[#7D6442]/60"
          />
        </div>

        {/* Popular Tags */}
        <div>
          <span className="text-[10px] font-bold text-[#8C5500] uppercase tracking-wider block mb-2">
            Từ khóa gợi ý nhanh
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQueryText(tag)}
                className="px-2.5 py-1 rounded-xl text-xs bg-white hover:bg-[#FFF4D0] text-[#5A4329] hover:text-[#8C5500] transition-all cursor-pointer border border-[#EEDBBA] whitespace-nowrap active:scale-95"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[48vh] overflow-y-auto no-scrollbar space-y-2 pr-0.5">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="block p-3 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {item.category}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-heading font-serif font-bold text-[#2E1E0F] mt-0.5">
                {item.title}
              </div>
              <div className="text-[11px] text-[#7D6442] line-clamp-1 mt-0.5">
                {item.subtitle}
              </div>
            </Link>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-6 text-center text-xs text-[#7D6442]">
              Không tìm thấy nội dung phù hợp với từ khóa &ldquo;{queryText}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
