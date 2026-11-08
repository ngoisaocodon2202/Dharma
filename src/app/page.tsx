import React from 'react';
import { OmManiAppStoreHome } from '@/components/om-mani/OmManiAppStoreHome';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Phật Pháp — Bồ Đề Tâm | Cổng Thông Tin & Không Gian Tu Tập Online',
  description:
    'Không gian tu tập thanh tịnh trực tuyến: Lịch Vạn Niên, Đi Chùa Online, Thỉnh Chuông, Niệm Phật Tràng Hạt, Thiền Định & Kinh Sách Phật Giáo.',
};

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#110D0A]">
      <OmManiAppStoreHome />
    </main>
  );
}
