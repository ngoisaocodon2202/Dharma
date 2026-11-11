'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Sparkles,
  Check,
  Share2,
  X,
} from 'lucide-react';
import { BUDDHAS_DATA, BuddhaItem } from '@/data/buddhasData';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { LotusMinimalIcon, TempleBellIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

type DetailTab = 'tieu_su' | 'dai_nguyen' | 'than_chu';

export default function ThuVienBonTonPage() {
  const router = useRouter();
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaItem | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('tieu_su');
  const [chantCount, setChantCount] = useState<Record<string, number>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectBuddha = (buddha: BuddhaItem) => {
    playBellSound(0.35);
    setSelectedBuddha(buddha);
    setActiveTab('tieu_su');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    showToast(`Nam Mô ${selectedBuddha.name} • Đã trì tụng (${newCount} biến)`);
  };

  const handleCopyMantra = () => {
    if (!selectedBuddha) return;
    const text = `${selectedBuddha.thanChu.name}\nPhạn văn: ${selectedBuddha.thanChu.sanskrit}\nPhiên âm: ${selectedBuddha.thanChu.vietnamese}\nÝ nghĩa: ${selectedBuddha.thanChu.meaning}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Đã sao chép Thần Chú & Ý nghĩa');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2E1E0F] selection:bg-[#F5C542]/30 selection:text-[#8C5500]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 inset-x-4 z-50 flex justify-center pointer-events-none animate-fade-in-down">
          <div className="px-4 py-2.5 rounded-2xl bg-[#241B0B]/95 text-white text-xs sm:text-sm font-medium shadow-2xl border border-[#ECD9A8] backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD966] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: FULL-PAGE 18 BUDDHAS & BODHISATTVAS GRID (MATCHING USER SCREENSHOT) */}
      {/* ========================================================================= */}
      {!selectedBuddha ? (
        <div className="max-w-md sm:max-w-2xl lg:max-w-6xl mx-auto px-3 sm:px-6 pt-2 pb-16 space-y-3">
          {/* Top Bar Header with Back Button (Exactly matching user app screenshot) */}
          <header className="flex items-center justify-between gap-3 pt-2 pb-2 sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-md z-30">
            <button
              type="button"
              onClick={() => router.push('/thuc-hanh')}
              className="w-10 h-10 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#2E1E0F] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
              title="Trở về Phương Tiện Tu Tập"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="font-heading font-serif text-lg sm:text-xl font-bold text-[#2E1E0F] tracking-wide text-center whitespace-nowrap flex-1">
              Phật &amp; Bồ Tát
            </h1>

            {/* Empty balance spacer to perfectly center the title */}
            <div className="w-10 h-10 shrink-0" aria-hidden="true" />
          </header>

          {/* 18 Buddha Cards Grid (2 cols on mobile, 3 cols on tablet, 6 cols on desktop) */}
          <section aria-label="Danh sách 18 Tôn Tượng Phật và Bồ Tát">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {BUDDHAS_DATA.map((buddha) => (
                <div
                  key={buddha.id}
                  onClick={() => handleSelectBuddha(buddha)}
                  className="group rounded-2xl sm:rounded-3xl overflow-hidden border border-[#ECD9A8] hover:border-[#E5C158] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col bg-[#FDF9F0] active:scale-95 select-none"
                >
                  {/* High-Resolution Artwork Area */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3E0] flex items-center justify-center">
                    <img
                      src={buddha.image}
                      alt={buddha.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom Solid Dark Bar with Centered Name (NO WRAPPING - EXACT 1 LINE) */}
                  <div className="bg-[#241B0B] py-2.5 px-1.5 text-center flex items-center justify-center min-h-[42px] sm:min-h-[46px]">
                    <h2 className="font-heading font-serif text-[11px] sm:text-xs font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#FFE79A] transition-colors">
                      {buddha.name}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: FULL-PAGE DETAIL VIEW (1. TIỂU SỬ, 2. ĐẠI NGUYỆN, 3. THẦN CHÚ)     */
        /* ========================================================================= */
        <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-3.5 sm:px-6 pt-2 pb-16 space-y-4 animate-fade-in">
          {/* Detail Top Header with Back to 18 Buddhas Grid */}
          <header className="flex items-center justify-between gap-2.5 pt-2 pb-2 sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-md z-30 border-b border-[#EEDBBA]">
            <button
              type="button"
              onClick={() => setSelectedBuddha(null)}
              className="w-10 h-10 rounded-full bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center justify-center text-[#2E1E0F] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
              title="Quay lại danh sách 18 Bổn Tôn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 text-center flex-1 px-1">
              <h1 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500] whitespace-nowrap truncate">
                {selectedBuddha.title}
              </h1>
              <p className="text-[11px] text-[#7D6442] whitespace-nowrap truncate font-sans">
                {selectedBuddha.sanskrit}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBuddha(null)}
              className="text-xs font-bold text-[#8C5500] hover:text-[#2E1E0F] px-2.5 py-1.5 rounded-xl bg-white border border-[#ECD9A8] shrink-0 whitespace-nowrap"
            >
              Đổi vị
            </button>
          </header>

          {/* Buddha Presentation Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EA] to-[#FFF3D0] border border-[#ECD9A8] shadow-md flex flex-col sm:flex-row gap-5 items-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-[#E5C158] shadow-lg shrink-0 bg-[#FAF3E0]">
              <img
                src={selectedBuddha.image}
                alt={selectedBuddha.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                {selectedBuddha.realm}
              </div>
              <h2 className="font-heading font-serif text-xl sm:text-2xl font-bold text-[#2E1E0F]">
                {selectedBuddha.name}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#5A4329] leading-relaxed">
                <strong className="text-[#8C5500]">Pháp bảo &amp; Biểu tượng:</strong> {selectedBuddha.symbol}
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={handleChantMantra}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <TempleBellIcon className="w-4 h-4 shrink-0" />
                  <span>Trì Niệm (+10 Công Đức)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMantra}
                  className="px-4 py-2 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] text-[#8C5500] text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{isCopied ? 'Đã Sao Chép' : 'Chép Chân Ngôn'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Pillar Tabs Switcher (1. Tiểu Sử, 2. Đại Nguyện, 3. Thần Chú) */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8]">
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
                    'py-2.5 px-1 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                    isActive
                      ? 'bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] shadow-sm'
                      : 'text-[#7D6442] hover:text-[#2E1E0F]'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: 1. TIỂU SỬ */}
          {activeTab === 'tieu_su' && (
            <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2E5C7]">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500]">
                    Tiểu Sử &amp; Cội Nguồn Kinh Điển
                  </h3>
                  <p className="text-xs text-[#7D6442]">Hành trạng hóa độ &amp; xuất xứ chính thống</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-[#2E1E0F]">
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] space-y-1">
                  <span className="font-bold text-[#8C5500] text-xs uppercase tracking-wider block">
                    Xuất Xứ &amp; Căn Bản Kinh Điển
                  </span>
                  <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.tieuSu.origin}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] space-y-1">
                  <span className="font-bold text-[#8C5500] text-xs uppercase tracking-wider block">
                    Hành Trạng &amp; Tích Hóa Độ
                  </span>
                  <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.tieuSu.story}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] space-y-1">
                  <span className="font-bold text-[#8C5500] text-xs uppercase tracking-wider block">
                    Ý Nghĩa Biểu Pháp
                  </span>
                  <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.tieuSu.meaning}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 2. ĐẠI NGUYỆN */}
          {activeTab === 'dai_nguyen' && (
            <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2E5C7]">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500]">
                    Bổn Nguyện &amp; Lời Thệ Nguyện
                  </h3>
                  <p className="text-xs text-[#7D6442]">Đại nguyện cứu độ muôn loài trong pháp giới</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-[#8C5500] italic leading-relaxed">
                  {selectedBuddha.daiNguyen.summary}
                </p>

                <div className="space-y-2.5">
                  {selectedBuddha.daiNguyen.vows.map((vow, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] flex items-start gap-3 text-xs sm:text-[13px] text-[#3D2505]"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#FFF4D0] text-[#8C5500] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-[#ECD9A8]">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed flex-1">{vow}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3. THẦN CHÚ */}
          {activeTab === 'than_chu' && (
            <div className="rounded-3xl p-5 sm:p-6 bg-white border border-[#EEDBBA] shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2E5C7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500]">
                      {selectedBuddha.thanChu.name}
                    </h3>
                    <p className="text-xs text-[#7D6442]">Chân ngôn uy lực mầu nhiệm</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyMantra}
                  className="text-[#8C5500] hover:text-[#2E1E0F] p-2 rounded-xl border border-[#ECD9A8] bg-[#FFFDF7] text-xs font-medium flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                  title="Sao chép thần chú"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Sanskrit Mantra Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] border border-[#E5C158] text-center space-y-2 shadow-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#8C5500] tracking-widest block">
                  Phạn Văn (Sanskrit Mantra)
                </span>
                <p className="font-heading font-serif text-sm sm:text-lg font-bold text-[#8C5500] leading-relaxed select-all">
                  {selectedBuddha.thanChu.sanskrit}
                </p>
              </div>

              {/* Vietnamese Phonetic Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F2E5C7] text-center space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#7D6442] tracking-widest block">
                  Phiên Âm Tụng Đọc
                </span>
                <p className="font-mono text-xs sm:text-sm font-semibold text-[#2E1E0F] leading-relaxed select-all">
                  {selectedBuddha.thanChu.vietnamese}
                </p>
              </div>

              {/* Meaning & Benefits */}
              <div className="space-y-3 text-xs sm:text-[13px]">
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F2E5C7] space-y-1">
                  <span className="font-bold text-[#8C5500] block">Ý Nghĩa Chân Ngôn:</span>
                  <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.thanChu.meaning}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFFDF2] to-[#FFF9E6] border border-[#ECD9A8] space-y-1">
                  <span className="font-bold text-[#8C5500] block">Công Đức &amp; Lợi Ích Trì Tụng:</span>
                  <p className="text-[#5A4329] leading-relaxed">{selectedBuddha.thanChu.benefits}</p>
                </div>
              </div>

              {/* Interactive Button */}
              <button
                type="button"
                onClick={handleChantMantra}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <TempleBellIcon className="w-4 h-4 shrink-0" />
                <span>Thỉnh Chuông &amp; Trì Niệm (+10 Công Đức)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
