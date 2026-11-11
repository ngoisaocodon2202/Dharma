'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Info,
  MessageSquare,
  Sparkles,
  Trash2,
  Edit3,
  Check,
  Send,
  Heart,
} from 'lucide-react';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { LotusMinimalIcon, IncenseAltarIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

// Icon người quỳ lạy lễ bái (Prostrating Monk / Bowing Devotee) matching screenshot 100%
function BowingDevoteeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || 'w-5 h-5'}
    >
      {/* Head with serene halo / posture */}
      <circle cx="16.5" cy="5.5" r="2.2" />
      {/* Upper body bowing deeply forward in prostration */}
      <path d="M14.8 9.2c-1.1 0-2.4.6-3.4 1.7-1 1-2.2 1.8-3.6 2l-2.4.3a1 1 0 0 0-.1 2l2.6.2c1.9 0 3.5-.8 4.8-2.2l1.2-1.3c.5-.6 1.2-1 2-1h1.5a1 1 0 1 0 0-2h-2.6z" />
      {/* Lower body, robe & knees folded reverently on the floor */}
      <path d="M5.5 16.2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h7.2c1.6 0 3.1-.7 4.1-1.9l1.4-1.8a1 1 0 1 0-1.6-1.2l-1.3 1.7c-.6.8-1.5 1.3-2.6 1.3H5.5z" />
    </svg>
  );
}

// Icon 3 nén hương thắp cho nút Gửi hồi hướng (matching screenshot)
function ThreeIncenseSticksIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || 'w-4 h-4'}>
      {/* Three vertical incense sticks with glowing tips */}
      <rect x="7" y="7" width="2" height="13" rx="1" />
      <rect x="11" y="4" width="2" height="16" rx="1" />
      <rect x="15" y="7" width="2" height="13" rx="1" />
      {/* Incense base */}
      <path d="M5 20h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" />
      {/* Glowing tip embers */}
      <circle cx="8" cy="5.5" r="1.2" opacity="0.9" />
      <circle cx="12" cy="2.5" r="1.2" opacity="0.9" />
      <circle cx="16" cy="5.5" r="1.2" opacity="0.9" />
    </svg>
  );
}

export interface CauSieuMessage {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  likesCount: number;
  isMine?: boolean;
}

const INITIAL_COMMUNITY_PRAYERS: CauSieuMessage[] = [
  {
    id: 'comm-1',
    senderName: 'Diệu Yến',
    content:
      'Hồi hướng cho hương linh ông nội của con về miền an lành cực lạc. Nam Mô A Di Đà Phật, Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát.',
    timestamp: '5 phút trước',
    likesCount: 38,
  },
  {
    id: 'comm-2',
    senderName: 'Ngọc Khai',
    content:
      'Con xin thành tâm hồi hướng công đức này cho cửu huyền thất tổ, oan gia trái chủ và người thân quyến nhiều đời nhiều kiếp sớm siêu sinh Tịnh độ.',
    timestamp: '18 phút trước',
    likesCount: 64,
  },
  {
    id: 'comm-3',
    senderName: 'Dharma • Phật tử Diệu Âm',
    content:
      'Con đem công Đức này hồi hướng cho ba mẹ ông bà nội ngoại và tất cả vong linh mười phương pháp giới sớm tiêu trừ nghiệp chướng, đồng sanh Cực Lạc.',
    timestamp: '32 phút trước',
    likesCount: 129,
  },
  {
    id: 'comm-4',
    senderName: 'Minh Trí',
    content:
      'Nguyện đem công đức tụng kinh niệm Phật hồi hướng cho hương linh thân phụ vãng sinh Lạc quốc, hoa nở thấy Phật ngộ vô sinh.',
    timestamp: '1 giờ trước',
    likesCount: 85,
  },
];

export default function CauSieuPage() {
  const router = useRouter();

  // State
  const [prayers, setPrayers] = useState<CauSieuMessage[]>(INITIAL_COMMUNITY_PRAYERS);
  const [myPrayers, setMyPrayers] = useState<CauSieuMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState('Phật tử');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Editing state for my prayers
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const streamEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Load user's prayer history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dharma_my_cau_sieu_history');
      if (saved) {
        const parsed: CauSieuMessage[] = JSON.parse(saved);
        setMyPrayers(parsed);
        // Merge into community feed if not yet present
        setPrayers((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const toAdd = parsed.filter((p) => !ids.has(p.id));
          return [...toAdd, ...prev];
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save user's prayer history
  const saveMyPrayers = (updated: CauSieuMessage[]) => {
    setMyPrayers(updated);
    try {
      localStorage.setItem('dharma_my_cau_sieu_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit a new prayer
  const handleSendPrayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) {
      showToast('Xin hãy nhập lời hồi hướng chí thành');
      return;
    }

    playGrandTempleBellSound(0.5);

    const newPrayer: CauSieuMessage = {
      id: `my-${Date.now()}`,
      senderName: senderName || 'Phật tử thành tâm',
      content: trimmed,
      timestamp: 'Vừa xong',
      likesCount: 1,
      isMine: true,
    };

    // Update community feed & user history
    setPrayers((prev) => [newPrayer, ...prev]);
    saveMyPrayers([newPrayer, ...myPrayers]);
    setInputText('');

    // Record merit in Ledger
    recordDharmaMerit({
      type: 'prayer',
      title: 'Hồi Hướng Cầu Siêu Chư Hương Linh',
      detail: trimmed.slice(0, 90) + (trimmed.length > 90 ? '...' : ''),
      meritPoints: 15,
    });

    showToast('Đã gửi lời hồi hướng cầu siêu trang nghiêm • Tích lũy +15 Công Đức');
  };

  // "Cùng hồi hướng" (+1 like)
  const handleToggleLike = (id: string) => {
    if (likedMap[id]) return;
    playBellSound(0.25);
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setPrayers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item
      )
    );
    showToast('Bạn đã cùng hướng tâm hồi hướng thanh tịnh');
  };

  // Delete from user's history
  const handleDeleteMyPrayer = (id: string) => {
    const updated = myPrayers.filter((p) => p.id !== id);
    saveMyPrayers(updated);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    showToast('Đã xóa lời hồi hướng của bạn');
  };

  // Start editing
  const handleStartEdit = (p: CauSieuMessage) => {
    setEditingId(p.id);
    setEditingText(p.content);
  };

  // Save edit
  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    const updated = myPrayers.map((p) =>
      p.id === id ? { ...p, content: editingText.trim() } : p
    );
    saveMyPrayers(updated);
    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, content: editingText.trim() } : p))
    );
    setEditingId(null);
    showToast('Đã cập nhật lời hồi hướng thành công');
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#1A1208] text-white flex flex-col justify-between overflow-hidden select-none"
      style={{
        backgroundImage: "url('/images/cau-sieu-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle Dark Vignette & Top/Bottom Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85 pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-4 z-[999999] flex justify-center pointer-events-none animate-fade-in-down">
          <div className="px-4 py-2.5 rounded-2xl bg-[#241B0B]/95 text-white text-xs sm:text-sm font-medium shadow-2xl border border-[#ECD9A8] backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD966] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP SAFE-AREA HEADER (MATCHING SCREENSHOT 100%)                        */}
      {/* ========================================================================= */}
      <header className="relative z-30 pt-3 pb-2 px-3.5 sm:px-6 flex items-center justify-between">
        {/* Left Close Button (Circle with X) */}
        <button
          type="button"
          onClick={() => router.push('/thuc-hanh')}
          className="w-10 h-10 rounded-full bg-[#FAF0D7]/90 hover:bg-white text-[#241B0B] border border-[#ECD9A8] flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          title="Trở về Phương Tiện Tu Tập"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Title: Phòng Cầu Siêu (Single line, perfectly centered) */}
        <h1 className="font-heading font-serif text-lg sm:text-xl font-bold text-[#241B0B] drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)] tracking-wide whitespace-nowrap">
          Phòng Cầu Siêu
        </h1>

        {/* Right Button: Lạy Phật / Lễ Bái (NÚT LỊCH SỬ CỦA NGƯỜI DÙNG ĐÃ TỪNG VIẾT) */}
        <button
          type="button"
          onClick={() => {
            playBellSound(0.3);
            setIsHistoryModalOpen(true);
          }}
          className="relative w-10 h-10 rounded-full bg-[#FAF0D7]/90 hover:bg-white text-[#241B0B] border border-[#ECD9A8] flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          title="Lịch sử lời hồi hướng của bạn (Quản lý cầu siêu)"
        >
          <BowingDevoteeIcon className="w-5 h-5 text-[#3D2505]" />
          {myPrayers.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E6A917] text-[#241B0B] text-[9.5px] font-bold flex items-center justify-center border border-white">
              {myPrayers.length}
            </span>
          )}
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. FLOATING RIGHT UTILITY BUTTONS (💬 4,8 N and ⓘ INFO)                   */}
      {/* ========================================================================= */}
      <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-3">
        {/* Chat Counter Badge */}
        <div className="flex flex-col items-center group">
          <div className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/95 shadow-lg">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md mt-0.5">
            4,8 N
          </span>
        </div>

        {/* Info Icon: ⓘ opens Introduction / Guidelines modal */}
        <button
          type="button"
          onClick={() => {
            playBellSound(0.2);
            setIsInfoModalOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/95 hover:bg-black/60 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Thông tin Phòng Cầu Siêu"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. COMMUNITY PRAYER BUBBLES STREAM (GLASSMORPHISM FLOATING CARDS)        */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col justify-end px-3.5 sm:px-6 pb-2 space-y-2.5 overflow-y-auto no-scrollbar max-w-lg mx-auto w-full">
        {prayers.slice(0, 4).map((p) => {
          const isLiked = likedMap[p.id];
          return (
            <div
              key={p.id}
              className={cn(
                'rounded-2xl p-3 sm:p-3.5 backdrop-blur-md border shadow-lg transition-all',
                p.isMine
                  ? 'bg-gradient-to-r from-[#FFF9EA]/85 to-[#FFF3D0]/85 border-[#E5C158] text-[#2E1E0F]'
                  : 'bg-black/40 border-white/20 text-white'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 border',
                      p.isMine
                        ? 'bg-[#E6A917] text-[#241B0B] border-white'
                        : 'bg-gradient-to-tr from-[#E5A91C] to-[#FFE79A] text-[#3D2505] border-white/40'
                    )}
                  >
                    <LotusMinimalIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2
                      className={cn(
                        'text-xs font-bold leading-tight',
                        p.isMine ? 'text-[#8C5500]' : 'text-[#FFD966]'
                      )}
                    >
                      {p.senderName}
                      {p.isMine && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#E6A917] text-[#241B0B] font-semibold">
                          Bạn
                        </span>
                      )}
                    </h2>
                    <span
                      className={cn(
                        'text-[9.5px]',
                        p.isMine ? 'text-[#7D6442]' : 'text-white/60'
                      )}
                    >
                      {p.timestamp}
                    </span>
                  </div>
                </div>

                {/* "Cùng hồi hướng" quick action */}
                <button
                  type="button"
                  onClick={() => handleToggleLike(p.id)}
                  className={cn(
                    'px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all active:scale-95 cursor-pointer',
                    isLiked
                      ? 'bg-[#E6A917] text-[#241B0B] font-bold'
                      : p.isMine
                      ? 'bg-white/80 text-[#8C5500] hover:bg-white'
                      : 'bg-white/15 text-white/90 hover:bg-white/25'
                  )}
                >
                  <Heart className={cn('w-3 h-3', isLiked && 'fill-current text-[#241B0B]')} />
                  <span>{p.likesCount}</span>
                </button>
              </div>

              {/* Prayer text (Clean, readable, leading-relaxed) */}
              <p
                className={cn(
                  'text-xs sm:text-[12.5px] leading-relaxed mt-1.5',
                  p.isMine ? 'text-[#2E1E0F] font-medium' : 'text-white/90'
                )}
              >
                {p.content}
              </p>
            </div>
          );
        })}
        <div ref={streamEndRef} />
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM INPUT BAR: VIẾT LỜI HỒI HƯỚNG & GỬI (EXACT SCREENSHOT MATCH)    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 pb-5 pt-2 px-3.5 sm:px-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <form
          onSubmit={handleSendPrayer}
          className="max-w-lg mx-auto flex items-center gap-2"
        >
          {/* Rounded White Pill Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Viết lời hồi hướng..."
            className="flex-1 bg-white text-[#2E1E0F] placeholder:text-[#8C7A65] text-xs sm:text-sm px-4 py-3 rounded-full border border-[#ECD9A8] shadow-lg outline-none focus:ring-2 focus:ring-[#E5C158] transition-all"
          />

          {/* Golden Rounded Button with 3 Incense Sticks Icon */}
          <button
            type="submit"
            className="px-4 py-3 rounded-full bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <ThreeIncenseSticksIcon className="w-4 h-4 text-[#3D2505] shrink-0" />
            <span>Gửi hồi hướng</span>
          </button>
        </form>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: LỊCH SỬ CỦA NGƯỜI DÙNG ĐÃ TỪNG VIẾT (QUẢN LÝ CẦU SIÊU)           */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsHistoryModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] text-[#2E1E0F] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#FFFDF5] to-[#FFF9E6] border-b border-[#F2E5C7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF4D0] border border-[#ECD9A8] flex items-center justify-center text-[#8C5500]">
                  <BowingDevoteeIcon className="w-5 h-5 text-[#8C5500]" />
                </div>
                <div>
                  <h3 className="font-heading font-serif text-base font-bold text-[#8C5500]">
                    Quản Lý Cầu Siêu Của Bạn
                  </h3>
                  <p className="text-[11px] text-[#7D6442]">
                    Lịch sử các lời hồi hướng bạn đã từng viết
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#EEDBBA] text-[#7D6442] hover:text-[#2E1E0F] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: List of user's prayers */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-dropdown-scroll">
              {myPrayers.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#FFF4D0] border border-[#ECD9A8] mx-auto flex items-center justify-center text-[#8C5500]">
                    <LotusMinimalIcon className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading font-serif text-sm font-bold text-[#2E1E0F]">
                    Chưa Có Lời Hồi Hướng Nào
                  </h4>
                  <p className="text-xs text-[#7D6442] leading-relaxed max-w-xs mx-auto">
                    Bạn chưa gửi lời hồi hướng nào. Hãy viết lời cầu nguyện ở thanh bên dưới để hồi hướng công đức cho cửu huyền thất tổ và chư hương linh.
                  </p>
                </div>
              ) : (
                myPrayers.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-[#EEDBBA] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#7D6442]">
                      <span className="font-medium text-[#8C5500]">
                        {item.timestamp}
                      </span>
                      <span className="font-bold flex items-center gap-1 text-[#8C5500]">
                        <Heart className="w-3 h-3 fill-current text-[#E6A917]" />
                        {item.likesCount} người cùng hồi hướng
                      </span>
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-[#E5C158] outline-none bg-white text-[#2E1E0F] resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs text-[#7D6442] hover:text-[#2E1E0F]"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-3 py-1 rounded-lg bg-[#E6A917] text-[#241B0B] font-bold text-xs"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-[13px] text-[#2E1E0F] leading-relaxed">
                        {item.content}
                      </p>
                    )}

                    {/* Action buttons: Edit & Delete */}
                    {editingId !== item.id && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F2E5C7]">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#ECD9A8] text-[#8C5500] hover:text-[#2E1E0F] text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMyPrayer(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#EEDBBA] text-red-600 hover:text-red-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-[#F2E5C7] text-center">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs shadow-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: THÔNG TIN PHÒNG CẦU SIÊU (MATCHING SCREENSHOT 2 100%)             */}
      {/* ========================================================================= */}
      {isInfoModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsInfoModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#ECD9A8] text-[#2E1E0F] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#8C5500] text-center">
              Phòng Cầu Siêu
            </h3>

            <div className="text-xs sm:text-[13px] leading-relaxed text-[#4A3822] space-y-3.5 text-justify">
              <p>
                Xin chào mừng quý Phật tử đến với{' '}
                <strong className="text-[#8C5500]">Phòng Cầu Siêu</strong>, nơi mọi người cùng đọc lời hồi hướng của nhau và cùng hướng tâm cầu nguyện cho hương linh người đã khuất được siêu sinh Tịnh độ. Mỗi lời hồi hướng hiện kèm pháp danh của bạn, tên người mất và tên người hồi hướng; ảnh đại diện được giữ riêng tư, chỉ một mình bạn nhìn thấy.
              </p>

              <p>
                Bạn có thể quản lý lời hồi hướng của mình tại mục{' '}
                <strong className="text-[#8C5500]">“Quản lý cầu siêu”</strong> (biểu tượng lạy ở góc trên bên phải), nơi cho phép chỉnh sửa hoặc xoá những lời đã gửi. Chạm “Cùng hồi hướng” dưới lời hồi hướng của người khác để lặng lẽ cùng hướng tâm; người viết chỉ thấy có bao nhiêu người đã cùng hồi hướng, không biết là ai.
              </p>

              <p className="text-xs text-[#5A4329]">
                <strong className="text-red-600">Xin lưu ý:</strong> Mọi lời hồi hướng có nội dung không phù hợp hoặc mang tính công kích sẽ bị xoá và tài khoản có thể bị tạm khoá. Trường hợp vi phạm nhiều lần, tài khoản sẽ bị khoá vĩnh viễn để giữ sự thanh tịnh cho Phòng. Nếu thấy lời hồi hướng nào không phù hợp, hãy chạm vào lời đó, chọn ··· rồi chọn Báo cáo. Dharma xem xét mọi báo cáo trong vòng 24 giờ.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#F5F2EA] hover:bg-[#EADBBA] text-[#3D2505] font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
