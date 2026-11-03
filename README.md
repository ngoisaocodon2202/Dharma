# Phật Pháp — Cổng Thông Tin, Thư Viện Kinh Sách, Lịch Vạn Niên & Không Gian Thiền Định (Dharma Platform)

Nền tảng Phật giáo trực tuyến hiện đại được xây dựng với **Next.js 15 (App Router)**, **React 19**, **TypeScript** và **Tailwind CSS**, tích hợp đầy đủ dữ liệu kinh sách, lịch vạn niên Phật giáo, phân tích bản mệnh tham khảo theo Ngũ hành Nạp âm, phòng thiền trực tuyến và trợ lý AI Phật Pháp.

## Tính Năng Nổi Bật

- **Tủ Kinh Sách Phật Học 3D**: Đọc trọn bộ kinh sách Phật học nhiều chương/trang với hiệu ứng lật trang 3D chân thực và âm thanh lật giấy.
- **Lịch Vạn Niên & Nhắc Lịch Phật Giáo (`/lich-phat-giao`)**: Tra cứu Âm - Dương lịch, ngày Rằm/Mùng 1, vía Phật và lưu ngày Giỗ / ngày lễ quan trọng.
- **Phân Tích Bản Mệnh & Ngày Tốt Tham Khảo (`/tu-vi`)**: Nhập thông tin cá nhân để phân tích Ngũ hành Nạp âm, màu sắc tương sinh và ngày giờ hoàng đạo (thông tin tham khảo văn hóa phương Đông, hướng thiện và không mê tín dị đoan).
- **Không Gian Thực Hành Tâm Linh**: Thắp hương Tam Bảo trực tuyến, lần chuỗi hạt Bồ Đề 108 hạt (Mõ gỗ & Chuông đồng Web Audio), tụng kinh & nghe pháp thoại.
- **Đa Ngôn Ngữ (7 Ngôn Ngữ)**: Tiếng Việt, English, 中文, ภาษาไทย, 日本語, 한국어, हिन्दी kèm biểu tượng quốc kỳ SVG sắc nét.

## Cài Đặt & Chạy Dự Án

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển (http://localhost:3000)
npm run dev

# Build bản Production chuẩn Vercel
npm run build
npm start
```

## Triển Khai Lên Vercel

Dự án đã được tối ưu hóa hoàn toàn cho **Vercel**:
1. Import repository `https://github.com/ngoisaocodon2202/Dharma.git` vào [Vercel](https://vercel.com/new).
2. Giữ nguyên Framework Preset là **Next.js**.
3. Nhấn **Deploy** (Hệ thống tự động sử dụng bộ dữ liệu Phật học chuẩn hóa sẵn sàng 100% mà không bắt buộc cấu hình Database rời).

