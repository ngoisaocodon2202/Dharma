-- MIGRATION 005: CHAT PERSISTENCE, AI BOT USER, AND DIRECT CHAT
-- PostgreSQL 18 Compatible

-- 0. Ensure BOT role exists
INSERT INTO roles (id, name, description)
VALUES ('BOT', 'Trợ Lý AI', 'Hệ thống AI tự động trả lời Phật Pháp')
ON CONFLICT (id) DO NOTHING;

-- 1. Create or ensure AI Bot user exists in users and profiles
INSERT INTO users (id, email, password_hash, role_id, is_active, is_verified)
VALUES (
  '00000000-0000-0000-0000-000000000099',
  'ai@phatphap.vn',
  '$2a$10$X7vQ4z4B3C2D1E0F9G8H7I6J5K4L3M2N1O0P9Q8R7S6T5U4V3W2X1Y',
  'BOT',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (user_id, full_name, dharma_name, avatar_url, bio, is_public)
VALUES (
  '00000000-0000-0000-0000-000000000099',
  '🤖 phatphap.ai',
  'Trí Tuệ Nhân Tạo',
  '/ai-logo.png',
  'Trợ lý Phật Pháp thông thái, từ bi và nhẹ nhàng sẵn sàng giải đáp mọi thắc mắc tu học.',
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  avatar_url = EXCLUDED.avatar_url,
  full_name = EXCLUDED.full_name;

-- 2. Add AI Bot and active user to all community groups
INSERT INTO group_memberships (group_id, user_id)
SELECT g.id, '00000000-0000-0000-0000-000000000099'::uuid
FROM community_groups g
ON CONFLICT (group_id, user_id) DO NOTHING;

INSERT INTO group_memberships (group_id, user_id)
SELECT g.id, '3d56139e-928f-45bd-9917-43609442ce7c'::uuid
FROM community_groups g
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 3. Create direct_chat_messages table for storing 1-on-1 and AI chat history
CREATE TABLE IF NOT EXISTS direct_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' | 'assistant' | 'system'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_direct_chat_user ON direct_chat_messages(user_id, created_at ASC);

-- 4. Ensure group_messages has index for fast retrieval
CREATE INDEX IF NOT EXISTS idx_group_messages_lookup ON group_messages(group_id, created_at ASC);
