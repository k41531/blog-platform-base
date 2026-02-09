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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">記事を編集</h1>
      <PostEditor mode="edit" post={result.value} />
    </div>
  );
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground text-center py-12">
          読み込み中...
        </p>
      }
    >
      <EditPostContent params={params} />
    </Suspense>
  );
}
