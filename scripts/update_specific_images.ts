import { pool } from '../src/lib/db';

async function updateArticlesImages() {
  const updates: { slug: string; image: string }[] = [
    {
      slug: 'tu-dieu-de-bon-chan-ly-toi-hau',
      image: '/images/buddha_meditation.jpg',
    },
    {
      slug: 'quan-niem-hoi-tho-anapanasati-tro-ve-tu-than',
      image: '/images/lotus_blooming.jpg',
    },
    {
      slug: 'tinh-hoa-kinh-phap-cu-tam-y-lam-chu',
      image: '/images/tripitaka_koreana.jpg',
    },
    {
      slug: 'phat-hoang-tran-nhan-tong-tu-minh-quan-den-to-su',
      image: '/images/tran_nhan_tong_yentu.jpg',
    },
    {
      slug: 'hoa-giai-nong-gian-bang-ai-ngu-hon-nhan',
      image: '/images/mindfulness_peace.jpg',
    },
    {
      slug: 'nghe-thuat-tha-thu-buong-bo-oan-thu',
      image: '/images/quan_am_bodhisattva.jpg',
    },
    {
      slug: 'loi-phat-day-nguoi-cu-si-quan-ly-tai-chinh',
      image: '/images/ancient_pagoda.jpg',
    },
    {
      slug: 'cuoc-doi-di-san-thien-su-thich-nhat-hanh',
      image: '/images/thich_nhat_hanh.jpg',
    },
    {
      slug: 'bo-tat-thich-quang-duc-trai-tim-bat-diet',
      image: '/images/thich_quang_duc.jpg',
    },
    {
      slug: 'cu-si-tam-minh-le-dinh-tham-chan-hung-phat-giao',
      image: '/images/ancient_pagoda.jpg',
    },
    {
      slug: 'chuyen-chuyen-hoa-cua-doanh-nhan-tim-lai-chinh-minh',
      image: '/images/buddha_temple_serene.jpg',
    },
    {
      slug: 'nu-cuoi-an-nhien-nguoi-me-gia-niem-phat',
      image: '/images/golden_buddha.jpg',
    },
    {
      slug: 'nghiep-bao-luat-nhan-qua-lam-chu-so-phan',
      image: '/images/ancient_pagoda.jpg',
    },
    {
      slug: 'ngu-gioi-quy-bau-nen-tang-dao-duc-tai-gia',
      image: '/images/buddha_meditation.jpg',
    },
    {
      slug: 'thien-tra-tinh-thuc-uong-tra-cham-tinh-lang',
      image: '/images/zen_garden.jpg',
    },
    {
      slug: 'loi-phat-day-ve-bon-nguoi-ban-tot',
      image: '/images/mindfulness_peace.jpg',
    },
    {
      slug: 'vo-thuong-vo-nga-chia-khoa-tu-do',
      image: '/images/incense_smoke.jpg',
    },
    {
      slug: 'dao-phat-voi-stress-ap-luc-cong-so',
      image: '/images/monk_incense.jpg',
    },
    {
      slug: 'ung-xu-tinh-thuc-khi-bi-giem-pha-thi-phi',
      image: '/images/lotus_blooming.jpg',
    },
    {
      slug: 'nuoi-day-con-trong-tinh-than-tu-bi',
      image: '/images/quan_am_bodhisattva.jpg',
    },
  ];

  for (const item of updates) {
    const res = await pool.query(
      'UPDATE articles SET cover_image = $1 WHERE slug = $2 RETURNING id, title, cover_image',
      [item.image, item.slug]
    );
    if (res.rowCount && res.rowCount > 0) {
      console.log(`Updated [${item.slug}] -> ${item.image}`);
    } else {
      console.log(`Slug not found: ${item.slug}`);
    }
  }

  console.log('Update finished!');
  process.exit(0);
}

updateArticlesImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
