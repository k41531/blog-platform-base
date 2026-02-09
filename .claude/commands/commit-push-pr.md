---
description: コミット、プッシュ、PR作成を一括実行
---

# コミット・プッシュ・PR 一括実行

以下の手順を実行してください：

## 1. 変更状況の確認

```bash
git status
git diff --stat
```

## 2. コミットメッセージの生成

変更内容を分析し、以下の形式でコミットメッセージを生成：

- `feat:` 新機能
- `fix:` バグ修正
- `refactor:` リファクタリング
- `docs:` ドキュメント
- `style:` フォーマット・スタイル
- `test:` テスト追加・修正
- `chore:` ビルド・設定変更

## 3. コミット実行

```bash
git add .
git commit -m "<生成したメッセージ>"
```

## 4. プッシュ

```bash
git push origin HEAD
```

## 5. PR作成または確認

PRが未作成の場合：
```bash
gh pr create --fill
```

既存PRがある場合：
```bash
gh pr view
```
