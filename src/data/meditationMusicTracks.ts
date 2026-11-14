export type MeditationMediaFormat = 'mp3' | 'mp4';

export interface MeditationTrack {
  id: string;
  title: string;
  subtitle: string;
  category: 'thien-thu-gian' | 'khong-loi' | 'video-thien';
  instrumentLabel: string;
  format: MeditationMediaFormat;
  durationSec: number;
  durationLabel: string;
  src: string;
  coverImage: string;
  recommendedHz: '432' | '528' | 'om';
}

export function formatMediaTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const MEDITATION_MEDIA_TRACKS: MeditationTrack[] = [
  {
    id: 'chuong-xoay-tay-tang',
    title: 'Chuông Xoay Tây Tạng & Thiên Âm',
    subtitle: 'Âm vang đồng minh tịnh hóa không gian, buông xả muộn phiền',
    category: 'thien-thu-gian',
    instrumentLabel: 'Chuông xoay • Thiên âm',
    format: 'mp3',
    durationSec: 118.5,
    durationLabel: '01:58',
    src: '/audio/meditation/chuong-xoay-tay-tang.mp3',
    coverImage: '/images/buddha_meditation.jpg',
    recommendedHz: '432',
  },
  {
    id: 'sao-truc-thien-tong',
    title: 'Sáo Trúc Thiền Tông Tĩnh Lặng',
    subtitle: 'Tiếng sáo trúc khoan thai giữa non ngàn giúp tâm an định',
    category: 'thien-thu-gian',
    instrumentLabel: 'Sáo trúc • Không lời',
    format: 'mp3',
    durationSec: 138,
    durationLabel: '02:18',
    src: '/audio/meditation/sao-truc-thien-tong.mp3',
    coverImage: '/images/zen_garden.jpg',
    recommendedHz: '528',
  },
  {
    id: 'piano-chuong-ngan',
    title: 'Piano Thiền & Chuông Ngân Sâu Lắng',
    subtitle: 'Giai điệu piano tối giản điểm tiếng chuông nhỏ cho giờ tọa thiền',
    category: 'khong-loi',
    instrumentLabel: 'Piano • Chuông ngân',
    format: 'mp3',
    durationSec: 150,
    durationLabel: '02:30',
    src: '/audio/meditation/piano-chuong-ngan.mp3',
    coverImage: '/images/temple_sanctuary_bg.jpg',
    recommendedHz: '432',
  },
  {
    id: 'an-tru-tinh-lac',
    title: 'Hòa Âm An Trú Tĩnh Lạc',
    subtitle: 'Nhạc không lời dịu êm hỗ trợ hít thở chánh niệm và thư giãn sâu',
    category: 'khong-loi',
    instrumentLabel: 'Piano ambient • Không lời',
    format: 'mp3',
    durationSec: 150,
    durationLabel: '02:30',
    src: '/audio/meditation/an-tru-tinh-lac.mp3',
    coverImage: '/images/mindfulness_peace.jpg',
    recommendedHz: '528',
  },
  {
    id: 'sao-truc-tinh-tam',
    title: 'Sáo Trúc Á Đông & Âm Vang Núi Rừng',
    subtitle: 'Khúc thiền ngắn nhẹ bẫng thích hợp niệm hơi thở hoặc uống trà',
    category: 'thien-thu-gian',
    instrumentLabel: 'Sáo trúc • Ambient',
    format: 'mp3',
    durationSec: 64,
    durationLabel: '01:04',
    src: '/audio/meditation/sao-truc-tinh-tam.mp3',
    coverImage: '/images/lotus_blooming.jpg',
    recommendedHz: 'om',
  },
  {
    id: 'tinh-tam-thien-dinh',
    title: 'Piano Thiền Định Đêm An Lành',
    subtitle: 'Tiết tấu chậm rãi vỗ về hệ thần kinh, dễ dàng đi vào giấc ngủ',
    category: 'khong-loi',
    instrumentLabel: 'Piano độc tấu • Không lời',
    format: 'mp3',
    durationSec: 150,
    durationLabel: '02:30',
    src: '/audio/meditation/tinh-tam-thien-dinh.mp3',
    coverImage: '/images/ancient_pagoda.jpg',
    recommendedHz: '432',
  },
  {
    id: 'hoa-tau-co-dien-tinh-lang',
    title: 'Hòa Tấu Sáo & Piano Tĩnh Tâm',
    subtitle: 'Bản hòa tấu cổ điển nhẹ nhàng mang năng lượng từ hòa lắng đọng',
    category: 'khong-loi',
    instrumentLabel: 'Sáo & Piano • Không lời',
    format: 'mp3',
    durationSec: 150,
    durationLabel: '02:30',
    src: '/audio/meditation/hoa-tau-co-dien-tinh-lang.mp3',
    coverImage: '/images/thich_nhat_hanh.jpg',
    recommendedHz: '528',
  },
  {
    id: 'video-sen-no-chuong-xoay',
    title: 'Video Thiền Đài Sen & Chuông Xoay',
    subtitle: 'Khung cảnh hoa sen sương sớm kèm tiếng chuông xoay Tây Tạng (.MP4)',
    category: 'video-thien',
    instrumentLabel: 'Video .MP4 • Chuông xoay',
    format: 'mp4',
    durationSec: 90,
    durationLabel: '01:30',
    src: '/video/meditation/sen-no-chuong-xoay.mp4',
    coverImage: '/images/lotus_blooming.jpg',
    recommendedHz: '432',
  },
  {
    id: 'video-vuon-thien-sao-truc',
    title: 'Video Vườn Thiền Tĩnh Lặng & Sáo Trúc',
    subtitle: 'Không gian thiền viện thanh tịnh cùng tiếng sáo trúc thư giãn (.MP4)',
    category: 'video-thien',
    instrumentLabel: 'Video .MP4 • Sáo trúc',
    format: 'mp4',
    durationSec: 90,
    durationLabel: '01:30',
    src: '/video/meditation/vuon-thien-sao-truc.mp4',
    coverImage: '/images/zen_garden.jpg',
    recommendedHz: '528',
  },
];

