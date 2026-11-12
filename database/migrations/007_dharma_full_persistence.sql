-- ============================================================================
-- MIGRATION 007: DHARMA FULL POSTGRESQL PERSISTENCE & REAL-TIME ENGINE
-- Database: phatphap (PostgreSQL user: postgres / password: 220206)
-- ============================================================================

-- 1. Real-Time Phòng Cầu An & Phòng Cầu Siêu
CREATE TABLE IF NOT EXISTS dharma_prayers_realtime (
  id VARCHAR(80) PRIMARY KEY,
  room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('cau_an', 'cau_sieu')),
  user_id VARCHAR(100) NOT NULL DEFAULT 'phat-tu-local',
  dharma_name VARCHAR(150) NOT NULL DEFAULT 'Phật tử Thiện Tâm',
  sender_name VARCHAR(150) NOT NULL DEFAULT '',
  target_name VARCHAR(200) NOT NULL DEFAULT '',
  target_info VARCHAR(200) NOT NULL DEFAULT '',
  category VARCHAR(80) NOT NULL DEFAULT 'Bình an gia đạo',
  content TEXT NOT NULL,
  co_pray_count INT NOT NULL DEFAULT 1,
  is_reported BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dharma_prayers_room_created
  ON dharma_prayers_realtime (room_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dharma_prayers_user
  ON dharma_prayers_realtime (user_id, room_type);

-- 2. Lượt "Cùng hồi hướng / Hộ niệm" Real-time
CREATE TABLE IF NOT EXISTS dharma_prayer_reactions (
  id VARCHAR(100) PRIMARY KEY,
  prayer_id VARCHAR(80) NOT NULL,
  actor_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Sổ Giỗ Chạp & Bài Vị Cửu Huyền Thất Tổ
CREATE TABLE IF NOT EXISTS dharma_ancestral_memorials (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL DEFAULT 'phat-tu-local',
  full_name VARCHAR(200) NOT NULL,
  dharma_name VARCHAR(150) NOT NULL DEFAULT '',
  relationship VARCHAR(100) NOT NULL,
  lunar_death_day INT NOT NULL CHECK (lunar_death_day BETWEEN 1 AND 30),
  lunar_death_month INT NOT NULL CHECK (lunar_death_month BETWEEN 1 AND 12),
  death_solar_year INT,
  burial_place TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  incense_offered_count INT NOT NULL DEFAULT 0,
  bows_offered_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Sổ Công Đức & Nhật Ký Hành Trì
CREATE TABLE IF NOT EXISTS dharma_merit_logs (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL DEFAULT 'phat-tu-local',
  date_key VARCHAR(20) NOT NULL,
  tool_slug VARCHAR(60) NOT NULL,
  title VARCHAR(255) NOT NULL,
  detail TEXT NOT NULL,
  dedication_target TEXT NOT NULL DEFAULT '',
  duration_minutes INT NOT NULL DEFAULT 5,
  count_value INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dharma_merit_date
  ON dharma_merit_logs (date_key DESC, created_at DESC);

-- 5. Dữ Liệu 8 Tính Năng Mới (Phóng Sinh, Thập Thiện, Chép Kinh, Xin Xăm, Vườn Sen Đồng Tu, Lạy 108 Phật...)
CREATE TABLE IF NOT EXISTS dharma_new_features_records (
  id VARCHAR(100) PRIMARY KEY,
  feature_slug VARCHAR(60) NOT NULL,
  user_id VARCHAR(100) NOT NULL DEFAULT 'phat-tu-local',
  author_name VARCHAR(150) NOT NULL DEFAULT 'Phật tử Thiện Tâm',
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dharma_features_slug
  ON dharma_new_features_records (feature_slug, created_at DESC);

-- 6. Bảng Đồng Bộ Toàn Trạng Thái Ứng Dụng (KV Store trên PostgreSQL)
CREATE TABLE IF NOT EXISTS dharma_user_kv_store (
  store_key VARCHAR(120) PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

