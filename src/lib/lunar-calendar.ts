/**
 * Bộ máy Lịch Vạn Niên Phật Giáo, Ngày Tốt (Hoàng Đạo) & Màu Chủ Đạo Ngũ Hành
 * Hỗ trợ quy đổi Âm - Dương lịch vĩnh cửu cho mọi năm từ hiện tại về sau
 */

export interface LunarDateInfo {
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  dayCanChi: string;
  monthCanChi: string;
  yearCanChi: string;
  isTraiDay: boolean; // Mùng 1, 14, 15, 30
  isMainTraiDay: boolean; // Mùng 1, Rằm 15
  buddhistEvent?: string;
  isHoangDao: boolean;
  hoangDaoStar: string;
  goodHours: string[];
  goodDirections: string;
  recommendedActions: string[];
  avoidActions: string[];
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Ngày lễ & Vía Phật theo Âm lịch (Tháng-Ngày)
export const BUDDHIST_LUNAR_EVENTS: Record<string, string> = {
  '1-1': 'Vía Đức Phật Di Lặc • Tết Nguyên Đán',
  '1-8': 'Lễ Cầu An Đầu Năm Dược Sư',
  '1-15': 'Đại Lễ Thượng Nguyên (Rằm Tháng Giêng)',
  '2-8': 'Vía Đức Phật Thích Ca Xuất Gia',
  '2-15': 'Vía Đức Phật Thích Ca Nhập Niết-Bàn',
  '2-19': 'Vía Đức Bồ Tát Quán Thế Âm Đản Sinh',
  '2-21': 'Vía Đức Bồ Tát Phổ Hiền',
  '3-16': 'Vía Đức Phật Mẫu Chuẩn Đề',
  '4-4': 'Vía Đức Bồ Tát Văn Thù Sư Lợi',
  '4-8': 'Khánh Đản Đức Phật Thích Ca (Bắc Tông)',
  '4-15': 'Đại Lễ Phật Đản Tam Hợp (Vesak)',
  '6-3': 'Vía Hộ Pháp Vi Đà Tôn Thiên Bồ Tát',
  '6-19': 'Vía Đức Bồ Tát Quán Thế Âm Thành Đạo',
  '7-13': 'Vía Đức Bồ Tát Đại Thế Chí',
  '7-15': 'Đại Lễ Vu Lan Báo Hiếu • Tự Tứ Tăng',
  '7-30': 'Vía Đức Bồ Tát Địa Tạng Vương',
  '8-15': 'Tết Trung Thu • Lễ Cầu Nguyện Đoàn Viên',
  '9-19': 'Vía Đức Bồ Tát Quán Thế Âm Xuất Gia',
  '9-30': 'Vía Đức Phật Dược Sư Lưu Ly Quang Vương',
  '10-15': 'Lễ Hạ Nguyên (Rằm Tháng Mười)',
  '11-1': 'Ngày Tưởng Niệm Phật Hoàng Trần Nhân Tông',
  '11-17': 'Vía Đức Phật A Di Đà',
  '12-8': 'Vía Đức Phật Thích Ca Thành Đạo',
  '12-29': 'Vía Đức Bồ Tát Hoa Nghiêm',
};

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

/**
 * Tính Julian Day Number từ ngày Dương lịch
 */
export function getJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Chuyển đổi Dương lịch sang Âm lịch chính xác sử dụng chuẩn thiên văn học Intl
 */
export function getLunarDate(year: number, month: number, day: number): LunarDateInfo {
  const dateObj = new Date(year, month - 1, day, 12, 0, 0);
  let lunarDay = 1;
  let lunarMonth = 1;
  let lunarYear = year;

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-chinese', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(dateObj);
    const dPart = parts.find((p) => p.type === 'day')?.value;
    const mPart = parts.find((p) => p.type === 'month')?.value;
    if (dPart) lunarDay = parseInt(dPart, 10) || 1;
    if (mPart) lunarMonth = parseInt(mPart.replace(/\D/g, ''), 10) || 1;
    if (month <= 2 && lunarMonth >= 11) {
      lunarYear = year - 1;
    }
  } catch {
    // Fallback approximation if Intl calendar unsupported
    const jdn = getJulianDayNumber(year, month, day);
    lunarDay = ((jdn - 2451550) % 30) + 1;
    if (lunarDay <= 0) lunarDay += 30;
    lunarMonth = ((month + 10) % 12) + 1;
  }

  const jdn = getJulianDayNumber(year, month, day);
  const dayCanIdx = (jdn + 9) % 10;
  const dayChiIdx = (jdn + 1) % 12;
  const dayCan = CAN[dayCanIdx];
  const dayChi = CHI[dayChiIdx];
  const dayCanChi = `${dayCan} ${dayChi}`;

  const yearCan = CAN[(lunarYear + 6) % 10];
  const yearChi = CHI[(lunarYear + 8) % 12];
  const yearCanChi = `${yearCan} ${yearChi}`;

  const monthCan = CAN[(lunarYear * 12 + lunarMonth + 3) % 10];
  const monthChi = CHI[(lunarMonth + 1) % 12];
  const monthCanChi = `${monthCan} ${monthChi}`;

  const isMainTraiDay = lunarDay === 1 || lunarDay === 15;
  const isTraiDay = isMainTraiDay || lunarDay === 14 || lunarDay === 30 || lunarDay === 29;
  const buddhistEvent = BUDDHIST_LUNAR_EVENTS[`${lunarMonth}-${lunarDay}`];

  // Tính Ngày Hoàng Đạo theo tháng Âm lịch và địa chi ngày
  const hoangDaoOffset = (dayChiIdx - ((lunarMonth - 1) * 2) + 12) % 12;
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
  const goodHours = GIO_HOANG_DAO_BY_CHI[dayChi] || GIO_HOANG_DAO_BY_CHI['Tý'];

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
    dayCanChi,
    monthCanChi,
    yearCanChi,
    isTraiDay,
    isMainTraiDay,
    buddhistEvent,
    isHoangDao: starInfo.isGood,
    hoangDaoStar: starInfo.name,
    goodHours,
    goodDirections,
    recommendedActions,
    avoidActions,
  };
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

