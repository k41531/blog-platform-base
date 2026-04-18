import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";

import { getPost } from "@/lib/actions/post-actions";
import { getLikeCount, hasLiked } from "@/lib/actions/like-actions";
import { getProfile } from "@/lib/actions/profile-actions";
import { formatDate } from "@/lib/utils";
import { PostContent } from "@/components/features/post/post-content";
import { LikeButton } from "@/components/features/like/like-button";
import { AuthorInfo } from "@/components/features/post/author-info";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDateEn(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const result = await getPost(slug);

  if (!result.ok) {
    notFound();
  }

  const post = result.value;

  const [likeCountResult, hasLikedResult, profileResult] = await Promise.all([
    getLikeCount(post.id),
    hasLiked(post.id),
    getProfile(post.authorId),
  ]);

  const likeCount = likeCountResult.ok ? likeCountResult.value : 0;
  const liked = hasLikedResult.ok ? hasLikedResult.value : false;
  if (!profileResult.ok) {
    console.error("Failed to load author profile", profileResult.error);
  }
  const authorProfile = profileResult.ok ? profileResult.value : null;

  return (
    <article className="fade-in app-container-narrow mx-auto pt-8">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        記事一覧に戻る
      </Link>

      <header className="post-header">
        <span className="en-label">POST</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4">
          {post.publishedAt && (
            <span className="post-meta">
              {formatDateEn(post.publishedAt)} ・ {formatDate(post.publishedAt)}
            </span>
          )}
        </div>
        {authorProfile && (
          <div className="mt-5">
            <AuthorInfo profile={authorProfile} />
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <PostContent content={post.content} />
      </div>

      <div className="post-actions">
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
        <div className="empty-state">
          <p>読み込み中…</p>
        </div>
      }
    >
      <PostDetail params={params} />
    </Suspense>
  );
}
