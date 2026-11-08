'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  MoreHorizontal,
  X,
  Share2,
  Bookmark,
  Volume2,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { playBellSound, playWoodenFishSound, playPageTurnSound } from '@/lib/buddhistSounds';
import { cn } from '@/lib/utils';

// =============================================================================
// INTERFACES & SUTRAS DATA
// =============================================================================
export interface SutraItem {
  id: string;
  tradition: 'Nam Tông' | 'Bắc Tông' | 'Mật Tông';
  categoryLabel: string; // e.g. 'Kinh • Nam Tông'
  title: string;
  excerpt: string;
  content: string;
  versesCount?: number;
}

const SUTRAS_LIST: SutraItem[] = [
  {
    id: 'kinh-do-nguoi-hap-hoi',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh • Nam Tông',
    title: 'Kinh Độ Người Hấp Hối',
    versesCount: 18,
    excerpt: 'Kinh văn chỉ dạy phương pháp buông xả thân tâm, an định thần thức và trợ niệm cho người sắp lâm chung vãng sinh về cõi an lành.',
    content: `KINH ĐỘ NGƯỜI HẤP HỐI
(Lời Phật Dạy Về Thời Khắc Lâm Chung)

1. Lắng lòng thanh tịnh:
Người sắp từ giã cõi đời, tâm thức vô cùng vi tế và nhạy cảm. Giờ phút này, thân quyến tuyệt đối không nên khóc lóc bi lụy làm kinh động thần thức, mà hãy đồng thanh niệm Phật, tạo năng lượng bình an bao bọc quanh người bệnh.

2. Khai thị buông xả:
"Này thiện nam tử / thiện nữ nhân! Thân xác tứ đại này vốn là duyên hợp, nay duyên mãn thì tan rã, đó là lẽ tự nhiên của muôn đời. Hãy buông bỏ tất cả của cải, danh vọng, ân oán và luyến ái gia đình. Hãy nhất tâm hướng về Tam Bảo: Phật - Pháp - Tăng thanh tịnh."

3. Quán chiếu ánh sáng:
"Trước mắt người nếu thấy những hình tướng đáng sợ hay mịt mùng tối tăm, chớ sinh lòng kinh hãi. Đó chỉ là huyễn tướng của nghiệp thức. Hãy nhìn thẳng vào ánh sáng thanh lương màu nhiệm của chư Phật, nương theo đó mà an trú."

4. Lời nguyện vãng sinh:
"Nguyện đoạn trừ tất cả chướng ngại,
Mắt thấy Đức Phật A Di Đà / Chư Bồ Tát tiếp dẫn,
Thần thức nhẹ nhàng thoát ly khổ ải,
Trực vãng Tây Phương cõi an lạc lành."`,
  },
  {
    id: 'kinh-kim-cuong',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh • Bắc Tông',
    title: 'Kinh Kim Cương Gươm Báu Cắt Đứt Phiền Não',
    versesCount: 32,
    excerpt: 'Bảo kiếm trí tuệ Bát Nhã chặt đứt mọi bám chấp, phân biệt và phiền não nơi tâm để chứng nhập chân như Phật tính.',
    content: `KINH KIM CƯƠNG BÁT NHÃ BA LA MẬT
(Gươm Báu Cắt Đứt Phiền Não)

1. Không trụ vào hình tướng:
"Bồ Tát khi bố thí không nên trụ vào sắc, không nên trụ vào thanh, hương, vị, xúc, pháp. Phàm sở hữu tướng, giai thị hư vọng. Nhược kiến chư tướng phi tướng, tức kiến Như Lai."

2. Quán pháp vô vi:
"Tất cả các pháp hữu vi trong cõi đời,
Hệt như giấc mộng, như trò huyễn ảo,
Như bọt nước nổi, như bóng hình trôi,
Như hạt sương mai, như tia chớp giật,
Hành giả thường nên quán chiếu như vậy."

3. Cắt đứt lưới chấp trước:
Nếu người chấp ta, chấp người, chấp chúng sinh, chấp thọ giả thì chưa phải là bậc Bồ Tát chân thật. Tâm không vướng mắc một pháp nào, đó mới chính là diệu dụng của Kim Cương Bát Nhã.`,
  },
  {
    id: 'kinh-muoi-nguyen-pho-hien',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh • Bắc Tông',
    title: 'Kinh Mười Nguyện Phổ Hiền',
    versesCount: 10,
    excerpt: 'Mười đại nguyện vĩ đại của Bồ Tát Phổ Hiền dẫn đường cho hành giả bước vào cảnh giới Hoa Nghiêm bao la vô tận.',
    content: `KINH HOA NGHIÊM — PHẨM PHỔ HIỀN HẠNH NGUYỆN
(Mười Nguyện Vương Cát Tường)

Một là: Nhất giả lễ kính chư Phật (Kính trọng đảnh lễ khắp mười phương chư Phật).
Hai là: Nhị giả xưng tán Như Lai (Ngợi ca công đức sâu rộng của các đấng Giác Ngộ).
Ba là: Tam giả quảng tu cúng dường (Mở rộng lòng từ dâng cúng hương hoa, pháp bảo).
Bốn là: Tứ giả sám hối nghiệp chướng (Chí thành ăn năn lỗi lầm thân, khẩu, ý).
Năm là: Ngũ giả tùy hỷ công đức (Vui theo việc thiện và công đức của muôn loài).
Sáu là: Lục giả thỉnh chuyển pháp luân (Cầu xin chư Phật thường thuyết giảng Chánh pháp).
Bảy là: Thất giả thỉnh Phật trụ thế (Nguyện xin các bậc Đạo Sư ở lại cõi đời cứu độ).
Tám là: Bát giả thường tùy Phật học (Noi theo gương sáng và hạnh nguyện của Phật).
Chín là: Cửu giả hằng thuận chúng sinh (Bao dung giúp đỡ và hòa hợp với muôn loài).
Mười là: Thập giả phổ giai hồi hướng (Đem hết công đức tu tập hướng về chúng sinh trọn thành Phật đạo).`,
  },
  {
    id: 'kinh-nghia-ly-sieu-viet-ve-khong',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh • Bắc Tông',
    title: 'Kinh Nghĩa Lý Siêu Việt về Không',
    versesCount: 25,
    excerpt: 'Tinh túy Bát Nhã Tâm Kinh soi sáng bản chất Chân Không Diệu Hữu của vạn pháp, vượt qua mọi khổ đau ách nạn.',
    content: `BÁT NHÃ BA LA MẬT ĐA TÂM KINH
(Nghĩa Lý Siêu Việt Về Tính Không)

Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.

Xá Lợi Tử! Sắc bất dị Không, Không bất dị Sắc. Sắc tức thị Không, Không tức thị Sắc. Thọ, tưởng, hành, thức diệc phục như thị.

Xá Lợi Tử! Thị chư pháp không tướng: Bất sinh bất diệt, bất cấu bất tịnh, bất tăng bất giảm. Thị cố không trung vô sắc, vô thọ tưởng hành thức; vô nhãn nhĩ tỳ thiệt thân ý; vô sắc thanh hương vị xúc pháp; vô nhãn giới nãi chí vô ý thức giới...

Dĩ vô sở đắc cố, Bồ Đề tát đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.`,
  },
  {
    id: 'kinh-tuoi-tre-va-hanh-phuc',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh • Nam Tông',
    title: 'Kinh Tuổi Trẻ và Hạnh Phúc',
    versesCount: 12,
    excerpt: 'Lời Phật khuyên dạy người trẻ về đạo đức sống, chọn bạn mà chơi, hiếu kính mẹ cha và kiến tạo tương lai an lạc.',
    content: `KINH PHƯỚC ĐỨC (MAṄGALA SUTTA)
(Tuổi Trẻ & Con Đường Hạnh Phúc Chân Thật)

1. Chọn bạn & Môi trường:
Lánh xa kẻ xấu ác, gần gũi bậc hiền tài, tôn kính bậc đáng kính, ấy là phước lành cao nhất.
Sống trong môi trường lành, hướng tâm về chân lý, gieo mầm thiện bao dung, ấy là phước lành cao nhất.

2. Rèn luyện tài năng:
Học hỏi điều chân thật, rèn luyện nghề khéo léo, giữ giới luật trang nghiêm, nói những lời hòa ái, ấy là phước lành cao nhất.

3. Hiếu hạnh gia đình:
Hiếu dưỡng cha mẹ già, chăm sóc bạn đời con cái, làm việc không cẩu thả, ấy là phước lành cao nhất.

4. Tâm vững giữa bão đời:
Khi gặp chuyện nghịch ý, tâm không hề lay động, không sầu não lo âu, luôn thảnh thơi an định, ấy là phước lành cao nhất.`,
  },
  {
    id: 'kinh-trung-dao-nhan-duyen',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh • Nam Tông',
    title: 'Kinh Trung Đạo Nhân Duyên',
    versesCount: 16,
    excerpt: 'Thấu rõ quy luật Duyên Khởi, lìa xa hai cực đoan Có và Không để bước đi vững chãi trên con đường Trung Đạo.',
    content: `KINH KACCĀNAGOTTA
(Giáo Lý Duyên Khởi & Trung Đạo)

Thế Tôn dạy tôn giả Kaccāyana:
"Này Kaccāyana, người đời thường chấp vào hai thái cực: Một là 'Có', hai là 'Không'.

Người với chánh trí thấy rõ sự sinh khởi của thế gian theo quy luật Duyên Khởi thì không còn chấp vào quan niệm 'Không có'.
Người với chánh trí thấy rõ sự tiêu diệt của thế gian thì không còn vướng mắc vào quan niệm 'Thường có'.

Xa lìa hai cực đoan ấy, Như Lai thuyết giảng Chánh pháp theo con đường Trung Đạo:
Do cái này có nên cái kia có;
Do cái này sinh nên cái kia sinh.
Do cái này không nên cái kia không;
Do cái này diệt nên cái kia diệt.

Thấu suốt Duyên Khởi là thấu suốt ngọn nguồn của giác ngộ và giải thoát."`,
  },
  {
    id: 'kinh-thuong-yeu',
    tradition: 'Nam Tông',
    categoryLabel: 'Kinh • Nam Tông',
    title: 'Kinh Thương Yêu',
    versesCount: 10,
    excerpt: 'Bài kinh Từ Bi (Mettā Sutta) mở rộng trái tim yêu thương không biên giới đến tất cả muôn loài chúng sinh.',
    content: `TỪ BI KINH (METTĀ SUTTA)
(Khúc Ca Của Tình Thương Không Biên Giới)

1. Tâm nguyện an vui:
Nguyện cho muôn loài chúng sinh khắp mười phương đều được sống an lành, thảnh thơi và hạnh phúc.

2. Ôm ấp muôn loài:
Dù là loài yếu hay loài mạnh, loài lớn hay loài nhỏ, loài thấy được hay không thấy được, loài ở gần hay ở xa, loài đã sinh hay sắp sinh: Nguyện cho tất cả đều tràn ngập niềm hoan hỷ an lạc.

3. Không gây oán thù:
Đừng ai lừa dối ai, đừng ai khinh rẻ ai, đừng vì giận hờn hay ác ý mà mong người khác bị khổ đau tổn hại.

4. Tình thương của mẹ:
Như một người mẹ đem cả tính mạng chở che đứa con một duy nhất của mình, hãy mở rộng tâm từ bi vô lượng ấy ra khắp muôn loài trong cõi vô tận.

Khi đứng, khi đi, khi ngồi hay khi nằm, bao lâu còn tỉnh thức, hãy luôn an trú trong tâm từ bi này. Đó là nếp sống cao thượng nhất trần gian.`,
  },
  {
    id: 'kinh-duoc-su',
    tradition: 'Bắc Tông',
    categoryLabel: 'Kinh • Bắc Tông',
    title: 'Kinh Dược Sư Bổn Nguyện Công Đức',
    versesCount: 20,
    excerpt: 'Mười hai đại nguyện của Đức Phật Dược Sư diệt trừ tật bệnh, thân mạng vững bền và tâm trí quang minh lưu ly.',
    content: `KINH DƯỢC SƯ BỔN NGUYỆN CÔNG ĐỨC
(Ánh Sáng Lưu Ly Diệt Trừ Mọi Tật Bệnh)

Đức Phật Thích Ca Mâu Ni bảo tôn giả Văn Thù Sư Lợi:
Ở phương Đông cách đây qua mười muôn ức cõi Phật, có một thế giới tên là Tịnh Lưu Ly. Giáo chủ cõi ấy là Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai.

Khi còn hành đạo Bồ Tát, Ngài đã phát 12 lời thệ nguyện lớn:
- Nguyện thân thể phát ra ánh sáng rực rỡ soi chiếu vô lượng thế giới.
- Nguyện chúng sinh nghèo cùng, thiếu thốn đồ dùng đều được đầy đủ.
- Nguyện cứu vớt những ai vướng vào tà đạo trở về nương tựa Chánh pháp.
- Nguyện dứt trừ mọi tật bệnh thân tâm, câm ngọng đui điếc đều được bình phục lành lặn.

Ai nghe danh hiệu Đức Dược Sư, nhất tâm trì niệm và thắp đèn phụng cúng, sẽ được phúc thọ tăng long, tai ương tiêu tán.`,
  },
];

// =============================================================================
// SUTRA THUMBNAIL (MATCHING EXACT OM MANI APPSTORE SCREENSHOT)
// =============================================================================
const SutraThumbnail = () => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#4A1510] shadow-md flex items-center justify-center">
    {/* Reddish/crimson base with golden Buddha bust profile */}
    <img
      src="/images/golden_buddha.jpg"
      alt="Đức Phật"
      className="w-full h-full object-cover object-center scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-tr from-[#50130e]/80 via-transparent to-amber-900/30" />
    <span className="absolute bottom-1 right-1 text-[9px] opacity-75 select-none">🌸</span>
  </div>
);

// =============================================================================
// MAIN COMPONENT: KINH SÁCH PAGE
// =============================================================================
export default function SutrasLibraryPage() {
  // Search query & category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Reader Modal State
  const [readingSutra, setReadingSutra] = useState<SutraItem | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Prayer text modal (Bài khấn bottom card)
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered sutras
  const filteredSutras = useMemo(() => {
    return SUTRAS_LIST.filter((sutra) => {
      // Category filter
      if (selectedCategory === 'nam-tong' && sutra.tradition !== 'Nam Tông') return false;
      if (selectedCategory === 'bac-tong' && sutra.tradition !== 'Bắc Tông') return false;
      if (selectedCategory === 'mat-tong' && sutra.tradition !== 'Mật Tông') return false;

      // Search query
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

  return (
    <div className="min-h-screen bg-[#110D0A] text-[#FDFBF7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Container matching phone aspect ratio */}
      <div className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-5 pt-3 pb-32 space-y-4">

        {/* ========================================================================= */}
        {/* 1. TOP BAR: [Tất cả] | Kinh sách | [📖] (MATCHING SCREENSHOT)             */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between pt-1 relative">
          {/* Left Pill Button: [Tất cả ⌄] */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              className="px-4 py-1.5 rounded-full bg-[#201712] border border-white/10 hover:border-amber-400/50 text-white font-medium text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>
                {selectedCategory === 'all'
                  ? 'Tất cả'
                  : selectedCategory === 'nam-tong'
                  ? 'Nam Tông'
                  : selectedCategory === 'bac-tong'
                  ? 'Bắc Tông'
                  : 'Mật Tông'}
              </span>
              <span className="text-[10px] text-stone-400 ml-0.5">▾</span>
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 w-36 rounded-2xl bg-[#241710] border border-amber-500/30 shadow-2xl p-1.5 space-y-1 animate-scale-in">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'nam-tong', label: 'Kinh Nam Tông' },
                  { id: 'bac-tong', label: 'Kinh Bắc Tông' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsFilterDropdownOpen(false);
                      playWoodenFishSound(0.2);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between',
                      selectedCategory === cat.id
                        ? 'bg-amber-600/30 text-amber-200 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    )}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Title: Kinh sách */}
          <h1 className="font-heading font-bold text-base sm:text-lg text-white select-none">
            Kinh sách
          </h1>

          {/* Right Icon Button: [📖] */}
          <button
            type="button"
            onClick={() => {
              playPageTurnSound(0.3);
              showToast('Kinh sách Phật giáo được chuẩn hóa trang nghiêm');
            }}
            className="w-9 h-9 rounded-full bg-[#201712] border border-white/10 hover:border-amber-400/40 text-stone-200 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer"
            title="Tủ kinh sách"
            aria-label="Tủ kinh sách"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </header>

        {/* ========================================================================= */}
        {/* 2. SEARCH BAR (MATCHING SCREENSHOT)                                       */}
        {/* ========================================================================= */}
        <section aria-label="Tìm kiếm bài kinh">
          <div className="relative w-full rounded-full bg-[#1C140E] border border-white/10 px-4 py-2.5 flex items-center gap-2.5 shadow-inner">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm bài kinh"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LIST OF SUTRAS (MATCHING SCREENSHOT)                                   */}
        {/* ========================================================================= */}
        <section aria-label="Danh sách bài kinh" className="space-y-1.5 pt-1">
          {filteredSutras.map((sutra) => (
            <div
              key={sutra.id}
              onClick={() => {
                playPageTurnSound(0.3);
                setReadingSutra(sutra);
              }}
              className="flex items-center justify-between p-2.5 -mx-2 rounded-2xl hover:bg-stone-900/50 cursor-pointer group active:scale-[0.99] transition-all"
            >
              {/* Left Thumbnail & Info */}
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                {/* Sutra Buddha Profile Thumbnail */}
                <SutraThumbnail />

                {/* Text Information */}
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-400 font-medium block leading-tight">
                    {sutra.categoryLabel}
                  </span>
                  <h3 className="font-heading font-medium text-sm sm:text-[15px] text-white leading-snug truncate mt-0.5 group-hover:text-amber-200 transition-colors">
                    {sutra.title}
                  </h3>
                </div>
              </div>

              {/* Right: Three Dots Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playWoodenFishSound(0.2);
                  setReadingSutra(sutra);
                }}
                className="text-stone-500 group-hover:text-stone-300 p-2 shrink-0 transition-colors"
                title="Tùy chọn bài kinh"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}

          {filteredSutras.length === 0 && (
            <div className="py-12 text-center text-stone-400 text-xs sm:text-sm">
              Không tìm thấy bài kinh nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. BOTTOM STICKY CARD: BÀI KHẤN (MATCHING SCREENSHOT)                     */}
        {/* ========================================================================= */}
        <section aria-label="Bài khấn hôm nay" className="pt-2">
          <div
            onClick={() => {
              playBellSound(0.4);
              setIsPrayerModalOpen(true);
            }}
            className="rounded-3xl p-4 bg-[#231710] border border-amber-600/30 hover:border-amber-400/60 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md group"
          >
            {/* Left Content */}
            <div className="min-w-0 pr-3">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                Bài khấn
              </h4>
              <p className="text-xs text-stone-300 mt-1 truncate">
                Hôm nay • Vía Dược Sư Lưu Ly Quang Vương Như Lai thành đạo
              </p>
            </div>

            {/* Right Zen Porcelain Vase with Willow Branch Graphic */}
            <div className="w-14 h-14 shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-amber-300">
                <path
                  d="M32 14c-4 0-7 2-7 6v6c-6 3-10 9-10 16 0 9 7 14 17 14s17-5 17-14c0-7-4-13-10-16v-6c0-4-3-6-7-6z"
                  fill="#C89D52"
                  opacity="0.3"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <path
                  d="M32 14v-8M32 6c3 2 7 2 9 0M32 10c4 0 8 3 9 7M25 8c-3 3-3 8 0 11"
                  stroke="#FDE68A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: SUTRA FULL-SCREEN READER (TRÌNH ĐỌC KINH TRANG NGHIÊM)          */}
      {/* ========================================================================= */}
      {readingSutra && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setReadingSutra(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#1C130D] border border-amber-500/40 p-5 sm:p-6 text-white shadow-2xl animate-scale-in">
            {/* Top Bar inside Reader */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  {readingSutra.categoryLabel}
                </span>
                <h2 className="font-heading font-serif text-base sm:text-lg font-bold text-[#FFE082] truncate mt-0.5">
                  {readingSutra.title}
                </h2>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setReadingSutra(null)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reading Toolbar: Font size & Sound chime */}
            <div className="flex items-center justify-between py-2 border-b border-stone-800/60 text-xs shrink-0 text-stone-400">
              <div className="flex items-center gap-1.5">
                <span>Cỡ chữ:</span>
                {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={cn(
                      'px-2 py-0.5 rounded-md font-mono uppercase text-[11px] transition-all',
                      fontSize === sz
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-black/30 text-stone-400 hover:text-white'
                    )}
                  >
                    {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* Bell strike button */}
              <button
                type="button"
                onClick={() => {
                  playBellSound(0.4);
                  showToast('Nghe chuông tịnh tâm trước khi tụng kinh');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Thỉnh Chuông</span>
              </button>
            </div>

            {/* Scrollable Sutra Text */}
            <div
              className={cn(
                'flex-1 overflow-y-auto no-scrollbar py-5 leading-relaxed font-serif text-stone-200 whitespace-pre-line space-y-4 select-text',
                fontSize === 'sm' && 'text-xs sm:text-sm leading-relaxed',
                fontSize === 'base' && 'text-sm sm:text-base leading-loose',
                fontSize === 'lg' && 'text-base sm:text-lg leading-loose',
                fontSize === 'xl' && 'text-lg sm:text-xl leading-loose font-medium'
              )}
            >
              {readingSutra.content}
            </div>

            {/* Reader Footer Controls */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between shrink-0">
              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsBookmarked((prev) => {
                    const next = !prev;
                    showToast(next ? 'Đã lưu vào danh sách kinh yêu thích' : 'Đã bỏ lưu bài kinh');
                    return next;
                  });
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95',
                  isBookmarked
                    ? 'bg-amber-600/30 border-amber-400 text-amber-200 font-bold'
                    : 'bg-stone-800 border-transparent text-stone-400 hover:text-white'
                )}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{isBookmarked ? 'Đã lưu' : 'Lưu kinh'}</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setReadingSutra(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Hoàn Thành Thời Kinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: BÀI KHẤN VÍA DƯỢC SƯ                                            */}
      {/* ========================================================================= */}
      {isPrayerModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrayerModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#201712] border border-amber-500/40 p-5 text-white shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  HÔM NAY • VÍA DƯỢC SƯ LƯU LY QUANG VƯƠNG NHƯ LAI
                </span>
                <h3 className="font-heading font-bold text-base text-[#FFE082] mt-0.5">
                  Văn Khấn &amp; Chú Dược Sư
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrayerModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3 text-xs sm:text-sm text-stone-200 leading-relaxed font-serif whitespace-pre-line">
              {`Quy mạng Dược Sư Lưu Ly Quang,
Bổn nguyện rộng sâu độ thế gian.
Cứu khổ trừ tai thân mạng vững,
Ánh sáng lưu ly tỏa muôn phương.

Nam Mô Dược Sư Hải Hội Phật Bồ Tát (3 lần)

Dược Sư Quán Đảnh Chơn Ngôn:
"Nam mô bạt già phạt đế, bệ sát xã, lũ lô thích lưu ly, phách lạt bà, hắt ra xà dã, đát tha yết đa da, a ra ha đế, tam miệu tam bột đà da, đát điệt tha: Án, bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế tằng sa ha." (Tụng 7 biến hoặc 21 biến)

Lời khấn nguyện:
Đệ tử chúng con chí thành quỳ trước Phật tiền, nguyện cầu ánh quang minh lưu ly của Đức Phật Dược Sư soi chiếu thân tâm, tiêu trừ chướng ngại, tật bệnh thuyên giảm, gia quyến an khang, bách bệnh tiêu tan, vạn sự cát tường như ý.`}
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrayerModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING TOAST                                                            */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-3 z-50 flex justify-center pointer-events-none animate-fadeInDown">
          <div className="px-4 py-2 rounded-2xl bg-[#24130A]/95 border border-[#D4AF37] text-center shadow-xl backdrop-blur-md">
            <p className="font-heading text-xs sm:text-sm font-bold text-[#FFE082]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
