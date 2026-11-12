// Tam Tạng Kinh Điển Trì Tụng (8 Bộ Kinh & Nghi Thức Cốt Tủy — Đầy Đủ Các Phần Khai Kinh -> Tịnh Pháp Giới -> Toàn Văn -> Bát Nhã -> Hồi Hướng -> Tam Tự Quy Y)

export type SutraCategory =
  | 'Kinh Nhật Tụng'
  | 'Tịnh Độ Tông'
  | 'Mật Tông'
  | 'Thiền & Bát Nhã'
  | 'Kinh Nguyên Thủy (Nikaya)'
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

export const SUTRA_CATEGORIES: SutraCategory[] = [
  'Kinh Nhật Tụng',
  'Tịnh Độ Tông',
  'Mật Tông',
  'Thiền & Bát Nhã',
  'Kinh Nguyên Thủy (Nikaya)',
  'Nghi Thức Sám Hối & Cúng Cơm',
];

const SHARED_KHAI_KINH: SutraSection = {
  title: 'I. Nghi Thức Niệm Hương & Kệ Khai Kinh',
  subtitle: 'Chắp tay trang nghiêm hướng về Tam Bảo — Gõ 3 tiếng chuông',
  paragraphs: [
    'Nguyện đem lòng thành kính, gửi theo đám mây hương, phảng phất khắp mười phương, cúng dường ngôi Tam Bảo. Thề trọn đời giữ đạo, theo tự tánh làm lành, cùng pháp giới chúng sinh, cầu Phật từ gia hộ, tâm Bồ Đề kiên cố, chí tu học vững bền, xa bể khổ nguồn mê, chóng quay về bờ Giác.',
    'Kệ Khai Kinh:\nPháp Phật cao siêu rất nhiệm mầu,\nNgàn muôn ức kiếp khó tìm cầu.\nCon nay nghe thấy chuyên trì niệm,\nNguyện tỏ Như Lai nghĩa nhiệm mầu.\n\nNam Mô Bổn Sư Thích Ca Mâu Ni Phật (3 lần).',
  ],
};

const SHARED_TINH_PHAP_GIOI: SutraSection = {
  title: 'II. Tịnh Pháp Giới & Tịnh Khẩu Nghiệp Chân Ngôn',
  subtitle: 'Trì niệm mỗi chân ngôn 3 lần trước khi vào Chánh Văn',
  paragraphs: [
    'Tịnh Pháp Giới Chân Ngôn:\nÁn lam xóa ha (3 lần).',
    'Tịnh Tam Nghiệp Chân Ngôn:\nÁn ta phạ bà phạ truật đà ta phạ đạt mạ ta phạ bà phạ truật độ hám (3 lần).',
    'An Thổ Địa Chân Ngôn:\nNam mô tam mãn đa một đà nẫm, án độ rô độ rô địa vĩ tát bà ha (3 lần).',
  ],
};

const SHARED_BAT_NHA_SHORT: SutraSection = {
  title: 'IV. Bát Nhã Ba La Mật Đa Tâm Kinh (Trì Tụng Kết Thời)',
  subtitle: 'Tâm yếu trí tuệ Bát Nhã — Quán Tự Tại Bồ Tát',
  paragraphs: [
    'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhứt thiết khổ ách. Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc; thọ, tưởng, hành, thức diệc phục như thị.',
    'Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm. Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp; vô nhãn giới nãi chí vô ý thức giới; vô vô minh diệc vô vô minh tận, nãi chí vô lão tử, diệc vô lão tử tận; vô khổ, tập, diệt, đạo; vô trí diệc vô đắc.',
    'Dĩ vô sở đắc cố, Bồ Đề Tát Đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn. Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.',
    'Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhứt thiết khổ, chơn thật bất hư. Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết: Yết đế, yết đế, ba la yết đế, ba la tăng yết đế, Bồ Đề tát bà ha (3 lần).',
  ],
};

const SHARED_HOI_HUONG: SutraSection = {
  title: 'V. Kệ Hồi Hướng Công Đức',
  subtitle: 'Lắng tâm gửi năng lượng an lành đến mười phương',
  paragraphs: [
    'Nguyện đem công đức này,\nTrang nghiêm Phật Tịnh Độ,\nTrên đền bốn ơn nặng,\nDưới cứu khổ ba đường.\nNếu có ai thấy nghe,\nĐều phát lòng Bồ Đề,\nHết một báo thân này,\nĐồng sanh cõi Cực Lạc.',
    'Phổ nguyện: Tông phong vĩnh chấn, Phật nhật tăng huy; quốc thái dân an, phong điều vũ thuận; gia quyến bình an, tật bệnh tiêu trừ, cửu huyền thất tổ đồng sanh Tịnh Cảnh.',
  ],
};

const SHARED_TAM_TU_QUY_Y: SutraSection = {
  title: 'VI. Tam Tự Quy Y',
  subtitle: 'Kết thúc thời kinh — 3 tiếng chuông đại hồng chung',
  paragraphs: [
    'Tự quy y Phật, đương nguyện chúng sinh, thể giải đại đạo, phát vô thượng tâm (1 lạy).',
    'Tự quy y Pháp, đương nguyện chúng sinh, thâm nhập kinh tạng, trí tuệ như hải (1 lạy).',
    'Tự quy y Tăng, đương nguyện chúng sinh, thống lý đại chúng, nhứt thiết vô ngại (1 lạy).',
  ],
};

export const SUTRAS_DATA: SutraText[] = [
  {
    id: 'bat-nha-tam-kinh',
    slug: 'bat-nha',
    title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
    sanskritOrPaliTitle: 'Prajñāpāramitāhṛdaya Sūtra',
    category: 'Thiền & Bát Nhã',
    durationMins: 8,
    translator: 'Tam Tạng Huyền Trang (Việt dịch HT. Thích Trí Quang / Truyền thống Thiền môn)',
    summary:
      'Bộ kinh ngắn gọn gồm 260 chữ Hán nhưng gói trọn tinh hoa trí tuệ Không Tánh, giúp hành giả vượt qua mọi khổ ách, sợ hãi và điên đảo mộng tưởng.',
    meritNote: 'Tụng 3 biến sáng/tối giúp khai mở trí tuệ Bát Nhã, giữ tâm vô quái ngại giữa nghịch cảnh.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III. Chánh Văn Bát Nhã Ba La Mật Đa Tâm Kinh (Âm Hán Việt)',
        paragraphs: [
          'Ma Ha Bát Nhã Ba La Mật Đa Tâm Kinh.',
          'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhứt thiết khổ ách.',
          'Xá Lợi Tử! Sắc bất dị không, không bất dị sắc; sắc tức thị không, không tức thị sắc; thọ, tưởng, hành, thức diệc phục như thị.',
          'Xá Lợi Tử! Thị chư pháp không tướng, bất sanh bất diệt, bất cấu bất tịnh, bất tăng bất giảm.',
          'Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp; vô nhãn giới, nãi chí vô ý thức giới.',
          'Vô vô minh, diệc vô vô minh tận; nãi chí vô lão tử, diệc vô lão tử tận. Vô khổ, tập, diệt, đạo. Vô trí diệc vô đắc.',
          'Dĩ vô sở đắc cố, Bồ Đề Tát Đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.',
          'Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.',
          'Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhứt thiết khổ, chơn thật bất hư.',
          'Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết: Yết đế, yết đế, ba la yết đế, ba la tăng yết đế, Bồ Đề tát bà ha (3 biến).',
        ],
      },
      {
        title: 'Bản Nghĩa Thuần Việt Dễ Hiểu',
        paragraphs: [
          'Bồ Tát Quán Tự Tại khi thực hành sâu xa trí tuệ Bát Nhã vượt bờ bên kia, soi thấy năm uẩn (sắc, thọ, tưởng, hành, thức) đều mang tánh Không vô ngã, liền vượt thoát hết thảy khổ đau ách nạn.',
          'Này Xá Lợi Phất! Hình sắc chẳng khác Tánh Không, Tánh Không chẳng khác hình sắc; sắc chính là Không, Không chính là sắc. Bốn uẩn còn lại cũng đều như vậy — mọi hiện tượng đều do nhân duyên hòa hợp nên không có tự tánh cố định biệt lập.',
          'Do tâm không còn vướng mắc chấp thủ nên Bồ Tát dứt sạch sợ hãi, xa lìa mộng tưởng điên đảo, thành tựu an vui Niết Bàn rốt ráo ngay giữa đời sống.',
        ],
      },
    ],
    batNhaTamKinh: {
      title: 'IV. Trì Chú Bát Nhã Tâm Chú (7 Biến Gia Trì)',
      paragraphs: [
        'Gate Gate Pāragate Pārasaṃgate Bodhi Svāhā — Yết đế, yết đế, ba la yết đế, ba la tăng yết đế, Bồ Đề tát bà ha (7 lần).',
      ],
    },
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'kinh-phap-cu',
    slug: 'phap-cu',
    title: 'Kinh Pháp Cú — Tuyển Tập Các Phẩm Cốt Tủy',
    sanskritOrPaliTitle: 'Dhammapada (Tiểu Bộ Kinh — Kinh Tạng Pali)',
    category: 'Kinh Nguyên Thủy (Nikaya)',
    durationMins: 15,
    translator: 'Hòa thượng Thích Minh Châu',
    summary:
      'Những lời vàng trực tiếp từ kim khẩu Đức Phật Thích Ca Mâu Ni về nhân quả, điều phục tâm ý, từ bi thắng hận thù và con đường Bát Chánh Đạo.',
    meritNote: 'Tụng đọc chậm rãi để soi chiếu lại Thân - Khẩu - Ý trong đời sống thường nhật.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Phẩm Song Yếu (Yamaka Vagga)',
        paragraphs: [
          '1. Ý dẫn đầu các pháp, ý làm chủ, ý tạo. Nếu với ý ô nhiễm, nói lên hay hành động, khổ não bước theo sau, như xe chân vật kéo.',
          '2. Ý dẫn đầu các pháp, ý làm chủ, ý tạo. Nếu với ý thanh tịnh, nói lên hay hành động, an lạc bước theo sau, như bóng không rời hình.',
          '3. "Nó mắng tôi, nó đánh tôi, nó thắng tôi, nó cướp của tôi". Ai ôm ấp niệm ấy, hận thù không thể nguôi.',
          '4. "Nó mắng tôi, nó đánh tôi, nó thắng tôi, nó cướp của tôi". Ai không ôm niệm ấy, hận thù tự nhiên nguôi.',
          '5. Với hận diệt hận thù, đời này không có được. Không hận diệt hận thù, là định luật ngàn thu.',
        ],
      },
      {
        title: 'III.2. Phẩm Không Phóng Dật & Tâm Ý',
        paragraphs: [
          '21. Không phóng dật, đường sống. Phóng dật là đường chết. Không phóng dật, không chết. Phóng dật như thây ma.',
          '33. Tâm hoảng hốt dao động, khó hộ trì, khó nhiếp. Người trí làm tâm thẳng, như thợ tên nắn tên.',
          '35. Khó nắm giữ, khinh động, theo các dục quay cuồng, lành thay, điều phục tâm; tâm điều, an lạc đến.',
          '50. Không nên nhìn lỗi người, người làm hay không làm. Nên tự nhìn thân tâm, đã làm hay chưa làm.',
          '103. Dầu tại bãi chiến trường, thắng ngàn ngàn quân địch. Tự thắng mình tốt hơn, thật chiến thắng tối thượng.',
        ],
      },
      {
        title: 'III.3. Phẩm Đức Phật Đà & Phẩm An Lạc',
        paragraphs: [
          '183. Không làm mọi điều ác, thành tựu các hạnh lành, tâm ý giữ trong sạch, chính lời chư Phật dạy.',
          '197. Vui thay, chúng ta sống, không hận giữa hận thù. Giữa những người thù hận, ta sống không hận thù.',
          '204. Không bệnh lợi tối thượng, biết đủ tài tối thượng, thành tín bạn tối thượng, Niết-bàn lạc tối thượng.',
          '277. Tất cả hành vô thường; với tuệ quán thấy vậy, đau khổ được nhàm chán; chính con đường thanh tịnh.',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'chu-dai-bi',
    slug: 'dai-bi',
    title: 'Chú Đại Bi (Thiên Thủ Thiên Nhãn Đại Bi Tâm Đà La Ni)',
    sanskritOrPaliTitle: 'Nīlakaṇṭha Dhāraṇī — 84 Câu Chân Ngôn',
    category: 'Mật Tông',
    durationMins: 12,
    translator: 'Dịch âm chuẩn Thiền môn Việt Nam (84 câu)',
    summary:
      'Thần chú Đại Bi do Đức Bồ Tát Quán Thế Âm tuyên thuyết giữa đại hội, mang năng lực từ bi hộ trì, tiêu trừ chướng nạn và nuôi dưỡng tâm bình đẳng.',
    meritNote: 'Giữ tâm bình đẳng đại bi trước khi trì tụng trọn vẹn 84 câu Đại Bi Tâm Đà La Ni.',
    khaiKinh: {
      title: 'I. Nguyện Lực Phát Tâm Đại Bi Trước Khi Trì Chú',
      paragraphs: [
        'Nam mô Đại Bi Quán Thế Âm Bồ Tát (3 lần).',
        'Lạy Đức Quán Thế Âm, con nay phát tâm thanh tịnh trì tụng Đại Bi Thần Chú, nguyện diệt trừ oán nghiệp, thành tựu lòng từ bi vô lượng, sớm thấy tánh thanh tịnh bình đẳng nơi tự tâm.',
      ],
    },
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III. Toàn Văn Chú Đại Bi (84 Câu Chuẩn Thiền Môn)',
        subtitle: 'Trì tụng đều đặn theo nhịp Mõ trang nghiêm',
        paragraphs: [
          'Thiên Thủ Thiên Nhãn Vô Ngại Đại Bi Tâm Đà La Ni.\nNam mô hắc ra đát na đa ra dạ da (1). Nam mô a rị da (2), bà lô yết đế thước bát ra da (3), bồ đề tát đỏa bà da (4), ma ha tát đỏa bà da (5), ma ha ca lô ni ca da (6). Án (7), tát bàn ra phạt duệ (8), số đát na đát tỏa (9). Nam mô tất kiết lật đỏa y mông a rị da (10), bà lô yết đế thất Phật ra lăng đà bà (11).',
          'Nam mô na ra cẩn trì (12), hê rị ma ha bàn đa sa mế (13), tát bà a tha đậu du bằng (14), a thệ dựng (15), tát bà tát đa na ma bà già (16), ma phạt đạt đậu (17), đát điệt tha (18). Án a bà lô hê (19), lô ca đế (20), ca ra đế (21), di hê rị (22), ma ha bồ đề tát đỏa (23), tát bà tát bà (24), ma ra ma ra (25), ma hê ma hê rị đà dựng (26), cu lô cu lô kiết mông (27), độ lô độ lô phạt xà da đế (28), ma ha phạt xà da đế (29).',
          'Đà ra đà ra (30), địa rị ni (31), thất Phật ra da (32), giá ra giá ra (33). Mạ mạ phạt ma ra (34), mục đế lệ (35), y hê y hê (36), thất na thất na (37), a ra sâm Phật ra xá lợi (38), phạt sa phạt sâm (39), Phật ra xá da (40), hô lô hô lô ma ra (41), hô lô hô lô hê rị (42), ta ra ta ra (43), tất rị tất rị (44), tô rô tô rô (45), bồ đề dạ bồ đề dạ (46), bồ đà dạ bồ đà dạ (47), di đế rị dạ (48), na ra cẩn trì (49), địa rị sắc ni na (50), ba dạ ma na (51), ta bà ha (52).',
          'Tất đà dạ (53), ta bà ha (54). Ma ha tất đà dạ (55), ta bà ha (56). Tất đà du nghệ (57), thất bàn ra dạ (58), ta bà ha (59). Na ra cẩn trì (60), ta bà ha (61). Ma ra na ra (62), ta bà ha (63). Tất ra tăng a mục khê da (64), ta bà ha (65). Ta bà ma ha a tất đà dạ (66), ta bà ha (67). Giả kiết ra a tất đà dạ (68), ta bà ha (69). Ba đà ma kiết tất đà dạ (70), ta bà ha (71). Na ra cẩn trì bàn đà ra dạ (72), ta bà ha (73). Ma bà lị thắng kiết ra dạ (74), ta bà ha (75).',
          'Nam mô hắc ra đát na đa ra dạ da (76). Nam mô a rị da (77), bà lô yết đế (78), thước bàn ra dạ (79), ta bà ha (80). Án tất điện đô (81), mạn đa ra (82), bạt đà dạ (83), ta bà ha (84).',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'kinh-a-di-da',
    slug: 'a-di-da',
    title: 'Kinh Phật Thuyết A Di Đà',
    sanskritOrPaliTitle: 'Sukhāvatīvyūha Sūtra (Tiểu Bản)',
    category: 'Tịnh Độ Tông',
    durationMins: 20,
    translator: 'Tam Tạng Cưu Ma La Thập (Việt dịch HT. Thích Trí Tịnh)',
    summary:
      'Bộ kinh căn bản của Tịnh Độ Tông mô tả cõi Tây Phương Cực Lạc thanh tịnh trang nghiêm của Đức Phật A Di Đà và pháp môn trì danh hiệu nhứt tâm bất loạn.',
    meritNote: 'Tụng vào thời chiều hoặc tối kết hợp niệm Lục Tự Di Đà cầu gia đạo an hòa và vãng sinh Tịnh Độ.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Tựa Phần & Trang Nghiêm Cõi Cực Lạc',
        paragraphs: [
          'Như vầy tôi nghe: Một thuở nọ, Đức Phật ở nơi vườn Kỳ Thọ Cấp Cô Độc, nước Xá Vệ, cùng với một ngàn hai trăm năm mươi vị đại Tỳ Kheo câu hội, đều là bậc đại A La Hán được mọi người quen biết, như Trưởng lão Xá Lợi Phất, Ma Ha Mục Kiền Liên, Ma Ha Ca Diếp, A Nan Đà... cùng chư Đại Bồ Tát như Văn Thù Sư Lợi, A Dật Đa, Thường Tinh Tấn... vô lượng đại chúng đồng đến dự.',
          'Bấy giờ Đức Phật bảo Ngài Trưởng lão Xá Lợi Phất rằng: "Từ đây qua phương Tây quá mười muôn ức cõi Phật, có thế giới tên là Cực Lạc. Trong thế giới đó có Đức Phật hiệu là A Di Đà hiện nay đương nói pháp. Xá Lợi Phất! Cớ sao cõi nước đó tên là Cực Lạc? Vì chúng sinh trong cõi nước ấy không có những sự khổ, chỉ hưởng những điều vui, nên nước đó tên là Cực Lạc."',
          'Lại nữa, Xá Lợi Phất! Cõi nước Cực Lạc có bảy tầng lan can, bảy tầng mành lưới, bảy tầng hàng cây đều bằng bốn chất báu bao bọc giáp vòng; vì thế nên nước ấy tên là Cực Lạc. Cõi đó lại có ao bảy báu, nước tám công đức đầy tràn trong ao; đáy ao thuần dùng cát vàng trải đất. Bốn bên thềm đường bằng vàng, bạc, lưu ly, pha lê hợp thành; trên có lầu gác trang nghiêm; trong ao có hoa sen lớn bằng bánh xe, sắc xanh ánh sáng xanh, sắc vàng ánh sáng vàng, sắc đỏ ánh sáng đỏ, sắc trắng ánh sáng trắng, mầu nhiệm thơm tho trong sạch.',
        ],
      },
      {
        title: 'III.2. Pháp Môn Trì Danh Nhứt Tâm Bất Loạn',
        paragraphs: [
          'Xá Lợi Phất! Chớ nên lấy chút ít nhân duyên phước đức mà được sanh về cõi nước kia. Xá Lợi Phất! Nếu có thiện nam tử, thiện nữ nhân nào nghe nói Đức Phật A Di Đà rồi chấp trì danh hiệu của Ngài, hoặc một ngày, hoặc hai ngày, hoặc ba ngày, hoặc bốn ngày, hoặc năm ngày, hoặc sáu ngày, hoặc bảy ngày, một lòng không tạp loạn; thì người đó đến lúc lâm chung, Đức Phật A Di Đà cùng hàng Thánh chúng hiện thân ở trước người đó. Người đó lúc chết tâm thần không điên đảo, liền được vãng sanh về cõi nước Cực Lạc của Đức Phật A Di Đà.',
          'Xá Lợi Phất! Ta thấy sự lợi ích ấy nên nói lời này: Nếu có chúng sinh nào nghe lời nói trên đây, nên phải phát nguyện sanh về cõi nước kia. Chư Phật ở sáu phương như Đông, Nam, Tây, Bắc, Thượng, Hạ đều hiện tướng lưỡi rộng dài trùm khắp tam thiên đại thiên thế giới nói lời thành thật khuyên hàng chúng sinh tin nhận Kinh Xưng Tán Bất Khả Tư Nghì Công Đức Nhất Thiết Chư Phật Sở Hộ Niệm này.',
          'Nam Mô Tây Phương Cực Lạc Thế Giới Đại Từ Đại Bi A Di Đà Phật (niệm 21 biến hoặc 108 biến).',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'kinh-duoc-su',
    slug: 'duoc-su',
    title: 'Kinh Dược Sư Lưu Ly Quang Như Lai Bổn Nguyện Công Đức',
    sanskritOrPaliTitle: 'Bhaiṣajyaguru-vaiḍūryaprabha-rāja Sūtra',
    category: 'Kinh Nhật Tụng',
    durationMins: 25,
    translator: 'Tam Tạng Huyền Trang (Việt dịch HT. Thích Huyền Dung / Truyền thống Cầu An)',
    summary:
      'Trình bày 12 Đại Nguyện cứu khổ chữa bệnh thân tâm của Đức Phật Dược Sư Lưu Ly Quang Vương tại cõi Tịnh Lưu Ly phương Đông.',
    meritNote: 'Tụng niệm cầu tiêu tai diên thọ, bình an cho cha mẹ và người đang mang bệnh duyên.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Bồ Tát Mạn Thù Thất Lợi Thỉnh Pháp',
        paragraphs: [
          'Như vầy tôi nghe: Một thuở nọ, Đức Bạc Già Phạm dạo đi giáo hóa các nước, đến thành Quảng Nghiêm, ngự dưới gốc cây nhạc âm cùng chúng Đại Tỳ Kheo tám ngàn người, Bồ Tát Ma Ha Tát ba muôi sáu ngàn vị...',
          'Bấy giờ Pháp Vương tử Mạn Thù Thất Lợi từ chỗ ngồi đứng dậy, trịch áo vai hữu, gối hữu quỳ sát đất, chắp tay hướng về Đức Phật mà bạch rằng: "Thế Tôn! Cúi xin Ngài vì chúng sinh trong đời Tượng Pháp chuyển mê khai ngộ mà diễn nói danh hiệu chư Phật và những bản đại nguyện công đức thù thắng, khiến người nghe thấy đều tiêu trừ nghiệp chướng."',
        ],
      },
      {
        title: 'III.2. Mười Hai Đại Nguyện Đức Phật Dược Sư Lưu Ly Quang',
        paragraphs: [
          'Đức Phật bảo Ngài Mạn Thù Thất Lợi: "Về phương Đông cách đây quá mười hằng hà sa cõi Phật, có thế giới tên là Tịnh Lưu Ly, Đức Phật hiệu là Dược Sư Lưu Ly Quang Như Lai. Khi Ngài còn tu hạnh Bồ Tát đã phát mười hai đại nguyện lớn làm cho tất cả hữu tình điều gì mong cầu đều được như ý:',
          'Đại nguyện thứ nhất: Thân Ngài sáng chói như ngọc lưu ly chiếu rọi vô lượng thế giới, khiến tất cả hữu tình cũng được thân tâm thanh tịnh sáng suốt như Ngài.\nĐại nguyện thứ ba: Dùng trí tuệ phương tiện vô lượng làm cho hết thảy chúng sinh đều đầy đủ cơm ăn áo mặc, không ai thiếu thốn.\nĐại nguyện thứ sáu & thứ bảy: Khiến những người thân thể tật nguyền, đui điếc câm ngọng hay mắc bệnh nghèo khốn không thuốc thang đều được nghe danh hiệu Ngài mà dứt sạch bệnh khổ, thân tâm an lạc, quyến thuộc sum vầy.\nĐại nguyện thứ mười & mười một: Giải thoát người bị oan ức giam cầm hay đói khát khổ sở được hưởng pháp vị an vui và đầy đủ phước báu."',
        ],
      },
      {
        title: 'III.3. Dược Sư Quán Đảnh Chân Ngôn & Danh Hiệu',
        paragraphs: [
          'Nam mô Bạc Già Phạm Đế, Bệ Sát Xã, Lũ Rô Bệ Lưu Ly, Bát Lạt Bà, Hát Ra Xà Dã, Đát Tha Yết Đa Da, A Ra Hát Đế, Tam Miệu Tam Bột Đà Da. Đát Điệt Tha: Án, Bệ Sát Thệ, Bệ Sát Thệ, Bệ Sát Xã Tam Một Yết Đế Ta Ha (7 lần).',
          'Nam Mô Đông Phương Tịnh Lưu Ly Thế Giới Dược Sư Lưu Ly Quang Vương Phật (niệm 21 lần).',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'kinh-dia-tang',
    slug: 'dia-tang',
    title: 'Kinh Địa Tạng Bồ Tát Bổn Nguyện — Phẩm Như Lai Tán Thán',
    sanskritOrPaliTitle: 'Kṣitigarbha Bodhisattva Pūrvapraṇidhāna Sūtra',
    category: 'Kinh Nhật Tụng',
    durationMins: 25,
    translator: 'HT. Thích Trí Tịnh',
    summary:
      'Ngợi ca đại hiếu và đại nguyện vô biên của Đức Bồ Tát Địa Tạng Vương — người phát nguyện "Địa ngục vị không, thệ bất thành Phật; chúng sinh độ tận, phương chứng Bồ Đề".',
    meritNote: 'Tụng niệm để nuôi dưỡng tâm hiếu thảo, tụng kỳ siêu cho hương linh cửu huyền thất tổ.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Đức Phật Thuyết Pháp Độ Thánh Mẫu Ma Da Tại Đao Lợi',
        paragraphs: [
          'Như vầy tôi nghe: Một thuở nọ, tại cung trời Đao Lợi, Đức Phật vì Thánh Mẫu Ma Da mà thuyết pháp. Bấy giờ mười phương vô lượng chư Phật và Đại Bồ Tát đều đồng vân tập, tán thán Đức Thích Ca Mâu Ni hay nơi cõi ngũ trược ác thế mà giáo hóa chúng sinh cứng cỏi biết hướng về chánh đạo.',
          'Ngài Văn Thù Sư Lợi hỏi về nhân duyên tu hành của Bồ Tát Địa Tạng, Đức Phật nhắc lại thuở xưa khi còn làm người con gái hiếu thảo tên Quang Mục và Thánh Nữ Bà La Môn, vì cứu mẹ thoát cảnh đọa lạc mà phát lời thệ nguyện vĩ đại suốt vô lượng kiếp cứu độ hết thảy chúng sinh khổ nạn.',
        ],
      },
      {
        title: 'III.2. Phẩm Thứ Sáu: Như Lai Tán Thán Công Đức Thù Thắng',
        paragraphs: [
          'Bấy giờ từ toàn thân Đức Thế Tôn phóng ra ánh sáng rộng lớn chiếu khắp trăm nghìn muôn ức thế giới chư Phật, khen ngợi Đại Sĩ Địa Tạng là bậc đại bi cứu khổ tối thắng. Ngài bảo Ngài Phổ Quảng Bồ Tát rằng: Nếu có thiện nam tử, thiện nữ nhân nào hoặc trong những ngày Trai giới mùng 1, 8, 14, 15, 18, 23, 24, 28, 29, 30 hay trong ngày kỵ giỗ cha mẹ, tổ tiên mà phát tâm đọc tụng Kinh Địa Tạng một biến, lại không sát sinh hại vật để cúng tế, thì hương linh quá cố được nhẹ nhàng siêu thoát, còn người sống hiện tiền được hai mươi tám điều lợi ích như thiên long hộ niệm, thiện quả ngày thêm tăng trưởng, tai họa tiêu trừ.',
          'Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát Ma Ha Tát (niệm 21 lần).',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'kinh-kim-cuong',
    slug: 'kim-cuong',
    title: 'Kinh Kim Cương Bát Nhã Ba La Mật (Ưng Vô Sở Trụ)',
    sanskritOrPaliTitle: 'Vajracchedikā Prajñāpāramitā Sūtra',
    category: 'Thiền & Bát Nhã',
    durationMins: 22,
    translator: 'Tam Tạng Cưu Ma La Thập (Việt dịch HT. Thích Trí Quang / Truyền thống Thiền Tông)',
    summary:
      'Bộ kinh soi đường cho Lục Tổ Huệ Năng ngộ đạo với câu pháp ngữ bất hủ "Ưng vô sở trụ nhi sanh kỳ tâm" — Không trụ chấp vào đâu mà khởi phát tâm sáng.',
    meritNote: 'Phá trừ chấp tướng (ngã tướng, nhân tướng, chúng sinh tướng, thọ giả tướng) bằng trí tuệ Kim Cương.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Pháp Hội Nhân Duyên & Tông Chỉ Phá Chấp Bố Thí',
        paragraphs: [
          'Như vầy tôi nghe: Một thuở nọ, Đức Phật ở nước Xá Vệ, vườn Kỳ Thọ Cấp Cô Độc, cùng một ngàn hai trăm năm mươi vị Tỳ Kheo. Đến giờ ăn, Thế Tôn đắp y ôm bát vào thành Xá Vệ khất thực, khất thực xong trở về thọ trai, rửa chân, trải tòa ngồi ngay thẳng.',
          'Trưởng lão Tu Bồ Đề đứng dậy trịch áo quỳ gối thưa hỏi: "Bạch Thế Tôn! Hàng thiện nam, thiện nữ phát tâm Vô Thượng Chánh Đẳng Chánh Giác nên an trụ tâm như thế nào và hàng phục tâm vọng tưởng như thế nào?"',
          'Đức Phật dạy: "Này Tu Bồ Đề! Chư Đại Bồ Tát nên hàng phục tâm như thế này: Tất cả các loài chúng sinh noãn sanh, thai sanh, thấp sanh, hóa sanh... ta đều phải đưa vào cõi Vô Dư Niết Bàn mà diệt độ, song thật sự không thấy có một chúng sinh nào được ta diệt độ cả. Vì sao? Nếu Bồ Tát còn chấp có Ngã tướng, Nhân tướng, Chúng sinh tướng, Thọ giả tướng thì chẳng phải Bồ Tát. Khi làm hạnh bố thí cũng đừng trụ tâm vào sắc, thanh, hương, vị, xúc, pháp mà hãy thực hành với tâm vô trụ thanh tịnh."',
        ],
      },
      {
        title: 'III.2. Ưng Vô Sở Trụ & Bài Kệ Tứ Cú Huyền Diệu',
        paragraphs: [
          'Phật dạy Ngài Tu Bồ Đề: "Phàm những gì có hình tướng đều là hư vọng; nếu thấy các tướng chẳng phải tướng, tức thấy được Như Lai." Bồ Tát không nên trụ tâm vào sáu trần mà sanh tâm; phải nên không có chỗ trụ mà sanh cái tâm thanh tịnh (Ưng vô sở trụ nhi sanh kỳ tâm).',
          'Kết kinh bằng bài kệ Tứ Cú bất hủ:\nNhứt thiết hữu vi pháp,\nNhư mộng huyễn bào ảnh,\nNhư lộ diệc như điện,\nƯng tác như thị quán.\n(Tất cả pháp hữu vi,\nNhư mộng, huyễn, bọt, bóng,\nNhư sương mai, tia chớp,\nHãy quán chiếu như vậy.)',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
  {
    id: 'vu-lan-sam-hoi',
    slug: 'vu-lan-sam-hoi',
    title: 'Kinh Vu Lan Báo Hiếu & Văn Sám Hối Sáu Căn',
    sanskritOrPaliTitle: 'Ullambana Sūtra & Nghi Thức Sám Hối Hồng Danh',
    category: 'Nghi Thức Sám Hối & Cúng Cơm',
    durationMins: 18,
    translator: 'Cố HT. Thích Trí Tịnh & HT. Thích Nhật Từ',
    summary:
      'Gương đại hiếu của Tôn giả Mục Kiền Liên nương oai thần chư Tăng Tự Tứ cứu mẹ, kết hợp Văn Sám Hối Sáu Căn giúp gột rửa lỗi lầm thân khẩu ý.',
    meritNote: 'Tụng niệm vào thời tối trước khi nghỉ ngơi, hoặc trong các ngày kỵ giỗ, mùa Vu Lan báo hiếu.',
    khaiKinh: SHARED_KHAI_KINH,
    tinhPhapGioi: SHARED_TINH_PHAP_GIOI,
    toanVan: [
      {
        title: 'III.1. Tinh Hoa Kinh Vu Lan Báo Hiếu',
        paragraphs: [
          'Thuở xưa, Ngài Đại Mục Kiền Liên mới chứng đắc Lục Thông, nhớ thương thân mẫu Thanh Đề bèn dùng tuệ nhãn nhìn khắp cõi dưới, thấy mẹ đang đọa trong đường ngạ quỷ đói khát. Ngài xúc động bưng bát cơm dâng mẹ, nhưng cơm vừa đưa lên miệng liền hóa thành than lửa do nghiệp tham sân chưa chuyển hóa của bà.',
          'Mục Kiền Liên đau đớn chạy về thỉnh cầu Đức Phật chỉ dạy phương pháp cứu mẹ. Đức Phật dạy: Nghiệp chướng sâu dày một mình con dù có thần thông cũng không cứu nổi, phải nương nhờ oai đức thanh tịnh của mười phương Tăng chúng trong ngày Rằm tháng Bảy Tự Tứ, sắm sửa trai nghi thanh tịnh dâng cúng cầu nguyện, nhờ phước lực thanh tịnh chung mà mẹ hiện đời được tăng long phước thọ, cha mẹ bảy đời quá vãng được thoát khỏi cảnh khổ sanh về cõi an lành.',
        ],
      },
      {
        title: 'III.2. Văn Sám Hối Sáu Căn (Mắt, Tai, Mũi, Lưỡi, Thân, Ý)',
        paragraphs: [
          'Mắt từng nhìn sắc đẹp mà sanh tâm tham đắm, thấy cảnh trái ý mà khởi lòng oán hờn. Hôm nay chí thành sám hối, nguyện học nhìn đời bằng ánh mắt từ bi bình đẳng.\nTai từng ưa nghe lời khen nịnh hót mà vui, nghe lời thật trái tai mà giận. Hôm nay chí thành sám hối, nguyện dùng tai lắng nghe sâu sắc nỗi khổ của tha nhân.\nMũi, Lưỡi từng ham vị ngon vật lạ, nói lời thêu dệt, chê bai hay đâm thọc. Hôm nay chí thành sám hối, nguyện giữ khẩu nghiệp trong sạch ái ngữ.\nThân, Ý từng tạo nhiều lỗi lầm vì vô minh, si mê, ích kỷ. Hôm nay trước Tam Bảo, con xin thành tâm phát lồ ăn năn, nguyện từ nay đổi mới đời sống trong ánh sáng chánh niệm.\n\nNam Mô Cầu Sám Hối Bồ Tát Ma Ha Tát (3 lần).',
        ],
      },
    ],
    batNhaTamKinh: SHARED_BAT_NHA_SHORT,
    hoiHuong: SHARED_HOI_HUONG,
    tamTuQuyY: SHARED_TAM_TU_QUY_Y,
  },
];

export function getSutraBySlugOrId(key: string): SutraText | undefined {
  const k = key.toLowerCase().trim();
  return SUTRAS_DATA.find((s) => s.slug === k || s.id === k);
}

