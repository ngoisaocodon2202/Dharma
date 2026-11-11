'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronRight,
  MapPin,
  Volume2,
  X,
  Share2,
  Play,
  Pause,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  DharmaWheelIcon,
  LotusMinimalIcon,
  TempleBellIcon,
  WoodenFishMinimalIcon,
  MalaBeadsMinimalIcon,
  IncenseAltarIcon,
  SutraScrollIcon,
  BodhiLeafIcon,
  PagodaMinimalIcon,
  LotusLanternIcon,
} from '@/components/icons/DharmaMinimalIcons';
import { useAuth } from '@/components/auth/AuthContext';
import {
  playBellSound,
  playWoodenFishSound,
  playGrandTempleBellSound,
  startMeditativeDrone,
  stopMeditativeDrone,
} from '@/lib/buddhistSounds';
import { IncenseOfferingModal, MalaBeadsModal } from './OmManiInteractiveTools';
import { SearchModal } from '@/components/layout/SearchModal';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { OmManiDesktopHome, DhammapadaVerse, DailyPeriodItem } from './desktop/OmManiDesktopHome';
import { cn } from '@/lib/utils';

// =============================================================================
// 1. DATA: 7-DAY LUNAR-SOLAR STRIP
// =============================================================================
interface DayItem {
  name: string;
  solarDate: string;
  lunarDate: string;
  hasDot?: boolean;
  isToday?: boolean;
  festivalName?: string;
}

const WEEK_DAYS: DayItem[] = [
  { name: 'Hai', solarDate: '02', lunarDate: '24' },
  { name: 'Ba', solarDate: '03', lunarDate: '25', hasDot: true },
  { name: 'Tư', solarDate: '04', lunarDate: '26' },
  { name: 'Năm', solarDate: '05', lunarDate: '27' },
  { name: 'Sáu', solarDate: '06', lunarDate: '28' },
  { name: 'Bảy', solarDate: '07', lunarDate: '29', hasDot: true },
  {
    name: 'CN',
    solarDate: '08',
    lunarDate: '30',
    hasDot: true,
    isToday: true,
    festivalName: 'Vía Đức Phật Dược Sư Lưu Ly Quang',
  },
];

// =============================================================================
// 2. DATA: 4 THỜI CÔNG PHU TỈNH THỨC TRONG NGÀY (ORIGINAL DHARMA FEATURE)
// =============================================================================
const DAILY_PERIODS: DailyPeriodItem[] = [
  {
    id: 'thoi-sang',
    period: 'Thời Sáng',
    timeRange: '05:30 – 08:00',
    title: 'Tịnh Tâm & Phát Nguyện Đầu Ngày',
    practice: 'Thỉnh 3 tiếng chuông, khởi tâm từ bi và nguyện giữ thân khẩu ý thanh tịnh.',
  },
  {
    id: 'thoi-trua',
    period: 'Thời Trưa',
    timeRange: '11:30 – 13:00',
    title: 'Quán Chiếu & Tri Ân Thọ Thực',
    practice: 'Thực tập 3 hơi thở chánh niệm, quán tưởng công ơn người làm ra hạt gạo.',
  },
  {
    id: 'thoi-chieu',
    period: 'Thời Chiều',
    timeRange: '17:30 – 19:30',
    title: 'Trì Kinh & Niệm Phật Định Tâm',
    practice: 'Đọc tụng 1 phẩm kinh ngắn hoặc lần 108 hạt chuỗi niệm danh hiệu Phật.',
  },
  {
    id: 'thoi-dem',
    period: 'Thời Đêm',
    timeRange: '21:00 – 22:30',
    title: 'Tĩnh Tọa & Hồi Hướng Công Đức',
    practice: 'Buông xả mọi lo toan trong ngày, thiền hơi thở 5 phút và hồi hướng bình an.',
  },
];

// =============================================================================
// 3. DATA: THỈNH KỆ KINH PHÁP CÚ (DHAMMAPADA ORACLE - 100% ORIGINAL)
// =============================================================================
const DHAMMAPADA_VERSES: DhammapadaVerse[] = [
  {
    id: 'pc-1',
    number: 'Pháp Cú Kệ 01',
    chapter: 'Phẩm Song Yếu (Yamakavagga)',
    pali: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā...',
    vietnamese:
      'Ý dẫn đầu các pháp,\nÝ làm chủ, ý tạo;\nNếu với ý thanh tịnh,\nNói lên hay hành động,\nAn lạc bước theo sau,\nNhư bóng không rời hình.',
    application:
      'Hôm nay, trước mỗi lời nói hay quyết định quan trọng, hãy dừng lại 3 giây để quan sát xem tâm mình đang khởi từ sự bình an hay nóng giận.',
  },
  {
    id: 'pc-183',
    number: 'Pháp Cú Kệ 183',
    chapter: 'Phẩm Chư Phật (Buddhavagga)',
    pali: 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā, sacittapariyodapanaṃ...',
    vietnamese:
      'Không làm mọi điều ác,\nThành tựu các hạnh lành,\nTâm ý giữ trong sạch,\nChính lời chư Phật dạy.',
    application:
      'Chọn làm một việc thiện nhỏ trong hôm nay: một lời nói ái ngữ khích lệ người thân, hoặc giúp đỡ một người đang gặp khó khăn.',
  },
  {
    id: 'pc-223',
    number: 'Pháp Cú Kệ 223',
    chapter: 'Phẩm Phẫn Nộ (Kodhavagga)',
    pali: 'Akkodhena jine kodhaṃ, asādhuṃ sādhunā jine...',
    vietnamese:
      'Lấy không giận thắng giận,\nLấy thiện thắng không thiện,\nLấy thí thắng gian tham,\nLấy chân thật thắng hư ngụy.',
    application:
      'Khi gặp điều trái ý nghịch lòng, hãy mỉm cười hít sâu thay vì phản ứng gay gắt. Sự nhẫn nhục chính là sức mạnh lớn nhất.',
  },
  {
    id: 'pc-276',
    number: 'Pháp Cú Kệ 276',
    chapter: 'Phẩm Đạo (Maggavagga)',
    pali: 'Tumhehi kiccaṃ ātappaṃ, akkhātāro tathāgatā...',
    vietnamese:
      'Con phải tự nỗ lực,\nNhư Lai chỉ dạy đường,\nNgười hành trì thiền định,\nThoát ràng buộc Ma vương.',
    application:
      'Dành trọn vẹn 5 phút tối nay ngồi yên lặng, tắt điện thoại và chỉ theo dõi hơi thở vào ra nhẹ nhàng.',
  },
  {
    id: 'pc-54',
    number: 'Pháp Cú Kệ 54',
    chapter: 'Phẩm Hoa (Pupphavagga)',
    pali: 'Na pupphagandho paṭivātameti, na candanaṃ tagaramallikā vā...',
    vietnamese:
      'Hương các loài hoa thơm,\nKhông ngược chiều gió bay,\nNhưng hương người đức hạnh,\nNgược gió khắp tung bay.',
    application:
      'Giữ trọn chữ tín và sự chân thành trong công việc hôm nay; đức hạnh chính là hương thơm bền vững nhất của người cư sĩ.',
  },
];

// =============================================================================
// 4. DATA: CHƯ PHẬT & BỒ TÁT BỔN TÔN (100% AUTHENTIC BUDDHIST IMAGES)
// =============================================================================
interface BuddhaCard {
  id: string;
  name: string;
  title: string;
  image: string;
  mantra: string;
  vow: string;
}

const BUDDHAS_LIST: BuddhaCard[] = [
  {
    id: 'thich-ca',
    name: 'Đức Phật Thích Ca Mâu Ni',
    title: 'Bổn Sư Thích Ca Mâu Ni Phật',
    image: '/images/golden_buddha.jpg',
    mantra: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    vow: 'Bậc Đạo Sư Giác Ngộ khai mở con đường Tứ Diệu Đế và Bát Chánh Đạo, dẫn dắt chúng sinh vượt thoát luân hồi sinh tử.',
  },
  {
    id: 'duoc-su',
    name: 'Đức Phật Dược Sư',
    title: 'Dược Sư Lưu Ly Quang Vương Như Lai',
    image: '/images/buddha_temple.jpg',
    mantra: 'Nam Mô Dược Sư Lưu Ly Quang Vương Phật',
    vow: '12 Đại nguyện chiếu ánh sáng lưu ly thanh tịnh, tiêu trừ tật bệnh thân tâm, tăng trưởng thọ mạng và trí tuệ Bồ Đề.',
  },
  {
    id: 'a-di-da',
    name: 'Đức Phật A Di Đà',
    title: 'Từ Phụ A Di Đà Như Lai',
    image: '/images/buddha_meditation.jpg',
    mantra: 'Nam Mô A Di Đà Phật',
    vow: '48 Đại nguyện phóng hào quang vô lượng tiếp dẫn chúng sinh nhất tâm trì niệm danh hiệu về cõi Tịnh Độ Cực Lạc.',
  },
  {
    id: 'quan-am',
    name: 'Bồ Tát Quán Thế Âm',
    title: 'Đại Bi Quán Thế Âm Bồ Tát',
    image: '/images/quan_am_bodhisattva.jpg',
    mantra: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    vow: 'Lắng nghe tiếng khổ đau của muôn loài trong mười phương, dùng nước nhành dương liễu rưới mát tâm phiền não.',
  },
  {
    id: 'dia-tang',
    name: 'Bồ Tát Địa Tạng Vương',
    title: 'Đại Nguyện Địa Tạng Vương Bồ Tát',
    image: '/images/tran_nhan_tong_yentu.jpg',
    mantra: 'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát',
    vow: 'Đại hiếu và đại nguyện vô biên: Địa ngục vị không, thệ bất thành Phật; chúng sinh độ tận, phương chứng Bồ Đề.',
  },
];

// =============================================================================
// 5. DATA: DANH LAM CỔ TỰ VIỆT NAM
// =============================================================================
interface TempleItem {
  name: string;
  location: string;
  image: string;
  href: string;
  tradition?: string;
  history?: string;
}

const TEMPLES_LIST: TempleItem[] = [
  {
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    location: 'Ba Đình, Hà Nội',
    image: '/images/ancient_pagoda.jpg',
    href: '/di-chua-online',
    tradition: 'Bắc Tông • Di sản Quốc gia Đặc biệt',
    history:
      'Được vua Lý Thái Tông khởi dựng năm 1049 theo giấc mộng thấy Đức Bồ Tát Quán Thế Âm ngự trên tòa sen vàng. Ngôi chùa mang kiến trúc Liên Hoa Đài độc đáo vươn lên từ mặt hồ Linh Chiểu, biểu trưng cho trí tuệ và lòng từ bi thanh khiết.',
  },
  {
    name: 'Chùa Bái Đính',
    location: 'Gia Viễn, Ninh Bình',
    image: '/images/chua_bai_dinh.jpg',
    href: '/di-chua-online',
    tradition: 'Bắc Tông • Quần thể Danh lam Tràng An',
    history:
      'Quần thể tâm linh có lịch sử hơn 1.000 năm gắn liền với Quốc sư Nguyễn Minh Không thời nhà Lý. Nơi đây lưu giữ hành lang 500 vị La Hán bằng đá xanh và Đại Hồng Chung nặng 36 tấn vang vọng giữa non nước cố đô Hoa Lư.',
  },
  {
    name: 'Thiền Viện Trúc Lâm Yên Tử',
    location: 'Uông Bí, Quảng Ninh',
    image: '/images/tran_nhan_tong_yentu.jpg',
    href: '/di-chua-online',
    tradition: 'Thiền Phái Trúc Lâm Việt Nam',
    history:
      'Tổ đình của Thiền phái Trúc Lâm Yên Tử do Điều Ngự Giác Hoàng Trần Nhân Tông sáng lập vào thế kỷ XIII, nơi hội tụ tinh thần Phật giáo nhập thế, hòa quyện giữa đạo và đời trên đỉnh non thiêng Yên Tử.',
  },
  {
    name: 'Chùa Thiên Mụ (Linh Mụ Tự)',
    location: 'Cố đô Huế',
    image: '/images/temple_sanctuary_bg.jpg',
    href: '/di-chua-online',
    tradition: 'Bắc Tông • Đệ Nhất Cổ Tự Xứ Huế',
    history:
      'Khởi lập năm 1601 bên dòng sông Hương thơ mộng trên đồi Hà Khê. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng tâm linh trang nghiêm của đất thần kinh suốt hơn bốn thế kỷ.',
  },
];

// =============================================================================
// 6. DATA: CẨM NANG CHUYỂN HÓA TÂM (8 CURATED DHARMA ARTICLES)
// =============================================================================
interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  authorOrSource?: string;
  category?: string;
  readTime?: string;
}

const FEATURED_ARTICLES: ArticleItem[] = [
  {
    id: '5-quan-niem-buoi-sang',
    title: '5 quán niệm đầu ngày giúp người cư sĩ mở rộng tâm từ và bình an',
    excerpt:
      'Mỗi sớm mai thức dậy là một cơ hội quý giá để thiết lập lại chánh niệm, gieo trồng hạt giống từ bi và trí tuệ...',
    image: '/images/golden_buddha.jpg',
    authorOrSource: 'Ban Biên Tập Dharma',
    category: 'Thiền đời thường',
    readTime: '4 phút đọc',
    content: `Mỗi sớm mai thức dậy, trước khi chạm vào điện thoại hay cuốn vào nhịp sống hối hả, người học Phật dành ra 3 phút tĩnh lặng để thực hành 5 quán niệm đầu ngày:

1. Quán niệm về sự tỉnh thức:
"Hít vào, tâm tôi lắng dịu. Thở ra, tôi mỉm cười với ngày mới đang mở ra trước mắt."

2. Quán niệm về lòng từ bi:
"Nguyện cho tôi hôm nay đi đến đâu cũng mang theo sự hòa ái, bao dung và không làm tổn thương bất kỳ ai."

3. Quán niệm về sự kham nhẫn:
"Mọi nghịch cảnh hay lời nói trái ý trong ngày đều là duyên lành thử thách sức định tĩnh và nhẫn nhục của tôi."

4. Quán niệm về chánh nghiệp:
"Nguyện làm tròn bổn phận với tâm chân thành, minh bạch, lấy trí tuệ làm sự nghiệp."

5. Quán niệm hồi hướng:
"Nguyện đem mọi năng lượng thiện lành trong ngày hôm nay hồi hướng cho cha mẹ, thân quyến và muôn loài đều được an vui."`,
  },
  {
    id: 'hoa-giai-lo-au-bang-hoi-tho',
    title: 'Phương pháp Quán Niệm Hơi Thở (Anapanasati) để dứt trừ căng thẳng, bất an',
    excerpt:
      'Trong Kinh Nhập Tức Xuất Tức Niệm, Đức Phật chỉ dạy hơi thở chính là sợi dây neo giữ tâm thức trước mọi sóng gió...',
    image: '/images/buddha_meditation.jpg',
    authorOrSource: 'Thiền Học Nguyên Thủy',
    category: 'Chữa lành tâm',
    readTime: '5 phút đọc',
    content: `Tâm con người thường lo âu vì hai lý do: hoặc tiếc nuối chuyện đã qua trong quá khứ, hoặc sợ hãi những điều chưa tới ở tương lai. Chỉ có hơi thở là luôn có mặt trong giây phút hiện tại.

Đức Phật dạy trong Kinh Quán Niệm Hơi Thở:
- Khi thở vào một hơi dài, hành giả biết rõ: "Tôi đang thở vào một hơi dài".
- Khi thở ra một hơi dài, hành giả biết rõ: "Tôi đang thở ra một hơi dài".
- Thở vào, tôi làm lắng dịu toàn bộ thân hành. Thở ra, tôi buông thư mọi căng thẳng.

Chỉ cần thực hành 10 hơi thở có ý thức mỗi khi tâm xao động, dòng suy nghĩ rối bời sẽ tự nhiên lắng xuống như mặt hồ không gợn sóng.`,
  },
  {
    id: 'luat-nhan-qua-trong-loi-noi',
    title: 'Chánh Ngữ trong nhà Phật: Lời nói ái ngữ kết thiện duyên trăm năm',
    excerpt:
      'Khẩu nghiệp là cánh cửa dễ tạo phước nhưng cũng dễ gây họa nhất. Tu tập Chánh Ngữ chính là chìa khóa chuyển hóa vận mệnh...',
    image: '/images/monk_incense.jpg',
    authorOrSource: 'Phật Học Ứng Dụng',
    category: 'Nhân quả & Phúc báo',
    readTime: '4 phút đọc',
    content: `Trong Bát Chánh Đạo, Chánh Ngữ đứng ngay sau Chánh Kiến và Chánh Tư Duy. Một lời nói chân thật, dịu dàng và đúng lúc có thể cứu vớt một cuộc đời đang tuyệt vọng; ngược lại, một lời ác ý có thể để lại vết thương lòng suốt nhiều năm.

Bốn tiêu chuẩn của Chánh Ngữ:
1. Không nói dối (Chân thật ngữ): Giữ trọn chữ tín và sự minh bạch.
2. Không nói lưỡi đôi chiều (Hòa hợp ngữ): Không đâm bị thóc, chọc bị gạo gây chia rẽ.
3. Không nói lời thô ác (Ái ngữ): Dùng lời lẽ ôn tồn, tôn trọng phẩm giá người nghe.
4. Không nói lời phù phiếm vô ích (Thực nghĩa ngữ): Nói đúng lúc, đem lại lợi ích thiết thực.`,
  },
  {
    id: 'dao-hieu-va-bao-an',
    title: 'Chữ Hiếu trong đạo Phật: Cách báo hiếu cha mẹ hiện tiền và cửu huyền thất tổ',
    excerpt:
      'Đức Phật dạy: Tâm hiếu là tâm Phật, hạnh hiếu là hạnh Phật. Báo hiếu chân chính không nằm ở mâm cao cỗ đầy...',
    image: '/images/ancient_pagoda.jpg',
    authorOrSource: 'Kinh Vu Lan & Báo Hiếu',
    category: 'Hiếu đạo',
    readTime: '6 phút đọc',
    content: `Trong Kinh Tăng Chi Bộ, Đức Phật khẳng định dù người con có cõng cha trên vai trái, cõng mẹ trên vai phải đi khắp thế gian suốt trăm năm cũng chưa trả hết ân đức sinh thành.

Phương pháp báo hiếu trọn vẹn nhất theo lời Phật dạy:
1. Với cha mẹ hiện tiền: Không chỉ phụng dưỡng vật chất với lòng cung kính, mà cao quý nhất là hướng dẫn cha mẹ biết tin sâu Nhân Quả, quy y Tam Bảo, giữ gìn Ngũ Giới và mở lòng bố thí.
2. Với cha mẹ, tổ tiên đã quá vãng: Tránh sát sinh hại vật trong ngày giỗ chạp; thay vào đó hãy cúng chay thanh tịnh, tụng kinh, phóng sinh và đem công đức lành hồi hướng cho hương linh siêu sinh Tịnh Độ.`,
  },
  {
    id: 'buong-xa-chap-nga',
    title: 'Cội nguồn của khổ đau đến từ đâu và con đường buông xả',
    excerpt:
      'Phiền não không tự sinh ra từ ngoại cảnh, mà khởi lên từ tâm chấp trước vào những điều vốn dĩ vô thường...',
    image: '/images/lotus_blooming.jpg',
    authorOrSource: 'Thiền Quán',
    category: 'Chữa lành tâm',
    readTime: '4 phút đọc',
    content: `Mọi sự vật hiện tượng trên thế gian đều vận hành theo định luật Vô Thường — thành, trụ, hoại, không. Khổ đau nảy sinh khi ta đòi hỏi những điều vô thường phải tồn tại vĩnh viễn theo ý muốn của riêng mình.

Buông xả trong đạo Phật không phải là buông xuôi hay thờ ơ với trách nhiệm, mà là:
- Làm hết lòng với bổn phận hiện tại nhưng không cố chấp vào kết quả.
- Tha thứ cho lỗi lầm của người khác để giải thoát chính tâm hồn mình khỏi ngục tù sân hận.`,
  },
  {
    id: 'y-nghia-an-chay-trai-gioi',
    title: 'Ý nghĩa thực sự của việc ăn chay và giữ giới trong những ngày Trai',
    excerpt:
      'Ăn chay không chỉ nuôi dưỡng thân thể thanh nhẹ mà còn là pháp thực hành lòng đại bi đối với muôn loài chúng sinh...',
    image: '/images/buddha_temple.jpg',
    authorOrSource: 'Cẩm Nang Cư Sĩ',
    category: 'Nhân quả & Phúc báo',
    readTime: '5 phút đọc',
    content: `Những ngày Lục Trai (mùng 8, 14, 15, 23, 29, 30 Âm lịch) là dịp để người cư sĩ tại gia quay về thanh lọc cả thân lẫn tâm.

Ba lợi ích lớn của việc trai giới thanh tịnh:
1. Nuôi dưỡng tâm Từ Bi: Không trực tiếp hay gián tiếp tiếp tay cho sự sát hại sinh mạng.
2. Thanh lọc thân tâm: Thức ăn thực vật thuần khiết giúp khí huyết nhẹ nhàng, dễ định tâm khi ngồi thiền và tụng kinh.
3. Gieo nhân trường thọ và bình an: Tránh kết oán thù với chúng sinh, từ đó tiêu trừ chướng bệnh.`,
  },
  {
    id: 'thien-trong-cong-viec',
    title: 'Nghệ thuật giữ tâm bất động giữa muôn vàn biến động nơi công sở',
    excerpt:
      'Làm sao để vừa hoàn thành xuất sắc công việc vừa giữ được sự tĩnh lặng như mặt nước hồ thu?...',
    image: '/images/sutra_book.jpg',
    authorOrSource: 'Thiền Đời Thường',
    category: 'Thiền đời thường',
    readTime: '4 phút đọc',
    content: `Thiền không giới hạn ở tư thế ngồi xếp bằng nơi thiền đường, mà hiện diện trong từng hành động có chánh niệm suốt cả ngày:
- Khi làm việc gì, chỉ chuyên tâm vào một việc duy nhất (Độc nhất tâm).
- Khi tiếng chuông điện thoại vang lên, coi đó như tiếng chuông chùa nhắc nhở mình thở một hơi sâu trước khi bắt máy.
- Giữ khoảng lặng 1 phút giữa hai đầu việc để tâm không bị cuốn trôi theo áp lực.`,
  },
  {
    id: 'cong-duc-tung-kinh-duoc-su',
    title: 'Mười hai đại nguyện của Đức Phật Dược Sư và pháp tu tiêu tai diên thọ',
    excerpt:
      'Ánh sáng lưu ly của Đức Phật Dược Sư chính là biểu tượng cho sự trong sáng tuyệt đối của tâm thức không vướng bụi trần...',
    image: '/images/golden_buddha_altar.jpg',
    authorOrSource: 'Tam Tạng Đại Thừa',
    category: 'Hiếu đạo',
    readTime: '6 phút đọc',
    content: `Đức Phật Dược Sư Lưu Ly Quang Vương ở thế giới Tịnh Lưu Ly phương Đông đã phát 12 đại nguyện rộng lớn nhằm cứu độ chúng sinh thoát khỏi hai thứ bệnh: bệnh nơi thân xác và bệnh si mê nơi tâm hồn.

Người Phật tử trì tụng Kinh Dược Sư với lòng chí thành, kết hợp phóng sinh, bố thí thuốc men và giữ tâm thanh tịnh như ngọc lưu ly sẽ cảm ứng được năng lượng gia hộ không thể nghĩ bàn.`,
  },
];

export function OmManiAppStoreHome() {
  const router = useRouter();
  const { user } = useAuth();

  // Active day selection
  const [selectedDay, setSelectedDay] = useState<DayItem>(WEEK_DAYS[6]);

  // 4-Period Daily Practice state (persisted in localStorage)
  const [completedPeriods, setCompletedPeriods] = useState<string[]>(['thoi-sang']);

  // Dhammapada Oracle state
  const [verseIdx, setVerseIdx] = useState(0);

  // Mobile Segmented Control Tab
  const [mobileSegment, setMobileSegment] = useState<'thoi-khoa' | 'phap-am' | 'phat-dai'>('thoi-khoa');
  const [mobileArticleFilter, setMobileArticleFilter] = useState<string>('Tất cả');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [selectedBuddha, setSelectedBuddha] = useState<BuddhaCard | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<TempleItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Soundscape Mixer states
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [isAutoWoodenFish, setIsAutoWoodenFish] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('phatphap_dharma_daily_periods');
        if (saved) {
          setCompletedPeriods(JSON.parse(saved));
        }
      } catch {}
    }
    return () => {
      stopMeditativeDrone();
    };
  }, []);

  // Auto-rhythm wooden fish interval (60 BPM)
  useEffect(() => {
    if (!isAutoWoodenFish) return;
    playWoodenFishSound(0.45);
    const timer = setInterval(() => {
      playWoodenFishSound(0.45);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoWoodenFish]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePeriod = (id: string) => {
    playBellSound(0.45);
    setCompletedPeriods((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      if (!exists) {
        showToast('Đã hoàn mãn 1 thời khóa tỉnh thức • Công đức vô lượng');
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('phatphap_dharma_daily_periods', JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const handleDrawNewVerse = () => {
    playBellSound(0.45);
    setVerseIdx((prev) => (prev + 1) % DHAMMAPADA_VERSES.length);
    showToast('Đã thỉnh một bài kệ Kinh Pháp Cú mới');
  };

  const handleToggleDrone = () => {
    if (isDroneActive) {
      stopMeditativeDrone();
      setIsDroneActive(false);
      showToast('Đã tắt tần số tịnh tâm 432Hz');
    } else {
      playBellSound(0.4);
      startMeditativeDrone(0.24);
      setIsDroneActive(true);
      showToast('Đang phát sóng âm định tâm 432Hz');
    }
  };

  const handleToggleAutoWoodenFish = () => {
    setIsAutoWoodenFish((prev) => {
      const next = !prev;
      showToast(next ? 'Đã bật Mõ Tụng Kinh đều nhịp (60 BPM)' : 'Đã dừng tiếng Mõ tự động');
      return next;
    });
  };

  const currentVerse = DHAMMAPADA_VERSES[verseIdx];
  const progressPercent = Math.round((completedPeriods.length / DAILY_PERIODS.length) * 100);

  const mobileFilteredArticles =
    mobileArticleFilter === 'Tất cả'
      ? FEATURED_ARTICLES
      : FEATURED_ARTICLES.filter((a) => a.category === mobileArticleFilter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2E1E0F] selection:bg-[#F5C542]/30 selection:text-[#8C5500] relative">
      {/* Subtle Top Golden Radial Glow */}
      <div className="fixed top-0 inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(245,197,66,0.18),transparent_70%)] pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - React Native Super-App Architecture                  */}
      {/* ========================================================================= */}
      <div className="block lg:hidden relative z-10">
        <div className="max-w-md sm:max-w-lg mx-auto px-3.5 sm:px-4 pt-3 pb-32 space-y-5">
          {/* 1. REACT NATIVE SAFE-AREA TOP NAVIGATION BAR */}
          <header className="sticky top-2 z-30 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#EEDBBA] px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-[0_4px_20px_rgba(180,140,50,0.08)]">
            <Link
              href="/ho-so"
              className="flex items-center gap-2.5 min-w-0 flex-1 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ECD9A8] shadow-[0_2px_10px_rgba(200,160,50,0.18)] bg-white shrink-0">
                <img
                  src="/dharma-logo.png"
                  alt="Dharma Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-serif font-black text-sm tracking-wider text-[#2E1E0F] whitespace-nowrap">
                    DHARMA
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#FFF4D0] text-[#9A6405] border border-[#F2DE9C] whitespace-nowrap shrink-0">
                    {completedPeriods.length}/4 Thời
                  </span>
                </div>
                <p className="text-[11px] text-[#6A5234] truncate whitespace-nowrap">
                  Chào {user?.dharma_name || user?.full_name || 'Cư sĩ'} • Tâm an vạn sự an
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  showToast('Tiếng chuông chánh niệm ngân vang');
                }}
                className="w-9 h-9 rounded-xl border border-[#EEDBBA] bg-[#FFF9EA] hover:border-[#E5C158] flex items-center justify-center text-[#8C5500] transition-all active:scale-90 cursor-pointer shadow-xs"
                title="Thỉnh chuông"
              >
                <TempleBellIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 rounded-xl border border-[#EEDBBA] bg-[#FFF9EA] hover:border-[#E5C158] flex items-center justify-center text-[#6A5234] transition-all active:scale-90 cursor-pointer shadow-xs"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 2. BENTO HERO CARD: LUNAR-SOLAR & QUICK SANCTUARY ACTIONS */}
          <section className="rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] p-4 shadow-[0_8px_30px_rgba(200,160,50,0.08)] space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8C5500] bg-[#FFF4D0] px-2.5 py-0.5 rounded-full border border-[#F2DE9C] whitespace-nowrap">
                  <LotusMinimalIcon className="w-3 h-3 shrink-0" />
                  <span>Lịch Cát Tường Hôm Nay</span>
                </div>
                <h2 className="font-heading font-serif text-[15px] sm:text-lg font-bold text-[#2E1E0F] pt-0.5 whitespace-nowrap">
                  {selectedDay.lunarDate} tháng 09 Âm lịch • Bính Ngọ
                </h2>
                <p className="text-[11px] sm:text-xs text-[#6A5234] whitespace-nowrap truncate">
                  {selectedDay.name === 'CN' ? 'Chủ Nhật' : `Thứ ${selectedDay.name}`}, {selectedDay.solarDate}/11/2026 • Tiết Lập Đông
                </p>
              </div>

              <Link
                href="/lich-phat-giao"
                className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EEDBBA] text-[11px] font-bold text-[#8C5500] flex items-center gap-0.5 shrink-0 whitespace-nowrap active:scale-95 shadow-xs"
              >
                <span>Chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Highlighted Holy Day Banner */}
            {selectedDay.festivalName && (
              <div className="p-2.5 rounded-2xl bg-white/90 border border-[#EEDBBA] flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#FFF4D0] border border-[#F2DE9C] flex items-center justify-center text-[#8C5500] shrink-0">
                  <DharmaWheelIcon className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-[#8C5500] truncate whitespace-nowrap">
                  {selectedDay.festivalName}
                </p>
              </div>
            )}

            {/* 7-Day Interactive Strip — Crisp Square Proportions */}
            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day) => {
                const isSelected = selectedDay.solarDate === day.solarDate;
                return (
                  <button
                    key={day.solarDate}
                    type="button"
                    onClick={() => {
                      playWoodenFishSound(0.2);
                      setSelectedDay(day);
                    }}
                    className={cn(
                      'aspect-square rounded-xl p-0.5 flex flex-col items-center justify-center transition-all cursor-pointer border',
                      isSelected
                        ? 'bg-gradient-to-b from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold border-[#FFF8CC] shadow-xs'
                        : 'bg-white text-[#6A5234] border-[#EEDBBA] hover:bg-[#FFF9EA]'
                    )}
                  >
                    <span className="text-[9px] leading-none opacity-85">{day.name}</span>
                    <span className="text-xs font-bold leading-none mt-1">{day.solarDate}</span>
                    <span
                      className={cn(
                        'text-[8px] leading-none mt-0.5',
                        isSelected ? 'text-[#3D2505]/85 font-bold' : 'text-[#8C5500]'
                      )}
                    >
                      {day.lunarDate}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3 Quick Action Buttons inside Hero — Full Text Without Truncation */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setIsIncenseOpen(true)}
                className="py-2.5 px-1.5 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#FAD02C] to-[#E6A917] text-[#3D2505] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <IncenseAltarIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Dâng Hương</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMalaOpen(true)}
                className="py-2.5 px-1.5 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <MalaBeadsMinimalIcon className="w-3.5 h-3.5 shrink-0" />
                <span>108 Hạt</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/thu-vien')}
                className="py-2.5 px-1.5 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <SutraScrollIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Tụng Kinh</span>
              </button>
            </div>
          </section>

          {/* 3. REACT NATIVE SEGMENTED CONTROL SWITCHER */}
          <section className="space-y-4">
            <div className="p-1 rounded-2xl bg-[#FFF9EA] border border-[#EEDBBA] grid grid-cols-3 gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setMobileSegment('thoi-khoa')}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                  mobileSegment === 'thoi-khoa'
                    ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-xs'
                    : 'text-[#7D6442] hover:text-[#2E1E0F]'
                )}
              >
                <BodhiLeafIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">4 Thời Tu</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSegment('phat-dai')}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                  mobileSegment === 'phat-dai'
                    ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-xs'
                    : 'text-[#7D6442] hover:text-[#2E1E0F]'
                )}
              >
                <LotusMinimalIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Pháp Cú</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSegment('phap-am')}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                  mobileSegment === 'phap-am'
                    ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] shadow-xs'
                    : 'text-[#7D6442] hover:text-[#2E1E0F]'
                )}
              >
                <TempleBellIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Pháp Âm</span>
              </button>
            </div>

            {/* SEGMENT 1: 4 THỜI CÔNG PHU TRONG NGÀY */}
            {mobileSegment === 'thoi-khoa' && (
              <div className="rounded-3xl bg-white border border-[#EEDBBA] p-4 space-y-3.5 shadow-md animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
                      Thời Khóa 4 Thời Hôm Nay
                    </h3>
                    <p className="text-[11px] text-[#7D6442]">
                      Chạm vào từng thời để ghi nhận công đức tu tập
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#FFF4D0] text-[#8C5500] border border-[#F2DE9C]">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#F2E5C7] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FAD02C] to-[#E59800] transition-all duration-500"
                    style={{ width: `${Math.max(8, progressPercent)}%` }}
                  />
                </div>

                <div className="space-y-2.5">
                  {DAILY_PERIODS.map((item) => {
                    const isDone = completedPeriods.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePeriod(item.id)}
                        className={cn(
                          'w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-98 cursor-pointer',
                          isDone
                            ? 'bg-gradient-to-r from-[#FFF5D6] to-[#FFEBB0] border-[#E5C158] shadow-xs'
                            : 'bg-[#FFFDF8] border-[#EEDBBA] hover:bg-[#FFF9EA]'
                        )}
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-[#8C5500]">
                              {item.period}
                            </span>
                            <span className="text-[10px] font-mono text-[#7D6442]">
                              {item.timeRange}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-[#2E1E0F]">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#6A5234] line-clamp-1">
                            {item.practice}
                          </p>
                        </div>

                        <div
                          className={cn(
                            'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all',
                            isDone
                              ? 'bg-gradient-to-br from-[#FFE79A] to-[#FAD02C] text-[#3D2505] border-[#FFF8CC]'
                              : 'bg-white border-[#EEDBBA] text-transparent'
                          )}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SEGMENT 2: THỈNH KỆ KINH PHÁP CÚ (DHAMMAPADA ORACLE) */}
            {mobileSegment === 'phat-dai' && (
              <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] p-5 space-y-4 shadow-md animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                    <span className="text-xs font-bold text-[#8C5500] uppercase tracking-wider">
                      {currentVerse.number} • {currentVerse.chapter}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDrawNewVerse}
                    className="px-3 py-1 rounded-xl bg-[#FFF4D0] border border-[#F2DE9C] text-[#8C5500] text-[11px] font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Thỉnh Kệ Mới</span>
                  </button>
                </div>

                <p className="text-xs font-serif italic text-[#7D6442] border-l-2 border-[#E5C158] pl-3">
                  &ldquo;{currentVerse.pali}&rdquo;
                </p>

                <blockquote className="font-heading font-serif text-base font-bold text-[#2E1E0F] leading-relaxed whitespace-pre-line">
                  {currentVerse.vietnamese}
                </blockquote>

                <div className="p-3 rounded-2xl bg-white/90 border border-[#EEDBBA] text-xs text-[#5A4329] leading-relaxed shadow-xs">
                  <strong className="text-[#8C5500]">Ứng dụng chánh niệm: </strong>
                  {currentVerse.application}
                </div>
              </div>
            )}

            {/* SEGMENT 3: BỘ HÒA ÂM THIỀN TỰ ĐA TẦNG */}
            {mobileSegment === 'phap-am' && (
              <div className="rounded-3xl bg-white border border-[#EEDBBA] p-4 space-y-3.5 shadow-md animate-fade-in">
                <div>
                  <h3 className="font-heading font-serif font-bold text-sm text-[#8C5500]">
                    Bộ Hòa Âm Thiền TỰ Đa Tầng (432Hz)
                  </h3>
                  <p className="text-[11px] text-[#7D6442]">
                    Kết hợp thanh âm chùa cổ giúp tịnh hóa không gian tu tập
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playGrandTempleBellSound(0.6);
                      showToast('Đang ngân vang: Đại Hồng Chung');
                    }}
                    className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#EEDBBA] hover:bg-[#FFF9EA] flex items-center gap-3 text-left active:scale-95 cursor-pointer shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#F2DE9C] flex items-center justify-center text-[#8C5500] shrink-0">
                      <TempleBellIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#2E1E0F] truncate">Đại Hồng Chung</h4>
                      <p className="text-[10px] text-[#7D6442]">Thỉnh chuông chùa</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleAutoWoodenFish}
                    className={cn(
                      'p-3.5 rounded-2xl border flex items-center gap-3 text-left active:scale-95 cursor-pointer shadow-xs',
                      isAutoWoodenFish
                        ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] border-[#FFF8CC]'
                        : 'bg-[#FFFDF8] border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#2E1E0F]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        isAutoWoodenFish ? 'bg-[#3D2505]/15 text-[#3D2505]' : 'bg-[#FFF4D0] border border-[#F2DE9C] text-[#8C5500]'
                      )}
                    >
                      <WoodenFishMinimalIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">
                        {isAutoWoodenFish ? 'Mõ: Đang Gõ' : 'Mõ Giữ Nhịp'}
                      </h4>
                      <p className={cn('text-[10px]', isAutoWoodenFish ? 'text-[#3D2505]/80 font-bold' : 'text-[#7D6442]')}>
                        Nhịp 60 BPM
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleDrone}
                    className={cn(
                      'p-3.5 rounded-2xl border flex items-center gap-3 text-left active:scale-95 cursor-pointer shadow-xs',
                      isDroneActive
                        ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] border-[#FFF8CC]'
                        : 'bg-[#FFFDF8] border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#2E1E0F]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        isDroneActive ? 'bg-[#3D2505]/15 text-[#3D2505]' : 'bg-[#FFF4D0] border border-[#F2DE9C] text-[#8C5500]'
                      )}
                    >
                      {isDroneActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">Tần Số 432Hz</h4>
                      <p className={cn('text-[10px]', isDroneActive ? 'text-[#3D2505]/80 font-bold' : 'text-[#7D6442]')}>
                        {isDroneActive ? 'Đang phát' : 'Sóng âm định tâm'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playBellSound(0.5);
                      showToast('Khánh đồng tỉnh thức');
                    }}
                    className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#EEDBBA] hover:bg-[#FFF9EA] flex items-center gap-3 text-left active:scale-95 cursor-pointer shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FFF4D0] border border-[#F2DE9C] flex items-center justify-center text-[#8C5500] shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#2E1E0F] truncate">Khánh Đồng</h4>
                      <p className="text-[10px] text-[#7D6442]">Chuông nhập thiền</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 4. SNAP-SCROLL CAROUSEL: CHƯ VỊ PHẬT & BỒ TÁT BỔN TÔN */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LotusMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-base text-[#2E1E0F]">
                  Chiêm Bái Chư Phật &amp; Bồ Tát
                </h3>
              </div>
              <span className="text-[11px] text-[#7D6442]">Vuốt ngang →</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
              {BUDDHAS_LIST.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    playBellSound(0.35);
                    setSelectedBuddha(b);
                  }}
                  className="snap-start w-48 shrink-0 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] overflow-hidden shadow-sm active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#FFFDF7]">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-3 space-y-0.5">
                    <h4 className="font-heading font-serif font-bold text-xs text-[#8C5500] truncate whitespace-nowrap">
                      {b.name}
                    </h4>
                    <p className="text-[10px] text-[#6A5234] line-clamp-2 leading-snug">
                      {b.vow}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. SNAP-SCROLL CAROUSEL: DANH LAM CỔ TỰ VIỆT NAM */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PagodaMinimalIcon className="w-4 h-4 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-base text-[#2E1E0F]">
                  Danh Lam Cổ Tự Việt Nam
                </h3>
              </div>
              <Link
                href="/di-chua-online"
                className="text-xs font-semibold text-[#8C5500] flex items-center gap-0.5"
              >
                <span>Chánh điện</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
              {TEMPLES_LIST.map((temple) => (
                <div
                  key={temple.name}
                  onClick={() => {
                    playBellSound(0.35);
                    setSelectedTemple(temple);
                  }}
                  className="snap-start w-52 shrink-0 rounded-2xl overflow-hidden border border-[#EEDBBA] hover:border-[#E5C158] bg-white group cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#FFFDF7]">
                    <img
                      src={temple.image}
                      alt={temple.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-heading font-serif font-bold text-xs text-[#2E1E0F] truncate">
                      {temple.name}
                    </h4>
                    <p className="text-[11px] text-[#6A5234] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-[#B87B08] shrink-0" />
                      <span>{temple.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. CẨM NANG CHUYỂN HÓA TÂM (FILTERABLE REACT NATIVE CARDS) */}
          <section className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SutraScrollIcon className="w-4 h-4 text-[#8C5500]" />
                <h3 className="font-heading font-serif font-bold text-base text-[#2E1E0F]">
                  Cẩm Nang Chuyển Hóa Tâm
                </h3>
              </div>
            </div>

            {/* Horizontal Topic Filter Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['Tất cả', 'Chữa lành tâm', 'Nhân quả & Phúc báo', 'Thiền đời thường', 'Hiếu đạo'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMobileArticleFilter(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
                      mobileArticleFilter === cat
                        ? 'bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold shadow-xs'
                        : 'bg-white border border-[#EEDBBA] text-[#6A5234]'
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="space-y-3">
              {mobileFilteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => {
                    playWoodenFishSound(0.25);
                    setSelectedArticle(article);
                  }}
                  className="p-3 rounded-2xl bg-white border border-[#EEDBBA] hover:border-[#E5C158] flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-all shadow-sm group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#FFFDF7] border border-[#ECD9A8]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#8C5500] bg-[#FFF4D0] px-2 py-0.5 rounded-md border border-[#F2DE9C] whitespace-nowrap">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-[#7D6442] whitespace-nowrap">{article.readTime}</span>
                    </div>
                    <h4 className="font-heading font-serif font-bold text-xs sm:text-sm text-[#2E1E0F] group-hover:text-[#8C5500] line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-[#6A5234] line-clamp-1 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 7. DHARMA MISSION FOOTER CARD */}
          <section className="rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FFF4D1] border border-[#ECD9A8] p-5 text-center space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FAD02C] to-[#FFE79A] flex items-center justify-center text-[#3D2505] mx-auto shadow-xs">
              <DharmaWheelIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-serif font-bold text-base text-[#8C5500]">
                DHARMA — Ánh Sáng Chánh Pháp
              </h4>
              <p className="text-xs text-[#6A5234] leading-relaxed">
                Đạo tràng kỹ thuật số thanh tịnh dành cho người cư sĩ tại gia: giữ trọn 4 thời công phu, thọ trì kinh điển và nuôi dưỡng Bồ Đề tâm mỗi ngày.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] text-xs font-bold active:scale-95 cursor-pointer shadow-xs"
            >
              <LotusMinimalIcon className="w-4 h-4" />
              <span>Tìm Hiểu Tôn Chỉ Dharma</span>
            </button>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - Radiant Buddhist Gold Multi-Column Sanctuary       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative z-10">
        <OmManiDesktopHome
          user={user}
          showToast={showToast}
          onOpenMala={() => setIsMalaOpen(true)}
          onOpenIncense={() => setIsIncenseOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onSelectArticle={(a) => setSelectedArticle(a)}
          onSelectBuddha={(b) => setSelectedBuddha(b)}
          onSelectSutra={() => router.push('/thu-vien')}
          onOpenAbout={() => setIsAboutOpen(true)}
          isDroneActive={isDroneActive}
          onToggleDrone={handleToggleDrone}
          isAutoWoodenFish={isAutoWoodenFish}
          onToggleAutoWoodenFish={handleToggleAutoWoodenFish}
          currentVerse={currentVerse}
          onDrawNewVerse={handleDrawNewVerse}
          dailyPeriods={DAILY_PERIODS}
          completedPeriods={completedPeriods}
          onTogglePeriod={handleTogglePeriod}
          weekDays={WEEK_DAYS}
          featuredArticles={FEATURED_ARTICLES}
          buddhas={BUDDHAS_LIST}
          temples={TEMPLES_LIST}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODALS & REACT NATIVE BOTTOM SHEETS                                       */}
      {/* ========================================================================= */}
      <MalaBeadsModal isOpen={isMalaOpen} onClose={() => setIsMalaOpen(false)} />
      <IncenseOfferingModal isOpen={isIncenseOpen} onClose={() => setIsIncenseOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Buddha Detail Modal */}
      {selectedBuddha && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBuddha(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 sm:p-6 text-[#2E1E0F] shadow-2xl animate-scale-in space-y-4">
            <button
              onClick={() => setSelectedBuddha(null)}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-[#FFF9EA] border border-[#EEDBBA]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-[#E5A716] shadow-[0_0_25px_rgba(230,170,30,0.3)] bg-[#FFFDF7]">
              <img
                src={selectedBuddha.image}
                alt={selectedBuddha.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-serif font-bold text-base sm:text-lg text-[#8C5500]">
                {selectedBuddha.title}
              </h3>
              <p className="text-xs text-[#6A5234] font-serif italic">
                &ldquo;{selectedBuddha.mantra}&rdquo;
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F2E5C7] text-xs text-[#5A4329] leading-relaxed">
              <p className="font-bold text-[#8C5500] mb-1">Đại Nguyện &amp; Công Đức:</p>
              <p>{selectedBuddha.vow}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  playBellSound(0.5);
                  showToast(`Đã nhất tâm niệm: ${selectedBuddha.mantra}`);
                  setSelectedBuddha(null);
                  setIsMalaOpen(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
              >
                Lần Chuỗi Niệm Phật
              </button>
              <button
                onClick={() => {
                  setSelectedBuddha(null);
                  setIsIncenseOpen(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] font-bold text-xs active:scale-95 cursor-pointer shadow-xs"
              >
                Dâng Hương Lễ Phật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temple Detail Modal */}
      {selectedTemple && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTemple(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-5 sm:p-6 text-[#2E1E0F] shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EEDBBA]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5500] block">
                  {selectedTemple.tradition || 'Danh Lam Cổ Tự Việt Nam'}
                </span>
                <h3 className="font-heading font-serif font-bold text-base sm:text-lg text-[#2E1E0F] mt-0.5">
                  {selectedTemple.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemple(null)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-[#FFF9EA] border border-[#EEDBBA] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-[#ECD9A8] bg-[#FFFDF7]">
              <img
                src={selectedTemple.image}
                alt={selectedTemple.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-[#8C5500] flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#B87B08]" />
              <span>Địa điểm: {selectedTemple.location}</span>
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F2E5C7] text-xs text-[#5A4329] leading-relaxed">
              {selectedTemple.history}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedTemple(null);
                  setIsIncenseOpen(true);
                }}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
              >
                Dâng Hương Lễ Phật
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTemple(null);
                  router.push('/di-chua-online');
                }}
                className="py-2.5 px-2 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] font-bold text-xs active:scale-95 cursor-pointer shadow-xs"
              >
                Vào Chánh Điện Online
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg max-h-[86vh] flex flex-col rounded-3xl bg-white border border-[#ECD9A8] p-5 sm:p-6 text-[#2E1E0F] shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDBBA] shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#8C5500] font-bold">
                <SutraScrollIcon className="w-4 h-4 text-[#B87B08]" />
                <span>{selectedArticle.category || 'Pháp Bảo Dharma'}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-[#FFF9EA] border border-[#EEDBBA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar py-4 space-y-4 pr-1">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-[#ECD9A8]">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-heading font-serif font-bold text-base sm:text-xl text-[#8C5500] leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="text-xs text-[#7D6442]">
                Nguồn: <span className="text-[#5A4329] font-medium">{selectedArticle.authorOrSource}</span> •{' '}
                {selectedArticle.readTime}
              </div>

              <div className="text-xs sm:text-sm text-[#3E2D1D] leading-relaxed whitespace-pre-line space-y-3 font-serif">
                {selectedArticle.content}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEDBBA] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playBellSound(0.4);
                  showToast('Hoan hỷ ghi nhận công đức pháp học!');
                  setSelectedArticle(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
              >
                <LotusMinimalIcon className="w-4 h-4" />
                <span>Hoan Hỷ Thọ Trì</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  showToast('Đã sao chép liên kết bài pháp');
                }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#EEDBBA] hover:bg-[#FFF9EA] text-[#8C5500] font-semibold text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Dharma Modal */}
      {isAboutOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAboutOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[86vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#ECD9A8] p-6 text-[#2E1E0F] shadow-2xl animate-scale-in text-center space-y-4">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 text-[#7D6442] hover:text-[#2E1E0F] p-1.5 rounded-full bg-[#FFF9EA] border border-[#EEDBBA]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-[#ECD9A8] shadow-md bg-[#FFFDF7]">
              <img
                src="/dharma-logo.png"
                alt="Dharma Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-heading font-serif font-bold text-base sm:text-lg text-[#8C5500]">
                DHARMA — Không Gian Chánh Niệm &amp; Pháp Bảo
              </h3>
              <p className="text-xs text-[#6A5234] mt-1">
                Đạo tràng trực tuyến thanh tịnh dành cho người con Phật
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2E5C7] text-xs text-[#5A4329] leading-relaxed text-left space-y-2">
              <p>
                <strong className="text-[#8C5500]">Tôn chỉ:</strong> Đưa lời Phật dạy vào từng hơi thở và thời khóa thực hành mỗi ngày với giao diện trang nghiêm, tịnh khiết.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#6A5234]">
                <li>Thời khóa 4 thời công phu &amp; Thỉnh kệ Kinh Pháp Cú</li>
                <li>Lịch Vạn Niên, ngày Trai giới &amp; thực đơn chay dưỡng sinh</li>
                <li>Mõ tụng kinh tự động theo nhịp BPM &amp; Trình đọc kinh chạy chữ</li>
                <li>Thẻ Cư Sĩ Hoàng Kim, Bảng tự kiểm Ngũ Giới &amp; Sổ Công Đức</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsAboutOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFE79A] to-[#FAD02C] text-[#3D2505] font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-white/95 border border-[#EEDBBA] text-center shadow-xl backdrop-blur-md flex items-center gap-2">
            <LotusMinimalIcon className="w-4 h-4 text-[#B87B08] shrink-0" />
            <p className="font-heading text-xs sm:text-sm font-bold text-[#8C5500]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OmManiAppStoreHome;
