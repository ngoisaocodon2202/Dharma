import React from 'react';
import { DharmaHomeView } from '@/components/dharma/DharmaHomeView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'DHARMA — Liên Hoa Đài & Không Gian Chánh Niệm',
  description:
    'Ứng dụng tu tập chánh niệm hằng ngày: Nhật Lịch Cát Tường, Pháp Khí Tu Tập, Tam Tạng Kinh Điển, Phòng Cầu An & Cầu Siêu.',
};

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF7F0] text-[#2C1E10]">
      <DharmaHomeView />
    </div>
  );
}
