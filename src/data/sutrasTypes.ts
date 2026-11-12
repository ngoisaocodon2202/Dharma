export type SutraCategory =
  | 'Kinh Nhật Tụng'
  | 'Tịnh Độ Tông'
  | 'Mật Tông'
  | 'Thiền & Bát Nhã'
  | 'Kinh Nguyên Thủy (Nikaya)'
  | 'Kinh Đại Thừa & Pháp Hoa'
  | 'Thiền Kệ & Lời Phật Dạy'
  | 'Nghi Thức Sám Hối & Cúng Cơm';

export interface SutraSection {
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface SutraText {
  id: string;
  slug: string; // Dùng cho URL ?kinh=...
  title: string;
  sanskritOrPaliTitle: string;
  category: SutraCategory;
  durationMins: number;
  translator: string;
  summary: string;
  meritNote: string;
  // Cấu trúc Nghi thức Trì tụng Chuẩn Thiền Môn Việt Nam
  khaiKinh: SutraSection;
  tinhPhapGioi: SutraSection;
  toanVan: SutraSection[];
  batNhaTamKinh: SutraSection;
  hoiHuong: SutraSection;
  tamTuQuyY: SutraSection;
}

export type SutraRawEntry = Omit<
  SutraText,
  'khaiKinh' | 'tinhPhapGioi' | 'batNhaTamKinh' | 'hoiHuong' | 'tamTuQuyY'
>;

export const SUTRA_CATEGORIES: SutraCategory[] = [
  'Kinh Nhật Tụng',
  'Tịnh Độ Tông',
  'Mật Tông',
  'Thiền & Bát Nhã',
  'Kinh Nguyên Thủy (Nikaya)',
  'Kinh Đại Thừa & Pháp Hoa',
  'Thiền Kệ & Lời Phật Dạy',
  'Nghi Thức Sám Hối & Cúng Cơm',
];

