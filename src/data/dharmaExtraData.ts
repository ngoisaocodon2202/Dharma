export interface BaiKhanItem {
  id: string;
  eyebrow: string;
  title: string;
  occasion: string;
  openingVerse: string;
  paragraphs: string[];
  closingVerse: string;
}

export const BAI_KHAN_DATA: BaiKhanItem[] = [
  {
    id: 'mung-mot-ram',
    eyebrow: 'LỄ TẠI GIA',
    title: 'Văn khấn mùng Một và ngày Rằm',
    occasion: 'Sóc Vọng • Mùng 1 & Rằm Âm lịch tại ban thờ Tam Bảo / Gia Tiên',
    openingVerse:
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)\nCon kính lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.',
    paragraphs: [
      'Con kính lạy Hoàng thiên Hậu thổ, chư vị Tôn thần. Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân, ngài Bản gia Thổ địa Long mạch Tôn thần.',
      'Con kính lạy các cụ Tổ khảo, Tổ tỷ, bá thúc huynh đệ, cô di tỷ muội họ nội họ ngoại.',
      'Tín chủ con tên là: ........................... Ngụ tại: .......................................................',
      'Hôm nay là ngày mùng Một (hoặc ngày Rằm) tháng ....... năm ..........., tín chủ con thành tâm sửa biện hương hoa lễ vật, trà quả thanh tịnh, thắp nén tâm hương dâng lên trước án.',
      'Cúi xin Chư Phật gia hộ, chư vị Tôn thần và Gia tiên tiền tổ chứng giám lòng thành, thụ hưởng lễ vật, phù trì độ trì cho toàn gia quyến thân tâm thường an lạc, tật bệnh tiêu trừ, công việc hanh thông, bồ đề tâm kiên cố.',
    ],
    closingVerse:
      'Nguyện đem công đức này hồi hướng khắp pháp giới chúng sinh đều trọn thành Phật đạo.\nNam mô A Di Đà Phật! (3 lần)',
  },
  {
    id: 'van-khan-via-duoc-su',
    eyebrow: 'NGÀY VÍA & LỄ LỚN',
    title: 'Nghi thức khấn nguyện Đức Phật Dược Sư & Tam Bảo',
    occasion: 'Cầu an khang, tiêu tai giải nạn, thân tâm thường an ổn',
    openingVerse:
      'Nam mô Đông Phương Giáo Chủ Tiêu Tai Diên Thọ Dược Sư Lưu Ly Quang Vương Phật! (3 lần)',
    paragraphs: [
      'Đệ tử con tên là: ........................... Pháp danh (nếu có): ........................................',
      'Hôm nay nhân ngày lành tháng tốt, con thành kính hướng về Tây phương Tam Bảo và Đông phương Tịnh Lưu Ly thế giới, dâng hương hoa trà quả, nhất tâm đỉnh lễ.',
      'Nguyện nương nhờ ánh quang minh lưu ly thanh tịnh và mười hai đại nguyện từ bi của Đức Phật Dược Sư, soi rọi thân tâm cho con cùng song thân phụ mẫu và gia quyến dứt trừ bệnh khổ, tiêu tan phiền não ưu tư.',
      'Con nguyện từ nay siêng năng giữ giới, làm lành lánh dữ, ăn chay niệm Phật, giữ lời nói ái ngữ và sống trọn vẹn trong chánh niệm.',
    ],
    closingVerse:
      'Đát điệt tha • Án bệ sát thệ, bệ sát thệ, bệ sát xã, tam một yết đế ta ha.\nNam mô Dược Sư Lưu Ly Quang Vương Phật!',
  },
  {
    id: 'van-khan-cau-sieu',
    eyebrow: 'HIẾU ĐẠO & TƯỞNG NIỆM',
    title: 'Lời khấn cầu siêu Cửu Huyền Thất Tổ',
    occasion: 'Ngày Giỗ Chạp, Vu Lan, Tiết Thanh Minh hoặc tưởng niệm hằng ngày',
    openingVerse:
      'Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát! (3 lần)',
    paragraphs: [
      'Nam mô Tây Phương Cực Lạc Thế Giới Đại Từ Đại Bi A Di Đà Phật.',
      'Con kính dâng hương hoa thanh tịnh, thành tâm cầu nguyện cho Cửu Huyền Thất Tổ, nội ngoại tôn thân cùng hương linh người đã khuất trong gia tộc.',
      'Nguyện nhờ oai lực gia trì của Tam Bảo, giúp các hương linh sớm buông xả chấp niệm trần gian, nhẹ nhàng siêu thoát về cảnh giới an lành, thính pháp văn kinh, hoa nở thấy Phật.',
      'Con xin nguyện tu tập điều thiện lành để hồi hướng phước báu đến các bậc tiền nhân và khắp tất cả chúng sinh.',
    ],
    closingVerse:
      'Án bát ra mạt lân đà ninh ta ha.\nNam mô A Di Đà Phật!',
  },
  {
    id: 'nghi-thuc-cau-an-buoi-sang',
    eyebrow: 'MỖI SỚM MAI',
    title: '7 Lời Khấn Nguyện An Lành Buổi Sáng',
    occasion: 'Đọc nhẹ nhàng trước bàn thờ hoặc khi ngồi tĩnh tâm mỗi sáng',
    openingVerse: 'Nam mô Bổn Sư Thích Ca Mâu Ni Phật! (3 lần)',
    paragraphs: [
      '1. Nguyện hôm nay tâm con giữ trọn sự điềm tĩnh, không để sân hận và vội vã dẫn dắt.',
      '2. Nguyện đôi tai biết lắng nghe thấu hiểu, lời nói trao đi nhẹ nhàng và chân thật.',
      '3. Nguyện đôi tay biết nâng đỡ, chia sẻ với người hữu duyên đang gặp khó khăn.',
      '4. Nguyện lòng biết ơn cha mẹ, thầy bạn, thiên nhiên và từng bữa ăn mỗi ngày.',
      '5. Nguyện làm tròn bổn phận trong công việc bằng tâm chuyên chú, không tranh giành hơn thua.',
      '6. Nguyện biết dừng lại trở về hơi thở bất cứ khi nào tâm xao động.',
      '7. Nguyện đem từng chút phước lành hôm nay hồi hướng cho muôn loài bình an.',
    ],
    closingVerse: 'Nam mô Thường Tinh Tấn Bồ Tát Ma Ha Tát!',
  },
];

export interface MeditationSoundItem {
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  mode: '432' | '528' | 'bell' | 'woodfish' | 'mantra';
  image: string;
}

export const MEDITATION_SOUNDS: MeditationSoundItem[] = [
  {
    id: 'sound-432',
    title: 'Tần Số Thiền Định 432Hz',
    subtitle: 'Sóng âm hài hòa giúp lắng dịu hệ thần kinh & buông thư',
    durationLabel: 'Vô hạn',
    mode: '432',
    image: '/images/buddhas/dai-nhat-nhu-lai.png',
  },
  {
    id: 'sound-528',
    title: 'Âm Vang Chữa Lành 528Hz',
    subtitle: 'Tần số an lạc sâu, thích hợp ngồi thiền & hít thở sâu',
    durationLabel: 'Vô hạn',
    mode: '528',
    image: '/images/buddhas/duc-phat-duoc-su.png',
  },
  {
    id: 'sound-bell',
    title: 'Chuông Cổ Tự Ngân Dài',
    subtitle: 'Âm chuông đồng trầm ấm tự động thỉnh mỗi 10 giây',
    durationLabel: 'Chu kỳ 10s',
    mode: 'bell',
    image: '/images/buddhas/duc-phat-thich-ca.png',
  },
  {
    id: 'sound-woodfish',
    title: 'Nhịp Mõ Tĩnh Tâm 60 BPM',
    subtitle: 'Tiếng mõ gỗ mít khoan thai giúp nhiếp tâm chánh niệm',
    durationLabel: '60 BPM',
    mode: 'woodfish',
    image: '/images/buddhas/duc-phat-a-di-da.png',
  },
  {
    id: 'sound-mantra',
    title: 'Ngũ Âm Niệm Lục Tự Đại Minh',
    subtitle: 'Âm rung chuông thanh tịnh theo 6 âm tiết Lục Tự Đại Minh',
    durationLabel: 'Nhịp 6 âm',
    mode: 'mantra',
    image: '/images/buddhas/quan-the-am-bo-tat.png',
  },
];

export interface WallpaperGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const WALLPAPER_GALLERY: WallpaperGalleryItem[] = [
  {
    id: 'wp-1',
    title: 'Đức Phật Thích Ca Tọa Thiền',
    subtitle: 'Hào quang từ bi dưới cội Bồ Đề giác ngộ',
    image: '/images/dharma/tools/14-chep-kinh.jpg',
  },
  {
    id: 'wp-2',
    title: 'Kim Thân Phật Bảo Trang Nghiêm',
    subtitle: 'Ánh sáng hoàng kim nơi đại điện Tam Bảo',
    image: '/images/dharma/tools/10-nhac-tu-tap-hz.jpg',
  },
  {
    id: 'wp-3',
    title: 'Đức Phật Di Lặc Thiên Đàn',
    subtitle: 'Tôn tượng Đại Phật an nhiên giữa trời xanh',
    image: '/images/dharma/tools/16-so-phong-sinh.jpg',
  },
  {
    id: 'wp-4',
    title: 'Bồ Tát Quán Thế Âm Từ Bi',
    subtitle: 'Thánh tượng Bồ Tát cứu khổ ban vui thanh tịnh',
    image: '/images/dharma/tools/09-cau-an.jpg',
  },
];

