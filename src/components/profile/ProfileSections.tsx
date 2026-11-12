'use client';

import React, { useState, useMemo } from 'react';
import {
  Check,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Flame,
  Calendar,
} from 'lucide-react';
import {
  LotusMinimalIcon,
  BodhiLeafIcon,
  IncenseAltarIcon,
  MalaBeadsMinimalIcon,
  MeditatingMonkOutlineIcon,
  SutraScrollIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  useDharmaStore,
  computePracticeStreak,
  getTodayDateKey,
  AncestralMemorial,
} from '@/store/useDharmaStore';
import { getNextSolarDateForLunar } from '@/lib/lunar-calendar';
import { playOmTempleBellSound, playBeadTickSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

export const PRECEPTS_CONFIG = [
  {
    field: 'precept1NoKill' as const,
    number: 'Giới thứ 1',
    title: 'Bảo Hộ Sự Sống & Nuôi Dưỡng Từ Bi',
    pali: 'Pāṇātipātā veramaṇī',
    desc: 'Nguyện không sát hại sinh mạng, thực tập ăn chay thanh tịnh và tôn trọng sự sống của muôn loài.',
  },
  {
    field: 'precept2NoSteal' as const,
    number: 'Giới thứ 2',
    title: 'Tôn Trọng Tài Sản & Sống Biết Đủ',
    pali: 'Adinnādānā veramaṇī',
    desc: 'Nguyện không lấy của không cho, sống chánh mạng trung thực và rộng lòng sẻ chia bố thí.',
  },
  {
    field: 'precept3Chaste' as const,
    number: 'Giới thứ 3',
    title: 'Giữ Gìn Phạm Hạnh & Chung Thủy Gia Đạo',
    pali: 'Kāmesumicchācārā veramaṇī',
    desc: 'Nguyện sống chung thủy, tôn trọng nhân phẩm và bảo vệ hạnh phúc bền vững của gia đình.',
  },
  {
    field: 'precept4Truth' as const,
    number: 'Giới thứ 4',
    title: 'Chánh Ngữ Chân Thật & Lắng Nghe Ái Ngữ',
    pali: 'Musāvādā veramaṇī',
    desc: 'Nguyện nói lời chân thật, hòa ái, đem lại niềm tin và sự hòa hợp, không nói lời chia rẽ.',
  },
  {
    field: 'precept5Sober' as const,
    number: 'Giới thứ 5',
    title: 'Tỉnh Thức Sáng Suốt & Không Say Nghiện',
    pali: 'Surāmeraya veramaṇī',
    desc: 'Nguyện giữ tâm trí trong sáng, tiêu thụ chánh niệm cả thực phẩm lẫn thông tin hằng ngày.',
  },
];

export function ProfileStatsGrid() {
  const { dailyLogs, malaLifetimeBeads, visitedPagodaSlugs } = useDharmaStore();

  const stats = useMemo(() => {
    const logs = Object.values(dailyLogs);
    const streak = computePracticeStreak(dailyLogs);
    const totalMedMins = logs.reduce((sum, l) => sum + (l.meditationMins || 0), 0);
    const totalSutras = logs.reduce((sum, l) => sum + (l.sutrasReadCount || 0), 0);
    return { streak, totalMedMins, totalSutras };
  }, [dailyLogs]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFFDF2] to-[#FFF4D0] border border-[#ECD9A8] space-y-1">
        <div className="flex items-center justify-between text-[#8C5500]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Chuỗi Tinh Tấn</span>
          <Flame className="w-4 h-4" />
        </div>
        <div className="font-mono text-2xl font-black text-[#2E1E0F]">
          {stats.streak} <span className="text-xs font-bold text-[#8C5500]">ngày</span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-1">
        <div className="flex items-center justify-between text-[#8C5500]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Tọa Thiền</span>
          <MeditatingMonkOutlineIcon className="w-4 h-4" />
        </div>
        <div className="font-mono text-2xl font-black text-[#2E1E0F]">
          {stats.totalMedMins} <span className="text-xs font-bold text-[#7D6442]">phút</span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-1">
        <div className="flex items-center justify-between text-[#8C5500]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Niệm Chuỗi</span>
          <MalaBeadsMinimalIcon className="w-4 h-4" />
        </div>
        <div className="font-mono text-2xl font-black text-[#2E1E0F]">
          {malaLifetimeBeads.toLocaleString('vi-VN')}{' '}
          <span className="text-xs font-bold text-[#7D6442]">biến</span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#EEDBBA] space-y-1">
        <div className="flex items-center justify-between text-[#8C5500]">
          <span className="text-[10px] font-bold uppercase tracking-wider">Kinh • Hành Hương</span>
          <SutraScrollIcon className="w-4 h-4" />
        </div>
        <div className="font-mono text-xl font-black text-[#2E1E0F]">
          {stats.totalSutras} <span className="text-[11px] font-bold text-[#7D6442]">biến</span> •{' '}
          {visitedPagodaSlugs.length} <span className="text-[11px] font-bold text-[#7D6442]">chùa</span>
        </div>
      </div>
    </div>
  );
}

export function AncestralMemorialBookSection({
  highlighted,
  showToast,
}: {
  highlighted?: boolean;
  showToast: (msg: string) => void;
}) {
  const {
    memorials,
    addMemorial,
    updateMemorial,
    deleteMemorial,
    lightIncenseForMemorial,
  } = useDharmaStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [dharmaName, setDharmaName] = useState('');
  const [relationship, setRelationship] = useState('Ông / Bà');
  const [lunarDay, setLunarDay] = useState(15);
  const [lunarMonth, setLunarMonth] = useState(7);
  const [lunarYear, setLunarYear] = useState('');
  const [notes, setNotes] = useState('');

  const sortedMemorials = useMemo(() => {
    const now = new Date();
    return memorials
      .map((m) => {
        const nextInfo = getNextSolarDateForLunar(m.lunarDeathDay, m.lunarDeathMonth, now);
        return { memorial: m, nextInfo };
      })
      .sort((a, b) => a.nextInfo.daysRemaining - b.nextInfo.daysRemaining);
  }, [memorials]);

  const openNewForm = () => {
    setEditingId(null);
    setFullName('');
    setDharmaName('');
    setRelationship('Ông / Bà');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    const payload = {
      fullName: fullName.trim(),
      dharmaName: dharmaName.trim() || undefined,
      relationship: relationship.trim() || 'Tiên linh',
      lunarDeathDay: Math.min(30, Math.max(1, Number(lunarDay) || 1)),
      lunarDeathMonth: Math.min(12, Math.max(1, Number(lunarMonth) || 1)),
      lunarDeathYear: lunarYear.trim() ? Number(lunarYear) : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      updateMemorial(editingId, payload);
      showToast('Đã cập nhật thông tin Sổ Giỗ Chạp!');
    } else {
      addMemorial(payload);
      showToast('Đã lưu ngày giỗ mới vào Sổ Giỗ Chạp!');
    }
    playBeadTickSound(0.35);
    setIsFormOpen(false);
  };

  return (
    <section
      id="so-gio-chap"
      className={cn(
        'rounded-3xl bg-white border p-5 sm:p-6 shadow-md space-y-4 transition-all',
        highlighted ? 'border-[#E5A91C] ring-2 ring-[#FAD02C]/50' : 'border-[#EEDBBA]'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EEDBBA]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
            <IncenseAltarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
              Sổ Giỗ Chạp &amp; Tưởng Niệm Gia Tiên
            </h3>
            <p className="text-xs text-[#7D6442]">
              Quy đổi Âm→Dương chính xác • Sắp xếp theo ngày giỗ sắp tới gần nhất
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Ngày Giỗ</span>
        </button>
      </div>

      {/* Add / Edit Inline Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#ECD9A8] space-y-3 text-xs"
        >
          <h4 className="font-bold text-[#8C5500]">
            {editingId ? 'Chỉnh Sửa Ngày Giỗ Gia Tiên' : 'Ghi Chép Ngày Giỗ Mới'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              placeholder="Họ và tên hương linh *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
            />
            <input
              type="text"
              placeholder="Pháp danh (nếu có)"
              value={dharmaName}
              onChange={(e) => setDharmaName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
            />
            <input
              type="text"
              placeholder="Vai vế / Quan hệ (Ông Nội, Bà Ngoại...)"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={1}
                max={30}
                required
                placeholder="Ngày Âm"
                value={lunarDay}
                onChange={(e) => setLunarDay(Number(e.target.value))}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
              />
              <input
                type="number"
                min={1}
                max={12}
                required
                placeholder="Tháng Âm"
                value={lunarMonth}
                onChange={(e) => setLunarMonth(Number(e.target.value))}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
              />
              <input
                type="number"
                placeholder="Năm mất"
                value={lunarYear}
                onChange={(e) => setLunarYear(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Ghi chú món chay cúng giỗ hoặc bài kinh thường tụng..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#2E1E0F] outline-hidden focus:border-[#E5A91C]"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#EEDBBA] text-[#6A5234] font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold shadow-sm cursor-pointer"
            >
              {editingId ? 'Lưu Thay Đổi' : 'Lưu Ngày Giỗ'}
            </button>
          </div>
        </form>
      )}

      {/* Memorial List Sorted by Closest Upcoming Countdown */}
      {sortedMemorials.length === 0 ? (
        <p className="text-xs text-[#6A5234] text-center py-6">
          Chưa có thông tin trong Sổ Giỗ Chạp. Hãy thêm ngày giỗ để theo dõi lịch tưởng niệm.
        </p>
      ) : (
        <div className="space-y-2.5">
          {sortedMemorials.map(({ memorial, nextInfo }) => {
            const solarFormatted = `${String(nextInfo.solarDate.getDate()).padStart(2, '0')}/${String(
              nextInfo.solarDate.getMonth() + 1
            ).padStart(2, '0')}/${nextInfo.solarDate.getFullYear()}`;
            const isToday = nextInfo.daysRemaining === 0;
            const isSoon = nextInfo.daysRemaining > 0 && nextInfo.daysRemaining <= 15;

            return (
              <div
                key={memorial.id}
                className={cn(
                  'p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all',
                  isToday
                    ? 'bg-[#FFF4D0] border-[#E5A91C] shadow-sm'
                    : 'bg-[#FFFDF8] border-[#EEDBBA]'
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF4D0] border border-[#EEDBBA] text-[#8C5500]">
                      {memorial.relationship}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : isSoon
                          ? 'bg-amber-100 text-[#8C5500] border border-amber-300'
                          : 'bg-white text-[#6A5234] border border-[#EEDBBA]'
                      )}
                    >
                      {isToday
                        ? 'Hôm nay là ngày giỗ!'
                        : `Còn ${nextInfo.daysRemaining} ngày nữa`}
                    </span>
                  </div>

                  <h4 className="font-heading font-serif font-bold text-sm text-[#2E1E0F]">
                    {memorial.fullName}
                    {memorial.dharmaName && (
                      <span className="text-xs font-normal text-[#8C5500] ml-1.5">
                        (Pháp danh: {memorial.dharmaName})
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-[#5A4329] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#8C5500]">
                      <Calendar className="w-3 h-3" />
                      Âm: {String(memorial.lunarDeathDay).padStart(2, '0')}/
                      {String(memorial.lunarDeathMonth).padStart(2, '0')}
                    </span>
                    <span>→</span>
                    <span>Dương lịch tới: {solarFormatted}</span>
                  </p>

                  {memorial.notes && (
                    <p className="text-[11px] text-[#7D6442] italic">{memorial.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playOmTempleBellSound(0.5);
                      lightIncenseForMemorial(memorial.id);
                      showToast(`Đã thắp hương tưởng niệm ${memorial.fullName} & ghi Sổ Công Đức!`);
                    }}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-transform"
                  >
                    <IncenseAltarIcon className="w-3.5 h-3.5" />
                    <span>Thắp Hương ({memorial.incenseCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(memorial)}
                    className="p-2 rounded-xl bg-white border border-[#EEDBBA] text-[#6A5234] hover:text-[#8C5500] cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deleteMemorial(memorial.id);
                      showToast(`Đã xóa mục ${memorial.fullName} khỏi Sổ Giỗ Chạp`);
                    }}
                    className="p-2 rounded-xl bg-white border border-[#EEDBBA] text-[#7D6442] hover:text-red-600 cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function FivePreceptsSection({
  highlighted,
  showToast,
}: {
  highlighted?: boolean;
  showToast: (msg: string) => void;
}) {
  const { dailyLogs, togglePrecept, addMeritEntry } = useDharmaStore();
  const todayKey = getTodayDateKey();
  const todayLog = dailyLogs[todayKey];

  const checkedCount = PRECEPTS_CONFIG.filter((p) => todayLog?.[p.field] !== false).length;

  // Compute last 7 days precept adherence dots
  const last7Days = useMemo(() => {
    const arr: { key: string; label: string; keptAll: boolean; hasActivity: boolean }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = getTodayDateKey(d);
      const log = dailyLogs[key];
      const keptAll = log
        ? PRECEPTS_CONFIG.every((p) => log[p.field] !== false)
        : false;
      const hasActivity = Boolean(
        log &&
          (log.thoiKhuya ||
            log.thoiSang ||
            log.thoiChieu ||
            log.thoiToi ||
            log.meditationMins > 0 ||
            log.malaBeadsCount > 0 ||
            log.sutrasReadCount > 0)
      );
      arr.push({
        key,
        label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}`,
        keptAll,
        hasActivity,
      });
    }
    return arr;
  }, [dailyLogs]);

  return (
    <section
      id="ngu-gioi"
      className={cn(
        'rounded-3xl bg-white border p-5 sm:p-6 shadow-md space-y-4 transition-all',
        highlighted ? 'border-[#E5A91C] ring-2 ring-[#FAD02C]/50' : 'border-[#EEDBBA]'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EEDBBA]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#EEDBBA] flex items-center justify-center text-[#8C5500]">
            <LotusMinimalIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-serif font-bold text-base text-[#8C5500]">
              Bảng Tự Kiểm Ngũ Giới Cư Sĩ Tại Gia
            </h3>
            <p className="text-xs text-[#7D6442]">
              Hôm nay giữ trọn {checkedCount}/5 giới • Đồng bộ lịch sử 7 ngày gần nhất
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playOmTempleBellSound(0.5);
            addMeritEntry({
              category: 'HUONG_DANG',
              title: `Tự Kiểm Trì Giữ Ngũ Giới (${checkedCount}/5 giới)`,
              dedicationText: `Hôm nay con phát nguyện giữ trọn vẹn ${checkedCount}/5 giới của người cư sĩ tại gia để nuôi dưỡng tâm từ bi và trí tuệ.`,
            });
            showToast(`Đã ghi nhận trì giữ ${checkedCount}/5 Ngũ Giới vào Sổ Công Đức!`);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Xác Nhận Trì Giới Hôm Nay</span>
        </button>
      </div>

      {/* 7-day history tracker */}
      <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#F2E5C7] flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-[#8C5500]">Nhật Ký 7 Ngày Giữ Giới:</span>
        <div className="flex items-center gap-2">
          {last7Days.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold',
                  day.keptAll
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : day.hasActivity
                    ? 'bg-[#FAD02C] border-[#E5A91C] text-[#3D2505]'
                    : 'bg-white border-[#EEDBBA] text-[#7D6442]'
                )}
                title={`${day.label}: ${day.keptAll ? 'Trọn vẹn Ngũ Giới' : 'Đang hành trì'}`}
              >
                {day.keptAll ? '✓' : '·'}
              </span>
              <span className="text-[9px] font-mono text-[#7D6442]">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {PRECEPTS_CONFIG.map((p) => {
          const isChecked = todayLog ? todayLog[p.field] : true;
          return (
            <div
              key={p.field}
              onClick={() => {
                playBeadTickSound(0.25);
                togglePrecept(p.field);
              }}
              className={cn(
                'p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all',
                isChecked
                  ? 'bg-[#FFF9EA] border-[#E5C158] shadow-xs'
                  : 'bg-white border-[#EEDBBA] opacity-75'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5',
                  isChecked
                    ? 'bg-[#F5C542] border-[#E5A91C] text-[#3D2505]'
                    : 'bg-white border-[#EEDBBA] text-transparent'
                )}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFF4D0] text-[#8C5500]">
                    {p.number}
                  </span>
                  <h4 className="font-heading font-serif font-bold text-xs sm:text-sm text-[#2E1E0F]">
                    {p.title}
                  </h4>
                  <span className="text-[11px] font-mono italic text-[#7D6442]">({p.pali})</span>
                </div>
                <p className="text-xs text-[#5A4329] mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DataBackupRestoreSection({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const { exportBackupJson, importBackupJson } = useDharmaStore();

  const handleExport = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dharma-backup-${getTodayDateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    playBeadTickSound(0.35);
    showToast('Đã xuất bản sao lưu JSON dữ liệu hành trì DHARMA!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      const result = importBackupJson(content);
      if (result.ok) {
        playOmTempleBellSound(0.5);
        showToast('Khôi phục dữ liệu hành trì & Sổ Công Đức thành công!');
      } else {
        showToast(result.error || 'Tệp sao lưu không hợp lệ.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section className="rounded-3xl bg-white border border-[#EEDBBA] p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#F2E5C7]">
        <div className="flex items-center gap-2">
          <BodhiLeafIcon className="w-4 h-4 text-[#8C5500]" />
          <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
            Sao Lưu &amp; Khôi Phục Dữ Liệu Tu Tập
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#7D6442]">JSON Backup Engine</span>
      </div>

      <p className="text-xs text-[#5A4329] leading-relaxed">
        Mọi nhật ký hành trì, Tràng Hạt 108, Sổ Giỗ Chạp, Đèn Hoa Đăng và Thẻ Cư Sĩ được lưu an toàn ngay trên trình duyệt. Bạn có thể xuất tệp JSON để sao lưu hoặc chuyển sang thiết bị khác.
      </p>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleExport}
          className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-[#FFF4D0] hover:bg-[#FFE79A] border border-[#ECD9A8] text-[#8C5500] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Bản Sao Lưu (.JSON)</span>
        </button>

        <label className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-white hover:bg-[#FFF9EA] border border-[#EEDBBA] text-[#2E1E0F] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
          <Upload className="w-4 h-4 text-[#8C5500]" />
          <span>Khôi Phục Từ Tệp JSON</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </section>
  );
}

