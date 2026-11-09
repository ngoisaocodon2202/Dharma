import React from 'react';
import { OmManiAppStoreHome } from '@/components/om-mani/OmManiAppStoreHome';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'DHARMA — Ánh Sáng Chánh Pháp | Không Gian Hành Trì & Kinh Điển',
  description:
    'Không gian tu học Phật pháp thanh tịnh: Thời khóa 4 thời, Kệ Pháp Cú mỗi ngày, Lịch Vạn Niên & Trai Giới, Mõ Tụng Kinh Tự Động và Tam Tạng Pháp Bảo.',
};

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#181207]">
      <OmManiAppStoreHome />
    </main>
  );
}
