'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  CalendarPlus,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Flame,
  Globe,
  Heart,
  HeartHandshake,
  IdCard,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  MalaBeadsMinimalIcon,
  MeditatingMonkOutlineIcon,
  TempleBellIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { useAuth } from '@/components/auth/AuthContext';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { PRECEPTS_CONFIG } from '@/components/profile/ProfileSections';
import {
  useDharmaStore,
  computePracticeStreak,
  getTodayDateKey,
  hasAnyPracticeOnLog,
  createEmptyDailyLog,
  type VegetarianMode,
} from '@/store/useDharmaStore';
import { getNextSolarDateForLunar } from '@/lib/lunar-calendar';
import { playBellSound, playBeadTickSound, playOmTempleBellSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

const CUSTOM_AVATAR_KEY = 'phatphap_custom_avatar_v1';
const MEDITATION_SCHEDULE_KEY = 'phatphap_meditation_schedule_v1';
const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const VEGETARIAN_LABELS: Record<VegetarianMode, string> = {
  LUC_TRAI: 'Lục Trai (6 ngày/tháng)',
  THAP_TRAI: 'Thập Trai (10 ngày/tháng)',
  TRUONG_CHAY: 'Trường Chay Thanh Tịnh',
};

const CATEGORY_LABELS: Record<string, string> = {
  HUONG_DANG: 'Dâng Hương • Trai Giới',
  TUNG_KINH: 'Tụng Kinh • Sám Hối',
  NIEM_PHAT: 'Niệm Phật • Lần Chuỗi',
  TOA_THIEN: 'Tọa Thiền • Tĩnh Tâm',
  PHONG_SINH: 'Hiếu Đạo • Hồi Hướng',
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const backupImportRef = useRef<HTMLInputElement | null>(null);

  const tabParam = searchParams?.get('tab');

  const { user, setDharmaProfile, logout } = useAuth();
  const {
    profile,
    updateProfile,
    dailyLogs,
    meritEntries,
    malaLifetimeBeads,
    prayerLamps,
    memorials,
    addMemorial,
    deleteMemorial,
    lightIncenseForMemorial,
    togglePrecept,
    exportBackupJson,
    importBackupJson,
  } = useDharmaStore();

  // Custom avatar state (localStorage)
  const [avatarUrl, setAvatarUrl] = useState<string>('/images/dharma-logo.png');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_AVATAR_KEY);
      if (saved) setAvatarUrl(saved);
    } catch {}
  }, []);

  // Streak Calendar month navigation
  const [calYear, setCalYear] = useState<number>(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState<number>(() => new Date().getMonth() + 1);
  const todayKey = getTodayDateKey();
  const todayLog = dailyLogs[todayKey] || createEmptyDailyLog(todayKey);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isMemorialsOpen, setIsMemorialsOpen] = useState(false);
  const [isPreceptsOpen, setIsPreceptsOpen] = useState(false);
  const [isMeditationScheduleOpen, setIsMeditationScheduleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutDharmaOpen, setIsAboutDharmaOpen] = useState(false);
  const [isSupportDharmaOpen, setIsSupportDharmaOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Schedule state
  const [morningBellEnabled, setMorningBellEnabled] = useState(true);
  const [eveningBellEnabled, setEveningBellEnabled] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEDITATION_SCHEDULE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.morning === 'boolean') setMorningBellEnabled(parsed.morning);
        if (typeof parsed.evening === 'boolean') setEveningBellEnabled(parsed.evening);
      }
    } catch {}
  }, []);

  // Edit profile form
  const [formDharmaName, setFormDharmaName] = useState(profile.dharmaName);
  const [formFullName, setFormFullName] = useState(profile.fullName);
  const [formRefugeTemple, setFormRefugeTemple] = useState(profile.refugeTemple || '');
  const [formRefugeDate, setFormRefugeDate] = useState(profile.refugeDate || '');
  const [formMasterName, setFormMasterName] = useState(profile.masterName || '');
  const [formVowText, setFormVowText] = useState(profile.vowText);
  const [formVegetarianMode, setFormVegetarianMode] = useState<VegetarianMode>(
    profile.vegetarianMode
  );

  // New memorial form inside Sổ Giỗ Chạp modal
  const [showAddMemorialForm, setShowAddMemorialForm] = useState(false);
  const [memFullName, setMemFullName] = useState('');
  const [memDharmaName, setMemDharmaName] = useState('');
  const [memRelationship, setMemRelationship] = useState('Ông Nội / Bà Nội');
  const [memLunarDay, setMemLunarDay] = useState(15);
  const [memLunarMonth, setMemLunarMonth] = useState(7);
  const [memNotes, setMemNotes] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Handle ?tab=so-gio-chap | ?tab=ngu-gioi deep links
  useEffect(() => {
    if (tabParam === 'so-gio-chap') {
      setIsMemorialsOpen(true);
    } else if (tabParam === 'ngu-gioi') {
      setIsPreceptsOpen(true);
    }
  }, [tabParam]);

  // Metrics computed from store
  const metrics = useMemo(() => {
    const logs = Object.values(dailyLogs);
    const streakDays = computePracticeStreak(dailyLogs);
    const totalSutras = logs.reduce((sum, l) => sum + (l.sutrasReadCount || 0), 0);
    const totalMedMins = logs.reduce((sum, l) => sum + (l.meditationMins || 0), 0);
    const totalPrayers = prayerLamps.length;
    const totalMeritScore =
      meritEntries.length * 10 +
      Math.floor(malaLifetimeBeads / 10) +
      totalMedMins * 2 +
      totalSutras * 15;
    return {
      streakDays,
      totalSutras,
      totalMedMins,
      totalPrayers,
      totalMeritScore,
    };
  }, [dailyLogs, meritEntries.length, malaLifetimeBeads, prayerLamps.length]);

  // Build compact circular calendar for Hành trình tu tập
  const habitCells = useMemo(() => {
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const firstJsDay = new Date(calYear, calMonth - 1, 1).getDay();
    const leadingCount = (firstJsDay + 6) % 7;
    const totalCells = Math.ceil((leadingCount + daysInMonth) / 7) * 7;

    const prevY = calMonth === 1 ? calYear - 1 : calYear;
    const prevM = calMonth === 1 ? 12 : calMonth - 1;
    const prevDays = new Date(prevY, prevM, 0).getDate();

    const nextY = calMonth === 12 ? calYear + 1 : calYear;
    const nextM = calMonth === 12 ? 1 : calMonth + 1;

    const cells: {
      day: number;
      dateKey: string;
      inCurrentMonth: boolean;
      hasPractice: boolean;
      isToday: boolean;
    }[] = [];

    let activeDaysCount = 0;

    for (let i = 0; i < totalCells; i++) {
      let y = calYear;
      let m = calMonth;
      let d = 1;
      let inCurrentMonth = true;

      if (i < leadingCount) {
        y = prevY;
        m = prevM;
        d = prevDays - leadingCount + 1 + i;
        inCurrentMonth = false;
      } else if (i >= leadingCount + daysInMonth) {
        y = nextY;
        m = nextM;
        d = i - (leadingCount + daysInMonth) + 1;
        inCurrentMonth = false;
      } else {
        d = i - leadingCount + 1;
      }

      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasPractice = hasAnyPracticeOnLog(dailyLogs[dateKey]);
      if (inCurrentMonth && hasPractice) activeDaysCount++;

      cells.push({
        day: d,
        dateKey,
        inCurrentMonth,
        hasPractice,
        isToday: dateKey === todayKey,
      });
    }

    return { cells, activeDaysCount };
  }, [calYear, calMonth, dailyLogs, todayKey]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      showToast('Vui lòng chọn ảnh nhỏ hơn 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        try {
          localStorage.setItem(CUSTOM_AVATAR_KEY, reader.result);
        } catch {}
        showToast('Đã cập nhật ảnh đại diện cư sĩ!');
      }
    };
    reader.readAsDataURL(file);
  };

  const openEditProfileModal = () => {
    setFormDharmaName(profile.dharmaName);
    setFormFullName(profile.fullName);
    setFormRefugeTemple(profile.refugeTemple || '');
    setFormRefugeDate(profile.refugeDate || '');
    setFormMasterName(profile.masterName || '');
    setFormVowText(profile.vowText);
    setFormVegetarianMode(profile.vegetarianMode);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = formDharmaName.trim();
    if (!cleaned) return;
    updateProfile({
      dharmaName: cleaned,
      fullName: formFullName.trim() || profile.fullName,
      refugeTemple: formRefugeTemple.trim() || undefined,
      refugeDate: formRefugeDate.trim() || undefined,
      masterName: formMasterName.trim() || undefined,
      vowText: formVowText.trim() || profile.vowText,
      vegetarianMode: formVegetarianMode,
    });
    if (user) {
      setDharmaProfile(cleaned, user.gender || 'Nam');
    }
    playBellSound(0.4);
    setIsEditProfileOpen(false);
    showToast('Đã cập nhật Hồ Sơ Phật Tử!');
  };

  const handleAddMemorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memFullName.trim()) return;
    addMemorial({
      fullName: memFullName.trim(),
      dharmaName: memDharmaName.trim() || undefined,
      relationship: memRelationship.trim() || 'Người thân',
      lunarDeathDay: Number(memLunarDay),
      lunarDeathMonth: Number(memLunarMonth),
      notes: memNotes.trim() || 'Cúng chay thanh tịnh, tụng kinh hồi hướng.',
    });
    playOmTempleBellSound(0.45);
    setMemFullName('');
    setMemDharmaName('');
    setMemNotes('');
    setShowAddMemorialForm(false);
    showToast('Đã ghi vào Sổ Giỗ Chạp Gia Tiên');
  };

  const handleExportJson = () => {
    try {
      const jsonStr = exportBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-backup-${todayKey}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Đã tải tệp sao lưu hành trì (.json)');
    } catch {
      showToast('Không thể xuất dữ liệu sao lưu');
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const res = importBackupJson(reader.result);
        if (res.ok) {
          playBellSound(0.45);
          showToast('Đã khôi phục toàn bộ dữ liệu tu tập thành công!');
        } else {
          showToast(res.error || 'Tệp sao lưu không hợp lệ');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleShareDharma = async () => {
    const shareText =
      'Mời bạn cùng tu tập chánh niệm, tụng kinh, lần tràng hạt và tra cứu Lịch Phật Giáo tại DHARMA.';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'DHARMA — Ánh Sáng Chánh Niệm',
          text: shareText,
          url: window.location.origin,
        });
        showToast('Cảm ơn đạo hữu đã lan tỏa Pháp Bảo!');
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        showToast('Đã sao chép liên kết chia sẻ DHARMA!');
      }
    } catch {
      showToast('Hoan hỷ đạo hữu đã lan tỏa năng lượng chánh niệm!');
    }
  };

  const preceptKeptCount = [
    todayLog.precept1NoKill,
    todayLog.precept2NoSteal,
    todayLog.precept3Chaste,
    todayLog.precept4Truth,
    todayLog.precept5Sober,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2C1E10] selection:bg-[#FFE07D]/50 selection:text-[#2C1E10]">
      {/* ===================================================================== */}
      {/* 1. COVER BANNER + CIRCULAR SEAL AVATAR                                */}
      {/* ===================================================================== */}
      <div className="max-w-4xl mx-auto">
        <div className="relative h-44 sm:h-52 lg:rounded-b-[32px] overflow-hidden bg-[#FFF9EB]">
          <img
            src="/images/golden_buddha.jpg"
            alt="Ảnh bìa Phật giáo trang nghiêm"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-white/15 to-black/15" />

          {/* Top-right floating Edit & More buttons */}
          <div className="absolute top-3.5 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={openEditProfileModal}
              className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 border border-[#DFC27D] backdrop-blur-md flex items-center justify-center text-[#2C1E10] hover:bg-[#FFF9EB] transition-colors cursor-pointer shadow-xs"
              aria-label="Chỉnh sửa hồ sơ"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 border border-[#DFC27D] backdrop-blur-md flex items-center justify-center text-[#2C1E10] hover:bg-[#FFF9EB] transition-colors cursor-pointer shadow-xs"
                aria-label="Menu thêm"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {isMoreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsMoreMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] shadow-xl p-1.5 z-30 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        setIsPreceptsOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF9EB] text-[#2C1E10] font-semibold cursor-pointer"
                    >
                      Thọ trì Ngũ Giới ({preceptKeptCount}/5)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        handleExportJson();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF9EB] text-[#2C1E10] font-semibold cursor-pointer"
                    >
                      Sao lưu dữ liệu (.json)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        setAvatarUrl('/images/dharma-logo.png');
                        try {
                          localStorage.removeItem(CUSTOM_AVATAR_KEY);
                        } catch {}
                        showToast('Đã khôi phục ấn hiệu mặc định DHARMA');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF9EB] text-[#6B533B] cursor-pointer"
                    >
                      Khôi phục ảnh đại diện gốc
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Convex bottom notch accent */}
          <div className="absolute inset-x-0 -bottom-5 h-10 bg-[#FAF7F0] rounded-t-[100%]" />
        </div>

        {/* Overlapping Seal Avatar + Camera Button */}
        <div className="relative z-10 -mt-14 flex flex-col items-center px-4 text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFFDF8] to-[#FCECC9] border-[3px] border-[#C68B19] shadow-[0_8px_24px_rgba(140,85,0,0.2)] overflow-hidden flex items-center justify-center">
              <img
                src={avatarUrl}
                alt={profile.dharmaName}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FFF9EB] text-[#2C1E10] border-2 border-[#C68B19] shadow-sm flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              aria-label="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <h1 className="text-xl font-bold text-[#2C1E10] mt-3">
            {profile.dharmaName || 'Phật tử'}
          </h1>
          <p className="text-xs text-[#6B533B] italic mt-1 max-w-md leading-relaxed">
            &ldquo;{profile.vowText || 'Thiền là trở về sống trọn vẹn với hiện tại.'}&rdquo;
          </p>
          {profile.refugeTemple && (
            <span className="mt-1.5 text-[11px] font-semibold text-[#8C5500]">
              {profile.fullName} • Quy y tại {profile.refugeTemple}
            </span>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN DHARMA PROFILE STACK (RESPONSIVE 1-COL / 2-COL DESKTOP)      */}
      {/* ===================================================================== */}
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 lg:pb-16 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT COLUMN (7 cols on desktop): Hành trình tu tập & Metrics */}
          <div className="lg:col-span-7 space-y-4">
            <section className="rounded-[24px] bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1E10]">
                Hành trình tu tập
              </h2>

              {/* Inner Streak Calendar Box */}
              <div className="rounded-2xl bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC9] border border-[#DFC27D] p-4 relative overflow-hidden space-y-4 shadow-2xs">
                <DharmaWheelIcon className="w-28 h-28 text-[#C68B19] opacity-10 absolute -top-5 -right-5 pointer-events-none" />

                <div className="flex items-end justify-between gap-2 relative z-10">
                  <div>
                    <div className="text-4xl font-extrabold text-[#8C5500] leading-none">
                      {metrics.streakDays}
                    </div>
                    <p className="text-xs font-semibold text-[#2C1E10] mt-1">ngày tinh tấn</p>
                  </div>
                  <p className="text-xs text-[#6B533B] text-right">
                    Hành trình chánh niệm mỗi ngày
                  </p>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between text-xs relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1E10]">
                      Tháng {calMonth} năm {calYear}
                    </span>
                    <span className="font-bold text-[#8C5500]">
                      {habitCells.activeDaysCount} ngày
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 1) {
                          setCalYear((y) => y - 1);
                          setCalMonth(12);
                        } else {
                          setCalMonth((m) => m - 1);
                        }
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                      aria-label="Tháng trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 12) {
                          setCalYear((y) => y + 1);
                          setCalMonth(1);
                        } else {
                          setCalMonth((m) => m + 1);
                        }
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#6B533B] hover:text-[#2C1E10] cursor-pointer"
                      aria-label="Tháng sau"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7-column Circular Dates */}
                <div className="space-y-1.5 relative z-10">
                  <div className="grid grid-cols-7 text-center">
                    {WEEKDAY_SHORT.map((wd) => (
                      <span key={wd} className="text-[11px] font-bold text-[#6B533B] py-0.5">
                        {wd}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1.5 justify-items-center">
                    {habitCells.cells.map((cell) => (
                      <div
                        key={cell.dateKey}
                        className={cn(
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors',
                          !cell.inCurrentMonth
                            ? 'text-[#B8A890]'
                            : cell.isToday
                            ? 'bg-gradient-to-br from-[#FFE07D] to-[#F5C542] border-[1.5px] border-[#C68B19] text-[#2C1E10] font-bold shadow-2xs'
                            : cell.hasPractice
                            ? 'bg-[#FFF6DF] border border-[#DFC27D] text-[#8C5500] font-bold'
                            : 'bg-[#FFFFFF]/85 border border-[#EAD7A7] text-[#6B533B]'
                        )}
                      >
                        {cell.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Metric Rows */}
              <div className="divide-y divide-[#EAD7A7] text-sm">
                <Link
                  href="/thu-vien"
                  className="flex items-center justify-between py-3 group hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-[#2C1E10]">Tụng kinh</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8C5500] font-bold">
                    <span>{metrics.totalSutras} lần</span>
                    <ChevronRight className="w-4 h-4 text-[#8C5500]" />
                  </div>
                </Link>

                <Link
                  href="/thuc-hanh?phap-khi=thien-hoi-tho"
                  className="flex items-center justify-between py-3 group hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                      <MeditatingMonkOutlineIcon className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-[#2C1E10]">Thiền định</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8C5500] font-bold">
                    <span>{metrics.totalMedMins} phút</span>
                    <ChevronRight className="w-4 h-4 text-[#8C5500]" />
                  </div>
                </Link>

                <Link
                  href="/thuc-hanh?phap-khi=trang-hat"
                  className="flex items-center justify-between py-3 group hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                      <MalaBeadsMinimalIcon className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-[#2C1E10]">Lần chuỗi hạt</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8C5500] font-bold">
                    <span>{malaLifetimeBeads.toLocaleString('vi-VN')} hạt</span>
                    <ChevronRight className="w-4 h-4 text-[#8C5500]" />
                  </div>
                </Link>

                <Link
                  href="/cau-nguyen"
                  className="flex items-center justify-between py-3 group hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-[#2C1E10]">Cầu nguyện</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8C5500] font-bold">
                    <span>{metrics.totalPrayers} lời cầu</span>
                    <ChevronRight className="w-4 h-4 text-[#8C5500]" />
                  </div>
                </Link>

                {/* Thống kê row */}
                <button
                  type="button"
                  onClick={() => setIsStatsOpen(true)}
                  className="w-full flex items-center justify-between pt-3.5 pb-1 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500]">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-bold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Thống kê
                      </p>
                      <p className="text-xs text-[#6B533B]">
                        Xem chi tiết tiến trình &amp; Sổ Công Đức ({metrics.totalMeritScore} điểm)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500]" />
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (5 cols on desktop): Về DHARMA + Cá nhân + Ủng hộ + Cộng đồng + Cài đặt */}
          <div className="lg:col-span-5 space-y-4">
            {/* Về DHARMA */}
            <button
              type="button"
              onClick={() => setIsAboutDharmaOpen(true)}
              className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-colors flex items-center justify-between gap-3 text-left cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src="/images/dharma-logo.png"
                  alt="DHARMA"
                  className="w-10 h-10 rounded-xl object-cover border border-[#DFC27D] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2C1E10]">Về DHARMA</p>
                  <p className="text-xs text-[#6B533B] truncate">
                    Cộng đồng, chia sẻ &amp; cảm nhận
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
            </button>

            {/* Cá nhân section card */}
            <section className="rounded-[24px] bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-2 shadow-xs">
              <h2 className="text-base font-bold text-[#2C1E10] pb-1">Cá nhân</h2>

              <div className="divide-y divide-[#EAD7A7]">
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="w-full py-3 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IdCard className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Hồ sơ Phật tử
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Cập nhật pháp danh, thế danh, ngày quy y
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMemorialsOpen(true)}
                  className="w-full py-3 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Heart className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Sổ Giỗ Chạp ({memorials.length})
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Ghi nhớ ngày giỗ người thân &amp; thắp hương
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>

                <Link
                  href="/lich-phat-giao"
                  className="w-full py-3 flex items-center justify-between gap-3 text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CalendarPlus className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Sự kiện cá nhân
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Tạo và quản lý sự kiện cá nhân
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMeditationScheduleOpen(true)}
                  className="w-full py-3 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Clock className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Lịch thiền định
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Tạo lịch nhắc thiền định hằng ngày
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreceptsOpen(true)}
                  className="w-full pt-3 pb-1 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500] transition-colors">
                        Thọ trì Ngũ Giới ({preceptKeptCount}/5 hôm nay)
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Kiểm tra giới hạnh nuôi dưỡng tâm từ
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>
              </div>
            </section>

            {/* Ủng hộ DHARMA */}
            <button
              type="button"
              onClick={() => setIsSupportDharmaOpen(true)}
              className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] hover:border-[#C68B19] transition-colors flex items-center justify-between gap-3 text-left cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-9 h-9 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] flex items-center justify-center text-[#8C5500] shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2C1E10]">Ủng hộ DHARMA</p>
                  <p className="text-xs text-[#6B533B] truncate">
                    Tiếp sức để DHARMA đi xa hơn
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
            </button>

            {/* Cộng đồng DHARMA */}
            <section className="rounded-[24px] bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-3 shadow-xs">
              <h2 className="text-base font-bold text-[#2C1E10]">Cộng đồng DHARMA</h2>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#6B533B]">Nhóm cộng đồng</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Zalo', dot: 'bg-sky-500' },
                    { name: 'Facebook', dot: 'bg-blue-500' },
                  ].map((net) => (
                    <button
                      key={net.name}
                      type="button"
                      onClick={() =>
                        showToast(`Cộng đồng ${net.name} Đạo Tràng DHARMA đang mở kết nối`)
                      }
                      className="px-4 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-semibold text-[#2C1E10] inline-flex items-center gap-2 hover:bg-[#FFF6DF] cursor-pointer"
                    >
                      <span className={cn('w-2.5 h-2.5 rounded-full', net.dot)} />
                      <span>{net.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#6B533B]">Kênh chính thức</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'TikTok', dot: 'bg-pink-500' },
                    { name: 'FanPage', dot: 'bg-blue-600' },
                    { name: 'YouTube', dot: 'bg-red-500' },
                  ].map((ch) => (
                    <button
                      key={ch.name}
                      type="button"
                      onClick={() => showToast(`Kênh ${ch.name} Pháp Âm DHARMA — Hạnh nguyện lan tỏa`)}
                      className="px-4 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-semibold text-[#2C1E10] inline-flex items-center gap-2 hover:bg-[#FFF6DF] cursor-pointer"
                    >
                      <span className={cn('w-2.5 h-2.5 rounded-full', ch.dot)} />
                      <span>{ch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Cài đặt */}
            <section className="rounded-[24px] bg-[#FFFFFF] border border-[#EAD7A7] p-4 sm:p-5 space-y-2 shadow-xs">
              <h2 className="text-base font-bold text-[#2C1E10] pb-1">Cài đặt</h2>
              <div className="divide-y divide-[#EAD7A7]">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full py-3 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Settings className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500]">
                        Cài đặt
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Thông báo, ngôn ngữ ứng dụng, sao lưu dữ liệu...
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleShareDharma}
                  className="w-full pt-3 pb-1 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Share2 className="w-4 h-4 text-[#8C5500] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2C1E10] group-hover:text-[#8C5500]">
                        Chia sẻ ứng dụng
                      </p>
                      <p className="text-xs text-[#6B533B] truncate">
                        Mời bạn bè cùng sử dụng DHARMA
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C5500] shrink-0" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: HỒ SƠ PHẬT TỬ (EDIT)                                */}
      {/* ===================================================================== */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10]">Hồ Sơ Phật Tử</h2>
            <div className="w-20" />
          </header>

          <form
            onSubmit={handleSaveProfile}
            className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-4 text-xs sm:text-sm"
          >
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B533B] mb-1">Pháp danh</label>
                  <input
                    type="text"
                    value={formDharmaName}
                    onChange={(e) => setFormDharmaName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B533B] mb-1">Thế danh</label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B533B] mb-1">Chùa Quy Y</label>
                  <input
                    type="text"
                    value={formRefugeTemple}
                    onChange={(e) => setFormRefugeTemple(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B533B] mb-1">Ngày Quy Y</label>
                  <input
                    type="text"
                    value={formRefugeDate}
                    onChange={(e) => setFormRefugeDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Hạnh Ăn Chay</label>
                <select
                  value={formVegetarianMode}
                  onChange={(e) => setFormVegetarianMode(e.target.value as VegetarianMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                >
                  {(Object.keys(VEGETARIAN_LABELS) as VegetarianMode[]).map((m) => (
                    <option key={m} value={m}>
                      {VEGETARIAN_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#6B533B] mb-1">Tâm Nguyện / Phương Châm Tu Tập</label>
                <textarea
                  rows={3}
                  value={formVowText}
                  onChange={(e) => setFormVowText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#6B533B] cursor-pointer"
              >
                ← Quay lại
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#8C5500] text-white text-xs font-bold cursor-pointer hover:bg-[#6E4200]"
              >
                Lưu Hồ Sơ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: THỐNG KÊ & SỔ CÔNG ĐỨC                              */}
      {/* ===================================================================== */}
      {isStatsOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsStatsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div className="text-center min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
                Thống Kê Tu Tập &amp; Sổ Công Đức
              </h2>
              <p className="text-[11px] text-[#8C5500] font-semibold">
                Tổng điểm công đức: {metrics.totalMeritScore} điểm
              </p>
            </div>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full space-y-3">
            {meritEntries.length === 0 ? (
              <p className="text-xs text-center text-[#6B533B] py-12">
                Chưa có ghi nhận công đức nào. Hãy bắt đầu niệm Phật, tụng kinh hoặc dâng hương hôm nay.
              </p>
            ) : (
              meritEntries.slice(0, 30).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#8C5500]">
                      {CATEGORY_LABELS[entry.category] || 'Công Đức'}
                    </span>
                    <span className="text-[#6B533B]">
                      {new Date(entry.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#2C1E10]">{entry.title}</h3>
                  <p className="text-xs text-[#6B533B] leading-relaxed">
                    {entry.dedicationText}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: SỔ GIỖ CHẠP                                         */}
      {/* ===================================================================== */}
      {isMemorialsOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsMemorialsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div className="text-center min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
                Sổ Giỗ Chạp &amp; Tưởng Niệm Gia Tiên
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMemorialForm((v) => !v)}
              className="px-3.5 py-2 rounded-xl bg-[#8C5500] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full space-y-3">
            {showAddMemorialForm && (
              <form
                onSubmit={handleAddMemorial}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DFC27D] space-y-3 text-xs shadow-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={memFullName}
                    onChange={(e) => setMemFullName(e.target.value)}
                    placeholder="Họ tên người quá cố..."
                    className="px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                    required
                  />
                  <input
                    type="text"
                    value={memDharmaName}
                    onChange={(e) => setMemDharmaName(e.target.value)}
                    placeholder="Pháp danh (nếu có)..."
                    className="px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={memRelationship}
                    onChange={(e) => setMemRelationship(e.target.value)}
                    placeholder="Vai vế"
                    className="px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={memLunarDay}
                    onChange={(e) => setMemLunarDay(Number(e.target.value))}
                    placeholder="Ngày ÂL"
                    className="px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={memLunarMonth}
                    onChange={(e) => setMemLunarMonth(Number(e.target.value))}
                    placeholder="Tháng ÂL"
                    className="px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                  />
                </div>
                <input
                  type="text"
                  value={memNotes}
                  onChange={(e) => setMemNotes(e.target.value)}
                  placeholder="Ghi chú mâm cúng / kinh hồi hướng..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-[#2C1E10]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#8C5500] text-white font-bold cursor-pointer"
                >
                  Lưu Vào Sổ Giỗ Chạp
                </button>
              </form>
            )}

            {memorials.map((m) => {
              const nextSolar = getNextSolarDateForLunar(m.lunarDeathDay, m.lunarDeathMonth);
              const dd = String(nextSolar.solarDate.getDate()).padStart(2, '0');
              const mm = String(nextSolar.solarDate.getMonth() + 1).padStart(2, '0');
              const yyyy = nextSolar.solarDate.getFullYear();
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#8C5500]">
                        {m.relationship} • Ngày {m.lunarDeathDay}/{m.lunarDeathMonth} Âm lịch
                      </span>
                      <h3 className="text-sm font-bold text-[#2C1E10] mt-0.5">
                        {m.fullName} {m.dharmaName ? `(${m.dharmaName})` : ''}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMemorial(m.id)}
                      className="p-1.5 rounded-full text-[#6B533B] hover:text-red-600 cursor-pointer"
                      aria-label="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#6B533B]">
                    Lễ giỗ sắp tới:{' '}
                    <span className="text-[#2C1E10] font-bold">
                      {dd}/{mm}/{yyyy}
                    </span>{' '}
                    (Còn {nextSolar.daysRemaining} ngày)
                  </p>
                  {m.notes && <p className="text-xs text-[#6B533B] italic">{m.notes}</p>}

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <span className="text-xs text-[#6B533B]">
                      Đã thắp {m.incenseCount} tuần hương
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playBellSound(0.45);
                        lightIncenseForMemorial(m.id);
                        showToast(`Đã thắp hương tưởng niệm ${m.fullName}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#FCECC9]"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Thắp hương hồi hướng</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: THỌ TRÌ NGŨ GIỚI                                    */}
      {/* ===================================================================== */}
      {isPreceptsOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreceptsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div className="text-center min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
                Bảng Kiểm Tự Sửa Ngũ Giới Hôm Nay
              </h2>
              <p className="text-[11px] text-[#8C5500] font-semibold">
                Đã giữ {preceptKeptCount}/5 giới thanh tịnh hôm nay
              </p>
            </div>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full space-y-2.5">
            {PRECEPTS_CONFIG.map((item) => {
              const kept = Boolean(todayLog[item.field]);
              return (
                <button
                  key={item.field}
                  type="button"
                  onClick={() => {
                    playBeadTickSound(0.3);
                    togglePrecept(item.field, todayKey);
                  }}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer shadow-xs',
                    kept
                      ? 'bg-[#FFF9EB] border-[#C68B19]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7]'
                  )}
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border',
                      kept
                        ? 'bg-[#8C5500] border-[#8C5500] text-white'
                        : 'border-[#DFC27D] text-transparent'
                    )}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#8C5500]">
                      {item.number} • {item.pali}
                    </span>
                    <p className="text-sm font-bold text-[#2C1E10]">{item.title}</p>
                    <p className="text-xs text-[#6B533B] leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: LỊCH THIỀN ĐỊNH                                     */}
      {/* ===================================================================== */}
      {isMeditationScheduleOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMeditationScheduleOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              Chuông Nhắc Thời Khóa Hằng Ngày
            </h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-4">
            <div className="space-y-2.5 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setMorningBellEnabled((v) => !v)}
                className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] flex items-center justify-between text-left cursor-pointer shadow-xs"
              >
                <div>
                  <span className="font-bold text-[#2C1E10] block">
                    05:30 • Tĩnh Tâm Sớm Mai
                  </span>
                  <span className="text-xs text-[#6B533B]">Thỉnh 3 tiếng chuông &amp; quán hơi thở</span>
                </div>
                <span className={morningBellEnabled ? 'text-emerald-700 font-bold' : 'text-[#6B533B]'}>
                  {morningBellEnabled ? 'Đang bật' : 'Đã tắt'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEveningBellEnabled((v) => !v)}
                className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] flex items-center justify-between text-left cursor-pointer shadow-xs"
              >
                <div>
                  <span className="font-bold text-[#2C1E10] block">
                    21:00 • Tịnh Độ Đêm Khuya
                  </span>
                  <span className="text-xs text-[#6B533B]">Tự kiểm Ngũ Giới &amp; Hồi hướng công đức</span>
                </div>
                <span className={eveningBellEnabled ? 'text-emerald-700 font-bold' : 'text-[#6B533B]'}>
                  {eveningBellEnabled ? 'Đang bật' : 'Đã tắt'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(
                    MEDITATION_SCHEDULE_KEY,
                    JSON.stringify({
                      morning: morningBellEnabled,
                      evening: eveningBellEnabled,
                    })
                  );
                } catch {}
                playBellSound(0.45);
                showToast('Đã lưu lịch nhắc thiền định!');
                setIsMeditationScheduleOpen(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#8C5500] text-white font-bold text-sm cursor-pointer"
            >
              Hoàn Tất &amp; Lưu Lịch
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: CÀI ĐẶT & SAO LƯU JSON                              */}
      {/* ===================================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10] truncate">
              Cài Đặt &amp; Sao Lưu Dữ Liệu
            </h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7]">
              <div className="flex items-center gap-2 text-[#2C1E10] font-bold">
                <Globe className="w-4 h-4 text-[#8C5500]" />
                <span>Ngôn ngữ giao diện</span>
              </div>
              <LanguageSwitcher compact variant="sanctuary" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7]">
              <div className="flex items-center gap-2 text-[#2C1E10] font-bold">
                <TempleBellIcon className="w-4 h-4 text-[#8C5500]" />
                <span>Âm thanh WebAudio độ trễ 0ms</span>
              </div>
              <span className="text-emerald-700 font-bold">Hoạt động</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="py-3 px-3 rounded-2xl bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Sao lưu JSON</span>
              </button>
              <button
                type="button"
                onClick={() => backupImportRef.current?.click()}
                className="py-3 px-3 rounded-2xl bg-[#FFF9EB] border border-[#DFC27D] text-[#8C5500] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Khôi phục JSON</span>
              </button>
              <input
                ref={backupImportRef}
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>

            {user && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsSettingsOpen(false);
                  showToast('Đã đăng xuất tài khoản cư sĩ');
                }}
                className="w-full py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản ({user.dharma_name || user.full_name})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN PAGE: VỀ DHARMA & ỦNG HỘ DHARMA                           */}
      {/* ===================================================================== */}
      {isAboutDharmaOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAboutDharmaOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10]">Về Đạo Tràng DHARMA</h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-4">
            <img
              src="/images/dharma-logo.png"
              alt="DHARMA"
              className="w-20 h-20 rounded-3xl border border-[#DFC27D] shadow-xs"
            />
            <div>
              <h2 className="text-xl font-bold text-[#2C1E10]">
                DHARMA — Không Gian Chánh Niệm
              </h2>
              <p className="text-xs font-bold text-[#8C5500] mt-1">
                Pháp Bảo Miễn Phí • Đồng Hành Tu Tập Mỗi Ngày
              </p>
            </div>
            <p className="text-sm text-[#2C1E10] leading-relaxed text-left p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7]">
              DHARMA tích hợp Lịch Âm Dương thiên văn chính xác, Thư viện Tam Tạng Kinh điển &amp; Bài khấn truyền thống, Phòng Cầu An &amp; Cầu Siêu, Tràng hạt 108, Chuông Mõ tịnh tâm và các pháp môn trợ duyên tu tập hằng ngày.
            </p>
          </div>
        </div>
      )}

      {isSupportDharmaOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden">
          <header className="px-4 py-3 bg-[#FFFDF8] border-b border-[#EAD7A7] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSupportDharmaOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9EB] border border-[#DFC27D] text-xs font-bold text-[#8C5500] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <h2 className="text-sm sm:text-base font-bold text-[#2C1E10]">
              Ủng Hộ &amp; Hộ Trì DHARMA
            </h2>
            <div className="w-20" />
          </header>

          <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full flex flex-col justify-center space-y-4">
            <p className="text-sm text-[#2C1E10] leading-relaxed p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAD7A7]">
              Nền tảng hoàn toàn phi lợi nhuận, không quảng cáo. Sự tinh tấn tu tập và việc chia sẻ DHARMA đến người hữu duyên chính là nguồn trợ duyên lớn nhất.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSupportDharmaOpen(false);
                void handleShareDharma();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#8C5500] text-white font-bold text-sm cursor-pointer"
            >
              Chia Sẻ Lan Tỏa DHARMA
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-[999999] flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-[#FFF9EB] border border-[#DFC27D] text-center shadow-lg">
            <p className="text-xs sm:text-sm font-bold text-[#8C5500]">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HoSoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center text-sm font-bold text-[#8C5500]">
          Đang tải Hồ Sơ Cá Nhân...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
