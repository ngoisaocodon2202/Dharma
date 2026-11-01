'use client';

import React, { useState } from 'react';
import { OmManiHeroBanner } from './OmManiHeroBanner';
import { OmManiAppGrid } from './OmManiAppGrid';
import { OmManiAltarSection } from './OmManiAltarSection';
import { OmManiMandalaHub } from './OmManiMandalaHub';
import { OmManiBuddhasCarousel } from './OmManiBuddhasCarousel';
import { OmManiMantrasSection } from './OmManiMantrasSection';
import { IncenseOfferingModal, MalaBeadsModal } from './OmManiInteractiveTools';
import { Smartphone, Monitor } from 'lucide-react';

export function OmManiHomeClient() {
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isMalaOpen, setIsMalaOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Banner: OM MANI - Phật Giáo Toàn Cầu */}
      <OmManiHeroBanner
        onOpenIncense={() => setIsIncenseOpen(true)}
        onOpenMala={() => setIsMalaOpen(true)}
      />

      {/* 2. Ứng Dụng & Tiện Ích Phật Pháp (Icon Grid) */}
      <OmManiAppGrid
        onOpenIncense={() => setIsIncenseOpen(true)}
        onOpenMala={() => setIsMalaOpen(true)}
      />

      {/* 3. Thành Tâm Niệm Phật & Bàn Thờ Tam Bảo Trực Tuyến */}
      <OmManiAltarSection
        onOpenIncense={() => setIsIncenseOpen(true)}
        onOpenMala={() => setIsMalaOpen(true)}
      />

      {/* 4. Tu Tập - Nuôi Dưỡng Thiện Lành Mỗi Ngày (Mandala Hub) */}
      <OmManiMandalaHub />

      {/* 5. Chư Phật & Chư Bồ Tát - Thành Tâm Đảnh Lễ (Horizontal Avatars) */}
      <OmManiBuddhasCarousel />

      {/* 6. Minh Chú & Thần Chú Tuyển Chọn (Om Mani Padme Hum, Om Ah Hum...) */}
      <OmManiMantrasSection />

      {/* Interactive Modals */}
      <IncenseOfferingModal
        isOpen={isIncenseOpen}
        onClose={() => setIsIncenseOpen(false)}
      />
      <MalaBeadsModal
        isOpen={isMalaOpen}
        onClose={() => setIsMalaOpen(false)}
      />
    </div>
  );
}
