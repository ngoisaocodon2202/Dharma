'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  BookOpen,
  Heart,
  Sparkles,
  Volume2,
  Check,
  Share2,
} from 'lucide-react';
import { BUDDHAS_DATA, BuddhaItem } from '@/data/buddhasData';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { LotusMinimalIcon, DharmaWheelIcon, TempleBellIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

export interface BuddhasGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string) => void;
}

type DetailTab = 'tieu_su' | 'dai_nguyen' | 'than_chu';

export function BuddhasGalleryModal({
  isOpen,
  onClose,
  showToast,
}: BuddhasGalleryModalProps) {
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaItem | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('tieu_su');
  const [chantCount, setChantCount] = useState<Record<string, number>>({});
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectBuddha = (buddha: BuddhaItem) => {
    playBellSound(0.35);
    setSelectedBuddha(buddha);
    setActiveTab('tieu_su');
  };

  const handleBackToGrid = () => {
    setSelectedBuddha(null);
  };

  const handleChantMantra = () => {
    if (!selectedBuddha) return;
    playGrandTempleBellSound(0.5);
    const newCount = (chantCount[selectedBuddha.id] || 0) + 1;
    setChantCount((prev) => ({ ...prev, [selectedBuddha.id]: newCount }));

    recordDharmaMerit({
      type: 'mantra',
      title: `Trì Tụng ${selectedBuddha.thanChu.name}`,
      detail: `Hồng danh: ${selectedBuddha.name} • Lần thứ ${newCount}`,
      meritPoints: 10,
    });

    if (showToast) {
      showToast(`Nam Mô ${selectedBuddha.name} • Đã trì tụng (${newCount} biến)`);
    }
  };

  const handleCopyMantra = () => {
    if (!selectedBuddha) return;
    const text = `${selectedBuddha.thanChu.name}\nPhạn văn: ${selectedBuddha.thanChu.sanskrit}\nPhiên âm: ${selectedBuddha.thanChu.vietnamese}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    if (showToast) showToast('Đã sao chép câu Thần Chú vào bộ nhớ tạm');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] text-[#2E1E0F] shadow-2xl overflow-hidden">
        {/* ========================================================================= */}
        {/* VIEW 1: GRID OF 18 BUDDHAS & BODHISATTVAS (MATCHING SCREENSHOT 100%)       */}
        {/* ========================================================================= */}
        {!selectedBuddha ? (
          <>
            {/* Top Bar Header */}
            <div className="h-16 px-4 bg-white border-b border-[#EEDBBA] flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#7D6442] hover:text-[#2E1E0F] active:scale-90 transition-all cursor-pointer shadow-xs"
                  title="Đóng"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#2E1E0F] leading-tight">
                    Phật &amp; Bồ Tát
                  </h3>
                  <p className="text-[11px] text-[#8C5500] font-medium">
                    Thư Viện Bổn Tôn • 18 Tôn Tượng Trang Nghiêm
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#7D6442] hover:text-[#2E1E0F] active:scale-90 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction banner */}
            <div className="px-4 py-2 bg-gradient-to-r from-[#FFFDF5] to-[#FFF9E6] border-b border-[#F2E5C7] flex items-center justify-between text-xs text-[#7D6442] shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                Nhấn vào hình để xem: <strong>Tiểu Sử • Đại Nguyện • Thần Chú</strong>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500] font-bold">
                18 Vị Bổn Tôn
              </span>
            </div>

            {/* 2-Column Responsive Card Grid (Exact Screenshot Styling) */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 custom-dropdown-scroll">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {BUDDHAS_DATA.map((buddha) => (
                  <div
                    key={buddha.id}
                    onClick={() => handleSelectBuddha(buddha)}
                    className="group rounded-3xl overflow-hidden border border-[#ECD9A8]/70 hover:border-[#E5C158] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col bg-[#FDF9F0] active:scale-95 select-none"
                  >
                    {/* Top Artwork Area */}
                    <div className="relative aspect-[1.02/1] w-full overflow-hidden bg-[#FAF3E0] flex items-center justify-center">
                      <img
                        src={buddha.image}
                        alt={buddha.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Solid Dark Bar with Centered Name (100% matching screenshot) */}
                    <div className="bg-[#241B0B] py-2.5 px-2 text-center flex items-center justify-center min-h-[44px]">
                      <h4 className="font-heading font-serif text-xs sm:text-[13px] font-bold text-white tracking-wide leading-tight line-clamp-1 group-hover:text-[#FFE79A] transition-colors">
                        {buddha.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: DETAIL VIEW (1. TIỂU SỬ, 2. ĐẠI NGUYỆN, 3. THẦN CHÚ)               */
          /* ========================================================================= */
          <>
            {/* Top Detail Navigation Header */}
            <div className="h-16 px-4 bg-white border-b border-[#EEDBBA] flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="w-9 h-9 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#7D6442] hover:text-[#2E1E0F] active:scale-90 transition-all cursor-pointer shadow-xs shrink-0"
                  title="Trở lại danh sách Bổn Tôn"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500] truncate">
                    {selectedBuddha.title}
                  </h3>
                  <p className="text-[11px] text-[#7D6442] truncate font-sans">
                    {selectedBuddha.sanskrit} • {selectedBuddha.realm}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#7D6442] hover:text-[#2E1E0F] active:scale-90 transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Detail Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-dropdown-scroll">
              {/* Buddha Hero Presentation Card */}
              <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EA] to-[#FFF3D0] border border-[#ECD9A8] shadow-md flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#E5C158] shadow-md shrink-0 bg-[#FAF3E0]">
                  <img
                    src={selectedBuddha.image}
                    alt={selectedBuddha.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                    {selectedBuddha.realm}
                  </div>
                  <h2 className="font-heading font-serif text-lg sm:text-xl font-bold text-[#2E1E0F]">
                    {selectedBuddha.name}
                  </h2>
                  <p className="text-xs text-[#7D6442] italic">
                    Pháp bảo &amp; Biểu tượng: {selectedBuddha.symbol}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={handleChantMantra}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <TempleBellIcon className="w-3.5 h-3.5" />
                      <span>Trì Niệm (+10 Công Đức)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyMantra}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã Sao Chép' : 'Chép Chân Ngôn'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Tabs Switcher (1. Tiểu Sử, 2. Đại Nguyện, 3. Thần Chú) */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8]">
                {[
                  { id: 'tieu_su', label: '1. Tiểu Sử', icon: BookOpen },
                  { id: 'dai_nguyen', label: '2. Đại Nguyện', icon: Heart },
                  { id: 'than_chu', label: '3. Thần Chú', icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playBellSound(0.2);
                        setActiveTab(tab.id as DetailTab);
                      }}
                      className={cn(
                        'py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                        isActive
                          ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-xs'
                          : 'text-[#7D6442] hover:text-[#2E1E0F]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: TIỂU SỬ */}
              {activeTab === 'tieu_su' && (
                <div className="rounded-3xl p-5 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2E5C7]">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-serif text-sm font-bold text-[#8C5500]">
                        Tiểu Sử &amp; Cội Nguồn Kinh Điển
                      </h4>
                      <p className="text-[11px] text-[#7D6442]">Hành trạng hóa độ &amp; xuất xứ chính thống</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-[#2E1E0F]">
                    <div className="p-3 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7]">
                      <span className="font-bold text-[#8C5500] block mb-1">Xuất Xứ &amp; Căn Bản Kinh Điển:</span>
                      <p className="text-[#5A4329]">{selectedBuddha.tieuSu.origin}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7]">
                      <span className="font-bold text-[#8C5500] block mb-1">Hành Trạng &amp; Tích Hóa Độ:</span>
                      <p className="text-[#5A4329]">{selectedBuddha.tieuSu.story}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7]">
                      <span className="font-bold text-[#8C5500] block mb-1">Ý Nghĩa Biểu Pháp:</span>
                      <p className="text-[#5A4329]">{selectedBuddha.tieuSu.meaning}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ĐẠI NGUYỆN */}
              {activeTab === 'dai_nguyen' && (
                <div className="rounded-3xl p-5 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2E5C7]">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-serif text-sm font-bold text-[#8C5500]">
                        Bổn Nguyện &amp; Lời Thệ Nguyện
                      </h4>
                      <p className="text-[11px] text-[#7D6442]">Đại nguyện cứu độ muôn loài trong pháp giới</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-[#8C5500] italic">
                      {selectedBuddha.daiNguyen.summary}
                    </p>

                    <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
                      {selectedBuddha.daiNguyen.vows.map((vow, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] flex items-start gap-2.5 text-xs text-[#3D2505]"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#FFF4D0] text-[#8C5500] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed flex-1">{vow}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: THẦN CHÚ */}
              {activeTab === 'than_chu' && (
                <div className="rounded-3xl p-5 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E5C7]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-serif text-sm font-bold text-[#8C5500]">
                          {selectedBuddha.thanChu.name}
                        </h4>
                        <p className="text-[11px] text-[#7D6442]">Chân ngôn uy lực mầu nhiệm</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyMantra}
                      className="text-[#8C5500] hover:text-[#2E1E0F] p-1.5 rounded-lg border border-[#ECD9A8] bg-[#FFFDF7] text-xs font-medium flex items-center gap-1 active:scale-95 transition-all"
                      title="Sao chép thần chú"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Sanskrit Mantra Box */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E5C158] text-center space-y-2 shadow-xs">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8C5500] tracking-widest block">
                      Phạn Văn (Sanskrit Mantra)
                    </span>
                    <p className="font-heading font-serif text-sm sm:text-base font-bold text-[#8C5500] leading-relaxed select-all">
                      {selectedBuddha.thanChu.sanskrit}
                    </p>
                  </div>

                  {/* Vietnamese Phonetic Box */}
                  <div className="p-4 rounded-2xl bg-white border border-[#F2E5C7] text-center space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#7D6442] tracking-widest block">
                      Phiên Âm Tụng Đọc
                    </span>
                    <p className="font-mono text-xs sm:text-sm font-semibold text-[#2E1E0F] leading-relaxed select-all">
                      {selectedBuddha.thanChu.vietnamese}
                    </p>
                  </div>

                  {/* Meaning & Benefits */}
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7]">
                      <span className="font-bold text-[#8C5500] block mb-1">Ý Nghĩa Chân Ngôn:</span>
                      <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.thanChu.meaning}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FFFDF2] to-[#FFF9E6] border border-[#ECD9A8]">
                      <span className="font-bold text-[#8C5500] block mb-1">Công Đức &amp; Lợi Ích Trì Tụng:</span>
                      <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.thanChu.benefits}</p>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <button
                    type="button"
                    onClick={handleChantMantra}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <TempleBellIcon className="w-4 h-4 shrink-0" />
                    <span>Thỉnh Chuông &amp; Trì Niệm (+10 Công Đức)</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default BuddhasGalleryModal;
