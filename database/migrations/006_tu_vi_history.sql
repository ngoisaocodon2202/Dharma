-- MIGRATION 006: TU VI READINGS & HISTORY
-- PostgreSQL 18 Compatible

CREATE TABLE IF NOT EXISTS tu_vi_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- 'Nam' | 'Nữ'
  birth_date VARCHAR(50) NOT NULL,
  birth_hour VARCHAR(50) NOT NULL,
  calendar_type VARCHAR(20) DEFAULT 'solar',
  view_year INT DEFAULT 2026,
  focus_area VARCHAR(100) DEFAULT 'tong_quan',
  can_chi VARCHAR(100),
  menh VARCHAR(100),
  cung VARCHAR(100),
  reading_result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tu_vi_history_user ON tu_vi_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tu_vi_history_created ON tu_vi_history(created_at DESC);
