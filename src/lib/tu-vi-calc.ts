/**
 * Bộ thuật toán tính Can Chi, Mệnh Ngũ Hành Nạp Âm và Cung Phi Bát Trạch
 * Phục vụ cho tính năng Tử Vi - Phật Pháp
 */

export interface CanChiInfo {
  can: string;
  chi: string;
  canChi: string;
  menh: string;
  nguHanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  cung: string;
  namXemCanChi: string;
  tuoiAm: number;
}

const THIEN_CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const DIA_CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

// Bảng 30 hoa giáp nạp âm
const NAP_AM_MAP: Record<string, { menh: string; nguHanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' }> = {
  'Giáp Tý': { menh: 'Hải Trung Kim (Vàng dưới biển)', nguHanh: 'Kim' },
  'Ất Sửu': { menh: 'Hải Trung Kim (Vàng dưới biển)', nguHanh: 'Kim' },
  'Bính Dần': { menh: 'Lư Trung Hỏa (Lửa trong lò)', nguHanh: 'Hỏa' },
  'Đinh Mão': { menh: 'Lư Trung Hỏa (Lửa trong lò)', nguHanh: 'Hỏa' },
  'Mậu Thìn': { menh: 'Đại Lâm Mộc (Gỗ rừng già)', nguHanh: 'Mộc' },
  'Kỷ Tỵ': { menh: 'Đại Lâm Mộc (Gỗ rừng già)', nguHanh: 'Mộc' },
  'Canh Ngọ': { menh: 'Lộ Bàng Thổ (Đất ven đường)', nguHanh: 'Thổ' },
  'Tân Mùi': { menh: 'Lộ Bàng Thổ (Đất ven đường)', nguHanh: 'Thổ' },
  'Nhâm Thân': { menh: 'Kiếm Phong Kim (Vàng mũi kiếm)', nguHanh: 'Kim' },
  'Quý Dậu': { menh: 'Kiếm Phong Kim (Vàng mũi kiếm)', nguHanh: 'Kim' },
  'Giáp Tuất': { menh: 'Sơn Đầu Hỏa (Lửa trên núi)', nguHanh: 'Hỏa' },
  'Ất Hợi': { menh: 'Sơn Đầu Hỏa (Lửa trên núi)', nguHanh: 'Hỏa' },
  'Bính Tý': { menh: 'Giản Hạ Thủy (Nước dưới khe)', nguHanh: 'Thủy' },
  'Đinh Sửu': { menh: 'Giản Hạ Thủy (Nước dưới khe)', nguHanh: 'Thủy' },
  'Mậu Dần': { menh: 'Thành Đầu Thổ (Đất đầu thành)', nguHanh: 'Thổ' },
  'Kỷ Mão': { menh: 'Thành Đầu Thổ (Đất đầu thành)', nguHanh: 'Thổ' },
  'Canh Thìn': { menh: 'Bạch Lạp Kim (Vàng trong sáp)', nguHanh: 'Kim' },
  'Tân Tỵ': { menh: 'Bạch Lạp Kim (Vàng trong sáp)', nguHanh: 'Kim' },
  'Nhâm Ngọ': { menh: 'Dương Liễu Mộc (Gỗ cây liễu)', nguHanh: 'Mộc' },
  'Quý Mùi': { menh: 'Dương Liễu Mộc (Gỗ cây liễu)', nguHanh: 'Mộc' },
  'Giáp Thân': { menh: 'Tuyền Trung Thủy (Nước trong giếng)', nguHanh: 'Thủy' },
  'Ất Dậu': { menh: 'Tuyền Trung Thủy (Nước trong giếng)', nguHanh: 'Thủy' },
  'Bính Tuất': { menh: 'Ốc Thượng Thổ (Đất nóc nhà)', nguHanh: 'Thổ' },
  'Đinh Hợi': { menh: 'Ốc Thượng Thổ (Đất nóc nhà)', nguHanh: 'Thổ' },
  'Mậu Tý': { menh: 'Tích Lịch Hỏa (Lửa sấm sét)', nguHanh: 'Hỏa' },
  'Kỷ Sửu': { menh: 'Tích Lịch Hỏa (Lửa sấm sét)', nguHanh: 'Hỏa' },
  'Canh Dần': { menh: 'Tùng Bách Mộc (Gỗ cây tùng)', nguHanh: 'Mộc' },
  'Tân Mão': { menh: 'Tùng Bách Mộc (Gỗ cây tùng)', nguHanh: 'Mộc' },
  'Nhâm Thìn': { menh: 'Trường Lưu Thủy (Nước sông dài)', nguHanh: 'Thủy' },
  'Quý Tỵ': { menh: 'Trường Lưu Thủy (Nước sông dài)', nguHanh: 'Thủy' },
  'Giáp Ngọ': { menh: 'Sa Trung Kim (Vàng trong cát)', nguHanh: 'Kim' },
  'Ất Mùi': { menh: 'Sa Trung Kim (Vàng trong cát)', nguHanh: 'Kim' },
  'Bính Thân': { menh: 'Sơn Hạ Hỏa (Lửa dưới núi)', nguHanh: 'Hỏa' },
  'Đinh Dậu': { menh: 'Sơn Hạ Hỏa (Lửa dưới núi)', nguHanh: 'Hỏa' },
  'Mậu Tuất': { menh: 'Bình Địa Mộc (Gỗ đồng bằng)', nguHanh: 'Mộc' },
  'Kỷ Hợi': { menh: 'Bình Địa Mộc (Gỗ đồng bằng)', nguHanh: 'Mộc' },
  'Canh Tý': { menh: 'Bích Thượng Thổ (Đất trên vách)', nguHanh: 'Thổ' },
  'Tân Sửu': { menh: 'Bích Thượng Thổ (Đất trên vách)', nguHanh: 'Thổ' },
  'Nhâm Dần': { menh: 'Kim Bạch Kim (Vàng trắng)', nguHanh: 'Kim' },
  'Quý Mão': { menh: 'Kim Bạch Kim (Vàng trắng)', nguHanh: 'Kim' },
  'Giáp Thìn': { menh: 'Phú Đăng Hỏa (Lửa đèn to)', nguHanh: 'Hỏa' },
  'Ất Tỵ': { menh: 'Phú Đăng Hỏa (Lửa đèn to)', nguHanh: 'Hỏa' },
  'Bính Ngọ': { menh: 'Thiên Hà Thủy (Nước trên trời)', nguHanh: 'Thủy' },
  'Đinh Mùi': { menh: 'Thiên Hà Thủy (Nước trên trời)', nguHanh: 'Thủy' },
  'Mậu Thân': { menh: 'Đại Trạch Thổ (Đất cồn lớn)', nguHanh: 'Thổ' },
  'Kỷ Dậu': { menh: 'Đại Trạch Thổ (Đất cồn lớn)', nguHanh: 'Thổ' },
  'Canh Tuất': { menh: 'Thoa Xuyến Kim (Vàng trang sức)', nguHanh: 'Kim' },
  'Tân Hợi': { menh: 'Thoa Xuyến Kim (Vàng trang sức)', nguHanh: 'Kim' },
  'Nhâm Tý': { menh: 'Tang Đố Mộc (Gỗ cây dâu)', nguHanh: 'Mộc' },
  'Quý Sửu': { menh: 'Tang Đố Mộc (Gỗ cây dâu)', nguHanh: 'Mộc' },
  'Giáp Dần': { menh: 'Đại Khê Thủy (Nước khe lớn)', nguHanh: 'Thủy' },
  'Ất Mão': { menh: 'Đại Khê Thủy (Nước khe lớn)', nguHanh: 'Thủy' },
  'Bính Thìn': { menh: 'Sa Trung Thổ (Đất trong cát)', nguHanh: 'Thổ' },
  'Đinh Tỵ': { menh: 'Sa Trung Thổ (Đất trong cát)', nguHanh: 'Thổ' },
  'Mậu Ngọ': { menh: 'Thiên Thượng Hỏa (Lửa trên trời)', nguHanh: 'Hỏa' },
  'Kỷ Mùi': { menh: 'Thiên Thượng Hỏa (Lửa trên trời)', nguHanh: 'Hỏa' },
  'Canh Thân': { menh: 'Thạch Lựu Mộc (Gỗ cây lựu đá)', nguHanh: 'Mộc' },
  'Tân Dậu': { menh: 'Thạch Lựu Mộc (Gỗ cây lựu đá)', nguHanh: 'Mộc' },
  'Nhâm Tuất': { menh: 'Đại Hải Thủy (Nước biển lớn)', nguHanh: 'Thủy' },
  'Quý Hợi': { menh: 'Đại Hải Thủy (Nước biển lớn)', nguHanh: 'Thủy' },
};

/**
 * Tính Cung Phi Bát Trạch theo năm sinh & giới tính
 */
function calculateCungPhi(year: number, gender: 'Nam' | 'Nữ'): string {
  // Tính tổng các chữ số năm sinh
  let sum = year
    .toString()
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  const CUNG_NAMES: Record<number, string> = {
    1: 'Khảm (Thủy - Đông Tứ Mệnh)',
    2: 'Khôn (Thổ - Tây Tứ Mệnh)',
    3: 'Chấn (Mộc - Đông Tứ Mệnh)',
    4: 'Tốn (Mộc - Đông Tứ Mệnh)',
    5: gender === 'Nam' ? 'Khôn (Thổ - Tây Tứ Mệnh)' : 'Cấn (Thổ - Tây Tứ Mệnh)',
    6: 'Càn (Kim - Tây Tứ Mệnh)',
    7: 'Đoài (Kim - Tây Tứ Mệnh)',
    8: 'Cấn (Thổ - Tây Tứ Mệnh)',
    9: 'Ly (Hỏa - Đông Tứ Mệnh)',
    0: 'Ly (Hỏa - Đông Tứ Mệnh)',
  };

  let remainder: number;
  if (gender === 'Nam') {
    remainder = (11 - sum) % 9;
    if (remainder <= 0) remainder += 9;
  } else {
    remainder = (4 + sum) % 9;
    if (remainder <= 0) remainder += 9;
  }

  return CUNG_NAMES[remainder] || 'Khôn (Thổ)';
}

/**
 * Tính toán toàn bộ thông số Can Chi & Mệnh
 */
export function calculateCanChiAndMenh(
  birthYear: number,
  gender: 'Nam' | 'Nữ' = 'Nam',
  viewYear: number = 2026
): CanChiInfo {
  const canIndex = birthYear % 10;
  const chiIndex = birthYear % 12;

  const can = THIEN_CAN[canIndex];
  const chi = DIA_CHI[chiIndex];
  const canChi = `${can} ${chi}`;

  const viewCanIndex = viewYear % 10;
  const viewChiIndex = viewYear % 12;
  const namXemCanChi = `${THIEN_CAN[viewCanIndex]} ${DIA_CHI[viewChiIndex]}`;

  const napAm = NAP_AM_MAP[canChi] || {
    menh: 'Bình Địa Mộc',
    nguHanh: 'Mộc' as const,
  };

  const cung = calculateCungPhi(birthYear, gender);
  const tuoiAm = viewYear - birthYear + 1;

  return {
    can,
    chi,
    canChi,
    menh: napAm.menh,
    nguHanh: napAm.nguHanh,
    cung,
    namXemCanChi,
    tuoiAm,
  };
}

export const GIO_SINH_OPTIONS = [
  { value: 'Ty', label: 'Giờ Tý (23:00 - 01:00)', description: 'Chính Tý, dạ bán' },
  { value: 'Suu', label: 'Giờ Sửu (01:00 - 03:00)', description: 'Gà gáy đầu canh' },
  { value: 'Dan', label: 'Giờ Dần (03:00 - 05:00)', description: 'Rạng đông, bình minh' },
  { value: 'Mao', label: 'Giờ Mão (05:00 - 07:00)', description: 'Mặt trời mọc' },
  { value: 'Thin', label: 'Giờ Thìn (07:00 - 09:00)', description: 'Ăn điểm tâm' },
  { value: 'Ty_', label: 'Giờ Tỵ (09:00 - 11:00)', description: 'Gần trưa, ánh dương thịnh' },
  { value: 'Ngo', label: 'Giờ Ngọ (11:00 - 13:00)', description: 'Chính ngọ, mặt trời đỉnh đầu' },
  { value: 'Mui', label: 'Giờ Mùi (13:00 - 15:00)', description: 'Đầu chiều, tản nhiệt' },
  { value: 'Than', label: 'Giờ Thân (15:00 - 17:00)', description: 'Xế chiều' },
  { value: 'Dau', label: 'Giờ Dậu (17:00 - 19:00)', description: 'Hoàng hôn, gà vào chuồng' },
  { value: 'Tuat', label: 'Giờ Tuất (19:00 - 21:00)', description: 'Chập tối, lên đèn' },
  { value: 'Hoi', label: 'Giờ Hợi (21:00 - 23:00)', description: 'Đêm khuya, vạn vật tĩnh mịch' },
  { value: 'KhongRo', label: 'Chưa rõ giờ sinh (Tính theo ngày)', description: 'Xem tổng quát theo nhật trụ' },
];

export const FOCUS_AREAS = [
  { value: 'tong_quan', label: 'Vận Mạng Tổng Quan 2026', icon: 'Compass' },
  { value: 'cong_danh', label: 'Công Danh & Sự Nghiệp', icon: 'Briefcase' },
  { value: 'tai_loc', label: 'Tài Lộc & Kinh Doanh', icon: 'Coins' },
  { value: 'tinh_duyen', label: 'Tình Duyên & Gia Đạo', icon: 'Heart' },
  { value: 'suc_khoe', label: 'Sức Khỏe & Bình An', icon: 'Shield' },
  { value: 'nghiep_phuoc', label: 'Nghiệp Duyên & Tu Phước', icon: 'Sparkles' },
];
