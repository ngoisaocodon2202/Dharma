-- MIGRATION 003: PRACTICE HISTORY & LEARNING PATH PROGRESS

-- User practice completion history (replaces localStorage-only approach)
CREATE TABLE IF NOT EXISTS user_practice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_id UUID NOT NULL REFERENCES daily_practices(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, practice_id)
);

CREATE INDEX IF NOT EXISTS idx_practice_history_user ON user_practice_history(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_history_practice ON user_practice_history(practice_id);

-- User learning path progress
CREATE TABLE IF NOT EXISTS user_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, path_id)
);

-- User module completion within a learning path
CREATE TABLE IF NOT EXISTS user_module_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_path_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_path_progress_user ON user_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_user ON user_module_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_module ON user_module_completions(module_id);
