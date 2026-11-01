# LỘ TRÌNH PHÁT TRIỂN HỆ THỐNG PHẬT PHÁP (ROADMAP.MD)

Tài liệu này xác định 7 giai đoạn phát triển liên tục (Phases), bảo đảm mỗi giai đoạn đều hoàn chỉnh từ Giao diện (UI), Backend API, Cơ sở dữ liệu (PostgreSQL), Thẩm định quyền (RBAC), đến Kiểm thử và Trải nghiệm thực tế.

---

## BẢNG THEO DÕI TIẾN ĐỘ TỔNG QUAN

| Giai đoạn | Trọng tâm | Trạng thái |
| :--- | :--- | :--- |
| **PHASE 1** | Khởi tạo hạ tầng, PostgreSQL Schema, Design System, Xác thực JWT/RBAC, Layout toàn trang, Trang chủ Editorial Homepage | **ĐANG THỰC HIỆN (IN PROGRESS)** |
| **PHASE 2** | Bài viết, Chuyên mục, Thẻ tag, Bình luận đa cấp, Đánh dấu (Bookmark), Trang cá nhân, Theo dõi | Kế hoạch (Planned) |
| **PHASE 3** | Video Phật pháp, Trình phát Pháp thoại / Audio toàn trang, Tủ sách Phật học, Bản đồ Chùa & Địa danh, Sự kiện | Kế hoạch (Planned) |
| **PHASE 4** | Thực hành hôm nay, Lộ trình học Phật (5 tuyến), Phòng thiền trực tuyến & Âm thanh thiên nhiên, Hành trình Phật giáo | Kế hoạch (Planned) |
| **PHASE 5** | Nhóm cộng đồng tu học, Nhắn tin trực tiếp, Hệ thống Thông báo, Báo cáo & Hàng đợi Kiểm duyệt nội dung | Kế hoạch (Planned) |
| **PHASE 6** | Trang chính thức Chùa / Tổ chức (Quy trình thẩm định xác minh), Diễn đàn Hỏi đáp Phật pháp (Q&A) | Kế hoạch (Planned) |
| **PHASE 7** | Admin CMS Dashboard, Phân tích dữ liệu thực tế (Analytics), Tối ưu SEO (JSON-LD Schemas), An ninh & Hiệu năng | Kế hoạch (Planned) |

---

## CHI TIẾT CÁC GIAI ĐOẠN

### ❖ PHASE 1 — NỀN TẢNG CỐT LÕI & TRANG CHỦ EDITORIAL (CURRENT)
- [x] **Audit & Documentation:** Hoàn thành audit hệ thống, viết `AUDIT_REPORT.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DESIGN-SYSTEM.md`, `ROADMAP.md`.
- [x] **PostgreSQL Database:** Tạo CSDL `phatphap`, cấu hình pool kết nối an toàn, migration toàn bộ 25+ bảng cốt lõi, nạp realistic demo seed data.
- [x] **Design Tokens & Theme:** Cấu hình Tailwind CSS, biến CSS Semantic Tokens (Saffron Gold, Jade Green, Warm Ivory, Lotus Rose, Warm Charcoal), Dark/Light mode switch.
- [x] **Authentication & RBAC:**
  - API: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`.
  - Mật khẩu mã hóa `bcryptjs`, cấp phát JWT token an toàn trong HttpOnly Cookie.
  - UI: Modal / Trang Đăng nhập & Đăng ký tôn nghiêm, xử lý lỗi và loading mượt mà.
- [x] **Global Layout & Navigation:**
  - Header với Logo Phật Pháp thanh thoát, Navigation đa phân hệ, Search Bar kích hoạt nhanh, Dark Mode toggle, Menu người dùng.
  - Mobile Drawer Navigation trực quan.
  - Global Floating Audio Player thanh tao.
  - Footer chứa liên kết văn hóa, thông tin chùa chiền, tuyên bố bản quyền & giới từ bi.
- [x] **Editorial Homepage (Trang chủ toàn diện):**
  - Khối Hero với thông điệp tỉnh thức & hình ảnh trang nghiêm.
  - Global Search Bar thời gian thực.
  - Chủ đề Phật pháp nổi bật (8 chuyên mục cốt lõi).
  - Bài viết mới & Khuyên đọc (Editorial layout).
  - Thực hành hôm nay (Trích dẫn Pháp cú, bài đọc ngắn, chánh niệm).
  - Lộ trình học Phật (5 tuyến từ người mới đến chuyên sâu).
  - Pháp thoại Audio & Video tuyển chọn.
  - Chùa & Địa danh Phật giáo tiêu biểu.
  - Hành trình Phật giáo & Tuyến hành hương.
  - Sự kiện & Khóa tu sắp diễn ra.
  - Phòng thiền trực tuyến (Lối vào thiền định tĩnh lặng).
  - Cộng đồng tu học & Nhóm chia sẻ.
  - Trang chính thức Chùa & Tổ chức được xác minh.
  - Tủ kinh sách Phật học.

---

### ❖ PHASE 2 — BÀI VIẾT & TƯƠNG TÁC ĐỌC CAO CẤP
- Quy trình biên tập: Tạo bản nháp (Draft) -> Xem trước (Preview) -> Gửi duyệt (Submit) -> Kiểm duyệt (Approve/Reject) -> Xuất bản (Published).
- Giao diện đọc bài viết chuẩn Editorial (chiều rộng 680-760px, cỡ chữ chuẩn, line-height 1.8, chia sẻ, lưu trữ, tác giả).
- Bình luận phân cấp (Comment, Reply, Like, Báo cáo vi phạm, Ẩn/Xóa bởi Moderator).

---

### ❖ PHASE 3 — ĐA PHƯƠNG TIỆN, BẢN ĐỒ CHÙA & SỰ KIỆN
- Trình phát Audio Player toàn trang (Phát tiếp tục, tua 10s, điều chỉnh tốc độ, danh sách phát kinh tụng).
- Trình xem Video bài giảng với chia chương mục.
- Module Chùa & Địa danh kết hợp Bản đồ số (MapService trừu tượng hóa, lọc theo Tỉnh thành, Tông phái, Tích xanh).
- Sự kiện, Khóa tu mùa hè, Ngày vía Phật, Lễ quy y và tính năng đăng ký tham dự.

---

### ❖ PHASE 4 — TU HỌC, THIỀN ĐỊNH & HÀNH TRÌNH
- Module Thực hành hôm nay: Ghi nhận lịch sử tu học cá nhân (không thi đua, không áp lực).
- Lộ trình học Phật: Bài học tuần tự, theo dõi tiến độ học tập.
- Phòng thiền trực tuyến: Đồng hồ bấm giờ (5p, 10p, 20p, 30p), âm thanh thiên nhiên (Chuông chùa, Mưa thiền, Suối rừng).
- Hành trình Phật giáo: Tạo tuyến viếng chùa, các điểm dừng (stops), nhật ký chiêm bái.

---

### ❖ PHASE 5 — CỘNG ĐỒNG, TIN NHẮN & AN NINH NỘI DUNG
- Nhóm tu học: Công khai, Riêng tư, Phê duyệt thành viên, Bài viết thảo luận trong nhóm.
- Tin nhắn trực tiếp: Hội thoại riêng, an toàn, hỗ trợ chặn người dùng (Block) và báo cáo.
- Hệ thống thông báo: Tương tác, phê duyệt bài viết, lời nhắc thực hành.
- Trung tâm Báo cáo (Report System) & Hàng đợi Kiểm duyệt dành cho Moderator.

---

### ❖ PHASE 6 — TỔ CHỨC CHÙA & DIỄN ĐÀN HỎI ĐÁP
- Hồ sơ chính thức của Chùa / Viện Phật giáo. Quy trình gửi hồ sơ chứng minh và cấp tích xanh xác minh minh bạch.
- Chuyên mục Hỏi đáp Phật pháp (Q&A): Hỏi đáp giáo lý, gắn nhãn "Đã được kiểm duyệt" hoặc "Thông tin tham khảo", disclaimer y tế/pháp luật.

---

### ❖ PHASE 7 — ADMIN CMS, SEO & PRODUCTION AUDIT
- Bảng điều khiển quản trị toàn diện: Thống kê số liệu thật (Real Metrics), Quản lý thành viên, Bài viết, Báo cáo, Tổ chức, Audit Logs.
- SEO Động: Meta tags, OpenGraph, JSON-LD Schemas (Article, Video, Event, Place, Organization, FAQ).
- Kiểm thử toàn diện: Unit test, Integration test, E2E test, Responsive test trên 7 kích thước màn hình.
