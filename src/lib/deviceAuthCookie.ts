'use client';

export const DEVICE_AUTH_COOKIE_NAME = 'dharma_device_auth';
export const DEVICE_AUTH_STORAGE_KEY = 'phatphap_device_auth_v1';
export const CUSTOM_AVATAR_STORAGE_KEY = 'phatphap_custom_avatar_v1';
export const AUTH_PROFILE_STORAGE_KEY = 'phatphap_dharma_profile';

export const DEFAULT_DHARMA_NAME = 'Dharma';
export const DEFAULT_DHARMA_AVATAR = '/images/dharma-logo.png';

const CUSTOM_AVATAR_COOKIE_SENTINEL = '__custom_local__';
const MAX_COOKIE_AVATAR_LENGTH = 2100;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 năm lưu thiết bị

export interface DharmaPresetAvatar {
  id: string;
  label: string;
  src: string;
}

export const DHARMA_PRESET_AVATARS: DharmaPresetAvatar[] = [
  { id: 'dharma-lotus', label: 'Biểu tượng DHARMA', src: '/images/dharma-logo.png' },
  { id: 'thich-ca', label: 'Phật Thích Ca', src: '/images/buddhas/duc-phat-thich-ca.png' },
  { id: 'quan-am', label: 'Quán Thế Âm', src: '/images/buddhas/quan-the-am-bo-tat.png' },
  { id: 'a-di-da', label: 'Phật A Di Đà', src: '/images/buddhas/duc-phat-a-di-da.png' },
  { id: 'duoc-su', label: 'Phật Dược Sư', src: '/images/buddhas/duc-phat-duoc-su.png' },
  { id: 'di-lac', label: 'Phật Di Lặc', src: '/images/buddhas/phat-di-lac.png' },
  { id: 'dia-tang', label: 'Địa Tạng Vương', src: '/images/buddhas/dia-tang-vuong-bo-tat.png' },
  { id: 'sen-tinh', label: 'Liên Hoa Tịnh Độ', src: '/images/lotus_blooming.jpg' },
  { id: 'thien-dinh', label: 'Thiền Định An Lạc', src: '/images/buddha_meditation.jpg' },
  { id: 'bodhi', label: 'Cội Bồ Đề', src: '/images/buddha_bodhi_tree.png' },
];

export const ONBOARDING_DHARMA_SUGGESTIONS = [
  'Dharma',
  'Tâm An',
  'Minh Tâm',
  'Tịnh Tâm',
  'Diệu Âm',
  'Liên Hoa',
  'Giác Ngộ',
  'Thiện Duyên',
];

export interface DeviceAuthState {
  v: 1;
  onboarded: boolean;
  skipped?: boolean;
  dharmaName: string;
  avatarUrl: string;
  updatedAt: string;
}

export function isSafeAvatarUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('/images/') ||
    trimmed === '/dharma-logo.png' ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  );
}

function readCookieRaw(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${name}=`;
  for (const cookie of cookies) {
    if (cookie.startsWith(prefix)) {
      try {
        return decodeURIComponent(cookie.slice(prefix.length));
      } catch {
        return cookie.slice(prefix.length);
      }
    }
  }
  return null;
}

function resolveAvatarFromState(rawAvatar?: string): string {
  if (rawAvatar === CUSTOM_AVATAR_COOKIE_SENTINEL) {
    try {
      const savedCustom = localStorage.getItem(CUSTOM_AVATAR_STORAGE_KEY);
      if (isSafeAvatarUrl(savedCustom)) return savedCustom!;
    } catch {
      // ignore storage errors
    }
    return DEFAULT_DHARMA_AVATAR;
  }
  if (isSafeAvatarUrl(rawAvatar)) return rawAvatar!.trim();
  return DEFAULT_DHARMA_AVATAR;
}

export function readDeviceAuthCookie(): DeviceAuthState | null {
  if (typeof document === 'undefined') return null;

  const rawCookie = readCookieRaw(DEVICE_AUTH_COOKIE_NAME);
  if (!rawCookie) return null;

  try {
    const parsed = JSON.parse(rawCookie) as Partial<DeviceAuthState>;
    const dharmaName = (parsed.dharmaName || '').trim() || DEFAULT_DHARMA_NAME;
    const avatarUrl = resolveAvatarFromState(parsed.avatarUrl);
    return {
      v: 1,
      onboarded: parsed.onboarded !== false,
      skipped: Boolean(parsed.skipped),
      dharmaName,
      avatarUrl,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function hasDeviceAuthCookie(): boolean {
  return readDeviceAuthCookie() !== null;
}

export interface WriteDeviceAuthInput {
  dharmaName?: string;
  avatarUrl?: string;
  onboarded?: boolean;
  skipped?: boolean;
}

export function writeDeviceAuthCookie(input: WriteDeviceAuthInput): DeviceAuthState {
  const finalName = (input.dharmaName || '').trim() || DEFAULT_DHARMA_NAME;
  const finalAvatar = isSafeAvatarUrl(input.avatarUrl) ? input.avatarUrl!.trim() : DEFAULT_DHARMA_AVATAR;
  const nowIso = new Date().toISOString();

  let cookieAvatar = finalAvatar;
  if (typeof window !== 'undefined') {
    try {
      if (finalAvatar.startsWith('data:image/')) {
        localStorage.setItem(CUSTOM_AVATAR_STORAGE_KEY, finalAvatar);
        if (finalAvatar.length > MAX_COOKIE_AVATAR_LENGTH) {
          cookieAvatar = CUSTOM_AVATAR_COOKIE_SENTINEL;
        }
      } else {
        localStorage.setItem(CUSTOM_AVATAR_STORAGE_KEY, finalAvatar);
      }
    } catch {
      if (finalAvatar.startsWith('data:image/') && finalAvatar.length > MAX_COOKIE_AVATAR_LENGTH) {
        cookieAvatar = DEFAULT_DHARMA_AVATAR;
      }
    }
  }

  const state: DeviceAuthState = {
    v: 1,
    onboarded: input.onboarded !== false,
    skipped: Boolean(input.skipped),
    dharmaName: finalName,
    avatarUrl: finalAvatar,
    updatedAt: nowIso,
  };

  if (typeof document !== 'undefined') {
    const cookiePayload = {
      v: 1,
      onboarded: state.onboarded,
      skipped: state.skipped,
      dharmaName: state.dharmaName,
      avatarUrl: cookieAvatar,
      updatedAt: nowIso,
    };

    const secureSuffix =
      typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

    document.cookie = `${DEVICE_AUTH_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(cookiePayload)
    )}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax${secureSuffix}`;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DEVICE_AUTH_STORAGE_KEY, JSON.stringify(state));

      const rawAuth = localStorage.getItem(AUTH_PROFILE_STORAGE_KEY);
      const existingAuth = rawAuth ? (JSON.parse(rawAuth) as Record<string, unknown>) : {};
      localStorage.setItem(
        AUTH_PROFILE_STORAGE_KEY,
        JSON.stringify({
          ...existingAuth,
          id:
            existingAuth.id ||
            `phattu-${finalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dharma'}`,
          email: existingAuth.email || '',
          role_id: existingAuth.role_id || 'PHAT_TU',
          full_name: finalName,
          dharma_name: finalName,
          avatar_url: finalAvatar,
        })
      );
    } catch {
      // ignore localStorage errors
    }

    try {
      window.dispatchEvent(new CustomEvent<DeviceAuthState>('dharma-device-auth-changed', { detail: state }));
    } catch {
      // ignore event dispatch errors
    }
  }

  return state;
}

export async function resizeAvatarToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP).');
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Không thể đọc dữ liệu ảnh.'));
    };
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Tệp ảnh không hợp lệ hoặc bị hỏng.'));
    el.src = rawDataUrl;
  });

  const renderSquare = (size: number, quality: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawDataUrl;

    const minSide = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height) || size;
    const sx = ((img.naturalWidth || size) - minSide) / 2;
    const sy = ((img.naturalHeight || size) - minSide) / 2;

    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', quality);
  };

  let output = renderSquare(144, 0.78);
  if (output.length > MAX_COOKIE_AVATAR_LENGTH) {
    output = renderSquare(96, 0.58);
  }
  return output;
}
