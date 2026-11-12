'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  Flame,
  Radio,
  Headphones,
  BookHeart,
  Music,
  Volume2,
  VolumeX,
  Grid,
  ChevronRight,
  Timer,
} from 'lucide-react';
import {
  LotusMinimalIcon,
  PagodaMinimalIcon,
  IncenseAltarIcon,
  MalaBeadsMinimalIcon,
  WoodenFishMinimalIcon,
  MeditatingMonkOutlineIcon,
  LotusLanternIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { Tool02DiChua } from '@/components/practice/tools/Tool02DiChua';
import { Tool03CauSieu } from '@/components/practice/tools/Tool03CauSieu';
import { Tool04MayNiemPhat } from '@/components/practice/tools/Tool04MayNiemPhat';
import { Tool05NgheKinh } from '@/components/practice/tools/Tool05NgheKinh';
import { Tool06TrangHat } from '@/components/practice/tools/Tool06TrangHat';
import { Tool07ChuongMo } from '@/components/practice/tools/Tool07ChuongMo';
import { Tool08SoGioChap } from '@/components/practice/tools/Tool08SoGioChap';
import { MEDITATION_SOUNDS } from '@/data/dharmaExtraData';
import { useDharmaAudioMixer } from '@/components/audio/DharmaAudioPlayer';
import { cleanupAllBuddhistAudio, playOmTempleBellSound } from '@/lib/buddhistSounds';
import { useDharmaPracticeStore } from '@/store/useDharmaPracticeStore';
import { cn } from '@/lib/utils';

export type SanctuaryToolId =
  | 'di-chua'
  | 'cau-sieu'
  | 'may-niem-phat'
  | 'nghe-kinh'
  | 'trang-hat'
  | 'chuong-mo'
  | 'so-gio-chap'
  | 'thien-hoi-tho'
  | 'nhac-tu-tap'
  | 'hoa-dang';

export interface SanctuaryWorkspaceProps {
  activeTool: SanctuaryToolId;
  onSelectTool: (tool: SanctuaryToolId) => void;
  onClose: () => void;
  bonTonParam?: string | null;
  showToast: (msg: string) => void;
}

interface WorkspaceNavItem {
  id: SanctuaryToolId | 'thu-vien-bon-ton';
  label: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  isRoute?: boolean;
}

const WORKSPACE_SWITCHER_ITEMS: WorkspaceNavItem[] = [
  { id: 'trang-hat', label: 'Tràng hạt', subtitle: 'Lần hạt 108 niệm Phật', Icon: MalaBeadsMinimalIcon },
  { id: 'chuong-mo', label: 'Chuông mõ', subtitle: 'Thỉnh chuông, gõ mõ Auto BPM', Icon: WoodenFishMinimalIcon },
  { id: 'nghe-kinh', label: 'Nghe kinh', subtitle: 'Tải về, nghe không cần mạng', Icon: Headphones },
  { id: 'may-niem-phat', label: 'Máy niệm Phật', subtitle: 'Niệm danh hiệu, trì chú', Icon: Radio },
  { id: 'di-chua', label: 'Đi chùa', subtitle: 'Lễ Phật nơi chánh điện', Icon: PagodaMinimalIcon },
  { id: 'thien-hoi-tho', label: 'Thiền định', subtitle: 'Thiền hơi thở Anapanasati', Icon: MeditatingMonkOutlineIcon },
  { id: 'nhac-tu-tap', label: 'Nhạc tu tập', subtitle: 'Âm thanh thư giãn 432Hz', Icon: Music },
  { id: 'cau-sieu', label: 'Liên đài Cầu Siêu', subtitle: 'Quản lý bài vị hương linh & gia tiên', Icon: IncenseAltarIcon },
  { id: 'so-gio-chap', label: 'Sổ Giỗ Chạp', subtitle: 'Ghi nhớ ngày giỗ người thân', Icon: BookHeart },
  { id: 'hoa-dang', label: 'Thả Hoa Đăng', subtitle: 'Thắp sáng đèn nguyện cầu', Icon: LotusLanternIcon },
  { id: 'thu-vien-bon-ton', label: 'Thư viện Bổn Tôn', subtitle: 'Chiêm bái 18 Tôn Tượng', Icon: LotusMinimalIcon, isRoute: true },
];

const BREATHING_PRESETS = [
  {
    id: '4-4-6-2',
    label: 'Anapanasati 4-4-6-2',
    desc: 'Hít 4s • Giữ 4s • Thở 6s • Nghỉ 2s',
    inhale: 4,
    holdIn: 4,
    exhale: 6,
    holdOut: 2,
  },
  {
    id: '4-7-8-0',
    label: 'Thư Giãn Sâu 4-7-8',
    desc: 'Hít 4s • Giữ 7s • Thở ra chậm 8s',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  },
  {
    id: '5-0-5-0',
    label: 'Điều Hòa Tâm 5-5',
    desc: 'Hít sâu đều 5s • Thở buông nhẹ 5s',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
  },
];

const formatTimer = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

export function SanctuaryWorkspace({
  activeTool,
  onSelectTool,
  onClose,
  bonTonParam,
  showToast,
}: SanctuaryWorkspaceProps) {
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedCauSieuTabletId, setSelectedCauSieuTabletId] = useState<string | null>(null);
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);

  const { profile, prayerLamps, addMeditationMinutes, addPrayerLamp } = useDharmaPracticeStore();
  const mixer = useDharmaAudioMixer();

  // Thiền Hơi Thở Anapanasati state
  const [breathPresetId, setBreathPresetId] = useState('4-4-6-2');
  const [medDurationMins, setMedDurationMins] = useState<5 | 15 | 30 | 45>(15);
  const [medSecLeft, setMedSecLeft] = useState(15 * 60);
  const [isMeditating, setIsMeditating] = useState(false);
  const [cycleSec, setCycleSec] = useState(0);

  // Hoa Đăng state
  const [lampType, setLampType] = useState<'CAU_AN' | 'CAU_SIEU'>('CAU_AN');
  const [lampSender, setLampSender] = useState(profile.dharmaName || 'Cư sĩ Tâm An');
  const [lampRecipient, setLampRecipient] = useState('');
  const [lampWish, setLampWish] = useState('');

  useEffect(() => {
    if (!lampSender && profile.dharmaName) {
      setLampSender(profile.dharmaName);
    }
  }, [profile.dharmaName, lampSender]);

  const activePreset = useMemo(
    () => BREATHING_PRESETS.find((p) => p.id === breathPresetId) || BREATHING_PRESETS[0],
    [breathPresetId]
  );
  const cycleLength =
    activePreset.inhale + activePreset.holdIn + activePreset.exhale + activePreset.holdOut;

  useEffect(() => {
    if (!isMeditating || activeTool !== 'thien-hoi-tho') return;
    const id = setInterval(() => {
      setCycleSec((prev) => (prev + 1) % Math.max(1, cycleLength));
      setMedSecLeft((prev) => {
        if (prev <= 1) {
          setIsMeditating(false);
          playOmTempleBellSound(0.7);
          addMeditationMinutes(medDurationMins, `Thiền hơi thở ${activePreset.label}`);
          showToast(`Thời thiền ${medDurationMins} phút hoàn mãn! Đã cộng vào Sổ Công Đức.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isMeditating, activeTool, cycleLength, medDurationMins, activePreset.label, addMeditationMinutes, showToast]);

  const breathPhase = useMemo(() => {
    if (!isMeditating) {
      return {
        label: 'Sẵn Sàng An Trú Hơi Thở',
        sub: 'Thả lỏng đôi vai, giữ cột sống thẳng tự nhiên',
        scale: 1,
        ringColor: 'border-[#D9A03C]',
      };
    }
    const { inhale, holdIn, exhale } = activePreset;
    if (cycleSec < inhale) {
      return {
        label: `Hít Vào Sâu (${inhale - cycleSec}s)`,
        sub: 'Biết rõ mình đang hít vào thật nhẹ nhàng...',
        scale: 1.18,
        ringColor: 'border-emerald-400',
      };
    }
    if (cycleSec < inhale + holdIn) {
      return {
        label: `An Trú Chánh Niệm (${inhale + holdIn - cycleSec}s)`,
        sub: 'Tâm lắng đọng tròn đầy trong hiện tại...',
        scale: 1.18,
        ringColor: 'border-[#E8BF6A]',
      };
    }
    if (cycleSec < inhale + holdIn + exhale) {
      return {
        label: `Thở Ra Buông Thư (${inhale + holdIn + exhale - cycleSec}s)`,
        sub: 'Thả lỏng vai, buông xả mọi lo âu...',
        scale: 0.9,
        ringColor: 'border-amber-400',
      };
    }
    return {
      label: `Nghỉ Nhẹ Tịnh Tâm (${cycleLength - cycleSec}s)`,
      sub: 'Rỗng rang thanh thản trước hơi thở mới...',
      scale: 0.9,
      ringColor: 'border-white/30',
    };
  }, [isMeditating, cycleSec, activePreset, cycleLength]);

  useEffect(() => {
    if (activeTool !== 'thien-hoi-tho' && isMeditating) {
      setIsMeditating(false);
    }
  }, [activeTool, isMeditating]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTool]);

  useEffect(() => {
    return () => {
      cleanupAllBuddhistAudio();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        cleanupAllBuddhistAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const activeMeta = useMemo(
    () =>
      WORKSPACE_SWITCHER_ITEMS.find((item) => item.id === activeTool) ||
      WORKSPACE_SWITCHER_ITEMS[0],
    [activeTool]
  );

  const handleSwitchNav = (item: WorkspaceNavItem) => {
    cleanupAllBuddhistAudio();
    setIsMeditating(false);
    setShowQuickSwitcher(false);
    if (item.isRoute || item.id === 'thu-vien-bon-ton') {
      router.push('/thu-vien-bon-ton');
      return;
    }
    if (item.id !== 'cau-sieu') {
      setSelectedCauSieuTabletId(null);
    }
    onSelectTool(item.id);
  };

  const handleCloseWorkspace = () => {
    cleanupAllBuddhistAudio();
    setIsMeditating(false);
    onClose();
  };

  const handleLightLamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lampRecipient.trim() && !lampWish.trim()) return;
    playOmTempleBellSound(0.55);
    addPrayerLamp({
      type: lampType,
      senderName: lampSender.trim() || profile.dharmaName || 'Phật tử hữu duyên',
      recipientName:
        lampRecipient.trim() ||
        (lampType === 'CAU_AN' ? 'Gia đạo bình an' : 'Cửu huyền thất tổ'),
      wishContent:
        lampWish.trim() ||
        (lampType === 'CAU_AN'
          ? 'Nguyện thân tâm an lạc, tật bệnh tiêu trừ, vạn sự cát tường.'
          : 'Nguyện hương linh nương nhờ Phật lực sớm siêu sanh về miền Tịnh Độ.'),
    });
    showToast(
      lampType === 'CAU_AN'
        ? 'Đã thắp Hoa Đăng Cầu An & thả trôi trên dòng nước thanh tịnh!'
        : 'Đã thắp Hoa Đăng Cầu Siêu & hồi hướng đến cửu huyền thất tổ!'
    );
    setLampRecipient('');
    setLampWish('');
  };

  const isSoundModePlaying = (mode: '432' | '528' | 'bell' | 'woodfish' | 'mantra') => {
    if (mode === '432') return mixer.droneActive && mixer.droneFreq === 432;
    if (mode === '528') return mixer.droneActive && mixer.droneFreq === 528;
    if (mode === 'bell') return mixer.bellIntervalSec > 0;
    if (mode === 'woodfish') return mixer.woodfishActive;
    if (mode === 'mantra') return mixer.chantActive;
    return false;
  };

  const handleToggleSoundMode = (mode: '432' | '528' | 'bell' | 'woodfish' | 'mantra') => {
    if (mode === '432') {
      if (mixer.droneActive && mixer.droneFreq === 432) {
        mixer.toggleDrone();
      } else {
        mixer.setDroneFreq(432);
        if (!mixer.droneActive) mixer.toggleDrone();
      }
      return;
    }
    if (mode === '528') {
      if (mixer.droneActive && mixer.droneFreq === 528) {
        mixer.toggleDrone();
      } else {
        mixer.setDroneFreq(528);
        if (!mixer.droneActive) mixer.toggleDrone();
      }
      return;
    }
    if (mode === 'bell') {
      mixer.setBellIntervalSec(mixer.bellIntervalSec > 0 ? 0 : 15);
      if (mixer.bellIntervalSec === 0) mixer.strikeBellNow();
      return;
    }
    if (mode === 'woodfish') {
      if (!mixer.woodfishActive) mixer.setWoodfishBpm(60);
      mixer.toggleWoodfish();
      return;
    }
    if (mode === 'mantra') {
      mixer.setChantTrackId('luc-tu');
      mixer.toggleChant();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Đạo Tràng Hành Trì - ${activeMeta.label}`}
      className="fixed inset-0 z-[9990] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in"
    >
      {/* Clean Dharma Single Top Header (Hidden for may-niem-phat as it provides its own native Om Mani app header with (X) close) */}
      {activeTool !== 'may-niem-phat' && (
        <header className="shrink-0 bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-[#EAD7A7] shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 relative">
            <button
              type="button"
              onClick={handleCloseWorkspace}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] font-bold text-xs hover:bg-[#FCECC2] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <div className="min-w-0 text-center">
              <h2 className="text-[16px] sm:text-lg font-bold text-[#2C1E10] truncate">
                {activeMeta.label}
              </h2>
              <p className="text-[11px] text-[#6B533B] truncate hidden sm:block">
                {activeMeta.subtitle}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowQuickSwitcher((v) => !v)}
                className="w-10 h-10 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#8C5500] hover:bg-[#FCECC2] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Chuyển đổi phương tiện tu tập"
                title="Chuyển nhanh phương tiện khác"
              >
                <Grid className="w-4 h-4" />
              </button>

              {showQuickSwitcher && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowQuickSwitcher(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 max-h-[75vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] shadow-xl p-1.5 z-40 space-y-0.5">
                    {WORKSPACE_SWITCHER_ITEMS.map((item) => {
                      const Icon = item.Icon;
                      const isActive = item.id === activeTool;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSwitchNav(item)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer',
                            isActive
                              ? 'bg-[#FFF6DF] text-[#8C5500] font-bold border border-[#EAD7A7]'
                              : 'text-[#2C1E10] hover:bg-[#FAF7F0]'
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Active Sanctuary Scroll Area */}
      <div
        ref={scrollAreaRef}
        className={cn(
          'flex-1 overflow-y-auto',
          activeTool === 'may-niem-phat' ? 'p-0 flex flex-col items-center bg-[#FDF8EC]' : 'px-3.5 sm:px-6 py-4 sm:py-6'
        )}
      >
        <div
          className={cn(
            'w-full mx-auto',
            activeTool === 'may-niem-phat'
              ? 'max-w-md min-h-full flex flex-col justify-between shadow-2xl rounded-none sm:rounded-[36px] overflow-hidden sm:my-3 border-0 sm:border-2 border-[#EAD7A7]'
              : 'max-w-6xl pb-16'
          )}
        >
          {activeTool === 'di-chua' && <Tool02DiChua showToast={showToast} />}

          {activeTool === 'cau-sieu' && (
            <Tool03CauSieu
              initialSelectedTabletId={selectedCauSieuTabletId}
              showToast={showToast}
            />
          )}

          {activeTool === 'may-niem-phat' && (
            <Tool04MayNiemPhat onClose={handleCloseWorkspace} showToast={showToast} />
          )}

          {activeTool === 'nghe-kinh' && <Tool05NgheKinh showToast={showToast} />}

          {activeTool === 'trang-hat' && (
            <Tool06TrangHat bonTonParam={bonTonParam} showToast={showToast} />
          )}

          {activeTool === 'chuong-mo' && <Tool07ChuongMo showToast={showToast} />}

          {activeTool === 'so-gio-chap' && (
            <Tool08SoGioChap
              onJumpToCauSieuTablet={(tabletId) => {
                cleanupAllBuddhistAudio();
                setSelectedCauSieuTabletId(tabletId);
                onSelectTool('cau-sieu');
              }}
              showToast={showToast}
            />
          )}

          {/* Tool: Thiền Hơi Thở Anapanasati */}
          {activeTool === 'thien-hoi-tho' && (
            <div className="rounded-[28px] bg-[#FFFFFF] border border-[#EAD7A7] p-5 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Expanding Sacred Breathing Circle */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 space-y-5">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <div
                      style={{ transform: `scale(${breathPhase.scale})` }}
                      className={cn(
                        'w-44 h-44 rounded-full border-2 bg-gradient-to-br from-[#FFF9EB] via-[#FCECC2] to-[#FFF2CC] flex flex-col items-center justify-center shadow-[0_0_36px_rgba(217,160,60,0.28)] transition-transform duration-1000 ease-in-out',
                        breathPhase.ringColor
                      )}
                    >
                      <LotusMinimalIcon className="w-7 h-7 text-[#8C5500] mb-1.5" />
                      <span className="font-mono text-3xl font-bold text-[#2C1E10]">
                        {formatTimer(medSecLeft)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] mt-1">
                        {isMeditating ? 'Đang Thiền' : 'Chánh Niệm'}
                      </span>
                    </div>
                  </div>

                  <div className="text-center space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-[#8C5500]">
                      {breathPhase.label}
                    </h3>
                    <p className="text-xs text-[#6B533B]">{breathPhase.sub}</p>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="lg:col-span-6 p-5 rounded-3xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#2C1E10] block">
                      Nhịp Quán Hơi Thở Anapanasati:
                    </span>
                    <div className="space-y-2">
                      {BREATHING_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setBreathPresetId(preset.id);
                            setCycleSec(0);
                          }}
                          className={cn(
                            'w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer',
                            breathPresetId === preset.id
                              ? 'bg-[#FFF6DF] border-[#C68B19] text-[#2C1E10] shadow-2xs'
                              : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                          )}
                        >
                          <div>
                            <span className="text-xs font-bold text-[#2C1E10] block">{preset.label}</span>
                            <span className="text-[11px] text-[#6B533B]">{preset.desc}</span>
                          </div>
                          {breathPresetId === preset.id && (
                            <Check className="w-4 h-4 text-[#8C5500] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#2C1E10] block">
                      Thời Lượng Tọa Thiền:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {([5, 15, 30, 45] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          disabled={isMeditating}
                          onClick={() => {
                            setMedDurationMins(m);
                            setMedSecLeft(m * 60);
                            setCycleSec(0);
                          }}
                          className={cn(
                            'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-50',
                            medDurationMins === m
                              ? 'bg-[#FFE07D] text-[#3D2505] border-[#C68B19]'
                              : 'bg-[#FFFFFF] border-[#EAD7A7] text-[#6B533B]'
                          )}
                        >
                          {m} phút
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isMeditating) {
                          setIsMeditating(false);
                          showToast('Đã tạm dừng thời khóa tọa thiền');
                        } else {
                          if (medSecLeft === 0) setMedSecLeft(medDurationMins * 60);
                          playOmTempleBellSound(0.6);
                          setIsMeditating(true);
                          showToast('Tiếng chuông khai thiền • Thở vào tĩnh lặng');
                        }
                      }}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer shadow-xs"
                    >
                      {isMeditating ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                      <span>
                        {isMeditating ? 'Tạm Dừng Thời Thiền' : 'Thỉnh Chuông Khai Thiền'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const completedMins = Math.floor((medDurationMins * 60 - medSecLeft) / 60);
                        setIsMeditating(false);
                        if (completedMins >= 1) {
                          addMeditationMinutes(completedMins, `Tọa thiền ${completedMins} phút`);
                          playOmTempleBellSound(0.5);
                          showToast(`Đã ghi nhận ${completedMins} phút tọa thiền vào Sổ Công Đức!`);
                        }
                        setMedSecLeft(medDurationMins * 60);
                        setCycleSec(0);
                      }}
                      className="px-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#8C5500] text-xs font-bold cursor-pointer"
                      title="Đặt lại hoặc lưu phút thiền"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool: Nhạc Tu Tập (432Hz / 528Hz / Chuông / Mõ / Lục Tự) */}
          {activeTool === 'nhac-tu-tap' && (
            <div className="space-y-5">
              <div className="rounded-[26px] bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border border-[#EAD7A7] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500]">
                    Không Gian Âm Thanh 432Hz
                  </span>
                  <h3 className="text-xl font-bold text-[#2C1E10] mt-1">
                    Nhạc Tu Tập &amp; Tĩnh Tâm
                  </h3>
                  <p className="text-xs text-[#6B533B] mt-0.5">
                    Âm thanh tần số chữa lành • Có thể phối nhiều lớp âm cùng lúc
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-full bg-[#FFFFFF] border border-[#EAD7A7] text-[11px]">
                    <Timer className="w-3.5 h-3.5 text-[#8C5500] ml-2 mr-1" />
                    {([0, 15, 30, 60] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => mixer.setSleepTimer(m)}
                        className={cn(
                          'px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors',
                          mixer.sleepTimerMins === m
                            ? 'bg-[#FFE07D] text-[#3D2505]'
                            : 'text-[#6B533B] hover:text-[#2C1E10]'
                        )}
                      >
                        {m === 0 ? 'Vô hạn' : `${m}p`}
                      </button>
                    ))}
                  </div>

                  {mixer.isAnyActive && (
                    <button
                      type="button"
                      onClick={() => mixer.stopAllChannels()}
                      className="px-3.5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Tắt hết</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {MEDITATION_SOUNDS.map((track) => {
                  const playing = isSoundModePlaying(track.mode);
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleToggleSoundMode(track.mode)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleToggleSoundMode(track.mode);
                        }
                      }}
                      className={cn(
                        'p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all cursor-pointer',
                        playing
                          ? 'bg-[#FFF9EB] border-[#C68B19] shadow-sm'
                          : 'bg-[#FFFFFF] border-[#EAD7A7] hover:border-[#C68B19]'
                      )}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#DFC27D]">
                        <img
                          src={track.image}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                        {playing && (
                          <div className="absolute inset-0 bg-[#FFFDF8]/75 flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-[#8C5500] animate-pulse" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500]">
                            {track.durationLabel}
                          </span>
                          {playing && (
                            <span className="text-[10px] font-bold text-emerald-700">
                              Đang phát
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#2C1E10] truncate mt-0.5">
                          {track.title}
                        </h4>
                        <p className="text-xs text-[#6B533B] line-clamp-2 mt-0.5">
                          {track.subtitle}
                        </p>
                      </div>

                      <span
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors border',
                          playing
                            ? 'bg-[#FFE07D] text-[#3D2505] border-[#C68B19]'
                            : 'bg-[#FFF6DF] text-[#8C5500] border-[#EAD7A7]'
                        )}
                      >
                        {playing ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tool: Thả Hoa Đăng */}
          {activeTool === 'hoa-dang' && (
            <div className="rounded-[28px] bg-[#FFFFFF] border border-[#EAD7A7] p-5 sm:p-7 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Flowing Lotus River (Bright Warm Gold & Ivory Sanctuary) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative rounded-3xl overflow-hidden border border-[#DFC27D] bg-gradient-to-b from-[#FFFDF8] via-[#FFF6DF] to-[#FCECC2] p-4 sm:p-5 min-h-[300px] flex flex-col justify-between shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C5500] z-10">
                      <span className="font-bold flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#C68B19]" />
                        Dòng Sông Hoa Đăng Nguyện Ước ({prayerLamps.length} ngọn đăng)
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B533B]">
                        Vàng: Cầu An • Hồng: Cầu Siêu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 z-10 max-h-[260px] overflow-y-auto pr-1">
                      {prayerLamps.map((lamp) => {
                        const isPeace = lamp.type === 'CAU_AN';
                        return (
                          <div
                            key={lamp.id}
                            className={cn(
                              'p-3.5 rounded-2xl border space-y-1 transition-all shadow-2xs',
                              isPeace
                                ? 'bg-[#FFFFFF] border-[#D9A02E] text-[#2C1E10]'
                                : 'bg-[#FFF5F5] border-rose-300 text-[#2C1E10]'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2 text-[10px]">
                              <span
                                className={cn(
                                  'font-bold uppercase tracking-wider flex items-center gap-1',
                                  isPeace ? 'text-[#8C5500]' : 'text-rose-700'
                                )}
                              >
                                <LotusLanternIcon className="w-3 h-3 shrink-0" />
                                {isPeace ? 'Cầu An' : 'Cầu Siêu'}
                              </span>
                              <span className="text-[#6B533B] font-medium truncate">{lamp.senderName}</span>
                            </div>
                            <h4 className="font-bold text-xs text-[#2C1E10] truncate">
                              Hướng về: {lamp.recipientName}
                            </h4>
                            <p className="text-[11px] text-[#5C442C] line-clamp-2 leading-relaxed">
                              “{lamp.wishContent}”
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-[#7A5000] font-medium italic text-center z-10">
                      “Một ngọn đèn trí tuệ thắp lên, phá tan bóng tối vô minh ngàn năm.”
                    </p>
                  </div>
                </div>

                {/* Light New Lantern Form */}
                <form
                  onSubmit={handleLightLamp}
                  className="lg:col-span-5 p-5 rounded-3xl bg-[#FFF9EB] border border-[#EAD7A7] space-y-3.5 text-xs"
                >
                  <h3 className="font-bold text-base text-[#8C5500]">
                    Phát Nguyện Thắp Đèn Hoa Đăng
                  </h3>

                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7]">
                    <button
                      type="button"
                      onClick={() => setLampType('CAU_AN')}
                      className={cn(
                        'py-2 rounded-lg font-bold transition-all cursor-pointer',
                        lampType === 'CAU_AN'
                          ? 'bg-[#FFE07D] text-[#3D2505] shadow-2xs'
                          : 'text-[#6B533B]'
                      )}
                    >
                      Hoa Đăng Cầu An
                    </button>
                    <button
                      type="button"
                      onClick={() => setLampType('CAU_SIEU')}
                      className={cn(
                        'py-2 rounded-lg font-bold transition-all cursor-pointer',
                        lampType === 'CAU_SIEU'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-[#6B533B]'
                      )}
                    >
                      Hoa Đăng Cầu Siêu
                    </button>
                  </div>

                  <div>
                    <label className="text-[#6B533B] font-semibold block mb-1">Người phát nguyện</label>
                    <input
                      type="text"
                      value={lampSender}
                      onChange={(e) => setLampSender(e.target.value)}
                      placeholder="Tên hoặc Pháp danh của bạn..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                    />
                  </div>

                  <div>
                    <label className="text-[#6B533B] font-semibold block mb-1">
                      {lampType === 'CAU_AN'
                        ? 'Người nhận lời cầu an *'
                        : 'Hương linh / Cửu huyền thất tổ *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={lampRecipient}
                      onChange={(e) => setLampRecipient(e.target.value)}
                      placeholder={
                        lampType === 'CAU_AN'
                          ? 'Ví dụ: Song thân cha mẹ & toàn gia quyến...'
                          : 'Ví dụ: Hương linh Ông Nội...'
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                    />
                  </div>

                  <div>
                    <label className="text-[#6B533B] font-semibold block mb-1">Lời khấn nguyện</label>
                    <textarea
                      rows={3}
                      value={lampWish}
                      onChange={(e) => setLampWish(e.target.value)}
                      placeholder="Nhập tâm nguyện lành gửi gắm qua ánh đèn..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAD7A7] text-[#2C1E10] placeholder-[#8E775B] focus:outline-none focus:border-[#C68B19]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer shadow-xs"
                  >
                    <LotusLanternIcon className="w-4 h-4" />
                    <span>Thắp Sáng &amp; Thả Hoa Đăng</span>
                  </button>

                  <div className="pt-1 text-center">
                    <Link
                      href={lampType === 'CAU_AN' ? '/cau-nguyen' : '/cau-sieu'}
                      className="text-[11px] font-bold text-[#8C5500] hover:underline"
                    >
                      Mở {lampType === 'CAU_AN' ? 'Phòng Cầu An Chung' : 'Phòng Cầu Siêu Chung'} →
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
