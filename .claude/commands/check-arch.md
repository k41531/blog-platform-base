---
description: アーキテクチャ境界チェックを実行し、違反があれば修正
---

# アーキテクチャ境界チェック

以下を実行してください:

```bash
pnpm check:arch
pnpm check:no-enum
```

## 違反があった場合

1. 違反内容を分析
2. CLAUDE.md のレイヤー依存ルールに従って修正:
   - domain/ → shared/ のみ許可
   - repositories/ → domain/, shared/, supabase/server のみ許可
   - actions/ → domain/, repositories/, shared/, supabase/server のみ許可
3. 再度チェックを実行して通過を確認
