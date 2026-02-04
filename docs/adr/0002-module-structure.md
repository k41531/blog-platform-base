# ADR-0002: モジュール構造（深いモジュール設計）

## ステータス

承認

## 日付

- 作成日: 2025-02-04
- 最終更新: 2025-02-04

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-02-04 | 初版作成 |
| 2025-02-04 | Next.jsテンプレートに合わせて構造を修正 |

## コンテキスト

ドメインモデルを実装するにあたり、コードの構造を決定する必要がある。
以下の目標を達成したい：

- ドメインロジックを外部依存（Supabase）から分離
- テスト容易性の確保
- 将来的な変更に強い設計

## 決定

「A Philosophy of Software Design」の深いモジュール設計に従い、以下の構造を採用する：

```
lib/
├── domain/           # ドメイン層
├── supabase/         # Supabase クライアント（Next.jsテンプレート由来）
└── shared/           # 共有ユーティリティ
```

※ `application/` 層は、ユースケースが複雑化した際に追加を検討する。

### 各層の責務

#### Domain 層（ドメイン層）
- 純粋なビジネスロジック
- 外部依存なし（Supabase 等のインフラに依存しない）
- エンティティ、値オブジェクト、ドメインサービス

```typescript
// lib/domain/post/post.ts
export function createPost(input: CreatePostInput): Result<Post, PostError>
export function publishPost(post: Post): Result<Post, PostError>
```

#### Supabase 層（インフラ層）
- Next.js + Supabase テンプレートで生成されたクライアント
- サーバー用・クライアント用の createClient()
- 将来的に Repository パターンを導入する場合はここに実装

```typescript
// lib/supabase/server.ts
export async function createClient(): Promise<SupabaseClient>

// lib/supabase/client.ts
export function createClient(): SupabaseClient
```

#### Shared 層（共有ユーティリティ）
- 全層で使用するユーティリティ
- Result 型
- slug 生成等のヘルパー

## 理由

1. **深いモジュール**: 各層は単純なインターフェースで複雑性を隠蔽
2. **テスト容易性**: ドメイン層は外部依存なしでユニットテスト可能
3. **依存性の方向**: 外側（UI）→ 内側（Domain）への一方向依存
4. **変更の局所化**: Supabase の変更は `lib/supabase/` 内に閉じ込める
5. **テンプレート活用**: Next.js + Supabase テンプレートの構造を尊重し、学習コストを下げる

## 結果

### ポジティブな影響

- ドメインロジックの純粋なユニットテストが可能
- Supabase から他のDBへの移行が容易
- 各層の責務が明確で、認知負荷が低い

### ネガティブな影響

- 小規模な変更でも複数層にまたがる場合がある
- ユースケースが複雑化した際に application 層の追加判断が必要

## 参考

- John Ousterhout "A Philosophy of Software Design" - Deep Modules
- Robert C. Martin "Clean Architecture"
