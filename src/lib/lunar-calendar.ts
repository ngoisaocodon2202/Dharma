// Engine Lịch Âm Dương Thiên Văn Chính Xác (Thuật toán Hồ Ngọc Đức — UTC+7)
// Hỗ trợ chuyển đổi 2 chiều Dương <-> Âm, Can Chi, 24 Tiết Khí, Giờ Hoàng Đạo, Trai Giới & Ngày Vía Phật Giáo.

export interface CanChiInfo {
  canChiNam: string;
  canChiThang: string;
  canChiNgay: string;
  canChiGioDauNgay: string;
  gioHoangDao: string[];
  tietKhi: string;
}

export interface BuddhistObservanceInfo {
  isLucTrai: boolean;
  isThapTrai: boolean;
  isTraiDay: boolean;
  isMainTraiDay: boolean;
  viaChuPhat?: string;
}

export interface LunarDateInfo {
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  lunarLeap: boolean;
  lunarMonthLength: number;
  jd: number;
  dayCanChi: string;
  monthCanChi: string;
  yearCanChi: string;
  hourStartCanChi: string;
  isTraiDay: boolean; // Tương thích ngược: theo Lục Trai (8, 14, 15, 23, 29, 30 / 28-29 tháng thiếu)
  isMainTraiDay: boolean; // Mùng 1, Rằm 15
  isLucTrai: boolean;
  isThapTrai: boolean;
  buddhistEvent?: string;
  viaChuPhat?: string;
  tietKhi: string;
  isHoangDao: boolean;
  hoangDaoStar: string;
  goodHours: string[];
  hoangDaoHours: string[]; // Alias tương thích cho các module Tử Vi / Lịch
  gioHoangDao: string[];
  goodDirections: string;
  recommendedActions: string[];
  avoidActions: string[];
}

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

// 24 Tiết Khí tính theo Kinh độ Mặt Trời (mỗi tiết 15°, bắt đầu từ 0° Xuân Phân)
const TIET_KHI_BY_SECTOR: string[] = [
  'Xuân Phân',   // 0° - 15°
  'Thanh Minh',  // 15° - 30°
  'Cốc Vũ',      // 30° - 45°
  'Lập Hạ',      // 45° - 60°
  'Tiểu Mãn',    // 60° - 75°
  'Mang Chủng',  // 75° - 90°
  'Hạ Chí',      // 90° - 105°
  'Tiểu Thử',    // 105° - 120°
  'Đại Thử',     // 120° - 135°
  'Lập Thu',     // 135° - 150°
  'Xử Thử',      // 150° - 165°
  'Bạch Lộ',     // 165° - 180°
  'Thu Phân',    // 180° - 195°
  'Hàn Lộ',      // 195° - 210°
  'Sương Giáng', // 210° - 225°
  'Lập Đông',    // 225° - 240°
  'Tiểu Tuyết',  // 240° - 255°
  'Đại Tuyết',   // 255° - 270°
  'Đông Chí',    // 270° - 285°
  'Tiểu Hàn',    // 285° - 300°
  'Đại Hàn',     // 300° - 315°
  'Lập Xuân',    // 315° - 330°
  'Vũ Thủy',     // 330° - 345°
  'Kinh Trập',   // 345° - 360°
];

// Ngày lễ & Vía Chư Phật / Bồ Tát theo Âm lịch ("tháng/ngày" và alias "tháng-ngày")
export const VIA_CHU_PHAT: Record<string, string> = {
  '1/1': 'Vía Đức Phật Di Lặc',
  '1/8': 'Lễ Cầu An Đầu Năm Dược Sư',
  '1/15': 'Đại Lễ Thượng Nguyên (Rằm Tháng Giêng)',
  '2/8': 'Ngày Đức Phật Thích Ca Xuất Gia',
  '2/15': 'Ngày Đức Phật Thích Ca Nhập Niết Bàn',
  '2/19': 'Vía Bồ Tát Quán Thế Âm Đản Sanh',
  '2/21': 'Vía Bồ Tát Phổ Hiền',
  '3/16': 'Vía Phật Mẫu Chuẩn Đề',
  '4/4': 'Vía Bồ Tát Văn Thù Sư Lợi',
  '4/8': 'Đại Lễ Phật Đản (Bắc Truyền)',
  '4/15': 'Đại Lễ Phật Đản Tam Hợp (Vesak)',
  '4/23': 'Vía Bồ Tát Phổ Hiền Đản Sanh',
  '4/28': 'Vía Đức Phật Dược Sư Đản Sanh',
  '5/13': 'Vía Già Lam Thánh Chúng Bồ Tát',
  '6/3': 'Vía Vi Đà Hộ Pháp Bồ Tát',
  '6/19': 'Vía Bồ Tát Quán Thế Âm Thành Đạo',
  '7/13': 'Vía Bồ Tát Đại Thế Chí',
  '7/15': 'Đại Lễ Vu Lan Báo Hiếu & Ngày Tự Tứ Tăng',
  '7/30': 'Vía Bồ Tát Địa Tạng Vương',
  '8/8': 'Vía Tôn Giả A Nan Đà',
  '8/15': 'Tết Trung Thu • Lễ Cầu Nguyện Đoàn Viên',
  '9/19': 'Vía Bồ Tát Quán Thế Âm Xuất Gia',
  '9/30': 'Vía Đức Phật Dược Sư Lưu Ly Quang',
  '10/5': 'Vía Sơ Tổ Bồ Đề Đạt Ma',
  '10/15': 'Lễ Hạ Nguyên (Rằm Tháng Mười)',
  '11/1': 'Ngày Tưởng Niệm Phật Hoàng Trần Nhân Tông',
  '11/17': 'Vía Đức Phật A Di Đà',
  '12/8': 'Ngày Đức Phật Thích Ca Thành Đạo',
};

// Giữ export cũ BUDDHIST_LUNAR_EVENTS ("month-day") để tương thích các component hiện có
export const BUDDHIST_LUNAR_EVENTS: Record<string, string> = Object.fromEntries(
  Object.entries(VIA_CHU_PHAT).map(([key, value]) => [key.replace('/', '-'), value])
);

const GIO_HOANG_DAO_BY_CHI: Record<string, string[]> = {
  Tý: ['Tý (23h-01h)', 'Sửu (01h-03h)', 'Mão (05h-07h)', 'Ngọ (11h-13h)', 'Thân (15h-17h)', 'Dậu (17h-19h)'],
  Ngọ: ['Tý (23h-01h)', 'Sửu (01h-03h)', 'Mão (05h-07h)', 'Ngọ (11h-13h)', 'Thân (15h-17h)', 'Dậu (17h-19h)'],
  Sửu: ['Dần (03h-05h)', 'Mão (05h-07h)', 'Tỵ (09h-11h)', 'Thân (15h-17h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
  Mùi: ['Dần (03h-05h)', 'Mão (05h-07h)', 'Tỵ (09h-11h)', 'Thân (15h-17h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
  Dần: ['Tý (23h-01h)', 'Sửu (01h-03h)', 'Thìn (07h-09h)', 'Tỵ (09h-11h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)'],
  Thân: ['Tý (23h-01h)', 'Sửu (01h-03h)', 'Thìn (07h-09h)', 'Tỵ (09h-11h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)'],
  Mão: ['Tý (23h-01h)', 'Dần (03h-05h)', 'Mão (05h-07h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Dậu (17h-19h)'],
  Dậu: ['Tý (23h-01h)', 'Dần (03h-05h)', 'Mão (05h-07h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Dậu (17h-19h)'],
  Thìn: ['Dần (03h-05h)', 'Thìn (07h-09h)', 'Tỵ (09h-11h)', 'Thân (15h-17h)', 'Dậu (17h-19h)', 'Hợi (21h-23h)'],
  Tuất: ['Dần (03h-05h)', 'Thìn (07h-09h)', 'Tỵ (09h-11h)', 'Thân (15h-17h)', 'Dậu (17h-19h)', 'Hợi (21h-23h)'],
  Tỵ: ['Sửu (01h-03h)', 'Thìn (07h-09h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
  Hợi: ['Sửu (01h-03h)', 'Thìn (07h-09h)', 'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'],
};

const PI = Math.PI;

function INT(d: number): number {
  return Math.floor(d);
}

/**
 * Chuyển ngày Dương lịch (dd/mm/yy) sang Số ngày Julius (Julian Day Number)
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    INT((153 * m + 2) / 5) +
    365 * y +
    INT(y / 4) -
    INT(y / 100) +
    INT(y / 400) -
    32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/**
 * Chuyển Số ngày Julius (JDN) về ngày Dương lịch [dd, mm, yy]
 */
export function jdToDate(jd: number): [number, number, number] {
  let a: number;
  let b: number;
  let c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

/**
 * Tính thời điểm Sóc (New Moon) thứ k kể từ 1/1/1900 (UTC+7 mặc định)
 * Theo thuật toán thiên văn Jean Meeus / Hồ Ngọc Đức
 */
function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

export function getNewMoonDay(k: number, timeZone = 7): number {
  return INT(newMoon(k) + 0.5 + timeZone / 24);
}

/**
 * Tính Kinh độ Mặt Trời (độ [0, 360)) tại Julian day jdn
 */
function sunLongitudeDegrees(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L - 360 * INT(L / 360);
  if (L < 0) L += 360;
  return L;
}

/**
 * Trả về chỉ số cung Trung Khí (0..11) tại thời điểm 00:00 múi giờ timeZone của ngày jdn
 */
export function getSunLongitude(jdn: number, timeZone = 7): number {
  const deg = sunLongitudeDegrees(jdn - 0.5 - timeZone / 24);
  return INT(deg / 30);
}

/**
 * Trả về Tên Tiết Khí trong 24 Tiết Khí dựa trên Kinh độ Mặt Trời lúc giữa ngày
 */
export function getTietKhi(jdn: number, timeZone = 7): string {
  const deg = sunLongitudeDegrees(jdn + 0.5 - timeZone / 24);
  const sector = INT(deg / 15) % 24;
  return TIET_KHI_BY_SECTOR[sector] || 'Xuân Phân';
}

function getLunarMonth11(yy: number, timeZone = 7): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone = 7): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển Dương lịch (dd, mm, yy) sang Âm lịch [lunarDay, lunarMonth, lunarYear, lunarLeap]
 */
export function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone = 7
): [number, number, number, number] {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

/**
 * Chuyển Âm lịch (lunarDay, lunarMonth, lunarYear, lunarLeap) sang Dương lịch [dd, mm, yy]
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap = 0,
  timeZone = 7
): [number, number, number] {
  let a11: number;
  let b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
      return [0, 0, 0];
    } else if (lunarLeap !== 0 || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Tính số ngày thực tế của tháng Âm lịch (29 hoặc 30 ngày) chứa ngày JDN
 */
export function getLunarMonthLengthByJdn(dayNumber: number, timeZone = 7): number {
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  let nextMonthStart: number;
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
    nextMonthStart = getNewMoonDay(k + 1, timeZone);
  } else {
    nextMonthStart = getNewMoonDay(k + 2, timeZone);
  }
  const len = nextMonthStart - monthStart;
  return len === 29 || len === 30 ? len : 30;
}

/**
 * Lấy thông tin Can Chi, 24 Tiết Khí và Giờ Hoàng Đạo
 */
export function getCanChi(
  _lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  jd: number,
  timeZone = 7
): CanChiInfo {
  const canChiNam = `${CAN[(lunarYear + 6) % 10]} ${CHI[(lunarYear + 8) % 12]}`;
  const canChiThang = `${CAN[(lunarYear * 12 + lunarMonth + 3) % 10]} ${CHI[(lunarMonth + 1) % 12]}`;
  const dayCanIdx = (jd + 9) % 10;
  const dayChiIdx = (jd + 1) % 12;
  const dayChi = CHI[dayChiIdx];
  const canChiNgay = `${CAN[dayCanIdx]} ${dayChi}`;
  // Ngũ Thử Độn: Can giờ Tý đầu ngày
  const canChiGioDauNgay = `${CAN[(dayCanIdx % 5) * 2]} Tý`;
  const gioHoangDao = GIO_HOANG_DAO_BY_CHI[dayChi] || GIO_HOANG_DAO_BY_CHI['Tý'];
  const tietKhi = getTietKhi(jd, timeZone);

  return {
    canChiNam,
    canChiThang,
    canChiNgay,
    canChiGioDauNgay,
    gioHoangDao,
    tietKhi,
  };
}

/**
 * Xác định Ngày Lục Trai, Thập Trai và Ngày Vía Chư Phật / Bồ Tát (xử lý cả tháng thiếu 29 ngày)
 */
export function getBuddhistObservances(
  lunarDay: number,
  lunarMonth: number,
  lunarMonthLength = 30
): BuddhistObservanceInfo {
  const isShortMonth = lunarMonthLength === 29;
  const isLucTrai = isShortMonth
    ? [8, 14, 15, 23, 28, 29].includes(lunarDay)
    : [8, 14, 15, 23, 29, 30].includes(lunarDay);
  const isThapTrai = [1, 8, 14, 15, 18, 23, 24, 28, 29, 30].includes(lunarDay);
  const isMainTraiDay = lunarDay === 1 || lunarDay === 15;

  let viaChuPhat = VIA_CHU_PHAT[`${lunarMonth}/${lunarDay}`];
  // Tháng thiếu 29 ngày: Vía Bồ Tát Địa Tạng (30/7) và Đức Phật Dược Sư (30/9) dời về ngày 29
  if (!viaChuPhat && isShortMonth && lunarDay === 29) {
    viaChuPhat = VIA_CHU_PHAT[`${lunarMonth}/30`];
  }

  return {
    isLucTrai,
    isThapTrai,
    isTraiDay: isLucTrai,
    isMainTraiDay,
    viaChuPhat,
  };
}

/**
 * Wrapper tương thích ngược: giữ nguyên signature getJulianDayNumber(year, month, day)
 */
export function getJulianDayNumber(year: number, month: number, day: number): number {
  return jdFromDate(day, month, year);
}

/**
 * Chuyển đổi Dương lịch sang đầy đủ thông tin Âm lịch, Can Chi, Hoàng Đạo, Vía Phật
 */
export function getLunarDate(year: number, month: number, day: number, timeZone = 7): LunarDateInfo {
  const [lunarDay, lunarMonth, lunarYear, lunarLeapNum] = convertSolar2Lunar(day, month, year, timeZone);
  const jd = jdFromDate(day, month, year);
  const lunarMonthLength = getLunarMonthLengthByJdn(jd, timeZone);
  const canChi = getCanChi(lunarDay, lunarMonth, lunarYear, jd, timeZone);
  const observances = getBuddhistObservances(lunarDay, lunarMonth, lunarMonthLength);

  const dayCanIdx = (jd + 9) % 10;
  const dayChiIdx = (jd + 1) % 12;

  // Tính Ngày Hoàng Đạo theo tháng Âm lịch và địa chi ngày
  const hoangDaoOffset = (dayChiIdx - (lunarMonth - 1) * 2 + 12) % 12;
  const HOANG_DAO_STARS: Record<number, { isGood: boolean; name: string }> = {
    0: { isGood: true, name: 'Thanh Long Hoàng Đạo (Đại Cát)' },
    1: { isGood: true, name: 'Minh Đường Hoàng Đạo (Tốt Lành)' },
    2: { isGood: false, name: 'Thiên Hình Hắc Đạo' },
    3: { isGood: false, name: 'Chu Tước Hắc Đạo' },
    4: { isGood: true, name: 'Kim Quỹ Hoàng Đạo (Phúc Lộc)' },
    5: { isGood: true, name: 'Kim Đường Hoàng Đạo (Hanh Thông)' },
    6: { isGood: false, name: 'Bạch Hổ Hắc Đạo' },
    7: { isGood: true, name: 'Ngọc Đường Hoàng Đạo (Quý Nhân)' },
    8: { isGood: false, name: 'Thiên Lao Hắc Đạo' },
    9: { isGood: false, name: 'Nguyên Vũ Hắc Đạo' },
    10: { isGood: true, name: 'Tư Mệnh Hoàng Đạo (Bình An)' },
    11: { isGood: false, name: 'Câu Trận Hắc Đạo' },
  };

  const starInfo = HOANG_DAO_STARS[hoangDaoOffset] || { isGood: true, name: 'Thanh Long Hoàng Đạo' };

  const DIRECTIONS = [
    'Đông Nam (Hỷ Thần) • Chính Bắc (Tài Thần)',
    'Đông Bắc (Hỷ Thần) • Chính Nam (Tài Thần)',
    'Tây Bắc (Hỷ Thần) • Đông Nam (Tài Thần)',
    'Tây Nam (Hỷ Thần) • Chính Đông (Tài Thần)',
    'Chính Nam (Hỷ Thần) • Chính Đông (Tài Thần)',
  ];
  const goodDirections = DIRECTIONS[dayCanIdx % DIRECTIONS.length];

  const recommendedActions = starInfo.isGood
    ? [
        'Đi chùa lễ Phật, cầu an, dâng hương Tam Bảo',
        'Làm việc thiện, phóng sinh, bố thí gieo duyên lành',
        'Khởi sự công việc mới, ký kết, xuất hành thuận lợi',
        'Tụng kinh, tọa thiền, sum họp gia đình ấm êm',
      ]
    : [
        'Giữ tâm thanh tịnh, tụng kinh, niệm Phật tại gia',
        'Làm việc thiện lành, giúp đỡ người khó khăn',
        'Nói lời ái ngữ, nhẫn nhịn và buông xả sân giận',
      ];

  const avoidActions = starInfo.isGood
    ? ['Tránh tranh cãi hơn thua, sát sinh hại vật']
    : ['Hạn chế nóng giận, tránh khởi sự tranh chấp hoặc đi xa mạo hiểm'];

  return {
    lunarDay,
    lunarMonth,
    lunarYear,
    lunarLeap: lunarLeapNum === 1,
    lunarMonthLength,
    jd,
    dayCanChi: canChi.canChiNgay,
    monthCanChi: canChi.canChiThang,
    yearCanChi: canChi.canChiNam,
    hourStartCanChi: canChi.canChiGioDauNgay,
    isTraiDay: observances.isTraiDay,
    isMainTraiDay: observances.isMainTraiDay,
    isLucTrai: observances.isLucTrai,
    isThapTrai: observances.isThapTrai,
    buddhistEvent: observances.viaChuPhat,
    viaChuPhat: observances.viaChuPhat,
    tietKhi: canChi.tietKhi,
    isHoangDao: starInfo.isGood,
    hoangDaoStar: starInfo.name,
    goodHours: canChi.gioHoangDao,
    hoangDaoHours: canChi.gioHoangDao,
    gioHoangDao: canChi.gioHoangDao,
    goodDirections,
    recommendedActions,
    avoidActions,
  };
}

/**
 * Tìm ngày Dương lịch tiếp theo tương ứng với ngày giỗ / ngày Vía Âm lịch (Xử lý tháng thiếu 29 ngày)
 */
export function getNextSolarDateForLunar(
  lunarDay: number,
  lunarMonth: number,
  fromDate: Date = new Date()
): { solarDate: Date; daysRemaining: number; lunarYear: number; effectiveLunarDay: number } {
  const startMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const [, , currentLunarYear] = convertSolar2Lunar(
    startMidnight.getDate(),
    startMidnight.getMonth() + 1,
    startMidnight.getFullYear()
  );

  for (let offsetYear = 0; offsetYear <= 2; offsetYear++) {
    const targetYear = currentLunarYear + offsetYear;
    let [sd, sm, sy] = convertLunar2Solar(lunarDay, lunarMonth, targetYear, 0);
    let effectiveDay = lunarDay;
    if (sd === 0 && lunarDay === 30) {
      [sd, sm, sy] = convertLunar2Solar(29, lunarMonth, targetYear, 0);
      effectiveDay = 29;
    }
    if (sd > 0) {
      // Kiểm tra tháng thiếu: nếu sang ngày 30 bị lùi thành mùng 1 tháng sau thì lấy ngày 29
      const checkLunar = convertSolar2Lunar(sd, sm, sy);
      if (checkLunar[1] !== lunarMonth && lunarDay === 30) {
        [sd, sm, sy] = convertLunar2Solar(29, lunarMonth, targetYear, 0);
        effectiveDay = 29;
      }
      const candidate = new Date(sy, sm - 1, sd);
      const diffDays = Math.round((candidate.getTime() - startMidnight.getTime()) / 86400000);
      if (diffDays >= 0) {
        return {
          solarDate: candidate,
          daysRemaining: diffDays,
          lunarYear: targetYear,
          effectiveLunarDay: effectiveDay,
        };
      }
    }
  }

  return {
    solarDate: startMidnight,
    daysRemaining: 0,
    lunarYear: currentLunarYear,
    effectiveLunarDay: lunarDay,
  };
}

/**
 * Tìm các ngày Vía Chư Phật / Trai Giới sắp tới trong N ngày kế tiếp
 */
export function getUpcomingBuddhistObservances(
  fromDate: Date = new Date(),
  daysAhead = 45,
  limit = 6
): Array<{
  solarDate: Date;
  solarLabel: string;
  lunarLabel: string;
  title: string;
  daysRemaining: number;
  isMainTrai: boolean;
}> {
  const startMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const results: Array<{
    solarDate: Date;
    solarLabel: string;
    lunarLabel: string;
    title: string;
    daysRemaining: number;
    isMainTrai: boolean;
  }> = [];

  for (let i = 0; i <= daysAhead && results.length < limit; i++) {
    const d = new Date(startMidnight.getFullYear(), startMidnight.getMonth(), startMidnight.getDate() + i);
    const info = getLunarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (info.viaChuPhat || info.isMainTraiDay) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const ld = String(info.lunarDay).padStart(2, '0');
      const lm = String(info.lunarMonth).padStart(2, '0');
      results.push({
        solarDate: d,
        solarLabel: `${dd}/${mm}/${d.getFullYear()}`,
        lunarLabel: `${ld}/${lm} ÂL`,
        title:
          info.viaChuPhat ||
          (info.lunarDay === 1 ? 'Ngày Sóc (Mùng 1 Ăn Chay Niệm Phật)' : 'Ngày Vọng (Rằm 15 Ăn Chay Phóng Sinh)'),
        daysRemaining: i,
        isMainTrai: info.isMainTraiDay,
      });
    }
  }

  return results;
}

export interface NguHanhColorProfile {
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  elementTitle: string;
  primaryColors: { name: string; hex: string; desc: string }[];
  supportColors: { name: string; hex: string; desc: string }[];
  avoidColors: { name: string; hex: string }[];
  luckyNumbers: string;
  luckyDirection: string;
  sacredItems: string[];
  dharmaAdvice: string;
}

export const NGU_HANH_COLOR_MAP: Record<'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ', NguHanhColorProfile> = {
  Kim: {
    element: 'Kim',
    elementTitle: 'Mệnh Kim — Sự Kiên Định & Thanh Khiết',
    primaryColors: [
      { name: 'Trắng Tinh Khiết', hex: '#F8FAFC', desc: 'Màu bản mệnh giúp tâm trí sáng suốt, minh mẫn' },
      { name: 'Vàng Ánh Kim', hex: '#F59E0B', desc: 'Biểu trưng cho trí tuệ Bát Nhã và sự cát tường' },
      { name: 'Xám Bạc', hex: '#94A3B8', desc: 'Mang lại sự điềm tĩnh, vững vàng trước biến động' },
    ],
    supportColors: [
      { name: 'Vàng Hoàng Thổ', hex: '#D97706', desc: 'Thổ sinh Kim — Nuôi dưỡng phúc khí và quý nhân' },
      { name: 'Nâu Đất Trầm', hex: '#78350F', desc: 'Tạo nền tảng bình an, che chở và bền vững' },
    ],
    avoidColors: [
      { name: 'Đỏ Rực (Hỏa khắc Kim)', hex: '#EF4444' },
      { name: 'Hồng Đậm', hex: '#EC4899' },
    ],
    luckyNumbers: '6, 7 (Bản mệnh) • 2, 5, 8 (Tương sinh)',
    luckyDirection: 'Tây, Tây Bắc, Tây Nam, Đông Bắc',
    sacredItems: [
      'Chuỗi hạt Bồ Đề trắng hoặc Thạch anh trắng thanh tịnh',
      'Vòng gỗ Hoàng Đàn hoặc Hổ phách ánh vàng',
      'Tượng hoặc mặt dây Đức Phật A Di Đà hộ niệm',
    ],
    dharmaAdvice:
      'Người mệnh Kim có tính cách cương trực, rõ ràng. Hãy thực hành thêm hạnh Từ Bi và sự mềm mỏng (như nước), biết lắng nghe và bao dung để cuộc sống luôn viên mãn, thuận hòa.',
  },
  Mộc: {
    element: 'Mộc',
    elementTitle: 'Mệnh Mộc — Sức Sống Từ Bi & Bao Dung',
    primaryColors: [
      { name: 'Xanh Ngọc Bích', hex: '#10B981', desc: 'Màu bản mệnh mang năng lượng chữa lành và sinh sôi' },
      { name: 'Xanh Lá Rừng Thiền', hex: '#15803D', desc: 'Nuôi dưỡng sự bình an, thư thái và trí sáng' },
    ],
    supportColors: [
      { name: 'Xanh Dương Thẳm', hex: '#0284C7', desc: 'Thủy sinh Mộc — Tiếp thêm nguồn năng lượng dồi dào' },
      { name: 'Đen Huyền Thủy', hex: '#1E293B', desc: 'Giúp nội tâm sâu sắc, định tĩnh và vững chãi' },
    ],
    avoidColors: [
      { name: 'Trắng Ánh Kim (Kim khắc Mộc)', hex: '#E2E8F0' },
      { name: 'Xám Bạc', hex: '#94A3B8' },
    ],
    luckyNumbers: '3, 4 (Bản mệnh) • 1 (Tương sinh)',
    luckyDirection: 'Đông, Đông Nam, Chính Bắc',
    sacredItems: [
      'Chuỗi hạt Gỗ Trầm Hương hoặc Gỗ Bách Xanh tự nhiên',
      'Vòng đá Cẩm Thạch xanh hoặc Ngọc Bích (Jade)',
      'Hình tượng Đức Phật Dược Sư Lưu Ly hoặc Bồ Tát Quán Thế Âm',
    ],
    dharmaAdvice:
      'Người mệnh Mộc giàu lòng trắc ẩn như cây đại thụ che mát. Hãy rèn luyện Chánh Định để tâm không bị lay động bởi gió đời, kiên trì tới cùng với những thiện nguyện đã khởi.',
  },
  Thủy: {
    element: 'Thủy',
    elementTitle: 'Mệnh Thủy — Trí Tuệ Uyển Chuyển & Thâm Sâu',
    primaryColors: [
      { name: 'Xanh Lam Thanh Tịnh', hex: '#0284C7', desc: 'Màu bản mệnh mang lại sự bình yên và trí tuệ sâu rộng' },
      { name: 'Xanh Biển Sâu', hex: '#1D4ED8', desc: 'Giúp tinh thần tập trung, hanh thông mọi việc' },
      { name: 'Đen Huyền Bí', hex: '#0F172A', desc: 'Tượng trưng cho chiều sâu nội tâm và định lực' },
    ],
    supportColors: [
      { name: 'Trắng Tinh Khôi', hex: '#F8FAFC', desc: 'Kim sinh Thủy — Đón nhận sự trợ duyên lành' },
      { name: 'Vàng Ánh Kim', hex: '#FBBF24', desc: 'Khai mở vận may và sự sáng suốt' },
    ],
    avoidColors: [
      { name: 'Nâu Đất (Thổ khắc Thủy)', hex: '#78350F' },
      { name: 'Vàng Đất Đậm', hex: '#B45309' },
    ],
    luckyNumbers: '1 (Bản mệnh) • 6, 7 (Tương sinh)',
    luckyDirection: 'Chính Bắc, Tây, Tây Bắc',
    sacredItems: [
      'Chuỗi hạt Aquamarine (Ngọc xanh biển) hoặc Thạch anh trắng',
      'Vòng hạt Bồ Đề Tinh Nguyệt thanh khiết',
      'Pháp bảo khắc lục tự Đại Minh Chú Om Mani Padme Hum',
    ],
    dharmaAdvice:
      'Nước mềm mại nhưng có thể xuyên thủng đá cứng. Người mệnh Thủy thông tuệ, nhạy bén; chỉ cần giữ tâm chánh niệm, không để cảm xúc cuốn trôi thì việc lớn nhỏ gì cũng thành tựu.',
  },
  Hỏa: {
    element: 'Hỏa',
    elementTitle: 'Mệnh Hỏa — Ngọn Đèn Trí Tuệ & Nhiệt Huyết',
    primaryColors: [
      { name: 'Đỏ Pháp Phục / Chu Sa', hex: '#DC2626', desc: 'Màu bản mệnh tượng trưng cho năng lượng và cát tường' },
      { name: 'Cam Saffron (Áo Cà Sa)', hex: '#EA580C', desc: 'Sắc màu tỉnh thức, ấm áp và trí tuệ nhà Phật' },
      { name: 'Hồng Liên Hoa (Hoa Sen)', hex: '#DB2777', desc: 'Mang lại nhân duyên tốt lành và niềm hoan hỷ' },
    ],
    supportColors: [
      { name: 'Xanh Ngọc Lục Bảo', hex: '#059669', desc: 'Mộc sinh Hỏa — Nuôi dưỡng ngọn lửa nhiệt tâm bền bỉ' },
      { name: 'Xanh Lá Cây', hex: '#16A34A', desc: 'Làm dịu tâm nóng nảy, cân bằng cảm xúc an hòa' },
    ],
    avoidColors: [
      { name: 'Đen Tuyền (Thủy khắc Hỏa)', hex: '#0F172A' },
      { name: 'Xanh Nước Biển Đậm', hex: '#1E3A8A' },
    ],
    luckyNumbers: '9 (Bản mệnh) • 3, 4 (Tương sinh)',
    luckyDirection: 'Chính Nam, Đông, Đông Nam',
    sacredItems: [
      'Chuỗi hạt Gỗ Tử Đàn đỏ hoặc Gỗ Huyết Long tự nhiên',
      'Đá Mã Não đỏ hoặc Thạch Anh Tím (Amethyst) định tâm',
      'Biểu tượng Hoa Sen Hồng hoặc Bồ Tát Văn Thù Sư Lợi',
    ],
    dharmaAdvice:
      'Ngọn lửa khi được kiểm soát là ngọn đèn soi sáng đêm tối, nhưng nếu mất kiểm soát sẽ thành lửa sân giận. Người mệnh Hỏa hãy năng thực hành thiền hơi thở để giữ tâm luôn mát mẻ, an nhiên.',
  },
  Thổ: {
    element: 'Thổ',
    elementTitle: 'Mệnh Thổ — Đại Địa Vững Chãi & Bao Dung',
    primaryColors: [
      { name: 'Vàng Hoàng Kim / Saffron', hex: '#D97706', desc: 'Màu bản mệnh biểu trưng cho phúc đức và sự tôn quý' },
      { name: 'Nâu Đất Thiền Môn', hex: '#78350F', desc: 'Sắc áo nâu sồng giản dị, vững chãi và bình an' },
    ],
    supportColors: [
      { name: 'Đỏ Chu Sa', hex: '#DC2626', desc: 'Hỏa sinh Thổ — Mang lại sinh khí, may mắn và hỷ lạc' },
      { name: 'Hồng Sen / Cam Ấm', hex: '#EA580C', desc: 'Tăng cường nhân duyên thuận lợi và tài lộc' },
    ],
    avoidColors: [
      { name: 'Xanh Lá Đậm (Mộc khắc Thổ)', hex: '#15803D' },
      { name: 'Xanh Lục', hex: '#10B981' },
    ],
    luckyNumbers: '2, 5, 8 (Bản mệnh) • 9 (Tương sinh)',
    luckyDirection: 'Đông Bắc, Tây Nam, Chính Nam',
    sacredItems: [
      'Chuỗi hạt Gỗ Trầm Hương nâu hoặc Đá Mắt Hổ vàng nâu',
      'Vòng hạt Bồ Đề Kim Cương 108 hạt',
      'Hình tượng Đức Phật Di Lặc hoặc Bồ Tát Địa Tạng Vương',
    ],
    dharmaAdvice:
      'Đất mẹ âm thầm nâng đỡ muôn loài mà không đòi hỏi đáp đền. Người mệnh Thổ chân thành, đáng tin cậy; càng gieo trồng nhiều phước báu thiện lành thì hậu vận càng vững bền như núi Thái Sơn.',
  },
};
