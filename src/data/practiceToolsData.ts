import type { AncestralMemorial, MalaMaterial, MalaSize } from '@/store/useDharmaStore';
import { SUTRAS_DATA } from './sutras';

// =============================================================================
// TOOL 02: ĐI CHÙA — CHÁNH ĐIỆN TAM BẢO
// =============================================================================
export const SANGHA_PRESENCE_FEED = [
  'Phật tử Diệu Âm vừa dâng hương cầu bình an cho gia đạo',
  'Cư sĩ Minh Tâm vừa đảnh lễ Tam Bảo trọn vẹn 3 lạy',
  'Đạo hữu Ngọc Liên vừa dâng hoa sen thanh tịnh nơi Phật Đài',
  'Phật tử Quảng Đức vừa thỉnh Đại Hồng Chung niệm danh hiệu Phật',
  'Cư sĩ Thiện Hiền vừa gieo quẻ Kinh Pháp Cú sáng hôm nay',
  'Phật tử Liên Hoa vừa tụng xong 1 biến Tâm Kinh Hồi Hướng',
];

export const INCENSE_PRAYER_VERSE =
  'Nguyện đem lòng thành kính, gửi theo đám mây hương, phảng phất khắp mười phương, cúng dường ngôi Tam Bảo. Thề trọn đời giữ đạo, theo tự tánh làm lành, cùng pháp giới chúng sinh, cầu Phật từ gia hộ, tâm Bồ Đề kiên cố, chí tu học vững bền, xa bể khổ nguồn mê, chóng quay về bờ Giác.';

export const PROSTRATION_STEPS = [
  {
    step: 1,
    title: 'Lạy thứ nhất: Nhất tâm đảnh lễ Quy Y Phật',
    pali: 'Namo Buddhāya',
    prayer:
      'Đệ tử thành tâm quy y Phật, bậc Đạo Sư vẹn toàn trí tuệ và từ bi, nguyện noi gương Ngài giữ tâm tỉnh thức giữa đời thường.',
  },
  {
    step: 2,
    title: 'Lạy thứ hai: Nhất tâm đảnh lễ Quy Y Pháp',
    pali: 'Namo Dhammāya',
    prayer:
      'Đệ tử thành tâm quy y Pháp, con đường chuyển hóa khổ đau thành an lạc, nguyện lắng nghe, thực tập Chánh Pháp mỗi ngày.',
  },
  {
    step: 3,
    title: 'Lạy thứ ba: Nhất tâm đảnh lễ Quy Y Tăng',
    pali: 'Namo Saṅghāya',
    prayer:
      'Đệ tử thành tâm quy y Tăng, đoàn thể thanh tịnh hòa hợp, nguyện sống hiền hòa, khiêm cung và nâng đỡ nhau trên đường thiện.',
  },
];

// =============================================================================
// TOOL 03: CẦU SIÊU & CẦU AN — CHÂN NGÔN HỒI HƯỚNG
// =============================================================================
export const TABLET_MANTRAS = {
  vangSanh: {
    id: 'vang-sanh',
    title: 'Chú Vãng Sanh (Bạt Nhất Thiết Nghiệp Chướng Căn Bản Đắc Sinh Tịnh Độ Đà La Ni)',
    shortTitle: 'Chú Vãng Sanh',
    targetCycles: 21,
    phonetic:
      'Nam mô a di đa bà dạ,\nĐa tha già đa dạ,\nĐa địa dạ tha.\nA di rị đô bà tỳ,\nA di rị đa tất đam bà tỳ,\nA di rị đa tỳ ca lan đế,\nA di rị đa tỳ ca lan đa,\nGià di nị già già na,\nChỉ đa ca lệ ta bà ha.',
    meaning:
      'Đà-la-ni thanh tịnh giúp hương linh dứt trừ nghiệp chướng căn bản, nương oai lực từ bi của Đức Phật A Di Đà sớm sinh về cõi Cực Lạc an lành.',
  },
  duocSu: {
    id: 'duoc-su-chu',
    title: 'Dược Sư Quán Đảnh Chân Ngôn (Cầu An Tiêu Tai Diên Thọ)',
    shortTitle: 'Chú Dược Sư',
    targetCycles: 21,
    phonetic:
      'Nam mô bạc già phạt đế,\nBệ sát xã, lũ rô thích lưu ly,\nBát lạt bà, hát ra xà dã,\nĐát tha yết đa da, a ra hát đế, tam miệu tam bột đà da.\nĐát điệt tha:\nÁn, bệ sát thệ, bệ sát thệ,\nBệ sát xã, tam một yết đế ta ha.',
    meaning:
      'Thần chú Đức Phật Dược Sư Lưu Ly Quang Vương gia hộ cho thân tâm gia quyến hiện tiền an khang, tiêu trừ bệnh khổ và tăng trưởng phước thọ.',
  },
};

// =============================================================================
// TOOL 04: MÁY NIỆM PHẬT — 8 PHÁP ÂM NIỆM PHẬT & TRÌ CHÚ
// =============================================================================
export interface ChantBoxTrack {
  id: string;
  soundMotifId: string;
  title: string;
  subtitle: string;
  syllables: string[];
  baseBpm: number;
  vowNote: string;
}

export const CHANT_MACHINE_TRACKS: ChantBoxTrack[] = [
  {
    id: 'a-di-da-6',
    soundMotifId: 'a-di-da-6',
    title: 'Nam Mô A Di Đà Phật',
    subtitle: 'Nhịp 6 chữ truyền thống',
    syllables: ['Nam', 'Mô', 'A', 'Di', 'Đà', 'Phật'],
    baseBpm: 72,
    vowNote: 'Thanh âm chậm rãi, trầm ấm đưa tâm trở về nương tựa Đức Phật Vô Lượng Quang.',
  },
  {
    id: 'a-di-da-4',
    soundMotifId: 'a-di-da-4',
    title: 'A Di Đà Phật',
    subtitle: 'Nhịp 4 chữ Tịnh Độ chuyên tu',
    syllables: ['A', 'Di', 'Đà', 'Phật'],
    baseBpm: 88,
    vowNote: 'Nhịp 4 chữ gọn rõ dễ nhiếp tâm liên tục khi đi, đứng, nằm, ngồi.',
  },
  {
    id: 'thich-ca',
    soundMotifId: 'thich-ca',
    title: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    subtitle: 'Hồng danh Bậc Đạo Sư Giác Ngộ',
    syllables: ['Nam', 'Mô', 'Bổn', 'Sư', 'Thích', 'Ca', 'Mâu', 'Ni', 'Phật'],
    baseBpm: 70,
    vowNote: 'Tưởng niệm ân đức Đức Từ Phụ khai mở con đường Bát Chánh Đạo.',
  },
  {
    id: 'quan-am',
    soundMotifId: 'quan-am',
    title: 'Nam Mô Quán Thế Âm Bồ Tát',
    subtitle: 'Nhịp Đại Bi thanh thoát',
    syllables: ['Nam', 'Mô', 'Quán', 'Thế', 'Âm', 'Bồ', 'Tát'],
    baseBpm: 72,
    vowNote: 'Lắng nghe bằng trái tim không thành kiến, xoa dịu lo âu phiền muộn.',
  },
  {
    id: 'duoc-su',
    soundMotifId: 'duoc-su',
    title: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    subtitle: 'Cầu an khang & tiêu trừ bệnh khổ',
    syllables: ['Nam', 'Mô', 'Dược', 'Sư', 'Lưu', 'Ly', 'Quang', 'Vương', 'Phật'],
    baseBpm: 70,
    vowNote: 'Ánh sáng Lưu Ly thanh tịnh chữa lành thân bệnh và tâm bệnh.',
  },
  {
    id: 'dia-tang',
    soundMotifId: 'dia-tang',
    title: 'Nam Mô Địa Tạng Vương Bồ Tát',
    subtitle: 'Đại nguyện hiếu hạnh & cứu độ',
    syllables: ['Nam', 'Mô', 'Địa', 'Tạng', 'Vương', 'Bồ', 'Tát'],
    baseBpm: 68,
    vowNote: 'Phát khởi hiếu tâm sâu dày, hồi hướng cửu huyền thất tổ.',
  },
  {
    id: 'luc-tu',
    soundMotifId: 'luc-tu',
    title: 'Án Ma Ni Bát Di Hồng',
    subtitle: 'Om Mani Padme Hum (Lục Tự Đại Minh)',
    syllables: ['Om', 'Ma', 'Ni', 'Pad', 'Me', 'Hum'],
    baseBpm: 66,
    vowNote: 'Thanh tịnh sáu cõi tâm thức, khai mở viên ngọc từ bi và trí tuệ.',
  },
  {
    id: 'chu-dai-bi',
    soundMotifId: 'chu-dai-bi',
    title: 'Chú Đại Bi Tâm Đà La Ni',
    subtitle: 'Nhịp trì tụng hộ trì chánh niệm',
    syllables: ['Nam', 'Mô', 'Hắc', 'Ra', 'Đát', 'Na', 'Đa', 'Ra', 'Dạ', 'Da'],
    baseBpm: 92,
    vowNote: 'Nhịp trì tụng đều đặn giúp tâm định tĩnh, buông xả vọng tưởng.',
  },
];

// =============================================================================
// TOOL 05: NGHE KINH OFFLINE — 10 BÀI KINH, MẬT CHÚ, PHÁP THOẠI & NHẠC THIỀN
// =============================================================================
export type OfflineAudioCategory =
  | 'Kinh Nhật Tụng'
  | 'Mật Chú Đà La Ni'
  | 'Pháp Thoại Chuyển Hóa'
  | 'Nhạc Thiền Tịnh Tâm';

export const OFFLINE_AUDIO_CATEGORIES: Array<'Tất cả' | OfflineAudioCategory> = [
  'Tất cả',
  'Kinh Nhật Tụng',
  'Mật Chú Đà La Ni',
  'Pháp Thoại Chuyển Hóa',
  'Nhạc Thiền Tịnh Tâm',
];

export interface OfflineAudioTrack {
  id: string;
  title: string;
  tradition: string;
  durationSec: number;
  category: OfflineAudioCategory;
  summary: string;
  baseFreq: number;
  cadenceNotes: number[];
  transcriptParagraphs: string[];
}

function getSutraParagraphs(slug: string): string[] {
  const found = SUTRAS_DATA.find((s) => s.slug === slug);
  if (!found) return [];
  const all: string[] = [];
  all.push(...found.khaiKinh.paragraphs);
  for (const sec of found.toanVan) {
    all.push(`【${sec.title}】`);
    all.push(...sec.paragraphs);
  }
  all.push(...found.hoiHuong.paragraphs);
  return all;
}

export const OFFLINE_SUTRA_AUDIO_TRACKS: OfflineAudioTrack[] = [
  {
    id: 'audio-bat-nha',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh (Trì Tụng Chậm)',
    tradition: 'Hệ phái Bắc Tông • Thiền Viện Trúc Lâm',
    durationSec: 180,
    category: 'Kinh Nhật Tụng',
    summary: '260 chữ cốt tủy Bát Nhã giúp soi rọi năm uẩn đều không, độ thoát khổ ách.',
    baseFreq: 136.1,
    cadenceNotes: [261.63, 293.66, 329.63, 392, 329.63],
    transcriptParagraphs: getSutraParagraphs('bat-nha'),
  },
  {
    id: 'audio-phap-cu',
    title: 'Kinh Pháp Cú Tuyển Tập — Ý Dẫn Đầu Các Pháp',
    tradition: 'Hệ phái Nam Tông • Hòa Thượng Thích Minh Châu dịch',
    durationSec: 210,
    category: 'Kinh Nhật Tụng',
    summary: 'Lời dạy mộc mạc nguyên thủy của Đức Phật Thích Ca về làm chủ tâm ý.',
    baseFreq: 144,
    cadenceNotes: [220, 261.63, 293.66, 329.63, 261.63],
    transcriptParagraphs: getSutraParagraphs('phap-cu'),
  },
  {
    id: 'audio-a-di-da',
    title: 'Phật Thuyết A Di Đà Kinh (Thời Tụng Buổi Chiều)',
    tradition: 'Tịnh Độ Tông • Nghi thức Thiền Môn Việt Nam',
    durationSec: 240,
    category: 'Kinh Nhật Tụng',
    summary: 'Khai thị cõi Tịnh Độ trang nghiêm, nuôi dưỡng tín - nguyện - hạnh kiên cố.',
    baseFreq: 136.1,
    cadenceNotes: [261.63, 293.66, 329.63, 392, 440, 392],
    transcriptParagraphs: getSutraParagraphs('a-di-da'),
  },
  {
    id: 'audio-chu-dai-bi',
    title: 'Chú Đại Bi Tâm Đà La Ni (Nhịp Tụng 7 Biến)',
    tradition: 'Hệ phái Bắc Tông • Pháp âm Cổ Tự',
    durationSec: 195,
    category: 'Mật Chú Đà La Ni',
    summary: 'Thiên Thủ Thiên Nhãn Vô Ngại Đại Bi Tâm Đà La Ni gia trì bình an.',
    baseFreq: 174,
    cadenceNotes: [246.94, 293.66, 329.63, 392, 329.63, 293.66],
    transcriptParagraphs: getSutraParagraphs('dai-bi'),
  },
  {
    id: 'audio-chu-duoc-su',
    title: 'Dược Sư Quán Đảnh Chân Ngôn & 12 Đại Nguyện',
    tradition: 'Dược Sư Lưu Ly Pháp Môn',
    durationSec: 200,
    category: 'Mật Chú Đà La Ni',
    summary: 'Ánh sáng Lưu Ly thanh tịnh cầu an khang, tiêu trừ tật bệnh thân tâm.',
    baseFreq: 174,
    cadenceNotes: [261.63, 329.63, 392, 440, 392, 329.63],
    transcriptParagraphs: getSutraParagraphs('duoc-su'),
  },
  {
    id: 'audio-luc-tu',
    title: 'Lục Tự Đại Minh Chân Ngôn — Om Mani Padme Hum',
    tradition: 'Mật Tông Tạng Truyền & Đại Thừa',
    durationSec: 180,
    category: 'Mật Chú Đà La Ni',
    summary: 'Sáu âm tiết thanh tịnh chuyển hóa tham sân si thành trí tuệ từ bi.',
    baseFreq: 136.1,
    cadenceNotes: [220, 261.63, 293.66, 329.63, 293.66, 220],
    transcriptParagraphs: [
      'Om (Án): Thanh tịnh hóa thân khẩu ý kiêu mạn, mở đầu con đường Bồ Đề.',
      'Ma (Ma): Tiêu trừ tâm ghen tị và hiếu thắng, nuôi dưỡng lòng tùy hỷ.',
      'Ni (Ni): Chuyển hóa tham ái luyến chấp, khơi nguồn thanh thản.',
      'Pad (Bát): Dứt trừ si mê cố chấp, soi sáng nhân duyên.',
      'Me (Di): Chuyển hóa tâm bỏn xẻn tham lam thành đức hạnh bố thí.',
      'Hum (Hồng): Thanh lọc sân hận nóng giận, hoàn thành trí tuệ viên dung.',
    ],
  },
  {
    id: 'audio-phap-thoai-buong-xa',
    title: 'Pháp Thoại: Buông Bỏ Lo Âu Để Sống Trọn Phút Này',
    tradition: 'Thiền Viện Trúc Lâm • Bài giảng Chánh Niệm',
    durationSec: 220,
    category: 'Pháp Thoại Chuyển Hóa',
    summary: 'Hướng dẫn nhận diện cơn lo âu bằng hơi thở có ý thức trong công việc hằng ngày.',
    baseFreq: 162,
    cadenceNotes: [261.63, 293.66, 329.63, 293.66],
    transcriptParagraphs: [
      'Phần 1 — Nỗi khổ không nằm ở hoàn cảnh, mà nằm ở tâm kháng cự hoàn cảnh.',
      'Khi một việc bất như ý xảy ra, mũi tên thứ nhất là sự việc khách quan; mũi tên thứ hai do chính ta tự bắn vào mình bằng sự oán trách và lo sợ tương lai.',
      'Phần 2 — Thực tập ba hơi thở trở về: Hít vào, ta biết mình đang còn sống trong giây phút hiện tại. Thở ra, ta mỉm cười buông lỏng đôi vai.',
      'Đừng tìm kiếm một đời sống không có giông bão; hãy rèn một nội tâm vững chãi giữa sóng gió nhân sinh.',
    ],
  },
  {
    id: 'audio-phap-thoai-hieu-hanh',
    title: 'Pháp Thoại: Hai Vị Phật Tại Gia — Đạo Hiếu Trong Đời Sống',
    tradition: 'Giảng đường Vu Lan Báo Hiếu',
    durationSec: 215,
    category: 'Pháp Thoại Chuyển Hóa',
    summary: 'Cha mẹ hiện tiền chính là hai vị Phật sống trong ngôi nhà mỗi người.',
    baseFreq: 162,
    cadenceNotes: [220, 261.63, 329.63, 293.66],
    transcriptParagraphs: [
      'Kinh Tăng Chi Bộ dạy rằng: Cha mẹ chính là Phạm Thiên, là bậc Đạo Sư đầu tiên và xứng đáng nhận sự phụng dưỡng tối thắng của con cái.',
      'Báo hiếu không phải đợi đến ngày giỗ chạp mới làm mâm cao cỗ đầy, mà là lời nói dịu dàng hôm nay khi cha mẹ vẫn còn nghe thấy.',
      'Nếu cha mẹ còn hiện tiền, hãy hỏi thăm, kiên nhẫn lắng nghe và hướng dẫn song thân biết quy hướng điều thiện lành.',
      'Nếu cha mẹ đã quá vãng, hãy sống tử tế, giữ năm giới trong sạch và hồi hướng công đức cho cửu huyền thất tổ siêu sanh Tịnh Cảnh.',
    ],
  },
  {
    id: 'audio-nhac-432hz',
    title: 'Sóng Âm Chuông Xoay Tịnh Tâm 432Hz & Tiếng Mõ Đường Thiền',
    tradition: 'Âm Thanh Trị Liệu Thiền Tự',
    durationSec: 240,
    category: 'Nhạc Thiền Tịnh Tâm',
    summary: 'Hòa âm tần số 432Hz cùng tiếng chuông đồng ngân nhẹ giúp dễ vào thiền định.',
    baseFreq: 108,
    cadenceNotes: [216, 324, 432, 324, 216],
    transcriptParagraphs: [
      'Hướng dẫn thực hành cùng sóng âm 432Hz:',
      '1. Ngồi thẳng lưng thả lỏng hai vai, đặt nhẹ hai bàn tay lên đùi.',
      '2. Nhắm mắt hờ hoặc nhìn xuống cách mũi 1 mét.',
      '3. Đếm nhịp thở tự nhiên từ 1 đến 10 rồi quay lại từ đầu, mỗi lần nghe tiếng chuông đồng ngân lên hãy nhẹ nhàng mỉm cười thư giãn.',
    ],
  },
  {
    id: 'audio-nhac-dem-an-giac',
    title: 'Thiền Buông Thư Đêm Khuya — Hồi Hướng An Giấc (136.1Hz)',
    tradition: 'Tần số Om Vũ Trụ • Chánh Niệm Trước Giờ Ngủ',
    durationSec: 210,
    category: 'Nhạc Thiền Tịnh Tâm',
    summary: 'Xả bỏ mọi toan tính ban ngày, đưa thân tâm vào giấc ngủ bình an không mộng mị.',
    baseFreq: 136.1,
    cadenceNotes: [204.15, 272.2, 340.25, 272.2],
    transcriptParagraphs: [
      'Trước khi chìm vào giấc ngủ, hãy gửi lòng biết ơn đến từng tế bào cơ thể đã nâng đỡ ta suốt một ngày.',
      'Tha thứ cho những lỡ lầm của chính mình và của người khác trong ngày hôm nay.',
      'Khởi niệm từ bi: Nguyện cho hết thảy chúng sinh đều được an ngủ trong vòng tay bình yên.',
    ],
  },
];

// =============================================================================
// TOOL 06: TRÀNG HẠT — CHẤT LIỆU & QUY MÔ VÒNG
// =============================================================================
export interface MalaMaterialOption {
  id: MalaMaterial;
  name: string;
  subtitle: string;
  gradient: string;
  activeGradient: string;
  ringColor: string;
  textColor: string;
}

export const MALA_MATERIALS: MalaMaterialOption[] = [
  {
    id: 'bo-de',
    name: 'Hạt Bồ Đề Tâm',
    subtitle: 'Gỗ vàng ấm cổ truyền',
    gradient:
      'radial-gradient(circle at 32% 28%, #FFFBEB 0%, #FDE68A 22%, #D97706 58%, #78350F 100%)',
    activeGradient:
      'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #FEF08A 24%, #F59E0B 56%, #B45309 100%)',
    ringColor: 'ring-[#F59E0B]',
    textColor: 'text-[#8C5500]',
  },
  {
    id: 'tram-huong',
    name: 'Gỗ Trầm Hương Cổ Thụ',
    subtitle: 'Nâu trầm tĩnh tại',
    gradient:
      'radial-gradient(circle at 32% 28%, #E7D5C4 0%, #9A6B4C 26%, #5C3A21 62%, #2B180B 100%)',
    activeGradient:
      'radial-gradient(circle at 32% 28%, #FDE68A 0%, #B47B56 26%, #7C4D2B 60%, #3E220F 100%)',
    ringColor: 'ring-[#8C5500]',
    textColor: 'text-[#5A3A1E]',
  },
  {
    id: 'luu-ly',
    name: 'Ngọc Lưu Ly Dược Sư',
    subtitle: 'Xanh lam thanh tịnh',
    gradient:
      'radial-gradient(circle at 32% 28%, #E0F2FE 0%, #60A5FA 28%, #1D4ED8 66%, #1E3A8A 100%)',
    activeGradient:
      'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #93C5FD 26%, #2563EB 60%, #1E40AF 100%)',
    ringColor: 'ring-blue-500',
    textColor: 'text-blue-800',
  },
  {
    id: 'bach-ngoc',
    name: 'Bạch Ngọc Quán Âm',
    subtitle: 'Trắng ngọc thanh khiết',
    gradient:
      'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F8F4EA 40%, #E7DCC6 76%, #BFA980 100%)',
    activeGradient:
      'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #FFFBEB 42%, #FDE68A 78%, #D97706 100%)',
    ringColor: 'ring-amber-400',
    textColor: 'text-[#7A5A20]',
  },
];

export const MALA_SIZES: MalaSize[] = [18, 27, 54, 108];

export interface MalaDeityPreset {
  id: string;
  name: string;
  mantra: string;
  vow: string;
}

export const MALA_DEITY_PRESETS: MalaDeityPreset[] = [
  {
    id: 'a-di-da',
    name: 'Đức Phật A Di Đà',
    mantra: 'Nam Mô A Di Đà Phật',
    vow: 'Nguyện sanh Tây Phương Tịnh Độ trung, Cửu phẩm liên hoa vi phụ mẫu.',
  },
  {
    id: 'quan-am',
    name: 'Bồ Tát Quán Thế Âm',
    mantra: 'Nam Mô Quán Thế Âm Bồ Tát',
    vow: 'Lắng nghe tiếng khổ thế gian, ban vui cứu khổ muôn loài.',
  },
  {
    id: 'thich-ca',
    name: 'Đức Phật Thích Ca Mâu Ni',
    mantra: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    vow: 'Nương tựa ánh sáng Chánh Pháp, tỉnh thức trong từng hơi thở.',
  },
  {
    id: 'duoc-su',
    name: 'Đức Phật Dược Sư Lưu Ly',
    mantra: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    vow: 'Ánh sáng Lưu Ly thanh tịnh tiêu trừ bệnh khổ thân tâm.',
  },
  {
    id: 'dia-tang',
    name: 'Bồ Tát Địa Tạng Vương',
    mantra: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vow: 'Địa ngục vị không thệ bất thành Phật, chúng sanh độ tận phương chứng Bồ Đề.',
  },
  {
    id: 'luc-tu',
    name: 'Lục Tự Đại Minh Chân Ngôn',
    mantra: 'Án Ma Ni Bát Di Hồng (Om Mani Padme Hum)',
    vow: 'Thanh tịnh sáu cõi tâm thức, khai mở viên ngọc từ bi và trí tuệ.',
  },
];

// =============================================================================
// TOOL 07: CHUÔNG MÕ — ÂM SẮC & KINH NHẬT TỤNG NHỎ
// =============================================================================
export const BELL_TIMBRE_OPTIONS = [
  { id: 'hue' as const, label: 'Chuông Gia Trì Huế', desc: 'Trong sáng, thanh thoát' },
  { id: 'co-tu' as const, label: 'Đại Hồng Chung Cổ Tự', desc: 'Trầm hùng, uy nghiêm' },
  { id: 'xoay' as const, label: 'Chuông Xoay Tịnh Tâm', desc: 'Ngân dài sâu lắng' },
];

export const WOODFISH_TIMBRE_OPTIONS = [
  { id: 'go-mit' as const, label: 'Mõ Gỗ Mít Cổ Truyền', desc: 'Trầm ấm, dày tiếng' },
  { id: 'bac-tong' as const, label: 'Mõ Tụng Kinh Bắc Tông', desc: 'Rõ nhịp tụng kinh' },
  { id: 'thien-duong' as const, label: 'Mõ Thiền Đường', desc: 'Thanh nhẹ giữ tỉnh thức' },
];

export function getMiniSutraTeleprompterItems() {
  const slugs = ['bat-nha', 'dai-bi', 'vu-lan-sam-hoi', 'a-di-da'];
  return slugs
    .map((slug) => {
      const s = SUTRAS_DATA.find((item) => item.slug === slug);
      if (!s) return null;
      return {
        slug: s.slug,
        title: s.title,
        lines: [
          ...s.khaiKinh.paragraphs,
          ...s.toanVan.flatMap((sec) => [`【${sec.title}】`, ...sec.paragraphs]),
          ...s.hoiHuong.paragraphs,
        ],
      };
    })
    .filter((item): item is { slug: string; title: string; lines: string[] } => item !== null);
}

// =============================================================================
// TOOL 08: SỔ GIỖ CHẠP — VĂN KHẤN & MÂM CỖ CHAY CÚNG GIỖ
// =============================================================================
export interface VegetarianMemorialMenu {
  id: string;
  title: string;
  style: string;
  dishes: string[];
  soupAndDessert: string;
  teaOffering: string;
  meaningNote: string;
}

export const VEGETARIAN_MEMORIAL_MENUS: VegetarianMemorialMenu[] = [
  {
    id: 'truyen-thong',
    title: 'Mâm Cỗ Chay Truyền Thống Ba Miền',
    style: 'Ấm cúng sum vầy gia tiên',
    dishes: [
      'Xôi gấc đỗ xanh hoặc Xôi vò hạt sen thanh khiết',
      'Nem chay rán giòn nấm hương mộc nhĩ',
      'Giò lụa chay kho tiêu nước tương',
      'Đậu hũ non sốt nấm đông cô cải thìa',
      'Gỏi ngó sen ngũ sắc thanh mát',
    ],
    soupAndDessert: 'Canh kiểm / Canh nấm rong biển đậu hũ • Chè trôi nước hoặc Chè đậu xanh',
    teaOffering: 'Trà sen Tây Hồ & Trái cây ngũ quả',
    meaningNote: 'Dâng lên trọn vẹn hương vị quê hương thanh tịnh, không sát sinh tạo thêm nghiệp mới.',
  },
  {
    id: 'thanh-dam',
    title: 'Mâm Cỗ Chay Thanh Đạm Tại Gia',
    style: 'Tinh giản, nhẹ nhàng, dễ nấu chuẩn bị',
    dishes: [
      'Cơm trắng gạo tám thơm hoặc Cơm gạo lứt mè đen',
      'Rau củ luộc thập cẩm chấm chao hoặc muối vừng',
      'Nấm đùi gà kho tộ tiêu xanh',
      'Đậu hũ chiên sả ớt vàng ươm',
    ],
    soupAndDessert: 'Canh chua chay dọc mùng đậu bắp • Chè hạt sen long nhãn',
    teaOffering: 'Trà hoa cúc vàng & Nước lọc tinh khiết',
    meaningNote: 'Phù hợp gia đình bận rộn nhưng giữ trọn tâm thành thanh khiết ngày kỵ nhật.',
  },
  {
    id: 'cung-dinh-hue',
    title: 'Mâm Cỗ Chay Cung Đình Cố Đô Huế',
    style: 'Trang trọng, tinh tế lễ giỗ lớn',
    dishes: [
      'Cơm hấp lá sen ngũ sắc hạt sen Huế',
      'Bánh ít trần chay nhân đậu xanh nấm mèo',
      'Chả phượng chay từ tàu hũ ky & củ sen',
      'Mít non kho nước dừa đậm đà',
      'Vả trộn mè rang thanh vị',
    ],
    soupAndDessert: 'Canh măng tươi nấm bào ngư • Chè hạt sen bọc nhãn lồng',
    teaOffering: 'Trà cung đình thảo mộc & Hương trầm thanh tịnh',
    meaningNote: 'Thể hiện sự cung kính tối đa dành cho ông bà tổ tiên bằng lễ vật thanh tịnh bậc nhất.',
  },
];

export const KISITIGARBHA_VEGETARIAN_TEACHING =
  'Kinh Địa Tạng Bổn Nguyện — Phẩm Thứ Bảy (Lợi Ích Kẻ Còn Người Mất) dạy rằng: Trong ngày trai kỵ hoặc lễ tưởng niệm người thân đã khuất, con cháu tuyệt đối không nên sát hại sanh linh làm cỗ mặn cúng tế. Sát sanh chỉ tăng thêm duyên nghiệp nặng nề cho hương linh và gia quyến. Ngược lại, dùng lễ vật chay tịnh cúng dường Tam Bảo, bố thí phóng sanh và chuyên tâm tụng kinh niệm Phật sẽ giúp người mất được siêu thoát nhẹ nhàng, người sống hưởng phước báu trọn vẹn.';

export function generateMemorialPrayer(
  memorial: AncestralMemorial,
  solarDateLabel: string,
  milestoneLabel: string,
  practitionerDharmaName: string
): string {
  const dharmaTitle = memorial.dharmaName ? ` (Pháp danh: ${memorial.dharmaName})` : '';
  return [
    'NAM MÔ A DI ĐÀ PHẬT (3 lần)',
    '',
    'Con kính lạy mười phương Chư Phật, Chư Tôn Bồ Tát, Chư Hiền Thánh Tăng.',
    'Con kính lạy Đức Đại Nguyện Địa Tạng Vương Bồ Tát chứng minh gia hộ.',
    'Con kính lạy Cửu Huyền Thất Tổ nội ngoại hai bên, chư vị Hương Linh Gia Tiên.',
    '',
    `Hôm nay là ngày ${String(memorial.lunarDeathDay).padStart(2, '0')} tháng ${String(memorial.lunarDeathMonth).padStart(2, '0')} Âm lịch (Dương lịch: ${solarDateLabel}), nhân ngày ${milestoneLabel ? milestoneLabel.toLowerCase() : 'kỵ nhật tưởng niệm'} của:`,
    `• ${memorial.relationship}: ${memorial.fullName}${dharmaTitle}.`,
    '',
    `Đệ tử con pháp danh ${practitionerDharmaName || 'Thiện Tâm'} cùng toàn thể con cháu trong gia đình thành tâm sắm sửa hương hoa, trà quả, mâm cơm chay thanh tịnh dâng lên án thờ, trước lễ Tam Bảo, sau kính mời hương linh ${memorial.relationship} cùng liệt vị gia tiên về thụ hưởng hương vị thanh tịnh.`,
    '',
    'Ngưỡng nguyện hồng ân Tam Bảo tiếp dẫn hương linh sớm tiêu trừ trần cấu, tâm không còn vướng bận, nương ánh sáng từ bi sinh về cõi Cực Lạc an lành. Xin gia tiên phù hộ độ trì cho con cháu đời nay biết hiếu thuận, giữ năm giới thanh tịnh, làm nhiều việc thiện lành để báo đáp thâm ân.',
    '',
    'NAM MÔ TIẾP DẪN ĐẠO SƯ A DI ĐÀ PHẬT (3 lần).',
  ].join('\n');
}

export interface DharmaPracticeCardSummary {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export const ORDERED_CORE_PRACTICE_TOOLS: DharmaPracticeCardSummary[] = [
  {
    id: 'thu-vien-bon-ton',
    title: 'Thư viện Bổn Tôn',
    subtitle: 'Chiêm bái chư Phật',
    image: '/images/dharma/tools/01-thu-vien-bon-ton.jpg',
    href: '/thu-vien-bon-ton',
  },
  {
    id: 'di-chua',
    title: 'Đi chùa',
    subtitle: 'Lễ Phật nơi chánh điện',
    image: '/images/dharma/tools/02-di-chua.jpg',
    href: '/thuc-hanh?phap-khi=di-chua',
  },
  {
    id: 'cau-sieu',
    title: 'Cầu siêu',
    subtitle: 'Thành tâm tưởng niệm',
    image: '/images/dharma/tools/03-cau-sieu.jpg',
    href: '/cau-sieu',
  },
  {
    id: 'may-niem-phat',
    title: 'Máy niệm Phật',
    subtitle: 'Niệm danh hiệu, trì chú',
    image: '/images/dharma/tools/04-may-niem-phat.jpg',
    href: '/thuc-hanh?phap-khi=may-niem-phat',
  },
  {
    id: 'nghe-kinh',
    title: 'Nghe kinh',
    subtitle: 'Nghe kinh không cần mạng',
    image: '/images/dharma/tools/05-nghe-kinh.jpg',
    href: '/thuc-hanh?phap-khi=nghe-kinh',
  },
  {
    id: 'trang-hat',
    title: 'Tràng hạt',
    subtitle: 'Lần hạt, trì niệm',
    image: '/images/dharma/tools/06-trang-hat.jpg',
    href: '/thuc-hanh?phap-khi=trang-hat',
  },
  {
    id: 'chuong-mo',
    title: 'Chuông mõ',
    subtitle: 'Thỉnh chuông, gõ mõ',
    image: '/images/dharma/tools/07-chuong-mo.jpg',
    href: '/thuc-hanh?phap-khi=chuong-mo',
  },
  {
    id: 'so-gio-chap',
    title: 'Sổ Giỗ Chạp',
    subtitle: 'Ghi nhớ ngày giỗ chạp',
    image: '/images/dharma/tools/08-so-gio-chap.jpg',
    href: '/thuc-hanh?phap-khi=so-gio-chap',
  },
];

export const NEW_DHARMA_PRACTICE_TOOLS: DharmaPracticeCardSummary[] = [
  {
    id: 'gieo-que-quan-am',
    title: 'Xin Xăm Quan Âm',
    subtitle: 'Giải quẻ từ bi & chánh kiến',
    image: '/images/dharma/tools/13-gieo-que-quan-am.jpg',
    href: '/thuc-hanh?phap-khi=gieo-que-quan-am',
  },
  {
    id: 'chep-kinh',
    title: 'Tả Kinh Tịnh Tâm',
    subtitle: 'Chép kinh rèn định lực',
    image: '/images/dharma/tools/14-chep-kinh.jpg',
    href: '/thuc-hanh?phap-khi=chep-kinh',
  },
  {
    id: 'sam-hoi-108',
    title: 'Sám Hối 108 Lạy',
    subtitle: 'Đảnh lễ 108 hồng danh Phật',
    image: '/images/dharma/tools/15-sam-hoi-108.jpg',
    href: '/thuc-hanh?phap-khi=sam-hoi-108',
  },
  {
    id: 'so-phong-sinh',
    title: 'Sổ Phóng Sinh',
    subtitle: 'Ghi chép công đức hộ sinh',
    image: '/images/dharma/tools/16-so-phong-sinh.jpg',
    href: '/thuc-hanh?phap-khi=so-phong-sinh',
  },
  {
    id: 'nhat-ky-thien-nghiep',
    title: 'Nhật Ký Thập Thiện',
    subtitle: 'Gieo 10 hạt giống lành',
    image: '/images/dharma/tools/17-nhat-ky-thien-nghiep.jpg',
    href: '/thuc-hanh?phap-khi=nhat-ky-thien-nghiep',
  },
  {
    id: 'bep-thien-chay',
    title: 'Bếp Thiền Chay',
    subtitle: 'Món chay thanh đạm dễ nấu',
    image: '/images/dharma/tools/18-bep-thien-chay.jpg',
    href: '/thuc-hanh?phap-khi=bep-thien-chay',
  },
  {
    id: 'tu-dien-phap-so',
    title: 'Từ Điển Pháp Số',
    subtitle: 'Tra cứu thuật ngữ Phật học',
    image: '/images/dharma/tools/19-tu-dien-phap-so.jpg',
    href: '/thuc-hanh?phap-khi=tu-dien-phap-so',
  },
  {
    id: 'cong-dong-hoi-huong',
    title: 'Vườn Sen Đồng Tu',
    subtitle: 'Tâm sự & hộ niệm chung',
    image: '/images/dharma/tools/20-cong-dong-hoi-huong.jpg',
    href: '/thuc-hanh?phap-khi=cong-dong-hoi-huong',
  },
];


