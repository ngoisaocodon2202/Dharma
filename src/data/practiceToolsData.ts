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
// =============================================================================
// TOOL 04: MÁY NIỆM PHẬT — DANH SÁCH 12 BÀI NIỆM & TRÌ CHÚ OM MANI CHUẨN
// =============================================================================
export interface ChantBoxTrack {
  id: string;
  soundMotifId: string;
  title: string;
  subtitle: string;
  devaName: string;
  avatarImage: string;
  heroImage: string;
  audioUrl: string;
  audioFallbackUrl?: string;
  speechText: string;
  syllables: string[];
  baseBpm: number;
  vowNote: string;
}

export const CHANT_MACHINE_TRACKS: ChantBoxTrack[] = [
  {
    id: 'a-di-da-4',
    soundMotifId: 'a-di-da-4',
    title: 'Niệm A Di Đà Phật',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/a-di-da-4-real.mp3',
    audioFallbackUrl: '/audio/chant/a-di-da-4.mp3',
    speechText: 'A Di Đà Phật. A Di Đà Phật. A Di Đà Phật.',
    syllables: ['A', 'Di', 'Đà', 'Phật'],
    baseBpm: 88,
    vowNote: 'Nhịp 4 chữ Tịnh Độ chuyên tu, nhiếp trọn sáu căn tịnh niệm tiếp nối.',
  },
  {
    id: 'a-di-da-6',
    soundMotifId: 'a-di-da-6',
    title: 'Niệm Nam Mô A Di Đà Phật',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/a-di-da-6-real.mp3',
    audioFallbackUrl: '/audio/chant/a-di-da-6.mp3',
    speechText: 'Nam Mô A Di Đà Phật. Nam Mô A Di Đà Phật.',
    syllables: ['Nam', 'Mô', 'A', 'Di', 'Đà', 'Phật'],
    baseBpm: 72,
    vowNote: 'Hồng danh 6 chữ khai mở đại nguyện vãng sinh Tây Phương Cực Lạc.',
  },
  {
    id: 'thich-ca',
    soundMotifId: 'thich-ca',
    title: 'Niệm Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    subtitle: 'Đức Phật Thích Ca Mâu Ni',
    devaName: 'Śākyamuni Buddha',
    avatarImage: '/images/buddhas/duc-phat-thich-ca.png',
    heroImage: '/images/buddhas/duc-phat-thich-ca.png',
    audioUrl: '/audio/chant/thich-ca-real.mp3',
    audioFallbackUrl: '/audio/chant/thich-ca.mp3',
    speechText: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật.',
    syllables: ['Nam', 'Mô', 'Bổn', 'Sư', 'Thích', 'Ca', 'Mâu', 'Ni', 'Phật'],
    baseBpm: 70,
    vowNote: 'Tưởng niệm ân đức Bậc Đạo Sư Thế Tôn, khai mở tuệ giác Bát Chánh Đạo.',
  },
  {
    id: 'quan-am',
    soundMotifId: 'quan-am',
    title: 'Niệm Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    subtitle: 'Quán Thế Âm Bồ Tát',
    devaName: 'Avalokiteśvara Bodhisattva',
    avatarImage: '/images/buddhas/quan-the-am-bo-tat.png',
    heroImage: '/images/buddhas/quan-the-am-bo-tat.png',
    audioUrl: '/audio/chant/quan-am-real.mp3',
    audioFallbackUrl: '/audio/chant/quan-am.mp3',
    speechText: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát.',
    syllables: ['Nam', 'Mô', 'Quán', 'Thế', 'Âm', 'Bồ', 'Tát'],
    baseBpm: 72,
    vowNote: 'Lắng nghe bằng trái tim không thành kiến, xoa dịu khổ đau muôn loài.',
  },
  {
    id: 'dai-the-chi',
    soundMotifId: 'dai-the-chi',
    title: 'Niệm Nam Mô Đại Thế Chí Bồ Tát',
    subtitle: 'Đại Thế Chí Bồ Tát',
    devaName: 'Mahāsthāmaprāpta Bodhisattva',
    avatarImage: '/images/buddhas/dai-the-chi-bo-tat.png',
    heroImage: '/images/buddhas/dai-the-chi-bo-tat.png',
    audioUrl: '/audio/chant/dai-the-chi-real.mp3',
    audioFallbackUrl: '/audio/chant/dai-the-chi.mp3',
    speechText: 'Nam Mô Đại Thế Chí Bồ Tát.',
    syllables: ['Nam', 'Mô', 'Đại', 'Thế', 'Chí', 'Bồ', 'Tát'],
    baseBpm: 72,
    vowNote: 'Ánh sáng trí tuệ soi chiếu mười phương, dắt dẫn chúng sinh lìa tam đồ.',
  },
  {
    id: 'dia-tang',
    soundMotifId: 'dia-tang',
    title: 'Niệm Nam Mô Địa Tạng Vương Bồ Tát',
    subtitle: 'Địa Tạng Vương Bồ Tát',
    devaName: 'Kṣitigarbha Bodhisattva',
    avatarImage: '/images/buddhas/dia-tang-vuong-bo-tat.png',
    heroImage: '/images/buddhas/dia-tang-vuong-bo-tat.png',
    audioUrl: '/audio/chant/dia-tang-real.mp3',
    audioFallbackUrl: '/audio/chant/dia-tang.mp3',
    speechText: 'Nam Mô Địa Tạng Vương Bồ Tát.',
    syllables: ['Nam', 'Mô', 'Địa', 'Tạng', 'Vương', 'Bồ', 'Tát'],
    baseBpm: 68,
    vowNote: 'Đại nguyện cứu độ khắp u minh, hiếu hạnh vẹn toàn giải thoát tội khổ.',
  },
  {
    id: 'duoc-su',
    soundMotifId: 'duoc-su',
    title: 'Niệm Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    subtitle: 'Đức Phật Dược Sư',
    devaName: 'Bhaiṣajyaguru Buddha',
    avatarImage: '/images/buddhas/duc-phat-duoc-su.png',
    heroImage: '/images/buddhas/duc-phat-duoc-su.png',
    audioUrl: '/audio/chant/duoc-su-real.mp3',
    audioFallbackUrl: '/audio/chant/duoc-su.mp3',
    speechText: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật.',
    syllables: ['Nam', 'Mô', 'Dược', 'Sư', 'Lưu', 'Ly', 'Quang', 'Vương', 'Phật'],
    baseBpm: 70,
    vowNote: 'Mười hai đại nguyện trị liệu thân tâm, tiêu trừ chướng bệnh, an lành thọ mạng.',
  },
  {
    id: 'om-mani',
    soundMotifId: 'luc-tu',
    title: 'OM MANI PADME HUM',
    subtitle: 'Quán Thế Âm Bồ Tát',
    devaName: 'Avalokiteśvara Bodhisattva',
    avatarImage: '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png',
    heroImage: '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png',
    audioUrl: '/audio/chant/om-mani-real.mp3',
    audioFallbackUrl: '/audio/chant/om-mani.mp3',
    speechText: 'Om Mani Padme Hum.',
    syllables: ['Om', 'Ma', 'Ni', 'Pad', 'Me', 'Hum'],
    baseBpm: 66,
    vowNote: 'Lục Tự Đại Minh thanh tịnh sáu nẻo luân hồi, khai nở hoa sen từ bi rực rỡ.',
  },
  {
    id: 'namo-ratna',
    soundMotifId: 'chu-dai-bi',
    title: 'NAMO RATNA TRAYAYA',
    subtitle: 'Quán Thế Âm Bồ Tát',
    devaName: 'Avalokiteśvara Bodhisattva',
    avatarImage: '/images/buddhas/quan-the-am-bo-tat.png',
    heroImage: '/images/buddhas/quan-the-am-bo-tat.png',
    audioUrl: '/audio/chant/namo-ratna-real.mp3',
    audioFallbackUrl: '/audio/chant/namo-ratna.mp3',
    speechText: 'Namo Ratna Trayaya Namo Arya Jnana Sagara.',
    syllables: ['Na', 'mo', 'Rat', 'na', 'Tra', 'ya', 'ya'],
    baseBpm: 76,
    vowNote: 'Khởi đầu thần chú Đại Bi quy kính Tam Bảo, triệu thỉnh uy lực chư Phật mười phương.',
  },
  {
    id: 'tayatha-bekandze',
    soundMotifId: 'duoc-su',
    title: 'TAYATHA OM BEKANDZE BEKANDZE MAHA BEKANDZE RADZA SAMUDGATE SOHA',
    subtitle: 'Đức Phật Dược Sư',
    devaName: 'Bhaiṣajyaguru Buddha',
    avatarImage: '/images/buddhas/duc-phat-duoc-su.png',
    heroImage: '/images/buddhas/duc-phat-duoc-su.png',
    audioUrl: '/audio/chant/tayatha-bekandze-real.mp3',
    audioFallbackUrl: '/audio/chant/tayatha-bekandze.mp3',
    speechText: 'Tayatha Om Bekandze Bekandze Maha Bekandze Radza Samudgate Soha.',
    syllables: ['Ta', 'ya', 'tha', 'Om', 'Be', 'kan', 'dze', 'So', 'ha'],
    baseBpm: 72,
    vowNote: 'Thần chú chữa lành linh ứng của Đức Dược Sư, thanh tẩy ba độc tham sân si.',
  },
  {
    id: 'om-ami-dewa',
    soundMotifId: 'a-di-da-4',
    title: 'OM AMI DEWA HRIH',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/om-ami-dewa-real.mp3',
    audioFallbackUrl: '/audio/chant/om-ami-dewa.mp3',
    speechText: 'Om Ami Dewa Hrih.',
    syllables: ['Om', 'A', 'mi', 'De', 'wa', 'Hrih'],
    baseBpm: 68,
    vowNote: 'Mật chú tâm tủy của Đức Phật A Di Đà, kết nối trực tiếp ánh sáng vô lượng.',
  },
  {
    id: 'om-muni',
    soundMotifId: 'thich-ca',
    title: 'OM MUNI MUNI MAHA MUNIYE SOHA',
    subtitle: 'Đức Phật Thích Ca Mâu Ni',
    devaName: 'Śākyamuni Buddha',
    avatarImage: '/images/buddhas/duc-phat-thich-ca.png',
    heroImage: '/images/buddhas/duc-phat-thich-ca.png',
    audioUrl: '/audio/chant/om-muni-real.mp3',
    audioFallbackUrl: '/audio/chant/om-muni.mp3',
    speechText: 'Om Muni Muni Maha Muniye Soha.',
    syllables: ['Om', 'Mu', 'ni', 'Mu', 'ni', 'Ma', 'ha', 'Mu', 'ni', 'ye', 'So', 'ha'],
    baseBpm: 74,
    vowNote: 'Tâm chú Đức Bổn Sư Thích Ca, đánh thức Phật tính tiềm tàng trong tự tâm.',
  },
  {
    id: 'namo-amituofo',
    soundMotifId: 'a-di-da-6',
    title: 'NAMO AMITUOFO (南無阿彌陀佛)',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/namo-amituofo-real.mp3',
    audioFallbackUrl: '/audio/chant/a-di-da-6-real.mp3',
    speechText: 'Namo Amituofo.',
    syllables: ['Na', 'mo', 'A', 'mi', 'tuo', 'fo'],
    baseBpm: 76,
    vowNote: 'Hán tụng truyền thống trang nghiêm nhịp mõ, nhiếp tâm quy hướng Tây Phương Cực Lạc.',
  },
  {
    id: 'amitabha-buddha',
    soundMotifId: 'a-di-da-4',
    title: 'Amitābha Buddha',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/amitabha-buddha-real.mp3',
    audioFallbackUrl: '/audio/chant/a-di-da-4-real.mp3',
    speechText: 'Amitābha Buddha.',
    syllables: ['A', 'mi', 'tā', 'bha', 'Bud', 'dha'],
    baseBpm: 60,
    vowNote: 'Danh hiệu Vô Lượng Quang, Vô Lượng Thọ thanh tịnh bằng tiếng Phạn trầm ấm.',
  },
  {
    id: 'namo-amitabhaya',
    soundMotifId: 'a-di-da-6',
    title: 'Namo Amitābhāya Buddhāya',
    subtitle: 'Đức Phật A Di Đà',
    devaName: 'Amitābha Buddha',
    avatarImage: '/images/buddhas/duc-phat-a-di-da.png',
    heroImage: '/images/buddhas/duc-phat-a-di-da.png',
    audioUrl: '/audio/chant/namo-amitabhaya-real.mp3',
    audioFallbackUrl: '/audio/chant/a-di-da-6-real.mp3',
    speechText: 'Namo Amitābhāya Buddhāya.',
    syllables: ['Na', 'mo', 'A', 'mi', 'tā', 'bhā', 'ya', 'Bud', 'dhā', 'ya'],
    baseBpm: 64,
    vowNote: 'Câu lễ tán Phạn ngữ hướng về Đức Phật A Di Đà cùng Pháp và Tăng bảo.',
  },
  {
    id: 'namo-bhagavate-sakyamunaye',
    soundMotifId: 'thich-ca',
    title: 'Namo Bhagavate Śākyamunaye Buddhāya',
    subtitle: 'Đức Phật Thích Ca Mâu Ni',
    devaName: 'Śākyamuni Buddha',
    avatarImage: '/images/buddhas/duc-phat-thich-ca.png',
    heroImage: '/images/buddhas/duc-phat-thich-ca.png',
    audioUrl: '/audio/chant/namo-bhagavate-sakyamunaye-real.mp3',
    audioFallbackUrl: '/audio/chant/thich-ca-real.mp3',
    speechText: 'Namo Śākyamunaye Buddhāya.',
    syllables: ['Na', 'mo', 'Śā', 'kya', 'mu', 'na', 'ye', 'Bud', 'dhā', 'ya'],
    baseBpm: 62,
    vowNote: 'Lời xưng tán Thế Tôn Thích Ca Mâu Ni trang nghiêm tiếng đại hồng chung.',
  },
  {
    id: 'namo-mahakarunikaya-avalokitesvaraya',
    soundMotifId: 'quan-am',
    title: 'Namo Mahākāruṇikāya Avalokiteśvarāya Bodhisattvāya',
    subtitle: 'Bồ Tát Quán Thế Âm',
    devaName: 'Avalokiteśvara Bodhisattva',
    avatarImage: '/images/buddhas/quan-the-am-bo-tat.png',
    heroImage: '/images/buddhas/quan-the-am-bo-tat.png',
    audioUrl: '/audio/chant/namo-mahakarunikaya-avalokitesvaraya-real.mp3',
    audioFallbackUrl: '/audio/chant/quan-am-real.mp3',
    speechText: 'Namo Avalokiteśvarāya Bodhisattvāya.',
    syllables: ['Na', 'mo', 'A', 'va', 'lo', 'ki', 'te', 'śva', 'rā', 'ya'],
    baseBpm: 62,
    vowNote: 'Nghi thức xưng niệm Đại Bi Bồ Tát Quán Thế Âm lắng dịu mọi phiền não.',
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
  mp3Url?: string;
  fallbackMp3Url?: string;
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
    mp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
    fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
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
    mp3Url: '/audio/chant/om-muni-real.mp3',
    fallbackMp3Url: '/audio/chant/thich-ca-real.mp3',
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
    mp3Url: 'https://archive.org/download/09.-thich-tri-thoat/01.%20Kinh%20A%20Di%20Da%20_%20Thich%20Tri%20Thoat%20%20.mp3',
    fallbackMp3Url: '/audio/chant/a-di-da-6-real.mp3',
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
    mp3Url: 'https://archive.org/download/Chu-Dai-Bi/ChuDaiBi-Thay-ThichTriThoat.mp3',
    fallbackMp3Url: '/audio/chant/namo-ratna-real.mp3',
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
    mp3Url: 'https://archive.org/download/kinh-duoc-su/Kinh%20D%C6%B0%E1%BB%A3c%20S%C6%B0.mp3',
    fallbackMp3Url: '/audio/chant/duoc-su-real.mp3',
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
    mp3Url: '/audio/chant/om-mani-real.mp3',
    fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
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
    mp3Url: 'https://archive.org/download/Adidaphat_ThichTriTinh/A%20DI%20%C4%90%C3%80%20PH%E1%BA%ACT%20-%20H%C3%B2a%20th%C6%B0%E1%BB%A3ng%20Th%C3%ADch%20Tr%C3%AD%20T%E1%BB%8Bnh.mp3',
    fallbackMp3Url: '/audio/chant/a-di-da-4-real.mp3',
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
    mp3Url: 'https://archive.org/download/KinhVuLanmoi_201711/Kinh%20Vu%20Lan%20%28moi%29.mp3',
    fallbackMp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
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
    `Đệ tử con pháp danh ${practitionerDharmaName || 'Dharma'} cùng toàn thể con cháu trong gia đình thành tâm sắm sửa hương hoa, trà quả, mâm cơm chay thanh tịnh dâng lên án thờ, trước lễ Tam Bảo, sau kính mời hương linh ${memorial.relationship} cùng liệt vị gia tiên về thụ hưởng hương vị thanh tịnh.`,
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
    subtitle: '158 bài kinh 10–20p',
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


