'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { BUDDHAS_DATA, type BuddhaItem } from '@/data/buddhasData';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { useDharmaStore } from '@/store/useDharmaStore';
import { TempleBellIcon } from '@/components/icons/DharmaMinimalIcons';
import { MantraKineticPlayer } from '@/components/buddhas/MantraKineticPlayer';
import { CenterToast } from '@/components/ui/CenterToast';
import { cn } from '@/lib/utils';

type DetailTab = 'tieu_su' | 'dai_nguyen' | 'than_chu';

function BonTonLibraryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams?.get('id');

  const addMeritEntry = useDharmaStore((s) => s.addMeritEntry);

  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaItem | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('tieu_su');
  const [mantraPlayTrigger, setMantraPlayTrigger] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!idParam) return;
    const found = BUDDHAS_DATA.find((b) => b.id === idParam);
    if (found) {
      setSelectedBuddha(found);
      setActiveTab('tieu_su');
      setMantraPlayTrigger(0);
    }
  }, [idParam]);

  const handleSelectBuddha = (buddha: BuddhaItem) => {
    playBellSound(0.25);
    setSelectedBuddha(buddha);
    setActiveTab('tieu_su');
    setMantraPlayTrigger(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setMantraPlayTrigger(0);
    setSelectedBuddha(null);
    if (idParam) {
      router.replace('/thu-vien-bon-ton', { scroll: false });
    }
  };

  const handleMantraCompleted = () => {
    if (!selectedBuddha) return;
    addMeritEntry({
      category: 'NIEM_PHAT',
      title: `Hoàn tất 1 biến Trì Chú ${selectedBuddha.name}`,
      dedicationText: `Nhất tâm trì tụng trọn biến: ${selectedBuddha.thanChu.name}. Nguyện hồi hướng bình an & trí tuệ.`,
    });
    showToast(`Hoan hỷ viên mãn 1 biến ${selectedBuddha.thanChu.name} • Đã ghi Sổ Công Đức`);
  };

  const handleChantMantra = () => {
    if (!selectedBuddha) return;
    playGrandTempleBellSound(0.45);
    addMeritEntry({
      category: 'NIEM_PHAT',
      title: `Chiêm Bái & Trì Chú ${selectedBuddha.name}`,
      dedicationText: `Nhất tâm trì tụng: ${selectedBuddha.thanChu.name}. Nguyện hồi hướng bình an & trí tuệ.`,
    });
    showToast(`Hoan hỷ trì niệm ${selectedBuddha.name} • Đã ghi vào Sổ Công Đức`);
  };

  const handleCopyMantra = async () => {
    if (!selectedBuddha) return;
    const text = `${selectedBuddha.name}\n${selectedBuddha.thanChu.name}\nPhạn văn: ${selectedBuddha.thanChu.sanskrit}\nPhiên âm: ${selectedBuddha.thanChu.vietnamese}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      showToast('Đã sao chép Chân Ngôn');
    } catch {
      showToast('Không thể sao chép trên trình duyệt này');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <CenterToast message={toastMessage} icon="sparkles" />

      {!selectedBuddha ? (
        /* =================================================================== */
        /* GRID VIEW: 18 BỔN TÔN (LIGHT WARM GOLD & WHITE COMPACT CARDS)       */
        /* =================================================================== */
        <div className="max-w-5xl mx-auto px-3 sm:px-5 pt-3 pb-10 space-y-3.5">
          <header className="flex items-center justify-between gap-2 py-1.5">
            <button
              type="button"
              onClick={() => router.push('/thuc-hanh')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EAD7A7] text-[#8A5400] hover:border-[#C58C1B] text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              aria-label="Quay lại Đạo Tràng"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Quay lại</span>
            </button>

            <h1 className="text-base sm:text-lg font-bold text-[#2C1E10] tracking-tight whitespace-nowrap truncate">
              Liên Hoa Bảo Điện (18 Vị)
            </h1>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF6DC] border border-[#EAD7A7] text-[#8A5400] whitespace-nowrap shrink-0">
              18 Bổn Tôn
            </span>
          </header>

          <section aria-label="Danh sách 18 Tôn Tượng Phật và Bồ Tát">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
              {BUDDHAS_DATA.map((buddha) => (
                <button
                  key={buddha.id}
                  type="button"
                  onClick={() => handleSelectBuddha(buddha)}
                  className="group rounded-2xl overflow-hidden border border-[#EAD7A7] hover:border-[#C58C1B] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col bg-white active:scale-[0.98] text-center"
                >
                  {/* Warm Ivory Artwork Box */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3E0] flex items-center justify-center">
                    <img
                      src={buddha.image}
                      alt={buddha.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Single-Line Caption Bar — Never Wraps Awkwardly */}
                  <div className="w-full bg-[#FFFBF2] border-t border-[#F0E2BE] px-2 py-2 flex items-center justify-center">
                    <h2 className="text-[11px] sm:text-xs font-bold text-[#2C1E10] group-hover:text-[#9A6200] transition-colors whitespace-nowrap truncate w-full">
                      {buddha.name.replace(/^Đức Phật\s+/i, 'Phật ').replace(/\s+Bồ Tát$/i, '')}
                    </h2>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* =================================================================== */
        /* DETAIL VIEW: 1. TIỂU SỬ • 2. ĐẠI NGUYỆN • 3. THẦN CHÚ              */
        /* =================================================================== */
        <div className="max-w-3xl mx-auto px-3 sm:px-5 pt-2.5 pb-10 space-y-3.5 animate-fade-in">
          <header className="flex items-center justify-between gap-2 py-2 sticky top-0 bg-[#FAF7F0]/95 backdrop-blur-md z-30 border-b border-[#EAD7A7]">
            <button
              type="button"
              onClick={handleBackToGrid}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#EAD7A7] text-[#8A5400] hover:border-[#C58C1B] text-xs font-bold active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              aria-label="Quay lại danh sách 18 Bổn Tôn"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Quay lại</span>
            </button>

            <div className="min-w-0 text-center flex-1 px-1">
              <h1 className="text-sm sm:text-base font-bold text-[#2C1E10] whitespace-nowrap truncate">
                {selectedBuddha.name}
              </h1>
              <p className="text-[10px] text-[#7D6442] whitespace-nowrap truncate">
                {selectedBuddha.sanskrit}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBackToGrid}
              className="text-xs font-bold text-[#8A5400] px-3 py-1.5 rounded-xl bg-[#FFF6DC] border border-[#EAD7A7] hover:border-[#C58C1B] shrink-0 cursor-pointer whitespace-nowrap"
            >
              Đổi vị
            </button>
          </header>

          {/* Hero Sacred Plaque */}
          <div className="rounded-2xl p-4 bg-white border border-[#EAD7A7] shadow-xs flex flex-col sm:flex-row gap-3.5 items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#D4A024] shadow-sm shrink-0 bg-[#FAF3E0]">
              <img
                src={selectedBuddha.image}
                alt={selectedBuddha.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0 w-full">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF6DC] border border-[#EAD7A7] text-[10px] font-bold text-[#8A5400] whitespace-nowrap max-w-full truncate">
                {selectedBuddha.realm}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#2C1E10] whitespace-nowrap truncate">
                {selectedBuddha.name}
              </h2>
              <p className="text-xs text-[#6B5438] leading-snug line-clamp-2">
                <strong className="text-[#8A5400]">Pháp bảo:</strong> {selectedBuddha.symbol}
              </p>

              {/* Side-by-side single-line buttons */}
              <div className="pt-1.5 grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={handleChantMantra}
                  className="py-2.5 px-2.5 rounded-xl bg-[#C58C1B] text-white hover:bg-[#A6730E] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap truncate">Trì Niệm Công Đức</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMantra}
                  className="py-2.5 px-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAD7A7] hover:border-[#C58C1B] text-[#5C4428] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-[#9A6200] shrink-0" />
                  )}
                  <span className="whitespace-nowrap truncate">
                    {isCopied ? 'Đã Sao Chép' : 'Chép Chân Ngôn'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Pillar Tabs Switcher — Strictly Single-Line (`whitespace-nowrap`) */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#FFF6DC] border border-[#EAD7A7]">
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
                    if (tab.id === 'than_chu') {
                      setActiveTab('than_chu');
                      setMantraPlayTrigger((n) => n + 1);
                    } else {
                      playBellSound(0.2);
                      setActiveTab(tab.id as DetailTab);
                    }
                  }}
                  className={cn(
                    'py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap',
                    isActive
                      ? 'bg-[#C58C1B] text-white shadow-xs'
                      : 'text-[#6E5536] hover:text-[#2C1E10]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: TIỂU SỬ */}
          {activeTab === 'tieu_su' && (
            <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#EAD7A7] space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F2E5C7]">
                <div className="w-8 h-8 rounded-xl bg-[#FFF6DC] border border-[#EAD7A7] flex items-center justify-center text-[#8A5400] shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#2C1E10] whitespace-nowrap truncate">
                    Tiểu Sử &amp; Cội Nguồn Kinh Điển
                  </h3>
                  <p className="text-[11px] text-[#7D6442] whitespace-nowrap truncate">
                    Hành trạng hóa độ &amp; xuất xứ chính thống
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
                <div className="p-3.5 rounded-xl bg-[#FFFBF2] border border-[#F0E2BE] space-y-1">
                  <span className="font-bold text-[#8A5400] text-[11px] uppercase tracking-wider block">
                    Xuất Xứ &amp; Căn Bản Kinh Điển
                  </span>
                  <p className="text-[#4A3620]">{selectedBuddha.tieuSu.origin}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFBF2] border border-[#F0E2BE] space-y-1">
                  <span className="font-bold text-[#8A5400] text-[11px] uppercase tracking-wider block">
                    Hành Trạng &amp; Tích Hóa Độ
                  </span>
                  <p className="text-[#4A3620]">{selectedBuddha.tieuSu.story}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFBF2] border border-[#F0E2BE] space-y-1">
                  <span className="font-bold text-[#8A5400] text-[11px] uppercase tracking-wider block">
                    Ý Nghĩa Biểu Pháp
                  </span>
                  <p className="text-[#4A3620]">{selectedBuddha.tieuSu.meaning}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐẠI NGUYỆN */}
          {activeTab === 'dai_nguyen' && (
            <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#EAD7A7] space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F2E5C7]">
                <div className="w-8 h-8 rounded-xl bg-[#FFF6DC] border border-[#EAD7A7] flex items-center justify-center text-[#8A5400] shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#2C1E10] whitespace-nowrap truncate">
                    Bổn Nguyện &amp; Lời Thệ Nguyện
                  </h3>
                  <p className="text-[11px] text-[#7D6442] whitespace-nowrap truncate">
                    Đại nguyện cứu độ muôn loài trong pháp giới
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#8A5400] italic leading-relaxed">
                {selectedBuddha.daiNguyen.summary}
              </p>

              <div className="space-y-2">
                {selectedBuddha.daiNguyen.vows.map((vow, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FFFBF2] border border-[#F0E2BE] flex items-start gap-2.5 text-xs sm:text-sm text-[#3D2914]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#FFF0C2] text-[#8A5400] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#E2C275]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed flex-1">{vow}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THẦN CHÚ */}
          {activeTab === 'than_chu' && (
            <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#EAD7A7] space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F2E5C7]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF6DC] border border-[#EAD7A7] flex items-center justify-center text-[#8A5400] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#2C1E10] whitespace-nowrap truncate">
                      {selectedBuddha.thanChu.name}
                    </h3>
                    <p className="text-[11px] text-[#7D6442] whitespace-nowrap truncate">
                      Chân ngôn uy lực mầu nhiệm
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyMantra}
                  className="p-2 rounded-xl border border-[#EAD7A7] bg-[#FFFBF2] text-[#8A5400] cursor-pointer shrink-0"
                  title="Sao chép thần chú"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <MantraKineticPlayer
                buddhaId={selectedBuddha.id}
                sanskritDefault={selectedBuddha.thanChu.sanskrit}
                vietnameseDefault={selectedBuddha.thanChu.vietnamese}
                meaningDefault={selectedBuddha.thanChu.meaning}
                benefitsDefault={selectedBuddha.thanChu.benefits}
                playTrigger={mantraPlayTrigger}
                onCompleted={handleMantraCompleted}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ThuVienBonTonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-sm font-bold text-[#8A5400]">
          Đang khai mở Liên Hoa Bảo Điện...
        </div>
      }
    >
      <BonTonLibraryInner />
    </Suspense>
  );
}
