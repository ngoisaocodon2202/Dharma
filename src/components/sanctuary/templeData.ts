export type RobeColorId = 'lam' | 'song' | 'y';
export type GenderId = 'male' | 'female';
export type HallId = 'main-hall' | 'lotus-hall' | 'zen-hall';
export type WeatherModeId = 'realtime' | 'morning' | 'noon' | 'afternoon' | 'night' | 'rain';
export type AmbientModeId = 'bell_moktak' | 'singing_bowl' | 'rain_chimes' | 'silent';
export type GraphicsQualityId = 'high' | 'medium' | 'low';

export interface RobeOption {
  id: RobeColorId;
  label: string;
  fullName: string;
  hex: string;
  trimHex: string;
}

export const ROBE_OPTIONS: RobeOption[] = [
  { id: 'lam', label: 'Lam', fullName: 'Áo Lam', hex: '#7A8B9E', trimHex: '#5A6B7D' },
  { id: 'song', label: 'Sồng', fullName: 'Nâu Sồng', hex: '#7C4D2B', trimHex: '#5A351B' },
  { id: 'y', label: 'Y', fullName: 'Hoàng Y', hex: '#D98A2B', trimHex: '#B36915' },
];

export interface QuickNameOption {
  name: string;
  gender: GenderId;
}

export const QUICK_NAMES: QuickNameOption[] = [
  { name: 'Diệu Tâm', gender: 'female' },
  { name: 'Minh An', gender: 'male' },
  { name: 'Tịnh Liên', gender: 'female' },
  { name: 'Thiện Đức', gender: 'male' },
  { name: 'An Nhiên', gender: 'female' },
];

export interface HallServerInfo {
  id: HallId;
  code: string;
  name: string;
  shortName: string;
  subtitle: string;
  online: number;
  capacity: number;
}

export const HALL_SERVERS: HallServerInfo[] = [
  {
    id: 'main-hall',
    code: '01',
    name: 'Chánh Điện 01 — Vô Lượng Quang',
    shortName: 'C.Đ 01',
    subtitle: 'Đại Chánh Điện trung tâm · 100 bồ đoàn',
    online: 1,
    capacity: 100,
  },
  {
    id: 'lotus-hall',
    code: '02',
    name: 'Chánh Điện 02 — Diệu Pháp Liên Hoa',
    shortName: 'C.Đ 02',
    subtitle: 'Đạo tràng trang nghiêm · Thanh tịnh an lạc',
    online: 0,
    capacity: 100,
  },
  {
    id: 'zen-hall',
    code: '03',
    name: 'Chánh Điện 03 — Từ Bi Hỷ Xả',
    shortName: 'C.Đ 03',
    subtitle: 'Thiền thất tĩnh mặc · Thích hợp tịnh tâm sâu',
    online: 0,
    capacity: 100,
  },
];

export interface SutraChapter {
  id: string;
  title: string;
  subtitle: string;
  verses: string[];
}

export const SANCTUARY_SUTRAS: SutraChapter[] = [
  {
    id: 'bat-nha',
    title: 'Bát Nhã Tâm Kinh',
    subtitle: 'Kinh Quán Tự Tại Bồ Tát hành thâm Bát Nhã',
    verses: [
      'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.',
      'Xá Lợi Tử! Sắc bất dị không, không bất dị sắc, sắc tức thị không, không tức thị sắc; thọ, tưởng, hành, thức diệc phục như thị.',
      'Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm.',
      'Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp.',
      'Bồ Tát y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại, vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.',
      'Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết: Yết đế yết đế, ba la yết đế, ba la tăng yết đế, bồ đề tát bà ha.',
    ],
  },
  {
    id: 'tu-bi',
    title: 'Kinh Từ Bi',
    subtitle: 'Kinh Rải Tâm Từ Bi An Lành Đến Muôn Loài',
    verses: [
      'Người thiện xảo an tịnh, muốn đạt cảnh giới thanh lương, phải có khả năng, chánh trực, nhu hòa, không kiêu mạn.',
      'Biết đủ, dễ nuôi, ít việc, sống giản dị, các căn lắng dịu, thận trọng và không tham đắm gia đình.',
      'Đừng làm bất cứ điều nhỏ nhặt nào mà bậc trí giả có thể chê trách. Nguyện cho tất cả chúng sanh được an vui và thanh thản.',
      'Bất cứ loài hữu tình nào còn yếu hay đã mạnh, không sót một ai, thấy được hay không thấy được, đang sanh hay sắp sanh, đều được hạnh phúc.',
      'Như mẹ hiền thương con một, dùng cả thân mạng che chở con; cũng vậy, hãy phát khởi tâm từ vô lượng đối với tất cả muôn loài.',
    ],
  },
  {
    id: 'sam-nguyen',
    title: 'Lời Sám Nguyện',
    subtitle: 'Phát Nguyện Sám Hối & Hồi Hướng Công Đức',
    verses: [
      'Xưa con đã tạo bao ác nghiệp, đều bởi vô thủy tham sân si, từ thân miệng ý mà sanh ra, thảy đều xin chí thành sám hối.',
      'Nam Mô Thập Phương Thường Trụ Tam Bảo. Đệ tử xin nương ánh từ quang soi chiếu, dứt trừ phiền não, giữ tâm thanh tịnh an nhiên.',
      'Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo.',
    ],
  },
];

export const MALA_MANTRAS: string[] = [
  'Nam Mô A Di Đà Phật',
  'Nam Mô Quán Thế Âm Bồ Tát',
  'Án Ma Ni Bát Mê Hồng',
  'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
];

export interface LanternColorOption {
  id: string;
  label: string;
  hex: string;
}

export const LANTERN_COLORS: LanternColorOption[] = [
  { id: 'gold', label: 'Hoàng Kim', hex: '#D9A441' },
  { id: 'red', label: 'Đỏ Son', hex: '#C84B31' },
  { id: 'pink', label: 'Hồng Sen', hex: '#E879A0' },
  { id: 'amber', label: 'Hổ Phách', hex: '#E07A2E' },
  { id: 'ivory', label: 'Ngọc Ngà', hex: '#F6D58A' },
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  robe: RobeColorId;
  minutes: number;
  beads: number;
  bows: number;
  lanterns: number;
  points: number;
  rejoices: number;
}

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', name: 'Minh An', robe: 'lam', minutes: 142, beads: 324, bows: 180, lanterns: 34, points: 2480, rejoices: 86 },
  { id: 'u2', name: 'Diệu Đức', robe: 'song', minutes: 115, beads: 216, bows: 145, lanterns: 24, points: 1920, rejoices: 64 },
  { id: 'u3', name: 'Tịnh Liên', robe: 'y', minutes: 90, beads: 108, bows: 120, lanterns: 18, points: 1540, rejoices: 52 },
  { id: 'u4', name: 'Thiện Trí', robe: 'lam', minutes: 68, beads: 108, bows: 90, lanterns: 14, points: 1180, rejoices: 39 },
  { id: 'u5', name: 'An Nhiên', robe: 'song', minutes: 52, beads: 108, bows: 62, lanterns: 10, points: 860, rejoices: 27 },
];

export interface PrayerWallEntry {
  id: string;
  author: string;
  timeLabel: string;
  content: string;
  blessings: number;
  blessedByMe?: boolean;
}

export const INITIAL_PRAYER_WALL: PrayerWallEntry[] = [
  {
    id: 'pw1',
    author: 'Diệu Tâm',
    timeLabel: '15 phút trước',
    content: '"Nguyện cầu cha mẹ hai bên sống lâu trăm tuổi, thân tâm an lạc, tai qua nạn khỏi."',
    blessings: 38,
  },
  {
    id: 'pw2',
    author: 'Minh An',
    timeLabel: '42 phút trước',
    content: '"Nguyện cho tất cả chúng sinh dứt trừ khổ não, mưa thuận gió hòa, thế giới hòa bình."',
    blessings: 52,
  },
  {
    id: 'pw3',
    author: 'Tịnh Liên',
    timeLabel: '1 giờ trước',
    content: '"Cầu an cho các y bác sĩ và bệnh nhân nơi bệnh viện mau lành bệnh, vạn sự cát tường."',
    blessings: 29,
  },
  {
    id: 'pw4',
    author: 'Thiện Đức',
    timeLabel: '2 giờ trước',
    content: '"Nguyện cho tâm con luôn vững chãi, buông xả hờn giận, sống trọn vẹn từng phút giây hiện tại."',
    blessings: 41,
  },
];

export interface AmbientTrackOption {
  id: AmbientModeId;
  label: string;
  description: string;
}

export const AMBIENT_TRACKS: AmbientTrackOption[] = [
  { id: 'bell_moktak', label: 'Chuông chùa & Tiếng mõ', description: 'Đại Hồng Chung & mõ gỗ thư giãn' },
  { id: 'singing_bowl', label: 'Chuông Gia Trì & Thiền âm', description: 'Âm hưởng tịnh tâm an lạc' },
  { id: 'rain_chimes', label: 'Mưa rơi & Chuông gió chùa', description: 'Tiếng mưa hiên chùa thanh lương' },
  { id: 'silent', label: 'Tắt âm thanh', description: 'Tĩnh lặng hoàn toàn' },
];

export interface WeatherOption {
  id: WeatherModeId;
  emoji: string;
  shortLabel: string;
  fullLabel: string;
  description: string;
}

export const WEATHER_OPTIONS: WeatherOption[] = [
  { id: 'realtime', emoji: '☀️', shortLabel: 'Real-time', fullLabel: 'Real-time', description: 'Đồng bộ giờ thực & thời tiết trực tiếp' },
  { id: 'morning', emoji: '🌅', shortLabel: 'Buổi Sáng', fullLabel: 'Buổi Sáng (Bình minh)', description: 'Nắng sớm ban mai & sương nhẹ sân chùa' },
  { id: 'noon', emoji: '☀️', shortLabel: 'Buổi Trưa', fullLabel: 'Buổi Trưa (Quang đãng)', description: 'Trời xanh mây trắng, nắng vàng rực rỡ' },
  { id: 'afternoon', emoji: '🌇', shortLabel: 'Buổi Chiều', fullLabel: 'Buổi Chiều (Hoàng hôn)', description: 'Nắng chiều vàng cam chiếu xiên qua hiên chùa' },
  { id: 'night', emoji: '🌙', shortLabel: 'Buổi Tối', fullLabel: 'Buổi Tối (Đêm trăng)', description: 'Trăng rằm, bầu trời sao & đèn lồng tỏa sáng' },
  { id: 'rain', emoji: '🌧️', shortLabel: 'Mưa Chùa', fullLabel: 'Mưa Chùa (Mưa rơi)', description: 'Mưa rơi ngoài hiên chùa & hồ sen thanh lương' },
];

export function getPracticeLevelTitle(points: number): { title: string; nextTarget: number } {
  if (points >= 4000) return { title: 'Viên Mãn Thanh Tịnh', nextTarget: 4000 };
  if (points >= 1500) return { title: 'Bồ Đề Tâm Nguyện', nextTarget: 4000 };
  if (points >= 500) return { title: 'Chánh Niệm Tinh Tấn', nextTarget: 1500 };
  if (points >= 100) return { title: 'Tịnh Tâm An Lạc', nextTarget: 500 };
  return { title: 'Sơ Tâm Tu Học', nextTarget: 1500 };
}

export interface MatSlot {
  id: number;
  x: number;
  z: number;
}

/**
 * Generates 100 symmetrical meditation mat slots (50 left, 50 right) flanking
 * the central red lotus aisle runner while leaving clearance around structural columns.
 */
export function buildHundredMats(): MatSlot[] {
  const leftCols = [-2.35, -3.95, -6.55, -8.15, -9.75];
  const rightCols = [2.35, 3.95, 6.55, 8.15, 9.75];
  const cols = [...leftCols, ...rightCols];
  const mats: MatSlot[] = [];
  let idx = 1;
  for (let row = 0; row < 10; row++) {
    const z = -6.8 + row * 1.8;
    for (let col = 0; col < cols.length; col++) {
      mats.push({ id: idx++, x: cols[col], z });
    }
  }
  return mats;
}

export const HUNDRED_MATS: MatSlot[] = buildHundredMats();
// Mat #65 sits naturally in row 7 front-inner right beside the central lotus runner
export const DEFAULT_PLAYER_MAT = HUNDRED_MATS.find((m) => m.id === 16) || HUNDRED_MATS[15];

