'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DEFAULT_DHARMA_AVATAR,
  DEFAULT_DHARMA_NAME,
  readDeviceAuthCookie,
} from '@/lib/deviceAuthCookie';

export type VegetarianMode = 'LUC_TRAI' | 'THAP_TRAI' | 'TRUONG_CHAY';
export type MeritCategory = 'HUONG_DANG' | 'TUNG_KINH' | 'NIEM_PHAT' | 'TOA_THIEN' | 'PHONG_SINH';
export type TimePeriodKey = 'thoiKhuya' | 'thoiSang' | 'thoiChieu' | 'thoiToi';
export type PreceptKey =
  | 'precept1NoKill'
  | 'precept2NoSteal'
  | 'precept3Chaste'
  | 'precept4Truth'
  | 'precept5Sober';

export interface UserProfile {
  id: string;
  fullName: string;
  dharmaName: string;
  avatarUrl?: string;
  refugeDate?: string;
  refugeTemple?: string;
  masterName?: string;
  vowText: string;
  vegetarianMode: VegetarianMode;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPracticeLog {
  id: string;
  dateKey: string; // YYYY-MM-DD
  thoiKhuya: boolean;
  thoiSang: boolean;
  thoiChieu: boolean;
  thoiToi: boolean;
  meditationMins: number;
  malaBeadsCount: number;
  sutrasReadCount: number;
  woodfishCount: number;
  precept1NoKill: boolean;
  precept2NoSteal: boolean;
  precept3Chaste: boolean;
  precept4Truth: boolean;
  precept5Sober: boolean;
  reflectionNote?: string;
}

export interface MeritEntry {
  id: string;
  timestamp: string;
  category: MeritCategory;
  title: string;
  dedicationText: string;
  targetName?: string;
}

export interface AncestralMemorial {
  id: string;
  fullName: string;
  dharmaName?: string;
  relationship: string;
  lunarDeathDay: number;
  lunarDeathMonth: number;
  lunarDeathYear?: number;
  notes?: string;
  incenseCount: number;
}

export interface PrayerLamp {
  id: string;
  type: 'CAU_AN' | 'CAU_SIEU';
  senderName: string;
  recipientName: string;
  wishContent: string;
  createdAt: string;
}

export function getTodayDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createEmptyDailyLog(dateKey: string): DailyPracticeLog {
  return {
    id: `log-${dateKey}`,
    dateKey,
    thoiKhuya: false,
    thoiSang: false,
    thoiChieu: false,
    thoiToi: false,
    meditationMins: 0,
    malaBeadsCount: 0,
    sutrasReadCount: 0,
    woodfishCount: 0,
    precept1NoKill: true,
    precept2NoSteal: true,
    precept3Chaste: true,
    precept4Truth: true,
    precept5Sober: true,
  };
}

export function hasAnyPracticeOnLog(log?: DailyPracticeLog): boolean {
  if (!log) return false;
  return Boolean(
    log.thoiKhuya ||
      log.thoiSang ||
      log.thoiChieu ||
      log.thoiToi ||
      log.meditationMins > 0 ||
      log.malaBeadsCount > 0 ||
      log.sutrasReadCount > 0 ||
      log.woodfishCount > 0
  );
}

export function computePracticeStreak(
  dailyLogs: Record<string, DailyPracticeLog>,
  referenceDate: Date = new Date()
): number {
  let streak = 0;
  const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const todayKey = getTodayDateKey(cursor);
  const todayDone = hasAnyPracticeOnLog(dailyLogs[todayKey]);

  if (!todayDone) {
    // Nếu hôm nay chưa bắt đầu, tính chuỗi liên tiếp đến hôm qua
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let i = 0; i < 3650; i++) {
    const key = getTodayDateKey(cursor);
    if (hasAnyPracticeOnLog(dailyLogs[key])) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'default-profile',
  fullName: 'Dharma',
  dharmaName: 'Dharma',
  avatarUrl: '/images/dharma-logo.png',
  refugeDate: '15/04/2023',
  refugeTemple: 'Chùa Hoằng Pháp',
  masterName: 'Thượng Tọa Thích Chân Tính',
  vowText: 'Nguyện giữ tâm thanh tịnh, thực hành từ bi và chánh niệm mỗi ngày.',
  vegetarianMode: 'LUC_TRAI',
  createdAt: new Date(2026, 0, 1).toISOString(),
  updatedAt: new Date(2026, 0, 1).toISOString(),
};

const INITIAL_MEMORIALS: AncestralMemorial[] = [
  {
    id: 'mem-1',
    fullName: 'Cửu Huyền Thất Tổ Gia Tiên',
    dharmaName: 'Liệt Vị Hương Linh',
    relationship: 'Gia Tiên Tiền Tổ',
    lunarDeathDay: 15,
    lunarDeathMonth: 7,
    notes: 'Cúng chay thanh tịnh lễ Vu Lan, tụng Kinh Địa Tạng & Kinh Báo Hiếu Phụ Mẫu.',
    incenseCount: 12,
  },
  {
    id: 'mem-2',
    fullName: 'Ông Nội Nguyễn Văn Minh',
    dharmaName: 'Phúc Đức',
    relationship: 'Ông Nội',
    lunarDeathDay: 22,
    lunarDeathMonth: 10,
    lunarDeathYear: 2018,
    notes: 'Dâng trà sen, mâm cơm chay 3 món thanh đạm, tụng Kinh A Di Đà cầu vãng sinh.',
    incenseCount: 5,
  },
];

const INITIAL_LAMPS: PrayerLamp[] = [
  {
    id: 'lamp-seed-1',
    type: 'CAU_AN',
    senderName: 'Thiện Tâm',
    recipientName: 'Cha Mẹ & Gia Quyến',
    wishContent: 'Nguyện cầu song thân thân tâm thường an lạc, tật bệnh tiêu trừ, phước thọ tăng long.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'lamp-seed-2',
    type: 'CAU_SIEU',
    senderName: 'Diệu Âm',
    recipientName: 'Hương Linh Cửu Huyền Thất Tổ',
    wishContent: 'Nam Mô A Di Đà Phật, nguyện đem công đức niệm Phật hồi hướng chư hương linh sớm sanh Tịnh Độ.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'lamp-seed-3',
    type: 'CAU_AN',
    senderName: 'Quảng Minh',
    recipientName: 'Chúng Sinh Mười Phương',
    wishContent: 'Nguyện cho quốc thái dân an, phong điều vũ thuận, nhà nhà ấm êm trong ánh sáng Từ Bi.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_MERITS: MeritEntry[] = [
  {
    id: 'merit-seed-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    category: 'TUNG_KINH',
    title: 'Trì tụng Bát Nhã Ba La Mật Đa Tâm Kinh',
    dedicationText: 'Nguyện đem công đức này trang nghiêm Phật Tịnh Độ, trên đền bốn ơn nặng, dưới cứu khổ ba đường.',
  },
];

const DAILY_PERIOD_LABELS: Record<TimePeriodKey, string> = {
  thoiKhuya: 'Thời Khuya (04:00 - 05:30) — Công phu Lăng Nghiêm',
  thoiSang: 'Thời Sáng (06:00 - 07:30) — Chú Đại Bi & Kinh Nhật Tụng',
  thoiChieu: 'Thời Chiều (16:00 - 17:30) — Kinh A Di Đà & Mông Sơn',
  thoiToi: 'Thời Tối (19:30 - 21:00) — Tịnh Độ & Sám Hối Sáu Căn',
};

export type MalaMaterial = 'bo-de' | 'tram-huong' | 'luu-ly' | 'bach-ngoc';
export type MalaSize = 18 | 27 | 54 | 108;
export type TabletMode = 'CAU_SIEU' | 'CAU_AN';

export interface SpiritTablet {
  id: string;
  mode: TabletMode;
  fullName: string;
  dharmaName?: string;
  relationship: string;
  lunarDeathDate?: string;
  birthYear?: string;
  longevity?: string;
  prayerWish: string;
  incenseLit: number;
  lampsLit: number;
  mantraCount: number;
  isDefault?: boolean;
  createdAt: string;
}

export interface FortuneDrawRecord {
  id: string;
  verseNumber: string;
  chapter: string;
  verse: string;
  meaning: string;
  guidance: string;
  dateKey: string;
}

export interface DharmaState {
  profile: UserProfile;
  dailyLogs: Record<string, DailyPracticeLog>;
  meritEntries: MeritEntry[];
  memorials: AncestralMemorial[];
  prayerLamps: PrayerLamp[];
  malaCurrentBead: number;
  malaCompletedMalas: number;
  malaLifetimeBeads: number;
  malaSelectedDeityId: string;
  malaMaterial: MalaMaterial;
  malaSize: MalaSize;
  malaDailyTargetRounds: number;
  bookmarkedVerseIds: number[];
  bookmarkedArticleSlugs: string[];
  bookmarkedSutraIds: string[];
  visitedPagodaSlugs: string[];
  legacyMigrated: boolean;

  // Extended 8 Practice Tools state
  templeIncenseCount: number;
  templeProstrationsCount: number;
  templeOfferingsCount: number;
  templeFortuneHistory: FortuneDrawRecord[];
  spiritTablets: SpiritTablet[];
  chantMachineTrackId: string;
  chantMachineCount: number;
  chantMachineSpeed: 'slow' | 'medium' | 'fast';
  downloadedAudioIds: string[];
  audioPositions: Record<string, number>;
  bellStrikesCount: number;

  // Profile
  updateProfile: (patch: Partial<UserProfile>) => void;

  // Daily 4 periods & Precepts
  toggleTimePeriod: (period: TimePeriodKey, dateKey?: string) => void;
  togglePrecept: (precept: PreceptKey, dateKey?: string) => void;
  updateReflectionNote: (note: string, dateKey?: string) => void;

  // Practice Tools actions
  addMeditationMinutes: (mins: number, label?: string) => void;
  incrementMalaBead: (step?: number, deityName?: string, customSize?: number) => { completedFullMala: boolean };
  resetMalaCurrentBead: () => void;
  setMalaSelectedDeity: (deityId: string) => void;
  setMalaCustomization: (patch: { malaMaterial?: MalaMaterial; malaSize?: MalaSize; malaDailyTargetRounds?: number }) => void;
  incrementWoodfishCount: (delta?: number) => void;
  incrementBellStrikes: (delta?: number, ritualLabel?: string) => void;
  recordSutraCompletion: (sutraTitle: string, dedicationText?: string) => void;

  // Tool 02: Đi chùa
  recordTempleIncense: () => void;
  recordTempleProstrationCycle: (bows?: number) => void;
  recordTempleOffering: (kind: 'hoa-sen' | 'tinh-thuy') => void;
  recordFortuneDraw: (item: Omit<FortuneDrawRecord, 'id' | 'dateKey'>) => void;

  // Tool 03: Cầu siêu & Cầu an tablets
  addSpiritTablet: (tablet: Omit<SpiritTablet, 'id' | 'incenseLit' | 'lampsLit' | 'mantraCount' | 'createdAt'>) => string;
  deleteSpiritTablet: (id: string) => void;
  lightSpiritTabletOffering: (id: string, kind: 'incense' | 'lamp') => void;
  incrementSpiritTabletMantra: (id: string, delta: number, dedicationTitle?: string) => void;

  // Tool 04: Máy niệm Phật
  setChantMachineTrack: (trackId: string) => void;
  setChantMachineSpeed: (speed: 'slow' | 'medium' | 'fast') => void;
  incrementChantMachineCount: (trackTitle: string) => void;

  // Tool 05: Nghe kinh offline
  setAudioDownloaded: (trackId: string, downloaded: boolean) => void;
  saveAudioPosition: (trackId: string, seconds: number) => void;

  // Merit Ledger & Altar & Prayer Lamps
  addMeritEntry: (entry: Omit<MeritEntry, 'id' | 'timestamp'>) => void;
  addPrayerLamp: (lamp: Omit<PrayerLamp, 'id' | 'createdAt'>) => void;

  // Memorials (Sổ Giỗ Chạp)
  addMemorial: (memorial: Omit<AncestralMemorial, 'id' | 'incenseCount'>) => void;
  updateMemorial: (id: string, patch: Partial<AncestralMemorial>) => void;
  deleteMemorial: (id: string) => void;
  lightIncenseForMemorial: (id: string) => void;

  // Bookmarks & Pilgrimage
  toggleVerseBookmark: (verseId: number) => void;
  toggleArticleBookmark: (slug: string) => void;
  toggleSutraBookmark: (sutraId: string) => void;
  togglePagodaCheckin: (slug: string, pagodaName?: string) => boolean;

  // Migration & Backup
  migrateLegacyIfNeeded: () => void;
  exportBackupJson: () => string;
  importBackupJson: (rawJson: string) => { ok: boolean; error?: string };
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const INITIAL_SPIRIT_TABLETS: SpiritTablet[] = [
  {
    id: 'tablet-default-cuu-huyen',
    mode: 'CAU_SIEU',
    fullName: 'Cửu Huyền Thất Tổ & Chiến Sĩ Trận Vong, Đồng Bào Tử Nạn',
    dharmaName: 'Chư Vị Hương Linh',
    relationship: 'Gia Tiên & Cộng Đồng',
    lunarDeathDate: '15/07 Âm lịch',
    prayerWish:
      'Nguyện đem công đức tụng kinh trì chú hồi hướng cho cửu huyền thất tổ nội ngoại hai bên, các anh linh chiến sĩ trận vong và đồng bào tử nạn sớm tiêu trừ nghiệp chướng, siêu sanh về miền Cực Lạc thanh tịnh.',
    incenseLit: 36,
    lampsLit: 18,
    mantraCount: 108,
    isDefault: true,
    createdAt: new Date(2026, 0, 1).toISOString(),
  },
  {
    id: 'tablet-default-cau-an',
    mode: 'CAU_AN',
    fullName: 'Song Thân Cha Mẹ & Gia Quyến Hiện Tiền',
    relationship: 'Gia Đình',
    prayerWish:
      'Nguyện cầu hồng ân Tam Bảo gia hộ cho song thân và toàn thể gia quyến thân tâm thường an lạc, tật bệnh tiêu trừ, phước huệ tăng trưởng, thiện duyên viên mãn.',
    incenseLit: 24,
    lampsLit: 12,
    mantraCount: 49,
    isDefault: true,
    createdAt: new Date(2026, 0, 1).toISOString(),
  },
];

export const useDharmaStore = create<DharmaState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      dailyLogs: {},
      meritEntries: INITIAL_MERITS,
      memorials: INITIAL_MEMORIALS,
      prayerLamps: INITIAL_LAMPS,
      malaCurrentBead: 0,
      malaCompletedMalas: 0,
      malaLifetimeBeads: 0,
      malaSelectedDeityId: 'a-di-da',
      malaMaterial: 'bo-de',
      malaSize: 108,
      malaDailyTargetRounds: 1,
      bookmarkedVerseIds: [1, 5],
      bookmarkedArticleSlugs: [],
      bookmarkedSutraIds: ['bat-nha-tam-kinh'],
      visitedPagodaSlugs: [],
      legacyMigrated: false,

      templeIncenseCount: 3,
      templeProstrationsCount: 3,
      templeOfferingsCount: 1,
      templeFortuneHistory: [],
      spiritTablets: INITIAL_SPIRIT_TABLETS,
      chantMachineTrackId: 'a-di-da-6',
      chantMachineCount: 0,
      chantMachineSpeed: 'medium',
      downloadedAudioIds: [],
      audioPositions: {},
      bellStrikesCount: 0,

      updateProfile: (patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        })),

      toggleTimePeriod: (period, dateKey = getTodayDateKey()) =>
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          const nextValue = !existing[period];
          const updatedLog: DailyPracticeLog = {
            ...existing,
            [period]: nextValue,
          };

          const meritEntries = nextValue
            ? [
                {
                  id: makeId('merit'),
                  timestamp: new Date().toISOString(),
                  category: 'TUNG_KINH' as MeritCategory,
                  title: `Hoàn mãn ${DAILY_PERIOD_LABELS[period]}`,
                  dedicationText: 'Nguyện đem công đức thời khóa hôm nay hồi hướng pháp giới chúng sinh đồng thành Phật đạo.',
                },
                ...state.meritEntries,
              ].slice(0, 120)
            : state.meritEntries;

          return {
            dailyLogs: { ...state.dailyLogs, [dateKey]: updatedLog },
            meritEntries,
          };
        }),

      togglePrecept: (precept, dateKey = getTodayDateKey()) =>
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                [precept]: !existing[precept],
              },
            },
          };
        }),

      updateReflectionNote: (note, dateKey = getTodayDateKey()) =>
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                reflectionNote: note,
              },
            },
          };
        }),

      addMeditationMinutes: (mins, label) => {
        if (mins <= 0) return;
        const dateKey = getTodayDateKey();
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                meditationMins: existing.meditationMins + mins,
              },
            },
            meritEntries: [
              {
                id: makeId('merit'),
                timestamp: new Date().toISOString(),
                category: 'TOA_THIEN' as MeritCategory,
                title: label || `Tọa thiền Anapanasati (${mins} phút)`,
                dedicationText: 'Nguyện cho thân tâm khinh an, chánh niệm vững bền, trí tuệ Bát Nhã phát sinh.',
              },
              ...state.meritEntries,
            ].slice(0, 120),
          };
        });
      },

      incrementMalaBead: (step = 1, deityName, customSize) => {
        let completedFullMala = false;
        const dateKey = getTodayDateKey();
        set((state) => {
          const roundSize = customSize || state.malaSize || 108;
          const base = state.malaCurrentBead >= roundSize ? 0 : state.malaCurrentBead;
          const rawNext = base + step;
          completedFullMala = rawNext >= roundSize;
          const nextBead = completedFullMala ? roundSize : rawNext;
          const nextCompleted = state.malaCompletedMalas + (completedFullMala ? 1 : 0);
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);

          const meritEntries = completedFullMala
            ? [
                {
                  id: makeId('merit'),
                  timestamp: new Date().toISOString(),
                  category: 'NIEM_PHAT' as MeritCategory,
                  title: `Hoàn mãn ${roundSize} biến niệm ${deityName || 'Danh Hiệu Phật'}`,
                  dedicationText:
                    'Nguyện đem công đức này trang nghiêm Phật Tịnh Độ, trên đền bốn ơn nặng, dưới cứu khổ ba đường.',
                },
                ...state.meritEntries,
              ].slice(0, 120)
            : state.meritEntries;

          return {
            malaCurrentBead: nextBead,
            malaCompletedMalas: nextCompleted,
            malaLifetimeBeads: state.malaLifetimeBeads + step,
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                malaBeadsCount: existing.malaBeadsCount + step,
              },
            },
            meritEntries,
          };
        });
        return { completedFullMala };
      },

      resetMalaCurrentBead: () => set({ malaCurrentBead: 0 }),

      setMalaSelectedDeity: (deityId) => set({ malaSelectedDeityId: deityId }),

      setMalaCustomization: (patch) =>
        set((state) => ({
          malaMaterial: patch.malaMaterial ?? state.malaMaterial,
          malaSize: patch.malaSize ?? state.malaSize,
          malaDailyTargetRounds: patch.malaDailyTargetRounds ?? state.malaDailyTargetRounds,
          malaCurrentBead:
            patch.malaSize && patch.malaSize !== state.malaSize ? 0 : state.malaCurrentBead,
        })),

      incrementWoodfishCount: (delta = 1) => {
        const dateKey = getTodayDateKey();
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                woodfishCount: (existing.woodfishCount || 0) + delta,
              },
            },
          };
        });
      },

      incrementBellStrikes: (delta = 1, ritualLabel) =>
        set((state) => ({
          bellStrikesCount: (state.bellStrikesCount || 0) + delta,
          meritEntries: ritualLabel
            ? [
                {
                  id: makeId('merit'),
                  timestamp: new Date().toISOString(),
                  category: 'TUNG_KINH' as MeritCategory,
                  title: ritualLabel,
                  dedicationText:
                    'Tiếng chuông mõ nhiếp tâm thanh tịnh, nguyện pháp âm lan tỏa an lạc khắp mười phương.',
                },
                ...state.meritEntries,
              ].slice(0, 120)
            : state.meritEntries,
        })),

      recordTempleIncense: () =>
        set((state) => ({
          templeIncenseCount: (state.templeIncenseCount || 0) + 1,
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'HUONG_DANG' as MeritCategory,
              title: 'Dâng 3 nén hương tâm thành tại Chánh Điện',
              dedicationText:
                'Nguyện đem lòng thành kính gửi theo đám mây hương, cầu Tam Bảo chứng minh gia đạo bình an.',
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      recordTempleProstrationCycle: (bows = 3) =>
        set((state) => ({
          templeProstrationsCount: (state.templeProstrationsCount || 0) + bows,
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'HUONG_DANG' as MeritCategory,
              title: `Đảnh Lễ Tam Bảo (${bows} lạy Quy Y Phật - Pháp - Tăng)`,
              dedicationText:
                'Con xin thành tâm đảnh lễ mười phương Chư Phật, nguyện tiêu trừ ngã mạn, tăng trưởng từ bi.',
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      recordTempleOffering: (kind) =>
        set((state) => ({
          templeOfferingsCount: (state.templeOfferingsCount || 0) + 1,
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'HUONG_DANG' as MeritCategory,
              title:
                kind === 'hoa-sen'
                  ? 'Dâng Hoa Sen Thanh Tịnh cúng dường Phật Đài'
                  : 'Dâng Nước Tịnh Thủy gội rửa tâm trần',
              dedicationText:
                kind === 'hoa-sen'
                  ? 'Hoa sen trong bùn chẳng nhiễm, nguyện giữ tâm thanh khiết giữa đời thường.'
                  : 'Nước trong lắng đọng, nguyện rửa sạch phiền não tham sân si.',
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      recordFortuneDraw: (item) =>
        set((state) => ({
          templeFortuneHistory: [
            {
              ...item,
              id: makeId('fortune'),
              dateKey: getTodayDateKey(),
            },
            ...(state.templeFortuneHistory || []),
          ].slice(0, 30),
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'TUNG_KINH' as MeritCategory,
              title: `Thỉnh Quẻ Pháp Cú: ${item.verseNumber}`,
              dedicationText: item.guidance,
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      addSpiritTablet: (tablet) => {
        const id = makeId('tablet');
        set((state) => ({
          spiritTablets: [
            {
              ...tablet,
              id,
              incenseLit: 1,
              lampsLit: 1,
              mantraCount: 0,
              createdAt: new Date().toISOString(),
            },
            ...(state.spiritTablets || INITIAL_SPIRIT_TABLETS),
          ],
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'HUONG_DANG' as MeritCategory,
              title:
                tablet.mode === 'CAU_SIEU'
                  ? `Lập Linh Vị Cầu Siêu: ${tablet.fullName}`
                  : `Lập Bài Vị Cầu An: ${tablet.fullName}`,
              dedicationText: tablet.prayerWish,
              targetName: tablet.fullName,
            },
            ...state.meritEntries,
          ].slice(0, 120),
        }));
        return id;
      },

      deleteSpiritTablet: (id) =>
        set((state) => ({
          spiritTablets: (state.spiritTablets || []).filter((t) => t.id !== id || t.isDefault),
        })),

      lightSpiritTabletOffering: (id, kind) =>
        set((state) => {
          const list = state.spiritTablets || INITIAL_SPIRIT_TABLETS;
          const target = list.find((t) => t.id === id);
          const spiritTablets = list.map((t) =>
            t.id === id
              ? {
                  ...t,
                  incenseLit: t.incenseLit + (kind === 'incense' ? 1 : 0),
                  lampsLit: t.lampsLit + (kind === 'lamp' ? 1 : 0),
                }
              : t
          );
          const meritEntries = target
            ? [
                {
                  id: makeId('merit'),
                  timestamp: new Date().toISOString(),
                  category: 'HUONG_DANG' as MeritCategory,
                  title:
                    kind === 'incense'
                      ? `Thắp nén tâm hương lên ${target.mode === 'CAU_SIEU' ? 'Linh vị' : 'Bài vị'}: ${target.fullName}`
                      : `Thắp đèn Liên Hoa hồi hướng: ${target.fullName}`,
                  dedicationText: target.prayerWish,
                  targetName: target.fullName,
                },
                ...state.meritEntries,
              ].slice(0, 120)
            : state.meritEntries;
          return { spiritTablets, meritEntries };
        }),

      incrementSpiritTabletMantra: (id, delta, dedicationTitle) =>
        set((state) => {
          const list = state.spiritTablets || INITIAL_SPIRIT_TABLETS;
          const target = list.find((t) => t.id === id);
          const prevCount = target?.mantraCount || 0;
          const nextCount = prevCount + delta;
          const crossed21 = Math.floor(nextCount / 21) > Math.floor(prevCount / 21);
          const spiritTablets = list.map((t) =>
            t.id === id ? { ...t, mantraCount: t.mantraCount + delta } : t
          );
          const meritEntries =
            target && (crossed21 || dedicationTitle)
              ? [
                  {
                    id: makeId('merit'),
                    timestamp: new Date().toISOString(),
                    category: 'NIEM_PHAT' as MeritCategory,
                    title:
                      dedicationTitle ||
                      `Hồi hướng 21 biến Chân Ngôn cho ${target.fullName}`,
                    dedicationText: target.prayerWish,
                    targetName: target.fullName,
                  },
                  ...state.meritEntries,
                ].slice(0, 120)
              : state.meritEntries;
          return { spiritTablets, meritEntries };
        }),

      setChantMachineTrack: (trackId) => set({ chantMachineTrackId: trackId }),

      setChantMachineSpeed: (speed) => set({ chantMachineSpeed: speed }),

      incrementChantMachineCount: (trackTitle) =>
        set((state) => {
          const nextCount = (state.chantMachineCount || 0) + 1;
          const isMilestone = nextCount % 108 === 0;
          return {
            chantMachineCount: nextCount,
            meritEntries: isMilestone
              ? [
                  {
                    id: makeId('merit'),
                    timestamp: new Date().toISOString(),
                    category: 'NIEM_PHAT' as MeritCategory,
                    title: `Máy Niệm Phật đạt mốc ${nextCount} biến: ${trackTitle}`,
                    dedicationText:
                      'Nam Mô A Di Đà Phật, nguyện tiếng niệm Phật nối liền không dứt, tâm bình khí hòa.',
                  },
                  ...state.meritEntries,
                ].slice(0, 120)
              : state.meritEntries,
          };
        }),

      setAudioDownloaded: (trackId, downloaded) =>
        set((state) => {
          const prev = state.downloadedAudioIds || [];
          const next = downloaded
            ? Array.from(new Set([...prev, trackId]))
            : prev.filter((id) => id !== trackId);
          return { downloadedAudioIds: next };
        }),

      saveAudioPosition: (trackId, seconds) =>
        set((state) => ({
          audioPositions: {
            ...(state.audioPositions || {}),
            [trackId]: Math.max(0, Math.floor(seconds)),
          },
        })),

      recordSutraCompletion: (sutraTitle, dedicationText) => {
        const dateKey = getTodayDateKey();
        set((state) => {
          const existing = state.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [dateKey]: {
                ...existing,
                sutrasReadCount: existing.sutrasReadCount + 1,
              },
            },
            meritEntries: [
              {
                id: makeId('merit'),
                timestamp: new Date().toISOString(),
                category: 'TUNG_KINH' as MeritCategory,
                title: `Hoàn mãn thời kinh: ${sutraTitle}`,
                dedicationText:
                  dedicationText ||
                  'Nguyện đem công đức này hồi hướng khắp tất cả đệ tử và chúng sinh đều trọn thành Phật đạo.',
              },
              ...state.meritEntries,
            ].slice(0, 120),
          };
        });
      },

      addMeritEntry: (entry) =>
        set((state) => ({
          meritEntries: [
            {
              ...entry,
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      addPrayerLamp: (lamp) =>
        set((state) => ({
          prayerLamps: [
            {
              ...lamp,
              id: makeId('lamp'),
              createdAt: new Date().toISOString(),
            },
            ...state.prayerLamps,
          ].slice(0, 80),
          meritEntries: [
            {
              id: makeId('merit'),
              timestamp: new Date().toISOString(),
              category: 'HUONG_DANG' as MeritCategory,
              title:
                lamp.type === 'CAU_AN'
                  ? `Thắp Hoa Đăng Cầu An cho ${lamp.recipientName}`
                  : `Thắp Hoa Đăng Cầu Siêu cho ${lamp.recipientName}`,
              dedicationText: lamp.wishContent,
              targetName: lamp.recipientName,
            },
            ...state.meritEntries,
          ].slice(0, 120),
        })),

      addMemorial: (memorial) =>
        set((state) => ({
          memorials: [
            ...state.memorials,
            {
              ...memorial,
              id: makeId('mem'),
              incenseCount: 0,
            },
          ],
        })),

      updateMemorial: (id, patch) =>
        set((state) => ({
          memorials: state.memorials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteMemorial: (id) =>
        set((state) => ({
          memorials: state.memorials.filter((m) => m.id !== id),
        })),

      lightIncenseForMemorial: (id) =>
        set((state) => {
          const target = state.memorials.find((m) => m.id === id);
          const memorials = state.memorials.map((m) =>
            m.id === id ? { ...m, incenseCount: (m.incenseCount || 0) + 1 } : m
          );
          const meritEntries = target
            ? [
                {
                  id: makeId('merit'),
                  timestamp: new Date().toISOString(),
                  category: 'HUONG_DANG' as MeritCategory,
                  title: `Thắp hương tưởng niệm ${target.relationship} — ${target.fullName}`,
                  dedicationText: 'Nam Mô Tiếp Dẫn Đạo Sư A Di Đà Phật, nguyện hương linh sớm sanh Tịnh Cảnh.',
                  targetName: target.fullName,
                },
                ...state.meritEntries,
              ].slice(0, 120)
            : state.meritEntries;

          return { memorials, meritEntries };
        }),

      toggleVerseBookmark: (verseId) =>
        set((state) => {
          const exists = state.bookmarkedVerseIds.includes(verseId);
          return {
            bookmarkedVerseIds: exists
              ? state.bookmarkedVerseIds.filter((id) => id !== verseId)
              : [...state.bookmarkedVerseIds, verseId],
          };
        }),

      toggleArticleBookmark: (slug) =>
        set((state) => {
          const exists = state.bookmarkedArticleSlugs.includes(slug);
          return {
            bookmarkedArticleSlugs: exists
              ? state.bookmarkedArticleSlugs.filter((s) => s !== slug)
              : [...state.bookmarkedArticleSlugs, slug],
          };
        }),

      toggleSutraBookmark: (sutraId) =>
        set((state) => {
          const exists = state.bookmarkedSutraIds.includes(sutraId);
          return {
            bookmarkedSutraIds: exists
              ? state.bookmarkedSutraIds.filter((id) => id !== sutraId)
              : [...state.bookmarkedSutraIds, sutraId],
          };
        }),

      togglePagodaCheckin: (slug, pagodaName) => {
        const exists = get().visitedPagodaSlugs.includes(slug);
        set((state) => ({
          visitedPagodaSlugs: exists
            ? state.visitedPagodaSlugs.filter((s) => s !== slug)
            : [...state.visitedPagodaSlugs, slug],
          meritEntries:
            !exists && pagodaName
              ? [
                  {
                    id: makeId('merit'),
                    timestamp: new Date().toISOString(),
                    category: 'HUONG_DANG' as MeritCategory,
                    title: `Đảnh lễ & Ghi dấu hành hương tại ${pagodaName}`,
                    dedicationText: 'Nguyện Tam Bảo thường trụ hộ trì cho bản thân và gia quyến luôn an lạc tinh tấn.',
                  },
                  ...state.meritEntries,
                ].slice(0, 120)
              : state.meritEntries,
        }));
        return !exists;
      },

      migrateLegacyIfNeeded: () => {
        if (typeof window === 'undefined' || get().legacyMigrated) return;
        try {
          const dateKey = getTodayDateKey();
          const curState = get();
          const curLog = curState.dailyLogs[dateKey] || createEmptyDailyLog(dateKey);
          const nextProfile = { ...curState.profile };
          let logChanged = false;
          let profileChanged = false;

          const legacyMotto = localStorage.getItem('phatphap_user_motto');
          const legacyTemple = localStorage.getItem('phatphap_refuge_temple');
          const legacyMaster = localStorage.getItem('phatphap_master_name');
          if (legacyMotto && legacyMotto.trim()) {
            nextProfile.vowText = legacyMotto.trim();
            profileChanged = true;
          }
          if (legacyTemple && legacyTemple.trim()) {
            nextProfile.refugeTemple = legacyTemple.trim();
            profileChanged = true;
          }
          if (legacyMaster && legacyMaster.trim()) {
            nextProfile.masterName = legacyMaster.trim();
            profileChanged = true;
          }

          const legacyPeriodsRaw = localStorage.getItem('phatphap_dharma_daily_periods');
          if (legacyPeriodsRaw) {
            const parsed = JSON.parse(legacyPeriodsRaw);
            if (Array.isArray(parsed)) {
              if (parsed.includes('morning')) {
                curLog.thoiSang = true;
                logChanged = true;
              }
              if (parsed.includes('noon')) {
                curLog.thoiChieu = true;
                logChanged = true;
              }
              if (parsed.includes('evening')) {
                curLog.thoiToi = true;
                logChanged = true;
              }
            }
          }

          const legacyPreceptsRaw = localStorage.getItem('phatphap_dharma_precepts_checked_v1');
          if (legacyPreceptsRaw) {
            const pIds = JSON.parse(legacyPreceptsRaw);
            if (Array.isArray(pIds)) {
              curLog.precept1NoKill = pIds.includes('precept-1');
              curLog.precept2NoSteal = pIds.includes('precept-2');
              curLog.precept3Chaste = pIds.includes('precept-3');
              curLog.precept4Truth = pIds.includes('precept-4');
              curLog.precept5Sober = pIds.includes('precept-5');
              logChanged = true;
            }
          }

          set({
            legacyMigrated: true,
            ...(profileChanged ? { profile: nextProfile } : {}),
            ...(logChanged ? { dailyLogs: { ...curState.dailyLogs, [dateKey]: curLog } } : {}),
          });
        } catch {
          set({ legacyMigrated: true });
        }
      },

      exportBackupJson: () => {
        const s = get();
        const payload = {
          app: 'DHARMA_WEBAPP_BACKUP',
          version: 1,
          exportedAt: new Date().toISOString(),
          data: {
            profile: s.profile,
            dailyLogs: s.dailyLogs,
            meritEntries: s.meritEntries,
            memorials: s.memorials,
            prayerLamps: s.prayerLamps,
            malaCurrentBead: s.malaCurrentBead,
            malaCompletedMalas: s.malaCompletedMalas,
            malaLifetimeBeads: s.malaLifetimeBeads,
            malaSelectedDeityId: s.malaSelectedDeityId,
            bookmarkedVerseIds: s.bookmarkedVerseIds,
            bookmarkedArticleSlugs: s.bookmarkedArticleSlugs,
            bookmarkedSutraIds: s.bookmarkedSutraIds,
            visitedPagodaSlugs: s.visitedPagodaSlugs,
          },
        };
        return JSON.stringify(payload, null, 2);
      },

      importBackupJson: (rawJson) => {
        try {
          const parsed = JSON.parse(rawJson);
          const data = parsed?.data || parsed;
          if (!data || typeof data !== 'object' || !data.profile) {
            return { ok: false, error: 'Tệp JSON không đúng định dạng sao lưu DHARMA.' };
          }
          set((state) => ({
            profile: { ...state.profile, ...data.profile },
            dailyLogs: data.dailyLogs && typeof data.dailyLogs === 'object' ? data.dailyLogs : state.dailyLogs,
            meritEntries: Array.isArray(data.meritEntries) ? data.meritEntries : state.meritEntries,
            memorials: Array.isArray(data.memorials) ? data.memorials : state.memorials,
            prayerLamps: Array.isArray(data.prayerLamps) ? data.prayerLamps : state.prayerLamps,
            malaCurrentBead: typeof data.malaCurrentBead === 'number' ? data.malaCurrentBead : state.malaCurrentBead,
            malaCompletedMalas:
              typeof data.malaCompletedMalas === 'number' ? data.malaCompletedMalas : state.malaCompletedMalas,
            malaLifetimeBeads:
              typeof data.malaLifetimeBeads === 'number' ? data.malaLifetimeBeads : state.malaLifetimeBeads,
            malaSelectedDeityId:
              typeof data.malaSelectedDeityId === 'string' ? data.malaSelectedDeityId : state.malaSelectedDeityId,
            bookmarkedVerseIds: Array.isArray(data.bookmarkedVerseIds)
              ? data.bookmarkedVerseIds
              : state.bookmarkedVerseIds,
            bookmarkedArticleSlugs: Array.isArray(data.bookmarkedArticleSlugs)
              ? data.bookmarkedArticleSlugs
              : state.bookmarkedArticleSlugs,
            bookmarkedSutraIds: Array.isArray(data.bookmarkedSutraIds)
              ? data.bookmarkedSutraIds
              : state.bookmarkedSutraIds,
            visitedPagodaSlugs: Array.isArray(data.visitedPagodaSlugs)
              ? data.visitedPagodaSlugs
              : state.visitedPagodaSlugs,
          }));
          return { ok: true };
        } catch {
          return { ok: false, error: 'Không thể đọc tệp JSON. Vui lòng kiểm tra lại.' };
        }
      },
    }),
    {
      name: 'dharma_app_store_v3',
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          if (typeof window === 'undefined') return null;
          try {
            const res = await fetch(`/api/dharma/sync?resource=kv&key=${encodeURIComponent(name)}`, {
              cache: 'no-store',
            });
            if (res.ok) {
              const data = await res.json();
              if (data.ok && data.payload && Object.keys(data.payload).length > 0) {
                const payload = data.payload as { state?: { profile?: Record<string, unknown> } };
                const cookieState = readDeviceAuthCookie();
                if (payload?.state?.profile) {
                  if (cookieState?.onboarded) {
                    payload.state.profile = {
                      ...payload.state.profile,
                      dharmaName: cookieState.dharmaName,
                      fullName: cookieState.dharmaName,
                      avatarUrl: cookieState.avatarUrl,
                    };
                  } else {
                    payload.state.profile = {
                      ...payload.state.profile,
                      dharmaName: DEFAULT_DHARMA_NAME,
                      fullName: DEFAULT_DHARMA_NAME,
                      avatarUrl: DEFAULT_DHARMA_AVATAR,
                    };
                  }
                }
                return JSON.stringify(payload);
              }
            }
          } catch {
            // fallback if offline during initial boot
          }
          return null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
          if (typeof window === 'undefined') return;
          try {
            const parsed = JSON.parse(value);
            await fetch('/api/dharma/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resource: 'kv',
                key: name,
                payload: parsed,
              }),
            });
          } catch {
            // ignore network transient error
          }
        },
        removeItem: async (name: string): Promise<void> => {
          if (typeof window === 'undefined') return;
          try {
            await fetch('/api/dharma/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resource: 'kv',
                key: name,
                payload: {},
              }),
            });
          } catch {
            // ignore
          }
        },
      })),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<DharmaState>) || {};
        return {
          ...currentState,
          ...persisted,
          spiritTablets:
            Array.isArray(persisted.spiritTablets) && persisted.spiritTablets.length > 0
              ? persisted.spiritTablets
              : currentState.spiritTablets,
          templeFortuneHistory: Array.isArray(persisted.templeFortuneHistory)
            ? persisted.templeFortuneHistory
            : currentState.templeFortuneHistory,
          downloadedAudioIds: Array.isArray(persisted.downloadedAudioIds)
            ? persisted.downloadedAudioIds
            : currentState.downloadedAudioIds,
          audioPositions:
            persisted.audioPositions && typeof persisted.audioPositions === 'object'
              ? persisted.audioPositions
              : currentState.audioPositions,
        };
      },
      partialize: (state) => ({
        profile: state.profile,
        dailyLogs: state.dailyLogs,
        meritEntries: state.meritEntries,
        memorials: state.memorials,
        prayerLamps: state.prayerLamps,
        malaCurrentBead: state.malaCurrentBead,
        malaCompletedMalas: state.malaCompletedMalas,
        malaLifetimeBeads: state.malaLifetimeBeads,
        malaSelectedDeityId: state.malaSelectedDeityId,
        malaMaterial: state.malaMaterial,
        malaSize: state.malaSize,
        malaDailyTargetRounds: state.malaDailyTargetRounds,
        bookmarkedVerseIds: state.bookmarkedVerseIds,
        bookmarkedArticleSlugs: state.bookmarkedArticleSlugs,
        bookmarkedSutraIds: state.bookmarkedSutraIds,
        visitedPagodaSlugs: state.visitedPagodaSlugs,
        legacyMigrated: state.legacyMigrated,
        templeIncenseCount: state.templeIncenseCount,
        templeProstrationsCount: state.templeProstrationsCount,
        templeOfferingsCount: state.templeOfferingsCount,
        templeFortuneHistory: state.templeFortuneHistory,
        spiritTablets: state.spiritTablets,
        chantMachineTrackId: state.chantMachineTrackId,
        chantMachineCount: state.chantMachineCount,
        chantMachineSpeed: state.chantMachineSpeed,
        downloadedAudioIds: state.downloadedAudioIds,
        audioPositions: state.audioPositions,
        bellStrikesCount: state.bellStrikesCount,
      }),
    }
  )
);

export const useDharmaPracticeStore = useDharmaStore;

