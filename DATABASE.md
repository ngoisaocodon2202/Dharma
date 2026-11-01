# KIẾN TRÚC CƠ SỞ DỮ LIỆU POSTGRESQL (DATABASE.MD)

Hệ thống sử dụng cơ sở dữ liệu **PostgreSQL** (phiên bản 18+), cấu hình chuẩn UTF-8, tuân thủ nguyên tắc toàn vẹn tham chiếu (Foreign Keys), đánh chỉ mục tối ưu (B-Tree, GIN index cho Full-Text Search), và quản lý khóa chính an toàn bằng UUIDv4 (`gen_random_uuid()`).

---

## 1. Thông số kết nối & Quy ước

- **Database Name:** `phatphap`
- **Port:** `5432`
- **Mã hóa:** `UTF8`
- **Quy tắc đặt tên:**
  - Bảng và cột: `snake_case` số nhiều cho bảng (`users`, `articles`, `temples`).
  - Khóa chính: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
  - Khóa ngoại: `<singular_table>_id` (ví dụ: `user_id`, `article_id`).
  - Dấu mốc thời gian: `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`, `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.
  - Xóa mềm: `deleted_at TIMESTAMP WITH TIME ZONE NULL` cho các bảng cần lưu vết (articles, comments, users).

---

## 2. Chi tiết các bảng hạt nhân (Core Tables Schema)

### 2.1 Quản trị người dùng & Phân quyền (Auth & RBAC)

#### `roles`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | VARCHAR(50) PRIMARY KEY | Tên mã vai trò (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `EDITOR`, `USER`...) |
| `name` | VARCHAR(100) NOT NULL | Tên hiển thị (Quản trị viên tối cao, Biên tập viên...) |
| `description` | TEXT | Quyền hạn và phạm vi |

#### `users`
| Cột | Kiểu | Ràng buộc / Ghi chú |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `email` | VARCHAR(255) UNIQUE | Email đăng nhập chuẩn hóa chữ thường |
| `password_hash` | VARCHAR(255) NOT NULL | Mật khẩu băm bằng bcryptjs |
| `role_id` | VARCHAR(50) NOT NULL | FK -> `roles(id)` mặc định là `'USER'` |
| `is_active` | BOOLEAN DEFAULT TRUE | Trạng thái tài khoản |
| `is_verified` | BOOLEAN DEFAULT FALSE | Xác thực email |
| `last_login_at` | TIMESTAMPTZ | Lần đăng nhập cuối |
| `created_at` | TIMESTAMPTZ | Ngày tạo tài khoản |
| `updated_at` | TIMESTAMPTZ | Ngày cập nhật |
| `deleted_at` | TIMESTAMPTZ | Dấu mốc xóa mềm (nếu có) |

#### `profiles`
| Cột | Kiểu | Ràng buộc / Ghi chú |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `user_id` | UUID UNIQUE NOT NULL | FK -> `users(id)` ON DELETE CASCADE |
| `full_name` | VARCHAR(150) NOT NULL | Họ và tên / Pháp danh |
| `dharma_name` | VARCHAR(100) | Pháp danh Phật tử |
| `avatar_url` | TEXT | Đường dẫn ảnh đại diện |
| `cover_url` | TEXT | Ảnh bìa trang cá nhân |
| `bio` | TEXT | Giới thiệu bản thân / Tâm nguyện tu học |
| `province` | VARCHAR(100) | Tỉnh / Thành phố sinh sống |
| `is_public` | BOOLEAN DEFAULT TRUE | Chế độ hiển thị trang cá nhân |
| `created_at` | TIMESTAMPTZ | Ngày tạo |
| `updated_at` | TIMESTAMPTZ | Ngày cập nhật |

---

### 2.2 Nội dung bài viết & Phân loại (Articles & Categories)

#### `article_categories`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `name` | VARCHAR(100) NOT NULL | Giáo lý căn bản, Thiền quán, Lời Phật dạy, Đời sống... |
| `slug` | VARCHAR(120) UNIQUE NOT NULL | Đường dẫn thân thiện SEO |
| `description` | TEXT | Giới thiệu chuyên mục |
| `sort_order` | INT DEFAULT 0 | Thứ tự hiển thị |
| `created_at` | TIMESTAMPTZ | Thời gian tạo |

#### `articles`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `title` | VARCHAR(255) NOT NULL | Tiêu đề bài viết |
| `slug` | VARCHAR(280) UNIQUE NOT NULL | Đường dẫn SEO |
| `excerpt` | TEXT NOT NULL | Đoạn tóm tắt mở đầu |
| `content` | TEXT NOT NULL | Toàn văn bài viết định dạng Markdown/HTML |
| `cover_image` | TEXT | Ảnh bìa đại diện bài viết |
| `author_id` | UUID NOT NULL | FK -> `users(id)` |
| `category_id` | UUID NOT NULL | FK -> `article_categories(id)` |
| `reading_time_minutes`| INT DEFAULT 5 | Thời gian ước tính đọc |
| `status` | VARCHAR(30) DEFAULT 'DRAFT' | `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `REJECTED` |
| `rejection_reason` | TEXT | Lý do từ chối nếu không được duyệt |
| `view_count` | BIGINT DEFAULT 0 | Lượt đọc thực tế |
| `published_at` | TIMESTAMPTZ | Ngày xuất bản chính thức |
| `created_at` | TIMESTAMPTZ | Ngày khởi tạo |
| `updated_at` | TIMESTAMPTZ | Ngày sửa đổi |
| `deleted_at` | TIMESTAMPTZ | Xóa mềm |

#### `tags` & `article_tags`
Bảng lưu trữ thẻ tag từ khóa và liên kết n-n giữa bài viết với thẻ khóa.

---

### 2.3 Chùa & Địa danh Phật giáo (Temples & Sacred Places)

#### `temples`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `name` | VARCHAR(255) NOT NULL | Tên chùa (Ví dụ: Chùa Quán Sứ, Chùa Hoằng Pháp...) |
| `slug` | VARCHAR(280) UNIQUE NOT NULL | Slug thân thiện |
| `category` | VARCHAR(50) DEFAULT 'CHUA' | `CHUA`, `THIEN_VIEN`, `TINH_XA`, `TU_VIEN`, `DI_TICH` |
| `tradition` | VARCHAR(100) | Tông phái: Bắc tông, Nam tông, Khất sĩ, Trúc Lâm... |
| `abbot_name` | VARCHAR(150) | Trụ trì / Viện chủ |
| `address` | VARCHAR(300) NOT NULL | Địa chỉ chi tiết |
| `province` | VARCHAR(100) NOT NULL | Tỉnh / Thành phố |
| `district` | VARCHAR(100) | Quận / Huyện |
| `latitude` | NUMERIC(10, 7) | Tọa độ vĩ độ (Dùng cho bản đồ OpenStreetMap) |
| `longitude` | NUMERIC(10, 7) | Tọa độ kinh độ (Dùng cho bản đồ OpenStreetMap) |
| `cover_image` | TEXT | Ảnh phối cảnh chính |
| `description` | TEXT NOT NULL | Lịch sử, kiến trúc, sinh hoạt tu học |
| `phone` | VARCHAR(30) | Số điện thoại liên hệ |
| `website` | VARCHAR(255) | Trang tin chính thức (nếu có) |
| `is_verified` | BOOLEAN DEFAULT FALSE | Được Ban Quản trị / Giáo hội xác minh |
| `created_at` | TIMESTAMPTZ | Thời gian tạo |
| `updated_at` | TIMESTAMPTZ | Thời gian cập nhật |

---

### 2.4 Pháp thoại & Đa phương tiện (Audio & Videos)

#### `audio`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `title` | VARCHAR(255) NOT NULL | Tựa đề bài pháp / thời kinh |
| `speaker` | VARCHAR(150) NOT NULL | Giảng sư / Tác giả thuyết giảng |
| `audio_url` | TEXT NOT NULL | File âm thanh trực tiếp (.mp3/.m4a) |
| `duration_seconds` | INT NOT NULL | Thời lượng phát (giây) |
| `category` | VARCHAR(50) DEFAULT 'PHAP_THOAI'| `PHAP_THOAI`, `KINH_TUNG`, `THIEN`, `PODCAST` |
| `cover_image` | TEXT | Ảnh đại diện |
| `description` | TEXT | Tóm lược nội dung bài giảng |
| `listen_count` | BIGINT DEFAULT 0 | Lượt nghe thực tế |
| `created_at` | TIMESTAMPTZ | Thời gian tạo |

#### `videos`
Lưu trữ video bài giảng, phim tài liệu, bài học thiền với đầy đủ thumbnail, kênh nguồn, thời lượng, và số lượt xem.

---

### 2.5 Tu học & Thực hành (Practice & Learning)

#### `daily_practices`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `practice_date` | DATE UNIQUE NOT NULL | Ngày áp dụng (YYYY-MM-DD) |
| `mindful_quote` | TEXT NOT NULL | Câu suy ngẫm tỉnh thức trong ngày |
| `quote_source` | VARCHAR(150) | Xuất xứ (Kinh Pháp Cú, Thiền sư...) |
| `reflection_text`| TEXT NOT NULL | Bài đọc chiêm nghiệm ngắn |
| `mindful_action` | VARCHAR(255) NOT NULL | Thực hành nhỏ (Ví dụ: 3 hơi thở chánh niệm...) |
| `audio_id` | UUID | FK -> `audio(id)` liên kết bài pháp/thiền ngắn |
| `created_at` | TIMESTAMPTZ | Ngày khởi tạo |

#### `meditation_presets` & `meditation_sessions`
Lưu trữ các mốc thời gian thiền (5p, 10p, 15p, 30p), âm thanh nền (Tiếng chuông chùa, Mưa thiền, Suối ngàn, Tĩnh lặng), và nhật ký tu tập cá nhân (thời lượng, ngày giờ hoàn thành, không tạo cạnh tranh).

#### `learning_paths` & `learning_path_modules`
Lộ trình học theo từng tuyến:
1. Người mới bắt đầu tìm hiểu Phật giáo
2. Phật pháp căn bản & Tam quy Ngũ giới
3. Chánh niệm & Thực hành Thiền định
4. Tủ sách & Kinh điển Nguyên thủy / Đại thừa
5. Ứng dụng Phật giáo trong đời sống gia đình & công việc

---

### 2.6 Tổ chức & Xác minh (Organizations & Verification)

#### `organizations`
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID PRIMARY KEY | `gen_random_uuid()` |
| `name` | VARCHAR(255) NOT NULL | Tên Chùa / Tu viện / Trung tâm Phật học |
| `slug` | VARCHAR(280) UNIQUE NOT NULL | Đường dẫn SEO |
| `org_type` | VARCHAR(50) DEFAULT 'CHUA'| `CHUA`, `THIEN_VIEN`, `HOI_PHAT_HOC`, `TRUNG_TAM` |
| `logo_url` | TEXT | Biểu trưng chính thức |
| `cover_url` | TEXT | Ảnh bìa trang đại diện |
| `description` | TEXT NOT NULL | Tôn chỉ hoạt động và giới thiệu |
| `address` | VARCHAR(300) NOT NULL | Trụ sở |
| `phone` | VARCHAR(30) | Số liên lạc chính thức |
| `email` | VARCHAR(150) | Email liên lạc |
| `website` | VARCHAR(255) | Cổng thông tin |
| `is_verified` | BOOLEAN DEFAULT FALSE | Trạng thái tích xanh xác minh |
| `verified_at` | TIMESTAMPTZ | Thời điểm duyệt |
| `verified_by` | UUID | FK -> `users(id)` Quản trị viên duyệt |
| `created_at` | TIMESTAMPTZ | Ngày đăng ký |

#### `organization_verifications`
Hàng đợi hồ sơ thẩm định xác minh (Đơn đăng ký, giấy tờ chứng thực, biên bản phê duyệt, lý do từ chối hoặc thu hồi xác minh).

---

### 2.7 Kiểm duyệt, Báo cáo & Audit Logs (Moderation & Safety)

#### `reports`
Quản lý các báo cáo từ cộng đồng (Spam, lừa đảo quyên góp, mạo danh, thông tin kích động, vi phạm bản quyền).

#### `moderation_logs` & `audit_logs`
Ghi lại mọi tác vụ của Ban Quản trị: Người thực hiện, Tác vụ (Duyệt, Từ chối, Khóa, Mở khóa), Thực thể bị tác động, Dữ liệu cũ và mới, Địa chỉ IP.

---

## 3. Các chỉ mục tối ưu (Indexes Strategy)

1. `CREATE INDEX idx_articles_status_pub ON articles(status, published_at DESC);`
2. `CREATE INDEX idx_articles_category ON articles(category_id);`
3. `CREATE INDEX idx_articles_author ON articles(author_id);`
4. `CREATE INDEX idx_temples_province ON temples(province);`
5. `CREATE INDEX idx_temples_verified ON temples(is_verified);`
6. `CREATE INDEX idx_audio_category ON audio(category);`
7. `CREATE INDEX idx_daily_practices_date ON daily_practices(practice_date);`
8. `CREATE INDEX idx_users_email ON users(email);`
9. `CREATE INDEX idx_users_role ON users(role_id);`
10. `CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);`
