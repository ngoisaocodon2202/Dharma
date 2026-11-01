# HỆ THỐNG THIẾT KẾ PHẬT PHÁP (DESIGN-SYSTEM.MD)
*Được biên soạn dựa trên tiêu chuẩn UI/UX Pro Max, Brand Guidelines và Token Architecture 3 tầng.*

---

## 1. Triết lý Thiết kế & Định vị Thương hiệu

- **Bản sắc cốt lõi:** Thanh tịnh — Trang nghiêm — Hiện đại — Tin cậy — Ấm áp — Tĩnh tại — Chiều sâu Văn hóa.
- **Tuyệt đối tránh (Anti-patterns):**
  - Tránh giao diện AI SaaS màu mè, bóng bẩy vô hồn.
  - Không sử dụng màu vàng neon, xanh lục neon, dải gradient gay gắt.
  - Không lạm dụng hiệu ứng kính mờ (glassmorphism) làm mỏi mắt và khó đọc văn bản.
  - Không làm bố cục dạng Crypto/Web3, Gaming hay template dashboard mặc định.
  - Tôn trọng không gian thở (Whitespace), đề cao trải nghiệm đọc bài viết văn bản dài (Editorial Reading Experience).

---

## 2. Hệ thống Biến màu (Color System Tokens)

### 2.1 Lớp Primitive (Giá trị gốc)

```css
:root {
  /* Buddhist Gold / Saffron - Hoàng y, ánh hào quang từ bi */
  --saffron-50:  #fdfaf3;
  --saffron-100: #faf2e2;
  --saffron-200: #f4e3c1;
  --saffron-300: #eacb95;
  --saffron-400: #deaf64;
  --saffron-500: #c5892f; /* Primary Base */
  --saffron-600: #b47828;
  --saffron-700: #8d5a1e;
  --saffron-800: #71471d;
  --saffron-900: #5d3b1b;

  /* Jade / Forest Green - Rừng trúc, thiền thất, an lạc */
  --jade-50:  #f2f8f5;
  --jade-100: #e2efe8;
  --jade-200: #c6dfd2;
  --jade-500: #2d6a4f; /* Secondary Base */
  --jade-700: #1b4332;
  --jade-900: #0d2219;

  /* Lotus Rose - Hoa sen hồng thanh tao, giác ngộ */
  --lotus-50:  #fdf5f6;
  --lotus-100: #fce8eb;
  --lotus-400: #d98894;
  --lotus-500: #c86d7a; /* Accent Base */
  --lotus-700: #9e4a57;

  /* Warm Ivory & Charcoal (Neutrals) */
  --ivory-50:  #fbf9f5; /* Warm background light */
  --ivory-100: #f5f0e8; /* Surface card */
  --ivory-200: #ece4d7; /* Border subtle */
  --ivory-300: #ded3c1;
  --charcoal-900: #151311; /* Dark mode bg */
  --charcoal-800: #1f1c18; /* Dark mode surface */
  --charcoal-700: #2c2824; /* Dark mode border */
  --charcoal-100: #ece6de; /* Dark mode text */
}
```

### 2.2 Lớp Semantic (Ánh xạ mục đích)

```css
:root {
  /* Light Mode */
  --bg-app: var(--ivory-50);
  --bg-surface: #ffffff;
  --bg-surface-soft: var(--ivory-100);
  --border-subtle: var(--ivory-200);
  --border-strong: var(--ivory-300);

  --text-main: #1f1d1a;
  --text-muted: #6b645b;
  --text-subtle: #968e83;

  --color-primary: var(--saffron-500);
  --color-primary-hover: var(--saffron-600);
  --color-primary-soft: var(--saffron-100);
  --color-primary-text: #ffffff;

  --color-secondary: var(--jade-500);
  --color-secondary-soft: var(--jade-50);

  --color-accent: var(--lotus-500);
  --color-accent-soft: var(--lotus-50);
}

.dark {
  /* Dark Mode - Ấm áp, tĩnh tại, không tương phản chói */
  --bg-app: var(--charcoal-900);
  --bg-surface: var(--charcoal-800);
  --bg-surface-soft: #27231f;
  --border-subtle: var(--charcoal-700);
  --border-strong: #3f3933;

  --text-main: var(--charcoal-100);
  --text-muted: #b0a99f;
  --text-subtle: #7d766d;

  --color-primary: #d4983e;
  --color-primary-hover: #e5a84e;
  --color-primary-soft: #2e2417;

  --color-secondary: #40916c;
  --color-secondary-soft: #142a20;

  --color-accent: #d98894;
  --color-accent-soft: #2d171b;
}
```

---

## 3. Hệ thống Typography (Chữ viết)

Hệ thống kết hợp cặp font được khuyến nghị cao nhất cho tiếng Việt và phong cách ấn bản Phật giáo:

- **Heading Font:** `Lora` (Google Fonts)
  - Phù hợp với: Tựa đề trang trọng, câu kinh Pháp Cú, trích dẫn triết lý, tựa đề bài viết.
  - Đặc tính: Serif thanh lịch, uyển chuyển, mang tính truyền thống và tâm linh.
- **Body & Controls Font:** `Be Vietnam Pro` (Google Fonts)
  - Phù hợp với: Nội dung bài đọc, thực đơn điều hướng, nhãn nút, bảng biểu, hệ thống nhập liệu.
  - Đặc tính: Được thiết kế riêng cho ngôn ngữ tiếng Việt với độ mở dấu thanh hoàn mỹ, đọc không bị mỏi mắt.
- **Quy chuẩn đọc bài viết (Article Reading Standards):**
  - Chiều rộng vùng đọc: Cố định từ `680px` đến `760px` ở màn hình desktop.
  - Cỡ chữ nội dung: `18px` (`1.125rem`) trên desktop, `16px` (`1rem`) trên mobile.
  - Độ giãn dòng (Line-height): `1.8` tạo sự thư thái, không vội vã.

---

## 4. Quy chuẩn Linh kiện (Components Specifications)

| Linh kiện | Thuộc tính Light | Thuộc tính Dark | Tương tác & Micro-interactions |
| :--- | :--- | :--- | :--- |
| **Button Primary** | Nền Vàng Saffron `#C5892F`, chữ trắng `#FFF` | Nền Vàng `#D4983E`, chữ `#151311` | Hover đậm 10%, lún nhẹ 1px khi active (`150ms`). |
| **Button Secondary** | Nền Xanh Jade `#2D6A4F`, chữ trắng `#FFF` | Nền Jade `#40916C`, chữ trắng | Hover tăng độ sáng, có hiệu ứng chuyển màu mượt mà. |
| **Button Ghost / Outline**| Viền `#ECE4D7`, chữ `#1F1D1A` | Viền `#2C2824`, chữ `#ECE6DE` | Hover nền sáng nhẹ, đường nét thanh tú. |
| **Article Card** | Nền `#FFF`, viền nhẹ `#F5F0E8`, bo tròn `12px` | Nền `#1F1C18`, viền `#2C2824` | Shadow êm dịu, hình ảnh zoom nhẹ 2% khi hover. |
| **Audio Bar** | Nền mờ kính ấm `rgba(251,249,245,0.95)`, viền trên | Nền kính ấm tối `rgba(21,19,17,0.95)` | Cố định chân màn hình, thanh tiến trình mềm mại. |
| **Meditation Timer** | Vòng tròn tối giản, đồng hồ đếm ngược tĩnh lặng | Tương tự với độ tương phản dịu nhẹ | Không hiệu ứng chớp nháy, âm thanh chuông ngân êm. |

---

## 5. Danh mục Trạng thái Bắt buộc (State Management Standards)

Mỗi mô-đun trong hệ thống đều phải triển khai trọn vẹn 5 trạng thái:
1. **Loading State:** Sử dụng Skeleton loading với màu nền ấm, không để trang trắng trơn.
2. **Success State:** Thông báo Toast trang nhã, không che khuất nội dung đang đọc.
3. **Empty State:** Hình minh họa nhẹ nhàng, thông điệp tích cực (Ví dụ: *"Chưa có bài viết nào trong chuyên mục này. Quý đạo hữu hãy quay lại sau."*).
4. **Error State:** Giải thích rõ ràng nguyên nhân, cung cấp nút "Thử lại" hoặc "Trở về Trang chủ".
5. **Disabled State:** Độ mờ 50%, con trỏ `not-allowed`, không nhận click.
