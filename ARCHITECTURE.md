# KIẾN TRÚC HỆ THỐNG NỀN TẢNG PHẬT PHÁP (ARCHITECTURE.MD)

Nền tảng **Phật Pháp** được thiết kế theo kiến trúc chuẩn Web Application Enterprise, hướng tới sự ổn định, trang nghiêm, bảo mật, và khả năng mở rộng lâu dài thành hệ sinh thái đa nền tảng (Web, PWA, Mobile App).

---

## 1. Tổng quan kiến trúc (High-Level Architecture)

```
[ Browser / Mobile Client ]
            │
            ▼
    [ Next.js 15 App Router ]
   ┌──────────────────────────────────────────────┐
   │  - Server Components (SSR, SEO, Schemas)     │
   │  - Client Components (Audio, Meditation, UI) │
   │  - Design Tokens & Tailwind Theme            │
   └───────┬──────────────────────────────┬───────┘
           │                              │
           ▼                              ▼
  [ Internal Fetch / React Server ] [ API Route Handlers (/api/*) ]
                                          │
                                          ▼
                               [ Security & Auth Guard ]
                               (JWT Token, RBAC, Rate-Limiter)
                                          │
                                          ▼
                                [ Service & Logic Layer ]
                                (Articles, Temples, Auth, etc.)
                                          │
                                          ▼
                               [ PostgreSQL Database Pool ]
                               (Tables, Foreign Keys, Indexes)
```

---

## 2. Các tầng cấu trúc (Layered Structure)

### 2.1 Tầng Trình diễn (Presentation Layer)
- **Framework:** Next.js 15 với React 19 & TypeScript.
- **Routing:** App Router (`src/app/`) hỗ trợ Dynamic SEO, Server-Side Rendering (SSR), Streaming UI và Layout lồng nhau.
- **Styling:** Vanilla Tailwind CSS kết hợp CSS Custom Properties (`src/app/globals.css`), tuân thủ triệt để token 3 tầng theo hướng dẫn của `design-system` và `ui-ux-pro-max`.
- **Thư viện Icon:** `lucide-react` (icon hình học thanh mảnh, tinh tế, không dùng emoji làm biểu tượng tính năng).

### 2.2 Tầng API & Điều hướng (API Route Handlers)
- Toàn bộ API được đặt trong `src/app/api/`:
  - `/api/auth/*`: Đăng ký, đăng nhập, đăng xuất, lấy thông tin phiên người dùng hiện tại (`/api/auth/me`).
  - `/api/articles/*`: Lấy danh sách, xem chi tiết, tạo bài viết, duyệt/từ chối.
  - `/api/temples/*`: Chùa, thiền viện, di tích, tọa độ địa lý.
  - `/api/learning-paths/*`: Lộ trình học Phật, bài học theo cấp độ.
  - `/api/daily-practice/*`: Bài thực hành hằng ngày, câu suy ngẫm, bài tập chánh niệm.
  - `/api/meditation/*`: Phiên thiền trực tuyến, thiết lập âm thanh và thời gian.
  - `/api/audio/*`: Danh sách bài pháp thoại, kinh tụng, podcast.
  - `/api/videos/*`: Video bài giảng, tài liệu Phật giáo.
  - `/api/events/*`: Khóa tu, lễ hội, sự kiện Phật giáo.
  - `/api/groups/*`: Nhóm tu học, bài viết nhóm.
  - `/api/organizations/*`: Trang chính thức của Chùa/Viện, kiểm duyệt xác minh.
  - `/api/admin/*`: CMS quản trị, hàng đợi duyệt nội dung, thống kê thực tế, audit log.

### 2.3 Tầng Nghiệp vụ (Service & Logic Layer)
- Đặt tại `src/lib/services/`:
  - `auth.service.ts`: Xử lý băm mật khẩu (`bcryptjs`), tạo và giải mã JWT token.
  - `article.service.ts`: Kiểm tra dữ liệu bài viết, xử lý quy trình Draft -> Moderation -> Published.
  - `temple.service.ts`: Lọc theo tỉnh thành, tọa độ, trạng thái xác minh.
  - `practice.service.ts`: Lấy bài thực hành theo ngày, ghi nhận lịch sử cá nhân.
  - `map.service.ts`: Trừu tượng hóa bản đồ (`MapService`), cho phép linh hoạt giữa OpenStreetMap (Leaflet), Mapbox và Google Maps.

### 2.4 Tầng Dữ liệu (Database Access Layer)
- Đặt tại `src/lib/db/`:
  - `index.ts`: Khởi tạo PostgreSQL Connection Pool (`pg.Pool`) với cấu hình an toàn, tái sử dụng kết nối.
  - `migrate.ts`: Công cụ chạy migration SQL tự động, đảm bảo tính toàn vẹn và có thể tái tạo ở bất kỳ môi trường nào.
  - `seed.ts`: Bộ dữ liệu mẫu chuẩn (Realistic Demo Data) đánh dấu rõ ràng, phủ khắp các phân hệ.

---

## 3. Mô hình Phân quyền (RBAC - Role-Based Access Control)

Hệ thống xây dựng 8 cấp độ vai trò với nguyên tắc kiểm tra quyền tại cả Backend (API) và Frontend (UI):

1. **SUPER_ADMIN:** Toàn quyền hệ thống, quản lý tài khoản quản trị và cài đặt hệ thống.
2. **ADMIN:** Quản lý nội dung, duyệt chùa/tổ chức, phân bổ kiểm duyệt viên, xem thống kê & audit log.
3. **MODERATOR:** Tiếp nhận báo cáo, duyệt bài viết đang chờ (Pending), xử lý bình luận vi phạm.
4. **EDITOR:** Biên tập viên nội dung chính thức, xuất bản bài học, thư viện, bài viết nổi bật.
5. **VERIFIED_CONTRIBUTOR:** Tác giả, giảng sư, nhà nghiên cứu đã qua xác thực danh tính.
6. **ORGANIZATION_ADMIN:** Đại diện chính thức của Chùa, Thiền viện hoặc Hội Phật học.
7. **GROUP_ADMIN:** Trưởng nhóm cộng đồng tu học.
8. **USER:** Phật tử, độc giả đăng ký thông thường (đọc, bình luận, lưu trữ, tham gia thiền).

---

## 4. Mô hình Bảo mật (Security Model)

- **Mật khẩu:** Băm một chiều bằng `bcryptjs` với salt rounds = 10, không bao giờ lưu trữ dạng plain-text.
- **Biến môi trường:** Không commit `.env`, bảo vệ qua `.gitignore`. Đọc qua `process.env`.
- **Chống SQL Injection:** 100% câu truy vấn dùng cú pháp parameterized queries (`$1, $2, ...`), cấm nối chuỗi SQL thô.
- **Chống XSS:** Chuẩn hóa đầu vào, thoát ký tự đặc biệt, không sử dụng `dangerouslySetInnerHTML` với nội dung từ phía người dùng chưa qua sanitize.
- **Session & JWT:** Token ký số với thuật toán HS256, lưu trong cookie `httpOnly`, `sameSite: 'lax'`, `secure` trên production.
- **Audit Logs:** Mọi hành động kiểm duyệt (Duyệt, Từ chối, Xóa, Cảnh báo, Cấp quyền) đều được ghi vào bảng `audit_logs` và `moderation_logs`.

---

## 5. Tổ chức thư mục dự án (Source Layout)

```
c:/Users/qockh/Downloads/PhatPhap/
├── .agents/                    # Bộ kỹ năng AI & quy chuẩn UI/UX
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Route group: đăng nhập, đăng ký
│   │   ├── (main)/             # Layout chính với Header, Footer, Audio Player
│   │   │   ├── page.tsx        # Homepage chính
│   │   │   ├── bai-viet/       # Bài viết Phật pháp
│   │   │   ├── phap-thoai/     # Audio & Video pháp thoại
│   │   │   ├── chua-dia-danh/  # Bản đồ Chùa & Địa danh
│   │   │   ├── lo-trinh-hoc/   # Tuyến học Phật
│   │   │   ├── thuc-hanh/      # Thực hành hôm nay
│   │   │   ├── phong-thien/    # Phòng thiền trực tuyến
│   │   │   ├── hanh-trinh/     # Hành trình Phật giáo
│   │   │   ├── cong-dong/      # Nhóm & Thảo luận
│   │   │   ├── to-chuc/        # Trang chính thức Chùa
│   │   │   └── thu-vien/       # Tủ sách & Kinh điển
│   │   ├── admin/              # Bảng điều khiển CMS Admin
│   │   ├── api/                # API Endpoints
│   │   ├── globals.css         # Design tokens & CSS biến
│   │   └── layout.tsx          # Root Layout với Fonts & Context
│   ├── components/             # Reusable UI Components
│   │   ├── ui/                 # Button, Input, Modal, Card, Badge, Skeleton, EmptyState
│   │   ├── layout/             # Header, Navigation, Footer, MobileNav, SearchModal
│   │   ├── audio/              # Global Audio Player Bar
│   │   ├── home/               # Các khối chuyên biệt trên trang chủ
│   │   └── meditation/         # Bộ đếm thiền & Bộ tạo âm thanh
│   ├── lib/
│   │   ├── db/                 # Kết nối PostgreSQL, migrations, seeders
│   │   ├── services/           # Nghiệp vụ backend
│   │   ├── auth.ts             # Trợ cấp xác thực JWT
│   │   └── utils.ts            # Hàm tiện ích dùng chung
│   └── types/                  # TypeScript Data Types & Interfaces
├── database/
│   ├── migrations/             # Các file migration SQL có đánh version
│   └── seeds/                  # Dữ liệu hạt giống cho môi trường dev
├── .env.example                # File mẫu biến môi trường
├── .gitignore                  # Loại trừ .env, node_modules, build
├── AUDIT_REPORT.md             # Báo cáo audit hiện trạng
├── ARCHITECTURE.md             # Tài liệu kiến trúc này
├── DATABASE.md                 # Tài liệu thiết kế CSDL PostgreSQL
├── DESIGN-SYSTEM.md            # Tài liệu Design Tokens & Quy chuẩn UI/UX
└── ROADMAP.md                  # Lộ trình 7 Phase phát triển
```
