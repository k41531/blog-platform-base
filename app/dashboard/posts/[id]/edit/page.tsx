import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";

import { PostEditor } from "@/components/features/editor/post-editor";
import { getPostById } from "@/lib/actions/post-actions";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

async function EditPostContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const result = await getPostById(id);

  if (!result.ok) {
    notFound();
  }

  const post = result.value;
  const isPublished = post.status === "published";

  return (
    <div className="fade-in">
      <div className="db-main-header">
        <div>
          <span className="en-label">EDIT POST</span>
          <h1 className="db-main-title">記事を編集</h1>
        </div>
        <span
          className={`status-badge ${isPublished ? "is-public" : "is-draft"}`}
        >
          {isPublished ? "公開" : "下書き"}
        </span>
      </div>
      <PostEditor mode="edit" post={post} />
    </div>
  );
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <Suspense
      fallback={
        <div className="empty-state">
          <p>読み込み中…</p>
        </div>
      }
    >
      <EditPostContent params={params} />
    </Suspense>
  );
}
