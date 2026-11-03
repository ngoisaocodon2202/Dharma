'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  Globe,
  Clock,
  CheckCircle2,
  ArrowRight,
  Scroll,
  Flame,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EraItem {
  id: string;
  period: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  location: string;
  image: string;
  summary: string;
  keyMilestones: {
    year: string;
    title: string;
    detail: string;
  }[];
  dharmaQuote: string;
}

const BUDDHIST_HISTORY_ERAS: EraItem[] = [
  {
    id: 'khoi-nguyen',
    period: 'Thế kỷ VI TCN (624 – 544 TCN)',
    shortLabel: '1. Khởi Nguyên Ấn Độ',
    title: 'Khởi Nguyên Phật Giáo & Cuộc Đời Đức Phật Thích Ca Mâu Ni',
    subtitle: 'Ánh sáng giác ngộ bừng lên từ xứ sở Ấn Độ cổ đại',
    location: 'Kapilavastu • Bodh Gaya • Sarnath • Kushinagar (Ấn Độ & Nepal)',
    image: '/images/buddha_meditation.jpg',
    summary:
      'Phật giáo khởi nguồn tại vùng đồng bằng sông Hằng (Ấn Độ cổ đại) vào thế kỷ thứ VI trước Công nguyên, do Thái tử Tất-đạt-đa Cồ-đàm (Siddhartha Gautama) của bộ tộc Thích-ca (Shakya) sáng lập sau khi Ngài tự mình tu tập và chứng đắc quả vị Vô Thượng Chánh Đẳng Chánh Giác.',
    keyMilestones: [
      {
        year: '624 TCN',
        title: 'Đản Sinh Tại Vườn Lâm-Tỳ-Ni (Lumbini)',
        detail:
          'Thái tử Tất-đạt-đa đản sinh tại vườn Lâm-tỳ-ni (nay thuộc Nepal), con của Đức vua Tịnh Phạn (Suddhodana) và Hoàng hậu Ma-da (Maya).',
      },
      {
        year: '595 TCN',
        title: 'Xuất Gia Tầm Đạo (Năm 29 Tuổi)',
        detail:
          'Sau khi chứng kiến bốn cảnh Sinh – Lão – Bệnh – Tử nơi bốn cửa thành, Thái tử quyết chí từ bỏ cung vàng điện ngọc để tìm con đường giải thoát khổ đau cho toàn nhân loại.',
      },
      {
        year: '589 TCN',
        title: 'Thành Đạo Dưới Cội Bồ-Đề (Bodh Gaya)',
        detail:
          'Sau 6 năm tầm sư học đạo và 49 ngày đêm thiền định bất động dưới cội cây Tất-bát-la (Bồ-đề) bên dòng sông Ni-liên-thiuyền, Ngài chiến thắng ma quân và chứng đắc đạo quả Phật Đà ở tuổi 35.',
      },
      {
        year: '589 – 544 TCN',
        title: 'Chuyển Pháp Luân & 45 Năm Hoằng Pháp',
        detail:
          'Đức Phật thuyết bài pháp đầu tiên (Kinh Chuyển Pháp Luân - Tứ Diệu Đế) tại vườn Lộc Uyển (Sarnath) cho 5 anh em Kiều Trần Như, khai sinh Tăng đoàn và suốt 45 năm du hóa khắp Ấn Độ trước khi nhập Niết-bàn tại Câu-thi-na (Kushinagar).',
      },
    ],
    dharmaQuote:
      '“Hãy tự mình làm ngọn đèn cho chính mình, hãy tự mình nương tựa nơi chính mình, lấy Chánh pháp làm ngọn đèn, lấy Chánh pháp làm nơi nương tựa.” — Kinh Đại Bát Niết Bàn',
  },
  {
    id: 'ket-tap-ashoka',
    period: 'Thế kỷ V – Thế kỷ III TCN',
    shortLabel: '2. Kết Tập & Vua A-Dục',
    title: 'Các Kỳ Kết Tập Kinh Điển & Đại Đế A-Dục (Ashoka) Hoằng Pháp',
    subtitle: 'Từ lưu truyền khẩu tụng Tam Tạng đến tôn giáo mang tầm vóc thế giới',
    location: 'Thành Vương Xá • Thành Tỳ-xá-ly • Thành Hoa Thị (Pataliputra)',
    image: '/images/om_mani_hero.jpg',
    summary:
      'Sau khi Đức Phật nhập diệt, chư Đại đệ tử A-la-hán đã tổ chức các kỳ Kết tập Kinh điển để trùng tuyên và hệ thống hóa lời Phật dạy thành Tam Tạng (Kinh – Luật – Luận). Đến thế kỷ III TCN, Đại đế A-dục (Ashoka) đã đưa Phật giáo vượt khỏi biên giới Ấn Độ vươn ra toàn cầu.',
    keyMilestones: [
      {
        year: '544 TCN',
        title: 'Kết Tập Kinh Điển Lần Thứ Nhất (Tại Động Thất Diệp)',
        detail:
          '500 vị Đại A-la-hán do Tôn giả Ca-diếp chủ trì đã trùng tuyên Kinh tạng (do Tôn giả A-nan tụng đọc) và Luật tạng (do Tôn giả Ưu-ba-ly tụng đọc).',
      },
      {
        year: 'Thế kỷ III TCN',
        title: 'Sự Chuyển Hóa Vĩ Đại Của Hoàng Đế A-Dục (Ashoka)',
        detail:
          'Sau cuộc chiến Kalinga đẫm máu, vua A-dục hối hận sâu sắc, quy y Tam Bảo và dùng tinh thần Từ bi – Bất bạo động của Phật giáo để trị quốc, cho dựng hàng chục trụ đá khắc sắc lệnh đạo đức khắp đế chế.',
      },
      {
        year: '250 TCN',
        title: '9 Phái Đoàn Truyền Bá Phật Pháp Quốc Tế',
        detail:
          'Sau kỳ Kết tập lần thứ 3 tại Hoa Thị thành, vua A-dục cử 9 phái đoàn cao tăng (trong đó có Thiền sư Mahinda và Ni trưởng Sanghamitta) mang ánh sáng Phật pháp cùng nhánh cây Bồ-đề thiêng đến Sri Lanka, Đông Nam Á, Trung Á và vùng Địa Trung Hải.',
      },
    ],
    dharmaQuote:
      '“Chiến thắng vẻ vang nhất không phải bằng gươm đao, mà là chiến thắng bằng Chánh pháp và lòng Từ bi.” — Minh văn trên Trụ đá Vua A-dục',
  },
  {
    id: 'nam-bac-truyen',
    period: 'Thế kỷ I TCN – Thế kỷ X SCN',
    shortLabel: '3. Nam Truyền & Bắc Truyền',
    title: 'Hai Dòng Chảy Lớn: Phật Giáo Nam Truyền, Bắc Truyền & Kim Cương Thừa',
    subtitle: 'Trăm sông cùng đổ về biển lớn Giải thoát & Giác ngộ',
    location: 'Sri Lanka • Đông Nam Á • Trung Hoa • Tây Tạng • Nhật Bản • Hàn Quốc',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1600&auto=format&fit=crop&q=85',
    summary:
      'Theo bước chân hoằng hóa qua các nền văn minh, Phật giáo phát triển thành ba truyền thống lớn hài hòa: Nam truyền (Theravada) giữ gìn nguyên vẹn kinh điển Pāli; Bắc truyền (Mahayana) phát triển tinh thần Bồ Tát đạo cứu khổ; và Kim Cương thừa (Vajrayana) rực rỡ tại vùng Himalaya.',
    keyMilestones: [
      {
        year: 'Thế kỷ I TCN',
        title: 'Ghi Chép Tam Tạng Kinh Điển Pāli Lên Lá Buông (Sri Lanka)',
        detail:
          'Lần đầu tiên toàn bộ Tam Tạng Kinh Điển Nam truyền được khắc chữ lên lá buông tại chùa Aluvihara (Sri Lanka), bảo tồn nguyên vẹn lời dạy gốc của Đức Phật.',
      },
      {
        year: 'Thế kỷ I – VII SCN',
        title: 'Hành Trình Con Đường Tơ Lụa & Đại Học Phật Giáo Nalanda',
        detail:
          'Phật giáo Bắc truyền với các bộ kinh Bát Nhã, Pháp Hoa, Hoa Nghiêm, Duy Ma Cật phát triển rực rỡ tại viện đại học Nalanda (Ấn Độ) và lan tỏa mạnh mẽ sang Trung Hoa, Việt Nam, Hàn Quốc, Nhật Bản.',
      },
      {
        year: 'Thế kỷ VIII SCN',
        title: 'Phật Giáo Kim Cương Thừa Tại Tây Tạng & Himalaya',
        detail:
          'Đại sư Liên Hoa Sinh (Padmasambhava) và ngài Tịch Hộ đưa Phật giáo vào Tây Tạng, hình thành truyền thống Kim Cương thừa sâu sắc về quán tưởng Mạn-đà-la và thần chú.',
      },
    ],
    dharmaQuote:
      '“Như nước đại dương chỉ có một vị mặn, giáo pháp của Như Lai chỉ có một vị duy nhất là vị Giải Thoát.”',
  },
  {
    id: 'viet-nam',
    period: 'Thế kỷ I SCN – Thế kỷ XX',
    shortLabel: '4. Phật Giáo Việt Nam',
    title: '2.000 Năm Lịch Sử Phật Giáo Việt Nam: Hộ Quốc An Dân',
    subtitle: 'Từ trung tâm Luy Lâu cổ đại đến đỉnh cao Thiền phái Trúc Lâm Yên Tử',
    location: 'Luy Lâu (Bắc Ninh) • Thăng Long • Yên Tử • Huế • Sài Gòn',
    image: '/images/tran_nhan_tong_yentu.jpg',
    summary:
      'Việt Nam là một trong những quốc gia đón nhận Phật giáo sớm nhất trực tiếp từ các nhà sư Ấn Độ qua đường biển ngay từ đầu Công nguyên. Suốt 20 thế kỷ, Phật giáo Việt Nam luôn gắn bó máu thịt với vận mệnh dân tộc qua các thời Đinh, Tiền Lê, Lý, Trần và cận hiện đại.',
    keyMilestones: [
      {
        year: 'Thế kỷ I – II',
        title: 'Trung Tâm Phật Giáo Luy Lâu (Bắc Ninh) — Du Nhập Trực Tiếp Từ Ấn Độ',
        detail:
          'Các cao tăng Ấn Độ như Khâu-đà-la, Ma-ha-kỳ-vực theo thuyền buôn đến Giao Châu (Luy Lâu), kết hợp văn hóa bản địa hình thành hệ thống chùa Tứ Pháp (Pháp Vân, Pháp Vũ, Pháp Lôi, Pháp Điện) sớm hơn cả trung tâm Lạc Dương.',
      },
      {
        year: 'Thế kỷ X – XII',
        title: 'Thời Đinh – Tiền Lê – Lý: Quốc Sư Phò Vua Giúp Nước',
        detail:
          'Thiền sư Khuông Việt, Thiền sư Vạn Hạnh, Quốc sư Nguyễn Minh Không đóng vai trò trụ cột triều chính. Vua Lý Thái Tổ (người lớn lên từ chùa Cổ Pháp) dời đô về Thăng Long và cho xây dựng hàng trăm ngôi chùa như Chùa Một Cột, Tháp Báo Thiên.',
      },
      {
        year: '1299 (Thời Trần)',
        title: 'Phật Hoàng Trần Nhân Tông & Thiền Phái Trúc Lâm Yên Tử',
        detail:
          'Sau khi lãnh đạo quân dân hai lần đánh tan đế quốc Nguyên Mông hùng mạnh, vua Trần Nhân Tông nhường ngôi, lên non thiêng Yên Tử xuất gia lấy hiệu Hương Vân Đại Đầu Đà, thống nhất các dòng thiền lập nên Thiền phái Trúc Lâm Yên Tử thuần Việt với tư tưởng “Cư trần lạc đạo”.',
      },
      {
        year: '1963 & 1981',
        title: 'Trái Tim Bất Diệt Bồ Tát Thích Quảng Đức & Thống Nhất Giáo Hội',
        detail:
          'Năm 1963, Hòa thượng Thích Quảng Đức vị pháp thiêu thân bảo vệ Chánh pháp, để lại Trái tim bất diệt làm chấn động nhân loại. Năm 1981, Giáo hội Phật giáo Việt Nam chính thức thành lập tại chùa Quán Sứ, thống nhất 9 tổ chức hệ phái Bắc tông, Nam tông, Khất sĩ trên toàn quốc.',
      },
    ],
    dharmaQuote:
      '“Cư trần lạc đạo thả tùy duyên / Cơ tắc san hề khốn tắc miên / Gia trung hữu bảo hưu tầm mịch / Đối cảnh vô tâm mạc vấn thiền.” — Phật hoàng Trần Nhân Tông',
  },
  {
    id: 'hien-dai',
    period: 'Thế kỷ XXI – Hiện tại',
    shortLabel: '5. Thời Đại Hiện Tại',
    title: 'Phật Giáo Thế Kỷ XXI: Chánh Niệm Toàn Cầu & Khoa Học Tâm Thức',
    subtitle: 'Đạo Phật đi vào đời sống hiện đại, chữa lành tâm hồn nhân loại',
    location: 'Toàn Cầu (Châu Á • Châu Âu • Bắc Mỹ • Úc Châu)',
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1600&auto=format&fit=crop&q=85',
    summary:
      'Bước sang thế kỷ XXI, trước những khủng hoảng tinh thần, căng thẳng và biến đổi khí hậu của xã hội công nghiệp, Phật giáo trở thành nguồn tuệ giác chữa lành cho toàn thế giới. Phong trào Phật giáo Dấn thân (Engaged Buddhism) và thực hành Chánh niệm (Mindfulness) được ứng dụng rộng rãi trong y học, tâm lý học và giáo dục quốc tế.',
    keyMilestones: [
      {
        year: '1999 – Nay',
        title: 'Liên Hợp Quốc Công Nhận Đại Lễ Phật Đản Vesak Toàn Cầu',
        detail:
          'Đại hội đồng Liên Hợp Quốc chính thức công nhận lễ Tam Hợp Vesak (Đản sinh – Thành đạo – Nhập Niết-bàn của Đức Phật) là lễ hội văn hóa, hòa bình của thế giới. Việt Nam đã 3 lần đăng cai thành công Đại lễ Vesak Liên Hợp Quốc (2008, 2014, 2019).',
      },
      {
        year: 'Thế kỷ XXI',
        title: 'Thiền Sư Thích Nhất Hạnh & Chánh Niệm Phương Tây',
        detail:
          'Pháp môn Chánh niệm hơi thở và bước chân an lạc được Thiền sư Thích Nhất Hạnh cùng các bậc tôn túc truyền bá khắp năm châu, giúp hàng chục triệu người vượt qua trầm cảm, lo âu và hận thù.',
      },
      {
        year: 'Hiện tại (2026)',
        title: 'Phật Pháp Số Hóa & Kết Nối Tỉnh Thức Không Biên Giới',
        detail:
          'Kinh điển Đại Tạng, pháp thoại của chư Tăng Ni, lịch vạn niên Phật giáo và trợ lý trí tuệ nhân tạo được tích hợp trên nền tảng số, giúp mọi người con Phật dù ở bất cứ đâu cũng có thể tu học, tụng kinh và nuôi dưỡng tâm từ bi mỗi ngày.',
      },
    ],
    dharmaQuote:
      '“Quá khứ đã qua, tương lai chưa tới. Chỉ có giây phút hiện tại là nơi duy nhất chúng ta thực sự tiếp xúc với sự sống nhiệm mầu.”',
  },
];

const FOUR_HOLY_SITES = [
  {
    name: '1. Lâm-Tỳ-Ni (Lumbini)',
    event: 'Nơi Đức Phật Đản Sinh',
    location: 'Rupandehi, Nepal',
    desc: 'Vườn cây Vô Ưu thanh tịnh nơi Thái tử Tất-đạt-đa bước đi 7 bước trên 7 đóa sen vàng.',
  },
  {
    name: '2. Bồ-Đề Đạo Tràng (Bodh Gaya)',
    event: 'Nơi Đức Phật Thành Đạo',
    location: 'Bihar, Ấn Độ',
    desc: 'Thánh địa dưới cội Bồ-đề thiêng cùng tháp Đại Giác (Mahabodhi) cao 55m uy nghiêm.',
  },
  {
    name: '3. Vườn Lộc Uyển (Sarnath)',
    event: 'Nơi Chuyển Pháp Luân Đầu Tiên',
    location: 'Varanasi, Ấn Độ',
    desc: 'Nơi Đức Thế Tôn tuyên thuyết bài kinh Tứ Diệu Đế và Bát Chánh Đạo đầu tiên.',
  },
  {
    name: '4. Câu-Thi-Na (Kushinagar)',
    event: 'Nơi Đức Phật Nhập Niết-Bàn',
    location: 'Uttar Pradesh, Ấn Độ',
    desc: 'Rừng cây Sa-la song thọ nơi Đức Từ Phụ để lại lời di huấn cuối cùng ở tuổi 80.',
  },
];

export default function BuddhistHistoryPage() {
  const [selectedEraId, setSelectedEraId] = useState<string>('ALL');

  const visibleEras =
    selectedEraId === 'ALL'
      ? BUDDHIST_HISTORY_ERAS
      : BUDDHIST_HISTORY_ERAS.filter((e) => e.id === selectedEraId);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* 1. Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-950 via-stone-900 to-amber-950 text-white p-5 sm:p-8 md:p-12 shadow-xl border border-amber-500/30">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold whitespace-nowrap">
            <BuddhaBodhiIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Dòng Chảy 2.600 Năm Ánh Sáng Từ Bi & Trí Tuệ</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-amber-50 leading-tight">
            Lịch Sử Phật Giáo: Từ Khởi Nguyên Đến Hiện Đại
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Tìm hiểu cội nguồn xuất xứ của Đạo Phật từ bước chân xuất gia của Thái tử Tất-đạt-đa tại Ấn Độ cổ đại,
            hành trình lan tỏa khắp năm châu, hơn 2.000 năm đồng hành cùng dân tộc Việt Nam cho đến kỷ nguyên tỉnh thức hôm nay.
          </p>
        </div>
      </div>

      {/* 2. Tứ Động Tâm (4 Sacred Places of Origins) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-200 dark:border-charcoal-800 pb-2.5 gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block whitespace-nowrap">
              Cội Nguồn Xuất Xứ Thiêng Liêng
            </span>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50 truncate">
              Tứ Động Tâm — 4 Thánh Tích Khởi Nguyên Đạo Phật
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {FOUR_HOLY_SITES.map((site, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 shadow-xs hover:border-saffron-400 transition-all flex flex-col justify-between h-full"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-saffron-50 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 text-[11px] font-bold border border-saffron-200/70 whitespace-nowrap">
                    {site.event}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal-900 dark:text-charcoal-100 whitespace-nowrap truncate">
                  {site.name}
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                  {site.desc}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-ivory-100 dark:border-charcoal-700 flex items-center gap-1.5 text-[11px] text-charcoal-500 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                <span className="truncate">{site.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Filter Pills for Historical Eras (Horizontal Scrollable on Mobile — Zero Line Break) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setSelectedEraId('ALL')}
            className={cn(
              'px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer',
              selectedEraId === 'ALL'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400'
            )}
          >
            Toàn Bộ Lịch Sử (5 Thời Kỳ)
          </button>
          {BUDDHIST_HISTORY_ERAS.map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => setSelectedEraId(era.id)}
              className={cn(
                'px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
                selectedEraId === era.id
                  ? 'bg-saffron-600 text-white shadow-sm'
                  : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400'
              )}
            >
              {era.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Timeline of Eras */}
      <div className="space-y-8">
        {visibleEras.map((era, index) => (
          <div
            key={era.id}
            className="bg-white dark:bg-charcoal-800/90 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md overflow-hidden"
          >
            {/* Top Banner of Era */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] bg-charcoal-900 overflow-hidden">
                <img
                  src={era.image}
                  alt={era.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[11px] font-extrabold whitespace-nowrap">
                    {era.period}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-200 pt-1 whitespace-nowrap truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{era.location}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 whitespace-nowrap">
                    Giai đoạn {index + 1} • {era.shortLabel}
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-snug">
                    {era.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                    {era.summary}
                  </p>
                </div>

                {/* Milestones List */}
                <div className="space-y-3 pt-2 border-t border-ivory-200 dark:border-charcoal-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap">
                    Các Cột Mốc Lịch Sử Trọng Đại:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {era.keyMilestones.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3.5 rounded-2xl bg-ivory-50/90 dark:bg-charcoal-900/70 border border-ivory-200 dark:border-charcoal-700 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-saffron-100 dark:bg-saffron-950 text-saffron-800 dark:text-saffron-300 text-[10px] font-extrabold whitespace-nowrap">
                            {m.year}
                          </span>
                          <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-charcoal-100 truncate">
                            {m.title}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                          {m.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sacred Quote */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs italic text-charcoal-700 dark:text-charcoal-200">
                  {era.dharmaQuote}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

