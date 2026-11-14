'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  LayoutGrid,
  Share2,
  Check,
} from 'lucide-react';
import { BUDDHAS_DATA, type BuddhaItem } from '@/data/buddhasData';
import { BON_TON_MANTRA_CONFIG } from '@/data/bonTonMantraAudio';
import { playSoftTabBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
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
  const [isMantraPlaying, setIsMantraPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mantraStageEl, setMantraStageEl] = useState<HTMLDivElement | null>(null);
  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);
  const handleMantraStageRef = useCallback((el: HTMLDivElement | null) => {
    setMantraStageEl(el);
  }, []);

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
      setMantraPlayTrigger((n) => n + 1);
    }
  }, [idParam]);

  const handleSelectBuddha = (buddha: BuddhaItem) => {
    const audio = sharedAudioRef.current;
    const cfg = BON_TON_MANTRA_CONFIG[buddha.id];
    if (audio && cfg?.audioUrl) {
      try {
        audio.pause();
        audio.src = cfg.audioUrl;
        audio.currentTime = 0;
        audio.load();
        // Trigger playback synchronously inside user click gesture so audio & syllables start locked together
        audio.play().catch(() => {});
      } catch {
        // Fallback handled inside MantraKineticPlayer if browser defers load
      }
    }
    setSelectedBuddha(buddha);
    setActiveTab('tieu_su');
    setMantraPlayTrigger((n) => n + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    const audio = sharedAudioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {}
    }
    setMantraPlayTrigger(0);
    setIsMantraPlaying(false);
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
      <audio ref={sharedAudioRef} preload="auto" playsInline className="hidden" />

      {!selectedBuddha ? (
        /* =================================================================== */
        /* GRID VIEW: 18 BỔN TÔN (BORDERLESS SOFT WARM CARDS)                  */
        /* =================================================================== */
        <div className="max-w-5xl mx-auto px-3 sm:px-5 pt-3 pb-10 space-y-3.5">
          <header className="flex items-center justify-between gap-2 py-1.5">
            <button
              type="button"
              onClick={() => router.push('/thuc-hanh')}
              className="w-9 h-9 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#2C1E10] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Quay lại"
              title="Quay lại"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
            </button>

            <h1 className="text-base sm:text-lg font-bold text-[#2C1E10] tracking-tight whitespace-nowrap truncate">
              Liên Hoa Bảo Điện (18 Vị)
            </h1>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/[0.05] text-[#7D5822] whitespace-nowrap shrink-0">
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
                  className="group rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col bg-white active:scale-[0.98] text-center"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3E0] flex items-center justify-center">
                    <img
                      src={buddha.image}
                      alt={buddha.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="w-full bg-[#FFFDF9] px-2 py-2 flex items-center justify-center">
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
        /* DETAIL VIEW: CLEAN BORDERLESS EDITORIAL LAYOUT (IMAGE 2 STYLE)      */
        /* =================================================================== */
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-12 space-y-5 animate-fade-in">
          <header className="flex items-center justify-between gap-2 py-2.5 sticky top-0 bg-[#FAF7F0]/95 backdrop-blur-md z-30">
            <button
              type="button"
              onClick={handleBackToGrid}
              className="w-9 h-9 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#2C1E10] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Quay lại"
              title="Quay lại"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
            </button>

            <h1 className="text-base sm:text-lg font-bold text-[#2C1E10] text-center whitespace-nowrap truncate flex-1 px-2">
              {selectedBuddha.name}
            </h1>

            <button
              type="button"
              onClick={handleBackToGrid}
              className="w-9 h-9 rounded-full bg-white text-[#8A5400] hover:bg-[#FFF6DC] shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Đổi vị"
              title="Chọn vị Bổn Tôn khác"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </header>

          {/* Deity Content Wrapper + Full-View Kinetic Mantra Scatter Overlay */}
          <div className="relative space-y-5">
            <div
              ref={handleMantraStageRef}
              aria-hidden="true"
              data-mantra-stage="true"
              className="pointer-events-none absolute inset-0 overflow-x-clip z-20"
            />

            {/* Segmented Pill Switcher directly at top matching Image 2 */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-black/[0.06]">
              {[
                { id: 'tieu_su', label: 'Tiểu sử' },
                { id: 'dai_nguyen', label: 'Đại nguyện' },
                { id: 'than_chu', label: 'Thần chú' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      playSoftTabBellSound(0.2);
                      if (tab.id === 'than_chu') {
                        setActiveTab('than_chu');
                        if (!isMantraPlaying) {
                          setMantraPlayTrigger((n) => n + 1);
                        }
                      } else {
                        setActiveTab(tab.id as DetailTab);
                      }
                    }}
                    className={cn(
                      'py-2 px-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap text-center',
                      isActive
                        ? 'bg-white text-[#2C1E10] font-bold shadow-xs'
                        : 'text-[#5C4A32] hover:text-[#2C1E10]'
                    )}
                  >
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prominent Borderless Buddha Portrait & Actions on Open Canvas */}
            <div className="flex flex-col items-center text-center space-y-3 pt-1">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(140,85,0,0.14)] bg-[#FAF3E0]">
                <img
                  src={selectedBuddha.image}
                  alt={selectedBuddha.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2.5 max-w-full">
                <p className="text-xs sm:text-sm font-semibold text-[#78531E] px-2">
                  {selectedBuddha.title}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleChantMantra}
                    className="py-2 px-4 rounded-full bg-[#C58C1B] text-white hover:bg-[#A6730E] font-bold text-xs inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Trì Niệm Công Đức</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMantra}
                    className="w-9 h-9 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#5C4428] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Sao chép chân ngôn"
                    aria-label="Chép chân ngôn"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* TAB 1: TIỂU SỬ — Open borderless typography directly on canvas (Image 2 style) */}
              {activeTab === 'tieu_su' && (
                <article className="order-2 space-y-5 text-[15px] leading-relaxed text-[#2C1E10]">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#78531E] text-base">Tên gọi</h3>
                    <p>
                      {selectedBuddha.name} ({selectedBuddha.title}) — Phạn hiệu:{' '}
                      <span className="italic text-[#5C4A32]">{selectedBuddha.sanskrit}</span>.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#78531E] text-base">Thế giới</h3>
                    <p>{selectedBuddha.realm}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#78531E] text-base">Xuất xứ &amp; Căn bản</h3>
                    <p>{selectedBuddha.tieuSu.origin}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#78531E] text-base">Hành trạng &amp; Tích hóa độ</h3>
                    <p>{selectedBuddha.tieuSu.story}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#78531E] text-base">Hình tượng &amp; Biểu pháp</h3>
                    <p>{selectedBuddha.symbol}. {selectedBuddha.tieuSu.meaning}</p>
                  </div>
                </article>
              )}

              {/* TAB 2: ĐẠI NGUYỆN — Open flowing vows directly on canvas */}
              {activeTab === 'dai_nguyen' && (
                <article className="order-1 space-y-4 text-[15px] leading-relaxed text-[#2C1E10]">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#78531E] text-base">
                      Bổn nguyện &amp; Lời thệ nguyện
                    </h3>
                    <p className="text-sm font-medium text-[#7D5822]">
                      {selectedBuddha.daiNguyen.summary}
                    </p>
                  </div>

                  <ol className="space-y-3">
                    {selectedBuddha.daiNguyen.vows.map((vow, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-xs text-[#8A5400] min-w-[20px] pt-1">
                          {idx + 1}.
                        </span>
                        <p className="flex-1 text-[#2C1E10]">{vow}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              )}

              {/* THẦN CHÚ (Mounted directly alongside Tiểu Sử & Thần Chú tabs without enclosed panels) */}
              <div
                className={cn(
                  'order-1 space-y-3',
                  activeTab === 'tieu_su' || activeTab === 'than_chu' ? 'block' : 'hidden'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#78531E]">
                      {selectedBuddha.thanChu.name}
                    </h3>
                  </div>
                </div>

                <MantraKineticPlayer
                  buddhaId={selectedBuddha.id}
                  sanskritDefault={selectedBuddha.thanChu.sanskrit}
                  vietnameseDefault={selectedBuddha.thanChu.vietnamese}
                  meaningDefault={selectedBuddha.thanChu.meaning}
                  benefitsDefault={selectedBuddha.thanChu.benefits}
                  playTrigger={mantraPlayTrigger}
                  externalAudioRef={sharedAudioRef}
                  portalContainer={mantraStageEl}
                  onPlayStateChange={setIsMantraPlaying}
                  onCompleted={handleMantraCompleted}
                />
              </div>
            </div>
          </div>
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
