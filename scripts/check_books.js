const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE || 'phatphap',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function main() {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:', tables.rows.map(r => r.table_name));
  await pool.end();
}

main().catch(console.error);
