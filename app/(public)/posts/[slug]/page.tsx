import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";

import { getPost } from "@/lib/actions/post-actions";
import { getLikeCount, hasLiked } from "@/lib/actions/like-actions";
import { formatDate } from "@/lib/utils";
import { PostContent } from "@/components/features/post/post-content";
import { LikeButton } from "@/components/features/like/like-button";

type Props = {
  params: Promise<{ slug: string }>;
};

async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const result = await getPost(slug);

  if (!result.ok) {
    notFound();
  }

  const post = result.value;

  const [likeCountResult, hasLikedResult] = await Promise.all([
    getLikeCount(post.id),
    hasLiked(post.id),
  ]);

  const likeCount = likeCountResult.ok ? likeCountResult.value : 0;
  const liked = hasLikedResult.ok ? hasLikedResult.value : false;

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        記事一覧に戻る
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
      </header>

      <div className="mb-8">
        <PostContent content={post.content} />
      </div>

      <div className="border-t pt-4">
        <LikeButton
          postId={post.id}
          initialLiked={liked}
          initialCount={likeCount}
        />
      </div>
    </article>
  );
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground text-center py-12">
          読み込み中...
        </p>
      }
    >
      <PostDetail params={params} />
    </Suspense>
  );
}
