const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE || 'phatphap',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function run() {
  const res = await pool.query('SELECT id, title, chapters FROM books');
  for (const b of res.rows) {
    if (b.chapters) {
      // Normalize entire chapters JSON string to Unicode NFC
      const rawJson = JSON.stringify(b.chapters);
      const normalizedJson = rawJson.normalize('NFC');
      await pool.query('UPDATE books SET chapters = $1 WHERE id = $2', [normalizedJson, b.id]);
      console.log('Normalized book:', b.title);
    }
  }
  console.log('Finished normalizing all books to NFC!');
  await pool.end();
}

run().catch(console.error);
