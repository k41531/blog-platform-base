import Link from "next/link";
import { Suspense } from "react";
import { FilePlus } from "lucide-react";
import { connection } from "next/server";

import { getMyPosts } from "@/lib/actions/post-actions";
import { PostListItem } from "@/components/features/dashboard/post-list-item";

async function PostListContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const result = await getMyPosts();

  if (!result.ok) {
    return (
      <div className="empty-state">
        <h3>読み込みエラー</h3>
        <p>記事の取得に失敗しました。</p>
      </div>
    );
  }

  const allPosts = result.value;
  const filter = params.status ?? "all";
  const counts = {
    all: allPosts.length,
    draft: allPosts.filter((p) => p.status === "draft").length,
    published: allPosts.filter((p) => p.status === "published").length,
  };
  const posts =
    filter === "all"
      ? allPosts
      : allPosts.filter((p) => p.status === filter);

  const tabs = [
    { value: "all", label: "すべて", count: counts.all },
    { value: "draft", label: "下書き", count: counts.draft },
    { value: "published", label: "公開済み", count: counts.published },
  ];

  return (
    <>
      <div className="tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "all"
                ? "/dashboard/posts"
                : `/dashboard/posts?status=${tab.value}`
            }
            className={`tab ${filter === tab.value ? "is-active" : ""}`}
          >
            {tab.label}
            <span className="count">{tab.count}</span>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>
            {filter === "all"
              ? "まだ記事がありません"
              : filter === "draft"
                ? "下書きの記事がありません"
                : "公開済みの記事がありません"}
          </h3>
          {filter === "all" && (
            <p>
              <Link
                href="/dashboard/posts/new"
                className="btn-haruni btn-haruni-primary"
                style={{ marginTop: 16 }}
              >
                <FilePlus size={14} />
                最初の記事を書く
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <div className="fade-in">
      <div className="db-main-header">
        <div>
          <span className="en-label">MY POSTS</span>
          <h1 className="db-main-title">マイ記事</h1>
        </div>
        <Link href="/dashboard/posts/new" className="btn-pop">
          <FilePlus size={14} />
          新規作成
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="empty-state">
            <p>読み込み中…</p>
          </div>
        }
      >
        <PostListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
