-- MIGRATION 001: INITIAL SCHEMA FOR BUDDHIST PLATFORM (PHAT PHAP)
-- PostgreSQL 18 Compatible

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES & RBAC
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id VARCHAR(50) NOT NULL REFERENCES roles(id) DEFAULT 'USER',
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  dharma_name VARCHAR(100),
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  province VARCHAR(100),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. ARTICLE CATEGORIES
CREATE TABLE IF NOT EXISTS article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. TAGS
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(60) UNIQUE NOT NULL
);

-- 6. ARTICLES
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID NOT NULL REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES article_categories(id),
  reading_time_minutes INT DEFAULT 5,
  status VARCHAR(30) DEFAULT 'DRAFT', -- DRAFT, PENDING_REVIEW, PUBLISHED, REJECTED
  rejection_reason TEXT,
  view_count BIGINT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- 7. ARTICLE TAGS
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 8. COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'APPROVED', -- APPROVED, PENDING, HIDDEN
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- 9. BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- ARTICLE, VIDEO, AUDIO, TEMPLE, BOOK, JOURNEY
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, entity_type, entity_id)
);

-- 10. FOLLOWS
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (follower_id, following_id)
);

-- 11. AUDIO (PHAP THOAI, KINH TUNG, THIEN, PODCAST)
CREATE TABLE IF NOT EXISTS audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  speaker VARCHAR(150) NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  category VARCHAR(50) DEFAULT 'PHAP_THOAI', -- PHAP_THOAI, KINH_TUNG, THIEN, PODCAST
  cover_image TEXT,
  description TEXT,
  listen_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. VIDEOS (BAI GIANG, THIỀN, PHIM TAI LIEU)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  speaker VARCHAR(150) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  category VARCHAR(50) DEFAULT 'PHAP_THOAI',
  description TEXT,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. TEMPLES & SACRED PLACES
CREATE TABLE IF NOT EXISTS temples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  category VARCHAR(50) DEFAULT 'CHUA', -- CHUA, THIEN_VIEN, TINH_XA, TU_VIEN, DI_TICH
  tradition VARCHAR(100), -- Bắc tông, Nam tông, Khất sĩ, Trúc Lâm Yên Tử
  abbot_name VARCHAR(150),
  address VARCHAR(300) NOT NULL,
  province VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  cover_image TEXT,
  description TEXT NOT NULL,
  history TEXT,
  phone VARCHAR(30),
  website VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. EVENTS & RETREATS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  temple_id UUID REFERENCES temples(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location VARCHAR(255) NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  max_attendees INT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. DAILY PRACTICES
CREATE TABLE IF NOT EXISTS daily_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_date DATE UNIQUE NOT NULL,
  mindful_quote TEXT NOT NULL,
  quote_source VARCHAR(150),
  reflection_text TEXT NOT NULL,
  mindful_action VARCHAR(255) NOT NULL,
  audio_id UUID REFERENCES audio(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. LEARNING PATHS & MODULES
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(50) DEFAULT 'BEGINNER', -- BEGINNER, INTERMEDIATE, ADVANCED
  icon_name VARCHAR(50),
  estimated_hours INT DEFAULT 10,
  total_modules INT DEFAULT 5,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_path_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  content TEXT,
  duration_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. MEDITATION PRESETS & SESSIONS
CREATE TABLE IF NOT EXISTS meditation_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  duration_seconds INT NOT NULL,
  bell_interval_seconds INT,
  sound_type VARCHAR(50) DEFAULT 'BELL', -- BELL, RAIN, FOREST, SILENCE
  description TEXT
);

CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  duration_seconds INT NOT NULL,
  sound_type VARCHAR(50) DEFAULT 'BELL',
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. BUDDHIST JOURNEYS
CREATE TABLE IF NOT EXISTS buddhist_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  cover_image TEXT,
  description TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  estimated_days INT DEFAULT 2,
  total_distance_km INT,
  status VARCHAR(30) DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buddhist_journey_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES buddhist_journeys(id) ON DELETE CASCADE,
  temple_id UUID REFERENCES temples(id) ON DELETE SET NULL,
  stop_order INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  note TEXT
);

-- 19. ORGANIZATIONS & VERIFICATION
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  org_type VARCHAR(50) DEFAULT 'CHUA',
  logo_url TEXT,
  cover_url TEXT,
  description TEXT NOT NULL,
  address VARCHAR(300) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  website VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. COMMUNITY GROUPS
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  privacy VARCHAR(20) DEFAULT 'PUBLIC', -- PUBLIC, PRIVATE, RESTRICTED
  owner_id UUID NOT NULL REFERENCES users(id),
  member_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 21. Q&A QUESTIONS & ANSWERS
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'APPROVED',
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 22. SACRED BOOKS & LIBRARY
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(150) NOT NULL,
  translator VARCHAR(150),
  cover_image TEXT,
  description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'KINH_DIEN',
  total_pages INT,
  published_year INT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 23. REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  reason VARCHAR(100) NOT NULL,
  details TEXT,
  status VARCHAR(30) DEFAULT 'PENDING',
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  reason TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_articles_status_pub ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_temples_province ON temples(province);
CREATE INDEX IF NOT EXISTS idx_temples_verified ON temples(is_verified);
CREATE INDEX IF NOT EXISTS idx_audio_category ON audio(category);
CREATE INDEX IF NOT EXISTS idx_daily_practices_date ON daily_practices(practice_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
