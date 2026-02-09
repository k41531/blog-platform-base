-- ============================================================
-- Blog Platform: 初期テーブル定義
-- ============================================================

-- ------------------------------------------------------------
-- 共通: updated_at 自動更新トリガー関数
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles テーブル
-- ============================================================
CREATE TABLE profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT        NOT NULL,
  display_name TEXT        NOT NULL
    CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) BETWEEN 1 AND 50),
  avatar_url   TEXT,
  bio          TEXT
    CONSTRAINT profiles_bio_length CHECK (bio IS NULL OR char_length(bio) <= 500),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  profiles              IS 'ユーザープロファイル（auth.usersと1:1）';
COMMENT ON COLUMN profiles.id           IS 'auth.users.id と同一';
COMMENT ON COLUMN profiles.display_name IS '表示名（1-50文字）';
COMMENT ON COLUMN profiles.bio          IS '自己紹介（最大500文字）';

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. posts テーブル
-- ============================================================
CREATE TABLE posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL
    CONSTRAINT posts_title_length CHECK (char_length(title) BETWEEN 1 AND 100),
  slug         TEXT        NOT NULL UNIQUE
    CONSTRAINT posts_slug_length CHECK (char_length(slug) BETWEEN 1 AND 100),
  content      TEXT        NOT NULL
    CONSTRAINT posts_content_not_empty CHECK (char_length(content) >= 1),
  editor_type  TEXT        NOT NULL DEFAULT 'markdown'
    CONSTRAINT posts_editor_type_check CHECK (editor_type IN ('markdown', 'richtext')),
  status       TEXT        NOT NULL DEFAULT 'draft'
    CONSTRAINT posts_status_check CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  posts             IS 'ブログ記事';
COMMENT ON COLUMN posts.slug        IS 'URLスラグ（一意）';
COMMENT ON COLUMN posts.editor_type IS 'エディタ種別: markdown | richtext';
COMMENT ON COLUMN posts.status      IS '公開状態: draft | published';

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug      ON posts(slug);
CREATE INDEX idx_posts_status    ON posts(status);

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. likes テーブル
-- ============================================================
CREATE TABLE likes (
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id    UUID        NOT NULL REFERENCES posts(id)    ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE likes IS 'ユーザーの記事へのいいね（複合主キーで1ユーザー1記事1回）';

-- ============================================================
-- 4. allowed_domains テーブル（MVP後に利用）
-- ============================================================
CREATE TABLE allowed_domains (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  domain     TEXT        NOT NULL UNIQUE,
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  allowed_domains        IS '許可メールドメイン一覧';
COMMENT ON COLUMN allowed_domains.domain IS 'ドメイン名（例: example.com）';

-- ============================================================
-- 5. Auth signup 時に profile を自動作成するトリガー
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    coalesce(split_part(NEW.email, '@', 1), 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
