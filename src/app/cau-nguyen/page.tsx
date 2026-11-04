import type { Metadata } from 'next';
import { TempleSanctuary } from '@/components/sanctuary/TempleSanctuary';

export const metadata: Metadata = {
  title: 'Cầu Nguyện Online — Không Gian Đi Chùa & Cầu Nguyện Tam Bảo',
  description:
    'Không gian đi chùa online thanh tịnh: Thắp nhang bái Phật, thỉnh Đại Hồng Chung, đọc tụng kinh điển và dâng lời cầu nguyện an lành cho gia đình.',
};

export default function CauNguyenPage() {
  return <TempleSanctuary />;
}

