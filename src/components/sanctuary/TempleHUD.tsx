'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Flame,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AMBIENT_TRACKS,
  HALL_SERVERS,
  ROBE_OPTIONS,
  WEATHER_OPTIONS,
} from './templeData';
import { templeAudio } from './templeAudio';
import { useTempleStore } from './useTempleStore';
import { CenterToast } from '@/components/ui/CenterToast';
import { cn } from '@/lib/utils';

const HeaderLotusGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} fill="currentColor">
    <path d="M12 1C10.5 4.5 8.5 8 12 14C15.5 8 13.5 4.5 12 1Z" />
    <path d="M12 14C9.5 12 6.5 8.5 7 5.5C8.5 5 10.5 7.5 12 14Z" opacity="0.9" />
    <path d="M12 14C14.5 12 17.5 8.5 17 5.5C15.5 5 13.5 7.5 12 14Z" opacity="0.9" />
    <path d="M12 14C8 13 4 10.5 3 8C4.5 7 8 9.5 12 14Z" opacity="0.75" />
    <path d="M12 14C16 13 20 10.5 21 8C19.5 7 16 9.5 12 14Z" opacity="0.75" />
    <path d="M8 15C10 15.5 14 15.5 16 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * Full-screen interactive HUD overlaying the 3D Chánh Điện canvas:
 * Top control pills, Presence drawer, Ambient & Weather menus,
 * Mobile 360° touch joystick, Camera controls, Context prompt & Bottom dock.
 */
export function TempleHUD() {
  const {
    name,
    gender,
    robe,
    serverId,
    serverOnlineCounts,
    soundEnabled,
    ambientMode,
    weatherMode,
    realTempC,
    realTimeSlot,
    graphicsQuality,
    bowCount,
    totalMalaBeads,
    isOnboardingOpen,
    activeModal,
    presenceOpen,
    overviewActive,
    toastText,
    toastNonce,
    worldPromptText,
    worldPromptAction,
    setOnboardingOpen,
    setActiveModal,
    setPresenceOpen,
    setSoundEnabled,
    setAmbientMode,
    setWeatherMode,
    cycleWeatherMode,
    cycleGraphicsQuality,
    triggerBell,
    performBow,
    prepareLanternWalk,
    setJoystickVector,
    triggerJump,
    issueCameraCommand,
  } = useTempleStore();

  const [audioDropdownOpen, setAudioDropdownOpen] = useState(false);
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const [visibleToast, setVisibleToast] = useState<string | null>(null);

  // Toast auto-hide timer
  useEffect(() => {
    if (!toastText) return;
    setVisibleToast(toastText);
    const id = setTimeout(() => setVisibleToast(null), 3200);
    return () => clearTimeout(id);
  }, [toastText, toastNonce]);

  const activeServer = HALL_SERVERS.find((h) => h.id === serverId) || HALL_SERVERS[0];
  const activeRobe = ROBE_OPTIONS.find((r) => r.id === robe) || ROBE_OPTIONS[0];
  const onlineHere = serverOnlineCounts[serverId] ?? 1;
  const activeTrack = AMBIENT_TRACKS.find((t) => t.id === ambientMode) || AMBIENT_TRACKS[1];

  const slotLabelMap: Record<typeof realTimeSlot, string> = {
    morning: 'Sáng',
    noon: 'Trưa',
    afternoon: 'Chiều',
    night: 'Tối',
  };

  const activeWeatherOpt = WEATHER_OPTIONS.find((w) => w.id === weatherMode) || WEATHER_OPTIONS[0];
  const weatherShortText =
    weatherMode === 'realtime'
      ? `Real-time (${slotLabelMap[realTimeSlot]} · ${Math.round(realTempC)}°C)`
      : activeWeatherOpt.fullLabel;

  const qualityLabel = graphicsQuality === 'high' ? 'Cao' : graphicsQuality === 'medium' ? 'TB' : 'Thấp';

  // Touch Virtual Joystick logic (mobile < md)
  const joyBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const joyPointerIdRef = useRef<number | null>(null);

  const updateJoystickFromPointer = (clientX: number, clientY: number) => {
    const el = joyBaseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width * 0.34;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    const nx = dist > 0.5 ? (clamped / maxR) * Math.cos(angle) : 0;
    const ny = dist > 0.5 ? (clamped / maxR) * Math.sin(angle) : 0;
    setKnobOffset({ x: nx * maxR, y: ny * maxR });
    setJoystickVector({ x: nx, y: ny });
  };

  const resetJoystick = () => {
    joyPointerIdRef.current = null;
    setKnobOffset({ x: 0, y: 0 });
    setJoystickVector({ x: 0, y: 0 });
  };

  const closeAllMenus = () => {
    setAudioDropdownOpen(false);
    setWeatherDropdownOpen(false);
    setPresenceOpen(false);
  };

  const hideMobileControls = isOnboardingOpen || activeModal !== null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between select-none">
      {/* Invisible backdrop click catcher for open HUD dropdowns */}
      {(audioDropdownOpen || weatherDropdownOpen || presenceOpen) && (
        <div
          className="fixed inset-0 z-20 pointer-events-auto"
          onClick={closeAllMenus}
        />
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER BAR (Matches Sansa reference across Desktop & Mobile)           */}
      {/* ========================================================================= */}
      <header className="relative z-30 pointer-events-auto w-full px-2 sm:px-3 pt-2.5 flex items-center justify-between gap-1 sm:gap-2 bg-gradient-to-b from-[#1B0D09]/85 via-[#1B0D09]/45 to-transparent">
        {/* Left group: Back link + Sansa brand + Profile + Presence + Server */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Link
            href="/thuc-hanh"
            title="Quay lại Đạo Tràng DHARMA"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#24130D]/85 border border-[#A97B4F]/35 text-[#DBC09B] hover:bg-[#3A2016] flex items-center justify-center shrink-0 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              issueCameraCommand('reset');
            }}
            className="flex items-center gap-1 sm:gap-1.5 pr-0.5 sm:pr-1 shrink-0 cursor-pointer group"
            title="Đặt lại góc nhìn Chánh Điện"
          >
            <HeaderLotusGlyph className="w-4 h-4 sm:w-5 sm:h-5 text-[#DBC09B] drop-shadow-[0_0_8px_rgba(246,213,138,0.65)] group-hover:scale-105 transition" />
            <div className="text-left leading-tight">
              <div className="font-serif font-bold text-[13px] sm:text-base text-[#FFF4D2] tracking-wide">
                Sansa
              </div>
              <div className="hidden 2xl:block text-[9.5px] text-[#F7EBD5]/70 whitespace-nowrap">
                Chánh Điện 100 Bồ Đoàn Thực Tế
              </div>
            </div>
          </button>

          {/* Profile button -> opens OnboardingModal */}
          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              setOnboardingOpen(true);
            }}
            className="h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 hover:border-[#DBC09B] flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#F7EBD5] max-w-[78px] sm:max-w-[155px] transition cursor-pointer shrink-0"
            title="Chỉnh sửa Pháp danh, Áo tràng & Chánh điện"
          >
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#FFF5D2]/70 shrink-0"
              style={{ backgroundColor: activeRobe.hex }}
            />
            <span className="font-semibold truncate">{name || 'Dharma'}</span>
            <span className="hidden xl:inline text-[10px] text-[#F7EBD5]/65 shrink-0">
              ({gender === 'male' ? 'Nam' : 'Nữ'})
            </span>
          </button>

          {/* Online Presence toggle (lg+) */}
          <button
            type="button"
            onClick={() => {
              const next = !presenceOpen;
              closeAllMenus();
              setPresenceOpen(next);
            }}
            className="hidden lg:inline-flex h-8 px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/35 hover:border-[#DBC09B] items-center gap-1.5 text-[11px] font-semibold text-[#F7EBD5] cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
            <span>{onlineHere} Phật tử</span>
          </button>

          {/* Server switch pill */}
          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              setActiveModal('server');
            }}
            className="h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 hover:border-[#DBC09B] flex items-center gap-1 sm:gap-1.5 text-[10.5px] sm:text-[11px] font-semibold text-[#F7EBD5] cursor-pointer shrink-0 whitespace-nowrap"
            title="Chọn Chánh Điện (Server)"
          >
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A97B4F] shrink-0" />
            <span className="sm:hidden">C.{activeServer.code.replace(/^0/, '')}</span>
            <span className="hidden sm:inline">{activeServer.shortName}</span>
            <span className="hidden sm:inline px-1.5 py-0.2 rounded-full bg-[#3A2518] text-[#DBC09B] text-[10px]">
              {onlineHere}/{activeServer.capacity}
            </span>
          </button>
        </div>

        {/* Right group: Leaderboard, Bell, Audio + Dropdown, Weather + Dropdown, Quality */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              setActiveModal('leaderboard');
            }}
            className="h-7 w-7 sm:h-8 sm:w-8 lg:w-auto lg:px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 hover:border-[#DBC09B] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#DBC09B] cursor-pointer shrink-0 whitespace-nowrap"
            title="Bảng Tinh Tấn & Tường Cầu An"
          >
            <Trophy className="w-3.5 h-3.5 text-[#DBC09B]" />
            <span className="hidden lg:inline">Bảng Tinh Tấn</span>
          </button>

          {/* Ring Great Bell Button */}
          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              templeAudio.playGreatBell();
              triggerBell();
            }}
            className="h-7 w-7 sm:h-8 sm:w-8 xl:w-auto xl:px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 hover:border-[#DBC09B] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#F7EBD5] cursor-pointer shrink-0 whitespace-nowrap"
            title="Thỉnh Đại Hồng Chung"
          >
            <Bell className="w-3.5 h-3.5 text-[#DBC09B]" />
            <span className="hidden xl:inline">Thỉnh Chuông</span>
          </button>

          {/* Audio Toggle + Desktop Track Selector */}
          <div className="relative flex items-center">
            <div className="flex items-center h-7 sm:h-8 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  templeAudio.setEnabled(next, ambientMode);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#DBC09B] hover:bg-[#3A2518] cursor-pointer"
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled && ambientMode !== 'silent' ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#F7EBD5]/55" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !audioDropdownOpen;
                  closeAllMenus();
                  setAudioDropdownOpen(next);
                }}
                className="hidden md:flex items-center gap-1 pr-2.5 pl-1 h-8 text-[11px] font-medium text-[#F7EBD5] border-l border-[#A97B4F]/25 hover:bg-[#3A2518] max-w-[125px] xl:max-w-[140px] 2xl:max-w-[175px] cursor-pointer"
              >
                <span className="truncate">{activeTrack.label}</span>
                {audioDropdownOpen ? (
                  <ChevronUp className="w-3 h-3 text-[#A97B4F] shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#A97B4F] shrink-0" />
                )}
              </button>
            </div>

            {audioDropdownOpen && (
              <div className="absolute right-0 top-10 w-64 rounded-2xl bg-[#1B0D09]/95 border border-[#A97B4F]/45 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl z-40">
                {AMBIENT_TRACKS.map((track) => {
                  const active = ambientMode === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setAmbientMode(track.id);
                        templeAudio.setAmbientMode(track.id);
                        setAudioDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer',
                        active
                          ? 'bg-[#3A2616] border-[#A97B4F]/70 text-[#FFF4D2]'
                          : 'bg-transparent border-transparent text-[#F7EBD5]/85 hover:bg-[#2B1911]'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{track.label}</div>
                        <div className="text-[10px] text-[#F7EBD5]/60 truncate">
                          {track.description}
                        </div>
                      </div>
                      {active && <span className="text-[#DBC09B] text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weather Switcher (Tap cycles on Mobile; Dropdown on Desktop md+) */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={cycleWeatherMode}
              className="md:hidden w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 flex items-center justify-center text-xs sm:text-sm cursor-pointer"
              title="Đổi thời tiết / ánh sáng Chánh Điện"
            >
              <span>{activeWeatherOpt.emoji}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !weatherDropdownOpen;
                closeAllMenus();
                setWeatherDropdownOpen(next);
              }}
              className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/40 hover:border-[#DBC09B] text-[11px] font-medium text-[#F7EBD5] max-w-[140px] xl:max-w-[155px] 2xl:max-w-[185px] cursor-pointer"
              title="Đổi thời tiết & khung giờ"
            >
              <span>{activeWeatherOpt.emoji}</span>
              <span className="truncate">{weatherShortText}</span>
              <ChevronDown className="w-3 h-3 text-[#A97B4F] shrink-0" />
            </button>

            {weatherDropdownOpen && (
              <div className="absolute right-0 top-10 w-64 rounded-2xl bg-[#1B0D09]/95 border border-[#A97B4F]/45 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl z-40">
                {WEATHER_OPTIONS.map((w) => {
                  const active = weatherMode === w.id;
                  const label =
                    w.id === 'realtime'
                      ? `Real-time (${slotLabelMap[realTimeSlot]} · ${Math.round(realTempC)}°C)`
                      : w.fullLabel;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setWeatherMode(w.id);
                        setWeatherDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer',
                        active
                          ? 'bg-[#3A2616] border-[#A97B4F]/70 text-[#FFF4D2]'
                          : 'bg-transparent border-transparent text-[#F7EBD5]/85 hover:bg-[#2B1911]'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {w.emoji} {label}
                        </div>
                        <div className="text-[10px] text-[#F7EBD5]/60 truncate">
                          {w.description}
                        </div>
                      </div>
                      {active && <span className="text-[#DBC09B] text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Graphics Quality Toggle (Desktop xl+) */}
          <button
            type="button"
            onClick={cycleGraphicsQuality}
            className="hidden xl:inline-flex h-8 px-2.5 rounded-full bg-[#23150F]/90 border border-[#A97B4F]/35 hover:border-[#DBC09B] items-center text-[11px] font-medium text-[#F7EBD5] whitespace-nowrap cursor-pointer shrink-0"
            title="Chỉnh chất lượng đồ họa 3D"
          >
            Đồ họa: {qualityLabel}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PRESENCE DRAWER (Desktop top-right)                                       */}
      {/* ========================================================================= */}
      {presenceOpen && (
        <div className="fixed top-14 right-3 sm:right-6 z-40 pointer-events-auto w-72 rounded-2xl bg-[#1B0D09]/95 border border-[#A97B4F]/45 shadow-2xl p-3.5 backdrop-blur-xl text-[#F7EBD5]">
          <div className="flex items-center justify-between pb-2 border-b border-[#A97B4F]/20">
            <span className="text-xs font-bold text-[#DBC09B]">
              🪷 Đồng đạo trong Chánh điện ({onlineHere})
            </span>
            <button
              type="button"
              onClick={() => setPresenceOpen(false)}
              className="text-[11px] text-[#F7EBD5]/70 hover:text-[#FFF4D2] cursor-pointer"
            >
              Đóng
            </button>
          </div>
          <div className="py-2.5 space-y-2">
            <div className="px-2.5 py-2 rounded-xl bg-[#2B1A12]/90 border border-[#A97B4F]/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeRobe.hex }}
                />
                <span className="text-xs font-semibold truncate">
                  {activeRobe.fullName} · {name || 'Dharma'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#3A2817] border border-[#A97B4F]/40 text-[10px] font-bold text-[#DBC09B]">
                Bạn
              </span>
            </div>
          </div>
          <p className="text-[10.5px] italic text-center text-[#F7EBD5]/65 pt-1 border-t border-[#A97B4F]/15">
            Lặng lẽ cùng nhau sẻ chia sự bình an trong tâm hồn
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CENTER FLOATING TOAST NOTIFICATION                                        */}
      {/* ========================================================================= */}
      <CenterToast message={visibleToast} variant="dark" icon="sparkles" />

      {/* ========================================================================= */}
      {/* BOTTOM HUD CONTROLS, JOYSTICK, CAMERA STACK & PRACTICE DOCK               */}
      {/* ========================================================================= */}
      <div className="relative z-20 px-3 pb-3 sm:pb-4 flex flex-col items-center gap-2">
        {/* Mobile Touch Joystick & Jump button (hidden on md+ and when modal open) */}
        {!hideMobileControls && (
          <div className="md:hidden fixed left-3.5 bottom-[118px] pointer-events-auto flex items-end gap-2.5">
            <div
              ref={joyBaseRef}
              onPointerDown={(e) => {
                joyPointerIdRef.current = e.pointerId;
                e.currentTarget.setPointerCapture(e.pointerId);
                updateJoystickFromPointer(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (joyPointerIdRef.current !== e.pointerId) return;
                updateJoystickFromPointer(e.clientX, e.clientY);
              }}
              onPointerUp={resetJoystick}
              onPointerCancel={resetJoystick}
              className="relative w-[104px] h-[104px] rounded-full bg-[#1B0D09]/70 border border-[#A97B4F]/55 backdrop-blur-md flex items-center justify-center touch-none shadow-lg"
            >
              <span className="absolute top-1.5 text-[9px] text-[#DBC09B]/80">▲</span>
              <span className="absolute bottom-1.5 text-[9px] text-[#DBC09B]/80">▼</span>
              <span className="absolute left-2 text-[9px] text-[#60A5FA]">◀</span>
              <span className="absolute right-2 text-[9px] text-[#60A5FA]">▶</span>

              <div
                style={{
                  transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
                }}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C89F72] via-[#9C6F43] to-[#6E4925] border-2 border-[#E6C7A0] shadow-[0_0_12px_rgba(169,123,79,0.5)] flex items-center justify-center pointer-events-none"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B0D09]" />
              </div>
            </div>

            <button
              type="button"
              onClick={triggerJump}
              className="w-12 h-12 rounded-full bg-[#1B0D09]/80 border border-[#A97B4F]/55 text-[#F7EBD5] text-[10px] font-bold flex flex-col items-center justify-center active:scale-95 shadow-lg cursor-pointer"
            >
              <span className="text-xs text-[#DBC09B] leading-none">⤒</span>
              <span>Nhảy</span>
            </button>
          </div>
        )}

        {/* Right Vertical Camera Control Stack (+, -, Overview, Reset) */}
        {!hideMobileControls && (
          <div className="fixed right-3 bottom-[118px] md:bottom-8 pointer-events-auto flex flex-col gap-2">
            <button
              type="button"
              onClick={() => issueCameraCommand('zoom_in')}
              className="w-9 h-9 rounded-full bg-[#1B0D09]/85 border border-[#A97B4F]/45 text-[#FFF4D2] hover:bg-[#32190F] flex items-center justify-center shadow-lg cursor-pointer"
              title="Phóng to"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => issueCameraCommand('zoom_out')}
              className="w-9 h-9 rounded-full bg-[#1B0D09]/85 border border-[#A97B4F]/45 text-[#FFF4D2] hover:bg-[#32190F] flex items-center justify-center shadow-lg cursor-pointer"
              title="Thu nhỏ"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => issueCameraCommand('toggle_overview')}
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center shadow-lg cursor-pointer transition',
                overviewActive
                  ? 'bg-[#9E7145] border-[#E0C097] text-[#FFF5E8]'
                  : 'bg-[#1B0D09]/85 border-[#A97B4F]/45 text-[#FFF4D2] hover:bg-[#32190F]'
              )}
              title="Xem toàn cảnh 100 bồ đoàn"
            >
              {overviewActive ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => issueCameraCommand('reset')}
              className="w-9 h-9 rounded-full bg-[#1B0D09]/85 border border-[#A97B4F]/45 text-[#FFF4D2] hover:bg-[#32190F] flex items-center justify-center shadow-lg cursor-pointer"
              title="Đặt lại góc nhìn"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Contextual Action Prompt Pill */}
        {!hideMobileControls && worldPromptAction && (
          <button
            type="button"
            onClick={() => {
              if (worldPromptAction === 'sutra') {
                setActiveModal('sutra');
              } else {
                templeAudio.playGreatBell();
                triggerBell();
              }
            }}
            className="pointer-events-auto px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5E3B1F]/95 via-[#7F542E]/95 to-[#5E3B1F]/95 border border-[#DCBA90]/55 text-[#F9EFE0] text-xs font-semibold flex items-center gap-1.5 shadow-[0_6px_22px_rgba(0,0,0,0.55)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            {worldPromptAction === 'sutra' ? (
              <BookOpen className="w-3.5 h-3.5 text-[#FFF4D2]" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-[#FFF4D2]" />
            )}
            <span className="md:hidden">{worldPromptText}</span>
            <span className="hidden md:inline">
              {worldPromptAction === 'sutra'
                ? 'Mở Sách Đọc Kinh (Trên Kệ Trước Mặt)'
                : `${worldPromptText}`}
            </span>
          </button>
        )}

        {/* Main 4-Button Bottom Practice Dock */}
        <div className="pointer-events-auto rounded-full p-1.5 bg-[#1B0D09]/92 border border-[#A97B4F]/55 shadow-[0_10px_32px_rgba(0,0,0,0.75)] backdrop-blur-xl flex items-center gap-1.5 max-w-[calc(100vw-20px)]">
          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              templeAudio.playGreatBell(0.28);
              performBow();
            }}
            className="px-3.5 sm:px-5 py-2 rounded-full bg-[#2A1710] hover:bg-[#3A2116] border border-[#A97B4F]/55 text-[#FFF4D2] text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            {bowCount > 0 ? `Lạy (${bowCount})` : 'Lạy Phật'}
          </button>

          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              setActiveModal('sutra');
            }}
            className="px-3.5 sm:px-5 py-2 rounded-full bg-[#2A1710] hover:bg-[#3A2116] border border-[#A97B4F]/55 text-[#FFF4D2] text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            Đọc Kinh
          </button>

          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              setActiveModal('mala');
            }}
            className="px-3.5 sm:px-5 py-2 rounded-full bg-[#2A1710] hover:bg-[#3A2116] border border-[#A97B4F]/55 text-[#FFF4D2] text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition cursor-pointer"
          >
            <span className="md:hidden">
              {totalMalaBeads > 0 ? `Chuỗi (${totalMalaBeads})` : 'Chuỗi Hạt'}
            </span>
            <span className="hidden md:inline">
              {totalMalaBeads > 0 ? `Chuỗi (${totalMalaBeads})` : 'Đếm Chuỗi Hạt'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              prepareLanternWalk();
              setActiveModal('prayer');
            }}
            className="px-3.5 sm:px-5 py-2 rounded-full bg-[#2A1710] hover:bg-[#3A2116] border border-[#A97B4F]/55 text-[#FFF4D2] text-xs sm:text-sm font-bold whitespace-nowrap active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-[#DBC09B] hidden sm:inline" />
            <span className="md:hidden">Hoa Đăng</span>
            <span className="hidden md:inline">Dâng Hoa Đăng</span>
          </button>
        </div>
      </div>
    </div>
  );
}

