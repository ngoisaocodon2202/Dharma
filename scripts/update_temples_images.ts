import { pool } from '../src/lib/db';

async function updateTemples() {
  const templeImages: Record<string, string> = {
    'chua-mot-cot-ha-noi': '/images/ancient_pagoda.jpg',
    'chua-tran-quoc-ha-noi': '/images/ancient_pagoda.jpg',
    'chua-huong-ha-noi': '/images/zen_garden.jpg',
    'chua-bai-dinh-ninh-binh': '/images/buddha_temple.jpg',
    'chua-tam-chuc-ha-nam': '/images/buddha_temple_serene.jpg',
    'thien-vien-truc-lam-yen-tu': '/images/tran_nhan_tong_yentu.jpg',
    'chua-linh-ung-bai-but-da-nang': '/images/quan_am_bodhisattva.jpg',
    'chua-thien-mu-hue': '/images/ancient_pagoda.jpg',
    'chua-buu-long-tp-hcm': '/images/buddha_temple.jpg',
    'chua-vinh-nghiem-tp-hcm': '/images/ancient_pagoda.jpg',
    'thien-vien-truc-lam-da-lat': '/images/buddha_temple_serene.jpg',
    'chua-hoang-phap-tp-hcm': '/images/monk_incense.jpg',
    'chua-quan-su-ha-noi': '/images/ancient_pagoda.jpg',
    'chua-keo-thai-binh': '/images/ancient_pagoda.jpg',
    'chua-long-son-khanh-hoa': '/images/golden_buddha.jpg',
    'bo-de-dao-trang-bodh-gaya': '/images/buddha_meditation.jpg',
  };

  for (const [slug, img] of Object.entries(templeImages)) {
    await pool.query('UPDATE temples SET cover_image = $1 WHERE slug = $2', [img, slug]);
    console.log(`Updated temple [${slug}] -> ${img}`);
  }

  console.log('All temples updated successfully!');
  process.exit(0);
}

updateTemples().catch((err) => {
  console.error(err);
  process.exit(1);
});
