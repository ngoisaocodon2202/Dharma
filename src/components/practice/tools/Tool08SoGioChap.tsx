'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Flame,
  Calendar,
  ScrollText,
  Utensils,
  Sparkles,
  Copy,
  Check,
  X,
} from 'lucide-react';
import {
  KISITIGARBHA_VEGETARIAN_TEACHING,
  VEGETARIAN_MEMORIAL_MENUS,
  generateMemorialPrayer,
} from '@/data/practiceToolsData';
import { getNextSolarDateForLunar } from '@/lib/lunar-calendar';
import {
  playBellSound,
  playBeadTickSound,
  playWoodenFishSound,
} from '@/lib/buddhistSounds';
import {
  useDharmaPracticeStore,
  type AncestralMemorial,
} from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

const WEEKDAY_VN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

interface Tool08SoGioChapProps {
  onJumpToCauSieuTablet: (tabletId: string) => void;
  showToast: (msg: string) => void;
}

export function Tool08SoGioChap({
  onJumpToCauSieuTablet,
  showToast,
}: Tool08SoGioChapProps) {
  const {
    profile,
    memorials,
    spiritTablets,
    addMemorial,
    updateMemorial,
    deleteMemorial,
    lightIncenseForMemorial,
    addSpiritTablet,
  } = useDharmaPracticeStore();

  // Add / Edit Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [dharmaName, setDharmaName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [lunarDay, setLunarDay] = useState(15);
  const [lunarMonth, setLunarMonth] = useState(7);
  const [lunarYear, setLunarYear] = useState('');
  const [notes, setNotes] = useState('');

  // Modals: Văn Khấn & Mâm Cỗ Chay
  const [prayerModalTarget, setPrayerModalTarget] = useState<{
    memorial: AncestralMemorial;
    solarDateLabel: string;
    milestoneLabel: string;
  } | null>(null);
  const [isMenusModalOpen, setIsMenusModalOpen] = useState(false);
  const [copiedPrayer, setCopiedPrayer] = useState(false);

  const sortedEntries = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return memorials
      .map((m) => {
        const nextInfo = getNextSolarDateForLunar(m.lunarDeathDay, m.lunarDeathMonth, now);
        const solarDateLabel = `${WEEKDAY_VN[nextInfo.solarDate.getDay()]}, ${String(
          nextInfo.solarDate.getDate()
        ).padStart(2, '0')}/${String(nextInfo.solarDate.getMonth() + 1).padStart(
          2,
          '0'
        )}/${nextInfo.solarDate.getFullYear()}`;
        const milestoneYears =
          m.lunarDeathYear && m.lunarDeathYear > 1900 && m.lunarDeathYear <= currentYear
            ? currentYear - m.lunarDeathYear + (nextInfo.solarDate.getFullYear() > currentYear ? 1 : 0)
            : null;
        const milestoneLabel = milestoneYears ? `Giỗ lần thứ ${milestoneYears}` : '';

        return { memorial: m, nextInfo, solarDateLabel, milestoneLabel };
      })
      .sort((a, b) => a.nextInfo.daysRemaining - b.nextInfo.daysRemaining);
  }, [memorials]);

  const openAddForm = () => {
    setEditingId(null);
    setFullName('');
    setDharmaName('');
    setRelationship('');
    setLunarDay(15);
    setLunarMonth(7);
    setLunarYear('');
    setNotes('');
    setIsFormOpen(true);
  };

  const openEditForm = (m: AncestralMemorial) => {
    setEditingId(m.id);
    setFullName(m.fullName);
    setDharmaName(m.dharmaName || '');
    setRelationship(m.relationship);
    setLunarDay(m.lunarDeathDay);
    setLunarMonth(m.lunarDeathMonth);
    setLunarYear(m.lunarDeathYear ? String(m.lunarDeathYear) : '');
    setNotes(m.notes || '');
    setIsFormOpen(true);
  };

  const handleSaveMemorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const payload = {
      fullName: fullName.trim(),
      dharmaName: dharmaName.trim() || undefined,
      relationship: relationship.trim() || 'Gia tiên',
      lunarDeathDay: Math.min(30, Math.max(1, Number(lunarDay) || 15)),
      lunarDeathMonth: Math.min(12, Math.max(1, Number(lunarMonth) || 7)),
      lunarDeathYear: lunarYear ? Number(lunarYear) : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      updateMemorial(editingId, payload);
      showToast('Đã cập nhật thông tin ngày giỗ gia tiên!');
    } else {
      addMemorial(payload);
      showToast('Đã thêm ngày giỗ vào Sổ Giỗ Chạp Dharma!');
    }

    playWoodenFishSound(0.45);
    setIsFormOpen(false);
  };

  const handleJumpToCauSieu = (m: AncestralMemorial) => {
    const existingTablet = spiritTablets.find(
      (t) =>
        t.mode === 'CAU_SIEU' &&
        t.fullName.toLowerCase().trim() === m.fullName.toLowerCase().trim()
    );
    const targetId =
      existingTablet?.id ||
      addSpiritTablet({
        mode: 'CAU_SIEU',
        fullName: m.fullName,
        dharmaName: m.dharmaName,
        relationship: m.relationship,
        lunarDeathDate: `${String(m.lunarDeathDay).padStart(2, '0')}/${String(
          m.lunarDeathMonth
        ).padStart(2, '0')} Âm lịch`,
        prayerWish:
          m.notes ||
          `Nguyện đem công đức tụng kinh trì chú hồi hướng cho ${m.relationship} ${m.fullName} sớm sanh Tịnh Cảnh.`,
      });

    playBellSound(0.4);
    onJumpToCauSieuTablet(targetId);
    showToast(`Đã mở Liên Đài Cầu Siêu cho ${m.fullName}`);
  };

  return (
    <div className="space-y-5">
      {/* 1. HEADER & ACTION BAR */}
      <div className="rounded-3xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h4 className="font-serif font-bold text-base text-[#2C1E10]">
            Sổ Giỗ Chạp &amp; Trợ Lý Hiếu Hạnh
          </h4>
          <p className="text-xs text-[#6B533B]">
            Tự động quy đổi Âm lịch sang Dương lịch &amp; xếp theo ngày giỗ gần nhất
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsMenusModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#8C5500] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#FFF6DF]"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Mâm Cỗ Chay Cúng Giỗ</span>
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Ngày Giỗ</span>
          </button>
        </div>
      </div>

      {/* 2. ADD / EDIT FORM */}
      {isFormOpen && (
        <form
          onSubmit={handleSaveMemorial}
          className="rounded-3xl bg-[#FFFFFF] border-2 border-[#EAD7A7] p-4 sm:p-5 space-y-3 text-xs shadow-xs"
        >
          <h5 className="font-serif font-bold text-sm text-[#8C5500]">
            {editingId ? 'Cập Nhật Ngày Giỗ Gia Tiên' : 'Ghi Chép Ngày Giỗ Người Thân'}
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              placeholder="Họ tên người thân *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />
            <input
              type="text"
              placeholder="Pháp danh (nếu có)"
              value={dharmaName}
              onChange={(e) => setDharmaName(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />
            <input
              type="text"
              placeholder="Quan hệ (Ông nội, Bà ngoại, Thân phụ...)"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={1}
                max={30}
                required
                placeholder="Ngày ÂL"
                value={lunarDay}
                onChange={(e) => setLunarDay(Number(e.target.value))}
                className="px-2.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
              />
              <input
                type="number"
                min={1}
                max={12}
                required
                placeholder="Tháng ÂL"
                value={lunarMonth}
                onChange={(e) => setLunarMonth(Number(e.target.value))}
                className="px-2.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
              />
              <input
                type="number"
                placeholder="Năm mất"
                value={lunarYear}
                onChange={(e) => setLunarYear(e.target.value)}
                className="px-2.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Ghi chú món chay thường cúng hoặc di nguyện..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] focus:outline-none focus:border-[#C68B19]"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B] font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold shadow-sm cursor-pointer"
            >
              Lưu Vào Sổ Giỗ Chạp
            </button>
          </div>
        </form>
      )}

      {/* 3. MEMORIAL CARDS LIST SORTED BY CLOSEST UPCOMING ANNIVERSARY */}
      <div className="space-y-3">
        {sortedEntries.map(({ memorial, nextInfo, solarDateLabel, milestoneLabel }) => {
          const isToday = nextInfo.daysRemaining === 0;
          const isSoon = nextInfo.daysRemaining > 0 && nextInfo.daysRemaining <= 15;

          return (
            <div
              key={memorial.id}
              className={cn(
                'rounded-3xl border p-4 sm:p-5 space-y-3 shadow-xs transition-all',
                isToday
                  ? 'bg-[#FFF9EB] border-[#C8780A]'
                  : 'bg-[#FFFFFF] border-[#EAD7A7]'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[10px] font-bold uppercase text-[#8C5500]">
                      {memorial.relationship}
                    </span>

                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                        isToday
                          ? 'bg-emerald-700 text-white'
                          : isSoon
                            ? 'bg-[#FFF6DF] border border-[#D9A02E] text-[#8C5500]'
                            : 'bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B]'
                      )}
                    >
                      {isToday
                        ? 'Hôm nay là ngày giỗ'
                        : `Còn ${nextInfo.daysRemaining} ngày nữa (${solarDateLabel})`}
                    </span>

                    {milestoneLabel && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFE07D] text-[#3D2505] text-[10px] font-bold">
                        {milestoneLabel}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#2C1E10]">
                    {memorial.fullName}
                    {memorial.dharmaName && (
                      <span className="text-xs font-normal text-[#8C5500] ml-1.5">
                        (Pháp danh: {memorial.dharmaName})
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-[#6B533B] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8C5500]" />
                    <span>
                      Ngày giỗ Âm lịch:{' '}
                      <strong className="text-[#2C1E10]">
                        {String(memorial.lunarDeathDay).padStart(2, '0')}/
                        {String(memorial.lunarDeathMonth).padStart(2, '0')}
                        {memorial.lunarDeathYear ? `/${memorial.lunarDeathYear}` : ''}
                      </strong>
                    </span>
                  </p>

                  {memorial.notes && (
                    <p className="text-xs italic text-[#5C442C]">
                      Ghi chú: {memorial.notes}
                    </p>
                  )}
                </div>

                {/* Edit / Delete / Quick Incense */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playBeadTickSound(0.45);
                      lightIncenseForMemorial(memorial.id);
                      showToast(`Đã thắp hương tưởng niệm ${memorial.fullName}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Thắp Hương ({memorial.incenseCount || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(memorial)}
                    className="p-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                    aria-label="Chỉnh sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deleteMemorial(memorial.id);
                      showToast('Đã xóa khỏi Sổ Giỗ Chạp');
                    }}
                    className="p-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B] hover:text-rose-600 cursor-pointer"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filial Piety Action Toolkit Row */}
              <div className="pt-2.5 border-t border-[#EAD7A7] flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPrayerModalTarget({ memorial, solarDateLabel, milestoneLabel })
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] hover:border-[#C8780A] text-[#8C5500] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Văn Khấn Cúng Giỗ Chay Tại Gia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenusModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] hover:border-[#C8780A] text-[#8C5500] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Gợi Ý Mâm Cỗ Chay Cúng Giỗ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpToCauSieu(memorial)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sang Liên Đài Cầu Siêu</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL A: VĂN KHẤN CÚNG GIỖ CHAY TẠI GIA */}
      {prayerModalTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrayerModalTarget(null);
          }}
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-[#FFFFFF] border-2 border-[#D9A02E] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAD7A7]">
              <h3 className="font-serif font-bold text-base text-[#8C5500]">
                Văn Khấn Cúng Giỗ Chay • {prayerModalTarget.memorial.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setPrayerModalTarget(null)}
                className="p-1 text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] font-serif text-xs sm:text-sm leading-relaxed text-[#2C1E10] whitespace-pre-line">
              {generateMemorialPrayer(
                prayerModalTarget.memorial,
                prayerModalTarget.solarDateLabel,
                prayerModalTarget.milestoneLabel,
                profile.dharmaName
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  const text = generateMemorialPrayer(
                    prayerModalTarget.memorial,
                    prayerModalTarget.solarDateLabel,
                    prayerModalTarget.milestoneLabel,
                    profile.dharmaName
                  );
                  await navigator.clipboard?.writeText(text);
                  setCopiedPrayer(true);
                  setTimeout(() => setCopiedPrayer(false), 2000);
                  showToast('Đã sao chép bài Văn Khấn Cúng Giỗ Chay');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedPrayer ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrayer ? 'Đã Sao Chép' : 'Sao Chép Văn Khấn'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPrayerModalTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#6B533B] font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: 3 GỢI Ý MÂM CỖ CHAY & KINH ĐỊA TẠNG PHẨM THỨ BẢY */}
      {isMenusModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenusModalOpen(false);
          }}
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-3xl bg-[#FFFFFF] border-2 border-[#D9A02E] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAD7A7]">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#8C5500]">
                  Gợi Ý 3 Mâm Cỗ Chay Cúng Giỗ Thanh Tịnh
                </h3>
                <p className="text-xs text-[#6B533B]">
                  Dùng thực phẩm thuần chay tăng trưởng phước báu cho người mất và gia quyến
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenusModalOpen(false)}
                className="p-1 text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scripture Reference: Kinh Địa Tạng Phẩm Thứ Bảy */}
            <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#D9A02E] text-xs text-[#5C442C] leading-relaxed">
              <p className="font-bold text-[#8C5500] mb-1">
                Vì Sao Nên Cúng Giỗ Thuần Chay? (Kinh Địa Tạng — Phẩm Thứ Bảy)
              </p>
              <p>{KISITIGARBHA_VEGETARIAN_TEACHING}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {VEGETARIAN_MEMORIAL_MENUS.map((menu) => (
                <div
                  key={menu.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#EAD7A7] space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#8C5500]">
                      {menu.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#6B533B]">{menu.style}</p>
                    <ul className="space-y-1 text-[#2C1E10] list-disc pl-4">
                      {menu.dishes.map((dish, i) => (
                        <li key={i}>{dish}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-[#5C442C] pt-1 border-t border-[#EAD7A7]">
                      <strong>Canh &amp; Tráng miệng:</strong> {menu.soupAndDessert}
                    </p>
                    <p className="text-[11px] text-[#8C5500]">
                      <strong>Hương trà:</strong> {menu.teaOffering}
                    </p>
                  </div>
                  <p className="text-[10px] italic text-[#6B533B] pt-1">{menu.meaningNote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

