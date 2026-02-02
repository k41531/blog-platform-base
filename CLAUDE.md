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

## PRテンプレート

- 変更の概要
- テスト方法
- スクリーンショット（UI変更時）
