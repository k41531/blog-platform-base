-- ============================================================
-- 00002_create_rls_policies.sql
-- Row Level Security (RLS) ポリシー設定
-- ============================================================

-- ============================================================
-- 1. RLS 有効化
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_domains ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. profiles テーブルのポリシー
-- ============================================================

-- SELECT: 公開プロフィール - 誰でも閲覧可能
CREATE POLICY "profiles_select_public"
  ON profiles
  FOR SELECT
  USING (true);

-- UPDATE: 本人のみ編集可能
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT/DELETE は不要
-- INSERT: auth trigger で自動作成
-- DELETE: auth.users 削除時に CASCADE

-- ============================================================
-- 3. posts テーブルのポリシー
-- ============================================================

-- SELECT: published は全員閲覧可、draft は著者のみ
CREATE POLICY "posts_select_published_or_own"
  ON posts
  FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
  );

-- INSERT: 認証ユーザーのみ、自分の記事として作成
CREATE POLICY "posts_insert_own"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- UPDATE: 著者のみ
CREATE POLICY "posts_update_own"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- DELETE: 著者のみ
CREATE POLICY "posts_delete_own"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- ============================================================
-- 4. likes テーブルのポリシー
-- ============================================================

-- SELECT: いいね数は公開情報 - 誰でも閲覧可能
CREATE POLICY "likes_select_public"
  ON likes
  FOR SELECT
  USING (true);

-- INSERT: 認証ユーザーのみ、自分のいいねとして作成
CREATE POLICY "likes_insert_own"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 本人のみ取り消し可能
CREATE POLICY "likes_delete_own"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- UPDATE は不要（いいねは更新しない）

-- ============================================================
-- 5. allowed_domains テーブルのポリシー
-- ============================================================

-- SELECT: ドメイン制限チェック用に全員閲覧可能
CREATE POLICY "allowed_domains_select_public"
  ON allowed_domains
  FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: サービスロールのみ（管理者操作）
-- RLSが有効な状態でポリシーを作成しないことで、
-- anon/authenticated ロールからの変更を拒否する。
-- service_role は RLS をバイパスするため、管理操作は可能。
