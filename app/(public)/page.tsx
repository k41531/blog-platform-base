import { Suspense } from "react";

import { getPublishedPosts } from "@/lib/actions/post-actions";
import { PostCard } from "@/components/features/post/post-card";

async function PostList() {
  const result = await getPublishedPosts();

  if (!result.ok) {
    return (
      <div className="empty-state">
        <h3>読み込みエラー</h3>
        <p>記事の取得に失敗しました。</p>
      </div>
    );
  }

  const posts = result.value;

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h3>まだ記事がありません</h3>
        <p>最初の一本を書いてみませんか？</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="fade-in">
      <section className="page-hero">
        <span className="en-label">POSTS</span>
        <h1 className="page-title">記事一覧</h1>
        <p className="page-subtitle">
          みんなで書く、社内ブログ。
          <br />
          開発Tipsや勉強会レポート、日々の気づきまで気軽に書き残せる場所です。
        </p>
      </section>

      <Suspense
        fallback={
          <div className="empty-state">
            <p>読み込み中…</p>
          </div>
        }
      >
        <PostList />
      </Suspense>
    </div>
  );
}
