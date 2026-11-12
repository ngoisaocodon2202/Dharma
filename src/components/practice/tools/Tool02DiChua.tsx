'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  Droplets,
  Check,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  PagodaMinimalIcon,
  LotusMinimalIcon,
  IncenseAltarIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  INCENSE_PRAYER_VERSE,
  PROSTRATION_STEPS,
  SANGHA_PRESENCE_FEED,
} from '@/data/practiceToolsData';
import { DHAMMAPADA_VERSES, type DhammapadaVerse } from '@/data/dhammapada';
import {
  playBellSound,
  playGrandTempleBellSound,
  playWoodenFishSound,
  playBambooShakeSound,
} from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

interface Tool02DiChuaProps {
  showToast: (msg: string) => void;
}

export function Tool02DiChua({ showToast }: Tool02DiChuaProps) {
  const {
    profile,
    templeIncenseCount,
    templeProstrationsCount,
    templeOfferingsCount,
    templeFortuneHistory,
    recordTempleIncense,
    recordTempleProstrationCycle,
    recordTempleOffering,
    recordFortuneDraw,
  } = useDharmaPracticeStore();

  // Ambient Temple Bell toggle
  const [ambientBellOn, setAmbientBellOn] = useState(false);
  const ambientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live Sangha ticker
  const [sanghaOnlineCount, setSanghaOnlineCount] = useState(128);
  const [feedItems, setFeedItems] = useState<string[]>(SANGHA_PRESENCE_FEED);
  const [feedIdx, setFeedIdx] = useState(0);

  // Ritual 1: Incense lit state
  const [incenseLitVisual, setIncenseLitVisual] = useState(false);

  // Ritual 2: 3 Prostrations step (0 = not started / ready, 1, 2, 3)
  const [prostrationStep, setProstrationStep] = useState(0);
  const [isBowingAnim, setIsBowingAnim] = useState(false);

  // Ritual 3: Lotus & Water offered state
  const [lotusOffered, setLotusOffered] = useState(false);
  const [waterOffered, setWaterOffered] = useState(false);

  // Ritual 4: Bamboo fortune draw
  const [isShakingFortune, setIsShakingFortune] = useState(false);
  const [drawnVerse, setDrawnVerse] = useState<DhammapadaVerse | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setFeedIdx((i) => (i + 1) % feedItems.length);
      setSanghaOnlineCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(118, Math.min(142, prev + delta));
      });
    }, 4800);
    return () => clearInterval(tickerTimer);
  }, [feedItems.length]);

  useEffect(() => {
    if (ambientBellOn) {
      playBellSound(0.28);
      ambientIntervalRef.current = setInterval(() => {
        playBellSound(0.22);
      }, 18000);
    } else if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }
    return () => {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
    };
  }, [ambientBellOn]);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  const pushUserFeed = (actionText: string) => {
    const name = profile.dharmaName || 'Đạo hữu';
    setFeedItems((prev) => [`${name} vừa ${actionText}`, ...prev.slice(0, 6)]);
    setFeedIdx(0);
  };

  const handleLightIncense = () => {
    setIncenseLitVisual(true);
    playBellSound(0.42);
    recordTempleIncense();
    pushUserFeed('dâng 3 nén hương tâm thành tại Chánh Điện');
    showToast('Đã thắp 3 nén hương tâm thành • Nguyện hương lan tỏa mười phương');
  };

  const handleProstrateStep = () => {
    if (isBowingAnim) return;
    setIsBowingAnim(true);
    playGrandTempleBellSound(0.5);
    const nextStep = prostrationStep >= 3 ? 1 : prostrationStep + 1;
    setProstrationStep(nextStep);

    setTimeout(() => setIsBowingAnim(false), 450);

    if (nextStep === 3) {
      recordTempleProstrationCycle(3);
      pushUserFeed('hoàn mãn 3 lạy Quy Y Tam Bảo');
      showToast('Công đức viên mãn 3 lạy Quy Y Phật - Pháp - Tăng! Đã lưu Sổ Công Đức.');
    } else {
      showToast(`${PROSTRATION_STEPS[nextStep - 1].title}`);
    }
  };

  const handleOfferAltarItem = (kind: 'hoa-sen' | 'tinh-thuy') => {
    playWoodenFishSound(0.4);
    if (kind === 'hoa-sen') {
      setLotusOffered(true);
      pushUserFeed('dâng Hoa Sen thanh tịnh cúng dường Phật Đài');
      showToast('Đã dâng Hoa Sen Thanh Tịnh lên Chánh Điện (+1 Công Đức)');
    } else {
      setWaterOffered(true);
      pushUserFeed('dâng Bình Tịnh Thủy gội rửa tâm trần');
      showToast('Đã dâng Nước Tịnh Thủy lên Phật Đài (+1 Công Đức)');
    }
    recordTempleOffering(kind);
  };

  const handleShakeFortune = () => {
    if (isShakingFortune) return;
    setIsShakingFortune(true);
    playBambooShakeSound(0.38);

    shakeTimerRef.current = setTimeout(() => {
      const idx = Math.floor(Math.random() * DHAMMAPADA_VERSES.length);
      const picked = DHAMMAPADA_VERSES[idx];
      setDrawnVerse(picked);
      setIsShakingFortune(false);
      playBellSound(0.45);
      recordFortuneDraw({
        verseNumber: picked.verseNumber,
        chapter: picked.chapter,
        verse: picked.verse,
        meaning: picked.meaning,
        guidance: picked.practiceGuidance,
      });
      pushUserFeed(`thỉnh được quẻ ${picked.verseNumber} Kinh Pháp Cú`);
      showToast(`Đã thỉnh Lộc Phật: ${picked.verseNumber} (${picked.chapter})`);
    }, 1150);
  };

  const activeProstrationInfo =
    prostrationStep > 0 ? PROSTRATION_STEPS[prostrationStep - 1] : PROSTRATION_STEPS[0];

  return (
    <div className="space-y-5">
      {/* 1. LIVE SANGHA TICKER */}
      <div className="rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Users className="w-3.5 h-3.5" />
            <span>Đang có {sanghaOnlineCount} Phật tử cùng lễ Phật</span>
          </span>
          <p className="text-xs text-[#6B533B] truncate font-medium">
            {feedItems[feedIdx]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAmbientBellOn((v) => !v)}
          className={cn(
            'px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto',
            ambientBellOn
              ? 'bg-[#FAD02C] border-[#D99B16] text-[#3D2505]'
              : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#8C5500] hover:bg-[#FFF6DF]'
          )}
        >
          {ambientBellOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{ambientBellOn ? 'Chuông Chùa: Bật' : 'Chuông Chùa Nền'}</span>
        </button>
      </div>

      {/* 2. IMMERSIVE GOLDEN BUDDHA ALTAR */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#DFC27D] bg-[#FFF9EB] shadow-md">
        <div
          className="relative min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-5 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(44, 30, 16, 0.72) 0%, rgba(44, 30, 16, 0.22) 50%, rgba(44, 30, 16, 0.35) 100%), url('/images/golden_buddha_altar.jpg')",
          }}
        >
          {/* Top Stats Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
            <span className="px-3 py-1 rounded-full bg-[#FFFDF8]/95 text-[#8C5500] border border-[#EAD7A7] text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <PagodaMinimalIcon className="w-3.5 h-3.5" />
              <span>Chánh Điện Tam Bảo</span>
            </span>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#3D2505] bg-[#FFF9EB]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#D9A02E]">
              <span>Hương: {templeIncenseCount}</span>
              <span>•</span>
              <span>Lạy: {templeProstrationsCount}</span>
              <span>•</span>
              <span>Phẩm vật: {templeOfferingsCount}</span>
            </div>
          </div>

          {/* Glowing Altar Props Overlay (Lotus Lamps + Offering Vase + Incense Censer with Smoke) */}
          <div className="relative z-10 flex items-end justify-center gap-6 sm:gap-10 pt-10 pb-2">
            {/* Left Lotus Lamp / Flower */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500',
                  lotusOffered
                    ? 'bg-pink-500/25 border-pink-300 shadow-[0_0_24px_rgba(244,114,182,0.7)] animate-candle-glow'
                    : 'bg-amber-400/15 border-amber-300/40 animate-candle-glow'
                )}
              >
                <LotusMinimalIcon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    lotusOffered ? 'text-pink-200' : 'text-[#FFE79A]'
                  )}
                />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-white/85">
                {lotusOffered ? 'Hoa Sen Thanh Tịnh' : 'Đăng Liên Hoa'}
              </span>
            </div>

            {/* Centerpiece Golden Incense Censer + 3 Incense Sticks + Rising Smoke */}
            <div className="relative flex flex-col items-center">
              {incenseLitVisual && (
                <div className="absolute -top-20 inset-x-0 flex justify-center gap-2 pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{ animationDelay: `${i * 0.45}s` }}
                      className="w-2.5 h-16 rounded-full bg-gradient-to-t from-amber-100/70 via-white/40 to-transparent blur-[2px] animate-incense-smoke"
                    />
                  ))}
                </div>
              )}

              {/* Three Incense Sticks */}
              <div className="flex items-end gap-2 mb-[-4px] z-10">
                {[12, 16, 12].map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {incenseLitVisual && (
                      <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c,0_0_18px_#f59e0b] animate-pulse" />
                    )}
                    <div
                      className="w-1 bg-gradient-to-b from-amber-200 to-amber-700 rounded-full"
                      style={{ height: `${h * 3}px` }}
                    />
                  </div>
                ))}
              </div>

              {/* Bronze Lư Hương */}
              <div className="w-20 h-9 rounded-b-2xl rounded-t-md bg-gradient-to-b from-[#FAD02C] via-[#C68915] to-[#6B4306] border border-[#FFE79A] shadow-[0_4px_18px_rgba(245,197,66,0.45)] flex items-center justify-center">
                <span className="text-[9px] font-serif font-bold tracking-widest text-white">
                  TÂM HƯƠNG
                </span>
              </div>
            </div>

            {/* Right Pure Water Vase / Lamp */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500',
                  waterOffered
                    ? 'bg-sky-400/25 border-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.65)] animate-candle-glow'
                    : 'bg-amber-400/15 border-amber-300/40 animate-candle-glow'
                )}
              >
                <Droplets
                  className={cn(
                    'w-6 h-6 transition-colors',
                    waterOffered ? 'text-sky-200' : 'text-[#FFE79A]'
                  )}
                />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-white/90">
                {waterOffered ? 'Bình Tịnh Thủy' : 'Đăng Trí Tuệ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR INTERACTIVE RITUALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* NGHI THỨC 1: DÂNG HƯƠNG TÂM THÀNH */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1E10]">
                  1. Dâng Hương Tâm Thành
                </h4>
                <p className="text-[11px] text-[#6B533B]">Thắp 3 nén hương Giới • Định • Tuệ</p>
              </div>
            </div>
            {incenseLitVisual && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[#8C5500] text-[10px] font-bold">
                Đang Tỏa Hương
              </span>
            )}
          </div>

          <p className="p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] text-xs italic text-[#5C442C] leading-relaxed">
            &ldquo;{INCENSE_PRAYER_VERSE}&rdquo;
          </p>

          <button
            type="button"
            onClick={handleLightIncense}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <IncenseAltarIcon className="w-4 h-4" />
            <span>{incenseLitVisual ? 'Dâng Thêm Nén Tâm Hương' : 'Thắp 3 Nén Hương Ngay'}</span>
          </button>
        </div>

        {/* NGHI THỨC 2: ĐẢNH LỄ TAM BẢO (3 LẠY) */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                <TempleBellIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1E10]">
                  2. Đảnh Lễ Tam Bảo (3 Lạy)
                </h4>
                <p className="text-[11px] text-[#6B533B]">
                  {prostrationStep}/3 Lạy • Tổng đã lễ: {templeProstrationsCount} lạy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((stepNum) => (
                <span
                  key={stepNum}
                  className={cn(
                    'w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border transition-all',
                    prostrationStep >= stepNum
                      ? 'bg-[#FAD02C] border-[#C8780A] text-[#3D2505]'
                      : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                  )}
                >
                  {prostrationStep >= stepNum ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </span>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'p-3 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-1 transition-transform duration-300',
              isBowingAnim && 'scale-[0.98] bg-[#FFF4D0]'
            )}
          >
            <p className="text-xs font-bold text-[#8C5500]">
              {activeProstrationInfo.title}{' '}
              <span className="font-normal text-[#6B533B]">({activeProstrationInfo.pali})</span>
            </p>
            <p className="text-xs text-[#2C1E10] leading-relaxed">
              {activeProstrationInfo.prayer}
            </p>
          </div>

          <button
            type="button"
            onClick={handleProstrateStep}
            className="w-full py-2.5 rounded-2xl bg-[#FFF6DF] border-2 border-[#D9A02E] hover:bg-[#FCECC2] text-[#7A5000] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {prostrationStep === 0
                ? 'Khởi Lễ: Lạy Thứ Nhất (Quy Y Phật)'
                : prostrationStep === 1
                  ? 'Tiếp Tục: Lạy Thứ Hai (Quy Y Pháp)'
                  : prostrationStep === 2
                    ? 'Viên Mãn: Lạy Thứ Ba (Quy Y Tăng)'
                    : 'Thực Hành Lại Chuỗi 3 Lạy Mới'}
            </span>
          </button>
        </div>

        {/* NGHI THỨC 3: DÂNG HOA SEN & TỊNH THỦY */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
              <LotusMinimalIcon className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2C1E10]">
                3. Dâng Hoa Sen &amp; Tịnh Thủy
              </h4>
              <p className="text-[11px] text-[#6B533B]">
                Cúng dường thanh tịnh nuôi dưỡng nhân duyên an lạc
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOfferAltarItem('hoa-sen')}
              className={cn(
                'p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:scale-95',
                lotusOffered
                  ? 'bg-pink-50 border-pink-300 text-pink-900'
                  : 'bg-[#FFF9EB] border-[#EAD7A7] text-[#2C1E10] hover:border-[#C68B19]'
              )}
            >
              <LotusMinimalIcon className="w-5 h-5 text-pink-600" />
              <span className="text-xs font-bold whitespace-normal">Dâng Hoa Sen</span>
              <span className="text-[10px] text-[#6B533B] whitespace-normal">
                Biểu tượng thanh khiết không nhiễm bụi trần
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOfferAltarItem('tinh-thuy')}
              className={cn(
                'p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:scale-95',
                waterOffered
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-[#FFF9EB] border-[#EAD7A7] text-[#2C1E10] hover:border-[#C68B19]'
              )}
            >
              <Droplets className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-bold whitespace-normal">Dâng Tịnh Thủy</span>
              <span className="text-[10px] text-[#6B533B] whitespace-normal">
                Gội rửa nóng giận, tâm trong như mặt hồ
              </span>
            </button>
          </div>
        </div>

        {/* NGHI THỨC 4: THỈNH LỘC PHẬT / ỐNG XĂM PHÁP CÚ */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-8 h-8 rounded-xl bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]',
                  isShakingFortune && 'animate-fortune-shake'
                )}
              >
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1E10]">
                  4. Thỉnh Lộc Phật • Ống Xăm Pháp Cú
                </h4>
                <p className="text-[11px] text-[#6B533B]">
                  Rút một lời dạy Kinh Pháp Cú soi sáng tâm hôm nay
                </p>
              </div>
            </div>
          </div>

          {drawnVerse ? (
            <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#D9A02E] space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#8C5500]">
                  {drawnVerse.verseNumber} • {drawnVerse.chapter}
                </span>
              </div>
              <p className="font-serif italic text-[#2C1E10] leading-relaxed">
                &ldquo;{drawnVerse.verse}&rdquo;
              </p>
              <p className="text-[#5C442C]">
                <strong>Ý nghĩa:</strong> {drawnVerse.meaning}
              </p>
              <p className="text-[#8C5500] font-medium">
                <strong>Thực hành:</strong> {drawnVerse.practiceGuidance}
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] text-xs text-[#6B533B]">
              Hãy tĩnh tâm vài nhịp thở, khởi niệm lành rồi chạm nút bên dưới để lắc Ống Xăm Pháp Cú đón nhận lời Phật dạy.
              {templeFortuneHistory.length > 0 && (
                <span className="block mt-1 text-[#8C5500] font-semibold">
                  Quẻ gần nhất: {templeFortuneHistory[0].verseNumber} ({templeFortuneHistory[0].dateKey})
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            disabled={isShakingFortune}
            onClick={handleShakeFortune}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={cn('w-4 h-4', isShakingFortune && 'animate-spin')} />
            <span>
              {isShakingFortune
                ? 'Đang Lắc Ống Xăm Tâm Thành...'
                : drawnVerse
                  ? 'Thỉnh Lại Một Quẻ Pháp Cú Khác'
                  : 'Lắc Ống Xăm Thỉnh Lộc Phật'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

