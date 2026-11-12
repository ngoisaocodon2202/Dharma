import { SutraCategory, SutraText } from './sutrasTypes';

export interface SutraAudioEntry {
  /** URL file .mp3 trực tiếp (local hoặc Archive.org CORS stream) */
  mp3Url: string;
  /** URL .mp3 dự phòng local nếu stream trực tuyến chậm hoặc mất mạng */
  fallbackMp3Url: string;
  /** ID video YouTube (tùy chọn phát video .mp4 trì tụng liền mạch) */
  youtubeId?: string;
  /** Tên Quý Thầy / Pháp sư / Ban nghi lễ trì tụng */
  readerName: string;
  /** Nhãn hiển thị nguồn pháp âm */
  sourceLabel: string;
  /** True nếu đúng trọn bộ kinh/chú đó; False nếu là pháp âm trợ niệm đồng thanh theo tông phái */
  isExactMatch: boolean;
}

const CATEGORY_CONTINUOUS_AUDIO: Record<SutraCategory, Omit<SutraAudioEntry, 'isExactMatch'>> = {
  'Kinh Nhật Tụng': {
    mp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
    fallbackMp3Url: '/audio/chant/a-di-da-6-real.mp3',
    youtubeId: 'y4BNjUJl8d8',
    readerName: 'TT. Thích Trí Thoát',
    sourceLabel: 'Pháp âm trì tụng Bắc Tông (.MP3)',
  },
  'Tịnh Độ Tông': {
    mp3Url: '/audio/chant/a-di-da-6-real.mp3',
    fallbackMp3Url: '/audio/chant/a-di-da-4-real.mp3',
    youtubeId: 'Q97Bhx8nEaw',
    readerName: 'TT. Thích Trí Thoát',
    sourceLabel: 'Niệm Phật Tịnh Độ liền mạch (.MP3)',
  },
  'Mật Tông': {
    mp3Url: '/audio/chant/om-mani-real.mp3',
    fallbackMp3Url: '/audio/chant/namo-ratna-real.mp3',
    readerName: 'Chư Tăng Cổ Tự',
    sourceLabel: 'Pháp âm Mật Tông Phạn ngữ (.MP3)',
  },
  'Thiền & Bát Nhã': {
    mp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
    fallbackMp3Url: '/audio/chant/thich-ca-real.mp3',
    youtubeId: 'y4BNjUJl8d8',
    readerName: 'TT. Thích Trí Thoát',
    sourceLabel: 'Trì tụng Bát Nhã Thiền môn (.MP3)',
  },
  'Kinh Nguyên Thủy (Nikaya)': {
    mp3Url: '/audio/chant/om-muni-real.mp3',
    fallbackMp3Url: '/audio/chant/thich-ca-real.mp3',
    youtubeId: 'LymKjfIqmko',
    readerName: 'Pháp Âm Nguyên Thủy',
    sourceLabel: 'Niệm Bổn Sư & Pháp Âm Nikaya (.MP3)',
  },
  'Kinh Đại Thừa & Pháp Hoa': {
    mp3Url: 'https://archive.org/download/nhtp_20251016_kinh-pham-pho-mon-cau-gia-dao-binh-an-kinh-phat-ThGNzp0b4e0.mp3/nhtp_20251016_kinh-pham-pho-mon-cau-gia-dao-binh-an-kinh-phat-ThGNzp0b4e0.mp3',
    fallbackMp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
    youtubeId: 'jv4NEO8oIEQ',
    readerName: 'Pháp Âm Nhiệm Mầu',
    sourceLabel: 'Pháp âm Đại Thừa liền mạch (.MP3)',
  },
  'Thiền Kệ & Lời Phật Dạy': {
    mp3Url: '/audio/chant/thich-ca-real.mp3',
    fallbackMp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
    readerName: 'TT. Thích Trí Thoát',
    sourceLabel: 'Pháp âm thiền định chánh niệm (.MP3)',
  },
  'Nghi Thức Sám Hối & Cúng Cơm': {
    mp3Url: 'https://archive.org/download/0008.tu-bi-thuy-sam/0008.tu%20bi%20thuy%20sam.mp3',
    fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
    youtubeId: 'QkyXf2Q2NP8',
    readerName: 'Pháp Âm Cổ Tự',
    sourceLabel: 'Nghi thức Sám Hối liền mạch (.MP3)',
  },
};

interface ExactRule {
  test: (key: string) => boolean;
  entry: SutraAudioEntry;
}

const EXACT_SUTRA_AUDIO_RULES: ExactRule[] = [
  {
    test: (k) => k.includes('bat-nha') || k.includes('tam-kinh'),
    entry: {
      mp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
      fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
      youtubeId: 'y4BNjUJl8d8',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Bát Nhã Tâm Kinh • TT. Thích Trí Thoát (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('dai-bi') || k.includes('thien-thu'),
    entry: {
      mp3Url: 'https://archive.org/download/Chu-Dai-Bi/ChuDaiBi-Thay-ThichTriThoat.mp3',
      fallbackMp3Url: '/audio/chant/namo-ratna-real.mp3',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Chú Đại Bi 84 Câu • TT. Thích Trí Thoát (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('a-di-da') || k.includes('vo-luong-tho') || k.includes('quan-vo-luong'),
    entry: {
      mp3Url: 'https://archive.org/download/09.-thich-tri-thoat/01.%20Kinh%20A%20Di%20Da%20_%20Thich%20Tri%20Thoat%20%20.mp3',
      fallbackMp3Url: '/audio/chant/a-di-da-6-real.mp3',
      youtubeId: 'Q97Bhx8nEaw',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Kinh Phật Thuyết A Di Đà • TT. Thích Trí Thoát (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('duoc-su'),
    entry: {
      mp3Url: 'https://archive.org/download/kinh-duoc-su/Kinh%20D%C6%B0%E1%BB%A3c%20S%C6%B0.mp3',
      fallbackMp3Url: '/audio/chant/duoc-su-real.mp3',
      youtubeId: 'ui44RqamX_g',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Kinh Dược Sư Lưu Ly Quang • TT. Thích Trí Thoát (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('dia-tang'),
    entry: {
      mp3Url: 'https://archive.org/download/09.-thich-tri-thoat/02.%20Kinh%20dia%20tang%20bo%20tat%20bon%20nguyen%20_%20Thich%20Tri%20Thoat%20%20.mp3',
      fallbackMp3Url: '/audio/chant/dia-tang-real.mp3',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Kinh Địa Tạng Bồ Tát Bổn Nguyện • TT. Thích Trí Thoát (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('pho-mon') || k.includes('phap-hoa') || k.includes('quan-am') || k.includes('quan-the-am'),
    entry: {
      mp3Url: 'https://archive.org/download/nhtp_20251016_kinh-pham-pho-mon-cau-gia-dao-binh-an-kinh-phat-ThGNzp0b4e0.mp3/nhtp_20251016_kinh-pham-pho-mon-cau-gia-dao-binh-an-kinh-phat-ThGNzp0b4e0.mp3',
      fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
      youtubeId: 'jv4NEO8oIEQ',
      readerName: 'Pháp Âm Nhiệm Mầu',
      sourceLabel: 'Kinh Phổ Môn Quán Thế Âm (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('vu-lan') || k.includes('bao-hieu'),
    entry: {
      mp3Url: 'https://archive.org/download/KinhVuLanmoi_201711/Kinh%20Vu%20Lan%20%28moi%29.mp3',
      fallbackMp3Url: '/audio/chant/a-di-da-6-real.mp3',
      youtubeId: 'TZmflOyFJns',
      readerName: 'HT. Thích Trí Quảng / Pháp Âm Cổ Tự',
      sourceLabel: 'Kinh Vu Lan Báo Hiếu (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('sam-hoi') || k.includes('thuy-sam') || k.includes('hong-danh') || k.includes('sau-can'),
    entry: {
      mp3Url: 'https://archive.org/download/0008.tu-bi-thuy-sam/0008.tu%20bi%20thuy%20sam.mp3',
      fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
      youtubeId: 'QkyXf2Q2NP8',
      readerName: 'Pháp Âm Cổ Tự',
      sourceLabel: 'Nghi Thức Sám Hối Cổ Tự (.MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('kim-cuong') || k.includes('kim-cang'),
    entry: {
      mp3Url: '/audio/sutras/bat-nha-tam-kinh.mp3',
      fallbackMp3Url: '/audio/chant/thich-ca-real.mp3',
      youtubeId: 'o_NrAGX3m-I',
      readerName: 'TT. Thích Trí Thoát',
      sourceLabel: 'Kinh Kim Cương Bát Nhã (.MP4 / .MP3)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('phap-cu') || k.includes('dhammapada'),
    entry: {
      mp3Url: '/audio/chant/om-muni-real.mp3',
      fallbackMp3Url: '/audio/chant/thich-ca-real.mp3',
      youtubeId: 'LymKjfIqmko',
      readerName: 'HT. Thích Minh Châu (Pháp Âm Nguyên Thủy)',
      sourceLabel: 'Kinh Pháp Cú (.MP4 / Pháp Âm)',
      isExactMatch: true,
    },
  },
  {
    test: (k) => k.includes('luc-tu') || k.includes('om-mani'),
    entry: {
      mp3Url: '/audio/chant/om-mani-real.mp3',
      fallbackMp3Url: '/audio/chant/quan-am-real.mp3',
      readerName: 'Chư Tăng Tây Tạng',
      sourceLabel: 'Lục Tự Đại Minh Chân Ngôn (.MP3)',
      isExactMatch: true,
    },
  },
];

/**
 * Tra cứu pháp âm đọc kinh liền mạch (.MP3 / .MP4 YouTube) tương ứng với từng bài kinh.
 */
export function resolveSutraAudio(sutra: Pick<SutraText, 'slug' | 'id' | 'title' | 'category'>): SutraAudioEntry {
  const key = `${sutra.slug} ${sutra.id} ${sutra.title}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

  for (const rule of EXACT_SUTRA_AUDIO_RULES) {
    if (rule.test(key)) {
      return rule.entry;
    }
  }

  const categoryFallback = CATEGORY_CONTINUOUS_AUDIO[sutra.category] || CATEGORY_CONTINUOUS_AUDIO['Kinh Nhật Tụng'];
  return {
    ...categoryFallback,
    isExactMatch: false,
  };
}
