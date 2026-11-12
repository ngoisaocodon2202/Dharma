// Dữ Liệu 18 Danh Lam Cổ Tự Việt Nam — Phân Bố Đều 3 Miền (6 Bắc • 6 Trung • 6 Nam)
import { getPagodaImage } from '@/lib/assets';

export type PagodaRegion = 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
export type PagodaSect = 'Bắc Tông' | 'Thiền Trúc Lâm' | 'Nam Tông';

export interface PagodaItem {
  slug: string;
  name: string;
  alternateName?: string;
  region: PagodaRegion;
  province: string;
  sect: PagodaSect;
  foundingYear: string;
  image: string;
  address: string;
  coordinates: { lat: number; lng: number };
  mapsUrl: string;
  shortDesc: string;
  architecturalHighlights: string[];
  history: string;
  worshipFocus: string;
}

export const PAGODAS_DATA: PagodaItem[] = [
  // ======================== MIỀN BẮC (6) ========================
  {
    slug: 'chua-mot-cot',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    alternateName: 'Liên Hoa Đài',
    region: 'Miền Bắc',
    province: 'Hà Nội',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1049 (Thời Lý Thái Tông)',
    image: getPagodaImage('chua-mot-cot'),
    address: 'Phố Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
    coordinates: { lat: 21.0358, lng: 105.8336 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Mot+Cot+Ba+Dinh+Ha+Noi',
    shortDesc: 'Biểu tượng ngàn năm văn hiến với kiến trúc Đài Sen vươn lên từ mặt hồ Linh Chiểu.',
    architecturalHighlights: [
      'Cấu trúc gỗ Liên Hoa Đài đặt trọn trên một cột đá đường kính 1,2m giữa hồ nước vuông.',
      'Mái đao cong vút chạm khắc lưỡng long chầu nguyệt mang đậm mỹ thuật triều Lý.',
      'Được công nhận là Di tích Kiến trúc Nghệ thuật Quốc gia Đặc biệt.',
    ],
    history:
      'Khởi dựng vào tháng 10 năm Kỷ Sửu (1049) dưới triều vua Lý Thái Tông sau giấc chiêm bao thấy Đức Bồ Tát Quán Thế Âm ngự trên tòa sen vàng dắt vua lên đài ngọc. Tên "Diên Hựu" hàm ý cầu phúc lành dài lâu cho muôn dân đất Việt.',
    worshipFocus: 'Bồ Tát Quán Thế Âm Ngự Tòa Sen & Tam Thế Chư Phật',
  },
  {
    slug: 'chua-bai-dinh',
    name: 'Chùa Bái Đính',
    alternateName: 'Bái Đính Cổ Tự & Tân Tự',
    region: 'Miền Bắc',
    province: 'Ninh Bình',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1136 (Thiền sư Nguyễn Minh Không)',
    image: getPagodaImage('chua-bai-dinh'),
    address: 'Xã Gia Sinh, Huyện Gia Viễn, Tỉnh Ninh Bình',
    coordinates: { lat: 20.2735, lng: 105.8645 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Bai+Dinh+Ninh+Binh',
    shortDesc: 'Quần thể chùa cổ gắn liền với Quốc sư Nguyễn Minh Không giữa non nước Tràng An.',
    architecturalHighlights: [
      'Hang Sáng — Động Tối thờ Phật và Mẫu trên sườn núi Đính ngàn năm tuổi.',
      'Hành lang 500 vị La Hán bằng đá xanh Ninh Bình chạm khắc tinh xảo.',
      'Bảo tháp 13 tầng tôn trí Xá lợi Phật và Đại Hồng Chung nặng 36 tấn.',
    ],
    history:
      'Tương truyền năm 1136, Quốc sư Nguyễn Minh Không đến núi Đính hái thuốc chữa bệnh hóa hổ cho vua Lý Thần Tông và lập nên ngôi cổ tự. Ngày nay chùa vừa giữ vẹn nét cổ kính hang đá thiêng vừa mở rộng thành đại danh lam trang nghiêm hàng đầu Đông Nam Á.',
    worshipFocus: 'Đức Phật Thích Ca Mâu Ni, Bồ Tát Quán Thế Âm & Quốc sư Minh Không',
  },
  {
    slug: 'thien-vien-truc-lam-yen-tu',
    name: 'Thiền Viện Trúc Lâm Yên Tử (Chùa Lân)',
    alternateName: 'Tổ Đình Thiền Phái Trúc Lâm',
    region: 'Miền Bắc',
    province: 'Quảng Ninh',
    sect: 'Thiền Trúc Lâm',
    foundingYear: 'Thế kỷ XIII (1293 - Phật Hoàng Trần Nhân Tông)',
    image: getPagodaImage('thien-vien-truc-lam-yen-tu'),
    address: 'Thôn Nam Mẫu, Xã Thượng Yên Công, TP. Uông Bí, Quảng Ninh',
    coordinates: { lat: 21.1322, lng: 106.7235 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Thien+Vien+Truc+Lam+Yen+Tu',
    shortDesc: 'Đất tổ của Thiền phái Trúc Lâm Việt Nam với tinh thần Cư trần lạc đạo.',
    architecturalHighlights: [
      'Kiến trúc gỗ lim cổ truyền hòa mình vào rừng trúc, rừng tùng cổ thụ hàng trăm năm.',
      'Nơi tiếp dẫn hành hương lên Chùa Hoa Yên, Chùa Một Mái và Chùa Đồng đỉnh Yên Tử.',
      'Bảo tồn nhiều tư liệu, bia đá về Tam Tổ Trúc Lâm: Trần Nhân Tông, Pháp Loa, Huyền Quang.',
    ],
    history:
      'Năm 1299, Điều Ngự Giác Hoàng Trần Nhân Tông xuất gia tu hành trên núi Yên Tử, hợp nhất ba dòng thiền đương thời sáng lập Thiền phái Trúc Lâm mang đậm bản sắc nhập thế Đại Việt.',
    worshipFocus: 'Đức Phật Thích Ca Mâu Ni & Tam Tổ Trúc Lâm Yên Tử',
  },
  {
    slug: 'chua-huong',
    name: 'Chùa Hương (Hương Tích Động)',
    alternateName: 'Chùa Trong • Nam Thiên Đệ Nhất Động',
    region: 'Miền Bắc',
    province: 'Hà Nội',
    sect: 'Bắc Tông',
    foundingYear: 'Thế kỷ XV (Hoàn thiện năm 1686)',
    image: getPagodaImage('chua-huong'),
    address: 'Xã Hương Sơn, Huyện Mỹ Đức, Hà Nội',
    coordinates: { lat: 20.6184, lng: 105.7445 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Huong+My+Duc+Ha+Noi',
    shortDesc: 'Thánh địa hành hương bên dòng suối Yến và động Hương Tích huyền linh.',
    architecturalHighlights: [
      'Động Hương Tích thiên tạo kỳ vĩ với cửa động khắc 5 chữ "Nam Thiên Đệ Nhất Động".',
      'Quần thể Thiên Trù, Đền Trình, Giải Oan kết nối dọc dòng suối Yến thanh bình.',
      'Tượng Bồ Tát Quán Thế Âm bằng đá xanh thời Tây Sơn tuyệt mỹ trong lòng động.',
    ],
    history:
      'Gắn liền với truyền thuyết Bồ Tát Quán Thế Âm Diệu Thiện tu hành đắc đạo. Từ nhiều thế kỷ qua, lễ hội Chùa Hương mùa xuân là hành trình chiêm bái lớn bậc nhất miền Bắc.',
    worshipFocus: 'Bồ Tát Quán Thế Âm (Phật Bà Chùa Hương)',
  },
  {
    slug: 'chua-tay-phuong',
    name: 'Chùa Tây Phương (Sùng Phúc Tự)',
    alternateName: 'Bảo Vật Tượng Cổ Triều Tây Sơn',
    region: 'Miền Bắc',
    province: 'Hà Nội',
    sect: 'Bắc Tông',
    foundingYear: 'Thế kỷ VIII (Trùng tu lớn 1794)',
    image: getPagodaImage('chua-tay-phuong'),
    address: 'Núi Câu Lậu, Xã Thạch Xá, Huyện Thạch Thất, Hà Nội',
    coordinates: { lat: 21.0285, lng: 105.6161 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Tay+Phuong+Thach+That+Ha+Noi',
    shortDesc: 'Ngôi cổ tự trên đỉnh núi Câu Lậu lưu giữ 18 vị La Hán bằng gỗ mít sơn son thếp vàng.',
    architecturalHighlights: [
      'Ba tòa Hạ, Trung, Thượng xếp theo hình chữ Tam (三) trên đỉnh đồi đá ong.',
      '76 pho tượng cổ thế kỷ XVIII được công nhận Bảo vật Quốc gia.',
      'Bộ tượng Thập Bát La Hán với biểu cảm nội tâm sống động tuyệt đỉnh mỹ thuật cổ.',
    ],
    history:
      'Ngôi chùa cổ xây từ thời Bắc thuộc, đại trùng tu năm Cảnh Thịnh thứ 2 (1794). Hình ảnh Chùa Tây Phương từng đi vào áng thơ bất hủ "Các vị La Hán chùa Tây Phương" của Huy Cận.',
    worshipFocus: 'Tam Thế Phật, Tuyết Sơn & Thập Bát La Hán',
  },
  {
    slug: 'chua-but-thap',
    name: 'Chùa Bút Tháp (Ninh Phúc Tự)',
    alternateName: 'Bảo Tháp Báo Nghiêm Đá Trắng',
    region: 'Miền Bắc',
    province: 'Bắc Ninh',
    sect: 'Bắc Tông',
    foundingYear: 'Thế kỷ XIII (Đại trùng tu 1647)',
    image: getPagodaImage('chua-but-thap'),
    address: 'Thôn Bút Tháp, Xã Đình Tổ, Thị xã Thuận Thành, Bắc Ninh',
    coordinates: { lat: 21.0642, lng: 106.0389 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+But+Thap+Bac+Ninh',
    shortDesc: 'Kiệt tác kiến trúc cổ vùng Kinh Bắc nổi tiếng với tượng Quán Âm Nghìn Mắt Nghìn Tay.',
    architecturalHighlights: [
      'Tượng Thiên Thủ Thiên Nhãn Quán Thế Âm bằng gỗ phủ sơn tạc năm 1656 — Bảo vật Quốc gia.',
      'Tháp Báo Nghiêm 5 tầng bằng đá trắng hình cây bút vươn lên trời xanh.',
      'Cửu Phẩm Liên Hoa tháp gỗ 9 tầng xoay quanh trục bát giác độc đáo.',
    ],
    history:
      'Được xây dựng từ thời Trần và đại trùng tu quy mô lớn vào thế kỷ XVII dưới sự trụ trì của Thiền sư Chuyết Chuyết và Minh Hành cùng sự hộ trì của Hoàng hậu Trịnh Thị Ngọc Trúc.',
    worshipFocus: 'Quán Thế Âm Thiên Thủ Thiên Nhãn & Cửu Phẩm Liên Hoa',
  },

  // ======================== MIỀN TRUNG (6) ========================
  {
    slug: 'chua-thien-mu',
    name: 'Chùa Thiên Mụ (Linh Mụ Tự)',
    alternateName: 'Đệ Nhất Cổ Tự Cố Đô Huế',
    region: 'Miền Trung',
    province: 'Thừa Thiên Huế',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1601 (Chúa Tiên Nguyễn Hoàng)',
    image: getPagodaImage('chua-thien-mu'),
    address: 'Đồi Hà Khê, Đường Nguyễn Phúc Nguyên, Hương Long, TP. Huế',
    coordinates: { lat: 16.4534, lng: 107.5453 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Thien+Mu+Hue',
    shortDesc: 'Ngôi quốc tự cổ kính bên dòng sông Hương thơ mộng với Tháp Phước Duyên 7 tầng uy nghiêm.',
    architecturalHighlights: [
      'Tháp Phước Duyên hình bát giác 7 tầng cao 21m do vua Thiệu Trị xây năm 1844.',
      'Đại Hồng Chung nặng hơn 2 tấn đúc năm 1710 thời chúa Nguyễn Phúc Chu.',
      'Lưu giữ di vật xe Austin gắn liền với hạnh nguyện Bồ Tát Thích Quảng Đức năm 1963.',
    ],
    history:
      'Khởi lập năm Tân Sửu (1601) bởi Chúa Nguyễn Hoàng theo lời tiên tri của bà lão mặc áo đỏ trên đồi Hà Khê. Suốt hơn 420 năm, tiếng chuông Thiên Mụ luôn là linh hồn của đất thần kinh xứ Huế.',
    worshipFocus: 'Đức Phật Di Lặc, Tam Thế Phật & Đức Phật A Di Đà',
  },
  {
    slug: 'chua-tu-dam',
    name: 'Tổ Đình Từ Đàm',
    alternateName: 'Ấn Tôn Tự',
    region: 'Miền Trung',
    province: 'Thừa Thiên Huế',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1695 (Thiền sư Minh Hoằng Tử Dung)',
    image: getPagodaImage('chua-tu-dam'),
    address: 'Số 1 Sư Liễu Quán, Phường Trường An, TP. Huế',
    coordinates: { lat: 16.4519, lng: 107.5754 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Tu+Dam+Hue',
    shortDesc: 'Tổ đình truyền thừa thiền phái Liễu Quán và cái nôi chấn hưng Phật giáo Việt Nam hiện đại.',
    architecturalHighlights: [
      'Bảo điện truyền thống hài hòa nét kiến trúc cung đình Huế và phong cách Phật giáo nhập thế.',
      'Cây Bồ Đề chiết từ cội Bồ Đề Ấn Độ xanh tốt trước sân Tam Quan.',
      'Hội quán lịch sử nơi khởi nguồn nhiều phong trào văn hóa, giáo dục Phật học.',
    ],
    history:
      'Do Thiền sư Minh Hoằng Tử Dung (Lâm Tế đời thứ 34) lập cuối thế kỷ XVII, nơi Tổ sư Liễu Quán — vị Tổ sư thuần Việt sáng lập Thiền phái Liễu Quán — từng tu học và hoằng pháp.',
    worshipFocus: 'Đức Phật Thích Ca Mâu Ni & Tổ Sư Liễu Quán',
  },
  {
    slug: 'chua-huyen-khong-son-thuong',
    name: 'Chùa Huyền Không Sơn Thượng',
    alternateName: 'Am Thiền Rừng Thông Vạn Tùng Sơn',
    region: 'Miền Trung',
    province: 'Thừa Thiên Huế',
    sect: 'Nam Tông',
    foundingYear: 'Năm 1989 (HT. Giới Đức)',
    image: getPagodaImage('chua-huyen-khong-son-thuong'),
    address: 'Thôn Chầm, Phường Hương Hồ, TP. Huế',
    coordinates: { lat: 16.4328, lng: 107.4795 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Huyen+Khong+Son+Thuong+Hue',
    shortDesc: 'Ngôi chùa Nam Tông ẩn mình giữa rừng thông, hồ sen và không gian thiền vị thanh tịnh.',
    architecturalHighlights: [
      'Chánh điện thoáng đãng bằng gỗ tự nhiên không tường ngăn, chan hòa cùng mây núi.',
      'Rừng thông Vạn Tùng Sơn, Vườn Cỏ Thảo Am và Ngũ Hồ thanh khiết.',
      'Không gian thư pháp, thiền trà và hành thiền kinh hành tĩnh lặng.',
    ],
    history:
      'Được Hòa thượng Thích Giới Đức (Minh Đức Triều Tâm Ảnh) kiến tạo giữa thung lũng núi Chầm năm 1989, mang đậm tinh thần Phật giáo Nguyên Thủy kết hợp thiền vị văn hóa cố đô.',
    worshipFocus: 'Đức Bổn Sư Thích Ca Mâu Ni (Phật giáo Nguyên Thủy Theravada)',
  },
  {
    slug: 'chua-linh-ung-son-tra',
    name: 'Chùa Linh Ứng Bãi Bụt Sơn Trà',
    alternateName: 'Linh Ứng Cổ Tự Đà Nẵng',
    region: 'Miền Trung',
    province: 'Đà Nẵng',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 2004 (Khánh thành 2010)',
    image: getPagodaImage('chua-linh-ung-son-tra'),
    address: 'Bãi Bụt, Bán đảo Sơn Trà, Quận Sơn Trà, TP. Đà Nẵng',
    coordinates: { lat: 16.0998, lng: 108.2775 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Linh+Ung+Son+Tra+Da+Nang',
    shortDesc: 'Tựa sơn hướng hải trên bán đảo Sơn Trà với tôn tượng Quán Thế Âm cao 67m hướng biển Đông.',
    architecturalHighlights: [
      'Tượng Phật Bà Quán Thế Âm cao 67m (bên trong có 17 tầng tháp tôn trí 21 pho tượng Phật).',
      'Vườn tượng Thập Bát La Hán chạm khắc tinh xảo bằng đá Non Nước.',
      'Chánh điện mái ngói lưu ly uy nghi hướng ra vịnh Đà Nẵng bao la.',
    ],
    history:
      'Một trong ba ngôi Linh Ứng Tự nổi tiếng tạo nên thế tam giác tâm linh che chở thành phố Đà Nẵng. Nơi đây là điểm tựa tinh thần cho ngư dân miền Trung mỗi khi ra khơi.',
    worshipFocus: 'Bồ Tát Quán Thế Âm Ngự Tòa Sen Hướng Hải & Thích Ca Mâu Ni',
  },
  {
    slug: 'thien-vien-truc-lam-da-lat',
    name: 'Thiền Viện Trúc Lâm Đà Lạt',
    alternateName: 'Núi Phượng Hoàng bên Hồ Tuyền Lâm',
    region: 'Miền Trung',
    province: 'Lâm Đồng',
    sect: 'Thiền Trúc Lâm',
    foundingYear: 'Năm 1993 - 1994 (HT. Thích Thanh Từ)',
    image: getPagodaImage('thien-vien-truc-lam-da-lat'),
    address: 'Đồi Phượng Hoàng, Phường 3, TP. Đà Lạt, Lâm Đồng',
    coordinates: { lat: 11.9022, lng: 108.4357 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Thien+Vien+Truc+Lam+Da+Lat',
    shortDesc: 'Đại thiền viện thanh u soi bóng xuống hồ Tuyền Lâm giữa đại ngàn thông xanh cao nguyên.',
    architecturalHighlights: [
      'Chánh điện thờ Đức Thích Ca tay cầm cành hoa sen (Niêm hoa vi tiếu).',
      'Khu vườn hoa Đà Lạt bốn mùa thanh nhã và hồ Tĩnh Tâm thanh vắng.',
      'Nội viện Tăng Ni chuyên tu thiền định nghiêm mật theo tông phong Trúc Lâm.',
    ],
    history:
      'Do Thiền sư Thích Thanh Từ khôi phục dòng Thiền Trúc Lâm Yên Tử kiến tạo năm 1993, là nơi hướng dẫn thiền quán và khóa tu tĩnh tâm cho hàng vạn Phật tử mỗi năm.',
    worshipFocus: 'Đức Phật Thích Ca Niêm Hoa Vi Tiếu & Tổ Sư Đạt Ma',
  },
  {
    slug: 'chua-thien-hung',
    name: 'Thiền Viện Thiên Hưng',
    alternateName: 'Ngôi Chùa Tôn Trí Ngọc Xá Lợi Bình Định',
    region: 'Miền Trung',
    province: 'Bình Định',
    sect: 'Bắc Tông',
    foundingYear: 'Thế kỷ XX (Trùng tu khang trang 2013)',
    image: getPagodaImage('chua-thien-hung'),
    address: 'Phường Nhơn Hưng, Thị xã An Nhơn, Tỉnh Bình Định',
    coordinates: { lat: 13.8648, lng: 109.1095 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Thien+Hung+An+Nhon+Binh+Dinh',
    shortDesc: 'Danh lam đất võ nổi bật với tháp Thiên Ứng và kiến trúc Á Đông giao hòa tinh tế.',
    architecturalHighlights: [
      'Bảo tháp Thiên Ứng 12 tầng uy nghi soi bóng xuống hồ nước thanh tịnh.',
      'Quần thể vườn Lâm Tỳ Ni và tượng Phật nhập Niết-Bàn bằng đá trắng điêu khắc tinh tế.',
      'Nơi cung thỉnh Ngọc Xá Lợi Đức Phật Thích Ca Mâu Ni về tôn thờ.',
    ],
    history:
      'Ngôi thiền viện tiêu biểu của miền Trung đất võ Tây Sơn, là điểm hội tụ tu học của Tăng Ni và Phật tử khắp duyên hải Nam Trung Bộ.',
    worshipFocus: 'Ngọc Xá Lợi Phật Thích Ca & Phật Hoàng Trần Nhân Tông',
  },

  // ======================== MIỀN NAM (6) ========================
  {
    slug: 'chua-vinh-nghiem',
    name: 'Chùa Vĩnh Nghiêm TP.HCM',
    alternateName: 'Bảo Tháp Quán Thế Âm 7 Tầng',
    region: 'Miền Nam',
    province: 'TP. Hồ Chí Minh',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1964 - 1971 (HT. Thích Tâm Giác & Thích Thanh Kiểm)',
    image: getPagodaImage('chua-vinh-nghiem'),
    address: '339 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh',
    coordinates: { lat: 10.7918, lng: 106.6828 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Vinh+Nghiem+Quan+3+TPHCM',
    shortDesc: 'Công trình kiến trúc Phật giáo tiêu biểu kết hợp mái chùa cổ truyền miền Bắc và kết cấu hiện đại.',
    architecturalHighlights: [
      'Tháp Quán Thế Âm 7 tầng cao 40m là công trình tháp Phật giáo lớn tại Sài Gòn.',
      'Phù điêu chạm khắc gỗ truyền thống kể lại cuộc đời Đức Phật Thích Ca.',
      'Đại Hồng Chung Nhật Bản tặng nặng 2 tấn ngân vang giữa lòng đô thị.',
    ],
    history:
      'Lấy cảm hứng và đạo hiệu từ Tổ đình Vĩnh Nghiêm (Bắc Giang) thời Trần — nơi xuất thân của Tam Tổ Trúc Lâm — Chùa Vĩnh Nghiêm Sài Gòn là ngôi chùa đầu tiên tại Việt Nam ứng dụng bê tông cốt thép theo dáng cổ tự truyền thống.',
    worshipFocus: 'Đức Bổn Sư Thích Ca, Bồ Tát Văn Thù & Phổ Hiền',
  },
  {
    slug: 'chua-giac-lam',
    name: 'Tổ Đình Giác Lâm',
    alternateName: 'Cẩm Sơn Cổ Tự (Hơn 280 Năm Lịch Sử)',
    region: 'Miền Nam',
    province: 'TP. Hồ Chí Minh',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1744 (Cư sĩ Lý Thụy Long)',
    image: getPagodaImage('chua-giac-lam'),
    address: '565 Lạc Long Quân, Phường 10, Quận Tân Bình, TP. Hồ Chí Minh',
    coordinates: { lat: 10.7785, lng: 106.6458 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Giac+Lam+Tan+Binh+TPHCM',
    shortDesc: 'Ngôi cổ tự lâu đời bậc nhất Sài Gòn — Gia Định với bộ tượng cổ hơn hai thế kỷ.',
    architecturalHighlights: [
      'Kiến trúc chữ Tam (三) truyền thống Nam Bộ với 98 cột gỗ căm xe quý hiếm.',
      'Bảo tồn hơn 113 pho tượng cổ tạc bằng gỗ mít quý từ thế kỷ XVIII - XIX.',
      'Cây Bồ Đề thiêng do Đại đức Narada (Sri Lanka) tặng năm 1953.',
    ],
    history:
      'Khởi lập từ mùa xuân năm Giáp Tý (1744) trên gò Cẩm Sơn. Dưới sự trụ trì của Tổ Viên Quang (1774), nơi đây trở thành trung tâm đào tạo giới đàn và hoằng pháp lớn khắp lục tỉnh Nam Kỳ.',
    worshipFocus: 'Đức Phật A Di Đà, Thập Bát La Hán & Chư Tổ Lâm Tế',
  },
  {
    slug: 'chua-hoang-phap',
    name: 'Chùa Hoằng Pháp',
    alternateName: 'Đạo Tràng Khóa Tu Phật Thất Hóc Môn',
    region: 'Miền Nam',
    province: 'TP. Hồ Chí Minh',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1957 (Cố Hòa thượng Ngộ Chân Tử)',
    image: getPagodaImage('chua-hoang-phap'),
    address: 'Ấp Tân Thới 3, Xã Tân Hiệp, Huyện Hóc Môn, TP. Hồ Chí Minh',
    coordinates: { lat: 10.8926, lng: 106.5882 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Hoang+Phap+Hoc+Mon+TPHCM',
    shortDesc: 'Ngôi già lam nổi tiếng với Khóa Tu Phật Thất, Khóa Tu Mùa Hè và ấn tống kinh sách miễn phí.',
    architecturalHighlights: [
      'Chánh điện hai tầng khang trang chứa hàng ngàn hành giả về tu học mỗi kỳ.',
      'Tòa Pháp Luân, Giảng đường ánh sáng chan hòa cây xanh bóng mát.',
      'Khu vườn Lâm Tỳ Ni thanh tịnh phục vụ các khóa tu thiền hành.',
    ],
    history:
      'Thành lập năm 1957, từ năm 1999 dưới sự hướng dẫn của Thượng tọa Thích Chân Tính, chùa tiên phong tổ chức Khóa tu Một ngày an lạc, Phật Thất và Khóa tu Sinh viên thu hút hàng vạn Phật tử trẻ.',
    worshipFocus: 'Đức Bổn Sư Thích Ca & Tịnh Độ Niệm Phật',
  },
  {
    slug: 'chua-xa-loi',
    name: 'Chùa Xá Lợi',
    alternateName: 'Chứng Tích Lịch Sử Phật Giáo Đô Thị',
    region: 'Miền Nam',
    province: 'TP. Hồ Chí Minh',
    sect: 'Bắc Tông',
    foundingYear: 'Năm 1956 (Hội Phật Học Nam Việt)',
    image: getPagodaImage('chua-xa-loi'),
    address: '89 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    coordinates: { lat: 10.7779, lng: 106.6852 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Xa+Loi+Quan+3+TPHCM',
    shortDesc: 'Nơi tôn trí Ngọc Xá Lợi Đức Phật và lưu dấu phong trào Phật giáo bảo vệ chánh pháp 1963.',
    architecturalHighlights: [
      'Bảo tháp 7 tầng cao 32m — tháp chuông cao nhất chùa nội thành khi khánh thành năm 1961.',
      'Tôn tượng Đức Bổn Sư Thích Ca ngồi thiền trên tòa sen bằng đất sét tẩm sơn vàng.',
      '14 bức tranh khổ lớn minh họa trọn vẹn cuộc đời Đức Phật từ Đản sanh đến Niết-bàn.',
    ],
    history:
      'Khởi công xây dựng năm 1956 nhằm tôn trí Ngọc Xá Lợi Phật Thích Ca và làm trụ sở nghiên cứu Phật học. Chùa Xá Lợi đi vào lịch sử hiện đại như trung tâm đấu tranh ôn hòa vì tự do tín ngưỡng năm 1963.',
    worshipFocus: 'Ngọc Xá Lợi Đức Bổn Sư Thích Ca Mâu Ni',
  },
  {
    slug: 'chua-buu-long',
    name: 'Thiền Viện Tổ Đình Bửu Long',
    alternateName: 'Bảo Tháp Gotama Cetiya',
    region: 'Miền Nam',
    province: 'TP. Hồ Chí Minh',
    sect: 'Nam Tông',
    foundingYear: 'Năm 1942 (Cư sĩ Võ Hà Thuật)',
    image: getPagodaImage('chua-buu-long'),
    address: '81 Nguyễn Xiển, Phường Long Bình, TP. Thủ Đức, TP. Hồ Chí Minh',
    coordinates: { lat: 10.8768, lng: 106.8427 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Buu+Long+Thu+Duc+TPHCM',
    shortDesc: 'Bảo tháp Gotama Cetiya rực rỡ ánh vàng bên hồ Bán Nguyệt — danh thắng Nam Tông thanh tịnh.',
    architecturalHighlights: [
      'Bảo tháp Xá lợi Gotama Cetiya cao 56m mang nét kiến trúc Phật giáo Đông Nam Á hài hòa văn hóa Việt.',
      'Chuông gió đồng ngân vang thanh thoát quanh tháp chính dưới nắng mai.',
      'Hồ nước xanh ngọc soi bóng tháp giữa rừng cây xanh mát ven sông Đồng Nai.',
    ],
    history:
      'Lập từ năm 1942 và chuyển hướng tu học theo truyền thống Phật giáo Nguyên Thủy từ năm 1958 dưới sự hướng dẫn của Hòa thượng Viên Minh.',
    worshipFocus: 'Xá Lợi Đức Phật Thích Ca & Chư Thánh Tăng A La Hán',
  },
  {
    slug: 'chua-ba-den-linh-son',
    name: 'Chùa Bà Đen (Linh Sơn Tiên Thạch Tự)',
    alternateName: 'Ngôi Cổ Tự 300 Năm Trên Đỉnh Núi Bà',
    region: 'Miền Nam',
    province: 'Tây Ninh',
    sect: 'Bắc Tông',
    foundingYear: 'Thế kỷ XVIII (Năm 1745 - Tổ Đạo Trung)',
    image: getPagodaImage('chua-ba-den-linh-son'),
    address: 'Núi Bà Đen, Xã Thạnh Tân, TP. Tây Ninh, Tỉnh Tây Ninh',
    coordinates: { lat: 11.3752, lng: 106.1745 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chua+Linh+Son+Tien+Thach+Nui+Ba+Den+Tay+Ninh',
    shortDesc: 'Ngôi chùa cổ lâu đời bậc nhất đất Tây Ninh tọa lạc trên sườn núi Bà Đen hùng vĩ.',
    architecturalHighlights: [
      'Chánh điện cổ kính tựa vách đá núi cao 350m, hòa quyện hương khói trầm thiêng.',
      'Động Ba Cô, Chùa Hang và quần thể tượng Phật Bà Tây Bổ Đà Sơn cao 72m trên đỉnh núi.',
      'Không gian mây ngàn giao hòa giữa tín ngưỡng Phật giáo Bắc Tông và văn hóa Nam Bộ.',
    ],
    history:
      'Linh Sơn Tiên Thạch Tự hình thành vào giữa thế kỷ XVIII từ am đá nhỏ của Thiền sư Đạo Trung, gắn liền với huyền tích Linh Sơn Thánh Mẫu độ dân qua hàng trăm năm.',
    worshipFocus: 'Đức Phật Thích Ca, Bồ Tát Quán Thế Âm & Linh Sơn Thánh Mẫu',
  },
];

