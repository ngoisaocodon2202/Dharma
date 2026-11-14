'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  Sparkles,
  Play,
  Pause,
  Check,
  Heart,
  Search,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Feather,
  Utensils,
  Compass,
  Award,
  Radio,
} from 'lucide-react';
import {
  playBellSound,
  playGrandTempleBellSound,
  playWoodenFishSound,
  startHealingDrone,
  stopHealingDrone,
} from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/dharma/DharmaInteractiveTools';
import { LotusMinimalIcon } from '@/components/icons/DharmaMinimalIcons';
import { cn } from '@/lib/utils';

export type NewFeatureToolId =
  | 'gieo-que-quan-am'
  | 'chep-kinh'
  | 'sam-hoi-108'
  | 'so-phong-sinh'
  | 'nhat-ky-thien-nghiep'
  | 'bep-thien-chay'
  | 'tu-dien-phap-so'
  | 'cong-dong-hoi-huong'
  | 'nhac-tu-tap';

export interface DharmaNewFeatureMeta {
  id: NewFeatureToolId;
  orderNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
}

export const EIGHT_NEW_FEATURES_LIST: DharmaNewFeatureMeta[] = [
  {
    id: 'gieo-que-quan-am',
    orderNumber: 13,
    title: 'Xin Xăm Quan Âm',
    subtitle: 'Giải quẻ từ bi & chánh kiến',
    badge: 'Linh Ứng',
    image: '/images/dharma/tools/13-gieo-que-quan-am.jpg',
  },
  {
    id: 'chep-kinh',
    orderNumber: 14,
    title: 'Tả Kinh Tịnh Tâm',
    subtitle: 'Chép kinh rèn định lực',
    badge: 'Định Tâm',
    image: '/images/dharma/tools/14-chep-kinh.jpg',
  },
  {
    id: 'sam-hoi-108',
    orderNumber: 15,
    title: 'Sám Hối 108 Lạy',
    subtitle: 'Đảnh lễ 108 hồng danh Phật',
    badge: '108 Lạy',
    image: '/images/dharma/tools/15-sam-hoi-108.jpg',
  },
  {
    id: 'so-phong-sinh',
    orderNumber: 16,
    title: 'Sổ Phóng Sinh',
    subtitle: 'Ghi chép công đức hộ sinh',
    badge: 'Từ Bi',
    image: '/images/dharma/tools/16-so-phong-sinh.jpg',
  },
  {
    id: 'nhat-ky-thien-nghiep',
    orderNumber: 17,
    title: 'Nhật Ký Thập Thiện',
    subtitle: 'Gieo 10 hạt giống lành',
    badge: 'Nhân Quả',
    image: '/images/dharma/tools/17-nhat-ky-thien-nghiep.jpg',
  },
  {
    id: 'bep-thien-chay',
    orderNumber: 18,
    title: 'Bếp Thiền Chay',
    subtitle: 'Món chay thanh đạm dễ nấu',
    badge: 'Trai Tịnh',
    image: '/images/dharma/tools/18-bep-thien-chay.jpg',
  },
  {
    id: 'tu-dien-phap-so',
    orderNumber: 19,
    title: 'Từ Điển Pháp Số',
    subtitle: 'Tra cứu thuật ngữ Phật học',
    badge: 'Trí Tuệ',
    image: '/images/dharma/tools/19-tu-dien-phap-so.jpg',
  },
  {
    id: 'cong-dong-hoi-huong',
    orderNumber: 20,
    title: 'Vườn Sen Đồng Tu',
    subtitle: 'Tâm sự & hộ niệm chung',
    badge: 'Đồng Tu',
    image: '/images/dharma/tools/20-cong-dong-hoi-huong.jpg',
  },
];

// ============================================================================
// DATA FOR THE 8 NEW FEATURES + HZ HEALING STUDIO
// ============================================================================
const QUAN_AM_LOTS = [
  {
    number: 'Quẻ Số 01 • Thượng Thượng Cát',
    title: 'Khai Hoa Kiến Phật — Đất Lành Nở Hoa Sen Báu',
    poem: 'Đông qua xuân tới nắng bừng lên\nMuôn sự hanh thông thỏa ước nguyền\nGiữ trọn lòng nhân gieo phước đức\nQuán Âm gia hộ bước bình yên.',
    meaning:
      'Quẻ báo hiệu nhân duyên lành đang hội tụ. Những nỗ lực chân chính và thiện tâm của bạn trong thời gian qua bắt đầu kết trái ngọt.',
    advice:
      'Gia đạo an vui, công việc thuận lợi. Hãy tiếp tục khiêm cung, bố thí giúp người và giữ lời nói hòa ái.',
  },
  {
    number: 'Quẻ Số 08 • Đại Cát Tường',
    title: 'Trăng Sáng Qua Mây — Tâm Tịnh Trí Sáng',
    poem: 'Mây mù tan biến lộ trăng trong\nChẳngướng bụi trần nhẹ tấc lòng\nCầu việc thiện lành đều cảm ứng\nThuyền từ vượt biển đến bờ thông.',
    meaning:
      'Mọi khúc mắc, lo âu sắp được tháo gỡ. Khi tâm bạn lắng xuống và nhìn sự việc bằng trí tuệ từ bi, giải pháp tốt đẹp nhất sẽ tự hiện ra.',
    advice:
      'Nếu đang phân vân, hãy chọn con đường trung thực và lợi ích cho số đông. Sức khỏe chuyển biến tích cực.',
  },
  {
    number: 'Quẻ Số 15 • Thượng Cát',
    title: 'Cam Lộ Tưới Mát — Hóa Giải Chướng Duyên',
    poem: 'Nhành dương nước tịnh rưới trần gian\nDập tắt lửa sân chuyển nguy nan\nMột niệm từ bi muôn phước tụ\nGia đình sum họp hưởng bình an.',
    meaning:
      'Nhờ lòng nhẫn nhịn và biết buông xả, những bất đồng nhỏ được hóa giải êm đẹp. Quý nhân sẵn lòng nâng đỡ bạn.',
    advice:
      'Nên dành thời gian thăm hỏi cha mẹ, người thân và tụng một thời Kinh Phổ Môn hoặc Bát Nhã.',
  },
  {
    number: 'Quẻ Số 22 • Trung Thượng Cát',
    title: 'Gieo Hạt Bồ Đề — Kiên Trì Ắt Thành Tựu',
    poem: 'Cây lành bám rễ đất sâu dày\nChẳng sợ gió sương vẫn thẳng ngay\nChậm rãi bền lòng vun cội phước\nMùa thu quả ngọt trĩu cành đầy.',
    meaning:
      'Đừng nóngội trước kết quả tức thời. Việc bạn đang làm rất đúng hướng nhưng cần thêm sự kiên nhẫn và tỉ mỉ.',
    advice:
      'Giữ tâm bình tĩnh, làm tốt từng việc nhỏ mỗi ngày. Cuối tháng sẽ nhận tin vui.',
  },
  {
    number: 'Quẻ Số 32 • Thượng Cát Viên Mãn',
    title: 'Liên Hoa Tỏa Ngát — Phước Huệ Song Tu',
    poem: 'Sen vàng nở giữa mặt hồ trong\nHương đạo bay xa khắp núi sông\nTrên kính Tam Bảo dưới thương chúng\nTrăm năm phúc lộc giữ bền lòng.',
    meaning:
      'Tâm nguyện chân thành của bạn đã cảm thông cùng Chư Phật. Gia đạo ấm êm, việc học hành và sự nghiệp đều sáng sủa.',
    advice:
      'Hãy chia sẻ niềm vui và phước lành này bằng cách làm một việc thiện hoặc phóng sinh hộ mạng.',
  },
];

const COPYABLE_SUTRAS = [
  {
    id: 'bat-nha-ngan',
    title: 'Bát Nhã Tâm Kinh (Đoạn Cốt Tủy)',
    text: 'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách. Xá Lợi Tử! Sắc bất dị không, không bất dị sắc, sắc tức thị không, không tức thị sắc.',
  },
  {
    id: 'phap-cu-1',
    title: 'Kinh Pháp Cú — Kệ Số 1 & 2 (Làm Chủ Tâm Ý)',
    text: 'Ý dẫn đầu các pháp, Ý làm chủ, ý tạo. Nếu với ý thanh tịnh, nói lên hay hành động, an lạc bước theo sau, như bóng không rời hình.',
  },
  {
    id: 'tu-hoang-the-nguyen',
    title: 'Tứ Hoằng Thệ Nguyện',
    text: 'Chúng sanh vô biên thệ nguyện độ. Phiền não vô tận thệ nguyện đoạn. Pháp môn vô lượng thệ nguyện học. Phật đạo vô thượng thệ nguyện thành.',
  },
  {
    id: 'kinh-tu-bi-ngan',
    title: 'Kinh Từ Bi (Metta Sutta Tinh Hoa)',
    text: 'Nguyện cho tất cả chúng sinh đều được an vui và hạnh phúc. Như mẹ hiền thương yêu che chở đứa con duy nhất của mình bằng cả mạng sống, hãy phát triển tâm từ bi vô lượng đối với muôn loài.',
  },
];

const HUNDRED_EIGHT_BUDDHAS: string[] = [
  '1. Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
  '2. Nam Mô Quá Khứ Tỳ Bà Thi Phật',
  '3. Nam Mô Thi Khí Như Lai Phật',
  '4. Nam Mô Tỳ Xá Phù Như Lai Phật',
  '5. Nam Mô Câu Lưu Tôn Như Lai Phật',
  '6. Nam Mô Câu Na Hàm Mâu Ni Phật',
  '7. Nam Mô Ca Diếp Như Lai Phật',
  '8. Nam Mô Đương Lai Hạ Sanh Di Lặc Tôn Phật',
  '9. Nam Mô Tây Phương Cực Lạc Thế Giới Đại Từ Đại Bi A Di Đà Phật',
  '10. Nam Mô Đông Phương Giáo Chủ Dược Sư Lưu Ly Quang Vương Phật',
  '11. Nam Mô Bảo Thắng Như Lai Phật',
  '12. Nam Mô Diệu Sắc Thân Như Lai Phật',
  '13. Nam Mô Quảng Bác Thân Như Lai Phật',
  '14. Nam Mô Ly Bố Úy Như Lai Phật',
  '15. Nam Mô Cam Lộ Vương Như Lai Phật',
  '16. Nam Mô Đa Bảo Như Lai Phật',
  '17. Nam Mô Phổ Quang Phật',
  '18. Nam Mô Phổ Minh Phật',
  '19. Nam Mô Phổ Tịnh Phật',
  '20. Nam Mô Đa Ma La Bạt Chiên Đàn Hương Phật',
  '21. Nam Mô Chiên Đàn Quang Phật',
  '22. Nam Mô Ma Ni Tràng Phật',
  '23. Nam Mô Hoan Hỷ Tạng Ma Ni Bảo Tích Phật',
  '24. Nam Mô Nhất Thiết Thế Gian Nhạc Kiến Thượng Đại Tinh Tấn Phật',
  '25. Nam Mô Ma Ni Tràng Đăng Quang Phật',
  '26. Nam Mô Huệ Cự Chiếu Phật',
  '27. Nam Mô Hải Đức Quang Minh Phật',
  '28. Nam Mô Kim Cang Lao Cường Phổ Tán Kim Quang Phật',
  '29. Nam Mô Đại Cường Tinh Tấn Dũng Mãnh Phật',
  '30. Nam Mô Đại Bi Quang Phật',
  '31. Nam Mô Từ Lực Vương Phật',
  '32. Nam Mô Từ Tạng Phật',
  '33. Nam Mô Chiên Đàn Khốt Trang Nghiêm Thắng Phật',
  '34. Nam Mô Hiền Thiện Thủ Phật',
  '35. Nam Mô Thiện Ý Phật',
  '36. Nam Mô Quảng Trang Nghiêm Vương Phật',
  '37. Nam Mô Kim Hoa Quang Phật',
  '38. Nam Mô Bảo Cái Chiếu Không Tự Tại Lực Vương Phật',
  '39. Nam Mô Hư Không Bảo Hoa Quang Phật',
  '40. Nam Mô Lưu Ly Trang Nghiêm Vương Phật',
  '41. Nam Mô Phổ Hiện Sắc Thân Quang Phật',
  '42. Nam Mô Bất Động Trí Quang Phật',
  '43. Nam Mô Hàng Phục Chúng Ma Vương Phật',
  '44. Nam Mô Tài Quang Minh Phật',
  '45. Nam Mô Trí Huệ Thắng Phật',
  '46. Nam Mô Di Lặc Tiên Quang Phật',
  '47. Nam Mô Thiện Tịch Nguyệt Âm Diệu Tôn Trí Vương Phật',
  '48. Nam Mô Thế Tịnh Quang Phật',
  '49. Nam Mô Long Chủng Thượng Tôn Vương Phật',
  '50. Nam Mô Nhật Nguyệt Quang Phật',
  '51. Nam Mô Nhật Nguyệt Châu Quang Phật',
  '52. Nam Mô Huệ Tràng Thắng Vương Phật',
  '53. Nam Mô Sư Tử Hống Tự Tại Lực Vương Phật',
  '54. Nam Mô Diệu Âm Thắng Phật',
  '55. Nam Mô Thường Quang Tràng Phật',
  '56. Nam Mô Quan Thế Đăng Phật',
  '57. Nam Mô Huệ Oai Đăng Vương Phật',
  '58. Nam Mô Pháp Thắng Vương Phật',
  '59. Nam Mô Tu Di Quang Phật',
  '60. Nam Mô Tu Ma Na Hoa Quang Phật',
  '61. Nam Mô Ưu Đàm Bát La Hoa Thù Thắng Vương Phật',
  '62. Nam Mô Đại Huệ Lực Vương Phật',
  '63. Nam Mô A Súc Tỳ Hoan Hỷ Quang Phật',
  '64. Nam Mô Vô Lượng Âm Thanh Vương Phật',
  '65. Nam Mô Tài Quang Phật',
  '66. Nam Mô Kim Hải Quang Phật',
  '67. Nam Mô Sơn Hải Huệ Tự Tại Thông Vương Phật',
  '68. Nam Mô Đại Thông Quang Phật',
  '69. Nam Mô Nhất Thiết Pháp Tràng Mãn Vương Phật',
  '70. Nam Mô Đại Trí Văn Thù Sư Lợi Bồ Tát',
  '71. Nam Mô Đại Hạnh Phổ Hiền Bồ Tát',
  '72. Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
  '73. Nam Mô Đại Thế Chí Bồ Tát',
  '74. Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
  '75. Nam Mô Thanh Tịnh Đại Hải Chúng Bồ Tát',
  '76. Nam Mô Hộ Pháp Chư Tôn Bồ Tát',
  '77. Nam Mô Dược Vương Bồ Tát',
  '78. Nam Mô Dược Thượng Bồ Tát',
  '79. Nam Mô Thường Tinh Tấn Bồ Tát',
  '80. Nam Mô Vô Tận Ý Bồ Tát',
  '81. Nam Mô Bảo Đàn Hoa Bồ Tát',
  '82. Nam Mô Đắc Đại Thế Bồ Tát',
  '83. Nam Mô Đà La Ni Bồ Tát',
  '84. Nam Mô Bất Không Quyến Sách Bồ Tát',
  '85. Nam Mô Chuẩn Đề Vương Bồ Tát',
  '86. Nam Mô Kim Cang Thủ Bồ Tát',
  '87. Nam Mô Hư Không Tạng Bồ Tát',
  '88. Nam Mô Trừ Cái Chướng Bồ Tát',
  '89. Nam Mô Phổ Quang Vương Bồ Tát',
  '90. Nam Mô Hoa Nghiêm Hải Hội Phật Bồ Tát',
  '91. Nam Mô Pháp Hoa Hội Thượng Phật Bồ Tát',
  '92. Nam Mô Lăng Nghiêm Hội Thượng Phật Bồ Tát',
  '93. Nam Mô Niết Bàn Hội Thượng Phật Bồ Tát',
  '94. Nam Mô Kim Cang Bát Nhã Hội Thượng Phật Bồ Tát',
  '95. Nam Mô Tịnh Độ Liên Trì Hải Hội Phật Bồ Tát',
  '96. Nam Mô Long Hoa Tam Hội Di Lặc Tôn Phật',
  '97. Nam Mô Tỳ Lô Giá Na Pháp Thân Phật',
  '98. Nam Mô Lô Xá Na Báo Thân Phật',
  '99. Nam Mô Phổ Quảng Trang Nghiêm Phật',
  '100. Nam Mô Vô Nhiễm Tịnh Quang Phật',
  '101. Nam Mô Pháp Giới Tạng Thân A Di Đà Phật',
  '102. Nam Mô Nhất Thiết Như Lai Tâm Đà La Ni Phật',
  '103. Nam Mô Công Đức Bảo Hoa Phật',
  '104. Nam Mô Thiện Trụ Công Đức Bảo Vương Phật',
  '105. Nam Mô Vô Lượng Thọ Như Lai Phật',
  '106. Nam Mô Vô Lượng Quang Như Lai Phật',
  '107. Nam Mô Mười Phương Ba Đời Nhất Thiết Chư Phật',
  '108. Nam Mô Thường Trụ Tam Bảo Tác Đại Chứng Minh',
];

const THAP_THIEN_VOWS = [
  { id: 'khong-sat-sinh', group: 'Thân Nghiệp', label: '1. Không sát sinh — Tôn trọng và bảo vệ sự sống muôn loài' },
  { id: 'khong-trom-cap', group: 'Thân Nghiệp', label: '2. Không trộm cắp — Sống trung thực, rộng lòng bố thí sẻ chia' },
  { id: 'song-pham-hanh', group: 'Thân Nghiệp', label: '3. Sống chung thủy, chánh hạnh — Giữ gìn hạnh phúc gia đình' },
  { id: 'khong-noi-doi', group: 'Khẩu Nghiệp', label: '4. Không nói dối — Luôn nói lời chân thật, đáng tin cậy' },
  { id: 'khong-hai-luoi', group: 'Khẩu Nghiệp', label: '5. Không nói hai lưỡi — Nói lời hòa giải, gắn kết tình thương' },
  { id: 'ai-ngu', group: 'Khẩu Nghiệp', label: '6. Không nói lời thô ác — Thực hành ái ngữ, dịu dàng nâng đỡ' },
  { id: 'noi-loi-co-ich', group: 'Khẩu Nghiệp', label: '7. Không nói lời vô ích — Nói đúng lúc, đúng Chánh pháp' },
  { id: 'khong-tham-lam', group: 'Ý Nghiệp', label: '8. Không tham lam — Biết đủ (Tri túc), vui với thành công người khác' },
  { id: 'khong-san-han', group: 'Ý Nghiệp', label: '9. Không sân hận — Nuôi dưỡng tâm từ bi, bao dung tha thứ' },
  { id: 'chanh-kien', group: 'Ý Nghiệp', label: '10. Giữ vững Chánh kiến — Tin sâu Nhân Quả và lý Duyên Khởi' },
];

const VEGETARIAN_RECIPES = [
  {
    id: 'com-la-sen',
    title: 'Cơm Hấp Lá Sen Hạt Sen Ngũ Sắc',
    time: '35 phút',
    category: 'Món Chính Thanh Tịnh',
    ingredients: [
      '2 bát cơm gạo tám thơm hoặc gạo lứt mềm',
      '100g hạt sen tươi Huế bỏ tâm',
      '50g nấm đông cô, 50g cà rốt, 50g đậu Hà Lan hạt',
      '1 lá sen tươi lớn rửa sạch, dầu mè, nước tương nguyên chất',
    ],
    steps: [
      'Bước 1: Hạt sen tươi luộc chín mềm tới, vớt ra để ráo nước.',
      'Bước 2: Nấm đông cô và cà rốt thái hạt lựu nhỏ, xào thơm với chút dầu mè và nước tương.',
      'Bước 3: Trộn đều cơm nóng với hạt sen, nấm, cà rốt và đậu Hà Lan.',
      'Bước 4: Gói hỗn hợp cơm vào trong lá sen tươi, đem hấp cách thủy 12 phút cho hương sen thấm đượm từng hạt cơm.',
    ],
  },
  {
    id: 'dau-hu-nam-dong-co',
    title: 'Đậu Hũ Non Sốt Nấm Đông Cô & Cải Thìa',
    time: '20 phút',
    category: 'Món Chay Dưỡng Sinh',
    ingredients: [
      '2 bìa đậu hũ non mềm',
      '8 tai nấm đông cô tươi hoặc khô ngâm mềm',
      '6 cây cải thìa xanh non',
      'Nước tương, dầu hào chay, chút bột năng tạo sánh',
    ],
    steps: [
      'Bước 1: Cắt đậu hũ non thành khoanh tròn vừa ăn, hấp nóng 5 phút.',
      'Bước 2: Cải thìa chần sơ qua nước sôi có chút muối để giữ màu xanh ngọc, xếp quanh đĩa đậu hũ.',
      'Bước 3: Xào nấm đông cô với nước tương, dầu hào chay và nước dùng rau củ, pha chút bột năng cho nước sốt sánh bóng rồi rưới lên đậu hũ.',
    ],
  },
  {
    id: 'canh-sen-nam-tuyet',
    title: 'Canh Hạt Sen Nấm Tuyết & Táo Đỏ An Thần',
    time: '30 phút',
    category: 'Canh Dưỡng Tâm An Giấc',
    ingredients: [
      '120g hạt sen tươi, 1 bông nấm tuyết ngâm nở',
      '8 quả táo đỏ, 10 hạt kỷ tử, ngò rí',
      '1 lít nước dừa tươi pha nước lọc thanh mát',
    ],
    steps: [
      'Bước 1: Hầm hạt sen và táo đỏ với nước dừa pha nước lọc trong 20 phút cho ngọt nước.',
      'Bước 2: Cho nấm tuyết thái vừa ăn và kỷ tử vào đun thêm 5 phút, nêm muối hồng thanh nhẹ.',
      'Bước 3: Múc ra bát thưởng thức ấm nóng giúp an thần, thanh nhiệt và ngủ ngon.',
    ],
  },
];

const PHAP_SO_DICTIONARY = [
  {
    term: 'Tam Bảo (3 Ngôi Báu)',
    category: 'Căn Bản',
    meaning:
      '1. Phật Bảo (Đấng Giác Ngộ hoàn toàn); 2. Pháp Bảo (Lời dạy chân lý đưa tới giải thoát); 3. Tăng Bảo (Đoàn thể thanh tịnh hòa hợp thực hành theo Chánh pháp). Tự thân mỗi người cũng có Tam Bảo nội tâm: Giác — Chánh — Tịnh.',
  },
  {
    term: 'Tứ Diệu Đế (4 Chân Lý Thánh)',
    category: 'Cốt Tủy',
    meaning:
      '1. Khổ Đế (Nhận diện các nỗi khổ bức bách trong đời); 2. Tập Đế (Nguyên nhân của khổ là tham ái và vô minh); 3. Diệt Đế (Trạng thái Niết Bàn an vui khi dứt trừ nguyên nhân khổ); 4. Đạo Đế (Con đường Bát Chánh Đạo đưa đến hết khổ).',
  },
  {
    term: 'Bát Chánh Đạo (8 Con Đường Chánh)',
    category: 'Thực Hành',
    meaning:
      '1. Chánh Kiến (Hiểu biết đúng); 2. Chánh Tư Duy (Suy nghĩ từ bi, buông xả); 3. Chánh Ngữ (Lời nói chân thật, hòa ái); 4. Chánh Nghiệp (Hành động thiện lành); 5. Chánh Mạng (Nghề nghiệp chân chính); 6. Chánh Tinh Tấn (Siêng năng đúng hướng); 7. Chánh Niệm (Tỉnh thức trong hiện tại); 8. Chánh Định (Tâm an định vững chãi).',
  },
  {
    term: 'Lục Độ Ba La Mật (6 Pháp Vượt Bờ Mê)',
    category: 'Bồ Tát Đạo',
    meaning:
      '1. Bố Thí (Rộng lòng cho đi); 2. Trì Giới (Giữ gìn đạo đức trong sạch); 3. Nhẫn Nhục (Bao dung, chịu đựng nghịch cảnh không sân hận); 4. Tinh Tấn (Không ngừng nỗ lực tu thiện); 5. Thiền Định (Giữ tâm không tán loạn); 6. Trí Tuệ Bát Nhã (Thấy rõ bản chất vô ngã duyên sinh).',
  },
  {
    term: 'Tứ Vô Lượng Tâm (4 Tâm Rộng Lớn)',
    category: 'Nuôi Dưỡng Tâm',
    meaning:
      '1. Từ (Ban tặng niềm vui cho chúng sinh); 2. Bi (Thương xót và cứu giúp chúng sinh thoát khổ); 3. Hỷ (Vui mừng chân thật trước hạnh phúc của người khác); 4. Xả (Cho đi mà không chấp công, không phân biệt thân sơ).',
  },
  {
    term: 'Tam Pháp Ấn (3 Dấu Ấn Chánh Pháp)',
    category: 'Triết Học',
    meaning:
      '1. Chư hành vô thường (Mọi hiện tượng có điều kiện đều biến đổi không ngừng); 2. Chư pháp vô ngã (Không có một bản ngã độc lập bất biến); 3. Niết bàn tịch tịnh (Sự lắng tắt tham sân si là an lạc tối thượng).',
  },
];

const HZ_HEALING_TRACKS = [
  {
    id: '432',
    freqLabel: '432 Hz',
    title: 'Tần Số Vũ Trụ Tự Nhiên & Chuông Xoay Tây Tạng',
    subtitle: 'Làm dịu hệ thần kinh, giảm nhịp tim, đưa tâm về trạng thái tĩnh lặng sâu',
    droneMode: '432' as const,
    youtubeId: '1ZYbU82GVz4',
  },
  {
    id: '528',
    freqLabel: '528 Hz',
    title: 'Tần Số Từ Bi Chữa Lành (Solfeggio 528Hz)',
    subtitle: 'Khơi dậy năng lượng yêu thương, tái tạo sự cân bằng thân - tâm',
    droneMode: '528' as const,
    youtubeId: 'UkM-FjfN6Mc',
  },
  {
    id: 'om-136',
    freqLabel: '136.1 Hz',
    title: 'Sóng Âm Om Vũ Trụ & Tiếng Mưa Rừng Trúc',
    subtitle: 'Đồng điệu nhịp thở thiền định, giải tỏa căng thẳng mất ngủ',
    droneMode: 'om' as const,
    youtubeId: 'hlWiI4xVXKY',
  },
];

const GENTLE_CHANTING_VIDEOS = [
  {
    id: 'vid-bat-nha',
    title: 'Tụng Bát Nhã Tâm Kinh — Giọng Đọc Trầm Ấm Dễ Chịu',
    subtitle: 'Pháp âm thanh tịnh kèm tiếng chuông gia trì nhẹ nhàng',
    youtubeId: '9uJkF_t4C1s',
    chantText:
      'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách. Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc. Thọ, tưởng, hành, thức diệc phục như thị.',
  },
  {
    id: 'vid-niem-phat',
    title: 'Niệm Phật A Di Đà 6 Chữ — Nhịp Chậm Thư Giãn Tâm Thức',
    subtitle: 'Nam Mô A Di Đà Phật — Giọng niệm êm dịu giúp tâm an định',
    youtubeId: 'wR8f1I9yC1o',
    chantText:
      'Nam Mô A Di Đà Phật. Nguyện đem công đức niệm Phật thanh tịnh này trang nghiêm Phật Tịnh Độ, trên đền bốn ơn nặng, dưới cứu khổ ba đường, nếu có ai thấy nghe đều phát tâm Bồ Đề.',
  },
  {
    id: 'vid-duoc-su',
    title: 'Chú Dược Sư Lưu Ly — Cầu Bình An & Chữa Lành Thân Tâm',
    subtitle: 'Nam Mô Bạc Già Phạt Đế Bệ Sát Xả Lũ Rô Bệ Lưu Ly Bát Lạt Bà',
    youtubeId: 'k7N1g5t2H8E',
    chantText:
      'Nam mô bạc già phạt đế, bệ sát xả, lũ rô bệ lưu ly, bát lạt bà, hắt ra xà dã. Đát tha yết đa da, a ra hắt đế, tam miệu tam bột đà da. Đát điệt tha: Án, bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế toà ha.',
  },
];

interface DharmaEightNewFeaturesProps {
  activeTool: NewFeatureToolId;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export function DharmaEightNewFeatures({
  activeTool,
  onClose,
  showToast,
}: DharmaEightNewFeaturesProps) {
  // Postgres-synced records for current tool
  const [records, setRecords] = useState<Array<Record<string, any>>>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // 1. Xin Xăm Quan Âm state
  const [isShakingLot, setIsShakingLot] = useState(false);
  const [drawnLot, setDrawnLot] = useState<(typeof QUAN_AM_LOTS)[0] | null>(null);

  // 2. Chép Kinh state
  const [selectedCopySutra, setSelectedCopySutra] = useState(COPYABLE_SUTRAS[0]);
  const [typedSutraText, setTypedSutraText] = useState('');

  // 3. Lạy 108 Phật state (with Smooth Auto-Scroll!)
  const [bowCount108, setBowCount108] = useState(0);
  const [isAutoScroll108, setIsAutoScroll108] = useState(true);
  const [scrollSpeed108, setScrollSpeed108] = useState(0.8);
  const scroll108Ref = useRef<HTMLDivElement | null>(null);
  const rem108Ref = useRef(0);

  // 4. Sổ Phóng Sinh state
  const [psSpecies, setPsSpecies] = useState('Cá chép & cá trê');
  const [psCount, setPsCount] = useState('30');
  const [psLocation, setPsLocation] = useState('Bến sông thanh tịnh');
  const [psNote, setPsNote] = useState('Nguyện cầu muôn loài an vui, gia đạo bình an, cha mẹ trường thọ.');
  const [showPhongSinhRitual, setShowPhongSinhRitual] = useState(false);

  // 5. Nhật Ký Thập Thiện state
  const [checkedVows, setCheckedVows] = useState<string[]>([
    'khong-sat-sinh',
    'khong-noi-doi',
    'ai-ngu',
    'chanh-kien',
  ]);
  const [thienReflection, setThienReflection] = useState('');

  // 6. Bếp Thiền Chay state
  const [selectedRecipe, setSelectedRecipe] = useState(VEGETARIAN_RECIPES[0]);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  // 7. Từ Điển Pháp Số state
  const [dictQuery, setDictQuery] = useState('');

  // 8. Vườn Sen Đồng Tu state
  const [postAuthor, setPostAuthor] = useState('Dharma');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // 9. Hz & Chanting Audio Studio state
  const [activeHzTrack, setActiveHzTrack] = useState(HZ_HEALING_TRACKS[0]);
  const [isHzPlaying, setIsHzPlaying] = useState(false);
  const [activeChantVid, setActiveChantVid] = useState(GENTLE_CHANTING_VIDEOS[0]);
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);

  const loadPostgresRecords = useCallback(async () => {
    setIsLoadingRecords(true);
    try {
      const res = await fetch(`/api/dharma/sync?resource=features&feature=${encodeURIComponent(activeTool)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.records)) {
        setRecords(data.records);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingRecords(false);
    }
  }, [activeTool]);

  useEffect(() => {
    loadPostgresRecords();
  }, [loadPostgresRecords]);

  // Smooth Auto-Scroll for Lạy 108 Danh Hiệu Phật
  useEffect(() => {
    if (activeTool !== 'sam-hoi-108' || !isAutoScroll108) return;
    let rafId: number;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const el = scroll108Ref.current;
      if (el) {
        rem108Ref.current += 22 * scrollSpeed108 * dt;
        const delta = Math.floor(rem108Ref.current);
        if (delta >= 1) {
          el.scrollTop += delta;
          rem108Ref.current -= delta;
          const total = Math.max(1, el.scrollHeight - el.clientHeight);
          const ratio = Math.min(1, el.scrollTop / total);
          setBowCount108(Math.min(108, Math.max(1, Math.ceil(ratio * 108))));
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
            setIsAutoScroll108(false);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [activeTool, isAutoScroll108, scrollSpeed108]);

  // Cleanup audio on close
  useEffect(() => {
    return () => {
      stopHealingDrone();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const saveRecordToPostgres = async (payload: {
    title: string;
    subtitle: string;
    content: string;
    author_name?: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      const res = await fetch('/api/dharma/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'features',
          feature_slug: activeTool,
          author_name: payload.author_name || 'Dharma',
          title: payload.title,
          subtitle: payload.subtitle,
          content: payload.content,
          metadata: payload.metadata || {},
        }),
      });
      const data = await res.json();
      if (data.ok && data.record) {
        setRecords((prev) => [data.record, ...prev]);
      }
    } catch {
      // ignore
    }
  };

  const handleDrawQuanAmLot = () => {
    setIsShakingLot(true);
    playWoodenFishSound(0.5);
    setTimeout(() => {
      playGrandTempleBellSound(0.6);
      const picked = QUAN_AM_LOTS[Math.floor(Math.random() * QUAN_AM_LOTS.length)];
      setDrawnLot(picked);
      setIsShakingLot(false);
      saveRecordToPostgres({
        title: `${picked.number} — ${picked.title}`,
        subtitle: 'Xin Xăm Quan Âm Từ Bi',
        content: picked.advice,
      });
      recordDharmaMerit({
        type: 'gieo-que-quan-am',
        title: `Thỉnh Quẻ Quan Âm: ${picked.number}`,
        detail: picked.title,
        meritPoints: 10,
      });
      showToast(`Đã thỉnh ${picked.number}`);
    }, 1100);
  };

  const meta = EIGHT_NEW_FEATURES_LIST.find((f) => f.id === activeTool) || {
    id: activeTool,
    orderNumber: 10,
    title: 'Âm Thanh Chữa Lành (Hz) & Tụng Kinh Êm Dịu',
    subtitle: 'Tần số 432Hz / 528Hz & giọng đọc kinh nhẹ nhàng thư giãn',
    badge: '432Hz • 528Hz',
    image: '/images/dharma/tools/10-nhac-tu-tap-hz.jpg',
  };

  return (
    <div
      className="fixed inset-0 w-screen h-[100dvh] z-[150] bg-[#FAF7F0] text-[#2C1E10] flex flex-col overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* ===================================================================== */}
      {/* FULL-SCREEN HEADER WITH BACK BUTTON                                   */}
      {/* ===================================================================== */}
      <header className="shrink-0 h-14 px-4 bg-[#FAF7F0] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            stopHealingDrone();
            onClose();
          }}
          aria-label="Quay lại"
          className="w-9 h-9 rounded-full bg-[#EFECE5] hover:bg-[#E7E1D5] inline-flex items-center justify-center text-[#2C1E10] transition-colors shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="min-w-0 text-center flex-1">
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#2C1E10] whitespace-nowrap truncate">
            {meta.title}
          </h2>
          <p className="text-[10px] text-[#6B533B] whitespace-nowrap truncate">
            {meta.subtitle}
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[10px] font-bold text-[#8C5500] whitespace-nowrap shrink-0">
          {meta.badge}
        </span>
      </header>

      {/* ===================================================================== */}
      {/* FULL-SCREEN BODY PER TOOL                                             */}
      {/* ===================================================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* ------------------------------------------------------------------- */}
        {/* TOOL 13: XIN XĂM QUAN ÂM & GIẢI QUẺ TỪ BI                           */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'gieo-que-quan-am' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-center space-y-4 shadow-2xs">
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-[#D9A02E] shadow-sm bg-[#FFF9EB]">
                <img
                  src="/images/buddhas/quan-the-am-bo-tat.png"
                  alt="Đức Bồ Tát Quán Thế Âm"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C1E10]">
                  Thành Tâm Xin Xăm Đức Quán Thế Âm
                </h3>
                <p className="text-xs text-[#6B533B] max-w-md mx-auto mt-1">
                  Hít thở sâu 3 hơi, niệm &ldquo;Nam Mô Đại Bi Quán Thế Âm Bồ Tát&rdquo; rồi nhấn nút lắc ống xăm để nhận lời khuyên Chánh kiến.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDrawQuanAmLot}
                disabled={isShakingLot}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-sm shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Compass className={cn('w-4 h-4', isShakingLot && 'animate-spin')} />
                <span>{isShakingLot ? 'Đang cảm ứng ống xăm...' : '🙏 Chắp Tay Lắc Ống Xăm Từ Bi'}</span>
              </button>
            </div>

            {drawnLot && (
              <div className="p-5 rounded-2xl bg-[#FFF9EB] border-2 border-[#D9A02E] space-y-3 shadow-sm animate-fade-in">
                <div className="text-center border-b border-[#EAD7A7] pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C5500]">
                    {drawnLot.number}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#2C1E10] mt-0.5">
                    {drawnLot.title}
                  </h4>
                </div>
                <pre className="font-serif italic text-sm text-[#2C1E10] text-center whitespace-pre-line bg-[#FFFFFF] p-4 rounded-xl border border-[#EAD7A7]">
                  {drawnLot.poem}
                </pre>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong className="text-[#8C5500]">Ý nghĩa quẻ:</strong> {drawnLot.meaning}
                  </p>
                  <p>
                    <strong className="text-[#8C5500]">Lời khuyên tu tập &amp; hành xử:</strong> {drawnLot.advice}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#EAD7A7] p-4 space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-[#8C5500]">
                Lịch Sử Quẻ Đã Thỉnh ({records.length})
              </h4>
              {records.slice(0, 8).map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs space-y-1">
                  <div className="font-bold text-[#2C1E10]">{r.title}</div>
                  <div className="text-[#6B533B]">{r.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 14: TẢ KINH TỊNH TÂM (CHÉP KINH CHÁNH NIỆM)                     */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'chep-kinh' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {COPYABLE_SUTRAS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedCopySutra(s);
                    setTypedSutraText('');
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border cursor-pointer transition-all',
                    selectedCopySutra.id === s.id
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] border-[#D9A02E]'
                      : 'bg-[#FFFFFF] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF5] border-2 border-[#EAD7A7] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EAD7A7] pb-2">
                <span className="font-serif font-bold text-sm text-[#8C5500]">
                  Bản Kinh Mẫu: {selectedCopySutra.title}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  Tiến độ: {Math.min(100, Math.round((typedSutraText.length / selectedCopySutra.text.length) * 100))}%
                </span>
              </div>

              {/* Watermark Sutra Reference */}
              <div className="p-4 rounded-xl bg-[#FAF5E6] border border-[#EAD7A7] font-serif text-base sm:text-lg leading-relaxed text-[#2C1E10] select-none">
                {selectedCopySutra.text.split('').map((char, idx) => {
                  const typedChar = typedSutraText[idx];
                  const isCorrect = typedChar === char;
                  return (
                    <span
                      key={idx}
                      className={cn(
                        typedChar === undefined
                          ? 'text-[#9E8B70]'
                          : isCorrect
                            ? 'text-[#2C1E10] font-bold bg-[#FFE07D]/35'
                            : 'text-rose-600 underline'
                      )}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              <textarea
                rows={4}
                value={typedSutraText}
                onChange={(e) => {
                  setTypedSutraText(e.target.value);
                  if (e.target.value.length % 15 === 0) {
                    playWoodenFishSound(0.25);
                  }
                }}
                placeholder="Chậm rãi gõ lại từng chữ kinh chánh niệm tại đây..."
                className="w-full p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9A02E] font-serif text-base text-[#2C1E10] focus:outline-none"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setTypedSutraText(selectedCopySutra.text)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  Điền nhanh mẫu thử
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!typedSutraText.trim()) return;
                    playGrandTempleBellSound(0.5);
                    saveRecordToPostgres({
                      title: `Hoàn mãn tả kinh: ${selectedCopySutra.title}`,
                      subtitle: `Độ dài: ${typedSutraText.length} ký tự`,
                      content: typedSutraText,
                    });
                    recordDharmaMerit({
                      type: 'chep-kinh',
                      title: `Tả Kinh Tịnh Tâm: ${selectedCopySutra.title}`,
                      detail: 'Nhất tâm biên chép lời Phật dạy',
                      meritPoints: 35,
                    });
                    setTypedSutraText('');
                    showToast('Đã lưu bản Tả Kinh • +35 Công Đức');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <Feather className="w-4 h-4 inline mr-1.5" />
                  Lưu Bản Chép Kinh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 15: LẠY 108 DANH HIỆU PHẬT & SÁM HỐI SÁU CĂN (AUTO-SCROLL)      */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'sam-hoi-108' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-[#8C5500] block">
                  Hồng Danh Bảo Sám • 108 Danh Hiệu Chư Phật
                </span>
                <span className="text-sm font-serif font-bold text-[#2C1E10]">
                  Đã lễ bái: {bowCount108} / 108 lạy
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoScroll108((v) => !v)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border whitespace-nowrap',
                    isAutoScroll108
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#FFF6DF] text-[#7A5000] border-[#E5C67E]'
                  )}
                >
                  {isAutoScroll108 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isAutoScroll108 ? 'Tự lướt: BẬT' : 'Tự lướt: TẮT'}</span>
                </button>

                <select
                  value={scrollSpeed108}
                  onChange={(e) => setScrollSpeed108(Number(e.target.value))}
                  className="px-2 py-2 sm:py-1.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-base sm:text-xs font-bold"
                >
                  <option value={0.5}>0.5x Chậm</option>
                  <option value={0.8}>0.8x Chuẩn</option>
                  <option value={1.2}>1.2x Vừa</option>
                  <option value={1.8}>1.8x Nhanh</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.45);
                    setBowCount108((c) => Math.min(108, c + 1));
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] font-bold text-xs cursor-pointer whitespace-nowrap"
                >
                  🙏 +1 Lạy &amp; Chuông
                </button>
              </div>
            </div>

            <div
              ref={scroll108Ref}
              className="h-[54vh] overflow-y-auto p-4 rounded-2xl bg-[#FFFDF8] border border-[#EAD7A7] space-y-2.5"
            >
              {HUNDRED_EIGHT_BUDDHAS.map((name, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    playBellSound(0.35);
                    setBowCount108(idx + 1);
                  }}
                  className={cn(
                    'p-3 rounded-xl border font-serif text-sm sm:text-base flex items-center justify-between gap-2 cursor-pointer transition-all',
                    bowCount108 === idx + 1
                      ? 'bg-[#FFF4D0] border-[#D9A02E] font-bold text-[#2C1E10]'
                      : 'bg-[#FFFFFF] border-[#EAD7A7]/70 text-[#2C1E10]'
                  )}
                >
                  <span>{name}</span>
                  <span className="text-[11px] font-sans font-semibold text-[#8C5500] shrink-0 whitespace-nowrap">
                    Chí tâm đảnh lễ 🙏
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                playGrandTempleBellSound(0.6);
                saveRecordToPostgres({
                  title: `Hoàn mãn lễ sám hối ${bowCount108 || 108} danh hiệu Phật`,
                  subtitle: 'Hồng Danh Bảo Sám • Tịnh hóa tam nghiệp',
                  content: 'Nguyện đem công đức lễ Phật sám hối tiêu trừ nghiệp chướng ba đời.',
                });
                recordDharmaMerit({
                  type: 'sam-hoi-108',
                  title: `Lễ Sám Hối ${bowCount108 || 108} Danh Hiệu Phật`,
                  detail: 'Chí tâm đảnh lễ Hồng Danh Chư Phật',
                  meritPoints: 108,
                });
                showToast('Đã lưu công đức Lễ 108 Phật vào Sổ Công Đức!');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-sm shadow-sm cursor-pointer"
            >
              Hoàn Mãn Thời Sám Hối &amp; Lưu Sổ Công Đức
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 16: SỔ PHÓNG SINH & HỘ SINH TỪ BI                               */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'so-phong-sinh' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#2C1E10]">
                  Ghi Nhận Kỳ Phóng Sinh &amp; Bảo Vệ Sự Sống
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPhongSinhRitual((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  {showPhongSinhRitual ? 'Ẩn Nghi Thức' : '📖 Xem Nghi Thức Chú Nguyện'}
                </button>
              </div>

              {showPhongSinhRitual && (
                <div className="p-4 rounded-xl bg-[#FFF9EB] border border-[#D9A02E] space-y-2 text-xs sm:text-sm font-serif leading-relaxed text-[#2C1E10]">
                  <div className="font-bold text-[#8C5500]">NGHI THỨC QUY Y &amp; CHÚ NGUYỆN PHÓNG SINH NGẮN GỌN:</div>
                  <p>1. Niệm danh hiệu: Nam Mô Bổn Sư Thích Ca Mâu Ni Phật (3 lần) • Nam Mô Quán Thế Âm Bồ Tát (3 lần).</p>
                  <p>2. Truyền Tam Quy cho chúng sinh: &ldquo;Hết thảy chúng sinh nay được giải thoát, quy y Phật, quy y Pháp, quy y Tăng. Quy y Phật không đọa địa ngục, quy y Pháp không đọa ngạ quỷ, quy y Tăng không đọa súc sanh.&rdquo; (3 lần)</p>
                  <p>3. Tụng Tâm Kinh hoặc Chú Đại Bi, phóng thích nhẹ nhàng và hồi hướng công đức.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={psSpecies}
                  onChange={(e) => setPsSpecies(e.target.value)}
                  placeholder="Loài phóng sinh (Cá, chim, ốc...)"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
                />
                <input
                  type="number"
                  value={psCount}
                  onChange={(e) => setPsCount(e.target.value)}
                  placeholder="Số lượng sinh mạng"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
                />
                <input
                  type="text"
                  value={psLocation}
                  onChange={(e) => setPsLocation(e.target.value)}
                  placeholder="Địa điểm phóng sinh"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
                />
              </div>

              <textarea
                rows={2}
                value={psNote}
                onChange={(e) => setPsNote(e.target.value)}
                placeholder="Lời hồi hướng công đức phóng sinh..."
                className="w-full p-3 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
              />

              <button
                type="button"
                onClick={() => {
                  playBellSound(0.45);
                  saveRecordToPostgres({
                    title: `Phóng sinh ${psCount} ${psSpecies}`,
                    subtitle: `Tại: ${psLocation} • ${new Date().toLocaleDateString('vi-VN')}`,
                    content: psNote,
                    metadata: { count: Number(psCount || 1), species: psSpecies, location: psLocation },
                  });
                  recordDharmaMerit({
                    type: 'so-phong-sinh',
                    title: `Phóng sinh hộ mạng: ${psCount} ${psSpecies}`,
                    detail: psNote,
                    meritPoints: 30,
                  });
                  showToast('Đã lưu kỳ Phóng Sinh • +30 Công Đức');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm cursor-pointer"
              >
                Lưu Vào Sổ Phóng Sinh
              </button>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-[#8C5500]">
                Nhật Ký Phóng Sinh Đã Lưu ({records.length})
              </h4>
              {records.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C1E10]">
                    <span>🐟 {r.title}</span>
                    <span className="text-[#8C5500]">{r.subtitle}</span>
                  </div>
                  <p className="text-xs text-[#6B533B]">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 17: NHẬT KÝ THẬP THIỆN & QUÁN CHIẾU NHÂN QUẢ                    */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'nhat-ky-thien-nghiep' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#2C1E10]">
                  Bảng Soi Tâm 10 Thiện Nghiệp Hôm Nay
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  Đạt {checkedVows.length}/10 Thiện Nghiệp
                </span>
              </div>

              <div className="space-y-2">
                {THAP_THIEN_VOWS.map((vow) => {
                  const checked = checkedVows.includes(vow.id);
                  return (
                    <button
                      key={vow.id}
                      type="button"
                      onClick={() => {
                        playWoodenFishSound(0.25);
                        setCheckedVows((prev) =>
                          prev.includes(vow.id) ? prev.filter((x) => x !== vow.id) : [...prev, vow.id]
                        );
                      }}
                      className={cn(
                        'w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all',
                        checked
                          ? 'bg-[#FFF9EB] border-[#D9A02E] text-[#2C1E10]'
                          : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                      )}
                    >
                      <div className="text-xs sm:text-sm font-medium">{vow.label}</div>
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border',
                          checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-[#EAD7A7]'
                        )}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={thienReflection}
                onChange={(e) => setThienReflection(e.target.value)}
                placeholder="Ghi chú việc lành hoặc bài học chuyển hóa tâm trong ngày..."
                className="w-full p-3 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
              />

              <button
                type="button"
                onClick={() => {
                  playBellSound(0.45);
                  saveRecordToPostgres({
                    title: `Thực hành ${checkedVows.length}/10 Thiện Nghiệp`,
                    subtitle: `Ngày ${new Date().toLocaleDateString('vi-VN')}`,
                    content: thienReflection || 'Giữ trọn chánh niệm thân - khẩu - ý trong ngày.',
                    metadata: { checkedVows },
                  });
                  recordDharmaMerit({
                    type: 'nhat-ky-thien-nghiep',
                    title: `Soi tâm Thập Thiện (${checkedVows.length}/10)`,
                    detail: thienReflection || 'Vun bồi hạt giống thiện lành',
                    meritPoints: checkedVows.length * 3,
                  });
                  setThienReflection('');
                  showToast('Đã lưu Nhật Ký Thập Thiện!');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm cursor-pointer"
              >
                Lưu Nhật Ký Thiện Nghiệp
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 18: BẾP THIỀN CHAY TỊNH & THỰC ĐƠN NGÀY TRAI                    */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'bep-thien-chay' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {VEGETARIAN_RECIPES.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setSelectedRecipe(rec)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border cursor-pointer',
                    selectedRecipe.id === rec.id
                      ? 'bg-gradient-to-r from-[#FFE07D] to-[#F5C542] text-[#3D2505] border-[#D9A02E]'
                      : 'bg-[#FFFFFF] text-[#6B533B] border-[#EAD7A7]'
                  )}
                >
                  🥗 {rec.title}
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EAD7A7] pb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#8C5500] uppercase">{selectedRecipe.category}</span>
                  <h3 className="font-serif font-bold text-lg text-[#2C1E10]">{selectedRecipe.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-xs font-bold text-[#8C5500] whitespace-nowrap">
                  ⏱ {selectedRecipe.time}
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-[#8C5500] mb-2">Nguyên liệu chuẩn bị:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2C1E10]">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7]">
                      • {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-[#8C5500] mb-2">
                  Các bước chế biến chánh niệm (Chạm để đánh dấu hoàn thành):
                </h4>
                <div className="space-y-2">
                  {selectedRecipe.steps.map((st, idx) => {
                    const key = `${selectedRecipe.id}-${idx}`;
                    const done = !!checkedSteps[key];
                    return (
                      <div
                        key={key}
                        onClick={() => setCheckedSteps((p) => ({ ...p, [key]: !done }))}
                        className={cn(
                          'p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer flex items-start justify-between gap-3',
                          done ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#2C1E10]'
                        )}
                      >
                        <span>{st}</span>
                        {done && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 19: TỪ ĐIỂN PHẬT HỌC & PHÁP SỐ TINH HOA                         */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'tu-dien-phap-so' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C5500] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dictQuery}
                onChange={(e) => setDictQuery(e.target.value)}
                placeholder="Tìm kiếm thuật ngữ: Tam Bảo, Tứ Diệu Đế, Bát Chánh Đạo, Lục Độ..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] text-xs sm:text-sm text-[#2C1E10] outline-none focus:border-[#C68B19]"
              />
            </div>

            <div className="space-y-3">
              {PHAP_SO_DICTIONARY.filter(
                (item) =>
                  !dictQuery.trim() ||
                  item.term.toLowerCase().includes(dictQuery.toLowerCase()) ||
                  item.meaning.toLowerCase().includes(dictQuery.toLowerCase())
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif font-bold text-base text-[#8C5500]">{item.term}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF6DF] border border-[#EAD7A7] text-[10px] font-bold text-[#7A5000] whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1E10] leading-relaxed">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 20: VƯỜN SEN ĐỒNG TU (HỘP THƯ TÂM SỰ & HỘ NIỆM REAL-TIME)      */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'cong-dong-hoi-huong' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-3 shadow-2xs">
              <h3 className="font-serif font-bold text-base text-[#2C1E10]">
                Chia Sẻ Tâm Sự Tu Học Hoặc Xin Đại Chúng Hộ Niệm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={postAuthor}
                  onChange={(e) => setPostAuthor(e.target.value)}
                  placeholder="Pháp danh của bạn"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
                />
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Tiêu đề tâm sự / lời xin hộ niệm"
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
                />
              </div>
              <textarea
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Viết lời sẻ chia chân thành cùng đại chúng đồng tu..."
                className="w-full p-3 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] text-xs text-[#2C1E10]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!postContent.trim()) return;
                  playBellSound(0.4);
                  saveRecordToPostgres({
                    author_name: postAuthor || 'Dharma',
                    title: postTitle || 'Tâm sự đồng tu & Xin hộ niệm',
                    subtitle: 'Vườn Sen Đồng Tu DHARMA',
                    content: postContent,
                  });
                  setPostTitle('');
                  setPostContent('');
                  showToast('Đã gửi lên Vườn Sen Đồng Tu!');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] font-bold text-xs sm:text-sm cursor-pointer"
              >
                Gửi Vào Vườn Sen Đồng Tu
              </button>
            </div>

            <div className="space-y-3">
              {isLoadingRecords ? (
                <div className="p-4 text-center text-xs text-[#6B533B]">Đang tải...</div>
              ) : (
                records.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#8C5500]">{r.author_name}</span>
                        <h4 className="font-serif font-bold text-sm text-[#2C1E10]">{r.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          playBellSound(0.25);
                          setRecords((prev) =>
                            prev.map((x) =>
                              x.id === r.id ? { ...x, likes_count: Number(x.likes_count || 0) + 1 } : x
                            )
                          );
                          await fetch('/api/dharma/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ resource: 'feature_like', id: r.id }),
                          });
                        }}
                        className="px-3 py-1 rounded-full bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <span>🪷 Tặng Sen ({r.likes_count || 1})</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2C1E10] leading-relaxed">{r.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TOOL 10: ÂM THANH TẦN SỐ CHỮA LÀNH (HZ) & VIDEO GIỌNG ĐỌC KINH       */}
        {/* ------------------------------------------------------------------- */}
        {activeTool === 'nhac-tu-tap' && (
          <div className="space-y-5">
            {/* Section A: Pure Hz Healing Frequency Synthesizer */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500]">
                    Sóng Âm Tần Số Chuẩn Hz (Thư Giãn Thần Kinh)
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10]">
                    {activeHzTrack.freqLabel} — {activeHzTrack.title}
                  </h3>
                  <p className="text-xs text-[#6B533B] mt-0.5">{activeHzTrack.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {HZ_HEALING_TRACKS.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => {
                      setActiveHzTrack(tr);
                      if (isHzPlaying) {
                        startHealingDrone(tr.droneMode, 0.32);
                      }
                    }}
                    className={cn(
                      'p-3 rounded-xl border text-center cursor-pointer transition-all',
                      activeHzTrack.id === tr.id
                        ? 'bg-[#FFF6DF] border-[#D9A02E] text-[#2C1E10] font-bold shadow-2xs'
                        : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                    )}
                  >
                    <div className="font-serif font-bold text-sm text-[#8C5500]">{tr.freqLabel}</div>
                    <div className="text-[10px] truncate mt-0.5">{tr.title}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isHzPlaying;
                    setIsHzPlaying(next);
                    if (next) {
                      startHealingDrone(activeHzTrack.droneMode, 0.32);
                      playBellSound(0.4);
                    } else {
                      stopHealingDrone();
                    }
                  }}
                  className={cn(
                    'flex-1 py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap',
                    isHzPlaying
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-[#FFE07D] via-[#F5C542] to-[#E5A91C] text-[#3D2505] shadow-sm'
                  )}
                >
                  {isHzPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>
                    {isHzPlaying
                      ? `Đang Phát Sóng Âm ${activeHzTrack.freqLabel} Trực Tiếp`
                      : `Bật Sóng Âm Chữa Lành ${activeHzTrack.freqLabel}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Section B: Gentle Sutra Chanting Videos & Voice Recitation */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAD7A7] space-y-4 shadow-2xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5500]">
                  Video &amp; Pháp Âm Giọng Đọc Kinh Nhẹ Nhàng
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1E10]">
                  {activeChantVid.title}
                </h3>
                <p className="text-xs text-[#6B533B]">{activeChantVid.subtitle}</p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {GENTLE_CHANTING_VIDEOS.map((vid) => (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setActiveChantVid(vid)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer',
                      activeChantVid.id === vid.id
                        ? 'bg-[#FFE07D] border-[#D9A02E] text-[#3D2505]'
                        : 'bg-[#FAF7F0] border-[#EAD7A7] text-[#6B533B]'
                    )}
                  >
                    {vid.title.split('—')[0].trim()}
                  </button>
                ))}
              </div>

              {/* Embedded Calming Video Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#EAD7A7] bg-[#FAF5E6]">
                <iframe
                  src={`https://www.youtube.com/embed/${activeChantVid.youtubeId}?rel=0`}
                  title={activeChantVid.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Built-in Gentle Voice Recitation + 432Hz Offline Option */}
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EAD7A7] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#8C5500]">
                    Lời Kinh Trì Tụng (Có thể bật giọng đọc êm dịu trực tiếp):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeechPlaying) {
                        setIsSpeechPlaying(false);
                        stopHealingDrone();
                        window.speechSynthesis?.cancel();
                        return;
                      }
                      setIsSpeechPlaying(true);
                      startHealingDrone('432', 0.2);
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const u = new SpeechSynthesisUtterance(activeChantVid.chantText);
                        u.lang = 'vi-VN';
                        u.rate = 0.82;
                        u.onend = () => {
                          setIsSpeechPlaying(false);
                          stopHealingDrone();
                        };
                        window.speechSynthesis.speak(u);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF6DF] border border-[#E5C67E] text-[#7A5000] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {isSpeechPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Radio className="w-3.5 h-3.5" />}
                    <span>{isSpeechPlaying ? 'Dừng Đọc Kinh' : 'Nghe Giọng Đọc + 432Hz'}</span>
                  </button>
                </div>
                <p className="font-serif text-sm text-[#2C1E10] leading-relaxed">
                  {activeChantVid.chantText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

