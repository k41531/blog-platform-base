---
description: 機能実装の標準フロー
---

## Feature: $ARGUMENTS

### Step 1: Sprint Contract 生成
1. sprint-contract agent を起動し、要件から Contract を生成
2. `.claude/contracts/{feature-name}.md` に出力
3. ユーザーに Contract を提示して承認を得る
4. **承認されるまで Step 2 に進まない**

### Step 2: 設計（コードを書かない）
1. CLAUDE.md でプロジェクトコンテキストを確認
2. Contract の Deliverables に沿って影響ファイルを特定
3. 既存の関数・型で再利用できるものを確認
4. インターフェースを設計（型、関数シグネチャ）
5. 設計をレビュー用に提示

### Step 3: 実装（設計承認後）
1. ドメインモデル + ユニットテストを作成
2. Repository を実装（DB操作）
3. マイグレーション作成（DB変更がある場合）
4. Server Actions を実装（ユースケース）
5. UIコンポーネントを作成

### Step 4: 決定論的ゲート
以下を実行し、全て通過するまで修正を繰り返す（最大3回）:
```bash
pnpm check:all
```

### Step 5: LLM 評価（並列）
1. code-reviewer agent でアーキテクチャ・規約チェック
2. rls-validator agent でRLSセキュリティ検証（DB変更がある場合のみ）
3. 指摘が CRITICAL/ERROR の場合は修正して Step 4 に戻る

### Step 6: UI 検証（devサーバー起動中のみ）
1. ui-evaluator agent で Contract の Verification Steps を実行
2. FAIL がある場合は修正して Step 4 に戻る

### Step 7: 完了
1. Contract の Acceptance Criteria を最終確認
2. ユーザーにコミットの可否を確認
