import fs from 'fs';
import path from 'path';
import { pool } from './index';

async function runMigrations() {
  console.log('--- BẮT ĐẦU CHẠY MIGRATION DATABASE PHẬT PHÁP ---');
  const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Không tìm thấy thư mục migration tại: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`Đang thực thi migration: ${file}...`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    try {
      await pool.query(sql);
      console.log(`✓ Migration ${file} thành công.`);
    } catch (err) {
      console.error(`✕ Lỗi khi thực thi migration ${file}:`, err);
      process.exit(1);
    }
  }

  console.log('--- HOÀN TẤT MIGRATION TOÀN BỘ CƠ SỞ DỮ LIỆU ---');
  await pool.end();
}

runMigrations().catch(err => {
  console.error('Lỗi ngoài dự kiến trong quá trình migration:', err);
  process.exit(1);
});
