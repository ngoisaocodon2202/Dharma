import { create } from 'zustand';
import {
  DEFAULT_PLAYER_MAT,
  HALL_SERVERS,
  INITIAL_LEADERBOARD,
  INITIAL_PRAYER_WALL,
  type AmbientModeId,
  type GenderId,
  type GraphicsQualityId,
  type HallId,
  type LeaderboardEntry,
  type PrayerWallEntry,
  type RobeColorId,
  type WeatherModeId,
} from './templeData';

export interface FloatingLanternItem {
  id: string;
  author: string;
  wish: string;
  color: string;
  x: number;
  z: number;
  createdAt: number;
}

export type ActiveTempleModal = null | 'server' | 'leaderboard' | 'sutra' | 'mala' | 'prayer';

export type CameraCommandType =
  | null
  | { type: 'zoom_in'; nonce: number }
  | { type: 'zoom_out'; nonce: number }
  | { type: 'toggle_overview'; nonce: number }
  | { type: 'reset'; nonce: number };

export interface JoyVector {
  x: number;
  y: number;
}

function resolveClockSlot(): 'morning' | 'noon' | 'afternoon' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 15) return 'noon';
  if (hour >= 15 && hour < 18) return 'afternoon';
  return 'night';
}

export interface TempleState {
  // Practitioner profile
  name: string;
  gender: GenderId;
  robe: RobeColorId;
  serverId: HallId;
  serverOnlineCounts: Record<HallId, number>;
  colyseusConnected: boolean;
  colyseusUrl: string;

  // Audio, graphics & atmosphere
  soundEnabled: boolean;
  ambientMode: AmbientModeId;
  weatherMode: WeatherModeId;
  realTempC: number;
  realIsRaining: boolean;
  realTimeSlot: 'morning' | 'noon' | 'afternoon' | 'night';
  graphicsQuality: GraphicsQualityId;

  // Practice metrics & social
  meditationSeconds: number;
  bowCount: number;
  malaSessionCount: number;
  totalMalaBeads: number;
  lanternIncenseCount: number;
  rejoiceGiven: number;
  rejoicedIds: Record<string, boolean>;
  leaderboard: LeaderboardEntry[];
  prayerWall: PrayerWallEntry[];
  floatingLanterns: FloatingLanternItem[];

  // UI overlays & 3D avatar movement state
  isOnboardingOpen: boolean;
  activeModal: ActiveTempleModal;
  presenceOpen: boolean;
  overviewActive: boolean;
  toastText: string | null;
  toastNonce: number;
  worldPromptText: string;
  worldPromptAction: 'sutra' | 'bell' | null;
  cameraCommand: CameraCommandType;

  // Avatar target / actions
  avatarPos: [number, number, number];
  avatarPosture: 'kneel' | 'bow' | 'walk' | 'pond';
  avatarJumpNonce: number;
  bellSwingNonce: number;
  incenseBurstNonce: number;
  joystickVector: JoyVector;

  // Actions
  setProfile: (payload: { name?: string; gender?: GenderId; robe?: RobeColorId; serverId?: HallId }) => void;
  setServerId: (id: HallId) => void;
  setColyseusUrl: (url: string) => void;
  setOnboardingOpen: (open: boolean) => void;
  setActiveModal: (modal: ActiveTempleModal) => void;
  setPresenceOpen: (open: boolean) => void;
  setSoundEnabled: (on: boolean) => void;
  setAmbientMode: (mode: AmbientModeId) => void;
  setWeatherMode: (mode: WeatherModeId) => void;
  cycleWeatherMode: () => void;
  cycleGraphicsQuality: () => void;
  setRealWeatherData: (tempC: number, isRaining: boolean) => void;
  refreshRealTimeSlot: () => void;

  showToast: (text: string) => void;
  triggerBell: () => void;
  performBow: () => void;
  incrementMalaBead: (delta: number) => void;
  resetMalaSession: () => void;
  prepareLanternWalk: () => void;
  releaseLantern: (wish: string, color: string) => void;
  rejoicePractitioner: (id: string) => void;
  addPrayerWallNote: (text: string) => void;
  toggleBlessPrayer: (id: string) => void;
  tickMeditationSecond: () => void;

  setJoystickVector: (vec: JoyVector) => void;
  triggerJump: () => void;
  setAvatarPos: (pos: [number, number, number], posture?: 'kneel' | 'bow' | 'walk' | 'pond') => void;
  setWorldPrompt: (text: string, action: 'sutra' | 'bell' | null) => void;
  issueCameraCommand: (type: 'zoom_in' | 'zoom_out' | 'toggle_overview' | 'reset') => void;
}

const initialLanternSeed: FloatingLanternItem[] = [
  {
    id: 'seed-l-1',
    author: 'Minh An',
    wish: 'Nguyện cầu muôn loài an lành thanh tịnh',
    color: '#D9A441',
    x: 15.6,
    z: -1.5,
    createdAt: Date.now() - 360000,
  },
  {
    id: 'seed-l-2',
    author: 'Tịnh Liên',
    wish: 'Gia đạo bình an phước huệ song tu',
    color: '#E879A0',
    x: -15.4,
    z: 1.2,
    createdAt: Date.now() - 240000,
  },
];

export const useTempleStore = create<TempleState>((set, get) => ({
  name: 'Dharma',
  gender: 'male',
  robe: 'lam',
  serverId: 'main-hall',
  serverOnlineCounts: {
    'main-hall': HALL_SERVERS[0].online,
    'lotus-hall': HALL_SERVERS[1].online,
    'zen-hall': HALL_SERVERS[2].online,
  },
  colyseusConnected: false,
  colyseusUrl: 'ws://localhost:2567',

  soundEnabled: true,
  ambientMode: 'singing_bowl',
  weatherMode: 'realtime',
  realTempC: 31,
  realIsRaining: false,
  realTimeSlot: resolveClockSlot(),
  graphicsQuality: 'high',

  meditationSeconds: 360,
  bowCount: 0,
  malaSessionCount: 0,
  totalMalaBeads: 0,
  lanternIncenseCount: 2,
  rejoiceGiven: 8,
  rejoicedIds: {},
  leaderboard: INITIAL_LEADERBOARD,
  prayerWall: INITIAL_PRAYER_WALL,
  floatingLanterns: initialLanternSeed,

  isOnboardingOpen: true,
  activeModal: null,
  presenceOpen: false,
  overviewActive: false,
  toastText: null,
  toastNonce: 0,
  worldPromptText: 'Mở Sách Đọc Kinh',
  worldPromptAction: 'sutra',
  cameraCommand: null,

  avatarPos: [DEFAULT_PLAYER_MAT.x, 0, DEFAULT_PLAYER_MAT.z],
  avatarPosture: 'kneel',
  avatarJumpNonce: 0,
  bellSwingNonce: 0,
  incenseBurstNonce: 0,
  joystickVector: { x: 0, y: 0 },

  setProfile: (payload) =>
    set((s) => {
      const nextServer = payload.serverId ?? s.serverId;
      const counts = { ...s.serverOnlineCounts };
      if (payload.serverId && payload.serverId !== s.serverId) {
        counts[s.serverId] = Math.max(0, counts[s.serverId] - 1);
        counts[payload.serverId] = Math.min(100, counts[payload.serverId] + 1);
      }
      return {
        name: payload.name !== undefined ? payload.name : s.name,
        gender: payload.gender !== undefined ? payload.gender : s.gender,
        robe: payload.robe !== undefined ? payload.robe : s.robe,
        serverId: nextServer,
        serverOnlineCounts: counts,
      };
    }),

  setServerId: (id) =>
    set((s) => {
      if (id === s.serverId) return {};
      const counts = { ...s.serverOnlineCounts };
      counts[s.serverId] = Math.max(0, counts[s.serverId] - 1);
      counts[id] = Math.min(100, counts[id] + 1);
      return { serverId: id, serverOnlineCounts: counts };
    }),

  setColyseusUrl: (colyseusUrl) => set({ colyseusUrl }),
  setOnboardingOpen: (isOnboardingOpen) => set({ isOnboardingOpen }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setPresenceOpen: (presenceOpen) => set({ presenceOpen }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setAmbientMode: (ambientMode) => set({ ambientMode, soundEnabled: ambientMode !== 'silent' }),
  setWeatherMode: (weatherMode) => set({ weatherMode }),

  cycleWeatherMode: () =>
    set((s) => {
      const order: WeatherModeId[] = ['morning', 'noon', 'afternoon', 'night', 'rain'];
      const currIdx = order.indexOf(s.weatherMode);
      const next = order[(currIdx + 1) % order.length];
      return { weatherMode: next };
    }),

  cycleGraphicsQuality: () =>
    set((s) => {
      const order: GraphicsQualityId[] = ['high', 'medium', 'low'];
      return { graphicsQuality: order[(order.indexOf(s.graphicsQuality) + 1) % order.length] };
    }),

  setRealWeatherData: (realTempC, realIsRaining) =>
    set({ realTempC, realIsRaining, realTimeSlot: resolveClockSlot() }),

  refreshRealTimeSlot: () => set({ realTimeSlot: resolveClockSlot() }),

  showToast: (toastText) =>
    set((s) => ({
      toastText,
      toastNonce: s.toastNonce + 1,
    })),

  triggerBell: () =>
    set((s) => ({
      bellSwingNonce: s.bellSwingNonce + 1,
      toastText: `Tiếng Đại Hồng Chung ngân vang · ${s.name.trim() || 'Dharma'} kính lễ`,
      toastNonce: s.toastNonce + 1,
    })),

  performBow: () =>
    set((s) => ({
      bowCount: s.bowCount + 1,
      avatarPosture: 'bow',
      incenseBurstNonce: s.incenseBurstNonce + 1,
      toastText: 'Đảnh lễ hoàn mãn · Nguyện cầu bình an, phước huệ trang nghiêm',
      toastNonce: s.toastNonce + 1,
    })),

  incrementMalaBead: (delta) =>
    set((s) => {
      const nextSession = Math.max(0, Math.min(108, s.malaSessionCount + delta));
      const added = Math.max(0, delta);
      return {
        malaSessionCount: nextSession,
        totalMalaBeads: s.totalMalaBeads + added,
      };
    }),

  resetMalaSession: () => set({ malaSessionCount: 0 }),

  prepareLanternWalk: () =>
    set((s) => ({
      avatarPos: [11.6, 0, 2.2],
      avatarPosture: 'pond',
      toastText: 'Đang bước ra hiên bên phải để thả hoa đăng xuống hồ sen...',
      toastNonce: s.toastNonce + 1,
    })),

  releaseLantern: (wish, color) =>
    set((s) => {
      const item: FloatingLanternItem = {
        id: `lantern-${Date.now()}`,
        author: s.name.trim() || 'Dharma',
        wish,
        color,
        x: 14.8 + (Math.random() - 0.5) * 3.0,
        z: 1.5 + (Math.random() - 0.5) * 4.5,
        createdAt: Date.now(),
      };
      return {
        floatingLanterns: [...s.floatingLanterns.slice(-24), item],
        lanternIncenseCount: s.lanternIncenseCount + 1,
        toastText: 'Hoa đăng đang được thả xuống hồ sen · Nguyện cầu bình an cho muôn loài',
        toastNonce: s.toastNonce + 1,
      };
    }),

  rejoicePractitioner: (id) =>
    set((s) => {
      if (s.rejoicedIds[id]) return {};
      return {
        rejoicedIds: { ...s.rejoicedIds, [id]: true },
        rejoiceGiven: s.rejoiceGiven + 1,
        leaderboard: s.leaderboard.map((u) =>
          u.id === id ? { ...u, rejoices: u.rejoices + 1, points: u.points + 2 } : u
        ),
      };
    }),

  addPrayerWallNote: (text) =>
    set((s) => {
      const clean = text.trim();
      if (!clean) return {};
      const item: PrayerWallEntry = {
        id: `pw-${Date.now()}`,
        author: s.name.trim() || 'Dharma',
        timeLabel: 'Vừa xong',
        content: clean.startsWith('"') ? clean : `"${clean}"`,
        blessings: 1,
        blessedByMe: true,
      };
      return {
        prayerWall: [item, ...s.prayerWall],
      };
    }),

  toggleBlessPrayer: (id) =>
    set((s) => ({
      prayerWall: s.prayerWall.map((p) =>
        p.id === id && !p.blessedByMe ? { ...p, blessings: p.blessings + 1, blessedByMe: true } : p
      ),
    })),

  tickMeditationSecond: () => set((s) => ({ meditationSeconds: s.meditationSeconds + 1 })),

  setJoystickVector: (joystickVector) => set({ joystickVector }),
  triggerJump: () => set((s) => ({ avatarJumpNonce: s.avatarJumpNonce + 1 })),

  setAvatarPos: (avatarPos, posture) =>
    set((s) => ({
      avatarPos,
      avatarPosture: posture ?? s.avatarPosture,
    })),

  setWorldPrompt: (worldPromptText, worldPromptAction) =>
    set({ worldPromptText, worldPromptAction }),

  issueCameraCommand: (type) =>
    set((s) => ({
      overviewActive: type === 'toggle_overview' ? !s.overviewActive : type === 'reset' ? false : s.overviewActive,
      cameraCommand: { type, nonce: Date.now() + Math.random() },
    })),
}));

export function computeSelfPracticePoints(state: Pick<
  TempleState,
  'meditationSeconds' | 'totalMalaBeads' | 'bowCount' | 'lanternIncenseCount' | 'rejoiceGiven'
>): number {
  const mins = Math.floor(state.meditationSeconds / 60);
  const malaCycles = Math.floor(state.totalMalaBeads / 108);
  return (
    mins +
    state.totalMalaBeads +
    malaCycles * 50 +
    state.bowCount * 5 +
    state.lanternIncenseCount * 10 +
    state.rejoiceGiven * 2
  );
}

