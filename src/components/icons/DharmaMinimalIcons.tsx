'use client';

import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Bánh Xe Pháp Luân 8 Nan Tối Giản (8-Spoke Dharma Wheel)
 */
export const DharmaWheelIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.2" />
    <line x1="12" y1="2" x2="12" y2="9.8" />
    <line x1="12" y1="14.2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="9.8" y2="12" />
    <line x1="14.2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="10.44" y2="10.44" />
    <line x1="13.56" y1="13.56" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="13.56" y2="10.44" />
    <line x1="10.44" y1="13.56" x2="4.93" y2="19.07" />
  </svg>
);

/**
 * 2. Đóa Sen Thanh Tịnh Nét Mảnh (Minimalist Sacred Lotus)
 */
export const LotusMinimalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3C9.5 6.8 8.5 10.5 12 16C15.5 10.5 14.5 6.8 12 3Z" />
    <path d="M12 16C8 14.5 5 11.5 5.5 7C8 8 10 10.5 12 16Z" />
    <path d="M12 16C16 14.5 19 11.5 18.5 7C16 8 14 10.5 12 16Z" />
    <path d="M12 16C6.5 16.5 3 14.5 2 11.5C5.2 11.2 8.2 13 12 16Z" />
    <path d="M12 16C17.5 16.5 21 14.5 22 11.5C18.8 11.2 15.8 13 12 16Z" />
    <path d="M5 19.5C7.5 18.2 16.5 18.2 19 19.5" />
  </svg>
);

/**
 * 3. Đại Hồng Chung / Chuông Chùa (Ancient Temple Bell)
 */
export const TempleBellIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 3h4" />
    <path d="M12 3v2" />
    <path d="M6 15c0-5 2.5-9 6-9s6 4 6 9l1.5 3H4.5L6 15Z" />
    <path d="M9 12h6" />
    <path d="M10.5 18a1.5 1.5 0 0 0 3 0" />
  </svg>
);

/**
 * 4. Mõ Tụng Kinh Tối Giản (Traditional Wooden Fish)
 */
export const WoodenFishMinimalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 13c0-4.4 3.8-8 8.5-8 4.2 0 7.5 3 7.5 7 0 3.5-2.8 6-6.5 6H7.5C5.5 18 4 15.8 4 13Z" />
    <circle cx="9.5" cy="11.5" r="1.2" />
    <path d="M4.5 14.5h6.5" />
    <path d="M6 20.5h12" />
  </svg>
);

/**
 * 5. Tràng Hạt 108 Hạt Tối Giản (108 Mala Prayer Beads)
 */
export const MalaBeadsMinimalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="10.5" r="6.5" strokeDasharray="1.8 2.8" />
    <circle cx="12" cy="17.5" r="1.6" />
    <path d="M12 19.1v3.2" />
    <path d="M10.2 21.8L12 20l1.8 1.8" />
  </svg>
);

/**
 * 6. Lư Hương Tam Bảo (Three-Stick Incense Altar Censer)
 */
export const IncenseAltarIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 4v8" />
    <path d="M9 5.5L9.8 12" />
    <path d="M15 5.5L14.2 12" />
    <path d="M6 12h12l-1.2 6.5a2 2 0 0 1-2 1.5H9.2a2 2 0 0 1-2-1.5L6 12Z" />
    <path d="M8 20v1.5" />
    <path d="M16 20v1.5" />
  </svg>
);

/**
 * 7. Thiền Giả Tọa Thiền Nét Mảnh (Meditating Practitioner Outline)
 */
export const MeditatingMonkOutlineIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="5.5" r="2.2" />
    <path d="M12 2.5v0.8" />
    <path d="M8 15l1-4.5c.3-1.2 1.4-2 2.6-2h.8c1.2 0 2.3.8 2.6 2l1 4.5" />
    <path d="M5.5 18.5c0-1.8 2.5-3 6.5-3s6.5 1.2 6.5 3c0 1.2-1.5 2-3.5 2h-6c-2 0-3.5-.8-3.5-2Z" />
  </svg>
);

/**
 * 8. Kinh Văn Tam Tạng (Sutra Scripture Scroll)
 */
export const SutraScrollIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
    <path d="M8 4v16" />
    <path d="M12 8h4" />
    <path d="M12 12h4" />
    <path d="M12 16h2.5" />
  </svg>
);

/**
 * 9. Lá Bồ Đề Giác Ngộ (Sacred Bodhi Leaf)
 */
export const BodhiLeafIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2.5C12 2.5 5 8 5 13.8a7 7 0 0 0 14 0C19 8 12 2.5 12 2.5Z" />
    <path d="M12 7v14.5" />
    <path d="M12 11l-3-2" />
    <path d="M12 14l3.5-2.2" />
    <path d="M12 16.5l-3.2-2" />
  </svg>
);

/**
 * 10. Đèn Hoa Đăng Cầu Nguyện (Sacred Lotus Lantern)
 */
export const LotusLanternIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 4c-1.5 2-2 3.8 0 5.5 2-1.7 1.5-3.5 0-5.5Z" />
    <path d="M12 17C8.5 15.8 6 13 6.5 9.5 8.8 10.5 10.5 12.5 12 17Z" />
    <path d="M12 17c3.5-1.2 6-4 5.5-7.5-2.3 1-4 3-5.5 7.5Z" />
    <path d="M4 19.5c3.5-1 12.5-1 16 0" />
  </svg>
);

/**
 * 11. Bình Bát Trai Giới (Monastic Alms Bowl)
 */
export const AlmsBowlIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4.5 10h15" />
    <path d="M3.5 10c0 5.2 3.8 8.5 8.5 8.5s8.5-3.3 8.5-8.5" />
    <path d="M6.5 7.5h11" />
    <path d="M8.5 20.5h7" />
  </svg>
);

/**
 * 12. Chùa Cổ / Bảo Tháp Nét Mảnh (Ancient Pagoda Outline)
 */
export const PagodaMinimalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v3" />
    <path d="M6 8c2-1.5 10-1.5 12 0" />
    <path d="M8 8v4h8V8" />
    <path d="M4 12c2.5-1.5 13.5-1.5 16 0" />
    <path d="M6.5 12v8h11v-8" />
    <path d="M10.5 20v-4h3v4" />
    <path d="M3 20h18" />
  </svg>
);

