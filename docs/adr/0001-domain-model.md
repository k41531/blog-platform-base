# ADR-0001: ドメインモデル設計

## ステータス

承認

## 日付

- 作成日: 2025-02-04
- 最終更新: 2025-02-04

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-02-04 | 初版作成 |

## コンテキスト

ブログプラットフォームのMVP開発にあたり、ドメインモデルを設計する必要がある。
以下の要件を満たす必要がある：

- ユーザーは記事を作成・編集・公開できる
- ユーザーは他のユーザーの記事にいいねできる
- 許可されたドメインのメールアドレスを持つユーザーのみ登録可能

## 決定

以下の3つの集約（Aggregate）を定義する：

### 1. Profile 集約
ユーザー情報を管理する集約。

```
Profile {
  id: string (UUID)
  email: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}
```

### 2. Post 集約
記事とそのライフサイクルを管理する集約。

```
Post {
  id: string (UUID)
  authorId: string
  title: string
  slug: string
  content: string
  editorType: 'markdown' | 'richtext'
  status: 'draft' | 'published'
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

### 3. Like 関係
Profile と Post を結ぶ多対多の関係。

```
Like {
  userId: string
  postId: string
  createdAt: Date
}
```

### 4. AllowedDomain 値オブジェクト
許可されたメールドメインを管理。

```
AllowedDomain {
  domain: string
  isActive: boolean
}
```

## 理由

1. **集約の境界**: Post は独立したライフサイクルを持つため、Profile とは別の集約とした
2. **Like の設計**: 単純な関係テーブルとし、独自の振る舞いは最小限に留めた
3. **editorType**: 将来的なリッチテキストエディタ対応を見据えて定義
4. **status の2値設計**: MVP では draft/published の2状態で十分と判断

## 結果

### ポジティブな影響

- シンプルで理解しやすいモデル
- 集約の境界が明確で、スケーラビリティを確保しやすい
- テスト可能な純粋なドメインロジックを実現できる

### ネガティブな影響

- 将来的に「下書き→レビュー中→公開」のワークフローが必要になった場合、status の拡張が必要
- コメント機能は本モデルに含まれていないため、追加時に設計変更が必要

## 参考

- Eric Evans "Domain-Driven Design"
- John Ousterhout "A Philosophy of Software Design"
