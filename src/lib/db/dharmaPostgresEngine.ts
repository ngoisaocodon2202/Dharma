import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { Pool } from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

// Global singleton references so Next.js HMR does not recreate instances
const globalForDharmaPg = globalThis as unknown as {
  __dharmaPgliteInstance?: PGlite;
  __dharmaPgliteInitPromise?: Promise<PGlite>;
  __dharmaSocketServerStarted?: boolean;
  __dharmaRealtimeEmitter?: EventEmitter;
  __dharmaExternalPgPool?: Pool | null;
  __dharmaCheckedExternalPg?: boolean;
};

export function getDharmaRealtimeEmitter(): EventEmitter {
  if (!globalForDharmaPg.__dharmaRealtimeEmitter) {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(200);
    globalForDharmaPg.__dharmaRealtimeEmitter = emitter;
  }
  return globalForDharmaPg.__dharmaRealtimeEmitter;
}

export function broadcastDharmaRealtimeEvent(event: {
  type: 'prayer_created' | 'prayer_updated' | 'prayer_deleted' | 'prayer_coprayed' | 'sync_updated';
  roomType?: 'cau_an' | 'cau_sieu';
  payload?: unknown;
}) {
  try {
    const emitter = getDharmaRealtimeEmitter();
    emitter.emit('dharma_event', {
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // ignore broadcast error
  }
}

const PG_CONNECTION_STRING =
  process.env.DATABASE_URL || 'postgresql://postgres:220206@127.0.0.1:5432/phatphap';

const INITIAL_PRAYERS_SEED = [
  // Phòng Cầu Siêu
  {
    id: 'cs-seed-1',
    room_type: 'cau_sieu',
    user_id: 'system-seed',
    dharma_name: 'Phật tử Diệu Âm',
    sender_name: 'Trần Thị Diệu Âm',
    target_name: 'Cửu Huyền Thất Tổ & Hương linh Nội Ngoại',
    target_info: 'Tưởng niệm cố nhân',
    category: 'Siêu độ gia tiên',
    content:
      'Con đem công đức này hồi hướng cho ba mẹ, ông bà nội ngoại và tất cả vong linh mười phương pháp giới sớm tiêu trừ nghiệp chướng, vãng sanh Cực Lạc quốc.',
    co_pray_count: 142,
  },
  {
    id: 'cs-seed-2',
    room_type: 'cau_sieu',
    user_id: 'phat-tu-local',
    dharma_name: 'Ngọc Khai',
    sender_name: 'Phật tử Ngọc Khai',
    target_name: 'Oan gia trái chủ & Thân quyến nhiều đời',
    target_info: 'Hồi hướng Tây Phương',
    category: 'Giải trừ oán kết',
    content:
      'Con xin thành tâm hồi hướng công đức niệm Phật cho oan gia trái chủ và người thân quyến nhiều đời nhiều kiếp sớm nương ánh sáng từ bi Đức Phật A Di Đà siêu sinh Tịnh Độ.',
    co_pray_count: 89,
  },
  {
    id: 'cs-seed-3',
    room_type: 'cau_sieu',
    user_id: 'system-seed-2',
    dharma_name: 'Diệu Yến',
    sender_name: 'Nguyễn Diệu Yến',
    target_name: 'Hương linh Ông Nội Nguyễn Văn Hòa',
    target_info: 'Hưởng thọ 84 tuổi • Mất ngày 14/07 Âm lịch',
    category: 'Cầu siêu thân nhân',
    content:
      'Hồi hướng cho hương linh ông nội của con về miền an lành Cực Lạc. Nam Mô Tiếp Dẫn Đạo Sư A Di Đà Phật, Nam Mô Đại Nguyện Địa Tạng Vương Bồ Tát.',
    co_pray_count: 64,
  },
  {
    id: 'cs-seed-4',
    room_type: 'cau_sieu',
    user_id: 'system-seed-3',
    dharma_name: 'Minh Trí',
    sender_name: 'Lê Minh Trí',
    target_name: 'Hương linh Thân Phụ Lê Văn Tùng',
    target_info: 'Pháp danh Quảng Đức • Hưởng thọ 76 tuổi',
    category: 'Cầu siêu thân nhân',
    content:
      'Nguyện đem công đức tụng kinh Địa Tạng hồi hướng cho hương linh thân phụ vãng sinh Lạc Quốc, hoa sen báu nở thấy Phật ngộ Vô Sanh.',
    co_pray_count: 53,
  },
  // Phòng Cầu An
  {
    id: 'ca-seed-1',
    room_type: 'cau_an',
    user_id: 'phat-tu-local',
    dharma_name: 'Phật tử Ngọc Khai',
    sender_name: 'Ngọc Khai',
    target_name: 'Song thân phụ mẫu & Gia quyến nội ngoại',
    target_info: 'Cầu sức khỏe trường thọ & bình an',
    category: 'Sức khỏe cha mẹ',
    content:
      'Nam Mô Dược Sư Lưu Ly Quang Vương Phật. Con nguyện cầu hồng ân Tam Bảo gia hộ cho cha mẹ hiện tiền thân tâm thường an lạc, tật bệnh tiêu trừ, phước thọ tăng long.',
    co_pray_count: 168,
  },
  {
    id: 'ca-seed-2',
    room_type: 'cau_an',
    user_id: 'system-seed-4',
    dharma_name: 'Tâm Thanh',
    sender_name: 'Phạm Tâm Thanh',
    target_name: 'Gia đình Phật tử Tâm Thanh',
    target_info: 'Hòa thuận, chánh kiến, bình an',
    category: 'Bình an gia đạo',
    content:
      'Nguyện xin Đức Quán Thế Âm Bồ Tát từ bi che chở cho gia đình con luôn thuận hòa, giữ vững chánh niệm, vượt qua mọi chướng duyên bằng tâm từ ái.',
    co_pray_count: 112,
  },
  {
    id: 'ca-seed-3',
    room_type: 'cau_an',
    user_id: 'system-seed-5',
    dharma_name: 'Thiện Phúc',
    sender_name: 'Hoàng Thiện Phúc',
    target_name: 'Các bệnh nhân đang điều trị',
    target_info: 'Sớm bình phục thân tâm',
    category: 'Tiêu trừ bệnh khổ',
    content:
      'Con xin trì tụng Chú Dược Sư hồi hướng cho hết thảy những người đang đau yếu bệnh tật gặp thầy gặp thuốc, tâm không sợ hãi, sớm ngày bình phục.',
    co_pray_count: 95,
  },
  {
    id: 'ca-seed-4',
    room_type: 'cau_an',
    user_id: 'system-seed-6',
    dharma_name: 'Liên Hoa',
    sender_name: 'Vũ Thị Liên Hoa',
    target_name: 'Quốc thái dân an, mưa thuận gió hòa',
    target_info: 'Chúng sinh an cư lạc nghiệp',
    category: 'Quốc thái dân an',
    content:
      'Nguyện cầu mười phương Chư Phật gia hộ cho đất nước thái bình, thiên tai dịch bệnh lắng dịu, nhà nhà hướng thiện tu nhân tích đức.',
    co_pray_count: 204,
  },
];

const INITIAL_MEMORIALS_SEED = [
  {
    id: 'mem-seed-1',
    user_id: 'phat-tu-local',
    full_name: 'Cụ Ông Nguyễn Văn Phúc',
    dharma_name: 'Thiện Tâm',
    relationship: 'Ông nội',
    lunar_death_day: 15,
    lunar_death_month: 7,
    death_solar_year: 2012,
    burial_place: 'Nghĩa trang gia tộc quê nhà',
    notes: 'Chuẩn bị mâm cơm chay thanh tịnh, hoa sen trắng và tụng Kinh Địa Tạng Phẩm Thứ Bảy.',
    incense_offered_count: 18,
    bows_offered_count: 54,
  },
  {
    id: 'mem-seed-2',
    user_id: 'phat-tu-local',
    full_name: 'Cụ Bà Trần Thị Hiền',
    dharma_name: 'Diệu Liên',
    relationship: 'Bà ngoại',
    lunar_death_day: 24,
    lunar_death_month: 10,
    death_solar_year: 2018,
    burial_place: 'Tháp cốt Chùa Hoằng Pháp',
    notes: 'Lúc sinh thời bà rất thích nghe niệm Phật A Di Đà và dùng trà sen thanh khiết.',
    incense_offered_count: 27,
    bows_offered_count: 81,
  },
];

const INITIAL_NEW_FEATURES_SEED = [
  {
    id: 'feat-seed-1',
    feature_slug: 'so-phong-sinh',
    user_id: 'phat-tu-local',
    author_name: 'Phật tử Ngọc Khai',
    title: 'Phóng sinh 35 cá chép & cá trê ngày Rằm trên sông',
    subtitle: 'Chú nguyện Tam Quy & Niệm Phật A Di Đà',
    content: 'Thành tâm phóng sinh hộ mạng chúng sinh thủy tộc, nguyện cầu cha mẹ mạnh khỏe, gia đạo bình an.',
    metadata: JSON.stringify({ count: 35, species: 'Cá chép & cá trê', location: 'Bến sông thanh tịnh', date: '2026-11-01' }),
    likes_count: 42,
  },
  {
    id: 'feat-seed-2',
    feature_slug: 'nhat-ky-thien-nghiep',
    user_id: 'phat-tu-local',
    author_name: 'Phật tử Ngọc Khai',
    title: 'Giữ trọn Thập Thiện Nghiệp & Ăn chay thanh tịnh',
    subtitle: 'Thân: Không sát sinh • Khẩu: Ái ngữ • Ý:Từ bi',
    content: 'Hôm nay giữ tâm bình hòa khi gặp việc gấp, nói lời khích lệ đồng nghiệp và dành 15 phút tụng Bát Nhã Tâm Kinh.',
    metadata: JSON.stringify({ checkedVows: ['khong-sat-sinh', 'khong-vong-ngu', 'ai-ngu', 'khong-san-han', 'chanh-kien'], score: 100 }),
    likes_count: 28,
  },
  {
    id: 'feat-seed-3',
    feature_slug: 'cong-dong-hoi-huong',
    user_id: 'system-seed',
    author_name: 'Phật tử Diệu Hạnh',
    title: 'Xin đại chúng hộ niệm cho mẹ con vượt qua ca phẫu thuật',
    subtitle: 'Nam Mô Đại Bi Quán Thế Âm Bồ Tát',
    content: 'Mẹ con năm nay 72 tuổi chuẩn bị phẫu thuật tim vào tuần tới. Cúi xin quý đạo hữu đồng tu gửi một câu niệm Phật Dược Sư tiếp thêm năng lượng lành cho mẹ con.',
    metadata: JSON.stringify({ tag: 'Xin Hộ Niệm Sức Khỏe', lotusSent: 156 }),
    likes_count: 156,
  },
  {
    id: 'feat-seed-4',
    feature_slug: 'cong-dong-hoi-huong',
    user_id: 'system-seed-2',
    author_name: 'Phật tử Minh Đạo',
    title: 'Chia sẻ niềm vui hoàn thành 21 ngày tụng Kinh Địa Tạng',
    subtitle: 'Hồi hướng công đức cho khắp pháp giới chúng sinh',
    content: 'Sau 21 tối kiên trì đọc Kinh Địa Tạng theo chế độ tự cuộn chậm trên DHARMA, tâm mình lắng dịu hẳn, giấc ngủ sâu và gia đình êm ấm hơn rất nhiều.',
    metadata: JSON.stringify({ tag: 'Chia Sẻ Tu Học', lotusSent: 98 }),
    likes_count: 98,
  },
];

async function initSchemaAndSeed(execSql: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>) {
  const migrationPath = path.join(process.cwd(), 'database', 'migrations', '007_dharma_full_persistence.sql');
  if (fs.existsSync(migrationPath)) {
    const sqlText = fs.readFileSync(migrationPath, 'utf-8');
    // Execute statements sequentially
    const statements = sqlText
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await execSql(stmt);
    }
  }

  // Seed initial prayers if empty
  const countRes = await execSql('SELECT COUNT(*)::int AS cnt FROM dharma_prayers_realtime');
  const currentCount = Number(countRes.rows[0]?.cnt ?? 0);
  if (currentCount === 0) {
    for (const p of INITIAL_PRAYERS_SEED) {
      await execSql(
        `INSERT INTO dharma_prayers_realtime
          (id, room_type, user_id, dharma_name, sender_name, target_name, target_info, category, content, co_pray_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id,
          p.room_type,
          p.user_id,
          p.dharma_name,
          p.sender_name,
          p.target_name,
          p.target_info,
          p.category,
          p.content,
          p.co_pray_count,
        ]
      );
    }
  }

  // Seed initial ancestral memorials if empty
  const memRes = await execSql('SELECT COUNT(*)::int AS cnt FROM dharma_ancestral_memorials');
  if (Number(memRes.rows[0]?.cnt ?? 0) === 0) {
    for (const m of INITIAL_MEMORIALS_SEED) {
      await execSql(
        `INSERT INTO dharma_ancestral_memorials
          (id, user_id, full_name, dharma_name, relationship, lunar_death_day, lunar_death_month, death_solar_year, burial_place, notes, incense_offered_count, bows_offered_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`,
        [
          m.id,
          m.user_id,
          m.full_name,
          m.dharma_name,
          m.relationship,
          m.lunar_death_day,
          m.lunar_death_month,
          m.death_solar_year,
          m.burial_place,
          m.notes,
          m.incense_offered_count,
          m.bows_offered_count,
        ]
      );
    }
  }

  // Seed initial 8 new features records if empty
  const featRes = await execSql('SELECT COUNT(*)::int AS cnt FROM dharma_new_features_records');
  if (Number(featRes.rows[0]?.cnt ?? 0) === 0) {
    for (const f of INITIAL_NEW_FEATURES_SEED) {
      await execSql(
        `INSERT INTO dharma_new_features_records
          (id, feature_slug, user_id, author_name, title, subtitle, content, metadata, likes_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          f.id,
          f.feature_slug,
          f.user_id,
          f.author_name,
          f.title,
          f.subtitle,
          f.content,
          f.metadata,
          f.likes_count,
        ]
      );
    }
  }
}

async function getDharmaPgInstance(): Promise<PGlite> {
  if (globalForDharmaPg.__dharmaPgliteInstance) {
    return globalForDharmaPg.__dharmaPgliteInstance;
  }
  if (!globalForDharmaPg.__dharmaPgliteInitPromise) {
    globalForDharmaPg.__dharmaPgliteInitPromise = (async () => {
      const dataDir = path.join(process.cwd(), 'database', 'pgdata');
      fs.mkdirSync(dataDir, { recursive: true });
      const db = await PGlite.create(dataDir);

      await initSchemaAndSeed(async (sql, params) => {
        const res = await db.query(sql, params);
        return { rows: (res.rows as Record<string, unknown>[]) || [] };
      });

      // Also expose PostgreSQL wire protocol on 127.0.0.1:5432 if port 5432 is available
      if (!globalForDharmaPg.__dharmaSocketServerStarted) {
        globalForDharmaPg.__dharmaSocketServerStarted = true;
        try {
          const socketServer = new PGLiteSocketServer({
            db,
            port: Number(process.env.DB_PORT || 5432),
            host: process.env.DB_HOST || '127.0.0.1',
          });
          await socketServer.start();
        } catch {
          // Port 5432 is already bound by another PostgreSQL process or worker
        }
      }

      globalForDharmaPg.__dharmaPgliteInstance = db;
      return db;
    })();
  }
  return globalForDharmaPg.__dharmaPgliteInitPromise;
}

// Serialize queries through a lightweight promise queue so concurrent requests never collide
let queryQueue: Promise<unknown> = Promise.resolve();

export async function dharmaPgQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  const run = async (): Promise<{ rows: T[]; rowCount: number }> => {
    // 1. Try external native PostgreSQL service first if available on 127.0.0.1:5432 (and not our own embedded socket)
    if (!globalForDharmaPg.__dharmaCheckedExternalPg && !globalForDharmaPg.__dharmaPgliteInstance) {
      globalForDharmaPg.__dharmaCheckedExternalPg = true;
      try {
        const testPool = new Pool({
          connectionString: PG_CONNECTION_STRING,
          max: 10,
          connectionTimeoutMillis: 600,
        });
        await testPool.query('SELECT 1');
        await initSchemaAndSeed(async (s, p) => {
          const r = await testPool.query(s, p);
          return { rows: r.rows };
        });
        globalForDharmaPg.__dharmaExternalPgPool = testPool;
      } catch {
        globalForDharmaPg.__dharmaExternalPgPool = null;
      }
    }

    if (globalForDharmaPg.__dharmaExternalPgPool) {
      try {
        const res = await globalForDharmaPg.__dharmaExternalPgPool.query(sql, params);
        return { rows: res.rows as T[], rowCount: res.rowCount ?? res.rows.length };
      } catch {
        globalForDharmaPg.__dharmaExternalPgPool = null;
      }
    }

    // 2. Execute on persistent PostgreSQL 18 (PGlite) database in database/pgdata
    const db = await getDharmaPgInstance();
    const res = await db.query(sql, params);
    return {
      rows: (res.rows as T[]) || [],
      rowCount: res.affectedRows ?? (res.rows ? res.rows.length : 0),
    };
  };

  const next = queryQueue.then(run, run);
  queryQueue = next.catch(() => {});
  return next;
}

