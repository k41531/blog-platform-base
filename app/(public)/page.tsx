import { Suspense } from "react";

import { getPublishedPosts } from "@/lib/actions/post-actions";
import { PostCard } from "@/components/features/post/post-card";

async function PostList() {
  const result = await getPublishedPosts();

  if (!result.ok) {
    return (
      <p className="text-muted-foreground text-center py-12">
        記事の取得に失敗しました。
      </p>
    );
  }

  const posts = result.value;

  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        まだ記事がありません。
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <Suspense
        fallback={
          <p className="text-muted-foreground text-center py-12">
            読み込み中...
          </p>
        }
      >
        <PostList />
      </Suspense>
    </div>
  );
}
