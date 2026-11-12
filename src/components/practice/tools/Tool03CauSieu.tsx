'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Heart,
} from 'lucide-react';
import {
  LotusMinimalIcon,
  IncenseAltarIcon,
  WoodenFishMinimalIcon,
  LotusLanternIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { TABLET_MANTRAS } from '@/data/practiceToolsData';
import {
  useDharmaPracticeStore,
  type SpiritTablet,
  type TabletMode,
} from '@/store/useDharmaPracticeStore';
import {
  playBellSound,
  playGrandTempleBellSound,
  playWoodenFishSound,
} from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

interface Tool03CauSieuProps {
  initialSelectedTabletId?: string | null;
  showToast: (msg: string) => void;
}

export function Tool03CauSieu({
  initialSelectedTabletId,
  showToast,
}: Tool03CauSieuProps) {
  const {
    spiritTablets,
    addSpiritTablet,
    deleteSpiritTablet,
    lightSpiritTabletOffering,
    incrementSpiritTabletMantra,
  } = useDharmaPracticeStore();

  const [activeTab, setActiveTab] = useState<TabletMode>('CAU_SIEU');
  const [selectedTabletId, setSelectedTabletId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Per-tablet 0 -> 21 mantra session state
  const [sessionCycleCount, setSessionCycleCount] = useState(0);
  const [selectedMantraKey, setSelectedMantraKey] = useState<'vangSanh' | 'duocSu'>('vangSanh');

  // Create form inputs
  const [fullName, setFullName] = useState('');
  const [dharmaName, setDharmaName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [lunarDeathDate, setLunarDeathDate] = useState('');
  const [longevity, setLongevity] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [prayerWish, setPrayerWish] = useState('');

  // Select incoming tablet from Tool 08 handoff
  useEffect(() => {
    if (initialSelectedTabletId) {
      const target = spiritTablets.find((t) => t.id === initialSelectedTabletId);
      if (target) {
        setActiveTab(target.mode);
        setSelectedTabletId(target.id);
        setSelectedMantraKey(target.mode === 'CAU_SIEU' ? 'vangSanh' : 'duocSu');
        setSessionCycleCount(0);
      }
    }
  }, [initialSelectedTabletId, spiritTablets]);

  const filteredTablets = useMemo(
    () => spiritTablets.filter((t) => t.mode === activeTab),
    [spiritTablets, activeTab]
  );

  const selectedTablet: SpiritTablet | null = useMemo(
    () =>
      spiritTablets.find((t) => t.id === selectedTabletId) ||
      filteredTablets[0] ||
      null,
    [spiritTablets, selectedTabletId, filteredTablets]
  );

  const handleSelectTablet = (tablet: SpiritTablet) => {
    playBellSound(0.32);
    setSelectedTabletId(tablet.id);
    setSessionCycleCount(0);
    setSelectedMantraKey(tablet.mode === 'CAU_SIEU' ? 'vangSanh' : 'duocSu');
  };

  const handleCreateTablet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const defaultWish =
      activeTab === 'CAU_SIEU'
        ? `Nguyện đem công đức tụng kinh niệm Phật hồi hướng cho hương linh ${fullName.trim()} sớm tiêu trừ nghiệp chướng, siêu sanh Tịnh Độ.`
        : `Nguyện cầu Tam Bảo gia hộ cho ${fullName.trim()} thân tâm thường an lạc, tật bệnh tiêu trừ, cát tường như ý.`;

    const newId = addSpiritTablet({
      mode: activeTab,
      fullName: fullName.trim(),
      dharmaName: dharmaName.trim() || undefined,
      relationship: relationship.trim() || (activeTab === 'CAU_SIEU' ? 'Gia tiên' : 'Người thân'),
      lunarDeathDate: activeTab === 'CAU_SIEU' ? lunarDeathDate.trim() || undefined : undefined,
      longevity: activeTab === 'CAU_SIEU' ? longevity.trim() || undefined : undefined,
      birthYear: activeTab === 'CAU_AN' ? birthYear.trim() || undefined : undefined,
      prayerWish: prayerWish.trim() || defaultWish,
    });

    playGrandTempleBellSound(0.45);
    setSelectedTabletId(newId);
    setIsFormOpen(false);
    setFullName('');
    setDharmaName('');
    setRelationship('');
    setLunarDeathDate('');
    setLongevity('');
    setBirthYear('');
    setPrayerWish('');
    showToast(
      activeTab === 'CAU_SIEU'
        ? 'Đã an vị Linh Vị Cầu Siêu lên Đài Sen!'
        : 'Đã an vị Bài Vị Cầu An lên Đài Sen!'
    );
  };

  const activeMantra = TABLET_MANTRAS[selectedMantraKey];

  const handleTapMantraCycle = () => {
    if (!selectedTablet) return;
    const next = sessionCycleCount >= 21 ? 1 : sessionCycleCount + 1;
    setSessionCycleCount(next);

    if (next === 21) {
      playGrandTempleBellSound(0.55);
      incrementSpiritTabletMantra(
        selectedTablet.id,
        1,
        `Hoàn mãn 21 biến ${activeMantra.shortTitle} hồi hướng cho ${selectedTablet.fullName}`
      );
      showToast(`Viên mãn 21 biến ${activeMantra.shortTitle}! Đã ghi nhận vào Sổ Công Đức.`);
    } else {
      playWoodenFishSound(0.42);
      incrementSpiritTabletMantra(selectedTablet.id, 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. DUAL ALTAR TABS & CREATE CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('CAU_SIEU');
              setSelectedMantraKey('vangSanh');
              setIsFormOpen(false);
            }}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'CAU_SIEU'
                ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-2xs'
                : 'text-[#6B533B] hover:text-[#2C1E10]'
            )}
          >
            <IncenseAltarIcon className="w-3.5 h-3.5" />
            <span>Liên Đài Cầu Siêu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('CAU_AN');
              setSelectedMantraKey('duocSu');
              setIsFormOpen(false);
            }}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'CAU_AN'
                ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-2xs'
                : 'text-[#6B533B] hover:text-[#2C1E10]'
            )}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liên Đài Cầu An</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((v) => !v)}
          className="px-4 py-2.5 rounded-2xl bg-[#FFF6DF] border border-[#D9A02E] text-[#7A5000] hover:bg-[#FCECC2] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'CAU_SIEU' ? 'Lập Linh Vị Cầu Siêu Mới' : 'Lập Bài Vị Cầu An Mới'}
          </span>
        </button>
      </div>

      {/* 2. CREATE TABLET FORM */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateTablet}
          className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 text-xs shadow-xs"
        >
          <h4 className="font-serif font-bold text-sm text-[#8C5500]">
            {activeTab === 'CAU_SIEU'
              ? 'An Vị Linh Vị Cầu Siêu Hương Linh'
              : 'An Vị Bài Vị Cầu An Gia Quyến'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              placeholder={
                activeTab === 'CAU_SIEU' ? 'Họ tên hương linh *' : 'Họ tên người nhận cầu an *'
              }
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
            />
            <input
              type="text"
              placeholder="Mối quan hệ (Ông nội, Thân mẫu, Con cháu...)"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
            />

            {activeTab === 'CAU_SIEU' ? (
              <>
                <input
                  type="text"
                  placeholder="Pháp danh (nếu có)"
                  value={dharmaName}
                  onChange={(e) => setDharmaName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Ngày mất ÂL (15/07)"
                    value={lunarDeathDate}
                    onChange={(e) => setLunarDeathDate(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                  />
                  <input
                    type="text"
                    placeholder="Hưởng thọ / dương"
                    value={longevity}
                    onChange={(e) => setLongevity(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                  />
                </div>
              </>
            ) : (
              <input
                type="text"
                placeholder="Năm sinh / Tuổi (VD: 1962)"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
              />
            )}
          </div>

          <textarea
            rows={2}
            placeholder={
              activeTab === 'CAU_SIEU'
                ? 'Lời nguyện cầu siêu độ hương linh...'
                : 'Lời cầu nguyện bình an, sức khỏe, tiêu trừ tật bệnh...'
            }
            value={prayerWish}
            onChange={(e) => setPrayerWish(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
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
              An Vị Lên Đài Sen
            </button>
          </div>
        </form>
      )}

      {/* 3. TABLETS GRID + SELECTED DEDICATION SHRINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Traditional Ornamental Lotus Tablets List */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {filteredTablets.map((t) => {
            const isSelected = selectedTablet?.id === t.id;
            const isCauAn = t.mode === 'CAU_AN';

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTablet(t)}
                className={cn(
                  'relative rounded-3xl p-4 cursor-pointer transition-all border-2 select-none',
                  isCauAn
                    ? isSelected
                      ? 'bg-gradient-to-b from-[#FFF5F5] to-[#FFFFFF] border-rose-400 shadow-sm'
                      : 'bg-[#FFFFFF] border-rose-200 hover:border-rose-400'
                    : isSelected
                      ? 'bg-gradient-to-b from-[#FFF9EB] to-[#FFFDF8] border-[#C68B19] shadow-sm'
                      : 'bg-[#FFFFFF] border-[#EAD7A7] hover:border-[#C68B19]'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                      isCauAn
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#FFF6DF] text-[#8C5500] border border-[#EAD7A7]'
                    )}
                  >
                    {isCauAn ? 'Bài Vị Cầu An' : 'Linh Vị Cầu Siêu'} • {t.relationship}
                  </span>

                  {!t.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpiritTablet(t.id);
                        showToast('Đã gỡ bài vị khỏi danh sách cá nhân');
                      }}
                      className="p-1 text-[#6B533B] hover:text-rose-600 rounded-lg cursor-pointer"
                      aria-label="Xóa bài vị"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tablet Centerpiece Plaque */}
                <div className="my-2.5 text-center px-2 py-2.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7]">
                  <LotusMinimalIcon
                    className={cn(
                      'w-5 h-5 mx-auto mb-1',
                      isCauAn ? 'text-rose-600' : 'text-[#8C5500]'
                    )}
                  />
                  <h4 className="font-serif font-bold text-sm text-[#2C1E10] leading-snug">
                    {t.fullName}
                  </h4>
                  {t.dharmaName && (
                    <p className="text-[11px] font-semibold text-[#8C5500] mt-0.5">
                      Pháp danh: {t.dharmaName}
                    </p>
                  )}
                  <p className="text-[10px] text-[#6B533B] mt-0.5">
                    {t.lunarDeathDate
                      ? `Kỵ nhật: ${t.lunarDeathDate}${t.longevity ? ` • ${t.longevity}` : ''}`
                      : t.birthYear
                        ? `Năm sinh: ${t.birthYear}`
                        : 'Hồi hướng hằng ngày'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B533B]">
                  <span>Hương: {t.incenseLit} • Đèn: {t.lampsLit}</span>
                  <span className="text-[#8C5500] font-bold">{t.mantraCount} biến chú</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Dedicated Altar & 0->21 Chanting Counter */}
        {selectedTablet && (
          <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAD7A7]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5500]">
                  Đàn Tràng Tưởng Niệm Riêng
                </span>
                <h3 className="font-serif font-bold text-lg text-[#2C1E10]">
                  {selectedTablet.fullName}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-[#FFF6DF] text-[#8C5500] border border-[#EAD7A7]">
                  Đã hồi hướng: {selectedTablet.mantraCount} biến
                </span>
              </div>
            </div>

            {/* Ornamental Tablet Visual + Prayer */}
            <div
              className={cn(
                'rounded-3xl p-5 border text-center space-y-2.5',
                selectedTablet.mode === 'CAU_AN'
                  ? 'bg-gradient-to-b from-[#FFF5F5] to-[#FFFFFF] border-rose-200'
                  : 'bg-gradient-to-b from-[#FFF9EB] to-[#FFFFFF] border-[#EAD7A7]'
              )}
            >
              <div className="flex justify-center items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-candle-glow" />
                <LotusMinimalIcon
                  className={cn(
                    'w-7 h-7',
                    selectedTablet.mode === 'CAU_AN' ? 'text-rose-600' : 'text-[#8C5500]'
                  )}
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-candle-glow" />
              </div>

              <p className="text-xs italic text-[#5C442C] leading-relaxed max-w-lg mx-auto">
                &ldquo;{selectedTablet.prayerWish}&rdquo;
              </p>

              {/* Offering Actions on This Tablet */}
              <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.4);
                    lightSpiritTabletOffering(selectedTablet.id, 'incense');
                    showToast(`Đã thắp nén tâm hương lên ${selectedTablet.fullName}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Thắp Nén Tâm Hương ({selectedTablet.incenseLit})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.38);
                    lightSpiritTabletOffering(selectedTablet.id, 'lamp');
                    showToast(`Đã thắp Đèn Liên Hoa hồi hướng cho ${selectedTablet.fullName}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500] font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  <LotusLanternIcon className="w-3.5 h-3.5" />
                  <span>Thắp Đèn Liên Hoa ({selectedTablet.lampsLit})</span>
                </button>
              </div>
            </div>

            {/* Built-in 0 -> 21 Chú Vãng Sanh / Chú Dược Sư Counter */}
            <div className="rounded-3xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#8C5500] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Trì Chú Hồi Hướng ({sessionCycleCount}/21 biến)</span>
                </span>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMantraKey('vangSanh');
                      setSessionCycleCount(0);
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer',
                      selectedMantraKey === 'vangSanh'
                        ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                        : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                    )}
                  >
                    Chú Vãng Sanh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMantraKey('duocSu');
                      setSessionCycleCount(0);
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer',
                      selectedMantraKey === 'duocSu'
                        ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                        : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                    )}
                  >
                    Chú Dược Sư
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-1.5">
                <p className="text-xs font-bold text-[#8C5500]">{activeMantra.title}</p>
                <p className="font-serif text-sm text-[#2C1E10] whitespace-pre-line leading-relaxed">
                  {activeMantra.phonetic}
                </p>
                <p className="text-[11px] text-[#6B533B] pt-1 border-t border-[#EAD7A7]">
                  {activeMantra.meaning}
                </p>
              </div>

              {/* 21-bead Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-[#EAD7A7]/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F5C542] to-[#C8780A] transition-all duration-300"
                    style={{ width: `${Math.min(100, (sessionCycleCount / 21) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTapMantraCycle}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {sessionCycleCount === 21 ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã Đủ 21 Biến • Chạm Để Bắt Đầu Chuỗi Mới</span>
                  </>
                ) : (
                  <>
                    <WoodenFishMinimalIcon className="w-4 h-4" />
                    <span>Niệm Xong 1 Biến Hồi Hướng ({sessionCycleCount}/21)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

