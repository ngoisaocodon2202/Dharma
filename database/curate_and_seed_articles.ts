import { pool } from '../src/lib/db';

// 1. TÁC GIẢ & GIẢNG SƯ BỔ SUNG ĐỂ BÀI VIẾT ĐẦY ĐỦ TÔN DANH
const AUTHORS = [
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'thichnhathanh@phatphap.vn',
    full_name: 'Thiền sư Thích Nhất Hạnh',
    dharma_name: 'Nhất Hạnh',
    avatar_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80',
    bio: 'Bậc thầy thiền định quốc tế, người sáng lập Làng Mai Pháp quốc và phong trào Phật giáo Dấn thân (Engaged Buddhism).',
    province: 'Thừa Thiên Huế',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'thichphaphoa@phatphap.vn',
    full_name: 'ĐĐ. Thích Pháp Hòa',
    dharma_name: 'Pháp Hòa',
    avatar_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80',
    bio: 'Trụ trì Tu Viện Trúc Lâm & Tây Thiên Canada, giảng sư Phật học với phong cách thuyết giảng hóm hỉnh, sâu sắc và gần gũi.',
    province: 'Hải Ngoại',
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    email: 'thichminhniem@phatphap.vn',
    full_name: 'Thầy Thích Minh Niệm',
    dharma_name: 'Minh Niệm',
    avatar_url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=300&auto=format&fit=crop&q=80',
    bio: 'Tác giả cuốn sách gối đầu giường "Hiểu Về Trái Tim", người sáng lập dòng thiền chữa lành tâm lý và nuôi dưỡng hạnh phúc tự thân.',
    province: 'Lâm Đồng',
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    email: 'thichminhchau@phatphap.vn',
    full_name: 'Trưởng lão HT. Thích Minh Châu',
    dharma_name: 'Minh Châu',
    avatar_url: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=300&auto=format&fit=crop&q=80',
    bio: 'Bậc đại cao tăng dịch giả vĩ đại của Kinh Tạng Nguyên Thủy Pāli (Kinh tạng Nikāya) sang tiếng Việt.',
    province: 'Hà Nội',
  },
];

// 2. 36 BÀI VIẾT PHẬT PHÁP CHỌN LỌC KỸ LƯỠNG (6 CHUYÊN MỤC x 6 BÀI)
const CURATED_ARTICLES = [
  // ==========================================
  // CHUYÊN MỤC 1: GIÁO LÝ CĂN BẢN (10000000-0000-0000-0000-000000000001)
  // ==========================================
  {
    title: 'Tứ Diệu Đế: Bốn Chân Lý Tối Hậu Giúp Nhận Diện Và Chuyển Hóa Khổ Đau',
    slug: 'tu-dieu-de-bon-chan-ly-toi-hau',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000007',
    cover_image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Tứ Diệu Đế không phải là lý thuyết yếm thế, mà là phương pháp chẩn đoán tâm lý vĩ đại giúp con người hiểu rõ gốc rễ của khổ và tìm ra lộ trình an lạc viên mãn.',
    content: `## Cốt Lõi Của Giáo Lý Phật Đà

Tứ Diệu Đế (Cattāri Ariyasaccāni) là bài pháp đầu tiên Đức Phật Thích Ca Mâu Ni thuyết giảng tại Vườn Lộc Uyển (Sarnath) cho năm anh em tôn giả Kiều Trần Như. Đây là nền tảng cốt lõi xuyên suốt toàn bộ kho tàng giáo lý Phật giáo.

Đức Phật hành xử như một vị y vương vĩ đại:
1. **Khổ đế (Dukkha):** Nhận diện căn bệnh — sự bất toại nguyện, sinh, lão, bệnh, tử, và những biến động tâm lý.
2. **Tập đế (Samudaya):** Tìm ra nguyên nhân gây bệnh — đó chính là tham ái (Tanha), sân hận và vô minh chấp ngã.
3. **Diệt đế (Nirodha):** Xác nhận bệnh có thể chữa khỏi hoàn toàn — trạng thái dập tắt phiền não, đạt tới Niết bàn tịch tịnh.
4. **Đạo đế (Magga):** Đơn thuốc chữa lành — chính là Bát Chánh Đạo, con đường thực hành tám nhánh đưa tới giải thoát.

### Thực Hành Trong Đời Sống
Khi gặp phải nghịch cảnh, thay vì than vãn hoặc trốn chạy, hãy can đảm nhìn thẳng vào cảm thọ đau đớn, tự hỏi lòng tham ái hay sự kỳ vọng nào của ta đang chưa được thỏa mãn. Khi hiểu rõ nguyên nhân, tâm sẽ tự nhiên buông xả và bình an.`,
  },
  {
    title: 'Bát Chánh Đạo: Con Đường Tám Nhánh Dẫn Đến Giải Thoát Và An Lạc Tự Tại',
    slug: 'bat-chanh-dao-con-duong-tam-nhanh-giai-thoat',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
    reading_time: 9,
    excerpt: 'Bát Chánh Đạo là kim chỉ nam toàn diện cho lối sống tỉnh thức, kết hợp hài hòa giữa Trí Tuệ (Tuệ), Đạo Đức (Giới) và Định Lực (Định).',
    content: `## Lối Sống Chân Chính Đưa Đến Bình An

Bát Chánh Đạo là con đường trung đạo (Majjhima Patipada) giúp hành giả tránh xa hai cực đoan: đam mê dục lạc thấp hèn và khổ hạnh ép xác tiêu cực.

### Ba Nhóm Tu Tập Cốt Lõi:

1. **Nhóm Tuệ Học (Paññā):**
   - **Chánh Kiến (Sammā-diṭṭhi):** Cái nhìn đúng đắn về nhân quả, duyên khởi, vô thường và vô ngã.
   - **Chánh Tư Duy (Sammā-saṅkappa):** Suy nghĩ hướng thiện, không tham lam, không sân hận và không làm hại muôn loài.

2. **Nhóm Giới Học (Sīla):**
   - **Chánh Ngữ (Sammā-vācā):** Lời nói chân thật, hòa nhã, ái ngữ, đem lại niềm vui và sự hiểu biết.
   - **Chánh Nghiệp (Sammā-kammanta):** Hành động chân chính, tôn trọng mạng sống, bảo vệ tài sản và sự thủy chung.
   - **Chánh Mạng (Sammā-ājīva):** Nuôi sống bản thân bằng nghề nghiệp trong sạch, không tổn hại nhân loại và môi trường.

3. **Nhóm Định Học (Samādhi):**
   - **Chánh Tinh Tấn (Sammā-vāyāma):** Siêng năng ngăn ngừa điều ác chưa sinh, dứt trừ điều ác đã sinh, phát triển điều thiện.
   - **Chánh Niệm (Sammā-sati):** Ý thức trọn vẹn về thân, thọ, tâm, pháp trong từng giây phút hiện tại.
   - **Chánh Định (Sammā-samādhi):** Tâm an định, nhất tâm, không bị phân tán bởi các vọng tưởng bên ngoài.`,
  },
  {
    title: 'Lý Duyên Khởi: Vạn Vật Nương Nhau Mà Sinh Khởi Trong Vũ Trụ',
    slug: 'ly-duyen-khoi-van-vat-tuong-tuc',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Cái này có vì cái kia có, cái này không vì cái kia không. Thấu hiểu Duyên Khởi giúp ta xóa bỏ ranh giới vị kỷ và nuôi dưỡng tình thương muôn loài.',
    content: `## Tuệ Giác Tương Tức (Interbeing)

Đức Phật dạy trong kinh A Hàm:
> "Cái này có thì cái kia có; cái này sinh thì cái kia sinh. Cái này không thì cái kia không; cái này diệt thì cái kia diệt."

Không một hiện tượng nào trong vũ trụ có thể tồn tại độc lập, biệt lập và tự thân. Một bông hoa sen muốn nở rộ cần có bùn lầy, ánh nắng mặt trời, hạt mưa rơi, công người chăm sóc và không khí trong lành. Nếu rút đi ánh sáng hay nước, hoa sen không thể tồn tại.

### Ý Nghĩa Của Duyên Khởi Với Con Người
Khi thấu hiểu lý duyên khởi, ta nhận ra mình không thể hạnh phúc một mình khi những người xung quanh đau khổ. Ta và thế giới là một thể tương tức. Giúp đỡ tha nhân chính là đang nâng đỡ chính bản thân mình.`,
  },
  {
    title: 'Vô Thường & Vô Ngã: Chiếc Chìa Khóa Mở Cánh Cửa Tự Do Tâm Thức',
    slug: 'vo-thuong-vo-nga-chia-khoa-tu-do',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Hiểu được bản chất luôn biến đổi của vạn vật giúp ta không còn bám chấp, đón nhận mọi thăng trầm của đời sống bằng nụ cười thanh thản.',
    content: `## Bình An Trước Vạn Biến

Nhiều người lầm tưởng "Vô thường" (Anicca) là bi quan, nhưng thực chất vô thường chính là điều kiện cho sự sống nảy nở. Nếu hạt bắp không vô thường thì làm sao trở thành cây bắp trĩu hạt? Nếu nỗi buồn không vô thường thì làm sao nụ cười có thể hé nở trở lại?

### Vô Ngã (Anatta) — Không Có Cái Tôi Riêng Biệt
Thân thể ta là sự mượn tạm của bốn đại: đất, nước, gió, lửa. Tâm trí ta là dòng chảy liên tục của các cảm thọ và suy nghĩ. Khi ta bớt bám chặt vào cái gọi là "của tôi", "tôi là nhất", ta sẽ không còn bị tổn thương bởi những lời khen chê thị phi của thế gian.`,
  },
  {
    title: 'Nghiệp Báo & Luật Nhân Quả: Hiểu Để Tự Quyết Định Số Phận Bản Thân',
    slug: 'nghiep-bao-luat-nhan-qua-lam-chu-so-phan',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Nghiệp (Kamma) là hành động có chủ ý. Ta chính là kẻ thừa tự của nghiệp, không ai có thể ban phúc hay giáng họa ngoài chính hành vi của ta.',
    content: `## Gieo Gió Gặt Bão, Gieo Lành Gặt Quả Ngọt

Đức Phật dạy trong kinh Tiểu Nghiệp Phân Biệt:
> "Con người là chủ nhân của nghiệp, là kẻ thừa tự của nghiệp. Nghiệp là thai tạng, nghiệp là quyến thuộc, nghiệp là điểm tựa."

### Ba Cánh Cửa Của Nghiệp:
1. **Thân nghiệp:** Những việc ta làm bằng hành động cụ thể.
2. **Khẩu nghiệp:** Những lời ta nói ra hằng ngày.
3. **Ý nghiệp:** Những suy nghĩ, toan tính và khởi tâm kín đáo. Trong ba điều này, Ý nghiệp là cội nguồn sâu xa nhất chi phối hành động và lời nói.

Khi hiểu về luật nhân quả, ta không oán trời trách đất khi gặp hoạn nạn, mà biết bình tĩnh quán xét, sám hối lỗi lầm và tích cực gieo những hạt giống thiện lành cho tương lai.`,
  },
  {
    title: 'Ngũ Giới Quý Báu: Nền Tảng Đạo Đức Vững Chắc Của Người Phật Tử Tại Gia',
    slug: 'ngu-gioi-quy-bau-nen-tang-dao-duc-tai-gia',
    category_id: '10000000-0000-0000-0000-000000000001',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Năm giới không phải là sự cấm đoán gò bó, mà là năm hàng rào bảo vệ vững chắc giúp giữ gìn hạnh phúc gia đình và sự bình an cho tâm hồn.',
    content: `## Năm Nguyên Tắc Bảo Vệ Sự Sống

1. **Giới thứ nhất: Không sát sinh:** Tôn trọng sự sống, nuôi dưỡng lòng từ bi đối với con người và muôn loài sinh linh.
2. **Giới thứ hai: Không trộm cắp:** Tôn trọng quyền sở hữu của người khác, sống bằng mồ hôi nước mắt chân chính và thực hành bố thí.
3. **Giới thứ ba: Không tà dâm:** Bảo vệ sự thủy chung trong hôn nhân, giữ gìn danh dự và phẩm giá gia đình.
4. **Giới thứ tư: Không nói dối:** Nói lời chân thật, hòa giải, không đâm thọc, không chửi rủa độc địa.
5. **Giới thứ năm: Không uống rượu và chất say:** Giữ gìn sự sáng suốt, tỉnh táo của tâm trí, bảo vệ sức khỏe và an toàn cho cộng đồng.`,
  },

  // ==========================================
  // CHUYÊN MỤC 2: THIỀN QUÁN & CHÁNH NIỆM (10000000-0000-0000-0000-000000000002)
  // ==========================================
  {
    title: 'Quán Niệm Hơi Thở (Anapanasati): Trở Về Với Hòn Đảo Tự Thân',
    slug: 'quan-niem-hoi-tho-anapanasati-tro-ve-tu-than',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Hơi thở là chiếc cầu nối giữa thân và tâm. Khi tâm tán loạn, chỉ cần đưa sự chú ý trở về luồng gió mát nơi đầu mũi, tâm liền an định.',
    content: `## 16 Phép Quán Niệm Hơi Thở Kinh Điển

Trong Kinh Anapanasati Sutta, Đức Phật đã chỉ dẫn tường tận lộ trình thiền định bằng hơi thở từ thô đến tế, chia làm bốn giai đoạn:
1. **Quán Thân trong Thân:** Thở vào biết thở vào, thở ra biết thở ra; thở vào cảm nhận toàn thân, thở ra làm lắng dịu thân hành.
2. **Quán Thọ trong Thọ:** Nhận diện cảm thọ hỷ lạc, an tịnh và làm lắng dịu các cảm thọ khổ đau bức bối.
3. **Quán Tâm trong Tâm:** Nhận biết tâm có tham hay không tham, có sân hay không sân, làm cho tâm hoan hỷ và giải thoát.
4. **Quán Pháp trong Pháp:** Quán chiếu vô thường, xả ly và đoạn diệt phiền não.

### Cách Thực Hành 10 Phút Mỗi Ngày
Hãy ngồi thẳng lưng, thả lỏng bờ vai và cơ mặt. Đặt nhẹ hai bàn tay lên đùi. Không cần ép hơi thở phải dài hay ngắn, chỉ đơn thuần quan sát hơi thở như nó đang là. Khi có suy nghĩ kéo bạn đi, hãy mỉm cười và nhẹ nhàng quay lại với hơi thở.`,
  },
  {
    title: 'Nghệ Thuật Buông Thư Thân Tâm: Trị Liệu Lo Âu Và Căng Thẳng Giữa Đời Thường',
    slug: 'nghe-thuat-buong-thu-than-tam-tri-lieu-lo-au',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Cơ thể chúng ta chứa đựng rất nhiều căng thẳng tích tụ. Thực hành buông thư sâu (Deep Relaxation) giúp từng tế bào được nghỉ ngơi và tự chữa lành.',
    content: `## Cho Phép Bản Thân Được Nghỉ Ngơi

Chúng ta thường bận rộn đến mức quên mất cách nghỉ ngơi thực sự. Ngay cả khi nằm trên giường, tâm trí vẫn chạy đua với những lo âu về ngày mai.

### Bài Thực Hành Buông Thư Toàn Thân (15 Phút):
- Nằm ngửa trên thảm hoặc giường, hai chân mở rộng tự nhiên, hai tay xuôi theo thân.
- Thở vào, đưa sự chú ý lên đỉnh đầu. Thở ra, buông lỏng hoàn toàn da đầu và vầng trán.
- Tiếp tục quét qua đôi mắt, khóe miệng, bờ vai, cánh tay, lồng ngực, lưng và đôi bàn chân.
- Ở mỗi vùng cơ bắp, hãy gửi đến đó một năng lượng biết ơn và cho phép nó được thả lỏng hoàn toàn.
Sau 15 phút, bạn sẽ cảm thấy năng lượng tươi mới tràn ngập thân tâm.`,
  },
  {
    title: 'Thiền Đi Từng Bước Chân An Lạc: Tiếp Xúc Thực Tại Nhiệm Mầu',
    slug: 'thien-di-tung-buoc-chan-an-lac',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Thiền hành không phải là đi để tới đích, mà là đi trong an lạc ở từng bước chân. Đặt bàn chân xuống mặt đất như thể đang hôn lên đất mẹ.',
    content: `## Bước Đi Như Một Người Tự Do

Người đời thường đi như bị ma đuổi, tâm luôn chạy trước thân để vội vã đến một cuộc họp hay một cuộc hẹn. Thiền sư Thích Nhất Hạnh dạy:
> "Phép lạ không phải là đi trên mặt nước hay đi trên than hồng. Phép lạ là đi từng bước trên mặt đất mà lòng tràn đầy an lạc."

### Thực Hành Thiền Hành Hằng Ngày:
- Khi bước chân trái: Thở vào và thầm nói *"Đã về"*.
- Khi bước chân phải: Thở ra và thầm nói *"Đã tới"*.
- Cảm nhận lòng bàn chân tiếp xúc vững chãi với mặt đất. Bạn đang ở đây, bây giờ, tràn đầy sự sống.`,
  },
  {
    title: 'Thiền Trà Tỉnh Thức: Uống Trà Trong Hiện Tại Để Chạm Vào Tĩnh Lặng',
    slug: 'thien-tra-tinh-thuc-uong-tra-cham-tinh-lang',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Chén trà trên tay, mây trôi nước chảy. Nghệ thuật uống trà chánh niệm biến khoảnh khắc bình dị thành giờ phút hội ngộ thiêng liêng với chính mình.',
    content: `## Chén Trà Trong Lòng Bàn Tay

Uống trà trong chánh niệm là một phương pháp thiền định tao nhã và sâu sắc. 

Khi cầm chén trà nóng:
1. **Quan sát:** Nhìn khói trà nghi ngút bốc lên, cảm nhận hơi ấm lan tỏa qua lòng bàn tay.
2. **Khứu giác:** Đưa chén trà lên ngang mũi, hít một hơi thật sâu cảm nhận hương thơm thanh khiết của lá trà non.
3. **Thưởng thức:** Uống từng ngụm nhỏ, để vị đắng chát ban đầu dần chuyển thành hậu ngọt thanh tao nơi cuống họng.

Trong giây phút ấy, không có quá khứ, không có tương lai, chỉ có bạn và chén trà nhiệm mầu.`,
  },
  {
    title: 'Thiết Lập Góc Thiền Tại Nhà: Không Gian Tĩnh Tâm Cho Cả Gia Đình',
    slug: 'thiet-lap-goc-thien-tai-nha',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Một góc thiền nhỏ với bồ đoàn, đóa hoa sen và chuông đồng sẽ là nơi nương tựa bình yên cho mọi thành viên mỗi khi gặp giông bão cuộc đời.',
    content: `## Xây Dựng Ốc Đảo Tâm Linh Giữa Tổ Ấm

Dù ngôi nhà của bạn rộng hay hẹp, chỉ cần một góc nhỏ tĩnh lặng cạnh cửa sổ cũng có thể trở thành "căn phòng thở" mầu nhiệm.

### Các Vật Phẩm Cơ Bản:
- **Tọa cụ và bồ đoàn:** Giúp tư thế ngồi thiền được vững chãi và êm ái.
- **Tôn tượng Phật hoặc hoa tươi:** Tượng trưng cho sự tỉnh thức, từ bi và thanh khiết.
- **Chiếc chuông đồng nhỏ:** Tiếng chuông là tiếng gọi của sự tỉnh thức đưa tâm trở về với hiện tại.

Mỗi tối, dành 10-15 phút cùng người thân ngồi tĩnh lặng bên góc thiền, mọi mâu thuẫn vụn vặt trong ngày sẽ tự nhiên tiêu tan.`,
  },
  {
    title: 'Thiền Quán Về Lòng Từ (Metta Bhavana): Lan Tỏa Yêu Thương Không Điều Kiện',
    slug: 'thien-quan-ve-long-tu-metta-bhavana',
    category_id: '10000000-0000-0000-0000-000000000002',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Tâm từ là phương thuốc chữa lành hữu hiệu nhất cho sân hận. Khi lòng ngập tràn yêu thương, nỗi sợ hãi và hận thù không còn chỗ trú ngụ.',
    content: `## Mở Rộng Trái Tim Đến Vô Biên

Metta Bhavana là pháp thiền nuôi dưỡng lòng từ ái được Đức Phật chỉ dạy trong kinh Metta Sutta:

> "Nguyện cho muôn loài chúng sinh được an vui, hạnh phúc và thoát khỏi mọi hiểm nguy tai ương."

### Lộ Trình Mở Rộng Tâm Từ:
1. Gửi năng lượng thương yêu đến chính bản thân mình (yêu thương bản thân đúng cách).
2. Gửi đến người ta kính trọng và yêu mến (cha mẹ, thầy cô, bạn bè).
3. Gửi đến người bình thường (người xa lạ ta gặp trên đường).
4. Gửi đến người ta cảm thấy khó hòa hợp hoặc đang có hiềm khích.
5. Lan tỏa đến toàn thể muôn loài chúng sinh khắp mười phương.`,
  },

  // ==========================================
  // CHUYÊN MỤC 3: LỜI PHẬT DẠY (10000000-0000-0000-0000-000000000003)
  // ==========================================
  {
    title: 'Tinh Hoa Kinh Pháp Cú: Lời Dạy Về Tâm Ý Làm Chủ Mọi Nghiệp Quả',
    slug: 'tinh-hoa-kinh-phap-cu-tam-y-lam-chu',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000007',
    cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Ý dẫn đầu các pháp, ý làm chủ ý tạo. Những câu kệ vàng ngọc trong Kinh Pháp Cú soi sáng lối đi đạo đức cho ngàn đời nhân loại.',
    content: `## Kệ Pháp Cú Đầu Tiên

Kinh Pháp Cú (Dhammapada) mở đầu bằng hai bài kệ bất hủ:

> "Ý dẫn đầu các pháp,  
> Ý làm chủ, ý tạo;  
> Nếu với ý ô nhiễm,  
> Nói năng hay hành động,  
> Khổ não bước theo sau,  
> Như xe chân vật kéo."

> "Ý dẫn đầu các pháp,  
> Ý làm chủ, ý tạo;  
> Nếu với ý thanh tịnh,  
> Nói năng hay hành động,  
> An lạc bước theo sau,  
> Như bóng không rời hình."

Muốn thay đổi cuộc đời, hãy bắt đầu từ việc gạn lọc tâm ý. Tâm tà vạy ắt gặt tai ương, tâm trong sáng ắt hưởng an lạc viên mãn.`,
  },
  {
    title: 'Phật Dạy Về Đạo Hiếu: Công Cha Nghĩa Mẹ Sâu Dày Hơn Biển Trời',
    slug: 'phat-day-ve-dao-hieu-cong-cha-nghia-me',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Tâm hiếu là tâm Phật, hạnh hiếu là hạnh Phật. Lời dạy sâu sắc trong Kinh Báo Hiếu Phụ Mẫu Trọng Ân nhắc nhở bổn phận thiêng liêng của người làm con.',
    content: `## Ơn Cha Mẹ Khó Đáp Đền

Trong kinh Tăng Chi Bộ, Đức Phật tuyên bố:
> "Có hai hạng người, này các Tỳ-kheo, ta không thể trả ơn cho hết được. Đó là Cha và Mẹ. Dù một vai cõng mẹ, một vai cõng cha trải qua trăm năm, cũng chưa trả được công ơn sinh thành dưỡng dục."

### Cách Báo Hiếu Chân Chính Nhất Theo Đạo Phật:
- **Phụng dưỡng vật chất:** Chăm sóc cơm ăn, áo mặc, thuốc men khi cha mẹ già yếu.
- **An ủi tinh thần:** Lắng nghe, ân cần, nhẫn nhịn và luôn giữ hòa khí gia đình.
- **Báo hiếu tâm linh:** Khuyên cha mẹ biết quy y Tam Bảo, giữ gìn năm giới, niệm Phật và làm việc thiện để gieo nhân giải thoát cho đời sau.`,
  },
  {
    title: 'Lời Phật Dạy Người Cư Sĩ Quản Lý Tài Chính & Thịnh Vượng Chân Chính',
    slug: 'loi-phat-day-nguoi-cu-si-quan-ly-tai-chinh',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Đạo Phật không hề phủ nhận của cải vật chất. Trong Kinh Giáo Thọ Thi-Ca-La-Việt, Đức Phật đã chỉ dẫn công thức phân bổ tài chính thông thái tuyệt vời.',
    content: `## Công Thức Phân Chia Thu Nhập Bốn Phần

Trong Kinh Sigalovada Sutta, Đức Phật khuyên người cư sĩ sau khi làm ra tài sản hợp pháp nên chia làm 4 phần:
1. **Một phần tư (25%):** Dùng cho chi tiêu sinh hoạt hằng ngày của gia đình và phụng dưỡng cha mẹ.
2. **Hai phần tư (50%):** Dùng để tái đầu tư vào công việc làm ăn, sản xuất và kinh doanh chân chính.
3. **Một phần tư (25%):** Dành dụm phòng khi ốm đau, rủi ro bất trắc và trích một phần để làm việc phước thiện, cúng dường Tam Bảo.

Sở hữu tài sản bằng nghề nghiệp chân chính và biết sẻ chia sẽ đem lại sự thịnh vượng bền vững và an lạc tinh thần.`,
  },
  {
    title: 'Nghệ Thuật Tha Thứ: Buông Bỏ Oán Thù Để Tự Cứu Lấy Chính Mình',
    slug: 'nghe-thuat-tha-thu-buong-bo-oan-thu',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Ôm giữ cơn giận cũng giống như uống thuốc độc mà mong người khác chết. Tha thứ cho người khác là món quà lớn nhất ta tặng cho chính mình.',
    content: `## Hận Thù Diệt Hận Thù Là Điều Không Thể Có

Kinh Pháp Cú số 5 dạy:
> "Hận thù diệt hận thù,  
> Đời này không thể có.  
> Từ bi diệt hận thù,  
> Là định luật ngàn thu."

Khi ai đó làm tổn thương ta, họ đang là nạn nhân của sự vô minh và khổ đau trong chính họ. Hiểu được nỗi khổ của họ, lòng trắc ẩn sẽ thay thế sự căm ghét. Tha thứ không có nghĩa là đồng tình với việc làm sai trái, mà là tháo gỡ sợi xích oán thù đang trói chặt trái tim bạn.`,
  },
  {
    title: 'Lời Phật Dạy Về Bốn Người Bạn Tốt & Cách Nhận Diện Bạn Giả Dối',
    slug: 'loi-phat-day-ve-bon-nguoi-ban-tot',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Gần mực thì đen, gần đèn thì rạng. Lời Phật dạy cách chọn bạn tri kỷ đồng hành trên con đường đạo đức và sự nghiệp.',
    content: `## Bốn Hạng Bạn Lành (Thiện Tri Thức)

1. **Bạn giúp đỡ:** Che chở ta khi ta hoạn nạn, bảo vệ tài sản của ta khi ta sơ ý.
2. **Bạn cùng vui cùng khổ:** Chia sẻ những tâm sự thầm kín, không bỏ rơi ta khi ta sa cơ thất thế.
3. **Bạn chỉ đường hướng thiện:** Khuyên ta tránh xa điều ác, khuyến khích ta làm điều lành và chỉ dạy những điều ta chưa biết.
4. **Bạn có lòng trắc ẩn:** Không vui mừng trước thất bại của ta, luôn hoan hỷ khi thấy ta thành công và bảo vệ danh dự cho ta.`,
  },
  {
    title: 'Vượt Qua Nỗi Sợ Hãi Về Sinh Tử: Tuệ Giác Về Bản Chất Bất Diệt',
    slug: 'vuot-qua-noi-so-sinh-tu-tue-giac-bat-diet',
    category_id: '10000000-0000-0000-0000-000000000003',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Đám mây không bao giờ chết, nó chỉ chuyển hóa thành cơn mưa mát lành. Nhìn sâu vào bản chất sinh diệt giúp ta tự tại trước cái chết.',
    content: `## Không Sinh Không Diệt Đừng Sợ Hãi

Trong tác phẩm nổi tiếng "Không Sinh Không Diệt Đừng Sợ Hãi", Thiền sư Thích Nhất Hạnh giải thích tuệ giác Bát Nhã:
> "Sóng biển nhấp nhô lúc lên lúc xuống, nhưng bản chất của sóng chính là nước. Khi sóng nhận ra mình là nước, nó không còn sợ hãi lúc dâng trào hay lúc tan biến."

Chúng ta cũng vậy, cái chết của thể xác chỉ là một sự chuyển tiếp của dòng năng lượng ý thức. Sống trọn vẹn từng ngày trong chánh niệm và yêu thương, ta sẽ mỉm cười thanh thản khi chiếc lá vàng lìa cành.`,
  },

  // ==========================================
  // CHUYÊN MỤC 4: PHẬT GIÁO & ĐỜI SỐNG (10000000-0000-0000-0000-000000000004)
  // ==========================================
  {
    title: 'Hóa Giải Nóng Giận Bằng Ái Ngữ: Bí Quyết Gìn Giữ Hạnh Phúc Hôn Nhân',
    slug: 'hoa-giai-nong-gian-bang-ai-ngu-hon-nhan',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Khi cơn giận bùng lên, im lặng và theo dõi hơi thở là thượng sách. Đừng bao giờ ra quyết định hay nói lời cay độc lúc lửa sân đang bốc cháy.',
    content: `## Nghệ Thuật Ôm Ấp Cơn Giận

Cơn giận giống như một đứa trẻ đang gào khóc. Bạn không thể trừng phạt đứa trẻ mà phải dịu dàng ôm nó vào lòng và hỏi han.

### Ba Câu Nói Thần Diệu Để Hóa Giải Rạn Nứt:
1. *"Em/Anh đang giận, xin hãy cho em/anh một khoảng lặng để tự nhìn lại mình."*
2. *"Em/Anh đang lắng nghe đây, xin hãy nói cho em/anh biết nỗi niềm của anh/em."*
3. *"Em/Anh đã hiểu rồi, em/anh xin lỗi vì những vụng về đã làm anh/em tổn thương."*

Nhờ ái ngữ và lắng nghe sâu sắc, ngôi nhà sẽ luôn là bến đỗ bình yên nhất.`,
  },
  {
    title: 'Đạo Phật Với Stress & Áp Lực Công Sở: Làm Việc Chăm Chỉ Mà Không Lao Lực',
    slug: 'dao-phat-voi-stress-ap-luc-cong-so',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Học cách làm việc với tâm không dính mắc. Đem hết tâm huyết cống hiến cho công việc nhưng không biến sự thành bại thành gánh nặng tâm lý.',
    content: `## Làm Việc Trong Tinh Thần Thiền Định

Áp lực deadline và KPI thường khiến người trẻ kiệt quệ (burnout). Đạo Phật dạy phương pháp "Hành động vô ngã":

- **Tập trung đơn nhiệm (Single-tasking):** Làm việc nào trọn vẹn việc đó, không để đầu óc phân tán bởi mười mối lo cùng lúc.
- **Dừng lại 60 giây sau mỗi giờ làm:** Thả lỏng mắt, thở 3 hơi sâu trước màn hình máy tính.
- **Buông xả khi rời văn phòng:** Bước ra khỏi cửa cơ quan, hãy để công việc lại bàn làm việc, trở về với mái ấm và bữa cơm gia đình trọn vẹn.`,
  },
  {
    title: 'Ứng Xử Tỉnh Thức Khi Bị Gièm Pha, Thị Phi Và Hiểu Lầm',
    slug: 'ung-xu-tinh-thuc-khi-bi-giem-pha-thi-phi',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Khen chê là ngọn gió đời, tâm như núi vững gió lay chẳng màng. Cách người xưa đối diện thị phi bằng sự tĩnh lặng thanh tao.',
    content: `## Tám Ngọn Gió Đời (Bát Phong)

Người đời luôn bị cuốn xoay bởi 8 ngọn gió: Lợi - Hao, Nhục - Vinh, Khen - Chê, Khổ - Vui.
Đức Phật dạy:
> "Như tảng đá kiên cố, không bị gió bão lay chuyển; người trí cũng bất động trước mọi lời khen chê của thế gian."

Khi bị vu oan, im lặng sống trong sạch là câu trả lời hùng hồn nhất. Thời gian và nhân quả sẽ là người phán xét công minh nhất cho sự thật.`,
  },
  {
    title: 'Nuôi Dạy Con Trong Tinh Thần Từ Bi & Tôn Trọng Cá Tính',
    slug: 'nuoi-day-con-trong-tinh-than-tu-bi',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Con cái là những mầm cây cần mảnh đất tình thương màu mỡ, không phải bản sao để cha mẹ áp đặt những kỳ vọng dang dở của mình.',
    content: `## Cha Mẹ Là Tấm Gương Tỉnh Thức

Dạy con không phải bằng lời rao giảng đạo đức sáo rỗng, mà bằng chính cách cha mẹ đối xử với nhau và với mọi người xung quanh:
- Lắng nghe con không phán xét, chấp nhận con với những điểm chưa hoàn hảo.
- Khuyến khích con biết yêu thương động vật, chia sẻ đồ chơi và biết nói lời cảm ơn, xin lỗi chân thành.
- Cho con không gian tự do trải nghiệm và chịu trách nhiệm về hành vi của mình.`,
  },
  {
    title: 'Đạo Phật Và Môi Trường: Lối Sống Xanh, Thuận Tự Nhiên & Hạn Chế Sát Sinh',
    slug: 'dao-phat-va-moi-truong-loi-song-xanh',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Trái đất không phải là tài nguyên vô tận để bóc lột. Lối sống tri túc (biết đủ) và ăn chay là hành động thiết thực bảo vệ hành tinh xanh.',
    content: `## Tình Thương Dành Cho Đất Mẹ

Mỗi bước chân ta đi, mỗi ngụm nước ta uống đều là ân huệ của thiên nhiên. 
- Giảm thiểu rác thải nhựa, tiết kiệm điện nước.
- Thực hành ăn chay định kỳ để giảm lượng khí thải carbon và nuôi dưỡng hạt giống từ bi.
- Sống tri túc: Biết đủ với những nhu cầu căn bản, không chạy theo chủ nghĩa tiêu dùng hoang phí.`,
  },
  {
    title: 'Chữa Lành Đứa Trẻ Bên Trong: Nhìn Sâu Vào Những Tổn Thương Quá Khứ',
    slug: 'chua-lanh-dua-tre-ben-trong-ton-thuong',
    category_id: '10000000-0000-0000-0000-000000000004',
    author_id: '00000000-0000-0000-0000-000000000006',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Bên trong mỗi người trưởng thành luôn có một đứa trẻ 5 tuổi từng bị tổn thương. Hãy quay về lắng nghe và vỗ về đứa trẻ ấy bằng năng lượng chánh niệm.',
    content: `## Trở Về Ôm Lấy Quá Khứ

Nhiều phản ứng giận dữ hay bất an của chúng ta hôm nay bắt nguồn từ những vết thương tuổi thơ chưa được chữa lành:
- Ngồi yên, nhắm mắt và hình dung đứa trẻ năm xưa đang đứng trước mặt bạn.
- Nói với đứa trẻ ấy: *"Ta đã trở về rồi đây, ta đã lớn khôn và đủ sức bảo bọc cho em. Em an toàn rồi."*
Khi hòa giải được với quá khứ, ta mới có thể sống trọn vẹn và an nhiên trong hiện tại.`,
  },

  // ==========================================
  // CHUYÊN MỤC 5: VĂN HÓA & LỊCH SỬ (10000000-0000-0000-0000-000000000005)
  // ==========================================
  {
    title: 'Tinh Thần Nhập Thế Của Thiền Phái Trúc Lâm Thời Trần: Đạo Gắn Liền Với Đời',
    slug: 'tinh-than-nhap-the-thien-phai-truc-lam-thoi-tran',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000001',
    cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    reading_time: 9,
    excerpt: 'Cư trần lạc đạo thả tùy duyên. Đỉnh cao triết học Phật giáo Việt Nam kết hợp hài hòa giữa giải thoát tâm linh và trách nhiệm bảo vệ giang sơn xã tắc.',
    content: `## Đạo Không Tách Rời Khỏi Đời

Thiền phái Trúc Lâm do Phật hoàng Trần Nhân Tông sáng lập là minh chứng rực rỡ nhất cho tinh thần Phật giáo dân tộc Việt Nam:
> "Cư trần lạc đạo thả tùy duyên,  
> Cơ tắc xang hề khốn tắc miên.  
> Gia trung hữu bảo hưu tầm mịch,  
> Đối cảnh vô tâm mạc vấn thiền."

Sống giữa trần tục mà vui với đạo, thuận theo duyên khởi. Trong nhà đã có sẵn viên ngọc báu tự tính, chớ nhọc công tìm kiếm bên ngoài.`,
  },
  {
    title: 'Nét Đẹp Độc Đáo Của Kiến Trúc Chùa Cổ Bắc Bộ: Mái Đao Cong & Gỗ Lim Mộc Mạc',
    slug: 'kien-truc-chua-co-bac-bo-mai-dao-cong',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000001',
    cover_image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Chùa Việt Nam không vươn cao chọc trời mà nép mình khiêm cung dưới bóng đa, bến nước, hòa quyện tuyệt mỹ với thiên nhiên làng quê thanh bình.',
    content: `## Nét Duyên Mộc Mạc Cổ Truyền

Kiến trúc chùa cổ miền Bắc nổi bật với cấu trúc vì kèo gỗ lim vững chãi, mái ngói vảy rồng cong vút như cánh chim hạ cánh, nền gạch Bát Tràng ấm áp. Mỗi chi tiết chạm khắc hoa sen, mây nước, rồng phượng đều gửi gắm ước nguyện mưa thuận gió hòa và thái bình thịnh trị.`,
  },
  {
    title: 'Ý Nghĩa Tiếng Chuông Chùa: Âm Thanh Thức Tỉnh Lương Tri Nhân Loại',
    slug: 'y-nghia-tieng-chuong-chua-thuc-tinh-luong-tri',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000005',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Nghe chuông phiền não tan mây khói, ý lặng thân an miệng mỉm cười. Văn hóa thỉnh chuông Đại hồng chung ngân vang giữa sớm mai thanh tịnh.',
    content: `## Tiếng Chuông Vọng Cõi U Minh

Mỗi sớm mai và chiều tà, tiếng chuông chùa ngân vang mang thông điệp từ bi giải thoát:
> "Nghe tiếng chuông lòng nhẹ tưng bừng,  
> Bến giác mê đồ bỗng tỉnh bừng.  
> Nguyện dứt oan khiên tiêu nghiệp chướng,  
> Mười phương pháp giới ngập lòng xuân."

Khi nghe tiếng chuông, người con Phật thường dừng lại mọi hoạt động, hít một hơi thở thật sâu để đưa tâm về với thân.`,
  },
  {
    title: 'Ý Nghĩa Chiếc Áo Lam & Y Hoại Sắc Trong Đời Sống Phật Tử',
    slug: 'y-nghia-chiec-ao-lam-va-y-hoai-sac',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000002',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Màu lam bình dị biểu trưng cho sự nhẫn nhục, hòa đồng và khiêm nhường. Chiếc áo nhắc nhở người mặc sống giản dị và bao dung.',
    content: `## Sắc Áo Của Sự Khiêm Hạ

Màu áo lam không sặc sỡ, không phân biệt giàu nghèo. Khi khoác lên mình chiếc áo lam, mọi Phật tử đều bình đẳng trước Tam Bảo, cùng một chí hướng tu học đoạn trừ phiền não và lan tỏa tình thương.`,
  },
  {
    title: 'Lịch Sử Du Nhập Phật Giáo Vào Việt Nam: Từ Trung Tâm Luy Lâu Đến Thời Lý - Trần',
    slug: 'lich-su-du-nhap-phat-giao-viet-nam-luy-lau',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000001',
    cover_image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&auto=format&fit=crop&q=80',
    reading_time: 9,
    excerpt: 'Phật giáo truyền trực tiếp từ Ấn Độ sang Việt Nam qua đường biển từ thế kỷ thứ nhất TCN, hình thành trung tâm Phật giáo Luy Lâu sầm uất trước cả Trung Hoa.',
    content: `## Dòng Chảy Tâm Linh Ngàn Năm Văn Hiến

Trung tâm Luy Lâu (Bắc Ninh ngày nay) từng đón nhận các bậc cao tăng Ấn Độ như Khương Tăng Hội, Ma Ha Kỳ Vực. Trải qua thời Lý - Trần, Phật giáo trở thành quốc giáo, đồng hành cùng sự thịnh vượng và tự chủ của dân tộc Đại Việt.`,
  },
  {
    title: 'Biểu Tượng Hoa Sen Trong Mỹ Thuật Phật Giáo: Gần Bùn Mà Chẳng Hôi Tanh Mùi Bùn',
    slug: 'bieu-tuong-hoa-sen-trong-my-thuat-phat-giao',
    category_id: '10000000-0000-0000-0000-000000000005',
    author_id: '00000000-0000-0000-0000-000000000007',
    cover_image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Hoa sen tượng trưng cho Phật tính thanh khiết vốn có trong mỗi con người, dù sinh ra giữa bùn lầy ngũ dục vẫn tỏa ngát hương thơm tinh khiết.',
    content: `## Tám Đặc Tính Tuyệt Vời Của Hoa Sen

Hoa sen hội tụ 8 đặc tính cao quý: Trừng thanh (lọc trong nước), Hành trực (thân ngay thẳng), Khiết tịnh (không dính bùn hôi), Hướng thượng (luôn vươn lên đón ánh sáng), Bồng thực (hoa và quả đồng thời xuất hiện),... biểu trưng cho quả vị giác ngộ viên mãn.`,
  },

  // ==========================================
  // CHUYÊN MỤC 6: TẤM GƯƠNG TU HỌC (10000000-0000-0000-0000-000000000006)
  // ==========================================
  {
    title: 'Cuộc Đời & Di Sản Hòa Bình Của Thiền Sư Thích Nhất Hạnh',
    slug: 'cuoc-doi-di-san-thien-su-thich-nhat-hanh',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000004',
    cover_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&auto=format&fit=crop&q=80',
    reading_time: 10,
    excerpt: 'Hành trình phụng sự không mệt mỏi của bậc thiền sư mang tuệ giác chánh niệm phương Đông hòa nhập vào dòng chảy văn minh toàn cầu.',
    content: `## Sứ Giả Của Hòa Bình Và Tỉnh Thức

Thiền sư Thích Nhất Hạnh (1926 - 2022) được mục sư Martin Luther King đề cử giải Nobel Hòa bình năm 1967. Thầy đã để lại kho tàng hơn 100 đầu sách kinh điển, hàng trăm bài thực tập chánh niệm nuôi dưỡng tâm hồn hàng triệu độc giả trên khắp năm châu.`,
  },
  {
    title: 'Phật Hoàng Trần Nhân Tông: Từ Đấng Minh Quân Đến Tổ Sư Non Yên Tử',
    slug: 'phat-hoang-tran-nhan-tong-tu-minh-quan-den-to-su',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000001',
    cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    reading_time: 9,
    excerpt: 'Rũ bỏ ngai vàng quyền quý khi đang ở đỉnh cao vinh quang để lên chốn rừng thiêng Yên Tử khoác áo nâu sồng tìm cầu chân lý giải thoát.',
    content: `## Tấm Gương Buông Bỏ Vĩ Đại

Sau hai lần lãnh đạo quân dân Đại Việt đánh tan giặc Nguyên Mông xâm lược, vua Trần Nhân Tông nhường ngôi cho con và xuất gia tu hành tại non Yên Tử, lập nên Thiền phái Trúc Lâm - một dòng thiền thuần Việt rạng rỡ non sông.`,
  },
  {
    title: 'Bồ Tát Thích Quảng Đức & Trái Tim Bất Diệt Ngọn Lửa Từ Bi',
    slug: 'bo-tat-thich-quang-duc-trai-tim-bat-diet',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000001',
    cover_image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=80',
    reading_time: 8,
    excerpt: 'Ngọn lửa vị pháp thiêu thân năm 1963 để lại quả tim bất diệt rung động lương tri toàn cầu, minh chứng cho tinh thần từ bi vô úy của đạo Phật.',
    content: `## Ngọn Lửa Chấn Động Địa Cầu

Ngày 11/6/1963, Hòa thượng Thích Quảng Đức tự thiêu tại ngã tư Phan Đình Phùng - Lê Văn Duyệt (Sài Gòn) để đòi quyền bình đẳng tôn giáo. Trong biển lửa ngút trời, ngài vẫn ngồi kiết già tĩnh lặng, để lại quả tim xá lợi bất hoại biểu trưng cho sức mạnh đại từ đại bi.`,
  },
  {
    title: 'Tấm Gương Cư Sĩ Tâm Minh Lê Đình Thám & Phong Trào Chấn Hưng Phật Giáo',
    slug: 'cu-si-tam-minh-le-dinh-tham-chan-hung-phat-giao',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000007',
    cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Một vị bác sĩ y khoa đem cả cuộc đời dịch kinh, thành lập Gia đình Phật tử Việt Nam và đào tạo thế hệ thanh thiếu niên phụng sự đạo pháp.',
    content: `## Trí Thức Tại Gia Cống Hiến Vì Chánh Pháp

Bác sĩ Tâm Minh Lê Đình Thám (1897 - 1969) là linh hồn của phong trào chấn hưng Phật giáo miền Trung thế kỷ 20. Ngài sáng lập tạp chí Viên Âm, phiên dịch bộ Kinh Lăng Nghiêm đồ sộ và đặt nền móng cho tổ chức Gia đình Phật tử Việt Nam.`,
  },
  {
    title: 'Chuyện Chuyển Hóa Của Một Doanh Nhân: Từ Tranh Đua Đến Tìm Lại Chính Mình',
    slug: 'chuyen-chuyen-hoa-cua-doanh-nhan-tim-lai-chinh-minh',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000003',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
    reading_time: 7,
    excerpt: 'Khi tài khoản ngân hàng đầy ắp nhưng tâm hồn trống rỗng và đổ vỡ, khóa tu 7 ngày im lặng đã mở ra bước ngoặt tái sinh kỳ diệu.',
    content: `## Hạnh Phúc Thật Sự Không Nằm Ở Con Số

Câu chuyện người thật việc thật về một giám đốc doanh nghiệp từng lao vào kiếm tiền đến mức kiệt quệ sức khỏe và suýt tan vỡ hôn nhân. Nhờ duyên lành đến với một khóa thiền Vipassana, anh nhận ra giá trị của sự biết đủ và bắt đầu xây dựng mô hình doanh nghiệp hạnh phúc, yêu thương nhân viên.`,
  },
  {
    title: 'Nụ Cười An Nhiên Của Người Mẹ Già Vượt Qua Bạo Bệnh Nhờ Niệm Phật',
    slug: 'nu-cuoi-an-nhien-nguoi-me-gia-niem-phat',
    category_id: '10000000-0000-0000-0000-000000000006',
    author_id: '00000000-0000-0000-0000-000000000003',
    cover_image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=80',
    reading_time: 6,
    excerpt: 'Giữa những cơn đau co thắt của bệnh tật tuổi xế chiều, câu niệm Phật A Di Đà đã trở thành liều thuốc an thần kỳ diệu đem lại nụ cười thanh thoát.',
    content: `## Sức Mạnh Của Niềm Tin Tâm Linh

Lời chia sẻ chân tình về người mẹ 78 tuổi đối diện với căn bệnh hiểm nghèo. Thay vì sợ hãi oán thán, bà dành trọn thời gian lần chuỗi niệm Phật và hồi hướng công đức cho con cháu. Tâm an thì thân bớt đau, sự thanh thản của bà đã truyền cảm hứng sống đẹp cho cả đại gia đình.`,
  },
];

async function run() {
  console.log('=== BẮT ĐẦU NÂNG CẤP DỮ LIỆU BÀI VIẾT, HÌNH ẢNH & VIDEO ===');

  // 1. Thêm Authors nếu chưa có
  for (const a of AUTHORS) {
    await pool.query(
      `INSERT INTO users (id, email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, '$2a$10$n94aB0yHw4K7E7iV5V5g.OaA.9rZ9eW6LgQ5hV2A2B3C4D5E6F7G8', 'VERIFIED_CONTRIBUTOR', true, true)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.email]
    );

    await pool.query(
      `INSERT INTO profiles (user_id, full_name, dharma_name, avatar_url, bio, province)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         dharma_name = EXCLUDED.dharma_name,
         avatar_url = EXCLUDED.avatar_url,
         bio = EXCLUDED.bio,
         province = EXCLUDED.province`,
      [a.id, a.full_name, a.dharma_name, a.avatar_url, a.bio, a.province]
    );
  }
  console.log('✓ Đã cập nhật thông tin Chư Tôn Giảng Sư & Tác Giả Uy Tín!');

  // 2. Cập nhật 3 bài viết cũ (loại bỏ ảnh bãi biển)
  await pool.query(`
    UPDATE articles 
    SET cover_image = 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=85'
    WHERE slug = 'an-tru-trong-hien-tai-nghe-thuat-buong-thu';
  `);
  await pool.query(`
    UPDATE articles 
    SET cover_image = 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1000&auto=format&fit=crop&q=85'
    WHERE slug = 'hieu-ve-tu-dieu-de-bon-su-that-mau-nhiem';
  `);
  await pool.query(`
    UPDATE articles 
    SET cover_image = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&auto=format&fit=crop&q=85'
    WHERE slug = 'nuoi-duong-tu-bi-trong-giao-tiep-ai-ngu';
  `);
  console.log('✓ Đã sửa ảnh bìa các bài viết cũ sang ảnh Phật giáo thanh tịnh!');

  // 3. Nạp 36 bài viết tuyển chọn
  let insertedCount = 0;
  for (const art of CURATED_ARTICLES) {
    const res = await pool.query(
      `INSERT INTO articles (title, slug, excerpt, content, cover_image, author_id, category_id, reading_time_minutes, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PUBLISHED', CURRENT_TIMESTAMP)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         cover_image = EXCLUDED.cover_image,
         author_id = EXCLUDED.author_id,
         category_id = EXCLUDED.category_id,
         reading_time_minutes = EXCLUDED.reading_time_minutes,
         status = 'PUBLISHED'
       RETURNING id`,
      [
        art.title,
        art.slug,
        art.excerpt,
        art.content,
        art.cover_image,
        art.author_id,
        art.category_id,
        art.reading_time,
      ]
    );
    if (res.rowCount && res.rowCount > 0) insertedCount++;
  }
  console.log(`✓ Đã nạp thành công ${insertedCount} bài viết Phật Pháp tuyển chọn sâu sắc vào CSDL!`);

  // 4. Cập nhật các Video trong CSDL: XÓA CHỮ 4K / FLYCAM 4K / DRONE 4K
  await pool.query(`
    UPDATE videos
    SET title = 'Chiêm Bái Toàn Cảnh Quần Thể Danh Thắng Chùa Tam Chúc | Non Nước Hữu Tình',
        description = 'Thước phim tư liệu toàn cảnh ghi lại không gian danh thắng chùa Tam Chúc giữa hồ Lục Nhạc và dãy núi Thất Tinh, cùng kiến trúc Điện Tam Thế tráng lệ bậc nhất Việt Nam.'
    WHERE id = '70000000-0000-0000-0000-000000000006' OR title LIKE '%Tam Chúc%4K%';
  `);

  await pool.query(`
    UPDATE videos
    SET title = 'Bái Đính Cổ Tự - Vẻ Đẹp Linh Thiêng Huyền Bí Nơi Đất Cố Đô Tràng An',
        description = 'Hành trình chiêm bái Chùa Bái Đính Ninh Bình, chiêm ngưỡng hành lang La Hán đá xanh dài nhất châu Á và tiếng chuông đồng vang vọng giữa đất trời Tràng An thanh tịnh.'
    WHERE id = '70000000-0000-0000-0000-000000000007' OR title LIKE '%Bái Đính%4K%';
  `);
  console.log('✓ Đã cập nhật các Video trong Database, loại bỏ hoàn toàn các chữ 4K và Flycam!');

  // 5. Cập nhật cover_image của các Chùa trong CSDL
  await pool.query(`
    UPDATE temples
    SET cover_image = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&auto=format&fit=crop&q=85'
    WHERE slug = 'chua-mot-cot-ha-noi';
  `);
  await pool.query(`
    UPDATE temples
    SET cover_image = 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1600&auto=format&fit=crop&q=85'
    WHERE slug = 'chua-long-son-khanh-hoa';
  `);
  await pool.query(`
    UPDATE temples
    SET cover_image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85'
    WHERE slug = 'bo-de-dao-trang-bodh-gaya';
  `);
  await pool.query(`
    UPDATE temples
    SET cover_image = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&auto=format&fit=crop&q=85'
    WHERE slug = 'chua-hoang-phap-tp-hcm';
  `);
  console.log('✓ Đã cập nhật ảnh danh lam cổ tự chuẩn Phật giáo trong Database!');

  // 6. Cập nhật ảnh Sách kinh điển & Âm thanh
  await pool.query(`
    UPDATE books
    SET cover_image = 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80'
    WHERE id = '90000000-0000-0000-0000-000000000001';
  `);
  await pool.query(`
    UPDATE books
    SET cover_image = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
    WHERE id = '90000000-0000-0000-0000-000000000002';
  `);
  await pool.query(`
    UPDATE audio
    SET cover_image = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80'
    WHERE cover_image LIKE '%1507525428034%' OR cover_image LIKE '%1518241353330%';
  `);
  console.log('✓ Đã cập nhật ảnh sách kinh điển và pháp âm thanh tịnh!');

  // 7. Thống kê bài viết sau khi nạp
  const totalArt = await pool.query('SELECT count(*) FROM articles WHERE status = \'PUBLISHED\'');
  console.log(`=== HOÀN TẤT: Hiện có ${totalArt.rows[0].count} bài viết đã xuất bản trong hệ thống! ===`);

  await pool.end();
}

run().catch((err) => {
  console.error('Lỗi khi nạp dữ liệu bài viết:', err);
  process.exit(1);
});
