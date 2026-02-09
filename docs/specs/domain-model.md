# ドメインモデル仕様

## 概要

このドキュメントはブログプラットフォームのドメインモデル仕様を定義する。

## エンティティ

### Profile

ユーザープロファイル情報を表すエンティティ。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | UUID | Yes | 一意識別子（Supabase Auth の user.id と同一） |
| email | string | Yes | メールアドレス |
| displayName | string | Yes | 表示名（1-50文字） |
| avatarUrl | string | No | アバター画像URL |
| bio | string | No | 自己紹介（最大500文字） |
| createdAt | Date | Yes | 作成日時 |
| updatedAt | Date | Yes | 更新日時 |

#### バリデーションルール

- `displayName`: 1文字以上50文字以下
- `bio`: 500文字以下
- `avatarUrl`: 有効なURL形式（設定されている場合）

---

### Post

ブログ記事を表すエンティティ。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | UUID | Yes | 一意識別子 |
| authorId | UUID | Yes | 著者のProfile ID |
| title | string | Yes | タイトル（1-100文字） |
| slug | string | Yes | URLスラグ（一意） |
| content | string | Yes | 本文 |
| editorType | enum | Yes | 'markdown' \| 'richtext' |
| status | enum | Yes | 'draft' \| 'published' |
| publishedAt | Date | No | 公開日時（status が published の場合のみ） |
| createdAt | Date | Yes | 作成日時 |
| updatedAt | Date | Yes | 更新日時 |

#### バリデーションルール

- `title`: 1文字以上100文字以下
- `slug`: 1文字以上100文字以下、英数字・ハイフンのみ、一意
- `content`: 1文字以上
- `status` が `published` の場合、`publishedAt` は必須

#### ライフサイクル

```
[作成] → draft → [公開] → published
                    ↓
              [非公開に戻す]
                    ↓
                  draft
```

---

### Like

ユーザーの記事へのいいねを表す関係。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| userId | UUID | Yes | いいねしたユーザーの ID |
| postId | UUID | Yes | いいねされた記事の ID |
| createdAt | Date | Yes | いいねした日時 |

#### 制約

- 同一ユーザーは同一記事に1回のみいいね可能（userId, postId の複合一意）
- 公開済み記事のみいいね可能

---

## 値オブジェクト

### AllowedDomain

許可されたメールドメインを表す値オブジェクト。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| domain | string | Yes | ドメイン名（例: "example.com"） |
| isActive | boolean | Yes | 有効フラグ |

---

## ドメインサービス

### SlugGenerator

記事タイトルからURLスラグを生成する。

```typescript
generateSlug(title: string): string
```

- 日本語は romanization（ローマ字変換）
- スペースはハイフンに変換
- 特殊文字は除去
- 小文字に統一

---

## 集約の境界

### Profile 集約

- ルート: Profile
- 含まれるもの: Profile エンティティのみ

### Post 集約

- ルート: Post
- 含まれるもの: Post エンティティのみ
- Like は Post 集約の外部（別途参照）

---

## ドメインイベント（将来拡張用）

- `PostPublished`: 記事が公開されたとき
- `PostLiked`: 記事がいいねされたとき
- `ProfileCreated`: プロファイルが作成されたとき
