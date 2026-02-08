---
description: 検証と修正の実行
---

1. 全チェックを実行:
$(pnpm tsc --noEmit)
$(pnpm lint)
$(pnpm test:run 2>/dev/null || echo "テストなし")

2. 失敗があれば分析して修正
3. 全チェックが通るまで繰り返す
4. 修正内容のサマリーを報告
