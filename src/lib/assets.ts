// Centralized Sacred Asset Registry — Zero Duplicated Images Across Categories

export const BUDDHA_ASSETS = {
  'thich-ca': '/images/buddhas/duc-phat-thich-ca.png',
  'duoc-su': '/images/buddhas/duc-phat-duoc-su.png',
  'a-di-da': '/images/buddhas/duc-phat-a-di-da.png',
  'quan-am': '/images/buddhas/quan-the-am-bo-tat.png',
  'dia-tang': '/images/buddhas/dia-tang-vuong-bo-tat.png',
} as const;

export const PAGODA_ASSETS: Record<string, string> = {
  'chua-mot-cot': '/images/pagodas/chua-mot-cot.jpg',
  'chua-bai-dinh': '/images/pagodas/chua-bai-dinh.jpg',
  'thien-vien-truc-lam-yen-tu': '/images/pagodas/thien-vien-truc-lam-yen-tu.jpg',
  'chua-huong': '/images/pagodas/chua-huong.jpg',
  'chua-tay-phuong': '/images/pagodas/chua-tay-phuong.svg',
  'chua-but-thap': '/images/pagodas/chua-but-thap.svg',
  'chua-dau': '/images/pagodas/chua-dau.svg',

  'chua-thien-mu': '/images/pagodas/chua-thien-mu.jpg',
  'chua-tu-dam': '/images/pagodas/chua-tu-dam.svg',
  'chua-huyen-khong-son-thuong': '/images/pagodas/chua-huyen-khong-son-thuong.svg',
  'chua-linh-ung-son-tra': '/images/pagodas/chua-linh-ung-son-tra.svg',
  'thien-vien-truc-lam-da-lat': '/images/pagodas/thien-vien-truc-lam-da-lat.svg',
  'chua-thien-hung': '/images/pagodas/chua-thien-hung.svg',

  'chua-vinh-nghiem': '/images/pagodas/chua-vinh-nghiem.jpg',
  'chua-giac-lam': '/images/pagodas/chua-giac-lam.jpg',
  'chua-hoang-phap': '/images/pagodas/chua-hoang-phap.svg',
  'chua-xa-loi': '/images/pagodas/chua-xa-loi.svg',
  'chua-buu-long': '/images/pagodas/chua-buu-long.svg',
  'chua-ba-den-linh-son': '/images/pagodas/chua-ba-den-linh-son.svg',
};

export const ARTICLE_ASSETS: Record<string, string> = {
  '5-quan-niem-buoi-sang': '/images/articles/5-quan-niem-buoi-sang.jpg',
  'hoa-giai-lo-au-bang-hoi-tho': '/images/articles/hoa-giai-lo-au-bang-hoi-tho.jpg',
  'luat-nhan-qua-trong-loi-noi': '/images/articles/luat-nhan-qua-trong-loi-noi.jpg',
  'dao-hieu-va-bao-an': '/images/articles/dao-hieu-va-bao-an.jpg',
  'buong-xa-chap-nga': '/images/articles/buong-xa-chap-nga.jpg',
  'y-nghia-an-chay-trai-gioi': '/images/articles/y-nghia-an-chay-trai-gioi.jpg',
  'thien-trong-cong-viec': '/images/articles/thien-trong-cong-viec.jpg',
  'cong-duc-tung-kinh-duoc-su': '/images/articles/cong-duc-tung-kinh-duoc-su.jpg',
};

export const HERO_BANNER_ASSETS = {
  bannerHero: '/images/dharma_hero.jpg',
  bannerLunar: '/images/pagodas/chua-thien-mu.jpg',
  bannerPractice: '/images/golden_buddha_altar.jpg',
} as const;

export const SACRED_MANDALA_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#FFF8E1"/><circle cx="200" cy="200" r="140" fill="none" stroke="#D9A02E" stroke-width="2" stroke-dasharray="6 6"/><circle cx="200" cy="200" r="90" fill="none" stroke="#B67C13" stroke-width="1.5"/><text x="200" y="208" text-anchor="middle" font-family="serif" font-size="22" fill="#8C5500">DHARMA • OM</text></svg>`
  );

export function getPagodaImage(slug: string): string {
  return PAGODA_ASSETS[slug] || PAGODA_ASSETS['chua-mot-cot'];
}

export function getArticleImage(slug: string): string {
  return ARTICLE_ASSETS[slug] || ARTICLE_ASSETS['5-quan-niem-buoi-sang'];
}

