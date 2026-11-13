'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Info,
  MessageSquare,
  Sparkles,
  Trash2,
  Edit3,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
import { SanctuaryFullscreenBackdrop } from '@/components/dharma/SanctuaryFullscreenBackdrop';
import { useDharmaStore } from '@/store/useDharmaStore';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

function PrayingHandsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || 'w-5 h-5'}>
      <path d="M12 2.5c-.6 0-1.1.4-1.3 1l-2.3 7.5c-.3 1 .1 2.1.9 2.7l1.7 1.3V20a1 1 0 0 0 2 0v-5l1.7-1.3c.8-.6 1.2-1.7.9-2.7L13.3 3.5c-.2-.6-.7-1-1.3-1z" />
    </svg>
  );
}

interface CauAnPrayerItem {
  id: string;
  user_id: string;
  dharma_name: string;
  sender_name: string;
  target_name: string;
  target_info: string;
  category: string;
  content: string;
  co_pray_count: number;
  created_at: string;
}

const CAU_AN_CATEGORIES = [
  'Bình an gia đạo',
  'Sức khỏe cha mẹ',
  'Tiêu trừ bệnh khổ',
  'Quốc thái dân an',
  'Công việc hanh thông',
];

function formatRelativeTimeVi(iso: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (diffSec < 60) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch {
    return 'Hôm nay';
  }
}

export default function CauNguyenPage() {
  const router = useRouter();
  const { profile, addPrayerLamp, addMeritEntry } = useDharmaStore();

  const [prayers, setPrayers] = useState<CauAnPrayerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [dharmaName, setDharmaName] = useState(profile.dharmaName || 'Phật tử Thiện Tâm');
  const [targetName, setTargetName] = useState('Song thân phụ mẫu & Gia quyến');
  const [selectedCategory, setSelectedCategory] = useState(CAU_AN_CATEGORIES[0]);
  const [showDetailInputs, setShowDetailInputs] = useState(false);

  // Full-Screen sub-views (Requirement #9)
  const [isHistoryPageOpen, setIsHistoryPageOpen] = useState(false);
  const [isInfoPageOpen, setIsInfoPageOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingTarget, setEditingTarget] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const fetchPrayers = useCallback(async () => {
    try {
      const res = await fetch('/api/dharma/prayers?room=cau_an', { cache: 'no-store' });
      const data = await res.json();
      if (data.ok && Array.isArray(data.prayers)) {
        setPrayers(data.prayers);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayers();

    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/dharma/prayers/stream');
      es.onmessage = (e) => {
        try {
          const evt = JSON.parse(e.data);
          if (evt.roomType && evt.roomType !== 'cau_an') return;
          if (
            evt.type === 'prayer_created' ||
            evt.type === 'prayer_updated' ||
            evt.type === 'prayer_deleted' ||
            evt.type === 'prayer_coprayed'
          ) {
            fetchPrayers();
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // fallback polling
    }

    const pollId = setInterval(fetchPrayers, 12000);
    return () => {
      es?.close();
      clearInterval(pollId);
    };
  }, [fetchPrayers]);

  const myPrayers = prayers.filter(
    (p) => p.user_id === 'phat-tu-local' || p.dharma_name === dharmaName
  );

  const handleSendPrayer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) {
      showToast('Xin hãy nhập lời nguyện cầu bình an');
      return;
    }

    playGrandTempleBellSound(0.5);
    setInputText('');

    try {
      const res = await fetch('/api/dharma/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_type: 'cau_an',
          user_id: 'phat-tu-local',
          dharma_name: dharmaName.trim() || 'Phật tử Thiện Tâm',
          sender_name: dharmaName.trim() || 'Phật tử Thiện Tâm',
          target_name: targetName.trim() || 'Gia đạo bình an',
          target_info: selectedCategory,
          category: selectedCategory,
          content: trimmed,
        }),
      });
      const data = await res.json();
      if (data.ok && data.prayer) {
        setPrayers((prev) => [data.prayer, ...prev.filter((x) => x.id !== data.prayer.id)]);
      }
    } catch {
      // handled on poll
    }

    recordDharmaMerit({
      type: 'cau-an',
      title: `Dâng Lời Cầu An (${selectedCategory})`,
      detail: trimmed.slice(0, 90),
      meritPoints: 15,
    });
    addPrayerLamp({
      type: 'CAU_AN',
      senderName: dharmaName || 'Phật tử Thiện Tâm',
      recipientName: targetName || 'Gia đạo bình an',
      wishContent: trimmed,
    });
    addMeritEntry({
      category: 'HUONG_DANG',
      title: `Dâng Lời Cầu An (${selectedCategory})`,
      dedicationText: trimmed.slice(0, 100),
    });

    showToast('Đã gửi lời nguyện Cầu An • +15 Công Đức');
  };

  const handleCoPray = async (id: string) => {
    if (likedMap[id]) return;
    playBellSound(0.28);
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setPrayers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, co_pray_count: Number(item.co_pray_count || 0) + 1 } : item
      )
    );
    showToast('Bạn đã gửi tâm từ bi cùng hộ niệm bình an');

    try {
      await fetch('/api/dharma/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copray',
          prayerId: id,
          actorId: 'phat-tu-local',
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleDeleteMyPrayer = async (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    showToast('Đã xóa lời cầu an');
    try {
      await fetch(`/api/dharma/prayers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
  };

  const handleSaveEdit = async (item: CauAnPrayerItem) => {
    if (!editingText.trim()) return;
    const nextContent = editingText.trim();
    const nextTarget = editingTarget.trim() || item.target_name;
    setEditingId(null);

    setPrayers((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, content: nextContent, target_name: nextTarget } : p
      )
    );
    showToast('Đã cập nhật lời cầu an');

    try {
      await fetch('/api/dharma/prayers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          dharma_name: item.dharma_name,
          sender_name: item.sender_name,
          target_name: nextTarget,
          target_info: item.target_info,
          category: item.category,
          content: nextContent,
        }),
      });
    } catch {
      // ignore
    }
  };

  const totalCoPraySum = prayers.reduce((acc, p) => acc + Number(p.co_pray_count || 0), 0);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] z-[90] bg-[#FAF6E8] text-[#2C1E10] flex flex-col justify-between overflow-hidden select-none">
      {/* Full-Screen Sacred Avalokiteshvara Bodhisattva Silk Painting Backdrop */}
      <SanctuaryFullscreenBackdrop
        mobileSrc="/images/cau-an-fullscreen-mobile.jpg"
        desktopSrc="/images/cau-an-fullscreen-desktop.jpg"
        alt="Đức Bồ Tát Quán Thế Âm"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-4 z-[999999] flex justify-center pointer-events-none animate-fade-in-down">
          <div className="px-4 py-2.5 rounded-2xl bg-[#FFFDF8] text-[#2C1E10] text-xs sm:text-sm font-bold shadow-lg border border-[#D9A02E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C68B19] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR                                                         */}
      {/* ========================================================================= */}
      <header className="relative z-30 h-14 px-3.5 sm:px-6 bg-[#FFFDF8]/85 backdrop-blur-md border-b border-[#EAD7A7]/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => router.push('/thuc-hanh')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-serif text-base sm:text-lg font-bold text-[#2C1E10] tracking-wide whitespace-nowrap truncate">
            Phòng Cầu An
          </h1>
          <p className="text-[10px] font-semibold text-emerald-700 whitespace-nowrap">
            ● {prayers.length} lời cầu an
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playBellSound(0.3);
            setIsHistoryPageOpen(true);
          }}
          className="relative w-10 h-10 rounded-xl bg-[#FFF6DF] hover:bg-[#FCECC2] text-[#7A5000] border border-[#E5C67E] flex items-center justify-center active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
          title="Quản lý lời cầu an của bạn"
        >
          <PrayingHandsIcon className="w-5 h-5 text-[#7A5000]" />
          {myPrayers.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D9A02E] text-[#2C1E10] text-[9.5px] font-bold flex items-center justify-center border border-white">
              {myPrayers.length}
            </span>
          )}
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. FLOATING RIGHT UTILITY BUTTONS                                         */}
      {/* ========================================================================= */}
      <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#FFFDF8]/95 border border-[#EAD7A7] flex items-center justify-center text-[#8C5500] shadow-md">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#7A5000] bg-[#FFFDF8]/90 px-1.5 py-0.2 rounded-full border border-[#EAD7A7] mt-0.5 whitespace-nowrap">
            {totalCoPraySum.toLocaleString('vi-VN')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            playBellSound(0.2);
            setIsInfoPageOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-[#FFFDF8]/95 border border-[#EAD7A7] flex items-center justify-center text-[#8C5500] hover:bg-[#FFF6DF] active:scale-95 transition-all shadow-md cursor-pointer"
          title="Thông tin Phòng Cầu An"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. REAL-TIME PRAYER STREAM                                                */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end">
        <main className="max-h-[38dvh] overflow-y-auto no-scrollbar pl-3.5 pr-16 sm:px-6 pb-2 pt-3 space-y-2.5 max-w-lg mx-auto w-full">
          {isLoading ? (
            <div className="p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#EAD7A7] text-center text-xs text-[#6B533B]">
              Đang tải lời cầu an...
            </div>
          ) : (
            prayers.slice(0, 25).map((p) => {
              const isLiked = likedMap[p.id];
              const isMine = p.user_id === 'phat-tu-local' || p.dharma_name === dharmaName;
              return (
                <div
                  key={p.id}
                  className={cn(
                    'rounded-2xl p-3 sm:p-3.5 backdrop-blur-md border shadow-xs transition-all',
                    isMine
                      ? 'bg-[#FFF9EB]/95 border-[#D9A02E] text-[#2C1E10]'
                      : 'bg-[#FFFFFF]/90 border-[#EAD7A7] text-[#2C1E10]'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FFE07D] to-[#F5C542] text-[#3D2505] border border-[#D9A02E] flex items-center justify-center text-xs shrink-0">
                        <LotusMinimalIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-xs font-bold text-[#8C5500] whitespace-nowrap truncate">
                            {p.dharma_name}
                          </h2>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[#7A5000] font-semibold whitespace-nowrap shrink-0">
                            {p.category || 'Cầu an'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B533B] block whitespace-nowrap truncate">
                          Cầu an: {p.target_name || 'Gia đạo'} • {formatRelativeTimeVi(p.created_at)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCoPray(p.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap border',
                        isLiked
                          ? 'bg-[#FFE07D] text-[#3D2505] border-[#D9A02E]'
                          : 'bg-[#FFF6DF] text-[#7A5000] border-[#EAD7A7] hover:bg-[#FCECC2]'
                      )}
                    >
                      <Heart className={cn('w-3 h-3', isLiked && 'fill-current text-[#B45309]')} />
                      <span>Cùng cầu an ({p.co_pray_count})</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#2C1E10] leading-relaxed mt-1.5">
                    {p.content}
                  </p>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM INPUT BAR                                                       */}
      {/* ========================================================================= */}
      <footer className="relative z-20 shrink-0 dharma-input-panel-lock pb-3 pt-2 px-3.5 sm:px-6 bg-[#FFFDF8]/90 backdrop-blur-md border-t border-[#EAD7A7]/85 space-y-2">
        <div className="max-w-lg mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CAU_AN_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border',
                selectedCategory === cat
                  ? 'bg-[#FFE07D] text-[#3D2505] border-[#D9A02E]'
                  : 'bg-[#FAF7F0] text-[#6B533B] border-[#EAD7A7]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {showDetailInputs && (
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-2 animate-fade-in">
            <input
              type="text"
              value={dharmaName}
              onChange={(e) => setDharmaName(e.target.value)}
              placeholder="Pháp danh / Tên bạn"
              className="px-3 py-2 min-h-[40px] rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-base sm:text-xs text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="Cầu an cho ai (Cha mẹ, gia quyến...)"
              className="px-3 py-2 min-h-[40px] rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-base sm:text-xs text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />
          </div>
        )}

        <form onSubmit={handleSendPrayer} className="max-w-lg mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetailInputs((v) => !v)}
            className="p-2.5 rounded-full bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] shrink-0 cursor-pointer"
            title="Điền Pháp danh & Người được cầu an"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Viết lời nguyện cầu bình an..."
            className="flex-1 bg-[#FAF7F0] text-[#2C1E10] placeholder:text-[#8E775B] text-base sm:text-sm px-4 py-2.5 rounded-full border border-[#EAD7A7] outline-none focus:border-[#C68B19] transition-all min-w-0"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <LotusMinimalIcon className="w-4 h-4 text-[#3D2505] shrink-0" />
            <span>Gửi cầu an</span>
          </button>
        </form>
      </footer>

      {/* ========================================================================= */}
      {/* FULL-SCREEN PAGE 1: QUẢN LÝ CẦU AN CỦA BẠN                                */}
      {/* ========================================================================= */}
      {isHistoryPageOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsHistoryPageOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Quản Lý Cầu An Của Bạn ({myPrayers.length})
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-3">
            {myPrayers.length === 0 ? (
              <div className="py-14 px-4 bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] mx-auto flex items-center justify-center text-[#8C5500]">
                  <LotusMinimalIcon className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#2C1E10]">Chưa Có Lời Cầu An Nào</h4>
                <p className="text-xs text-[#6B533B] leading-relaxed max-w-xs mx-auto">
                  Hãy viết lời nguyện cầu bình an ở thanh bên dưới để cùng đại chúng hộ niệm.
                </p>
              </div>
            ) : (
              myPrayers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B533B]">
                    <span className="font-bold text-[#8C5500] truncate">
                      Cầu an: {item.target_name} • {formatRelativeTimeVi(item.created_at)}
                    </span>
                    <span className="font-bold flex items-center gap-1 text-[#8C5500] shrink-0 whitespace-nowrap">
                      <Heart className="w-3.5 h-3.5 fill-current text-[#D9A02E]" />
                      {item.co_pray_count} hộ niệm
                    </span>
                  </div>

                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingTarget}
                        onChange={(e) => setEditingTarget(e.target.value)}
                        placeholder="Người được cầu an"
                        className="w-full text-base sm:text-xs p-2.5 rounded-xl border border-[#D9A02E] outline-none bg-[#FAF7F0] text-[#2C1E10]"
                      />
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full text-base sm:text-xs p-2.5 rounded-xl border border-[#D9A02E] outline-none bg-[#FAF7F0] text-[#2C1E10] resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-xl border border-[#EAD7A7] text-xs font-semibold text-[#6B533B]"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] font-bold text-xs cursor-pointer"
                        >
                          Lưu cập nhật
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-[#2C1E10] leading-relaxed">
                      {item.content}
                    </p>
                  )}

                  {editingId !== item.id && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAD7A7]/60">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingText(item.content);
                          setEditingTarget(item.target_name);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMyPrayer(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-SCREEN PAGE 2: GIỚI THIỆU PHÒNG CẦU AN DHARMA                        */}
      {/* ========================================================================= */}
      {isInfoPageOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in">
          <header className="shrink-0 h-14 px-4 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsInfoPageOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
              Giới Thiệu Phòng Cầu An DHARMA
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-lg mx-auto w-full space-y-4">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] p-5 space-y-4 text-xs sm:text-sm leading-relaxed text-[#2C1E10] shadow-2xs">
              <p>
                Chào mừng quý Phật tử đến với <strong className="text-[#8C5500]">Phòng Cầu An DHARMA</strong> — nơi đại chúng cùng hướng tâm về Đức Phật Dược Sư Lưu Ly Quang Vương và Đức Bồ Tát Quán Thế Âm để cầu nguyện sức khỏe, bình an cho cha mẹ, gia quyến và muôn loài.
              </p>
              <p>
                Quý Phật tử có thể chạm <strong className="text-[#8C5500]">“Cùng cầu an”</strong> trên mỗi lời nguyện để gửi tâm từ bi hộ niệm và cộng hưởng năng lượng an lành.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
