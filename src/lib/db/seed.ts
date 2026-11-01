import fs from 'fs';
import path from 'path';
import { pool } from './index';

async function runSeeds() {
  console.log('--- BẮT ĐẦU NẠP DỮ LIỆU SEED CHO HỆ THỐNG PHẬT PHÁP ---');
  const seedsDir = path.join(process.cwd(), 'database', 'seeds');
  
  if (!fs.existsSync(seedsDir)) {
    console.error(`Không tìm thấy thư mục seed tại: ${seedsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    console.log(`Đang nạp dữ liệu từ: ${file}...`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    try {
      await pool.query(sql);
      console.log(`✓ Nạp seed ${file} thành công.`);
    } catch (err) {
      console.error(`✕ Lỗi khi nạp seed ${file}:`, err);
      process.exit(1);
    }
  }

  console.log('--- HOÀN TẤT NẠP TOÀN BỘ SEED DATA CHUẨN ---');
  await pool.end();
}

runSeeds().catch(err => {
  console.error('Lỗi ngoài dự kiến trong quá trình nạp seed:', err);
  process.exit(1);
});
