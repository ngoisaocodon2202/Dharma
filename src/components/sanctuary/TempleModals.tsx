'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import {
  getPracticeLevelTitle,
  HALL_SERVERS,
  LANTERN_COLORS,
  MALA_MANTRAS,
  QUICK_NAMES,
  ROBE_OPTIONS,
  SANCTUARY_SUTRAS,
  type HallId,
} from './templeData';
import { templeAudio } from './templeAudio';
import { computeSelfPracticePoints, useTempleStore } from './useTempleStore';
import { cn } from '@/lib/utils';

const CARD_STYLE: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(68, 54, 42, 0.96) 0%, rgba(32, 22, 16, 0.98) 100%)',
};

function OrnateCardCorners() {
  return (
    <div className="pointer-events-none absolute inset-2.5 rounded-[18px] border border-[#A97B4F]/35">
      {/* Top-Left Corner */}
      <svg viewBox="0 0 24 24" className="absolute -top-0.5 -left-0.5 w-5 h-5 text-[#DBC09B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12V4a2 2 0 0 1 2-2h8" />
        <path d="M5 9V5h4" opacity="0.7" />
      </svg>
      {/* Top-Right Corner */}
      <svg viewBox="0 0 24 24" className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[#DBC09B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12V4a2 2 0 0 0-2-2h-8" />
        <path d="M19 9V5h-4" opacity="0.7" />
      </svg>
      {/* Bottom-Left Corner */}
      <svg viewBox="0 0 24 24" className="absolute -bottom-0.5 -left-0.5 w-5 h-5 text-[#DBC09B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12v8a2 2 0 0 0 2 2h8" />
        <path d="M5 15v4h4" opacity="0.7" />
      </svg>
      {/* Bottom-Right Corner */}
      <svg viewBox="0 0 24 24" className="absolute -bottom-0.5 -right-0.5 w-5 h-5 text-[#DBC09B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12v8a2 2 0 0 1-2 2h-8" />
        <path d="M19 15v4h-4" opacity="0.7" />
      </svg>
    </div>
  );
}

/**
 * Coordinates all interactive overlay modals of Chánh Điện 3D:
 * OnboardingModal, ServerModal, LeaderboardModal, SutraModal, MalaModal, PrayerModal.
 */
export function TempleModals() {
  const isOnboardingOpen = useTempleStore((s) => s.isOnboardingOpen);
  const activeModal = useTempleStore((s) => s.activeModal);

  return (
    <>
      {isOnboardingOpen && <OnboardingModal />}
      {activeModal === 'server' && <ServerModal />}
      {activeModal === 'leaderboard' && <LeaderboardModal />}
      {activeModal === 'sutra' && <SutraModal />}
      {activeModal === 'mala' && <MalaModal />}
      {activeModal === 'prayer' && <PrayerModal />}
    </>
  );
}

function OnboardingModal() {
  const {
    name,
    gender,
    robe,
    serverId,
    serverOnlineCounts,
    soundEnabled,
    ambientMode,
    setProfile,
    setOnboardingOpen,
    triggerBell,
  } = useTempleStore();

  const [draftName, setDraftName] = useState(name);
  const [draftGender, setDraftGender] = useState(gender);
  const [draftRobe, setDraftRobe] = useState(robe);
  const [draftServer, setDraftServer] = useState<HallId>(serverId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = draftName.trim() || 'Diệu Tâm';
    setProfile({
      name: finalName,
      gender: draftGender,
      robe: draftRobe,
      serverId: draftServer,
    });
    setOnboardingOpen(false);
    templeAudio.setEnabled(soundEnabled, ambientMode);
    templeAudio.playGreatBell();
    triggerBell();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.84)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-[440px] md:max-w-[920px] flex flex-col md:flex-row items-center justify-center gap-5 my-auto">
        {/* Desktop Left 3D Chibi Mascot Showcase */}
        <div className="hidden md:flex relative w-[360px] h-[360px] rounded-3xl overflow-hidden border-2 border-[#A97B4F]/55 shadow-[0_20px_60px_rgba(0,0,0,0.85)] shrink-0">
          <img
            src="/textures/mascot_onboarding_preview.jpg"
            alt="Nam Nữ Phật Tử Chắp Tay Niệm Phật"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#120804]/95 via-[#120804]/50 to-transparent flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setDraftGender('male');
                setDraftRobe('lam');
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer',
                draftGender === 'male' && draftRobe === 'lam'
                  ? 'bg-gradient-to-r from-[#B38452] to-[#875D34] border border-[#DCBA90]/60 text-[#FFF5E8] shadow-md'
                  : 'bg-[#1B0D09]/85 border border-[#A97B4F]/45 text-[#F7EBD5]'
              )}
            >
              Nam Phật Tử · Áo Lam
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftGender('female');
                setDraftRobe('song');
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer',
                draftGender === 'female' && draftRobe === 'song'
                  ? 'bg-gradient-to-r from-[#B38452] to-[#875D34] border border-[#DCBA90]/60 text-[#FFF5E8] shadow-md'
                  : 'bg-[#1B0D09]/85 border border-[#A97B4F]/45 text-[#F7EBD5]'
              )}
            >
              Nữ Phật Tử · Nâu Sồng
            </button>
          </div>
        </div>

        {/* Setup Form Card */}
        <form
          onSubmit={handleSubmit}
          style={CARD_STYLE}
          className="relative w-full max-w-[440px] rounded-3xl border-2 border-[#A97B4F]/60 shadow-[0_24px_70px_rgba(0,0,0,0.9)] p-5 sm:p-7 text-[#F7EBD5] dharma-input-panel-lock"
        >
          <OrnateCardCorners />

          <div className="relative z-10 space-y-3.5">
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#3A2718] border border-[#A97B4F]/55 flex items-center justify-center text-lg shadow-inner">
                🪷
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#DBC09B] tracking-wide">
                Bước Vào Chánh Điện
              </h2>
            </div>

            {/* Name Input + Quick Name Pills */}
            <div className="space-y-2">
              <input
                type="text"
                maxLength={24}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Nhập Pháp danh / Tên của bạn"
                className="w-full h-11 px-4 rounded-xl bg-[#251B14]/90 border border-[#A97B4F]/45 focus:border-[#DBC09B] outline-none text-center text-base font-semibold text-[#FFF4D2] placeholder:text-[#F7EBD5]/40 transition"
              />
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {QUICK_NAMES.map((preset) => {
                  const selected = draftName.trim() === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setDraftName(preset.name);
                        setDraftGender(preset.gender);
                      }}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer',
                        selected
                          ? 'bg-[#A97B4F]/35 border-[#DBC09B] text-[#FFF4D2]'
                          : 'bg-[#251B14]/80 border-[#A97B4F]/30 text-[#F7EBD5]/80 hover:border-[#A97B4F]'
                      )}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender & Robe Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-semibold text-[#F7EBD5]/75 block">Giới tính</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDraftGender('male')}
                    className={cn(
                      'h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer',
                      draftGender === 'male'
                        ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] border-[#E0C097] text-[#FFF5E8]'
                        : 'bg-[#251B14]/85 border-[#A97B4F]/35 text-[#F7EBD5]'
                    )}
                  >
                    <span>👨</span>
                    <span>Nam</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftGender('female')}
                    className={cn(
                      'h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer',
                      draftGender === 'female'
                        ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] border-[#E0C097] text-[#FFF5E8]'
                        : 'bg-[#251B14]/85 border-[#A97B4F]/35 text-[#F7EBD5]'
                    )}
                  >
                    <span>👩</span>
                    <span>Nữ</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-semibold text-[#F7EBD5]/75 block">Màu Áo Tràng</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROBE_OPTIONS.map((r) => {
                    const selected = draftRobe === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setDraftRobe(r.id)}
                        className={cn(
                          'h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer',
                          selected
                            ? 'bg-[#3C2918] border-[#DBC09B] shadow-[0_0_10px_rgba(246,213,138,0.25)]'
                            : 'bg-[#251B14]/85 border-[#A97B4F]/30 hover:border-[#A97B4F]/70'
                        )}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-[#FFF5D2]/60"
                          style={{ backgroundColor: r.hex }}
                        />
                        <span className="text-[10px] font-semibold text-[#F7EBD5]">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hall Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#DBC09B] uppercase tracking-wider">
                  🏛️ CHỌN CHÁNH ĐIỆN
                </span>
                <span className="text-[#F7EBD5]/60">Tối đa 100 người / server</span>
              </div>
              <div className="space-y-1.5">
                {HALL_SERVERS.map((hall) => {
                  const active = draftServer === hall.id;
                  const count = serverOnlineCounts[hall.id] ?? hall.online;
                  return (
                    <button
                      key={hall.id}
                      type="button"
                      onClick={() => setDraftServer(hall.id)}
                      className={cn(
                        'w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition cursor-pointer',
                        active
                          ? 'bg-[#382718] border-[#DBC09B] shadow-[0_0_12px_rgba(246,213,138,0.2)]'
                          : 'bg-[#251B14]/75 border-[#A97B4F]/25 hover:border-[#A97B4F]/60'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#FFF4D2] truncate">{hall.name}</div>
                          <div className="text-[10px] text-[#F7EBD5]/60 truncate">{hall.subtitle}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#24160F] border border-[#A97B4F]/40 text-[10px] font-bold text-[#DBC09B] shrink-0">
                        {count}/{hall.capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(to right, #BD8F5E, #996A3D, #734C27)',
              }}
              className="w-full h-11 rounded-2xl border-2 border-[#DCBA90] text-[#FFF5E8] font-serif font-bold text-sm sm:text-base shadow-[0_8px_24px_rgba(169,123,79,0.3)] hover:brightness-105 active:scale-[0.98] transition cursor-pointer mt-2"
            >
              Bước Vào Chánh Điện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ServerModal() {
  const {
    serverId,
    serverOnlineCounts,
    colyseusConnected,
    colyseusUrl,
    setServerId,
    setColyseusUrl,
    setActiveModal,
    showToast,
  } = useTempleStore();

  const [ipExpanded, setIpExpanded] = useState(false);
  const [urlInput, setUrlInput] = useState(colyseusUrl);

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.82)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        style={CARD_STYLE}
        className="relative w-full max-w-[440px] rounded-3xl border-2 border-[#A97B4F]/60 shadow-2xl p-5 sm:p-6 text-[#F7EBD5] space-y-4 my-auto"
      >
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-[#DBC09B] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1.5 pt-1">
          <div className="w-10 h-10 rounded-full bg-[#2E1E14] border border-[#A97B4F]/55 mx-auto flex items-center justify-center text-lg">
            🏛️
          </div>
          <h3 className="font-serif text-lg font-bold text-[#DBC09B]">
            CHỌN CHÁNH ĐIỆN (SERVER)
          </h3>
          <p className="text-xs text-[#F7EBD5]/75 leading-relaxed">
            Mỗi Chánh Điện giới hạn đúng <strong className="text-[#DBC09B]">100 bồ đoàn</strong>. Khi đủ 100 người sẽ tự động khóa người thứ 101.
          </p>
        </div>

        {/* Colyseus connection status + Expandable IP config */}
        <div className="rounded-xl bg-[#251B14]/85 border border-[#A97B4F]/30 p-3 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full shrink-0',
                  colyseusConnected ? 'bg-[#10B981]' : 'bg-[#FBBF24]'
                )}
              />
              <span className="font-medium truncate">
                {colyseusConnected
                  ? 'Máy chủ Multiplayer: ĐÃ KẾT NỐI'
                  : 'Chế độ Đơn tu (Chưa kết nối Colyseus)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIpExpanded((v) => !v)}
              className="text-[11px] font-bold text-[#DBC09B] underline shrink-0 cursor-pointer"
            >
              Cấu hình IP
            </button>
          </div>

          {ipExpanded && (
            <div className="pt-2 border-t border-[#A97B4F]/20 space-y-2 text-[11px]">
              <p className="text-[#F7EBD5]/70">
                Chạy máy chủ cục bộ LAN Wi-Fi (`http://192.168.1.18:3000/temple`) hoặc điền WebSocket Colyseus:
              </p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 h-10 sm:h-8 px-2.5 rounded-lg bg-[#1A0E09] border border-[#A97B4F]/40 text-base sm:text-xs text-[#FFF4D2] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setColyseusUrl(urlInput);
                    showToast(`Đã lưu cấu hình máy chủ: ${urlInput}`);
                  }}
                  className="px-3 h-10 sm:h-8 rounded-lg bg-[#A97B4F] text-[#1B0D09] font-bold cursor-pointer"
                >
                  Lưu & Nối
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setUrlInput('ws://192.168.1.18:2567')}
                  className="px-2 py-1 rounded-lg bg-[#322116] border border-[#A97B4F]/30 text-[#DBC09B] cursor-pointer"
                >
                  ⚡ Nối LAN Wi-Fi (192.168.1.18:2567)
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput('ws://localhost:2567')}
                  className="px-2 py-1 rounded-lg bg-[#322116] border border-[#A97B4F]/30 text-[#F7EBD5]/80 cursor-pointer"
                >
                  Mặc định localhost
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3 Servers */}
        <div className="space-y-2">
          {HALL_SERVERS.map((hall) => {
            const current = serverId === hall.id;
            const count = serverOnlineCounts[hall.id] ?? hall.online;
            return (
              <div
                key={hall.id}
                className={cn(
                  'px-3 py-2.5 rounded-2xl border flex items-center justify-between gap-2',
                  current
                    ? 'bg-[#382718] border-[#DBC09B]'
                    : 'bg-[#251B14]/75 border-[#A97B4F]/30'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#FFF4D2] truncate">{hall.name}</div>
                    <div className="text-[10px] text-[#F7EBD5]/60 truncate">{hall.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-[#24160F] border border-[#A97B4F]/35 text-[10px] font-bold text-[#DBC09B]">
                    {count}/{hall.capacity}
                  </span>
                  {current ? (
                    <span className="px-2.5 py-1 rounded-lg bg-[#0F402F] border border-[#34D399]/60 text-[11px] font-bold text-[#34D399]">
                      Đang ở đây
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setServerId(hall.id);
                        setActiveModal(null);
                        showToast(`Đã chuyển sang ${hall.name} (${count + 1}/${hall.capacity})`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#A97B4F] text-[#FFF5E8] text-[11px] font-bold hover:brightness-105 cursor-pointer"
                    >
                      Chuyển Vào
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="w-full h-10 rounded-xl bg-[#251B14] border border-[#A97B4F]/40 text-xs font-bold text-[#F7EBD5] hover:bg-[#322217] cursor-pointer"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

function LeaderboardModal() {
  const {
    name,
    robe,
    meditationSeconds,
    totalMalaBeads,
    bowCount,
    lanternIncenseCount,
    rejoiceGiven,
    rejoicedIds,
    leaderboard,
    prayerWall,
    setActiveModal,
    rejoicePractitioner,
    addPrayerWallNote,
    toggleBlessPrayer,
    showToast,
  } = useTempleStore();

  const [tab, setTab] = useState<'rank' | 'log' | 'wall'>('rank');
  const [noteInput, setNoteInput] = useState('');

  const selfPoints = computeSelfPracticePoints({
    meditationSeconds,
    totalMalaBeads,
    bowCount,
    lanternIncenseCount,
    rejoiceGiven,
  });
  const selfMinutes = Math.floor(meditationSeconds / 60);
  const { title: levelTitle, nextTarget } = getPracticeLevelTitle(selfPoints);
  const progressPct = Math.min(100, Math.max(4, Math.round((selfPoints / nextTarget) * 100)));

  const sortedRanks = useMemo(() => {
    const selfRow = {
      id: 'self',
      name: name.trim() || 'Diệu Tâm',
      robe,
      minutes: selfMinutes,
      beads: totalMalaBeads,
      bows: bowCount,
      lanterns: lanternIncenseCount,
      points: selfPoints,
      rejoices: rejoiceGiven,
      isSelf: true,
    };
    const combined = [
      ...leaderboard.map((u) => ({ ...u, isSelf: false })),
      selfRow,
    ].sort((a, b) => b.points - a.points);
    return combined;
  }, [leaderboard, name, robe, selfMinutes, totalMalaBeads, bowCount, lanternIncenseCount, selfPoints, rejoiceGiven]);

  const selfRankNum = sortedRanks.findIndex((r) => r.isSelf) + 1;

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addPrayerWallNote(noteInput);
    setNoteInput('');
    templeAudio.playRejoiceChime();
    showToast('Đã gửi lời nguyện cầu lên Tường Cầu An');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.84)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        style={CARD_STYLE}
        className="relative w-full max-w-[460px] max-h-[88dvh] flex flex-col rounded-3xl border-2 border-[#A97B4F]/60 shadow-2xl p-4 sm:p-6 text-[#F7EBD5] my-auto"
      >
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-[#DBC09B] flex items-center justify-center cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title Header */}
        <div className="text-center space-y-1 shrink-0 pb-3">
          <div className="w-10 h-10 rounded-full bg-[#3A2718] border border-[#A97B4F]/55 mx-auto flex items-center justify-center text-lg">
            🏆
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#DBC09B]">
            ĐẠO TRÀNG TINH TẤN
          </h3>
          <p className="text-[11px] text-[#F7EBD5]/70">
            Noi gương tu học · Tùy hỷ công đức · Hồi hướng an lành
          </p>
        </div>

        {/* 3 Sub-Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#20140D] border border-[#A97B4F]/25 shrink-0 mb-3">
          <button
            type="button"
            onClick={() => setTab('rank')}
            className={cn(
              'py-2 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer truncate',
              tab === 'rank'
                ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] text-[#FFF5E8]'
                : 'text-[#F7EBD5]/80 hover:text-[#FFF4D2]'
            )}
          >
            🏆 Bảng Tinh Tấn
          </button>
          <button
            type="button"
            onClick={() => setTab('log')}
            className={cn(
              'py-2 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer truncate',
              tab === 'log'
                ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] text-[#FFF5E8]'
                : 'text-[#F7EBD5]/80 hover:text-[#FFF4D2]'
            )}
          >
            📖 Tu Tập Ký
          </button>
          <button
            type="button"
            onClick={() => setTab('wall')}
            className={cn(
              'py-2 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer truncate',
              tab === 'wall'
                ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] text-[#FFF5E8]'
                : 'text-[#F7EBD5]/80 hover:text-[#FFF4D2]'
            )}
          >
            🕊️ Tường Cầu An
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
          {tab === 'rank' && (
            <>
              {/* Highlighted Self Rank Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#5A4223]/90 to-[#3D2B16]/95 border border-[#DBC09B]/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-[#24160F] border border-[#DBC09B] text-xs font-bold text-[#DBC09B] flex items-center justify-center shrink-0">
                    #{selfRankNum}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#FFF4D2] truncate">{name || 'Diệu Tâm'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#24160F]/80 border border-[#A97B4F]/35 text-[10px] text-[#DBC09B]">
                        {levelTitle}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#F7EBD5]/75">
                      {selfMinutes}p thiền · {totalMalaBeads} hạt · {bowCount} lạy
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#DBC09B]">{selfPoints} điểm</div>
                  <div className="text-[10.5px] text-[#34D399] font-semibold">{rejoiceGiven} tùy hỷ 🙏</div>
                </div>
              </div>

              {/* Ranked Peers */}
              <div className="space-y-2">
                {sortedRanks.map((row, idx) => {
                  const robeHex = ROBE_OPTIONS.find((r) => r.id === row.robe)?.hex || '#7A8B9E';
                  const hasRejoiced = rejoicedIds[row.id];
                  return (
                    <div
                      key={row.id}
                      className={cn(
                        'px-3 py-2.5 rounded-2xl border flex items-center justify-between gap-2',
                        row.isSelf
                          ? 'bg-[#362415] border-[#DBC09B]/75'
                          : 'bg-[#251B14]/80 border-[#A97B4F]/25'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 text-center text-xs font-bold shrink-0">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-[#FFF4D2]/50 shrink-0"
                          style={{ backgroundColor: robeHex }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#FFF4D2] truncate">{row.name}</span>
                            {row.isSelf && (
                              <span className="px-1.5 py-0.2 rounded bg-[#DBC09B] text-[#1B0D09] text-[9px] font-extrabold">
                                BẠN
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#F7EBD5]/60">
                            {row.minutes}p · {row.beads} hạt
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#DBC09B]">{row.points}đ</span>
                        <button
                          type="button"
                          disabled={row.isSelf || hasRejoiced}
                          onClick={() => {
                            rejoicePractitioner(row.id);
                            templeAudio.playRejoiceChime();
                            showToast(`🪷 +1 Tùy Hỷ công đức đến ${row.name}`);
                          }}
                          className={cn(
                            'px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1 transition',
                            row.isSelf
                              ? 'bg-[#22160F] border-[#A97B4F]/20 text-[#F7EBD5]/50 cursor-default'
                              : hasRejoiced
                                ? 'bg-[#3C2A17] border-[#DBC09B] text-[#DBC09B] cursor-default'
                                : 'bg-[#2C1E14] border-[#A97B4F]/45 text-[#FFF4D2] hover:bg-[#3E2A1A] cursor-pointer'
                          )}
                        >
                          <span>{hasRejoiced ? '🪷' : '🙏'}</span>
                          <span>{row.rejoices}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'log' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#251B14]/85 border border-[#A97B4F]/30 text-center space-y-2">
                <div className="text-2xl">🌱</div>
                <div className="text-[11px] text-[#F7EBD5]/70">Cấp độ tu học hiện tại:</div>
                <div className="text-base font-bold text-[#34D399]">{levelTitle}</div>
                <div className="w-full h-2 rounded-full bg-[#170E09] border border-[#A97B4F]/25 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#875D34] to-[#C89B67] rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#F7EBD5]/70">
                  <span>{selfPoints} điểm</span>
                  <span>Mục tiêu tiếp theo: {nextTarget}đ</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#251B14]/80 border border-[#A97B4F]/25 text-center space-y-0.5">
                  <div className="text-lg">⏱️</div>
                  <div className="text-sm font-bold text-[#FFF4D2]">{selfMinutes} phút</div>
                  <div className="text-[10.5px] text-[#F7EBD5]/65">Tĩnh tâm trong chùa</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#251B14]/80 border border-[#A97B4F]/25 text-center space-y-0.5">
                  <div className="text-lg">📿</div>
                  <div className="text-sm font-bold text-[#FFF4D2]">{totalMalaBeads} hạt</div>
                  <div className="text-[10.5px] text-[#F7EBD5]/65">Lần tràng hạt 108</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#251B14]/80 border border-[#A97B4F]/25 text-center space-y-0.5">
                  <div className="text-lg">🙏</div>
                  <div className="text-sm font-bold text-[#FFF4D2]">{bowCount} lạy</div>
                  <div className="text-[10.5px] text-[#F7EBD5]/65">Đảnh lễ Tam Bảo</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#251B14]/80 border border-[#A97B4F]/25 text-center space-y-0.5">
                  <div className="text-lg">🏮</div>
                  <div className="text-sm font-bold text-[#FFF4D2]">{lanternIncenseCount} lần</div>
                  <div className="text-[10.5px] text-[#F7EBD5]/65">Thắp hương & Hoa đăng</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#20140D] border border-[#A97B4F]/25 text-center italic text-xs text-[#F7EBD5]/80">
                ✨ &quot;Mỗi phút giây an trú trong hiện tại là một đóa hoa sen nở trong tâm.&quot;
              </div>
            </div>
          )}

          {tab === 'wall' && (
            <div className="space-y-3">
              <form onSubmit={handlePostNote} className="flex items-center gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Gửi lời nguyện cầu an cho cha mẹ, gia đình..."
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#20140D] border border-[#A97B4F]/35 text-base sm:text-xs text-[#FFF4D2] placeholder:text-[#F7EBD5]/40 outline-none focus:border-[#DBC09B]"
                />
                <button
                  type="submit"
                  className="h-10 px-3.5 rounded-xl bg-[#5D4424] hover:bg-[#7A592F] border border-[#A97B4F]/55 text-xs font-bold text-[#FFF4D2] shrink-0 cursor-pointer"
                >
                  Gửi 🪷
                </button>
              </form>

              <div className="space-y-2.5">
                {prayerWall.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#251B14]/85 border border-[#A97B4F]/25 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#DBC09B]">🙏 {p.author}</span>
                      <span className="text-[10.5px] text-[#F7EBD5]/55">{p.timeLabel}</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#F7EBD5] leading-relaxed">
                      {p.content}
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          toggleBlessPrayer(p.id);
                          templeAudio.playRejoiceChime();
                        }}
                        className={cn(
                          'px-3 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer',
                          p.blessedByMe
                            ? 'bg-[#3D2B17] border-[#DBC09B] text-[#DBC09B]'
                            : 'bg-[#1D120D] border-[#A97B4F]/40 text-[#FFF4D2] hover:bg-[#322116]'
                        )}
                      >
                        {p.blessedByMe ? `🪷 Đã Niệm Lành (${p.blessings})` : `🙏 Niệm Lành (${p.blessings})`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SutraModal() {
  const { setActiveModal, triggerBell } = useTempleStore();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [activeVerseIdx, setActiveVerseIdx] = useState(0);
  const [autoMoktak, setAutoMoktak] = useState(false);

  const chapter = SANCTUARY_SUTRAS[chapterIdx];

  useEffect(() => {
    if (!autoMoktak) return;
    templeAudio.playMoktak();
    const id = setInterval(() => {
      templeAudio.playMoktak();
    }, 1150);
    return () => clearInterval(id);
  }, [autoMoktak]);

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.84)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        style={CARD_STYLE}
        className="relative w-full max-w-[500px] max-h-[86dvh] flex flex-col rounded-3xl border-2 border-[#A97B4F]/60 shadow-2xl p-5 sm:p-6 text-[#F7EBD5] my-auto space-y-3"
      >
        <button
          type="button"
          onClick={() => {
            setAutoMoktak(false);
            setActiveModal(null);
          }}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-[#DBC09B] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-10">
          <h3 className="font-serif text-lg font-bold text-[#DBC09B] tracking-wide">
            KINH PHẬT NHẬT TỤNG
          </h3>
          <p className="text-xs text-[#F7EBD5]/70">{chapter.subtitle}</p>
        </div>

        {/* Sutra Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {SANCTUARY_SUTRAS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setChapterIdx(idx);
                setActiveVerseIdx(0);
              }}
              className={cn(
                'py-2 px-2 rounded-full text-xs font-bold border transition truncate cursor-pointer',
                chapterIdx === idx
                  ? 'bg-gradient-to-b from-[#B38452] to-[#875D34] border-[#DCBA90] text-[#FFF5E8]'
                  : 'bg-[#251B14]/85 border-[#A97B4F]/30 text-[#F7EBD5]/85 hover:border-[#A97B4F]'
              )}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Verses Scroll Area */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-[#20140D]/80 border border-[#A97B4F]/25 p-3 space-y-2">
          {chapter.verses.map((v, i) => {
            const active = activeVerseIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveVerseIdx(i);
                  templeAudio.playMoktak();
                }}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition text-xs sm:text-sm leading-relaxed cursor-pointer',
                  active
                    ? 'bg-[#3C2B19] border-l-4 border-l-[#DBC09B] border-[#A97B4F]/45 text-[#FFF8EC]'
                    : 'bg-transparent border-transparent text-[#F7EBD5]/80 hover:bg-[#2A1B12]/70'
                )}
              >
                {v}
              </button>
            );
          })}
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => templeAudio.playMoktak()}
            className="px-4 h-10 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-xs font-bold text-[#F7EBD5] hover:bg-[#3A2518] cursor-pointer"
          >
            Gõ Mõ
          </button>

          <button
            type="button"
            onClick={() => setAutoMoktak((v) => !v)}
            className={cn(
              'px-4 h-10 rounded-full border text-xs font-bold transition cursor-pointer',
              autoMoktak
                ? 'bg-[#123D28] border-[#4ADE80] text-[#86EFAC]'
                : 'bg-[#2A1B12] border-[#A97B4F]/45 text-[#F7EBD5] hover:bg-[#3A2518]'
            )}
          >
            {autoMoktak ? 'Đang nhịp mõ...' : 'Tự động mõ'}
          </button>

          <button
            type="button"
            onClick={() => {
              setAutoMoktak(false);
              templeAudio.playGreatBell();
              triggerBell();
              setActiveModal(null);
            }}
            style={{
              background: 'linear-gradient(to right, #BD8F5E, #996A3D, #734C27)',
            }}
            className="flex-1 min-w-[160px] h-10 px-4 rounded-full border border-[#FFF5D2] text-xs font-bold text-[#1B0D09] shadow-md hover:brightness-105 cursor-pointer whitespace-nowrap"
          >
            Thỉnh Chuông Hồi Hướng
          </button>
        </div>
      </div>
    </div>
  );
}

function MalaModal() {
  const { malaSessionCount, incrementMalaBead, resetMalaSession, setActiveModal, showToast } =
    useTempleStore();

  const [mantraIdx, setMantraIdx] = useState(0);
  const [beadSound, setBeadSound] = useState(true);
  const completedToastRef = useRef(false);

  const countBead = () => {
    if (malaSessionCount >= 108) return;
    const next = malaSessionCount + 1;
    incrementMalaBead(1);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(22);
    }
    if (beadSound) {
      if (next >= 108) {
        templeAudio.playMalaComplete108();
      } else {
        templeAudio.playMalaBead();
      }
    }
    if (next >= 108 && !completedToastRef.current) {
      completedToastRef.current = true;
      showToast('🙏 Viên mãn 108 hạt Bồ Đề! Công đức vô lượng!');
    }
  };

  useEffect(() => {
    if (malaSessionCount === 0) completedToastRef.current = false;
  }, [malaSessionCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        countBead();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        incrementMalaBead(-1);
      } else if (e.code === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malaSessionCount, beadSound]);

  // Precompute 108 bead coordinates on circle
  const beads = useMemo(() => {
    return Array.from({ length: 108 }, (_, idx) => {
      const angle = ((idx + 1) / 108) * Math.PI * 2 + Math.PI / 2;
      return {
        idx: idx + 1,
        cx: 130 + 106 * Math.cos(angle),
        cy: 130 + 106 * Math.sin(angle),
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.84)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        style={CARD_STYLE}
        className="relative w-full max-w-[440px] rounded-3xl border-2 border-[#A97B4F]/60 shadow-2xl p-4 sm:p-6 text-[#F7EBD5] my-auto space-y-3"
      >
        {/* Clean 3-part Header (Never overlaps title even on 390px mobile) */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setBeadSound((s) => !s)}
            className="h-8 px-2.5 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-[11px] font-bold text-[#DBC09B] flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {beadSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Âm thanh</span>
          </button>

          <h3 className="font-serif text-sm sm:text-base font-bold text-[#DBC09B] text-center truncate">
            📿 CHUỖI 108 HẠT BỒ ĐỀ
          </h3>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-[#2A1B12] border border-[#A97B4F]/45 text-[#DBC09B] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 108-Bead Circular Necklace Ring + Center Counter */}
        <div className="relative w-[260px] h-[278px] mx-auto flex items-center justify-center">
          <svg viewBox="0 0 260 282" className="w-full h-full">
            {/* Red/Gold Tassel hanging from Guru Bead (bottom) */}
            <defs>
              <linearGradient id="tasselGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="40%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            <path d="M124 244 L136 244 L141 278 L119 278 Z" fill="url(#tasselGrad)" />
            <circle cx="130" cy="236" r="6" fill="#9C6B19" stroke="#DBC09B" strokeWidth="1.2" />

            {beads.map((b) => {
              const chanted = b.idx <= malaSessionCount;
              const isCurrent = b.idx === malaSessionCount;
              return (
                <g key={b.idx}>
                  {isCurrent && (
                    <circle
                      cx={b.cx}
                      cy={b.cy}
                      r="6.2"
                      fill="none"
                      stroke="#DFB98D"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  )}
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={isCurrent ? '3.5' : '2.7'}
                    fill={chanted ? '#DBC09B' : '#6A4426'}
                    stroke={chanted ? '#FFF5D2' : '#412512'}
                    strokeWidth="0.6"
                  />
                </g>
              );
            })}
          </svg>

          {/* Clickable Center Meditation Hub */}
          <div className="absolute top-[42px] inset-x-[44px] h-[176px] rounded-full bg-[radial-gradient(circle,rgba(56,39,24,0.95)_0%,rgba(27,13,9,0.92)_100%)] border border-[#A97B4F]/30 flex flex-col items-center justify-center p-2 text-center gap-1.5">
            {/* Mantra Carousel */}
            <div className="flex items-center justify-between w-full px-1.5 py-1 rounded-full bg-[#24160F] border border-[#A97B4F]/35 text-[10.5px]">
              <button
                type="button"
                onClick={() => setMantraIdx((i) => (i - 1 + MALA_MANTRAS.length) % MALA_MANTRAS.length)}
                className="text-[#DBC09B] px-1 font-bold cursor-pointer"
              >
                ◀
              </button>
              <span className="font-semibold text-[#FFF4D2] truncate px-1">
                {MALA_MANTRAS[mantraIdx]}
              </span>
              <button
                type="button"
                onClick={() => setMantraIdx((i) => (i + 1) % MALA_MANTRAS.length)}
                className="text-[#DBC09B] px-1 font-bold cursor-pointer"
              >
                ▶
              </button>
            </div>

            <button
              type="button"
              onClick={countBead}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <div className="font-serif text-4xl font-bold text-[#FFF4D2] leading-none">
                {malaSessionCount}
              </div>
              <div className="text-[10px] tracking-wider text-[#F7EBD5]/70 font-semibold">
                / 108 HẠT BỒ ĐỀ
              </div>
              <span className="mt-0.5 px-2.5 py-1 rounded-full bg-[#362415] border border-[#A97B4F]/45 text-[9.5px] font-bold text-[#DBC09B]">
                👆 CHẠM LẦN 1 HẠT
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={malaSessionCount <= 0}
            onClick={() => incrementMalaBead(-1)}
            className="px-3 h-10 rounded-full bg-[#251B14] border border-[#A97B4F]/30 text-xs font-bold text-[#F7EBD5]/80 disabled:opacity-40 cursor-pointer"
          >
            ◀ Lùi
          </button>

          <button
            type="button"
            onClick={countBead}
            style={{
              background: 'linear-gradient(to right, #BD8F5E, #996A3D, #734C27)',
            }}
            className="flex-1 h-10 px-3 rounded-full border border-[#FFF5D2] text-xs sm:text-sm font-bold text-[#1B0D09] shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
          >
            📿 Lần 1 Hạt (+1)
          </button>

          <button
            type="button"
            onClick={resetMalaSession}
            className="px-3 h-10 rounded-full bg-[#251B14] border border-[#A97B4F]/30 text-xs font-bold text-[#F7EBD5]/85 hover:bg-[#342319] cursor-pointer"
          >
            🔄 Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}

function PrayerModal() {
  const { setActiveModal, releaseLantern } = useTempleStore();
  const [wish, setWish] = useState('');
  const [selectedColor, setSelectedColor] = useState(LANTERN_COLORS[0].hex);

  const handleRelease = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = wish.trim() || 'Nguyện cầu gia đạo bình an, muôn loài an lạc thanh tịnh';
    templeAudio.playRejoiceChime();
    releaseLantern(clean, selectedColor);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(10,5,2,0.84)] backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto overscroll-contain dharma-input-panel-lock">
      <form
        onSubmit={handleRelease}
        style={CARD_STYLE}
        className="relative w-full max-w-[440px] rounded-3xl border-2 border-[#A97B4F]/60 shadow-2xl p-5 sm:p-6 text-[#F7EBD5] my-auto space-y-4"
      >
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-[#3A2718] border border-[#A97B4F]/55 mx-auto flex items-center justify-center text-lg">
            🔥
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#DBC09B]">
            Thả Hoa Đăng Cầu Nguyện
          </h3>
          <p className="text-xs text-[#F7EBD5]/70">
            Hoa đăng sẽ trôi trên hồ sen hai bên Chánh Điện
          </p>
        </div>

        <div className="space-y-1.5">
          <textarea
            maxLength={140}
            rows={3}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRelease();
              }
            }}
            placeholder="Nhập lời cầu nguyện bình an, sức khỏe, hạnh phúc..."
            className="w-full p-3.5 rounded-2xl bg-[#261B14]/90 border border-[#A97B4F]/40 focus:border-[#DBC09B] outline-none text-base text-[#FFF4D2] placeholder:text-[#F7EBD5]/40 resize-none"
          />
          <div className="text-right font-mono text-[11px] text-[#F7EBD5]/65">
            {wish.length} / 140 ký tự
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-medium text-[#F7EBD5]/85">
            Chọn sắc màu hoa đăng truyền thống
          </div>
          <div className="flex items-center justify-center gap-3">
            {LANTERN_COLORS.map((c) => {
              const active = selectedColor === c.hex;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  onClick={() => setSelectedColor(c.hex)}
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: active ? `0 0 18px ${c.hex}` : undefined,
                  }}
                  className={cn(
                    'w-9 h-9 rounded-full transition cursor-pointer',
                    active ? 'scale-115 ring-2 ring-[#FFF5D2] ring-offset-2 ring-offset-[#261B14]' : 'opacity-85 hover:opacity-100'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Live Floating Lantern Preview Pill */}
        <div
          className="px-3.5 py-2.5 rounded-2xl border flex items-center gap-2.5 text-xs italic text-[#FFF4D2]"
          style={{
            borderColor: `${selectedColor}80`,
            backgroundColor: `${selectedColor}18`,
          }}
        >
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: selectedColor, boxShadow: `0 0 12px ${selectedColor}` }}
          />
          <span className="truncate">
            {wish.trim() || 'Lời nguyện của bạn sẽ tỏa sáng trên mặt hồ sen...'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="h-10 rounded-xl bg-[#251B14] border border-[#A97B4F]/35 text-xs font-bold text-[#F7EBD5] hover:bg-[#322116] cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(to right, #BD8F5E, #996A3D, #734C27)',
            }}
            className="h-10 rounded-xl border border-[#FFF5D2] text-xs font-bold text-[#1B0D09] shadow-md hover:brightness-105 cursor-pointer"
          >
            Thả Hoa Đăng
          </button>
        </div>
      </form>
    </div>
  );
}

