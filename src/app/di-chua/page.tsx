import type { Metadata } from 'next';
import { TempleSanctuary } from '@/components/sanctuary/TempleSanctuary';

export const metadata: Metadata = {
  title: 'Đi Chùa 3D — Chánh Điện 100 Bồ Đoàn | DHARMA',
  description:
    'Không gian Chánh Điện 3D trang nghiêm: 100 bồ đoàn, thỉnh Đại Hồng Chung, đảnh lễ Tam Bảo, tụng kinh theo mõ, lần chuỗi 108 hạt và thả hoa đăng hồ sen.',
};

export default function DiChuaPage() {
  return <TempleSanctuary />;
}

