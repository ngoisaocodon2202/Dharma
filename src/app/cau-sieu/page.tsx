'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Info,
  MessageSquare,
  Trash2,
  Edit3,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { CenterToast } from '@/components/ui/CenterToast';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
import { SanctuaryFullscreenBackdrop } from '@/components/dharma/SanctuaryFullscreenBackdrop';
import { useDharmaStore } from '@/store/useDharmaStore';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

function BowingDevoteeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || 'w-5 h-5'}>
      <circle cx="16.5" cy="5.5" r="2.2" />
      <path d="M14.8 9.2c-1.1 0-2.4.6-3.4 1.7-1 1-2.2 1.8-3.6 2l-2.4.3a1 1 0 0 0-.1 2l2.6.2c1.9 0 3.5-.8 4.8-2.2l1.2-1.3c.5-.6 1.2-1 2-1h1.5a1 1 0 1 0 0-2h-2.6z" />
      <path d="M5.5 16.2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h7.2c1.6 0 3.1-.7 4.1-1.9l1.4-1.8a1 1 0 1 0-1.6-1.2l-1.3 1.7c-.6.8-1.5 1.3-2.6 1.3H5.5z" />
    </svg>
  );
}

function ThreeIncenseSticksIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || 'w-4 h-4'}>
      <rect x="7" y="7" width="2" height="13" rx="1" />
      <rect x="11" y="4" width="2" height="16" rx="1" />
      <rect x="15" y="7" width="2" height="13" rx="1" />
      <path d="M5 20h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" />
      <circle cx="8" cy="5.5" r="1.2" opacity="0.9" />
      <circle cx="12" cy="2.5" r="1.2" opacity="0.9" />
      <circle cx="16" cy="5.5" r="1.2" opacity="0.9" />
    </svg>
  );
}

export interface CauSieuPrayerItem {
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

export default function CauSieuPage() {
  const router = useRouter();
  const { profile, addPrayerLamp, addMeritEntry } = useDharmaStore();

  const [prayers, setPrayers] = useState<CauSieuPrayerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [targetName, setTargetName] = useState('Cửu Huyền Thất Tổ & Chư Hương Linh');
  const [dharmaName, setDharmaName] = useState(profile.dharmaName || 'Phật tử Thiện Tâm');
  const [showDetailInputs, setShowDetailInputs] = useState(false);

  // Full-screen sub-views (Requirement #9)
  const [isHistoryPageOpen, setIsHistoryPageOpen] = useState(false);
  const [isInfoPageOpen, setIsInfoPageOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Edit state in user's prayer management screen
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingTarget, setEditingTarget] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const fetchPrayers = useCallback(async () => {
    try {
      const res = await fetch('/api/dharma/prayers?room=cau_sieu', { cache: 'no-store' });
      const data = await res.json();
      if (data.ok && Array.isArray(data.prayers)) {
        setPrayers(data.prayers);
      }
    } catch {
      // ignore transient error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + Real-Time SSE stream from PostgreSQL (/api/dharma/prayers/stream)
  useEffect(() => {
    fetchPrayers();

    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/dharma/prayers/stream');
      es.onmessage = (e) => {
        try {
          const evt = JSON.parse(e.data);
          if (evt.roomType && evt.roomType !== 'cau_sieu') return;
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
      showToast('Xin hãy nhập lời hồi hướng chí thành');
      return;
    }

    playGrandTempleBellSound(0.5);
    setInputText('');

    try {
      const res = await fetch('/api/dharma/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_type: 'cau_sieu',
          user_id: 'phat-tu-local',
          dharma_name: dharmaName.trim() || 'Phật tử Thiện Tâm',
          sender_name: dharmaName.trim() || 'Phật tử Thiện Tâm',
          target_name: targetName.trim() || 'Cửu Huyền Thất Tổ',
          target_info: 'Hồi hướng siêu sinh Tịnh Độ',
          category: 'Siêu độ gia tiên',
          content: trimmed,
        }),
      });
      const data = await res.json();
      if (data.ok && data.prayer) {
        setPrayers((prev) => [data.prayer, ...prev.filter((x) => x.id !== data.prayer.id)]);
      }
    } catch {
      // handled by optimistic / next poll
    }

    recordDharmaMerit({
      type: 'cau-sieu',
      title: 'Hồi Hướng Cầu Siêu Chư Hương Linh',
      detail: trimmed.slice(0, 90),
      meritPoints: 15,
    });
    addPrayerLamp({
      type: 'CAU_SIEU',
      senderName: dharmaName || 'Phật tử Thiện Tâm',
      recipientName: targetName || 'Cửu Huyền Thất Tổ',
      wishContent: trimmed,
    });
    addMeritEntry({
      category: 'HUONG_DANG',
      title: 'Hồi Hướng Cầu Siêu Phòng Địa Tạng',
      dedicationText: trimmed.slice(0, 100),
    });

    showToast('Đã gửi lời hồi hướng • +15 Công Đức');
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
    showToast('Bạn đã cùng hướng tâm hồi hướng thanh tịnh');

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
    showToast('Đã xóa lời hồi hướng');
    try {
      await fetch(`/api/dharma/prayers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
  };

  const handleSaveEdit = async (item: CauSieuPrayerItem) => {
    if (!editingText.trim()) return;
    const nextContent = editingText.trim();
    const nextTarget = editingTarget.trim() || item.target_name;
    setEditingId(null);

    setPrayers((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, content: nextContent, target_name: nextTarget } : p
      )
    );
    showToast('Đã cập nhật lời hồi hướng');

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
    <div className="fixed inset-0 w-screen h-[100dvh] z-[90] bg-[#FAF5E6] text-[#2C1E10] flex flex-col justify-between overflow-hidden select-none">
      {/* Full-Screen Sacred Ksitigarbha Bodhisattva Silk Painting Backdrop */}
      <SanctuaryFullscreenBackdrop
        mobileSrc="/images/cau-sieu-fullscreen-mobile.jpg"
        desktopSrc="/images/cau-sieu-fullscreen-desktop.jpg"
        alt="Đức Địa Tạng Vương Bồ Tát"
      />

      {/* Toast Notification */}
      <CenterToast message={toastMessage} icon="sparkles" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (SINGLE CLEAN MOBILE HEADER)                            */}
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
            Phòng Cầu Siêu
          </h1>
          <p className="text-[10px] font-semibold text-emerald-700 whitespace-nowrap">
            ● {prayers.length} lời hồi hướng
          </p>
        </div>

        {/* Right Button: Lịch sử lời hồi hướng của người dùng (Quản lý cầu siêu) */}
        <button
          type="button"
          onClick={() => {
            playBellSound(0.3);
            setIsHistoryPageOpen(true);
          }}
          className="relative w-10 h-10 rounded-xl bg-[#FFF6DF] hover:bg-[#FCECC2] text-[#7A5000] border border-[#E5C67E] flex items-center justify-center active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
          title="Quản lý lời hồi hướng cầu siêu của bạn"
        >
          <BowingDevoteeIcon className="w-5 h-5 text-[#7A5000]" />
          {myPrayers.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D9A02E] text-[#2C1E10] text-[9.5px] font-bold flex items-center justify-center border border-white">
              {myPrayers.length}
            </span>
          )}
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. FLOATING RIGHT UTILITY BUTTONS (💬 Tổng hộ niệm & ⓘ Hướng dẫn)         */}
      {/* ========================================================================= */}
      <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-2.5">
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
          title="Thông tin Phòng Cầu Siêu"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. REAL-TIME PRAYER CARDS STREAM (LIGHT GOLD & WHITE CARDS)               */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-end">
        <main className="max-h-[38dvh] overflow-y-auto no-scrollbar pl-3.5 pr-16 sm:px-6 pb-2 pt-3 space-y-2.5 max-w-lg mx-auto w-full">
          {isLoading ? (
            <div className="p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#EAD7A7] text-center text-xs text-[#6B533B]">
              Đang tải lời hồi hướng...
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
                          {isMine && (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-[#FFE07D] text-[#3D2505] font-bold shrink-0">
                              Của bạn
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#6B533B] block whitespace-nowrap truncate">
                          Hồi hướng: {p.target_name || 'Cửu Huyền Thất Tổ'} • {formatRelativeTimeVi(p.created_at)}
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
                      <span>Cùng hồi hướng ({p.co_pray_count})</span>
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
      {/* 4. BOTTOM INPUT BAR: VIẾT LỜI HỒI HƯỚNG & GỬI                             */}
      {/* ========================================================================= */}
      <footer className="relative z-20 shrink-0 dharma-input-panel-lock pb-3 pt-2 px-3.5 sm:px-6 bg-[#FFFDF8]/90 backdrop-blur-md border-t border-[#EAD7A7]/85 space-y-2">
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
              placeholder="Tên hương linh / người mất"
              className="px-3 py-2 min-h-[40px] rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-base sm:text-xs text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />
          </div>
        )}

        <form onSubmit={handleSendPrayer} className="max-w-lg mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetailInputs((v) => !v)}
            className="p-2.5 rounded-full bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] shrink-0 cursor-pointer"
            title="Điền Pháp danh & Tên hương linh"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Viết lời hồi hướng cầu siêu..."
            className="flex-1 bg-[#FAF7F0] text-[#2C1E10] placeholder:text-[#8E775B] text-base sm:text-sm px-4 py-2.5 rounded-full border border-[#EAD7A7] outline-none focus:border-[#C68B19] transition-all min-w-0"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <ThreeIncenseSticksIcon className="w-4 h-4 text-[#3D2505] shrink-0" />
            <span>Gửi hồi hướng</span>
          </button>
        </form>
      </footer>

      {/* ========================================================================= */}
      {/* FULL-SCREEN PAGE 1: QUẢN LÝ CẦU SIÊU CỦA BẠN (LỊCH SỬ ĐÃ VIẾT)            */}
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

            <div className="min-w-0 text-center flex-1">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
                Quản Lý Cầu Siêu Của Bạn ({myPrayers.length})
              </h3>
            </div>

            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-3">
            {myPrayers.length === 0 ? (
              <div className="py-14 px-4 bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] mx-auto flex items-center justify-center text-[#8C5500]">
                  <LotusMinimalIcon className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#2C1E10]">Chưa Có Lời Hồi Hướng Nào</h4>
                <p className="text-xs text-[#6B533B] leading-relaxed max-w-xs mx-auto">
                  Bạn chưa gửi lời hồi hướng nào. Hãy viết lời cầu nguyện ở thanh bên dưới để hồi hướng công đức cho cửu huyền thất tổ và chư hương linh.
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
                      Hồi hướng: {item.target_name} • {formatRelativeTimeVi(item.created_at)}
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
                        placeholder="Hương linh được hồi hướng"
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
      {/* FULL-SCREEN PAGE 2: HƯỚNG DẪN & Ý NGHĨA PHÒNG CẦU SIÊU                    */}
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
              Giới Thiệu Phòng Cầu Siêu DHARMA
            </h3>
            <div className="w-16 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-lg mx-auto w-full space-y-4">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] p-5 space-y-4 text-xs sm:text-sm leading-relaxed text-[#2C1E10] shadow-2xs">
              <p>
                Xin chào mừng quý Phật tử đến với <strong className="text-[#8C5500]">Phòng Cầu Siêu DHARMA</strong>, nơi mọi người cùng đọc lời hồi hướng của nhau và cùng hướng tâm cầu nguyện cho hương linh người đã khuất được siêu sinh Tịnh độ.
              </p>
              <p>
                Bạn có thể quản lý lời hồi hướng của mình tại mục <strong className="text-[#8C5500]">“Quản lý cầu siêu”</strong> (biểu tượng lễ bái góc trên bên phải), nơi cho phép chỉnh sửa hoặc xoá những lời đã gửi. Chạm <strong className="text-[#8C5500]">“Cùng hồi hướng”</strong> trên thẻ của người khác để lặng lẽ gửi tâm từ bi hộ niệm.
              </p>
              <p className="p-3 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-xs text-[#6B533B]">
                <strong className="text-rose-700">Lưu ý giữ gìn sự thanh tịnh:</strong> Mọi lời hồi hướng mang nội dung không phù hợp sẽ được ẩn để giữ sự trang nghiêm cho đạo tràng DHARMA.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
