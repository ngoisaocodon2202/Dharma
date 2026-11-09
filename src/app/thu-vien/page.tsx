'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Bookmark,
  ChevronRight,
  Check,
  Play,
  Pause,
} from 'lucide-react';
import {
  SutraScrollIcon,
  DharmaWheelIcon,
  LotusMinimalIcon,
  WoodenFishMinimalIcon,
  TempleBellIcon,
  BodhiLeafIcon,
} from '@/components/icons/DharmaMinimalIcons';
import {
  playBellSound,
  playWoodenFishSound,
  playPageTurnSound,
  playGrandTempleBellSound,
} from '@/lib/buddhistSounds';
import { recordDharmaMerit } from '@/components/om-mani/OmManiInteractiveTools';
import { OmManiDesktopSutras } from '@/components/om-mani/desktop/OmManiDesktopSutras';
import { cn } from '@/lib/utils';

// =============================================================================
// INTERFACES & SUTRAS DATA
// =============================================================================
export interface SutraItem {
  id: string;
  tradition: 'Nam Tông' | 'Bắc Tông' | 'Mật Tông';
  categoryLabel: string;
  title: string;
  image: string;
  excerpt: string;
  content: string;
  versesCount?: number;
}

const SUTRA_COUNTS_STORAGE_KEY = 'phatphap_dharma_sutra_counts_v1';

const SUTRAS_LIST: SutraItem[] = [
  {
    id: 'kinh-bat-nha-tam-kinh',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh Đại Thừa • Bát Nhã',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
    image: '/images/tripitaka_koreana.jpg',
    versesCount: 25,
    excerpt: 'Tinh túy trí tuệ Bát Nhã soi sáng bản chất Ngũ Uẩn Giai Không của vạn pháp, giúp hành giả vượt qua mọi khổ ách và sợ hãi.',
    content: `MA HA BÁT NHÃ BA LA MẬT ĐA TÂM KINH
(Việt dịch & Âm Hán Việt Nhật Tụng)

1. Bản Âm Hán Việt:
Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.
Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc; thọ, tưởng, hành, thức diệc phục như thị.
Xá Lợi Tử! Thị chư pháp không tướng: Bất sinh bất diệt, bất cấu bất tịnh, bất tăng bất giảm. Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp; vô nhãn giới nãi chí vô ý thức giới; vô vô minh diệc vô vô minh tận, nãi chí vô lão tử, diệc vô lão tử tận; vô khổ, tập, diệt, đạo; vô trí diệc vô đắc.
Dĩ vô sở đắc cố, Bồ Đề Tát Đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn. Tam thế chư Phật y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.
Cố tri Bát Nhã Ba La Mật Đa thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chân thật bất hư.
Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết:
"Yết đế, yết đế, ba la yết đế, ba la tăng yết đế, Bồ đề tát bà ha." (3 biến)

2. Nghĩa Việt Tường Giải:
Khi Bồ Tát Quán Tự Tại thực hành sâu xa trí tuệ Bát Nhã Ba La Mật Đa, Ngài soi thấy năm uẩn đều không có tự tính riêng biệt, liền vượt qua hết thảy khổ đau ách nạn...`,
  },
  {
    id: 'kinh-tu-bi-metta',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh Nguyên Thủy • Nikāya',
    title: 'Kinh Từ Bi (Karaṇīya Mettā Sutta)',
    image: '/images/buddha_meditation.jpg',
    versesCount: 10,
    excerpt: 'Lời Đức Thế Tôn chỉ dạy phương pháp rải tâm từ bi vô lượng không biên giới đến khắp muôn loài chúng sinh trong mười phương.',
    content: `KINH TỪ BI (KARAṆĪYA METTĀ SUTTA)
(Tiểu Bộ Kinh — Khuddakapāṭha)

1. Phẩm Chất Người Hành Đạo Từ Bi:
Người muốn thấu đạt cảnh giới an tịnh Niết Bàn cần phải thực hành những điều lành sau đây:
Có khả năng, ngay thẳng, trung thực tuyệt đối, lời nói hiền hòa, dịu dàng và không kiêu mạn.
Biết đủ trong đời sống, dễ nuôi dưỡng, ít bận rộn thế sự, sống giản dị thanh bần, các căn trầm tĩnh, trí tuệ sáng suốt, thân khẩu ý trang nghiêm, không quyến luyến gia đình thế tục.
Không làm bất cứ điều gì nhỏ nhặt mà bậc Hiền Trí có thể khiển trách.

2. Quán Chiếu Tâm Từ Vô Lượng:
Hãy thường xuyên phát nguyện:
"Nguyện cho tất cả chúng sinh được an vui, hạnh phúc và an toàn.
Phàm những loài chúng sinh nào có mặt trên đời:
Dù yếu kém hay mạnh mẽ, không bỏ sót một ai;
Dù dài lớn, trung bình hay thấp nhỏ, vi tế hay thô đại;
Dù thấy được hay không thấy được;
Dù ở gần hay ở xa;
Dù đã sinh ra hay sắp sửa sinh ra —
Nguyện cho tất cả muôn loài đều được tràn đầy an lạc!"

3. Trái Tim Người Mẹ Hiền:
"Như người mẹ đem cả mạng sống mình che chở cho đứa con một duy nhất, hãy mở rộng tâm từ bi không bờ bến đối với tất cả muôn loài.
Khi đứng, khi đi, khi ngồi hay khi nằm, bao lâu còn thức tỉnh, hãy an trú vững chãi trong chánh niệm Từ Bi ấy. Đó chính là Phạm Trú cao thượng nhất ở đời."`,
  },
  {
    id: 'kinh-phuoc-duc-mangala',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh Nguyên Thủy • Nikāya',
    title: 'Kinh Phước Đức (Maṅgala Sutta)',
    image: '/images/golden_buddha.jpg',
    versesCount: 12,
    excerpt: 'Ba mươi tám pháp phước lành cao thượng nhất giúp người cư sĩ xây dựng gia đình ấm êm, sự nghiệp chánh mạng và tâm hồn bất động.',
    content: `KINH PHƯỚC ĐỨC (MAṄGALA SUTTA)
(Lời Phật Dạy Về 38 Phước Lành Cao Thượng)

Như vầy tôi nghe: Một thời Thế Tôn ngự tại thành Xá Vệ, rừng Kỳ Đà, vườn ông Cấp Cô Độc. Khi đêm đã khuya, một vị Thiên Nhân hào quang rực rỡ đến đảnh lễ Đức Phật và bạch hỏi về các điều Phước Lành tối thượng. Đức Thế Tôn liền thuyết kệ đáp rằng:

1. Nền Tảng Thân Cận Thiện Hữu:
Không gần gũi kẻ ác,
Thân cận bậc trí hiền,
Đảnh lễ người đáng kính —
Ấy phước lành cao nhất.

2. Môi Trường & Công Đức:
Ở trú xứ thích hợp,
Đời trước có phước xưa,
Chân chánh hướng tự tâm —
Ấy phước lành cao nhất.

3. Học Rộng & Ái Ngữ:
Đa văn và nghề giỏi,
Giữ giới luật tinh nghiêm,
Nói những lời chân thật —
Ấy phước lành cao nhất.

4. Hiếu Hạnh & Gia Đạo:
Phụng dưỡng cha và mẹ,
Yêu thương vợ cùng con,
Nghề nghiệp không rối ren —
Ấy phước lành cao nhất.

5. Tâm Bất Động Giữa Tám Ngọn Gió Đời:
Khi tiếp xúc việc đời,
Tâm không hề giao động,
Không sầu, không nhiễm ô,
An nhiên và tự tại —
Ấy phước lành cao nhất.`,
  },
  {
    id: 'kinh-kim-cuong-bat-nha',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh Đại Thừa • Bát Nhã',
    title: 'Kinh Kim Cương Bát Nhã Ba La Mật',
    image: '/images/sutra_book.jpg',
    versesCount: 32,
    excerpt: 'Bảo kiếm trí tuệ Kim Cương chặt đứt bốn tướng Ngã, Nhân, Chúng Sinh, Thọ Giả để hiển lộ bản tâm thanh tịnh.',
    content: `KINH KIM CƯƠNG BÁT NHÃ BA LA MẬT
(Trích Phẩm Tinh Yếu Nhật Tụng)

1. Vô Trụ Tướng Bố Thí:
Đức Phật bảo ngài Tu Bồ Đề:
"Các vị Bồ Tát lớn nên như thế mà hàng phục vọng tâm: Phàm có bao nhiêu loài chúng sinh, hoặc sinh từ trứng, hoặc sinh từ thai, hoặc sinh chỗ ẩm ướt, hoặc hóa sinh; hoặc có sắc, hoặc không sắc; hoặc có tưởng, hoặc không tưởng... Ta đều khiến vào Vô Dư Niết Bàn mà diệt độ hết. Diệt độ vô lượng chúng sinh như thế, nhưng thật không có một chúng sinh nào được diệt độ cả."

2. Phàm Sở Hữu Tướng Giai Thị Hư Vọng:
"Này Tu Bồ Đề! Bồ Tát khi bố thí không nên trụ vào sắc, không nên trụ vào thanh, hương, vị, xúc, pháp. Phàm cái gì có hình tướng đều là hư vọng. Nếu thấy các tướng chẳng phải tướng, tức thấy Như Lai."

3. Ưng Vô Sở Trụ Nhi Sinh Kỳ Tâm:
"Bồ Tát nên lìa tất cả tướng, phát tâm Vô Thượng Chánh Đẳng Chánh Giác. Không nên trụ nơi sắc mà sinh tâm, không nên trụ nơi thanh, hương, vị, xúc, pháp mà sinh tâm; nên không có chỗ trụ mà sinh tâm thanh tịnh."

4. Bài Kệ Tứ Cú Tuyệt Đỉnh:
"Tất cả pháp hữu vi,
Như mộng, huyễn, bọt, bóng,
Như sương mai, ánh chớp,
Hãy quán chiếu như vậy."`,
  },
  {
    id: 'kinh-muoi-nguyen-pho-hien',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh Đại Thừa • Hoa Nghiêm',
    title: 'Phẩm Phổ Hiền Hạnh Nguyện (10 Đại Nguyện)',
    image: '/images/golden_buddha_altar.jpg',
    versesCount: 10,
    excerpt: 'Mười đại nguyện vương rộng lớn của Bồ Tát Phổ Hiền dẫn dắt hành giả tu phước và tu huệ viên mãn.',
    content: `KINH HOA NGHIÊM — MƯỜI ĐẠI NGUYỆN PHỔ HIỀN
(Thập Đại Nguyện Vương)

Một là: Lễ kính chư Phật — Tâm thường cung kính đảnh lễ mười phương ba đời hết thảy chư Phật.
Hai là: Xưng揚 tán thán Như Lai — Dùng lời chân thật ca ngợi công đức lành của bậc Giác Ngộ.
Ba là: Quảng tu cúng dường — Cúng dường pháp bảo, tu hành đúng lời Phật dạy là sự cúng dường tối thượng.
Bốn là: Sám hối nghiệp chướng — Chí thành phát lộ ăn năn mọi lỗi lầm do tham, sân, si gây tạo từ vô thủy.
Năm là: Tùy hỷ công đức — Hoan hỷ vui mừng trước mọi điều thiện lành, phước báu của tất cả chúng sinh.
Sáu là: Thỉnh chuyển pháp luân — Cầu thỉnh các bậc Thiện Tri Thức giảng nói Chánh Pháp lợi lạc quần sinh.
Bảy là: Thỉnh Phật trụ thế — Cầu xin chư Phật, Bồ Tát và bậc chân tu trụ lâu nơi đời làm bóng cây che mát.
Tám là: Thường tùy Phật học — Tinh tấn học hỏi theo gương đại hùng đại lực đại từ bi của Đức Phật.
Chín là: Hằng thuận chúng sinh — Thấu hiểu, cảm thông và phụng sự muôn loài bằng trái tim vô ngã.
Mười là: Phổ giai hồi hướng — Đem hết thảy công đức tu tập hồi hướng về Pháp Giới chúng sinh đồng thành Phật đạo.`,
  },
  {
    id: 'kinh-duoc-su-bon-nguyen',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh Đại Thừa • Dược Sư',
    title: 'Kinh Dược Sư Lưu Ly Quang Bổn Nguyện',
    image: '/images/buddha_temple.jpg',
    versesCount: 20,
    excerpt: 'Mười hai đại nguyện của Đức Phật Dược Sư tiêu trừ bệnh khổ thân tâm, chuyển hóa nghiệp chướng và hộ trì gia đạo bình an.',
    content: `KINH DƯỢC SƯ LƯU LY QUANG NHƯ LAI BỔN NGUYỆN CÔNG ĐỨC
(Trích Phẩm Mười Hai Đại Nguyện & Chơn Ngôn)

1. Cõi Tịnh Lưu Ly Phương Đông:
Đức Phật Thích Ca Mâu Ni bảo Bồ Tát Văn Thù Sư Lợi:
"Về phương Đông, cách đây hơn mười hằng hà sa cõi Phật, có thế giới tên là Tịnh Lưu Ly, Phật hiệu là Dược Sư Lưu Ly Quang Như Lai, Ứng Cúng, Chánh Biến Tri, Minh Hạnh Túc, Thiện Thệ, Thế Gian Giải, Vô Thượng Sĩ, Điều Ngự Trượng Phu, Thiên Nhân Sư, Phật, Thế Tôn."

2. Tinh Yếu 12 Đại Nguyện Cứu Khổ:
- Nguyện ánh sáng thân Ngài chiếu rọi vô biên thế giới, khiến chúng sinh đều được trang nghiêm ba mươi hai tướng tốt.
- Nguyện thân như ngọc lưu ly trong suốt không tỳ vết, vượt hơn ánh mặt trời và mặt trăng, soi sáng cho những ai đang đi trong đêm tối vô minh.
- Nguyện dùng trí tuệ phương tiện vô tận giúp chúng sinh không bao giờ thiếu thốn vật dụng tu học.
- Nguyện ai có thân thể đau yếu, tật nguyền, khổ sở không người cứu chữa, vừa nghe danh hiệu Ngài liền được tiêu trừ mọi bệnh khổ, thân tâm an lạc.

3. Dược Sư Quán Đảnh Chơn Ngôn:
"Nam mô bạt già phạt đế, bệ sát xã, lũ lô thích lưu ly, phách lạt bà, hắt ra xà dã, đát tha yết đa da, a ra ha đế, tam miệu tam bột đà da, đát điệt tha: Án, bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế tằng sa ha."`,
  },
  {
    id: 'kinh-trung-dao-duyen-khoi',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh Nguyên Thủy • Nikāya',
    title: 'Kinh Trung Đạo & Giáo Lý Duyên Khởi',
    image: '/images/lotus_blooming.jpg',
    versesCount: 16,
    excerpt: 'Thấu rõ lý Duyên Khởi “Cái này có nên cái kia có”, xa lìa hai thái cực Thường Kiến và Đoạn Kiến.',
    content: `KINH KACCĀNAGOTTA (CHÁNH KIẾN TRUNG ĐẠO)
(Tương Ưng Bộ Kinh — Saṃyutta Nikāya)

1. Lìa Hai Cực Đoan Có & Không:
Đức Thế Tôn dạy Tôn giả Kaccāyana:
"Này Kaccāyana, thế gian phần nhiều dựa vào hai cực đoan: Một là chấp Có (Thường kiến), hai là chấp Không (Đoạn kiến).
Kẻ nào với chánh trí tuệ thấy như thật sự tập khởi của thế gian, thì không còn chấp rằng thế gian là Không.
Kẻ nào với chánh trí tuệ thấy như thật sự đoạn diệt của thế gian, thì không còn chấp rằng thế gian là Có vĩnh hằng."

2. Định Luật Duyên Khởi:
"Từ bỏ hai cực đoan ấy, Như Lai thuyết pháp theo con đường Trung Đạo:
Do cái này có mặt, cái kia có mặt.
Do cái này sinh khởi, cái kia sinh khởi.
Do cái này không có mặt, cái kia không có mặt.
Do cái này đoạn diệt, cái kia đoạn diệt.
Nghĩa là: Vô minh diệt thì Hành diệt, Hành diệt thì Thức diệt... như vậy là toàn bộ khối khổ đau sầu bi khổ ưu não này đều được đoạn tận."`,
  },
  {
    id: 'kinh-ho-niem-lam-chung',
    tradition: 'Mật Tông',
    categoryLabel: 'Nghi Thức • Khai Thị & Hồi Hướng',
    title: 'Nghi Thức Khai Thị & Trợ Niệm An Tịnh',
    image: '/images/quan_am_bodhisattva.jpg',
    versesCount: 18,
    excerpt: 'Lời khai thị chánh niệm giúp người bệnh và người lâm chung buông xả sợ hãi, nhất tâm quy hướng Tam Bảo.',
    content: `NGHI THỨC KHAI THỊ & TRỢ NIỆM CHÁNH NIỆM
(Dành Cho Người Bệnh & Thời Khắc Chuyển Tiếp)

1. Lắng Lòng Thanh Tịnh:
Khi chăm sóc người bệnh nặng hoặc người sắp xả báo thân, gia quyến giữ không khí trang nghiêm, ấm áp, tránh tiếng ồn ào bi lụy để tâm người bệnh được an ổn.

2. Lời Khai Thị Buông Xả:
"Thân tứ đại vốn do nhân duyên hòa hợp, có sinh ắt có già, có bệnh và có lúc trả về cho đất nước gió lửa. Tuy thân xác có đổi thay, nhưng chân tâm Phật tính và phước báu thiện lành vẫn luôn sáng ngời. Hãy nhẹ nhàng buông xuống mọi lo toan, tha thứ cho tất cả và niệm thầm danh hiệu Đức Phật."

3. Bài Kệ Hồi Hướng Chung:
"Nguyện đem công đức này,
Hướng về khắp tất cả,
Đệ tử và chúng sinh,
Đều trọn thành Phật đạo."`,
  },
];

export default function SutrasLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reader Modal State + Smart Teleprompter & Wooden Fish
  const [readingSutra, setReadingSutra] = useState<SutraItem | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<0 | 1 | 2 | 3>(0);
  const [isReaderFishBeating, setIsReaderFishBeating] = useState(false);
  const [sutraChantCounts, setSutraChantCounts] = useState<Record<string, number>>({});

  const readerScrollRef = useRef<HTMLDivElement | null>(null);

  // Prayer text modal
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SUTRA_COUNTS_STORAGE_KEY);
      if (saved) {
        setSutraChantCounts(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Auto-Scroll Teleprompter Effect inside Sutra Reader
  useEffect(() => {
    if (!readingSutra || autoScrollSpeed === 0) return;
    const intervalMs = autoScrollSpeed === 1 ? 65 : autoScrollSpeed === 2 ? 38 : 22;
    const timer = setInterval(() => {
      if (readerScrollRef.current) {
        readerScrollRef.current.scrollTop += 1;
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [readingSutra, autoScrollSpeed]);

  // Auto-Beat Wooden Fish inside Sutra Reader (68 BPM)
  useEffect(() => {
    if (!readingSutra || !isReaderFishBeating) return;
    const timer = setInterval(() => {
      playWoodenFishSound(0.5);
    }, 880);
    return () => clearInterval(timer);
  }, [readingSutra, isReaderFishBeating]);

  const handleCompleteSutraRecitation = (sutra: SutraItem) => {
    playGrandTempleBellSound(0.6);
    setAutoScrollSpeed(0);
    setIsReaderFishBeating(false);

    const nextCount = (sutraChantCounts[sutra.id] || 0) + 1;
    const updated = { ...sutraChantCounts, [sutra.id]: nextCount };
    setSutraChantCounts(updated);
    try {
      localStorage.setItem(SUTRA_COUNTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    recordDharmaMerit({
      type: 'sutra',
      title: `Hoàn Mãn 1 Biến: ${sutra.title}`,
      detail: `Đã trì tụng tổng cộng ${nextCount} biến • Hồi hướng công đức Pháp Giới chúng sinh`,
      meritPoints: 30,
    });

    showToast(`Hoàn mãn 1 biến "${sutra.title}" (Tổng: ${nextCount} biến)! Đã lưu vào Sổ Công Đức.`);
    setReadingSutra(null);
  };

  const filteredSutras = useMemo(() => {
    return SUTRAS_LIST.filter((sutra) => {
      if (selectedCategory === 'nam-tong' && sutra.tradition !== 'Nam Tông') return false;
      if (selectedCategory === 'bac-tong' && sutra.tradition !== 'Bắc Tông') return false;
      if (selectedCategory === 'mat-tong' && sutra.tradition !== 'Mật Tông') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          sutra.title.toLowerCase().includes(q) ||
          sutra.content.toLowerCase().includes(q) ||
          sutra.categoryLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const totalChantedBiens = Object.values(sutraChantCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#181207] text-[#FFFDF7] selection:bg-[#F5C542]/30 selection:text-[#FFD966]">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg) - DHARMA REACT NATIVE SUPER-APP SUTRAS                 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        <div className="max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-3 pb-32 space-y-4">
          {/* 1. SAFE-AREA HEADER */}
          <header className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#E5A91C] via-[#FFD966] to-[#F5C542] shadow-[0_0_16px_rgba(245,197,66,0.3)] flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#181207] flex items-center justify-center">
                  <SutraScrollIcon className="w-5 h-5 text-[#FFD966]" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD966] block">
                  DHARMA • TAM TẠNG PHÁP BẢO
                </span>
                <h1 className="font-heading font-serif text-xl sm:text-2xl font-bold text-[#FFFDF7] leading-tight">
                  Kinh Tạng &amp; Trì Tụng
                </h1>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#241B0B] border border-[#F5C542]/35 text-right shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-[#C7B68B] block">
                Đã trì tụng
              </span>
              <span className="text-xs font-mono font-bold text-[#FFD966]">
                {totalChantedBiens} biến
              </span>
            </div>
          </header>

          {/* 2. SEARCH BAR */}
          <section aria-label="Tìm kiếm bài kinh">
            <div className="relative w-full rounded-2xl bg-[#241B0B] border border-[#F5C542]/30 px-4 py-2.5 flex items-center gap-2.5 shadow-inner">
              <Search className="w-4 h-4 text-[#FFD966] shrink-0" />
              <input
                type="text"
                placeholder="Tìm bài kinh, Bát Nhã, Từ Bi, Dược Sư..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent w-full text-xs sm:text-sm text-[#FFFDF7] placeholder-[#C7B68B]/60 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#C7B68B] hover:text-[#FFFDF7] p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>

          {/* 3. REACT NATIVE 4-CATEGORY SEGMENTED CONTROL */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'nam-tong', label: 'Nikāya' },
              { id: 'bac-tong', label: 'Đại Thừa' },
              { id: 'mat-tong', label: 'Nghi Thức' },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    playWoodenFishSound(0.2);
                    setSelectedCategory(cat.id);
                  }}
                  className={cn(
                    'py-2 px-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate',
                    active
                      ? 'bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#E5A91C] text-[#181207] shadow-sm'
                      : 'text-[#D6C394] hover:text-[#FFFDF7]'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 4. TODAY'S RITUAL BANNER */}
          <section aria-label="Nghi thức hôm nay">
            <div
              onClick={() => {
                playBellSound(0.4);
                setIsPrayerModalOpen(true);
              }}
              className="rounded-2xl p-3.5 bg-gradient-to-r from-[#241B0B] via-[#2E220E] to-[#241B0B] border border-[#F5C542]/40 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/35 flex items-center justify-center text-[#FFD966] shrink-0">
                  <LotusMinimalIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD966] block">
                    Nghi Thức Khuyến Tu Hôm Nay
                  </span>
                  <h4 className="font-heading font-serif font-bold text-xs sm:text-sm text-[#FFFDF7] truncate">
                    Văn Khấn &amp; Quán Đảnh Chơn Ngôn Phật Dược Sư
                  </h4>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#FFD966] shrink-0" />
            </div>
          </section>

          {/* 5. SUTRAS BENTO LIST */}
          <section aria-label="Danh sách bài kinh" className="space-y-2.5">
            {filteredSutras.map((sutra) => {
              const count = sutraChantCounts[sutra.id] || 0;
              return (
                <div
                  key={sutra.id}
                  onClick={() => {
                    playPageTurnSound(0.3);
                    setReadingSutra(sutra);
                  }}
                  className="p-3.5 rounded-2xl bg-[#241B0B] border border-[#F5C542]/25 hover:border-[#FFD966] flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition-all group shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#F5C542]/35 bg-[#181207]">
                      <img
                        src={sutra.image}
                        alt={sutra.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#FFD966] font-bold uppercase tracking-wider">
                          {sutra.categoryLabel}
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {count} biến
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-serif font-bold text-sm sm:text-[15px] text-[#FFFDF7] leading-snug truncate mt-0.5 group-hover:text-[#FFD966]">
                        {sutra.title}
                      </h3>
                      <p className="text-[11px] text-[#C7B68B] truncate mt-0.5">
                        {sutra.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-[#181207] border border-[#F5C542]/30 flex items-center justify-center text-[#FFD966] shrink-0">
                    <SutraScrollIcon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg) - DHARMA RADIANT GOLD SUTRAS                         */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <OmManiDesktopSutras
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredSutras={filteredSutras}
          onOpenSutra={(s) => setReadingSutra(s)}
          onOpenPrayerModal={() => {
            playBellSound(0.4);
            setIsPrayerModalOpen(true);
          }}
          sutraChantCounts={sutraChantCounts}
          showToast={showToast}
        />
      </div>

      {/* ========================================================================= */}
      {/* SMART SUTRA READER MODAL (AUTO-SCROLL TELEPROMPTER + WOODEN FISH)         */}
      {/* ========================================================================= */}
      {readingSutra && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAutoScrollSpeed(0);
              setIsReaderFishBeating(false);
              setReadingSutra(null);
            }
          }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-t-[30px] sm:rounded-3xl bg-[#241B0B] border-t sm:border border-[#F5C542]/50 p-5 sm:p-6 text-[#FFFDF7] shadow-2xl">
            <div className="w-12 h-1.5 rounded-full bg-[#F5C542]/40 mx-auto mb-2 sm:hidden" />

            {/* Top Bar inside Reader */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20 shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-[#FFD966] font-bold uppercase tracking-wider block">
                  {readingSutra.categoryLabel} • Đã trì tụng: {sutraChantCounts[readingSutra.id] || 0} biến
                </span>
                <h2 className="font-heading font-serif text-base sm:text-xl font-bold text-[#FFFDF7] truncate mt-0.5">
                  {readingSutra.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAutoScrollSpeed(0);
                  setIsReaderFishBeating(false);
                  setReadingSutra(null);
                }}
                className="text-[#C7B68B] hover:text-[#FFFDF7] p-1.5 rounded-full bg-[#181207] border border-[#F5C542]/25 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart Chanting Toolbar: Font Size + Auto-Scroll Teleprompter + Rhythm Wooden Fish */}
            <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 border-b border-[#F5C542]/20 text-xs shrink-0">
              {/* Font Size */}
              <div className="flex items-center gap-1">
                <span className="text-[#C7B68B] text-[11px] mr-1">Chữ:</span>
                {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={cn(
                      'px-2 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer',
                      fontSize === sz
                        ? 'bg-[#F5C542] text-[#181207] font-bold'
                        : 'bg-[#181207] text-[#C7B68B] hover:text-[#FFFDF7]'
                    )}
                  >
                    {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* Teleprompter Auto-Scroll Controls */}
              <div className="flex items-center gap-1">
                <span className="text-[#C7B68B] text-[11px] mr-1">Cuộn tự động:</span>
                {[
                  { speed: 0, label: 'Tắt' },
                  { speed: 1, label: '1x' },
                  { speed: 2, label: '2x' },
                  { speed: 3, label: '3x' },
                ].map((opt) => (
                  <button
                    key={opt.speed}
                    type="button"
                    onClick={() => setAutoScrollSpeed(opt.speed as 0 | 1 | 2 | 3)}
                    className={cn(
                      'px-2 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer',
                      autoScrollSpeed === opt.speed
                        ? 'bg-[#F5C542] text-[#181207] font-bold'
                        : 'bg-[#181207] text-[#C7B68B] hover:text-[#FFFDF7]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Rhythm Wooden Fish & Bell */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isReaderFishBeating;
                    setIsReaderFishBeating(next);
                    if (next) playWoodenFishSound(0.5);
                  }}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer',
                    isReaderFishBeating
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#181207] border-[#F5C542]/30 text-[#FFD966]'
                  )}
                >
                  <WoodenFishMinimalIcon className="w-3.5 h-3.5" />
                  <span>{isReaderFishBeating ? 'Mõ: Đang gõ' : 'Bật Mõ Nhịp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playBellSound(0.45);
                    showToast('Tiếng chuông ngân vang tĩnh tâm');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#181207] border border-[#F5C542]/30 text-[#FFD966] text-[11px] font-bold cursor-pointer"
                >
                  <TempleBellIcon className="w-3.5 h-3.5" />
                  <span>Chuông</span>
                </button>
              </div>
            </div>

            {/* Scrollable Sutra Text */}
            <div
              ref={readerScrollRef}
              className={cn(
                'flex-1 overflow-y-auto no-scrollbar py-5 px-2 leading-relaxed font-serif text-[#FFFDF7] whitespace-pre-line space-y-4 select-text',
                fontSize === 'sm' && 'text-xs sm:text-sm leading-relaxed',
                fontSize === 'base' && 'text-sm sm:text-base leading-loose',
                fontSize === 'lg' && 'text-base sm:text-lg leading-loose',
                fontSize === 'xl' && 'text-lg sm:text-xl leading-loose font-medium'
              )}
            >
              {readingSutra.content}
            </div>

            {/* Reader Footer Controls: Bookmark & Complete 1 Biến */}
            <div className="pt-3 border-t border-[#F5C542]/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsBookmarked((prev) => {
                    const next = !prev;
                    showToast(next ? 'Đã đánh dấu bản kinh thường tụng' : 'Đã bỏ đánh dấu');
                    return next;
                  });
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                  isBookmarked
                    ? 'bg-[#F5C542]/25 border-[#FFD966] text-[#FFD966]'
                    : 'bg-[#181207] border-[#F5C542]/25 text-[#C7B68B] hover:text-[#FFFDF7]'
                )}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{isBookmarked ? 'Đã Lưu Tủ Kinh' : 'Lưu Tủ Kinh'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCompleteSutraRecitation(readingSutra)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#E5A91C] text-[#181207] font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Hoàn Mãn 1 Biến &amp; Hồi Hướng (+30 Công Đức)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NGHI THỨC KHẤN NGUYỆN & CHÚ DƯỢC SƯ                                */}
      {/* ========================================================================= */}
      {isPrayerModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-t-[30px] sm:rounded-3xl bg-[#241B0B] border-t sm:border border-[#F5C542]/45 p-5 text-[#FFFDF7] shadow-2xl">
            <div className="w-12 h-1.5 rounded-full bg-[#F5C542]/40 mx-auto mb-2 sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-[#F5C542]/20 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FFD966] tracking-wider">
                  NGHI THỨC KHUYẾN TU HÔM NAY
                </span>
                <h3 className="font-heading font-serif font-bold text-base text-[#FFFDF7] mt-0.5">
                  Văn Khấn &amp; Chú Dược Sư Lưu Ly Quang
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrayerModalOpen(false)}
                className="text-[#C7B68B] hover:text-[#FFFDF7] p-1.5 rounded-full bg-[#181207]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3 text-xs sm:text-sm text-[#F3E3B2] leading-relaxed font-serif whitespace-pre-line">
              {`Quy mạng Dược Sư Lưu Ly Quang,
Bổn nguyện rộng sâu độ thế gian.
Cứu khổ trừ tai thân mạng vững,
Ánh sáng lưu ly tỏa muôn phương.

Nam Mô Dược Sư Hải Hội Phật Bồ Tát (3 lần)

Dược Sư Quán Đảnh Chơn Ngôn:
"Nam mô bạt già phạt đế, bệ sát xã, lũ lô thích lưu ly, phách lạt bà, hắt ra xà dã, đát tha yết đa da, a ra ha đế, tam miệu tam bột đà da, đát điệt tha: Án, bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế tằng sa ha." (Trì tụng 7 biến hoặc 21 biến)

Lời khấn nguyện hồi hướng:
Đệ tử chúng con chí thành hướng về Tam Bảo, nguyện cầu ánh quang minh lưu ly của Đức Phật Dược Sư soi chiếu thân tâm, tiêu trừ chướng ngại, tật bệnh thuyên giảm, gia quyến an khang, đạo tâm kiên cố.`}
            </div>

            <div className="pt-3 border-t border-[#F5C542]/20 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playGrandTempleBellSound(0.5);
                  recordDharmaMerit({
                    type: 'sutra',
                    title: 'Trì Tụng Chú Dược Sư & Nghi Thức Khấn Nguyện',
                    detail: 'Hồi hướng bình an và sức khỏe cho gia quyến',
                    meritPoints: 20,
                  });
                  showToast('Đã ghi nhận công đức trì tụng Nghi Thức Dược Sư!');
                  setIsPrayerModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#181207] font-bold text-xs cursor-pointer"
              >
                Hoàn Mãn &amp; Hồi Hướng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2.5 rounded-2xl bg-[#241B0B]/95 border border-[#F5C542] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFD966]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
