import { pool } from '../src/lib/db';

async function main() {
  await pool.query("UPDATE articles SET cover_image = '/images/bo_tat_thich_quang_duc.jpg' WHERE slug = 'bo-tat-thich-quang-duc-trai-tim-bat-diet'");
  const res = await pool.query(`
    SELECT id, title, slug, cover_image, category_id, published_at
    FROM articles 
    ORDER BY id ASC
  `);
  console.log('--- ALL ARTICLES ---');
  for (const r of res.rows) {
    console.log(`[${r.slug}] -> [${r.cover_image}] ${r.title}`);
  }

  const allImages = await pool.query(`
    SELECT DISTINCT cover_image, count(*) 
    FROM articles 
    GROUP BY cover_image
  `);
  console.log('\n--- COVER IMAGE COUNTS ---');
  for (const r of allImages.rows) {
    console.log(`${r.cover_image}: ${r.count}`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
