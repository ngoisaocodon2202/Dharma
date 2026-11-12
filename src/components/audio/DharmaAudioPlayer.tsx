'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Volume2,
  Play,
  Pause,
  Radio,
  Timer,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Square,
  Sparkles,
  Waves,
} from 'lucide-react';
import {
  playOmTempleBellSound,
  playWoodenFishSound,
  startHealingDrone,
  stopHealingDrone,
  playChantingPulse,
} from '@/lib/buddhistSounds';

export interface ChantingTrackOption {
  id: 'a-di-da' | 'quan-am' | 'luc-tu' | 'dai-bi';
  title: string;
  syllables: string[];
  bpm: number;
  subtitle: string;
}

export const CHANTING_TRACKS: ChantingTrackOption[] = [
  {
    id: 'a-di-da',
    title: 'Nam Mô A Di Đà Phật',
    syllables: ['Nam', 'Mô', 'A', 'Di', 'Đà', 'Phật'],
    bpm: 72,
    subtitle: 'Tịnh Độ Lục Tự Di Đà • An Định Thân Tâm',
  },
  {
    id: 'quan-am',
    title: 'Nam Mô Quán Thế Âm Bồ Tát',
    syllables: ['Nam', 'Mô', 'Quán', 'Thế', 'Âm', 'Bồ', 'Tát'],
    bpm: 68,
    subtitle: 'Từ Bi Cứu Khổ • Dịu Mát Phiền Não',
  },
  {
    id: 'luc-tu',
    title: 'Om Mani Padme Hum',
    syllables: ['Om', 'Ma', 'Ni', 'Pad', 'Me', 'Hum'],
    bpm: 64,
    subtitle: 'Lục Tự Đại Minh Chân Ngôn',
  },
  {
    id: 'dai-bi',
    title: 'Chú Đại Bi (Tâm Đà La Ni)',
    syllables: ['Nam', 'Mô', 'Hắc', 'Ra', 'Đát', 'Na', 'Đa', 'Ra'],
    bpm: 86,
    subtitle: 'Nhịp Trì Chú Thiên Thủ Thiên Nhãn',
  },
];

export type BellIntervalSec = 0 | 15 | 30 | 60;
export type SleepTimerMins = 0 | 15 | 30 | 45 | 60;

interface DharmaAudioContextValue {
  // Channel 1: Đại Hồng Chung
  bellIntervalSec: BellIntervalSec;
  bellVolume: number;
  bellStrikes: number;
  setBellIntervalSec: (s: BellIntervalSec) => void;
  setBellVolume: (v: number) => void;
  strikeBellNow: () => void;

  // Channel 2: Tiếng Mõ Chùa Cổ
  woodfishActive: boolean;
  woodfishBpm: number;
  woodfishVolume: number;
  woodfishCount: number;
  toggleWoodfish: () => void;
  setWoodfishActive: (v: boolean) => void;
  setWoodfishBpm: (bpm: number) => void;
  setWoodfishVolume: (v: number) => void;
  tapWoodfishNow: () => void;

  // Channel 3: Sóng Âm Định Tâm (432Hz / 528Hz)
  droneActive: boolean;
  droneFreq: 432 | 528;
  droneVolume: number;
  toggleDrone: () => void;
  setDroneFreq: (freq: 432 | 528) => void;
  setDroneVolume: (v: number) => void;

  // Channel 4: Máy Niệm Phật + Sleep Timer
  chantActive: boolean;
  chantTrackId: ChantingTrackOption['id'];
  chantVolume: number;
  chantSyllableIdx: number;
  sleepTimerMins: SleepTimerMins;
  sleepRemainingSec: number;
  toggleChant: () => void;
  setChantTrackId: (id: ChantingTrackOption['id']) => void;
  setChantVolume: (v: number) => void;
  setSleepTimer: (mins: SleepTimerMins) => void;

  // Master helpers
  isAnyActive: boolean;
  stopAllChannels: () => void;
}

const DharmaAudioContext = createContext<DharmaAudioContextValue | undefined>(undefined);

export function DharmaMixerProvider({ children }: { children: React.ReactNode }) {
  // Channel 1
  const [bellIntervalSec, setBellIntervalSec] = useState<BellIntervalSec>(0);
  const [bellVolume, setBellVolume] = useState<number>(0.55);
  const [bellStrikes, setBellStrikes] = useState<number>(0);

  // Channel 2
  const [woodfishActive, setWoodfishActive] = useState<boolean>(false);
  const [woodfishBpm, setWoodfishBpm] = useState<number>(72);
  const [woodfishVolume, setWoodfishVolume] = useState<number>(0.55);
  const [woodfishCount, setWoodfishCount] = useState<number>(0);

  // Channel 3
  const [droneActive, setDroneActive] = useState<boolean>(false);
  const [droneFreq, setDroneFreqState] = useState<432 | 528>(432);
  const [droneVolume, setDroneVolumeState] = useState<number>(0.22);
  const droneCtrlRef = useRef<{ stop: () => void; setVolume: (v: number) => void } | null>(null);

  // Channel 4
  const [chantActive, setChantActive] = useState<boolean>(false);
  const [chantTrackId, setChantTrackId] = useState<ChantingTrackOption['id']>('a-di-da');
  const [chantVolume, setChantVolume] = useState<number>(0.32);
  const [chantSyllableIdx, setChantSyllableIdx] = useState<number>(0);
  const [sleepTimerMins, setSleepTimerMins] = useState<SleepTimerMins>(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number>(0);

  const strikeBellNow = useCallback(() => {
    playOmTempleBellSound(bellVolume);
    setBellStrikes((c) => c + 1);
  }, [bellVolume]);

  const tapWoodfishNow = useCallback(() => {
    playWoodenFishSound(woodfishVolume);
    setWoodfishCount((c) => c + 1);
  }, [woodfishVolume]);

  const stopAllChannels = useCallback(() => {
    setBellIntervalSec(0);
    setWoodfishActive(false);
    setDroneActive(false);
    setChantActive(false);
    setSleepTimerMins(0);
    setSleepRemainingSec(0);
    stopHealingDrone();
    droneCtrlRef.current = null;
  }, []);

  // Channel 1 Interval Timer
  useEffect(() => {
    if (bellIntervalSec <= 0) return;
    const ms = bellIntervalSec * 1000;
    const id = setInterval(() => {
      playOmTempleBellSound(bellVolume);
      setBellStrikes((c) => c + 1);
    }, ms);
    return () => clearInterval(id);
  }, [bellIntervalSec, bellVolume]);

  // Channel 2 Auto Mõ Timer
  useEffect(() => {
    if (!woodfishActive) return;
    const ms = Math.round(60000 / Math.max(40, Math.min(160, woodfishBpm)));
    const id = setInterval(() => {
      playWoodenFishSound(woodfishVolume);
      setWoodfishCount((c) => c + 1);
    }, ms);
    return () => clearInterval(id);
  }, [woodfishActive, woodfishBpm, woodfishVolume]);

  // Channel 3 Healing Drone lifecycle
  useEffect(() => {
    if (!droneActive) {
      stopHealingDrone();
      droneCtrlRef.current = null;
      return;
    }
    const ctrl = startHealingDrone(droneFreq, droneVolume);
    droneCtrlRef.current = ctrl;
    return () => {
      stopHealingDrone();
      droneCtrlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droneActive, droneFreq]);

  const setDroneVolume = useCallback((v: number) => {
    setDroneVolumeState(v);
    if (droneCtrlRef.current) {
      droneCtrlRef.current.setVolume(v);
    }
  }, []);

  const setDroneFreq = useCallback((freq: 432 | 528) => {
    setDroneFreqState(freq);
  }, []);

  // Channel 4 Máy Niệm Phật loop
  useEffect(() => {
    if (!chantActive) return;
    const track = CHANTING_TRACKS.find((t) => t.id === chantTrackId) || CHANTING_TRACKS[0];
    const intervalMs = Math.round(60000 / track.bpm);
    let step = 0;

    playChantingPulse(track.id, 0, chantVolume);
    setChantSyllableIdx(0);

    const id = setInterval(() => {
      step += 1;
      const idx = step % track.syllables.length;
      setChantSyllableIdx(idx);
      playChantingPulse(track.id, idx, chantVolume);
      if (idx === 0 && step % (track.syllables.length * 4) === 0) {
        playOmTempleBellSound(Math.min(0.35, chantVolume * 0.8));
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [chantActive, chantTrackId, chantVolume]);

  // Sleep Timer countdown
  const setSleepTimer = useCallback((mins: SleepTimerMins) => {
    setSleepTimerMins(mins);
    setSleepRemainingSec(mins * 60);
  }, []);

  useEffect(() => {
    if (sleepTimerMins === 0) return;
    const id = setInterval(() => {
      setSleepRemainingSec((prev) => {
        if (prev <= 1) {
          stopAllChannels();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sleepTimerMins, stopAllChannels]);

  const isAnyActive = bellIntervalSec > 0 || woodfishActive || droneActive || chantActive;

  return (
    <DharmaAudioContext.Provider
      value={{
        bellIntervalSec,
        bellVolume,
        bellStrikes,
        setBellIntervalSec,
        setBellVolume,
        strikeBellNow,
        woodfishActive,
        woodfishBpm,
        woodfishVolume,
        woodfishCount,
        toggleWoodfish: () => setWoodfishActive((v) => !v),
        setWoodfishActive,
        setWoodfishBpm,
        setWoodfishVolume,
        tapWoodfishNow,
        droneActive,
        droneFreq,
        droneVolume,
        toggleDrone: () => setDroneActive((v) => !v),
        setDroneFreq,
        setDroneVolume,
        chantActive,
        chantTrackId,
        chantVolume,
        chantSyllableIdx,
        sleepTimerMins,
        sleepRemainingSec,
        toggleChant: () => setChantActive((v) => !v),
        setChantTrackId,
        setChantVolume,
        setSleepTimer,
        isAnyActive,
        stopAllChannels,
      }}
    >
      {children}
    </DharmaAudioContext.Provider>
  );
}

export function useDharmaAudioMixer() {
  const ctx = useContext(DharmaAudioContext);
  if (!ctx) {
    throw new Error('useDharmaAudioMixer must be used within DharmaMixerProvider');
  }
  return ctx;
}

/**
 * Embedded Homepage Panel: "Pháp Âm Thiền Tự Đa Tầng" (4 Web Audio Channels + Máy Niệm Phật)
 */
export function DharmaAudioPlayerPanel() {
  const mixer = useDharmaAudioMixer();
  const activeTrack = CHANTING_TRACKS.find((t) => t.id === mixer.chantTrackId) || CHANTING_TRACKS[0];

  const formatRemaining = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EAD7A7] rounded-3xl p-4 sm:p-6 shadow-xs space-y-5 text-[#2C1E10]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8C5500] bg-[#FFF9EB] border border-[#DFC27D] px-2.5 py-0.5 rounded-full">
            <SlidersHorizontal className="w-3 h-3" />
            Pháp Âm Tĩnh Tâm
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1E10] mt-1.5">
            Pháp Âm Thiền Tự Đa Tầng &amp; Máy Niệm Phật
          </h3>
        </div>

        {mixer.isAnyActive && (
          <button
            type="button"
            onClick={mixer.stopAllChannels}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Tạm Tĩnh Toàn Bộ
          </button>
        )}
      </div>

      {/* 4 Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Channel 1: Đại Hồng Chung */}
        <div className="rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  mixer.bellIntervalSec > 0
                    ? 'bg-gradient-to-br from-[#FFE07D] to-[#F5C542] text-[#2C1E10] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#8C5500] border border-[#DFC27D]'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2C1E10]">1. Đại Hồng Chung (136.1Hz Om)</h4>
                <p className="text-[11px] text-[#6B533B]">Chuông đồng âm vang 6 giây tỉnh thức</p>
              </div>
            </div>
            <button
              type="button"
              onClick={mixer.strikeBellNow}
              className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF6DF] border border-[#DFC27D] text-xs font-bold text-[#8C5500] shrink-0 cursor-pointer"
            >
              Thỉnh 1 Tiếng
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#6B533B] mr-1">Tự động:</span>
            {([0, 15, 30, 60] as BellIntervalSec[]).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => mixer.setBellIntervalSec(sec)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  mixer.bellIntervalSec === sec
                    ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]'
                    : 'bg-[#FFFFFF] border border-[#EAD7A7] text-[#6B533B] hover:border-[#C68B19]'
                }`}
              >
                {sec === 0 ? 'Gõ tay' : `Mỗi ${sec}s`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#8C5500]" />
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={mixer.bellVolume}
              onChange={(e) => mixer.setBellVolume(parseFloat(e.target.value))}
              aria-label="Âm lượng Đại Hồng Chung"
              className="w-full accent-[#C68B19] cursor-pointer"
            />
          </div>
        </div>

        {/* Channel 2: Tiếng Mõ Chùa Cổ */}
        <div className="rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={mixer.tapWoodfishNow}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
                  mixer.woodfishActive
                    ? 'bg-gradient-to-br from-[#FFE07D] to-[#F5C542] text-[#2C1E10]'
                    : 'bg-[#FFFFFF] text-[#8C5500] border border-[#DFC27D]'
                }`}
                title="Gõ 1 tiếng mõ"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <div>
                <h4 className="text-sm font-bold text-[#2C1E10]">2. Tiếng Mõ Chùa Cổ (780Hz)</h4>
                <p className="text-[11px] text-[#6B533B]">
                  Nhịp {mixer.woodfishBpm} BPM • Đã gõ {mixer.woodfishCount} tiếng
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={mixer.toggleWoodfish}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 ${
                mixer.woodfishActive
                  ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]'
                  : 'bg-[#FFFFFF] hover:bg-[#FFF6DF] border border-[#DFC27D] text-[#8C5500]'
              }`}
            >
              {mixer.woodfishActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {mixer.woodfishActive ? 'Dừng Mõ' : 'Gõ Tự Động'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#6B533B] whitespace-nowrap">
              {mixer.woodfishBpm} BPM
            </span>
            <input
              type="range"
              min={40}
              max={160}
              step={2}
              value={mixer.woodfishBpm}
              onChange={(e) => mixer.setWoodfishBpm(parseInt(e.target.value, 10))}
              aria-label="Nhịp BPM Mõ Chùa"
              className="w-full accent-[#C68B19] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#8C5500]" />
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={mixer.woodfishVolume}
              onChange={(e) => mixer.setWoodfishVolume(parseFloat(e.target.value))}
              aria-label="Âm lượng Mõ Chùa"
              className="w-full accent-[#C68B19] cursor-pointer"
            />
          </div>
        </div>

        {/* Channel 3: Sóng Âm Định Tâm (432Hz / 528Hz) */}
        <div className="rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  mixer.droneActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FFFFFF] text-emerald-700 border border-[#DFC27D]'
                }`}
              >
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2C1E10]">3. Sóng Âm Định Tâm ({mixer.droneFreq}Hz)</h4>
                <p className="text-[11px] text-[#6B533B]">Tần số hài hòa xoa dịu hệ thần kinh</p>
              </div>
            </div>
            <button
              type="button"
              onClick={mixer.toggleDrone}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 ${
                mixer.droneActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFFFFF] hover:bg-[#FFF6DF] border border-[#DFC27D] text-[#8C5500]'
              }`}
            >
              {mixer.droneActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {mixer.droneActive ? 'Đang Mở' : 'Mở Sóng'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#6B533B]">Tần số:</span>
            {([432, 528] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => mixer.setDroneFreq(freq)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  mixer.droneFreq === freq
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FFFFFF] border border-[#EAD7A7] text-[#6B533B]'
                }`}
              >
                {freq}Hz {freq === 432 ? '(An Tịnh)' : '(Chữa Lành)'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#8C5500]" />
            <input
              type="range"
              min={0.05}
              max={0.6}
              step={0.05}
              value={mixer.droneVolume}
              onChange={(e) => mixer.setDroneVolume(parseFloat(e.target.value))}
              aria-label="Âm lượng Sóng Âm"
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Channel 4: Máy Niệm Phật + Sleep Timer */}
        <div className="rounded-2xl bg-[#FFF9EB] border border-[#EAD7A7] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  mixer.chantActive
                    ? 'bg-gradient-to-br from-[#FFE07D] to-[#F5C542] text-[#2C1E10] animate-pulse'
                    : 'bg-[#FFFFFF] text-[#8C5500] border border-[#DFC27D]'
                }`}
              >
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2C1E10]">4. Máy Niệm Phật Đa Âm</h4>
                <p className="text-[11px] text-[#6B533B]">{activeTrack.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={mixer.toggleChant}
              className="px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]"
            >
              {mixer.chantActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {mixer.chantActive ? 'Đang Niệm' : 'Phát Liên Tục'}
            </button>
          </div>

          <select
            value={mixer.chantTrackId}
            onChange={(e) => mixer.setChantTrackId(e.target.value as ChantingTrackOption['id'])}
            className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#DFC27D] text-xs font-bold text-[#2C1E10]"
          >
            {CHANTING_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.bpm} nhịp/phút)
              </option>
            ))}
          </select>

          {/* Animated Syllable Cadence Pill */}
          <div className="flex flex-wrap items-center gap-1">
            {activeTrack.syllables.map((syl, idx) => (
              <span
                key={`${activeTrack.id}-${idx}`}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  mixer.chantActive && mixer.chantSyllableIdx === idx
                    ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19] scale-105 shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#6B533B] border border-[#EAD7A7]'
                }`}
              >
                {syl}
              </span>
            ))}
          </div>

          {/* Sleep Timer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EAD7A7]">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#6B533B]">
              <Timer className="w-3.5 h-3.5 text-[#8C5500]" />
              <span>Hẹn giờ tắt:</span>
            </div>
            <div className="flex items-center gap-1">
              {([0, 15, 30, 45, 60] as SleepTimerMins[]).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => mixer.setSleepTimer(mins)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer ${
                    mixer.sleepTimerMins === mins
                      ? 'bg-[#8C5500] text-white'
                      : 'bg-[#FFFFFF] border border-[#EAD7A7] text-[#6B533B]'
                  }`}
                >
                  {mins === 0 ? 'Tắt' : `${mins}p`}
                </button>
              ))}
              {mixer.sleepTimerMins > 0 && (
                <span className="text-[11px] font-mono font-bold text-[#8C5500] ml-1">
                  {formatRemaining(mixer.sleepRemainingSec)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Collapsible Floating Audio Bar accessible across tabs
 */
export function FloatingDharmaAudioPlayer() {
  const pathname = usePathname();
  const mixer = useDharmaAudioMixer();
  const [expanded, setExpanded] = useState(false);

  // Chỉ hiển thị khi có ít nhất 1 kênh đang phát để không che khuất giao diện thanh tịnh
  const hiddenRoutes = ['/thu-vien-bon-ton', '/cau-sieu', '/cau-nguyen', '/di-chua-online'];
  if (!mixer.isAnyActive || hiddenRoutes.some((r) => pathname.startsWith(r))) {
    return null;
  }

  const activeTrack = CHANTING_TRACKS.find((t) => t.id === mixer.chantTrackId) || CHANTING_TRACKS[0];

  return (
    <div className="fixed bottom-24 lg:bottom-5 right-3 sm:right-5 z-40 max-w-[320px]">
      {expanded && (
        <div className="mb-2 bg-[#FFFFFF] border border-[#DFC27D] rounded-2xl shadow-xl p-3.5 space-y-3 text-xs text-[#2C1E10]">
          <div className="flex items-center justify-between border-b border-[#EAD7A7] pb-2">
            <span className="font-serif font-bold text-[#8C5500] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#C68B19]" />
              Pháp Âm Đang Phát
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
              aria-label="Thu gọn"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={mixer.strikeBellNow}
              className="px-2.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500] font-bold hover:bg-[#FFF6DF] flex items-center justify-center gap-1 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" /> Thỉnh Chuông
            </button>
            <button
              type="button"
              onClick={mixer.toggleWoodfish}
              className={`px-2.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                mixer.woodfishActive
                  ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]'
                  : 'bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> {mixer.woodfishActive ? 'Dừng Mõ' : 'Mõ Tự Động'}
            </button>
            <button
              type="button"
              onClick={mixer.toggleDrone}
              className={`px-2.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                mixer.droneActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFF9EB] border border-[#DFC27D] text-emerald-700'
              }`}
            >
              <Waves className="w-3.5 h-3.5" /> {mixer.droneFreq}Hz
            </button>
            <button
              type="button"
              onClick={mixer.toggleChant}
              className={`px-2.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                mixer.chantActive
                  ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#2C1E10] border border-[#C68B19]'
                  : 'bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500]'
              }`}
            >
              {mixer.chantActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} Niệm Phật
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[#6B533B] truncate">{activeTrack.title}</span>
            <button
              type="button"
              onClick={mixer.stopAllChannels}
              className="text-[11px] font-bold text-red-700 hover:underline shrink-0 cursor-pointer"
            >
              Tắt hết
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 bg-[#FFFDF8] border border-[#C68B19] shadow-lg rounded-full px-3 py-1.5">
        <button
          type="button"
          onClick={mixer.toggleChant}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-gradient-to-br from-[#FFE07D] to-[#F5C542] text-[#2C1E10]"
          title={mixer.chantActive ? 'Tạm dừng Máy Niệm Phật' : 'Mở Máy Niệm Phật'}
        >
          {mixer.chantActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-left pr-1 cursor-pointer flex items-center gap-1.5"
        >
          <div>
            <p className="text-[11px] font-bold text-[#2C1E10] leading-tight">
              Pháp Âm Đang Phát
            </p>
            <p className="text-[10px] font-semibold text-[#8C5500] leading-tight truncate max-w-[140px]">
              {mixer.chantActive
                ? activeTrack.title
                : mixer.droneActive
                ? `Sóng ${mixer.droneFreq}Hz`
                : 'Chuông • Mõ'}
            </p>
          </div>
          <ChevronUp className={`w-3.5 h-3.5 text-[#8C5500] transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}

