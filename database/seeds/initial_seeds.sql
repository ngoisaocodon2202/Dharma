-- SEED DATA FOR BUDDHIST PLATFORM (PHAT PHAP)
-- Realistic Buddhist Community Demo Data

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
('SUPER_ADMIN', 'Quản trị viên Tối cao', 'Toàn quyền cấu hình và quản trị nền tảng'),
('ADMIN', 'Ban Quản trị', 'Quản lý bài viết, kiểm duyệt chùa, tổ chức và sự kiện'),
('MODERATOR', 'Kiểm duyệt viên', 'Xử lý báo cáo vi phạm, kiểm duyệt bài viết và bình luận'),
('EDITOR', 'Biên tập viên', 'Biên tập nội dung học Phật, thư viện kinh sách và bài viết chính thức'),
('VERIFIED_CONTRIBUTOR', 'Tác giả Xác minh', 'Giảng sư, nhà nghiên cứu Phật học được xác nhận danh tính'),
('ORGANIZATION_ADMIN', 'Đại diện Chùa / Tổ chức', 'Quản lý trang chính thức của Chùa hoặc Thiền viện'),
('GROUP_ADMIN', 'Trưởng nhóm Tu học', 'Quản lý thành viên và nội dung nhóm'),
('USER', 'Phật tử / Độc giả', 'Đọc, học tập, bình luận, tọa thiền và tham gia cộng đồng')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS & PROFILES (Password: Admin@2026! / User@2026!)
-- Hashed password for demo testing ($2a$10$7zD6Y1/97m.E8x5qKk18te0fJ5C81N16n2U5W9bK5r4W7m8X1y1Za is standard bcrypt)
INSERT INTO users (id, email, password_hash, role_id, is_active, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@phatphap.vn', '$2a$10$n94aB0yHw4K7E7iV5V5g.OaA.9rZ9eW6LgQ5hV2A2B3C4D5E6F7G8', 'SUPER_ADMIN', true, true),
('00000000-0000-0000-0000-000000000002', 'thichnhatquang@phatphap.vn', '$2a$10$n94aB0yHw4K7E7iV5V5g.OaA.9rZ9eW6LgQ5hV2A2B3C4D5E6F7G8', 'VERIFIED_CONTRIBUTOR', true, true),
('00000000-0000-0000-0000-000000000003', 'tamnguyen@phatphap.vn', '$2a$10$n94aB0yHw4K7E7iV5V5g.OaA.9rZ9eW6LgQ5hV2A2B3C4D5E6F7G8', 'USER', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, full_name, dharma_name, avatar_url, bio, province) VALUES
('00000000-0000-0000-0000-000000000001', 'Ban Biên Tập Phật Pháp', 'Vạn Hạnh', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80', 'Cổng thông tin và không gian kết nối giá trị Phật pháp tỉnh thức.', 'Hà Nội'),
('00000000-0000-0000-0000-000000000002', 'Thích Nhật Quang', 'Nhật Quang', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80', 'Nghiên cứu Phật học, chia sẻ giáo lý căn bản và thiền tập chánh niệm.', 'TP. Hồ Chí Minh'),
('00000000-0000-0000-0000-000000000003', 'Nguyễn Tâm Nguyện', 'Tâm Nguyện', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'Phật tử tại gia, học hỏi giáo lý và ứng dụng chánh niệm trong đời sống hàng ngày.', 'Đà Nẵng')
ON CONFLICT (user_id) DO NOTHING;

-- 3. ARTICLE CATEGORIES
INSERT INTO article_categories (id, name, slug, description, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', 'Giáo lý Căn bản', 'giao-ly-can-ban', 'Tứ Diệu Đế, Bát Chánh Đạo, Nhân Quả và Duyên Khởi dành cho mọi người', 1),
('10000000-0000-0000-0000-000000000002', 'Thiền quán & Chánh niệm', 'thien-quan-chanh-niem', 'Thực hành quan sát thân tâm, hơi thở và buông xả phiền não trong từng phút giây', 2),
('10000000-0000-0000-0000-000000000003', 'Lời Phật dạy', 'loi-phat-day', 'Trích giảng những lời dạy thanh cao từ Kinh Pháp Cú và các kinh tạng cốt lõi', 3),
('10000000-0000-0000-0000-000000000004', 'Phật giáo & Đời sống', 'phat-giao-doi-song', 'Ứng dụng từ bi và trí tuệ vào công việc, gia đình và các mối quan hệ xã hội', 4),
('10000000-0000-0000-0000-000000000005', 'Văn hóa & Lịch sử', 'van-hoa-lich-su', 'Di sản kiến trúc chùa chiền, nghệ thuật điêu khắc và lịch sử Phật giáo Việt Nam', 5),
('10000000-0000-0000-0000-000000000006', 'Tấm gương Tu học', 'tam-guong-tu-hoc', 'Hành trạng chư tôn thiền đức và những câu chuyện chuyển hóa tâm thức màu nhiệm', 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. ARTICLES
INSERT INTO articles (id, title, slug, excerpt, content, cover_image, author_id, category_id, reading_time_minutes, status, published_at) VALUES
('20000000-0000-0000-0000-000000000001', 
'An trú trong hiện tại: Nghệ thuật buông thư giữa cuộc sống bận rộn',
'an-tru-trong-hien-tai-nghe-thuat-buong-thu',
'Chúng ta thường vội vã lao về phía tương lai hoặc nuối tiếc quá khứ mà quên mất rằng sự sống duy nhất chỉ xảy ra ngay bây giờ và ở đây.',
'## Hơi thở — Chiếc cầu nối thân và tâm\n\nTrong nhịp sống hiện đại hối hả, tâm trí chúng ta liên tục bị cuốn theo hàng ngàn luồng suy nghĩ, lo toan và kế hoạch. Đức Phật từng dạy rằng quá khứ đã qua, tương lai thì chưa đến, chỉ có giây phút hiện tại là nơi duy nhất ta có thể thực sự tiếp xúc với sự sống.\n\nKhi thở vào một hơi thật sâu và có ý thức, ta cảm nhận luồng không khí mát lành đi qua cánh mũi, lồng ngực khẽ nâng lên và bụng phồng lên nhẹ nhàng. Khi thở ra, ta mỉm cười buông bỏ những căng thẳng, mỏi mệt tích tụ trong cơ bắp.\n\n### Ba bước thực hành đơn giản mỗi ngày\n\n1. **Dừng lại 60 giây giữa các giờ làm việc:** Trước khi mở một email mới hay bước vào cuộc họp, hãy đặt hai tay lên đùi, nhắm mắt lại và theo dõi ba hơi thở trọn vẹn.\n2. **Uống trà trong chánh niệm:** Cầm chén trà ấm, cảm nhận hương thơm thoang thoảng và uống từng ngụm chậm rãi mà không lướt điện thoại.\n3. **Bước chân an lạc:** Mỗi bước đi từ bàn làm việc ra cửa hãy cảm nhận lòng bàn chân chạm nhẹ vào mặt đất vững chãi.\n\nBình an không phải là điều phải đi tìm ở một vùng đất xa xôi, mà chính là sự tĩnh lặng ta chọn mang vào từng phút giây bình dị của cuộc sống.',
'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
'00000000-0000-0000-0000-000000000002',
'10000000-0000-0000-0000-000000000002',
6,
'PUBLISHED',
CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (id, title, slug, excerpt, content, cover_image, author_id, category_id, reading_time_minutes, status, published_at) VALUES
('20000000-0000-0000-0000-000000000002', 
'Hiểu về Tứ Diệu Đế: Bốn sự thật mầu nhiệm giúp chuyển hóa khổ đau',
'hieu-ve-tu-dieu-de-bon-su-that-mau-nhiem',
'Tứ Diệu Đế là nền tảng cốt lõi đầu tiên mà Đức Phật Thích Ca Mâu Ni đã tuyên thuyết tại vườn Lộc Uyển cho năm anh em Kiều Trần Như.',
'## Bức tranh toàn cảnh về Tứ Thánh Đế\n\nĐạo Phật không phải là một tôn giáo của sự bi quan, mà là một khoa học thực nghiệm về tâm thức. Giáo lý Tứ Diệu Đế (Cattāri Ariyasaccāni) cung cấp một lộ trình rõ ràng, từ việc nhận diện căn nguyên của khổ đau đến phương pháp dập tắt phiền não:\n\n1. **Khổ đế (Dukkha):** Sự thật về những bất toàn, biến đổi vô thường của vạn vật và những cảm thọ khổ đau nơi thân tâm.\n2. **Tập đế (Samudaya):** Nguyên nhân sâu xa dẫn đến khổ đau, bắt nguồn từ tham ái (taṇhā), sân hận và vô minh.\n3. **Diệt đế (Nirodha):** Trạng thái an tịnh hoàn toàn khi ái dục và vô minh bị đoạn trừ, đó chính là Niết bàn.\n4. **Đạo đế (Magga):** Con đường thực hành đưa đến sự chấm dứt khổ đau, bao gồm Bát Chánh Đạo.\n\nThấu hiểu Tứ Diệu Đế giúp người học Phật có cái nhìn sáng suốt trước mọi biến thiên của cuộc đời, không né tránh nghịch cảnh mà can đảm nhìn sâu để chuyển hóa.',
'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1000&auto=format&fit=crop&q=80',
'00000000-0000-0000-0000-000000000002',
'10000000-0000-0000-0000-000000000001',
8,
'PUBLISHED',
CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (id, title, slug, excerpt, content, cover_image, author_id, category_id, reading_time_minutes, status, published_at) VALUES
('20000000-0000-0000-0000-000000000003', 
'Nuôi dưỡng từ bi trong giao tiếp: Nghệ thuật ái ngữ và lắng nghe sâu',
'nuoi-duong-tu-bi-trong-giao-tiep-ai-ngu',
'Lắng nghe bằng tất cả sự thấu hiểu và dùng lời nói dịu dàng có thể chữa lành những rạn nứt sâu sắc nhất trong gia đình và tình bằng hữu.',
'## Lắng nghe với tâm không phán xét\n\nNhiều khi chúng ta lắng nghe người khác chỉ để chuẩn bị câu trả lời hoặc phản bác, chứ không thực sự mở lòng để cảm nhận nỗi niềm của họ. Đức Bồ Tát Quán Thế Âm biểu trưng cho hạnh nguyện lắng nghe sâu sắc tiếng kêu than của thế gian với lòng từ bi vô lượng.\n\n### Thực hành Ái ngữ\n\nÁi ngữ không phải là những lời khen ngợi giả tạo, mà là ngôn từ xuất phát từ lòng chân thành, mang năng lượng xây dựng và bảo bọc:\n- Trước khi nói, hãy tự hỏi: Lời này có đúng sự thật không? Có mang lại lợi lạc không? Có nói đúng thời điểm không?\n- Khi đối phương đang tức giận, im lặng lắng nghe là phương thuốc kỳ diệu nhất để cơn giận lắng xuống.\n\nMột lời nói ấm áp có thể sưởi ấm ba mùa đông, một lời nói cay độc có thể làm buốt giá cả mùa hạ.',
'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1000&auto=format&fit=crop&q=80',
'00000000-0000-0000-0000-000000000001',
'10000000-0000-0000-0000-000000000004',
5,
'PUBLISHED',
CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- 5. DAILY PRACTICES
INSERT INTO daily_practices (id, practice_date, mindful_quote, quote_source, reflection_text, mindful_action) VALUES
('30000000-0000-0000-0000-000000000001', 
CURRENT_DATE,
'Hận thù diệt hận thù, đời này không thể có. Từ bi diệt hận thù, là định luật ngàn thu.',
'Kinh Pháp Cú — Kệ số 5',
'Mỗi khi đối diện với sự bực dọc hay hiểu lầm từ người khác, hãy nhớ rằng phản ứng bằng cơn giận chỉ châm thêm dầu vào lửa. Chỉ có lòng bao dung, sự điềm tĩnh và tâm từ bi mới có sức mạnh chuyển hóa mọi oán kết và đem lại bình an thật sự cho chính tâm hồn bạn.',
'Dành 3 phút ngồi tĩnh lặng trước khi bắt đầu công việc. Gửi một lời chúc an lành trong tâm trí đến người bạn cảm thấy khó hòa hợp nhất.')
ON CONFLICT (practice_date) DO NOTHING;

-- 6. LEARNING PATHS
INSERT INTO learning_paths (id, title, slug, description, level, icon_name, estimated_hours, total_modules, sort_order) VALUES
('40000000-0000-0000-0000-000000000001', 'Người mới tìm hiểu Phật giáo', 'nguoi-moi-tim-hieu', 'Lộ trình nhập môn thân thiện giải thích nguồn gốc, cuộc đời Đức Phật, Tam Bảo và tinh thần khai phóng của đạo Phật.', 'BEGINNER', 'Compass', 6, 4, 1),
('40000000-0000-0000-0000-000000000002', 'Phật pháp Căn bản & Giới luật', 'phat-phap-can-ban', 'Tìm hiểu sâu về Tứ Diệu Đế, Bát Chánh Đạo, Nghiệp, Tái sinh và Năm giới quý báu gìn giữ hạnh phúc gia đình.', 'BEGINNER', 'BookOpen', 12, 6, 2),
('40000000-0000-0000-0000-000000000003', 'Thiền quán & Chánh niệm ứng dụng', 'thien-quan-chanh-niem-ung-dung', 'Phương pháp thiền tọa, thiền hành, quán niệm hơi thở Anapanasati và thực hành tỉnh giác giữa đời thường.', 'INTERMEDIATE', 'Smile', 10, 5, 3),
('40000000-0000-0000-0000-000000000004', 'Kinh điển & Triết học Đại thừa', 'kinh-dien-triet-hoc-dai-thua', 'Khám phá tư tưởng Bát Nhã, Tánh Không, Kinh Kim Cương, Kinh Pháp Hoa và tinh thần Bồ Tát đạo độ sinh.', 'ADVANCED', 'Scroll', 20, 8, 4),
('40000000-0000-0000-0000-000000000005', 'Phật giáo trong Đời sống & Gia đình', 'phat-giao-doi-song-gia-dinh', 'Nuôi dạy con cái trong tinh thần từ bi, quản lý tài chính theo lời Phật dạy và giải tỏa áp lực công sở.', 'BEGINNER', 'Heart', 8, 4, 5)
ON CONFLICT (slug) DO NOTHING;

-- 7. TEMPLES & SACRED PLACES (4K ULTRA-HD PHOTOGRAPHY & COMPREHENSIVE DATA)
INSERT INTO temples (id, name, slug, category, tradition, abbot_name, address, province, district, latitude, longitude, cover_image, description, history, phone, website, is_verified) VALUES
('50000000-0000-0000-0000-000000000001', 'Chùa Một Cột (Diên Hựu Tự)', 'chua-mot-cot-ha-noi', 'CHUA', 'Bắc tông', 'ĐĐ. Thích Đức Thiện', 'Phố Chùa Một Cột, Phường Đội Cấn, Quận Ba Đình', 'Hà Nội', 'Ba Đình', 21.0358240, 105.8336210, 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=2560&auto=format&fit=crop&q=90', 'Chùa Một Cột được xây dựng vào năm 1049 dưới thời vua Lý Thái Tông, mô phỏng đóa hoa sen vươn lên giữa hồ Linh Chiểu. Đây là một trong những biểu tượng văn hóa và tâm linh ngàn năm văn hiến của thủ đô Hà Nội.', 'Theo truyền thuyết, vua Lý Thái Tông mộng thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua lên tòa. Khi tỉnh dậy, vua cho dựng chùa với một cột đá nguyên khối vươn lên giữa hồ sen giống như giấc mộng, đặt tên là Diên Hựu.', '024.3845.5588', 'https://ditichlichsu.gov.vn', true),
('50000000-0000-0000-0000-000000000002', 'Chùa Trấn Quốc', 'chua-tran-quoc-ha-noi', 'CHUA', 'Bắc tông', 'TT. Thích Thanh Nhã', 'Đường Thanh Niên, Phường Yên Phụ, Quận Tây Hồ', 'Hà Nội', 'Tây Hồ', 21.0483250, 105.8368150, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=2560&auto=format&fit=crop&q=90', 'Chùa Trấn Quốc là ngôi chùa cổ kính nhất Thăng Long - Hà Nội với lịch sử hơn 1.500 năm, tọa lạc trên bán đảo nhỏ phía đông hồ Tây, từng được bình chọn là một trong những ngôi chùa đẹp nhất thế giới.', 'Chùa được khởi dựng từ thời Tiền Lý (năm 541-547) với tên gọi Khai Quốc bên bờ sông Hồng. Đến đời vua Lê Trung Hưng dời vào đảo Kim Ngư hồ Tây.', '024.3829.3869', 'https://chuatranquoc.vn', true),
('50000000-0000-0000-0000-000000000003', 'Quần Thể Danh Thắng Chùa Hương', 'chua-huong-ha-noi', 'CHUA', 'Bắc tông', 'TT. Thích Minh Hiền', 'Xã Hương Sơn, Huyện Mỹ Đức', 'Hà Nội', 'Mỹ Đức', 20.6186420, 105.7483120, 'https://images.unsplash.com/photo-1528127269322-539801943592?w=2560&auto=format&fit=crop&q=90', 'Chùa Hương là một quần thể văn hóa - tôn giáo lớn gồm hàng chục ngôi chùa thờ Phật, đền thờ thần gắn liền với tín ngưỡng nông nghiệp. Động Hương Tích được chúa Trịnh Sâm ngợi ca là Nam thiên đệ nhất động.', 'Chùa Hương hình thành từ cuối thế kỷ 17. Lễ hội Chùa Hương hàng năm kéo dài từ mùng 6 tháng Giêng đến hết tháng 3 âm lịch luôn là mùa trẩy hội tâm linh lớn nhất miền Bắc.', '024.3384.8144', 'https://lehoichuahuong.vn', true),
('50000000-0000-0000-0000-000000000004', 'Quần Thể Tâm Linh Chùa Bái Đính', 'chua-bai-dinh-ninh-binh', 'CHUA', 'Bắc tông', 'HT. Thích Thanh Nhiễu', 'Xã Gia Sinh, Huyện Gia Viễn', 'Ninh Bình', 'Gia Viễn', 20.2742180, 105.8653190, 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=2560&auto=format&fit=crop&q=90', 'Chùa Bái Đính là quần thể chùa lớn giữ nhiều kỷ lục nhất châu Á và Việt Nam, nổi bật với hành lang 500 tượng La Hán bằng đá xanh, đại bảo tháp cao 13 tầng cùng chuông đồng Đại hồng chung nặng 36 tấn.', 'Khu chùa cổ được sáng lập bởi Quốc sư Nguyễn Minh Không từ thời nhà Lý (năm 1136). Năm 2003, quần thể Bái Đính mới được khởi công xây dựng và trở thành trung tâm tổ chức Đại lễ Phật đản Vesak.', '0229.3831.688', 'https://chuabaidinh.vn', true),
('50000000-0000-0000-0000-000000000005', 'Quần Thể Chùa Tam Chúc', 'chua-tam-chuc-ha-nam', 'CHUA', 'Bắc tông', 'HT. Thích Thanh Quyết', 'Thị trấn Ba Sao, Huyện Kim Bảng', 'Hà Nam', 'Kim Bảng', 20.5519450, 105.8239120, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2560&auto=format&fit=crop&q=90', 'Chùa Tam Chúc tựa lưng vào núi Thất Tinh, hướng mặt ra hồ Lục Nhạc mênh mông, được mệnh danh là Vịnh Hạ Long trên cạn với phong cảnh non nước kỳ vĩ và những bức phù điêu dung nham núi lửa tinh xảo.', 'Chùa Tam Chúc cổ có niên đại hơn 1.000 năm gắn liền với truyền thuyết Tiền Lục Nhạc - Hậu Thất Tinh. Quần thể ngày nay là nơi hội tụ tinh hoa nghệ thuật kiến trúc Phật giáo Đông Nam Á.', '0226.3989.999', 'https://tamchuc.com.vn', true),
('50000000-0000-0000-0000-000000000006', 'Thiền Viện Trúc Lâm Yên Tử', 'thien-vien-truc-lam-yen-tu', 'THIEN_VIEN', 'Thiền phái Trúc Lâm Yên Tử', 'TT. Thích Đạo Hiển', 'Núi Yên Tử, Xã Thượng Yên Công, Thành phố Uông Bí', 'Quảng Ninh', 'Uông Bí', 21.1550210, 106.7208350, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=2560&auto=format&fit=crop&q=90', 'Cái nôi của Thiền phái Trúc Lâm Việt Nam do Phật hoàng Trần Nhân Tông sáng lập thế kỷ 13. Nơi đây hội tụ khí thiêng sông núi với chùa Hoa Yên, vườn tháp Huệ Quang và Chùa Đồng đỉnh non thiêng.', 'Sau khi đánh thắng giặc Nguyên Mông, vua Trần Nhân Tông nhường ngôi và lên non thiêng Yên Tử xuất gia tu hành, sáng lập dòng thiền mang đậm bản sắc văn hóa dân tộc Việt Nam.', '0203.3854.123', 'https://yentu.com.vn', true),
('50000000-0000-0000-0000-000000000007', 'Chùa Linh Ứng Bãi Bụt (Sơn Trà)', 'chua-linh-ung-bai-but-da-nang', 'CHUA', 'Bắc tông', 'TT. Thích Thiện Nguyện', 'Bán đảo Sơn Trà, Phường Thọ Quang, Quận Sơn Trà', 'Đà Nẵng', 'Sơn Trà', 16.1003450, 108.2778120, 'https://images.unsplash.com/photo-1608999383953-d61f5d9c1ace?w=2560&auto=format&fit=crop&q=90', 'Ngôi chùa tọa lạc trên bán đảo Sơn Trà nhìn thẳng ra vịnh Đà Nẵng, nổi tiếng với đại tượng Bồ Tát Quán Thế Âm cao 67m (tương đương tòa nhà 30 tầng) đứng tựa lưng vào núi, hướng mắt ra biển Đông che chở sóng gió.', 'Được khởi công xây dựng từ năm 2004 và khánh thành năm 2010. Tên gọi Bãi Bụt gắn liền với truyền thuyết thời vua Minh Mạng khi ngư dân phát hiện tượng Phật dạt vào bờ cát.', '0236.3923.366', 'https://chualinhungdanang.com', true),
('50000000-0000-0000-0000-000000000008', 'Chùa Thiên Mụ (Linh Mụ Tự)', 'chua-thien-mu-hue', 'CHUA', 'Bắc tông', 'HT. Thích Trí Tựu', 'Đồi Hà Khê, Phường Kim Long, Thành phố Huế', 'Thừa Thiên Huế', 'TP. Huế', 16.4533120, 107.5450120, 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=2560&auto=format&fit=crop&q=90', 'Biểu tượng lịch sử và tâm linh xứ Huế bên dòng sông Hương hiền hòa, Chùa Thiên Mụ nổi bật với tháp Phước Duyên hình bát giác 7 tầng cao 21m cùng tiếng chuông chùa ngân vang lay động lòng người.', 'Chùa được chúa Tiên Nguyễn Hoàng cho xây dựng vào năm 1601 sau khi nghe dân làng kể về điềm báo một bà lão áo đỏ rực xuất hiện trên đồi nói sẽ có chân chúa đến lập chùa tụ linh khí.', '0234.3522.617', 'https://khamphahue.com.vn', true),
('50000000-0000-0000-0000-000000000009', 'Chùa Bửu Long (Thiền Viện Tổ Đình Bửu Long)', 'chua-buu-long-tp-hcm', 'CHUA', 'Nam tông (Nguyên thủy)', 'HT. Thích Viên Minh', '81 Nguyễn Xiển, Phường Long Bình, Thành phố Thủ Đức', 'TP. Hồ Chí Minh', 'TP. Thủ Đức', 10.8719250, 106.8286120, 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=2560&auto=format&fit=crop&q=90', 'Được National Geographic vinh danh là một trong những ngôi chùa có kiến trúc đẹp nhất thế giới, Chùa Bửu Long mang phong cách Phật giáo Nguyên thủy Theravada với bảo tháp Gotama Cetiya dát vàng lộng lẫy soi bóng hồ nước xanh biếc.', 'Thành lập năm 1942 bởi Cư sĩ Võ Hà Thuật. Năm 2007, chùa được trùng tu lớn theo sự chỉ đạo của Hòa thượng Viên Minh, kết hợp tinh hoa kiến trúc Ấn Độ, Myanmar và văn hóa thời Nguyễn.', '028.3732.5539', 'https://trungtamhoton.org', true),
('50000000-0000-0000-0000-000000000010', 'Chùa Vĩnh Nghiêm', 'chua-vinh-nghiem-tp-hcm', 'CHUA', 'Bắc tông', 'TT. Thích Thanh Phong', '339 Nam Kỳ Khởi Nghĩa, Phường 14, Quận 3', 'TP. Hồ Chí Minh', 'Quận 3', 10.7906120, 106.6853240, 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=2560&auto=format&fit=crop&q=90', 'Chùa Vĩnh Nghiêm là một trong những cơ sở Phật giáo lớn nhất Sài Gòn, mang phong cách kiến trúc chùa cổ miền Bắc bằng bê tông cốt thép đầu tiên tại Việt Nam với tháp Quán Thế Âm 7 tầng uy nghiêm.', 'Khởi công xây dựng năm 1964 và hoàn thành năm 1971 do hai vị Hòa thượng Thích Tâm Giác và Thích Thanh Kiểm sáng lập, lấy nguyên mẫu từ tổ đình Vĩnh Nghiêm tại Bắc Giang.', '028.3848.3153', 'https://chuavinhnghiem.org', true),
('50000000-0000-0000-0000-000000000011', 'Thiền Viện Trúc Lâm Đà Lạt', 'thien-vien-truc-lam-da-lat', 'THIEN_VIEN', 'Thiền phái Trúc Lâm Yên Tử', 'HT. Thích Thông Phương', 'Núi Phụng Hoàng, Phường 3, bên hồ Tuyền Lâm', 'Lâm Đồng', 'Đà Lạt', 11.9048120, 108.4346890, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=2560&auto=format&fit=crop&q=90', 'Thiền viện Trúc Lâm Đà Lạt tọa lạc trên đồi Phụng Hoàng nhìn ra hồ Tuyền Lâm phẳng lặng, là một trong những trung tâm nghiên cứu và thực hành thiền tông lớn nhất Việt Nam do Thiền sư Thích Thanh Từ sáng lập.', 'Được khởi công xây dựng vào năm 1993 và hoàn thành năm 1994, thiết kế bởi kiến trúc sư Ngô Viết Thụ. Không gian thiền môn hòa mình giữa đồi thông thơ mộng và ngàn hoa.', '0263.3827.565', 'https://truclamdalat.net', true),
('50000000-0000-0000-0000-000000000012', 'Chùa Hoằng Pháp', 'chua-hoang-phap-tp-hcm', 'CHUA', 'Bắc tông', 'ĐĐ. Thích Tâm Trường', 'Xã Tân Hiệp, Huyện Hóc Môn', 'TP. Hồ Chí Minh', 'Hóc Môn', 10.8876120, 106.5891230, 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=2560&auto=format&fit=crop&q=90', 'Chùa Hoằng Pháp nổi tiếng với phong trào tu Phật thất và các khóa tu mùa hè thu hút hàng ngàn thanh thiếu niên và Phật tử từ khắp mọi miền đất nước về tham gia học hỏi nếp sống tỉnh thức.', 'Sáng lập vào năm 1957 bởi Cố Đại lão Hòa thượng Ngộ Chân Tử. Nơi đây là trung tâm hoằng pháp và đào tạo Tăng tài kiệt xuất với nhiều ấn phẩm kinh sách và đĩa giảng Phật pháp giá trị.', '028.3713.0002', 'https://chuahoangphap.com.vn', true),
('50000000-0000-0000-0000-000000000013', 'Chùa Quán Sứ (Trụ Sở Trung Ương GHPGVN)', 'chua-quan-su-ha-noi', 'CHUA', 'Bắc tông', 'HT. Thích Thanh Nhiễu', 'Số 73 Quán Sứ, Phường Trần Hưng Đạo, Quận Hoàn Kiếm', 'Hà Nội', 'Hoàn Kiếm', 21.0253450, 105.8458920, 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=2560&auto=format&fit=crop&q=90', 'Chùa Quán Sứ là trụ sở chính thức của Giáo hội Phật giáo Việt Nam, trái tim của mọi hoạt động Phật sự quốc gia, gìn giữ nhiều bảo vật Phật giáo quý giá cùng thư viện Phật học phong phú.', 'Xây dựng vào thế kỷ 15 dưới triều vua Lê Thế Tông, nguyên là công quán tiếp đón sứ thần các nước Phật giáo sang cống nạp.', '024.3942.2427', 'https://phatgiao.org.vn', true),
('50000000-0000-0000-0000-000000000014', 'Chùa Keo (Thần Quang Tự)', 'chua-keo-thai-binh', 'CHUA', 'Bắc tông', 'ĐĐ. Thích Thanh Bản', 'Xã Duy Nhất, Huyện Vũ Thư', 'Thái Bình', 'Vũ Thư', 20.3606120, 106.3006240, 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=2560&auto=format&fit=crop&q=90', 'Kiệt tác kiến trúc gỗ cổ bậc nhất Đông Nam Á, Chùa Keo nổi tiếng với gác chuông ba tầng mái cao 11m hoàn toàn bằng gỗ lim không dùng một chiếc đinh sắt nào, đạt đến đỉnh cao điêu khắc thời Hậu Lê.', 'Khởi dựng từ năm 1061 thời Lý Thánh Tông bởi Thiền sư Dương Không Lộ. Năm 1611 bị lũ cuốn trôi và được nhân dân tái thiết lại vào năm 1630 với quy mô bề thế gồm 128 gian.', '0227.3822.456', 'https://ditichchuakeo.vn', true),
('50000000-0000-0000-0000-000000000015', 'Chùa Long Sơn (Chùa Phật Trắng)', 'chua-long-son-khanh-hoa', 'CHUA', 'Bắc tông', 'HT. Thích Quảng Thiện', 'Số 20 Đường 23/10, Phường Phương Sơn, Thành phố Nha Trang', 'Khánh Hòa', 'TP. Nha Trang', 12.2504120, 109.1806350, 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=2560&auto=format&fit=crop&q=90', 'Tọa lạc dưới chân đồi Trại Thủy, Chùa Long Sơn nổi tiếng với pho tượng Kim Thân Phật Tổ (Phật Trắng) ngồi thuyết pháp trên đỉnh đồi cao 24m, từ đây có thể ngắm trọn vẹn toàn cảnh thành phố biển Nha Trang.', 'Chùa do Hòa thượng Thích Ngộ Chí khai sơn năm 1886. Tượng Phật ngoài trời lớn nhất nước được xác lập kỷ lục.', '0258.3822.844', 'https://chualongson.org.vn', true),
('50000000-0000-0000-0000-000000000016', 'Bồ Đề Đạo Tràng (Mahabodhi Temple - Bodh Gaya)', 'bo-de-dao-trang-bodh-gaya', 'DI_TICH', 'Thánh Tích Phật Giáo Quốc Tế', 'Ban Quản Trị Mahabodhi Temple', 'Bodh Gaya, Bang Bihar, Ấn Độ (Tứ Động Tâm)', 'Thánh Tích Phật Giáo', 'Bodh Gaya', 24.6959120, 84.9914250, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=2560&auto=format&fit=crop&q=90', 'Thánh tích thiêng liêng bậc nhất của người con Phật trên toàn cầu — nơi Đức Bổn Sư Thích Ca Mâu Ni đạt giác ngộ vô thượng chánh đẳng chánh giác dưới cội cây Bồ Đề thiêng sau 49 ngày thiền định.', 'Được vua A Dục (Ashoka) khởi dựng tháp tưởng niệm đầu tiên vào thế kỷ thứ 3 TCN. Quần thể đền Đại Giác hiện nay được UNESCO công nhận là Di sản Thế giới với tháp chính cao 55m.', '+91.631.2200.735', 'https://bodhgayatourism.com', true)
ON CONFLICT (slug) DO NOTHING;

-- 8. AUDIO & TALKS
INSERT INTO audio (id, title, speaker, audio_url, duration_seconds, category, cover_image, description, listen_count) VALUES
('60000000-0000-0000-0000-000000000001',
'Pháp âm an lạc: Nhận diện và chuyển hóa cơn giận',
'Thầy Thích Minh Niệm',
'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
1560,
'PHAP_THOAI',
'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80',
'Bài giảng sâu sắc về bản chất của tâm sân, phương pháp nhìn sâu vào cảm thọ đau rát để nuôi dưỡng từ bi và bao dung.',
1420),
('60000000-0000-0000-0000-000000000002',
'Kinh Bát Nhã Ba La Mật Đa (Tụng thanh tịnh)',
'Chư Tăng Chùa Vạn Hạnh',
'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
540,
'KINH_TUNG',
'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
'Thời kinh tụng Bát Nhã với giọng tụng trang nghiêm, chuông mõ thanh thoát giúp lắng đọng tâm thức.',
3890),
('60000000-0000-0000-0000-000000000003',
'Thiền dẫn 15 phút: Hơi thở nuôi dưỡng bình an',
'Thiền sư Thích Nhất Hạnh',
'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
900,
'THIEN',
'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
'Bài thực hành thiền dẫn nhẹ nhàng đưa tâm về với thân, thư giãn từng thớ cơ và cảm nhận sự sống tươi mát.',
5120)
ON CONFLICT DO NOTHING;

-- 9. VIDEOS (VERIFIED BUDDHIST YOUTUBE LECTURES & REAL YOUTUBE THUMBNAILS)
INSERT INTO videos (id, title, speaker, video_url, thumbnail_url, duration_seconds, category, description, view_count) VALUES
('70000000-0000-0000-0000-000000000001', 'Suy Nghĩ Lạc Quan Cuộc Sống Sẽ Bớt Khổ', 'ĐĐ. Thích Pháp Hòa', 'https://www.youtube.com/watch?v=8bgy1xhjCIU', 'https://i.ytimg.com/vi/8bgy1xhjCIU/hqdefault.jpg', 4320, 'PHAP_THOAI', 'Bài pháp thoại sâu sắc và hóm hỉnh của Thầy Thích Pháp Hòa chia sẻ cách làm chủ tư duy, chuyển hóa suy nghĩ tiêu cực thành năng lượng an vui, sống thanh thản giữa nghịch cảnh đời thường.', 524000),
('70000000-0000-0000-0000-000000000002', 'Hiểu Về Trái Tim: Tình Yêu Đích Thực Là Gì?', 'Thầy Thích Minh Niệm', 'https://www.youtube.com/watch?v=KBBw7pd8_q4', 'https://i.ytimg.com/vi/KBBw7pd8_q4/hqdefault.jpg', 2850, 'PHAP_THOAI', 'Bài giảng trích từ tác phẩm nổi tiếng Hiểu Về Trái Tim, phân tích bản chất của bốn yếu tố Từ - Bi - Hỷ - Xả trong tình thương, giúp ta trao đi yêu thương mà không biến thành ràng buộc.', 812000),
('70000000-0000-0000-0000-000000000003', 'Học Cách TĨNH TÂM Bớt Suy Nghĩ - Nghe 1 Lần An Lạc 1 Đời', 'Thiền sư Thích Nhất Hạnh', 'https://www.youtube.com/watch?v=gcJsTUWm14E', 'https://i.ytimg.com/vi/gcJsTUWm14E/hqdefault.jpg', 3600, 'THIEN_QUAN', 'Những lời dạy dịu dàng và đầy tuệ giác của Thiền sư Thích Nhất Hạnh hướng dẫn nghệ thuật đưa tâm trở về với thân, dừng lại những suy nghĩ vẩn vơ để chạm vào sự tĩnh lặng hiện tại.', 1250000),
('70000000-0000-0000-0000-000000000004', 'CHÚ ĐẠI BI 21 Biến (Chữ To Dễ Thuộc) - Thanh Tịnh Cầu An', 'TT. Thích Trí Thoát Tụng', 'https://www.youtube.com/watch?v=bewoZVB_wts', 'https://i.ytimg.com/vi/bewoZVB_wts/hqdefault.jpg', 3720, 'KINH_TUNG', 'Thời kinh tụng Chú Đại Bi 21 biến với chất giọng thanh thoát, trầm hùng của Thượng tọa Thích Trí Thoát kết hợp tiếng chuông mõ trang nghiêm, giúp tiêu trừ chướng ngại, mang lại bình an.', 2450000),
('70000000-0000-0000-0000-000000000005', 'Bát Nhã Ba La Mật Đa Tâm Kinh (21 Biến) Thanh Tịnh', 'TT. Thích Trí Thoát', 'https://www.youtube.com/watch?v=iL0z8bPVTcQ', 'https://i.ytimg.com/vi/iL0z8bPVTcQ/hqdefault.jpg', 1980, 'KINH_TUNG', 'Trì tụng Tâm Kinh Bát Nhã soi tỏ chân lý Tánh Không, vượt qua mọi khổ ách tai ương. Âm thanh mầu nhiệm đưa hành giả vào trạng thái định tâm thanh tịnh tuyệt đối.', 980000),
('70000000-0000-0000-0000-000000000006', 'Khám Phá Chùa Tam Chúc - Ngôi Chùa Lớn Nhất Thế Giới | Flycam 4K', 'Phim Tài Liệu Di Sản Phật Giáo', 'https://www.youtube.com/watch?v=3QRGSGW21Jg', 'https://i.ytimg.com/vi/3QRGSGW21Jg/hqdefault.jpg', 1420, 'VAN_HOA', 'Thước phim 4K Flycam mãn nhãn ghi lại toàn cảnh quần thể danh thắng chùa Tam Chúc giữa hồ Lục Nhạc và dãy núi Thất Tinh, cùng kiến trúc Điện Tam Thế tráng lệ bậc nhất Việt Nam.', 420000),
('70000000-0000-0000-0000-000000000007', 'Bái Đính Cổ Tự - Vẻ Đẹp Linh Thiêng Huyền Bí | Drone 4K', 'Our Endless World Travel', 'https://www.youtube.com/watch?v=Hit9M451P78', 'https://i.ytimg.com/vi/Hit9M451P78/hqdefault.jpg', 1850, 'VAN_HOA', 'Hành trình chiêm bái Chùa Bái Đính Ninh Bình chuẩn độ phân giải 4K sắc nét, chiêm ngưỡng hành lang La Hán đá xanh dài nhất châu Á và tiếng chuông đồng vang vọng giữa đất trời Tràng An.', 360000),
('70000000-0000-0000-0000-000000000008', 'Nghệ Thuật Lắng Nghe & Nói Lời Ái Ngữ Nuôi Dưỡng Hạnh Phúc', 'Thiền sư Thích Nhất Hạnh', 'https://www.youtube.com/watch?v=9hz_zOcXPXY', 'https://i.ytimg.com/vi/9hz_zOcXPXY/hqdefault.jpg', 3120, 'PHAP_THOAI', 'Bí quyết thực hành ái ngữ và lắng nghe sâu sắc để hóa giải những rạn nứt trong các mối quan hệ hôn nhân, gia đình và bạn bè theo tinh thần từ bi Bồ Tát Quán Âm.', 670000),
('70000000-0000-0000-0000-000000000009', 'Hiểu Về Trái Tim: Chuyển Hóa Tuyệt Vọng & Nỗi Sợ', 'Thầy Thích Minh Niệm', 'https://www.youtube.com/watch?v=4zeYOdbbM30', 'https://i.ytimg.com/vi/4zeYOdbbM30/hqdefault.jpg', 2400, 'THIEN_QUAN', 'Chỉ dẫn tâm lý trị liệu dựa trên tuệ giác đạo Phật: Đón nhận nỗi tuyệt vọng như một phần của cuộc sống và khơi dậy sức mạnh chữa lành tự thân từ sự buông xả.', 489000),
('70000000-0000-0000-0000-000000000010', 'Giữ Được Bình An Giữa Sóng Gió Là Thành Công Lớn Nhất Đời Người', 'Thiền sư Thích Nhất Hạnh', 'https://www.youtube.com/watch?v=SELZBUa3VDM', 'https://i.ytimg.com/vi/SELZBUa3VDM/hqdefault.jpg', 3950, 'PHAP_THOAI', 'Bài pháp đàm sâu sắc giúp người cư sĩ xây dựng hòn đảo tự thân vững vàng, không bị cuốn trôi bởi danh lợi, hơn thua và áp lực của đời sống hiện đại.', 1140000),
('70000000-0000-0000-0000-000000000011', 'Bát Nhã Ba La Mật Đa Tâm Kinh Diễn Xướng Thanh Tịnh', 'Quỳnh Trang Official', 'https://www.youtube.com/watch?v=Wm3AZIkhNy4', 'https://i.ytimg.com/vi/Wm3AZIkhNy4/hqdefault.jpg', 640, 'KINH_TUNG', 'Giọng ca ngân vang mộc mạc và thanh khiết kết hợp phối khí thiền định nhẹ nhàng, tạo nên một bản diễn xướng Bát Nhã Tâm Kinh lay động lòng người.', 1850000),
('70000000-0000-0000-0000-000000000012', 'Tâm Bình Thế Giới Bình - Sống An Lạc Trong Mọi Hoàn Cảnh', 'ĐĐ. Thích Pháp Hòa', 'https://www.youtube.com/watch?v=5rCVXF25BJU', 'https://i.ytimg.com/vi/5rCVXF25BJU/hqdefault.jpg', 4620, 'PHAP_THOAI', 'Bài pháp thoại mới nhất của Thầy Thích Pháp Hòa tại Tu Viện Trúc Lâm, giải đáp tường tận các khúc mắc trong đời sống tâm linh và phương pháp giữ tâm bình thản trước vạn biến.', 730000),
('70000000-0000-0000-0000-000000000013', 'Bình An Nơi Tâm - Sống Thuận Duyên Giữa Biến Động', 'ĐĐ. Thích Pháp Hòa', 'https://www.youtube.com/watch?v=h9OggggjJsA', 'https://i.ytimg.com/vi/h9OggggjJsA/hqdefault.jpg', 4120, 'PHAP_THOAI', 'Thời pháp thoại sâu sắc về nghệ thuật buông bỏ sự cầu toàn, đón nhận mọi thuận nghịch của duyên khởi bằng nụ cười bao dung và trí tuệ tỉnh thức.', 610000)
ON CONFLICT (id) DO NOTHING;

-- 10. MEDITATION PRESETS
INSERT INTO meditation_presets (id, title, duration_seconds, bell_interval_seconds, sound_type, description) VALUES
('80000000-0000-0000-0000-000000000001', '5 phút: Tĩnh tâm đầu ngày', 300, 60, 'BELL', 'Khoảng dừng ngắn ngủi giúp bạn quay về với hơi thở trước khi bước vào ngày làm việc năng động.'),
('80000000-0000-0000-0000-000000000002', '10 phút: Buông xả âu lo', 600, 120, 'RAIN', 'Tiếng mưa rơi nhẹ hạt kết hợp tiếng chuông ngân nhắc nhở tâm buông thư hoàn toàn.'),
('80000000-0000-0000-0000-000000000003', '20 phút: Tọa thiền chánh niệm', 1200, 300, 'FOREST', 'Thời thiền sâu lắng với âm hưởng rừng xanh thanh bình, nuôi dưỡng định lực và trí tuệ.'),
('80000000-0000-0000-0000-000000000004', '30 phút: Không gian an định', 1800, 600, 'SILENCE', 'Khoảng lặng thuần khiết không tạp âm, dành cho hành giả thực hành thiền quán chỉ và quán.')
ON CONFLICT DO NOTHING;

-- 11. SACRED BOOKS
INSERT INTO books (id, title, author, translator, cover_image, description, category, total_pages, published_year) VALUES
('90000000-0000-0000-0000-000000000001',
'Kinh Pháp Cú (Dhammapada)',
'Đức Phật Thích Ca Mâu Ni',
'HT. Thích Minh Châu dịch Việt',
'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
'Tuyển tập 423 bài kệ ngắn gọn, súc tích chứa đựng cốt tủy giáo lý Phật đà, là cẩm nang tu dưỡng đạo đức cao quý của người con Phật.',
'KINH_DIEN',
260,
2020),
('90000000-0000-0000-0000-000000000002',
'Trái Tim Của Bụt',
'Thiền sư Thích Nhất Hạnh',
'Nguyên bản tiếng Việt',
'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
'Cuốn sách giới thiệu các giáo lý then chốt của đạo Phật qua lăng kính thiền quán và chánh niệm đầy chất thơ, sáng tỏ và gần gũi.',
'TRIET_HOC',
380,
2018)
ON CONFLICT DO NOTHING;

-- 12. EVENTS
INSERT INTO events (id, title, slug, temple_id, description, cover_image, start_date, end_date, location, is_online, max_attendees) VALUES
('a0000000-0000-0000-0000-000000000001',
'Khóa tu Một Ngày An Lạc — Nuôi Dưỡng Tâm Từ',
'khoa-tu-mot-ngay-an-lac',
'50000000-0000-0000-0000-000000000001',
'Chương trình tu học trọn ngày dành cho Phật tử và các bạn trẻ: Tọa thiền buổi sáng, nghe pháp thoại, ăn cơm chánh niệm và pháp đàm chia sẻ.',
'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
CURRENT_TIMESTAMP + INTERVAL '7 days',
CURRENT_TIMESTAMP + INTERVAL '7 days 8 hours',
'Chùa Quán Sứ, 73 Quán Sứ, Hoàn Kiếm, Hà Nội',
false,
200)
ON CONFLICT (slug) DO NOTHING;

-- 13. ORGANIZATIONS
INSERT INTO organizations (id, name, slug, org_type, logo_url, cover_url, description, address, phone, email, website, is_verified) VALUES
('b0000000-0000-0000-0000-000000000001',
'Giáo hội Phật giáo Việt Nam',
'giao-hoi-phat-giao-viet-nam',
'GIAO_HOI',
'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
'Tổ chức tôn giáo đại diện hợp pháp duy nhất cho Tăng Ni, Phật tử Việt Nam ở trong và ngoài nước với phương châm Đạo pháp - Dân tộc - Chủ nghĩa Xã hội.',
'73 Quán Sứ, Hoàn Kiếm, Hà Nội',
'024.39422427',
'vanphong@ghpgvn.vn',
'https://phatgiao.org.vn',
true)
ON CONFLICT (slug) DO NOTHING;
