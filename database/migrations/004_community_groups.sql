-- 4. COMMUNITY GROUPS
CREATE TABLE IF NOT EXISTS community_groups (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  privacy VARCHAR(50) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default groups
INSERT INTO community_groups (id, name, description, privacy) VALUES
  ('g1', 'Nhóm Thiền Tập & Chánh Niệm Mỗi Ngày', 'Cùng nhau duy trì thời khóa tọa thiền 15-30 phút mỗi ngày, chia sẻ kinh nghiệm vượt qua hôn trầm và vọng tưởng.', 'public'),
  ('g2', 'Phật Tử Tại Gia — Học Giáo Lý Căn Bản', 'Không gian hỏi đáp giáo lý Tứ Diệu Đế, Bát Chánh Đạo, Nhân Quả và thực hành Năm Giới trong đời sống gia đình.', 'moderated'),
  ('g3', 'Thiện Nguyện Ánh Từ Bi', 'Kết nối những tấm lòng thiện nguyện, tổ chức các chuyến cứu trợ đồng bào khó khăn và chia sẻ yêu thương.', 'public')
ON CONFLICT (id) DO NOTHING;

-- 5. GROUP MEMBERSHIPS
CREATE TABLE IF NOT EXISTS group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id VARCHAR(20) NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

-- 6. GROUP MESSAGES
CREATE TABLE IF NOT EXISTS group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id VARCHAR(20) NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user ON group_memberships(user_id);
