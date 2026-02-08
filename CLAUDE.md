# Blog Platform - CLAUDE.md

## プロジェクト概要

Next.js + Supabase のブログプラットフォーム

## 技術スタック

- Next.js 15+ (App Router)
- React 19
- TypeScript (strict mode)
- Supabase (認証・データベース)
- shadcn/ui + Tailwind CSS
- pnpm

## コマンド

- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm lint` - ESLint実行
- `pnpm tsc --noEmit` - 型チェック

## コーディング規約

### ファイル命名

- コンポーネント: kebab-case (例: auth-button.tsx)
- 型定義: types.ts または [feature].types.ts

### コンポーネント設計

- Server Components をデフォルトで使用
- 'use client' は最小限の境界で使用
- Suspense で非同期コンポーネントをラップ

### Supabase パターン

- サーバー側: lib/supabase/server.ts の createClient()
- クライアント側: lib/supabase/client.ts の createClient()

### インポート順序

1. React/Next.js
2. 外部ライブラリ
3. @/ エイリアスのインポート
4. 相対インポート

## よくある間違い

- ESLint 9 (Flat Config) で `.next` ディレクトリを除外するには `ignores: [".next/**"]` を設定に追加する

## タスク分割ルール

### 1タスクの最大スコープ
- 新規ファイル作成: 最大3-5ファイル
- 既存ファイル編集: 最大5-7ファイル
- 1つの論理的な変更単位（1機能、1バグ修正など）

### フェーズ分割が必要なケース
以下の場合は、最初にフェーズを提案し、1フェーズずつ進める：
- 複数の独立した機能を含む
- 新しいアーキテクチャ層の追加
- 5ファイル以上の変更が見込まれる
- 複数のコミットに分割する

### チェックポイント
- 各フェーズ完了時は必ずユーザーに確認を取る
- 「次のフェーズに進みますか？」と明示的に聞く
- 勝手に次のフェーズに進まない

## 作業スタイル

### 開始前の確認事項
抽象的な指示（「〜を実装して」「〜を作って」）を受けた場合：
1. 具体的なスコープを確認（何を含み、何を含まないか）
2. 優先順位を確認（今回のセッションで何を達成したいか）
3. 完了の定義を確認（何ができたら完了か）

### 進め方
1. 小さく始める: まず最小限の動くものを作る
2. 段階的に拡張: 動作確認しながら機能を追加
3. こまめに確認: 大きな変更の前には確認を取る

### 確認すべきタイミング
- 新しいディレクトリ構造を作成する前
- 新しい依存関係を追加する前
- 設計判断が必要な場面
- フェーズの区切り

## ディレクトリ構造

```
app/                     # Next.js App Router
lib/
├── domain/              # ドメイン層（純粋なビジネスロジック）
│   ├── post/            #   記事ドメイン
│   ├── profile/         #   プロフィールドメイン
│   ├── like/            #   いいねドメイン
│   └── allowed-domain/  #   許可ドメイン
├── repositories/        # Repository層（Supabase CRUD）
├── actions/             # Server Actions（ユースケース実行）
│   └── types.ts         #   ActionError型、認証ヘルパー
├── shared/              # 共有ユーティリティ（Result型）
└── supabase/            # Supabase クライアント
supabase/
└── migrations/          # SQLマイグレーション
```

## Learned Patterns

### Do's

- **pnpm dlx supabase**: pnpm で Supabase CLI を使う場合は `pnpm dlx supabase` を使う（`pnpm add -D supabase` はビルドスクリプト問題あり）
- **Repository層の変換ヘルパー**: snake_case（DB）→ camelCase（ドメイン）変換は `toXxx()` / `toRow()` ヘルパーで明示的に行う
- **ActionError型の共通化**: `lib/actions/types.ts` に ActionError 型と認証ヘルパーを集約し、全 Server Actions で共有
- **Server Actions の一貫パターン**: `"use server"` → 認証チェック → ドメインバリデーション → Repository操作 → `revalidatePath` の順序を守る
- **ドメインモデルのTDD**: ドメイン層は純粋関数で構成し、テストファーストで実装する
- **Result型**: `lib/shared/result.ts` の Result<T, E> 型でドメインエラーを型安全に扱う

### Don'ts

- **enumを使わない**: TypeScript の `enum` は使わず、string literal union を使う
- **クライアントにservice_role keyを露出しない**: サーバー側のみで使う
- **Server Actionsでバリデーションを省略しない**: 入力は必ずドメイン層のバリデーションを通す

## PRテンプレート

- 変更の概要
- テスト方法
- スクリーンショット（UI変更時）
