'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  BookOpen,
  Heart,
  Sparkles,
  Volume2,
  Check,
  Share2,
} from 'lucide-react';
import { BUDDHAS_DATA, BuddhaItem } from '@/data/buddhasData';
import { playSoftTabBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
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
    playSoftTabBellSound(0.2);
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
    <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2E1E0F] flex flex-col overflow-hidden animate-fade-in">
      <div className="relative w-full h-full flex flex-col bg-[#FAF7F0] text-[#2E1E0F] overflow-hidden">
        {/* ========================================================================= */}
        {/* VIEW 1: GRID OF 18 BUDDHAS & BODHISATTVAS (FULL-SCREEN PAGE)              */}
        {/* ========================================================================= */}
        {!selectedBuddha ? (
          <>
            {/* Top Bar Header */}
            <div className="h-16 px-4 bg-[#FFFDF8] border-b border-[#EEDBBA] flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Quay lại"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="w-5 h-5" />
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

              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500]">
                18 Bổn Tôn
              </span>
            </div>

            {/* Instruction banner */}
            <div className="px-3.5 py-2 bg-gradient-to-r from-[#FFFDF5] to-[#FFF9E6] border-b border-[#F2E5C7] flex items-center justify-between text-[11px] sm:text-xs text-[#7D6442] shrink-0">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <LotusMinimalIcon className="w-3.5 h-3.5 text-[#8C5500] shrink-0" />
                <span>Tiểu Sử • Đại Nguyện • Thần Chú</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF4D0] text-[#8C5500] font-bold shrink-0">
                18 Bổn Tôn
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

                    {/* Bottom Solid Dark Bar with Centered Name (100% single-line) */}
                    <div className="bg-[#FFFBF2] border-t border-[#F0E2BE] py-2 px-2 text-center flex items-center justify-center">
                      <h4 className="font-heading font-serif text-[11px] sm:text-xs font-bold text-[#2C1E10] tracking-tight group-hover:text-[#9A6200] transition-colors whitespace-nowrap truncate w-full">
                        {buddha.name.replace(/^Đức Phật\s+/i, 'Phật ').replace(/\s+Bồ Tát$/i, '')}
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
            <div className="h-16 px-4 bg-[#FFFDF8] border-b border-[#EEDBBA] flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Quay lại danh sách Bổn Tôn"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="w-5 h-5" />
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
                className="px-3 py-1.5 rounded-xl bg-white border border-[#EEDBBA] hover:border-[#8C5500] text-xs font-bold text-[#7D6442] hover:text-[#2E1E0F] cursor-pointer shrink-0"
              >
                Đóng thư viện
              </button>
            </div>

            {/* Scrollable Detail Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-5 custom-dropdown-scroll">
              {/* Buddha Hero Presentation Card */}
              <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EA] to-[#FFF3D0] border border-[#ECD9A8] shadow-md flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-[#E5C158] shadow-md shrink-0 bg-[#FAF3E0]">
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

                  <div className="pt-2 grid grid-cols-2 gap-2 w-full">
                    <button
                      type="button"
                      onClick={handleChantMantra}
                      className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap truncate">Trì Niệm Công Đức</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyMantra}
                      className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Share2 className="w-3.5 h-3.5 shrink-0" />}
                      <span className="whitespace-nowrap truncate">{isCopied ? 'Đã Sao Chép' : 'Chép Chân Ngôn'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Tabs Switcher (1. Tiểu Sử, 2. Đại Nguyện, 3. Thần Chú) */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#EFECE5]">
                {[
                  { id: 'tieu_su', label: 'Tiểu sử', icon: BookOpen },
                  { id: 'dai_nguyen', label: 'Đại nguyện', icon: Heart },
                  { id: 'than_chu', label: 'Thần chú', icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playSoftTabBellSound(0.2);
                        setActiveTab(tab.id as DetailTab);
                      }}
                      className={cn(
                        'py-2 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap',
                        isActive
                          ? 'bg-white text-[#2C1E10] font-bold shadow-xs'
                          : 'text-[#6B533B] hover:text-[#2E1E0F]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: TIỂU SỬ (Open borderless canvas layout) */}
              {activeTab === 'tieu_su' && (
                <div className="py-2 space-y-5 animate-fade-in">
                  <div>
                    <h4 className="text-[15px] font-bold text-[#78531E] mb-1.5">
                      Xuất Xứ &amp; Căn Bản Kinh Điển
                    </h4>
                    <p className="text-[15px] leading-relaxed text-[#2E1E0F]">
                      {selectedBuddha.tieuSu.origin}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[15px] font-bold text-[#78531E] mb-1.5">
                      Hành Trạng &amp; Tích Hóa Độ
                    </h4>
                    <p className="text-[15px] leading-relaxed text-[#2E1E0F]">
                      {selectedBuddha.tieuSu.story}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[15px] font-bold text-[#78531E] mb-1.5">
                      Ý Nghĩa Biểu Pháp
                    </h4>
                    <p className="text-[15px] leading-relaxed text-[#2E1E0F]">
                      {selectedBuddha.tieuSu.meaning}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: ĐẠI NGUYỆN (Open borderless canvas layout) */}
              {activeTab === 'dai_nguyen' && (
                <div className="py-2 space-y-4 animate-fade-in">
                  <p className="text-[15px] font-medium text-[#78531E] leading-relaxed">
                    {selectedBuddha.daiNguyen.summary}
                  </p>

                  <ol className="space-y-3">
                    {selectedBuddha.daiNguyen.vows.map((vow, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[15px] text-[#2E1E0F]">
                        <span className="font-bold text-[#78531E] shrink-0 min-w-[20px]">
                          {idx + 1}.
                        </span>
                        <p className="leading-relaxed flex-1">{vow}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tab 3: THẦN CHÚ (Open borderless canvas layout) */}
              {activeTab === 'than_chu' && (
                <div className="py-2 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[15px] font-bold text-[#78531E]">
                        {selectedBuddha.thanChu.name}
                      </h4>
                      <p className="text-xs text-[#6B533B]">Chân ngôn uy lực mầu nhiệm</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyMantra}
                      className="text-[#8C5500] hover:text-[#2E1E0F] p-2 rounded-full bg-[#EFECE5] text-xs font-medium flex items-center gap-1 active:scale-95 transition-all"
                      title="Sao chép thần chú"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Sanskrit Mantra */}
                  <div className="text-center space-y-1.5 py-2">
                    <span className="text-[11px] uppercase font-bold text-[#78531E] tracking-widest block">
                      Phạn Văn (Sanskrit Mantra)
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold text-[#2E1E0F] leading-relaxed select-all">
                      {selectedBuddha.thanChu.sanskrit}
                    </p>
                  </div>

                  {/* Vietnamese Phonetic */}
                  <div className="text-center space-y-1.5">
                    <span className="text-[11px] uppercase font-bold text-[#6B533B] tracking-widest block">
                      Phiên Âm Tụng Đọc
                    </span>
                    <p className="font-mono text-sm font-semibold text-[#2E1E0F] leading-relaxed select-all">
                      {selectedBuddha.thanChu.vietnamese}
                    </p>
                  </div>

                  {/* Meaning & Benefits */}
                  <div className="space-y-4 pt-1">
                    <div>
                      <h5 className="text-[15px] font-bold text-[#78531E] mb-1">
                        Ý Nghĩa Chân Ngôn
                      </h5>
                      <p className="text-[15px] text-[#2E1E0F] leading-relaxed">
                        {selectedBuddha.thanChu.meaning}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[15px] font-bold text-[#78531E] mb-1">
                        Công Đức &amp; Lợi Ích Trì Tụng
                      </h5>
                      <p className="text-[15px] text-[#2E1E0F] leading-relaxed">
                        {selectedBuddha.thanChu.benefits}
                      </p>
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

