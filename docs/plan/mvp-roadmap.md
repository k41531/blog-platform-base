# MVP開発ロードマップ

## ゴール

「記事の作成・公開・閲覧ができる最小限のブログプラットフォーム」を動かす。

### MVP完了の定義

- [ ] ユーザーがサインアップ・ログインできる
- [ ] ログイン後、記事を作成（Markdown）できる
- [ ] 記事を下書き保存・公開できる
- [ ] 公開記事の一覧ページがある
- [ ] 個別記事を閲覧できる（未認証でも可）
- [ ] 記事にいいねできる
- [ ] プロフィールを編集できる
- [ ] 型チェック・lint・テスト全パス
- [ ] Vercelにデプロイ可能

### MVPに含めないもの（後回し）

- リッチテキストエディタ（Markdownのみ）
- AllowedDomain（メールドメイン制限）
- 検索機能
- タグ・カテゴリ
- コメント機能
- OGP画像生成
- 管理者ダッシュボード

---

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────┐
│  UI層（App Router Pages + Components）           │
│  app/(public)/ ─ 公開ページ（記事一覧・詳細）     │
│  app/(dashboard)/ ─ 認証必須（記事管理・設定）    │
├─────────────────────────────────────────────────┤
│  Application層（Server Actions）                 │
│  lib/actions/ ─ ユースケース実行                  │
├─────────────────────────────────────────────────┤
│  Domain層（既存）                                │
│  lib/domain/ ─ ビジネスルール                     │
├─────────────────────────────────────────────────┤
│  Infrastructure層（Repository）                  │
│  lib/repositories/ ─ Supabase CRUD               │
├─────────────────────────────────────────────────┤
│  Database（Supabase）                            │
│  supabase/migrations/ ─ スキーマ + RLS            │
└─────────────────────────────────────────────────┘
```

---

## フェーズ構成

全体を4フェーズに分割。各フェーズ内で並列実行可能なタスクを明示する。

---

## Phase 1: データベース基盤（所要: 1セッション）

**ブランチ:** `feat/database-schema`

このフェーズは全体の基盤のため、**直列で最初に完了させる**。

### 1-1. Supabase マイグレーション作成

テーブル定義（4テーブル）:

| テーブル | 主要カラム |
|---------|-----------|
| `profiles` | id (=auth.uid), email, display_name, avatar_url, bio |
| `posts` | id, author_id → profiles, title, slug (unique), content, editor_type, status, published_at |
| `likes` | user_id → profiles, post_id → posts, (複合PK) |
| `allowed_domains` | domain, is_active（MVP後） |

- `updated_at` トリガー（自動更新）
- `profiles` の自動作成トリガー（Auth signup時）

### 1-2. RLSポリシー

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| profiles | 全員 | Auth trigger | 本人のみ | - |
| posts | published: 全員, draft: 著者のみ | 認証ユーザー | 著者のみ | 著者のみ |
| likes | 全員 | 認証ユーザー | - | 本人のみ |

### 1-3. 検証

- マイグレーション適用確認
- RLSポリシーのテスト（SQL）

### Phase 1 完了条件

- `supabase/migrations/` にSQLファイル
- テーブル作成・RLS有効化を確認
- → **ここでチェックポイント。ユーザー確認後、Phase 2へ。**

---

## Phase 2: Repository + Server Actions（所要: 2-3並列セッション）

**目的:** ドメインモデルとDBをつなぎ、UIから呼べるAPIを作る。

### 並列化マップ

```
セッション A                  セッション B                  セッション C
─────────────               ─────────────               ─────────────
feat/repo-post              feat/repo-profile           feat/repo-like

Repository:                 Repository:                 Repository:
 post-repository.ts          profile-repository.ts       like-repository.ts

Server Actions:             Server Actions:             Server Actions:
 post-actions.ts             profile-actions.ts          like-actions.ts

テスト:                      テスト:                      テスト:
 post-actions.test.ts        profile-actions.test.ts     like-actions.test.ts
```

### セッション A: Post（記事）

**ブランチ:** `feat/repo-post`
**担当ファイル:**

```
lib/repositories/post-repository.ts    # Supabase CRUD
lib/actions/post-actions.ts            # Server Actions
lib/actions/post-actions.test.ts       # テスト
```

**実装するアクション:**
- `createDraftPost(formData)` - 下書き作成
- `updatePost(postId, formData)` - 記事更新
- `publishPost(postId)` - 公開
- `unpublishPost(postId)` - 非公開に戻す
- `deletePost(postId)` - 削除
- `getPost(slug)` - slug で記事取得
- `getPublishedPosts()` - 公開記事一覧
- `getMyPosts()` - 自分の記事一覧

### セッション B: Profile（プロフィール）

**ブランチ:** `feat/repo-profile`
**担当ファイル:**

```
lib/repositories/profile-repository.ts
lib/actions/profile-actions.ts
lib/actions/profile-actions.test.ts
```

**実装するアクション:**
- `getProfile(userId)` - プロフィール取得
- `getMyProfile()` - 自分のプロフィール
- `updateProfile(formData)` - プロフィール更新

### セッション C: Like（いいね）

**ブランチ:** `feat/repo-like`
**担当ファイル:**

```
lib/repositories/like-repository.ts
lib/actions/like-actions.ts
lib/actions/like-actions.test.ts
```

**実装するアクション:**
- `toggleLike(postId)` - いいね追加/削除
- `getLikeCount(postId)` - いいね数取得
- `hasLiked(postId)` - いいね済みか判定

### Phase 2 完了条件

- 3ブランチを `develop` にマージ
- 全 Server Actions が動作
- テスト全パス
- → **チェックポイント。ユーザー確認後、Phase 3へ。**

---

## Phase 3: UI実装（所要: 2-3並列セッション）

**目的:** ページとコンポーネントを構築し、ブログとして使えるようにする。

### ルーティング設計

```
app/
├── (public)/                        # 未認証でもアクセス可
│   ├── page.tsx                     # 公開記事一覧（トップページ）
│   └── posts/[slug]/page.tsx        # 記事詳細
├── (dashboard)/                     # 認証必須
│   ├── layout.tsx                   # ダッシュボードレイアウト
│   ├── posts/page.tsx               # 自分の記事一覧
│   ├── posts/new/page.tsx           # 記事作成
│   ├── posts/[id]/edit/page.tsx     # 記事編集
│   └── settings/page.tsx            # プロフィール設定
└── auth/                            # 認証（既存）
    ├── login/
    └── sign-up/
```

### 並列化マップ

```
セッション A                  セッション B                  セッション C
─────────────               ─────────────               ─────────────
feat/ui-public              feat/ui-editor              feat/ui-dashboard

公開ページ:                  記事エディタ:                ダッシュボード:
 記事一覧                     Markdown入力                 自分の記事管理
 記事詳細                     プレビュー                   プロフィール設定
 いいねボタン                 下書き保存/公開               ナビゲーション
```

### セッション A: 公開ページ

**ブランチ:** `feat/ui-public`
**担当ファイル:**

```
app/(public)/page.tsx                          # 記事一覧
app/(public)/posts/[slug]/page.tsx             # 記事詳細
components/features/post/post-card.tsx          # 記事カード
components/features/post/post-content.tsx       # 記事本文表示
components/features/like/like-button.tsx        # いいねボタン（Client Component）
```

**機能:**
- 公開記事の一覧表示（カード形式）
- 記事詳細ページ（Markdown→HTML表示）
- いいねボタン（トグル、カウント表示）
- レスポンシブデザイン

### セッション B: 記事エディタ

**ブランチ:** `feat/ui-editor`
**担当ファイル:**

```
app/(dashboard)/posts/new/page.tsx
app/(dashboard)/posts/[id]/edit/page.tsx
components/features/editor/post-editor.tsx      # エディタ本体（Client Component）
components/features/editor/markdown-preview.tsx  # プレビュー
```

**機能:**
- タイトル入力
- Markdownテキストエリア
- リアルタイムプレビュー（split view）
- 下書き保存ボタン / 公開ボタン
- 編集時の既存データ読み込み

### セッション C: ダッシュボード

**ブランチ:** `feat/ui-dashboard`
**担当ファイル:**

```
app/(dashboard)/layout.tsx
app/(dashboard)/posts/page.tsx
app/(dashboard)/settings/page.tsx
components/features/dashboard/nav.tsx
components/features/profile/profile-form.tsx    # Client Component
```

**機能:**
- ダッシュボードレイアウト（サイドナビ）
- 自分の記事一覧（draft/published フィルタ）
- 記事の削除・公開/非公開トグル
- プロフィール編集フォーム

### Phase 3 完了条件

- 3ブランチを `develop` にマージ
- 全ページが動作
- レスポンシブ対応
- → **チェックポイント。ユーザー確認後、Phase 4へ。**

---

## Phase 4: 統合・仕上げ（所要: 1-2セッション）

**ブランチ:** `feat/integration`

### 4-1. 認証フロー統合

- ログイン後のリダイレクト先をダッシュボードに
- 未認証でのダッシュボードアクセスをリダイレクト
- Middleware でルート保護

### 4-2. レイアウト統合

- グローバルヘッダー（ロゴ、ログイン/ログアウト、ダッシュボードへのリンク）
- フッター

### 4-3. 最終検証

```bash
pnpm tsc --noEmit    # 型チェック
pnpm lint            # リント
pnpm test:run        # テスト
pnpm build           # プロダクションビルド
```

### 4-4. デプロイ

- Vercel にデプロイ
- 環境変数の設定（Supabase URL, Keys）
- 動作確認

### Phase 4 完了条件

- `develop` → `main` へマージ
- Vercel デプロイ成功
- MVP定義の全チェックボックスを達成

---

## 並列セッション運用ガイド

### セッション開始テンプレート

各ターミナルで Claude Code を起動する際、以下のコンテキストを伝える：

```
現在のフェーズ: Phase X
このセッションの担当: [ブランチ名]
担当ファイル: [ファイルリスト]
他セッションの担当: [他のブランチ名]

⚠ 以下のファイルは他セッションが編集中なので触らないでください:
[ファイルリスト]
```

### ブランチ戦略

```
main
 └── develop
      ├── feat/database-schema     ← Phase 1
      ├── feat/repo-post           ← Phase 2 (並列)
      ├── feat/repo-profile        ← Phase 2 (並列)
      ├── feat/repo-like           ← Phase 2 (並列)
      ├── feat/ui-public           ← Phase 3 (並列)
      ├── feat/ui-editor           ← Phase 3 (並列)
      ├── feat/ui-dashboard        ← Phase 3 (並列)
      └── feat/integration         ← Phase 4
```

### コンフリクト回避ルール

1. **ファイルの所有権を明確にする** - 各セッションが編集するファイルを事前に決める
2. **共有ファイルは最初のセッションのみ編集** - `lib/shared/` 等の共通部分
3. **マージ順序を決める** - Phase 2 は A → B → C の順でマージ
4. **マージ前にリベース** - `git rebase develop` でコンフリクトを解消

---

## 依存関係の全体図

```
Phase 1: DB基盤
    │
    ▼
Phase 2: Repository + Actions ──────────────────┐
    │          │          │                      │
    │  Post    │ Profile  │  Like                │ 並列実行可
    │          │          │                      │
    ▼──────────▼──────────▼──────────────────────┘
    │
Phase 3: UI実装 ────────────────────────────────┐
    │          │          │                      │
    │  Public  │ Editor   │  Dashboard           │ 並列実行可
    │          │          │                      │
    ▼──────────▼──────────▼──────────────────────┘
    │
Phase 4: 統合・デプロイ
```

---

## 見積もり

| フェーズ | セッション数 | 並列度 |
|---------|------------|-------|
| Phase 1 | 1 | 直列 |
| Phase 2 | 3 | 最大3並列 |
| Phase 3 | 3 | 最大3並列 |
| Phase 4 | 1-2 | 直列 |

**合計: 8-9セッション分の作業を、並列化で4ステップに圧縮**
